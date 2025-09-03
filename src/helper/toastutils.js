import toast from "react-hot-toast";

export const notifyPromise = (promise, { loading, success, error }) =>
    toast.promise(promise, {
        loading: loading || "Processing...",
        success: success || "Done!",
        error: error || "Something went wrong",
    });

export const notifySuccess = (msg) => toast.success(msg);
export const notifyError = (msg) => toast.error(msg);
export const notifyInfo = (msg) => toast(msg);