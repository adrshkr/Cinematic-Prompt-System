export enum AgentMode {
  SeedAnalyzer = 'SeedAnalyzer',
  WebResearch = 'WebResearch',
  DeepDive = 'DeepDive',
}

export type AgentStatus = 'pending' | 'running' | 'success' | 'error';
