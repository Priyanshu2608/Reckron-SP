type ToastType = "success" | "error" | "info";

export interface IToast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

type ToastListener = (toasts: IToast[]) => void;

let toasts: IToast[] = [];
const listeners = new Set<ToastListener>();

function emit() {
  listeners.forEach((listener) => listener([...toasts]));
}

export const toast = {
  success(message: string, duration = 3000) {
    this.show(message, "success", duration);
  },
  error(message: string, duration = 4000) {
    this.show(message, "error", duration);
  },
  info(message: string, duration = 3000) {
    this.show(message, "info", duration);
  },
  show(message: string, type: ToastType = "info", duration = 3000) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: IToast = { id, message, type, duration };
    toasts.push(newToast);
    emit();

    setTimeout(() => {
      this.dismiss(id);
    }, duration);
  },
  dismiss(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  },
  subscribe(listener: ToastListener) {
    listeners.add(listener);
    listener([...toasts]);
    return () => {
      listeners.delete(listener);
    };
  },
};

import { useEffect, useState } from "react";

export function useToast() {
  const [currentToasts, setCurrentToasts] = useState<IToast[]>([]);

  useEffect(() => {
    return toast.subscribe((newToasts) => {
      setCurrentToasts(newToasts);
    });
  }, []);

  return {
    toasts: currentToasts,
    dismiss: (id: string) => toast.dismiss(id),
    success: (msg: string) => toast.success(msg),
    error: (msg: string) => toast.error(msg),
    info: (msg: string) => toast.info(msg),
  };
}
