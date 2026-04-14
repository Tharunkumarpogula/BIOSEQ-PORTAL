import { AnalysisResult, BLASTTableResult } from '@/types/bio';

export const cleanSequence = (seq: string): string => {
    // Remove FASTA headers (lines starting with >)
    const lines = seq.split('\n');
    const filteredLines = lines.filter(line => !line.trim().startsWith('>'));
    return filteredLines.join('').replace(/[\s\n\r]/g, '').toUpperCase();
};

export const detectType = (seq: string): 'DNA' | 'RNA' | 'Protein' => {
    const cleaned = cleanSequence(seq);
    if (/^[ATGC]+$/.test(cleaned)) return 'DNA';
    if (/^[AUGC]+$/.test(cleaned)) return 'RNA';
    return 'Protein';
};

export const calculateGCContent = (seq: string): number => {
    const cleaned = cleanSequence(seq);
    const gcCount = (cleaned.match(/[GC]/g) || []).length;
    return Number(((gcCount / cleaned.length) * 100).toFixed(2));
};

export const calculateMolecularWeight = (seq: string, type: string): number => {
    const cleaned = cleanSequence(seq);
    // Simplified molecular weights
    const weights: Record<string, number> = {
        A: 313.2, T: 304.2, G: 329.2, C: 289.2, U: 306.2,
        R: 174.2, N: 132.1, D: 133.1, Q: 146.2, E: 147.1,
        G_AA: 75.1, H: 155.2, I: 131.2, L: 131.2, K: 146.2,
        M: 149.2, F: 165.2, P: 115.1, S: 105.1, T_AA: 119.1,
        W: 204.2, Y: 181.2, V: 117.1
    };

    return cleaned.split('').reduce((acc, char) => acc + (weights[char] || 110), 0);
};

export const translateDNA = (seq: string): string => {
    const codonTable: Record<string, string> = {
        'ATA': 'I', 'ATC': 'I', 'ATT': 'I', 'ATG': 'M',
        'ACA': 'T', 'ACC': 'T', 'ACG': 'T', 'ACT': 'T',
        'AAC': 'N', 'AAT': 'N', 'AAA': 'K', 'AAG': 'K',
        'AGC': 'S', 'AGT': 'S', 'AGA': 'R', 'AGG': 'R',
        'CTA': 'L', 'CTC': 'L', 'CTG': 'L', 'CTT': 'L',
        'CCA': 'P', 'CCC': 'P', 'CCG': 'P', 'CCT': 'P',
        'CAC': 'H', 'CAT': 'H', 'CAA': 'Q', 'CAG': 'Q',
        'CGA': 'R', 'CGC': 'R', 'CGG': 'R', 'CGT': 'R',
        'GTA': 'V', 'GTC': 'V', 'GTG': 'V', 'GTT': 'V',
        'GCA': 'A', 'GCC': 'A', 'GCG': 'A', 'GCT': 'A',
        'GAC': 'D', 'GAT': 'D', 'GAA': 'E', 'GAG': 'E',
        'GGA': 'G', 'GGC': 'G', 'GGG': 'G', 'GGT': 'G',
        'TCA': 'S', 'TCC': 'S', 'TCG': 'S', 'TCT': 'S',
        'TTC': 'F', 'TTT': 'F', 'TTA': 'L', 'TTG': 'L',
        'TAC': 'Y', 'TAT': 'Y', 'TAA': '_', 'TAG': '_',
        'TGC': 'C', 'TGT': 'C', 'TGA': '_', 'TGG': 'W',
    };

    const cleaned = cleanSequence(seq);
    let protein = '';
    for (let i = 0; i <= cleaned.length - 3; i += 3) {
        const codon = cleaned.substring(i, i + 3);
        protein += codonTable[codon] || '?';
    }
    return protein;
};

export const RESTRICTION_ENZYMES = [
    { name: 'EcoRI', sequence: 'GAATTC' },
    { name: 'BamHI', sequence: 'GGATCC' },
    { name: 'HindIII', sequence: 'AAGCTT' },
    { name: 'NotI', sequence: 'GCGGCCGC' },
    { name: 'XhoI', sequence: 'CTCGAG' },
    { name: 'SacI', sequence: 'GAGCTC' },
    { name: 'KpnI', sequence: 'GGTACC' },
    { name: 'SmaI', sequence: 'CCCGGG' },
    { name: 'SpeI', sequence: 'ACTAGT' },
    { name: 'PstI', sequence: 'CTGCAG' },
    { name: 'EcoRV', sequence: 'GATATC' },
    { name: 'HincII', sequence: 'GTYRAC' }, // Degenerate
    { name: 'AluI', sequence: 'AGCT' },
    { name: 'DpnI', sequence: 'GATC' }
];

export const findRestrictionSites = (seq: string) => {
    const cleaned = cleanSequence(seq);
    const sites: { enzyme: string; position: number; sequence: string }[] = [];

    RESTRICTION_ENZYMES.forEach(enzyme => {
        // Basic support for degenerate bases could be added here, currently literal match
        // Handling GTYRAC (Y=C/T, R=A/G)
        let regexStr = enzyme.sequence
            .replace(/R/g, '[AG]')
            .replace(/Y/g, '[CT]')
            .replace(/N/g, '[ATGC]');

        const regex = new RegExp(regexStr, 'g');
        let match;
        while ((match = regex.exec(cleaned)) !== null) {
            sites.push({
                enzyme: enzyme.name,
                position: match.index + 1,
                sequence: match[0]
            });
        }
    });

    return sites.sort((a, b) => a.position - b.position);
};

export const findORFs = (seq: string) => {
    const cleaned = cleanSequence(seq);
    const orfs: { start: number; end: number; frame: number; length: number; sequence: string }[] = [];
    const startCodons = ['ATG'];
    const stopCodons = ['TAA', 'TAG', 'TGA'];

    // Search in 3 forward frames
    for (let frame = 0; frame < 3; frame++) {
        for (let i = frame; i <= cleaned.length - 3; i += 3) {
            const codon = cleaned.substring(i, i + 3);
            if (startCodons.includes(codon)) {
                // Potential ORF found, search for stop
                for (let j = i + 3; j <= cleaned.length - 3; j += 3) {
                    const stopCodon = cleaned.substring(j, j + 3);
                    if (stopCodons.includes(stopCodon)) {
                        const orfSeq = cleaned.substring(i, j + 3);
                        if (orfSeq.length >= 30) { // Minimum 10 amino acids
                            orfs.push({
                                start: i + 1,
                                end: j + 3,
                                frame: frame + 1,
                                length: orfSeq.length,
                                sequence: orfSeq
                            });
                        }
                        i = j; // Move i to end of ORF
                        break;
                    }
                }
            }
        }
    }
    return orfs.sort((a, b) => b.length - a.length);
};

export const fetchNCBIData = async (accession: string) => {
    try {
        const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=${accession}&rettype=fasta&retmode=text`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const text = await response.text();
        const lines = text.split('\n');
        const header = lines[0].replace('>', '');
        const sequence = lines.slice(1).join('').replace(/\s/g, '');
        return { header, sequence };
    } catch (e) {
        console.error('NCBI_FETCH_ERROR:', e);
        return null;
    }
};

export const fetchUniProtData = async (query: string) => {
    try {
        const url = `https://rest.uniprot.org/uniprotkb/search?query=${query}&format=json&size=1`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        return data.results && data.results[0] ? data.results[0] : null;
    } catch (e) {
        console.error('UNIPROT_FETCH_ERROR:', e);
        return null;
    }
};

export const performFullAnalysis = async (name: string, inputSequence: string): Promise<AnalysisResult> => {
    let sequence = cleanSequence(inputSequence);
    let finalName = name;

    // 1. If input is an Accession ID, fetch real sequence from NCBI
    if (/^[A-Z]{1,2}_\d+(\.\d+)?$/.test(inputSequence) || /^[A-Z]\d{5,8}$/.test(inputSequence)) {
        console.log('Detected Accession ID, fetching from NCBI...');
        const ncbiResult = await fetchNCBIData(inputSequence);
        if (ncbiResult) {
            sequence = ncbiResult.sequence;
            finalName = ncbiResult.header;
        }
    }

    const type = detectType(sequence);
    const length = sequence.length;

    // 2. Fetch UniProt metadata if it's a known protein sequence or has a name
    let unproData = null;
    let pdbId = undefined;
    if (type === 'Protein' && length > 20) {
        unproData = await fetchUniProtData(finalName || sequence.substring(0, 30));
        // Try to find a cross-referenced PDB ID
        if (unproData?.uniProtKBCrossReferences) {
            const pdbRef = unproData.uniProtKBCrossReferences.find((ref: any) => ref.database === 'PDB');
            if (pdbRef) pdbId = pdbRef.id;
        }
    } else if (type === 'DNA' || type === 'RNA') {
        // For DNA/RNA, we could potentially find structures too, but let's stick to Proteins for now
        // or a hardcoded fallback mapping for common genes like HBB (1HBB)
        if (finalName.includes('hemoglobin') || finalName.includes('HBB')) pdbId = '1HBB';
        if (finalName.includes('ins') || finalName.includes('insulin')) pdbId = '1BEN';
    }

    // 3. Local Bioinformatics Logic
    const gcContent = type !== 'Protein' ? calculateGCContent(sequence) : undefined;
    const molWeight = calculateMolecularWeight(sequence, type);
    const restrictionSites = type === 'DNA' ? findRestrictionSites(sequence) : [];
    const translation = type === 'DNA' ? translateDNA(sequence) : undefined;
    const orfs = type === 'DNA' ? findORFs(sequence) : [];

    return {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        name: finalName || 'Unnamed Submission',
        type,
        sequence,
        length,
        gcContent,
        molecularWeight: molWeight,
        isCompliant: true,
        warnings: [],
        stats: [
            { label: 'Length', value: length, unit: 'bp' },
            { label: 'Type', value: type },
            { label: 'GC Content', value: gcContent ? `${gcContent}%` : 'N/A' },
            { label: 'Mol. Weight', value: molWeight.toFixed(2), unit: 'Da' },
            { label: 'ORFs Found', value: orfs.length }
        ],
        restrictionSites,
        translation: translation || (unproData ? unproData.primaryAccession : undefined),
        pdbId
    };
};

export const getMockAnalysis = (name: string, sequence: string): AnalysisResult => {
    // Keep this for fallback, but will use performFullAnalysis mostly
    const type = detectType(sequence);
    const length = sequence.length;

    return {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        name,
        type,
        sequence,
        length,
        gcContent: type !== 'Protein' ? calculateGCContent(sequence) : undefined,
        molecularWeight: calculateMolecularWeight(sequence, type),
        isCompliant: true,
        warnings: [],
        stats: [
            { label: 'Length', value: length, unit: 'bp' },
            { label: 'Type', value: type },
            { label: 'GC Content', value: type !== 'Protein' ? `${calculateGCContent(sequence)}%` : 'N/A' },
            { label: 'Mol. Weight', value: calculateMolecularWeight(sequence, type).toFixed(2), unit: 'Da' }
        ],
        restrictionSites: type === 'DNA' ? findRestrictionSites(sequence) : [],
        translation: type === 'DNA' ? translateDNA(sequence) : undefined
    };
};

export const mockBLASTResults: BLASTTableResult[] = [
    { accession: 'NM_000558', description: 'Homo sapiens hemoglobin, subunit beta (HBB)', score: 1452, eValue: 0.0, identity: 99.8, queryCoverage: 100 },
    { accession: 'NM_001394', description: 'Mus musculus hemoglobin beta adult chain 1 (Hbb-b1)', score: 1120, eValue: 0.0, identity: 84.5, queryCoverage: 98 },
    { accession: 'XM_005545', description: 'Pan troglodytes hemoglobin subunit beta (HBB)', score: 1445, eValue: 0.0, identity: 99.1, queryCoverage: 100 },
    { accession: 'NM_001097', description: 'Rattus norvegicus hemoglobin subunit beta (Hbb)', score: 1085, eValue: 1e-120, identity: 82.3, queryCoverage: 97 }
];
