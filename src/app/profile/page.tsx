"use client";

import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Shield, Calendar, Fingerprint, LogOut, ChevronLeft, Activity, Terminal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();

    if (!user) {
        if (typeof window !== 'undefined') {
            router.push('/login');
        }
        return null;
    }

    const createdAt = new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const fullName = user.user_metadata?.full_name || 'Researcher';

    return (
        <div className="min-h-screen bg-background relative overflow-hidden pb-20">
            {/* Background patterns */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Decorative gradients */}
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Navigation Header */}
            <nav className="border-b bg-background/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <span className="text-md font-bold tracking-tight">Researcher Profile</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 pt-16 relative z-10">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-12">
                        <div className="w-32 h-32 rounded-3xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-2xl shadow-primary/20 relative group">
                            <User className="w-16 h-16 text-primary" />
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-background border-2 border-primary/20 rounded-full flex items-center justify-center">
                                <Activity className="w-4 h-4 text-primary animate-pulse" />
                            </div>
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <h1 className="text-4xl font-black tracking-tighter uppercase">{fullName}</h1>
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-mono text-[10px]">VERIFIED_RESEARCHER</Badge>
                            </div>
                            <p className="text-muted-foreground italic font-medium">Genomics Division // Laboratory 04</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Information Grid */}
                        <div className="md:col-span-2 space-y-6">
                            <Card className="glass-dark border-primary/10 overflow-hidden shadow-xl">
                                <CardHeader className="bg-muted/30 border-b">
                                    <div className="flex items-center gap-2 mb-2 italic text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                        <Shield className="w-3 h-3" /> SECURITY_PROTOCOL v.1.0
                                    </div>
                                    <CardTitle className="text-lg font-black italic tracking-tighter">Identity Metadata</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-primary/5">
                                        {[
                                            { label: 'Full Name', value: fullName, icon: User },
                                            { label: 'Registered Email', value: user.email, icon: Mail },
                                            { label: 'Unique Identifier', value: user.id, icon: Fingerprint, mono: true },
                                            { label: 'Account Created', value: createdAt, icon: Calendar },
                                            { label: 'System Access', value: 'FULL_AUTHORITY', icon: Shield, highlight: true },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-6 hover:bg-primary/[0.02] transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                                                        <item.icon className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">{item.label}</p>
                                                        <p className={`text-sm font-medium ${item.mono ? 'font-mono' : ''} ${item.highlight ? 'text-primary' : ''}`}>
                                                            {item.value}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Actions / Stats */}
                        <div className="space-y-6">
                            <Card className="glass-dark border-primary/10 overflow-hidden shadow-xl bg-primary/[0.02]">
                                <CardHeader className="bg-primary/10 border-b border-primary/10">
                                    <div className="flex items-center gap-2 mb-2 italic text-[10px] font-mono text-primary uppercase tracking-widest">
                                        <Activity className="w-3 h-3" /> ANALYTICS_MODULE
                                    </div>
                                    <CardTitle className="text-lg font-black italic tracking-tighter text-primary">Lab Activity</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">Sequences Analyzed</div>
                                        <div className="text-3xl font-black italic text-primary">24</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">Reports Generated</div>
                                        <div className="text-3xl font-black italic text-primary">12</div>
                                    </div>
                                    <div className="pt-4 border-t border-primary/10">
                                        <Link href="/analyze">
                                            <Button className="w-full h-12 uppercase tracking-widest text-[10px] font-bold shadow-lg shadow-primary/20 italic" variant="default">
                                                New Submission
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>

                            <Button 
                                variant="outline" 
                                className="w-full h-14 border-destructive/20 text-destructive hover:bg-destructive/10 gap-3 font-bold uppercase tracking-widest text-xs"
                                onClick={logout}
                            >
                                <LogOut className="w-4 h-4" /> Terminate Session
                            </Button>

                            <div className="p-4 bg-muted/20 rounded-xl border border-primary/5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Terminal className="w-4 h-4 text-primary" />
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Console Log</span>
                                </div>
                                <div className="font-mono text-[10px] text-muted-foreground/60 space-y-1 italic">
                                    <div>{'> system.status: ENCRYPTED'}</div>
                                    <div>{'> node.origin: SECUNDUS_CLIENT'}</div>
                                    <div>{'> session.token: ACTIVE'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
