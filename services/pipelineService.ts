// services/pipelineService.ts
import { agentRegistry } from '../lib/agents/registry';
import { AgentStatus } from '../types';

type AgentName = keyof typeof agentRegistry;

// Defines the execution order and dependencies for each agent in the pipeline.
const pipelineDefinition: { name: AgentName, dependencies: AgentName[] }[] = [
  // Module 1: Intake & Analysis
  { name: 'imageAnalysis', dependencies: [] },
  { name: 'conceptExtraction', dependencies: [] },
  { name: 'visionSynthesizer', dependencies: ['imageAnalysis', 'conceptExtraction'] },
  { name: 'qualityGate1', dependencies: ['visionSynthesizer'] },
  
  // Module 2: Creative Foundation
  { name: 'storyArchitect', dependencies: ['qualityGate1'] },
  { name: 'emotionalArcDesigner', dependencies: ['qualityGate1'] },
  { name: 'themeSymbolism', dependencies: ['qualityGate1'] },
  { name: 'qualityGate2', dependencies: ['storyArchitect', 'emotionalArcDesigner', 'themeSymbolism'] },

  // Module 3: Visual Design
  { name: 'colorScript', dependencies: ['qualityGate2'] },
  { name: 'characterDesign', dependencies: ['colorScript', 'storyArchitect', 'visionSynthesizer'] },
  { name: 'worldDesign', dependencies: ['colorScript', 'storyArchitect', 'visionSynthesizer'] },
  { name: 'visualIntegrator', dependencies: ['characterDesign', 'worldDesign', 'colorScript'] },
  { name: 'qualityGate3', dependencies: ['visualIntegrator'] },

  // Module 4: Cinematography
  { name: 'cameraFraming', dependencies: ['qualityGate3'] },
  { name: 'lightingDirector', dependencies: ['cameraFraming', 'visualIntegrator'] },
  { name: 'motionChoreographer', dependencies: ['cameraFraming', 'emotionalArcDesigner'] },
  { name: 'cinematographyIntegrator', dependencies: ['cameraFraming', 'lightingDirector', 'motionChoreographer'] },
  { name: 'qualityGate4', dependencies: ['cinematographyIntegrator'] },

  // Module 5: Audio Design
  { name: 'soundDesign', dependencies: ['qualityGate4'] },
  { name: 'musicComposer', dependencies: ['qualityGate4'] },
  { name: 'dialogueDirector', dependencies: ['qualityGate4'] },
  { name: 'audioIntegrator', dependencies: ['soundDesign', 'musicComposer', 'dialogueDirector', 'cinematographyIntegrator'] },
  { name: 'qualityGate5', dependencies: ['audioIntegrator'] },

  // Module 6: Technical Specification
  { name: 'animationTechnique', dependencies: ['qualityGate5'] },
  { name: 'vfxDesigner', dependencies: ['qualityGate5'] },
  { name: 'timingPacing', dependencies: ['qualityGate5'] },
  { name: 'technicalIntegrator', dependencies: ['animationTechnique', 'vfxDesigner', 'timingPacing'] },
  { name: 'qualityGate6', dependencies: ['technicalIntegrator'] },

  // Module 7: Synthesis & Refinement
  { name: 'masterIntegrator', dependencies: ['qualityGate6'] },
  { name: 'qualityGate7', dependencies: ['masterIntegrator'] },
  { name: 'promptFormatter', dependencies: ['qualityGate7'] },
];

// Maps agent keys to their corresponding UI module names for accordion control.
const moduleMap: Record<AgentName, string> = {
    imageAnalysis: 'Module 1: Intake & Analysis',
    conceptExtraction: 'Module 1: Intake & Analysis',
    visionSynthesizer: 'Module 1: Intake & Analysis',
    qualityGate1: 'Module 1: Intake & Analysis',
    storyArchitect: 'Module 2: Creative Foundation',
    emotionalArcDesigner: 'Module 2: Creative Foundation',
    themeSymbolism: 'Module 2: Creative Foundation',
    qualityGate2: 'Module 2: Creative Foundation',
    colorScript: 'Module 3: Visual Design',
    characterDesign: 'Module 3: Visual Design',
    worldDesign: 'Module 3: Visual Design',
    visualIntegrator: 'Module 3: Visual Design',
    qualityGate3: 'Module 3: Visual Design',
    cameraFraming: 'Module 4: Cinematography',
    lightingDirector: 'Module 4: Cinematography',
    motionChoreographer: 'Module 4: Cinematography',
    cinematographyIntegrator: 'Module 4: Cinematography',
    qualityGate4: 'Module 4: Cinematography',
    soundDesign: 'Module 5: Audio Design',
    musicComposer: 'Module 5: Audio Design',
    dialogueDirector: 'Module 5: Audio Design',
    audioIntegrator: 'Module 5: Audio Design',
    qualityGate5: 'Module 5: Audio Design',
    animationTechnique: 'Module 6: Technical Specification',
    vfxDesigner: 'Module 6: Technical Specification',
    timingPacing: 'Module 6: Technical Specification',
    technicalIntegrator: 'Module 6: Technical Specification',
    qualityGate6: 'Module 6: Technical Specification',
    masterIntegrator: 'Module 7: Synthesis & Refinement',
    qualityGate7: 'Module 7: Synthesis & Refinement',
    promptFormatter: 'Module 7: Synthesis & Refinement',
};

// Maps agent keys to their display names in the UI status list.
const agentNameMapping: Record<AgentName, string> = {
  imageAnalysis: 'Agent 1.1',
  conceptExtraction: 'Agent 1.2',
  visionSynthesizer: 'Agent 1.3',
  qualityGate1: 'Quality Gate #1',
  storyArchitect: 'Agent 2.1',
  emotionalArcDesigner: 'Agent 2.2',
  themeSymbolism: 'Agent 2.3',
  qualityGate2: 'Quality Gate #2',
  characterDesign: 'Agent 3.1',
  worldDesign: 'Agent 3.2',
  colorScript: 'Agent 3.3',
  visualIntegrator: 'Agent 3.4',
  qualityGate3: 'Quality Gate #3',
  cameraFraming: 'Agent 4.1',
  lightingDirector: 'Agent 4.2',
  motionChoreographer: 'Agent 4.3',
  cinematographyIntegrator: 'Agent 4.4',
  qualityGate4: 'Quality Gate #4',
  soundDesign: 'Agent 5.1',
  musicComposer: 'Agent 5.2',
  dialogueDirector: 'Agent 5.3',
  audioIntegrator: 'Agent 5.4',
  qualityGate5: 'Quality Gate #5',
  animationTechnique: 'Agent 6.1',
  vfxDesigner: 'Agent 6.2',
  timingPacing: 'Agent 6.3',
  technicalIntegrator: 'Agent 6.4',
  qualityGate6: 'Quality Gate #6',
  masterIntegrator: 'Agent 7.1',
  qualityGate7: 'Agent 7.2',
  promptFormatter: 'Agent 7.3',
};

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

// Maps agent outputs to their corresponding state setters in the main App component.
const stateSetterMapping: Record<string, (value: any) => void> = {
    setImageAnalysis: (value: any) => {},
    setConceptAnalysis: (value: any) => {},
    setVisionDocument: (value: any) => {},
    setQualityGateResult: (value: any) => {},
    setStoryArchitecture: (value: any) => {},
    setEmotionalArc: (value: any) => {},
    setThematicElements: (value: any) => {},
    setQualityGate2Result: (value: any) => {},
    setCharacterDesign: (value: any) => {},
    setWorldDesign: (value: any) => {},
    setColorScript: (value: any) => {},
    setVisualBible: (value: any) => {},
    setQualityGate3Result: (value: any) => {},
    setCinematographyBible: (value: any) => {},
    setQualityGate4Result: (value: any) => {},
    setAudioBible: (value: any) => {},
    setQualityGate5Result: (value: any) => {},
    setTechnicalBible: (value: any) => {},
    setQualityGate6Result: (value: any) => {},
    setMasterPrompt: (value: any) => {},
    setQualityGate7Result: (value: any) => {},
    setFinalFormattedPrompt: (value: any) => {},
};

const agentToStateKeyMap: Record<AgentName, keyof typeof stateSetterMapping> = {
    imageAnalysis: 'setImageAnalysis',
    conceptExtraction: 'setConceptAnalysis',
    visionSynthesizer: 'setVisionDocument',
    qualityGate1: 'setQualityGateResult',
    storyArchitect: 'setStoryArchitecture',
    emotionalArcDesigner: 'setEmotionalArc',
    themeSymbolism: 'setThematicElements',
    qualityGate2: 'setQualityGate2Result',
    characterDesign: 'setCharacterDesign',
    worldDesign: 'setWorldDesign',
    colorScript: 'setColorScript',
    visualIntegrator: 'setVisualBible',
    qualityGate3: 'setQualityGate3Result',
    cinematographyIntegrator: 'setCinematographyBible',
    qualityGate4: 'setQualityGate4Result',
    audioIntegrator: 'setAudioBible',
    qualityGate5: 'setQualityGate5Result',
    technicalIntegrator: 'setTechnicalBible',
    qualityGate6: 'setQualityGate6Result',
    masterIntegrator: 'setMasterPrompt',
    qualityGate7: 'setQualityGate7Result',
    promptFormatter: 'setFinalFormattedPrompt',
    cameraFraming: 'setCinematographyBible', // Not a direct output, but related
    lightingDirector: 'setCinematographyBible',
    motionChoreographer: 'setCinematographyBible',
    soundDesign: 'setAudioBible',
    musicComposer: 'setAudioBible',
    dialogueDirector: 'setAudioBible',
    animationTechnique: 'setTechnicalBible',
    vfxDesigner: 'setTechnicalBible',
    timingPacing: 'setTechnicalBible',
};


export async function executePipeline(
  initialInputs: { seedImage: string | null; conceptBrief: string },
  updaters: any,
  options: { useCache: boolean },
  revisionInfo?: { failedGate: number; issuesToAddress: string[] }
) {
  updaters.setIsPipelineRunning(true);
  updaters.setError(null);
  
  // Populate state setters from the UI
  for (const key in stateSetterMapping) {
      if (updaters[key]) {
        stateSetterMapping[key as keyof typeof stateSetterMapping] = updaters[key];
      }
  }

  const agentOutputs: Record<string, any> = {};

  const getAgentInput = (agentName: AgentName) => {
    switch (agentName) {
      case 'imageAnalysis':
        return { imageData: initialInputs.seedImage?.split(',')[1] };
      case 'conceptExtraction':
        return { conceptBrief: initialInputs.conceptBrief, imageAnalysis: agentOutputs.imageAnalysis };
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

  const setStatus = (agentKey: AgentName, status: AgentStatus) => {
    const agentUIName = agentNameMapping[agentKey];
    if (agentUIName) {
        updaters.setAgentStatuses((prev: any) => ({ ...prev, [agentUIName]: status }));
    }
  };

  const startGate = revisionInfo ? revisionInfo.failedGate : 1;
  const startIndex = pipelineDefinition.findIndex(def => def.name.endsWith(`qualityGate${startGate - 1}`)) + 1;
  const pipelineToRun = pipelineDefinition.slice(startGate > 1 ? startIndex : 0);
  
  for (const { name } of pipelineToRun) {
    try {
      if (name === 'imageAnalysis' && !initialInputs.seedImage) continue;
      if (name === 'conceptExtraction' && !initialInputs.conceptBrief) continue;

      setStatus(name, 'running');
      updaters.setOpenModules((prev: string[]) => {
        const moduleName = moduleMap[name];
        return !prev.includes(moduleName) ? [...prev, moduleName] : prev;
      });

      const agent = agentRegistry[name];
      const input = getAgentInput(name);
      const cacheKey = getCacheKey(name, input);

      let output;
      const cachedOutput = localStorage.getItem(cacheKey);

      if (options.useCache && cachedOutput && !revisionInfo) {
        output = JSON.parse(cachedOutput);
      } else {
        output = await agent.run(input, { outputs: agentOutputs, critiques: {} });
        if (options.useCache) {
          localStorage.setItem(cacheKey, JSON.stringify(output));
        }
      }
      
      agentOutputs[name] = output;
      
      const stateKey = agentToStateKeyMap[name];
      if (stateKey && stateSetterMapping[stateKey]) {
          stateSetterMapping[stateKey](output);
      }
      
      setStatus(name, 'success');

      if (name.startsWith('qualityGate')) {
        const report = output.qualityGateReport;
        if (!report.summary.overallPassed) {
          const gateNumber = name.replace('qualityGate', '');
          updaters.setError(`Pipeline stopped: Quality Gate #${gateNumber} failed.`);
          updaters.setIsPipelineRunning(false);
          return;
        }
      }

    } catch (error) {
      setStatus(name, 'error');
      updaters.setError(`Error during ${name}: ${(error as Error).message}`);
      updaters.setIsPipelineRunning(false);
      return;
    }
  }

  updaters.setIsPipelineRunning(false);
}
