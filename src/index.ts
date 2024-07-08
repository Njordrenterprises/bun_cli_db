import { Elysia, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { html } from '@elysiajs/html';
import { addUser, getUsers, getUserById } from './db';
import { adminPage, userDetails } from './admin';

const app = new Elysia()
  .use(swagger())
  .use(html())
  .get('/', () => 'Hello, World!')
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
  })
  .get('/admin', () => adminPage(), {
    response: t.String()
  })
  .listen(3000);

console.log(`Server is running at ${app.server?.hostname}:${app.server?.port}`);