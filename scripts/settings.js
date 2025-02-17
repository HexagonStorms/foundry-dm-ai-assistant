class AIDMAssistant {
    static ID = 'ai-dm-assistant';
    
    static SETTINGS = {
        OPENAI_KEY: 'openai-api-key',
        ANTHROPIC_KEY: 'anthropic-api-key',
        GOOGLE_KEY: 'google-api-key',
        WORLD_CONTEXT: 'world-context',
        DEFAULT_CREATIVITY: 'default-creativity',
        MAX_TOKENS: 'max-tokens'
    }

    static initialize() {
        // Register module settings
        game.settings.register(this.ID, this.SETTINGS.OPENAI_KEY, {
            name: "OpenAI API Key",
            hint: "Your OpenAI API key for GPT models",
            scope: "world",
            config: true,
            type: String,
            default: "",
            restricted: true // Only GM can modify
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

        game.settings.register(this.ID, this.SETTINGS.WORLD_CONTEXT, {
            name: "World Context",
            hint: "Provide context about your campaign world for the AI assistant",
            scope: "world",
            config: true,
            type: String,
            default: "",
            restricted: true
        });

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

    // Helper method to get settings
    static getSetting(key) {
        return game.settings.get(this.ID, key);
    }

    // Helper method to set settings
    static async setSetting(key, value) {
        return await game.settings.set(this.ID, key, value);
    }
}