"use client";

import { useRouter } from "next/navigation";

const returnUrlKey = "hue-catalog-return-url";

function fallbackReturnUrl() {
  if (window.location.search.includes("service=embroidery")) {
    return "/custom-catalog?service=embroidery";
  }

  return "/custom-catalog";
}

export function CatalogReturnLink() {
  const router = useRouter();

  function handleReturn() {
    const savedUrl = window.sessionStorage.getItem(returnUrlKey);

    router.push(savedUrl || fallbackReturnUrl());
  }

  return (
    <button
      type="button"
      onClick={handleReturn}
      className="text-sm font-black uppercase tracking-[0.12em] text-[#50a8ff] transition hover:text-white"
    >
      &lt;- Back
    </button>
  );
}
