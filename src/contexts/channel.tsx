import Pusher, { Channel } from "pusher-js";
import { createContext, ReactNode, useContext } from "react";
import useAuth from "./auth";

interface ChannelContextType {
  channel: Channel;
}

const ChannelContext = createContext<ChannelContextType>(
  {} as ChannelContextType,
);

export function ChannelProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const pusher = new Pusher("c3f3b1c6bb58cab0a74a", {
    cluster: "eu",
  });

  const { authState } = useAuth() as { authState: UserWithToken };

  const channel = pusher.subscribe(`notification-channel-${authState.id}`);

  return (
    <ChannelContext.Provider value={{ channel }}>
      {children}
    </ChannelContext.Provider>
  );
}

export default function useChannel() {
  return useContext(ChannelContext);
}
