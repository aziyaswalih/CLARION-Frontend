import { configureStore } from "@reduxjs/toolkit";
import donorReducer from "../reducers/donors/donorReducer";
import volunteerReducer from "../reducers/volunteers/volunteerReducer";
import userReducer from "../reducers/users/userReducer";
import beneficiaryReducer from "../reducers/beneficiary/beneficiaryReducer";
import adminReducer from "../reducers/admin/adminReducer";
import storyReducer from "../reducers/beneficiary/storyReducer";

export const store = configureStore({
  reducer: {
    donor: donorReducer,
    volunteer: volunteerReducer,
    users: userReducer,
    beneficiary: beneficiaryReducer,
    admin: adminReducer,
    stories: storyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


