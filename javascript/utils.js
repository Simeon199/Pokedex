/**
 * Capitalizes the first letter of a string.
 * @param {string} string - The string to capitalize.
 * @returns {string} The capitalized string.
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Converts a string to title case.
 * @param {string} str - The string to convert.
 * @returns {string} The title case string.
 */
function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

/**
 * Formats a number with leading zeros.
 * @param {number} num - The number to format.
 * @param {number} size - The desired length.
 * @returns {string} The formatted number string.
 */
function padNumber(num, size) {
  let s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
}

/**
 * Creates a placeholder element for loading states.
 * @param {string} id - The ID for the placeholder element.
 * @returns {HTMLElement} The created placeholder element.
 */
function createPlaceholder(id) {
  let placeholder = document.createElement('div');
  placeholder.id = id;
  placeholder.className = 'placeholder';
  placeholder.innerHTML = '<div class="spinner"></div>';
  return placeholder;
}

/**
 * Removes a placeholder element.
 * @param {string} id - The ID of the placeholder element to remove.
 */
function removePlaceholder(id) {
  let placeholder = document.getElementById(id);
  if (placeholder) {
    placeholder.remove();
  }
}

/**
 * Shows a loading spinner.
 * @param {string} containerId - The ID of the container to show the spinner in.
 */
function showSpinner(containerId) {
  if (!containerId) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.remove('d-none');
      document.body.style.overflow = 'hidden';
    }
    return;
  }
  let container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '<div class="spinner"></div>';
  }
}

/**
 * Hides the loading spinner.
 * @param {string} containerId - The ID of the container to hide the spinner in.
 */
function hideSpinner(containerId) {
  let container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '';
  }
}

/**
 * Debounces a function call.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The wait time in milliseconds.
 * @returns {Function} The debounced function.
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttles a function call.
 * @param {Function} func - The function to throttle.
 * @param {number} limit - The limit time in milliseconds.
 * @returns {Function} The throttled function.
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Checks if an element is in the viewport.
 * @param {HTMLElement} el - The element to check.
 * @returns {boolean} True if the element is in the viewport, false otherwise.
 */
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Scrolls to the top of the page smoothly.
 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Gets the current scroll position.
 * @returns {number} The current scroll position.
 */
function getScrollPosition() {
  return window.pageYOffset || document.documentElement.scrollTop;
}

/**
 * Sets the scroll position.
 * @param {number} position - The position to scroll to.
 */
function setScrollPosition(position) {
  window.scrollTo(0, position);
}

/**
 * Creates a unique ID.
 * @returns {string} A unique ID string.
 */
function generateUniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Clones an object deeply.
 * @param {Object} obj - The object to clone.
 * @returns {Object} The cloned object.
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Merges two objects.
 * @param {Object} target - The target object.
 * @param {Object} source - The source object.
 * @returns {Object} The merged object.
 */
function mergeObjects(target, source) {
  return Object.assign({}, target, source);
}

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, empty object).
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is empty, false otherwise.
 */
function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === 'string' || Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Formats a date to a readable string.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Gets the current timestamp.
 * @returns {number} The current timestamp.
 */
function getCurrentTimestamp() {
  return Date.now();
}

/**
 * Converts bytes to a human-readable format.
 * @param {number} bytes - The number of bytes.
 * @returns {string} The human-readable size string.
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Iterates through the string to find the last number and its length.
 * @param {string} str - The string to iterate.
 * @returns {Array} Array containing the last number as string and its length.
 */
function iterateString(str) {
  let match = str.match(/(\d+)$/);
  if (match) {
    return [match[1], match[1].length];
  }
  return ['', 0];
}