import Image from "next/image";
import Link from "next/link";

const journeys = [
  {
    title: "Learning a new language",
    tag: "#Learning",
    image:
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Building a startup",
    tag: "#Building",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Running a marathon",
    tag: "#Fitness",
    image:
      "https://images.unsplash.com/photo-1452626038306-9bccaa873cae?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Learning photography",
    tag: "#Creativity",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Exploring new places",
    tag: "#Travel",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Improving at something creative",
    tag: "#Creativity",
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80",
  },
];

export function DiscoverGrid() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {journeys.map((j, i) => (
          <article
            key={j.title}
            className={i % 2 === 0 ? "bg-white" : "bg-[#f7f6f4]"}
          >
            <div className="relative aspect-square overflow-hidden bg-warm">
              <Image
                src={j.image}
                alt=""
                fill
                className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="px-4 py-3.5">
              <p className="text-[12px] text-subtle">{j.tag}</p>
              <h3 className="mt-1.5 text-[16px] font-medium leading-snug tracking-[-0.02em]">
                {j.title}
              </h3>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link
          href="/discover"
          className="inline-flex h-11 items-center rounded-full border border-border bg-white px-6 text-sm font-semibold transition-colors hover:bg-hover"
        >
          Explore all journeys
        </Link>
      </div>
    </div>
  );
}
