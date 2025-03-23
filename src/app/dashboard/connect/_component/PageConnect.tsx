"use client";

import { useState, useEffect, useRef } from "react";
import {
  db,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
  writeBatch,
  QuerySnapshot,
} from "@/app/configs/firebase";
import Chat from "../_component/Chat";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DocumentData, where } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

// Định nghĩa type cho tin nhắn
interface Message {
  text: string;
  timestamp: any; // Firestore Timestamp
  userType: "restaurant" | "customer";
  userId: string;
  isRead: boolean;
}

// Định nghĩa type cho khách hàng
interface Customer {
  customerId: string;
  userId: string;
  username: string;
  unreadCount: number;
  latestMessage: Message | null;
  isUnreadFromCustomer: boolean;
}

const RestaurantDashboard = () => {
  const inforRestaurant = useSelector((state: RootState) => state.inforRestaurant);
  const inforEmployee = useSelector((state: RootState) => state.inforEmployee);
  const id = inforRestaurant._id ? inforRestaurant._id : inforEmployee.restaurant_id;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const customersRef = useRef<Customer[]>([]);
  const prevUnreadCountsRef = useRef<Record<string, number>>({});
  const unsubscribesRef = useRef<(() => void)[]>([]);
  const [newMessageAlert, setNewMessageAlert] = useState<string | null>(null);


  useEffect(() => {
    if (!id) {
      setError("Không tìm thấy ID nhà hàng!");
      setLoading(false);
      return;
    }

    const fetchCustomers = () => {
      const chatsRef = query(
        collection(db, "chats"),
        where("restaurantId", "==", id)
      );
      const unsubscribeChats = onSnapshot(
        chatsRef,
        (chatRoomsSnapshot: QuerySnapshot<DocumentData>) => {
          const allChatRooms = chatRoomsSnapshot.docs.map((doc) => doc.id);
          unsubscribesRef.current.forEach((unsubscribe) => unsubscribe());
          unsubscribesRef.current = [];

          if (allChatRooms.length === 0) {
            setError("Chưa có khách hàng nào nhắn tin.");
            setCustomers([]);
            customersRef.current = [];
            setLoading(false);
            return;
          }

          const customerMap = new Map<string, Customer>();

          allChatRooms.forEach((chatRoomId: string) => {
            const customerId = chatRoomId.replace(`${id}_`, "");
            customerMap.set(customerId, {
              customerId,
              userId: customerId,
              username: customerId,
              unreadCount: 0,
              latestMessage: null,
              isUnreadFromCustomer: false,
            });
          });

          const unsubscribesMessages = allChatRooms.map((chatRoomId: string) => {
            const customerId = chatRoomId.replace(`${id}_`, "");
            const messagesRef = collection(db, "chats", chatRoomId, "messages");
            const q = query(messagesRef, orderBy("timestamp", "asc"));

            return onSnapshot(
              q,
              async (messagesSnapshot: QuerySnapshot<DocumentData>) => {
                const messages = messagesSnapshot.docs.map((doc) => doc.data()) as Message[];
                const unreadCount = messages.filter(
                  (msg) => msg.userType === "customer" && msg.isRead === false
                ).length;

                const latestMessage =
                  messages.length > 0
                    ? messages.sort(
                      (a, b) => b.timestamp.toDate() - a.timestamp.toDate()
                    )[0]
                    : null;

                const isUnreadFromCustomer = latestMessage
                  ? latestMessage.userType === "customer" && !latestMessage.isRead
                  : false;

                const prevCount = prevUnreadCountsRef.current[customerId] || 0;
                if (prevCount < unreadCount) {
                  let username = customerId;
                  try {
                    const userRef = doc(db, "users", customerId);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                      const userData = userSnap.data() as { username?: string };
                      username = userData.username || customerId;
                    }
                  } catch (error) {
                    console.error(`Lỗi khi lấy username của ${customerId}:`, error);
                  }
                  setNewMessageAlert(`Có tin nhắn mới từ ${username}!`);
                  setTimeout(() => setNewMessageAlert(null), 5000);
                }

                if (prevUnreadCountsRef.current[customerId] !== unreadCount) {
                  prevUnreadCountsRef.current[customerId] = unreadCount;
                  // setPrevUnreadCounts((prev) => ({
                  //   ...prev,
                  //   [customerId]: unreadCount,
                  // }));
                }

                let username = customerId;
                try {
                  const userRef = doc(db, "users", customerId);
                  const userSnap = await getDoc(userRef);
                  if (userSnap.exists()) {
                    const userData = userSnap.data() as { username?: string };
                    username = userData.username || customerId;
                  }
                } catch (error) {
                  console.error(`Lỗi khi lấy username của ${customerId}:`, error);
                }

                // Cập nhật thông tin khách hàng trong customerMap
                customerMap.set(customerId, {
                  customerId,
                  userId: latestMessage?.userId || customerId,
                  username,
                  unreadCount,
                  latestMessage,
                  isUnreadFromCustomer,
                });

                // Tạo danh sách updatedCustomers từ customerMap
                const updatedCustomers = Array.from(customerMap.values());

                // So sánh và cập nhật customers
                if (
                  JSON.stringify(updatedCustomers) !==
                  JSON.stringify(customersRef.current)
                ) {
                  customersRef.current = updatedCustomers;
                  setCustomers(updatedCustomers);
                }

                setError(null);
                setLoading(false);
              },
              (error) => {
                console.error(`Lỗi khi lắng nghe tin nhắn của ${chatRoomId}:`, error);
              }
            );
          });

          unsubscribesRef.current = unsubscribesMessages;
        },
        (error) => {
          console.error("Lỗi khi lắng nghe danh sách chat rooms:", error);
          setError("Không thể tải danh sách khách hàng!");
          setLoading(false);
        }
      );

      return () => {
        unsubscribeChats();
        unsubscribesRef.current.forEach((unsubscribe) => unsubscribe());
      };
    };

    const unsubscribe = fetchCustomers();
    return () => unsubscribe();
  }, [id]);

  return (
    <div className="flex text-white" style={{ height: "calc(100vh - 5.5rem)" }}>
      <div className="w-1/3 border-r border-gray-700">
        {loading && <p className="text-gray-400">Đang tải...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && customers.length === 0 && !error && (
          <p className="text-gray-400">Chưa có khách hàng nào.</p>
        )}
        <ScrollArea className="h-[calc(100vh-150px)] p-2">
          <div className="space-y-4">
            {customers
              .sort((a, b) => {
                const timeA = a?.latestMessage?.timestamp?.toDate?.() || 0;
                const timeB = b?.latestMessage?.timestamp?.toDate?.() || 0;
                return timeB - timeA;
              })
              .map((customer) => (
                <div
                  key={customer.customerId} // Sử dụng customerId làm key để đảm bảo tính duy nhất
                  onClick={() => setSelectedCustomer(customer.customerId)}
                  className={`flex items-center p-3 rounded-md cursor-pointer ${selectedCustomer === customer.customerId
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-300 dark:hover:bg-gray-800"
                    } ${customer.isUnreadFromCustomer ? "font-bold" : ""} ${customer.isUnreadFromCustomer && selectedCustomer !== customer.customerId
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-900 dark:text-white"
                    }`}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src="https://github.com/shadcn.png" alt={customer.username} />
                    <AvatarFallback>{customer.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-semibold">{customer.username}</span>
                      {customer.latestMessage && (
                        <span className="text-xs text-gray-400">
                          {customer.latestMessage.timestamp.toDate().toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                    {customer.latestMessage ? (
                      <p className="text-sm text-gray-400 truncate">
                        {customer.latestMessage.text}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400">Chưa có tin nhắn</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </ScrollArea>
      </div>

      {selectedCustomer ? (
        <Chat restaurantId={id} customerId={selectedCustomer} userType="restaurant" />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Chọn một khách hàng để xem cuộc trò chuyện.</p>
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;