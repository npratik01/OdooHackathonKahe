"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Compass, Globe2, Sparkles, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } },
} as const;

const STAGGER_CHILDREN_VARIANTS = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
} as const;

export default function MarketingHomePage() {
  return (
    <div className="relative min-h-screen bg-background">
      
      {/* ── Hero Section (Cinematic) ────────────────────────────────────────── */}
      <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center">
        {/* Full-screen Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_cinematic.png"
            alt="Cinematic Travel Landscape"
            fill
            className="object-cover object-center scale-105 animate-in slide-in-from-bottom-4 duration-1000"
            priority
          />
          {/* Gradient Overlays for readability and mood */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/30" />
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
        </div>

        <motion.div 
          className="relative z-10 mx-auto max-w-5xl px-4 text-center mt-16"
          initial="hidden"
          animate="show"
          variants={STAGGER_CHILDREN_VARIANTS}
        >
          <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 backdrop-blur-md px-4 py-1.5 text-sm text-white/90 font-medium shadow-xl">
              <Sparkles className="h-4 w-4 text-accent" />
              Your next adventure starts here
            </span>
          </motion.div>
          
          <motion.h1 
            variants={FADE_UP_ANIMATION_VARIANTS}
            className="text-balance text-6xl font-extrabold tracking-tight text-white md:text-8xl drop-shadow-2xl"
          >
            Where do you want to <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">go next?</span>
          </motion.h1>
          
          <motion.p 
            variants={FADE_UP_ANIMATION_VARIANTS}
            className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-white/80 md:text-2xl leading-relaxed drop-shadow-md font-medium"
          >
            Build unforgettable journeys, manage itineraries seamlessly, and explore the world with absolute clarity.
          </motion.p>

          <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-14 px-8 text-lg shadow-2xl shadow-primary/40 rounded-full hover:scale-105 transition-transform bg-primary text-primary-foreground border-none">
              <Link href="/app">
                Plan a Trip
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full hover:bg-white/10 hover:text-white text-white border-white/30 bg-black/20 backdrop-blur-md transition-colors">
              <Link href="#destinations">Explore Destinations</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Popular Destinations ─────────────────────────────────────────────── */}
      <section id="destinations" className="relative mx-auto max-w-7xl px-4 py-24 md:py-32">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Trending Destinations</h2>
          <p className="text-muted-foreground mt-4 text-xl">
            Discover hand-picked locations for your next getaway.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Bali, Indonesia", image: "/images/dest_bali.png", price: "$1,200", tag: "Tropical" },
            { name: "Paris, France", image: "/images/dest_paris.png", price: "$2,500", tag: "Romantic" },
            { name: "Tokyo, Japan", image: "/images/dest_tokyo.png", price: "$2,100", tag: "Cyberpunk" },
            { name: "Reykjavik, Iceland", image: "/images/dest_iceland.png", price: "$1,800", tag: "Adventure" },
          ].map((dest, index) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative h-96 overflow-hidden rounded-3xl cursor-pointer"
            >
              <Image 
                src={dest.image}
                alt={dest.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
                    {dest.tag}
                  </span>
                  <span className="text-white/90 font-medium">{dest.price} est.</span>
                </div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  {dest.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features Section ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-muted/30 py-24 md:py-32 border-y border-border/40">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl mb-6">Designed for the modern explorer.</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Experience trip planning that feels like a breeze. Drag-and-drop itineraries, real-time weather, interactive maps, and beautiful travel journals—all in one place.
              </p>
              
              <ul className="space-y-6">
                {[
                  { icon: MapPin, title: "Interactive Itineraries", text: "Map out every stop visually." },
                  { icon: Compass, title: "Smart Discovery", text: "Find hidden gems and top attractions." },
                  { icon: Globe2, title: "Public Sharing", text: "Share your cinematic trip with friends via link." }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-1">{item.title}</h4>
                      <p className="text-muted-foreground">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative rounded-3xl border border-white/10 bg-background/40 p-2 shadow-2xl backdrop-blur-xl group"
            >
              <Image
                src="/images/dashboard-mockup.png"
                alt="Traveloop Dashboard"
                width={1000}
                height={800}
                className="rounded-2xl border bg-muted/50 object-cover shadow-2xl group-hover:shadow-primary/20 transition-shadow duration-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Pricing Section ─────────────────────────────────────────────────── */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-24 md:py-32">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Start your journey.</h2>
          <p className="text-muted-foreground mt-4 text-xl">
            Choose the perfect plan for your travel volume.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 lg:gap-10 items-center">
          {[
            { name: "Wanderer", price: "Free", desc: "For personal trips", popular: false, features: ["Up to 3 trips", "Basic itinerary builder", "Checklist access"] },
            { name: "Explorer", price: "$9", desc: "For avid travelers", popular: true, features: ["Unlimited trips", "Public sharing", "Travel journals", "Premium destinations"] },
            { name: "Voyager", price: "$29", desc: "For travel agents", popular: false, features: ["Everything in Explorer", "Client collaboration", "Export to PDF", "Custom branding"] },
          ].map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card className={`relative flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${tier.popular ? "border-primary shadow-2xl shadow-primary/10 scale-105 z-10" : "border-border/50 bg-background/50"}`}>
                {tier.popular && (
                  <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-primary to-accent px-3 py-1.5 text-center text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
                    Most Popular
                  </div>
                )}
                <CardHeader className={tier.popular ? "pt-12" : ""}>
                  <CardTitle className="text-3xl font-bold">{tier.name}</CardTitle>
                  <CardDescription className="text-base mt-2">{tier.desc}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-8 flex items-baseline text-6xl font-extrabold tracking-tight">
                    {tier.price}
                    {tier.price !== "Free" && <span className="text-muted-foreground ml-2 text-xl font-medium">/mo</span>}
                  </div>
                  <ul className="space-y-4 flex-1 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-base">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-foreground font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`mt-auto w-full h-12 rounded-full text-base font-semibold transition-all ${tier.popular ? "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02]" : ""}`} 
                    variant={tier.popular ? "default" : "outline"} 
                    disabled
                  >
                    Select Plan
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
