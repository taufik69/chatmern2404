import { getDatabase, ref, get } from "firebase/database";
import { useEffect, useState } from "react";
const db = getDatabase();

export const useFetchData = () => {
  const [groupList, setGrouplist] = useState({
    data: [],
    error: {},
    loading: false,
  });
  useEffect(() => {
    const anyDbData = async () => {
      setGrouplist({
        ...groupList,
        data: [],
        error: null,
        loading: true,
      });

      try {
        const snapshot = await get(ref(db, "friends"));
        if (snapshot.exists()) {
          let commonDataBlankArr = [];
          snapshot.forEach((element) => {
            commonDataBlankArr.push({
              ...element.val(),
              [`${"friends/".replace("/", "")}Key`]: element.key,
            });
          });
          setGrouplist({
            ...groupList,
            data: commonDataBlankArr,
            error: null,
            loading: false,
          });
        } else {
          setGrouplist({
            ...groupList,
            data: [],
            error: null,
            loading: false,
          });
        }
      } catch (error) {
        console.log("network Request Failed", error);
        setGrouplist({
          ...groupList,
          data: [],
          error: error,
          loading: false,
        });
      }
    };

    anyDbData();
    return () => {
      anyDbData();
    };
  }, []);

  return groupList;
};
