class OpenAIAPI {
    static async generateContent(prompt, useContext = true) {
        const apiKey = game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.OPENAI_KEY);
        if (!apiKey) {
            ui.notifications.error("OpenAI API key not configured");
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
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: [{
                        role: "user",
                        content: fullPrompt
                    }],
                    max_tokens: maxTokens,
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
            
            // Extract content from the OpenAI response structure
            const content = data.choices?.[0]?.message?.content;
            
            if (!content) {
                throw new Error("No content received from OpenAI");
            }

            // Format the content for Foundry VTT journal entry
            // Convert line breaks to HTML breaks for proper display
            const formattedContent = AIAPI.formatContentForJournal(content);
            
            return formattedContent;
        } catch (error) {
            ui.notifications.error("Error generating content: " + error.message);
            console.error("OpenAI API Error:", error);
            return null;
        }
    }
}