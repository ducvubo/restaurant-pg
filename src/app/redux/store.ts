import { configureStore } from '@reduxjs/toolkit'
import inforRestaurantReducer from '../auth/InforRestaurant.slice'
import inforEmployeeReducer from '../auth/InforEmployee.slice'
import inforGuestReducer from '../guest/guest.slice'
import inforNotificationReducer from '../auth/notification.slice'

// ...

export const store = configureStore({
  reducer: {
    inforRestaurant: inforRestaurantReducer,
    inforEmployee: inforEmployeeReducer,
    inforGuest: inforGuestReducer,
    inforNotification: inforNotificationReducer,
  }
  //Thêm api middleware để enable các tính năng như caching, invalidation, polling của rtk query
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(blogApi.middleware, rtkQueryErrorLogger)
})
// Optional, nhưng bắt buộc nếu muốn dùng tính năng refetchOnFocus và refetchOnReconnect
// setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
