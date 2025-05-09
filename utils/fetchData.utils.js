import { getDatabase, ref, onValue, get } from "firebase/database";
import { useState } from "react";
const db = getDatabase();

export const fetchData = async (dbName = "groupList/") => {

    try {

        const starCountRef = ref(db, dbName);
        const snapshot = await get(starCountRef);
        const commonDataBlankArr = [];
        if (snapshot.exists()) {
            snapshot.forEach((element) => {
                commonDataBlankArr.push({
                    ...element.val(),
                    [`${dbName.replace('/', '')}Key`]: element.key,
                });
            });
        }


        return commonDataBlankArr;


    } catch (error) {
        throw new Error(`Failed to fetch data from ${dbName} database: ${error.message}`);
    }
}


