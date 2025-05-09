// validate form input
export const validationField = (groupinfo, setGroupError) => {
    let error = {};
    for (let field in groupinfo) {
        if (groupinfo[field] === "") {
            error[`${field}Error`] = `${field} is required or missing`;
        }
    }
    setGroupError(error);

    return Object.keys(error).length === 0;
};

