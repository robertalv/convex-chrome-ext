if (!window.drawerExtensionInitialized) {
  console.log('Content script loaded.');

  let drawerOpen = false;

  function createDrawer() {
    const drawer = document.createElement('div');
    drawer.id = 'extension-drawer';
    document.body.appendChild(drawer);
    console.log('Drawer created and appended to the body.');

    fetch(chrome.runtime.getURL('drawer.html'))
      .then(response => response.text())
      .then(data => {
        drawer.innerHTML = data;
        console.log('Drawer content loaded.');
        toggleDrawer();
      })
      .catch(error => console.error('Error loading drawer content:', error));
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
  } else {
    toggleDrawer();
  }

  window.drawerExtensionInitialized = true;
} else {
  const drawer = document.getElementById('extension-drawer');
  if (drawer.style.right === '0px') {
    drawer.style.right = '-300px';
    console.log('Drawer closed.');
  } else {
    drawer.style.right = '0';
    console.log('Drawer opened.');
  }
  console.log('Drawer right position:', drawer.style.right);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleDrawer") {
    toggleDrawer();
  }
});