import React, { useEffect, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import Avatar from "../../assets/homeAssets/avatar.gif";
import { getDatabase, ref, onValue, off, set, push } from "firebase/database";
import { getAuth } from "firebase/auth";
import { UserListSkeleton } from "../../Skeleton/UserList";
import lib from "../../lib/lib";
import moment from "moment";
import Alert from "../CommonConponent/Alert";
const Friends = () => {
  const db = getDatabase();
  const auth = getAuth();
  const [arrLength, setarrLength] = useState(10);
  const [FrList, setFrList] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return <UserListSkeleton />;
  }

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
                    Hi Guys, Wassup!
                  </p>
                </div>
                <p>{moment(fr.createdAt).fromNow()}</p>
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
