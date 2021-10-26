import axios from "axios";

import { constructConfig } from "./utils";

const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/api/tasks`;

async function create(
  token: string,
  task: Omit<Task, "id" | "creator_id">,
  assigners: string[],
) {
  const config = constructConfig(token);
  const response = await axios.post(baseUrl, { ...task, assigners }, config);
  return response.data;
}

const taskService = {
  create,
};

export default taskService;
