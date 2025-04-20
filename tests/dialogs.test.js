// Import the dialog classes
// Since we're refactoring to separate files, we'll test against the mocks

describe('CreationOptionsDialog', () => {
    beforeEach(() => {
        // Reset JournalGenerationDialog create method before each test
        global.JournalGenerationDialog = {
            create: jest.fn().mockResolvedValue({})
        };
        
        // Create dialog class for testing
        global.CreationOptionsDialog = require('../scripts/dialogs/CreationOptionsDialog');
    });

    test('create() should return a Promise', () => {
        const result = CreationOptionsDialog.create();
        expect(result).toBeInstanceOf(Promise);
    });

    test('should create a Dialog with correct options', async () => {
        // Create a spy on the Dialog constructor
        const dialogSpy = jest.spyOn(global, 'Dialog');
        
        try {
            await CreationOptionsDialog.create();
        } catch (e) {
            // Expect promise to reject due to test mocks
        }
        
        // Check that Dialog was created with expected properties
        expect(dialogSpy).toHaveBeenCalled();
        const dialogOptions = dialogSpy.mock.calls[0][0];
        
        expect(dialogOptions.title).toBe("AI DM Assistant");
        expect(dialogOptions.content).toContain("What would you like to create?");
        expect(dialogOptions.buttons).toHaveProperty('cancel');
        expect(dialogOptions.render).toBeInstanceOf(Function);
    });
});

describe('JournalGenerationDialog', () => {
    beforeEach(() => {
        // Create dialog class for testing
        global.JournalGenerationDialog = require('../scripts/dialogs/JournalGenerationDialog');
        
        // Mock AIAPI.generateContent
        global.AIAPI.generateContent = jest.fn().mockResolvedValue("Generated content");
    });

    test('create() should return a Promise', () => {
        const result = JournalGenerationDialog.create();
        expect(result).toBeInstanceOf(Promise);
    });

    test('should create a Dialog with correct options', async () => {
        // Create a spy on the Dialog constructor
        const dialogSpy = jest.spyOn(global, 'Dialog');
        
        try {
            await JournalGenerationDialog.create();
        } catch (e) {
            // Expect promise to reject due to test mocks
        }
        
        // Check that Dialog was created with expected properties
        expect(dialogSpy).toHaveBeenCalled();
        const dialogOptions = dialogSpy.mock.calls[0][0];
        
        expect(dialogOptions.title).toBe("Generate Journal Entry");
        expect(dialogOptions.content).toContain("<textarea name=\"prompt\"");
        expect(dialogOptions.buttons).toHaveProperty('generate');
        expect(dialogOptions.buttons).toHaveProperty('cancel');
    });
});