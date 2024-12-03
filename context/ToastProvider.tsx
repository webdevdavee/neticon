"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimesCircle,
} from "react-icons/fa";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((currentToasts) => [...currentToasts, { id, message, type }]);

    // Auto remove toast after 5 seconds
    setTimeout(() => {
      setToasts((currentToasts) =>
        currentToasts.filter((toast) => toast.id !== id)
      );
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  };

  // Toast Icon selector
  const getToastIcon = (type: ToastType) => {
    const iconClass = "mr-3 text-xl";
    switch (type) {
      case "success":
        return <FaCheckCircle className={`${iconClass} text-emerald-500`} />;
      case "error":
        return <FaTimesCircle className={`${iconClass} text-red-500`} />;
      case "warning":
        return (
          <FaExclamationCircle className={`${iconClass} text-yellow-500`} />
        );
      case "info":
        return <FaInfoCircle className={`${iconClass} text-blue-500`} />;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className={`
                flex items-center p-4 rounded-lg shadow-lg 
                ${
                  toast.type === "success" &&
                  "bg-emerald-900/80 text-emerald-300"
                }
                ${toast.type === "error" && "bg-red-900/80 text-red-300"}
                ${
                  toast.type === "warning" && "bg-yellow-900/80 text-yellow-300"
                }
                ${toast.type === "info" && "bg-blue-900/80 text-blue-300"}
              `}
            >
              {getToastIcon(toast.type)}
              <span>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 text-current opacity-50 hover:opacity-100"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
