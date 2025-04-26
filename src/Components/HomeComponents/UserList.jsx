import React, { useEffect, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import Avatar from "../../assets/homeAssets/avatar.gif";
import { FaMinus, FaPlus } from "react-icons/fa";
import { getDatabase, ref, onValue, off, set, push } from "firebase/database";
import { getAuth } from "firebase/auth";
import { UserListSkeleton } from "../../Skeleton/UserList";
import lib from "../../lib/lib";

const UserList = () => {
  const db = getDatabase();
  const auth = getAuth();
  const [userList, setUserList] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [frdRequestlist, setfrdRequestlist] = useState([]);
  const [actualFrdList, setactualFrdList] = useState([]);

  useEffect(() => {
    const userRef = ref(db, "users");
    const unsubscribe = onValue(userRef, (snapshot) => {
      const userBlankArr = [];
      snapshot.forEach((user) => {
        if (auth.currentUser?.uid !== user.val().userid) {
          userBlankArr.push({ ...user.val(), userKey: user.key });
        } else {
          setCurrentUser({ ...user.val(), userKey: user.key });
        }
      });
      setUserList(userBlankArr);
      setLoading(false);
    });

    // Cleanup
    return () => {
      off(userRef);
    };
  }, []);

  // fetch data from friendRequest
  useEffect(() => {
    const FRRef = ref(db, "friendRequest");
    onValue(FRRef, (snapshot) => {
      const FrBlankArr = [];
      snapshot.forEach((frR) => {
        if (auth.currentUser.uid == frR.val().whoSendFrUid)
          FrBlankArr.push(
            auth?.currentUser?.uid?.concat(frR?.val()?.whoRVfrUid)
          );
      });
      setfrdRequestlist(FrBlankArr);
    });

    // Cleanup
    return () => {
      off(FRRef);
    };
  }, []);

  // console.log(actualFrdList);

  // fetch data from friendRequest
  useEffect(() => {
    const FRRef = ref(db, "friends");
    onValue(FRRef, (snapshot) => {
      const FrBlankArr = [];
      snapshot.forEach((singleFr) => {
        if (auth.currentUser.uid == singleFr.val().whoRVfrUid) {
          FrBlankArr.push(
            singleFr?.val()?.whoSendFrUid?.concat(auth?.currentUser?.uid)
          );
        }
        setactualFrdList(FrBlankArr);
      });
    });

    // Cleanup
    return () => {
      off(FRRef);
    };
  }, []);

  if (loading) {
    return <UserListSkeleton />;
  }

  //desc handleFriendRequest futnion

  const handleFriendRequest = (user) => {
    set(push(ref(db, "friendRequest/")), {
      whoSendFrname: currentUser?.username || auth?.currentUser?.displayName,
      whoSendFrUid: currentUser?.userid || auth?.currentUser?.uid,
      whoSendFRemail: currentUser?.email || auth?.currentUser?.email,
      whoSendFRprofile_picture:
        currentUser?.profile_picture || auth?.currentUser?.photoURL,
      whoSendFRUserKey: currentUser?.userKey || "",
      whoRVFrname: user?.username || "",
      whoRVfrUid: user?.userid || "",
      whoRVfrUserKey: user?.userKey || "",
      whoRVfrProfile_picture: user?.profile_picture || "",
      whoRVfremail: user?.email || "",
      createdAt: lib.getTimeNow(),
    })
      .then(() => {
        set(push(ref(db, "notification/")), {
          notificatoinMsg: `${
            currentUser?.username || auth?.currentUser?.displayName
          } Send a Friend Request ${user.username}`,
          createdAt: lib.getTimeNow(),
        });
      })
      .then(() => {
        lib.SucessToast(
          `${
            currentUser?.username || auth?.currentUser?.displayName
          } Send a Friend Request ${user.username} `,
          "top-left"
        );
      })
      .then(() => {
        console.log("last chain");

        // const SenderIdReciverid = {
        //   id: currentUser?.userid + user?.userid
        // }
        // localStorage.setItem('sendFR', JSON.stringify(SenderIdReciverid))
      })
      .catch((err) => {
        console.error("Error from friendRequest", err);
      });
  };

  return (
    <div className="shadow-2xs mt-3">
      <div className="flex items-center justify-between">
        <h1 className="relative">
          User List
          <span className="absolute right-0 top-0 w-5 h-5 rounded-full bg-green-300 flex items-center justify-center">
            {userList.length}
          </span>
        </h1>
        <span>
          <HiDotsVertical />
        </span>
      </div>
      <div className="overflow-y-scroll h-[38dvh] scrollable-content">
        {userList.map((user, index) => (
          <div
            key={user.userKey}
            className={
              userList.length - 1 === index
                ? "flex items-center justify-between mt-3 pb-2"
                : "flex items-center justify-between mt-3 border-b border-b-gray-800 pb-2"
            }
          >
            <div className="w-[50px] h-[50px] rounded-full">
              <picture>
                <img
                  src={user.profile_picture || Avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </picture>
            </div>

            <div className="">
              <h1 className="font-bold">{user.username}</h1>
              <p className="text-sm font-normal font-sans w-[80%] truncate">
                {user.email || "Missing"}
              </p>
            </div>
            {actualFrdList?.includes(auth?.currentUser?.uid + user.userid)
              ? " Friend"
              : ""}

            {frdRequestlist?.includes(auth?.currentUser?.uid + user.userid) ? (
              <button
                type="button"
                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer"
              >
                <FaMinus />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleFriendRequest(user)}
                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer"
              >
                <FaPlus />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
