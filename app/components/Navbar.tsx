// app/components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Car Management</Link>
        <div>
          {session ? (
            <>
              <Link href="/cars" className="mr-4">My Cars</Link>
              <Link href="/cars/new" className="mr-4">Add Car</Link>
              <button onClick={() => signOut()}>Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="mr-4">Login</Link>
              <Link href="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}