// src/components/pipeline/QualityGateResultDisplay.tsx
import React from 'react';
import { ShieldCheckIcon, XIcon } from '../ui/Icons';
import { QualityGate1Output, QualityGate2Output, QualityGate3Output, QualityGate4Output, QualityGate5Output, QualityGate6Output, QualityGate7Output } from '../../types/agents';

type QualityGateResult = QualityGate1Output | QualityGate2Output | QualityGate3Output | QualityGate4Output | QualityGate5Output | QualityGate6Output | QualityGate7Output;

interface QualityGateResultDisplayProps {
  result: QualityGateResult | null;
  gateNumber: number;
}

export const QualityGateResultDisplay: React.FC<QualityGateResultDisplayProps> = ({ result, gateNumber }) => {
  if (!result?.qualityGateReport) return null;
  const report = result.qualityGateReport;
  const passed = report.summary.overallPassed;
  const checks = report.checks as Record<string, any> | undefined;
  const summary = report.summary as Record<string, any>;

  const creativityScore = typeof summary?.creativityScore === 'number'
    ? summary.creativityScore
    : typeof checks?.originality?.creativityScore === 'number'
      ? checks.originality.creativityScore
      : undefined;
  const creativityNeedsRevision = typeof creativityScore === 'number' && creativityScore < 7;

  const innovationFindingsRaw = summary?.innovationFindings
    ?? checks?.originality?.innovationFindings
    ?? checks?.highSignalDetails?.preservedHighlights;
  const innovationFindings = Array.isArray(innovationFindingsRaw) ? innovationFindingsRaw : [];

  const inventiveShotCount = typeof checks?.inventiveCinematography?.inventiveShotCount === 'number'
    ? checks?.inventiveCinematography?.inventiveShotCount
    : undefined;
  const priorityMomentsRaw = checks?.microAnimationPlans?.priorityMoments;
  const priorityMoments = Array.isArray(priorityMomentsRaw) ? priorityMomentsRaw : [];
  const genericDepartmentsRaw = checks?.departmentSpecificity?.genericDepartments;
  const genericDepartments = Array.isArray(genericDepartmentsRaw) ? genericDepartmentsRaw : [];

  return (
    <div className={`border-2 ${passed ? 'border-green-300 dark:border-green-700/50' : 'border-red-300 dark:border-red-700/50'} bg-white dark:bg-[#1C1C1C] rounded-lg p-4 shadow-sm`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${passed ? 'bg-green-100 dark:bg-green-900/40' : 'bg-red-100 dark:bg-red-900/40'}`}>
          {passed ? <ShieldCheckIcon className="w-5 h-5 text-green-600 dark:text-green-300" /> : <XIcon className="w-5 h-5 text-red-600 dark:text-red-300" />}
        </div>
        <div>
          <h3 className={`text-lg font-bold ${passed ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
            Quality Gate #{gateNumber}: {report.gateName.split(':')[1]?.trim()} - {passed ? 'PASSED' : 'FAILED'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Overall Score: <span className="font-semibold">{report.summary.overallScore.toFixed(1)} / 10.0</span>
          </p>
        </div>
      </div>
      {typeof creativityScore === 'number' && (
        <div className="mt-3 pl-11 text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Creativity Score:</span>{' '}
          <span className={creativityNeedsRevision ? 'text-red-600 dark:text-red-300 font-semibold' : 'font-semibold'}>
            {creativityScore.toFixed(1)} / 10.0
          </span>
          {creativityNeedsRevision && (
            <span className="ml-2 text-red-600 dark:text-red-300">
              Needs originality revisions before approval.
            </span>
          )}
        </div>
      )}
      {innovationFindings.length > 0 && (
        <div className="mt-3 pl-11">
          <h4 className="font-semibold text-indigo-700 dark:text-indigo-300 text-sm">Innovation Findings to Preserve:</h4>
          <ul className="list-disc list-inside mt-1 text-sm text-gray-700 dark:text-gray-300 space-y-1">
            {innovationFindings.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {(typeof inventiveShotCount === 'number' || priorityMoments.length > 0) && (
        <div className="mt-3 pl-11 space-y-2 text-sm text-gray-700 dark:text-gray-300">
          {typeof inventiveShotCount === 'number' && (
            <p>
              <span className="font-semibold">Inventive Cinematography Count:</span> {inventiveShotCount}
            </p>
          )}
          {priorityMoments.length > 0 && (
            <div>
              <h4 className="font-semibold">Micro-Animation Priority Moments:</h4>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {priorityMoments.map((moment: string, index: number) => (
                  <li key={index}>{moment}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {genericDepartments.length > 0 && (
        <div className="mt-3 pl-11 text-sm text-red-700 dark:text-red-300">
          <p className="font-semibold">Generic Departments Flagged:</p>
          <p>{genericDepartments.join(', ')}</p>
        </div>
      )}
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