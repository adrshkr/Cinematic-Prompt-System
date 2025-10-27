// lib/agents/module7/master-integrator-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { MasterIntegratorInput, MasterIntegratorOutput, MasterIntegratorInputSchema, MasterIntegratorOutputSchema } from '../../../types/agents';
import { MASTER_INTEGRATOR_PROMPT } from '../../prompts/module7';

export class MasterIntegratorAgent extends BaseAgent<MasterIntegratorInput, MasterIntegratorOutput> {
  protected agentName = 'agent-7.1-master-integrator';
  protected agentVersion = '1.0';
  protected inputSchema = MasterIntegratorInputSchema;
  protected outputSchema = MasterIntegratorOutputSchema;

  constructor() {
    // This is the most critical agent, using the most powerful model and max thinking budget.
    super({ model: 'gemini-2.5-pro', temperature: 0.5, thinkingBudget: 32768 });
  }

  protected async execute(input: MasterIntegratorInput, context: AgentContext): Promise<MasterIntegratorOutput> {
    const prompt = `
      ${MASTER_INTEGRATOR_PROMPT}

      **INPUT BIBlES TO INTEGRATE:**
      
      North Star Vision:
      ${JSON.stringify(input.vision, null, 2)}
      
      Story Architecture:
      ${JSON.stringify(input.story, null, 2)}

      Emotional Arc:
      ${JSON.stringify(input.emotionalArc, null, 2)}

      Thematic Elements:
      ${JSON.stringify(input.thematicElements, null, 2)}

      Visual Bible:
      ${JSON.stringify(input.visual, null, 2)}
      
      Cinematography Bible:
      ${JSON.stringify(input.cine, null, 2)}
      
      Audio Bible:
      ${JSON.stringify(input.audio, null, 2)}
      
      Technical Bible:
      ${JSON.stringify(input.tech, null, 2)}

      ${input.qaFeedback ? `
      **REVISION REQUIRED - Address these issues:**
      ${JSON.stringify(input.qaFeedback, null, 2)}
      ` : ''}
    `;
    try {
        const llmOutput = await this.geminiClient.generateStructuredContent<MasterIntegratorOutput>(prompt, this.outputSchema);
        if (llmOutput.masterPrompt && llmOutput.masterPrompt.final_shot_list_with_all_specs) {
            return llmOutput;
        }
        throw new Error("LLM Master Integrator output was incomplete.");
    } catch(error) {
        console.warn('Master Integrator: LLM output was structurally invalid. Using robust manual fallback.', error);
        return this.createManualFallback(input);
    }
  }

  private createManualFallback(input: MasterIntegratorInput): MasterIntegratorOutput {
    // A simplified manual integration as a last resort.
    const masterPrompt = {
        director_vision_statement: input.vision.synthesizedVision.unifiedDescription,
        unified_story: {
            logline: input.story.storyArchitecture.logline,
            three_act_structure: input.story.storyArchitecture.threeActStructure,
            emotional_arc: input.emotionalArc.emotionalArc,
            thematic_elements: input.thematicElements.thematicElements,
        },
        complete_visual_bible: input.visual.visualBible,
        final_shot_list_with_all_specs: input.cine.cinematographyBible.final_shot_list.map((shot: any) => ({
            ...shot,
            director_note: "Manually integrated fallback. Review for cohesion.",
            // In a real scenario, you'd merge audio, vfx, etc., here per shot
            audio_spec: {},
            vfx_spec: {},
            animation_spec: {},
        })),
        complete_audio_bible: input.audio.audioBible,
        production_ready_technical_bible: input.tech.technicalBible,
        integration_provenance: {
            section_lineage: [
                {
                    section_id: 'director_vision_statement',
                    source_modules: ['vision'],
                    preserved_highlights: [
                        {
                            module: 'vision',
                            excerpt: input.vision.synthesizedVision.unifiedDescription,
                        },
                    ],
                    integration_notes: 'Fallback synthesis mirrors the unified description verbatim for traceability.',
                },
                {
                    section_id: 'unified_story',
                    source_modules: ['story', 'emotionalArc', 'thematicElements', 'vision'],
                    preserved_highlights: [
                        { module: 'story', excerpt: input.story.storyArchitecture.logline },
                        {
                            module: 'emotionalArc',
                            excerpt: input.emotionalArc.emotionalArc.keyEmotionalShift.trigger || 'Refer to emotional arc input.',
                        },
                    ],
                    integration_notes: 'Structure mirrors upstream story, emotional arc, and thematic documents without modification.',
                },
            ],
            director_decisions: [
                {
                    issue: 'Manual fallback invoked',
                    decision: 'Preserved upstream structures without additional weaving.',
                    rationale: 'Automated synthesis failed validation; fallback retains traceability for human review.',
                    impact: 'Requires creative pass to add director-level nuance before production.',
                },
            ],
            module_contribution_scores: [
                { module: 'vision', score: 5, justification: 'Baseline vision retained verbatim in fallback output.' },
                { module: 'story', score: 5, justification: 'Story beats copied directly; requires refinement.' },
                { module: 'emotionalArc', score: 5, justification: 'Emotional arc preserved without reinterpretation.' },
                { module: 'thematicElements', score: 5, justification: 'Themes maintained as provided.' },
                { module: 'visual', score: 4, justification: 'Visual bible transferred without new integration notes.' },
                { module: 'cine', score: 4, justification: 'Shot list ported; lacks fresh director notes.' },
                { module: 'audio', score: 4, justification: 'Audio plan included with minimal synthesis.' },
                { module: 'tech', score: 4, justification: 'Technical plan embedded unchanged.' },
            ],
        },
    };

    return { masterPrompt };
  }

  protected async assessQuality(output: MasterIntegratorOutput): Promise<number> {
    // Assess the completeness of the integration
    let score = 0;
    const { masterPrompt } = output;
    if (masterPrompt.director_vision_statement) score += 10;
    if (masterPrompt.unified_story) score += 15;
    if (masterPrompt.complete_visual_bible) score += 15;
    if (masterPrompt.final_shot_list_with_all_specs.length > 0) score += 20;
    if (masterPrompt.complete_audio_bible) score += 20;
    if (masterPrompt.production_ready_technical_bible) score += 20;
    if (masterPrompt.integration_provenance && masterPrompt.integration_provenance.module_contribution_scores.length === 8) {
      score += 10;
    }
    return Math.min(score, 100);
  }
}
