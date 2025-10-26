// src/lib/constants.ts
import { AgentMode } from '../types';
import { BeakerIcon, GlobeAltIcon, SparklesIcon } from '../components/ui/Icons';

export const AGENT_MODES = [
  {
    id: AgentMode.SeedAnalyzer,
    name: 'Intake Pipeline',
    description: 'Analyze seed image and concept brief to create a unified vision.',
    Icon: BeakerIcon,
  },
  {
    id: AgentMode.WebResearch,
    name: 'Web Research',
    description: 'Get up-to-date answers from the web with grounding.',
    Icon: GlobeAltIcon,
  },
  {
    id: AgentMode.DeepDive,
    name: 'Deep Dive',
    description: 'For complex creative and reasoning tasks.',
    Icon: SparklesIcon,
  },
];
