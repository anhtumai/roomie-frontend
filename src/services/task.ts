import axios from "axios";

import { constructConfig } from "./utils";

const taskUrl = `${process.env.REACT_APP_BACKEND_URL}/api/tasks`;
const taskRequestUrl = `${process.env.REACT_APP_BACKEND_URL}/api/taskrequests`;

async function create(
  token: string,
  task: Omit<Task, "id" | "creator_id">,
  assigners: string[],
) {
  const config = constructConfig(token);
  const response = await axios.post(taskUrl, { ...task, assigners }, config);
  return response.data;
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

const taskService = {
  create,
  deleteOne,
  accept,
  reject,
};

export default taskService;
