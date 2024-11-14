'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function NewCar() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [carType, setCarType] = useState('')
  const [company, setCompany] = useState('')
  const [dealer, setDealer] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, images, carType, company, dealer }),
      })

      if (response.ok) {
        router.push('/cars')
      } else {
        const errorData = await response.text()
        let errorMessage
        try {
          const jsonError = JSON.parse(errorData)
          errorMessage = jsonError.error || 'An error occurred while adding the car.'
        } catch {
          errorMessage = errorData || 'An error occurred while adding the car.'
        }
        setError(errorMessage)
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Car</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="images">Images (up to 10)</Label>
          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
        </div>
        <div>
          <Label htmlFor="carType">Car Type</Label>
          <Input
            id="carType"
            type="text"
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="dealer">Dealer</Label>
          <Input
            id="dealer"
            type="text"
            value={dealer}
            onChange={(e) => setDealer(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">Add Car</Button>
      </form>
    </div>
  )
}