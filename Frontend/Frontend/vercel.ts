const backendUrl = process.env.BACKEND_URL;

if (!backendUrl) {
  throw new Error('BACKEND_URL must be configured in Vercel environment variables');
}

export default {
  rewrites: [
    {
      source: '/backend-api/(.*)',
      destination: `${backendUrl}/$1`,
    },
  ],
};