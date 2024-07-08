import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { getUsers, getUserById } from '../db';
import type { User } from '../db';

const userListItem = (user: User): string => `
  <div>
    ID: ${user.id}, Name: ${user.name}, Email: ${user.email}
    <button hx-get="/users/${user.id}" hx-target="this" hx-swap="outerHTML">
      View Details
    </button>
  </div>
`;

const adminPage = (): string => {
  const userList = getUsers().map(user => userListItem(user)).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Page</title>
    <script src="https://unpkg.com/htmx.org@1.9.10"></script>
</head>
<body>
    <h1>Admin Page</h1>
    
    <h2>Add User</h2>
    <form hx-post="/users" hx-target="#userList" hx-swap="beforeend">
        <input type="text" name="name" placeholder="Name" required>
        <input type="email" name="email" placeholder="Email" required>
        <button type="submit">Add User</button>
    </form>

    <h2>User List</h2>
    <div id="userList">
        ${userList}
    </div>
</body>
</html>`;
};

export const adminRoutes = (app: Elysia) =>
  app
    .get('/admin', () => adminPage())
    .get('/admin/users/:id', ({ params }) => userDetails(Number(params.id)));

export function userDetails(id: number): string {
  const user = getUserById(id);
  if (!user) {
    return '<div>User not found</div>';
  }
  return `
    <div>
      <h2>User Details</h2>
      <p>ID: ${user.id}</p>
      <p>Name: ${user.name}</p>
      <p>Email: ${user.email}</p>
    </div>
  `;
}