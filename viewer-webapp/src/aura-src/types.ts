export type RoleType = 'chief_orthopedic' | 'radiologist' | 'trauma_specialist' | 'patient';

export interface UserProfile {
  id: string;
  name: string;
  role: RoleType;
  title: string;
  avatar: string;
  institution: string;
  publicKey: string;
}

export interface PatientVitals {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  traumaMechanism: string;
  injurySite: string;
  admitTime: string;
  spo2: number;
  heartRate: number;
  bloodPressure: string;
  painScore: number;
  triageLevel: 'Level 1 Immediate' | 'Level 2 Emergent' | 'Level 3 Urgent';
}

export interface FractureLocalization {
  label: string;
  confidence: number;
  boundingBox: {
    x: number; // percentage
    y: number;
    width: number;
    height: number;
  };
  displacementMm: number;
  fractureType: string;
  angulationDegrees: number;
  scaphoidInvolved: boolean;
}

export interface HardwareTelemetry {
  cpuEntropyVarianceMs: number;
  psnrDb: number;
  edgeInferenceLatencyMs: number;
  tpuCoreUtilizationPct: number;
  secureEnclaveStatus: 'LOCKED_VALID' | 'TAMPER_DETECTED';
  clockJitterPpm: number;
}

export interface ZkProofMetadata {
  circuitType: string; // 'Groth16 (BN254)'
  constraintCount: number; // 119500
  phiBitsExposed: number; // 0
  proofBytes: string;
  verificationStatus: 'VERIFIED_VALID' | 'BREACH_REJECTED';
  verificationTimeMs: number;
  lastVerifiedTimestamp: string;
  tamperAnomalyDetails?: string;
}

export type ConsensusDecision = 'accept' | 'modify' | 'reject';

export interface DagNode {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  timestamp: string;
  decision: ConsensusDecision;
  clinicalNote: string;
  signatureEd25519: string;
  parentHash: string;
  nodeHash: string;
  isGenesis?: boolean;
}

export interface DicomScan {
  scanId: string;
  accessionNumber: string;
  anatomicalRegion: string;
  modality: string;
  acquisitionDate: string;
  dimensions: string;
  sliceThickness: string;
  watermarkHash: string;
  patient: PatientVitals;
  localization: FractureLocalization;
  reportSummary: string;
  recommendedTriage: string;
  customImageUrl?: string;
}

export type AppNavTab = 
  | 'overview' 
  | 'diagnostics' 
  | 'studies' 
  | 'dag' 
  | 'security' 
  | 'reports' 
  | 'settings';

export interface EnclaveAuthState {
  isAuthenticated: boolean;
  currentUser: UserProfile;
  sessionHash: string;
  enclaveHardware: string;
  keyFingerprint: string;
  authenticatedAt: string;
}

export type DepartmentFilter = 
  | 'All Records'
  | 'Orthopedics'
  | 'Radiology'
  | 'Trauma Unit'
  | 'ZK Proof Ledger';
