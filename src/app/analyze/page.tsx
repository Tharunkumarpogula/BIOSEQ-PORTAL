"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Dna, FileUp, Database, Search, Terminal, AlertCircle, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Navbar } from '@/components/navbar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AnalyzePage() {
    const router = useRouter();
    const [sequence, setSequence] = useState('');
    const [name, setName] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [accession, setAccession] = useState('');
    const [fetching, setFetching] = useState(false);

    const handleFetch = async () => {
        if (!accession) {
            toast.error('Accession ID is required.');
            return;
        }

        setFetching(true);
        try {
            // NCBI E-utils API
            const response = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=${accession}&rettype=fasta&retmode=text`);
            if (!response.ok) throw new Error('Failed to fetch from NCBI');

            const fasta = await response.text();
            if (fasta.includes('Error') || fasta.trim() === '') throw new Error('Invalid Accession ID or no data found.');

            setSequence(fasta);
            setName(accession);
            toast.success(`Successfully retrieved ${accession} from NCBI!`);
        } catch (error) {
            console.error(error);
            toast.error('NCBI Fetch failed. Check the ID and try again.');
        } finally {
            setFetching(false);
        }
    };

    const handleAnalyze = async () => {
        if (!sequence) {
            toast.error('Sequence is required.');
            return;
        }

        setAnalyzing(true);
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sequence, name }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Analysis failed');
            }

            const analysisResult = await response.json();
            
            // Store the full analysis result in session storage for the results page
            sessionStorage.setItem('lastAnalysisResult', JSON.stringify(analysisResult));
            
            toast.success('Core analysis complete!');
            router.push(`/results?id=${analysisResult.id}`);
        } catch (error: any) {
            console.error('ANALYSIS_ERROR:', error);
            toast.error(error.message || 'An error occurred during analysis.');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Background patterns */}
            <div className="absolute top-0 left-0 w-full h-[30%] opacity-[0.03] pointer-events-none bg-gradient-to-b from-primary/10 to-transparent" />

            <Navbar />

            <main className="container mx-auto px-6 pt-16">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="space-y-4">
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">ANALYZER TERMINAL</Badge>
                            <h1 className="text-4xl font-bold tracking-tighter">Submit New Submission</h1>
                            <p className="text-muted-foreground italic leading-relaxed">
                                Provide a FASTA sequence or upload a raw sequencing file (.fasta, .fastq, .seq)
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2 border-primary/20">
                                        {copied ? <Check className="w-4 h-4 text-accent" /> : <Database className="w-4 h-4" />}
                                        Load Bio-Examples
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 glass-dark border-primary/20 shadow-2xl">
                                    <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Protocol Selection</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-primary/10" />
                                    {[
                                        { 
                                            label: 'Human DNA (HBB)', 
                                            name: 'Homo sapiens HBB Exon 1',
                                            type: 'DNA',
                                            seq: 'ATGGTGCACCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGGCTGCTGGTGGTCTACCCTTGGACCCAGAGGTTCTTTGAGTCCTTTGGGGATCTGTCCACTCCTGATGCTGTTATGGGCAACCCTAAGGTGAAGGCTCATGGCAAGAAAGTGCTCGGTGCCTTTAGTGATGGCCTGGCTCACCTGGACAACCTCAAGGGCACCTTTGCCACACTGAGTGAGCTGCACTGTGACAAGCTGCACGTGGATCCTGAGAACTTCAGGCTCCTGGGCAACGTGCTGGTCTGTGTGCTGGCCCATCACTTTGGCAAAGAATTCACCCCACCAGTGCAGGCTGCCTATCAGAAAGTGGTGGCTGGTGTGGCTAATGCCCTGGCCCACAAGTATCACTAA' 
                                        },
                                        { 
                                            label: 'Viral RNA (SARS-CoV-2 Spike)', 
                                            name: 'Sars-CoV-2 Spike protein mRNA',
                                            type: 'RNA',
                                            seq: 'AUGUUCGUUUUCCUGGUGUUGCUACCUUGGCAAUUCGAGAUCUGUCCACTCCTGATGCTGTTATGGGCAACCCTAAGGTGAAGGCTCATGGCAA' 
                                        },
                                        { 
                                            label: 'Human Insulin (Protein)', 
                                            name: 'Insulin (Human) Chain A',
                                            type: 'Protein',
                                            seq: 'GIVEQCCTSICSLYQLENYCN' 
                                        },
                                        { 
                                            label: 'Mitochondrial Fragment (Genome)', 
                                            name: 'Human mitochondrial DNA fragment',
                                            type: 'Genome',
                                            seq: 'GATCACAGGTCTATCACCCTATTAACCACTCACGGGAGCTCTCCATGCATTTGGTATTTTCGTCTGGGGGGTATGCACGCGATAGCATTGCGAGACGCTG' 
                                        }
                                    ].map((example) => (
                                        <DropdownMenuItem 
                                            key={example.label}
                                            onClick={() => {
                                                setSequence(example.seq);
                                                setName(example.name);
                                                setCopied(true);
                                                setTimeout(() => setCopied(false), 2000);
                                                toast.success(`Protocol ${example.type} loaded: ${example.label}`);
                                            }}
                                            className="gap-2 cursor-pointer focus:bg-primary/10 transition-colors py-3"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">{example.label}</span>
                                                <span className="text-[10px] text-muted-foreground font-mono italic uppercase">{example.type}_TEMPLATE</span>
                                            </div>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <Card className="glass dark:glass-dark border-primary/10 overflow-hidden shadow-2xl">
                        <CardHeader className="bg-muted/30 border-b">
                            <div className="flex items-center gap-2 mb-2 italic text-xs font-mono text-muted-foreground">
                                <Terminal className="w-3 h-3" /> // INPUT_PROTOCOL v2.1
                            </div>
                            <CardTitle>Sequence Integration</CardTitle>
                            <CardDescription>Enter sequence data below for comprehensive analysis.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <Tabs defaultValue="text" className="space-y-10">
                                <TabsList className="bg-muted/50 p-1 border border-primary/5">
                                    <TabsTrigger value="text" className="gap-2 data-[state=active]:bg-background">
                                        <Search className="w-4 h-4" /> Raw Input
                                    </TabsTrigger>
                                    <TabsTrigger value="file" className="gap-2 data-[state=active]:bg-background">
                                        <FileUp className="w-4 h-4" /> File Upload
                                    </TabsTrigger>
                                    <TabsTrigger value="database" className="gap-2 data-[state=active]:bg-background">
                                        <Database className="w-4 h-4" /> DB Accession
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="text" className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-bold font-mono text-muted-foreground uppercase tracking-wider">Experiment Name</label>
                                            <Input
                                                placeholder="e.g. HBB_HUMAN_EXON1"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="bg-background/50 border-primary/10 focus-visible:ring-primary/20 font-mono text-sm h-12"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-bold font-mono text-muted-foreground uppercase tracking-wider">FASTA Sequence</label>
                                            <textarea
                                                className="min-h-[300px] w-full bg-background/50 border border-primary/10 rounded-lg p-6 font-mono text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all resize-none shadow-inner"
                                                placeholder=">Sequence Header\nATGC..."
                                                value={sequence}
                                                onChange={(e) => setSequence(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="file" className="py-20 text-center border-2 border-dashed border-primary/10 rounded-xl bg-primary/[0.02]">
                                    <div className="max-w-xs mx-auto space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto mb-6">
                                            <FileUp className="w-8 h-8 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-bold font-mono uppercase tracking-tighter">Drag and Drop Files</h3>
                                        <p className="text-sm text-muted-foreground">Supported formats: .fasta, .fastq, .txt, .seq (Max 100MB)</p>
                                        <Button variant="outline" className="mt-6 border-primary/10">Select Local Source</Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="database" className="space-y-6">
                                    <div className="flex flex-col gap-4">
                                        <label className="text-sm font-bold font-mono text-muted-foreground uppercase tracking-wider">NCBI / UniProt Accession ID</label>
                                        <div className="flex gap-3">
                                            <Input
                                                placeholder="e.g. NM_000558"
                                                className="bg-background/50 border-primary/10 h-12 font-mono"
                                                value={accession}
                                                onChange={(e) => setAccession(e.target.value)}
                                            />
                                            <Button className="h-12 px-8" onClick={handleFetch} disabled={fetching}>
                                                {fetching ? 'Retrieving...' : 'Retrieve'}
                                            </Button>
                                        </div>
                                        <div className="p-4 bg-muted/40 rounded-lg border border-primary/5 flex items-start gap-3">
                                            <AlertCircle className="w-4 h-4 text-primary mt-1" />
                                            <p className="text-xs text-muted-foreground italic leading-relaxed">
                                                BioSeq Portal will attempt to fetch sequence data from international public repositories.
                                                Response times may vary based on upstream latency.
                                            </p>
                                        </div>
                                    </div>
                                </TabsContent>

                                <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground italic">
                                        <Terminal className="w-4 h-4" /> Ready for processing // status: IDLE
                                    </div>
                                    <Button
                                        size="lg"
                                        className="w-full md:w-[280px] h-14 text-md font-bold shadow-xl shadow-primary/20 gap-3"
                                        onClick={handleAnalyze}
                                        disabled={analyzing}
                                    >
                                        {analyzing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                                PROCESSING DATA...
                                            </>
                                        ) : (
                                            <>
                                                RUN CORE ANALYSIS <Search className="w-4 h-4" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
