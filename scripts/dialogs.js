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
                            const prompt = html.find("[name=prompt]").val();
                            const title = html.find("[name=title]").val() || prompt.split('\n')[0].substring(0, 30);
                            const useContext = html.find("[name=useContext]").is(":checked");
                            
                            ui.notifications.info("Generating content...");
                            
                            const content = await OpenAIAPI.generateContent(prompt, useContext);
                            
                            if (content) {
                                const entry = await JournalEntry.create({
                                    name: title,
                                    content: content,
                                    folder: null
                                });
                                
                                // Open the journal entry
                                entry.sheet.render(true);
                                resolve(entry);
                            } else {
                                reject(new Error("Failed to generate content"));
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