console.log("AI DM Assistant | Loading module...");

import { AIDMAssistant } from './ai-dm-assistant.js';

Hooks.once('init', () => {
    console.log("AI DM Assistant | Initializing...");
    AIDMAssistant.initialize();
});