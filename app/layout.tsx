import './globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from "next-auth/next"
import { SessionProvider } from './components/SessionProvider'
import Navbar from './components/Navbar'
import ErrorBoundary from './components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <SessionProvider session={session}>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}