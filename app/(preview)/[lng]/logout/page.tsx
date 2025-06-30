"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { logoutAction } from "./actions";

export default function LogoutPage() {
  const params = useParams();
  const lng = params.lng as string;
  const router = useRouter();
  useEffect(() => {
    (async () => {
      await logoutAction();
      router.replace(`/${lng}/login`);
    })();
  }, [lng, router]);
  return null;
}
