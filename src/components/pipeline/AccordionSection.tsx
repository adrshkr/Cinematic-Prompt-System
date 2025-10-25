// src/components/pipeline/AccordionSection.tsx
import React, { useState } from 'react';
import { ChevronDownIcon } from '../ui/Icons';

interface AccordionSectionProps {
  title: string;
  data: any;
  id: string;
  isOpen: boolean;
  setOpenAccordion: (id: string | null) => void;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({ title, data, id, isOpen, setOpenAccordion }) => {
  if (!data) return null;
  
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
