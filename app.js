/**
 * LinkedIn Website Actions Tester - Main Application Module
 * Handles initialization, LinkedIn tracking setup, and form management
 */

/**
 * Initialize LinkedIn tracking with the given Partner ID
 * @param {string} partnerId - LinkedIn Partner ID
 */
function initializeLinkedInTracking(partnerId) {
    // Initialize LinkedIn tracking variables
    window._linkedin_partner_id = partnerId;
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(partnerId);
    
    // Load LinkedIn Insights Tag
    (function (l) {
        if (!l) {
            window.lintrk = function (a, b) { 
                window.lintrk.q = window.lintrk.q || [];
                window.lintrk.q.push([a, b]);
            };
            window.lintrk.q = [];
        }
        
        const s = document.getElementsByTagName("script")[0];
        const b = document.createElement("script");
        b.type = "text/javascript";
        b.async = true;
        b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
        s.parentNode.insertBefore(b, s);
        
        // Check Website Actions status after a delay
        setTimeout(function () {
            const state = window.UIManager.getState();
            if (state.capturedRequests && state.capturedRequests.length !== 0) {
                return; // Requests already captured
            } else {
                window.UIManager.updateWebsiteActionsStatus('Disabled', 'status-connected');
            }
        }, 500);
        
    })(window.lintrk);
}

/**
 * Set up conversion event tracking
 */
function setupConversionTracking() {
    const conversionLink = document.getElementById("conversion-link");
    if (!conversionLink) return;
    
    conversionLink.addEventListener("click", function () {
        const identifier = document.getElementById("test-identifier")?.value?.trim();
        const trackingData = { conversion_id: 19349169 };
        
        if (identifier) {
            trackingData.custom_identifier = identifier;
        }
        
        // Trigger LinkedIn conversion tracking
        if (window.lintrk) {
            window.lintrk('track', trackingData);
        }
        
        // Visual feedback for the button
        const originalContent = this.innerHTML;
        this.style.background = '#057642';
        this.innerHTML = '<svg class="icon" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>Event Sent!';
        
        setTimeout(() => {
            this.style.background = '';
            this.innerHTML = originalContent;
        }, 2000);
    });
}

/**
 * Set up the Partner ID input form
 */
function setupPidForm() {
    const pidForm = document.getElementById("pid-input-form");
    if (!pidForm) return;
    
    pidForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const pidInput = this.querySelector('input[name="pid"]');
        const pidValue = pidInput?.value?.trim();
        
        if (!pidValue) return;
        
        // Add loading state to submit button
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<svg class="icon" viewBox="0 0 20 20"><path d="M4 2v20l16-10z"/></svg>Loading...';
            submitBtn.disabled = true;
        }
        
        // Redirect to current page with PID parameter
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('pid', pidValue);
        window.location.href = currentUrl.toString();
    });
}

/**
 * Initialize the application based on URL parameters
 */
function initializeApp() {
    const params = new URLSearchParams(window.location.search);
    const partnerId = params.get("pid");
    
    if (partnerId) {
        // PID is present - show main content and initialize LinkedIn tracking
        window.UIManager.showElement("main-content");
        
        const pidElement = document.getElementById("current-pid");
        if (pidElement) {
            pidElement.textContent = partnerId;
        }
        
        // Initialize LinkedIn tracking
        initializeLinkedInTracking(partnerId);
        
        // Set up conversion tracking
        setupConversionTracking();
        
        window.UIManager.updateOutputStatus('LinkedIn Insights Tag loaded successfully');
        
    } else {
        // No PID - show form to input PID
        window.UIManager.showElement("pid-form");
        setupPidForm();
    }
}

/**
 * Set up global event handlers and clear functionality
 */
function setupGlobalHandlers() {
    // Make clearOutput available globally for onclick handlers
    window.clearOutput = window.UIManager.clearOutput;
}

/**
 * Main application initialization
 * Called when DOM is ready
 */
function main() {
    // Set up global handlers first
    setupGlobalHandlers();
    
    // Set up fetch interception for LinkedIn requests
    window.DataDecoder.setupFetchInterception();
    
    // Initialize the main application
    initializeApp();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    // DOM is already ready
    main();
}

// Export for potential external use
window.App = {
    initializeApp,
    initializeLinkedInTracking,
    setupConversionTracking,
    setupPidForm
};