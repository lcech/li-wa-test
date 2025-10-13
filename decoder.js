/**
 * LinkedIn Website Actions Tester - Data Decoder Module
 * Handles decoding and formatting of LinkedIn Website Actions data
 */

/**
 * Decode and format LinkedIn Website Actions data
 * @param {string} encodedStr - Base64 encoded and compressed data
 */
function decodeAndFormat(encodedStr) {
    try {
        // Step 1: Base64 decode to binary string
        const binaryString = atob(encodedStr);

        // Step 2: Convert binary string to Uint8Array
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Step 3: Decompress using pako
        const decompressed = pako.ungzip(bytes, { to: 'string' });

        // Step 4: Parse and format JSON
        const json = JSON.parse(decompressed);
        const formatted = JSON.stringify(json, null, 2);

        // Store request data
        const timestamp = new Date().toLocaleTimeString();
        const requestId = window.UIManager.incrementRequestCount();
        
        const requestData = {
            id: requestId,
            timestamp: timestamp,
            formatted: formatted,
            raw: json
        };
        
        // Add to global state
        window.UIManager.addRequest(requestData);
        
        // Add to sidebar and auto-select
        window.UIManager.addRequestToSidebar(requestData, timestamp);

        // Update status indicator
        window.UIManager.updateWebsiteActionsStatus('Enabled', 'status-alert');
        
        window.UIManager.updateOutputStatus(`Captured Request #${requestId} at ${timestamp}`);
        
    } catch (error) {
        console.error('Error decoding LinkedIn data:', error);
        
        const timestamp = new Date().toLocaleTimeString();
        const requestId = window.UIManager.incrementRequestCount();
        
        const errorData = {
            id: requestId,
            timestamp: timestamp,
            formatted: `Error decoding data: ${error.message}\n\nRaw data: ${encodedStr}`,
            raw: { error: error.message, rawData: encodedStr }
        };
        
        // Add to global state
        window.UIManager.addRequest(errorData);
        window.UIManager.addRequestToSidebar(errorData, timestamp);
        
        window.UIManager.updateOutputStatus('Error decoding request data');
    }
}

/**
 * Set up fetch interception for LinkedIn Website Actions requests
 */
function setupFetchInterception() {
    const originalFetch = window.fetch;
    
    window.fetch = async function (...args) {
        // Check if this is a LinkedIn Website Actions request
        if (args[0] && args[0].includes && args[0].includes('https://px.ads.linkedin.com/wa')) {
            window.UIManager.updateOutputStatus('Intercepting LinkedIn request...');
            
            if (args[1] && args[1].body) {
                decodeAndFormat(args[1].body);
            } else {
                const outputElement = document.getElementById('output');
                if (outputElement) {
                    outputElement.textContent = 'LinkedIn request intercepted but no body found.';
                }
                window.UIManager.updateOutputStatus('Request intercepted (no body)');
            }
        }
        
        // Log all intercepted requests for debugging
        console.log("Intercepted fetch:", args);
        
        // Call original fetch and return the response
        const response = await originalFetch(...args);
        return response;
    };
}

// Export functions for use in other modules
window.DataDecoder = {
    decodeAndFormat,
    setupFetchInterception
};