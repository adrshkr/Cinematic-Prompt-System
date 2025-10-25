// src/components/pipeline/ModuleAccordion.tsx
import React from 'react';
import { usePipelineStore } from '../../store/store';
import { ChevronDownIcon, CircleStackIcon } from '../ui/Icons';
import { AgentStatusItem } from './AgentStatusItem';
import { moduleOutputKeys } from '../../store/store';

interface ModuleAccordionProps {
  title: string;
  agents: string[];
}

export const ModuleAccordion: React.FC<ModuleAccordionProps> = ({ title, agents }) => {
  const store = usePipelineStore();
  const { agentStatuses, openModules, setOpenModules, modulesToRunFromCache, toggleModuleCache } = store;

  const isOpen = openModules.includes(title);
  const onToggle = () => setOpenModules(prev => 
    prev.includes(title) 
      ? prev.filter(m => m !== title)
      : [...prev, title]
  );
  
  const hasData = !!store[moduleOutputKeys[title] as keyof typeof store];
  const isCached = modulesToRunFromCache.has(title);

  return (
    <div className="border border-gray-200/80 dark:border-gray-800 rounded-xl bg-white/50 dark:bg-[#1C1C1C]/50 overflow-hidden">
      <button onClick={onToggle} className="w-full flex justify-between items-center p-3 bg-gray-50/70 hover:bg-gray-100/50 dark:bg-gray-800/30 dark:hover:bg-gray-800/50">
        <div className="flex items-center gap-3">
          {hasData && <CircleStackIcon className="w-5 h-5 text-indigo-500" />}
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-base">{title}</h3>
        </div>
        <div className="flex items-center gap-4">
           {hasData && (
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <span className={`text-xs font-medium ${isCached ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`}>Use Cache</span>
                  <button
                      role="switch"
                      aria-checked={isCached}
                      onClick={() => toggleModuleCache(title)}
                      className={`${isCached ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                  >
                      <span className={`${isCached ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                  </button>
              </div>
          )}
          <ChevronDownIcon className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {isOpen && (
        <div className="p-3 space-y-2 border-t border-gray-200/80 dark:border-gray-800 bg-gray-50/30 dark:bg-black/20">
          {agents.map(agentName => (
            <AgentStatusItem key={agentName} name={agentName} status={agentStatuses[agentName]} />
          ))}
        </div>
      )}
    </div>
  );
};
