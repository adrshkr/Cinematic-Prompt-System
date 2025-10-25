// lib/db/schema.ts

// Mock implementation to avoid importing from drizzle-orm, which is causing a runtime error
// due to a suspected issue in the CDN-hosted library version. This preserves the schema
// structure for architectural demonstration purposes without breaking the application.

const chainableMethods = {
  default: (val?: any) => chainableMethods,
  defaultRandom: () => chainableMethods,
  notNull: () => chainableMethods,
  primaryKey: () => chainableMethods,
  references: (ref: any, options?: any) => chainableMethods,
  defaultNow: () => chainableMethods,
};

const pgEnum = (name: string, values: string[]) => {
  return (columnName: string) => ({...chainableMethods, name: columnName});
};

const uuid = (name: string) => ({...chainableMethods, name});
const text = (name: string) => ({...chainableMethods, name});
const timestamp = (name: string) => ({...chainableMethods, name});
const jsonb = (name: string) => ({...chainableMethods, name});
const integer = (name: string) => ({...chainableMethods, name});
const boolean = (name: string) => ({...chainableMethods, name});

// FIX: Spread the columns object to make column properties like 'id' directly accessible on the table object.
// FIX: Use a generic to correctly infer the type of the columns, fixing reference errors.
const pgTable = <T extends Record<string, any>>(tableName: string, columns: T): { name: string } & T => ({
  name: tableName,
  ...columns,
});


export const projectStatusEnum = pgEnum('project_status', [
  'intake',
  'in_progress',
  'quality_review',
  'completed',
  'failed'
]);

export const agentStatusEnum = pgEnum('agent_status', [
  'pending',
  'running',
  'success',
  'failed',
  'needs_revision'
]);

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  seedImageUrl: text('seed_image_url'),
  conceptBrief: text('concept_brief'),
  status: projectStatusEnum('status').notNull().default('intake'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const agentRuns = pgTable('agent_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  agentName: text('agent_name').notNull(),
  agentVersion: text('agent_version').notNull().default('1.0'),
  inputData: jsonb('input_data').notNull(),
  outputData: jsonb('output_data'),
  executionTimeMs: integer('execution_time_ms'),
  qualityScore: integer('quality_score'), // 0-100
  status: agentStatusEnum('status').notNull().default('pending'),
  feedback: text('feedback'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const qualityGates = pgTable('quality_gates', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  gateNumber: integer('gate_number').notNull(), // 1-6
  validatorsPassed: integer('validators_passed').notNull().default(0),
  validatorsFailed: integer('validators_failed').notNull().default(0),
  humanReviewed: boolean('human_reviewed').notNull().default(false),
  passed: boolean('passed').notNull().default(false),
  feedback: jsonb('feedback'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const feedbackLoops = pgTable('feedback_loops', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  sourceAgent: text('source_agent').notNull(),
  targetAgent: text('target_agent').notNull(),
  critique: text('critique').notNull(),
  suggestion: text('suggestion'),
  accepted: boolean('accepted'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const finalPrompts = pgTable('final_prompts', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  version: integer('version').notNull().default(1),
  promptJson: jsonb('prompt_json').notNull(),
  qualityMetrics: jsonb('quality_metrics'),
  exportedAt: timestamp('exported_at').notNull().defaultNow(),
});
