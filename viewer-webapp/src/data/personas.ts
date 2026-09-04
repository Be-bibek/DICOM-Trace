import type { Persona } from '../types';

export const CLINICAL_PERSONAS: Persona[] = [
  {
    id: 'dr-rajesh-sharma',
    name: 'Dr. Rajesh Sharma',
    roleTitle: 'Chief Orthopedic Surgeon',
    department: 'Orthopedic & Reconstructive Surgery',
    type: 'surgeon',
    publicKey: '0x7a8f19bc32e8d91024bc6a11394a5e2f7b8c01d46798e1f023ac456891b27a8f',
    privateKeyPreview: '0x7a8fe8b104c3290d2394ae817290fbbcae9102948172903471029348191b2cde',
    avatarInitials: 'RS',
    avatarColor: 'from-amber-400/80 to-orange-500/80'
  },
  {
    id: 'dr-priya-patel',
    name: 'Dr. Priya Patel',
    roleTitle: 'Senior Radiologist',
    department: 'Diagnostic Radiology & Neuro-imaging',
    type: 'radiologist',
    publicKey: '0x9e31448b11c97a3f82049e2187364120ca561029384716253481920384ca9e31',
    privateKeyPreview: '0x9e31ff48201a938e716253401928374619283746102938471029384784ca0192',
    avatarInitials: 'PP',
    avatarColor: 'from-cyan-400/80 to-blue-500/80'
  },
  {
    id: 'dr-amit-verma',
    name: 'Dr. Amit Verma',
    roleTitle: 'Trauma Specialist',
    department: 'Emergency & Acute Trauma Care',
    type: 'trauma',
    publicKey: '0x4b72901384716253481920384716253481920384716253481920384712d34b72',
    privateKeyPreview: '0x4b72aa9182374619283746102938471625348192038471625348192012d38291',
    avatarInitials: 'AV',
    avatarColor: 'from-purple-400/80 to-indigo-500/80'
  },
  {
    id: 'aarav-mehta',
    name: 'Aarav Mehta',
    roleTitle: 'Patient Portal',
    department: 'Outpatient Orthopedics',
    type: 'patient',
    publicKey: '0x33e19823746192837461029384716253481920384716253481920384fa0933e1',
    privateKeyPreview: '0x33e1cc01928374619283746102938471625348192038471625348192fa099182',
    avatarInitials: 'AM',
    avatarColor: 'from-emerald-400/80 to-teal-500/80'
  }
];

export const PATIENT_RECORD = {
  name: 'Aarav Mehta',
  id: 'PT-4402',
  age: 42,
  bloodGroup: 'O+',
  mechanism: 'Fall on Wrist',
  imagingModality: 'Digital Radiography (Wrist AP/Lateral)',
  acquisitionTimestamp: '2026-09-03 18:24:12 UTC',
  anonymizedHash: '0x88f23c91d4e082b9a714f3b89012cd34e12938746a5b283719c014fa2891d092'
};
