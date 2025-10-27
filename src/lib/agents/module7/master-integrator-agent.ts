// lib/agents/module7/master-integrator-agent.ts
import { BaseAgent, AgentContext } from '../base-agent';
import { MasterIntegratorInput, MasterIntegratorOutput, MasterIntegratorInputSchema, MasterIntegratorOutputSchema, FinalShotSpec } from '../../../types/agents';
import { MASTER_INTEGRATOR_PROMPT } from '../../prompts/module7';

export class MasterIntegratorAgent extends BaseAgent<MasterIntegratorInput, MasterIntegratorOutput> {
  protected agentName = 'agent-7.1-master-integrator';
  protected agentVersion = '1.0';
  protected inputSchema = MasterIntegratorInputSchema;
  protected outputSchema = MasterIntegratorOutputSchema;

  constructor() {
    // This is the most critical agent, using the most powerful model and max thinking budget.
    super({ model: 'gemini-2.5-pro', temperature: 0.5, thinkingBudget: 32768 });
  }

  protected async execute(input: MasterIntegratorInput, context: AgentContext): Promise<MasterIntegratorOutput> {
    const prompt = `
      ${MASTER_INTEGRATOR_PROMPT}

      **INPUT BIBlES TO INTEGRATE:**
      
      North Star Vision:
      ${JSON.stringify(input.vision, null, 2)}
      
      Story Architecture:
      ${JSON.stringify(input.story, null, 2)}

      Emotional Arc:
      ${JSON.stringify(input.emotionalArc, null, 2)}

      Thematic Elements:
      ${JSON.stringify(input.thematicElements, null, 2)}

      Visual Bible:
      ${JSON.stringify(input.visual, null, 2)}
      
      Cinematography Bible:
      ${JSON.stringify(input.cine, null, 2)}
      
      Audio Bible:
      ${JSON.stringify(input.audio, null, 2)}
      
      Technical Bible:
      ${JSON.stringify(input.tech, null, 2)}

      ${input.qaFeedback ? `
      **REVISION REQUIRED - Address these issues:**
      ${JSON.stringify(input.qaFeedback, null, 2)}
      ` : ''}
    `;
    try {
        const llmOutput = await this.geminiClient.generateStructuredContent<MasterIntegratorOutput>(prompt, this.outputSchema);
        if (llmOutput.masterPrompt && llmOutput.masterPrompt.final_shot_list_with_all_specs) {
            return llmOutput;
        }
        throw new Error("LLM Master Integrator output was incomplete.");
    } catch(error) {
        console.warn('Master Integrator: LLM output was structurally invalid. Using robust manual fallback.', error);
        return this.createManualFallback(input);
    }
  }

  private createManualFallback(input: MasterIntegratorInput): MasterIntegratorOutput {
    const soundDesignByShot = new Map<number, (typeof input.audio.audioBible.soundDesign.sound_effects_per_shot)[number]>();
    input.audio.audioBible.soundDesign.sound_effects_per_shot.forEach(entry => {
        soundDesignByShot.set(entry.shot_number, entry);
    });

    const vfxByShot = new Map<number, (typeof input.tech.technicalBible.vfxDesign.vfx_specs)[number][]>();
    input.tech.technicalBible.vfxDesign.vfx_specs.forEach(spec => {
        if (!vfxByShot.has(spec.shot_number)) {
            vfxByShot.set(spec.shot_number, []);
        }
        vfxByShot.get(spec.shot_number)!.push(spec);
    });

    const animationByShot = new Map<number, (typeof input.tech.technicalBible.animationTechnique.animation_specs_per_shot)[number]>();
    input.tech.technicalBible.animationTechnique.animation_specs_per_shot.forEach(spec => {
        animationByShot.set(spec.shot_number, spec);
    });

    const timingByShot = new Map<number, (typeof input.tech.technicalBible.finalTiming.final_timing_sheet)[number]>();
    input.tech.technicalBible.finalTiming.final_timing_sheet.forEach(entry => {
        timingByShot.set(entry.shot_number, entry);
    });

    const dialogueList = input.audio.audioBible.dialogue.dialogue_list ?? [];
    const vocalizations = input.audio.audioBible.dialogue.non_verbal_vocalizations ?? [];
    const musicSyncPoints = input.audio.audioBible.music.sync_points ?? [];
    const silenceMoments = input.audio.audioBible.soundDesign.silence_moments ?? [];

    const toStringValue = (value: unknown): string => {
        if (typeof value === 'string') return value;
        if (Array.isArray(value)) return value.join(', ');
        if (value === null || value === undefined) return '';
        try {
            return JSON.stringify(value);
        } catch {
            return String(value);
        }
    };

    const manualShots: FinalShotSpec[] = input.cine.cinematographyBible.final_shot_list.map((shot: any) => {
        const lighting = shot.lighting;
        const motion = shot.motion;
        const soundDesign = soundDesignByShot.get(shot.shot_number);
        const vfxSpecs = vfxByShot.get(shot.shot_number) ?? [];
        const animationSpec = animationByShot.get(shot.shot_number);
        const timingAdjustment = timingByShot.get(shot.shot_number);
        const shotStart = typeof shot.timecode === 'string' ? shot.timecode.split('-')[0] : '';

        const palette = new Set<string>();
        if (lighting?.primary_light_source?.color_hex) palette.add(lighting.primary_light_source.color_hex);
        if (lighting?.secondary_light_source?.color_hex) palette.add(lighting.secondary_light_source.color_hex);
        if (lighting?.ambient_light?.color_hex) palette.add(lighting.ambient_light.color_hex);

        const relevantSyncs = musicSyncPoints.filter(point => {
            if (!point.timecode) return false;
            return shot.timecode.includes(point.timecode) || (!!shotStart && point.timecode.startsWith(shotStart));
        });

        const relevantSilence = silenceMoments.filter(moment => shot.timecode.includes(moment.timecode));

        const relevantDialogue = dialogueList.filter(line => {
            if (!line.timecode) return false;
            return shot.timecode.includes(line.timecode) || (!!shotStart && line.timecode.startsWith(shotStart));
        });

        const relevantVocalizations = vocalizations.filter(line => {
            if (!line.timecode) return false;
            return shot.timecode.includes(line.timecode) || (!!shotStart && line.timecode.startsWith(shotStart));
        });

        const musicCue = relevantSyncs.length > 0
            ? relevantSyncs.map(sync => `${sync.musical_beat}: ${sync.syncs_with} @ ${sync.timecode}`).join(' | ')
            : `Align with score structure (${input.audio.audioBible.music.musical_structure.intro.description})`;

        const syncNotes = [
            ...relevantSyncs.map(sync => `Sync ${sync.musical_beat} at ${sync.timecode} (${sync.syncs_with})`),
            ...relevantSilence.map(silence => `Intentional silence ${silence.timecode}: ${silence.description}`),
            ...(timingAdjustment
                ? [`Timing adjustment: ${timingAdjustment.adjusted_duration_seconds}s (${timingAdjustment.adjustment_reason})`]
                : []),
        ];

        const foleyDescriptions = soundDesign?.foley.map(f => `${f.sound} ${f.timing} (${f.description})`) ?? [];
        const sfxDescriptions = soundDesign?.sfx.map(s => `${s.sound} ${s.timing}${s.description ? ` (${s.description})` : ''}`) ?? [];
        const ambienceDescriptions = soundDesign?.ambience.map(a => `${a.sound} (${a.description})`) ?? [];

        const lightingEffects = lighting?.special_effects?.map((effect: any) =>
            `${effect.type} triggered by ${effect.trigger} (${effect.style}, ${effect.color})`
        ) ?? [];

        const secondaryMotion = motion?.secondary_animation?.map((anim: any) =>
            `${anim.element}: ${anim.behavior}${anim.physics ? ` (${anim.physics})` : ''}`
        ) ?? [];

        const impactFrames = motion?.impact_frames?.map((impact: any) =>
            `${impact.trigger_timecode} – ${impact.type}: ${impact.description}`
        ) ?? [];

        const vfxEffects = vfxSpecs.map(spec => `${spec.effect_name} via ${spec.technique}`);
        const vfxLayers = vfxSpecs.flatMap(spec =>
            spec.layers.map((layer: any) => `${layer.layer_name} [${layer.blend_mode} @ ${layer.opacity}%]: ${layer.notes}`)
        );

        const keyFrames = animationSpec?.key_frames?.map(frame => `Frame ${frame}`) ?? [];
        const heldFrames = animationSpec?.held_frames?.map(frame => `Frame ${frame}`) ?? [];
        const smearFrames = animationSpec?.smear_frames?.map(frame => `Frame ${frame}`) ?? [];
        const lineworkSummary = animationSpec
            ? `${animationSpec.linework.weight_range}; colored lines: ${animationSpec.linework.colored_lines ? 'yes' : 'no'}; palette: ${animationSpec.linework.line_color_palette.join(', ')}`
            : 'Refer to technical bible linework directives.';
        const celShadingSummary = animationSpec
            ? `${animationSpec.cel_shading.tone_levels} tone levels; painted accents: ${animationSpec.cel_shading.painted_light_accents ? 'yes' : 'no'}`
            : 'Refer to technical bible cel shading directives.';

        const dialogueLines = relevantDialogue.map(line => `${line.character}: "${line.line}"${line.emotion ? ` (${line.emotion})` : ''}`);
        const vocalMoments = relevantVocalizations.map(vocal => `${vocal.character}: ${vocal.type} – ${vocal.description}`);

        const manualShot: FinalShotSpec = {
            shot_number: shot.shot_number,
            timecode: shot.timecode,
            duration_seconds: shot.duration_seconds,
            director_note: `${shot.narrative_purpose}. Action: ${shot.action_description}`,
            camera_spec: {
                shot_size: shot.camera?.shot_size ?? 'Refer to cinematography bible.',
                angle: shot.camera?.camera_angle ?? 'Refer to cinematography bible.',
                movement: toStringValue(shot.camera?.camera_movement ?? 'Locked'),
                focal_length: shot.camera?.focal_length_equivalent ?? 'N/A',
                composition: shot.camera?.composition_rule ?? 'Refer to cinematography bible.',
                depth_of_field: shot.camera?.depth_of_field ?? 'Refer to cinematography bible.',
                emotional_intent: shot.emotional_tone ?? 'Refer to cinematography bible.',
            },
            lighting_spec: {
                key_light: lighting
                    ? `${lighting.primary_light_source.type} from ${lighting.primary_light_source.direction} (${lighting.primary_light_source.color_hex})`
                    : 'Refer to lighting bible.',
                fill_light: lighting?.secondary_light_source
                    ? `${lighting.secondary_light_source.type} ${lighting.secondary_light_source.direction} (${lighting.secondary_light_source.color_hex})`
                    : undefined,
                rim_light: lighting?.ambient_light
                    ? `${lighting.ambient_light.source} glow (${lighting.ambient_light.color_hex})`
                    : undefined,
                palette: Array.from(palette),
                special_effects: lightingEffects,
                mood: lighting?.mood_descriptor ?? 'Refer to lighting bible.',
            },
            motion_spec: {
                primary_action: motion
                    ? `${motion.primary_action.subject}: ${motion.primary_action.movement_type} (${motion.primary_action.animation_quality})`
                    : 'Refer to motion choreography bible.',
                secondary_motion,
                impact_frames,
            },
            audio_spec: {
                foley: foleyDescriptions,
                sfx: sfxDescriptions,
                ambience: ambienceDescriptions,
                music_cue: musicCue,
                dialogue_or_vocals: [...dialogueLines, ...vocalMoments],
                sync_notes: syncNotes,
            },
            vfx_spec: {
                effects: vfxEffects,
                layer_notes: vfxLayers,
            },
            animation_spec: {
                animation_method: animationSpec?.animation_method ?? 'Refer to animation bible.',
                key_frames: keyFrames,
                in_betweening: animationSpec?.in_between_frames ?? 'Refer to animation bible.',
                held_frames: heldFrames,
                smear_frames: smearFrames,
                linework: lineworkSummary,
                cel_shading: celShadingSummary,
            },
        };

        return manualShot;
    });

    const masterPrompt = {
        director_vision_statement: input.vision.synthesizedVision.unifiedDescription,
        unified_story: {
            logline: input.story.storyArchitecture.logline,
            three_act_structure: input.story.storyArchitecture.threeActStructure,
            emotional_arc: input.emotionalArc.emotionalArc,
            thematic_elements: input.thematicElements.thematicElements,
        },
        complete_visual_bible: input.visual.visualBible,
        final_shot_list_with_all_specs: manualShots,
        complete_audio_bible: input.audio.audioBible,
        production_ready_technical_bible: input.tech.technicalBible,
        integration_provenance: {
            section_lineage: [
                {
                    section_id: 'director_vision_statement',
                    source_modules: ['vision'],
                    preserved_highlights: [
                        {
                            module: 'vision',
                            excerpt: input.vision.synthesizedVision.unifiedDescription,
                        },
                    ],
                    integration_notes: 'Fallback synthesis mirrors the unified description verbatim for traceability.',
                },
                {
                    section_id: 'unified_story',
                    source_modules: ['story', 'emotionalArc', 'thematicElements', 'vision'],
                    preserved_highlights: [
                        { module: 'story', excerpt: input.story.storyArchitecture.logline },
                        {
                            module: 'emotionalArc',
                            excerpt: input.emotionalArc.emotionalArc.keyEmotionalShift.trigger || 'Refer to emotional arc input.',
                        },
                    ],
                    integration_notes: 'Structure mirrors upstream story, emotional arc, and thematic documents without modification.',
                },
                {
                    section_id: 'final_shot_list_with_all_specs',
                    source_modules: ['cine', 'audio', 'tech'],
                    preserved_highlights: [
                        {
                            module: 'cine',
                            excerpt: 'Shot cadence retained from cinematography bible in fallback merge.',
                        },
                        {
                            module: 'audio',
                            excerpt: 'Sound design cues ported directly from audio bible for manual alignment.',
                        },
                        {
                            module: 'tech',
                            excerpt: 'Animation and VFX specifications preserved verbatim from technical bible.',
                        },
                    ],
                    integration_notes: 'Manual fallback stitches camera, audio, and technical specs without additional reinterpretation. Human polish recommended.',
                },
            ],
            director_decisions: [
                {
                    issue: 'Manual fallback invoked',
                    decision: 'Preserved upstream structures without additional weaving.',
                    rationale: 'Automated synthesis failed validation; fallback retains traceability for human review.',
                    impact: 'Requires creative pass to add director-level nuance before production.',
                },
            ],
            module_contribution_scores: [
                { module: 'vision', score: 6, justification: 'Vision statement carried over verbatim to maintain intent.' },
                { module: 'story', score: 6, justification: 'Story beats preserved exactly; needs directoral embellishment.' },
                { module: 'emotionalArc', score: 6, justification: 'Emotional trajectory retained; nuance pending.' },
                { module: 'thematicElements', score: 6, justification: 'Symbolism referenced without new layering.' },
                { module: 'visual', score: 5, justification: 'Visual bible embedded but not reinterpreted in fallback.' },
                { module: 'cine', score: 5, justification: 'Shot mechanics preserved; notes flag need for creative polish.' },
                { module: 'audio', score: 5, justification: 'Audio cues copied; further mixing direction required.' },
                { module: 'tech', score: 5, justification: 'Technical specs inserted verbatim as placeholders.' },
            ],
        },
    };

    return { masterPrompt };
  }

  protected async assessQuality(output: MasterIntegratorOutput): Promise<number> {
    // Assess the completeness of the integration
    let score = 0;
    const { masterPrompt } = output;
    if (masterPrompt.director_vision_statement) score += 10;
    if (masterPrompt.unified_story) score += 15;
    if (masterPrompt.complete_visual_bible) score += 15;
    if (masterPrompt.final_shot_list_with_all_specs.length > 0) score += 20;
    if (masterPrompt.final_shot_list_with_all_specs.every(shot =>
      shot.camera_spec.shot_size &&
      shot.lighting_spec.palette.length > 0 &&
      shot.audio_spec.music_cue &&
      shot.animation_spec.animation_method
    )) {
      score += 5;
    }
    if (masterPrompt.complete_audio_bible) score += 20;
    if (masterPrompt.production_ready_technical_bible) score += 20;
    if (masterPrompt.integration_provenance && masterPrompt.integration_provenance.module_contribution_scores.length === 8) {
      score += 10;
    }
    return Math.min(score, 100);
  }
}
