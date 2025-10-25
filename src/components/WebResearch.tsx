import React, { useState, useCallback } from 'react';
import { webSearch } from '../services/geminiService';
import { GlobeAltIcon, LinkIcon } from './ui/Icons';
import { LoadingSpinner } from './ui/LoadingSpinner';
import type { GroundingChunk } from '@google/genai';

const WebResearch: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!prompt) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    setSources([]);
    try {
      const response = await webSearch(prompt);
      setResult(response.text);
      setSources(response.sources || []);
    } catch (e) {
      console.error(e);
      setError('Failed to perform web research. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Web Research Agent</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Leverage Google Search for up-to-date answers on animation trends, studio news, or technical questions. The AI provides a synthesized answer with sources.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Latest animation techniques used by Studio Trigger"
          className="flex-grow bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={!prompt || isLoading}
          className="flex items-center justify-center px-6 py-3 font-semibold text-white bg-gray-900 dark:bg-indigo-600 rounded-lg shadow-sm transition-all duration-300 hover:bg-gray-700 dark:hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {isLoading ? <LoadingSpinner/> : <GlobeAltIcon />}
          <span className="ml-2">Search</span>
        </button>
      </div>

      {error && <div className="p-4 text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-700/50">{error}</div>}

      {isLoading && (
        <div className="text-center p-8">
            <LoadingSpinner />
            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 animate-pulse">Searching the web for answers...</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Research Result</h3>
          <div className="p-4 bg-gray-50 dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap shadow-inner">
            {result}
          </div>
          {sources.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Sources:</h4>
              <ul className="space-y-2">
                {sources.filter(source => source.web?.uri).map((source, index) => (
                  <li key={index}>
                    <a 
                      href={source.web!.uri!} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md"
                    >
                      <LinkIcon className="flex-shrink-0"/>
                      <span className="ml-2 truncate">{source.web!.title || source.web!.uri}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WebResearch;