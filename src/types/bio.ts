export type SequenceType = 'DNA' | 'RNA' | 'Protein';

export interface AnalysisResult {
  id: string;
  timestamp: string;
  name: string;
  type: SequenceType;
  sequence: string;
  length: number;
  gcContent?: number;
  molecularWeight: number;
  isCompliant: boolean;
  warnings: string[];
  stats: {
    label: string;
    value: string | number;
    unit?: string;
  }[];
  restrictionSites?: {
    enzyme: string;
    position: number;
    sequence: string;
  }[];
  translation?: string;
  pdbId?: string;
}

export interface BLASTTableResult {
  accession: string;
  description: string;
  score: number;
  eValue: number;
  identity: number;
  queryCoverage: number;
}
