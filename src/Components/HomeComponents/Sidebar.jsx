import React, { useEffect, useState } from "react";
import { CgLogOut } from "react-icons/cg";
import { FaGears } from "react-icons/fa6";
import { FiBell } from "react-icons/fi";
import { getDatabase, onValue, ref, update } from "firebase/database";
import { IoCloudUploadOutline, IoHomeOutline } from "react-icons/io5";
import { TiMessages } from "react-icons/ti";
import { useLocation, useNavigate } from "react-router";
import { getAuth } from "firebase/auth";
const Sidebar = () => {
  const db = getDatabase()
  const auth = getAuth()
  const navigate = useNavigate();
  const location = useLocation();
  const [userdata, setuserdata] = useState({})
  const navigationIcon = [
    {
      id: 1,
      path: "/",
      icon: <IoHomeOutline />,
    },
    {
      id: 2,
      path: "/message",
      icon: <TiMessages />,
    },
    {
      id: 3,
      path: "/notification",
      icon: <FiBell />,
    },
    {
      id: 4,
      path: "/settings",
      icon: <FaGears />,
    },
    {
      id: 5,
      icon: <CgLogOut />,
    },
  ];

  // handleicon funtion implement
  const handleicon = (path = "/") => {
    navigate(path);
  };

  // catch the url params
  useEffect(() => {
    const scrict = document.createElement("script");
    scrict.src = "https://upload-widget.cloudinary.com/latest/global/all.js";
    scrict.async = true;
    document.body.appendChild(scrict);
  }, []);



  /**
   * todo : handleProfilePictureUpdate funtion
   *
   */

  /**
   * fetch the data to the firebase realtime databse
   */
  useEffect(() => {
    const fetchData = () => {
      const userRef = ref(db, "users/");
      onValue(userRef, (snapshot) => {
        let obj = {}
        snapshot.forEach((item) => {
          if (auth.currentUser.uid === item.val().userid)
            obj = { ...item.val(), userKey: item.key }

        })
        setuserdata(obj);

      });
    };
    fetchData();
  }, []);


  const handleProfilePictureUpdate = () => {
    if (window.cloudinary) {
      cloudinary.openUploadWidget(
        {
          cloudName: "ddidljqip",
          uploadPreset: "mern2404",
          googleApiKey: "AIzaSyDAkM28XiEySKD67TNnFxDPA4hkyp6YSpk",
          searchBySites: ["all", "cloudinary.com"],
          searchByRights: true,
          sources: [
            "local",
            "url",
            "camera",
            "dropbox",
            "image_search",
            "shutterstock",
            "gettyimages",
            "istock",
            "unsplash",
            "google_drive",
          ],
        },
        (error, result) => {
          if (error) {
            throw new Error("coudinary profile picture upload error");
          }
          if (result.info.secure_url) {

            update(ref(db, `users/${userdata.userKey}`), {
              profile_picture: result.info.secure_url
            });

          }
        }
      );
    } else {
      throw new Error("Upload Failed");
    }
  };

  return (
    <div>
      <div className="w-[130px] bg-green-400 rounded-3xl h-[96dvh]">
        <div className="flex justify-center ">
          <div className="w-[70px] h-[70px] mt-10 rounded-full relative cursor-pointer group">
            <picture>
              <img
                src={userdata.profile_picture || "https://images.pexels.com/photos/9072375/pexels-photo-9072375.jpeg?auto=compress&cs=tinysrgb&w=600"}
                alt="profilepicture"
                className=" w-full h-full object-cover rounded-full"
              />
            </picture>
            <span
              onClick={handleProfilePictureUpdate}
              className="absolute  hidden group-hover:block left-1/3 top-1/2 -translate-y-1/2 text-white text-2xl"
            >
              <IoCloudUploadOutline />
            </span>
          </div>
        </div>
        <h1 className="text-white text-xl mt-4 ml-5">{userdata?.username}</h1>
        {/* navigation icon */}
        <div className="flex flex-col items-center gap-y-10 justify-center mt-12">
          {navigationIcon?.map((item, index) =>
            navigationIcon.length - 1 == index ? (
              <div
                onClick={() => handleicon(item.path)}
                className={
                  location.pathname == item.path
                    ? "text-[50px]  mt-10 text-white cursor-pointer active"
                    : "text-[50px]  mt-10 text-white cursor-pointer"
                }
                key={item.id}
              >
                {item.icon}
              </div>
            ) : (
              <div
                className={
                  location.pathname == item.path
                    ? "text-[50px]  mt-10 text-red cursor-pointer active"
                    : "text-[50px]  mt-10 text-white cursor-pointer"
                }
                key={item.id}
                onClick={() => handleicon(item.path)}
              >
                {item.icon}
              </div>
            )
          )}
        </div>
        {/* navigation icon */}
      </div>
    </div>
  );
};

export default Sidebar;
