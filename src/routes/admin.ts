import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { getUsers, getUserById } from '../db';
import type { User } from '../db';

const userListItem = (user: User): string => `
  <div class="card bg-base-200 shadow-xl mb-4">
    <div class="card-body">
      <h2 class="card-title">ID: ${user.id}, Name: ${user.name}</h2>
      <p>Email: ${user.email}</p>
      <div class="card-actions justify-end">
        <button class="btn btn-primary" hx-get="/users/${user.id}" hx-target="this" hx-swap="outerHTML">
          View Details
        </button>
      </div>
    </div>
  </div>
`;

const adminPage = (): string => {
  console.log("Rendering admin page");
  const userList = getUsers().map(user => userListItem(user)).join('');
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>Admin Page</title>
    <script src="https://unpkg.com/htmx.org@1.9.10"></script>
    <link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-base-100 text-base-content flex items-center justify-center min-h-screen">
    <div class="container mx-auto p-4 w-full max-w-md">
        <h1 class="text-3xl font-bold mb-8 text-primary text-center">Admin Page</h1>
        <div class="flex flex-col items-center gap-4 w-full">
            <div class="card bg-base-200 shadow-xl w-full">
                <div class="card-body">
                    <h2 class="card-title text-xl mb-4 text-center">Add New User</h2>
                    <form hx-post="/users" hx-target="#userList" hx-swap="beforeend" class="flex flex-col items-center gap-4 w-full">
                        <input type="text" name="name" placeholder="Name" required class="input input-bordered w-full" />
                        <input type="email" name="email" placeholder="Email" required class="input input-bordered w-full" />
                        <button type="submit" class="btn btn-primary w-full">Add User</button>
                    </form>
                </div>
            </div>
        </div>

        <h2 class="text-2xl font-bold mb-4 mt-8 text-center">User List</h2>
        <div id="userList" class="space-y-4 w-full">
            ${userList}
        </div>
    </div>
</body>
</html>`;
};

export const adminRoutes = (app: Elysia) =>
  app
    .use(html())
    .get('/admin', () => adminPage())
    .get('/admin/users/:id', ({ params }) => userDetails(Number(params.id)));

export function userDetails(id: number): string {
  const user = getUserById(id);
  if (!user) {
    return '<div class="alert alert-error">User not found</div>';
  }
  return `
    <div class="card bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl mb-4">User Details</h2>
        <p><strong>ID:</strong> ${user.id}</p>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
      </div>
    </div>
  `;
}