"use client"
import Link from "next/link";

export function LoginButton(){

    return (
      <Link
        href="/signin"
        className="rounded-full border border-[#20211e] px-5 py-2.5 text-sm font-semibold transition hover:bg-[#20211e] hover:text-white"
      >
        Sign in <span>↗</span>
      </Link>
    );
}