import { routes, type VercelConfig } from '@vercel/config/v1';

const BACKEND_URL = process.env.BACKEND_URL;

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite(
      '/backend-api/:path*',
      `${BACKEND_URL}/:path*`
    ),
  ],
};