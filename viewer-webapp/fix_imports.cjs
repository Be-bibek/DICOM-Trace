const fs = require('fs');

function fixImport(file, original) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace("import type {  } from '';", original);
  fs.writeFileSync(file, content);
}

fixImport('src/data/personas.ts', "import type { Persona } from '../types';");
fixImport('src/components/VaultLoginModal.tsx', "import type { Persona } from '../types';");
fixImport('src/components/DynamicIslandTelemetry.tsx', "import type { Persona } from '../types';");
fixImport('src/components/ConsensusDAGLedger.tsx', "import type { DAGNode, Persona, ConsensusDecision } from '../types';");
fixImport('src/App.tsx', "import type { Persona, DAGNode } from './types';");
