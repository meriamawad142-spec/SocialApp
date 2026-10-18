import {
  createContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type AuthContext = {
  userToken: string | null;
  setUserToken: Dispatch<SetStateAction<string | null>>;
  userId: string;
};
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext<AuthContext>({
  userToken: null,
  setUserToken: () => {},
  userId: "",
});
export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userToken, setUserToken] = useState(function () {
    return localStorage.getItem("userToken");
  });
  const [userId, setuserId] = useState("");
  //bhtoha gwa function 3shan a3ml lazy initillization btshtghl mara wahda bs mash m3 kol render bthtfz bl kema el gmb el return

  //awl ma bfth bykon bnull w lma a3ml login el state bttghyr bybaa bl token

  //   useEffect(() => {
  //     if (localStorage.getItem("userToken")) {
  //       setUserToken(localStorage.getItem("userToken"));
  //     }
  //   },[]);
  //da hal
  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      const { user }: { user: string } = jwtDecode(
        localStorage.getItem("userToken") || "",
      );
      setuserId(user);
    }
  }, [userToken]);

  return (
    <AuthContext.Provider value={{ userToken, setUserToken, userId }}>
      {children}
    </AuthContext.Provider>
  );
}
