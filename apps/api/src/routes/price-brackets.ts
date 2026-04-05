import { FastifyInstance } from 'fastify';
import { eq } from 'drizzle-orm';
import { priceBrackets, countries } from '@valuebite/db';

export async function priceBracketRoutes(app: FastifyInstance) {
  const db = (app as any).db;

  // Get all brackets for a country
  app.get('/country/:countryCode', async (request) => {
    const { countryCode } = request.params as { countryCode: string };

    const [country] = await db.select().from(countries)
      .where(eq(countries.code, countryCode.toUpperCase()))
      .limit(1);

    if (!country) {
      return { success: false, error: 'Country not found' };
    }

    const brackets = await db.select().from(priceBrackets)
      .where(eq(priceBrackets.countryId, country.id));

    return {
      success: true,
      data: {
        country,
        brackets: brackets.map(b => ({
          ...b,
          maxPrice: parseFloat(b.maxPrice),
        })),
      },
    };
  });

  // Get all countries
  app.get('/countries', async () => {
    const allCountries = await db.select().from(countries);
    return { success: true, data: allCountries };
  });
}
