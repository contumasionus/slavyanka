export const config = {
  port: parseInt(process.env.PORT || '3001'),
  host: process.env.HOST || '0.0.0.0',
  jwtSecret: process.env.JWT_SECRET || 'slavyanka-secret-key-change-in-production',
};
