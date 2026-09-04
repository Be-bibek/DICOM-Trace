export type RoleType = 'surgeon' | 'radiologist' | 'trauma' | 'patient';

export interface Persona {
  id: string;
  name: string;
  roleTitle: string;
  department: string;
  type: RoleType;
  publicKey: string;
  privateKeyPreview: string;
  avatarInitials: string;
  avatarColor: string;
}

export type ConsensusDecision = 'approve' | 'modify' | 'reject';

export interface DAGNode {
  id: string;
  blockNumber: number;
  authorName: string;
  authorRole: string;
  authorPublicKey: string;
  timestamp: string;
  hash: string;
  prevHash: string;
  signature: string;
  decision?: ConsensusDecision;
  clinicalNote: string;
  isGenesis?: boolean;
  modelDetails?: string;
  metrics?: {
    confidence: number;
    radiologicalFeature: string;
    intraArticularStepOff: string;
  };
}

export interface PatientRecord {
  name: string;
  id: string;
  age: number;
  bloodGroup: string;
  mechanism: string;
  imagingModality: string;
  acquisitionTimestamp: string;
  anonymizedHash: string;
}

export interface ZKTelemetry {
  provingSystem: string;
  r1csConstraints: number;
  proofSizeBytes: number;
  phiLeakageBits: number;
  merkleRoot: string;
  verificationNonce: string;
  isValid: boolean;
}
