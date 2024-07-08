import { Elysia, t } from 'elysia';
import { addUser, getUsers } from '../db';
import { userDetails } from './admin';

export const usersRoutes = (app: Elysia) =>
  app
    .get('/users', () => Bun.file('./public/users.html'))
    .post('/users', ({ body }) => {
      const newUser = addUser(body);
      return `
        <div class="card bg-base-200 shadow-xl mb-4">
          <div class="card-body">
            <h2 class="card-title">ID: ${newUser.id}, Name: ${newUser.name}</h2>
            <p>Email: ${newUser.email}</p>
            <div class="card-actions justify-end">
              <button class="btn btn-primary" hx-get="/users/${newUser.id}" hx-target="this" hx-swap="outerHTML">
                View Details
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
    })
    .get('/users/:id', ({ params }) => userDetails(Number(params.id)));