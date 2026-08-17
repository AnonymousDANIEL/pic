"use client";

import dynamic from "next/dynamic";

const PosterStudio = dynamic(() => import("@/components/PosterStudio"), {
  ssr: false,
  loading: () => (
    <main className="loading-screen">
      <div className="loading-mark">V</div>
      <p>Preparing your poster studio…</p>
    </main>
  ),
});

export default function Home() {
  return <PosterStudio />;
}
