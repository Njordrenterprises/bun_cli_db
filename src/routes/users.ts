import { Elysia, t } from 'elysia';
import { addUser, getUsers } from '../db';
import { userDetails } from './admin';

export const usersRoutes = (app: Elysia) =>
  app
    .get('/users', () => getUsers())
    .post('/users', ({ body }) => {
      const newUser = addUser(body);
      return `
        <div>
          ID: ${newUser.id}, Name: ${newUser.name}, Email: ${newUser.email}
          <button hx-get="/users/${newUser.id}" hx-target="this" hx-swap="outerHTML">
            View Details
          </button>
        </div>
      `;
    }, {
      body: t.Object({
        name: t.String(),
        email: t.String(),
      }),
    })
    .get('/users/:id', ({ params }) => {
      return userDetails(Number(params.id));
    });