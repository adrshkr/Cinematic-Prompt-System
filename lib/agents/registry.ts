// lib/agents/registry.ts
import { ImageAnalysisAgent } from './module1/image-analysis-agent';
import { ConceptExtractionAgent } from './module1/concept-extraction-agent';
import { VisionValidatorAgent } from './module1/vision-validator-agent';
import { QualityGate1Agent } from './module1/quality-gate-1-agent';
import { StoryArchitectAgent } from './module2/story-architect-agent';
import { EmotionalArcDesignerAgent } from './module2/emotional-arc-designer-agent';
import { ThemeSymbolismAgent } from './module2/theme-symbolism-agent';
import { QualityGate2Agent } from './module2/quality-gate-2-agent';
import { ColorScriptAgent } from './module3/color-script-agent';
import { CharacterDesignAgent } from './module3/character-design-agent';
import { WorldDesignAgent } from './module3/world-design-agent';
import { VisualIntegratorAgent } from './module3/visual-integrator-agent';
import { QualityGate3Agent } from './module3/quality-gate-3-agent';
import { CameraFramingAgent } from './module4/camera-framing-agent';
import { LightingDirectorAgent } from './module4/lighting-director-agent';
import { MotionChoreographerAgent } from './module4/motion-choreographer-agent';
import { CinematographyIntegratorAgent } from './module4/cinematography-integrator-agent';
import { QualityGate4Agent } from './module4/quality-gate-4-agent';
import { SoundDesignAgent } from './module5/sound-design-agent';
import { MusicComposerAgent } from './module5/music-composer-agent';
import { DialogueDirectorAgent } from './module5/dialogue-director-agent';
import { AudioIntegratorAgent } from './module5/audio-integrator-agent';
import { QualityGate5Agent } from './module5/quality-gate-5-agent';
import { AnimationTechniqueAgent } from './module6/animation-technique-agent';
import { VFXDesignerAgent } from './module6/vfx-designer-agent';
import { TimingPacingAgent } from './module6/timing-pacing-agent';
import { TechnicalIntegratorAgent } from './module6/technical-integrator-agent';
import { QualityGate6Agent } from './module6/quality-gate-6-agent';
import { MasterIntegratorAgent } from './module7/master-integrator-agent';
import { QualityGate7Agent } from './module7/quality-gate-7-agent';
import { PromptFormatterAgent } from './module7/prompt-formatter-agent';


export const agentRegistry = {
  // Module 1
  imageAnalysis: new ImageAnalysisAgent(),
  conceptExtraction: new ConceptExtractionAgent(),
  visionSynthesizer: new VisionValidatorAgent(),
  qualityGate1: new QualityGate1Agent(),

  // Module 2
  storyArchitect: new StoryArchitectAgent(),
  emotionalArcDesigner: new EmotionalArcDesignerAgent(),
  themeSymbolism: new ThemeSymbolismAgent(),
  qualityGate2: new QualityGate2Agent(),

  // Module 3
  colorScript: new ColorScriptAgent(),
  characterDesign: new CharacterDesignAgent(),
  worldDesign: new WorldDesignAgent(),
  visualIntegrator: new VisualIntegratorAgent(),
  qualityGate3: new QualityGate3Agent(),

  // Module 4
  cameraFraming: new CameraFramingAgent(),
  lightingDirector: new LightingDirectorAgent(),
  motionChoreographer: new MotionChoreographerAgent(),
  cinematographyIntegrator: new CinematographyIntegratorAgent(),
  qualityGate4: new QualityGate4Agent(),

  // Module 5
  soundDesign: new SoundDesignAgent(),
  musicComposer: new MusicComposerAgent(),
  dialogueDirector: new DialogueDirectorAgent(),
  audioIntegrator: new AudioIntegratorAgent(),
  qualityGate5: new QualityGate5Agent(),

  // Module 6
  animationTechnique: new AnimationTechniqueAgent(),
  vfxDesigner: new VFXDesignerAgent(),
  timingPacing: new TimingPacingAgent(),
  technicalIntegrator: new TechnicalIntegratorAgent(),
  qualityGate6: new QualityGate6Agent(),
  
  // Module 7
  masterIntegrator: new MasterIntegratorAgent(),
  qualityGate7: new QualityGate7Agent(),
  promptFormatter: new PromptFormatterAgent(),
};