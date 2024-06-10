import { useRecoilValue } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import Login from "../components/LoginCard";
import SignupCard from "../components/SignupCard";
import { useEffect } from "react";
const AuthPage = () => {
  useEffect(() => {
    document.title = "Authentication";
  }, []);
  const authScreenState = useRecoilValue(authScreenAtom);
  return <>{authScreenState === "login" ? <Login /> : <SignupCard />}</>;
};

export default AuthPage;
