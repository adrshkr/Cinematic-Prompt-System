// src/components/pipeline/AgentStatusItem.tsx
import React from 'react';
import { AgentStatus } from '../../types';
import { StatusIndicator } from './StatusIndicator';
import { agentNameMapping } from '../../lib/pipelineConfig';
import { AgentName } from '../../lib/pipelineConfig';

interface AgentStatusItemProps {
  name: string;
  status: AgentStatus;
}

export const AgentStatusItem: React.FC<AgentStatusItemProps> = ({ name, status }) => {
  const displayName = agentNameMapping[name as AgentName] || name;

  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800/60 rounded-lg border border-gray-200/80 dark:border-gray-700">
      <StatusIndicator status={status} />
      <span className="flex-grow text-sm font-medium text-gray-700 dark:text-gray-300">{displayName}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{status}</span>
    </div>
  );
};
