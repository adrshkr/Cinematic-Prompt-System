// App.tsx
import React, { useState } from 'react';
import { AgentMode } from './types';
import { AGENT_MODES } from './constants';
import SeedAnalyzer from './components/SeedAnalyzer';
import WebResearch from './components/WebResearch';
import DeepDive from './components/DeepDive';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDarkMode } from './hooks/useDarkMode';
import { SunIcon, MoonIcon } from './components/Icons';

interface NavButtonProps {
  mode: AgentMode;
  currentMode: AgentMode;
  setCurrentMode: (mode: AgentMode) => void;
  children: React.ReactElement<{ className?: string }>;
}

const NavButton: React.FC<NavButtonProps> = ({
  mode,
  currentMode,
  setCurrentMode,
  children,
}) => {
  const isActive = currentMode === mode;
  const activeConfig = AGENT_MODES.find((m) => m.id === mode);
  if (!activeConfig) return null;

  const baseClasses =
    'flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-all duration-200';
  const activeClasses = `bg-gray-800 dark:bg-gray-800 text-white shadow-sm`;
  const inactiveClasses = 'text-gray-500 dark:text-gray-400 hover:bg-gray-200/70 dark:hover:bg-gray-800/50';

  return (
    <button
      onClick={() => setCurrentMode(mode)}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {React.cloneElement(children, { className: 'w-5 h-5' })}
      {activeConfig.name}
    </button>
  );
};

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AgentMode>(AgentMode.SeedAnalyzer);
  const [theme, toggleTheme] = useDarkMode();


  const [seedImage, setSeedImage] = useLocalStorage<string | null>('seedImage', null);
  const [conceptBrief, setConceptBrief] = useLocalStorage<string>('conceptBrief', '');
  const [imageAnalysis, setImageAnalysis] = useLocalStorage<any | null>('imageAnalysis', null);
  const [conceptAnalysis, setConceptAnalysis] = useLocalStorage<any | null>('conceptAnalysis', null);
  const [visionDocument, setVisionDocument] = useLocalStorage<any | null>('visionDocument', null);
  const [qualityGateResult, setQualityGateResult] = useLocalStorage<any | null>('qualityGateResult', null);
  const [storyArchitecture, setStoryArchitecture] = useLocalStorage<any | null>('storyArchitecture', null);
  const [emotionalArc, setEmotionalArc] = useLocalStorage<any | null>('emotionalArc', null);
  const [thematicElements, setThematicElements] = useLocalStorage<any | null>('thematicElements', null);
  const [qualityGate2Result, setQualityGate2Result] = useLocalStorage<any | null>('qualityGate2Result', null);
  const [characterDesign, setCharacterDesign] = useLocalStorage<any | null>('characterDesign', null);
  const [worldDesign, setWorldDesign] = useLocalStorage<any | null>('worldDesign', null);
  const [colorScript, setColorScript] = useLocalStorage<any | null>('colorScript', null);
  const [visualBible, setVisualBible] = useLocalStorage<any | null>('visualBible', null);
  const [qualityGate3Result, setQualityGate3Result] = useLocalStorage<any | null>('qualityGate3Result', null);
  const [cinematographyBible, setCinematographyBible] = useLocalStorage<any | null>('cinematographyBible', null);
  const [qualityGate4Result, setQualityGate4Result] = useLocalStorage<any | null>('qualityGate4Result', null);
  const [audioBible, setAudioBible] = useLocalStorage<any | null>('audioBible', null);
  const [qualityGate5Result, setQualityGate5Result] = useLocalStorage<any | null>('qualityGate5Result', null);
  const [technicalBible, setTechnicalBible] = useLocalStorage<any | null>('technicalBible', null);
  const [qualityGate6Result, setQualityGate6Result] = useLocalStorage<any | null>('qualityGate6Result', null);
  const [masterPrompt, setMasterPrompt] = useLocalStorage<any | null>('masterPrompt', null);
  const [qualityGate7Result, setQualityGate7Result] = useLocalStorage<any | null>('qualityGate7Result', null);
  const [finalFormattedPrompt, setFinalFormattedPrompt] = useLocalStorage<any | null>('finalFormattedPrompt', null);


  const renderAgent = () => {
    switch (currentMode) {
      case AgentMode.SeedAnalyzer:
        return (
          <SeedAnalyzer
            seedImage={seedImage}
            setSeedImage={setSeedImage}
            conceptBrief={conceptBrief}
            setConceptBrief={setConceptBrief}
            imageAnalysis={imageAnalysis}
            setImageAnalysis={setImageAnalysis}
            conceptAnalysis={conceptAnalysis}
            setConceptAnalysis={setConceptAnalysis}
            visionDocument={visionDocument}
            setVisionDocument={setVisionDocument}
            qualityGateResult={qualityGateResult}
            setQualityGateResult={setQualityGateResult}
            storyArchitecture={storyArchitecture}
            setStoryArchitecture={setStoryArchitecture}
            emotionalArc={emotionalArc}
            setEmotionalArc={setEmotionalArc}
            thematicElements={thematicElements}
            setThematicElements={setThematicElements}
            qualityGate2Result={qualityGate2Result}
            setQualityGate2Result={setQualityGate2Result}
            characterDesign={characterDesign}
            setCharacterDesign={setCharacterDesign}
            worldDesign={worldDesign}
            setWorldDesign={setWorldDesign}
            colorScript={colorScript}
            setColorScript={setColorScript}
            visualBible={visualBible}
            setVisualBible={setVisualBible}
            qualityGate3Result={qualityGate3Result}
            setQualityGate3Result={setQualityGate3Result}
            cinematographyBible={cinematographyBible}
            setCinematographyBible={setCinematographyBible}
            qualityGate4Result={qualityGate4Result}
            setQualityGate4Result={setQualityGate4Result}
            audioBible={audioBible}
            setAudioBible={setAudioBible}
            qualityGate5Result={qualityGate5Result}
            setQualityGate5Result={setQualityGate5Result}
            technicalBible={technicalBible}
            setTechnicalBible={setTechnicalBible}
            qualityGate6Result={qualityGate6Result}
            setQualityGate6Result={setQualityGate6Result}
            masterPrompt={masterPrompt}
            setMasterPrompt={setMasterPrompt}
            qualityGate7Result={qualityGate7Result}
            setQualityGate7Result={setQualityGate7Result}
            finalFormattedPrompt={finalFormattedPrompt}
            setFinalFormattedPrompt={setFinalFormattedPrompt}
          />
        );
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
            {renderAgent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;