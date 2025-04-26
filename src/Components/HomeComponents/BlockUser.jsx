import React, { useEffect, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import Avatar from "../../assets/homeAssets/avatar.gif";
import { FaPlus } from "react-icons/fa";
import { getDatabase, ref, onValue, off, set, push } from "firebase/database";
import { getAuth } from "firebase/auth";
import { UserListSkeleton } from "../../Skeleton/UserList";
import lib from "../../lib/lib";

import Alert from "../CommonConponent/Alert";
import moment from "moment";
const BlockUser = () => {
  const db = getDatabase();
  const auth = getAuth();
  const [arrLength, setarrLength] = useState(10);
  const [FrList, setFrList] = useState([]);

  // fetch block data
  useEffect(() => {
    const userRef = ref(db, "blocklists/");
    onValue(userRef, (snapshot) => {
      const FrBlankArr = [];
      snapshot.forEach((block) => {
        if (auth?.currentUser.uid == block?.val().whoRVfrUid)
          FrBlankArr.push({ ...block?.val(), blockKey: block?.key });
      });
      setFrList(FrBlankArr);
    });

    // Cleanup
    return () => {
      off(userRef);
    };
  }, []);

  return (
    <div>
      {/* list part */}
      <div className="shadow-2xs mt-3">
        <div className="flex items-center justify-between">
          <h1 className="relative">
            Block List
            <span className="absolute right-0 top-0 w-5 h-5 rounded-full bg-green-300 flex items-center justify-center">
              {arrLength}
            </span>
          </h1>

          <span>
            <HiDotsVertical />
          </span>
        </div>
        <div className="overflow-y-scroll h-[38dvh] scrollable-content">
          {FrList.map((blockUser, index) => (
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
                    src={blockUser.whoSendFRprofile_picture || Avatar}
                    alt={Avatar}
                    className="w-full h-full object-cover rounded-full"
                  />
                </picture>
              </div>

              <div className="">
                <h1 className="text-bold">{blockUser.whoSendFrname}</h1>
                <p className="text-sm font-normal font-sans">
                  {moment(blockUser.createAt).fromNow()}
                </p>
              </div>
              <button
                type="button"
                class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer "
              >
                unBlock
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* list part */}
    </div>
  );
};

export default BlockUser;
