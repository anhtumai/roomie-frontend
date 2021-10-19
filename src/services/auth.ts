import axios from "axios";

const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`;

async function login(credentials: Credential): Promise<UserWithToken> {
  const response = await axios.post<Credential, { data: UserWithToken }>(
    baseUrl,
    credentials,
  );
  return response.data;
}

const authService = { login };

export default authService;
