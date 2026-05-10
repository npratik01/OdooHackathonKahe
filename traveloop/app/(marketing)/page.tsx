import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MarketingHomePage() {
  return (
    <div className="from-background via-background to-muted/30 bg-gradient-to-b">
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-sm font-medium">
            Premium travel ops platform
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Plan, price, and run trips with a modern SaaS workflow.
          </h1>
          <p className="text-muted-foreground mt-4 text-base text-pretty md:text-lg">
            Traveloop is a scalable foundation for building a travel management
            product—designed with App Router, shadcn/ui, Prisma, and PostgreSQL.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/app">Launch Dashboard</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#pricing">See Pricing</Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Operational clarity</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Route groups, reusable layouts, and a scalable folder structure
              for fast iteration.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Real database layer</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Prisma + PostgreSQL ready from day one, with migration scripts and
              a typed client.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Premium UI baseline</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Responsive sidebar + navbar shell, dark mode, and shadcn/ui
              components.
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Pricing</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Placeholder tiers—wire billing later.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { name: "Starter", price: "$19", desc: "For small operators" },
            { name: "Growth", price: "$49", desc: "For growing teams" },
            { name: "Scale", price: "$99", desc: "For multi-location ops" },
          ].map((tier) => (
            <Card key={tier.name} className="relative">
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">
                  {tier.price}
                  <span className="text-muted-foreground text-base font-normal">
                    /mo
                  </span>
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  {tier.desc}
                </p>
                <Button className="mt-6 w-full" variant="outline" disabled>
                  Coming soon
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
