/**
 * Stellar Insights — Astrology form validation and webhook submission
 * Replace WEBHOOK_URL below with your n8n webhook URL before deploying.
 */

(function () {
  'use strict';

  // Replace with your n8n Webhook URL (e.g. from n8n workflow)
  const WEBHOOK_URL = "https://gokul4545.app.n8n.cloud/webhook/astro-form";

  const form = document.getElementById('astrology-form');
  const submitBtn = document.getElementById('submit-btn');
  const messageEl = document.getElementById('message');

  const fields = {
    fullName: document.getElementById('fullName'),
    dateOfBirth: document.getElementById('dateOfBirth'),
    timeOfBirth: document.getElementById('timeOfBirth'),
    placeOfBirth: document.getElementById('placeOfBirth'),
    gender: document.getElementById('gender'),
    areaOfFocus: document.getElementById('areaOfFocus'),
    email: document.getElementById('email')
  };

  const errorEls = {
    fullName: document.getElementById('fullName-error'),
    dateOfBirth: document.getElementById('dateOfBirth-error'),
    placeOfBirth: document.getElementById('placeOfBirth-error'),
    areaOfFocus: document.getElementById('areaOfFocus-error'),
    email: document.getElementById('email-error')
  };

  function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = 'message ' + type;
    messageEl.hidden = false;
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideMessage() {
    messageEl.hidden = true;
    messageEl.className = 'message';
  }

  function setFieldError(fieldId, msg) {
    var el = errorEls[fieldId];
    if (el) {
      el.textContent = msg || '';
      el.style.display = msg ? 'block' : 'none';
    }
  }

  function clearAllErrors() {
    Object.keys(errorEls).forEach(function (id) {
      setFieldError(id, '');
    });
  }

  function validateName(value) {
    value = (value || '').trim();
    if (value.length < 2) return 'Please enter at least 2 characters.';
    if (value.length > 100) return 'Name is too long.';
    return '';
  }

  function validateDate(value) {
    if (!value) return 'Date of birth is required.';
    var date = new Date(value);
    if (isNaN(date.getTime())) return 'Please enter a valid date.';
    var now = new Date();
    if (date > now) return 'Date of birth cannot be in the future.';
    return '';
  }

  function validatePlace(value) {
    value = (value || '').trim();
    if (value.length < 2) return 'Please enter at least 2 characters.';
    if (value.length > 200) return 'Place name is too long.';
    return '';
  }

  function validateAreaOfFocus(value) {
    if (!value) return 'Please choose an area of focus.';
    return '';
  }

  function validateEmail(value) {
    value = (value || '').trim();
    if (!value) return 'Email is required.';
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) return 'Please enter a valid email address.';
    return '';
  }

  function validateForm() {
    clearAllErrors();
    var valid = true;
    var nameErr = validateName(fields.fullName.value);
    if (nameErr) {
      setFieldError('fullName', nameErr);
      valid = false;
    }
    var dateErr = validateDate(fields.dateOfBirth.value);
    if (dateErr) {
      setFieldError('dateOfBirth', dateErr);
      valid = false;
    }
    var placeErr = validatePlace(fields.placeOfBirth.value);
    if (placeErr) {
      setFieldError('placeOfBirth', placeErr);
      valid = false;
    }
    var areaErr = validateAreaOfFocus(fields.areaOfFocus.value);
    if (areaErr) {
      setFieldError('areaOfFocus', areaErr);
      valid = false;
    }
    var emailErr = validateEmail(fields.email.value);
    if (emailErr) {
      setFieldError('email', emailErr);
      valid = false;
    }
    return valid;
  }

  function getFormPayload() {
    var timeOfBirth = (fields.timeOfBirth.value || '').trim();
    var gender = (fields.gender.value || '').trim();
    return {
      fullName: fields.fullName.value.trim(),
      dateOfBirth: fields.dateOfBirth.value,
      timeOfBirth: timeOfBirth || undefined,
      placeOfBirth: fields.placeOfBirth.value.trim(),
      gender: gender || undefined,
      areaOfFocus: fields.areaOfFocus.value,
      email: fields.email.value.trim().toLowerCase()
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    hideMessage();

    if (!validateForm()) {
      showMessage('Please correct the errors below and try again.', 'error');
      return;
    }

    if (!WEBHOOK_URL || WEBHOOK_URL.includes('https://gokul4545.app.n8n.cloud/webhook-test/astro-form')) {
      showMessage('Webhook is not configured. Set WEBHOOK_URL in script.js to your n8n webhook URL.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    var payload = getFormPayload();

    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Request failed: ' + res.status);
        return res.json().catch(function () { return {}; });
      })
      .then(function () {
        showMessage('Request received. Check your email for your personalized predictions. If you don\'t see it, check your spam folder.', 'success');
        form.reset();
        clearAllErrors();
      })
      .catch(function (err) {
        showMessage('Something went wrong. Please try again later, or check that the webhook URL is correct.', 'error');
        console.error('Submit error:', err);
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Get my predictions';
      });
  }

  form.addEventListener('submit', handleSubmit);
  form.addEventListener('reset', function () {
    clearAllErrors();
    hideMessage();
  });

  // Inline validation on blur for required fields
  fields.fullName.addEventListener('blur', function () {
    setFieldError('fullName', validateName(fields.fullName.value));
  });
  fields.dateOfBirth.addEventListener('blur', function () {
    setFieldError('dateOfBirth', validateDate(fields.dateOfBirth.value));
  });
  fields.placeOfBirth.addEventListener('blur', function () {
    setFieldError('placeOfBirth', validatePlace(fields.placeOfBirth.value));
  });
  fields.areaOfFocus.addEventListener('blur', function () {
    setFieldError('areaOfFocus', validateAreaOfFocus(fields.areaOfFocus.value));
  });
  fields.email.addEventListener('blur', function () {
    setFieldError('email', validateEmail(fields.email.value));
  });
})();
