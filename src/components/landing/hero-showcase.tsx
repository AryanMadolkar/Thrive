import Image from "next/image";
import { cn } from "@/lib/utils";

const cards = [
  {
    title: "Learning to build something",
    tag: "#Building",
    image:
      "https://images.unsplash.com/photo-1498050108023-c3279e83f603?auto=format&fit=crop&w=900&q=80",
    className: "md:translate-y-2",
  },
  {
    title: "Training for my first marathon",
    tag: "#Fitness",
    image:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=900&q=80",
    className: "md:-translate-y-4 md:scale-[1.02]",
  },
  {
    title: "Becoming a better photographer",
    tag: "#Creativity",
    image:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=900&q=80",
    className: "md:translate-y-6",
  },
];

export function HeroShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-lg md:max-w-none">
      <div className="absolute -inset-6 rounded-[28px] bg-[radial-gradient(circle_at_30%_20%,#ebe8e3,transparent_55%)]" />
      <div className="relative grid gap-3 sm:grid-cols-2 sm:gap-4">
        {cards.map((card, i) => (
          <article
            key={card.title}
            className={cn(
              "overflow-hidden border border-border/90 bg-white",
              i === 0 ? "sm:col-span-2 sm:max-w-[92%]" : "",
              card.className
            )}
          >
            <div className="relative aspect-[5/4] overflow-hidden bg-warm">
              <Image
                src={card.image}
                alt=""
                fill
                className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 420px"
                priority={i === 0}
              />
            </div>
            <div className="space-y-1.5 px-3.5 py-3">
              <p className="text-[11px] text-subtle">{card.tag}</p>
              <h3 className="text-[15px] font-medium leading-snug tracking-[-0.02em]">
                {card.title}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
