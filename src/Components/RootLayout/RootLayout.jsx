
import { use, useEffect, useState } from "react";
import { Outlet } from "react-router";
import Usernotverified from "../../pages/Error/Usernotverified";
import Sidebar from "../HomeComponents/Sidebar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const RootLayout = () => {
  const auth = getAuth();
  const [userVerified, setuserVerifed] = useState(
    false
  );

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {

      setuserVerifed(user.emailVerified)
    });
  }, [])


  let content = null;
  if (userVerified) {
    content = (
      <div className=" flex gap-x-[30px] p-3 ">
        <div>
          <Sidebar />
        </div>
        <div className="w-full   h-[100dvh] rounded-3xl  shadow-2xs ">
          <Outlet />
        </div>
      </div>
    );
  } else {
    content = (
      <Usernotverified />
    )
  }



  return <>{content}</>;
};

export default RootLayout;
