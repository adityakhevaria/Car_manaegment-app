'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { Car } from '@/types/car' // Import the Car type

export default function CarDetail() {
  const params = useParams()
  const [car, setCar] = useState<Car | null>(null) // Use the Car type here
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [carType, setCarType] = useState('')
  const [company, setCompany] = useState('')
  const [dealer, setDealer] = useState('')
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // Memoize fetchCar to avoid recreating it on every render
  const fetchCar = useCallback(async () => {
    const response = await fetch(`/api/cars/${params.id}`)
    if (response.ok) {
      const data = await response.json()
      setCar(data.car)
      setTitle(data.car.title)
      setDescription(data.car.description)
      setCarType(data.car.carType)
      setCompany(data.car.company)
      setDealer(data.car.dealer)
      setLoading(false)
    }
  }, [params.id]) // Include `params.id` as a dependency

  useEffect(() => {
    fetchCar() // Call fetchCar on component mount
  }, [fetchCar]) // Add `fetchCar` as a dependency

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch(`/api/cars/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, carType, company, dealer }),
    })

    if (response.ok) {
      setIsEditing(false)
      setLoading(true) // Set loading before refetching to avoid UI flickers
      await fetchCar() // Fetch updated data
    }
  }

  const handleDelete = async () => {
    const response = await fetch(`/api/cars/${params.id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      router.push('/cars')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-2xl mx-auto">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={dealer}
            onChange={(e) => setDealer(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Save</button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white p-2 rounded ml-2">Cancel</button>
        </form>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">{car?.title}</h1>
          <p className="mb-4">{car?.description}</p>
          <p>Type: {car?.carType}</p>
          <p>Company: {car?.company}</p>
          <p>Dealer: {car?.dealer}</p>
          <div className="grid grid-cols-2 gap-4 my-4">
            {car?.images?.map((image: string, index: number) => (
              <Image key={index} src={image} alt={`Car image ${index + 1}`} width={300} height={200} className="rounded" />
            ))}
          </div>
          <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white p-2 rounded">Edit</button>
          <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded ml-2">Delete</button>
        </>
      )}
    </div>
  )
}
