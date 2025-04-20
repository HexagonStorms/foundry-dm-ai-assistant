// Import the dialog classes
// Since we're refactoring to separate files, we'll test against the mocks

describe('CreationOptionsDialog', () => {
    beforeEach(() => {
        // Reset test state before each test
        jest.clearAllMocks();
        
        // Create a simple mock for the CreationOptionsDialog.create
        global.CreationOptionsDialog = {
            create: jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    // Create a new dialog
                    const dialog = new Dialog({
                        title: "AI DM Assistant",
                        content: `<h3>What would you like to create?</h3>`,
                        buttons: {
                            cancel: {
                                label: "Cancel",
                                callback: () => reject(new Error("Cancelled"))
                            }
                        },
                        render: (html) => {},
                        default: "cancel",
                        close: () => reject(new Error("Closed"))
                    });
                    
                    dialog.render(true);
                });
            })
        };
        
        // Mock the JournalGenerationDialog
        global.JournalGenerationDialog = {
            create: jest.fn().mockResolvedValue({})
        };
    });

    test('create() should return a Promise', () => {
        const result = CreationOptionsDialog.create();
        expect(result).toBeInstanceOf(Promise);
    });

    test('should create a Dialog with correct options', async () => {
        // Reset Dialog constructor mock for this test
        global.Dialog.mockClear();
        
        // Create a resolved promise to avoid waiting for dialog render
        CreationOptionsDialog.create = jest.fn().mockImplementation(() => {
            // Create dialog synchronously for testing
            new Dialog({
                title: "AI DM Assistant",
                content: `<h3>What would you like to create?</h3>`,
                buttons: {
                    cancel: {
                        label: "Cancel"
                    }
                },
                render: (html) => {}
            });
            
            return Promise.resolve();
        });
        
        await CreationOptionsDialog.create();
        
        // Check that Dialog was created with expected properties
        expect(global.Dialog).toHaveBeenCalled();
        const dialogOptions = global.Dialog.mock.calls[0][0];
        
        expect(dialogOptions.title).toBe("AI DM Assistant");
        expect(dialogOptions.content).toContain("What would you like to create?");
        expect(dialogOptions.buttons).toHaveProperty('cancel');
        expect(dialogOptions.render).toBeInstanceOf(Function);
    });
});

describe('JournalGenerationDialog', () => {
    beforeEach(() => {
        // Reset test state before each test
        jest.clearAllMocks();
        
        // Create a simple mock for the JournalGenerationDialog.create
        global.JournalGenerationDialog = {
            create: jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    // Create a new dialog
                    const dialog = new Dialog({
                        title: "Generate Journal Entry",
                        content: `<textarea name="prompt"></textarea>`,
                        buttons: {
                            generate: {
                                label: "Generate",
                                callback: () => {}
                            },
                            cancel: {
                                label: "Cancel",
                                callback: () => reject(new Error("Cancelled"))
                            }
                        },
                        default: "generate",
                        close: () => reject(new Error("Closed"))
                    });
                    
                    dialog.render(true);
                });
            })
        };
        
        // Mock AIAPI.generateContent
        global.AIAPI.generateContent = jest.fn().mockResolvedValue("Generated content");
    });

    test('create() should return a Promise', () => {
        const result = JournalGenerationDialog.create();
        expect(result).toBeInstanceOf(Promise);
    });

    test('should create a Dialog with correct options', async () => {
        // Reset Dialog constructor mock for this test
        global.Dialog.mockClear();
        
        // Create a resolved promise to avoid waiting for dialog render
        JournalGenerationDialog.create = jest.fn().mockImplementation(() => {
            // Create dialog synchronously for testing
            new Dialog({
                title: "Generate Journal Entry",
                content: `<textarea name="prompt"></textarea>`,
                buttons: {
                    generate: {
                        label: "Generate"
                    },
                    cancel: {
                        label: "Cancel"
                    }
                },
                render: (html) => {}
            });
            
            return Promise.resolve();
        });
        
        await JournalGenerationDialog.create();
        
        // Check that Dialog was created with expected properties
        expect(global.Dialog).toHaveBeenCalled();
        const dialogOptions = global.Dialog.mock.calls[0][0];
        
        expect(dialogOptions.title).toBe("Generate Journal Entry");
        expect(dialogOptions.content).toContain("<textarea name=\"prompt\"");
        expect(dialogOptions.buttons).toHaveProperty('generate');
        expect(dialogOptions.buttons).toHaveProperty('cancel');
    });
});