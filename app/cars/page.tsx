'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Car = {
  id: string
  title: string
  description: string
  carType: string
  company: string
  dealer: string
}

export default function Cars() {
  const [cars, setCars] = useState<Car[]>([])
  const [search, setSearch] = useState('')
  const { status } = useSession()
  const router = useRouter()

  const fetchCars = useCallback(async () => {
    const response = await fetch(`/api/cars${search ? `?search=${search}` : ''}`)
    if (response.ok) {
      const data = await response.json()
      setCars(data.cars)
    }
  }, [search])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchCars()
    }
  }, [status, fetchCars, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Cars</h1>
      <input
        type="text"
        placeholder="Search cars..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cars.map((car: Car) => (
          <Link href={`/cars/${car.id}`} key={car.id} className="border p-4 rounded hover:shadow-lg">
            <h2 className="text-xl font-semibold">{car.title}</h2>
            <p>{car.description}</p>
            <p>Type: {car.carType}</p>
            <p>Company: {car.company}</p>
            <p>Dealer: {car.dealer}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
