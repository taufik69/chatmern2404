import React, { useEffect, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import Avatar from "../../assets/homeAssets/avatar.gif";
import Modal from "react-modal";
import { getDatabase, ref, set } from "firebase/database";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
  },
};


const Grouplist = () => {
  const db = getDatabase()
  // catch the url params


  const [modalIsOpen, setIsOpen] = useState(false);
  const [groupError, setGroupError] = useState({})
  const [groupinfo, setgroupinfo] = useState({
    groupImage: "",
    groupTagName: "",
    groupName: ""
  })
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }


  // validate form input
  const validationField = () => {
    let error = {};
    for (let field in groupinfo) {
      if (groupinfo[field] === "") {
        error[`${field}Error`] = `${field} is required or missing`;
      }
    }
    setGroupError(error);

    return Object.keys(error).length === 0;
  };


  // handle change funtion
  // const handleChange = (event) => {
  //   const { files, id, value } = event.target
  //   setgroupinfo({
  //     ...groupinfo,
  //     [id]: id == "groupImage" ? files[0] : value
  //   })
  //   validationField()
  // }

  const handleChange = (event) => {
    const { files, id, value } = event.target;
    const newValue = id === "groupImage" ? files[0] : value;
    // Update the group info
    setgroupinfo((prev) => ({
      ...prev,
      [id]: newValue,
    }));

    // Clear the error for the current field if it has a value
    setGroupError((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (newValue !== "") {
        delete newErrors[`${id}Error`];
      }
      return newErrors;
    });
  };


  const handleSubmit = async () => {
    const isValid = validationField();
    if (!isValid) return;
    const formData = new FormData();
    formData.append("file", groupinfo.groupImage);
    formData.append("upload_preset", "mern2404");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/ddidljqip/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Secure URL:", data.secure_url);

      // set groupinfo into db


      // const cldImage = myCld.image(data.public_id);
      // cldImage.resize(fill().width(250).height(250));
      set(ref(db, 'groupList/'), {
        adminName: "",
        email: email,
        profile_picture: imageUrl
      });

    } catch (error) {
      console.error("Image upload failed:", error);
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
          onClick={openModal}
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
          onRequestClose={closeModal}
          style={customStyles}
        >
          <button
            onClick={closeModal}
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

                  onChange={handleChange}
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
                  onChange={handleChange}

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
                  onChange={handleChange}

                  class="block w-full text-sm py-3 px-2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="groupImage"
                  type="file"
                />
                {groupError.groupImageError &&
                  <span className="text-red-500 my-2">{groupError.groupImageError} </span>
                }
              </div>
              <AdvancedImage cldImg={groupinfo.groupImage} />

              <button
                type="submit"
                onClick={handleSubmit}
                class="mt-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Create
              </button>
            </form>
          </div>
        </Modal>
      </div>
      {/* modal component */}
    </div>
  );
};

export default Grouplist;
