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

  // Setup socket listeners
  game.socket.on(`module.${AIDMAssistant.ID}`, (data) => {
      if (!game.user.isGM) return;
      
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
});

// Add a button to the scene controls
Hooks.on('getSceneControlButtons', (controls) => {
  if (!game.user.isGM) return;

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
              new AIDMConfig().render(true);
          }
      }, {
          name: 'ai-create',
          title: 'Create',
          icon: 'fas fa-magic',
          button: true,
          onClick: async () => {
              try {
                  await CreationOptionsDialog.create();
              } catch (error) {
                  if (error.message !== "Cancelled" && error.message !== "Closed") {
                      ui.notifications.error(error.message);
                  }
              }
          }
      }]
  });
});

// Add a button to the journal directory header
Hooks.on('renderJournalDirectory', (app, html, data) => {
  if (!game.user.isGM) return;

  const button = $(`<button class="ai-assist-btn">
      <i class="fas fa-magic"></i> Create
  </button>`);
  
  button.click(async () => {
      try {
          await CreationOptionsDialog.create();
      } catch (error) {
          if (error.message !== "Cancelled" && error.message !== "Closed") {
              ui.notifications.error(error.message);
          }
      }
  });

  html.find('.directory-header .header-actions').append(button);
});