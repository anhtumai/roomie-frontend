declare global {
  type Credential = {
    username: string;
    password: string;
  };
  type Account = {
    name: string;
    username: string;
    password: string;
  };
  type UserWithToken = {
    token: string;
    username: string;
    name: string;
    id: number;
    expiresAt: number;
  };

  type User = {
    id: number;
    username: string;
    name: string;
    apartment?: {
      id: number;
      name: string;
    };
  };

  type Member = {
    id: number;
    username: string;
    name: string;
  };

  type Task = {
    id: number;
    name: string;
    description: string;
    frequency: number;
    difficulty: number;
    start: string;
    end: string;
    creator_id: number;
  };

  type TaskRequest = {
    task: Task;
    requests: {
      id: number;
      state: "accepted" | "pending" | "rejected";
      assignee: Member;
    }[];
  };

  type TaskAssignment = {
    task: Task;
    assignments: {
      id: number;
      order: number;
      assignee: Member;
    }[];
  };

  type Apartment = {
    id: number;
    name: string;
    admin: Member;
    members: Member[];
    task_requests: TaskRequest[];
    task_assignments: TaskAssignment[];
  };

  type Invitation = {
    id: number;
    invitor: Member;
    invitee: Member;
    apartment: {
      id: number;
      name: string;
    };
  };

  type InvitationCollection = {
    sent: Invitation[];
    received: Invitation[];
  };

  type ChannelInvitationMessage = {
    state: "CREATED" | "CANCELED" | "ACCEPTED" | "REJECTED";
    invitor: string;
    invitee: string;
    apartment: string;
  };

  type ChannelApartmentMessage = {
    state: "LEFT";
    leaver: string;
  };

  type ChannelTaskMessage = {
    state: string;
    task: string;
  };

  interface ChannelCreateTaskMessage extends ChannelTaskMessage {
    state: "CREATED";
    creator: string;
  }

  interface ChannelAssignTaskMessage extends ChannelTaskMessage {
    state: "ASSIGNED";
    assignees: string[];
  }

  interface ChannelDeleteTaskMessage extends ChannelTaskMessage {
    state: "DELETED";
    deleter: string;
  }

  interface ChannelEditedTaskMessage extends ChannelTaskMessage {
    state: "EDITTED";
    updater: string;
  }

  interface ChannelReAssignedTaskMessage extends ChannelTaskMessage {
    state: "REASSIGNED";
    assigner: string;
  }
}

export {};
