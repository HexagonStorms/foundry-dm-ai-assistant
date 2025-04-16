class AIDMAssistant {
    static ID = 'ai-dm-assistant';
    
    static SETTINGS = {
        OPENAI_KEY: 'openai-api-key',
        ANTHROPIC_KEY: 'anthropic-api-key',
        GOOGLE_KEY: 'google-api-key',
        MODEL_PROVIDER: 'model-provider',
        WORLD_OVERVIEW: 'world-overview',
        MAJOR_FACTIONS: 'major-factions',
        IMPORTANT_NPCS: 'important-npcs',
        CURRENT_PLOTS: 'current-plots',
        LOCATIONS: 'locations',
        DEFAULT_CREATIVITY: 'default-creativity',
        MAX_TOKENS: 'max-tokens'
    }

    static initialize() {
        
        // Add menu option to open config
        game.settings.registerMenu(this.ID, 'world-config', {
            name: 'World Configuration',
            label: 'World Configuration',
            hint: 'Configure your world context and AI generation settings',
            icon: 'fas fa-globe',
            type: AIDMConfig,
            restricted: true
        });

        // API Keys
        game.settings.register(this.ID, this.SETTINGS.OPENAI_KEY, {
            name: "OpenAI API Key",
            hint: "Your OpenAI API key for GPT models",
            scope: "world",
            config: true,
            type: String,
            default: "",
            restricted: true
        });
        
        game.settings.register(this.ID, this.SETTINGS.ANTHROPIC_KEY, {
            name: "Anthropic API Key",
            hint: "Your Anthropic API key for Claude models",
            scope: "world",
            config: true,
            type: String,
            default: "",
            restricted: true
        });
        
        game.settings.register(this.ID, this.SETTINGS.MODEL_PROVIDER, {
            name: "AI Model Provider",
            hint: "Select which AI model to use for content generation",
            scope: "world",
            config: true,
            type: String,
            choices: {
                "openai": "OpenAI (GPT)",
                "claude": "Anthropic (Claude)"
            },
            default: "openai",
            restricted: true
        });

        // World Context Settings - Making these not show in the regular settings menu
        const contextSettings = {
            [this.SETTINGS.WORLD_OVERVIEW]: "General overview of your campaign world",
            [this.SETTINGS.MAJOR_FACTIONS]: "Major organizations, factions, and groups",
            [this.SETTINGS.IMPORTANT_NPCS]: "Key NPCs and characters",
            [this.SETTINGS.CURRENT_PLOTS]: "Current story arcs and plot points",
            [this.SETTINGS.LOCATIONS]: "Important locations and places of interest"
        };

        // Register all context settings
        for (const [key, hint] of Object.entries(contextSettings)) {
            game.settings.register(this.ID, key, {
                scope: "world",
                config: false, // Hide from settings menu
                type: String,
                default: ""
            });
        }

        // Other settings
        game.settings.register(this.ID, this.SETTINGS.DEFAULT_CREATIVITY, {
            name: "Default Creativity",
            hint: "Set the default creativity level for AI responses (0-100)",
            scope: "world",
            config: true,
            type: Number,
            default: 50,
            range: {
                min: 0,
                max: 100,
                step: 5
            }
        });

        game.settings.register(this.ID, this.SETTINGS.MAX_TOKENS, {
            name: "Max Response Length",
            hint: "Maximum length of AI responses in tokens",
            scope: "world",
            config: true,
            type: Number,
            default: 500,
            range: {
                min: 100,
                max: 2000,
                step: 100
            }
        });
    }

    // Helper to get all context as a formatted string
    static getAllContext() {
        const contexts = {
            "World Overview": this.getSetting(this.SETTINGS.WORLD_OVERVIEW),
            "Major Factions": this.getSetting(this.SETTINGS.MAJOR_FACTIONS),
            "Important NPCs": this.getSetting(this.SETTINGS.IMPORTANT_NPCS),
            "Current Plots": this.getSetting(this.SETTINGS.CURRENT_PLOTS),
            "Locations": this.getSetting(this.SETTINGS.LOCATIONS)
        };

        return Object.entries(contexts)
            .filter(([_, value]) => value) // Only include non-empty sections
            .map(([title, content]) => `${title}:\n${content}`)
            .join('\n\n');
    }

    static getSetting(key) {
        return game.settings.get(this.ID, key);
    }

    static async setSetting(key, value) {
        return await game.settings.set(this.ID, key, value);
    }
}