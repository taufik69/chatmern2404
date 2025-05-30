import React, { useEffect, useRef, useState } from "react";
import Group from "../../Components/HomeComponents/Group";
import Friends from "../../Components/HomeComponents/Friends";
import { HiDotsVertical } from "react-icons/hi";
import { FaCameraRetro, FaRegSmileBeam, FaTelegram } from "react-icons/fa";
import { useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import { getDatabase, push, ref, set, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import Modal from 'react-modal';
import { uploadFile } from "../../../utils/upload.utils";
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '40%',

    transform: 'translate(-50%, -50%)',
  },
};

const Chat = () => {
  const db = getDatabase();
  const auth = getAuth();
  const { value: user } = useSelector((store) => store.freinds);
  const [msg, setmsg] = useState("");
  const [emojiOpen, setemojiOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allsingleMsg, setAllsingleMsg] = useState([])
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [sendImage, setSendImage] = useState([])
  const [iamgeUploadLoading, setiamgeUploadLoading] = useState(false)
  const inputImageRef = useRef()
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  // handleEmoji
  const handleEmoji = ({ emoji }) => {
    setmsg((prev) => prev + emoji);
  };



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
      setSendImage([])
    }
  };

  //  singleMsg fetch
  useEffect(() => {
    const fetchSingleMsg = async () => {
      try {

        const singleMsgRef = ref(db, 'singleMsg');
        onValue(singleMsgRef, (snapshot) => {
          let msgBlankArr = []
          snapshot.forEach((msg) => {
            if (auth.currentUser.uid == msg.val().whoSendmsgUid || auth.currentUser.uid == msg.val().whoRvMsgUid) {
              msgBlankArr.push({ ...msg.val(), msgKey: msg.key })
            }

          })
          setAllsingleMsg(msgBlankArr)
        });

      } catch (error) {
        console.error('error from fetch data', error);
      }
    }
    fetchSingleMsg()
  }, [])



  // handleUpoloadImage funtion
  const handleUpoloadImage = async () => {
    try {
      setiamgeUploadLoading(true)
      let allImage = []
      for (let image of sendImage[0]) {
        const formData = new FormData();
        formData.append("upload_preset", "mern2404");
        formData.append("file", image);
        const res = await fetch("https://api.cloudinary.com/v1_1/ddidljqip/image/upload", {
          method: "POST",
          body: formData, // ✅ Fix is here
        });
        const data = await res.json();
        allImage.push(data.secure_url)

      }


      // SET IMAGE 

      await push(ref(db, "singleMsg"), {
        whoSendmsgUid: auth.currentUser.uid,
        whoSendMsgName: auth.currentUser.displayName,
        whoSendMsgEmail: auth.currentUser.email,
        whoSendMsgProfile_picture: auth.currentUser.photoURL,
        whoRvMsgUid: user.UserUid,
        whoRvMsgName: user.Username,
        whoRvMsgemail: user.Useremail,
        whoRvMsgProfile_picture: user.Userprofile_picture,
        singleMsg: allImage,
      });


    } catch (error) {
      console.error("failed to upload image");
    }
    finally {
      closeModal(false);
      setiamgeUploadLoading(false)
      if (inputImageRef.current) {
        inputImageRef.current.value = null;
      }
    }
  }




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

            {allsingleMsg.map((msg) => {
              if (auth.currentUser.uid == msg.whoSendmsgUid && user.UserUid == msg.whoRvMsgUid) {


                return (
                  Array.isArray(msg.singleMsg) ? (
                    < div className="self-end mt-5" >
                      <div className="flex  flex-col">
                        <div className=" text-center bg-green-500 py-3 px-6 rounded-2xl">

                          {msg.singleMsg.map((image) => (
                            <div class="relative me-4">
                              <img class="w-50 h-50 rounded" src={image} alt="profile image" />
                            </div>
                          ))}

                        </div>
                        <span>Today, 2:01pm</span>
                      </div>
                    </div>
                  ) : (< div className="self-end mt-5" >
                    <div className="flex  flex-col">
                      <div className=" text-center bg-green-500 py-3 px-6 rounded-2xl">
                        <h1>{msg.singleMsg}</h1>
                      </div>
                      <span>Today, 2:01pm</span>
                    </div>
                  </div>)

                )
              }
              else if (user.UserUid == msg.whoSendmsgUid && auth.currentUser.uid == msg.whoRvMsgUid) {
                return (
                  Array.isArray(msg.singleMsg) ? (< div className="self-start mt-5" >
                    <div className="flex  flex-col">
                      <div className=" 
                      ">
                        {msg.singleMsg.map((image) => (
                          <div class="relative me-4">
                            <img class="w-50 h-50 rounded" src={image} alt="profile image" />
                          </div>
                        ))}

                      </div>
                      <span>Today, 2:01pm</span>
                    </div>
                  </div>) : (< div className="self-start mt-5" >
                    <div className="flex flex-col ">
                      <div className="text-center bg-gray-500 py-3 px-6 rounded-2xl">
                        <h1>{msg.singleMsg}</h1>
                      </div>
                      <span>Today, 2:01pm</span>
                    </div>
                  </div>)

                )
              }
              return null

            })}

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
                  <FaCameraRetro className="cursor-pointer" onClick={() => openModal()} />
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

      {/* modal  */}
      <div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}

        >



          <div class="flex items-center justify-center w-full">
            <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input id="dropzone-file" ref={inputImageRef} type="file" multiple onChange={(e) => setSendImage([e.target.files])} />
            </label>
          </div>

          {/* button group */}
          <div className="flex justify-center my-10">
            <button type="button" class="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900" onClick={() => closeModal()}>Cancle</button>
            {iamgeUploadLoading ? (<button type="button" class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Upload ...</button>) : (<button type="button" class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900" onClick={handleUpoloadImage}>Upload</button>)}

          </div>
        </Modal>
      </div>
    </div >
  );
};
export default Chat;
