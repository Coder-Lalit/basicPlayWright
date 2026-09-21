import { v4 as uuidv4 } from 'uuid';

export const staticUsers = [
  { name: 'Alice Johnson', email: 'alice@demo.local', role: 'Admin' },
  { name: 'Bob Smith', email: 'bob@demo.local', role: 'Editor' },
];

export const createUserPayload = () => ({
  name: `Test User ${uuidv4().slice(0, 8)}`,
  email: `user-${uuidv4().slice(0, 8)}@demo.local`,
  role: 'Viewer' as const,
});

export const createProductPayload = (overrides: Partial<Record<string, unknown>> = {}) => ({
  name: `Test Product ${uuidv4().slice(0, 8)}`,
  category: 'Electronics',
  price: 199,
  stock: 10,
  status: 'Active' as const,
  ...overrides,
});
