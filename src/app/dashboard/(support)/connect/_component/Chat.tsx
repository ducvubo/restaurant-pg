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
  addDoc,
  writeBatch,
  QuerySnapshot,
} from "@/app/configs/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DocumentData } from "firebase/firestore";

// Định nghĩa type cho tin nhắn
interface Message {
  id: string;
  text: string;
  timestamp: any; // Firestore Timestamp, có thể thay bằng `firebase.firestore.Timestamp` nếu bạn sử dụng Firebase client SDK trực tiếp
  userType: "restaurant" | "customer";
  userId: string;
  isRead: boolean;
}

// Định nghĩa type cho props của component Chat
interface ChatProps {
  restaurantId: string;
  customerId: string;
  userType: "restaurant" | "customer";
}

const Chat = ({ restaurantId, customerId, userType }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [username, setUsername] = useState<string>(customerId);
  const chatRoomId = `${restaurantId}_${customerId}`;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userRef = doc(db, "users", customerId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data() as { username?: string };
          setUsername(userData.username || customerId);
        }
      } catch (error) {
        console.error(`Lỗi khi lấy username của ${customerId}:`, error);
      }
    };

    fetchUsername();
  }, [customerId]);

  useEffect(() => {
    const messagesRef = collection(db, "chats", chatRoomId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(fetchedMessages);
        const batch = writeBatch(db);
        fetchedMessages.forEach((msg) => {
          if (userType === "restaurant" && msg.userType === "customer" && !msg.isRead) {
            const msgRef = doc(db, "chats", chatRoomId, "messages", msg.id);
            batch.update(msgRef, { isRead: true });
          }
        });
        batch.commit().catch((error) => {
          console.error("Lỗi khi cập nhật trạng thái đã xem:", error);
        });
      },
      (error) => {
        console.error(`Lỗi khi lắng nghe tin nhắn của ${chatRoomId}:`, error);
      }
    );

    return () => unsubscribe();
  }, [chatRoomId, userType]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messagesRef = collection(db, "chats", chatRoomId, "messages");
      await addDoc(messagesRef, {
        text: newMessage,
        timestamp: new Date(),
        userType,
        userId: userType === "restaurant" ? restaurantId : customerId,
        isRead: false,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col px-2">
      <div className="flex items-center border-b border-gray-700 pb-4 mb-4">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src="https://github.com/shadcn.png" alt={username} />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-bold dark:text-white text-black">{username}</h2>
      </div>

      <ScrollArea className="flex-1 mb-4 p-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-4 ${msg.userType === userType ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${msg.userType === userType
                ? "bg-green-500 dark:bg-green-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                }`}
            >
              <p>{msg.text}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {msg.timestamp.toDate().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="dark:text-white text-black border-gray-700"
        />
        <Button onClick={handleSendMessage}>Gửi</Button>
      </div>
    </div>
  );
};

export default Chat;