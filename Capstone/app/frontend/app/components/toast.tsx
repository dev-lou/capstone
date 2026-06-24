"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

// ────────────────────────────────────────────────────────────
// Icons
// ────────────────────────────────────────────────────────────

function ToastIcon({ type }: { type: ToastType }) {
  const icons: Record<ToastType, string> = {
    success: "M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z",
    error: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8H120a8,8,0,0,1-8-8V120a8,8,0,0,1,16,0v48ZM120,96a12,12,0,1,1,12-12A12,12,0,0,1,120,96Z",
    info: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8H120a8,8,0,0,1-8-8V120a8,8,0,0,1,16,0v48ZM120,96a12,12,0,1,1,12-12A12,12,0,0,1,120,96Z",
    warning: "M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09Zm-20.17,14.43A8.17,8.17,0,0,1,215.45,208H40.55a8.17,8.17,0,0,1-7.18-5.48,7.66,7.66,0,0,1,0-7.72l87.45-151.87a8.33,8.33,0,0,1,14.36,0l87.45,151.87A7.66,7.66,0,0,1,216.63,202.52ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,28a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z",
  };

  const colors: Record<ToastType, string> = {
    success: "text-green-600 dark:text-green-400",
    error: "text-red-600 dark:text-red-400",
    info: "text-[var(--color-ph-navy)] dark:text-[var(--color-primary)]",
    warning: "text-amber-600 dark:text-amber-400",
  };

  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className={`shrink-0 ${colors[type]}`} aria-hidden="true">
      <path d={icons[type]} />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// Context
// ────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

// ────────────────────────────────────────────────────────────
// Toast Item Component
// ────────────────────────────────────────────────────────────

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(t.id), 4000);
    return () => clearTimeout(timer);
  }, [t.id, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className="toast"
      role="alert"
    >
      <ToastIcon type={t.type} />
      <span className="flex-1 text-sm text-[var(--color-text)]">{t.message}</span>
      <button
        onClick={() => onDismiss(t.id)}
        className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
        aria-label="Dismiss"
      >
        <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
          <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
        </svg>
      </button>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────
// Provider
// ────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[var(--z-toast)] flex flex-col gap-2 pointer-events-none">
        <div className="flex flex-col gap-2 pointer-events-auto">
          <AnimatePresence>
            {toasts.map((t) => (
              <ToastItem key={t.id} toast={t} onDismiss={dismissToast} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  );
}

// ────────────────────────────────────────────────────────────
// Standalone Toaster (no provider needed for simple use)
// ────────────────────────────────────────────────────────────

let globalToasts: Toast[] = [];
let globalListeners: Array<(toasts: Toast[]) => void> = [];

function notifyListeners() {
  globalListeners.forEach((fn) => fn([...globalToasts]));
}

export function toast(message: string, type: ToastType = "info") {
  const id = Math.random().toString(36).substring(2, 9);
  globalToasts = [...globalToasts, { id, message, type }];
  notifyListeners();

  setTimeout(() => {
    globalToasts = globalToasts.filter((t) => t.id !== id);
    notifyListeners();
  }, 4000);
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(() => {
    setItems([...globalToasts]);
    globalListeners.push(setItems);
    return () => {
      globalListeners = globalListeners.filter((fn) => fn !== setItems);
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    globalToasts = globalToasts.filter((t) => t.id !== id);
    notifyListeners();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[var(--z-toast)] flex flex-col gap-2 pointer-events-none">
      <div className="flex flex-col gap-2 pointer-events-auto">
        <AnimatePresence>
          {items.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
