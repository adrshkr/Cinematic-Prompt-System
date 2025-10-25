import React, { useState, useCallback } from 'react';
import { deepDive } from '../services/geminiService';
import { SparklesIcon } from './Icons';
import { LoadingSpinner } from './LoadingSpinner';

const DeepDive: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await deepDive(prompt);
      setResult(response);
    } catch (e) {
      console.error(e);
      setError('Failed to generate a deep dive response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Deep Dive Agent</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">For your most complex creative tasks. This agent uses an advanced model with maximum thinking budget to generate detailed shot lists, character backstories, or entire cinematic concepts.</p>
      </div>

      <div className="flex flex-col gap-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Generate a 15-shot list for a short film combining the environmental style of Makoto Shinkai with the action of Yutaka Nakamura..."
          className="w-full bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-y text-gray-900 dark:text-gray-100"
        />
        <button
          onClick={handleGenerate}
          disabled={!prompt || isLoading}
          className="flex items-center justify-center w-full sm:w-auto px-6 py-3 font-semibold text-white bg-gray-900 dark:bg-indigo-600 rounded-lg shadow-sm transition-all duration-300 hover:bg-gray-700 dark:hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {isLoading ? <LoadingSpinner/> : <SparklesIcon />}
          <span className="ml-2">Generate</span>
        </button>
      </div>
      
      {error && <div className="p-4 text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-700/50">{error}</div>}

      {isLoading && (
        <div className="text-center p-8">
            <LoadingSpinner />
            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 animate-pulse">Engaging deep thought process...</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Generated Concept</h3>
          <div className="p-4 bg-gray-50 dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap shadow-inner max-h-[500px] overflow-y-auto">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeepDive;