class AIAPI {
    static async generateContent(prompt, useContext = true) {
        // Get model provider selection
        const modelProvider = game.settings.get(AIDMAssistant.ID, AIDMAssistant.SETTINGS.MODEL_PROVIDER);
        
        switch (modelProvider) {
            case "openai":
                return OpenAIAPI.generateContent(prompt, useContext);
            case "claude":
                return ClaudeAPI.generateContent(prompt, useContext);
            case "gemini":
                return GeminiAPI.generateContent(prompt, useContext);
            case "deepseek":
                return DeepSeekAPI.generateContent(prompt, useContext);
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