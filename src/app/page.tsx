import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-16">
      <section className="flex flex-col gap-6">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Next.js + shadcn/ui
        </p>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Navigate repositories, ship updates, and keep your team aligned.
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            This starter includes a basic app shell, Tailwind, and shadcn/ui components so
            you can start building your product experience immediately.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button size="lg">Create workspace</Button>
          <Button size="lg" variant="outline">
            View docs
          </Button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Unified repo tracking",
            description:
              "Track active branches, issues, and reviews with a single unified view.",
          },
          {
            title: "Smart navigation",
            description:
              "Jump directly to the next task with contextual search and filters.",
          },
          {
            title: "Team visibility",
            description:
              "Share progress updates and keep stakeholders in the loop instantly.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="flex flex-col gap-3 rounded-2xl border bg-card p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold">{card.title}</h2>
            <p className="text-sm text-muted-foreground">{card.description}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border bg-muted/40 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Ready for your first module?</h3>
            <p className="text-sm text-muted-foreground">
              Add more shadcn/ui components with a single command.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary">Add components</Button>
            <Button variant="ghost">Learn patterns</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
