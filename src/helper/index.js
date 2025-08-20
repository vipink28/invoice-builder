export const formatDate = (dateString) => {
    let date = new Date(dateString);
    return `
    ${date.toLocaleDateString("en-GB")}`
}

export const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};


