import { NextRequest, NextResponse } from 'next/server';
import { performFullAnalysis } from '@/lib/bio-utils';

export async function POST(req: NextRequest) {
    try {
        const { sequence, name } = await req.json();

        if (!sequence) {
            return NextResponse.json({ error: 'Sequence data is required' }, { status: 400 });
        }

        // Execute real-time bioinformatics analysis pipeline
        const analysis = await performFullAnalysis(name || 'Unnamed Submission', sequence);

        return NextResponse.json(analysis);
    } catch (error) {
        console.error('ANALYSIS_ERROR:', error);
        return NextResponse.json({ error: 'Internal Core Analysis Failure' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        status: 'SYSTEM_OPERATIONAL',
        version: '1.0.4.52',
        engine: 'BIOSEQ_ANALYSIS',
        uptime: process.uptime()
    });
}
