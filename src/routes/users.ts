import { Elysia, t } from 'elysia';
import { addUser, getUsers } from '../db';

export const usersRoutes = (app: Elysia) =>
  app
    .get('/users', () => Bun.file('./public/users.html'))
    .post('/users', ({ body }) => {
      const newUser = addUser(body);
      return `
        <div class="card bg-base-200 shadow-xl mb-4">
          <div class="card-body flex flex-col items-center">
            <h2 class="card-title">ID: ${newUser.id}, Name: ${newUser.name}</h2>
            <p>Email: ${newUser.email}</p>
            <div class="card-actions mt-4 flex justify-center w-full">
              <button class="btn btn-error" hx-delete="/users/${newUser.id}" hx-target="closest .card" hx-swap="outerHTML">
                Delete
              </button>
            </div>
          </div>
        </div>
      `;
    }, {
      body: t.Object({
        name: t.String(),
        email: t.String(),
      }),
    });