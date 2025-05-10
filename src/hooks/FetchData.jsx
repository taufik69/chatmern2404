import { getDatabase, ref, get } from "firebase/database";
import { useEffect, useState } from "react";

const useFetch = (dbName = "friends/") => {
  const db = getDatabase();

  const [groupList, setGroupList] = useState({
    data: [],
    error: null,
    loading: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      setGroupList((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const snapshot = await get(ref(db, dbName));
        // const snapshot = await get(ref(db, dbName));
        if (snapshot.exists()) {
          const groupListBlankArr = [];
          snapshot.forEach((item) => {
            groupListBlankArr.push({
              ...item.val(),
              [`${dbName.replace("/", "")}key`]: item.key,
            });
          });

          setGroupList({
            ...groupList,
            data: groupListBlankArr,
            error: null,
            loading: false,
          });
        } else {
          setGroupList({
            data: [],
            error: new Error("No data available"),
            loading: false,
          });
        }
      } catch (error) {
        setGroupList({
          data: [],
          error,
          loading: false,
        });
        console.error("Firebase get() error:", error);
      }
    };

    fetchData();
  }, [dbName]);

  console.log(groupList);

  //   return groupList;
};

export { useFetch };
