// Mock Foundry VTT globals and APIs
// Use a simple mock for Dialog - no need to extend it in tests
global.Dialog = jest.fn().mockImplementation(function(data) {
    this.data = data;
    this.rendered = false;
    
    // Add method directly to the instance
    this.render = jest.fn(() => {
        this.rendered = true;
        if (this.data.render) {
            // Create a mock HTML element with methods for testing
            const html = {
                find: (selector) => ({
                    click: (handler) => {},
                    val: () => "test value",
                    is: () => true
                })
            };
            this.data.render(html);
        }
        return this;
    });
    
    this.close = jest.fn(() => {
        this.rendered = false;
        return this;
    });
});

global.FormApplication = class FormApplication {
    constructor(object, options) {
        this.object = object;
        this.options = options;
    }
    
    static get defaultOptions() {
        return {
            template: "",
            width: 400,
            height: 400
        };
    }
    
    getData() {
        return {};
    }
    
    render(force) {
        return this;
    }
    
    async _updateObject(event, formData) {}
    
    activateListeners(html) {}
};

global.mergeObject = (obj1, obj2) => ({...obj1, ...obj2});

global.JournalEntry = {
    create: async (data) => ({
        sheet: {
            render: () => {}
        }
    })
};

global.Item = {
    create: async (data) => ({
        sheet: {
            render: () => {}
        }
    })
};

global.CONST = {
    DOCUMENT_OWNERSHIP_LEVELS: {
        NONE: 0,
        LIMITED: 1,
        OBSERVER: 2,
        OWNER: 3
    }
};

global.game = {
    settings: {
        get: (module, key) => {
            if (key === "model-provider") return "openai";
            return "";
        },
        set: async (module, key, value) => {},
        register: () => {},
        registerMenu: () => {}
    },
    user: {
        isGM: true
    },
    version: "12.0.0",
    modules: {
        get: () => null
    },
    socket: {
        on: () => {}
    }
};

global.ui = {
    notifications: {
        info: (msg) => console.log(`INFO: ${msg}`),
        error: (msg) => console.error(`ERROR: ${msg}`)
    }
};

// Make console.warn visible in tests
global.console.warn = jest.fn();

// Mock jQuery
global.$ = (selector) => ({
    parents: () => ({
        find: () => ({
            val: () => "openai"
        })
    }),
    find: () => ({
        append: () => {}
    }),
    click: (handler) => {},
    hide: () => {},
    show: () => {}
});

// Mock AIDMAssistant class
global.AIDMAssistant = {
    ID: "ai-dm-assistant",
    SETTINGS: {
        OPENAI_KEY: "openai-api-key",
        ANTHROPIC_KEY: "anthropic-api-key",
        GOOGLE_KEY: "google-api-key",
        DEEPSEEK_KEY: "deepseek-api-key",
        MODEL_PROVIDER: "model-provider",
        WORLD_OVERVIEW: "world-overview",
        MAJOR_FACTIONS: "major-factions",
        IMPORTANT_NPCS: "important-npcs",
        CURRENT_PLOTS: "current-plots",
        LOCATIONS: "locations",
        DEFAULT_CREATIVITY: "default-creativity",
        MAX_TOKENS: "max-tokens"
    },
    initialize: () => {},
    getAllContext: () => {
        // Implementation in this method is tested separately in settings.test.js
        return "World Overview:\nWorld info\n\nMajor Factions:\nFaction info\n\nImportant NPCs:\nNPC info\n\nCurrent Plots:\nPlot info\n\nLocations:\nLocation info";
    },
    getSetting: (key) => "",
    setSetting: async (key, value) => {}
};

// Mock AIAPI
global.AIAPI = {
    generateContent: async (prompt, useContext = true) => {
        return "This is test generated content";
    },
    formatContentForJournal: (content) => {
        return `<div class="ai-generated-content">${content}</div>`;
    }
};

// Make sure global classes are available
global.AIDMConfig = require('../scripts/config.js');

// Include dialog classes
global.ItemGenerationDialog = class ItemGenerationDialog {
    static async create() {
        return new Promise((resolve, reject) => {
            new Dialog({
                title: "Generate Item",
                buttons: {
                    generate: {
                        callback: async (html) => {
                            try {
                                const content = await AIAPI.generateContent("Test prompt", true);
                                const item = await Item.create({
                                    name: "Test Item",
                                    type: "weapon"
                                });
                                resolve(item);
                            } catch (error) {
                                reject(error);
                            }
                        }
                    }
                }
            }).render(true);
        });
    }
};