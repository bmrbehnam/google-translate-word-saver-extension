// Create Save Button
function createSaveButton() {
    console.log('Creating button');
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Word';
    saveButton.style.margin = '2px';
  
    saveButton.addEventListener('click', handleSaveButtonClick);
  
    return saveButton;
  }
  
  // Event handler for the save button click
  function handleSaveButtonClick() {
    const selectedWord = window.getSelection().toString();
    const meaning = showPrompt(selectedWord);
    saveWord(selectedWord, meaning);
  }
  
  function showPrompt(word) {
    return prompt(`What does "${word}" mean?`);
  }

  
  // Save a word and its meaning
  function saveWord(word, meaning) {
    chrome.storage.sync.get({ 'savedWords': [] }, function (result) {
      const savedWords = result.savedWords;
  
      // Check if the word is already saved
      if (!savedWords.some(w => w.word === word)) {
        savedWords.push({ word, meaning });
        chrome.storage.sync.set({ 'savedWords': savedWords }, function () {
          console.log('Word saved:', word);
        });
      } else {
        console.log('Word already saved:', word);
      }
    });
  }
  
  // Add the save button to the Google Translate popup
  function addButtonToTranslatePopup() {
    const translatePopupClass = '.jfk-bubble.gtx-bubble';
    const translatePopup = document.querySelector(translatePopupClass);
  
    if (translatePopup && !translatePopup.querySelector('button')) {
      translatePopup.appendChild(createSaveButton());
    }
  }
  
  // Wait for the Google Translate popup to appear, then add the button.
  const observer = new MutationObserver(addButtonToTranslatePopup);
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'promptForMeaning') {
      const meaning = showPrompt(request.word);
      saveWord(request.word, meaning);
    }
  });
  