chrome.action.onClicked.addListener((tab) => {
  if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://') || tab.url.startsWith('file://') || tab.url.startsWith('localhost'))) {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      function: toggleDrawer
    }, () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        console.log('Content script injected successfully.');
      }
    });
  } else {
    console.warn('Cannot inject content script into this URL:', tab.url);
  }
});

function toggleDrawer() {
  if (!window.drawerExtensionInitialized) {
    console.log('Content script loaded.');

    let drawerOpen = false;

    function createDrawer() {
      const drawer = document.createElement('div');
      drawer.id = 'extension-drawer';
      fetch(chrome.runtime.getURL('drawer.html'))
        .then(response => response.text())
        .then(data => {
          drawer.innerHTML = data;
          console.log('Drawer content loaded.');
        })
        .catch(error => console.error('Error loading drawer content:', error));
      document.body.appendChild(drawer);
      console.log('Drawer created and appended to the body.');
    }

    function toggleDrawer() {
      const drawer = document.getElementById('extension-drawer');
      if (drawerOpen) {
        drawer.style.right = '-300px';
        console.log('Drawer closed.');
      } else {
        drawer.style.right = '0';
        console.log('Drawer opened.');
      }
      console.log('Drawer right position:', drawer.style.right);
      drawerOpen = !drawerOpen;
    }

    if (!document.getElementById('extension-drawer')) {
      createDrawer();
    }
    toggleDrawer();

    window.drawerExtensionInitialized = true;
  } else {
    const drawer = document.getElementById('extension-drawer');
    if (drawer.style.right === '0px') {
      drawer.style.right = '-300px';
      console.log('Drawer closed.');
    } else {
      drawer.style.right = '0';
      drawer.style.position = 'absolute';
      drawer.style.zIndex = '9999';
      drawer.style.top = '0px';
      drawer.style.right = '0px';
      drawer.style.width = '300px';
      drawer.style.height = '100%';
      drawer.style.backgroundColor = '#1E1C1A';
      drawer.style.boxShadow = '-2px 0 5px rgba(0, 0, 0, 0.1)';
      drawer.style.transition = 'right 0.3s ease-in-out';
      drawer.style.padding = '20px';
      drawer.style.boxSizing = 'border-box';
      console.log('Drawer opened.');
    }
    console.log('Drawer right position:', drawer.style.right);
  }
}