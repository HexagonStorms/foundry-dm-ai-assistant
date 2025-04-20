class CreationOptionsDialog extends Dialog {
    static async create() {
        return new Promise((resolve, reject) => {
            new Dialog({
                title: "AI DM Assistant",
                content: `
                    <h3 style="text-align: center;">What would you like to create?</h3>
                    <div class="ai-dm-options">
                        <button data-type="journal" class="ai-dm-option">
                            <i class="fas fa-book"></i>
                            <div>Journal Entry</div>
                        </button>
                        <button data-type="npc" class="ai-dm-option">
                            <i class="fas fa-user"></i>
                            <div>NPC</div>
                        </button>
                        <button data-type="character" class="ai-dm-option">
                            <i class="fas fa-user-shield"></i>
                            <div>Character</div>
                        </button>
                        <button data-type="item" class="ai-dm-option">
                            <i class="fas fa-crown"></i>
                            <div>Item</div>
                        </button>
                    </div>
                `,
                buttons: {
                    cancel: {
                        icon: '<i class="fas fa-times"></i>',
                        label: "Cancel",
                        callback: () => reject(new Error("Cancelled"))
                    }
                },
                render: (html) => {
                    html.find('.ai-dm-option').click(async (event) => {
                        const type = event.currentTarget.dataset.type;
                        try {
                            switch (type) {
                                case 'journal':
                                    await JournalGenerationDialog.create();
                                    break;
                                case 'npc':
                                case 'character':
                                case 'item':
                                    ui.notifications.info(`${type.charAt(0).toUpperCase() + type.slice(1)} generation coming soon!`);
                                    break;
                                default:
                                    console.warn('Unknown creation type:', type);
                            }
                            resolve(type);
                            this.close();
                        } catch (error) {
                            if (error.message !== "Cancelled" && error.message !== "Closed") {
                                ui.notifications.error(error.message);
                            }
                            reject(error);
                        }
                    });
                },
                default: "cancel",
                close: () => reject(new Error("Closed"))
            }).render(true);
        });
    }
}