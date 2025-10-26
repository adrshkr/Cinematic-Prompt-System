// src/components/pipeline/AgentStatusItem.tsx
import React from 'react';
import { AgentStatus } from '../../types';
import { StatusIndicator } from './StatusIndicator';
import { Tooltip } from '../ui/Tooltip';
import { InformationCircleIcon } from '../ui/Icons';
import { agentDescriptions } from '../../lib/pipelineConfig';

interface AgentStatusItemProps {
  name: string;
  status: AgentStatus;
}

export const AgentStatusItem: React.FC<AgentStatusItemProps> = ({ name, status }) => {
  const displayName = name;
  const description = agentDescriptions[name as keyof typeof agentDescriptions];

  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800/60 rounded-lg border border-gray-200/80 dark:border-gray-700">
      <StatusIndicator status={status} />
      <span className="flex-grow text-sm font-medium text-gray-700 dark:text-gray-300">{displayName}</span>
      {description && (
        <Tooltip text={description}>
          <InformationCircleIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </Tooltip>
      )}
      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize w-14 text-right">{status}</span>
    </div>
  );
};