class ClaudeAPI {
    static async generateContent(prompt, useContext = true) {
        const apiKey = game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.ANTHROPIC_KEY);
        if (!apiKey) {
            ui.notifications.error("Anthropic API key not configured");
            return null;
        }

        // Get world context if needed
        let worldContext = "";
        if (useContext) {
            worldContext = "World Context:\n" + AIDMAssistant.getAllContext() + "\n\n";
        }

        const maxTokens = game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.MAX_TOKENS);

        const fullPrompt = `You are a creative writing assistant helping a Game Master create content for their roleplaying game. ${worldContext} 
        Request: ${prompt} Please format your response in a way that can be used as a journal entry.`;

        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: "claude-3-opus-20240229",
                    max_tokens: maxTokens,
                    messages: [{
                        role: "user",
                        content: fullPrompt
                    }],
                    temperature: 0.7
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
            
            // Extract content from the Claude response structure
            const content = data.content?.[0]?.text;
            
            if (!content) {
                throw new Error("No content received from Claude");
            }

            // Format the content for Foundry VTT journal entry
            const formattedContent = AIAPI.formatContentForJournal(content);
            
            return formattedContent;
        } catch (error) {
            ui.notifications.error("Error generating content: " + error.message);
            console.error("Claude API Error:", error);
            return null;
        }
    }
}