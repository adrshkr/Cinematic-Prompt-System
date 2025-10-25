# 🎬 Phase 3: Implementation Guide & Build Sequence
## Practical Step-by-Step Instructions for Gemini

**Dependencies:** Phases 1 & 2 approved and understood

---

## 🚀 SPRINT BREAKDOWN (8 Sprints × 1 Week Each)

### SPRINT 1: Foundation & Infrastructure Setup

**Objective:** Create development environment and basic agent execution framework

#### Step 1.1: Initialize Project Structure

```bash
# Create Next.js 14 project with TypeScript
npx create-next-app@latest video-prompt-orchestrator --typescript --tailwind --app --no-src-dir

cd video-prompt-orchestrator

# Install core dependencies
npm install @google/generative-ai zod drizzle-orm drizzle-kit pg
npm install @tanstack/react-query zustand socket.io-client
npm install date-fns uuid

# Install dev dependencies
npm install -D @types/pg @types/uuid vitest
```

#### Step 1.2: Set Up Directory Structure

```
video-prompt-orchestrator/
├── app/
│   ├── api/
│   │   ├── agents/
│   │   │   ├── execute/route.ts
│   │   │   └── status/route.ts
│   │   ├── projects/
│   │   │   ├── create/route.ts
│   │   │   ├── [id]/route.ts
│   │   │   └── [id]/quality-gate/route.ts
│   │   └── upload/route.ts
│   ├── (dashboard)/
│   │   ├── projects/page.tsx
│   │   ├── project/[id]/page.tsx
│   │   └── layout.tsx
│   └── layout.tsx
├── lib/
│   ├── agents/
│   │   ├── base-agent.ts
│   │   ├── module1/
│   │   │   ├── image-analysis-agent.ts
│   │   │   ├── concept-extraction-agent.ts
│   │   │   └── vision-validator-agent.ts
│   │   ├── module2/
│   │   │   ├── story-architect-agent.ts
│   │   │   └── ...
│   │   └── registry.ts
│   ├── db/
│   │   ├── schema.ts
│   │   ├── migrations/
│   │   └── client.ts
│   ├── gemini/
│   │   ├── client.ts
│   │   └── prompts/
│   ├── orchestrator/
│   │   ├── pipeline.ts
│   │   ├── quality-gates.ts
│   │   └── feedback-loop.ts
│   └── utils/
├── components/
│   ├── agents/
│   │   ├── agent-card.tsx
│   │   ├── agent-status.tsx
│   │   └── pipeline-visualizer.tsx
│   ├── quality-gates/
│   │   └── gate-checker.tsx
│   └── ui/
└── types/
    ├── agents.ts
    ├── projects.ts
    └── prompts.ts
```

#### Step 1.3: Database Setup

Create `lib/db/schema.ts`:

```typescript
import { pgTable, uuid, text, timestamp, jsonb, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const projectStatusEnum = pgEnum('project_status', [
  'intake',
  'in_progress',
  'quality_review',
  'completed',
  'failed'
]);

export const agentStatusEnum = pgEnum('agent_status', [
  'pending',
  'running',
  'success',
  'failed',
  'needs_revision'
]);

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  seedImageUrl: text('seed_image_url'),
  conceptBrief: text('concept_brief'),
  status: projectStatusEnum('status').notNull().default('intake'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const agentRuns = pgTable('agent_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  agentName: text('agent_name').notNull(),
  agentVersion: text('agent_version').notNull().default('1.0'),
  inputData: jsonb('input_data').notNull(),
  outputData: jsonb('output_data'),
  executionTimeMs: integer('execution_time_ms'),
  qualityScore: integer('quality_score'), // 0-100
  status: agentStatusEnum('status').notNull().default('pending'),
  feedback: text('feedback'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const qualityGates = pgTable('quality_gates', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  gateNumber: integer('gate_number').notNull(), // 1-6
  validatorsPassed: integer('validators_passed').notNull().default(0),
  validatorsFailed: integer('validators_failed').notNull().default(0),
  humanReviewed: boolean('human_reviewed').notNull().default(false),
  passed: boolean('passed').notNull().default(false),
  feedback: jsonb('feedback'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const feedbackLoops = pgTable('feedback_loops', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  sourceAgent: text('source_agent').notNull(),
  targetAgent: text('target_agent').notNull(),
  critique: text('critique').notNull(),
  suggestion: text('suggestion'),
  accepted: boolean('accepted'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const finalPrompts = pgTable('final_prompts', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  version: integer('version').notNull().default(1),
  promptJson: jsonb('prompt_json').notNull(),
  qualityMetrics: jsonb('quality_metrics'),
  exportedAt: timestamp('exported_at').notNull().defaultNow(),
});
```

Create database and run migrations:
```bash
# Set up PostgreSQL (Docker recommended for local dev)
docker-compose up -d postgres

# Generate migrations
npx drizzle-kit generate:pg

# Run migrations
npx drizzle-kit push:pg
```

#### Step 1.4: Gemini Client Setup

Create `lib/gemini/client.ts`:

```typescript
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface GeminiConfig {
  model: 'gemini-2.0-flash-exp' | 'gemini-exp-1206';
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
}

export class GeminiClient {
  private model: GenerativeModel;

  constructor(config: GeminiConfig) {
    this.model = genAI.getGenerativeModel({
      model: config.model,
      generationConfig: {
        temperature: config.temperature ?? 0.7,
        topP: config.topP ?? 0.95,
        topK: config.topK ?? 40,
        maxOutputTokens: config.maxOutputTokens ?? 8192,
      },
    });
  }

  async generateContent(prompt: string): Promise<string> {
    const result = await this.model.generateContent(prompt);
    const response = result.response;
    return response.text();
  }

  async generateStructuredContent<T>(
    prompt: string,
    schema: any // Zod schema
  ): Promise<T> {
    const result = await this.model.generateContent(
      prompt + '\n\nRespond ONLY with valid JSON matching the required schema. No markdown, no code blocks.'
    );
    const responseText = result.response.text();
    
    // Clean potential markdown formatting
    const jsonText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const parsed = JSON.parse(jsonText);
      return schema.parse(parsed); // Validate with Zod
    } catch (error) {
      throw new Error(`Failed to parse Gemini response: ${error}`);
    }
  }

  async analyzeImage(imageData: string, prompt: string): Promise<string> {
    const result = await this.model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageData,
          mimeType: 'image/png', // or jpeg
        },
      },
    ]);
    return result.response.text();
  }
}
```

#### Step 1.5: Base Agent Architecture

Create `lib/agents/base-agent.ts`:

```typescript
import { z } from 'zod';
import { GeminiClient, GeminiConfig } from '@/lib/gemini/client';
import { db } from '@/lib/db/client';
import { agentRuns } from '@/lib/db/schema';

export interface AgentContext {
  projectId: string;
  userId: string;
  seedImageUrl?: string;
  previousOutputs: Record<string, any>;
}

export interface AgentResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  qualityScore?: number;
  executionTimeMs: number;
}

export abstract class BaseAgent<TInput, TOutput> {
  protected abstract agentName: string;
  protected abstract agentVersion: string;
  protected abstract inputSchema: z.ZodSchema<TInput>;
  protected abstract outputSchema: z.ZodSchema<TOutput>;
  
  protected geminiClient: GeminiClient;

  constructor(geminiConfig?: GeminiConfig) {
    this.geminiClient = new GeminiClient(
      geminiConfig || {
        model: 'gemini-2.0-flash-exp',
        temperature: 0.7,
      }
    );
  }

  /**
   * Main execution method - must be implemented by each agent
   */
  protected abstract execute(
    input: TInput,
    context: AgentContext
  ): Promise<TOutput>;

  /**
   * Quality self-assessment - each agent scores its own output
   */
  protected abstract assessQuality(output: TOutput): Promise<number>;

  /**
   * Public run method with logging and error handling
   */
  async run(
    rawInput: unknown,
    context: AgentContext
  ): Promise<AgentResult<TOutput>> {
    const startTime = Date.now();
    
    try {
      // Validate input
      const input = this.inputSchema.parse(rawInput);

      // Log start
      const runId = await this.logRunStart(context, input);

      // Execute agent logic
      const output = await this.execute(input, context);

      // Validate output
      const validatedOutput = this.outputSchema.parse(output);

      // Assess quality
      const qualityScore = await this.assessQuality(validatedOutput);

      const executionTimeMs = Date.now() - startTime;

      // Log success
      await this.logRunComplete(runId, validatedOutput, qualityScore, executionTimeMs);

      return {
        success: true,
        data: validatedOutput,
        qualityScore,
        executionTimeMs,
      };
    } catch (error) {
      const executionTimeMs = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Log failure
      await this.logRunFailure(context, errorMessage, executionTimeMs);

      return {
        success: false,
        error: errorMessage,
        executionTimeMs,
      };
    }
  }

  private async logRunStart(context: AgentContext, input: any): Promise<string> {
    const [run] = await db.insert(agentRuns).values({
      projectId: context.projectId,
      agentName: this.agentName,
      agentVersion: this.agentVersion,
      inputData: input,
      status: 'running',
    }).returning({ id: agentRuns.id });

    return run.id;
  }

  private async logRunComplete(
    runId: string,
    output: any,
    qualityScore: number,
    executionTimeMs: number
  ): Promise<void> {
    await db.update(agentRuns)
      .set({
        outputData: output,
        qualityScore,
        executionTimeMs,
        status: 'success',
      })
      .where(eq(agentRuns.id, runId));
  }

  private async logRunFailure(
    context: AgentContext,
    error: string,
    executionTimeMs: number
  ): Promise<void> {
    await db.insert(agentRuns).values({
      projectId: context.projectId,
      agentName: this.agentName,
      agentVersion: this.agentVersion,
      inputData: {},
      status: 'failed',
      feedback: error,
      executionTimeMs,
    });
  }
}
```

---

### SPRINT 2: First Agent Implementation (Image Analysis)

**Objective:** Build and test Agent 1.1 (Image Analysis Agent) end-to-end

#### Step 2.1: Define Agent Types

Create `types/agents.ts`:

```typescript
import { z } from 'zod';

// Agent 1.1 schemas
export const ImageAnalysisInputSchema = z.object({
  imageUrl: z.string().url(),
  analysisDepth: z.enum(['basic', 'detailed', 'exhaustive']).default('detailed'),
});

export const ImageAnalysisOutputSchema = z.object({
  visualStyle: z.object({
    artStyle: z.string(),
    animationTechnique: z.string(),
    lineworkCharacteristics: z.object({
      weightRange: z.string(),
      style: z.string(),
    }),
    shadingApproach: z.string(),
    colorTreatment: z.string(),
  }),
  characterAnalysis: z.object({
    present: z.boolean(),
    features: z.array(z.object({
      type: z.string(),
      description: z.string(),
      colors: z.array(z.string()),
    })).optional(),
  }).optional(),
  environment: z.object({
    setting: z.string(),
    architecture: z.string(),
    naturalElements: z.array(z.string()),
    depthCues: z.string(),
  }),
  lighting: z.object({
    direction: z.string(),
    quality: z.string(),
    colorTemperature: z.number(),
    timeOfDay: z.string(),
  }),
  atmosphericElements: z.array(z.object({
    type: z.string(),
    description: z.string(),
  })),
  technicalSpecs: z.object({
    aspectRatio: z.string(),
    compositionRules: z.array(z.string()),
    focusPoint: z.string(),
  }),
  visualElements: z.array(z.object({
    element: z.string(),
    importance: z.enum(['primary', 'secondary', 'tertiary']),
  })),
  clarityAssessment: z.object({
    sharpness: z.number().min(0).max(10),
    exposure: z.number().min(0).max(10),
    contrast: z.number().min(0).max(10),
  }),
});

export type ImageAnalysisInput = z.infer<typeof ImageAnalysisInputSchema>;
export type ImageAnalysisOutput = z.infer<typeof ImageAnalysisOutputSchema>;
```

#### Step 2.2: Implement Image Analysis Agent

Create `lib/agents/module1/image-analysis-agent.ts`:

```typescript
import { BaseAgent, AgentContext } from '../base-agent';
import { ImageAnalysisInput, ImageAnalysisOutput, ImageAnalysisInputSchema, ImageAnalysisOutputSchema } from '@/types/agents';
import { GeminiClient } from '@/lib/gemini/client';
import fs from 'fs/promises';

export class ImageAnalysisAgent extends BaseAgent<ImageAnalysisInput, ImageAnalysisOutput> {
  protected agentName = 'image-analysis-agent';
  protected agentVersion = '1.0';
  protected inputSchema = ImageAnalysisInputSchema;
  protected outputSchema = ImageAnalysisOutputSchema;

  constructor() {
    super({
      model: 'gemini-exp-1206', // Use Pro for vision
      temperature: 0.3, // Lower temperature for analytical tasks
    });
  }

  protected async execute(
    input: ImageAnalysisInput,
    context: AgentContext
  ): Promise<ImageAnalysisOutput> {
    // Fetch and convert image to base64
    const imageBase64 = await this.fetchImageAsBase64(input.imageUrl);

    // Generate comprehensive analysis prompt
    const prompt = this.buildAnalysisPrompt(input.analysisDepth);

    // Call Gemini Vision API
    const analysisText = await this.geminiClient.analyzeImage(imageBase64, prompt);

    // Parse response into structured format
    // Note: In reality, you'd want a second pass to structure the response
    const structuredAnalysis = await this.structureAnalysis(analysisText);

    return structuredAnalysis;
  }

  private buildAnalysisPrompt(depth: string): string {
    return `
You are an elite visual analysis specialist with 20 years of experience in anime production, 
specifically 2D cel animation. You possess the observational skills of Makoto Shinkai's art 
directors combined with the technical precision of a cinematographer.

Your task: Analyze the provided seed image with forensic detail to extract every visual element 
that will inform the creation of a 15-second animated video in the same style.

CRITICAL ANALYSIS REQUIREMENTS:

1. VISUAL STYLE IDENTIFICATION:
   - Art style (2D cel, specific anime studio style, etc.)
   - Animation technique indicators
   - Linework: weight range, taper, color, quality
   - Shading approach: cel levels, painted accents, gradient use
   - Color treatment: saturation level, color grading style

2. CHARACTER ANALYSIS (if character present):
   - Face structure in precise detail
   - Eye shape, iris pattern, highlight style
   - Hair: style, length, colors, how it moves
   - Costume: every detail including fabric type, trim, buttons
   - Pose and gesture: what it communicates about personality
   - Proportions and design language

3. ENVIRONMENT & SETTING:
   - Architectural style
   - Natural elements present
   - Depth planes (foreground, mid, background)
   - How perspective is handled

4. LIGHTING ANALYSIS:
   - Light direction (degrees from axis)
   - Light quality (hard/soft)
   - Color temperature (Kelvin estimate)
   - Time of day indicators
   - Special lighting (rim light, godrays, etc.)

5. ATMOSPHERIC ELEMENTS:
   - Particles (dust, sparkles, petals, etc.)
   - Weather indicators
   - Special effects (magic, energy, etc.)

6. TECHNICAL SPECIFICATIONS:
   - Aspect ratio
   - Composition rules being used
   - Focal point and visual hierarchy
   - Negative space usage

7. CLARITY ASSESSMENT:
   - Sharpness level (0-10)
   - Exposure control (0-10)
   - Contrast handling (0-10)

8. IDENTIFIED VISUAL ELEMENTS:
   List MINIMUM 50 distinct visual elements with importance ranking.

CRITICAL RULES:
- Be FORENSICALLY detailed
- Identify the EXACT 2D technique (no 3D/CGI contamination)
- Note even subtle details (paper texture, grain, etc.)
- Assess what makes this image's style unique
- Think about how to maintain this style in animated form

Output your analysis as a comprehensive JSON object matching the required schema.
    `.trim();
  }

  private async fetchImageAsBase64(url: string): Promise<string> {
    // Implementation to fetch image and convert to base64
    // This would use fetch or axios in real implementation
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString('base64');
  }

  private async structureAnalysis(rawAnalysis: string): Promise<ImageAnalysisOutput> {
    // Use a second Gemini call to structure the free-form analysis into JSON
    const structuringPrompt = `
Convert the following image analysis into a structured JSON format matching this schema:

${JSON.stringify(ImageAnalysisOutputSchema, null, 2)}

Raw analysis:
${rawAnalysis}

Respond ONLY with valid JSON. No markdown, no code blocks.
    `.trim();

    return await this.geminiClient.generateStructuredContent<ImageAnalysisOutput>(
      structuringPrompt,
      ImageAnalysisOutputSchema
    );
  }

  protected async assessQuality(output: ImageAnalysisOutput): Promise<number> {
    let score = 0;

    // Detail depth: Check number of visual elements identified
    if (output.visualElements.length >= 50) score += 30;
    else if (output.visualElements.length >= 30) score += 20;
    else score += 10;

    // Technical accuracy: Clarity assessments should be realistic
    const avgClarity = (
      output.clarityAssessment.sharpness +
      output.clarityAssessment.exposure +
      output.clarityAssessment.contrast
    ) / 3;
    
    if (avgClarity >= 7) score += 25;
    else if (avgClarity >= 5) score += 15;
    else score += 5;

    // Completeness: All required fields populated
    const hasCompleteVisualStyle = Object.keys(output.visualStyle).length >= 5;
    const hasCompleteLighting = Object.keys(output.lighting).length >= 4;
    const hasCompleteEnvironment = Object.keys(output.environment).length >= 3;

    if (hasCompleteVisualStyle) score += 15;
    if (hasCompleteLighting) score += 15;
    if (hasCompleteEnvironment) score += 15;

    return Math.min(score, 100);
  }
}
```

#### Step 2.3: Create API Endpoint

Create `app/api/agents/execute/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { ImageAnalysisAgent } from '@/lib/agents/module1/image-analysis-agent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentName, input, context } = body;

    // Route to appropriate agent
    let agent;
    
    switch (agentName) {
      case 'image-analysis-agent':
        agent = new ImageAnalysisAgent();
        break;
      // Add other agents as implemented
      default:
        return NextResponse.json(
          { error: 'Unknown agent' },
          { status: 400 }
        );
    }

    const result = await agent.run(input, context);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
```

#### Step 2.4: Create Simple UI for Testing

Create `app/(dashboard)/test/page.tsx`:

```tsx
'use client';

import { useState } from 'react';

export default function TestAgentPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/agents/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName: 'image-analysis-agent',
          input: { imageUrl, analysisDepth: 'detailed' },
          context: {
            projectId: 'test-project-id',
            userId: 'test-user-id',
            previousOutputs: {},
          },
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Image Analysis Agent</h1>
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />
        
        <button
          onClick={handleAnalyze}
          disabled={loading || !imageUrl}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          {loading ? 'Analyzing...' : 'Analyze Image'}
        </button>

        {result && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Results:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Sprint 2 Deliverable:** Working image analysis agent with test UI

---

### SPRINT 3-4: Complete Module 1 (Intake & Analysis)

Implement remaining Module 1 agents following the same pattern:
- Agent 1.2: Concept Extraction Agent
- Agent 1.3: Vision Validator Agent
- Quality Gate #1 validator logic
- Integration tests

---

### SPRINT 5-6: Orchestration Pipeline

**Objective:** Build the pipeline that coordinates all agents

#### Step 5.1: Pipeline Orchestrator

Create `lib/orchestrator/pipeline.ts`:

```typescript
import { AgentContext, AgentResult } from '../agents/base-agent';
import { ImageAnalysisAgent } from '../agents/module1/image-analysis-agent';
// Import all other agents...

interface PipelineConfig {
  projectId: string;
  userId: string;
  seedImageUrl?: string;
  conceptBrief?: string;
}

export class VideoProm promptPipeline {
  private context: AgentContext;
  private agentOutputs: Map<string, any> = new Map();

  constructor(config: PipelineConfig) {
    this.context = {
      projectId: config.projectId,
      userId: config.userId,
      seedImageUrl: config.seedImageUrl,
      previousOutputs: {},
    };
  }

  async execute(): Promise<any> {
    try {
      // MODULE 1: Intake & Analysis
      await this.runModule1();
      await this.validateQualityGate(1);

      // MODULE 2: Creative Foundation
      await this.runModule2();
      await this.validateQualityGate(2);

      // MODULE 3: Visual Design
      await this.runModule3();
      await this.validateQualityGate(3);

      // MODULE 4: Cinematography
      await this.runModule4();
      await this.validateQualityGate(4);

      // MODULE 5: Audio Design
      await this.runModule5();
      await this.validateQualityGate(5);

      // MODULE 6: Technical Specification
      await this.runModule6();
      await this.validateQualityGate(6);

      // MODULE 7: Synthesis
      await this.runModule7();

      return this.agentOutputs.get('final-prompt');
    } catch (error) {
      throw new Error(`Pipeline failed: ${error}`);
    }
  }

  private async runModule1(): Promise<void> {
    // Run agents in parallel where possible
    const imageAgent = new ImageAnalysisAgent();
    const imageResult = await imageAgent.run(
      { imageUrl: this.context.seedImageUrl! },
      this.context
    );

    this.agentOutputs.set('image-analysis', imageResult.data);
    this.updateContext();
    
    // Continue with other Module 1 agents...
  }

  private updateContext(): void {
    this.context.previousOutputs = Object.fromEntries(this.agentOutputs);
  }

  private async validateQualityGate(gateNumber: number): Promise<void> {
    // Implement quality gate validation
    // This would check all validators for this gate
    // If any fail, trigger revision cycle
  }

  // Implement runModule2() through runModule7()...
}
```

---

### SPRINT 7: Frontend Development

**Objective:** Build production-ready user interface

Key pages needed:
1. Project creation (seed image upload + concept brief)
2. Pipeline status dashboard (real-time agent progress)
3. Quality gate review interface
4. Final prompt review and export
5. Project history and management

---

### SPRINT 8: Testing, Polish & Deployment

**Objective:** Production readiness

- Comprehensive unit tests for all agents
- Integration tests for pipeline
- Load testing for concurrent projects
- Error recovery testing
- UI/UX refinements
- Documentation
- Deployment to production

---

## 🔥 CRITICAL IMPLEMENTATION NOTES

### Performance Optimization

1. **Parallel Execution**: Run independent agents in parallel
2. **Caching**: Cache agent outputs to avoid re-running on revisions
3. **Streaming**: Stream long-running agent progress to UI
4. **Queues**: Use background job queue for heavy operations

### Error Handling

1. **Retry Logic**: Auto-retry failed agent calls (max 3 attempts)
2. **Graceful Degradation**: If non-critical agent fails, continue pipeline
3. **Revision Cycles**: Max 3 revision attempts before human escalation
4. **Rollback**: Ability to roll back to previous quality gate

### Security

1. **API Key Management**: Use environment variables, never commit keys
2. **Input Validation**: Validate all user inputs with Zod
3. **Rate Limiting**: Limit API calls per user
4. **Image Upload**: Scan uploads for malware, size limits

### Cost Management

1. **Token Optimization**: Use Flash for fast agents, Pro only for complex
2. **Caching**: Cache repeated requests
3. **Streaming**: Don't request more tokens than needed
4. **Monitoring**: Track API costs per project

---

**End of Phase 3 Document**

*Ready for Phase 4: Agent Prompts & Quality Checklists?*
