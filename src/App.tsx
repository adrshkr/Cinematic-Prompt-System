// App.tsx
import React, { useState } from 'react';
import { AgentMode } from './types';
import { AGENT_MODES } from './lib/constants';
import SeedAnalyzer from './components/SeedAnalyzer';
import WebResearch from './components/WebResearch';
import DeepDive from './components/DeepDive';
import { useDarkMode } from './hooks/useDarkMode';
import { SunIcon, MoonIcon } from './components/ui/Icons';
import ErrorBoundary from './components/ErrorBoundary';
import { NavButton } from './components/NavButton';

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AgentMode>(AgentMode.SeedAnalyzer);
  const [theme, toggleTheme] = useDarkMode();

  const renderAgent = () => {
    switch (currentMode) {
      case AgentMode.SeedAnalyzer:
        return <SeedAnalyzer />;
      case AgentMode.WebResearch:
        return <WebResearch />;
      case AgentMode.DeepDive:
        return <DeepDive />;
      default:
        return null;
    }
  };


  return (
    <div className="min-h-screen bg-[#F8F8F7] dark:bg-black text-[#1A1A1A] dark:text-gray-300 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10 relative">
          <h1 className="text-5xl font-bold tracking-tighter text-gray-900 dark:text-gray-100">Cinematic Prompt Studio</h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">An AI-powered orchestration pipeline for creating festival-grade cinematic prompts.</p>
           <div className="absolute top-0 right-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        <main className="bg-white dark:bg-[#111111] rounded-2xl shadow-sm border border-[#EAEAEA] dark:border-gray-800 p-4 sm:p-6">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-black/50 p-1.5 rounded-xl border border-gray-200/80 dark:border-gray-800">
               {AGENT_MODES.map((mode) => (
                  <NavButton
                    key={mode.id}
                    mode={mode.id}
                    currentMode={currentMode}
                    setCurrentMode={setCurrentMode}
                  >
                    <mode.Icon />
                  </NavButton>
              ))}
            </div>
          </div>
          
          <div className="mt-4">
            <ErrorBoundary>
              {renderAgent()}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;