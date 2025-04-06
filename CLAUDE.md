# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Validation Commands
- No specific build commands - this is a Foundry VTT module loaded directly
- Testing: Manually test in a Foundry VTT environment (v12+)

## Code Style Guidelines
- **Formatting**: 4-space indentation, semicolons, double quotes for HTML attributes
- **Naming**: camelCase for variables/functions, PascalCase for classes (e.g., AIDMAssistant)
- **Organization**: Static class methods for utilities and settings management
- **Error Handling**: Use try/catch blocks with ui.notifications for user feedback
- **Imports**: None required; scripts loaded sequentially via module.json
- **Foundry Patterns**: Use Hooks for lifecycle events, register settings via game.settings
- **HTML/CSS**: Use Foundry CSS classes where possible, BEM-like custom classes
- **State Management**: Use game.settings for persistent storage