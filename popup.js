document.addEventListener('DOMContentLoaded', function() {
  const formList = document.getElementById('form-list');
  const saveAllButton = document.getElementById('save-all');

  saveAllButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: saveAllForms
      });
    });
  });

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: listForms
    }, (results) => {
      const forms = results[0].result;
      forms.forEach((form, index) => {
        const formItem = document.createElement('div');
        formItem.classList.add('form-item');
        formItem.textContent = `Form ${index + 1}`;
        formItem.addEventListener('click', function() {
          highlightForm(form.id);
        });
        formList.appendChild(formItem);
      });
    });
  });
});

function saveAllForms() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    saveFormData(form);
  });
}

function listForms() {
  const forms = Array.from(document.querySelectorAll('form')).map((form, index) => ({
    id: form.id || index
  }));
  return forms;
}

function highlightForm(formId) {
  const form = document.getElementById(formId);
  if (form) {
    form.scrollIntoView();
    form.classList.add('highlight');
    setTimeout(() => form.classList.remove('highlight'), 2000);
  }
}
