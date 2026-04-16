"use client";

import { useState } from 'react';
import {
    Download,
    Play,
    RotateCw,
    Layers,
    Palette,
    Film,
    Code,
    Terminal,
    ExternalLink,
    Copy,
    Check,
    Atom,
    MonitorPlay
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AnalysisResult } from '@/types/bio';
import {
    downloadPyMOLScript,
    generatePyMOLScript,
    generateAdvancedPyMOLScript,
    generatePyMOLMovieScript,
    getPyMOLCommand
} from '@/lib/pymol-utils';

interface PyMOLViewerProps {
    result: AnalysisResult;
    className?: string;
}

export default function PyMOLViewer({ result, className }: PyMOLViewerProps) {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');

    const handleDownloadScript = () => {
        downloadPyMOLScript(result);
        toast.success('PyMOL script downloaded!');
    };

    const handleCopyCommand = () => {
        const command = getPyMOLCommand(result);
        navigator.clipboard.writeText(command);
        setCopied(true);
        toast.success('PyMOL command copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadAdvanced = () => {
        const content = generateAdvancedPyMOLScript(result);
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${result.name.replace(/[^a-zA-Z0-9]/g, '_')}_advanced.pml`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('Advanced PyMOL script downloaded!');
    };

    const handleDownloadMovie = () => {
        const content = generatePyMOLMovieScript(result);
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${result.name.replace(/[^a-zA-Z0-9]/g, '_')}_movie.pml`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('PyMOL movie script downloaded!');
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20 font-mono tracking-wider">
                            DESKTOP SOFTWARE
                        </Badge>
                        <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-primary/20 text-muted-foreground">
                            VERSION 2.x+
                        </Badge>
                    </div>
                    <h2 className="text-2xl font-black tracking-tighter flex items-center gap-2">
                        <Atom className="w-6 h-6 text-blue-500" />
                        PyMOL Integration
                    </h2>
                    <p className="text-muted-foreground text-sm italic">
                        Generate PyMOL scripts for advanced molecular visualization on your desktop
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="gap-2 border-primary/20"
                        onClick={handleCopyCommand}
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        Copy Command
                    </Button>
                    <Button
                        className="gap-2 bg-blue-600 hover:bg-blue-700"
                        onClick={handleDownloadScript}
                    >
                        <Download className="w-4 h-4" />
                        Download Script
                    </Button>
                </div>
            </div>

            {/* Script Templates */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-muted/50 p-1 border border-primary/5 w-full md:w-auto">
                    <TabsTrigger value="basic" className="gap-2 data-[state=active]:bg-background">
                        <Layers className="w-4 h-4" /> Basic View
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="gap-2 data-[state=active]:bg-background">
                        <Palette className="w-4 h-4" /> Advanced
                    </TabsTrigger>
                    <TabsTrigger value="movie" className="gap-2 data-[state=active]:bg-background">
                        <Film className="w-4 h-4" /> Movie
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="gap-2 data-[state=active]:bg-background">
                        <Code className="w-4 h-4" /> Script Preview
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-6">
                    <Card className="glass-dark border-primary/10">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Layers className="w-5 h-5 text-primary" />
                                Standard Visualization
                            </CardTitle>
                            <CardDescription>
                                Download a basic PyMOL script with cartoon representation and standard coloring
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 rounded-lg bg-muted/40 border border-primary/5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
                                            <RotateCw className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <span className="font-bold text-sm">Rotation</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Auto-rotate and zoom to optimal viewing angle</p>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/40 border border-primary/5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded bg-teal-500/20 flex items-center justify-center">
                                            <Palette className="w-4 h-4 text-teal-500" />
                                        </div>
                                        <span className="font-bold text-sm">Coloring</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Chain-based coloring with professional palette</p>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/40 border border-primary/5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center">
                                            <MonitorPlay className="w-4 h-4 text-purple-500" />
                                        </div>
                                        <span className="font-bold text-sm">Labels</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Residue labels and structure annotations</p>
                                </div>
                            </div>
                            <Button
                                onClick={handleDownloadScript}
                                className="w-full h-12 gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Download Basic Script (.pml)
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4 mt-6">
                    <Card className="glass-dark border-primary/10">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Palette className="w-5 h-5 text-primary" />
                                Advanced Visualization
                            </CardTitle>
                            <CardDescription>
                                Professional-grade PyMOL script with surfaces, electrostatics, and ligand interactions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['Surface View', 'Ligand Sites', 'Distance Measurements', 'Secondary Structure'].map((feature, i) => (
                                    <div key={i} className="p-3 rounded-lg bg-muted/30 border border-primary/5 text-center">
                                        <span className="text-xs font-medium uppercase tracking-wider">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <Button
                                onClick={handleDownloadAdvanced}
                                className="w-full h-12 gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Download Advanced Script (.pml)
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="movie" className="space-y-4 mt-6">
                    <Card className="glass-dark border-primary/10">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Film className="w-5 h-5 text-primary" />
                                Movie Generation
                            </CardTitle>
                            <CardDescription>
                                Create a 360° rotating animation of your structure
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-lg bg-muted/40 border border-primary/5">
                                <h4 className="font-bold text-sm mb-2">Movie Settings</h4>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                    <li>• 180 frames (6 seconds at 30fps)</li>
                                    <li>• 360° Y-axis rotation</li>
                                    <li>• Ray-traced frames for quality</li>
                                    <li>• Output as PNG sequence</li>
                                </ul>
                            </div>
                            <Button
                                onClick={handleDownloadMovie}
                                className="w-full h-12 gap-2"
                            >
                                <Film className="w-4 h-4" />
                                Download Movie Script (.pml)
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="preview" className="space-y-4 mt-6">
                    <Card className="glass-dark border-primary/10">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Code className="w-5 h-5 text-primary" />
                                Script Preview
                            </CardTitle>
                            <CardDescription>
                                Preview the PyMOL commands before downloading
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-black/50 rounded-lg p-4 font-mono text-xs overflow-x-auto border border-primary/10">
                                <pre className="text-green-400">
                                    <code>{generatePyMOLScript(result).split('\n').slice(0, 30).join('\n')}
                                        {'\n...'}
                                    </code>
                                </pre>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Quick Launch Section */}
            <Card className="glass-dark border-blue-500/20 bg-blue-500/5">
                <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-blue-500" />
                        Quick Launch
                    </CardTitle>
                    <CardDescription>
                        Already have PyMOL installed? Run this command directly
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 p-4 bg-black/40 rounded-lg border border-primary/10 font-mono text-xs">
                        <span className="text-green-500">$</span>
                        <span className="text-primary">{getPyMOLCommand(result)}</span>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1 gap-2 border-primary/20"
                            onClick={handleCopyCommand}
                        >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            Copy to Clipboard
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 gap-2 border-blue-500/30 text-blue-500 hover:bg-blue-500/10"
                            onClick={() => window.open('https://pymol.org', '_blank')}
                        >
                            <ExternalLink className="w-4 h-4" />
                            Get PyMOL
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Installation Guide */}
            <Card className="glass-dark border-primary/10">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Don&apos;t have PyMOL?</CardTitle>
                    <CardDescription>
                        PyMOL is a powerful molecular visualization system available for Windows, Mac, and Linux
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted/40 border border-primary/5">
                            <h4 className="font-bold text-sm mb-2 text-green-500">PyMOL (Open Source)</h4>
                            <p className="text-xs text-muted-foreground mb-3">Free, open-source version with all core features</p>
                            <Button
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={() => window.open('https://github.com/schrodinger/pymol-open-source', '_blank')}
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Download Open Source
                            </Button>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/40 border border-primary/5">
                            <h4 className="font-bold text-sm mb-2 text-blue-500">PyMOL (Schrödinger)</h4>
                            <p className="text-xs text-muted-foreground mb-3">Commercial version with additional features and support</p>
                            <Button
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={() => window.open('https://pymol.org', '_blank')}
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Get PyMOL
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
