import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { createDb } from '@valuebite/db';
import { authRoutes } from './routes/auth';
import { restaurantRoutes } from './routes/restaurants';
import { reviewRoutes } from './routes/reviews';
import { menuRoutes } from './routes/menus';
import { userRoutes } from './routes/users';
import { priceBracketRoutes } from './routes/price-brackets';
import { aiRoutes } from './routes/ai';
import { bootstrapRoutes } from './routes/bootstrap';
import { businessRoutes } from './routes/business';

const PORT = parseInt(process.env.PORT || '4000');
const HOST = process.env.HOST || '0.0.0.0';
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://valuebite:dev_password@localhost:5432/valuebite';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

async function main() {
  const app = Fastify({ logger: true });
  const db = createDb(DATABASE_URL);

  // Plugins
  await app.register(cors, { origin: true });
  await app.register(jwt, { secret: JWT_SECRET });

  // Decorate with DB
  app.decorate('db', db);

  // Auth decorator
  app.decorate('authenticate', async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch {
      reply.status(401).send({ success: false, error: 'Unauthorized' });
    }
  });

  // Health check
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.0.1',
  }));

  // API routes
  await app.register(authRoutes, { prefix: '/api/v1/auth' });
  await app.register(restaurantRoutes, { prefix: '/api/v1/restaurants' });
  await app.register(reviewRoutes, { prefix: '/api/v1/reviews' });
  await app.register(menuRoutes, { prefix: '/api/v1/menus' });
  await app.register(userRoutes, { prefix: '/api/v1/user' });
  await app.register(priceBracketRoutes, { prefix: '/api/v1/price-brackets' });
  await app.register(aiRoutes, { prefix: '/api/v1/ai' });
  await app.register(bootstrapRoutes, { prefix: '/api/v1/admin/bootstrap' });
  await app.register(businessRoutes, { prefix: '/api/v1/business' });

  // Start
  await app.listen({ port: PORT, host: HOST });
  console.log(`ValueBite API running at http://${HOST}:${PORT}`);
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
