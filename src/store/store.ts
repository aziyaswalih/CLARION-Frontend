import { configureStore } from "@reduxjs/toolkit";
import donorReducer from "../reducers/donor/donorReducer";
import volunteerReducer from "../reducers/volunteer/volunteerReducer";
import beneficiaryReducer from "../reducers/beneficiary/beneficiaryReducer";
import adminReducer from "../reducers/admin/adminReducer";

export const store = configureStore({
  reducer: {
    donor: donorReducer,
    volunteer: volunteerReducer,
    beneficiary: beneficiaryReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
