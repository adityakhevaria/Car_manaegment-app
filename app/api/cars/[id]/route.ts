import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { v2 as cloudinary } from 'cloudinary'

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET(req: Request) {
  const url = new URL(req.url)
  const id = url.pathname.split('/').pop()  // Extract the `id` from the URL path

  if (!id) {
    return NextResponse.json({ error: 'Car ID is missing' }, { status: 400 })
  }

  const session = await getServerSession()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const car = await prisma.car.findUnique({
    where: {
      id: id,
      userId: session.user.id,
    },
  })

  if (!car) {
    return NextResponse.json({ error: 'Car not found' }, { status: 404 })
  }

  return NextResponse.json({ car })
}

export async function PUT(req: Request) {
  const url = new URL(req.url)
  const id = url.pathname.split('/').pop()  // Extract the `id` from the URL path

  if (!id) {
    return NextResponse.json({ error: 'Car ID is missing' }, { status: 400 })
  }

  const session = await getServerSession()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await req.json()
  const { title, description, images, carType, company, dealer } = body

  const car = await prisma.car.findUnique({
    where: {
      id: id,
      userId: session.user.id,
    },
  })

  if (!car) {
    return NextResponse.json({ error: 'Car not found' }, { status: 404 })
  }

  let uploadedImages = car.images

  if (images && images.length > 0) {
    uploadedImages = await Promise.all(
      images.map((image: string) => cloudinary.uploader.upload(image))
    ).then((results) => results.map((result) => result.secure_url))
  }

  const updatedCar = await prisma.car.update({
    where: {
      id: id,
    },
    data: {
      title: title || car.title,
      description: description || car.description,
      images: uploadedImages,
      carType: carType || car.carType,
      company: company || car.company,
      dealer: dealer || car.dealer,
    },
  })

  return NextResponse.json({ car: updatedCar })
}

export async function DELETE(req: Request) {
  const url = new URL(req.url)
  const id = url.pathname.split('/').pop()  // Extract the `id` from the URL path

  if (!id) {
    return NextResponse.json({ error: 'Car ID is missing' }, { status: 400 })
  }

  const session = await getServerSession()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const car = await prisma.car.findUnique({
    where: {
      id: id,
      userId: session.user.id,
    },
  })

  if (!car) {
    return NextResponse.json({ error: 'Car not found' }, { status: 404 })
  }

  await prisma.car.delete({
    where: {
      id: id,
    },
  })

  return NextResponse.json({ message: 'Car deleted successfully' })
}
