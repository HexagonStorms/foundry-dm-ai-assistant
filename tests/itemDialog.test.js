// Import setup
require('./setup');

describe('ItemGenerationDialog', () => {
    beforeEach(() => {
        // Reset any mocks before each test
        jest.clearAllMocks();
        
        // Spy on Item.create
        global.Item.create = jest.fn().mockImplementation(async (data) => ({
            sheet: {
                render: jest.fn()
            }
        }));
        
        // Spy on AIAPI.generateContent
        global.AIAPI.generateContent = jest.fn().mockResolvedValue("Test item description\nProperties: Test properties");
    });

    test('create method should return a promise', () => {
        const result = global.ItemGenerationDialog.create();
        expect(result).toBeInstanceOf(Promise);
    });

    test('generateContent should be called with expected parameters', async () => {
        // We'll need to mock the dialog's html structure and form values
        global.Dialog = jest.fn().mockImplementation(function(data) {
            this.data = data;
            this.rendered = false;
            
            // Add render method directly to the instance
            this.render = jest.fn(() => {
                this.rendered = true;
                if (this.data.buttons && this.data.buttons.generate) {
                    // Create mock HTML with specific values for our test
                    const html = {
                        find: (selector) => {
                            // Return appropriate mock values based on the selector
                            if (selector === "[name=name]") {
                                return { val: () => "Test Item" };
                            } else if (selector === "[name=type]") {
                                return { val: () => "weapon" };
                            } else if (selector === "[name=description]") {
                                return { val: () => "A magical sword" };
                            } else if (selector === "[name=rarity]") {
                                return { val: () => "rare" };
                            } else if (selector === "[name=useContext]") {
                                return { is: () => true };
                            }
                            return {
                                val: () => "",
                                is: () => false
                            };
                        }
                    };
                    
                    // Immediately trigger the generate callback to simulate button click
                    this.data.buttons.generate.callback(html);
                }
                return this;
            });
            
            this.close = jest.fn(() => {
                this.rendered = false;
                return this;
            });
        });
        
        try {
            await global.ItemGenerationDialog.create();
            // Verify AIAPI.generateContent was called
            expect(global.AIAPI.generateContent).toHaveBeenCalled();
            // Verify Item.create was called with expected data
            expect(global.Item.create).toHaveBeenCalledWith(expect.objectContaining({
                name: "Test Item",
                type: "weapon"
            }));
        } catch (e) {
            // We expect the test to pass, so fail if there's an error
            expect(true).toBe(false); // This will fail the test with a clear message
        }
    });
});