// src/lib/pipelineConfig.ts
import { agentRegistry } from './agents/registry';
import { PipelineState } from '../store/store';

export type AgentName = keyof typeof agentRegistry;

// Defines the execution order in stages. Agents in the same stage run in parallel.
export const pipelineStages: AgentName[][] = [
  // Module 1: Intake & Analysis
  ['imageAnalysis', 'conceptExtraction'],
  ['visionSynthesizer'],
  ['qualityGate1'],
  
  // Module 2: Creative Foundation
  ['storyArchitect', 'emotionalArcDesigner', 'themeSymbolism'],
  ['qualityGate2'],

  // Module 3: Visual Design
  ['colorScript'],
  ['characterDesign', 'worldDesign'],
  ['visualIntegrator'],
  ['qualityGate3'],

  // Module 4: Cinematography
  ['cameraFraming'],
  ['lightingDirector', 'motionChoreographer'],
  ['cinematographyIntegrator'],
  ['qualityGate4'],

  // Module 5: Audio Design
  ['soundDesign', 'musicComposer', 'dialogueDirector'],
  ['audioIntegrator'],
  ['qualityGate5'],

  // Module 6: Technical Specification
  ['animationTechnique', 'vfxDesigner', 'timingPacing'],
  ['technicalIntegrator'],
  ['qualityGate6'],

  // Module 7: Synthesis & Refinement
  ['masterIntegrator'],
  ['qualityGate7'],
  ['promptFormatter'],
];

// Maps agent keys to their corresponding UI module names for accordion control.
export const moduleMap: Record<AgentName, string> = {
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
export const agentNameMapping: Record<AgentName, string> = {
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


// Maps agent keys to their corresponding state keys in the Zustand store.
export const agentToStateKeyMap: Partial<Record<AgentName, keyof PipelineState>> = {
    imageAnalysis: 'imageAnalysis',
    conceptExtraction: 'conceptAnalysis',
    visionSynthesizer: 'visionDocument',
    qualityGate1: 'qualityGateResult',
    storyArchitect: 'storyArchitecture',
    emotionalArcDesigner: 'emotionalArc',
    // FIX: The key must match the agent name in the registry ('themeSymbolism'), not the state property name.
    themeSymbolism: 'thematicElements',
    qualityGate2: 'qualityGate2Result',
    characterDesign: 'characterDesign',
    worldDesign: 'worldDesign',
    colorScript: 'colorScript',
    visualIntegrator: 'visualBible',
    qualityGate3: 'qualityGate3Result',
    cinematographyIntegrator: 'cinematographyBible',
    qualityGate4: 'qualityGate4Result',
    audioIntegrator: 'audioBible',
    qualityGate5: 'qualityGate5Result',
    technicalIntegrator: 'technicalBible',
    qualityGate6: 'qualityGate6Result',
    masterIntegrator: 'masterPrompt',
    qualityGate7: 'qualityGate7Result',
    promptFormatter: 'finalFormattedPrompt',
};

// Configuration for the module accordion UI in SeedAnalyzer.
export const modules = [
  { 
    name: 'Module 1: Intake & Analysis', 
    agents: ['Agent 1.1', 'Agent 1.2', 'Agent 1.3', 'Quality Gate #1'] 
  },
  { 
    name: 'Module 2: Creative Foundation', 
    agents: ['Agent 2.1', 'Agent 2.2', 'Agent 2.3', 'Quality Gate #2'] 
  },
  { 
    name: 'Module 3: Visual Design', 
    agents: ['Agent 3.3', 'Agent 3.1', 'Agent 3.2', 'Agent 3.4', 'Quality Gate #3'] 
  },
  {
    name: 'Module 4: Cinematography',
    agents: ['Agent 4.1', 'Agent 4.2', 'Agent 4.3', 'Agent 4.4', 'Quality Gate #4']
  },
  {
    name: 'Module 5: Audio Design',
    agents: ['Agent 5.1', 'Agent 5.2', 'Agent 5.3', 'Agent 5.4', 'Quality Gate #5']
  },
  {
    name: 'Module 6: Technical Specification',
    agents: ['Agent 6.1', 'Agent 6.2', 'Agent 6.3', 'Agent 6.4', 'Quality Gate #6']
  },
  {
    name: 'Module 7: Synthesis & Refinement',
    agents: ['Agent 7.1', 'Agent 7.2', 'Agent 7.3']
  },
];