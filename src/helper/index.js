export const formatDate = (dateString) => {
    let date = new Date(dateString);
    return `
    ${date.toLocaleDateString("en-GB")}`
}

export const formatFirestoreTimestamp = (timestamp) => {
    if (!timestamp || typeof timestamp.seconds !== "number") {
        return "";
    }

    const date = new Date(timestamp.seconds * 1000);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
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


