# Foundry DM AI Assistant

A Foundry VTT module that integrates AI capabilities to help Dungeon Masters generate game content. The module allows for AI-powered creation of Foundry VTT documents.

## Current Features

- OpenAI API integration (GPT-4) for content generation
- ClaudeAI API integration
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
- Support for additional AI providers (Anthropic/Claude, Google)
- Enhanced multi-user support via socket communication
- Further document type support (Scenes, Macros, etc.)
- loading indicators
- token usage stats

## Requirements

- Foundry VTT v12+
- OpenAI API key