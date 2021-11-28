import { ReactNode, useEffect } from "react";

import Pusher from "pusher-js";
import { toast } from "react-toastify";

import useAuth from "../../contexts/auth";
import { makeChannel } from "./utils";

import { pusherConstant } from "../../constants";
import useApartment from "../../contexts/apartment";
import useInvitations from "../../contexts/invitations";

function ChannelToastProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { authState } = useAuth() as { authState: UserWithToken };
  const { apartment, setApartment, invalidateApartment } = useApartment();
  const { invalidateInvitationCollection } = useInvitations();

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
        } else if (state === pusherConstant.CANCELED_STATE) {
          toast.info(`User ${invitor} cancelled the invitation`);
        } else if (state === pusherConstant.REJECTED_STATE) {
          toast.info(`User ${invitee} rejected the invitation`);
        } else if (state === pusherConstant.ACCEPTED_STATE) {
          if (invitor === authState.username) {
            toast.info(`User ${invitee} accepted the invitation`);
          } else if (invitee === authState.username) {
          } else {
            toast.info(`${invitor} added ${invitee} to the apartment`);
          }
          invalidateApartment();
        }
        invalidateInvitationCollection();
      },
    );

    channel.bind(
      pusherConstant.APARTMENT_EVENT,
      (data: ChannelApartmentMessage) => {
        const { state } = data;
        if (state === pusherConstant.LEAVE_STATE) {
          const { leaver } = data as ChannelLeftApartmentMessage;
          toast.info(`User ${leaver} left the apartment`);
          invalidateApartment();
        } else if (state === pusherConstant.EDITED_STATE) {
          const { apartmentName } = data as ChannelEditedApartmentMessage;
          toast.info(`Admin renamed the apartment to ${apartmentName}`);
          if (apartment) {
            setApartment({
              ...apartment,
              name: apartmentName,
            });
          } else {
            invalidateApartment();
          }
        } else if (state === pusherConstant.MEMBER_REMOVED_STATE) {
          const { removedMember } =
            data as ChannelMemberRemovedApartmentMessage;

          if (authState.username === removedMember) {
            toast.info("Admin removed you from the apartment");
            setApartment("");
          } else {
            toast.info(`Admin removed ${removedMember} from the apartment`);
            invalidateApartment();
          }
        }
      },
    );

    channel.bind(pusherConstant.TASK_EVENT, (data: ChannelTaskMessage) => {
      const { state } = data;
      if (state === pusherConstant.CREATED_STATE) {
        const { creator, assignees } = data as ChannelCreateTaskMessage;
        if (assignees.includes(authState.username)) {
          toast.info(`User ${creator} assigned task ${data.task} to you`);
        }

        invalidateApartment();
      } else if (state === pusherConstant.ASSIGNED_STATE) {
        const { assignees } = data as ChannelAssignTaskMessage;
        if (assignees.includes(authState.username)) {
          toast.info(`All assignee(s) accepted task ${data.task}`);
        }
        invalidateApartment();
      } else if (state === pusherConstant.DELETED_STATE) {
        const { deleter } = data as ChannelDeleteTaskMessage;
        toast.info(`User ${deleter} deleted task ${data.task}`);
        invalidateApartment();
      } else if (state === pusherConstant.EDITED_STATE) {
        const { updater } = data as ChannelEditedTaskMessage;
        toast.info(`User ${updater} updated task ${data.task}`);
        invalidateApartment();
      } else if (state === pusherConstant.REASSIGNED_STATE) {
        const { assigner } = data as ChannelReAssignedTaskMessage;
        toast.info(`User ${assigner} re assigned task ${data.task}`);
        invalidateApartment();
      } else if (state === pusherConstant.REORDERED_STATE) {
        const { assigner } = data as ChannelReorderedTaskMessage;
        toast.info(`User ${assigner} reordered task ${data.task}`);
        invalidateApartment();
      }
    });

    channel.bind(
      pusherConstant.TASK_REQUEST_EVENT,
      (data: ChannelTaskRequestMessage) => {
        if (apartment) {
          const { id, state } = data;
          const updatedApartment: Apartment = JSON.parse(
            JSON.stringify(apartment),
          );
          for (const taskRequest of updatedApartment.task_requests) {
            const updatedRequest = taskRequest.requests.find(
              (_request) => _request.id === id,
            );
            if (updatedRequest) {
              updatedRequest.state = state;
              setApartment(updatedApartment);
              break;
            }
          }
        }
      },
    );
  }, []);

  return <>{children}</>;
}

export default ChannelToastProvider;
