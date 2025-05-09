import { getDatabase, push, ref, set } from "firebase/database";
const db = getDatabase()
export const uploadFile = async (body) => {
    try {
        if (!body) return
        const res = await fetch("https://api.cloudinary.com/v1_1/ddidljqip/image/upload", {
            method: "POST",
            body,
        });

        const data = await res.json();
        return data.secure_url

    } catch (error) {
        throw new Error('Upload Clodinary Failed ', error)
    }
}

// upload file into firebase database database


export const setFirebaseData = async (dbName, data) => {
    try {
        await set(push(ref(db, dbName)), data)

    } catch (error) {
        throw new Error('Upload Firebase  Failed ', error)
    }
}
