import { HealthCheckButton } from "./_components/health-check-button";

export default function MarketingHome() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Bovion</h1>
      <p className="text-lg text-slate-600 dark:text-slate-300">
        Em construção — gestão pecuária e financeira de bovinos de corte.
      </p>
      <HealthCheckButton />
    </main>
  );
}
