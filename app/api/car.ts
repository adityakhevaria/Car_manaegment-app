// root/app/api/cars.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../lib/prisma';  // Import Prisma client

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const searchQuery = req.query.searchQuery?.toString() || ''; // Extract search query

      // Fetch cars and total count using Prisma
      const [cars, totalCount] = await Promise.all([
        prisma.car.findMany({
          where: {
            OR: [
              {
                title: {
                  contains: searchQuery,
                  mode: 'insensitive',  // Case-insensitive search
                },
              },
              {
                description: {
                  contains: searchQuery,
                  mode: 'insensitive',  // Case-insensitive search
                },
              },
              {
                carType: {
                  contains: searchQuery,
                  mode: 'insensitive',  // Case-insensitive search
                },
              },
              {
                company: {
                  contains: searchQuery,
                  mode: 'insensitive',  // Case-insensitive search
                },
              },
              {
                dealer: {
                  contains: searchQuery,
                  mode: 'insensitive',  // Case-insensitive search
                },
              },
            ],
          },
        }),
        prisma.car.count({
          where: {
            OR: [
              {
                title: {
                  contains: searchQuery,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: searchQuery,
                  mode: 'insensitive',
                },
              },
              {
                carType: {
                  contains: searchQuery,
                  mode: 'insensitive',
                },
              },
              {
                company: {
                  contains: searchQuery,
                  mode: 'insensitive',
                },
              },
              {
                dealer: {
                  contains: searchQuery,
                  mode: 'insensitive',
                },
              },
            ],
          },
        }),
      ]);

      // Send the result back to the client
      res.status(200).json({ cars, totalCount });
    } catch (error) {
      console.error('Error fetching cars:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Handle other HTTP methods (e.g., POST, PUT)
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
