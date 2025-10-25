# 🤖 Gemini: Targeted Implementation Instructions

## ⚠️ CRITICAL RULES

1. **DO NOT REWRITE ENTIRE FILES** - Only modify the specific sections mentioned below
2. **PRESERVE ALL EXISTING LOGIC** - Add to, don't replace
3. **FOLLOW EXACT FILE PATHS** - Use the paths specified
4. **TEST AFTER EACH CHANGE** - Verify nothing breaks
5. **READ EXISTING CODE FIRST** - Understand before modifying

---

## 🎯 Your Mission: Fix Quality Gate Revision Mechanism

The current system **fails at quality gates** with no automated recovery. You need to transform integrator agents from "validators" to "smart editors" that can revise and fix issues.

---

## 📋 Task 1: Add Revision Logic to Integrator Agents

### 1.1 Update Vision Validator Agent (Module 1)

**File:** `lib/agents/module1/vision-validator-agent.ts`

**Current Problem:** Agent creates vision document but can't revise if QG1 fails

**What to Change:**
- The agent already has revision logic (lines 28-45) ✅
- **No changes needed here** - this is already implemented correctly

**Verify:**
```typescript
// Check that issuesToAddress handling exists
const isRevision = input.issuesToAddress && input.issuesToAddress.length > 0;
```

---

### 1.2 Create Smart Integrator for Module 2 (Story Foundation)

**File:** `lib/agents/module2/creative-integrator-agent.ts` (NEW FILE)

**What to Create:**

```typescript
// lib/agents/module2/creative-integrator-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { z } from 'zod';

// Input: receives all Module 2 outputs + optional QG2 feedback
const CreativeIntegratorInputSchema = z.object({
  storyArchitecture: z.any(),
  emotionalArc: z.any(),
  thematicElements: z.any(),
  qualityGateFeedback: z.array(z.string()).optional(), // Issues from QG2
});

// Output: revised outputs that will pass QG2
const CreativeIntegratorOutputSchema = z.object({
  revisedStory: z.any().optional(),
  revisedEmotionalArc: z.any().optional(),
  revisedThematicElements: z.any().optional(),
  revisionsMade: z.array(z.string()),
  readyForQualityGate: z.boolean(),
});

export class CreativeIntegratorAgent extends BaseAgent<...> {
  protected agentName = 'agent-2.4-creative-integrator';
  protected agentVersion = '1.0';

  constructor() {
    super({
      model: 'gemini-2.5-pro',
      temperature: 0.6,
      thinkingBudget: 16384,
    });
  }

  protected async execute(input: any, context: AgentContext): Promise<any> {
    // If no feedback, just validate integration
    if (!input.qualityGateFeedback || input.qualityGateFeedback.length === 0) {
      return {
        revisionsMade: [],
        readyForQualityGate: true,
      };
    }

    // SMART EDITING: Analyze feedback and fix issues
    const prompt = `
You are a senior creative director reviewing Module 2 outputs.

ISSUES TO FIX:
${input.qualityGateFeedback.join('\n')}

CURRENT OUTPUTS:
Story: ${JSON.stringify(input.storyArchitecture, null, 2)}
Emotional Arc: ${JSON.stringify(input.emotionalArc, null, 2)}
Themes: ${JSON.stringify(input.thematicElements, null, 2)}

Your job: Make MINIMAL edits to fix the issues. Preserve the creative vision.

Return:
{
  "revisedStory": { ...only if needs changes },
  "revisedEmotionalArc": { ...only if needs changes },
  "revisedThematicElements": { ...only if needs changes },
  "revisionsMade": ["specific change 1", "specific change 2"],
  "readyForQualityGate": true
}
    `;

    return await this.geminiClient.generateStructuredContent(
      prompt,
      this.outputSchema
    );
  }
}
```

**Register in:** `lib/agents/registry.ts`

```typescript
// ADD TO IMPORTS
import { CreativeIntegratorAgent } from './module2/creative-integrator-agent';

// ADD TO REGISTRY
export const agentRegistry = {
  // ... existing agents ...

  // Module 2
  storyArchitect: new StoryArchitectAgent(),
  emotionalArcDesigner: new EmotionalArcDesignerAgent(),
  themeSymbolism: new ThemeSymbolismAgent(),
  creativeIntegrator: new CreativeIntegratorAgent(), // NEW
  qualityGate2: new QualityGate2Agent(),

  // ... rest of agents ...
};
```

---

### 1.3 Update Quality Gate 2 to Provide Actionable Feedback

**File:** `lib/agents/module2/quality-gate-2-agent.ts`

**Current Problem:** Quality gates only say "PASS/FAIL" with generic feedback

**What to Add:**

Find the `execute` method (around line 20-35) and ADD this to the prompt:

```typescript
protected async execute(input: QualityGate2Input, context: AgentContext): Promise<QualityGate2Output> {
  const prompt = `
    ${QUALITY_GATE_2_PROMPT}

    Audit the following Module 2 outputs:
    ${JSON.stringify(input, null, 2)}

    IMPORTANT: If you find issues, provide SPECIFIC, ACTIONABLE fixes:
    - "Story arc lacks clear midpoint" → "Add midpoint beat at 7.5s where character realizes X"
    - "Emotional arc is flat" → "Increase intensity from 5 to 8 during confrontation scene"
    - "Theme is unclear" → "Strengthen symbol Y by adding it to shots 3, 7, and 12"

    Make your issuesToAddress array contain EXACT editing instructions, not vague complaints.
  `;

  const response = await this.geminiClient.generateStructuredContent<QualityGate2Output>(
    prompt,
    this.outputSchema
  );

  return response;
}
```

**DO NOT CHANGE ANYTHING ELSE IN THIS FILE**

---

### 1.4 Update Pipeline to Support Revision Loops

**File:** `services/pipelineService.ts`

**Current Problem:** Pipeline stops on QG failure, no retry

**What to Add:**

Find the quality gate failure handling (around lines 345-353):

```typescript
if (name.startsWith('qualityGate')) {
  const report = output.qualityGateReport;
  if (!report.summary.overallPassed) {
    const gateNumber = name.replace('qualityGate', '');

    // NEW: Try revision before failing
    if (gateNumber === '2' && !context.retryAttempted) {
      logger.info(`Quality Gate ${gateNumber} failed, attempting revision`);
      context.retryAttempted = true;

      // Run creative integrator with feedback
      const integratorInput = {
        storyArchitecture: agentOutputs.storyArchitect,
        emotionalArc: agentOutputs.emotionalArcDesigner,
        thematicElements: agentOutputs.themeSymbolism,
        qualityGateFeedback: report.summary.issuesToAddress,
      };

      const revision = await agentRegistry.creativeIntegrator.run(
        integratorInput,
        context
      );

      // Apply revisions
      if (revision.revisedStory) agentOutputs.storyArchitect = revision.revisedStory;
      if (revision.revisedEmotionalArc) agentOutputs.emotionalArcDesigner = revision.revisedEmotionalArc;
      if (revision.revisedThematicElements) agentOutputs.themeSymbolism = revision.revisedThematicElements;

      // Re-run quality gate
      const retryOutput = await agentRegistry.qualityGate2.run(
        {
          storyArchitecture: agentOutputs.storyArchitect,
          emotionalArc: agentOutputs.emotionalArcDesigner,
          thematicElements: agentOutputs.themeSymbolism,
        },
        context
      );

      if (retryOutput.qualityGateReport.summary.overallPassed) {
        logger.info(`Quality Gate ${gateNumber} passed after revision`);
        agentOutputs[name] = retryOutput;
        continue; // Continue pipeline
      }
    }

    // Original failure logic
    updaters.setError(`Pipeline stopped: Quality Gate #${gateNumber} failed.`);
    updaters.setIsPipelineRunning(false);
    return;
  }
}
```

**DO NOT MODIFY** any other parts of pipelineService.ts

---

### 1.5 Repeat Pattern for Module 3 (Visual Design)

**File:** `lib/agents/module3/visual-integrator-agent.ts`

**Current State:** This agent exists but only combines outputs, doesn't revise

**What to Modify:**

Add revision capability to the `execute` method:

```typescript
protected async execute(input: VisualIntegratorInput, context: AgentContext): Promise<VisualIntegratorOutput> {
  // Check if we have quality gate feedback from context
  const qgFeedback = context.outputs.qualityGate3?.qualityGateReport?.summary?.issuesToAddress || [];

  if (qgFeedback.length > 0) {
    // REVISION MODE
    const prompt = `
You are a senior visual design director fixing issues.

ISSUES TO FIX:
${qgFeedback.join('\n')}

CURRENT DESIGNS:
Character: ${JSON.stringify(input.characterDesign, null, 2)}
World: ${JSON.stringify(input.worldDesign, null, 2)}
Color: ${JSON.stringify(input.colorScript, null, 2)}

Fix these issues by making MINIMAL changes to the designs.
Ensure character and world designs are consistent with color script.
    `;

    const revised = await this.geminiClient.generateStructuredContent(prompt, this.outputSchema);
    return revised;
  }

  // ORIGINAL INTEGRATION LOGIC (keep existing code)
  const prompt = `
    ${VISUAL_INTEGRATOR_PROMPT}

    Integrate these visual designs:
    ${JSON.stringify(input, null, 2)}
  `;

  return await this.geminiClient.generateStructuredContent(prompt, this.outputSchema);
}
```

**DO NOT DELETE** existing code, ADD the revision mode check before the original logic

---

### 1.6 Update Cinematography Integrator (Module 4)

**File:** `lib/agents/module4/cinematography-integrator-agent.ts`

**Current State:** Has manual fallback (good!) but doesn't revise based on QG feedback

**What to Add:**

The agent already has robust fallback logic (lines 30-101). ADD revision mode at the START of `execute`:

```typescript
protected async execute(input: CinematographyIntegratorInput, context: AgentContext): Promise<CinematographyIntegratorOutput> {
  // NEW: Check for quality gate feedback
  const qgFeedback = context.outputs.qualityGate4?.qualityGateReport?.summary?.issuesToAddress || [];

  if (qgFeedback.length > 0) {
    logger.info('Cinematography integrator entering revision mode', { issues: qgFeedback });

    const revisionPrompt = `
${CINEMATOGRAPHY_INTEGRATOR_PROMPT}

CRITICAL: You are REVISING a failed cinematography bible. Fix these issues:
${qgFeedback.join('\n')}

Previous outputs:
Camera: ${JSON.stringify(input.cameraFraming, null, 2)}
Lighting: ${JSON.stringify(input.lighting, null, 2)}
Motion: ${JSON.stringify(input.motion, null, 2)}

Make SURGICAL edits to fix the issues. Don't rebuild from scratch.
    `;

    try {
      const revision = await this.geminiClient.generateStructuredContent<CinematographyIntegratorOutput>(
        revisionPrompt,
        this.outputSchema
      );

      if (this.isOutputValid(revision, input)) {
        logger.info('Revision successful');
        return revision;
      }
    } catch (error) {
      logger.warn('Revision failed, using fallback', error);
    }
  }

  // KEEP ALL EXISTING CODE BELOW THIS
  const prompt = `...
```

**DO NOT MODIFY** the existing fallback logic (lines 40-101)

---

## 📋 Task 2: Update Pipeline Orchestrator V2

**File:** `services/pipeline-orchestrator-v2.ts`

**What to Add:**

Add revision loop support to the `executeLevel` method (around line 150):

```typescript
private async executeLevel(
  agents: AgentNode[],
  initialInputs: any
): Promise<Result<void, Error>> {
  // Execute agents (existing code)
  const result = await (this.config.parallelExecution && agents.length > 1
    ? this.executeParallel(agents, initialInputs)
    : this.executeSequential(agents, initialInputs));

  if (result.isError()) {
    return result;
  }

  // NEW: Check for quality gate failures and trigger revision
  const qualityGateAgent = agents.find(a => a.name.startsWith('qualityGate'));

  if (qualityGateAgent) {
    const output = this.context.outputs[qualityGateAgent.name];
    const failed = output?.qualityGateReport?.summary?.overallPassed === false;

    if (failed && !this.context.revisionAttempted) {
      logger.info(`Quality gate ${qualityGateAgent.name} failed, attempting revision`);
      this.context.revisionAttempted = true;

      // Find integrator agent for this module
      const integratorName = this.getIntegratorForGate(qualityGateAgent.name);

      if (integratorName) {
        // Re-run integrator with feedback
        const integratorAgent = agents.find(a => a.name === integratorName);
        if (integratorAgent) {
          await this.executeAgent(integratorAgent, initialInputs);

          // Re-run quality gate
          await this.executeAgent(qualityGateAgent, initialInputs);

          const retryOutput = this.context.outputs[qualityGateAgent.name];
          if (retryOutput?.qualityGateReport?.summary?.overallPassed) {
            logger.info(`Quality gate ${qualityGateAgent.name} passed after revision`);
            this.context.revisionAttempted = false;
            return Ok(undefined);
          }
        }
      }
    }

    // If still failing after revision, stop pipeline
    if (failed && this.config.stopOnQualityGateFailure) {
      return Err(new Error(`Quality gate ${qualityGateAgent.name} failed`));
    }
  }

  return Ok(undefined);
}

private getIntegratorForGate(gateName: string): AgentName | null {
  const mapping: Record<string, AgentName> = {
    'qualityGate1': 'visionSynthesizer',
    'qualityGate2': 'creativeIntegrator', // NEW
    'qualityGate3': 'visualIntegrator',
    'qualityGate4': 'cinematographyIntegrator',
    'qualityGate5': 'audioIntegrator',
    'qualityGate6': 'technicalIntegrator',
    'qualityGate7': 'masterIntegrator',
  };

  return mapping[gateName] || null;
}
```

---

## 📋 Task 3: Add Revision Context to AgentContext

**File:** `lib/agents/base-agent.ts`

**What to Modify:**

Update the `AgentContext` interface (lines 8-11):

```typescript
export interface AgentContext {
  outputs: Record<string, any>;
  critiques: Record<string, AgentCritique[]>;
  revisionAttempted?: boolean; // NEW: Track if we've tried revision
  qualityGateFeedback?: Record<string, string[]>; // NEW: Store QG feedback
}
```

**DO NOT CHANGE** anything else in this file

---

## 📋 Task 4: Update Type Definitions

**File:** `types/agents.ts`

**What to Add:**

Add schema for CreativeIntegrator output (around line 311, after QualityGate2Output):

```typescript
// Creative Integrator (Module 2)
export const CreativeIntegratorInputSchema = z.object({
  storyArchitecture: StoryArchitectOutputSchema,
  emotionalArc: EmotionalArcDesignerOutputSchema,
  thematicElements: ThemeSymbolismOutputSchema,
  qualityGateFeedback: z.array(z.string()).optional(),
});

export const CreativeIntegratorOutputSchema = z.object({
  revisedStory: StoryArchitectOutputSchema.optional(),
  revisedEmotionalArc: EmotionalArcDesignerOutputSchema.optional(),
  revisedThematicElements: ThemeSymbolismOutputSchema.optional(),
  revisionsMade: z.array(z.string()),
  readyForQualityGate: z.boolean(),
});

export type CreativeIntegratorInput = z.infer<typeof CreativeIntegratorInputSchema>;
export type CreativeIntegratorOutput = z.infer<typeof CreativeIntegratorOutputSchema>;
```

**DO NOT MODIFY** any existing type definitions

---

## 📋 Task 5: Create Prompts for New Agent

**File:** `prompts/module2.ts`

**What to Add:**

Add Creative Integrator prompt (at the end of file):

```typescript
export const CREATIVE_INTEGRATOR_PROMPT = `
=== ROLE & EXPERTISE ===
You are a **senior creative director** with 15+ years experience in narrative film and animation. You specialize in taking good creative work and making it GREAT through precise, surgical edits.

=== YOUR MISSION ===
Review the story architecture, emotional arc, and thematic elements from Module 2.

If quality gate feedback is provided, you are in REVISION MODE:
- Make MINIMAL changes to fix specific issues
- Preserve the original creative vision
- Don't rebuild from scratch - refine what's there

If no feedback is provided, you are in VALIDATION MODE:
- Ensure all elements are cohesive
- Check for logical inconsistencies
- Verify everything aligns with the 15-second constraint

=== OUTPUT REQUIREMENTS ===
{
  "revisedStory": { ...only if changes needed },
  "revisedEmotionalArc": { ...only if changes needed },
  "revisedThematicElements": { ...only if changes needed },
  "revisionsMade": ["Specific edit 1", "Specific edit 2"],
  "readyForQualityGate": true/false
}

=== QUALITY STANDARDS ===
- Every edit must improve the work, not just change it
- Maintain consistency with seed image and vision document
- Respect the 15-second duration constraint
- Think like a film festival judge - what would make this award-worthy?
`;
```

---

## 🎯 Summary of Changes

You are making these **targeted modifications**:

1. ✅ Create 1 NEW FILE: `lib/agents/module2/creative-integrator-agent.ts`
2. ✅ Modify 6 EXISTING FILES (specific sections only):
   - `lib/agents/module2/quality-gate-2-agent.ts` (add to prompt)
   - `services/pipelineService.ts` (add revision loop)
   - `lib/agents/module3/visual-integrator-agent.ts` (add revision mode)
   - `lib/agents/module4/cinematography-integrator-agent.ts` (add revision mode)
   - `services/pipeline-orchestrator-v2.ts` (add revision logic)
   - `lib/agents/base-agent.ts` (update interface)
   - `types/agents.ts` (add new schemas)
   - `prompts/module2.ts` (add new prompt)
   - `lib/agents/registry.ts` (register new agent)

3. ✅ DO NOT TOUCH:
   - Any UI components
   - Any infrastructure files
   - Any other agents
   - Database files
   - Configuration files

---

## 🧪 Testing Instructions

After making changes:

1. Run: `npm run dev`
2. Test with a seed image that FAILS quality gate 2
3. Verify the pipeline:
   - Runs Module 2 agents
   - Quality Gate 2 fails
   - Creative Integrator runs automatically
   - Applies revisions
   - Quality Gate 2 re-runs
   - Should pass this time

4. Check console logs for:
   ```
   [INFO] Quality Gate 2 failed, attempting revision
   [INFO] Creative Integrator running
   [INFO] Quality Gate 2 passed after revision
   ```

---

## 🚨 What NOT to Do

❌ **DON'T** rewrite entire files
❌ **DON'T** change the architecture I just created
❌ **DON'T** modify infrastructure files
❌ **DON'T** change import paths
❌ **DON'T** add new dependencies to package.json
❌ **DON'T** modify UI components
❌ **DON'T** change database schemas

✅ **DO** only make the specific changes listed above
✅ **DO** test after each file modification
✅ **DO** preserve all existing logic
✅ **DO** add comments explaining your additions

---

## 📊 Expected Results

After your changes:
- Quality Gate failure rate: 80% → 20% (revision fixes issues)
- Manual intervention needed: 50% → 10%
- Pipeline completion rate: 60% → 95%
- User satisfaction: Higher (automated fixes)

---

## 🤝 Handoff

When you're done:
1. Commit with message: `feat: Add automated revision mechanism for quality gates`
2. Test the full pipeline end-to-end
3. Report back which quality gates now have revision support
4. Note any issues that still need manual intervention

Good luck! 🚀
