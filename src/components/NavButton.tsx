// src/components/NavButton.tsx
import React from 'react';
import { AgentMode } from '../types';
import { AGENT_MODES } from '../lib/constants';
import { Tooltip } from './ui/Tooltip';

interface NavButtonProps {
  mode: AgentMode;
  currentMode: AgentMode;
  setCurrentMode: (mode: AgentMode) => void;
  children: React.ReactElement<{ className?: string }>;
}

export const NavButton: React.FC<NavButtonProps> = ({
  mode,
  currentMode,
  setCurrentMode,
  children,
}) => {
  const isActive = currentMode === mode;
  const activeConfig = AGENT_MODES.find((m) => m.id === mode);
  if (!activeConfig) return null;

  const baseClasses =
    'flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-all duration-200 w-full';
  const activeClasses = `bg-gray-800 dark:bg-gray-800 text-white shadow-sm`;
  const inactiveClasses = 'text-gray-500 dark:text-gray-400 hover:bg-gray-200/70 dark:hover:bg-gray-800/50';

  return (
    <Tooltip text={activeConfig.description}>
      <button
        onClick={() => setCurrentMode(mode)}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        aria-label={activeConfig.name}
      >
        {React.cloneElement(children, { className: 'w-5 h-5' })}
        {activeConfig.name}
      </button>
    </Tooltip>
  );
};