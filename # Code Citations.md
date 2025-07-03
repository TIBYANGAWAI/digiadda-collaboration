# Code Citations

## License: Apache_2_0
https://github.com/supabase/supabase/tree/11f728889ff6e9576cd2bb4b1096b962e6acc38a/apps/docs/pages/guides/auth/oauth-with-pkce-flow-for-ssr.mdx

```
@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession()
  return
```

