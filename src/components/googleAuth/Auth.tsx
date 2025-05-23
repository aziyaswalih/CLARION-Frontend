import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { UserGoogle_post } from "../../reducers/users/userApicalls";
import { toast } from "react-toastify";

const GoogleLoginUser = () => {
  const dispatch: AppDispatch = useDispatch();
  const handleSuccess = async (response: CredentialResponse) => {
    try {
      const { credential } = response;
      if (!credential) throw new Error("no credential");
      const res = await dispatch(UserGoogle_post(credential))
        .unwrap()
        .then(() => {
          toast.success("success login");
          window.location.href = "/login";
        });

      console.log("Server Response:", res);
      //   if(res){
      //     <Navigate to='/login' replace />
      //   }
    } catch (error) {
      console.error("Error during Google authentication:", error);
    }
  };
  return (
    <div className="flex items-center justify-center mt-4">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Google login error")}
        theme="outline"
        size="large"
        logo_alignment="center"
        shape="pill"
      />
    </div>
  );
};

export default GoogleLoginUser;
