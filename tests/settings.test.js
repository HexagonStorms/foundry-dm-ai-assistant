describe('AIDMAssistant', () => {
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
        
        // Spy on game.settings methods
        global.game.settings.get = jest.fn().mockReturnValue("test-value");
        global.game.settings.set = jest.fn().mockResolvedValue(undefined);
        global.game.settings.register = jest.fn();
        global.game.settings.registerMenu = jest.fn();
    });

    test('getSetting should call game.settings.get with correct parameters', () => {
        const result = AIDMAssistant.getSetting('test-key');
        
        expect(global.game.settings.get).toHaveBeenCalledWith(AIDMAssistant.ID, 'test-key');
        expect(result).toBe("test-value");
    });

    test('setSetting should call game.settings.set with correct parameters', async () => {
        await AIDMAssistant.setSetting('test-key', 'new-value');
        
        expect(global.game.settings.set).toHaveBeenCalledWith(AIDMAssistant.ID, 'test-key', 'new-value');
    });

    test('getAllContext should format context correctly', () => {
        // Setup mock return values for context settings
        const mockSettings = {
            [AIDMAssistant.SETTINGS.WORLD_OVERVIEW]: "World info",
            [AIDMAssistant.SETTINGS.MAJOR_FACTIONS]: "Faction info",
            [AIDMAssistant.SETTINGS.IMPORTANT_NPCS]: "NPC info",
            [AIDMAssistant.SETTINGS.CURRENT_PLOTS]: "Plot info",
            [AIDMAssistant.SETTINGS.LOCATIONS]: "Location info"
        };
        
        // Mock getSetting to return values from our mock
        AIDMAssistant.getSetting = jest.fn(key => mockSettings[key] || "");
        
        const result = AIDMAssistant.getAllContext();
        
        // Verify the result contains expected sections
        expect(result).toContain("World Overview:\nWorld info");
        expect(result).toContain("Major Factions:\nFaction info");
        expect(result).toContain("Important NPCs:\nNPC info");
        expect(result).toContain("Current Plots:\nPlot info");
        expect(result).toContain("Locations:\nLocation info");
    });
});