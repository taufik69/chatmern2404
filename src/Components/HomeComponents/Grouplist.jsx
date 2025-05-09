import React, { useEffect, useRef, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import Avatar from "../../assets/homeAssets/avatar.gif";
import Modal from "react-modal";
import lib from '../../lib/lib'
import { uploadFile, setFirebaseData } from "../../../utils/upload.utils";
import { closeModal, openModal } from "../../../utils/modal.utils";
import { validationField } from "../../../validation/groupForm.validation";
import { handleChange } from "../../../utils/onChangehandeler.utils";
import { getAuth } from "firebase/auth";
import Group from "./Group";


const Grouplist = () => {
  const auth = getAuth()
  const inputImageRef = useRef(null)
  const [modalIsOpen, setIsOpen] = useState(false);
  const [groupError, setGroupError] = useState({});
  const [loading, setloading] = useState(false)
  const [groupinfo, setgroupinfo] = useState({
    groupImage: "",
    groupTagName: "",
    groupName: ""
  })

  const handleSubmit = async () => {
    const isValid = validationField(groupinfo, setGroupError);
    if (!isValid) return;
    const formData = new FormData();
    formData.append("file", groupinfo.groupImage);
    formData.append("upload_preset", "mern2404");
    try {
      setloading(true)
      const Url = await uploadFile(formData);
      setFirebaseData('groupList/', {
        adminName: auth.currentUser.displayName,
        adminUid: auth.currentUser.uid,
        adminEmail: auth.currentUser.email,
        adminPhoto_url: auth.currentUser.photoURL,
        groupName: groupinfo.groupName,
        groupTagName: groupinfo.groupTagName,
        groupImage: Url,
      })

    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setloading(false);
      setgroupinfo({
        groupImage: "",
        groupTagName: "",
        groupName: ""
      })
      closeModal(setIsOpen)
      if (inputImageRef.current) {
        inputImageRef.current.value = null;
      }
    }
  };

  return (
    <div>
      <div class="relative">
        <div className="p-2 ">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
        </div>
        <input
          type="search"
          id="default-search"
          class="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 "
          placeholder="Search ..."
          required
        />
      </div>
      {/* list part */}
      <div className=" shadow-2xs mt-3">
        <div className="flex items-center justify-between">
          <h1 className="relative">
            Groups List{" "}
            <span className="absolute -right-10 top-0 w-5 h-5 rounded-full bg-green-300 flex items-center justify-center">
              0
            </span>
          </h1>

          <span>
            <HiDotsVertical />
          </span>
        </div>
        <button
          type="button"
          onClick={() => openModal(setIsOpen)}
          class="focus:outline-none w-full mb-10 mt-10 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 ~cursor-pointer "
        >
          createGroup
        </button>
        <div className="overflow-y-scroll h-[35dvh] scrollable-content">
          {[...new Array(10)].map((_, index) => (
            <div
              className={
                10 - 1 === index
                  ? "flex items-center justify-between mt-3   pb-2"
                  : "flex items-center justify-between mt-3 border-b border-b-gray-800 pb-2"
              }
            >
              <div className="w-[50px] h-[50px] rounded-full">
                <picture>
                  <img
                    src={Avatar}
                    alt={Avatar}
                    className="w-full h-full object-cover rounded-full"
                  />
                </picture>
              </div>

              <div className="">
                <h1 className="text-bold">Friends Reunion</h1>
                <p className="text-sm font-normal font-sans">
                  Hi Guys, Wassup!
                </p>
              </div>
              <button
                type="button"
                class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer "
              >
                Join
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* list part */}

      {/* modal component */}
      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => closeModal(setIsOpen)}
          style={lib.customStyle}
        >
          <button
            onClick={() => closeModal(setIsOpen)}
            type="button"
            class="text-white cursor-pointer bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            X
          </button>

          <div class="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <form class="max-w-sm mx-auto" onSubmit={(e) => e.preventDefault()}>
              <div class="mb-5">
                <label
                  for="groupname"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Group Name
                </label>
                <input
                  type="text"
                  id="groupName"
                  value={groupinfo.groupName}
                  onChange={(event) => handleChange(event, setgroupinfo, setGroupError)}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="hello"
                  required
                />
                {groupError.groupNameError &&
                  <span className="text-red-500 my-2">{groupError.groupNameError} </span>
                }
              </div>
              <div class="mb-5">
                <label
                  for="password"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  GroupTag Name
                </label>
                <input
                  type="text"
                  onChange={(event) => handleChange(event, setgroupinfo, setGroupError)}
                  value={groupinfo.groupTagName}
                  id="groupTagName"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
                {groupError.groupTagNameError &&
                  <span className="text-red-500 my-2">{groupError.groupTagNameError} </span>
                }
              </div>

              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  for="user_avatar"
                >
                  Upload file
                </label>
                <input
                  onChange={(event) => handleChange(event, setgroupinfo, setGroupError)}
                  ref={inputImageRef}
                  class="block w-full text-sm py-3 px-2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="groupImage"
                  type="file"
                />
                {groupError.groupImageError &&
                  <span className="text-red-500 my-2">{groupError.groupImageError} </span>
                }
              </div>


              {loading ? (<button
                type="submit"

                class="mt-10 animate-pulse text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                laoding...
              </button>) : (<button
                type="submit"
                onClick={handleSubmit}
                class="mt-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Create
              </button>)}

            </form>
          </div>
        </Modal>
      </div>
      {/* modal component */}

    </div>
  );
};

export default Grouplist;
