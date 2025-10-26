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
    description: 'Analyzes initial inputs (image, text) to establish a unified creative vision and checks its feasibility.',
    agents: ['Agent 1.1', 'Agent 1.2', 'Agent 1.3', 'Quality Gate #1'] 
  },
  { 
    name: 'Module 2: Creative Foundation', 
    description: 'Builds the narrative and emotional core of the film, including story structure, emotional arc, and thematic elements.',
    agents: ['Agent 2.1', 'Agent 2.2', 'Agent 2.3', 'Quality Gate #2'] 
  },
  { 
    name: 'Module 3: Visual Design', 
    description: 'Designs the complete visual identity, including character design, world-building, and a master color script.',
    agents: ['Agent 3.3', 'Agent 3.1', 'Agent 3.2', 'Agent 3.4', 'Quality Gate #3'] 
  },
  {
    name: 'Module 4: Cinematography',
    description: "Defines the film's visual language through a detailed shot-by-shot plan for camera, lighting, and motion.",
    agents: ['Agent 4.1', 'Agent 4.2', 'Agent 4.3', 'Agent 4.4', 'Quality Gate #4']
  },
  {
    name: 'Module 5: Audio Design',
    description: 'Creates the complete soundscape, including sound effects, musical score, and any dialogue or vocalizations.',
    agents: ['Agent 5.1', 'Agent 5.2', 'Agent 5.3', 'Agent 5.4', 'Quality Gate #5']
  },
  {
    name: 'Module 6: Technical Specification',
    description: 'Specifies the technical details for animation production, including techniques, VFX, and final timing.',
    agents: ['Agent 6.1', 'Agent 6.2', 'Agent 6.3', 'Agent 6.4', 'Quality Gate #6']
  },
  {
    name: 'Module 7: Synthesis & Refinement',
    description: 'Integrates all creative and technical plans into a final, comprehensive master prompt and formats it for the video generation model.',
    agents: ['Agent 7.1', 'Agent 7.2', 'Agent 7.3']
  },
];

export const agentDescriptions: Record<string, string> = {
    'Agent 1.1': 'Analyzes the seed image to extract detailed visual style information, including art style, lighting, and composition.',
    'Agent 1.2': 'Extracts the core narrative, emotional intent, and key requirements from the user\'s text concept brief.',
    'Agent 1.3': 'Synthesizes the image analysis and concept brief into a single, unified "North Star" creative vision document.',
    'Quality Gate #1': 'Audits the Vision Document for clarity, feasibility, and completeness before proceeding to creative development.',

    'Agent 2.1': 'Builds a formal three-act story structure for the 15-second film, complete with key narrative beats.',
    'Agent 2.2': 'Designs the emotional journey of the story, mapping out the intended feelings for the audience from start to finish.',
    'Agent 2.3': 'Identifies the core theme and devises key symbols and motifs to be woven into the visuals.',
    'Quality Gate #2': 'Audits the creative foundation (story, emotion, theme) for cohesion and potential impact.',

    'Agent 3.1': 'Designs the main character(s), including their appearance, costume, and animation requirements, based on the visual style.',
    'Agent 3.2': 'Designs the world and environment, including locations, atmosphere, and background details.',
    'Agent 3.3': 'Creates the master color palette and color script that dictates the mood and color flow throughout the film.',
    'Agent 3.4': 'Integrates the character, world, and color designs into a single, cohesive "Visual Bible" for the production team.',
    'Quality Gate #3': 'Audits the Visual Bible for stylistic consistency, 2D purity, and readiness for animation.',

    'Agent 4.1': 'Acts as the director of photography, creating a detailed shot-by-shot list with camera angles, movements, and composition.',
    'Agent 4.2': 'Designs the lighting for every shot, specifying light sources, color, quality, and mood to enhance the story.',
    'Agent 4.3': 'Choreographs all on-screen character and environmental motion, including timing, secondary actions, and transitions.',
    'Agent 4.4': 'Integrates the camera, lighting, and motion plans into a final, unified "Cinematography Bible".',
    'Quality Gate #4': 'Audits the Cinematography Bible for coherence, feasibility, and artistic excellence.',
    
    'Agent 5.1': 'Designs the complete soundscape, including foley (character sounds) and special sound effects (SFX).',
    'Agent 5.2': 'Composes the musical score, aligning it with the emotional arc and key visual moments.',
    'Agent 5.3': 'Determines if dialogue is needed, writes any necessary lines, and plans for non-verbal vocalizations.',
    'Agent 5.4': 'Integrates all sound, music, and dialogue into a final, synchronized "Audio Bible".',
    'Quality Gate #5': 'Audits the Audio Bible for sync precision, mix balance, and how well it enhances the visuals and emotion.',

    'Agent 6.1': 'Specifies the technical animation details for each shot, such as frame rates (animating on 1s, 2s) and shading techniques.',
    'Agent 6.2': 'Designs any 2D visual effects (VFX) like magical glows, particles, or energy blasts in a hand-drawn style.',
    'Agent 6.3': 'Performs a final timing pass, making micro-adjustments to shot durations to perfect the rhythm and pacing.',
    'Agent 6.4': 'Integrates all technical specifications into a final "Technical Bible" with a feasibility report.',
    'Quality Gate #6': 'Audits the Technical Bible to ensure the entire plan is achievable and ready for production.',
    
    'Agent 7.1': 'The Creative Director. Synthesizes all previous bibles into one comprehensive "Master Production Prompt".',
    'Agent 7.2': 'Performs the final, holistic quality check on the Master Prompt, ensuring it meets "festival-grade" standards.',
    'Agent 7.3': 'Formats the Master Prompt into a concise, machine-readable format for the final video generation model.'
};