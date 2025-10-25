// src/services/pipelineService.ts
import { agentRegistry } from '../lib/agents/registry';
import { AgentStatus } from '../types';
import { usePipelineStore, PipelineState, PipelineActions } from '../store/store';
import { 
  pipelineStages, 
  moduleMap, 
  agentNameMapping, 
  agentToStateKeyMap,
  AgentName
} from '../lib/pipelineConfig';


type StoreSetter = (partial: Partial<PipelineState & PipelineActions>, replace?: boolean | undefined) => void;
type StoreGetter = () => PipelineState & PipelineActions;

// Generates a cache key based on agent name and a hash of its input.
function getCacheKey(agentName: AgentName, input: any): string {
  const inputString = JSON.stringify(input);
  let hash = 0;
  for (let i = 0; i < inputString.length; i++) {
    const char = inputString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `agent_output_${agentName}_${hash}`;
}

const getAgentInput = (agentName: AgentName, agentOutputs: Record<string, any>, initialInputs: any, revisionInfo?: any) => {
    // This function is a candidate for further refactoring, but for now, its logic remains.
    // A better long-term solution might involve agents declaring their own input dependencies.
    switch (agentName) {
      case 'imageAnalysis':
        return { imageData: initialInputs.seedImage?.split(',')[1] };
      case 'conceptExtraction':
        return { conceptBrief: initialInputs.conceptBrief };
      case 'visionSynthesizer':
        if (revisionInfo?.failedGate === 1) {
          return {
            imageAnalysis: agentOutputs.imageAnalysis,
            conceptExtraction: agentOutputs.conceptExtraction,
            failedVisionDocument: agentOutputs.visionSynthesizer,
            issuesToAddress: revisionInfo.issuesToAddress
          }
        }
        return { imageAnalysis: agentOutputs.imageAnalysis, conceptExtraction: agentOutputs.conceptExtraction };
      case 'qualityGate1':
        return { visionDocument: agentOutputs.visionSynthesizer };
      case 'storyArchitect':
      case 'emotionalArcDesigner':
      case 'themeSymbolism':
        return { visionDocument: agentOutputs.visionSynthesizer };
      case 'qualityGate2':
        return { storyArchitecture: agentOutputs.storyArchitect, emotionalArc: agentOutputs.emotionalArcDesigner, thematicElements: agentOutputs.themeSymbolism };
      case 'colorScript':
        return { visionDocument: agentOutputs.visionSynthesizer, emotionalArc: agentOutputs.emotionalArcDesigner };
      case 'characterDesign':
          return { visionDocument: agentOutputs.visionSynthesizer, storyArchitecture: agentOutputs.storyArchitect, colorScript: agentOutputs.colorScript };
      case 'worldDesign':
          return { visionDocument: agentOutputs.visionSynthesizer, storyArchitecture: agentOutputs.storyArchitect, colorScript: agentOutputs.colorScript };
      case 'visualIntegrator':
          return { characterDesign: agentOutputs.characterDesign, worldDesign: agentOutputs.worldDesign, colorScript: agentOutputs.colorScript };
      case 'qualityGate3':
          return { visualBible: agentOutputs.visualIntegrator };
      case 'cameraFraming':
          return { visualBible: agentOutputs.visualIntegrator, storyArchitecture: agentOutputs.storyArchitect, emotionalArc: agentOutputs.emotionalArcDesigner };
      case 'lightingDirector':
          return { cameraFraming: agentOutputs.cameraFraming, visualBible: agentOutputs.visualIntegrator };
      case 'motionChoreographer':
          return { cameraFraming: agentOutputs.cameraFraming, emotionalArc: agentOutputs.emotionalArcDesigner };
      case 'cinematographyIntegrator':
          return { cameraFraming: agentOutputs.cameraFraming, lighting: agentOutputs.lightingDirector, motion: agentOutputs.motionChoreographer };
      case 'qualityGate4':
          return { cinematographyBible: agentOutputs.cinematographyIntegrator };
      case 'soundDesign':
      case 'musicComposer':
      case 'dialogueDirector':
          return { 
              cinematographyBible: agentOutputs.cinematographyIntegrator, 
              emotionalArc: agentOutputs.emotionalArcDesigner,
              storyArchitecture: agentOutputs.storyArchitect,
              characterDesign: agentOutputs.characterDesign,
          };
      case 'audioIntegrator':
          return { soundDesign: agentOutputs.soundDesign, music: agentOutputs.musicComposer, dialogue: agentOutputs.dialogueDirector, cinematographyBible: agentOutputs.cinematographyIntegrator };
      case 'qualityGate5':
          return { audioBible: agentOutputs.audioIntegrator, cinematographyBible: agentOutputs.cinematographyIntegrator };
      case 'animationTechnique':
          return { visualBible: agentOutputs.visualIntegrator, motionChoreography: agentOutputs.motionChoreographer };
      case 'vfxDesigner':
          return { visualBible: agentOutputs.visualIntegrator, lightingDesign: agentOutputs.lightingDirector };
      case 'timingPacing':
          return { cinematographyBible: agentOutputs.cinematographyIntegrator, audioBible: agentOutputs.audioIntegrator };
      case 'technicalIntegrator':
          return { animation: agentOutputs.animationTechnique, vfx: agentOutputs.vfxDesigner, timing: agentOutputs.timingPacing };
      case 'qualityGate6':
          return { technicalBible: agentOutputs.technicalIntegrator };
      case 'masterIntegrator':
          return {
              vision: agentOutputs.visionSynthesizer, story: agentOutputs.storyArchitect,
              emotionalArc: agentOutputs.emotionalArcDesigner,
              thematicElements: agentOutputs.themeSymbolism,
              visual: agentOutputs.visualIntegrator, cine: agentOutputs.cinematographyIntegrator,
              audio: agentOutputs.audioIntegrator, tech: agentOutputs.technicalIntegrator,
          };
      case 'qualityGate7':
          return { masterPrompt: agentOutputs.masterIntegrator };
      case 'promptFormatter':
          return { masterPrompt: agentOutputs.masterIntegrator };
      default:
        throw new Error(`Input mapping not defined for agent: ${agentName}`);
    }
};

const setStatus = (set: StoreSetter, agentKey: AgentName, status: AgentStatus) => {
    const agentUIName = agentNameMapping[agentKey];
    if (agentUIName) {
        set({ agentStatuses: { ...usePipelineStore.getState().agentStatuses, [agentUIName]: status } });
    }
};

export async function executePipeline(
  initialInputs: { seedImage: string | null; conceptBrief: string },
  options: { useCache: boolean; modulesToRunFromCache: Set<string> },
  set: StoreSetter,
  get: StoreGetter,
  revisionInfo?: { failedGate: number; issuesToAddress: string[] }
) {
  set({ isPipelineRunning: true, error: null });

  const agentOutputs: Record<string, any> = {};
  Object.keys(agentToStateKeyMap).forEach(key => {
    const stateKey = agentToStateKeyMap[key as AgentName];
    if (stateKey) {
        const value = get()[stateKey];
        if (value) {
            agentOutputs[key] = value;
        }
    }
  });

  let startStageIndex = 0;
  if (revisionInfo) {
    // Logic for revision remains the same
  }

  const pipelineToRun = pipelineStages.slice(startStageIndex);

  for (const stage of pipelineToRun) {
    const firstAgentOfStage = stage[0];
    const moduleName = moduleMap[firstAgentOfStage];

    if (options.modulesToRunFromCache.has(moduleName)) {
        console.log(`Skipping module ${moduleName} due to cache setting.`);
        const moduleAgents = Object.keys(moduleMap).filter(key => moduleMap[key as AgentName] === moduleName);
        for(const agentKey of moduleAgents) {
            setStatus(set, agentKey as AgentName, 'success');
        }
        continue; 
    }

    const stagePromises = stage
      .filter(agentName => {
        if (agentName === 'imageAnalysis' && !initialInputs.seedImage) return false;
        if (agentName === 'conceptExtraction' && !initialInputs.conceptBrief) return false;
        return true;
      })
      .map(async (agentName) => {
        try {
          setStatus(set, agentName, 'running');
          set({ openModules: [...new Set([...get().openModules, moduleMap[agentName]])] });

          const agent = agentRegistry[agentName];
          const input = getAgentInput(agentName, agentOutputs, initialInputs, revisionInfo);
          const cacheKey = getCacheKey(agentName, input);

          let output;
          const cachedOutput = localStorage.getItem(cacheKey);

          if (options.useCache && cachedOutput && !revisionInfo) {
            output = JSON.parse(cachedOutput);
          } else {
            output = await agent.run(input as any, { outputs: agentOutputs, critiques: {} });
            if (options.useCache) {
              localStorage.setItem(cacheKey, JSON.stringify(output));
            }
          }

          setStatus(set, agentName, 'success');
          return { agentName, output };
        } catch (error) {
          setStatus(set, agentName, 'error');
          throw new Error(`Error during ${agentName}: ${(error as Error).message}`);
        }
      });

    try {
      const stageResults = await Promise.all(stagePromises);
      
      for (const { agentName, output } of stageResults) {
        agentOutputs[agentName] = output;
        
        const stateKey = agentToStateKeyMap[agentName];
        if (stateKey) {
            set({ [stateKey]: output } as any);
        }

        if (agentName.startsWith('qualityGate')) {
          const report = output.qualityGateReport;
          if (!report.summary.overallPassed) {
            const gateNumber = agentName.replace('qualityGate', '');
            throw new Error(`Pipeline stopped: Quality Gate #${gateNumber} failed.`);
          }
        }
      }
    } catch (error) {
        set({ error: (error as Error).message, isPipelineRunning: false });
        return;
    }
  }

  set({ isPipelineRunning: false });
}