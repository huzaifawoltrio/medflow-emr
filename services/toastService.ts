import { toast } from "react-hot-toast";

const toastStyle = {
  borderRadius: "10px",
  background: "#333",
  color: "#fff",
};

export const ToastService = {
  success: (message: string) => {
    toast.success(message, {
      style: toastStyle,
    });
  },

  error: (message: string) => {
    toast.error(message, {
      style: toastStyle,
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      style: toastStyle,
    });
  },

  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },

  promise: (
    promise: Promise<any>,
    messages: { loading: string; success: string; error: string }
  ) => {
    return toast.promise(promise, messages, {
      style: toastStyle,
    });
  },
};
