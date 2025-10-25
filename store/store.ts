// store/store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AgentStatus } from '../types';
import { executePipeline } from '../services/pipelineService';
import type {
  ImageAnalysisOutput, ConceptExtractionOutput, VisionValidatorOutput, QualityGate1Output,
  StoryArchitectOutput, EmotionalArcDesignerOutput, ThemeSymbolismOutput, QualityGate2Output,
  CharacterDesignOutput, WorldDesignOutput, ColorScriptOutput, VisualIntegratorOutput, QualityGate3Output,
  CinematographyIntegratorOutput, QualityGate4Output, AudioIntegratorOutput, QualityGate5Output,
  TechnicalIntegratorOutput, QualityGate6Output, MasterIntegratorOutput, QualityGate7Output, PromptFormatterOutput
} from '../types/agents';

const initialAgentStatuses: Record<string, AgentStatus> = {
    'Agent 1.1': 'pending', 'Agent 1.2': 'pending', 'Agent 1.3': 'pending', 'Quality Gate #1': 'pending',
    'Agent 2.1': 'pending', 'Agent 2.2': 'pending', 'Agent 2.3': 'pending', 'Quality Gate #2': 'pending',
    'Agent 3.1': 'pending', 'Agent 3.2': 'pending', 'Agent 3.3': 'pending', 'Agent 3.4': 'pending', 'Quality Gate #3': 'pending',
    'Agent 4.1': 'pending', 'Agent 4.2': 'pending', 'Agent 4.3': 'pending', 'Agent 4.4': 'pending', 'Quality Gate #4': 'pending',
    'Agent 5.1': 'pending', 'Agent 5.2': 'pending', 'Agent 5.3': 'pending', 'Agent 5.4': 'pending', 'Quality Gate #5': 'pending',
    'Agent 6.1': 'pending', 'Agent 6.2': 'pending', 'Agent 6.3': 'pending', 'Agent 6.4': 'pending', 'Quality Gate #6': 'pending',
    'Agent 7.1': 'pending', 'Agent 7.2': 'pending', 'Agent 7.3': 'pending',
};

// Helper map to check if a module's data is present in the state.
export const moduleOutputKeys: Record<string, keyof PipelineState> = {
    'Module 1: Intake & Analysis': 'qualityGateResult',
    'Module 2: Creative Foundation': 'qualityGate2Result',
    'Module 3: Visual Design': 'qualityGate3Result',
    'Module 4: Cinematography': 'qualityGate4Result',
    'Module 5: Audio Design': 'qualityGate5Result',
    'Module 6: Technical Specification': 'qualityGate6Result',
    'Module 7: Synthesis & Refinement': 'finalFormattedPrompt',
};

const allModuleNames = Object.keys(moduleOutputKeys);

export interface PipelineState {
  seedImage: string | null;
  conceptBrief: string;
  agentStatuses: Record<string, AgentStatus>;
  isPipelineRunning: boolean;
  error: string | null;
  openModules: string[];
  modulesToRunFromCache: Set<string>;
  
  // Module 1 Outputs
  imageAnalysis: ImageAnalysisOutput | null;
  conceptAnalysis: ConceptExtractionOutput | null;
  visionDocument: VisionValidatorOutput | null;
  qualityGateResult: QualityGate1Output | null;
  
  // Module 2 Outputs
  storyArchitecture: StoryArchitectOutput | null;
  emotionalArc: EmotionalArcDesignerOutput | null;
  thematicElements: ThemeSymbolismOutput | null;
  qualityGate2Result: QualityGate2Output | null;

  // Module 3 Outputs
  characterDesign: CharacterDesignOutput | null;
  worldDesign: WorldDesignOutput | null;
  colorScript: ColorScriptOutput | null;
  visualBible: VisualIntegratorOutput | null;
  qualityGate3Result: QualityGate3Output | null;
  
  // Module 4 Outputs
  cinematographyBible: CinematographyIntegratorOutput | null;
  qualityGate4Result: QualityGate4Output | null;

  // Module 5 Outputs
  audioBible: AudioIntegratorOutput | null;
  qualityGate5Result: QualityGate5Output | null;

  // Module 6 Outputs
  technicalBible: TechnicalIntegratorOutput | null;
  qualityGate6Result: QualityGate6Output | null;

  // Module 7 Outputs
  masterPrompt: MasterIntegratorOutput | null;
  qualityGate7Result: QualityGate7Output | null;
  finalFormattedPrompt: PromptFormatterOutput | null;
}

export interface PipelineActions {
  setSeedImage: (image: string | null) => void;
  setConceptBrief: (brief: string) => void;
  setError: (error: string | null) => void;
  runPipeline: (
    initialInputs: { seedImage: string | null; conceptBrief: string },
    options: { useCache: boolean, modulesToRunFromCache: Set<string> },
    revisionInfo?: { failedGate: number; issuesToAddress: string[] }
  ) => void;
  clearAll: () => void;
  setOpenModules: (updater: (prev: string[]) => string[]) => void;
  toggleModuleCache: (moduleName: string) => void;
  importState: (importedState: Partial<PipelineState>) => void;
}

const initialState: PipelineState = {
  seedImage: null,
  conceptBrief: '',
  agentStatuses: initialAgentStatuses,
  isPipelineRunning: false,
  error: null,
  openModules: ['Module 1: Intake & Analysis'],
  modulesToRunFromCache: new Set(),
  imageAnalysis: null,
  conceptAnalysis: null,
  visionDocument: null,
  qualityGateResult: null,
  storyArchitecture: null,
  emotionalArc: null,
  thematicElements: null,
  qualityGate2Result: null,
  characterDesign: null,
  worldDesign: null,
  colorScript: null,
  visualBible: null,
  qualityGate3Result: null,
  cinematographyBible: null,
  qualityGate4Result: null,
  audioBible: null,
  qualityGate5Result: null,
  technicalBible: null,
  qualityGate6Result: null,
  masterPrompt: null,
  qualityGate7Result: null,
  finalFormattedPrompt: null,
};

export const usePipelineStore = create<PipelineState & PipelineActions>()(
  devtools(
      (set, get) => ({
        ...initialState,
        setSeedImage: (image) => set({ seedImage: image }),
        setConceptBrief: (brief) => set({ conceptBrief: brief }),
        setError: (error) => set({ error }),
        runPipeline: (initialInputs, options, revisionInfo) => {
          executePipeline(initialInputs, options, set, get, revisionInfo);
        },
        clearAll: () => set(initialState),
        setOpenModules: (updater) => set((state) => ({ openModules: updater(state.openModules) })),
        toggleModuleCache: (moduleName) => set((state) => {
          const newSet = new Set(state.modulesToRunFromCache);
          if (newSet.has(moduleName)) {
            newSet.delete(moduleName);
          } else {
            newSet.add(moduleName);
          }
          return { modulesToRunFromCache: newSet };
        }),
        importState: (importedState) => set((state) => {
          const newState = { ...initialState, ...importedState, agentStatuses: initialAgentStatuses };
          // After importing, enable caching for all modules that have data.
          const newModulesToCache = new Set<string>();
          for (const moduleName of allModuleNames) {
              const key = moduleOutputKeys[moduleName];
              if (key && newState[key]) {
                  newModulesToCache.add(moduleName);
              }
          }
          return { ...newState, modulesToRunFromCache: newModulesToCache };
        }),
      }),
  )
);
// NOTE: Persist middleware is removed to simplify state management with Sets
// and avoid serialization issues. The export/import feature now serves as the
// primary persistence mechanism.