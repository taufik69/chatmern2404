import React, { useState } from "react";
import Group from "../../Components/HomeComponents/Group";
import Friends from "../../Components/HomeComponents/Friends";
import { HiDotsVertical } from "react-icons/hi";
import { FaCameraRetro, FaRegSmileBeam, FaTelegram } from "react-icons/fa";
import { useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import { getDatabase, push, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
const Chat = () => {
  const db = getDatabase();
  const auth = getAuth();
  const { value: user } = useSelector((store) => store.freinds);
  const [msg, setmsg] = useState();
  const [emojiOpen, setemojiOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // handleEmoji
  const handleEmoji = ({ emoji }) => {
    setmsg((prev) => prev + emoji);
  };

  // handleSEnd message
  console.log(user);

  const handleSendMsg = async () => {
    setLoading(true);
    try {
      await push(ref(db, "singleMsg"), {
        whoSendmsgUid: auth.currentUser.uid,
        whoSendMsgName: auth.currentUser.displayName,
        whoSendMsgEmail: auth.currentUser.email,
        whoSendMsgProfile_picture: auth.currentUser.photoURL,
        whoRvMsgUid: user.UserUid,
        whoRvMsgName: user.Username,
        whoRvMsgemail: user.Useremail,
        whoRvMsgProfile_picture: user.Userprofile_picture,
        singleMsg: msg,
      });
    } catch (error) {
      console.error("error from handleSendmsg", error);
    } finally {
      setLoading(false);
      setmsg("");
      setemojiOpen(false);
    }
  };

  return (
    <div className="w-full  h-[95dvh]">
      <div className="flex h-full">
        <div className="w-[40%] h-full">
          <Group />
          <Friends buttonVisble={false} />
        </div>
        <div className="w-[60%]  h-full p-7 ">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-3">
              <div className="w-[70px] h-[70px] rounded-full">
                <picture>
                  <img
                    src={user.Userprofile_picture}
                    alt="profile pic"
                    className="w-full h-full object-cover rounded-full"
                  />
                </picture>
              </div>

              <div>
                <h1>{user.Username} </h1>
                {navigator.onLine && <span>Online</span>}
              </div>
            </div>
            <span>
              <HiDotsVertical />
            </span>
          </div>

          <hr className="mt-10" />
          {/* chat view */}
          <div className="flex  w-full  flex-col h-[70vh] overflow-y-scroll">
            {/* left text */}
            {[...new Array(10)].map((_, index) =>
              index % 2 == 0 ? (
                <div className="self-start mt-5">
                  <div className="flex flex-col ">
                    <div className="text-center bg-gray-500 py-3 px-6 rounded-2xl">
                      <h1>Hey There !</h1>
                    </div>
                    <span>Today, 2:01pm</span>
                  </div>
                </div>
              ) : (
                <div className="self-end mt-5">
                  <div className="flex  flex-col">
                    <div className=" text-center bg-green-500 py-3 px-6 rounded-2xl">
                      <h1>Hey There !</h1>
                    </div>
                    <span>Today, 2:01pm</span>
                  </div>
                </div>
              )
            )}
          </div>

          {/* chat action part */}
          <div className="mt-10 flex items-center gap-x-9 relative">
            <div className="w-full relative">
              <input
                type="text"
                name="textsender"
                id="textsender"
                value={msg}
                onChange={(e) => setmsg(e.target.value)}
                className="w-full border  rounded-2xl py-3 px-2"
                placeholder="type msg ..."
              />
              <div className="absolute right-[2%] bottom-[20%] flex text-2xl items-center gap-x-4">
                <span onClick={() => setemojiOpen(!emojiOpen)}>
                  <FaRegSmileBeam className="cursor-pointer" />
                </span>
                <span>
                  <FaCameraRetro className="cursor-pointer" />
                </span>
              </div>
            </div>

            {loading ? (
              <span>
                <FaTelegram className="text-5xl animate-spin" />
              </span>
            ) : (
              <span onClick={handleSendMsg}>
                <FaTelegram className="text-5xl" />
              </span>
            )}
          </div>
          {/* chat action part */}
        </div>
        {/* chat view */}
        <div className="absolute right-[10%] bottom-[10%]">
          <EmojiPicker open={emojiOpen} onEmojiClick={handleEmoji} />
        </div>
      </div>
    </div>
  );
};
export default Chat;
