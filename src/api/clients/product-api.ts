import { APIRequestContext, expect } from '@playwright/test';
import { Product } from '@/models/user';

export class ProductApi {
  constructor(private request: APIRequestContext, private baseURL: string) {}

  async createProduct(payload: Partial<Product>, token: string): Promise<Product> {
    const response = await this.request.post(`${this.baseURL}/api/products`, {
      headers: { Authorization: `Bearer ${token}` },
      data: payload,
    });

    expect(response.status()).toBe(201);
    return (await response.json()) as Product;
  }

  async getProducts(token: string): Promise<Product[]> {
    const response = await this.request.get(`${this.baseURL}/api/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    return (await response.json()) as Product[];
  }

  async updateProduct(productId: string, payload: Partial<Product>, token: string): Promise<Product> {
    const response = await this.request.put(`${this.baseURL}/api/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: payload,
    });
    expect(response.status()).toBe(200);
    return (await response.json()) as Product;
  }

  async deleteProduct(productId: string, token: string): Promise<{ deleted: string }> {
    const response = await this.request.delete(`${this.baseURL}/api/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    return (await response.json()) as { deleted: string };
  }

  async getSlowProducts(token: string, delay = 3000): Promise<Product[]> {
    const response = await this.request.get(`${this.baseURL}/api/slow-products?delay=${delay}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    return (await response.json()) as Product[];
  }
}
