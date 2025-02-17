Hooks.once('init', () => {
  console.log('AI DM Assistant | Initializing module');
  
  // Initialize settings
  AIDMAssistant.initialize();
});

Hooks.once('ready', () => {
  console.log('AI DM Assistant | Module ready');
  
  // Check version compatibility
  if (!game.version.startsWith('12.')) {
      ui.notifications.error('AI DM Assistant requires Foundry VTT version 12');
      return;
  }

  // Register module with Dev Mode if available
  if (game.modules.get('_dev-mode')?.api?.registerPackageDebugFlag) {
      game.modules.get('_dev-mode')?.api?.registerPackageDebugFlag(AIDMAssistant.ID);
  }
});

// Add a button to the scene controls
Hooks.on('getSceneControlButtons', (controls) => {
  controls.push({
      name: 'ai-dm-assistant',
      title: 'AI DM Assistant',
      icon: 'fas fa-robot',
      layer: 'controls',
      tools: [{
          name: 'ai-config',
          title: 'Configure AI Assistant',
          icon: 'fas fa-cog',
          button: true,
          onClick: () => {
            console.log('AI DM Assistant | Configure AI Assistant | I was clicked!');
              // TODO: Open configuration window
              // new AIDMConfig().render(true);
          }
      }, {
          name: 'create-npc',
          title: 'Generate NPC',
          icon: 'fas fa-user',
          button: true,
          onClick: () => {
              console.log('AI DM Assistant | Generate NPC | I was clicked!');
          }
      }, {
          name: 'create-item',
          title: 'Generate Item',
          icon: 'fas fa-crown',
          button: true,
          onClick: () => {
              console.log('AI DM Assistant | Generate Item | I was clicked!');
          }
      }]
  });
});

// Add a button to the journal directory header
Hooks.on('renderJournalDirectory', (app, html, data) => {
  if (!game.user.isGM) return;

  const button = $(`<button class="ai-assist-btn">
      <i class="fas fa-magic"></i> AI Assist
  </button>`);
  
  button.click(() => {
      // TODO: Open journal entry generation dialog
      console.log('AI DM Assistant | Journal Entry Generation | I was clicked!');
  });

  html.find('.directory-header .header-actions').append(button);
});

// Handle socket events for client-server communication
game.socket.on(`module.${AIDMAssistant.ID}`, (data) => {
  if (!game.user.isGM) return;
  
  // TODO: Handle different socket events
  switch (data.type) {
      case 'requestApiCall':
          // Handle API calls
          break;
      case 'generateContent':
          // Handle content generation
          break;
      default:
          console.warn('AI DM Assistant | Unknown socket event:', data.type);
  }
});