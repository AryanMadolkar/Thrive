import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";

const updates = [
  {
    day: "Day 12",
    body: "Finished a 10K this morning. Six weeks ago I could barely run two kilometres.",
    image:
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=800&q=80",
  },
  {
    day: "Day 8",
    body: "Rest day reflections. Progress isn’t linear — showing up still counts.",
  },
  {
    day: "Day 3",
    body: "Signed up for the race. A little nervous. Mostly excited.",
  },
];

export function ProductPreview() {
  return (
    <div className="overflow-hidden border border-border bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
      <div className="relative aspect-[21/9] min-h-[180px] bg-warm md:aspect-[2.4/1]">
        <Image
          src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1600&q=80"
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 960px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-8">
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/70">
            #Fitness · Illustrative preview
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
            Running my first marathon
          </h3>
          <p className="mt-1 text-sm text-white/80">Alex M. · Active</p>
        </div>
      </div>

      <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5 border-b border-border p-5 md:border-b-0 md:border-r md:p-7">
          <div className="flex items-start justify-between gap-4">
            <p className="max-w-md text-[14px] leading-relaxed text-muted">
              Documenting six months of training — building endurance, learning
              pacing, and preparing for race day.
            </p>
            <span className="shrink-0 rounded-full border border-foreground px-3.5 py-1.5 text-xs font-semibold">
              Follow
            </span>
          </div>

          <div className="space-y-4">
            {updates.map((u) => (
              <div key={u.day} className="border-t border-border/80 pt-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-subtle">
                  {u.day}
                </p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-foreground">
                  {u.body}
                </p>
                {u.image ? (
                  <div className="relative mt-3 aspect-[16/10] overflow-hidden bg-warm">
                    <Image
                      src={u.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 480px"
                    />
                  </div>
                ) : null}
                <div className="mt-3 flex items-center gap-4 text-[12px] text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Heart className="h-3.5 w-3.5" strokeWidth={1.75} /> 12
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.75} />{" "}
                    4
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#f7f6f4] p-5 md:p-7">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
            Encouragement
          </p>
          <div className="mt-4 space-y-4">
            {[
              {
                name: "Jordan",
                text: "That 10K is huge. Proud of you for sticking with it.",
              },
              {
                name: "Sam",
                text: "Rest days are part of the journey too. Keep going.",
              },
            ].map((c) => (
              <div key={c.name} className="border border-border/70 bg-white p-3.5">
                <p className="text-[13px] font-semibold">{c.name}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[12px] text-subtle">
            Example content for illustration — not live community activity.
          </p>
        </div>
      </div>
    </div>
  );
}
