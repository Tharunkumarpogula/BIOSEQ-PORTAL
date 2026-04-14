"use client";

import Link from 'next/link';
import { Dna, Microchip, Search, Database, ChevronRight, Activity, Terminal, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/components/auth-provider';

import { Navbar } from '@/components/navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Decorative gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-accent/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-medium mb-8">
            <Activity className="w-3 h-3" />
            BIOINFORMATICS PLATFORM
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            Unlocking the Code of <br />
            <span className="text-primary italic">Biological Intelligence.</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed">
            A production-grade bioinformatics terminal for researchers and students.
            Instant sequence analysis, restriction mapping, and BLAST alignments.
            Precision data, delivered at scale.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Link href="/analyze">
              <Button size="lg" className="h-14 px-8 text-md font-semibold gap-2 shadow-xl shadow-primary/30">
                Start New Analysis <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-md font-semibold gap-2 border-primary/20 hover:bg-primary/5">
              Documentation <Terminal className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Microchip,
                title: "Fast Analysis",
                desc: "High-performance sequence cleaning and validation algorithms."
              },
              {
                icon: Search,
                title: "BLAST Integration",
                desc: "Real-time alignment with standard reference databases."
              },
              {
                icon: Database,
                title: "Cloud Analysis",
                desc: "Persistent results across your lab experiments."
              }
            ].map((feature, i) => (
              <Card key={i} className="glass dark:glass-dark border-primary/10 hover:border-primary/30 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="mb-6 w-12 h-12 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Visual Element: Floating Sequence Decoration */}
        <div className="absolute right-[-10%] top-[30%] opacity-[0.015] font-mono text-8xl select-none pointer-events-none max-w-[200px] leading-none tracking-tighter hidden xl:block">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i}>{"ATGC".charAt(Math.floor(Math.random() * 4))}</div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-sm text-muted-foreground font-mono">
            &copy; 2024 BioSeq Portal
          </div>
          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary">Research Paper</a>
            <a href="#" className="hover:text-primary">API access</a>
            <a href="#" className="hover:text-primary">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
