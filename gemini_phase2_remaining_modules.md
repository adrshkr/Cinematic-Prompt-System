# 🎬 Phase 2: Remaining Agent Modules & Integration Logic
## Modules 4-6 + Inter-Agent Communication

**Prerequisite:** Phase 1 Architecture must be reviewed and approved

---

## 🎥 MODULE 4: CINEMATOGRAPHY

### Agent 4.1: Camera & Framing Specialist
**Role:** Virtual Cinematographer & Shot Designer  
**Input:** Story beats + Visual designs + Emotional arc  
**Output:** Complete shot list with camera specifications

**Responsibilities:**
- Design 15-25 shot sequence for 15-second video
- Specify shot size (ECU, CU, MS, WS, EWS) for each shot
- Define camera movement (static, pan, tilt, dolly, crane, etc.)
- Set focal length equivalents and lens characteristics
- Plan 180-degree rule compliance and screen direction
- Design compositional diversity (no repeated angles in 4-shot window)
- Calculate optimal shot duration based on content and emotion
- Plan motivated camera movements (every move has narrative reason)

**Advanced Responsibilities:**
- Design sakuga moments (high-quality animation bursts)
- Plan impact frames and their timing
- Specify handheld drift percentages for organic feel
- Design whip pans and transition mechanisms
- Ensure minimum 5 unique framings per 7 shots (variety mandate)

**Output Format:**
```json
{
  "shot_list": [
    {
      "shot_number": 1,
      "timecode": "0.0-0.8s",
      "duration_seconds": 0.8,
      "shot_size": "ECU",
      "camera_angle": "Low angle, 15° from ground",
      "camera_movement": {
        "type": "Push-in",
        "speed": "Slow (5% per second)",
        "easing": "Ease-out"
      },
      "focal_length_equivalent": "85mm",
      "composition_rule": "Rule of thirds, subject left",
      "depth_of_field": "Shallow, f/2.8 equivalent",
      "action_description": "Hand extends to touch glowing device...",
      "narrative_purpose": "Establish tactile connection, build anticipation",
      "emotional_tone": "Curiosity mixed with tension",
      "reference_films": ["Your Name (2016) - opening sequence"],
      "technical_notes": "Maintain sharp focus on fingertips; device provides key light"
    }
    // ... 14-24 more shots
  ],
  "shot_rhythm_analysis": {
    "average_shot_length": 0.68,
    "shortest_shot": 0.2,
    "longest_shot": 1.2,
    "rhythm_pattern": "Fast → Slower → Fast (emotional wave)"
  },
  "camera_philosophy_statement": "Camera is a curious observer that becomes emotionally invested..."
}
```

**Quality Checks:**
- Total shot duration matches 15 seconds exactly (±0.1s tolerance)
- No violation of 180-degree rule unless intentionally breaking it
- Shot variety maintained (no angle repeated within 4 shots)
- Every camera movement has clear narrative motivation
- Shot durations allow for proper action completion
- Composition follows established aesthetic rules (golden ratio, rule of thirds, etc.)

**Validation Against Seed Image:**
- Camera style matches seed (handheld feel, stable tripod, etc.)
- Framing philosophy aligns with seed's composition
- No impossible camera moves for 2D animation

---

### Agent 4.2: Lighting Director
**Role:** Lighting Design Master & Mood Sculptor  
**Input:** Shot list + Color script + Visual style  
**Output:** Lighting specifications for every shot

**Responsibilities:**
- Design 3-point lighting (key, fill, rim) for character shots
- Specify light source motivation (sun, lamps, magic, etc.)
- Plan lighting evolution throughout 15 seconds (time progression, mood shifts)
- Design special lighting effects (godrays, caustics, halation, lens flares)
- Ensure proper exposure (no blown highlights, preserved shadow detail)
- Create HDR-like dynamic range within 2D limitations
- Design how light interacts with environment (particles, reflections)
- Specify light color temperature per shot

**Advanced Responsibilities:**
- Design light as emotional tool (warm=comfort, cool=isolation)
- Plan dramatic lighting moments (silhouettes, rim light reveals)
- Specify practical light sources visible in frame
- Design ambient occlusion and bounce light behavior
- Create lighting continuity between shots

**Output Format:**
```json
{
  "lighting_per_shot": [
    {
      "shot_number": 1,
      "primary_light_source": {
        "type": "Sun (harsh daylight)",
        "direction": "Top-down, 60° angle",
        "color_temp_kelvin": 5600,
        "color_hex": "#FFE5B4",
        "intensity_percent": 100,
        "creates_shadow": true,
        "shadow_quality": "Hard-edged with slight diffusion"
      },
      "secondary_light_source": {
        "type": "Device glow (magical)",
        "direction": "Bottom-up, casting on face",
        "color_hex": "#4DA6FF",
        "intensity_percent": 70,
        "creates_shadow": false,
        "special_effects": ["Volumetric rays", "Halation glow"]
      },
      "ambient_light": {
        "color_hex": "#87CEEB",
        "intensity_percent": 30,
        "source": "Sky dome"
      },
      "special_effects": [
        {
          "type": "Lens flare",
          "trigger": "When device activates at 0.5s",
          "style": "Anamorphic horizontal streaks",
          "color": "#4DA6FF"
        }
      ],
      "exposure_settings": {
        "overall_exposure_ev": 0,
        "highlight_clipping_limit": "90% luminance max",
        "shadow_detail_preservation": "Minimum 15% luminance in darkest areas"
      },
      "mood_descriptor": "Harsh reality meets mysterious hope"
    }
    // ... for all shots
  ],
  "lighting_evolution": {
    "0-5s": "Harsh naturalistic",
    "5-10s": "Increasingly magical",
    "10-15s": "Transcendent, overexposed beauty"
  },
  "lighting_philosophy": "Light transitions from revealing reality to creating dreams..."
}
```

**Quality Checks:**
- All light sources are motivated (not arbitrary)
- No shot has blown-out whites (>90% luminance)
- Shadow detail preserved (>10% luminance minimum)
- Lighting continuity maintained within scenes
- Color temperature shifts are emotionally motivated
- Special effects enhance, don't overwhelm
- Lighting honors 2D hand-painted aesthetic (no raytracing look)

---

### Agent 4.3: Motion & Transition Choreographer
**Role:** Movement Director & Flow Specialist  
**Input:** Shot list + Emotional arc  
**Output:** Animation choreography and transition specs

**Responsibilities:**
- Design character movement choreography for each shot
- Specify animation quality level (ones vs twos vs threes)
- Plan impact frames and smear frames
- Design transitions between shots (cuts, wipes, matches)
- Choreograph environmental motion (wind, particles, water)
- Specify easing curves for all movements (linear, ease-in, ease-out, etc.)
- Plan secondary animation (hair lag, cloth flow, accessories)
- Design sakuga moments with frame-by-frame precision

**Advanced Responsibilities:**
- Create match cuts that feel magical
- Design motion that respects physics while being artistic
- Plan speed ramping moments
- Choreograph camera + subject movement harmony
- Design motion holds and dramatic pauses

**Output Format:**
```json
{
  "motion_per_shot": [
    {
      "shot_number": 1,
      "primary_action": {
        "subject": "Character's hand",
        "movement_type": "Extension toward object",
        "animation_quality": "Ones (24fps, full animation)",
        "timing_frames": {
          "start_pose_hold": 3,
          "anticipation_frames": 4,
          "main_action_frames": 8,
          "follow_through_frames": 5
        },
        "arcs": "Natural human motion arc, slight curve",
        "easing": "Ease-out (decelerating as fingers approach)"
      },
      "secondary_animation": [
        {
          "element": "Sleeve fabric",
          "behavior": "Drags 2 frames behind arm movement",
          "physics": "Cloth simulation"
        },
        {
          "element": "Dust particles",
          "behavior": "Disturbed by hand movement, drift upward",
          "count": "15-20 particles"
        }
      ],
      "impact_frames": [
        {
          "trigger_timecode": "0.5s",
          "type": "Flash frame",
          "description": "Single white frame as fingertip touches device",
          "effect": "Emphasis + energy release signal"
        }
      ],
      "environmental_motion": {
        "wind": "Gentle 2% sway on background grass",
        "light_flicker": "Device pulses subtly at 3Hz"
      }
    }
    // ... for all shots
  ],
  "transitions": [
    {
      "from_shot": 1,
      "to_shot": 2,
      "transition_type": "Light bloom wipe",
      "duration_frames": 4,
      "description": "Device light expands to fill frame, revealing next shot"
    }
    // ... all transitions
  ],
  "sakuga_moments": [
    {
      "shot_numbers": [13, 16, 22],
      "description": "High-speed run cycles animated on ones",
      "special_techniques": ["Smear frames on acceleration", "Impact frames on footfalls"],
      "reference_animator": "Yutaka Nakamura"
    }
  ]
}
```

**Quality Checks:**
- All movements have proper anticipation/action/follow-through
- Physics feel believable even if stylized
- No anatomical impossibilities (even in smears)
- Animation quality appropriate to narrative importance
- Transitions enhance storytelling, don't distract
- Secondary animation adds life without cluttering

---

### Agent 4.4: Composition Validator
**Role:** Visual Balance & Technical QA  
**Input:** All cinematography outputs  
**Output:** Validation report + composition fixes

**Responsibilities:**
- Verify all compositions follow established rules
- Check negative space and visual balance
- Validate eye-line matches and screen direction
- Ensure subject-background separation (contrast, rim light)
- Verify no tangents or visual awkwardness
- Check that composition supports emotional intent
- Validate accessibility (no critical info in overscan areas)

**Quality Checks:**
- Zero composition errors flagged
- All shots have clear focal point
- Visual flow guides viewer's eye correctly

---

**Quality Gate #3: TECHNICAL EXCELLENCE**

Validators check:
1. **Cinematography Coherence**: Camera choices support story
2. **Lighting Feasibility**: All lighting setups are achievable in 2D
3. **Motion Believability**: Physics and timing feel right
4. **Shot Flow**: Sequence flows smoothly without jarring cuts

**Pass Criteria:** Technical excellence + emotional effectiveness verified

---

## 🎵 MODULE 5: AUDIO DESIGN

### Agent 5.1: Sound Design Specialist
**Role:** Foley & SFX Master  
**Input:** Shot list + Motion choreography  
**Output:** Complete sound effect specifications

**Responsibilities:**
- Design sound effect for every action and event
- Specify foley requirements (footsteps, cloth rustles, object interactions)
- Plan environmental ambience (wind, water, magical hums)
- Design special effect sounds (magic, technology, impacts)
- Ensure spatial audio positioning (7.1 surround consideration)
- Plan sound perspective (close sounds vs distant sounds)
- Design sound that enhances rather than competes with music
- Specify silence moments for dramatic effect

**Output Format:**
```json
{
  "sound_effects_per_shot": [
    {
      "shot_number": 1,
      "foley": [
        {
          "sound": "Leather glove creak",
          "timing": "0.1s-0.4s",
          "volume_db": -18,
          "pan": "Center",
          "description": "As fingers extend"
        },
        {
          "sound": "Fabric rustle (sleeve)",
          "timing": "0.15s-0.6s",
          "volume_db": -24,
          "pan": "Slight left"
        }
      ],
      "sfx": [
        {
          "sound": "Device activation hum (rising pitch)",
          "timing": "0.4s-0.8s",
          "volume_db": -12,
          "frequency_range": "80Hz rising to 400Hz",
          "spatial_audio": "Point source at device location",
          "special_processing": "Slight reverb (0.3s tail)"
        },
        {
          "sound": "Light burst impact",
          "timing": "0.5s (single frame impact)",
          "volume_db": -6,
          "description": "Bright, crystalline"
        }
      ],
      "ambience": [
        {
          "sound": "Desert wind (gentle)",
          "volume_db": -30,
          "description": "Continuous throughout shot"
        }
      ]
    }
    // ... for all shots
  ],
  "sound_philosophy": "Sound design is invisible world-building...",
  "silence_moments": [
    {
      "timecode": "7.8-8.0s",
      "description": "Brief silence before final act escalation",
      "only_remaining_sound": "Heartbeat (internal)"
    }
  ]
}
```

**Quality Checks:**
- Every visible action has corresponding sound
- Spatial audio makes sense (close sounds loud, far sounds quiet)
- Sound perspective matches camera distance
- No muddy frequency clashes between effects
- Silence used strategically

---

### Agent 5.2: Music Composer Agent
**Role:** Score Composer & Emotional Conductor  
**Input:** Emotional arc + Shot list + Sound effects  
**Output:** Music composition specifications

**Responsibilities:**
- Design musical structure (intro, build, climax, resolution)
- Specify instrumentation appropriate to mood and setting
- Plan musical beats that sync with visual beats
- Design leitmotifs or recurring musical themes
- Ensure music complements, doesn't overpower dialogue/SFX
- Plan dynamic range and emotional crescendos
- Specify tempo, key, and time signature
- Design music-to-action sync points

**Output Format:**
```json
{
  "musical_structure": {
    "intro": {
      "duration": "0-3s",
      "description": "Sparse, mysterious",
      "instrumentation": ["Solo cello", "Ambient pad"],
      "tempo_bpm": 60,
      "key": "A minor",
      "dynamic_level": "pp (very soft)"
    },
    "build": {
      "duration": "3-8s",
      "description": "Growing tension and hope",
      "instrumentation": ["Cello + Violin", "Subtle percussion", "Piano enters at 6s"],
      "tempo_bpm": "60 → 80 (gradual acceleration)",
      "key": "A minor → C major (modulation at 7s)",
      "dynamic_level": "mp → mf"
    },
    "climax": {
      "duration": "8-13s",
      "description": "Triumphant and transcendent",
      "instrumentation": ["Full string section", "Soaring vocals (wordless)", "Epic percussion"],
      "tempo_bpm": 100,
      "key": "C major",
      "dynamic_level": "ff (very loud)",
      "special_moment": "Silence at 8.5s for dramatic pause"
    },
    "resolution": {
      "duration": "13-15s",
      "description": "Peaceful conclusion",
      "instrumentation": ["Solo piano", "Reverb-drenched strings"],
      "tempo_bpm": "100 → 70 (ritardando)",
      "key": "C major → A major (hopeful ending)",
      "dynamic_level": "mf → p (fade out)"
    }
  },
  "sync_points": [
    {
      "musical_beat": "Percussion hit",
      "timecode": "0.5s",
      "syncs_with": "Device activation flash"
    },
    {
      "musical_beat": "String swell peak",
      "timecode": "11.2s",
      "syncs_with": "Sky cracks with energy (visual climax)"
    }
  ],
  "leitmotif": {
    "theme": "Three-note ascending phrase",
    "appears_at": ["1.2s", "8.8s", "14.5s"],
    "meaning": "Hope and determination",
    "instrumentation_evolution": "Cello → Violin → Full orchestra"
  },
  "reference_composers": ["Austin Wintory", "Hiroyuki Sawano", "Max Richter"]
}
```

**Quality Checks:**
- Music has clear beginning, middle, end
- Emotional tone matches visual narrative
- Sync points align precisely with key visual moments
- No frequency clashes with sound effects
- Music doesn't overwhelm dialogue (if present)
- Dynamic range is broadcast-safe

---

### Agent 5.3: Dialogue & Voice Director
**Role:** Voice Performance Specialist  
**Input:** Story + Character specs  
**Output:** Dialogue and voice direction (if applicable)

**Responsibilities:**
- Write any dialogue (if story requires speech)
- Design voice direction (tone, pacing, emotion)
- Plan lip-sync timing
- Specify breathing, gasps, grunts, and non-verbal vocalizations
- Ensure dialogue clarity against music/SFX
- Design internal monologue (if used)
- Plan voice processing (reverb for flashbacks, etc.)

**Note:** Many 15s shorts are dialogue-free. If no dialogue, this agent specifies "NO DIALOGUE" with reasoning.

**Output Format (if dialogue present):**
```json
{
  "has_dialogue": true,
  "dialogue_list": [
    {
      "character": "Seeker",
      "timecode": "4.2-5.0s",
      "line": "I remember now...",
      "direction": "Whispered, filled with wonder and slight pain",
      "emotion": "Bittersweet realization",
      "volume_db": -15,
      "processing": "Slight reverb to indicate internal thought"
    }
  ],
  "non_verbal_vocalizations": [
    {
      "character": "Runner",
      "timecode": "10.1s",
      "type": "Determined grunt",
      "description": "As he leaps the gap"
    }
  ]
}
```

---

### Agent 5.4: Audio Synchronization Validator
**Role:** Audio-Visual Harmony Specialist  
**Input:** All audio outputs + Shot list  
**Output:** Sync validation report

**Responsibilities:**
- Verify all sound effects sync with visual actions
- Check music beats align with key visual moments
- Validate dialogue lip-sync (if present)
- Ensure no audio clashes or muddy frequencies
- Check overall audio mix balance
- Verify spatial audio positioning makes sense

**Quality Checks:**
- All sync points within ±1 frame tolerance
- Audio mix is balanced (dialogue>SFX>music priority)
- No frequency masking issues
- Audio supports rather than distracts from visuals

---

**Quality Gate #4: AUDIO-VISUAL HARMONY**

Validators check:
1. **Sync Precision**: Audio-visual alignment is frame-perfect
2. **Mix Balance**: All audio elements coexist without conflict
3. **Emotional Enhancement**: Audio amplifies emotional intent
4. **Technical Quality**: Mix is broadcast-ready

---

## 🔧 MODULE 6: TECHNICAL SPECIFICATION

### Agent 6.1: Animation Technique Specialist
**Role:** Technical Animation Director  
**Input:** All visual and motion specs  
**Output:** Frame-by-frame animation requirements

**Responsibilities:**
- Specify animation-on-ones vs twos vs threes per shot
- Design smear frame requirements
- Plan held frames and limited animation moments
- Specify line weight variation and cel shading technique
- Design hand-drawn effects (fire, water, magic, smoke)
- Plan traditional animation principles application
- Specify in-betweening requirements
- Design character volume consistency rules

**Output Format:**
```json
{
  "animation_specs_per_shot": [
    {
      "shot_number": 1,
      "animation_method": "Full animation (ones)",
      "key_frames": [0, 8, 19],
      "in_between_frames": "All frames fully drawn",
      "held_frames": [0,1,2],
      "smear_frames": [],
      "linework": {
        "weight_range": "0.5mm-2.5mm",
        "colored_lines": true,
        "line_color_palette": ["#2C3E50 (shadows)", "#5D6D7E (base)"]
      },
      "cel_shading": {
        "tone_levels": 3,
        "painted_light_accents": true
      }
    }
    // ...
  ],
  "effects_animation": [
    {
      "effect_type": "Device energy particles",
      "shots": [2, 8, 18],
      "method": "Hand-drawn frame-by-frame",
      "particle_count": "50-100 per frame",
      "animation_notes": "No digital particle system, paint each mote individually"
    }
  ]
}
```

---

### Agent 6.2: VFX & Effects Designer
**Role:** Special Effects Specialist (2D Only)  
**Input:** Technical animation specs + Visual style  
**Output:** Hand-drawn VFX specifications

**Responsibilities:**
- Design all special effects (magic, energy, weather)
- Plan traditional 2D effects techniques
- Specify particle animation (hand-drawn only)
- Design light effects (godrays, lens flares, halation)
- Plan compositing layers and blend modes
- Ensure zero digital/3D contamination

**Quality Checks:**
- All effects are hand-drawn or hand-painted
- Effects enhance without overwhelming
- Style consistent with seed image aesthetic

---

### Agent 6.3: Timing & Pacing Expert
**Role:** Rhythm & Tempo Master  
**Input:** Complete shot list + audio specs  
**Output:** Final timing adjustments

**Responsibilities:**
- Fine-tune shot durations for optimal flow
- Adjust animation timing for emotional impact
- Ensure 15-second total duration precisely
- Design beat-by-beat rhythm
- Plan pacing variation (fast/slow moments)

---

### Agent 6.4: Technical Feasibility Validator
**Role:** Production Reality Check  
**Input:** All technical specs  
**Output:** Feasibility report + production notes

**Responsibilities:**
- Verify all specs are achievable in Sora 2 or equivalent
- Check animation complexity is realistic
- Flag any impossible technical requirements
- Estimate production difficulty
- Suggest simplifications if needed

---

**Quality Gate #5: PRODUCTION VIABILITY**

Final technical validation before synthesis.

---

## 🎬 MODULE 7: SYNTHESIS & REFINEMENT

### Agent 7.1: Master Editor & Integrator
**Role:** Creative Director & Final Synthesizer  
**Input:** ALL agent outputs  
**Output:** Integrated master prompt

**Responsibilities:**
- Synthesize all agent outputs into unified prompt
- Resolve any remaining conflicts
- Ensure narrative coherence from start to finish
- Maintain consistency across all departments
- Add final polish and cohesion
- Write director's vision statement

---

### Agent 7.2: Quality Assurance Auditor
**Role:** Final Quality Gatekeeper  
**Input:** Integrated prompt  
**Output:** QA report + score

**Responsibilities:**
- Run comprehensive quality checklist (100+ items)
- Verify seed image compliance
- Check all quality gates were passed
- Score prompt against festival-grade criteria
- Flag any remaining issues

**Quality Checklist Sample:**
- [ ] Prompt honors seed image visual style
- [ ] Story has clear arc in 15s
- [ ] All shots sync with emotional beats
- [ ] Camera movements motivated
- [ ] Lighting consistent and motivated
- [ ] Colors support emotion
- [ ] Audio syncs frame-perfectly
- [ ] No 3D/CGI contamination
- [ ] Technical specs are achievable
- [ ] Every frame could be wallpaper
- ... 90+ more checks

---

### Agent 7.3: Prompt Generator & Formatter
**Role:** Output Formatter  
**Input:** Integrated prompt + QA approval  
**Output:** Final formatted JSON prompt

**Responsibilities:**
- Format output to match your existing prompt structure
- Generate all required fields
- Create fallback/backup sections
- Add metadata and version info
- Ensure JSON validity

---

### Agent 7.4: Human Review Coordinator
**Role:** Collaboration Interface  
**Input:** Final prompt  
**Output:** Review UI + feedback collection

**Responsibilities:**
- Present prompt to human for review
- Collect feedback and revision requests
- Route feedback to appropriate agents
- Manage revision cycles (max 3)
- Track approval status

---

**Quality Gate #6: FINAL EXCELLENCE CHECK**

Human creative director final approval + automated excellence audit.

---

## 🔄 INTER-AGENT COMMUNICATION PROTOCOL

### Feedback Loop System

**Peer Review Mechanism:**
```
Agent A completes output → Agent B reviews → Agent B provides critique → 
Agent A revises based on critique → Validator checks revision
```

**Cross-Module Validation:**
- Story agents review visual designs for narrative support
- Visual agents review cinematography for aesthetic consistency
- Cinematography agents review audio for sync opportunities
- All agents can flag concerns to upstream agents

**Conflict Resolution:**
1. Agents attempt automated compromise
2. If unresolved, escalate to Master Editor (7.1)
3. If still unresolved, flag for human decision

### Message Format:

```json
{
  "from_agent": "4.1_camera_specialist",
  "to_agent": "2.1_story_architect",
  "message_type": "concern",
  "priority": "medium",
  "content": "Shot 8 requires 2.0s for proper action completion, but story allocates only 1.2s. Recommend extending or simplifying action.",
  "suggested_resolution": "Extend Shot 8 to 1.8s, reduce Shot 9 by 0.6s",
  "requires_human_input": false
}
```

---

**End of Phase 2 Document**

*Ready for Phase 3: Implementation Steps & Code Architecture?*
