// constants.ts

import { AgentMode } from './types';
import { BeakerIcon, GlobeAltIcon, SparklesIcon } from './components/Icons';

export const AGENT_MODES = [
  {
    id: AgentMode.SeedAnalyzer,
    name: 'Intake Pipeline',
    description: 'Analyze seed image and concept brief to create a unified vision.',
    Icon: BeakerIcon,
    color: 'bg-gray-200',
    hoverColor: 'hover:bg-gray-300',
    textColor: 'text-gray-900',
  },
  {
    id: AgentMode.WebResearch,
    name: 'Web Research',
    description: 'Get up-to-date answers from the web with grounding.',
    Icon: GlobeAltIcon,
    color: 'bg-gray-200',
    hoverColor: 'hover:bg-gray-300',
    textColor: 'text-gray-900',
  },
  {
    id: AgentMode.DeepDive,
    name: 'Deep Dive',
    description: 'For complex creative and reasoning tasks.',
    Icon: SparklesIcon,
    color: 'bg-gray-200',
    hoverColor: 'hover:bg-gray-300',
    textColor: 'text-gray-900',
  },
];