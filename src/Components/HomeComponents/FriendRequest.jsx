import React, { use, useEffect, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import Avatar from "../../assets/homeAssets/avatar.gif";
import {
  getDatabase,
  ref,
  onValue,
  off,
  set,
  push,
  remove,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { UserListSkeleton } from "../../Skeleton/UserList";
import lib from "../../lib/lib";
import moment from "moment";
import Alert from "../CommonConponent/Alert";
const FriendRequest = () => {
  const db = getDatabase();
  const auth = getAuth();
  const [arrLength, setarrLength] = useState(10);
  const [FrList, setFrList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const userRef = ref(db, "friendRequest");
    onValue(userRef, (snapshot) => {
      const FrBlankArr = [];
      snapshot.forEach((eachFr) => {
        if (auth?.currentUser?.uid !== eachFr?.val()?.whoSendFrUid) {
          FrBlankArr.push({ ...eachFr.val(), fRKey: eachFr.key });
        }
      });
      setFrList(FrBlankArr);
      setLoading(false);
    });

    // Cleanup
    return () => {
      off(userRef);
    };
  }, []);

  if (loading) {
    return <UserListSkeleton />;
  }

  // handleAcceptFriendRequest futnion
  const handleAcceptFriendRequest = (FrInfo) => {
    console.log(FrInfo);

    set(push(ref(db, "friends/")), {
      ...FrInfo,
      createdAt: lib.getTimeNow(),
    })
      .then(() => {
        // remove the fr id
        const frRef = ref(db, `friendRequest/${FrInfo.fRKey}`);
        remove(frRef);
      })
      .then(() => {
        set(push(ref(db, "notification/")), {
          notificatoinMsg: `${FrInfo.whoRVFrname} Accept Your  Friend Request `,
          createdAt: lib.getTimeNow(),
        });
      })
      .then(() => {
        lib.SucessToast(
          `${FrInfo.whoRVFrname} Accept Your  Friend Request `,
          "top-left"
        );
      })
      .catch((err) => {
        console.error("Error from Accept friend R", err);
      });
  };

  // handleReject
  const handleReject = (fr) => {
    let areYouSure = confirm("You Are Sure ");

    if (areYouSure) {
      // remove the fr id
      const frRef = ref(db, `friendRequest/${fr.fRKey}`);
      remove(frRef);
    }
  };
  return (
    <div>
      {/* list part */}
      <div className="shadow-2xs mt-3">
        <div className="flex items-center justify-between">
          <h1 className="relative">
            Friend Request
            <span className="absolute right-0 top-0 w-5 h-5 rounded-full bg-green-300 flex items-center justify-center">
              {arrLength}
            </span>
          </h1>

          <span>
            <HiDotsVertical />
          </span>
        </div>
        <div className="overflow-y-scroll h-[38dvh] scrollable-content">
          {FrList?.length == 0 ? (
            <Alert />
          ) : (
            FrList?.map((fr, index) => (
              <div
                className={
                  arrLength - 1 === index
                    ? "flex items-center justify-between mt-3   pb-2"
                    : "flex items-center justify-between mt-3 border-b border-b-gray-800 pb-2"
                }
              >
                <div className="w-[50px] h-[50px] rounded-full">
                  <picture>
                    <img
                      src={fr.whoSendFRprofile_picture || Avatar}
                      alt={Avatar}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </picture>
                </div>

                <div className="">
                  <h1 className="text-bold">{fr.whoSendFrname}</h1>
                  <p className="text-sm font-normal font-sans">
                    {moment(fr.createdAt).fromNow()}
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer "
                    onClick={() => handleAcceptFriendRequest(fr)}
                  >
                    Accept
                  </button>

                  <button
                    type="button"
                    class="focus:outline-none text-white bg-red-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer "
                    onClick={() => handleReject(fr)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* list part */}
    </div>
  );
};

export default FriendRequest;
