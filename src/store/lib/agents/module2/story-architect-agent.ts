// lib/agents/module2/story-architect-agent.ts
import { BaseAgent, AgentContext, AgentCritique } from '../base-agent';
import { StoryArchitectInput, StoryArchitectOutput, StoryArchitectInputSchema, StoryArchitectOutputSchema, VisionValidatorOutput } from '../../../types/agents';
import { STORY_ARCHITECT_PROMPT } from '../../prompts/module2';

export class StoryArchitectAgent extends BaseAgent<StoryArchitectInput, StoryArchitectOutput> {
  protected agentName = 'agent-2.1-story-architect';
  protected agentVersion = '1.0';
  protected inputSchema = StoryArchitectInputSchema;
  protected outputSchema = StoryArchitectOutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-flash', temperature: 0.6 });
  }

  public critique(context: AgentContext): AgentCritique[] {
    const critiques: AgentCritique[] = [];
    const visionDocument = context.outputs.visionSynthesizer as VisionValidatorOutput;

    if (!visionDocument) {
      return critiques;
    }

    // Check 1: Clarity & Actionability of the narrative structure.
    const narrativeStructure = visionDocument.synthesizedVision?.narrativeStructure;
    if (!narrativeStructure || narrativeStructure.split(' ').length < 15) {
      critiques.push({
        targetAgentName: 'agent-1.3-vision-validator',
        critique: "The narrative structure in the Vision Document is too vague or brief.",
        suggestion: "Please expand the 'narrativeStructure' to provide a clearer, more detailed 3-act outline for a 15-second story. It should contain at least 15 words to be actionable."
      });
    }
    
    // Check 2: Feasibility check based on identified risks.
    const narrativeRisks = visionDocument.riskAssessment?.narrativeRisks || [];
    const highSeverityRisk = narrativeRisks.find(risk => risk.severity === 'high');
    if (highSeverityRisk) {
        critiques.push({
            targetAgentName: 'agent-1.3-vision-validator',
            critique: `The Vision Document contains a high-severity narrative risk: "${highSeverityRisk.risk}". This makes the current story concept unfeasible.`,
            suggestion: `The vision must be revised to mitigate this high-severity risk. Please adjust the narrative concept to be more achievable within a 15-second format before I can architect a story.`
        });
    }

    return critiques;
  }

  protected async execute(input: StoryArchitectInput, context: AgentContext): Promise<StoryArchitectOutput> {
    const prompt = `
      ${STORY_ARCHITECT_PROMPT}

      Vision Document:
      ${JSON.stringify(input.visionDocument, null, 2)}
    `;
    return this.geminiClient.generateStructuredContent<StoryArchitectOutput>(prompt, this.outputSchema);
  }

  protected async assessQuality(output: StoryArchitectOutput): Promise<number> {
    let score = 0;
    const { act1_setup, act2_confrontation, act3_resolution } = output.storyArchitecture.threeActStructure;
    if (act1_setup.keyBeats.length > 0) score += 25;
    if (act2_confrontation.keyBeats.length > 0) score += 25;
    if (act3_resolution.keyBeats.length > 0) score += 25;
    if (Math.abs(act1_setup.durationSeconds + act2_confrontation.durationSeconds + act3_resolution.durationSeconds - 15) < 2) {
      score += 25;
    }
    return score;
  }
}
