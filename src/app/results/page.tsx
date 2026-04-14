"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { Dna, Download, Copy, Share2, Search, Terminal, Activity, FileDown, Layers, ChevronLeft, MapPin, Gauge, Microscope, ArrowRight, Mail, Link2, FileJson, FileSpreadsheet, FileText, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockBLASTResults } from '@/lib/bio-utils';
import { Navbar } from '@/components/navbar';
import { AnalysisResult } from '@/types/bio';
import { toast } from 'sonner';
import {
    downloadFile,
    exportAsFASTA,
    exportAsGenBank,
    exportAsCSV,
    exportAsJSON,
    shareViaEmail,
    shareViaWhatsApp,
    copyToClipboard,
    getShareText
} from '@/lib/export-utils';

import ProteinViewer from '@/components/protein-viewer';
import PyMOLViewer from '@/components/pymol-viewer';

function ResultsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const id = searchParams.get('id');

    useEffect(() => {
        // Fetch the full analysis results from session storage
        const rawData = sessionStorage.getItem('lastAnalysisResult');
        if (rawData) {
            try {
                const analysisResult = JSON.parse(rawData);
                setResult(analysisResult);
            } catch (err) {
                console.error('Failed to parse analysis result:', err);
            }
        }
    }, [id]);

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-6 text-center">
                    <Dna className="w-16 h-16 text-primary animate-spin opacity-20" />
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold font-mono uppercase tracking-tighter">Initializing Analysis...</h1>
                        <p className="text-muted-foreground italic text-sm">Waiting for sequence data synchronization...</p>
                    </div>
                    <Button variant="outline" onClick={() => router.push('/analyze')}>Back to Entry</Button>
                </div>
            </div>
        );
    }

    const copyResults = () => {
        if (result) {
            navigator.clipboard.writeText(JSON.stringify(result, null, 2));
            toast.success('Results JSON copied to clipboard!');
        }
    };

    const handleExportFASTA = () => {
        if (result) {
            const content = exportAsFASTA(result);
            downloadFile(content, `${result.name}.fasta`, 'text/plain');
            toast.success('FASTA file downloaded!');
        }
    };

    const handleExportGenBank = () => {
        if (result) {
            const content = exportAsGenBank(result);
            downloadFile(content, `${result.name}.gb`, 'text/plain');
            toast.success('GenBank file downloaded!');
        }
    };

    const handleExportCSV = () => {
        if (result) {
            const content = exportAsCSV(result);
            downloadFile(content, `${result.name}.csv`, 'text/csv');
            toast.success('CSV file downloaded!');
        }
    };

    const handleExportJSON = () => {
        if (result) {
            const content = exportAsJSON(result);
            downloadFile(content, `${result.name}.json`, 'application/json');
            toast.success('JSON file downloaded!');
        }
    };

    const handleShareEmail = () => {
        if (result) {
            shareViaEmail(result);
            setShowShareMenu(false);
        }
    };

    const handleShareWhatsApp = () => {
        if (result) {
            shareViaWhatsApp(result);
            setShowShareMenu(false);
        }
    };

    const handleShareCopy = async () => {
        if (result) {
            const text = getShareText(result);
            await copyToClipboard(text);
            toast.success('Share link copied to clipboard!');
            setShowShareMenu(false);
        }
    };

    const handleSystemShare = async () => {
        if (result && navigator.share) {
            try {
                await navigator.share({
                    title: `BioSeq Portal: ${result.name}`,
                    text: getShareText(result),
                });
                setShowShareMenu(false);
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            toast.error('Sharing not supported on this device');
        }
    };

    return (
        <div className="min-h-screen bg-background pb-32 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[20%] left-[-5%] w-[30%] h-[30%] bg-accent/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Navigation */}
            <Navbar>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="hidden sm:flex gap-2 border-primary/20" onClick={copyResults}>
                        <Copy className="w-4 h-4" /> JSON
                    </Button>
                    <Button variant="default" size="sm" className="gap-2 shadow-lg shadow-primary/20">
                        <Download className="w-4 h-4" /> Reports
                    </Button>
                </div>
            </Navbar>

            <main className="container mx-auto px-6 pt-12">
                <div className="max-w-6xl mx-auto space-y-12">
                    {/* Header Dashboard */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="bg-primary/5 text-primary rounded-sm font-mono tracking-wider border-primary/10">ANALYSIS COMPLETED // REF_{result.id}</Badge>
                                <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-primary/20 text-muted-foreground">PRODUCTION BUILD</Badge>
                            </div>
                            <h1 className="text-5xl font-black tracking-tighter uppercase">{result.name}</h1>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground italic font-medium">
                                <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> STATUS: VALIDATED</span>
                                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> ORIGIN: LOCAL_UPLOAD</span>
                                <span className="flex items-center gap-2 font-mono">TS: {new Date(result.timestamp).toLocaleTimeString()}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
                            {result.stats.map((stat, i) => (
                                <div key={i} className="p-4 px-6 rounded-xl bg-muted/40 border border-primary/5 space-y-1 glass-dark group hover:border-primary/20 transition-all duration-300">
                                    <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                                    <div className="text-lg font-black tracking-tight flex items-baseline gap-1 group-hover:text-primary transition-colors">
                                        {stat.value}
                                        {stat.unit && <span className="text-[10px] font-medium text-muted-foreground">{stat.unit}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Primary Analysis Column */}
                        <div className="lg:col-span-2 space-y-8">
                            <Tabs defaultValue="sequence" className="w-full">
                                <TabsList className="bg-muted/50 p-1 mb-8 border border-primary/5">
                                    <TabsTrigger value="sequence" className="gap-2 px-8 uppercase tracking-widest text-[10px] font-bold data-[state=active]:bg-background">
                                        <Terminal className="w-3 h-3" /> Raw Sequence
                                    </TabsTrigger>
                                    <TabsTrigger value="3d" className="gap-2 px-8 uppercase tracking-widest text-[10px] font-bold data-[state=active]:bg-background">
                                        <Microscope className="w-3 h-3" /> 3D Structure
                                    </TabsTrigger>
                                    <TabsTrigger value="pymol" className="gap-2 px-8 uppercase tracking-widest text-[10px] font-bold data-[state=active]:bg-background">
                                        <Microscope className="w-3 h-3 text-blue-500" /> PyMOL
                                    </TabsTrigger>
                                    <TabsTrigger value="blast" className="gap-2 px-8 uppercase tracking-widest text-[10px] font-bold data-[state=active]:bg-background">
                                        <Search className="w-3 h-3" /> BLAST (v2.14)
                                    </TabsTrigger>
                                    <TabsTrigger value="restriction" className="gap-2 px-8 uppercase tracking-widest text-[10px] font-bold data-[state=active]:bg-background">
                                        <Layers className="w-3 h-3" /> Restriction Map
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="sequence" className="space-y-6">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                        <Card className="glass-dark border-primary/10 overflow-hidden shadow-2xl relative">
                                            <div className="bg-muted/30 px-6 py-3 border-b flex justify-between items-center text-[10px] font-mono text-muted-foreground tracking-widest">
                                                <span>SEQUENCE_VIEWER // ENCODING_UTF8</span>
                                                <span>LENGTH: {result.length}bp</span>
                                            </div>
                                            <CardContent className="p-8">
                                                <div className="bg-black/20 p-8 rounded-xl font-mono text-sm leading-8 break-all shadow-inner border border-primary/5 max-h-[500px] overflow-y-auto custom-scrollbar text-primary italic">
                                                    {Array.from({ length: Math.ceil(result.length / 10) }).map((_, i) => (
                                                        <span key={i} className="inline-block mr-4 mb-2">
                                                            <span className="text-[10px] text-muted-foreground/30 mr-2 opacity-50 select-none">{(i * 10).toString().padStart(4, '0')}</span>
                                                            {result.sequence.substring(i * 10, i * 10 + 10)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {result.translation && (
                                        <Card className="glass-dark border-primary/10">
                                            <CardHeader className="border-b bg-muted/20">
                                                <CardTitle className="text-sm font-mono uppercase tracking-widest text-primary">ORF Translation (Frame +1)</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8">
                                                <div className="bg-muted/30 p-6 rounded-lg font-mono text-sm text-accent break-all leading-6">
                                                    {result.translation}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </TabsContent>

                                <TabsContent value="3d" className="space-y-6">
                                    <ProteinViewer pdbId={result.pdbId || '1hbb'} className="h-[500px]" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Card className="glass-dark border-primary/10 p-4">
                                            <h3 className="text-xs font-bold font-mono text-muted-foreground uppercase mb-2">Structure Info</h3>
                                            <p className="text-sm italic">Hemoglobin subunit beta (HBB) in complex with oxygen. This 3D model shows the protein folding and heme groups.</p>
                                        </Card>
                                        <Card className="glass-dark border-primary/10 p-4">
                                            <h3 className="text-xs font-bold font-mono text-muted-foreground uppercase mb-2">Interaction Map</h3>
                                            <p className="text-sm italic">The secondary structure consists primarily of alpha-helices, which are crucial for oxygen transport functionality.</p>
                                        </Card>
                                    </div>
                                </TabsContent>

                                <TabsContent value="pymol" className="space-y-6">
                                    <PyMOLViewer result={result} />
                                </TabsContent>

                                <TabsContent value="blast" className="space-y-8">
                                    <Card className="glass-dark border-primary/10 shadow-2xl">
                                        <CardHeader className="border-b bg-muted/30 flex flex-row items-center justify-between">
                                            <div>
                                                <CardTitle className="text-xl font-black italic tracking-tighter">Alignment Hits</CardTitle>
                                                <CardDescription className="text-[10px] font-mono uppercase tracking-widest mt-1">Database: nr/nt standard collection</CardDescription>
                                            </div>
                                            <Badge variant="outline" className="border-accent/40 text-accent font-mono text-[10px] uppercase">E-value Threshold: 1e-5</Badge>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader className="bg-muted/40">
                                                        <TableRow className="border-primary/10 hover:bg-transparent">
                                                            <TableHead className="font-mono text-[10px] uppercase py-6">Accession</TableHead>
                                                            <TableHead className="font-mono text-[10px] uppercase">Description</TableHead>
                                                            <TableHead className="font-mono text-[10px] uppercase text-right">Score</TableHead>
                                                            <TableHead className="font-mono text-[10px] uppercase text-right">E-Value</TableHead>
                                                            <TableHead className="font-mono text-[10px] uppercase text-right">Identity%</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {mockBLASTResults.map((hit) => (
                                                            <TableRow key={hit.accession} className="border-primary/5 hover:bg-primary/[0.03] transition-colors group cursor-pointer">
                                                                <TableCell className="font-mono font-bold text-primary group-hover:underline italic py-4">{hit.accession}</TableCell>
                                                                <TableCell className="max-w-xs truncate text-xs font-medium italic">{hit.description}</TableCell>
                                                                <TableCell className="font-mono text-right text-xs">{hit.score}</TableCell>
                                                                <TableCell className="font-mono text-right text-xs">{hit.eValue === 0 ? "0.0" : hit.eValue.toExponential(1)}</TableCell>
                                                                <TableCell className="text-right">
                                                                    <Badge className="bg-accent/10 text-accent border-accent/20 font-mono text-[10px]">{hit.identity}%</Badge>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                            <div className="p-6 border-t bg-muted/10 text-center">
                                                <Button variant="ghost" className="text-xs uppercase tracking-widest gap-2 opacity-50 hover:opacity-100 italic">
                                                    View Analysis Full Report <ArrowRight className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="restriction" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {result.restrictionSites?.map((site, i) => (
                                            <Card key={i} className="glass-dark border-primary/10 hover:border-primary/30 transition-all group">
                                                <CardContent className="p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-mono px-3 py-1 uppercase">{site.enzyme}</Badge>
                                                        <span className="text-[10px] font-mono text-muted-foreground italic uppercase">Pos: {site.position}</span>
                                                    </div>
                                                    <div className="font-mono text-lg font-black tracking-widest mb-2 flex justify-center py-4 bg-muted/40 rounded border border-primary/5 group-hover:bg-primary/5 transition-colors italic">
                                                        {site.sequence.split('').map((c, j) => (
                                                            <span key={j} className={j === 2 ? "text-primary border-b-2 border-primary" : ""}>{c}</span>
                                                        ))}
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest italic text-center opacity-50">Isoschizomer: N/A // Cut type: Sticky</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                        {!result.restrictionSites?.length && (
                                            <div className="col-span-2 py-20 text-center glass border-dashed border-primary/10 rounded-xl">
                                                <p className="text-muted-foreground italic uppercase text-xs font-mono">No restriction sites detected in current sequence frame</p>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Sidebar Visual Modules */}
                        <div className="space-y-8">
                            <Card className="glass-dark border-primary/10 overflow-hidden shadow-xl">
                                <CardHeader className="border-b bg-muted/30">
                                    <div className="flex items-center gap-2 mb-2 italic text-[10px] font-mono text-muted-foreground">
                                        <Gauge className="w-3 h-3" /> MONITOR_MODULE v.8.0
                                    </div>
                                    <CardTitle className="text-lg font-black italic tracking-tighter">Compositional Bias</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">GC Density</span>
                                            <span className="text-xl font-black text-primary font-mono italic">{result.gcContent || 0}%</span>
                                        </div>
                                        <div className="h-3 bg-muted/50 rounded-full overflow-hidden border border-primary/5 shadow-inner">
                                            <div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse" style={{ width: `${result.gcContent}%` }} />
                                        </div>
                                        <p className="text-[10px] italic text-muted-foreground leading-relaxed uppercase tracking-widest opacity-60">
                                            Optimal range: 40-60%. Sequence shows moderate GC stabilization.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {['A', 'T', 'G', 'C'].map((base) => (
                                            <div key={base} className="p-4 rounded-lg bg-muted/20 border border-primary/5 flex flex-col items-center">
                                                <span className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest mb-1">{base}_BIAS</span>
                                                <span className="text-lg font-black font-mono italic text-primary">{(Math.random() * 30 + 10).toFixed(1)}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass-dark border-primary/10 shadow-xl overflow-hidden">
                                <CardHeader className="bg-muted/30 border-b">
                                    <div className="flex items-center gap-2 mb-2 italic text-[10px] font-mono text-muted-foreground">
                                        <Microscope className="w-3 h-3" /> LAB_UTILITY_GATEWAY
                                    </div>
                                    <CardTitle className="text-lg font-black italic tracking-tighter">Export Protocol</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-3">
                                    <Button className="w-full justify-between h-12 uppercase tracking-widest text-[10px] font-bold shadow-lg shadow-primary/20 italic" variant="default" onClick={handleExportGenBank}>
                                        Download GenBank <FileDown className="w-4 h-4" />
                                    </Button>
                                    <Button className="w-full justify-between h-12 uppercase tracking-widest text-[10px] font-bold border-primary/20 italic" variant="outline" onClick={handleExportFASTA}>
                                        Export FASTA <FileText className="w-4 h-4" />
                                    </Button>
                                    <Button className="w-full justify-between h-12 uppercase tracking-widest text-[10px] font-bold border-primary/20 italic" variant="outline" onClick={handleExportCSV}>
                                        Export CSV <FileSpreadsheet className="w-4 h-4" />
                                    </Button>
                                    <Button className="w-full justify-between h-12 uppercase tracking-widest text-[10px] font-bold border-primary/20 italic" variant="outline" onClick={handleExportJSON}>
                                        Export JSON <FileJson className="w-4 h-4" />
                                    </Button>

                                    <div className="relative">
                                        <Button className="w-full justify-between h-12 uppercase tracking-widest text-[10px] font-bold border-primary/20 italic" variant="outline" onClick={() => setShowShareMenu(!showShareMenu)}>
                                            Share Findings <Share2 className="w-4 h-4" />
                                        </Button>
                                        {showShareMenu && (
                                            <div className="absolute bottom-full left-0 right-0 mb-2 bg-background border border-primary/20 rounded-lg shadow-xl overflow-hidden z-50">
                                                <Button variant="ghost" className="w-full justify-start h-10 text-xs uppercase tracking-widest gap-3" onClick={handleShareWhatsApp}>
                                                    <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp
                                                </Button>
                                                <Button variant="ghost" className="w-full justify-start h-10 text-xs uppercase tracking-widest gap-3" onClick={handleShareEmail}>
                                                    <Mail className="w-4 h-4 text-blue-500" /> Email
                                                </Button>
                                                <Button variant="ghost" className="w-full justify-start h-10 text-xs uppercase tracking-widest gap-3" onClick={handleSystemShare}>
                                                    <Share2 className="w-4 h-4 text-primary" /> More Apps
                                                </Button>
                                                <Button variant="ghost" className="w-full justify-start h-10 text-xs uppercase tracking-widest gap-3" onClick={handleShareCopy}>
                                                    <Link2 className="w-4 h-4" /> Copy Link
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function ResultsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Dna className="w-16 h-16 text-primary animate-spin opacity-20" />
            </div>
        }>
            <ResultsContent />
        </Suspense>
    );
}
