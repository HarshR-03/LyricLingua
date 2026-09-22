import { routes, type VercelConfig, deploymentEnv } from '@vercel/config/v1';

const BACKEND_URL = process.env.BACKEND_URL;

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite(
      '/backend-api/:path*',
      deploymentEnv('BACKEND_URL') + "/:path*"
    ),
  ],
};