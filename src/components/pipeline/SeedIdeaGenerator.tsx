// src/components/pipeline/SeedIdeaGenerator.tsx
import React, { useState, useCallback } from 'react';
import { generateSeedIdea } from '../../services/geminiService';
import { LightBulbIcon, SparklesIcon, XIcon } from '../ui/Icons';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface SeedIdeaGeneratorProps {
  onClose: () => void;
  onIdeaGenerated: (brief: string) => void;
}

type GenerationStep = 'idle' | 'concept' | 'done' | 'error';

const stepMessages: Record<GenerationStep, string> = {
  idle: '',
  concept: 'Generating creative concept...',
  done: 'Your new idea is ready!',
  error: 'An error occurred.',
};

export const SeedIdeaGenerator: React.FC<SeedIdeaGeneratorProps> = ({ onClose, onIdeaGenerated }) => {
  const [keyword, setKeyword] = useState('');
  const [generationStep, setGenerationStep] = useState<GenerationStep>('idle');
  const [generatedBrief, setGeneratedBrief] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = useCallback(async () => {
    if (!keyword) return;

    setGenerationStep('concept');
    setError('');
    
    try {
      const { brief } = await generateSeedIdea(keyword);
      setGeneratedBrief(brief);
      setGenerationStep('done');
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      setGenerationStep('error');
    }
  }, [keyword]);
  
  const isGenerating = generationStep === 'concept';

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" aria-modal="true">
      <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl transform transition-all">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <LightBulbIcon />
            Creative Spark Generator
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!generatedBrief ? (
            <>
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an idea? No problem. Just provide a keyword or a short phrase, and the AI will generate a unique concept brief to get you started.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., lonely robot, haunted library, cyberpunk rain"
                  className="flex-grow bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  disabled={isGenerating}
                />
                <button
                  onClick={handleGenerate}
                  disabled={!keyword || isGenerating}
                  className="flex items-center justify-center px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg shadow-sm transition-all duration-300 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? <LoadingSpinner /> : <SparklesIcon className="w-5 h-5" />}
                  <span className="ml-2">Generate</span>
                </button>
              </div>

              {isGenerating && (
                 <div className="text-center p-4">
                    <div className="flex items-center justify-center gap-3">
                        <LoadingSpinner />
                        <p className="text-lg text-gray-700 dark:text-gray-300 animate-pulse">{stepMessages[generationStep]}</p>
                    </div>
                </div>
              )}
               {error && <div className="p-3 text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-700/50 text-sm">{error}</div>}
            </>
          ) : (
            <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{stepMessages.done}</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#1C1C1C] p-3 rounded-lg border dark:border-gray-700 max-h-60 overflow-y-auto">
                    {generatedBrief}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                     <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                       Regenerate
                    </button>
                    <button
                        onClick={() => onIdeaGenerated(generatedBrief)}
                        className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500"
                    >
                       Use This Idea
                    </button>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};