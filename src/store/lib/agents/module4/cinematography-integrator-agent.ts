// lib/agents/module4/cinematography-integrator-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { CinematographyIntegratorInput, CinematographyIntegratorOutput, CinematographyIntegratorInputSchema, CinematographyIntegratorOutputSchema } from '../../../types/agents';
import { CINEMATOGRAPHY_INTEGRATOR_PROMPT } from '../../prompts/module4';

export class CinematographyIntegratorAgent extends BaseAgent<CinematographyIntegratorInput, CinematographyIntegratorOutput> {
  protected agentName = 'agent-4.4-cinematography-integrator';
  protected agentVersion = '1.0';
  protected inputSchema = CinematographyIntegratorInputSchema;
  protected outputSchema = CinematographyIntegratorOutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-pro', temperature: 0.4, thinkingBudget: 16384 });
  }

  protected async execute(input: CinematographyIntegratorInput, context: AgentContext): Promise<CinematographyIntegratorOutput> {
    const prompt = `
      ${CINEMATOGRAPHY_INTEGRATOR_PROMPT}

      Camera & Framing Output:
      ${JSON.stringify(input.cameraFraming, null, 2)}

      Lighting Director Output:
      ${JSON.stringify(input.lighting, null, 2)}
      
      Motion Choreographer Output:
      ${JSON.stringify(input.motion, null, 2)}
    `;

    try {
        const llmOutput = await this.geminiClient.generateStructuredContent<CinematographyIntegratorOutput>(prompt, this.outputSchema);
        // TRUST BUT VERIFY: Prioritize the AI's creative synthesis.
        // Validate the LLM's output. If it's complete and well-structured, use it directly.
        if (this.isOutputValid(llmOutput, input)) {
            return llmOutput;
        }
        throw new Error("LLM output was incomplete or malformed.");
    } catch (error) {
        // FALLBACK: If the LLM output is structurally invalid, use the robust manual integration as a safety net.
        console.warn('Cinematography Integrator: LLM output was structurally invalid. Using robust manual fallback to ensure pipeline continuity.', error);
        const manuallyIntegratedBible = this.createManualFallback(input);
        return { cinematographyBible: manuallyIntegratedBible };
    }
  }

  private isOutputValid(llmOutput: CinematographyIntegratorOutput, input: CinematographyIntegratorInput): boolean {
    const bible = llmOutput?.cinematographyBible;
    if (!bible || !bible.final_shot_list || !Array.isArray(bible.final_shot_list)) {
        return false;
    }
    
    const expectedShotCount = input.cameraFraming.shot_list.length;
    if (bible.final_shot_list.length !== expectedShotCount) {
        return false;
    }

    // Check if each shot in the list is properly integrated
    return bible.final_shot_list.every(shot => 
        shot && shot.camera && shot.lighting && shot.motion
    );
  }

  private createManualFallback(input: CinematographyIntegratorInput): any {
    // This robust fallback programmatically stitches the inputs together.
    const bible = {
      camera_philosophy_statement: input.cameraFraming.camera_philosophy_statement,
      lighting_philosophy: input.lighting.lighting_philosophy,
      shot_rhythm_analysis: input.cameraFraming.shot_rhythm_analysis,
      validation_report: { 
          issues_found: 0, // Assumes no new issues, as this is a direct stitch
          fixes_applied: ["Manual integration fallback triggered to ensure data integrity."] 
      },
      final_shot_list: [],
    };

    bible.final_shot_list = input.cameraFraming.shot_list.map((shot: any) => {
        const lighting_spec = input.lighting.lighting_per_shot.find(l => l.shot_number === shot.shot_number);
        const motion_spec = input.motion.motion_per_shot.find(m => m.shot_number === shot.shot_number);

        return {
            shot_number: shot.shot_number,
            timecode: shot.timecode,
            duration_seconds: shot.duration_seconds,
            action_description: shot.action_description,
            narrative_purpose: shot.narrative_purpose,
            emotional_tone: shot.emotional_tone,
            camera: {
                shot_size: shot.shot_size,
                camera_angle: shot.camera_angle,
                camera_movement: shot.camera_movement,
                focal_length_equivalent: shot.focal_length_equivalent,
                composition_rule: shot.composition_rule,
                depth_of_field: shot.depth_of_field,
            },
            lighting: lighting_spec || null,
            motion: motion_spec || null,
        };
    });

    return bible;
  }

  protected async assessQuality(output: CinematographyIntegratorOutput): Promise<number> {
    const { final_shot_list, validation_report } = output.cinematographyBible;
    let score = 0;
    if (final_shot_list.length > 0 && final_shot_list.every(s => s.camera && s.lighting && s.motion)) score += 80;
    if (validation_report.fixes_applied.length === 0 || !validation_report.fixes_applied.some(f => f.includes("Manual"))) score += 20; // Higher score if no manual fallback was needed
    return Math.min(score, 100);
  }
}
