document.addEventListener('input', function(event) {
  if (event.target.form) {
    saveFormData(event.target.form);
  }
});

window.addEventListener('load', function() {
  restoreAllForms();
});

function saveFormData(form) {
  const formData = new FormData(form);
  const formJSON = {};
  formData.forEach((value, key) => {
    formJSON[key] = value;
  });
  const formId = getFormId(form);
  const storageKey = `form-${location.href}-${formId}`;
  chrome.runtime.sendMessage({ action: 'save', key: storageKey, data: formJSON });
}

function restoreFormData(form, formJSON) {
  for (const key in formJSON) {
    const field = form.querySelector(`[name=${key}]`);
    if (field) {
      field.value = formJSON[key];
    }
  }
}

function restoreAllForms() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    const formId = getFormId(form);
    const storageKey = `form-${location.href}-${formId}`;
    chrome.runtime.sendMessage({ action: 'get', key: storageKey }, function(response) {
      if (response && response.data) {
        restoreFormData(form, response.data);
      }
    });
  });
}

function getFormId(form) {
  return form.getAttribute('id') || form.getAttribute('name') || Array.from(document.forms).indexOf(form);
}
