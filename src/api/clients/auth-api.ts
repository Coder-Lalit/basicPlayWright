import { APIRequestContext, expect } from '@playwright/test';
import { LoginRequest, LoginResponse } from '@/models/user';

export class AuthApi {
  constructor(private request: APIRequestContext, private baseURL: string) {}

  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await this.request.post(`${this.baseURL}/api/login`, {
      data: { username, password } as LoginRequest,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('token');
    return body as LoginResponse;
  }
}
