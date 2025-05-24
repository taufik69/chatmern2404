import React, { useEffect, useState } from "react";
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
import { friendAction } from "../../Features/slices/friendSlice";
import Alert from "../CommonConponent/Alert";
import { useDispatch } from "react-redux";
const Friends = ({ buttonVisble = true }) => {
  const db = getDatabase();
  const auth = getAuth();
  const dispatch = useDispatch();
  const [arrLength, setarrLength] = useState(10);
  const [FrList, setFrList] = useState([]);
  const [loading, setLoading] = useState(true);
  let [active, setactive] = useState(false);
  const [blockUser, setblockUser] = useState([]);

  useEffect(() => {
    const userRef = ref(db, "friends");
    onValue(userRef, (snapshot) => {
      const FrBlankArr = [];
      snapshot.forEach((friend) => {
        if (auth?.currentUser.uid == friend?.val().whoRVfrUid)
          FrBlankArr.push({ ...friend?.val(), friendKey: friend?.key });
      });
      setFrList(FrBlankArr);
      setLoading(false);
    });

    // Cleanup
    return () => {
      off(userRef);
    };
  }, []);

  // fetch block data
  // fetch data from friendRequest
  useEffect(() => {
    const FRRef = ref(db, "blocklists/");
    onValue(FRRef, (snapshot) => {
      const blockBlankArr = [];
      snapshot.forEach((block) => {
        if (auth?.currentUser?.uid == block.val().whoRVfrUid) {
          blockBlankArr.push(
            auth.currentUser.uid.concat(block.val().whoSendFrUid)
          );
        }
      });
      setblockUser(blockBlankArr);
    });

    // Cleanup
    return () => {
      off(FRRef);
    };
  }, []);

  if (loading) {
    return <UserListSkeleton />;
  }

  // handleBlock funtion
  const handleBlock = (frInfo = {}) => {
    set(push(ref(db, "blocklists/")), {
      ...frInfo,
      createdAt: lib.getTimeNow(),
    }).then(() => {
      const frRef = ref(db, `friends/${frInfo.friendKey}`);
      remove(frRef);
    });
  };

  //send msg
  const sendMsg = (frdInfo) => {
    if (auth.currentUser.uid == frdInfo.whoRVfrUid) {
      let userInfo = {
        UserKey: frdInfo.whoSendFRUserKey,
        Useremail: frdInfo.whoSendFRemail,
        Userprofile_picture: frdInfo.whoSendFRprofile_picture,
        UserUid: frdInfo.whoSendFrUid,
        Username: frdInfo.whoSendFrname,
      };
      dispatch(friendAction(userInfo));
    } else {
      let userInfo = {
        Username: frdInfo.whoRVFrname,
        UserProfile_picture: frdInfo.whoRVfrProfile_picture,
        UserUid: frdInfo.whoRVfrUid,
        UserKey: frdInfo.whoRVfrUserKey,
        Useremail: frdInfo.whoRVfremail,
      };
      dispatch(friendAction(userInfo));
    }
  };

  return (
    <div>
      {/* list part */}
      <div className="shadow-2xs mt-3">
        <div className="flex items-center justify-between">
          <h1 className="relative">
            Friends
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
                onClick={() => sendMsg(fr)}
                className={
                  arrLength - 1 === index
                    ? "flex items-center justify-between mt-3   pb-2"
                    : "flex items-center justify-between mt-3 border-b border-b-gray-800 pb-2"
                }>
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
                    Hi Guys, Wassup!
                  </p>
                </div>

                {/* friend button list */}
                {buttonVisble ? (
                  <div>
                    <button
                      type="button"
                      class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                      Unfriend
                    </button>

                    {blockUser.includes(
                      auth.currentUser.uid.concat(fr.whoSendFrUid)
                    ) ? (
                      <button
                        type="button"
                        class="focus:outline-none cursor-pointer text-white bg-purple-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                        unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlock(fr)}
                        type="button"
                        class="focus:outline-none cursor-pointer text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                        Block
                      </button>
                    )}
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      {/* list part */}
    </div>
  );
};

export default Friends;
