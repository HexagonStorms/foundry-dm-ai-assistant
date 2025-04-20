class ItemGenerationDialog extends Dialog {
    static async create() {
        return new Promise((resolve, reject) => {
            new Dialog({
                title: "Generate Item",
                content: `
                    <form>
                        <div class="form-group">
                            <label>Item Name</label>
                            <input type="text" name="name" placeholder="Leave blank for AI to generate" />
                        </div>
                        <div class="form-group">
                            <label>Item Type</label>
                            <select name="type" style="width: 100%;">
                                <option value="weapon">Weapon</option>
                                <option value="equipment">Equipment</option>
                                <option value="consumable">Consumable</option>
                                <option value="tool">Tool</option>
                                <option value="loot">Loot/Treasure</option>
                                <option value="magic">Magic Item</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Item Description or Concept</label>
                            <textarea name="description" rows="4" style="width: 100%;" placeholder="Describe what you want (e.g., 'A rusty dagger with a curse', 'A healing potion with side effects', etc.)"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Rarity (for magic items)</label>
                            <select name="rarity" style="width: 100%;">
                                <option value="common">Common</option>
                                <option value="uncommon">Uncommon</option>
                                <option value="rare">Rare</option>
                                <option value="veryRare">Very Rare</option>
                                <option value="legendary">Legendary</option>
                                <option value="artifact">Artifact</option>
                            </select>
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
                                const itemName = html.find("[name=name]").val();
                                const itemType = html.find("[name=type]").val();
                                const description = html.find("[name=description]").val();
                                const rarity = html.find("[name=rarity]").val();
                                const useContext = html.find("[name=useContext]").is(":checked");
                                
                                if (!description) {
                                    ui.notifications.error("Please enter a description or concept");
                                    return;
                                }
                                
                                ui.notifications.info("Generating item...");
                                
                                // Construct a detailed prompt for the AI
                                let prompt = `Create a detailed D&D item: ${description}\n\n`;
                                prompt += `Item type: ${itemType}\n`;
                                
                                if (itemType === "magic") {
                                    prompt += `Rarity: ${rarity}\n`;
                                }
                                
                                if (itemName) {
                                    prompt += `Name: ${itemName}\n`;
                                }
                                
                                prompt += "\nInclude the following details in your response:\n";
                                prompt += "1. Name (if not specified)\n";
                                prompt += "2. Description (physical appearance and history)\n";
                                prompt += "3. Properties (weight, value, damage for weapons, etc.)\n";
                                prompt += "4. Game mechanics (bonuses, abilities, etc.)\n";
                                
                                const content = await AIAPI.generateContent(prompt, useContext);
                                
                                if (!content) {
                                    throw new Error("Failed to generate item");
                                }
                                
                                // Extract name from the generated content if not provided
                                let finalName = itemName;
                                if (!finalName) {
                                    // Try to find a name in the first lines of the generated content
                                    const firstLine = content.split('\n')[0];
                                    if (firstLine && firstLine.length < 50) {
                                        finalName = firstLine.replace(/^(name|title):\s*/i, '');
                                    } else {
                                        finalName = description.split(' ').slice(0, 3).join(' ');
                                    }
                                }
                                
                                // Create the item
                                let itemData = {
                                    name: finalName,
                                    type: itemType === "magic" ? "equipment" : itemType,
                                    img: getDefaultItemImage(itemType),
                                    data: {
                                        description: {
                                            value: AIAPI.formatContentForJournal(content)
                                        }
                                    },
                                    ownership: {
                                        default: CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED
                                    }
                                };
                                
                                // Add rarity for magic items
                                if (itemType === "magic") {
                                    itemData.data.rarity = rarity;
                                    itemData.data.attunement = content.toLowerCase().includes("attunement");
                                }
                                
                                const item = await Item.create(itemData);
                                
                                if (!item) {
                                    throw new Error("Failed to create item");
                                }
                                
                                // Open the item sheet
                                item.sheet.render(true);
                                resolve(item);
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

// Helper function to get default item image based on type
function getDefaultItemImage(itemType) {
    switch (itemType) {
        case 'weapon':
            return 'icons/weapons/swords/sword-longsword-gold.webp';
        case 'equipment':
            return 'icons/equipment/chest/breastplate-layered-steel-gold.webp';
        case 'consumable':
            return 'icons/consumables/potions/potion-round-corked-red.webp';
        case 'tool':
            return 'icons/tools/hand/hammer-claw-steel.webp';
        case 'loot':
            return 'icons/containers/chest/chest-wooden-brown-gold.webp';
        case 'magic':
            return 'icons/weapons/wands/wand-carved-blue.webp';
        default:
            return 'icons/sundries/misc/orb-blue.webp';
    }
}