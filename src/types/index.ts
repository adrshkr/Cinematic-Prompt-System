import type { PipelineState, PipelineActions } from '../store/store';

export enum AgentMode {
  SeedAnalyzer = 'SeedAnalyzer',
  WebResearch = 'WebResearch',
  DeepDive = 'DeepDive',
}

export type AgentStatus = 'pending' | 'running' | 'success' | 'error';

export type PipelineStore = PipelineState & PipelineActions;
