# Foundry DM AI Assistant

A Foundry VTT module that integrates AI capabilities to help Dungeon Masters generate game content. The module allows for AI-powered creation of Foundry VTT documents.

## Current Features

- OpenAI API integration (GPT-4) for content generation
- ClaudeAI API integration
- Gemini integration (untested)
- Deepseek integration (untested)
- Configurable world context management with sections for:
  - World overview
  - Major factions
  - Important NPCs
  - Current plots
  - Locations
- AI-powered journal entry generation
- Custom UI controls in the Foundry interface:
  - Scene control buttons for AI features
  - Journal directory button for content creation
  - Configuration dialog for world context settings

## Planned Features (TODO)

- NPC generation
- Item generation
- Character generation
- Further document type support (Scenes, Macros, etc.)
- Loading indicators
- Token usage stats

## Requirements

- Foundry VTT v12+
- An LLM model API key

## Development

### Running Unit Tests

The module includes unit tests using Jest. To run the tests:

```bash
# Install dependencies (first time only)
npm install

# Run all tests
npm test

# Run tests with coverage
npm test --coverage

# Run specific test file
npm test -- tests/api.test.js
```

The test setup mocks the Foundry VTT APIs, allowing for testing without a running Foundry instance.