/**
 * LinkedIn Website Actions Tester - UI Management Module
 * Handles DOM manipulation, element visibility, and UI state management
 */

// Global state
let requestCount = 0;
let capturedRequests = [];
let activeRequestIndex = -1;
let requestsById = new Map();

/**
 * Show an element by removing the 'hidden' class
 * @param {string} id - Element ID
 */
function showElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.remove('hidden');
    }
}

/**
 * Hide an element by adding the 'hidden' class
 * @param {string} id - Element ID
 */
function hideElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.add('hidden');
    }
}

/**
 * Update the output status message
 * @param {string} message - Status message to display
 */
function updateOutputStatus(message) {
    const statusElement = document.getElementById('output-status');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

/**
 * Clear all captured requests and reset UI state
 */
function clearOutput() {
    capturedRequests = [];
    requestCount = 0;
    activeRequestIndex = -1;
    requestsById.clear();
    
    const outputElement = document.getElementById('output');
    if (outputElement) {
        outputElement.textContent = 'Select a request from the sidebar to view its decoded content here.';
    }
    
    updateOutputStatus('Ready');
    
    const container = document.getElementById('requests-container');
    if (container) {
        container.innerHTML = '<div class="empty-state">No requests captured yet. Trigger a conversion event to see requests here.</div>';
    }
}

/**
 * Add a new request item to the sidebar
 * @param {Object} requestData - Request data object
 * @param {string} timestamp - Formatted timestamp
 */
function addRequestToSidebar(requestData, timestamp) {
    const container = document.getElementById('requests-container');
    if (!container) return;
    
    // Clear placeholder if this is the first request
    if (requestCount === 1) {
        container.innerHTML = '';
    }
    
    const requestItem = document.createElement('div');
    requestItem.className = 'request-item';
    requestItem.dataset.id = requestCount;
    requestItem.innerHTML = `
        <div class="request-timestamp">${timestamp}</div>
        <div class="request-id">Request #${requestCount}</div>
    `;
    
    requestItem.addEventListener("click", function (e) {
        const clickedItem = e.target.closest('.request-item');
        if (clickedItem) {
            selectRequest(parseInt(clickedItem.dataset.id));
        }
    });
    
    container.appendChild(requestItem);
    
    // Auto-select the newest request
    selectRequest(requestCount);
}

/**
 * Select and display a specific request
 * @param {number} index - Request index to select
 */
function selectRequest(index) {
    if (index >= 1 && index <= capturedRequests.length) {
        // Update active state
        document.querySelectorAll('.request-item').forEach((item) => {
            const itemId = parseInt(item.dataset.id);
            item.classList.toggle('active', itemId === index);
        });
        
        activeRequestIndex = index;
        const request = capturedRequests[index - 1];
        
        if (request) {
            // Display the request data
            const outputElement = document.getElementById('output');
            if (outputElement) {
                outputElement.textContent = request.formatted;
            }
            updateOutputStatus(`Showing Request #${request.id} from ${request.timestamp}`);
        }
    }
}

/**
 * Update the Website Actions status indicator
 * @param {string} status - Status text ('Enabled', 'Disabled', etc.)
 * @param {string} className - CSS class for styling
 */
function updateWebsiteActionsStatus(status, className) {
    const indicator = document.getElementById("website-actions");
    if (indicator) {
        indicator.textContent = status;
        indicator.classList.remove('status-neutral', 'status-connected', 'status-alert');
        indicator.classList.add(className);
    }
}

// Export functions for use in other modules
window.UIManager = {
    showElement,
    hideElement,
    updateOutputStatus,
    clearOutput,
    addRequestToSidebar,
    selectRequest,
    updateWebsiteActionsStatus,
    // Expose global state (read-only access recommended)
    getState: () => ({
        requestCount,
        capturedRequests,
        activeRequestIndex,
        requestsById
    }),
    // Allow controlled state updates
    incrementRequestCount: () => ++requestCount,
    addRequest: (request) => {
        capturedRequests.push(request);
        requestsById.set(request.id, request);
    }
};