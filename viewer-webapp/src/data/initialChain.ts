import type { DAGNode } from '../types';

export const INITIAL_DAG_CHAIN: DAGNode[] = [
  {
    id: 'node-genesis-0',
    blockNumber: 0,
    authorName: 'Clinic Edge Node #08 (YOLOv8-Med)',
    authorRole: 'Edge Enclave AI Ingestion',
    authorPublicKey: '0xa4f108237e19284716253481920384716253481920384716253481920384a4f1',
    timestamp: '18:24:15 UTC',
    hash: '0xa4f1c98230b4d5e6f71290384716253481920384716253481920384716253a4f',
    prevHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    signature: 'ed25519_sig:9901ae4f32c8109d76ba45c312e0f89a124058d9230cba',
    isGenesis: true,
    modelDetails: 'YOLOv8-Med-Fracture v4.2 [Zero-Leak Enclave]',
    clinicalNote: 'Local edge AI detection completed in 14.8ms. Salter-Harris type II / extra-articular distal radial transverse cortical breach identified.',
    metrics: {
      confidence: 94.2,
      radiologicalFeature: 'Distal Radius Hairline Fracture',
      intraArticularStepOff: '1.8mm - 2.1mm'
    }
  },
  {
    id: 'node-dr-sharma-1',
    blockNumber: 1,
    authorName: 'Dr. Rajesh Sharma',
    authorRole: 'Chief Orthopedic Surgeon',
    authorPublicKey: '0x7a8f19bc32e8d91024bc6a11394a5e2f7b8c01d46798e1f023ac456891b27a8f',
    timestamp: '18:28:40 UTC',
    hash: '0x3f98ba71029384716253481920384716253481920384716253481920384791b2',
    prevHash: '0xa4f1c98230b4d5e6f71290384716253481920384716253481920384716253a4f',
    signature: 'ed25519_sig:8841bc901ef23719a002394817290bcdae10293847192837',
    decision: 'approve',
    clinicalNote: 'Displaced fracture confirmed. Intra-articular step-off ~2mm. Recommend volar plating. Neurovascular bundle intact.',
    metrics: {
      confidence: 98.6,
      radiologicalFeature: 'Volar tilt disrupted (-12° dorsal angulation)',
      intraArticularStepOff: '~2.0mm confirmed'
    }
  },
  {
    id: 'node-dr-patel-2',
    blockNumber: 2,
    authorName: 'Dr. Priya Patel',
    authorRole: 'Senior Radiologist',
    authorPublicKey: '0x9e31448b11c97a3f82049e2187364120ca561029384716253481920384ca9e31',
    timestamp: '18:31:02 UTC',
    hash: '0x81b290123948172903471029348191b2cde716253481920384716253481984ca',
    prevHash: '0x3f98ba71029384716253481920384716253481920384716253481920384791b2',
    signature: 'ed25519_sig:771239401928374619283746102938471029384784ca0192',
    decision: 'approve',
    clinicalNote: 'Agree with Dr. Sharma. No carpal bone dissociation. Scapholunate interval measured at 1.9mm (within normal limits). Pronator fat stripe obliterated.',
    metrics: {
      confidence: 99.1,
      radiologicalFeature: 'Distal radioulnar joint congruence maintained',
      intraArticularStepOff: 'Step-off 1.9mm verified'
    }
  }
];
