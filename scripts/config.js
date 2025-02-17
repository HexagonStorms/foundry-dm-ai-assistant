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
        return {
            overview: game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.WORLD_OVERVIEW),
            factions: game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.MAJOR_FACTIONS),
            npcs: game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.IMPORTANT_NPCS),
            plots: game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.CURRENT_PLOTS),
            locations: game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.LOCATIONS)
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