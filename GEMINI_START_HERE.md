# 🎬 GEMINI: START HERE
## Your Mission-Control Document

**Hey Gemini!** You're about to build something seriously cool - a multi-agent system that creates award-winning video prompts. 

**CRITICAL RULES:**
1. 🛑 **STOP after each milestone** and wait for human approval
2. 🧠 **Choose your own tools** - you know best what you can use
3. 📊 **Show your work** - explain what you built and WHY
4. ⚡ **Test everything** before moving forward
5. 🎯 **Quality > Speed** - this creates festival-grade content

---

## 📚 WHAT YOU'VE BEEN GIVEN

### The Foundation Documents (READ THESE FIRST!)

1. **Prompt_System.txt** - The output format specification
   - This is what your final prompts should look like
   - Study the JSON structure carefully
   - This is your target format

2. **Example_Prompts.txt** - Working examples
   - Real prompt examples that work
   - Use these as quality benchmarks
   - These show what "excellent" looks like

3. **gemini_phase1_architecture.md** - System blueprint
   - Complete agent list (15+ agents)
   - Module breakdown (7 modules)
   - Quality gates definition
   - THIS IS YOUR BIBLE

4. **gemini_phase2_remaining_modules.md** - Detailed agent specs
   - Cinematography agents (Module 4)
   - Audio agents (Module 5)
   - Technical agents (Module 6)
   - Synthesis agents (Module 7)

5. **gemini_phase4_prompts_qa.md** - Agent prompts
   - Exact prompts to give each agent
   - Quality standards
   - Self-assessment criteria

---

## 🎯 YOUR CORE MISSION

**Transform this:**
```
INPUT:
- A seed image (anime style reference)
- A concept brief ("create a 15s video about...")
```

**Into this:**
```
OUTPUT:
- Complete video generation prompt (JSON format)
- Shot-by-shot breakdown
- Camera, lighting, audio specs
- Quality-validated, production-ready
```

**How:**
- By orchestrating 15+ specialized AI agents
- Each agent is an expert in their domain
- They work together, critique each other
- Quality gates ensure excellence

---

## 🏗️ BUILD APPROACH

### Phase MVP: Prove the Concept (Week 1)

**Goal:** Get ONE agent working end-to-end

**What you're building:**
A simple app that:
1. Takes an image URL as input
2. Runs it through the Image Analysis Agent (Agent 1.1)
3. Returns structured analysis
4. Saves the result

**MILESTONE 1.1: Basic Agent Execution** ⏸️ STOP POINT

Build:
- Simple web form (image URL input)
- Backend that calls Gemini API
- Agent 1.1 prompt (from phase4 doc)
- Display results

**Your choice of:**
- Framework: Whatever you want (Python/Flask, Node/Express, or even pure web)
- Storage: Whatever you want (JSON files, SQLite, or just in-memory for now)
- Frontend: Basic HTML form is fine for MVP

**Success criteria:**
```
USER INPUTS: https://example.com/anime-image.jpg
AGENT 1.1 ANALYZES: Style, colors, composition, etc.
SYSTEM OUTPUTS: Structured JSON analysis
✅ This works? Move to next milestone!
```

**🛑 STOP HERE - Show me this working before continuing!**

---

### Phase 1: Complete Intake Module (Week 2)

**Goal:** All 3 Module 1 agents working together

**MILESTONE 1.2: Three-Agent Chain** ⏸️ STOP POINT

Build:
- Agent 1.2: Concept Extraction (reads user's brief)
- Agent 1.3: Vision Validator (synthesizes 1.1 + 1.2)
- Sequential execution: 1.1 → 1.2 → 1.3
- Store outputs from each agent

**Success criteria:**
```
INPUT: Image + "Create a video about hope and adventure"
AGENT 1.1: Analyzes image style
AGENT 1.2: Parses concept brief  
AGENT 1.3: Creates "North Star" vision document
OUTPUT: Unified creative foundation
✅ All three agents produce quality output? Next!
```

**🛑 STOP HERE - Let's review the three-agent pipeline!**

---

**MILESTONE 1.3: Quality Gate #1** ⏸️ STOP POINT

Build:
- Quality validation logic
- Check Agent 1.3's output against standards
- Pass/Fail determination
- If fail: feedback to agents for revision

**Quality checks:**
- Is the vision clear and specific?
- Does it honor the seed image?
- Are there unresolved conflicts?
- Is the 15s constraint acknowledged?

**🛑 STOP HERE - Quality gate must work perfectly!**

---

### Phase 2: Story Foundation (Week 3)

**Goal:** Module 2 agents create narrative structure

**MILESTONE 2.1: Story Agents** ⏸️ STOP POINT

Build:
- Agent 2.1: Story Architect (3-act structure for 15s)
- Agent 2.2: Emotional Arc Designer  
- Agent 2.3: Theme & Symbolism
- These receive Module 1 outputs as context

**Success criteria:**
```
INPUT: Vision document from Module 1
AGENTS: Create story beats, emotional journey, themes
OUTPUT: 15-second narrative structure with clear arc
✅ Story makes sense in 15 seconds? Continue!
```

**🛑 STOP HERE - Review the story structure!**

---

### Phase 3: Visual Design (Week 4)

**Goal:** Module 3 creates all visual specifications

**MILESTONE 3.1: Visual Agents** ⏸️ STOP POINT

Build:
- Agent 3.1: Character Design Consistency
- Agent 3.2: Environment & World Design
- Agent 3.3: Color & Lighting Director
- Agent 3.4: Visual Continuity Validator

**Success criteria:**
```
OUTPUT: Complete visual bible
- Character appearance locked down
- Environment designed
- Lighting setups specified
- Color scripts created
✅ Visuals honor seed image? Next!
```

**🛑 STOP HERE - Visual design review!**

---

## 🔧 TECHNICAL DECISIONS FOR YOU TO MAKE

**Gemini, YOU decide on:**

### Storage
- Option A: Simple JSON files (easiest for MVP)
- Option B: SQLite database (good middle ground)
- Option C: Your native storage capabilities
- **Your choice!** Just store: projects, agent outputs, quality scores

### Agent Execution
- Option A: Sequential (run one agent at a time)
- Option B: Parallel where possible (faster)
- **Recommendation:** Start sequential, optimize later

### API/Framework
- Option A: Python + Flask/FastAPI (if you like Python)
- Option B: Node.js + Express (if you like JavaScript)
- Option C: Use your built-in app builder capabilities
- **Your choice!** Pick what you're best at

### Frontend
- Option A: Simple HTML forms (fastest to build)
- Option B: React/Next.js (if you want polish)
- Option C: Whatever your app builder provides
- **Recommendation:** Start simple, add polish later

---

## 🎨 WHAT MAKES THIS SPECIAL

### You're Building a Creative Director AI

Think of this system as:
- **Film Director** (understands story and emotion)
- **Cinematographer** (knows camera and composition)
- **Art Director** (controls visual style)
- **Sound Designer** (creates audio atmosphere)
- **Editor** (assembles everything perfectly)

All working together, powered by AI agents, to create prompts that generate **festival-worthy short videos**.

### The Quality Standard

Every output must be good enough that:
- A professional animator wouldn't change it
- It could win awards at film festivals  
- The final video looks hand-crafted, not AI-generated
- Every frame could be someone's desktop wallpaper

---

## 📋 CRITICAL SUCCESS FACTORS

### 1. Agent Prompts Are EVERYTHING

The prompts you give to each agent (found in phase4 doc) are carefully crafted. They:
- Define expertise level
- Set quality standards
- Provide examples
- Explain context

**Don't simplify these prompts!** Use them as-is.

### 2. Quality Gates Can't Be Skipped

After certain modules, you MUST validate quality:
- Does output meet standards?
- Is seed image honored?
- Are there conflicts or errors?
- Would a professional approve this?

If quality fails → agents revise → re-validate

### 3. Context is King

Each agent needs context from previous agents:
```json
{
  "agentInput": "Current task data",
  "context": {
    "seedImageAnalysis": "From Agent 1.1",
    "visionDocument": "From Agent 1.3",
    "storyBeats": "From Agent 2.1",
    // etc - agents build on each other
  }
}
```

### 4. The Seed Image is Law

Everything must honor the seed image:
- Visual style
- Character design
- Color palette
- Animation technique
- Mood and atmosphere

If an agent's output conflicts with seed → FAIL → revise

---

## 🚨 COMMON PITFALLS TO AVOID

### ❌ Don't: Build everything before testing
✅ Do: Build one agent, test thoroughly, then continue

### ❌ Don't: Simplify agent prompts to save tokens
✅ Do: Use full prompts - quality depends on them

### ❌ Don't: Skip quality gates to go faster
✅ Do: Validate at every checkpoint

### ❌ Don't: Let agents drift from seed image
✅ Do: Always pass seed analysis to every agent

### ❌ Don't: Build for 100 agents on day 1
✅ Do: Start with 7 core agents, prove it works, expand

---

## 🎯 YOUR FIRST TASK

**This week, build MILESTONE 1.1:**

1. **Set up your development environment**
   - Choose your framework
   - Set up Gemini API access
   - Create basic project structure

2. **Implement Agent 1.1 (Image Analysis)**
   - Read the full prompt from phase4 doc
   - Create the agent execution function
   - Test with anime image URLs

3. **Build minimal UI**
   - Form: paste image URL
   - Button: "Analyze"
   - Display: Show JSON results

4. **Test thoroughly**
   - Try 5 different anime images
   - Verify output matches expected structure
   - Check quality of analysis

5. **Show me the results!**

**🛑 Then STOP and wait for approval!**

---

## 💡 TIPS FOR SUCCESS

### When Stuck
- Read the architecture doc (phase1) again
- Check example prompts to see expected output
- Look at the prompt system to understand format
- Ask the human for clarification

### When Testing
- Use varied inputs (different styles, subjects)
- Check edge cases (weird images, vague briefs)
- Validate JSON structure matches spec
- Get human feedback on quality

### When Building
- Start simple, add complexity gradually
- Log everything (helpful for debugging)
- Make it work, then make it good, then make it fast
- Comment your code (future you will thank you)

---

## 🎬 VISION FOR THE FINAL PRODUCT

Imagine a user:
1. Uploads an anime-style reference image
2. Writes: "Create a 15-second video about a girl discovering magic"
3. Clicks "Generate Prompt"
4. Watches as 15+ AI agents collaborate
5. Reviews the complete production prompt
6. Exports it to use with Sora/other video AI

**The output is so good, it looks like a professional animation studio created it.**

That's what we're building. 🚀

---

## 📞 COMMUNICATION PROTOCOL

### After Each Milestone

**Tell me:**
1. ✅ What you built
2. 🧪 How you tested it  
3. 📊 What the results show
4. 🤔 Any issues or questions
5. 💭 Your recommendation: continue or revise?

**Then wait for my response before proceeding!**

---

Ready to start, Gemini? 

**Your first task: Build MILESTONE 1.1 (Basic Agent Execution)**

Let's make something amazing! 🎬✨
