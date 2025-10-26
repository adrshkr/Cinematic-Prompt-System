// lib/agents/module4/camera-framing-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { CameraFramingInput, CameraFramingOutput, CameraFramingInputSchema, CameraFramingOutputSchema } from '../../../types/agents';
import { CAMERA_FRAMING_PROMPT } from '../../prompts/module4';

export class CameraFramingAgent extends BaseAgent<CameraFramingInput, CameraFramingOutput> {
  protected agentName = 'agent-4.1-camera-framing';
  protected agentVersion = '1.0';
  protected inputSchema = CameraFramingInputSchema;
  protected outputSchema = CameraFramingOutputSchema;

  constructor() {
    super({ model: 'gemini-2.5-pro', temperature: 0.6, thinkingBudget: 32768 });
  }

  protected async execute(input: CameraFramingInput, context: AgentContext): Promise<CameraFramingOutput> {
    const prompt = `
      ${CAMERA_FRAMING_PROMPT}

      Visual Bible:
      ${JSON.stringify(input.visualBible, null, 2)}
      
      Story Architecture:
      ${JSON.stringify(input.storyArchitecture, null, 2)}

      Emotional Arc Design:
      ${JSON.stringify(input.emotionalArc, null, 2)}
    `;
    return this.geminiClient.generateStructuredContent<CameraFramingOutput>(prompt, this.outputSchema);
  }

  protected async assessQuality(output: CameraFramingOutput): Promise<number> {
    let score = 0;
    const totalDuration = output.shot_list.reduce((sum, shot) => sum + shot.duration_seconds, 0);

    if (output.shot_list.length >= 10 && output.shot_list.length <= 30) score += 40;
    if (Math.abs(totalDuration - 15) <= 1.0) score += 40;
    if (output.camera_philosophy_statement.length > 20) score += 20;

    return Math.min(score, 100);
  }
}
