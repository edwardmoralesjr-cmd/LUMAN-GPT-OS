import { CreativeEcosystemEngine, type CreativeNode } from "./index.js";

const now = new Date().toISOString();
const nodes: CreativeNode[] = [
  {
    id: "black-rose-shadow-law",
    title: "The Shadow Must Be Witnessed",
    type: "codex_principle",
    projectId: "black-rose-codex",
    status: "published",
    themes: ["shadow work", "self-knowledge", "transformation"],
    emotionalSignatures: ["grief", "acceptance"],
    symbols: ["black rose", "mirror"],
    sourceNodeIds: [],
    derivedNodeIds: [],
    relationships: [],
    transformationPotential: [],
    metrics: { stagnationRisk: 0.1, ecosystemValue: 0.95, priority: 0.7, momentum: 0.65, burnoutRisk: 0.15 },
    canonLevel: "locked",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "visionary-empty-canvas",
    title: "Empty Canvas",
    type: "song",
    projectId: "visionary",
    status: "completed",
    themes: ["self-knowledge", "creative authorship", "transformation"],
    emotionalSignatures: ["grief", "hope"],
    symbols: ["canvas", "mirror"],
    sourceNodeIds: ["black-rose-shadow-law"],
    derivedNodeIds: [],
    relationships: [],
    transformationPotential: [],
    metrics: { stagnationRisk: 0.2, ecosystemValue: 0.9, priority: 0.95, momentum: 0.9, burnoutRisk: 0.25 },
    canonLevel: "working",
    createdAt: now,
    updatedAt: now
  }
];

const engine = new CreativeEcosystemEngine(nodes);
console.log(JSON.stringify(engine.executeCommand("/synthesize"), null, 2));
console.log(JSON.stringify(engine.executeCommand("/gaps"), null, 2));
console.log(JSON.stringify(engine.executeCommand("/ecosystem"), null, 2));
