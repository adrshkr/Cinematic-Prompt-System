// components/SeedAnalyzer.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { executePipeline } from '../services/pipelineService';
import { SparklesIcon, TrashIcon, ChevronDownIcon, CheckIcon, XIcon, ShieldCheckIcon, ArrowPathIcon, PhotoIcon } from './Icons';
import { AgentStatus } from '../types';

const modules = [
  { 
    name: 'Module 1: Intake & Analysis', 
    agents: ['Agent 1.1', 'Agent 1.2', 'Agent 1.3', 'Quality Gate #1'] 
  },
  { 
    name: 'Module 2: Creative Foundation', 
    agents: ['Agent 2.1', 'Agent 2.2', 'Agent 2.3', 'Quality Gate #2'] 
  },
  { 
    name: 'Module 3: Visual Design', 
    agents: ['Agent 3.3', 'Agent 3.1', 'Agent 3.2', 'Agent 3.4', 'Quality Gate #3'] 
  },
  {
    name: 'Module 4: Cinematography',
    agents: ['Agent 4.1', 'Agent 4.2', 'Agent 4.3', 'Agent 4.4', 'Quality Gate #4']
  },
  {
    name: 'Module 5: Audio Design',
    agents: ['Agent 5.1', 'Agent 5.2', 'Agent 5.3', 'Agent 5.4', 'Quality Gate #5']
  },
  {
    name: 'Module 6: Technical Specification',
    agents: ['Agent 6.1', 'Agent 6.2', 'Agent 6.3', 'Agent 6.4', 'Quality Gate #6']
  },
  {
    name: 'Module 7: Synthesis & Refinement',
    agents: ['Agent 7.1', 'Agent 7.2', 'Agent 7.3']
  },
];

const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }
        ctx.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};


interface SeedAnalyzerProps {
  seedImage: string | null;
  setSeedImage: (value: string | null) => void;
  conceptBrief: string;
  setConceptBrief: (value: string) => void;
  imageAnalysis: any | null;
  setImageAnalysis: (value: any | null) => void;
  conceptAnalysis: any | null;
  setConceptAnalysis: (value: any | null) => void;
  visionDocument: any | null;
  setVisionDocument: (value: any | null) => void;
  qualityGateResult: any | null;
  setQualityGateResult: (value: any | null) => void;
  storyArchitecture: any | null;
  setStoryArchitecture: (value: any | null) => void;
  emotionalArc: any | null;
  setEmotionalArc: (value: any | null) => void;
  thematicElements: any | null;
  setThematicElements: (value: any | null) => void;
  qualityGate2Result: any | null;
  setQualityGate2Result: (value: any | null) => void;
  characterDesign: any | null;
  setCharacterDesign: (value: any | null) => void;
  worldDesign: any | null;
  setWorldDesign: (value: any | null) => void;
  colorScript: any | null;
  setColorScript: (value: any | null) => void;
  visualBible: any | null;
  setVisualBible: (value: any | null) => void;
  qualityGate3Result: any | null;
  setQualityGate3Result: (value: any | null) => void;
  cinematographyBible: any | null;
  setCinematographyBible: (value: any | null) => void;
  qualityGate4Result: any | null;
  setQualityGate4Result: (value: any | null) => void;
  audioBible: any | null;
  setAudioBible: (value: any | null) => void;
  qualityGate5Result: any | null;
  setQualityGate5Result: (value: any | null) => void;
  technicalBible: any | null;
  setTechnicalBible: (value: any | null) => void;
  qualityGate6Result: any | null;
  setQualityGate6Result: (value: any | null) => void;
  masterPrompt: any | null;
  setMasterPrompt: (value: any | null) => void;
  qualityGate7Result: any | null;
  setQualityGate7Result: (value: any | null) => void;
  finalFormattedPrompt: any | null;
  setFinalFormattedPrompt: (value: any | null) => void;
}


const SeedAnalyzer: React.FC<SeedAnalyzerProps> = (props) => {
  const {
    seedImage, setSeedImage,
    conceptBrief, setConceptBrief
  } = props;

  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus>>({
    'Agent 1.1': 'pending', 'Agent 1.2': 'pending', 'Agent 1.3': 'pending', 'Quality Gate #1': 'pending',
    'Agent 2.1': 'pending', 'Agent 2.2': 'pending', 'Agent 2.3': 'pending', 'Quality Gate #2': 'pending',
    'Agent 3.1': 'pending', 'Agent 3.2': 'pending', 'Agent 3.3': 'pending', 'Agent 3.4': 'pending', 'Quality Gate #3': 'pending',
    'Agent 4.1': 'pending', 'Agent 4.2': 'pending', 'Agent 4.3': 'pending', 'Agent 4.4': 'pending', 'Quality Gate #4': 'pending',
    'Agent 5.1': 'pending', 'Agent 5.2': 'pending', 'Agent 5.3': 'pending', 'Agent 5.4': 'pending', 'Quality Gate #5': 'pending',
    'Agent 6.1': 'pending', 'Agent 6.2': 'pending', 'Agent 6.3': 'pending', 'Agent 6.4': 'pending', 'Quality Gate #6': 'pending',
    'Agent 7.1': 'pending', 'Agent 7.2': 'pending', 'Agent 7.3': 'pending',
  });
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>('vision');
  const [openModules, setOpenModules] = useState<string[]>([modules[0].name]);
  const [useCache, setUseCache] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFailedGateInfo = useCallback(() => {
    if (props.qualityGateResult?.qualityGateReport?.summary?.overallPassed === false) return { gate: 1, result: props.qualityGateResult };
    if (props.qualityGate2Result?.qualityGateReport?.summary?.overallPassed === false) return { gate: 2, result: props.qualityGate2Result };
    if (props.qualityGate3Result?.qualityGateReport?.summary?.overallPassed === false) return { gate: 3, result: props.qualityGate3Result };
    if (props.qualityGate4Result?.qualityGateReport?.summary?.overallPassed === false) return { gate: 4, result: props.qualityGate4Result };
    if (props.qualityGate5Result?.qualityGateReport?.summary?.overallPassed === false) return { gate: 5, result: props.qualityGate5Result };
    if (props.qualityGate6Result?.qualityGateReport?.summary?.overallPassed === false) return { gate: 6, result: props.qualityGate6Result };
    if (props.qualityGate7Result?.qualityGateReport?.summary?.overallPassed === false) return { gate: 7, result: props.qualityGate7Result };
    return null;
  }, [props.qualityGateResult, props.qualityGate2Result, props.qualityGate3Result, props.qualityGate4Result, props.qualityGate5Result, props.qualityGate6Result, props.qualityGate7Result]);

  const failedGateInfo = getFailedGateInfo();
  const isRevisionMode = !!failedGateInfo;


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resizedDataUrl = await resizeImage(file);
        setSeedImage(resizedDataUrl);
      } catch (error) {
        console.error("Image resizing failed:", error);
        setError("Failed to process image. Please try a different one.");
      }
    }
  };

  const clearAll = () => {
    setSeedImage(null);
    setConceptBrief('');
    props.setImageAnalysis(null);
    props.setConceptAnalysis(null);
    props.setVisionDocument(null);
    props.setQualityGateResult(null);
    props.setStoryArchitecture(null);
    props.setEmotionalArc(null);
    props.setThematicElements(null);
    props.setQualityGate2Result(null);
    props.setCharacterDesign(null);
    props.setWorldDesign(null);
    props.setColorScript(null);
    props.setVisualBible(null);
    props.setQualityGate3Result(null);
    props.setCinematographyBible(null);
    props.setQualityGate4Result(null);
    props.setAudioBible(null);
    props.setQualityGate5Result(null);
    props.setTechnicalBible(null);
    props.setQualityGate6Result(null);
    props.setMasterPrompt(null);
    props.setQualityGate7Result(null);
    props.setFinalFormattedPrompt(null);
    setError(null);
    setAgentStatuses(
      Object.keys(agentStatuses).reduce((acc, key) => ({ ...acc, [key]: 'pending' }), {})
    );
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
    const stateUpdaters = {
      setImageAnalysis: props.setImageAnalysis,
      setConceptAnalysis: props.setConceptAnalysis,
      setVisionDocument: props.setVisionDocument,
      setQualityGateResult: props.setQualityGateResult,
      setStoryArchitecture: props.setStoryArchitecture,
      setEmotionalArc: props.setEmotionalArc,
      setThematicElements: props.setThematicElements,
      setQualityGate2Result: props.setQualityGate2Result,
      setCharacterDesign: props.setCharacterDesign,
      setWorldDesign: props.setWorldDesign,
      setColorScript: props.setColorScript,
      setVisualBible: props.setVisualBible,
      setQualityGate3Result: props.setQualityGate3Result,
      setCinematographyBible: props.setCinematographyBible,
      setQualityGate4Result: props.setQualityGate4Result,
      setAudioBible: props.setAudioBible,
      setQualityGate5Result: props.setQualityGate5Result,
      setTechnicalBible: props.setTechnicalBible,
      setQualityGate6Result: props.setQualityGate6Result,
      setMasterPrompt: props.setMasterPrompt,
      setQualityGate7Result: props.setQualityGate7Result,
      setFinalFormattedPrompt: props.setFinalFormattedPrompt,
      agentStatuses,
      setAgentStatuses,
      setIsPipelineRunning,
      setError,
      setOpenModules,
    };

    const options = { useCache };

    if (isRevisionMode) {
      executePipeline(
        { seedImage, conceptBrief },
        stateUpdaters,
        options,
        {
          failedGate: failedGateInfo.gate,
          issuesToAddress: failedGateInfo.result?.qualityGateReport?.summary?.issuesToAddress || [],
        }
      );
    } else {
      executePipeline({ seedImage, conceptBrief }, stateUpdaters, options);
    }
  };

  useEffect(() => {
    if (props.visionDocument) {
      setOpenAccordion('vision');
    }
  }, [props.visionDocument]);

  const StatusIndicator = ({ status }: { status: AgentStatus }) => {
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

  const AccordionSection = ({ title, data, id }: { title: string, data: any, id: string }) => {
    if (!data) return null;
    const isOpen = openAccordion === id;
    return (
      <div className="border border-gray-200/80 dark:border-gray-800 rounded-lg bg-white dark:bg-[#1C1C1C]">
        <button onClick={() => setOpenAccordion(isOpen ? null : id)} className="w-full flex justify-between items-center p-4 bg-gray-50/70 hover:bg-gray-100/50 dark:bg-gray-800/40 dark:hover:bg-gray-800/60 rounded-t-lg">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
          <ChevronDownIcon className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="p-4 border-t border-gray-200/80 dark:border-gray-800 max-h-96 overflow-y-auto">
            <pre className="text-sm bg-black text-white p-4 rounded-md whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  const QualityGateResultDisplay = ({ result, gateNumber }: { result: any, gateNumber: number }) => {
    if (!result?.qualityGateReport) return null;
    const report = result.qualityGateReport;
    const passed = report.summary.overallPassed;

    return (
      <div className={`border-2 ${passed ? 'border-green-300 dark:border-green-700/50' : 'border-red-300 dark:border-red-700/50'} bg-white dark:bg-[#1C1C1C] rounded-lg p-4 shadow-sm`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${passed ? 'bg-green-100 dark:bg-green-900/40' : 'bg-red-100 dark:bg-red-900/40'}`}>
            {passed ? <ShieldCheckIcon className="w-5 h-5 text-green-600 dark:text-green-300" /> : <XIcon className="w-5 h-5 text-red-600 dark:text-red-300" />}
          </div>
          <div>
            <h3 className={`text-lg font-bold ${passed ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              Quality Gate #{gateNumber}: {report.gateName.split(':')[1].trim()} - {passed ? 'PASSED' : 'FAILED'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Overall Score: <span className="font-semibold">{report.summary.overallScore.toFixed(1)} / 10.0</span>
            </p>
          </div>
        </div>
        {!passed && report.summary.issuesToAddress?.length > 0 && (
          <div className="mt-4 pl-11">
            <h4 className="font-semibold text-red-800 dark:text-red-200">Issues to Address:</h4>
            <ul className="list-disc list-inside mt-1 text-sm text-red-700 dark:text-red-300 space-y-1">
              {report.summary.issuesToAddress.map((issue: string, index: number) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  interface AgentStatusItemProps {
    name: string;
    status: AgentStatus;
  }
  
  const AgentStatusItem: React.FC<AgentStatusItemProps> = ({ name, status }) => {
    const agentNameMap: Record<string, string> = {
      'Agent 1.1': 'Image Analysis', 'Agent 1.2': 'Concept Extraction', 'Agent 1.3': 'Vision Synthesizer',
      'Agent 2.1': 'Story Architect', 'Agent 2.2': 'Emotional Arc Designer', 'Agent 2.3': 'Theme & Symbolism',
      'Agent 3.1': 'Character Design', 'Agent 3.2': 'World Design', 'Agent 3.3': 'Color Script', 'Agent 3.4': 'Visual Integrator',
      'Agent 4.1': 'Camera & Framing', 'Agent 4.2': 'Lighting Director', 'Agent 4.3': 'Motion Choreographer', 'Agent 4.4': 'Cinematography Integrator',
      'Agent 5.1': 'Sound Design', 'Agent 5.2': 'Music Composer', 'Agent 5.3': 'Dialogue Director', 'Agent 5.4': 'Audio Integrator',
      'Agent 6.1': 'Animation Technique', 'Agent 6.2': 'VFX Designer', 'Agent 6.3': 'Timing & Pacing', 'Agent 6.4': 'Technical Integrator',
      'Agent 7.1': 'Master Integrator', 'Agent 7.2': 'Final QA', 'Agent 7.3': 'Prompt Formatter',
    };
    const displayName = agentNameMap[name] || name;

    return (
      <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800/60 rounded-lg border border-gray-200/80 dark:border-gray-700">
        <StatusIndicator status={status} />
        <span className="flex-grow text-sm font-medium text-gray-700 dark:text-gray-300">{displayName}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{status}</span>
      </div>
    );
  };
  
  interface ModuleAccordionProps {
    title: string;
    agents: string[];
    statuses: Record<string, AgentStatus>;
    isOpen: boolean;
    onToggle: () => void;
  }
  
  const ModuleAccordion: React.FC<ModuleAccordionProps> = ({ title, agents, statuses, isOpen, onToggle }) => (
    <div className="border border-gray-200/80 dark:border-gray-800 rounded-xl bg-white/50 dark:bg-[#1C1C1C]/50 overflow-hidden">
      <button onClick={onToggle} className="w-full flex justify-between items-center p-3 bg-gray-50/70 hover:bg-gray-100/50 dark:bg-gray-800/30 dark:hover:bg-gray-800/50">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-base">{title}</h3>
        <ChevronDownIcon className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-3 space-y-2 border-t border-gray-200/80 dark:border-gray-800 bg-gray-50/30 dark:bg-black/20">
          {agents.map(agentName => (
            <AgentStatusItem key={agentName} name={agentName} status={statuses[agentName]} />
          ))}
        </div>
      )}
    </div>
  );


  return (
    <div className="space-y-8">
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
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={handleExecution}
                disabled={isPipelineRunning || (!seedImage && !conceptBrief)}
                className={`flex-grow flex items-center justify-center gap-3 px-6 py-3 font-semibold text-white rounded-lg shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isRevisionMode ? 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500' : 'bg-gray-800 dark:bg-indigo-600 hover:bg-gray-900 dark:hover:bg-indigo-500 focus:ring-gray-800 dark:focus:ring-indigo-500'}`}
              >
                {isRevisionMode ? <ArrowPathIcon className="w-5 h-5"/> : <SparklesIcon className="w-5 h-5"/>}
                {isRevisionMode ? `Revise & Rerun (Gate #${failedGateInfo?.gate} Failed)` : 'Run Pipeline'}
              </button>
              <button
                onClick={clearAll}
                disabled={isPipelineRunning}
                className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 border border-gray-200/80 dark:border-gray-700"
                aria-label="Clear all inputs and results"
              >
                <TrashIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
              </button>
            </div>
             <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                id="useCache"
                checked={useCache}
                onChange={(e) => setUseCache(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-900"
              />
              <label htmlFor="useCache" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Use Cache (skip completed agents)
              </label>
            </div>
          </div>
          
          <div className="space-y-3 pt-2">
            {modules.map(module => (
              <ModuleAccordion 
                key={module.name}
                title={module.name}
                agents={module.agents}
                statuses={agentStatuses}
                isOpen={openModules.includes(module.name)}
                onToggle={() => setOpenModules(prev => 
                  prev.includes(module.name) 
                    ? prev.filter(m => m !== module.name)
                    : [...prev, module.name]
                )}
              />
            ))}
          </div>

        </div>
      </div>

      {(props.visionDocument || error || props.visualBible || props.cinematographyBible) && (
        <div className="space-y-6 pt-8 mt-8 border-t border-gray-200/80 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pipeline Results</h2>
          {error && <div className="p-4 text-red-800 bg-red-100 dark:bg-red-900/40 dark:text-red-200 border border-red-200 dark:border-red-700/50 rounded-lg">{error}</div>}
          
          <div className="space-y-4">
            <QualityGateResultDisplay result={props.qualityGateResult} gateNumber={1} />
            <QualityGateResultDisplay result={props.qualityGate2Result} gateNumber={2} />
            <QualityGateResultDisplay result={props.qualityGate3Result} gateNumber={3} />
            <QualityGateResultDisplay result={props.qualityGate4Result} gateNumber={4} />
            <QualityGateResultDisplay result={props.qualityGate5Result} gateNumber={5} />
            <QualityGateResultDisplay result={props.qualityGate6Result} gateNumber={6} />
            <QualityGateResultDisplay result={props.qualityGate7Result} gateNumber={7} />
            <AccordionSection title="Final Formatted Prompt (Agent 7.3)" data={props.finalFormattedPrompt} id="final" />
            <AccordionSection title="Master Production Prompt (Agent 7.1)" data={props.masterPrompt} id="master" />
            <AccordionSection title="Technical Bible (Integrated by Agent 6.4)" data={props.technicalBible} id="technical" />
            <AccordionSection title="Audio Bible (Integrated by Agent 5.4)" data={props.audioBible} id="audio" />
            <AccordionSection title="Cinematography Bible (Integrated by Agent 4.4)" data={props.cinematographyBible} id="cinematography" />
            <AccordionSection title="North Star Vision Document (Agent 1.3)" data={props.visionDocument} id="vision" />
            <AccordionSection title="Story Architecture (Agent 2.1)" data={props.storyArchitecture} id="story" />
            <AccordionSection title="Emotional Arc Design (Agent 2.2)" data={props.emotionalArc} id="emotion" />
            <AccordionSection title="Thematic Elements (Agent 2.3)" data={props.thematicElements} id="theme" />
            <AccordionSection title="Visual Bible (Integrated by Agent 3.4)" data={props.visualBible} id="bible" />
            <AccordionSection title="Image Analysis (Agent 1.1)" data={props.imageAnalysis} id="image" />
            <AccordionSection title="Concept Extraction (Agent 1.2)" data={props.conceptAnalysis} id="concept" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SeedAnalyzer;