import type { LoginRequest, LoginResponse, SignupRequest } from "@/types/auth";
import api from "@/lib/api";

export async function signup(body: SignupRequest): Promise<void> {
  await api.post("auth/register", body);
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const body: LoginRequest = { email, password };

  const { data } = await api.post<LoginResponse>("auth/login", body);

  return data;
}
