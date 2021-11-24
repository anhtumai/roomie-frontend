import axios from "axios";

import { constructConfig } from "./utils";

const taskUrl = `${process.env.REACT_APP_BACKEND_URL}/api/tasks`;
const taskRequestUrl = `${process.env.REACT_APP_BACKEND_URL}/api/taskrequests`;

async function create(
  token: string,
  task: Omit<Task, "id" | "creator_id">,
  assignees: string[],
): Promise<TaskRequest> {
  const config = constructConfig(token);
  const response = await axios.post(taskUrl, { ...task, assignees }, config);
  return response.data as unknown as TaskRequest;
}

async function deleteOne(token: string, taskId: number) {
  const config = constructConfig(token);
  const response = await axios.delete(`${taskUrl}/${taskId}`, config);
  return response.data;
}

async function accept(token: string, taskRequestId: number) {
  const config = constructConfig(token);
  const response = await axios.patch(
    `${taskRequestUrl}/${taskRequestId}`,
    { state: "accepted" },
    config,
  );
  return response.data;
}

async function reject(token: string, taskRequestId: number) {
  const config = constructConfig(token);
  const response = await axios.patch(
    `${taskRequestUrl}/${taskRequestId}`,
    { state: "rejected" },
    config,
  );
  return response.data;
}

async function update(
  token: string,
  taskId: number,
  task: Omit<Task, "id" | "creator_id">,
) {
  const config = constructConfig(token);

  const response = await axios.put(`${taskUrl}/${taskId}`, task, config);
  return response.data;
}

async function updateAssignees(
  token: string,
  taskId: number,
  assigneeUsernames: string[],
): Promise<TaskRequest> {
  const config = constructConfig(token);
  const response = await axios.put(
    `${taskUrl}/${taskId}/assignees`,
    {
      assignees: assigneeUsernames,
    },
    config,
  );
  return response.data as unknown as TaskRequest;
}

async function updateOrder(
  token: string,
  taskId: number,
  assigneeUsernames: string[],
): Promise<TaskAssignment> {
  const config = constructConfig(token);
  const response = await axios.put(
    `${taskUrl}/${taskId}/order`,
    { order: assigneeUsernames },
    config,
  );
  return response.data as unknown as TaskAssignment;
}

const taskService = {
  create,
  deleteOne,
  accept,
  reject,
  update,
  updateAssignees,
  updateOrder,
};

export default taskService;
