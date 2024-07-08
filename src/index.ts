import '../public/styles.css';
import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { html } from '@elysiajs/html';
import { usersRoutes } from './routes/users';
import { adminRoutes } from './routes/admin';
import { staticPlugin } from '@elysiajs/static'

const app = new Elysia()
  .use(swagger())
  .use(html())
  .use(staticPlugin({
    assets: 'public',
    prefix: '/'
  }))
  .onRequest((context) => {
    context.set.headers['Cache-Control'] = 'no-store, max-age=0';
  })
  .get('/', () => Bun.file('./public/index.html'))
  .use(usersRoutes)
  .use(adminRoutes)
  .get('/test', () => `
    <!DOCTYPE html>
    <html lang="en" data-theme="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Route</title>
        <link rel="stylesheet" href="/styles.css">
    </head>
    <body class="bg-base-100 text-base-content">
        <div class="container mx-auto p-4">
            <h1 class="text-4xl font-bold mb-8 text-primary">Test Route</h1>
            <div class="btn btn-primary">Test Button</div>
            <div class="alert alert-error">Test Alert</div>
        </div>
    </body>
    </html>
  `)
  .listen(3000);

console.log(`Server is running at ${app.server?.hostname}:${app.server?.port}`);