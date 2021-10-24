import Pusher from "pusher-js";
import { ReactNode, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useQueryClient } from "react-query";

import useAuth from "../../contexts/auth";

function ChannelToastProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const queryClient = useQueryClient();
  const { authState } = useAuth() as { authState: UserWithToken };

  useEffect(() => {
    console.log(process.env.REACT_APP_PUSHER_KEY);
    const pusher = new Pusher(String(process.env.REACT_APP_PUSHER_KEY), {
      cluster: "eu",
    });
    const channel = pusher.subscribe(`notification-channel-${authState.id}`);

    channel.bind("invitation", (data: ChannelInvitationMessage) => {
      const { state, invitor, invitee, apartment } = data;
      if (state === "CREATED") {
        toast.info(
          `User ${invitor} invites you to join apartment ${apartment}`,
        );
        queryClient.invalidateQueries("invitations");
      } else if (state === "CANCELED") {
        toast.info(`User ${invitor} cancelled the invitation`);
        queryClient.invalidateQueries("invitations");
      } else if (state === "REJECTED") {
        toast.info(`User ${invitee} rejected the invitation`);
        queryClient.invalidateQueries("invitations");
      } else if (state === "ACCEPTED") {
        toast.info(`User ${invitee} accepted the invitation`);
        queryClient.invalidateQueries("apartment");
        queryClient.invalidateQueries("invitations");
      }
    });
  }, []);

  return (
    <div>
      {children}
      <ToastContainer />
    </div>
  );
}

export default ChannelToastProvider;
