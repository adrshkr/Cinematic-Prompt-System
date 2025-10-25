# 📖 Migration Guide: v1 → v2

**Target Audience:** Developers working on the Cinematic Prompt System
**Estimated Migration Time:** 4-6 hours
**Breaking Changes:** Yes (state management, pipeline execution)

---

## Overview

This guide will help you migrate from the old architecture (v1) to the new production-grade architecture (v2).

---

## Pre-Migration Checklist

- [ ] Read `NEW_ARCHITECTURE.md`
- [ ] Read `ARCHITECTURE_AUDIT.md`
- [ ] Backup current code
- [ ] Ensure all dependencies are installed (`npm install`)
- [ ] Review breaking changes below

---

## Breaking Changes

### 1. State Management

**Old:**
```typescript
// App.tsx
const [imageAnalysis, setImageAnalysis] = useState(null);
const [conceptAnalysis, setConceptAnalysis] = useState(null);
// ... 26 more state variables

<SeedAnalyzer
  imageAnalysis={imageAnalysis}
  setImageAnalysis={setImageAnalysis}
  conceptAnalysis={conceptAnalysis}
  setConceptAnalysis={setConceptAnalysis}
  // ... 26 more props
/>
```

**New:**
```typescript
// App.tsx
import { usePipelineStore } from './lib/store/pipeline-store';

// No more individual state variables!

<SeedAnalyzer />  // No props needed
```

**In SeedAnalyzer.tsx:**
```typescript
import { usePipelineStore } from '../lib/store/pipeline-store';

const SeedAnalyzer = () => {
  const { outputs, setAgentOutput, seedImage, setSeedImage } = usePipelineStore();

  // Access any output
  console.log(outputs.imageAnalysis);

  // Update any output
  setAgentOutput('imageAnalysis', result);
};
```

### 2. Pipeline Execution

**Old:**
```typescript
import { executePipeline } from './services/pipelineService';

await executePipeline(
  { seedImage, conceptBrief },
  {
    setImageAnalysis,
    setConceptAnalysis,
    // ... 26 more setters
    setIsPipelineRunning,
    setError,
    setAgentStatuses,
    setOpenModules,
  },
  { useCache: true }
);
```

**New:**
```typescript
import { PipelineOrchestratorV2 } from './services/pipeline-orchestrator-v2';
import { usePipelineStore } from './lib/store/pipeline-store';

const orchestrator = new PipelineOrchestratorV2(
  {
    parallelExecution: true,
    maxParallelAgents: 3,
    useCache: true,
  },
  {
    onAgentComplete: (name, output) => {
      usePipelineStore.getState().setAgentOutput(name, output);
    },
    // ... other callbacks
  }
);

const result = await orchestrator.execute({
  seedImage: usePipelineStore.getState().seedImage,
  conceptBrief: usePipelineStore.getState().conceptBrief,
});
```

### 3. Error Handling

**Old:**
```typescript
try {
  const output = await agent.run(input);
  return output;
} catch (error) {
  throw error; // Uncaught
}
```

**New:**
```typescript
import { tryCatchAsync, Result } from './lib/utils/result';

const result = await tryCatchAsync(() => agent.run(input));

result.match({
  ok: (output) => handleSuccess(output),
  error: (err) => handleError(err),
});
```

### 4. Logging

**Old:**
```typescript
console.log('Agent started:', agentName);
console.error('Agent failed:', error);
```

**New:**
```typescript
import { logger } from './lib/infrastructure/logger';

logger.agentStart(agentName, agentVersion, { projectId });
logger.agentError(agentName, error, { context });
```

---

## Step-by-Step Migration

### Step 1: Install Dependencies

```bash
npm install zustand
```

All other new infrastructure uses existing dependencies.

### Step 2: Initialize Application

**File:** `index.tsx`

```typescript
// Add at the top, before rendering
import { initializeApplication } from './lib/infrastructure/bootstrap';

initializeApplication();

// Then render app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Step 3: Update App.tsx

**Before:**
```typescript
// App.tsx (180 lines of state management)
const [seedImage, setSeedImage] = useState(null);
const [conceptBrief, setConceptBrief] = useState('');
// ... 26 more useState hooks

return (
  <SeedAnalyzer
    seedImage={seedImage}
    setSeedImage={setSeedImage}
    // ... 54 more props
  />
);
```

**After:**
```typescript
// App.tsx (clean!)
import { ModuleErrorBoundary } from './components/ErrorBoundary';
import { usePipelineStore } from './lib/store/pipeline-store';

const App = () => {
  const [currentMode, setCurrentMode] = useState(AgentMode.SeedAnalyzer);
  const [theme, toggleTheme] = useDarkMode();

  // That's it! All state is in Zustand now

  return (
    <div className="min-h-screen">
      <ModuleErrorBoundary moduleName="Main App">
        {/* ... existing UI ... */}
        {currentMode === AgentMode.SeedAnalyzer && <SeedAnalyzer />}
      </ModuleErrorBoundary>
    </div>
  );
};
```

### Step 4: Update SeedAnalyzer.tsx

**Before:**
```typescript
interface SeedAnalyzerProps {
  seedImage: string | null;
  setSeedImage: (value: string | null) => void;
  conceptBrief: string;
  setConceptBrief: (value: string) => void;
  // ... 50 more props
}

const SeedAnalyzer: React.FC<SeedAnalyzerProps> = (props) => {
  const { seedImage, setSeedImage, /* ... */ } = props;
  // ...
};
```

**After:**
```typescript
// No props interface needed!

const SeedAnalyzer: React.FC = () => {
  const {
    seedImage,
    setSeedImage,
    conceptBrief,
    setConceptBrief,
    outputs,
    setAgentOutput,
    isPipelineRunning,
    setPipelineRunning,
  } = usePipelineStore();

  // Everything else stays the same
};
```

### Step 5: Update Pipeline Execution

**Create a new hook:** `hooks/usePipelineExecution.ts`

```typescript
import { PipelineOrchestratorV2 } from '../services/pipeline-orchestrator-v2';
import { usePipelineStore } from '../lib/store/pipeline-store';
import { logger } from '../lib/infrastructure/logger';

export function usePipelineExecution() {
  const store = usePipelineStore();

  const executePipeline = async () => {
    store.setPipelineRunning(true);
    store.setError(null);

    const orchestrator = new PipelineOrchestratorV2(
      {
        parallelExecution: true,
        maxParallelAgents: 3,
        useCache: true,
        stopOnQualityGateFailure: true,
      },
      {
        onAgentStart: (name) => {
          logger.agentStart(name, '1.0');
          store.setAgentStatus(name, { status: 'running', startTime: Date.now() });
        },
        onAgentComplete: (name, output) => {
          store.setAgentOutput(name as any, output);
          store.setAgentStatus(name, {
            status: 'success',
            endTime: Date.now(),
          });
        },
        onAgentError: (name, error) => {
          logger.agentError(name, error);
          store.setAgentStatus(name, {
            status: 'error',
            error: error.message,
          });
        },
        onProgress: (completed, total) => {
          store.updateProgress(completed, total);
        },
        onError: (error) => {
          store.setError(error);
        },
      }
    );

    const result = await orchestrator.execute({
      seedImage: store.seedImage,
      conceptBrief: store.conceptBrief,
    });

    result.match({
      ok: (outputs) => {
        logger.info('Pipeline completed successfully');
        store.setPipelineRunning(false);
      },
      error: (err) => {
        logger.error('Pipeline execution failed', {}, err);
        store.setError(err.message);
        store.setPipelineRunning(false);
      },
    });

    return result;
  };

  return { executePipeline };
}
```

**Then in SeedAnalyzer:**
```typescript
import { usePipelineExecution } from '../hooks/usePipelineExecution';

const SeedAnalyzer = () => {
  const { executePipeline } = usePipelineExecution();

  const handleGenerate = async () => {
    await executePipeline();
  };

  return (
    <button onClick={handleGenerate}>Generate</button>
  );
};
```

### Step 6: Add Error Boundaries

Wrap each major section:

```typescript
// In App.tsx or SeedAnalyzer.tsx
import { ModuleErrorBoundary } from './components/ErrorBoundary';

<ModuleErrorBoundary moduleName="Module 1: Intake & Analysis">
  <AccordionItem title="Module 1">
    {/* Module content */}
  </AccordionItem>
</ModuleErrorBoundary>
```

### Step 7: Add Environment Variables

**Create `.env.local`:**
```env
VITE_API_KEY=your_gemini_api_key_here
```

**Update vite.config.ts** (if needed):
```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  // ... existing config
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY),
  },
});
```

---

## Testing the Migration

### 1. Verify Initialization

```typescript
// In browser console
import { getDiagnostics } from './lib/infrastructure/bootstrap';

const diag = getDiagnostics();
console.log(diag);

// Should show:
// - Container registered services
// - Circuit breaker state (CLOSED)
// - Rate limiter stats
// - Cache stats
```

### 2. Test Pipeline Execution

```typescript
// Run a simple pipeline
const { executePipeline } = usePipelineExecution();
await executePipeline();

// Check outputs
const store = usePipelineStore.getState();
console.log(store.outputs);
```

### 3. Test Error Boundary

```typescript
// Throw an error in a component to test error boundary
throw new Error('Test error');

// Should see error UI, not white screen
```

### 4. Test Cache

```typescript
import { container, ServiceKeys } from './lib/infrastructure/di-container';

const cache = container.resolve(ServiceKeys.CACHE);
console.log(cache.getStats());

// Run pipeline twice, second should be faster (cache hits)
```

---

## Common Migration Issues

### Issue 1: "Cannot read property of undefined"

**Cause:** Trying to access Zustand store before initialization

**Solution:**
```typescript
// Ensure initializeApplication() is called in index.tsx
import { initializeApplication } from './lib/infrastructure/bootstrap';

initializeApplication();
```

### Issue 2: "Service not registered"

**Cause:** Trying to resolve service from container before bootstrap

**Solution:**
```typescript
// Make sure bootstrap.ts is imported and runs first
import './lib/infrastructure/bootstrap';
```

### Issue 3: Props type errors

**Cause:** Old component signatures with 50+ props

**Solution:**
```typescript
// Remove props interface entirely
// interface SeedAnalyzerProps { ... } ❌

// Use Zustand hooks instead
const SeedAnalyzer = () => {
  const store = usePipelineStore(); ✅
  // ...
};
```

### Issue 4: Pipeline not running in parallel

**Cause:** `parallelExecution: false` or not using v2 orchestrator

**Solution:**
```typescript
const orchestrator = new PipelineOrchestratorV2({
  parallelExecution: true, // ✅
  maxParallelAgents: 3,
});
```

---

## Rollback Plan

If migration fails, rollback:

```bash
# Revert to old code
git checkout main

# Or selectively disable new features
const orchestrator = new PipelineOrchestratorV2({
  parallelExecution: false,  // Use sequential execution
  useCache: false,           // Disable cache
});
```

---

## Post-Migration Checklist

- [ ] All components migrated to Zustand
- [ ] Error boundaries added
- [ ] Pipeline using PipelineOrchestratorV2
- [ ] initializeApplication() called in index.tsx
- [ ] Environment variables configured
- [ ] Logging works (check browser console)
- [ ] Cache working (second run faster)
- [ ] Circuit breaker configured
- [ ] No prop drilling remaining
- [ ] Error boundaries catch errors
- [ ] Parallel execution enabled
- [ ] Metrics collection working

---

## Performance Validation

After migration, verify improvements:

```typescript
import { getDiagnostics } from './lib/infrastructure/bootstrap';

// Run pipeline twice
await executePipeline(); // First run (cold cache)
const diag1 = getDiagnostics();

await executePipeline(); // Second run (warm cache)
const diag2 = getDiagnostics();

// Compare
console.log('First run metrics:', diag1.gemini);
console.log('Second run metrics:', diag2.gemini);
console.log('Cache stats:', diag2.cache);

// Expected:
// - Second run: 80%+ cache hit rate
// - Second run: 3-4x faster
// - Parallel execution: ~60s total (vs 180s sequential)
```

---

## Getting Help

If you encounter issues:

1. Check browser console for errors
2. Run `getDiagnostics()` and review output
3. Check `ARCHITECTURE_AUDIT.md` for known issues
4. Review `NEW_ARCHITECTURE.md` for patterns
5. Check logger output: `logger.getLogs()` (if using StorageLogHandler)

---

## Next Steps

After successful migration:

1. Add tests for new infrastructure
2. Monitor metrics in production
3. Optimize parallel execution batching
4. Add more observability dashboards
5. Consider implementing event bus for agent communication

---

**Migration Complete!** 🎉

Your app now has:
- ✅ Centralized state management
- ✅ Production-grade error handling
- ✅ Parallel pipeline execution
- ✅ Intelligent caching
- ✅ Circuit breaker protection
- ✅ Structured logging
- ✅ Comprehensive metrics

Enjoy your 3x faster, more resilient architecture!
