import { UserProfile, DicomScan, DagNode, ZkProofMetadata, HardwareTelemetry } from '../types';

export const USER_PROFILES: UserProfile[] = [
  {
    id: 'dr_sharma',
    name: 'Dr. Rajesh Sharma',
    role: 'chief_orthopedic',
    title: 'Chief Orthopedic Surgeon',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    institution: 'Apex Level-1 Trauma Institute',
    publicKey: 'ed25519:pk_8f4d9b23...a47e'
  },
  {
    id: 'dr_patel',
    name: 'Dr. Anita Patel',
    role: 'radiologist',
    title: 'Senior Musculoskeletal Radiologist',
    avatar: 'https://images.unsplash.com/photo-1594824813587-0b190f8482fa?w=150&auto=format&fit=crop&q=80',
    institution: 'Department of Diagnostic Imaging',
    publicKey: 'ed25519:pk_3b71e190...8d2c'
  },
  {
    id: 'dr_verma',
    name: 'Dr. Vikram Verma',
    role: 'trauma_specialist',
    title: 'Trauma Team Leader & Resuscitation',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    institution: 'Emergency Trauma Surgery',
    publicKey: 'ed25519:pk_99ac7142...12fb'
  },
  {
    id: 'patient_aarav',
    name: 'Aarav Mehta',
    role: 'patient',
    title: 'Verified Patient (Encrypted Portal)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    institution: 'SentinelMark Encrypted Patient Vault',
    publicKey: 'ed25519:pk_aarav_zk...771e'
  }
];

export const PRIMARY_DICOM_SCAN: DicomScan = {
  scanId: 'DICOM-94821-FX',
  accessionNumber: 'ACC-2026-0903-8812',
  anatomicalRegion: 'Right Wrist (Distal Radius & Ulna)',
  modality: 'Digital Radiography (DR)',
  acquisitionDate: '2026-09-03 09:12:44 UTC',
  dimensions: '2048 x 2048 @ 16-bit Grayscale',
  sliceThickness: 'Planar PA / Lateral Projection',
  watermarkHash: '0x8a3f721d9b04c86e3f2187bca60912df4482',
  patient: {
    id: 'PT-99420',
    name: 'Aarav Mehta',
    age: 42,
    gender: 'Male',
    bloodGroup: 'O+',
    traumaMechanism: 'Fall on Outstretched Hand (FOOSH)',
    injurySite: 'Dorsal right wrist deformity & acute radial styloid tenderness',
    admitTime: '08:45 AM Local',
    spo2: 99,
    heartRate: 74,
    bloodPressure: '122/78 mmHg',
    painScore: 7,
    triageLevel: 'Level 2 Emergent'
  },
  localization: {
    label: 'Distal Radius Hairline Fracture',
    confidence: 94.2,
    boundingBox: {
      x: 32,
      y: 46,
      width: 38,
      height: 24
    },
    displacementMm: 2.0,
    fractureType: 'Acute Extra-Articular Transverse (Colles Variant)',
    angulationDegrees: 14.5,
    scaphoidInvolved: false
  },
  reportSummary: 'Acute transverse fracture of the distal radial metaphysis with 2mm dorsal displacement. Cortical step-off noted along the radial border. No scaphoid involvement, ulnar styloid intact, radiocarpal articular surface congruent.',
  recommendedTriage: 'Surgical Closed Reduction / Volar Plating'
};

export const ALTERNATIVE_SCANS: DicomScan[] = [
  PRIMARY_DICOM_SCAN,
  {
    scanId: 'DICOM-94822-SC',
    accessionNumber: 'ACC-2026-0903-8819',
    anatomicalRegion: 'Right Carpus (Scaphoid Waist Focus)',
    modality: 'High-Res Digital Radiography',
    acquisitionDate: '2026-09-03 09:35:12 UTC',
    dimensions: '2048 x 2048 @ 16-bit Grayscale',
    sliceThickness: 'Scaphoid Oblique Projection',
    watermarkHash: '0x992b10ef563821aa0988cc7104b2a8d1192',
    patient: {
      id: 'PT-99421',
      name: 'Priya Narang',
      age: 29,
      gender: 'Female',
      bloodGroup: 'B+',
      traumaMechanism: 'Motorcycle handlebar impact',
      injurySite: 'Anatomical snuffbox acute focal tenderness',
      admitTime: '09:02 AM Local',
      spo2: 98,
      heartRate: 82,
      bloodPressure: '118/74 mmHg',
      painScore: 8,
      triageLevel: 'Level 2 Emergent'
    },
    localization: {
      label: 'Scaphoid Waist Non-Displaced Fracture',
      confidence: 91.8,
      boundingBox: {
        x: 42,
        y: 52,
        width: 22,
        height: 18
      },
      displacementMm: 0.4,
      fractureType: 'Herbert Type B2 Non-Displaced Waist',
      angulationDegrees: 4.0,
      scaphoidInvolved: true
    },
    reportSummary: 'Linear radiolucency traversing the scaphoid waist. Minimal humped back deformity. High avascular necrosis risk. Distal radius is intact.',
    recommendedTriage: 'Percutaneous Screw Fixation vs Thumb Spica Rigid Immobilization'
  }
];

export const INITIAL_DAG_NODES: DagNode[] = [
  {
    id: 'node-genesis',
    authorName: 'SentinelMark Edge AI (v4.2-SecureTPU)',
    authorRole: 'Hardware-Enclaved Diagnostic Genesis Engine',
    authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    timestamp: '09:14:22 UTC',
    decision: 'accept',
    clinicalNote: 'Zero-knowledge intake verified. Distal radius transverse fracture localized with 94.2% confidence. 2.0mm dorsal cortical step-off measured. Mathematical bounding box committed to Groth16 circuit.',
    signatureEd25519: '0x8a3f89012cd4e6a782b190f8482fa8102f92b71940ac783109a8bc43f1e98d90',
    parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    nodeHash: '0x8a3f721d9b04c86e3f2187bca60912df4482b8109d72a4128fbbcc902189af01',
    isGenesis: true
  },
  {
    id: 'node-dr-sharma',
    authorName: 'Dr. Rajesh Sharma',
    authorRole: 'Chief Orthopedic Surgeon',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    timestamp: '09:22:15 UTC',
    decision: 'accept',
    clinicalNote: 'Confirmed. 2mm dorsal displacement. Volar splinting approved. Pre-op templating for 3.5mm low-profile anatomical plate initiated.',
    signatureEd25519: '0x9f1201948ba2904efbc71029487cba9104085ef1934ba701e912480bfba1029c',
    parentHash: '0x8a3f721d9b04c86e3f2187bca60912df4482b8109d72a4128fbbcc902189af01',
    nodeHash: '0x9f12ab7801cd4a88bc71092e0193bbfa89012738ea0931bc770192cae019348b'
  },
  {
    id: 'node-dr-patel',
    authorName: 'Dr. Anita Patel',
    authorRole: 'Senior Musculoskeletal Radiologist',
    authorAvatar: 'https://images.unsplash.com/photo-1594824813587-0b190f8482fa?w=150&auto=format&fit=crop&q=80',
    timestamp: '09:28:40 UTC',
    decision: 'accept',
    clinicalNote: 'Reviewed scan. Bone mineral density normal for age. Scaphoid waist and distal radioulnar joint (DRUJ) congruent. Agree with Dr. Sharma.',
    signatureEd25519: '0x4c8e71098bca0129f8482ab8102948ca1092ef9034ac710298a0021bcfba9102',
    parentHash: '0x9f12ab7801cd4a88bc71092e0193bbfa89012738ea0931bc770192cae019348b',
    nodeHash: '0x4c8ef3092bba01938fe7102948acba1029481029fa0192837bc901a0293847ca'
  }
];

export const INITIAL_ZK_METADATA: ZkProofMetadata = {
  circuitType: 'Groth16 (BN254 Pairing Curve)',
  constraintCount: 119482,
  phiBitsExposed: 0,
  proofBytes: '0x17fa094b8e2190...7c9b012d (Compressed G1/G2 pairing elements)',
  verificationStatus: 'VERIFIED_VALID',
  verificationTimeMs: 14.2,
  lastVerifiedTimestamp: 'Just now (Hardware Enclave verified)'
};

export const INITIAL_HARDWARE_TELEMETRY: HardwareTelemetry = {
  cpuEntropyVarianceMs: 12.4,
  psnrDb: 129.76,
  edgeInferenceLatencyMs: 18.2,
  tpuCoreUtilizationPct: 41.5,
  secureEnclaveStatus: 'LOCKED_VALID',
  clockJitterPpm: 0.18
};
