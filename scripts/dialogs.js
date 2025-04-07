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

class JournalGenerationDialog extends Dialog {
    static async create() {
        return new Promise((resolve, reject) => {
            new Dialog({
                title: "Generate Journal Entry",
                content: `
                    <form>
                        <div class="form-group">
                            <label>Title</label>
                            <input type="text" name="title" />
                        </div>
                        <div class="form-group">
                            <label>What would you like to generate?</label>
                            <textarea name="prompt" rows="5" style="width: 100%;"></textarea>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" name="useContext" checked/>
                                Include world context in prompt
                            </label>
                        </div>
                    </form>
                `,
                buttons: {
                    generate: {
                        icon: '<i class="fas fa-magic"></i>',
                        label: "Generate",
                        callback: async (html) => {
                            try {
                                const prompt = html.find("[name=prompt]").val();
                                if (!prompt) {
                                    ui.notifications.error("Please enter a prompt");
                                    return;
                                }

                                const title = html.find("[name=title]").val() || prompt.split('\n')[0].substring(0, 30);
                                const useContext = html.find("[name=useContext]").is(":checked");
                                
                                ui.notifications.info("Generating content...");
                                
                                const content = await OpenAIAPI.generateContent(prompt, useContext);
                                
                                if (!content) {
                                    throw new Error("Failed to generate content");
                                }

                                // Create the journal entry with a text page
                                const journalData = {
                                    name: title,
                                    pages: [{
                                        type: "text",
                                        name: title,
                                        text: {
                                            content: content
                                        }
                                    }],
                                    ownership: {
                                        default: CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED
                                    }
                                };

                                const entry = await JournalEntry.create(journalData);
                                
                                if (!entry) {
                                    throw new Error("Failed to create journal entry");
                                }

                                // Open the journal entry
                                entry.sheet.render(true);
                                resolve(entry);
                            } catch (error) {
                                ui.notifications.error(error.message);
                                reject(error);
                            }
                        }
                    },
                    cancel: {
                        icon: '<i class="fas fa-times"></i>',
                        label: "Cancel",
                        callback: () => reject(new Error("Cancelled"))
                    }
                },
                default: "generate",
                close: () => reject(new Error("Closed"))
            }).render(true);
        });
    }
}