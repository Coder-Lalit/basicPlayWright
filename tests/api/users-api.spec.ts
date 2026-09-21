import { test, expect } from '@/fixtures';
import { createUserPayload } from '@/test-data/users';

test.describe('@api', () => {
  test('creates and fetches users via API', async ({ authApi, userApi }) => {
    const login = await authApi.login('admin', 'admin123');
    const payload = createUserPayload();
    const user = await userApi.createUser(payload, login.token);

    expect(user).toHaveProperty('id');
    expect(user.email).toBe(payload.email);

    const users = await userApi.getUsers(login.token);
    expect(users.some((item) => item.id === user.id)).toBeTruthy();
  });

  test('updates and deletes a user via API', async ({ authApi, userApi }) => {
    const login = await authApi.login('admin', 'admin123');
    const created = await userApi.createUser(createUserPayload(), login.token);
    const updated = await userApi.updateUser(created.id, { role: 'Editor' }, login.token);
    expect(updated.role).toBe('Editor');

    const deleted = await userApi.deleteUser(created.id, login.token);
    expect(deleted.deleted).toBe(created.id);
  });
});
