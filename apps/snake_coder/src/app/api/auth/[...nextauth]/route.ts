import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth";

// NextAuth route handler (GET/POST) using the shared auth options.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
