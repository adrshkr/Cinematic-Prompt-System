// src/types/agents.ts
import { z } from 'zod';

// === MODULE 1: Intake & Analysis ===

// Agent 1.1: Image Analysis
export const ImageAnalysisInputSchema = z.object({
  imageData: z.string(),
});
export const ImageAnalysisOutputSchema = z.object({
  visualStyle: z.object({
    artStyle: z.string(),
    animationTechnique: z.string(),
    lineworkCharacteristics: z.object({ weightRange: z.string(), style: z.string() }),
    shadingApproach: z.string(),
    colorTreatment: z.string(),
  }),
  characterAnalysis: z.object({
    present: z.boolean(),
    faceStructure: z.string().optional(),
    eyes: z.object({ shape: z.string(), irisPattern: z.string(), highlightStyle: z.string(), colorHex: z.string() }).optional(),
    hair: z.object({ style: z.string(), length: z.string(), colorPrimary: z.string(), colorHighlights: z.string(), movementPrediction: z.string() }).optional(),
    costume: z.object({ overview: z.string(), fabricType: z.string(), keyDetails: z.array(z.string()) }).optional(),
    pose: z.string().optional(),
    designLanguage: z.string().optional(),
  }).optional(),
  environment: z.object({
    setting: z.string(),
    architecture: z.string(),
    naturalElements: z.array(z.string()),
    depthPlanes: z.string(),
  }),
  lighting: z.object({
    direction: z.string(),
    quality: z.string(),
    colorTemperature: z.number(),
    timeOfDay: z.string(),
    specialEffects: z.array(z.string()),
  }),
  atmosphericElements: z.array(z.object({
    type: z.string(),
    description: z.string(),
    estimatedCount: z.union([z.string(), z.number()]),
  })),
  technicalSpecs: z.object({
    aspectRatio: z.string(),
    compositionRules: z.array(z.string()),
    focusPoint: z.string(),
  }),
  visualElements: z.array(z.object({
    element: z.string(),
    importance: z.enum(['primary', 'secondary', 'tertiary']),
    description: z.string(),
  })),
  clarityAssessment: z.object({
    sharpness: z.number(),
    exposure: z.number(),
    contrast: z.number(),
    notes: z.string(),
  }),
  twoDPurityCheck: z.object({
    isPure2D: z.boolean(),
    confidence: z.number(),
    concerns: z.array(z.string()),
  }),
  animationImplications: z.object({
    consistencyRequired: z.array(z.string()),
    secondaryMotionOpportunities: z.array(z.string()),
    technicalChallenges: z.array(z.string()),
  }),
});

export type ImageAnalysisInput = z.infer<typeof ImageAnalysisInputSchema>;
export type ImageAnalysisOutput = z.infer<typeof ImageAnalysisOutputSchema>;


// Agent 1.2: Concept Extraction
export const ConceptExtractionInputSchema = z.object({
  conceptBrief: z.string(),
});
export const ConceptExtractionOutputSchema = z.object({
    coreNarrative: z.object({
        characters: z.array(z.object({
            role: z.string(),
            description: z.string(),
            motivation: z.string(),
            arc: z.string(),
        })),
        conflict: z.string(),
        transformation: z.string(),
        setting: z.string(),
    }),
    emotionalIntent: z.object({
        targetEmotions: z.array(z.string()),
        emotionalJourney: z.string(),
        tone: z.string(),
        desiredImpact: z.string(),
    }),
    technicalRequirements: z.object({
        duration: z.string(),
        stylePreferences: z.array(z.string()),
        musicRequests: z.string(),
        pacingPreference: z.string(),
        mustHaveElements: z.array(z.string()),
    }),
    implicitRequirements: z.object({
        detectedReferences: z.array(z.string()),
        genreExpectations: z.array(z.string()),
        inferredNeeds: z.array(z.string()),
    }),
    ambiguitiesAndConflicts: z.object({
        needsClarification: z.array(z.string()),
        missingInformation: z.array(z.string()),
    }),
    extractedKeywords: z.array(z.string()),
    creativeBriefSummary: z.string(),
});

export type ConceptExtractionInput = z.infer<typeof ConceptExtractionInputSchema>;
export type ConceptExtractionOutput = z.infer<typeof ConceptExtractionOutputSchema>;


// Agent 1.3: Vision Synthesizer (now called Validator in files, using that)
export const VisionSynthesizerInputSchema = z.object({
    imageAnalysis: ImageAnalysisOutputSchema.nullable(),
    conceptExtraction: ConceptExtractionOutputSchema.nullable(),
    failedVisionDocument: z.any().optional(), // For revisions
    issuesToAddress: z.array(z.string()).optional(), // For revisions
});
export const VisionSynthesizerOutputSchema = z.object({
    synthesizedVision: z.object({
        unifiedDescription: z.string(),
        visualStyle: z.string(),
        narrativeStructure: z.string(),
        emotionalTarget: z.string(),
        tonalKeywords: z.array(z.string()),
    }),
    northStarRequirements: z.object({
        visualMandates: z.array(z.string()),
        narrativeMandates: z.array(z.string()),
        technicalMandates: z.array(z.string()),
        downstreamInstructions: z.array(z.string()),
    }),
    conflictsResolved: z.array(z.object({
        conflict: z.string(),
        resolution: z.string(),
        reasoning: z.string(),
    })),
    conflictsRequiringHumanInput: z.array(z.object({
        conflict: z.string(),
        options: z.array(z.string()),
        recommendation: z.string(),
    })),
    riskAssessment: z.object({
        technicalRisks: z.array(z.object({ risk: z.string(), severity: z.enum(['low', 'medium', 'high']), mitigation: z.string() })),
        aestheticRisks: z.array(z.object({ risk: z.string(), severity: z.enum(['low', 'medium', 'high']), mitigation: z.string() })),
        narrativeRisks: z.array(z.object({ risk: z.string(), severity: z.enum(['low', 'medium', 'high']), mitigation: z.string() })),
        scopeRisks: z.array(z.object({ risk: z.string(), severity: z.enum(['low', 'medium', 'high']), mitigation: z.string() })),
    }),
    creativeConstraints: z.object({
        mustHave: z.array(z.string()),
        forbidden: z.array(z.string()),
        boundaries: z.array(z.string()),
    }),
    qualityDefinition: z.object({
        whatAwardWinningMeans: z.string(),
        successMetrics: z.array(z.object({ metric: z.string(), target: z.string() })),
        initialQualityChecklist: z.array(z.string()),
    }),
    validationStatus: z.object({
        readyToProceed: z.boolean(),
        confidence: z.number(),
        concerns: z.array(z.string()),
        recommendations: z.array(z.string()),
    }),
});

export type VisionValidatorInput = z.infer<typeof VisionSynthesizerInputSchema>;
export type VisionValidatorOutput = z.infer<typeof VisionSynthesizerOutputSchema>;


// Quality Gate 1
export const QualityGate1InputSchema = z.object({
  visionDocument: VisionSynthesizerOutputSchema,
});
export const QualityGate1OutputSchema = z.object({
  qualityGateReport: z.object({
    gateName: z.string(),
    timestamp: z.string(),
    checks: z.object({
      clarity: z.object({ score: z.number(), reasoning: z.string() }),
      compliance: z.object({ passed: z.boolean(), reasoning: z.string() }),
      feasibility: z.object({ passed: z.boolean(), reasoning: z.string() }),
      completeness: z.object({ score: z.number(), reasoning: z.string() }),
    }),
    summary: z.object({
      overallScore: z.number(),
      overallPassed: z.boolean(),
      issuesToAddress: z.array(z.string()),
    }),
  }),
});

export type QualityGate1Input = z.infer<typeof QualityGate1InputSchema>;
export type QualityGate1Output = z.infer<typeof QualityGate1OutputSchema>;


// === MODULE 2: Creative Foundation ===

// Agent 2.1: Story Architect
export const StoryArchitectInputSchema = z.object({
    visionDocument: VisionSynthesizerOutputSchema,
});
export const StoryArchitectOutputSchema = z.object({
    storyArchitecture: z.object({
        logline: z.string(),
        threeActStructure: z.object({
            act1_setup: z.object({
                durationSeconds: z.number(),
                description: z.string(),
                keyBeats: z.array(z.string()),
            }),
            act2_confrontation: z.object({
                durationSeconds: z.number(),
                description: z.string(),
                keyBeats: z.array(z.string()),
            }),
            act3_resolution: z.object({
                durationSeconds: z.number(),
                description: z.string(),
                keyBeats: z.array(z.string()),
            }),
        }),
        pacing: z.string(),
        characterMotivations: z.array(z.object({
            character: z.string(),
            coreDesire: z.string(),
            conflictPoint: z.string(),
            resolutionBeat: z.string(),
        })),
        narrativeInnovations: z.object({
            novelTwists: z.array(z.object({
                twistTitle: z.string(),
                setupBeat: z.string(),
                payoffBeat: z.string(),
                thematicSymbolCallback: z.string(),
            })),
            inventedBeats: z.array(z.object({
                beatName: z.string(),
                act: z.string(),
                description: z.string(),
                emotionalTarget: z.string(),
            })),
        }),
        qualityChecklist: z.object({
            distinctMotivationsConfirmed: z.boolean(),
            twoPlusNovelTwistsConfirmed: z.boolean(),
            symbolCallbacksEmbedded: z.boolean(),
            newBeatsBeyondSource: z.boolean(),
        }),
    }),
});
export type StoryArchitectInput = z.infer<typeof StoryArchitectInputSchema>;
export type StoryArchitectOutput = z.infer<typeof StoryArchitectOutputSchema>;

// Agent 2.2: Emotional Arc Designer
export const EmotionalArcDesignerInputSchema = z.object({
    visionDocument: VisionSynthesizerOutputSchema,
});
export const EmotionalArcDesignerOutputSchema = z.object({
    emotionalArc: z.object({
        emotionalJourney: z.array(z.object({
            time: z.string(),
            emotion: z.string(),
            intensity: z.number(),
        })),
        keyEmotionalShift: z.object({
            trigger: z.string(),
            from: z.string(),
            to: z.string(),
        }),
        sensoryRecommendations: z.object({
            visual: z.array(z.string()),
            audio: z.array(z.string()),
        }),
    }),
});
export type EmotionalArcDesignerInput = z.infer<typeof EmotionalArcDesignerInputSchema>;
export type EmotionalArcDesignerOutput = z.infer<typeof EmotionalArcDesignerOutputSchema>;

// Agent 2.3: Theme & Symbolism
export const ThemeSymbolismInputSchema = z.object({
    visionDocument: VisionSynthesizerOutputSchema,
});
export const ThemeSymbolismOutputSchema = z.object({
    thematicElements: z.object({
        coreTheme: z.string(),
        primarySymbol: z.object({
            symbol: z.string(),
            meaning: z.string(),
        }),
        secondarySymbol: z.object({
            symbol: z.string(),
            meaning: z.string(),
        }),
        motifIntegrationPlan: z.array(z.string()),
    }),
});
export type ThemeSymbolismInput = z.infer<typeof ThemeSymbolismInputSchema>;
export type ThemeSymbolismOutput = z.infer<typeof ThemeSymbolismOutputSchema>;

// Quality Gate 2
export const QualityGate2InputSchema = z.object({
    storyArchitecture: StoryArchitectOutputSchema,
    emotionalArc: EmotionalArcDesignerOutputSchema,
    thematicElements: ThemeSymbolismOutputSchema,
});
export const QualityGate2OutputSchema = z.object({
    qualityGateReport: z.object({
        gateName: z.string(),
        timestamp: z.string(),
        checks: z.object({
            cohesion: z.object({ passed: z.boolean(), reasoning: z.string() }),
            impact: z.object({ score: z.number(), reasoning: z.string() }),
            depth: z.object({ score: z.number(), reasoning: z.string() }),
        }),
        summary: z.object({
            overallScore: z.number(),
            overallPassed: z.boolean(),
            issuesToAddress: z.array(z.string()),
        }),
    }),
});
export type QualityGate2Input = z.infer<typeof QualityGate2InputSchema>;
export type QualityGate2Output = z.infer<typeof QualityGate2OutputSchema>;


// === MODULE 3: Visual Design ===

// Agent 3.3: Color Script
export const ColorScriptInputSchema = z.object({
    visionDocument: VisionSynthesizerOutputSchema,
    emotionalArc: EmotionalArcDesignerOutputSchema,
});
export const ColorScriptOutputSchema = z.object({
    colorScript: z.object({
        masterPalette: z.array(z.object({
            name: z.string(),
            hex: z.string(),
            purpose: z.string(),
        })),
        colorJourney: z.object({
            act1_setup: z.object({
                dominantColors: z.array(z.string()),
                mood: z.string(),
                lightingColor: z.string(),
            }),
            act2_confrontation: z.object({
                dominantColors: z.array(z.string()),
                mood: z.string(),
                lightingColor: z.string(),
            }),
            act3_resolution: z.object({
                dominantColors: z.array(z.string()),
                mood: z.string(),
                lightingColor: z.string(),
            }),
        }),
        colorRules: z.object({
            characterBackgroundSeparation: z.string(),
            symbolicColorUsage: z.string(),
        }),
    }),
});
export type ColorScriptInput = z.infer<typeof ColorScriptInputSchema>;
export type ColorScriptOutput = z.infer<typeof ColorScriptOutputSchema>;

// Agent 3.1: Character Design
export const CharacterDesignOutputSchema = z.object({
    characterDesign: z.object({
      characterIdentity: z.object({
        name: z.string(),
        faceStructure: z.string(),
        eyes: z.object({
          shape: z.string(),
          irisPattern: z.string(),
          color: z.object({ name: z.string(), hex: z.string() }),
          highlightStyle: z.string(),
        }),
        hair: z.object({
          style: z.string(),
          length: z.string(),
          colorPrimary: z.object({ name: z.string(), hex: z.string() }),
          colorHighlightsDescription: z.string(),
          movementPhysics: z.string(),
        }),
      }),
      costumeAndProps: z.object({
        overview: z.string(),
        mainGarment: z.object({
          type: z.string(),
          fabric: z.string(),
          color: z.object({ name: z.string(), hex: z.string() }),
          details: z.array(z.string()),
        }),
        accessories: z.array(z.object({
          item: z.string(),
          description: z.string(),
        })),
      }),
      motivationLinks: z.array(z.object({
        storyBeat: z.string(),
        emotionalArcMoment: z.string(),
        motivationDetail: z.string(),
      })),
      supportingElements: z.object({
        supportingCast: z.array(z.object({
          name: z.string(),
          visualHook: z.string(),
          screenFunction: z.string(),
          emotionalArcJustification: z.string(),
          themeJustification: z.string(),
        })),
        backgroundMicroDetails: z.array(z.object({
          element: z.string(),
          animationCue: z.string(),
          emotionalArcJustification: z.string(),
          themeJustification: z.string(),
        })),
      }),
      animationRequirements: z.object({
        expressionRange: z.array(z.string()),
        signatureMovements: z.array(z.string()),
        secondaryAnimation: z.array(z.string()),
      }),
      consistencyRules: z.array(z.string()),
      qualityChecklist: z.object({
        supportingCastInvented: z.boolean(),
        microDetailsInvented: z.boolean(),
        emotionalThemeAlignmentVerified: z.boolean(),
        colorPaletteComplianceConfirmed: z.boolean(),
      }),
    }),
});
export const CharacterDesignInputSchema = z.object({
    visionDocument: VisionSynthesizerOutputSchema,
    storyArchitecture: StoryArchitectOutputSchema,
    emotionalArc: EmotionalArcDesignerOutputSchema,
    thematicElements: ThemeSymbolismOutputSchema,
    colorScript: ColorScriptOutputSchema,
});
export type CharacterDesignInput = z.infer<typeof CharacterDesignInputSchema>;
export type CharacterDesignOutput = z.infer<typeof CharacterDesignOutputSchema>;

// Agent 3.2: World Design
export const WorldDesignInputSchema = z.object({
    visionDocument: VisionSynthesizerOutputSchema,
    storyArchitecture: StoryArchitectOutputSchema,
    emotionalArc: EmotionalArcDesignerOutputSchema,
    thematicElements: ThemeSymbolismOutputSchema,
    colorScript: ColorScriptOutputSchema,
});
export const WorldDesignOutputSchema = z.object({
    worldDesign: z.object({
        overallAtmosphere: z.string(),
        locations: z.array(z.object({
            locationName: z.string(),
            description: z.string(),
            environmentalStorytelling: z.string(),
        })),
        creativeAdditions: z.object({
            floraAndFauna: z.array(z.object({ name: z.string(), description: z.string(), justification: z.string() })),
            backgroundLife: z.array(z.object({ element: z.string(), description: z.string(), justification: z.string() })),
            celestialDetails: z.array(z.object({ element: z.string(), description: z.string(), justification: z.string() })),
            architecturalFlourishes: z.array(z.object({ element: z.string(), description: z.string(), justification: z.string() })),
        }),
        supportingElements: z.object({
            backgroundCharacters: z.array(z.object({
                name: z.string(),
                silhouetteDesign: z.string(),
                activityLoop: z.string(),
                emotionalArcJustification: z.string(),
                themeJustification: z.string(),
            })),
            environmentalMicroDetails: z.array(z.object({
                detail: z.string(),
                layerPlacement: z.string(),
                animationTreatment: z.string(),
                emotionalArcJustification: z.string(),
                themeJustification: z.string(),
            })),
        }),
        technicalDetails: z.object({
            backgroundArtStyle: z.string(),
            parallaxLayers: z.array(z.string()),
            livingWorldElements: z.array(z.string()),
        }),
        qualityChecklist: z.object({
            backgroundCharactersInvented: z.boolean(),
            microDetailsInvented: z.boolean(),
            emotionalThemeJustificationsPresent: z.boolean(),
            colorPaletteComplianceConfirmed: z.boolean(),
        }),
    }),
});
export type WorldDesignInput = z.infer<typeof WorldDesignInputSchema>;
export type WorldDesignOutput = z.infer<typeof WorldDesignOutputSchema>;

// Agent 3.4: Visual Integrator
export const VisualIntegratorInputSchema = z.object({
    characterDesign: CharacterDesignOutputSchema,
    worldDesign: WorldDesignOutputSchema,
    colorScript: ColorScriptOutputSchema,
});
export const VisualIntegratorOutputSchema = z.object({
    visualBible: z.object({
        characterDesign: CharacterDesignOutputSchema.shape.characterDesign,
        worldDesign: WorldDesignOutputSchema.shape.worldDesign,
        colorScript: ColorScriptOutputSchema.shape.colorScript,
    }),
});
export type VisualIntegratorInput = z.infer<typeof VisualIntegratorInputSchema>;
export type VisualIntegratorOutput = z.infer<typeof VisualIntegratorOutputSchema>;

// Quality Gate 3
export const QualityGate3InputSchema = z.object({
    visualBible: VisualIntegratorOutputSchema,
});
export const QualityGate3OutputSchema = z.object({
    qualityGateReport: z.object({
        gateName: z.string(),
        timestamp: z.string(),
        checks: z.object({
            compliance: z.object({ score: z.number(), reasoning: z.string() }),
            internalCohesion: z.object({ passed: z.boolean(), reasoning: z.string() }),
            twoDPurity: z.object({ passed: z.boolean(), reasoning: z.string() }),
            filmability: z.object({ score: z.number(), reasoning: z.string() }),
        }),
        summary: z.object({
            overallScore: z.number(),
            overallPassed: z.boolean(),
            issuesToAddress: z.array(z.string()),
        }),
    }),
});
export type QualityGate3Input = z.infer<typeof QualityGate3InputSchema>;
export type QualityGate3Output = z.infer<typeof QualityGate3OutputSchema>;

// === MODULE 4: Cinematography ===

// Agent 4.1: Camera & Framing
export const CameraFramingInputSchema = z.object({
    visualBible: VisualIntegratorOutputSchema,
    storyArchitecture: StoryArchitectOutputSchema,
    emotionalArc: EmotionalArcDesignerOutputSchema,
});
export const CameraFramingOutputSchema = z.object({
    shot_list: z.array(z.object({
        shot_number: z.number(),
        timecode: z.string(),
        duration_seconds: z.number(),
        shot_size: z.string(),
        camera_angle: z.string(),
        camera_movement: z.object({
            type: z.string(),
            speed: z.string(),
            easing: z.string(),
        }),
        focal_length_equivalent: z.string(),
        composition_rule: z.string(),
        depth_of_field: z.string(),
        action_description: z.string(),
        narrative_purpose: z.string(),
        emotional_tone: z.string(),
        creative_intent: z.string(),
        reference_films: z.array(z.string()),
        technical_notes: z.string(),
    })),
    shot_rhythm_analysis: z.object({
        average_shot_length: z.number(),
        shortest_shot: z.number(),
        longest_shot: z.number(),
        rhythm_pattern: z.string(),
    }),
    camera_philosophy_statement: z.string(),
    cinematic_techniques: z.array(z.string()),
});
export type CameraFramingInput = z.infer<typeof CameraFramingInputSchema>;
export type CameraFramingOutput = z.infer<typeof CameraFramingOutputSchema>;

// Agent 4.2: Lighting Director
export const LightingDirectorOutputSchema = z.object({
    lighting_per_shot: z.array(z.object({
        shot_number: z.number(),
        primary_light_source: z.object({
            type: z.string(),
            direction: z.string(),
            color_temp_kelvin: z.number(),
            color_hex: z.string(),
            intensity_percent: z.number(),
            creates_shadow: z.boolean(),
            shadow_quality: z.string(),
        }),
        secondary_light_source: z.object({
            type: z.string(),
            direction: z.string(),
            color_hex: z.string(),
            intensity_percent: z.number(),
            creates_shadow: z.boolean(),
            special_effects: z.array(z.string()).optional(),
        }).nullable().optional(),
        ambient_light: z.object({
            color_hex: z.string(),
            intensity_percent: z.number(),
            source: z.string(),
        }).nullable(),
        special_effects: z.array(z.object({
            type: z.string(),
            trigger: z.string(),
            style: z.string(),
            color: z.string(),
        })),
        exposure_settings: z.object({
            overall_exposure_ev: z.number(),
            highlight_clipping_limit: z.string(),
            shadow_detail_preservation: z.string(),
        }).optional(),
        mood_descriptor: z.string(),
    })),
    lighting_evolution: z.record(z.string(), z.string()),
    lighting_philosophy: z.string(),
});
export const LightingDirectorInputSchema = z.object({
    cameraFraming: CameraFramingOutputSchema,
    visualBible: VisualIntegratorOutputSchema,
});
export type LightingDirectorInput = z.infer<typeof LightingDirectorInputSchema>;
export type LightingDirectorOutput = z.infer<typeof LightingDirectorOutputSchema>;

// Agent 4.3: Motion Choreographer
export const MotionChoreographerOutputSchema = z.object({
    motion_per_shot: z.array(z.object({
        shot_number: z.number(),
        primary_action: z.object({
            subject: z.string(),
            movement_type: z.string(),
            animation_quality: z.string(),
            timing_frames: z.object({
                start_pose_hold: z.number().optional(),
                anticipation_frames: z.number().optional(),
                main_action_frames: z.number().optional(),
                follow_through_frames: z.number().optional(),
            }).optional(),
            arcs: z.string().optional(),
            easing: z.string().optional(),
        }),
        secondary_animation: z.array(z.object({
            element: z.string(),
            behavior: z.string(),
            physics: z.string().optional(),
        })),
        impact_frames: z.array(z.object({
            trigger_timecode: z.string(),
            type: z.string(),
            description: z.string(),
            effect: z.string().optional(),
        })),
        environmental_motion: z.object({
            wind: z.string().optional(),
            light_flicker: z.string().optional(),
        }).passthrough(),
    })),
    transitions: z.array(z.object({
        from_shot: z.number(),
        to_shot: z.number(),
        transition_type: z.string(),
        duration_frames: z.number(),
        description: z.string(),
    })),
    sakuga_moments: z.array(z.object({
        shot_numbers: z.array(z.number()),
        description: z.string(),
        special_techniques: z.array(z.string()),
        reference_animator: z.string(),
    })),
});
export const MotionChoreographerInputSchema = z.object({
    cameraFraming: CameraFramingOutputSchema,
    emotionalArc: EmotionalArcDesignerOutputSchema,
});
export type MotionChoreographerInput = z.infer<typeof MotionChoreographerInputSchema>;
export type MotionChoreographerOutput = z.infer<typeof MotionChoreographerOutputSchema>;

// Agent 4.4: Cinematography Integrator
const IntegratedShotSchema = z.object({
    shot_number: z.number(),
    timecode: z.string(),
    duration_seconds: z.number(),
    action_description: z.string(),
    narrative_purpose: z.string(),
    emotional_tone: z.string(),
    camera: z.object({
      shot_size: z.string(),
      camera_angle: z.string(),
      camera_movement: z.any(),
      focal_length_equivalent: z.string(),
      composition_rule: z.string(),
      depth_of_field: z.string(),
    }),
    lighting: LightingDirectorOutputSchema.shape.lighting_per_shot.element.omit({ shot_number: true }).nullable(),
    motion: MotionChoreographerOutputSchema.shape.motion_per_shot.element.omit({ shot_number: true }).nullable(),
  });
export const CinematographyIntegratorInputSchema = z.object({
    cameraFraming: CameraFramingOutputSchema,
    lighting: LightingDirectorOutputSchema,
    motion: MotionChoreographerOutputSchema,
});
export const CinematographyIntegratorOutputSchema = z.object({
    cinematographyBible: z.object({
        camera_philosophy_statement: z.string(),
        lighting_philosophy: z.string(),
        shot_rhythm_analysis: z.any(),
        final_shot_list: z.array(IntegratedShotSchema),
        validation_report: z.object({
            issues_found: z.number(),
            fixes_applied: z.array(z.string()),
        }),
    }),
});
export type CinematographyIntegratorInput = z.infer<typeof CinematographyIntegratorInputSchema>;
export type CinematographyIntegratorOutput = z.infer<typeof CinematographyIntegratorOutputSchema>;

// Quality Gate 4
export const QualityGate4InputSchema = z.object({
    cinematographyBible: CinematographyIntegratorOutputSchema,
});
export const QualityGate4OutputSchema = z.object({
    qualityGateReport: z.object({
        gateName: z.string(),
        timestamp: z.string(),
        checks: z.object({
            coherence: z.object({ passed: z.boolean(), reasoning: z.string() }),
            feasibility: z.object({ passed: z.boolean(), reasoning: z.string() }),
            believability: z.object({ score: z.number(), reasoning: z.string() }),
            flow: z.object({ score: z.number(), reasoning: z.string() }),
        }),
        summary: z.object({
            overallScore: z.number(),
            overallPassed: z.boolean(),
            issuesToAddress: z.array(z.string()),
        }),
    }),
});
export type QualityGate4Input = z.infer<typeof QualityGate4InputSchema>;
export type QualityGate4Output = z.infer<typeof QualityGate4OutputSchema>;

// === MODULE 5: Audio Design ===

// Agent 5.1: Sound Design
export const SoundDesignInputSchema = z.object({
    cinematographyBible: CinematographyIntegratorOutputSchema,
    qaFeedback: z.array(z.string()).optional(),
});
export const SoundDesignOutputSchema = z.object({
    sound_effects_per_shot: z.array(z.object({
        shot_number: z.number(),
        foley: z.array(z.object({ sound: z.string(), timing: z.string(), volume_db: z.number(), pan: z.string(), description: z.string() })),
        sfx: z.array(z.object({ sound: z.string(), timing: z.string(), volume_db: z.number(), frequency_range: z.string().optional(), spatial_audio: z.string().optional(), special_processing: z.string().optional(), description: z.string() })),
        ambience: z.array(z.object({ sound: z.string(), volume_db: z.number(), description: z.string() })),
    })),
    sound_philosophy: z.string(),
    silence_moments: z.array(z.object({ timecode: z.string(), description: z.string(), only_remaining_sound: z.string().optional() })),
});
export type SoundDesignInput = z.infer<typeof SoundDesignInputSchema>;
export type SoundDesignOutput = z.infer<typeof SoundDesignOutputSchema>;

// Agent 5.2: Music Composer
export const MusicComposerInputSchema = z.object({
    cinematographyBible: CinematographyIntegratorOutputSchema,
    emotionalArc: EmotionalArcDesignerOutputSchema,
    qaFeedback: z.array(z.string()).optional(),
});
const MusicalPartSchema = z.object({
    duration: z.string(),
    description: z.string(),
    instrumentation: z.array(z.string()),
    tempo_bpm: z.union([z.number(), z.string()]),
    key: z.string(),
    dynamic_level: z.string(),
});
export const MusicComposerOutputSchema = z.object({
    musical_structure: z.object({
        intro: MusicalPartSchema,
        build: MusicalPartSchema,
        climax: MusicalPartSchema,
        resolution: MusicalPartSchema,
    }),
    sync_points: z.array(z.object({ musical_beat: z.string(), timecode: z.string(), syncs_with: z.string() })),
    leitmotif: z.object({ theme: z.string(), appears_at: z.array(z.string()), meaning: z.string(), instrumentation_evolution: z.string() }).optional(),
    reference_composers: z.array(z.string()),
});
export type MusicComposerInput = z.infer<typeof MusicComposerInputSchema>;
export type MusicComposerOutput = z.infer<typeof MusicComposerOutputSchema>;

// Agent 5.3: Dialogue Director
export const DialogueDirectorInputSchema = z.object({
    storyArchitecture: StoryArchitectOutputSchema,
    characterDesign: CharacterDesignOutputSchema,
    qaFeedback: z.array(z.string()).optional(),
});
export const DialogueDirectorOutputSchema = z.object({
    has_dialogue: z.boolean(),
    dialogue_list: z.array(z.object({
        character: z.string(),
        timecode: z.string(),
        line: z.string(),
        direction: z.string().optional(),
        emotion: z.string().optional(),
        volume_db: z.number().optional(),
        processing: z.string().optional(),
        performance_direction: z.string().optional(),
    })).optional(),
    non_verbal_vocalizations: z.array(z.object({
        character: z.string(),
        timecode: z.string(),
        type: z.string(),
        description: z.string()
    })).optional(),
    reasoning: z.string().optional(),
});
export type DialogueDirectorInput = z.infer<typeof DialogueDirectorInputSchema>;
export type DialogueDirectorOutput = z.infer<typeof DialogueDirectorOutputSchema>;

// Agent 5.4: Audio Integrator
export const AudioIntegratorInputSchema = z.object({
    soundDesign: SoundDesignOutputSchema,
    music: MusicComposerOutputSchema,
    dialogue: DialogueDirectorOutputSchema,
    cinematographyBible: CinematographyIntegratorOutputSchema,
});
export const AudioIntegratorOutputSchema = z.object({
    audioBible: z.object({
        soundDesign: SoundDesignOutputSchema,
        music: MusicComposerOutputSchema,
        dialogue: DialogueDirectorOutputSchema,
        final_sync_report: z.object({
            validation_passed: z.boolean(),
            issues: z.array(z.string()),
        }),
    }),
});
export type AudioIntegratorInput = z.infer<typeof AudioIntegratorInputSchema>;
export type AudioIntegratorOutput = z.infer<typeof AudioIntegratorOutputSchema>;

// Quality Gate 5
export const QualityGate5InputSchema = z.object({
    audioBible: AudioIntegratorOutputSchema,
    cinematographyBible: CinematographyIntegratorOutputSchema,
});
export const QualityGate5OutputSchema = z.object({
    qualityGateReport: z.object({
        gateName: z.string(),
        timestamp: z.string(),
        checks: z.object({
            syncPrecision: z.object({ passed: z.boolean(), reasoning: z.string() }),
            mixBalance: z.object({ score: z.number(), reasoning: z.string() }),
            emotionalEnhancement: z.object({ score: z.number(), reasoning: z.string() }),
        }),
        summary: z.object({
            overallScore: z.number(),
            overallPassed: z.boolean(),
            issuesToAddress: z.array(z.string()),
        }),
    }),
});
export type QualityGate5Input = z.infer<typeof QualityGate5InputSchema>;
export type QualityGate5Output = z.infer<typeof QualityGate5OutputSchema>;


// === MODULE 6: Technical Specification ===

// Agent 6.1: Animation Technique
export const AnimationTechniqueInputSchema = z.object({
    visualBible: VisualIntegratorOutputSchema,
    motionChoreography: MotionChoreographerOutputSchema,
});
export const AnimationTechniqueOutputSchema = z.object({
    animation_specs_per_shot: z.array(z.object({
        shot_number: z.number(),
        animation_method: z.string(),
        key_frames: z.array(z.number()),
        in_between_frames: z.string(),
        held_frames: z.array(z.number()),
        smear_frames: z.array(z.number()).optional(),
        linework: z.object({ weight_range: z.string(), colored_lines: z.boolean(), line_color_palette: z.array(z.string()) }),
        cel_shading: z.object({ tone_levels: z.number(), painted_light_accents: z.boolean() }),
    })),
    effects_animation: z.array(z.object({ effect_type: z.string(), shots: z.array(z.number()), method: z.string(), particle_count: z.string().optional(), animation_notes: z.string() })),
});
export type AnimationTechniqueInput = z.infer<typeof AnimationTechniqueInputSchema>;
export type AnimationTechniqueOutput = z.infer<typeof AnimationTechniqueOutputSchema>;

// Agent 6.2: VFX Designer
export const VFXDesignerInputSchema = z.object({
    visualBible: VisualIntegratorOutputSchema,
    lightingDesign: LightingDirectorOutputSchema,
});
export const VFXDesignerOutputSchema = z.object({
    vfx_specs: z.array(z.object({
        shot_number: z.number(),
        effect_name: z.string(),
        technique: z.string(),
        layers: z.array(z.object({ layer_name: z.string(), blend_mode: z.string(), opacity: z.number(), notes: z.string() })),
        notes: z.string(),
    })),
});
export type VFXDesignerInput = z.infer<typeof VFXDesignerInputSchema>;
export type VFXDesignerOutput = z.infer<typeof VFXDesignerOutputSchema>;

// Agent 6.3: Timing & Pacing
export const TimingPacingInputSchema = z.object({
    cinematographyBible: CinematographyIntegratorOutputSchema,
    audioBible: AudioIntegratorOutputSchema,
});
export const TimingPacingOutputSchema = z.object({
    final_timing_sheet: z.array(z.object({
        shot_number: z.number(),
        original_duration_seconds: z.number(),
        adjusted_duration_seconds: z.number(),
        adjustment_reason: z.string(),
    })),
    total_adjusted_duration: z.number(),
});
export type TimingPacingInput = z.infer<typeof TimingPacingInputSchema>;
export type TimingPacingOutput = z.infer<typeof TimingPacingOutputSchema>;

// Agent 6.4: Technical Integrator
export const TechnicalIntegratorInputSchema = z.object({
    animation: AnimationTechniqueOutputSchema,
    vfx: VFXDesignerOutputSchema,
    timing: TimingPacingOutputSchema,
});
export const TechnicalIntegratorOutputSchema = z.object({
    technicalBible: z.object({
        animationTechnique: AnimationTechniqueOutputSchema,
        vfxDesign: VFXDesignerOutputSchema,
        finalTiming: TimingPacingOutputSchema,
        feasibility_report: z.object({
            overall_difficulty: z.string(),
            production_notes: z.array(z.string()),
            warnings: z.array(z.string()),
        }),
    }),
});
export type TechnicalIntegratorInput = z.infer<typeof TechnicalIntegratorInputSchema>;
export type TechnicalIntegratorOutput = z.infer<typeof TechnicalIntegratorOutputSchema>;

// Quality Gate 6
export const QualityGate6InputSchema = z.object({ technicalBible: TechnicalIntegratorOutputSchema });
export const QualityGate6OutputSchema = z.object({
    qualityGateReport: z.object({
        gateName: z.string(),
        timestamp: z.string(),
        checks: z.object({
            achievability: z.object({ passed: z.boolean(), reasoning: z.string() }),
            complexity: z.object({ score: z.number(), reasoning: z.string() }),
            clarity: z.object({ score: z.number(), reasoning: z.string() }),
        }),
        summary: z.object({
            overallScore: z.number(),
            overallPassed: z.boolean(),
            issuesToAddress: z.array(z.string()),
        }),
    }),
});
export type QualityGate6Input = z.infer<typeof QualityGate6InputSchema>;
export type QualityGate6Output = z.infer<typeof QualityGate6OutputSchema>;

// === MODULE 7: Synthesis & Refinement ===

// Agent 7.1: Master Integrator
export const MasterIntegratorInputSchema = z.object({
    vision: VisionSynthesizerOutputSchema,
    story: StoryArchitectOutputSchema,
    emotionalArc: EmotionalArcDesignerOutputSchema,
    thematicElements: ThemeSymbolismOutputSchema,
    visual: VisualIntegratorOutputSchema,
    cine: CinematographyIntegratorOutputSchema,
    audio: AudioIntegratorOutputSchema,
    tech: TechnicalIntegratorOutputSchema,
    qaFeedback: z.array(z.string()).optional(),
});
export const MasterIntegratorOutputSchema = z.object({
    masterPrompt: z.object({
        director_vision_statement: z.string(),
        unified_story: z.object({
            logline: z.string(),
            three_act_structure: StoryArchitectOutputSchema.shape.storyArchitecture.shape.threeActStructure,
            emotional_arc: EmotionalArcDesignerOutputSchema.shape.emotionalArc,
            thematic_elements: ThemeSymbolismOutputSchema.shape.thematicElements,
        }),
        complete_visual_bible: VisualIntegratorOutputSchema.shape.visualBible,
        final_shot_list_with_all_specs: z.array(z.any()), // Can be tightened later
        complete_audio_bible: AudioIntegratorOutputSchema.shape.audioBible,
        production_ready_technical_bible: TechnicalIntegratorOutputSchema.shape.technicalBible,
    }),
});
export type MasterIntegratorInput = z.infer<typeof MasterIntegratorInputSchema>;
export type MasterIntegratorOutput = z.infer<typeof MasterIntegratorOutputSchema>;

// Quality Gate 7 (Agent 7.2)
export const QualityGate7InputSchema = z.object({ masterPrompt: MasterIntegratorOutputSchema });
export const QualityGate7OutputSchema = z.object({
    qualityGateReport: z.object({
        gateName: z.string(),
        timestamp: z.string(),
        checks: z.object({
            cohesionAndVision: z.object({ score: z.number(), reasoning: z.string() }),
            storyAndNarrative: z.object({ score: z.number(), reasoning: z.string() }),
            visualDesign: z.object({ score: z.number(), reasoning: z.string() }),
            cinematography: z.object({ score: z.number(), reasoning: z.string() }),
            audioHarmony: z.object({ score: z.number(), reasoning: z.string() }),
            technicalViability: z.object({ score: z.number(), reasoning: z.string() }),
            festivalGradeFactor: z.object({ score: z.number(), reasoning: z.string() }),
        }),
        summary: z.object({
            overallScore: z.number(),
            overallPassed: z.boolean(),
            issuesToAddress: z.array(z.string()),
        }),
    }),
});
export type QualityGate7Input = z.infer<typeof QualityGate7InputSchema>;
export type QualityGate7Output = z.infer<typeof QualityGate7OutputSchema>;

// Agent 7.3: Prompt Formatter
const FormattedShotSchema = z.object({
    shot: z.number(),
    timecode: z.string(),
    prompt: z.string(),
    camera: z.object({
      shot_size: z.string(),
      angle: z.string(),
      movement: z.string(),
    }),
    audio_notes: z.string(),
  });
export const PromptFormatterInputSchema = z.object({ masterPrompt: MasterIntegratorOutputSchema });
export const PromptFormatterOutputSchema = z.object({
    finalFormattedPrompt: z.object({
        metadata: z.object({
            version: z.string(),
            generated_at: z.string(),
            title: z.string(),
        }),
        global_settings: z.object({
            duration_seconds: z.literal(15),
            fps: z.literal(24),
            aspect_ratio: z.string(),
            style_prompt: z.string(),
        }),
        shot_by_shot_instructions: z.array(FormattedShotSchema),
    }),
});
export type PromptFormatterInput = z.infer<typeof PromptFormatterInputSchema>;
export type PromptFormatterOutput = z.infer<typeof PromptFormatterOutputSchema>;