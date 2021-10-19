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
      assigner: Member;
    }[];
  };

  type TaskAssignment = {
    task: Task;
    assignments: {
      id: number;
      order: number;
      assigner: Member;
    }[];
  };

  type Apartment = {
    id: number;
    name: string;
    admin: Member;
    members: Member[];
    task_requests: Member[];
    task_assignments: Member[];
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
}

export {};
