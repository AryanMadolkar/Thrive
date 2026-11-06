"use client";

import { useState } from "react";
import { saveOnboardingAction } from "@/lib/actions/onboarding";
import { DISCOVER_CATEGORY_CHIPS, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const interestOptions = DISCOVER_CATEGORY_CHIPS.filter((c) => c.value !== "ALL");

export function OnboardingFlow({ name }: { name: string }) {
  const [step, setStep] = useState(0);
  const [intents, setIntents] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [pending, setPending] = useState(false);

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(
      list.includes(value) ? list.filter((x) => x !== value) : [...list, value]
    );
  }

  async function finish(next: "/discover" | "/create", skip = false) {
    setPending(true);
    const fd = new FormData();
    if (!skip) {
      intents.forEach((i) => fd.append("intents", i));
      interests.forEach((i) => fd.append("interests", i));
    } else {
      fd.set("skip", "1");
    }
    fd.set("next", next);
    await saveOnboardingAction(fd);
  }

  return (
    <div className="mx-auto w-full max-w-lg px-5 py-12 md:py-20">
      <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-subtle">
        Step {step + 1} of 3
      </p>

      {step === 0 ? (
        <div className="mt-4 fade-in">
          <h1 className="text-[32px] font-semibold tracking-[-0.035em]">
            Welcome to THRIVE{name ? `, ${name.split(" ")[0]}` : ""}.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Every journey begins somewhere. What brings you here?
          </p>
          <div className="mt-8 space-y-3">
            {[
              {
                id: "document",
                title: "I want to document my journey",
                body: "Create a space for what you’re working towards.",
              },
              {
                id: "discover",
                title: "I want to discover other people’s journeys",
                body: "Explore stories and follow progress that inspires you.",
              },
            ].map((opt) => {
              const active = intents.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggle(intents, opt.id, setIntents)}
                  className={cn(
                    "w-full rounded-2xl border px-4 py-4 text-left transition-colors",
                    active
                      ? "border-foreground bg-foreground text-white"
                      : "border-border bg-white hover:bg-hover"
                  )}
                >
                  <p className="text-[15px] font-semibold">{opt.title}</p>
                  <p
                    className={cn(
                      "mt-1 text-[13px]",
                      active ? "text-white/75" : "text-muted"
                    )}
                  >
                    {opt.body}
                  </p>
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              className="text-sm text-muted hover:text-foreground"
              onClick={() => finish("/discover", true)}
              disabled={pending}
            >
              Skip for now
            </button>
            <Button
              type="button"
              className="rounded-full px-6"
              onClick={() => setStep(1)}
            >
              Continue
            </Button>
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="mt-4 fade-in">
          <h1 className="text-[32px] font-semibold tracking-[-0.035em]">
            What are you interested in?
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Pick a few topics. You can change this later — skipping is fine.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {interestOptions.map((opt) => {
              const active = interests.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggle(interests, opt.value, setInterests)}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
                    active
                      ? "border-foreground bg-foreground text-white"
                      : "border-border bg-white text-muted hover:text-foreground"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              className="text-sm text-muted hover:text-foreground"
              onClick={() => setStep(0)}
            >
              Back
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-full px-4 py-2 text-sm text-muted hover:text-foreground"
                onClick={() => setStep(2)}
              >
                Skip
              </button>
              <Button
                type="button"
                className="rounded-full px-6"
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-4 fade-in">
          <h1 className="text-[32px] font-semibold tracking-[-0.035em]">
            Ready when you are.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Create a journey when you feel ready — or start by exploring what
            others are working on.
          </p>
          <div className="mt-8 grid gap-3">
            <Button
              type="button"
              className="h-12 rounded-full"
              disabled={pending}
              onClick={() => finish("/create")}
            >
              Create your first journey
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="h-12 rounded-full"
              disabled={pending}
              onClick={() => finish("/discover")}
            >
              Explore journeys
            </Button>
          </div>
          <button
            type="button"
            className="mt-6 text-sm text-muted hover:text-foreground"
            disabled={pending}
            onClick={() => finish("/discover", true)}
          >
            Skip onboarding
          </button>
        </div>
      ) : null}
    </div>
  );
}
