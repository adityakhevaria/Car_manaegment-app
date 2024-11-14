import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { v2 as cloudinary } from 'cloudinary'
import { authOptions } from '../auth/[...nextauth]/route'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

interface CarData {
  title: string
  description: string
  images: string[]
  carType: string
  company: string
  dealer: string
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, description, images, carType, company, dealer }: CarData = body

    if (!title || !description || !images || !carType || !company || !dealer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (images.length > 10) {
      return NextResponse.json({ error: 'Maximum 10 images allowed' }, { status: 400 })
    }

    const uploadedImages = await Promise.all(
      images.map((image: string) => cloudinary.uploader.upload(image))
    )

    const car = await prisma.car.create({
      data: {
        title,
        description,
        images: uploadedImages.map((image) => image.secure_url),
        carType,
        company,
        dealer,
        userId: session.user.id
      }
    })

    return NextResponse.json({ car })
  } catch (error) {
    console.error('Error creating car:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'An unexpected error occurred while adding the car.' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  try {
    const where = {
      userId: session.user.id,
      ...(search ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { carType: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } },
          { dealer: { contains: search, mode: 'insensitive' } },
        ]
      } : {})
    }

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