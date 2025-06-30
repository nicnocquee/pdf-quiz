import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/generate-quiz (quiz generation API)
     * - api/generate-quiz-title (quiz title generation API)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|api/generate-quiz|api/generate-quiz-title|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
