import Link from "next/link";
import { Button } from "./ui/button";
import { SupportedLanguage } from "@/locales/.generated/types";
import { createClient } from "@/lib/supabase/server";

interface UserSessionProps {
  lng: SupportedLanguage;
}

const UserSession = async ({ lng }: UserSessionProps) => {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <div className="flex justify-end items-center px-4 py-2 gap-2">
      {user ? (
        <>
          <span className="text-sm text-muted-foreground">{user.email}</span>
          {/* Logout must be a client action, so link to /logout route */}
          <form action={`/${lng}/logout`} method="post">
            <Button size="sm" variant="outline" type="submit">
              Logout
            </Button>
          </form>
        </>
      ) : (
        <>
          <Link
            href={`/${lng}/login`}
            className="text-blue-500 dark:text-blue-400 hover:underline text-sm">
            Login
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            href={`/${lng}/register`}
            className="text-blue-500 dark:text-blue-400 hover:underline text-sm">
            Register
          </Link>
        </>
      )}
    </div>
  );
};

export default UserSession;
