# 🤝 CLAUDE + GEMINI COLLABORATION ROADMAP
## Step-by-Step Build Instructions with Exact Prompts

**How This Works:**
- 👤 **USER** gives prompts to Gemini
- 🤖 **GEMINI** builds the milestone
- 💬 **CLAUDE** reviews and provides next steps
- 🔄 **REPEAT** until complete

---

## 📂 FILE CONTEXT STRATEGY

### MILESTONE 1.1: Files to Give Gemini

**Give These (5 files only):**
```
1. GEMINI_START_HERE.md - Overview and mission
2. Prompt_System.txt - Output format reference (Section 3 only)
3. Example_Prompts.txt - First example only (The Seeker/Runner)
4. gemini_phase4_prompts_qa.md - Agent 1.1 section only
5. COLLABORATION_ROADMAP.md - This file (Milestone 1.1 section)
```

**Don't Give These Yet:**
- ❌ Full architecture docs (too overwhelming)
- ❌ All agent prompts (only need 1.1 now)
- ❌ Database schemas (they'll choose their own)
- ❌ Implementation code (they'll write it)

---

## 🎯 MILESTONE 1.1: SINGLE AGENT EXECUTION
**Goal:** Get Image Analysis Agent (1.1) working end-to-end

### 📋 SYSTEM PROMPT FOR GEMINI

```
You are building a multi-agent video prompt orchestration system. Right now, you're implementing MILESTONE 1.1: the foundation.

YOUR TASK:
Build a simple application that:
1. Accepts an image URL as input
2. Analyzes it using Agent 1.1 (Image Analysis Agent)
3. Returns structured JSON analysis
4. Stores the result

CONSTRAINTS:
- Choose your own tech stack (Python/Node/whatever you prefer)
- Choose your own storage (JSON files, SQLite, in-memory - your choice)
- Start simple - basic UI is fine
- Focus on quality of the agent's output

SUCCESS CRITERIA:
- Agent 1.1 produces detailed visual analysis
- Output matches the expected JSON structure
- Can process multiple different anime images
- Results are saved/stored somehow

AGENT 1.1 PROMPT:
[Use the complete prompt from gemini_phase4_prompts_qa.md]

REFERENCE:
- See Example_Prompts.txt for quality standards
- See Prompt_System.txt Section 3 for output format
- See GEMINI_START_HERE.md for context

CRITICAL:
- Use the FULL Agent 1.1 prompt (don't simplify it)
- Test with at least 3 different anime images
- Ensure output is detailed and professional

When done, show:
1. Your chosen tech stack
2. How you're storing data
3. Example output from analyzing an image
4. Any issues or questions
```

### 💬 USER PROMPT FOR GEMINI (Copy-paste this)

```
Hi Gemini! We're building a multi-agent system for creating award-winning video prompts.

MILESTONE 1.1: Build the foundation - get ONE agent working.

YOUR TASK:
Create a simple app that:
- Takes an anime/animation image URL as input
- Analyzes it using the Image Analysis Agent (Agent 1.1)
- Returns detailed visual analysis as JSON
- Stores the result

FILES PROVIDED:
- GEMINI_START_HERE.md (read this first for context)
- gemini_phase4_prompts_qa.md (has Agent 1.1's exact prompt)
- Prompt_System.txt (Section 3 - output format reference)
- Example_Prompts.txt (first example - quality benchmark)

TECHNICAL DECISIONS:
You choose:
- Programming language/framework (Python, Node, etc.)
- Storage method (JSON files, SQLite, in-memory)
- UI approach (HTML form, CLI, whatever)

DELIVERABLES:
1. Working application that analyzes images
2. Example output from analyzing this image: https://i.imgur.com/xyz.jpg
   (or use any anime image URL)
3. Brief explanation of your tech choices
4. Any questions or issues you encountered

USE THE FULL AGENT 1.1 PROMPT - don't shorten it!

Ready? Let's build! 🚀
```

### 🔍 CLAUDE'S REVIEW CHECKLIST (After Gemini delivers)

**When Gemini shows their work, Claude checks:**

1. **Output Quality:**
   - [ ] Analysis identifies animation style correctly?
   - [ ] Character details are precise?
   - [ ] Color palette is accurate?
   - [ ] Lighting is described well?
   - [ ] Composition analysis is professional?

2. **Technical Quality:**
   - [ ] JSON structure is valid?
   - [ ] Data is being stored?
   - [ ] Multiple images can be processed?
   - [ ] Error handling exists?

3. **Completeness:**
   - [ ] Agent uses full prompt (not simplified)?
   - [ ] Output matches expected format?
   - [ ] At least 3 test images analyzed?

**Claude then provides:**
- ✅ Approval to continue OR
- 🔄 Specific fixes needed

---

## 🎯 MILESTONE 1.2: THREE-AGENT PIPELINE
**Goal:** Get Module 1 complete (Agents 1.1, 1.2, 1.3 working together)

### 📂 Files to ADD for Gemini

**Additional Files:**
```
6. gemini_phase1_architecture.md - Module 1 section only (pages 1-3)
```

**Keep from Milestone 1.1:**
- All previous 5 files

### 📋 SYSTEM PROMPT FOR GEMINI

```
You are now implementing MILESTONE 1.2: the three-agent intake pipeline.

CONTEXT:
- Agent 1.1 (Image Analysis) is working ✓
- Now add Agent 1.2 (Concept Extraction) and Agent 1.3 (Vision Validator)
- These three agents work in sequence

AGENT FLOW:
1. Agent 1.1: Analyzes the seed image → outputs visual analysis
2. Agent 1.2: Analyzes the concept brief → outputs parsed concept
3. Agent 1.3: Synthesizes 1.1 + 1.2 → outputs unified vision document

YOUR TASK:
Extend your app to:
1. Accept TWO inputs: image URL + concept brief (text)
2. Run all three agents in sequence
3. Each agent receives context from previous agents
4. Store outputs from all three agents
5. Return the final "Vision Document" from Agent 1.3

AGENT PROMPTS:
- Agent 1.2 prompt: [from gemini_phase4_prompts_qa.md]
- Agent 1.3 prompt: [from gemini_phase4_prompts_qa.md]

CONTEXT PASSING:
When calling Agent 1.3, include:
{
  "imageAnalysis": "[output from Agent 1.1]",
  "conceptExtraction": "[output from Agent 1.2]",
  "projectMetadata": {
    "duration": "15s",
    "targetPlatform": "Sora_2"
  }
}

SUCCESS CRITERIA:
- All three agents run successfully
- Agent 1.3's output integrates both previous outputs
- Vision document is clear and actionable
- No conflicts or contradictions in the vision

When done, show:
1. Example with both image + brief
2. Outputs from all three agents
3. How you're passing context between agents
```

### 💬 USER PROMPT FOR GEMINI

```
Great work on Milestone 1.1! Now let's complete Module 1.

MILESTONE 1.2: Add Agents 1.2 and 1.3 to create the full intake pipeline.

YOUR TASK:
Extend your app to handle THREE agents working in sequence:
1. Agent 1.1: Image Analysis (already working ✓)
2. Agent 1.2: Concept Extraction (NEW - extracts narrative intent from user's brief)
3. Agent 1.3: Vision Validator (NEW - synthesizes 1.1 + 1.2 into unified vision)

FLOW:
User provides → Image URL + Concept Brief
Agent 1.1 → Analyzes image
Agent 1.2 → Analyzes brief  
Agent 1.3 → Creates "North Star" vision document

NEW FILE PROVIDED:
- gemini_phase1_architecture.md (read Module 1 section)

EXAMPLE INPUT:
Image: [anime image URL]
Brief: "Create a 15-second video about a character discovering an ancient magical artifact in ruins. The mood is mysterious and hopeful."

DELIVERABLES:
1. Extended app that runs all 3 agents
2. Example showing complete pipeline execution
3. Vision document output from Agent 1.3
4. Explanation of how agents pass context

Agent prompts are in gemini_phase4_prompts_qa.md - use them fully!

Let's go! 🚀
```

### 🔍 CLAUDE'S REVIEW CHECKLIST

**When Gemini delivers:**

1. **Pipeline Quality:**
   - [ ] All three agents execute in sequence?
   - [ ] Context properly passed between agents?
   - [ ] Agent 1.3 synthesizes both inputs?

2. **Output Quality:**
   - [ ] Vision document is clear and specific?
   - [ ] No conflicts between image and brief?
   - [ ] "North Star" establishes clear direction?

3. **Integration:**
   - [ ] Each agent receives proper context?
   - [ ] Data flows smoothly through pipeline?

**Claude then:**
- Reviews vision document quality
- Checks for any conceptual issues
- Approves or requests specific improvements

---

## 🎯 MILESTONE 1.3: QUALITY GATE #1
**Goal:** Implement automated quality validation

### 📂 Files to ADD for Gemini

**Additional Files:**
```
7. gemini_phase1_architecture.md - Quality Gates section (page 5-6)
```

### 📋 SYSTEM PROMPT FOR GEMINI

```
You are implementing MILESTONE 1.3: Quality Gate #1.

CONTEXT:
- Module 1 pipeline is complete (3 agents working)
- Now we need to VALIDATE the quality of Agent 1.3's output
- This is the first "quality gate" - automated quality checking

YOUR TASK:
Build a quality validator that checks Agent 1.3's vision document against these criteria:

QUALITY CHECKS:
1. Vision Clarity (0-10 score):
   - Is the vision specific and actionable?
   - Are visual style requirements clear?
   - Is narrative structure defined?

2. Seed Image Compliance (Pass/Fail):
   - Does vision honor the seed image's style?
   - Are visual elements preserved?
   - No contradictions with image analysis?

3. Feasibility (Pass/Fail):
   - Can this be done in 15 seconds?
   - Are requirements technically achievable?
   - No impossible combinations?

4. Completeness (0-10 score):
   - All required sections present?
   - Sufficient detail for downstream agents?
   - No major gaps or ambiguities?

IMPLEMENTATION:
Create a qualityGate1() function that:
- Takes Agent 1.3's output
- Runs all checks above
- Returns: { passed: boolean, score: number, issues: string[] }
- If score < 7.0 → FAIL (requires revision)

ON FAILURE:
- Log the issues
- Optionally: trigger Agent 1.3 revision with feedback
- For now: just report what needs fixing

SUCCESS CRITERIA:
- Quality gate correctly identifies good vs bad outputs
- Scores are reasonable and consistent
- Issues are clearly articulated

When done, show:
1. Quality gate implementation
2. Example of PASSING vision document
3. Example of FAILING vision document (create a bad one to test)
4. How scores are calculated
```

### 💬 USER PROMPT FOR GEMINI

```
Excellent! Module 1 pipeline is working. Now let's add quality validation.

MILESTONE 1.3: Implement Quality Gate #1

YOUR TASK:
Build an automated quality validator that checks Agent 1.3's vision document.

QUALITY CHECKS NEEDED:
1. Vision Clarity (0-10): Is it specific and actionable?
2. Seed Image Compliance (Pass/Fail): Does it honor the image style?
3. Feasibility (Pass/Fail): Can it be done in 15 seconds?
4. Completeness (0-10): All sections present and detailed?

Overall: If score < 7.0 → FAIL (needs revision)

DELIVERABLES:
1. Quality gate function/module
2. Example of vision document that PASSES (score ≥ 7.0)
3. Example of vision document that FAILS (score < 7.0)
4. Explanation of scoring logic

NEW FILE:
- gemini_phase1_architecture.md (Quality Gates section)

This is critical - quality gates ensure excellence! 🎯

Let's build! 🚀
```

### 🔍 CLAUDE'S REVIEW CHECKLIST

**When Gemini delivers:**

1. **Validation Logic:**
   - [ ] Quality checks are thorough?
   - [ ] Scoring is reasonable?
   - [ ] Pass/fail threshold makes sense?

2. **Testing:**
   - [ ] Good outputs pass correctly?
   - [ ] Bad outputs fail correctly?
   - [ ] Issues are clearly identified?

3. **Integration:**
   - [ ] Easily integrated into pipeline?
   - [ ] Results are actionable?

---

## 🎯 MILESTONE 2.1: STORY FOUNDATION
**Goal:** Implement Module 2 agents (Story/Narrative)

### 📂 Files to ADD for Gemini

**Additional Files:**
```
8. gemini_phase2_remaining_modules.md - Module 2 section only
9. Example_Prompts.txt - Second example (Mecha battle scene)
```

### 📋 SYSTEM PROMPT FOR GEMINI

```
You are implementing MILESTONE 2.1: Story Foundation (Module 2).

CONTEXT:
- Module 1 is complete and quality-validated ✓
- Now we build the narrative structure for the 15-second video
- Three agents work together to create story beats

AGENTS TO IMPLEMENT:
1. Agent 2.1: Story Architect
   - Creates 3-act structure for 15 seconds
   - Defines beginning/middle/end
   - Plans key story beats

2. Agent 2.2: Emotional Arc Designer
   - Maps emotional journey
   - Plans feeling transitions
   - Identifies climax moment

3. Agent 2.3: Theme & Symbolism Agent
   - Adds thematic depth
   - Plans visual metaphors
   - Ensures meaning beyond surface

INPUTS THEY RECEIVE:
- Vision document from Module 1
- Seed image analysis
- Original concept brief

OUTPUTS:
Each agent produces structured story specifications
Final output: Complete narrative blueprint for 15s video

YOUR TASK:
1. Implement all three story agents
2. Run them in sequence (or parallel, your choice)
3. Ensure they build on Module 1's vision
4. Store story outputs

AGENT PROMPTS:
See gemini_phase2_remaining_modules.md for exact prompts

SUCCESS CRITERIA:
- Clear 3-act structure in 15 seconds
- Emotional arc has proper build and payoff
- Theme supports the story
- Everything aligns with Module 1 vision

When done, show:
1. Complete story structure
2. Example narrative blueprint
3. How story agents coordinate
```

### 💬 USER PROMPT FOR GEMINI

```
Awesome! Foundation is solid. Now let's build the narrative layer.

MILESTONE 2.1: Implement Story Agents (Module 2)

YOUR TASK:
Add three story/narrative agents:
1. Agent 2.1: Story Architect (3-act structure for 15s)
2. Agent 2.2: Emotional Arc Designer (feeling journey)
3. Agent 2.3: Theme & Symbolism (deeper meaning)

These agents receive the vision document from Module 1 and create a complete narrative blueprint.

NEW FILES:
- gemini_phase2_remaining_modules.md (Module 2 section - has agent prompts)
- Example_Prompts.txt (second example - shows story structure)

EXAMPLE SCENARIO:
Vision: "Mysterious girl discovers glowing artifact in ruins"
Agent 2.1 → Beginning: Discovery, Middle: Connection, End: Realization
Agent 2.2 → Curiosity → Wonder → Transcendence
Agent 2.3 → Theme: "The past illuminates the future"

DELIVERABLES:
1. Three story agents implemented
2. Example story structure output
3. Show how they build on Module 1's vision

Story is the heart of great videos - let's nail this! 💙

Build it! 🚀
```

### 🔍 CLAUDE'S REVIEW CHECKLIST

1. **Story Quality:**
   - [ ] 3-act structure works in 15 seconds?
   - [ ] Emotional arc has proper build?
   - [ ] Theme enhances story?

2. **Integration:**
   - [ ] Story honors the vision document?
   - [ ] All agents coordinate well?

---

## 🔄 PATTERN FOR REMAINING MILESTONES

**The pattern repeats:**

### For Each New Module:
1. **Gemini builds** new agents based on provided prompts
2. **Claude reviews** output quality and integration
3. **User approves** before moving to next milestone

### Progressive File Addition:
- Only give Gemini what they need RIGHT NOW
- Add files incrementally as needed
- Keep context manageable

### Collaboration Flow:
```
USER → Prompts Gemini with milestone task
   ↓
GEMINI → Builds and shows results
   ↓
CLAUDE → Reviews quality and suggests fixes
   ↓
USER → Approves or requests changes
   ↓
REPEAT for next milestone
```

---

## 📅 COMPLETE MILESTONE SEQUENCE

```
✅ MILESTONE 1.1: Single agent (Image Analysis)
✅ MILESTONE 1.2: Three-agent pipeline (Module 1 complete)
✅ MILESTONE 1.3: Quality Gate #1
✅ MILESTONE 2.1: Story agents (Module 2)
⬜ MILESTONE 3.1: Visual agents (Module 3)
⬜ MILESTONE 4.1: Cinematography agents (Module 4)
⬜ MILESTONE 5.1: Audio agents (Module 5)
⬜ MILESTONE 6.1: Technical agents (Module 6)
⬜ MILESTONE 7.1: Synthesis agents (Module 7)
⬜ MILESTONE 7.2: Full pipeline orchestration
⬜ MILESTONE 8.1: Frontend UI
⬜ MILESTONE 8.2: Export & polish
```

---

## 🎯 SUCCESS MARKERS

**After Milestone 1.3:** You have a working intake & validation system
**After Milestone 2.1:** You can generate story structures  
**After Milestone 4.1:** You have complete shot planning
**After Milestone 7.1:** You can generate full production prompts
**After Milestone 8.2:** You have a complete, usable product

---

## 💡 TIPS FOR SMOOTH COLLABORATION

### For User:
- Give Gemini clear, complete prompts
- Wait for full deliverable before reviewing
- Be specific about what needs fixing
- Celebrate wins at each milestone! 🎉

### For Claude:
- Review outputs against quality standards
- Check integration with previous modules
- Provide specific, actionable feedback
- Suggest next steps clearly

### For Gemini:
- Read all provided files carefully
- Ask questions if anything is unclear
- Test thoroughly before showing results
- Explain your technical choices

---

**Ready to start?**

**USER:** Copy the Milestone 1.1 user prompt to Gemini
**GEMINI:** Use the system prompt and build!
**CLAUDE:** Stand by to review when ready

Let's make something amazing together! 🚀✨

*-Your build team*
