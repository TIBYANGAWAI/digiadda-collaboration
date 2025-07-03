
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createSupabaseServerClient = () => {
  // You need to provide req and res objects as expected by createPagesServerClient
  // In middleware, you may not have access to req/res, so you might need to use createServerComponentClient instead
  // Here's an example using createServerComponentClient if you are in a server component/middleware context:
  // import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
  // return createServerComponentClient({ cookies })

  // If you do have req and res, pass them like this:
  // return createPagesServerClient({ req, res })

  throw new Error('createPagesServerClient requires req and res. Use createServerComponentClient for middleware/server components.');
}
