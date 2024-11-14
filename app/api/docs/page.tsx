// app/api/docs/page.tsx
import { getApiDocs } from '@/app/lib/swagger'
import ReactSwagger from '@/app/components/ReactSwagger'  // Import directly

export default async function ApiDoc() {
  const spec = await getApiDocs()
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  )
}
