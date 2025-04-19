class GeminiAPI {
    static async generateContent(prompt, useContext = true) {
        const apiKey = game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.GOOGLE_KEY);
        if (!apiKey) {
            ui.notifications.error("Google API key not configured");
            return null;
        }

        // Get world context if needed
        let worldContext = "";
        if (useContext) {
            worldContext = "World Context:\n" + AIDMAssistant.getAllContext() + "\n\n";
        }

        const maxTokens = game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.MAX_TOKENS);
        const creativity = game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.DEFAULT_CREATIVITY) / 100;

        const fullPrompt = `You are a creative writing assistant helping a Game Master create content for their roleplaying game. ${worldContext} 
        Request: ${prompt} Please format your response in a way that can be used as a journal entry.`;

        try {
            // Gemini API endpoint with API key as query parameter
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: fullPrompt
                        }]
                    }],
                    generationConfig: {
                        maxOutputTokens: maxTokens,
                        temperature: creativity
                    }
                })
            });

            const data = await response.json();
            
            // Check for API error object in response
            if (data.error) {
                throw new Error(data.error.message || "Unknown API error");
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Extract content from the Gemini response structure
            const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (!content) {
                throw new Error("No content received from Gemini");
            }

            // Format the content for Foundry VTT journal entry
            const formattedContent = AIAPI.formatContentForJournal(content);
            
            return formattedContent;
        } catch (error) {
            ui.notifications.error("Error generating content: " + error.message);
            console.error("Gemini API Error:", error);
            return null;
        }
    }
}