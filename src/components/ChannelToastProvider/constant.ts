export function makeChannel(userId: number): string {
  return `notification-channel-${userId}`;
}

export const pusherConstant = {
  APARTMENT_EVENT: "apartment",
  INVITATION_EVENT: "invitation",
  TASK_EVENT: "task",

  CREATED_STATE: "CREATED",
  CANCELED_STATE: "CANCELED",
  REJECTED_STATE: "REJECTED",
  ACCEPTED_STATE: "ACCEPTED",
  LEAVE_STATE: "LEFT",
  ASSIGNED_STATE: "ASSIGNED",
  DELETED_STATE: "DELETED",
};
