import { AIDMAssistant } from './ai-dm-assistant.js';

Hooks.once('init', () => {
    AIDMAssistant.initialize();
});