'use client'

import { SessionProvider as Provider } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Session } from 'next-auth' // Import the correct Session type

type Props = {
  children: React.ReactNode
  session: Session | null // Use the correct type for the session
}

export function SessionProvider({ children, session }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Provider session={session}>
      {children}
    </Provider>
  )
}
