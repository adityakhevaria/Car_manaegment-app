// app/api/docs/page.
import { getApiDocs } from '@/app/lib/swagger'
import ReactSwagger from '@/app/components/ReactSwagger'  // Import directly

export default async function ApiDoc() {
  const spec = await getApiDocs() as Record<string, unknown> // Type assertion
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  )
}

