export class AIDMAssistant {
    static ID = 'ai-dm-assistant';
    
    static initialize() {
        console.log("AI DM Assistant | Setting up hooks...");
        this.initHooks();
    }

    static initHooks() {
        console.log("AI DM Assistant | Registering renderSidebarTab hook...");
        Hooks.on('renderSidebarTab', (app, html) => {
            console.log("AI DM Assistant | renderSidebarTab triggered", {
                app: app,
                appType: app?.constructor?.name,
                html: html
            });
            
            try {
                this._onRenderSidebarTab(app, html);
            } catch (error) {
                console.error("AI DM Assistant | Error in renderSidebarTab:", error);
            }
        });
    }

    static _onRenderSidebarTab(app, html) {
        console.log("AI DM Assistant | Processing sidebar tab:", app?.constructor?.name);
        
        // Check if this is the chat sidebar in multiple ways for debugging
        const isChatLog = app instanceof ChatLog;
        const isChat = app?.options?.id === 'chat';
        const tabId = app?.tabName || app?.options?.id || 'unknown';
        
        console.log("AI DM Assistant | Tab checks:", {
            isChatLog,
            isChat,
            tabId
        });

        if (app instanceof ChatLog) {
            console.log("AI DM Assistant | Found chat sidebar, adding button...");
            const button = this._createAIDMButton();
            const chatControls = html.find(".chat-control-icon");
            console.log("AI DM Assistant | Chat controls found:", chatControls.length > 0);
            chatControls.append(button);
        }
    }

    static _createAIDMButton() {
        console.log("AI DM Assistant | Creating button...");
        const button = $(`<a class="ai-dm-button" data-tooltip="AI DM Assistant">
            <i class="fas fa-robot"></i> AI DM
        </a>`);
        
        button.click(() => this._onButtonClick());
        
        return button;
    }

    static _onButtonClick() {
        console.log("AI DM Assistant | Button clicked, showing dialog...");
        new Dialog({
            title: game.i18n.localize("AI-DM.greeting.title"),
            content: game.i18n.localize("AI-DM.greeting.content"),
            buttons: {
                ok: {
                    label: game.i18n.localize("AI-DM.greeting.ok")
                }
            }
        }).render(true);
    }
}