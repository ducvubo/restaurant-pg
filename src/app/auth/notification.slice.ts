import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface INotification {
  _id: string;
  noti_acc_id: string;
  noti_title: string;
  noti_content: string;
  noti_type: string;
  noti_metadata: string;
  createdAt: string;
  noti_is_read: boolean;
}

interface NotificationState {
  notifications: INotification[];
  totalNoti: number;
  unreadNoti: number;
}

const initialState: NotificationState = {
  notifications: [],
  totalNoti: 0,
  unreadNoti: 0,
};

const inforNotificationSlice = createSlice({
  name: 'inforNotification',
  initialState,
  reducers: {
    // Initialize notifications and counts from API
    startAppNotification: (
      state,
      action: PayloadAction<{
        notifications: INotification[];
        totalNoti: number;
        unreadNoti: number;
      }>
    ) => {
      state.notifications = action.payload.notifications;
      state.totalNoti = action.payload.totalNoti;
      state.unreadNoti = action.payload.unreadNoti;
    },
    // Add a single notification
    addNotification: (state, action: PayloadAction<INotification>) => {
      state.notifications.unshift(action.payload); // Add to start for newest first
      state.totalNoti += 1;
      if (!action.payload.noti_is_read) {
        state.unreadNoti += 1;
      }
    },
    // Append a list of notifications (for pagination)
    appendNotifications: (state, action: PayloadAction<INotification[]>) => {
      state.notifications = [...state.notifications, ...action.payload];
      // Counts are updated via API, not here
    },
    // Update counts from API
    updateNotificationCounts: (
      state,
      action: PayloadAction<{ totalNoti: number; unreadNoti: number }>
    ) => {
      state.totalNoti = action.payload.totalNoti;
      state.unreadNoti = action.payload.unreadNoti;
    },
    // Clear all notifications and reset counts
    endAppNotification: (state) => {
      state.notifications = [];
      state.totalNoti = 0;
      state.unreadNoti = 0;
    },
    // Mark a notification as read
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notiIndex = state.notifications.findIndex(
        (noti) => noti._id === action.payload
      );
      if (notiIndex !== -1 && !state.notifications[notiIndex].noti_is_read) {
        state.notifications[notiIndex].noti_is_read = true;
        state.unreadNoti = Math.max(0, state.unreadNoti - 1); // Ensure non-negative
      }
    },
    // Mark all notifications as read
    markAllNotificationsAsRead: (state) => {
      state.notifications = state.notifications.map((noti) => ({
        ...noti,
        noti_is_read: true,
      }));
      state.unreadNoti = 0;
    },
  },
});

export const {
  startAppNotification,
  addNotification,
  appendNotifications,
  updateNotificationCounts,
  endAppNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = inforNotificationSlice.actions;
const inforNotificationReducer = inforNotificationSlice.reducer;
export default inforNotificationReducer;