export class AIDMAssistant {
    static ID = 'ai-dm-assistant';
    
    static initialize() {
        this.initHooks();
    }

    static initHooks() {
        Hooks.on('renderSidebarTab', this._onRenderSidebarTab.bind(this));
    }

    static _onRenderSidebarTab(app, html) {
        if (app instanceof ChatLog) {
            const button = this._createAIDMButton();
            html.find(".chat-control-icon").append(button);
        }
    }

    static _createAIDMButton() {
        const button = $(`<a class="ai-dm-button" data-tooltip="AI DM Assistant">
            <i class="fas fa-robot"></i> AI DM
        </a>`);
        
        button.click(() => this._onButtonClick());
        
        return button;
    }

    static _onButtonClick() {
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