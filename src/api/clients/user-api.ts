import { APIRequestContext, expect } from '@playwright/test';
import { User } from '@/models/user';

export class UserApi {
  constructor(private request: APIRequestContext, private baseURL: string) {}

  async createUser(payload: Partial<User>, token: string): Promise<User> {
    const response = await this.request.post(`${this.baseURL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
      data: payload,
    });

    expect(response.status()).toBe(201);
    return (await response.json()) as User;
  }

  async getUsers(token: string): Promise<User[]> {
    const response = await this.request.get(`${this.baseURL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    return (await response.json()) as User[];
  }

  async updateUser(userId: string, payload: Partial<User>, token: string): Promise<User> {
    const response = await this.request.put(`${this.baseURL}/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: payload,
    });
    expect(response.status()).toBe(200);
    return (await response.json()) as User;
  }

  async deleteUser(userId: string, token: string): Promise<{ deleted: string }> {
    const response = await this.request.delete(`${this.baseURL}/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    return (await response.json()) as { deleted: string };
  }
}
