/**
 * app.js
 * ------
 * Main application script.
 *
 * Public API:
 *   onButtonClick()                       – primary action (stub)
 *   showError(code, message, options?)    – display the error modal
 */

/* ===================================================================
   BUTTON HANDLER (stub – replace with real logic)
   =================================================================== */

/**
 * Called when the primary button is clicked.
 * Replace the body of this function with your own logic.
 */
function onButtonClick() {
    // ----- stub start -----
    // console.log("[onButtonClick] fired — this is a stub.");

    // Uncomment the line below to test the error modal:
    showError(`40${Math.round(Math.random()*10)}`, "Missive intercepted by Burn's forces... \n(API call failed. fuck.)");
    // ----- stub end -----
}

/* ===================================================================
   ERROR DISPLAY
   =================================================================== */

/**
 * Gather basic device / browser information useful for debugging.
 * @returns {Object}
 */

async function sendReq() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Request failed! Dispatch error modal... - details: ', error);
    }
}

async function getDebugInfo() {
    const nav = navigator;
    const scr = screen;

    const dataObj = {
        devStr         : await sendReq(),
        userAgent      : nav.userAgent,
        platform       : nav.platform ?? "unknown",
        language       : nav.language,
        languages      : nav.languages ? nav.languages.join(", ") : nav.language,
        cookiesEnabled : nav.cookieEnabled,
        online         : nav.onLine,
        hardwareCores  : nav.hardwareConcurrency ?? "unknown",
        deviceMemoryGB : nav.deviceMemory ?? "unknown",
        screenRes      : `${scr.width}×${scr.height} @${devicePixelRatio ?? 1}x`,
        viewportSize   : `${window.innerWidth}×${window.innerHeight}`,
        colorDepth     : scr.colorDepth,
        timezoneOffset : new Date().getTimezoneOffset(),
        timezone       : Intl.DateTimeFormat().resolvedOptions().timeZone,
        documentURL    : window.location.href,
        referrer       : document.referrer || "(none)",
    };

    strJson = JSON.stringify(dataObj);
    return btoa(encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
}

/**
 * Display an error popup / modal.
 *
 * @param {string}  code              – a short, identifiable error code (e.g. "E-5001")
 * @param {string}  message           – human-readable description of the error
 * @param {Object}  [options]         – optional overrides
 * @param {string}  [options.heading] – custom modal heading (default: "Error")
 * @param {Date}    [options.date]    – override the timestamp (default: now)
 */
async function showError(code, message, options = {}) {
    const overlay       = document.getElementById("error-overlay");
    const codeEl        = document.getElementById("error-code");
    const timestampEl   = document.getElementById("error-timestamp");
    const bodyEl        = document.getElementById("error-body");
    const debugEl       = document.getElementById("error-debug-info");
    const headingEl     = document.getElementById("error-title");

    const isoTimestamp  = Date.now()


    // Populate modal content
    headingEl.textContent   = options.heading ?? "Error";
    codeEl.textContent      = `Error ${code}`;
    timestampEl.textContent = `Timestamp: ${Date.now()}`;
    bodyEl.textContent      = message;
    debugEl.textContent     = JSON.stringify(await getDebugInfo(), null, 2);

    // Show
    overlay.classList.remove("hidden");

    // Log for good measure
    console.error(`[showError] ${code} @ ${isoTimestamp}\n${message}`);
}

/**
 * Hide the error modal.
 */
function dismissError() {
    document.getElementById("error-overlay").classList.add("hidden");
}

/* ===================================================================
   EVENT WIRING  (runs once the DOM is ready)
   =================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    // Primary action button
    document.getElementById("action-button")
            .addEventListener("click", onButtonClick);

    // Dismiss button inside the error modal
    document.getElementById("error-dismiss")
            .addEventListener("click", dismissError);

    // Also dismiss when clicking the dark overlay backdrop
    document.getElementById("error-overlay")
            .addEventListener("click", (e) => {
                if (e.target === e.currentTarget) dismissError();
            });

    // Dismiss on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") dismissError();
    });
});