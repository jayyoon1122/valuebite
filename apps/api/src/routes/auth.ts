import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { users } from '@valuebite/db';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(1).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function authRoutes(app: FastifyInstance) {
  const db = (app as any).db;

  // Register
  app.post('/register', async (request, reply) => {
    const body = registerSchema.parse(request.body);
    const existing = await db.select().from(users).where(eq(users.email, body.email)).limit(1);
    if (existing.length > 0) {
      return reply.status(409).send({ success: false, error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(body.password, 10);
    const [user] = await db.insert(users).values({
      email: body.email,
      passwordHash,
      displayName: body.displayName,
      authProvider: 'email',
    }).returning();

    const token = app.jwt.sign({ id: user.id, email: user.email });
    return { success: true, data: { token, user: { id: user.id, email: user.email, displayName: user.displayName } } };
  });

  // Login
  app.post('/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);
    const [user] = await db.select().from(users).where(eq(users.email, body.email)).limit(1);
    if (!user || !user.passwordHash) {
      return reply.status(401).send({ success: false, error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) {
      return reply.status(401).send({ success: false, error: 'Invalid credentials' });
    }

    const token = app.jwt.sign({ id: user.id, email: user.email });
    return { success: true, data: { token, user: { id: user.id, email: user.email, displayName: user.displayName } } };
  });

  // Refresh
  app.post('/refresh', { preHandler: [(app as any).authenticate] }, async (request) => {
    const payload = (request as any).user;
    const token = app.jwt.sign({ id: payload.id, email: payload.email });
    return { success: true, data: { token } };
  });
}
