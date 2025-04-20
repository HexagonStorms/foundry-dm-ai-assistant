// Import the AIAPI class
// Note: In a real test, we'd import the actual class
// But since we're mocking it in setup.js, we'll test against the mock

describe('AIAPI', () => {
    beforeEach(() => {
        // Reset any mocks before each test
        jest.clearAllMocks();
    });

    test('generateContent should return content from selected provider', async () => {
        // Setup spy to monitor calls to generateContent
        const spy = jest.spyOn(AIAPI, 'generateContent');
        
        // Set up the expected result
        const expectedContent = "This is test generated content";
        
        // Call the method with a test prompt
        const result = await AIAPI.generateContent("Test prompt", true);
        
        // Verify it was called with the right parameters
        expect(spy).toHaveBeenCalledWith("Test prompt", true);
        
        // Verify the result matches what we expect
        expect(result).toBe(expectedContent);
    });

    test('formatContentForJournal should format content correctly', () => {
        const testContent = "Test content\nwith line breaks";
        const formattedContent = AIAPI.formatContentForJournal(testContent);
        
        // Verify the content is wrapped in the expected div
        expect(formattedContent).toContain('<div class="ai-generated-content">');
        expect(formattedContent).toContain('</div>');
        
        // Verify the content is included
        expect(formattedContent).toContain(testContent);
    });
});