// services/toastService.ts
import { toast } from "react-hot-toast";

const toastStyle = {
  borderRadius: "10px",
  background: "#333",
  color: "#fff",
  fontSize: "14px",
  maxWidth: "500px",
};

const successStyle = {
  ...toastStyle,
  background: "#10b981",
};

const errorStyle = {
  ...toastStyle,
  background: "#ef4444",
};

const loadingStyle = {
  ...toastStyle,
  background: "#6b7280",
};

export const ToastService = {
  success: (message: string) => {
    return toast.success(message, {
      style: successStyle,
      duration: 4000,
      position: "top-center",
    });
  },

  error: (message: string) => {
    return toast.error(message, {
      style: errorStyle,
      duration: 6000, // Error messages shown longer
      position: "top-center",
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      style: loadingStyle,
      position: "top-center",
    });
  },

  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },

  dismissAll: () => {
    toast.dismiss();
  },

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, messages, {
      style: toastStyle,
      position: "top-center",
      success: {
        duration: 4000,
        style: successStyle,
      },
      error: {
        duration: 6000,
        style: errorStyle,
      },
      loading: {
        style: loadingStyle,
      },
    });
  },

  // Helper method for async operations with consistent error handling
  handleAsync: async <T>(
    operation: () => Promise<T>,
    messages: {
      loading: string;
      success: string;
      error?: string;
    }
  ): Promise<T | null> => {
    const loadingToastId = toast.loading(messages.loading, {
      style: loadingStyle,
      position: "top-center",
    });

    try {
      const result = await operation();
      toast.dismiss(loadingToastId);
      toast.success(messages.success, {
        style: successStyle,
        duration: 4000,
        position: "top-center",
      });
      return result;
    } catch (error: any) {
      toast.dismiss(loadingToastId);
      const errorMessage =
        messages.error ||
        error?.message ||
        "Operation failed. Please try again.";
      toast.error(errorMessage, {
        style: errorStyle,
        duration: 6000,
        position: "top-center",
      });
      throw error;
    }
  },
};
