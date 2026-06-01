import Image from "next/image";

const projects = [
  {
    title: "Campaign Concept",
    image: "/images/placeholder-work-1.svg",
  },
  {
    title: "Brand Refresh",
    image: "/images/placeholder-work-2.svg",
  },
  {
    title: "Print System",
    image: "/images/placeholder-work-3.svg",
  },
];

export function RecentWorkSection() {
  return (
    <section id="work" className="section-shell">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="eyebrow">Recent Work</p>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Placeholder projects ready for real case studies.
          </h2>
        </div>
        <a
          href="#contact"
          className="w-fit rounded-full border border-accent/45 px-5 py-3 text-sm font-semibold text-white transition hover:border-accent hover:bg-accent/15"
        >
          Plan a Project
        </a>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {projects.map((project) => (
          <article key={project.title} className="glow-card overflow-hidden">
            <Image
              src={project.image}
              alt={`${project.title} placeholder image`}
              width={720}
              height={520}
              className="aspect-[1.38] w-full object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-white">{project.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Short placeholder summary for the project, challenge, and visual
                direction.
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
