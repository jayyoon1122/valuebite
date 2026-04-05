import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { cities, countries } from '@valuebite/db';
import { bootstrapCity } from '../services/data-bootstrap';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

export async function bootstrapRoutes(app: FastifyInstance) {
  const db = (app as any).db;

  // Bootstrap a city with Google Places data
  app.post('/city/:cityId', async (request, reply) => {
    if (!GOOGLE_PLACES_API_KEY) {
      return reply.status(503).send({
        success: false,
        error: 'Google Places API key not configured. Set GOOGLE_PLACES_API_KEY.',
      });
    }

    const { cityId } = request.params as { cityId: string };
    const [city] = await db.select().from(cities).where(eq(cities.id, parseInt(cityId))).limit(1);
    if (!city) return reply.status(404).send({ success: false, error: 'City not found' });

    const [country] = await db.select().from(countries).where(eq(countries.id, city.countryId!)).limit(1);
    if (!country) return reply.status(404).send({ success: false, error: 'Country not found' });

    const cityName = city.name.en || Object.values(city.name)[0] || 'Unknown';

    const stats = await bootstrapCity(
      cityName,
      city.lat,
      city.lng,
      country.code,
      GOOGLE_PLACES_API_KEY,
      db,
    );

    return { success: true, data: { city: cityName, country: country.code, ...stats } };
  });

  // Get bootstrap status for all cities
  app.get('/status', async () => {
    const allCities = await db
      .select({
        id: cities.id,
        name: cities.name,
        isActive: cities.isActive,
        restaurantCount: cities.restaurantCount,
        countryCode: countries.code,
      })
      .from(cities)
      .innerJoin(countries, eq(cities.countryId, countries.id));

    return {
      success: true,
      data: allCities.map((c: any) => ({
        id: c.id,
        name: c.name.en || Object.values(c.name)[0],
        country: c.countryCode,
        isActive: c.isActive,
        restaurantCount: c.restaurantCount,
      })),
    };
  });
}
