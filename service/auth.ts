import axios from "axios";
import type { LoginRequest, LoginResponse } from "@/types/auth";

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const body: LoginRequest = { email, password };

  const { data } = await axios.post<LoginResponse>("/api/auth/login", body);

  return data;
}
