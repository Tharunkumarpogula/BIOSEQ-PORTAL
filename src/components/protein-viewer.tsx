"use client";

import { useEffect, useRef, useState } from 'react';
import { Stage } from 'ngl';
import { Loader2, Box, Maximize2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProteinViewerProps {
    pdbId?: string;
    className?: string;
}

export default function ProteinViewer({ pdbId = '1hbb', className }: ProteinViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<Stage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        setLoading(true);
        setError(null);

        // NGL Stage settings
        const stage = new Stage(containerRef.current, {
            backgroundColor: '#000000'
        });
        stageRef.current = stage;

        const cleanPdbId = pdbId.trim().toUpperCase();

        stage.loadFile(`rcsb://${cleanPdbId}`).then((component: any) => {
            if (!component || !component.structure) throw new Error("Component not created");
            
            // Wait for NGL to settle internal state
            setTimeout(() => {
                if (!stageRef.current) return;
                try {
                    // Remove any existing representations just in case
                    component.removeAllRepresentations();

                    component.addRepresentation('cartoon', { 
                        color: 'teal', 
                        opacity: 0.8,
                        quality: 'medium'
                    });
                    
                    if (component.structure.atomCount < 20000) {
                        component.addRepresentation('ball+stick', {
                            sele: 'hetero and not water',
                            colorValue: 'green'
                        });
                    }
                    
                    stage.autoView();
                    setLoading(false);
                } catch (repErr) {
                    console.error('NGL Representation Crash:', repErr);
                    // Single fallback representation
                    try {
                        component.addRepresentation('line'); 
                        setLoading(false);
                    } catch (e) {
                        setError('Visualization engine failure.');
                        setLoading(false);
                    }
                }
            }, 250);
        }).catch((err) => {
            console.error('NGL Load Error:', err);
            setError('Structure visualization unavailable.');
            setLoading(false);
        });

        const handleResize = () => stage.handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            stage.dispose();
            stageRef.current = null;
        };
    }, [pdbId]);

    const resetView = () => {
        if (stageRef.current) stageRef.current.autoView();
    };

    return (
        <div className={`relative rounded-2xl overflow-hidden border border-primary/10 bg-black/40 shadow-2xl group ${className}`}>
            <div ref={containerRef} className="w-full h-full min-h-[400px]" />

            {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                    <p className="text-xs font-mono text-muted-foreground animate-pulse uppercase tracking-widest">Rendering Molecular Geometry...</p>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10">
                    <p className="text-sm font-mono text-red-400 uppercase tracking-widest">{error}</p>
                </div>
            )}

            {/* Overlay Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" className="bg-black/40 hover:bg-black/60 border-primary/10" onClick={resetView}>
                    <RefreshCw className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="secondary" className="bg-black/40 hover:bg-black/60 border-primary/10">
                    <Maximize2 className="w-4 h-4" />
                </Button>
            </div>

            <div className="absolute bottom-4 left-4 p-3 bg-black/60 backdrop-blur-md rounded-lg border border-primary/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Box className="w-4 h-4 text-primary" />
                </div>
                <div>
                    <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">Active Model</div>
                    <div className="text-xs font-black font-mono text-primary uppercase">{pdbId}</div>
                </div>
            </div>
        </div>
    );
}
