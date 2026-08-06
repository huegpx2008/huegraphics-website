import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

type PublicDocumentLayoutProps = {
  eyebrow: string;
  title: string;
  introduction: string;
  children: ReactNode;
};

type DocumentSectionProps = {
  title: string;
  children: ReactNode;
};

export function PublicDocumentLayout({
  eyebrow,
  title,
  introduction,
  children,
}: PublicDocumentLayoutProps) {
  return (
    <>
      <Header />
      <main className="bg-[#f4f8fc] text-[#314154]">
        <section className="relative isolate overflow-hidden px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_18%,rgba(31,115,190,0.16),transparent_30rem),linear-gradient(180deg,#ffffff,#f4f8fc)]" />
          <div className="mx-auto max-w-5xl">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-5 max-w-4xl font-['Arial_Narrow','Aptos_Narrow','HelveticaNeue-CondensedBold','Helvetica_Neue',Arial,sans-serif] text-4xl font-black uppercase leading-[0.94] text-[#07111f] sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#405166] sm:text-lg">
              {introduction}
            </p>
          </div>
        </section>

        <section className="px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24">
          <article className="mx-auto max-w-5xl rounded-sm bg-white p-6 shadow-[0_22px_65px_rgba(7,17,31,0.12)] ring-1 ring-black/10 sm:p-9 lg:p-12">
            {children}
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
}

export function DocumentSection({ title, children }: DocumentSectionProps) {
  return (
    <section className="border-t border-[#d7e0e9] py-8 first:border-t-0 first:pt-0 last:pb-0">
      <h2 className="text-xl font-black uppercase tracking-[0.02em] text-[#07111f] sm:text-2xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-[#405166] sm:text-base sm:leading-8">
        {children}
      </div>
    </section>
  );
}
