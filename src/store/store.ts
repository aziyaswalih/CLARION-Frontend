import { configureStore } from "@reduxjs/toolkit";
// import donorReducer from "../reducers/donor/donorReducer";
// import volunteerReducer from "../reducers/volunteer/volunteerReducer";
import userReducer from "../reducers/users/userReducer";
import beneficiaryReducer from "../reducers/beneficiary/beneficiaryReducer";

export const store = configureStore({
  reducer: {
    // donor: donorReducer,
    // volunteer: volunteerReducer,
    users: userReducer,
    beneficiary: beneficiaryReducer,
    // admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


