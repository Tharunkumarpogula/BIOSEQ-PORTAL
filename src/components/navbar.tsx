"use client";

import Link from 'next/link';
import { Dna, User, LogOut, ChevronRight, Activity, Terminal, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { useRouter, usePathname } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar({ children }: { children?: React.ReactNode }) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const fullName = user?.user_metadata?.full_name || 'Researcher';

    return (
        <nav className="border-b bg-background/50 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => router.push('/')}>
                    <Dna className={`w-8 h-8 text-primary ${pathname === '/' ? 'animate-pulse' : ''} group-hover:scale-110 transition-transform`} />
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        BioSeq Portal
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}>Home</Link>
                    <Link href="/analyze" className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/analyze' ? 'text-primary' : 'text-muted-foreground'}`}>Analyzer</Link>
                    <Link href="/results" className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/results' ? 'text-primary' : 'text-muted-foreground'}`}>Lab Results</Link>
                </div>

                <div className="flex items-center gap-3">
                    {children}
                    
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all">
                                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                        <User className="w-3 h-3 text-primary" />
                                    </div>
                                    <span className="max-w-[100px] truncate font-mono text-xs uppercase tracking-wider">{fullName}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 glass-dark border-primary/20 shadow-2xl">
                                <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Session Terminal</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-primary/10" />
                                <DropdownMenuItem onClick={() => router.push('/profile')} className="gap-2 cursor-pointer focus:bg-primary/10 focus:text-primary transition-colors">
                                    <User className="w-4 h-4" /> My Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/results')} className="gap-2 cursor-pointer focus:bg-primary/10 focus:text-primary transition-colors">
                                    <LayoutDashboard className="w-4 h-4" /> Lab Results
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-primary/10" />
                                <DropdownMenuItem onClick={logout} className="gap-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors">
                                    <LogOut className="w-4 h-4" /> Terminate Session
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="font-bold uppercase tracking-wider text-[10px]">Login</Button>
                            </Link>
                            <Link href="/signup">
                                <Button variant="default" size="sm" className="shadow-lg shadow-primary/20 font-bold uppercase tracking-wider text-[10px]">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
