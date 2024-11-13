import { getApiDocs } from '@/app/lib/swagger'
import dynamic from 'next/dynamic'

const ReactSwagger = dynamic(() => import('@/app/components/ReactSwagger'), { ssr: false })

export default async function ApiDoc() {
  const spec = await getApiDocs()
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  )
}