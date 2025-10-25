// components/PipelineGraph.tsx
import React from 'react';

type AgentStatus = 'pending' | 'running' | 'success' | 'error';

interface PipelineGraphProps {
  agentStatuses: Record<string, AgentStatus>;
}

const statusStyles: Record<AgentStatus, { icon: string, text: string, line: string, arrow: string }> = {
    pending: { icon: 'text-gray-400', text: 'text-gray-500 font-normal', line: 'stroke-gray-300', arrow: '#D1D5DB' },
    running: { icon: 'text-blue-500 animate-pulse', text: 'text-blue-600 font-semibold', line: 'stroke-blue-400', arrow: '#60A5FA' },
    success: { icon: 'text-green-500', text: 'text-green-600 font-semibold', line: 'stroke-green-500', arrow: '#10B981' },
    error: { icon: 'text-red-500', text: 'text-red-600 font-semibold', line: 'stroke-red-500', arrow: '#EF4444' },
};

const IconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <svg className={`w-10 h-10 ${className}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        {children}
    </svg>
);

const agentIcons: Record<string, React.FC<{ className?: string }>> = {
    'Start': ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>,
    'Agent 1.1': ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></IconWrapper>,
    'Agent 1.2': ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></IconWrapper>,
    'Agent 1.3': ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12.97 3.97a.75.75 0 011.06 0l2.25 2.25a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 01-1.06 0l-2.25-2.25a.75.75 0 010-1.06l2.25-2.25zM12.97 15.97a.75.75 0 011.06 0l2.25 2.25a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 01-1.06 0l-2.25-2.25a.75.75 0 010-1.06l2.25-2.25zM7.03 8.03a.75.75 0 011.06 0l2.25 2.25a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 01-1.06 0l-2.25-2.25a.75.75 0 010-1.06l2.25-2.25z" /></IconWrapper>,
    'Quality Gate #1': ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></IconWrapper>,
    'Agent 2.1': ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M2.25 12l8.954 8.955c.44.439 1.152.439 1.591 0L21.75 12M2.25 12h19.5" /></IconWrapper>,
    'Agent 2.2': ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></IconWrapper>,
    'Agent 2.3': ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" /></IconWrapper>,
    'Quality Gate #2': ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></IconWrapper>,
    'Agent 3.1': ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></IconWrapper>,
    'Agent 3.2': ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></IconWrapper>,
    'Agent 3.3': ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 013.388-1.62" /></IconWrapper>,
    'Agent 3.4': ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.465 2.547a.75.75 0 00-1.012-1.012L2.547 15.435a.75.75 0 000 1.012l.001.001a.75.75 0 001.012 0L16.465 2.547zM21.75 8.25a.75.75 0 00-1.06-1.06l-4.25 4.25a.75.75 0 000 1.06l4.25 4.25a.75.75 0 001.06-1.06L18.06 12l3.69-3.75zM8.25 21.75a.75.75 0 001.06 1.06l4.25-4.25a.75.75 0 000-1.06L9.31 13.25a.75.75 0 00-1.06 1.06L11.94 18l-3.69 3.75z" /></IconWrapper>,
    'Quality Gate #3': ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></IconWrapper>,
    'End': ({ className }) => <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>,
};

const nodeLayout: Record<string, { x: number, y: number, name: string, agents: string[] }> = {
    'Start': { x: 475, y: 30, name: 'Start', agents: ['start_node'] },
    'M1A1': { x: 150, y: 120, name: 'Image Analysis', agents: ['Agent 1.1'] },
    'M1A2': { x: 350, y: 120, name: 'Concept Extract', agents: ['Agent 1.2'] },
    'M1A3': { x: 250, y: 220, name: 'Vision Synthesizer', agents: ['Agent 1.3'] },
    'QG1': { x: 475, y: 220, name: 'Quality Gate #1', agents: ['Quality Gate #1'] },
    'M2A1': { x: 150, y: 360, name: 'Story Architect', agents: ['Agent 2.1'] },
    'M2A2': { x: 350, y: 360, name: 'Emotional Arc', agents: ['Agent 2.2'] },
    'M2A3': { x: 550, y: 360, name: 'Theme & Symbolism', agents: ['Agent 2.3'] },
    'QG2': { x: 750, y: 360, name: 'Quality Gate #2', agents: ['Quality Gate #2'] },
    'M3A1': { x: 150, y: 500, name: 'Character Design', agents: ['Agent 3.1'] },
    'M3A2': { x: 350, y: 500, name: 'World Design', agents: ['Agent 3.2'] },
    'M3A3': { x: 550, y: 500, name: 'Color Script', agents: ['Agent 3.3'] },
    'M3A4': { x: 350, y: 600, name: 'Visual Continuity', agents: ['Agent 3.4'] },
    'QG3': { x: 550, y: 600, name: 'Quality Gate #3', agents: ['Quality Gate #3'] },
    'End': { x: 475, y: 700, name: 'End', agents: ['end_node'] },
};

const moduleLayout: Record<string, { x: number, y: number, w: number, h: number, title: string, color: string }> = {
    'M1': { x: 50, y: 80, w: 575, h: 220, title: 'Module 1: Intake & Analysis', color: 'stroke-rose-300' },
    'M2': { x: 50, y: 320, w: 850, h: 120, title: 'Module 2: Creative Foundation', color: 'stroke-sky-300' },
    'M3': { x: 50, y: 460, w: 850, h: 220, title: 'Module 3: Visual Design', color: 'stroke-orange-300' },
};

const edges = [
    { from: 'Start', to: 'M1A1', type: 'line' }, { from: 'Start', to: 'M1A2', type: 'line' },
    { from: 'M1A1', to: 'M1A3', type: 'elbow' }, { from: 'M1A2', to: 'M1A3', type: 'elbow' },
    { from: 'M1A3', to: 'QG1', type: 'line' },
    { from: 'QG1', to: 'M2A1', type: 'line' }, { from: 'QG1', to: 'M2A2', type: 'line' }, { from: 'QG1', to: 'M2A3', type: 'line' },
    { from: 'M2A1', to: 'QG2', type: 'elbow' }, { from: 'M2A2', to: 'QG2', type: 'elbow' }, { from: 'M2A3', to: 'QG2', type: 'elbow' },
    { from: 'QG2', to: 'M3A1', type: 'line' }, { from: 'QG2', to: 'M3A2', type: 'line' }, { from: 'QG2', to: 'M3A3', type: 'line' },
    { from: 'M3A1', to: 'M3A4', type: 'elbow' }, { from: 'M3A2', to: 'M3A4', type: 'elbow' }, { from: 'M3A3', to: 'M3A4', type: 'elbow' },
    { from: 'M3A4', to: 'QG3', type: 'line' },
    { from: 'QG3', to: 'End', type: 'line' },
];

const getEdgePath = (fromKey: string, toKey: string, type: string): string => {
    const fromNode = nodeLayout[fromKey];
    const toNode = nodeLayout[toKey];
    const startX = fromNode.x + 20;
    const startY = fromNode.y + 40;
    const endX = toNode.x + 20;
    const endY = toNode.y;
    
    if (type === 'elbow') {
        const midY = startY + (endY - startY) / 2;
        return `M ${startX},${startY} L ${startX},${midY} L ${endX},${midY} L ${endX},${endY}`;
    }
    return `M ${startX},${startY} L ${endX},${endY}`;
};

const PipelineGraph: React.FC<PipelineGraphProps> = ({ agentStatuses }) => {
    const getGroupStatus = (agents: string[], nodeKey: string): AgentStatus => {
        if (nodeKey === 'Start') return 'success';
        if (nodeKey === 'End') {
            return agentStatuses['Quality Gate #3'] === 'success' ? 'success' : 'pending';
        }
        if (agents[0] === 'start_node' || agents[0] === 'end_node') return 'pending';
        return agentStatuses[agents[0]] || 'pending';
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pipeline Execution Map</h3>
            <div className="w-full overflow-x-auto pb-4">
                <svg width="950" height="750" viewBox="0 0 950 750">
                    <defs>
                        {Object.entries(statusStyles).map(([status, style]) => (
                            <marker key={status} id={`arrowhead-${status}`} markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill={style.arrow} />
                            </marker>
                        ))}
                    </defs>

                    {Object.values(moduleLayout).map(mod => (
                        <g key={mod.title}>
                            <rect x={mod.x} y={mod.y} width={mod.w} height={mod.h} rx="12" className={`fill-gray-50/50 ${mod.color}`} strokeWidth="2" />
                            <text x={mod.x + 15} y={mod.y + 25} className="font-semibold text-gray-600 text-sm">{mod.title}</text>
                        </g>
                    ))}

                    {edges.map(({ from, to, type }) => {
                        const fromStatus = getGroupStatus(nodeLayout[from].agents, from);
                        const style = statusStyles[fromStatus];
                        const path = getEdgePath(from, to, type);
                        return <path key={`${from}-${to}`} d={path} className={`${style.line} stroke-2 transition-all fill-none`} markerEnd={`url(#arrowhead-${fromStatus})`} />;
                    })}

                    {Object.entries(nodeLayout).map(([key, node]) => {
                        const status = getGroupStatus(node.agents, key);
                        const style = statusStyles[status];
                        const Icon = agentIcons[node.agents[0]] || agentIcons[key];
                        return (
                            <g key={key} transform={`translate(${node.x}, ${node.y})`}>
                                <Icon className={style.icon} />
                                <text x="20" y="55" textAnchor="middle" className={`${style.text} text-xs`}>
                                    {node.name.split(' ').map((word, i) => (
                                        <tspan key={i} x="20" dy={i > 0 ? '1.2em' : 0}>{word}</tspan>
                                    ))}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default PipelineGraph;
