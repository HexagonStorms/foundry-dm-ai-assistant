class AIAPI {
    static async generateContent(prompt, useContext = true) {
        // Get model provider selection
        const modelProvider = game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.MODEL_PROVIDER);
        
        switch (modelProvider) {
            case "openai":
                return OpenAIAPI.generateContent(prompt, useContext);
            case "claude":
                return ClaudeAPI.generateContent(prompt, useContext);
            default:
                ui.notifications.error("No valid AI model provider selected");
                return null;
        }
    }

    static formatContentForJournal(content) {
        // Convert line breaks to HTML breaks
        // First, replace single newlines that follow a period with double newlines
        // This helps with paragraph formatting
        let formatted = content.replace(/\.\n(?!\n)/g, '.\n\n');
        
        // Then convert remaining newlines to <br> tags
        formatted = formatted.replace(/\n/g, '<br>');
        
        // Wrap the content in a div for proper formatting
        return `<div class="ai-generated-content">${formatted}</div>`;
    }
}

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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
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