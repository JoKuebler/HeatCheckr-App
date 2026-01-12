import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    apiBase: process.env.API_BASE || 'https://app-production-2fb0.up.railway.app/api/games',
  },
});
