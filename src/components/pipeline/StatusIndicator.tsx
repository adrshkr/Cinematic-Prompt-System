// src/components/pipeline/StatusIndicator.tsx
import React from 'react';
import { AgentStatus } from '../../types';
import { CheckIcon, XIcon } from '../ui/Icons';

interface StatusIndicatorProps {
  status: AgentStatus;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const statusConfig = {
    pending: { color: 'bg-gray-300 dark:bg-gray-600', icon: null },
    running: { color: 'bg-blue-200 dark:bg-blue-900/50', icon: <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div> },
    success: { color: 'bg-green-200 dark:bg-green-900/50', icon: <CheckIcon className="w-3 h-3 text-green-700 dark:text-green-300" /> },
    error: { color: 'bg-red-200 dark:bg-red-900/50', icon: <XIcon className="w-3 h-3 text-red-700 dark:text-red-300" /> },
  };
  const config = statusConfig[status];

  const ProgressCircle = () => (
    <svg className="w-5 h-5 absolute" viewBox="0 0 20 20">
      <circle className="text-gray-200 dark:text-gray-700" strokeWidth="2" stroke="currentColor" fill="transparent" r="8" cx="10" cy="10"/>
      <circle className="text-blue-500 animate-spin-slow" strokeWidth="2" strokeLinecap="round" stroke="currentColor" fill="transparent" r="8" cx="10" cy="10" style={{ strokeDasharray: '12 50' }}/>
    </svg>
  );

  return (
    <div className="relative flex items-center justify-center w-5 h-5">
      {status === 'running' && <ProgressCircle />}
      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${config.color}`}>
        {config.icon}
      </div>
    </div>
  );
};
