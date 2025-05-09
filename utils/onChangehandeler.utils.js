export const handleChange = (event, setgroupinfo, setGroupError) => {
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
