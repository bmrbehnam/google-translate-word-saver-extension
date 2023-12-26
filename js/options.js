
document.addEventListener('DOMContentLoaded', function () {
  displaySavedWords();

  document.getElementById('exportBtn').addEventListener('click', exportWords);
  document.getElementById('deleteAllBtn').addEventListener('click', deleteAllWords);
});

function displaySavedWords() {
  chrome.storage.sync.get({ 'savedWords': [] }, function (result) {
    var savedWords = result.savedWords;
    var savedWordsList = document.getElementById('savedWordsList');

    // Clear the existing list
    savedWordsList.innerHTML = '';

console.log(savedWords);

    // Display each saved word with a delete button
    savedWords.forEach(function (wordObj, index) {
      var listItem = document.createElement('li');
      listItem.textContent = `${wordObj.word}: ${wordObj.meaning}`;

      var deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', function () {
        deleteWord(index);
        // displaySavedWords(); // Update the displayed list after deletion
      });

      listItem.appendChild(deleteButton);
      savedWordsList.appendChild(listItem);
    });
  });
}

function deleteWord(index) {
  chrome.storage.sync.get({ 'savedWords': [] }, function (result) {
    var savedWords = result.savedWords;

    // Remove the word at the specified index
    savedWords.splice(index, 1);

    // Update the storage with the modified list

    chrome.storage.sync.set({ 'savedWords': savedWords }, function () {
      displaySavedWords(); // Update the displayed list after deletion
    });
  });
}

function deleteAllWords() {
  chrome.storage.sync.set({ 'savedWords': [] }, function () {
    displaySavedWords(); // Update the displayed list after deletion
    console.log('All words deleted.');
  });
}

function exportWords() {
  chrome.storage.sync.get({ 'savedWords': [] }, function (result) {
    var savedWords = result.savedWords;
    if (savedWords.length > 0) {
    // Convert the CSV content to a Uint8Array with UTF-8 encoding and BOM
    const csvContent = 'word,meaning\n' + savedWords.map(({ word, meaning }) => `${word},${meaning}`).join('\n');
    const uint8Array = new TextEncoder().encode('\uFEFF' + csvContent);

    const blob = new Blob([uint8Array], { type: 'text/csv;charset=utf-8' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saved_words.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    } else {
      alert('No saved words to export.');
    }
  });
}
