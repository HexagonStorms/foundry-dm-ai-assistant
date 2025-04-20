# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Validation Commands
- No specific build commands - this is a Foundry VTT module loaded directly
- Testing: Manually test in a Foundry VTT environment (v12+)
- Run tests with: `npm test`

## Architecture & Design Principles
- **Modular Structure**: Code is organized in feature-based directories (api/, dialogs/)
- **Backward Compatibility**: Maintain compatibility files (api.js, dialogs.js) that re-export from submodules
- **SOLID Principles**:
  - Single Responsibility: Each class has one responsibility (e.g., API classes handle specific providers)
  - Open/Closed: Extend functionality through inheritance rather than modification
  - Liskov Substitution: Child classes should be substitutable for their parent class
  - Interface Segregation: Keep interfaces focused and specific
  - Dependency Inversion: Depend on abstractions, not concrete implementations
- **OOP Approach**: Use classes with clear inheritance hierarchies (e.g., AIAPI as base class)

## Testing
- **Unit Tests**: Add simple unit tests for all new functionality when possible
- **Test Structure**: Place tests in the `tests/` directory, matching source file names (e.g., `api.test.js` tests `api.js`)
- **Test Coverage**: Focus on testing core functionality, API calls, and dialog behavior
- **Mocking**: Use Jest mocks for Foundry VTT APIs (see `tests/setup.js` for examples)
- **Run Tests**: Execute with `npm test` before submitting new code

## Code Style Guidelines
- **Formatting**: 4-space indentation, semicolons, double quotes for HTML attributes
- **Naming**: camelCase for variables/functions, PascalCase for classes (e.g., AIDMAssistant)
- **Organization**: 
  - Static class methods for utilities and settings management
  - Instance methods for specific functionality
  - Inheritance for API providers and dialog types
- **Error Handling**: Use try/catch blocks with ui.notifications for user feedback
- **Module Loading**: Scripts loaded sequentially via module.json, maintain dependency order
- **Foundry Patterns**: Use Hooks for lifecycle events, register settings via game.settings
- **HTML/CSS**: Use Foundry CSS classes where possible, BEM-like custom classes
- **State Management**: Use game.settings for persistent storage