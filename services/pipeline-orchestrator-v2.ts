// services/pipeline-orchestrator-v2.ts
/**
 * Enhanced pipeline orchestrator with parallel execution
 * Analyzes dependency graph and runs independent agents in parallel
 */

import { agentRegistry } from '../lib/agents/registry';
import { AgentStatus } from '../types';
import { logger } from '../lib/infrastructure/logger';
import { Result, Ok, Err, AgentResult, createAgentError } from '../lib/utils/result';
import { AgentOutputCache } from '../lib/infrastructure/cache';

type AgentName = keyof typeof agentRegistry;

interface AgentNode {
  name: AgentName;
  dependencies: AgentName[];
  level: number; // For parallel execution batching
}

interface PipelineConfig {
  useCache: boolean;
  parallelExecution: boolean;
  stopOnQualityGateFailure: boolean;
  maxParallelAgents: number;
}

interface ExecutionContext {
  outputs: Record<string, any>;
  critiques: Record<string, any[]>;
  cache: AgentOutputCache;
}

interface PipelineCallbacks {
  onAgentStart: (agentName: string) => void;
  onAgentComplete: (agentName: string, output: any) => void;
  onAgentError: (agentName: string, error: Error) => void;
  onModuleOpen: (moduleName: string) => void;
  onProgress: (completed: number, total: number) => void;
  onError: (error: string) => void;
}

// Pipeline definition with dependencies
const pipelineDefinition: AgentNode[] = [
  // Module 1: Intake & Analysis
  { name: 'imageAnalysis', dependencies: [], level: 0 },
  { name: 'conceptExtraction', dependencies: [], level: 0 },
  { name: 'visionSynthesizer', dependencies: ['imageAnalysis', 'conceptExtraction'], level: 1 },
  { name: 'qualityGate1', dependencies: ['visionSynthesizer'], level: 2 },

  // Module 2: Creative Foundation (can run in parallel)
  { name: 'storyArchitect', dependencies: ['qualityGate1'], level: 3 },
  { name: 'emotionalArcDesigner', dependencies: ['qualityGate1'], level: 3 },
  { name: 'themeSymbolism', dependencies: ['qualityGate1'], level: 3 },
  { name: 'qualityGate2', dependencies: ['storyArchitect', 'emotionalArcDesigner', 'themeSymbolism'], level: 4 },

  // Module 3: Visual Design
  { name: 'colorScript', dependencies: ['qualityGate2'], level: 5 },
  { name: 'characterDesign', dependencies: ['colorScript', 'storyArchitect', 'visionSynthesizer'], level: 6 },
  { name: 'worldDesign', dependencies: ['colorScript', 'storyArchitect', 'visionSynthesizer'], level: 6 },
  { name: 'visualIntegrator', dependencies: ['characterDesign', 'worldDesign', 'colorScript'], level: 7 },
  { name: 'qualityGate3', dependencies: ['visualIntegrator'], level: 8 },

  // Module 4: Cinematography (parallel execution)
  { name: 'cameraFraming', dependencies: ['qualityGate3'], level: 9 },
  { name: 'lightingDirector', dependencies: ['cameraFraming', 'visualIntegrator'], level: 10 },
  { name: 'motionChoreographer', dependencies: ['cameraFraming', 'emotionalArcDesigner'], level: 10 },
  { name: 'cinematographyIntegrator', dependencies: ['cameraFraming', 'lightingDirector', 'motionChoreographer'], level: 11 },
  { name: 'qualityGate4', dependencies: ['cinematographyIntegrator'], level: 12 },

  // Module 5: Audio Design (parallel execution)
  { name: 'soundDesign', dependencies: ['qualityGate4'], level: 13 },
  { name: 'musicComposer', dependencies: ['qualityGate4'], level: 13 },
  { name: 'dialogueDirector', dependencies: ['qualityGate4'], level: 13 },
  { name: 'audioIntegrator', dependencies: ['soundDesign', 'musicComposer', 'dialogueDirector', 'cinematographyIntegrator'], level: 14 },
  { name: 'qualityGate5', dependencies: ['audioIntegrator'], level: 15 },

  // Module 6: Technical Specification (parallel execution)
  { name: 'animationTechnique', dependencies: ['qualityGate5'], level: 16 },
  { name: 'vfxDesigner', dependencies: ['qualityGate5'], level: 16 },
  { name: 'timingPacing', dependencies: ['qualityGate5'], level: 16 },
  { name: 'technicalIntegrator', dependencies: ['animationTechnique', 'vfxDesigner', 'timingPacing'], level: 17 },
  { name: 'qualityGate6', dependencies: ['technicalIntegrator'], level: 18 },

  // Module 7: Synthesis & Refinement
  { name: 'masterIntegrator', dependencies: ['qualityGate6'], level: 19 },
  { name: 'qualityGate7', dependencies: ['masterIntegrator'], level: 20 },
  { name: 'promptFormatter', dependencies: ['qualityGate7'], level: 21 },
];

export class PipelineOrchestratorV2 {
  private context: ExecutionContext;
  private config: PipelineConfig;
  private callbacks: PipelineCallbacks;
  private completedAgents = new Set<string>();

  constructor(
    config: Partial<PipelineConfig> = {},
    callbacks: Partial<PipelineCallbacks> = {}
  ) {
    this.config = {
      useCache: true,
      parallelExecution: true,
      stopOnQualityGateFailure: true,
      maxParallelAgents: 3,
      ...config,
    };

    this.callbacks = {
      onAgentStart: () => {},
      onAgentComplete: () => {},
      onAgentError: () => {},
      onModuleOpen: () => {},
      onProgress: () => {},
      onError: () => {},
      ...callbacks,
    };

    this.context = {
      outputs: {},
      critiques: {},
      cache: new AgentOutputCache(),
    };
  }

  async execute(initialInputs: {
    seedImage: string | null;
    conceptBrief: string;
  }): Promise<Result<Record<string, any>, Error>> {
    logger.info('Pipeline execution started', {
      parallelExecution: this.config.parallelExecution,
      maxParallelAgents: this.config.maxParallelAgents,
      useCache: this.config.useCache,
    });

    const startTime = Date.now();

    try {
      // Group agents by execution level
      const agentsByLevel = this.groupByLevel();

      // Execute level by level
      for (const [level, agents] of agentsByLevel.entries()) {
        logger.info(`Executing pipeline level ${level}`, {
          agentCount: agents.length,
          agentNames: agents.map(a => a.name),
        });

        // Execute agents in this level (parallel if enabled)
        const result = await this.executeLevel(agents, initialInputs);

        if (result.isError()) {
          return result;
        }

        // Check for quality gate failures
        const qualityGateFailed = agents.some(agent =>
          agent.name.startsWith('qualityGate') &&
          this.isQualityGateFailed(this.context.outputs[agent.name])
        );

        if (qualityGateFailed && this.config.stopOnQualityGateFailure) {
          const error = new Error('Quality gate failed');
          logger.error('Pipeline stopped due to quality gate failure', { level });
          this.callbacks.onError('Pipeline stopped: Quality gate failed');
          return Err(error);
        }

        // Update progress
        this.callbacks.onProgress(this.completedAgents.size, pipelineDefinition.length);
      }

      const duration = Date.now() - startTime;
      logger.info('Pipeline execution completed', {
        duration,
        agentCount: this.completedAgents.size,
      });

      return Ok(this.context.outputs);
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('Pipeline execution failed', { duration }, error as Error);
      return Err(error as Error);
    }
  }

  private groupByLevel(): Map<number, AgentNode[]> {
    const levels = new Map<number, AgentNode[]>();

    for (const agent of pipelineDefinition) {
      const existing = levels.get(agent.level) || [];
      existing.push(agent);
      levels.set(agent.level, existing);
    }

    return levels;
  }

  private async executeLevel(
    agents: AgentNode[],
    initialInputs: any
  ): Promise<Result<void, Error>> {
    if (this.config.parallelExecution && agents.length > 1) {
      // Execute in parallel (with concurrency limit)
      return await this.executeParallel(agents, initialInputs);
    } else {
      // Execute sequentially
      return await this.executeSequential(agents, initialInputs);
    }
  }

  private async executeParallel(
    agents: AgentNode[],
    initialInputs: any
  ): Promise<Result<void, Error>> {
    const results: Array<Promise<AgentResult<any>>> = [];

    // Execute agents with concurrency control
    for (let i = 0; i < agents.length; i += this.config.maxParallelAgents) {
      const batch = agents.slice(i, i + this.config.maxParallelAgents);

      const batchResults = await Promise.all(
        batch.map(agent => this.executeAgent(agent, initialInputs))
      );

      // Check for errors in this batch
      for (const result of batchResults) {
        if (result.isError()) {
          return Err(new Error(result.value.message));
        }
      }
    }

    return Ok(undefined);
  }

  private async executeSequential(
    agents: AgentNode[],
    initialInputs: any
  ): Promise<Result<void, Error>> {
    for (const agent of agents) {
      const result = await this.executeAgent(agent, initialInputs);

      if (result.isError()) {
        return Err(new Error(result.value.message));
      }
    }

    return Ok(undefined);
  }

  private async executeAgent(
    agentNode: AgentNode,
    initialInputs: any
  ): Promise<AgentResult<any>> {
    const { name } = agentNode;

    // Skip if already completed (for retries/resumption)
    if (this.completedAgents.has(name)) {
      logger.debug(`Agent ${name} already completed, skipping`);
      return Ok(this.context.outputs[name]);
    }

    // Check if dependencies are met
    const unmetDeps = agentNode.dependencies.filter(dep => !this.completedAgents.has(dep));
    if (unmetDeps.length > 0) {
      const error = createAgentError(
        name,
        `Unmet dependencies: ${unmetDeps.join(', ')}`,
        undefined,
        false
      );
      logger.error(`Agent ${name} has unmet dependencies`, { unmetDeps });
      return Err(error);
    }

    this.callbacks.onAgentStart(name);

    const startTime = Date.now();

    try {
      const agent = agentRegistry[name];
      const input = this.getAgentInput(name, initialInputs);

      // Check cache
      if (this.config.useCache) {
        const inputHash = this.context.cache.hashInput(input);
        const cacheKey = this.context.cache.getCacheKey(name, inputHash);
        const cached = this.context.cache.get(cacheKey);

        if (cached) {
          logger.info(`Agent ${name} using cached output`, { cacheKey });
          this.context.outputs[name] = cached;
          this.completedAgents.add(name);
          this.callbacks.onAgentComplete(name, cached);
          return Ok(cached);
        }
      }

      // Execute agent
      const output = await agent.run(input, this.context);

      const duration = Date.now() - startTime;

      logger.agentComplete(name, duration, {
        agentName: name,
      });

      // Cache output
      if (this.config.useCache) {
        const inputHash = this.context.cache.hashInput(input);
        const cacheKey = this.context.cache.getCacheKey(name, inputHash);
        this.context.cache.set(cacheKey, output);
      }

      this.context.outputs[name] = output;
      this.completedAgents.add(name);
      this.callbacks.onAgentComplete(name, output);

      return Ok(output);
    } catch (error) {
      const duration = Date.now() - startTime;

      logger.agentError(name, error as Error, {
        agentName: name,
        duration,
      });

      this.callbacks.onAgentError(name, error as Error);

      const agentError = createAgentError(
        name,
        (error as Error).message,
        error as Error,
        this.isRetryableError(error)
      );

      return Err(agentError);
    }
  }

  private getAgentInput(agentName: string, initialInputs: any): any {
    const { seedImage, conceptBrief } = initialInputs;

    switch (agentName) {
      case 'imageAnalysis':
        return { imageData: seedImage?.split(',')[1] };
      case 'conceptExtraction':
        return { conceptBrief, imageAnalysis: this.context.outputs.imageAnalysis };
      case 'visionSynthesizer':
        return {
          imageAnalysis: this.context.outputs.imageAnalysis,
          conceptExtraction: this.context.outputs.conceptExtraction,
        };
      case 'qualityGate1':
        return { visionDocument: this.context.outputs.visionSynthesizer };
      case 'storyArchitect':
      case 'emotionalArcDesigner':
      case 'themeSymbolism':
        return { visionDocument: this.context.outputs.visionSynthesizer };
      case 'qualityGate2':
        return {
          storyArchitecture: this.context.outputs.storyArchitect,
          emotionalArc: this.context.outputs.emotionalArcDesigner,
          thematicElements: this.context.outputs.themeSymbolism,
        };
      case 'colorScript':
        return {
          visionDocument: this.context.outputs.visionSynthesizer,
          emotionalArc: this.context.outputs.emotionalArcDesigner,
        };
      case 'characterDesign':
        return {
          visionDocument: this.context.outputs.visionSynthesizer,
          storyArchitecture: this.context.outputs.storyArchitect,
          colorScript: this.context.outputs.colorScript,
        };
      case 'worldDesign':
        return {
          visionDocument: this.context.outputs.visionSynthesizer,
          storyArchitecture: this.context.outputs.storyArchitect,
          colorScript: this.context.outputs.colorScript,
        };
      case 'visualIntegrator':
        return {
          characterDesign: this.context.outputs.characterDesign,
          worldDesign: this.context.outputs.worldDesign,
          colorScript: this.context.outputs.colorScript,
        };
      // ... (continue for all agents, same logic as pipelineService.ts)
      default:
        throw new Error(`Input mapping not defined for agent: ${agentName}`);
    }
  }

  private isQualityGateFailed(output: any): boolean {
    return output?.qualityGateReport?.summary?.overallPassed === false;
  }

  private isRetryableError(error: unknown): boolean {
    const message = (error as Error).message?.toLowerCase() || '';
    return (
      message.includes('timeout') ||
      message.includes('503') ||
      message.includes('overloaded') ||
      message.includes('rate limit')
    );
  }

  // Public API for managing execution
  getCompletedAgents(): string[] {
    return Array.from(this.completedAgents);
  }

  getOutputs(): Record<string, any> {
    return { ...this.context.outputs };
  }

  clearCache(): void {
    this.context.cache.clear();
    logger.info('Pipeline cache cleared');
  }
}
