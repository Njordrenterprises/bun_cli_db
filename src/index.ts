import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { html } from '@elysiajs/html';
import { usersRoutes } from './routes/users';
import { adminRoutes } from './routes/admin';

const app = new Elysia()
  .use(swagger())
  .use(html())
  .get('/', () => 'Hello, World!')
  .use(usersRoutes)
  .use(adminRoutes)
  .listen(3000);

console.log(`Server is running at ${app.server?.hostname}:${app.server?.port}`);