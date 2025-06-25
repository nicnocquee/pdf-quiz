"use client";

import { english, indonesian } from "@/locales/.generated/server";
import { SupportedLanguage } from "@/locales/.generated/types";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { useParams } from "next/navigation";

export function Footer() {
  const params = useParams();
  const lng = (params.lng as SupportedLanguage) || "id";
  return (
    <motion.div
      className="flex flex-row items-center justify-center text-xs w-full space-x-2"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}>
      <div>
        Made by{" "}
        <NextLink
          target="_blank"
          href="https://www.hyperjump.tech"
          className="underline inline mx-1">
          Hyperjump Technology
        </NextLink>
      </div>
      <span>|</span>
      <div>
        <NextLink href="/id">{indonesian(lng)}</NextLink>
      </div>
      <span>|</span>
      <div>
        <NextLink href="/en">{english(lng)}</NextLink>
      </div>
    </motion.div>
  );
}
