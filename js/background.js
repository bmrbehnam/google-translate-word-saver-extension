// Create a context menu item
chrome.contextMenus.create({
  id: "saveSelectedWord",
  title: "Save Selected Word",
  contexts: ["selection"]
});

// Add a listener for the context menu item click
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  const word = info.selectionText;
  if (info.menuItemId === "saveSelectedWord" && word) {
    chrome.tabs.sendMessage(tab.id, { action: "promptForMeaning", word });
  }
});