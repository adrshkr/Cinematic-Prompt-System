// src/components/SeedAnalyzer.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { usePipelineStore } from '../store/store';
import { SparklesIcon, TrashIcon, ArrowPathIcon, PhotoIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, LightBulbIcon } from './ui/Icons';
import { resizeImage } from '../lib/utils';
import { modules } from '../lib/pipelineConfig';
import { ModuleAccordion } from './pipeline/ModuleAccordion';
import { AccordionSection } from './pipeline/AccordionSection';
import { QualityGateResultDisplay } from './pipeline/QualityGateResultDisplay';
import { SeedIdeaGenerator } from './pipeline/SeedIdeaGenerator';


const SeedAnalyzer: React.FC = () => {
  const store = usePipelineStore();
  const {
    seedImage, setSeedImage,
    conceptBrief, setConceptBrief,
    isPipelineRunning, error,
    runPipeline, clearAll, importState,
    visionDocument, qualityGateResult,
    qualityGate2Result,
    visualBible, qualityGate3Result,
    cinematographyBible, qualityGate4Result,
    audioBible, qualityGate5Result,
    technicalBible, qualityGate6Result,
    masterPrompt, qualityGate7Result,
    finalFormattedPrompt,
    modulesToRunFromCache,
    imageAnalysis, conceptAnalysis, storyArchitecture, emotionalArc, thematicElements,
  } = store;
  
  const [openAccordion, setOpenAccordion] = useState<string | null>('vision');
  const [useCache, setUseCache] = useState(true);
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const importFileRef = useRef<HTMLInputElement>(null);

  const getFailedGateInfo = useCallback(() => {
    if (qualityGateResult?.qualityGateReport?.summary?.overallPassed === false) return { gate: 1, result: qualityGateResult };
    if (qualityGate2Result?.qualityGateReport?.summary?.overallPassed === false) return { gate: 2, result: qualityGate2Result };
    if (qualityGate3Result?.qualityGateReport?.summary?.overallPassed === false) return { gate: 3, result: qualityGate3Result };
    if (qualityGate4Result?.qualityGateReport?.summary?.overallPassed === false) return { gate: 4, result: qualityGate4Result };
    if (qualityGate5Result?.qualityGateReport?.summary?.overallPassed === false) return { gate: 5, result: qualityGate5Result };
    if (qualityGate6Result?.qualityGateReport?.summary?.overallPassed === false) return { gate: 6, result: qualityGate6Result };
    if (qualityGate7Result?.qualityGateReport?.summary?.overallPassed === false) return { gate: 7, result: qualityGate7Result };
    return null;
  }, [qualityGateResult, qualityGate2Result, qualityGate3Result, qualityGate4Result, qualityGate5Result, qualityGate6Result, qualityGate7Result]);

  const failedGateInfo = getFailedGateInfo();
  const isRevisionMode = !!failedGateInfo;


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resizedDataUrl = await resizeImage(file);
        setSeedImage(resizedDataUrl);
      } catch (uploadError) {
        console.error("Image resizing failed:", uploadError);
        usePipelineStore.getState().setError("Failed to process image. Please try a different one.");
      }
    }
  };
  
  const handleClear = () => {
    clearAll();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('agent_output_')) {
            localStorage.removeItem(key);
        }
    });
  };

  const handleExecution = () => {
    const initialInputs = { seedImage, conceptBrief };
    const options = { useCache, modulesToRunFromCache };

    if (isRevisionMode) {
      runPipeline(
        initialInputs,
        options,
        {
          failedGate: failedGateInfo.gate,
          issuesToAddress: failedGateInfo.result?.qualityGateReport?.summary?.issuesToAddress || [],
        }
      );
    } else {
      runPipeline(initialInputs, options);
    }
  };

  const handleExportState = () => {
    const stateToExport: Partial<typeof store> = { ...store };
    // Convert Set to Array for JSON serialization
    (stateToExport.modulesToRunFromCache as any) = Array.from(stateToExport.modulesToRunFromCache);
    delete (stateToExport as any).runPipeline;
    delete (stateToExport as any).clearAll;
    
    const jsonString = JSON.stringify(stateToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pipeline_state_${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleImportState = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const text = e.target?.result;
              if (typeof text !== 'string') throw new Error("File could not be read.");
              
              const parsedState = JSON.parse(text);
              // Convert array back to Set
              if (Array.isArray(parsedState.modulesToRunFromCache)) {
                  parsedState.modulesToRunFromCache = new Set(parsedState.modulesToRunFromCache);
              }
              importState(parsedState);
          } catch (err) {
              console.error("Failed to import state:", err);
              usePipelineStore.getState().setError("Failed to parse state file. It may be corrupted or in the wrong format.");
          }
      };
      reader.readAsText(file);
      // Reset file input to allow re-importing the same file
      event.target.value = '';
  };
  
  const handleIdeaGenerated = (brief: string) => {
    setSeedImage(null); // Clear image if a text idea is generated
    if(fileInputRef.current) fileInputRef.current.value = '';
    setConceptBrief(brief);
    setShowGeneratorModal(false);
  };


  useEffect(() => {
    if (visionDocument) {
      setOpenAccordion('vision');
    }
  }, [visionDocument]);

  return (
    <div className="space-y-8">
      {showGeneratorModal && (
        <SeedIdeaGenerator
          onClose={() => setShowGeneratorModal(false)}
          onIdeaGenerated={handleIdeaGenerated}
        />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">1. Seed Image</h2>
            <div
              className="mt-2 aspect-[4/3] bg-[#F4F4F3] dark:bg-[#1C1C1C] border border-gray-300/70 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-500 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors group relative"
              onClick={() => fileInputRef.current?.click()}
            >
              {seedImage ? (
                <img src={seedImage} alt="Seed preview" className="max-h-full max-w-full object-contain rounded-md p-2" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400">
                  <PhotoIcon className="w-10 h-10"/>
                  <span>Click to upload an image</span>
                </div>
              )}
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">2. Concept Brief</h2>
            <textarea
              value={conceptBrief}
              onChange={(e) => setConceptBrief(e.target.value)}
              placeholder="Describe your vision for the 15-second video..."
              className="mt-2 w-full h-40 p-3 border border-gray-300/80 dark:border-gray-700 bg-white dark:bg-[#1C1C1C] rounded-xl resize-y focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">3. Execute Pipeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <button
                    onClick={() => setShowGeneratorModal(true)}
                    disabled={isPipelineRunning}
                    className="flex items-center justify-center gap-3 px-6 py-3 font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800/80 rounded-lg shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    aria-label="Generate an Idea"
                >
                    <LightBulbIcon className="w-5 h-5"/>
                    Generate Idea
                </button>
                <button
                    onClick={handleExecution}
                    disabled={isPipelineRunning || (!seedImage && !conceptBrief)}
                    className={`flex items-center justify-center gap-3 px-6 py-3 font-semibold text-white rounded-lg shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isRevisionMode ? 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500' : 'bg-gray-800 dark:bg-indigo-600 hover:bg-gray-900 dark:hover:bg-indigo-500 focus:ring-gray-800 dark:focus:ring-indigo-500'}`}
                >
                    {isRevisionMode ? <ArrowPathIcon className="w-5 h-5"/> : <SparklesIcon className="w-5 h-5"/>}
                    {isRevisionMode ? `Revise (Gate #${failedGateInfo?.gate})` : 'Run Pipeline'}
                </button>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="useCache"
                        checked={useCache}
                        onChange={(e) => setUseCache(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-900"
                    />
                    <label htmlFor="useCache" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Use Local Storage Cache
                    </label>
                </div>
                <div className="flex items-center gap-2">
                    <input type="file" accept=".json" ref={importFileRef} onChange={handleImportState} className="hidden" />
                    <button
                        onClick={() => importFileRef.current?.click()}
                        disabled={isPipelineRunning}
                        className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 border border-gray-200/80 dark:border-gray-700"
                        aria-label="Import pipeline state"
                    >
                        <ArrowUpTrayIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                    </button>
                    <button
                        onClick={handleExportState}
                        disabled={isPipelineRunning || !visionDocument}
                        className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 border border-gray-200/80 dark:border-gray-700"
                        aria-label="Export pipeline state"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                    </button>
                    <button
                        onClick={handleClear}
                        disabled={isPipelineRunning}
                        className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 border border-gray-200/80 dark:border-gray-700"
                        aria-label="Clear all inputs and results"
                    >
                        <TrashIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                    </button>
                </div>
            </div>
          </div>
          
          <div className="space-y-3 pt-2">
            {modules.map(module => (
              <ModuleAccordion 
                key={module.name}
                title={module.name}
                agents={module.agents}
                description={module.description}
              />
            ))}
          </div>

        </div>
      </div>

      {(visionDocument || error) && (
        <div className="space-y-6 pt-8 mt-8 border-t border-gray-200/80 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pipeline Results</h2>
          {error && <div className="p-4 text-red-800 bg-red-100 dark:bg-red-900/40 dark:text-red-200 border border-red-200 dark:border-red-700/50 rounded-lg">{error}</div>}
          
          <div className="space-y-4">
            <QualityGateResultDisplay result={qualityGateResult} gateNumber={1} />
            <QualityGateResultDisplay result={qualityGate2Result} gateNumber={2} />
            <QualityGateResultDisplay result={qualityGate3Result} gateNumber={3} />
            <QualityGateResultDisplay result={qualityGate4Result} gateNumber={4} />
            <QualityGateResultDisplay result={qualityGate5Result} gateNumber={5} />
            <QualityGateResultDisplay result={qualityGate6Result} gateNumber={6} />
            <QualityGateResultDisplay result={qualityGate7Result} gateNumber={7} />
            <AccordionSection title="Final Formatted Prompt (Agent 7.3)" data={finalFormattedPrompt} id="final" isOpen={openAccordion === 'final'} setOpenAccordion={setOpenAccordion} />
            <AccordionSection title="Master Production Prompt (Agent 7.1)" data={masterPrompt} id="master" isOpen={openAccordion === 'master'} setOpenAccordion={setOpenAccordion} />
            <AccordionSection title="Technical Bible (Integrated by Agent 6.4)" data={technicalBible} id="technical" isOpen={openAccordion === 'technical'} setOpenAccordion={setOpenAccordion} />
            <AccordionSection title="Audio Bible (Integrated by Agent 5.4)" data={audioBible} id="audio" isOpen={openAccordion === 'audio'} setOpenAccordion={setOpenAccordion} />
            <AccordionSection title="Cinematography Bible (Integrated by Agent 4.4)" data={cinematographyBible} id="cinematography" isOpen={openAccordion === 'cinematography'} setOpenAccordion={setOpenAccordion} />
            <AccordionSection title="Visual Bible (Integrated by Agent 3.4)" data={visualBible} id="bible" isOpen={openAccordion === 'bible'} setOpenAccordion={setOpenAccordion} />
            <AccordionSection title="North Star Vision Document (Agent 1.3)" data={visionDocument} id="vision" isOpen={openAccordion === 'vision'} setOpenAccordion={setOpenAccordion} />
            <AccordionSection title="Story Architecture (Agent 2.1)" data={storyArchitecture} id="story" isOpen={openAccordion === 'story'} setOpenAccordion={setOpenAccordion} />
            <AccordionSection title="Emotional Arc Design (Agent 2.2)" data={emotionalArc} id="emotion" isOpen={openAccordion === 'emotion'} setOpenAccordion={setOpenAccordion} />
            <AccordionSection title="Thematic Elements (Agent 2.3)" data={thematicElements} id="theme" isOpen={openAccordion === 'theme'} setOpenAccordion={setOpenAccordion} />
            <AccordionSection title="Image Analysis (Agent 1.1)" data={imageAnalysis} id="image" isOpen={openAccordion === 'image'} setOpenAccordion={setOpenAccordion} />
            <AccordionSection title="Concept Extraction (Agent 1.2)" data={conceptAnalysis} id="concept" isOpen={openAccordion === 'concept'} setOpenAccordion={setOpenAccordion} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SeedAnalyzer;