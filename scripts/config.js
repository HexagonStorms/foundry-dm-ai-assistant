class AIDMConfig extends FormApplication {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "aidm-config",
            title: "AI DM World Configuration",
            template: "modules/ai-dm-assistant/templates/config.hbs",
            width: 720,
            height: "auto",
            tabs: [{navSelector: ".tabs", contentSelector: ".content", initial: "overview"}],
            classes: ["aidm-config", "sheet"],
            resizable: true
        });
    }

    getData(options) {
        const modelProvider = game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.MODEL_PROVIDER);
        
        return {
            overview: game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.WORLD_OVERVIEW),
            factions: game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.MAJOR_FACTIONS),
            npcs: game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.IMPORTANT_NPCS),
            plots: game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.CURRENT_PLOTS),
            locations: game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.LOCATIONS),
            openaiKey: game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.OPENAI_KEY),
            anthropicKey: game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.ANTHROPIC_KEY),
            maxTokens: game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.MAX_TOKENS),
            creativity: game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.DEFAULT_CREATIVITY),
            isOpenAI: modelProvider === "openai",
            isClaude: modelProvider === "claude"
        };
    }

    async _updateObject(event, formData) {
        for (const [key, value] of Object.entries(formData)) {
            let settingKey;
            switch(key) {
                case 'overview':
                    settingKey = AIDMAssistant.SETTINGS.WORLD_OVERVIEW;
                    break;
                case 'factions':
                    settingKey = AIDMAssistant.SETTINGS.MAJOR_FACTIONS;
                    break;
                case 'npcs':
                    settingKey = AIDMAssistant.SETTINGS.IMPORTANT_NPCS;
                    break;
                case 'plots':
                    settingKey = AIDMAssistant.SETTINGS.CURRENT_PLOTS;
                    break;
                case 'locations':
                    settingKey = AIDMAssistant.SETTINGS.LOCATIONS;
                    break;
                case 'model-provider':
                    settingKey = AIDMAssistant.SETTINGS.MODEL_PROVIDER;
                    break;
                case 'openai-api-key':
                    settingKey = AIDMAssistant.SETTINGS.OPENAI_KEY;
                    break;
                case 'anthropic-api-key':
                    settingKey = AIDMAssistant.SETTINGS.ANTHROPIC_KEY;
                    break;
                case 'max-tokens':
                    settingKey = AIDMAssistant.SETTINGS.MAX_TOKENS;
                    break;
                case 'default-creativity':
                    settingKey = AIDMAssistant.SETTINGS.DEFAULT_CREATIVITY;
                    break;
            }
            if (settingKey) {
                await game.settings.set(AIDMAssistant.ID, settingKey, value);
            }
        }
    }

    activateListeners(html) {
        super.activateListeners(html);
        
        // Add any additional event listeners here
        html.find('.preview-context').click(this._onPreviewContext.bind(this));
        
        // Setup AI provider change handler
        html.find('select[name="model-provider"]').change(this._onProviderChange.bind(this));
        
        // Initialize visibility based on current selection
        this._updateApiKeyVisibility(html);
        
        // Setup range value display
        html.find('input[type="range"]').on('input', this._updateRangeValue.bind(this));
    }
    
    _updateRangeValue(event) {
        const input = event.currentTarget;
        const valueDisplay = input.nextElementSibling;
        valueDisplay.textContent = input.value;
    }
    
    _onProviderChange(event) {
        this._updateApiKeyVisibility($(event.currentTarget).parents('form'));
    }
    
    _updateApiKeyVisibility(html) {
        const provider = html.find('select[name="model-provider"]').val();
        
        // Hide all API key groups first
        html.find('.api-key-group').hide();
        
        // Show only the selected provider's API key group
        html.find(`.api-key-group[data-provider="${provider}"]`).show();
    }

    async _onPreviewContext(event) {
        event.preventDefault();
        const context = AIDMAssistant.getAllContext();
        
        new Dialog({
            title: "World Context Preview",
            content: `<div style="height: 400px; overflow-y: scroll;"><pre>${context}</pre></div>`,
            buttons: {
                close: {
                    label: "Close"
                }
            }
        }).render(true);
    }
}