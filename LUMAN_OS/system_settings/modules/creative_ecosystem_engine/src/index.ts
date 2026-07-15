export type CreativeNodeType =
  | "idea" | "lyric" | "song" | "album" | "poem" | "book" | "chapter"
  | "codex_principle" | "character" | "symbol" | "life_experience"
  | "family_lesson" | "visual" | "game_system" | "philosophical_framework"
  | "research" | "campaign" | "ritual" | "worldbuilding" | "other";

export type CreativeStatus =
  | "raw" | "active" | "dormant" | "blocked" | "completed" | "published"
  | "recyclable" | "transformed" | "archived" | "canonical";

export type RelationshipType =
  | "inspired_by" | "expands" | "contradicts" | "transforms" | "embodies"
  | "references" | "resolves" | "musical_counterpart" | "literary_counterpart"
  | "visual_counterpart" | "life_application" | "shares_theme" | "precedes"
  | "depends_on";

export type RecommendationType =
  | "continue_current_task" | "context_pivot" | "consolidate_existing_work"
  | "transform_existing_concept" | "resolve_canon_conflict"
  | "develop_missing_counterpart" | "rest_and_incubate" | "archive_or_release";

export interface CreativeMetrics {
  stagnationRisk: number;
  ecosystemValue: number;
  priority: number;
  momentum: number;
  burnoutRisk: number;
}

export interface CreativeRelationship {
  targetNodeId: string;
  relationshipType: RelationshipType;
  strength: number;
  notes?: string;
  approvalState?: "suggested" | "approved" | "rejected" | "automatic_noncanonical";
}

export interface TransformationOption {
  targetType: CreativeNodeType;
  targetProjectId?: string;
  rationale: string;
  estimatedValue: number;
}

export interface CreativeNode {
  id: string;
  title: string;
  type: CreativeNodeType;
  projectId?: string;
  status: CreativeStatus;
  themes: string[];
  emotionalSignatures: string[];
  symbols: string[];
  sourceNodeIds: string[];
  derivedNodeIds: string[];
  relationships: CreativeRelationship[];
  transformationPotential: TransformationOption[];
  metrics: CreativeMetrics;
  summary?: string;
  canonLevel?: "locked" | "working" | "unresolved" | "noncanonical";
  createdAt: string;
  updatedAt: string;
}

export interface TaskCandidate {
  id: string;
  title: string;
  nodeId?: string;
  projectId?: string;
  recommendationType: RecommendationType;
  description: string;
  estimatedMinutes?: number;
  scores: {
    projectPriority: number;
    creativeMomentum: number;
    crossProjectValue: number;
    dependencyValue: number;
    emotionalAlignment: number;
    completionProbability: number;
    antiStagnationValue: number;
    availableTimeFit: number;
    burnoutRisk: number;
  };
}

export interface RankedTask extends TaskCandidate {
  totalScore: number;
  rationale: string[];
}

export interface SynthesisSuggestion {
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: RelationshipType;
  confidence: number;
  reason: string;
  approvalState: "suggested";
}

export interface GapOpportunity {
  concept: string;
  sourceNodeIds: string[];
  missingRepresentations: CreativeNodeType[];
  suggestedAction: string;
  estimatedValue: number;
}

export interface StagnationReport {
  overallRisk: number;
  blockedNodeIds: string[];
  dormantHighValueNodeIds: string[];
  repetitionWarnings: string[];
  overloadWarnings: string[];
  recommendations: string[];
}

export interface CommandResult<T = unknown> {
  command: string;
  generatedAt: string;
  data: T;
}

const clamp01 = (value: number): number =>
  Number.isNaN(value) ? 0 : Math.max(0, Math.min(1, value));

const average = (values: number[]): number =>
  values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;

const normalize = (value: string): string => value.trim().toLowerCase();

const overlapScore = (left: string[], right: string[]): number => {
  const a = new Set(left.map(normalize).filter(Boolean));
  const b = new Set(right.map(normalize).filter(Boolean));
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const value of a) if (b.has(value)) shared += 1;
  return shared / new Set([...a, ...b]).size;
};

const relationshipFor = (source: CreativeNode, target: CreativeNode): RelationshipType => {
  if (source.type === "song" && ["book", "chapter", "codex_principle"].includes(target.type)) {
    return "literary_counterpart";
  }
  if (target.type === "song" && ["book", "chapter", "codex_principle"].includes(source.type)) {
    return "musical_counterpart";
  }
  if (source.type === "visual" || target.type === "visual") return "visual_counterpart";
  if (["life_experience", "family_lesson"].includes(target.type)) return "life_application";
  return "shares_theme";
};

export class CreativeEcosystemEngine {
  private readonly nodes = new Map<string, CreativeNode>();
  private readonly tasks = new Map<string, TaskCandidate>();

  constructor(initialNodes: CreativeNode[] = []) {
    initialNodes.forEach((node) => this.addNode(node));
  }

  addNode(node: CreativeNode): void {
    if (!node.id.trim()) throw new Error("CreativeNode.id is required.");
    this.nodes.set(node.id, structuredClone(node));
  }

  addTaskCandidate(task: TaskCandidate): void {
    this.tasks.set(task.id, structuredClone(task));
  }

  listNodes(): CreativeNode[] {
    return [...this.nodes.values()].map((node) => structuredClone(node));
  }

  synthesize(minimumConfidence = 0.28): SynthesisSuggestion[] {
    const nodes = this.listNodes();
    const suggestions: SynthesisSuggestion[] = [];

    for (let i = 0; i < nodes.length; i += 1) {
      const source = nodes[i];
      if (!source) continue;
      for (let j = i + 1; j < nodes.length; j += 1) {
        const target = nodes[j];
        if (!target) continue;
        if (source.relationships.some((link) => link.targetNodeId === target.id)) continue;

        const crossProjectBonus = source.projectId && target.projectId && source.projectId !== target.projectId ? 0.15 : 0;
        const confidence = clamp01(average([
          overlapScore(source.themes, target.themes),
          overlapScore(source.symbols, target.symbols),
          overlapScore(source.emotionalSignatures, target.emotionalSignatures)
        ]) + crossProjectBonus);

        if (confidence < minimumConfidence) continue;
        suggestions.push({
          sourceNodeId: source.id,
          targetNodeId: target.id,
          relationshipType: relationshipFor(source, target),
          confidence,
          reason: "Related themes, symbols, emotional signatures, lineage, or cross-project meaning detected.",
          approvalState: "suggested"
        });
      }
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  stagnationCheck(): StagnationReport {
    const nodes = this.listNodes();
    const blocked = nodes.filter((node) =>
      node.status === "blocked" || (node.status === "active" && node.metrics.stagnationRisk >= 0.6)
    );
    const dormantHighValue = nodes.filter((node) =>
      ["dormant", "recyclable", "archived"].includes(node.status) && node.metrics.ecosystemValue >= 0.65
    );
    const active = nodes.filter((node) => node.status === "active");
    const overloadWarnings = active.length > 12
      ? [`${active.length} active nodes may be fragmenting attention.`]
      : [];
    const repetitionWarnings: string[] = [];

    const themes = new Map<string, number>();
    active.flatMap((node) => node.themes.map(normalize)).forEach((theme) => themes.set(theme, (themes.get(theme) ?? 0) + 1));
    const repeated = [...themes.entries()].filter(([, count]) => count >= 5).map(([theme]) => theme);
    if (repeated.length > 0) repetitionWarnings.push(`Themes may need deeper transformation: ${repeated.join(", ")}.`);

    const recommendations: string[] = [];
    if (blocked.length > 0) recommendations.push("Use a related context pivot rather than forcing the blocked medium.");
    if (dormantHighValue.length > 0) recommendations.push("Recycle one dormant high-value concept into another form.");
    if (repetitionWarnings.length > 0) recommendations.push("Run an evolution review before producing a close thematic repeat.");
    if (overloadWarnings.length > 0) recommendations.push("Consolidate work into the current three strategic fronts.");
    if (recommendations.length === 0) recommendations.push("Continue current momentum while preserving integration and rest.");

    return {
      overallRisk: clamp01(average(nodes.map((node) => node.metrics.stagnationRisk)) + blocked.length * 0.03 + overloadWarnings.length * 0.1),
      blockedNodeIds: blocked.map((node) => node.id),
      dormantHighValueNodeIds: dormantHighValue.map((node) => node.id),
      repetitionWarnings,
      overloadWarnings,
      recommendations
    };
  }

  gaps(): GapOpportunity[] {
    const byTheme = new Map<string, CreativeNode[]>();
    for (const node of this.listNodes()) {
      for (const rawTheme of node.themes) {
        const theme = normalize(rawTheme);
        if (!theme) continue;
        byTheme.set(theme, [...(byTheme.get(theme) ?? []), node]);
      }
    }

    const representationTypes: CreativeNodeType[] = [
      "song", "book", "chapter", "codex_principle", "visual",
      "life_experience", "family_lesson", "philosophical_framework", "worldbuilding"
    ];

    return [...byTheme.entries()]
      .filter(([, nodes]) => nodes.length >= 2)
      .map(([concept, nodes]) => {
        const represented = new Set(nodes.map((node) => node.type));
        const missing = representationTypes.filter((type) => !represented.has(type)).slice(0, 3);
        return {
          concept,
          sourceNodeIds: nodes.map((node) => node.id),
          missingRepresentations: missing,
          suggestedAction: `Develop a ${missing.join(" or ")} expression for the theme "${concept}".`,
          estimatedValue: clamp01(average(nodes.map((node) => node.metrics.ecosystemValue)) + nodes.length * 0.04)
        };
      })
      .filter((gap) => gap.missingRepresentations.length > 0)
      .sort((a, b) => b.estimatedValue - a.estimatedValue);
  }

  nextBestTasks(limit = 5): RankedTask[] {
    return [...this.tasks.values()]
      .map((task) => {
        const s = task.scores;
        const positive =
          s.projectPriority * 1.2 + s.creativeMomentum * 0.9 + s.crossProjectValue * 1.2 +
          s.dependencyValue + s.emotionalAlignment + s.completionProbability * 0.8 +
          s.antiStagnationValue * 1.3 + s.availableTimeFit * 0.7;
        const totalScore = clamp01((positive - s.burnoutRisk * 1.4) / 8.1);
        const rationale: string[] = [];
        if (s.projectPriority >= 0.7) rationale.push("Supports a high-priority project.");
        if (s.crossProjectValue >= 0.7) rationale.push("Creates value across multiple projects.");
        if (s.antiStagnationValue >= 0.7) rationale.push("Reduces stagnation risk.");
        if (s.burnoutRisk >= 0.65) rationale.push("Burnout risk lowers this task's rank.");
        return { ...structuredClone(task), totalScore, rationale };
      })
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit);
  }

  ecosystemHealth() {
    const nodes = this.listNodes();
    return {
      nodeCount: nodes.length,
      byStatus: Object.fromEntries([...new Set(nodes.map((node) => node.status))].map((status) => [status, nodes.filter((node) => node.status === status).length])),
      byProject: Object.fromEntries([...new Set(nodes.map((node) => node.projectId ?? "unassigned"))].map((project) => [project, nodes.filter((node) => (node.projectId ?? "unassigned") === project).length])),
      stagnation: this.stagnationCheck(),
      gapCount: this.gaps().length,
      synthesisOpportunityCount: this.synthesize().length
    };
  }

  executeCommand(command: string, args: Record<string, unknown> = {}): CommandResult {
    const normalized = command.trim().toLowerCase();
    const generatedAt = new Date().toISOString();
    switch (normalized) {
      case "/synthesize": return { command, generatedAt, data: this.synthesize() };
      case "/gaps": return { command, generatedAt, data: this.gaps() };
      case "/next": return { command, generatedAt, data: this.nextBestTasks(typeof args.limit === "number" ? args.limit : 5) };
      case "/ecosystem": return { command, generatedAt, data: this.ecosystemHealth() };
      case "/stagnation-check": return { command, generatedAt, data: this.stagnationCheck() };
      default: throw new Error(`Unsupported Creative Ecosystem command: ${command}`);
    }
  }
}
