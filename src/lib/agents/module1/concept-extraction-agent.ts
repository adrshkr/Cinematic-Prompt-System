// lib/agents/module1/concept-extraction-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { ConceptExtractionInput, ConceptExtractionOutput, ConceptExtractionInputSchema, ConceptExtractionOutputSchema } from '../../../types/agents';
import { CONCEPT_EXTRACTION_PROMPT } from '../../prompts/module1';

export class ConceptExtractionAgent extends BaseAgent<ConceptExtractionInput, ConceptExtractionOutput> {
  protected agentName = 'agent-1.2-concept-extraction';
  protected agentVersion = '1.0';
  protected inputSchema = ConceptExtractionInputSchema;
  protected outputSchema = ConceptExtractionOutputSchema;

  constructor() {
    super({
      model: 'gemini-2.5-flash',
      temperature: 0.5,
    });
  }

  protected async execute(
    input: ConceptExtractionInput,
    context: AgentContext
  ): Promise<ConceptExtractionOutput> {
    const prompt = `
      ${CONCEPT_EXTRACTION_PROMPT}

      User Concept Brief: "${input.conceptBrief}"
    `;
    const analysis = await this.geminiClient.generateStructuredContent<ConceptExtractionOutput>(
      prompt,
      this.outputSchema
    );
    return analysis;
  }

  protected async assessQuality(output: ConceptExtractionOutput): Promise<number> {
    let score = 0;
    if (output.creativeBriefSummary.length > 10) score += 25;
    if (output.coreNarrative.characters.length > 0) score += 25;
    if (output.ambiguitiesAndConflicts.needsClarification.length === 0) score += 25;
    if (output.extractedKeywords.length >= 15) score += 25;
    return Math.min(score, 100);
  }
}