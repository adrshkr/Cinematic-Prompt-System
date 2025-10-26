// src/lib/agents/base-agent.ts
import { z } from 'zod';
import { GeminiClient, GeminiConfig } from '../gemini/client';
import { db, eq } from '../db/client';
import { agentRuns } from '../db/schema';

// This will hold all agent outputs as they are generated.
export interface AgentContext {
  outputs: Record<string, any>;
  critiques: Record<string, AgentCritique[]>;
}

export interface AgentCritique {
  targetAgentName: string;
  critique: string;
  suggestion: string;
}

export abstract class BaseAgent<TInput, TOutput> {
  protected abstract agentName: string;
  protected abstract agentVersion: string;
  protected abstract inputSchema: z.ZodSchema<TInput>;
  protected abstract outputSchema: z.ZodSchema<TOutput>;
  protected geminiClient: GeminiClient;

  constructor(geminiConfig: GeminiConfig) {
    this.geminiClient = new GeminiClient(geminiConfig);
  }

  // Abstract method for core agent logic
  protected abstract execute(input: TInput, context: AgentContext): Promise<TOutput>;

  // Optional method for self-assessment of output quality
  protected async assessQuality(output: TOutput): Promise<number> {
    return 100; // Default to 100% if not overridden
  }
  
  // Optional method for critiquing inputs from other agents
  public critique(context: AgentContext): AgentCritique[] {
    return []; // Default to no critiques
  }

  // The main execution method for the agent
  public async run(input: TInput, context: AgentContext): Promise<TOutput> {
    const startTime = Date.now();
    
    // 1. Validate input against the schema
    const validatedInput = this.inputSchema.parse(input);

    // MOCK DB LOG: Start run
    const [runRecord] = await db.insert(agentRuns).values({
      // projectId: context.projectId,
      projectId: 'mock-project-id',
      agentName: this.agentName,
      agentVersion: this.agentVersion,
      inputData: validatedInput,
      status: 'running',
    }).returning({ id: agentRuns.id });
    
    try {
      // 2. Execute the agent's core logic
      const output = await this.execute(validatedInput, context);
      
      // 3. Validate the output against the schema
      const validatedOutput = this.outputSchema.parse(output);
      
      const executionTimeMs = Date.now() - startTime;
      
      // 4. Assess the quality of the output
      const qualityScore = await this.assessQuality(validatedOutput);

      // MOCK DB LOG: Finish run successfully
      await db.update(agentRuns).set({
        outputData: validatedOutput,
        executionTimeMs,
        qualityScore,
        status: 'success',
      }).where(eq(agentRuns.id, runRecord.id));

      return validatedOutput;
    } catch (error) {
      const executionTimeMs = Date.now() - startTime;
      console.error(`Error executing agent ${this.agentName}:`, error);

      // MOCK DB LOG: Finish run with failure
      await db.update(agentRuns).set({
        executionTimeMs,
        status: 'failed',
        feedback: (error as Error).message,
      }).where(eq(agentRuns.id, runRecord.id));
      
      throw error;
    }
  }
}