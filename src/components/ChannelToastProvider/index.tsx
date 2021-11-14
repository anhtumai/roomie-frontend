import Pusher from "pusher-js";
import { ReactNode, useEffect } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";

import useAuth from "../../contexts/auth";
import { makeChannel, pusherConstant } from "./constant";

function ChannelToastProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const queryClient = useQueryClient();
  const { authState } = useAuth() as { authState: UserWithToken };

  useEffect(() => {
    const pusher = new Pusher(String(process.env.REACT_APP_PUSHER_KEY), {
      cluster: "eu",
    });
    const channel = pusher.subscribe(makeChannel(authState.id));

    channel.bind(
      pusherConstant.INVITATION_EVENT,
      (data: ChannelInvitationMessage) => {
        const { state, invitor, invitee, apartment } = data;
        if (state === pusherConstant.CREATED_STATE) {
          toast.info(
            `User ${invitor} invites you to join apartment ${apartment}`,
          );
          queryClient.invalidateQueries("invitations");
        } else if (state === pusherConstant.CANCELED_STATE) {
          toast.info(`User ${invitor} cancelled the invitation`);
          queryClient.invalidateQueries("invitations");
        } else if (state === pusherConstant.REJECTED_STATE) {
          toast.info(`User ${invitee} rejected the invitation`);
          queryClient.invalidateQueries("invitations");
        } else if (state === pusherConstant.ACCEPTED_STATE) {
          if (invitor === authState.username) {
            toast.info(`User ${invitee} accepted the invitation`);
          } else if (invitee === authState.username) {
          } else {
            toast.info(`${invitor} added ${invitee} to the apartment`);
          }
          queryClient.invalidateQueries("apartment");
          queryClient.invalidateQueries("invitations");
        }
      },
    );

    channel.bind(
      pusherConstant.APARTMENT_EVENT,
      (data: ChannelApartmentMessage) => {
        const { state } = data;
        if (state === pusherConstant.LEAVE_STATE) {
          toast.info(`User ${data.leaver} left the apartment`);
          queryClient.invalidateQueries("apartment");
        }
      },
    );

    channel.bind(pusherConstant.TASK_EVENT, (data: ChannelTaskMessage) => {
      const { state } = data;
      if (state === pusherConstant.CREATED_STATE) {
        toast.info(
          `User ${(data as ChannelCreateTaskMessage).creator} assign task ${
            data.task
          } to you`,
        );
        queryClient.invalidateQueries("apartment");
      } else if (state === pusherConstant.ASSIGNED_STATE) {
        const { assignees } = data as ChannelAssignTaskMessage;
        if (assignees.includes(authState.username)) {
          toast.info(`All assignee(s) accept task ${data.task}`);
        }
        queryClient.invalidateQueries("apartment");
      } else if (state === pusherConstant.DELETED_STATE) {
        const { deleter } = data as ChannelDeleteTaskMessage;
        toast.info(`User ${deleter} deleted task ${data.task}`);
        queryClient.invalidateQueries("apartment");
      } else if (state === pusherConstant.EDITED_STATE) {
        const { updater } = data as ChannelEditedTaskMessage;
        toast.info(`User ${updater} updated task ${data.task}`);
        queryClient.invalidateQueries("apartment");
      } else if (state === pusherConstant.REASSIGNED_STATE) {
        const { assigner } = data as ChannelReAssignedTaskMessage;
        toast.info(`User ${assigner} re assigned task ${data.task}`);
        queryClient.invalidateQueries("apartment");
      }
    });
  }, []);

  return <>{children}</>;
}

export default ChannelToastProvider;
