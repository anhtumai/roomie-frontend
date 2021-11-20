import axios from "axios";

import { constructConfig } from "./utils";

const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/api/accounts`;

type UpdateAccountResponseData = {
  id: number;
  name: string;
  username: string;
};

async function create(account: Account) {
  const response = await axios.post(baseUrl, account);
  return response.data;
}

async function update(
  token: string,
  accountId: number,
  updateAccountProperty: UpdateAccountProperty,
): Promise<UpdateAccountResponseData> {
  const config = constructConfig(token);
  const response = await axios.put(
    `${baseUrl}/${accountId}`,
    updateAccountProperty,
    config,
  );
  return response.data as UpdateAccountResponseData;
}

const accountService = {
  create,
  update,
};

export default accountService;
