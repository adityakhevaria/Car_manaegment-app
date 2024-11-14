import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { getServerSession } from 'next-auth/next'

// GET handler to fetch cars with search and pagination
export async function GET(req: Request) {
  const session = await getServerSession()  // Use getServerSession directly without importing authOptions
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  try {
    // Construct where filter with search criteria and pagination
    const where: Prisma.CarWhereInput = {
      userId: session.user.id,
      ...(search ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { carType: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } },
          { dealer: { contains: search, mode: 'insensitive' } },
        ]
      } : {}),
    }

    // Fetch cars with pagination
    const [cars, totalCount] = await Promise.all([
      prisma.car.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.car.count({ where })
    ])

    return NextResponse.json({
      cars,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      }
    })
  } catch (error) {
    console.error('Error fetching cars:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'An unexpected error occurred while fetching cars.' }, { status: 500 })
  }
}
