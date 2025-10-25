// lib/store/pipeline-store.ts
/**
 * Centralized state management for pipeline execution
 * Replaces the 28-parameter prop drilling nightmare
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AgentStatus } from '../../types';
import type {
  ImageAnalysisOutput,
  ConceptExtractionOutput,
  VisionValidatorOutput,
  QualityGate1Output,
  StoryArchitectOutput,
  EmotionalArcDesignerOutput,
  ThemeSymbolismOutput,
  QualityGate2Output,
  CharacterDesignOutput,
  WorldDesignOutput,
  ColorScriptOutput,
  VisualIntegratorOutput,
  QualityGate3Output,
  CinematographyIntegratorOutput,
  QualityGate4Output,
  AudioIntegratorOutput,
  QualityGate5Output,
  TechnicalIntegratorOutput,
  QualityGate6Output,
  MasterIntegratorOutput,
  QualityGate7Output,
  PromptFormatterOutput,
} from '../../types/agents';

// Agent execution state
export interface AgentExecutionState {
  status: AgentStatus;
  startTime?: number;
  endTime?: number;
  error?: string;
}

// All agent outputs in a single interface
export interface AgentOutputs {
  imageAnalysis: ImageAnalysisOutput | null;
  conceptAnalysis: ConceptExtractionOutput | null;
  visionDocument: VisionValidatorOutput | null;
  qualityGate1: QualityGate1Output | null;
  storyArchitecture: StoryArchitectOutput | null;
  emotionalArc: EmotionalArcDesignerOutput | null;
  thematicElements: ThemeSymbolismOutput | null;
  qualityGate2: QualityGate2Output | null;
  characterDesign: CharacterDesignOutput | null;
  worldDesign: WorldDesignOutput | null;
  colorScript: ColorScriptOutput | null;
  visualBible: VisualIntegratorOutput | null;
  qualityGate3: QualityGate3Output | null;
  cinematographyBible: CinematographyIntegratorOutput | null;
  qualityGate4: QualityGate4Output | null;
  audioBible: AudioIntegratorOutput | null;
  qualityGate5: QualityGate5Output | null;
  technicalBible: TechnicalIntegratorOutput | null;
  qualityGate6: QualityGate6Output | null;
  masterPrompt: MasterIntegratorOutput | null;
  qualityGate7: QualityGate7Output | null;
  finalFormattedPrompt: PromptFormatterOutput | null;
}

// Pipeline state
export interface PipelineState {
  // Input state
  seedImage: string | null;
  conceptBrief: string;

  // Agent outputs
  outputs: AgentOutputs;

  // Agent execution tracking
  agentStatuses: Record<string, AgentExecutionState>;

  // Pipeline execution
  isPipelineRunning: boolean;
  currentAgent: string | null;
  error: string | null;
  openModules: string[];

  // Progress tracking
  totalAgents: number;
  completedAgents: number;
  startTime: number | null;
  estimatedTimeRemaining: number | null;

  // Actions
  setSeedImage: (image: string | null) => void;
  setConceptBrief: (brief: string) => void;

  setAgentOutput: <K extends keyof AgentOutputs>(
    key: K,
    output: AgentOutputs[K]
  ) => void;

  setAgentStatus: (agentName: string, status: Partial<AgentExecutionState>) => void;

  setPipelineRunning: (running: boolean) => void;
  setCurrentAgent: (agentName: string | null) => void;
  setError: (error: string | null) => void;
  toggleModule: (moduleName: string) => void;

  updateProgress: (completed: number, total: number) => void;

  // Utility actions
  reset: () => void;
  resetOutputs: () => void;
  exportState: () => string;
  importState: (state: string) => void;
}

const initialOutputs: AgentOutputs = {
  imageAnalysis: null,
  conceptAnalysis: null,
  visionDocument: null,
  qualityGate1: null,
  storyArchitecture: null,
  emotionalArc: null,
  thematicElements: null,
  qualityGate2: null,
  characterDesign: null,
  worldDesign: null,
  colorScript: null,
  visualBible: null,
  qualityGate3: null,
  cinematographyBible: null,
  qualityGate4: null,
  audioBible: null,
  qualityGate5: null,
  technicalBible: null,
  qualityGate6: null,
  masterPrompt: null,
  qualityGate7: null,
  finalFormattedPrompt: null,
};

const initialAgentStatuses: Record<string, AgentExecutionState> = {
  'Agent 1.1': { status: 'pending' },
  'Agent 1.2': { status: 'pending' },
  'Agent 1.3': { status: 'pending' },
  'Quality Gate #1': { status: 'pending' },
  'Agent 2.1': { status: 'pending' },
  'Agent 2.2': { status: 'pending' },
  'Agent 2.3': { status: 'pending' },
  'Quality Gate #2': { status: 'pending' },
  'Agent 3.1': { status: 'pending' },
  'Agent 3.2': { status: 'pending' },
  'Agent 3.3': { status: 'pending' },
  'Agent 3.4': { status: 'pending' },
  'Quality Gate #3': { status: 'pending' },
  'Agent 4.1': { status: 'pending' },
  'Agent 4.2': { status: 'pending' },
  'Agent 4.3': { status: 'pending' },
  'Agent 4.4': { status: 'pending' },
  'Quality Gate #4': { status: 'pending' },
  'Agent 5.1': { status: 'pending' },
  'Agent 5.2': { status: 'pending' },
  'Agent 5.3': { status: 'pending' },
  'Agent 5.4': { status: 'pending' },
  'Quality Gate #5': { status: 'pending' },
  'Agent 6.1': { status: 'pending' },
  'Agent 6.2': { status: 'pending' },
  'Agent 6.3': { status: 'pending' },
  'Agent 6.4': { status: 'pending' },
  'Quality Gate #6': { status: 'pending' },
  'Agent 7.1': { status: 'pending' },
  'Agent 7.2': { status: 'pending' },
  'Agent 7.3': { status: 'pending' },
};

export const usePipelineStore = create<PipelineState>()(
  persist(
    (set, get) => ({
      // Initial state
      seedImage: null,
      conceptBrief: '',
      outputs: initialOutputs,
      agentStatuses: initialAgentStatuses,
      isPipelineRunning: false,
      currentAgent: null,
      error: null,
      openModules: [],
      totalAgents: 28,
      completedAgents: 0,
      startTime: null,
      estimatedTimeRemaining: null,

      // Actions
      setSeedImage: (image) => set({ seedImage: image }),
      setConceptBrief: (brief) => set({ conceptBrief: brief }),

      setAgentOutput: (key, output) =>
        set((state) => ({
          outputs: {
            ...state.outputs,
            [key]: output,
          },
        })),

      setAgentStatus: (agentName, status) =>
        set((state) => ({
          agentStatuses: {
            ...state.agentStatuses,
            [agentName]: {
              ...state.agentStatuses[agentName],
              ...status,
            },
          },
        })),

      setPipelineRunning: (running) =>
        set({
          isPipelineRunning: running,
          startTime: running ? Date.now() : null,
        }),

      setCurrentAgent: (agentName) => set({ currentAgent: agentName }),

      setError: (error) => set({ error }),

      toggleModule: (moduleName) =>
        set((state) => ({
          openModules: state.openModules.includes(moduleName)
            ? state.openModules.filter((m) => m !== moduleName)
            : [...state.openModules, moduleName],
        })),

      updateProgress: (completed, total) => {
        const { startTime } = get();
        const now = Date.now();

        let estimatedTimeRemaining = null;
        if (startTime && completed > 0) {
          const elapsed = now - startTime;
          const avgTimePerAgent = elapsed / completed;
          const remaining = total - completed;
          estimatedTimeRemaining = Math.round(avgTimePerAgent * remaining);
        }

        set({
          completedAgents: completed,
          totalAgents: total,
          estimatedTimeRemaining,
        });
      },

      reset: () =>
        set({
          seedImage: null,
          conceptBrief: '',
          outputs: initialOutputs,
          agentStatuses: initialAgentStatuses,
          isPipelineRunning: false,
          currentAgent: null,
          error: null,
          openModules: [],
          completedAgents: 0,
          startTime: null,
          estimatedTimeRemaining: null,
        }),

      resetOutputs: () =>
        set({
          outputs: initialOutputs,
          agentStatuses: initialAgentStatuses,
          completedAgents: 0,
          error: null,
        }),

      exportState: () => {
        const state = get();
        return JSON.stringify({
          seedImage: state.seedImage,
          conceptBrief: state.conceptBrief,
          outputs: state.outputs,
        }, null, 2);
      },

      importState: (stateString) => {
        try {
          const imported = JSON.parse(stateString);
          set({
            seedImage: imported.seedImage || null,
            conceptBrief: imported.conceptBrief || '',
            outputs: imported.outputs || initialOutputs,
          });
        } catch (error) {
          console.error('Failed to import state:', error);
        }
      },
    }),
    {
      name: 'pipeline-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        seedImage: state.seedImage,
        conceptBrief: state.conceptBrief,
        outputs: state.outputs,
      }),
    }
  )
);

// Selector hooks for better performance
export const useSeedImage = () => usePipelineStore((state) => state.seedImage);
export const useConceptBrief = () => usePipelineStore((state) => state.conceptBrief);
export const useIsPipelineRunning = () => usePipelineStore((state) => state.isPipelineRunning);
export const useAgentOutputs = () => usePipelineStore((state) => state.outputs);
export const useAgentStatuses = () => usePipelineStore((state) => state.agentStatuses);
export const usePipelineError = () => usePipelineStore((state) => state.error);
export const usePipelineProgress = () => usePipelineStore((state) => ({
  completed: state.completedAgents,
  total: state.totalAgents,
  estimatedTimeRemaining: state.estimatedTimeRemaining,
}));
