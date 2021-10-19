import React, { createContext, ReactNode, useContext, useState } from "react";

type NotificationType = "error" | "success";
type NotificationState = {
  message: string;
  type: NotificationType;
};

interface NotificationContextType {
  notificationState: NotificationState | null;
  setNotification: (message: string, type: NotificationType) => void;
  clear: () => void;
}

const NotificationContext = createContext<NotificationContextType>(
  {} as NotificationContextType,
);

export function NotificationProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [notificationState, setNotificationState] =
    useState<NotificationState | null>(null);

  function setNotification(message: string, type: NotificationType) {
    setNotificationState({ message, type });
  }

  function clear() {
    setNotificationState(null);
  }

  return (
    <NotificationContext.Provider
      value={{ notificationState, setNotification, clear }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export default function useNotification() {
  return useContext(NotificationContext);
}
