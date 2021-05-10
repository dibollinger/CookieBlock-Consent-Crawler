/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./content.js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../webext-instrumentation/build/module/background/cookie-instrument.js":
/*!******************************************************************************!*\
  !*** ../webext-instrumentation/build/module/background/cookie-instrument.js ***!
  \******************************************************************************/
/*! exports provided: transformCookieObjectToMatchOpenWPMSchema, CookieInstrument */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transformCookieObjectToMatchOpenWPMSchema", function() { return transformCookieObjectToMatchOpenWPMSchema; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CookieInstrument", function() { return CookieInstrument; });
/* harmony import */ var _lib_extension_session_event_ordinal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/extension-session-event-ordinal */ "../webext-instrumentation/build/module/lib/extension-session-event-ordinal.js");
/* harmony import */ var _lib_extension_session_uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/extension-session-uuid */ "../webext-instrumentation/build/module/lib/extension-session-uuid.js");
/* harmony import */ var _lib_string_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/string-utils */ "../webext-instrumentation/build/module/lib/string-utils.js");



const transformCookieObjectToMatchOpenWPMSchema = (cookie) => {
    const javascriptCookie = {};
    // Expiry time (in seconds)
    // May return ~Max(int64). I believe this is a session
    // cookie which doesn't expire. Sessions cookies with
    // non-max expiry time expire after session or at expiry.
    const expiryTime = cookie.expirationDate; // returns seconds
    let expiryTimeString;
    const maxInt64 = 9223372036854776000;
    if (!cookie.expirationDate || expiryTime === maxInt64) {
        expiryTimeString = "9999-12-31T21:59:59.000Z";
    }
    else {
        const expiryTimeDate = new Date(expiryTime * 1000); // requires milliseconds
        expiryTimeString = expiryTimeDate.toISOString();
    }
    javascriptCookie.expiry = expiryTimeString;
    javascriptCookie.is_http_only = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["boolToInt"])(cookie.httpOnly);
    javascriptCookie.is_host_only = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["boolToInt"])(cookie.hostOnly);
    javascriptCookie.is_session = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["boolToInt"])(cookie.session);
    javascriptCookie.host = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["escapeString"])(cookie.domain);
    javascriptCookie.is_secure = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["boolToInt"])(cookie.secure);
    javascriptCookie.name = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["escapeString"])(cookie.name);
    javascriptCookie.path = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["escapeString"])(cookie.path);
    javascriptCookie.value = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["escapeString"])(cookie.value);
    javascriptCookie.same_site = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["escapeString"])(cookie.sameSite);
    javascriptCookie.first_party_domain = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["escapeString"])(cookie.firstPartyDomain);
    javascriptCookie.store_id = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["escapeString"])(cookie.storeId);
    javascriptCookie.time_stamp = new Date().toISOString();
    return javascriptCookie;
};
class CookieInstrument {
    constructor(dataReceiver) {
        this.dataReceiver = dataReceiver;
    }
    run(crawlID) {
        // Instrument cookie changes
        this.onChangedListener = async (changeInfo) => {
            const eventType = changeInfo.removed ? "deleted" : "added-or-changed";
            const update = {
                record_type: eventType,
                change_cause: changeInfo.cause,
                browser_id: crawlID,
                extension_session_uuid: _lib_extension_session_uuid__WEBPACK_IMPORTED_MODULE_1__["extensionSessionUuid"],
                event_ordinal: Object(_lib_extension_session_event_ordinal__WEBPACK_IMPORTED_MODULE_0__["incrementedEventOrdinal"])(),
                ...transformCookieObjectToMatchOpenWPMSchema(changeInfo.cookie),
            };
            this.dataReceiver.saveRecord("javascript_cookies", update);
        };
        browser.cookies.onChanged.addListener(this.onChangedListener);
    }
    async saveAllCookies(crawlID) {
        const allCookies = await browser.cookies.getAll({});
        await Promise.all(allCookies.map((cookie) => {
            const update = {
                record_type: "manual-export",
                browser_id: crawlID,
                extension_session_uuid: _lib_extension_session_uuid__WEBPACK_IMPORTED_MODULE_1__["extensionSessionUuid"],
                ...transformCookieObjectToMatchOpenWPMSchema(cookie),
            };
            return this.dataReceiver.saveRecord("javascript_cookies", update);
        }));
    }
    cleanup() {
        if (this.onChangedListener) {
            browser.cookies.onChanged.removeListener(this.onChangedListener);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29va2llLWluc3RydW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYmFja2dyb3VuZC9jb29raWUtaW5zdHJ1bWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUNqRixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUNyRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBSzlELE1BQU0sQ0FBQyxNQUFNLHlDQUF5QyxHQUFHLENBQUMsTUFBYyxFQUFFLEVBQUU7SUFDMUUsTUFBTSxnQkFBZ0IsR0FBRyxFQUFzQixDQUFDO0lBRWhELDJCQUEyQjtJQUMzQixzREFBc0Q7SUFDdEQscURBQXFEO0lBQ3JELHlEQUF5RDtJQUN6RCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsa0JBQWtCO0lBQzVELElBQUksZ0JBQWdCLENBQUM7SUFDckIsTUFBTSxRQUFRLEdBQUcsbUJBQW1CLENBQUM7SUFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLElBQUksVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUNyRCxnQkFBZ0IsR0FBRywwQkFBMEIsQ0FBQztLQUMvQztTQUFNO1FBQ0wsTUFBTSxjQUFjLEdBQUcsSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsd0JBQXdCO1FBQzVFLGdCQUFnQixHQUFHLGNBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUNqRDtJQUNELGdCQUFnQixDQUFDLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQztJQUMzQyxnQkFBZ0IsQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMzRCxnQkFBZ0IsQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxR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

/***/ }),

/***/ "../webext-instrumentation/build/module/background/http-instrument.js":
/*!****************************************************************************!*\
  !*** ../webext-instrumentation/build/module/background/http-instrument.js ***!
  \****************************************************************************/
/*! exports provided: HttpInstrument */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpInstrument", function() { return HttpInstrument; });
/* harmony import */ var _lib_extension_session_event_ordinal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/extension-session-event-ordinal */ "../webext-instrumentation/build/module/lib/extension-session-event-ordinal.js");
/* harmony import */ var _lib_extension_session_uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/extension-session-uuid */ "../webext-instrumentation/build/module/lib/extension-session-uuid.js");
/* harmony import */ var _lib_http_post_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/http-post-parser */ "../webext-instrumentation/build/module/lib/http-post-parser.js");
/* harmony import */ var _lib_pending_request__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/pending-request */ "../webext-instrumentation/build/module/lib/pending-request.js");
/* harmony import */ var _lib_pending_response__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/pending-response */ "../webext-instrumentation/build/module/lib/pending-response.js");
/* harmony import */ var _lib_string_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/string-utils */ "../webext-instrumentation/build/module/lib/string-utils.js");






/**
 * Note: Different parts of the desired information arrives in different events as per below:
 * request = headers in onBeforeSendHeaders + body in onBeforeRequest
 * response = headers in onCompleted + body via a onBeforeRequest filter
 * redirect = original request headers+body, followed by a onBeforeRedirect and then a new set of request headers+body and response headers+body
 * Docs: https://developer.mozilla.org/en-US/docs/User:wbamberg/webRequest.RequestDetails
 */
class HttpInstrument {
    constructor(dataReceiver) {
        this.pendingRequests = {};
        this.pendingResponses = {};
        this.dataReceiver = dataReceiver;
    }
    run(crawlID, saveContentOption) {
        const allTypes = [
            "beacon",
            "csp_report",
            "font",
            "image",
            "imageset",
            "main_frame",
            "media",
            "object",
            "object_subrequest",
            "ping",
            "script",
            // "speculative",
            "stylesheet",
            "sub_frame",
            "web_manifest",
            "websocket",
            "xbl",
            "xml_dtd",
            "xmlhttprequest",
            "xslt",
            "other",
        ];
        const filter = { urls: ["<all_urls>"], types: allTypes };
        const requestStemsFromExtension = details => {
            return (details.originUrl && details.originUrl.indexOf("moz-extension://") > -1);
        };
        /*
         * Attach handlers to event listeners
         */
        this.onBeforeRequestListener = (details) => {
            const blockingResponseThatDoesNothing = {};
            // Ignore requests made by extensions
            if (requestStemsFromExtension(details)) {
                return blockingResponseThatDoesNothing;
            }
            const pendingRequest = this.getPendingRequest(details.requestId);
            pendingRequest.resolveOnBeforeRequestEventDetails(details);
            const pendingResponse = this.getPendingResponse(details.requestId);
            pendingResponse.resolveOnBeforeRequestEventDetails(details);
            if (this.shouldSaveContent(saveContentOption, details.type)) {
                pendingResponse.addResponseResponseBodyListener(details);
            }
            return blockingResponseThatDoesNothing;
        };
        browser.webRequest.onBeforeRequest.addListener(this.onBeforeRequestListener, filter, this.isContentSavingEnabled(saveContentOption)
            ? ["requestBody", "blocking"]
            : ["requestBody"]);
        this.onBeforeSendHeadersListener = details => {
            // Ignore requests made by extensions
            if (requestStemsFromExtension(details)) {
                return;
            }
            const pendingRequest = this.getPendingRequest(details.requestId);
            pendingRequest.resolveOnBeforeSendHeadersEventDetails(details);
            this.onBeforeSendHeadersHandler(details, crawlID, Object(_lib_extension_session_event_ordinal__WEBPACK_IMPORTED_MODULE_0__["incrementedEventOrdinal"])());
        };
        browser.webRequest.onBeforeSendHeaders.addListener(this.onBeforeSendHeadersListener, filter, ["requestHeaders"]);
        this.onBeforeRedirectListener = details => {
            // Ignore requests made by extensions
            if (requestStemsFromExtension(details)) {
                return;
            }
            this.onBeforeRedirectHandler(details, crawlID, Object(_lib_extension_session_event_ordinal__WEBPACK_IMPORTED_MODULE_0__["incrementedEventOrdinal"])());
        };
        browser.webRequest.onBeforeRedirect.addListener(this.onBeforeRedirectListener, filter, ["responseHeaders"]);
        this.onCompletedListener = details => {
            // Ignore requests made by extensions
            if (requestStemsFromExtension(details)) {
                return;
            }
            const pendingResponse = this.getPendingResponse(details.requestId);
            pendingResponse.resolveOnCompletedEventDetails(details);
            this.onCompletedHandler(details, crawlID, Object(_lib_extension_session_event_ordinal__WEBPACK_IMPORTED_MODULE_0__["incrementedEventOrdinal"])(), saveContentOption);
        };
        browser.webRequest.onCompleted.addListener(this.onCompletedListener, filter, ["responseHeaders"]);
    }
    cleanup() {
        if (this.onBeforeRequestListener) {
            browser.webRequest.onBeforeRequest.removeListener(this.onBeforeRequestListener);
        }
        if (this.onBeforeSendHeadersListener) {
            browser.webRequest.onBeforeSendHeaders.removeListener(this.onBeforeSendHeadersListener);
        }
        if (this.onBeforeRedirectListener) {
            browser.webRequest.onBeforeRedirect.removeListener(this.onBeforeRedirectListener);
        }
        if (this.onCompletedListener) {
            browser.webRequest.onCompleted.removeListener(this.onCompletedListener);
        }
    }
    isContentSavingEnabled(saveContentOption) {
        if (saveContentOption === true) {
            return true;
        }
        if (saveContentOption === false) {
            return false;
        }
        return this.saveContentResourceTypes(saveContentOption).length > 0;
    }
    saveContentResourceTypes(saveContentOption) {
        return saveContentOption.split(",");
    }
    /**
     * We rely on the resource type to filter responses
     * See: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/ResourceType
     *
     * @param saveContentOption
     * @param resourceType
     */
    shouldSaveContent(saveContentOption, resourceType) {
        if (saveContentOption === true) {
            return true;
        }
        if (saveContentOption === false) {
            return false;
        }
        return this.saveContentResourceTypes(saveContentOption).includes(resourceType);
    }
    getPendingRequest(requestId) {
        if (!this.pendingRequests[requestId]) {
            this.pendingRequests[requestId] = new _lib_pending_request__WEBPACK_IMPORTED_MODULE_3__["PendingRequest"]();
        }
        return this.pendingRequests[requestId];
    }
    getPendingResponse(requestId) {
        if (!this.pendingResponses[requestId]) {
            this.pendingResponses[requestId] = new _lib_pending_response__WEBPACK_IMPORTED_MODULE_4__["PendingResponse"]();
        }
        return this.pendingResponses[requestId];
    }
    /*
     * HTTP Request Handler and Helper Functions
     */
    async onBeforeSendHeadersHandler(details, crawlID, eventOrdinal) {
        /*
        console.log(
          "onBeforeSendHeadersHandler (previously httpRequestHandler)",
          details,
          crawlID,
        );
        */
        const tab = details.tabId > -1
            ? await browser.tabs.get(details.tabId)
            : { windowId: undefined, incognito: undefined, url: undefined };
        const update = {};
        update.incognito = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["boolToInt"])(tab.incognito);
        update.browser_id = crawlID;
        update.extension_session_uuid = _lib_extension_session_uuid__WEBPACK_IMPORTED_MODULE_1__["extensionSessionUuid"];
        update.event_ordinal = eventOrdinal;
        update.window_id = tab.windowId;
        update.tab_id = details.tabId;
        update.frame_id = details.frameId;
        // requestId is a unique identifier that can be used to link requests and responses
        update.request_id = details.requestId;
        const url = details.url;
        update.url = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeUrl"])(url);
        const requestMethod = details.method;
        update.method = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeString"])(requestMethod);
        const current_time = new Date(details.timeStamp);
        update.time_stamp = current_time.toISOString();
        let encodingType = "";
        let referrer = "";
        const headers = [];
        let isOcsp = false;
        if (details.requestHeaders) {
            details.requestHeaders.map(requestHeader => {
                const { name, value } = requestHeader;
                const header_pair = [];
                header_pair.push(Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeString"])(name));
                header_pair.push(Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeString"])(value));
                headers.push(header_pair);
                if (name === "Content-Type") {
                    encodingType = value;
                    if (encodingType.indexOf("application/ocsp-request") !== -1) {
                        isOcsp = true;
                    }
                }
                if (name === "Referer") {
                    referrer = value;
                }
            });
        }
        update.referrer = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeString"])(referrer);
        if (requestMethod === "POST" && !isOcsp /* don't process OCSP requests */) {
            const pendingRequest = this.getPendingRequest(details.requestId);
            const resolved = await pendingRequest.resolvedWithinTimeout(1000);
            if (!resolved) {
                this.dataReceiver.logError("Pending request timed out waiting for data from both onBeforeRequest and onBeforeSendHeaders events");
            }
            else {
                const onBeforeRequestEventDetails = await pendingRequest.onBeforeRequestEventDetails;
                const requestBody = onBeforeRequestEventDetails.requestBody;
                if (requestBody) {
                    const postParser = new _lib_http_post_parser__WEBPACK_IMPORTED_MODULE_2__["HttpPostParser"](
                    // details,
                    onBeforeRequestEventDetails, this.dataReceiver);
                    const postObj = postParser
                        .parsePostRequest();
                    // Add (POST) request headers from upload stream
                    if ("post_headers" in postObj) {
                        // Only store POST headers that we know and need. We may misinterpret POST data as headers
                        // as detection is based on "key:value" format (non-header POST data can be in this format as well)
                        const contentHeaders = [
                            "Content-Type",
                            "Content-Disposition",
                            "Content-Length",
                        ];
                        for (const name in postObj.post_headers) {
                            if (contentHeaders.includes(name)) {
                                const header_pair = [];
                                header_pair.push(Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeString"])(name));
                                header_pair.push(Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeString"])(postObj.post_headers[name]));
                                headers.push(header_pair);
                            }
                        }
                    }
                    // we store POST body in JSON format, except when it's a string without a (key-value) structure
                    if ("post_body" in postObj) {
                        update.post_body = postObj.post_body;
                    }
                    if ("post_body_raw" in postObj) {
                        update.post_body_raw = postObj.post_body_raw;
                    }
                }
            }
        }
        update.headers = JSON.stringify(headers);
        // Check if xhr
        const isXHR = details.type === "xmlhttprequest";
        update.is_XHR = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["boolToInt"])(isXHR);
        // Grab the triggering and loading Principals
        let triggeringOrigin;
        let loadingOrigin;
        if (details.originUrl) {
            const parsedOriginUrl = new URL(details.originUrl);
            triggeringOrigin = parsedOriginUrl.origin;
        }
        if (details.documentUrl) {
            const parsedDocumentUrl = new URL(details.documentUrl);
            loadingOrigin = parsedDocumentUrl.origin;
        }
        update.triggering_origin = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeString"])(triggeringOrigin);
        update.loading_origin = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeString"])(loadingOrigin);
        // loadingDocument's href
        // The loadingDocument is the document the element resides, regardless of
        // how the load was triggered.
        const loadingHref = details.documentUrl;
        update.loading_href = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeString"])(loadingHref);
        // resourceType of the requesting node. This is set by the type of
        // node making the request (i.e. an <img src=...> node will set to type "image").
        // Documentation:
        // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/ResourceType
        update.resource_type = details.type;
        /*
        // TODO: Refactor to corresponding webext logic or discard
        const ThirdPartyUtil = Cc["@mozilla.org/thirdpartyutil;1"].getService(
                               Ci.mozIThirdPartyUtil);
        // Do third-party checks
        // These specific checks are done because it's what's used in Tracking Protection
        // See: http://searchfox.org/mozilla-central/source/netwerk/base/nsChannelClassifier.cpp#107
        try {
          const isThirdPartyChannel = ThirdPartyUtil.isThirdPartyChannel(details);
          const topWindow = ThirdPartyUtil.getTopWindowForChannel(details);
          const topURI = ThirdPartyUtil.getURIFromWindow(topWindow);
          if (topURI) {
            const topUrl = topURI.spec;
            const channelURI = details.URI;
            const isThirdPartyToTopWindow = ThirdPartyUtil.isThirdPartyURI(
              channelURI,
              topURI,
            );
            update.is_third_party_to_top_window = isThirdPartyToTopWindow;
            update.is_third_party_channel = isThirdPartyChannel;
          }
        } catch (anError) {
          // Exceptions expected for channels triggered or loading in a
          // NullPrincipal or SystemPrincipal. They are also expected for favicon
          // loads, which we attempt to filter. Depending on the naming, some favicons
          // may continue to lead to error logs.
          if (
            update.triggering_origin !== "[System Principal]" &&
            update.triggering_origin !== undefined &&
            update.loading_origin !== "[System Principal]" &&
            update.loading_origin !== undefined &&
            !update.url.endsWith("ico")
          ) {
            this.dataReceiver.logError(
              "Error while retrieving additional channel information for URL: " +
              "\n" +
              update.url +
              "\n Error text:" +
              JSON.stringify(anError),
            );
          }
        }
        */
        update.top_level_url = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeUrl"])(this.getDocumentUrlForRequest(details));
        update.parent_frame_id = details.parentFrameId;
        update.frame_ancestors = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeString"])(JSON.stringify(details.frameAncestors));
        this.dataReceiver.saveRecord("http_requests", update);
    }
    /**
     * Code taken and adapted from
     * https://github.com/EFForg/privacybadger/pull/2198/files
     *
     * Gets the URL for a given request's top-level document.
     *
     * The request's document may be different from the current top-level document
     * loaded in tab as requests can come out of order:
     *
     * @param {WebRequestOnBeforeSendHeadersEventDetails} details
     *
     * @return {?String} the URL for the request's top-level document
     */
    getDocumentUrlForRequest(details) {
        let url = "";
        if (details.type === "main_frame") {
            // Url of the top-level document itself.
            url = details.url;
        }
        else if (details.hasOwnProperty("frameAncestors")) {
            // In case of nested frames, retrieve url from top-most ancestor.
            // If frameAncestors == [], request comes from the top-level-document.
            url = details.frameAncestors.length
                ? details.frameAncestors[details.frameAncestors.length - 1].url
                : details.documentUrl;
        }
        else {
            // type != 'main_frame' and frameAncestors == undefined
            // For example service workers: https://bugzilla.mozilla.org/show_bug.cgi?id=1470537#c13
            url = details.documentUrl;
        }
        return url;
    }
    async onBeforeRedirectHandler(details, crawlID, eventOrdinal) {
        /*
        console.log(
          "onBeforeRedirectHandler (previously httpRequestHandler)",
          details,
          crawlID,
        );
        */
        // Save HTTP redirect events
        // Events are saved to the `http_redirects` table
        /*
        // TODO: Refactor to corresponding webext logic or discard
        // Events are saved to the `http_redirects` table, and map the old
        // request/response channel id to the new request/response channel id.
        // Implementation based on: https://stackoverflow.com/a/11240627
        const oldNotifications = details.notificationCallbacks;
        let oldEventSink = null;
        details.notificationCallbacks = {
          QueryInterface: XPCOMUtils.generateQI([
            Ci.nsIInterfaceRequestor,
            Ci.nsIChannelEventSink,
          ]),
    
          getInterface(iid) {
            // We are only interested in nsIChannelEventSink,
            // return the old callbacks for any other interface requests.
            if (iid.equals(Ci.nsIChannelEventSink)) {
              try {
                oldEventSink = oldNotifications.QueryInterface(iid);
              } catch (anError) {
                this.dataReceiver.logError(
                  "Error during call to custom notificationCallbacks::getInterface." +
                    JSON.stringify(anError),
                );
              }
              return this;
            }
    
            if (oldNotifications) {
              return oldNotifications.getInterface(iid);
            } else {
              throw Cr.NS_ERROR_NO_INTERFACE;
            }
          },
    
          asyncOnChannelRedirect(oldChannel, newChannel, flags, callback) {
    
            newChannel.QueryInterface(Ci.nsIHttpChannel);
    
            const httpRedirect: HttpRedirect = {
              browser_id: crawlID,
              old_request_id: oldChannel.channelId,
              new_request_id: newChannel.channelId,
              time_stamp: new Date().toISOString(),
            };
            this.dataReceiver.saveRecord("http_redirects", httpRedirect);
    
            if (oldEventSink) {
              oldEventSink.asyncOnChannelRedirect(
                oldChannel,
                newChannel,
                flags,
                callback,
              );
            } else {
              callback.onRedirectVerifyCallback(Cr.NS_OK);
            }
          },
        };
        */
        const responseStatus = details.statusCode;
        const responseStatusText = details.statusLine;
        const tab = details.tabId > -1
            ? await browser.tabs.get(details.tabId)
            : { windowId: undefined, incognito: undefined };
        const httpRedirect = {
            incognito: Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["boolToInt"])(tab.incognito),
            browser_id: crawlID,
            old_request_url: Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeUrl"])(details.url),
            old_request_id: details.requestId,
            new_request_url: Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeUrl"])(details.redirectUrl),
            new_request_id: null,
            extension_session_uuid: _lib_extension_session_uuid__WEBPACK_IMPORTED_MODULE_1__["extensionSessionUuid"],
            event_ordinal: eventOrdinal,
            window_id: tab.windowId,
            tab_id: details.tabId,
            frame_id: details.frameId,
            response_status: responseStatus,
            response_status_text: Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeString"])(responseStatusText),
            headers: this.jsonifyHeaders(details.responseHeaders).headers,
            time_stamp: new Date(details.timeStamp).toISOString(),
        };
        this.dataReceiver.saveRecord("http_redirects", httpRedirect);
    }
    /*
     * HTTP Response Handlers and Helper Functions
     */
    async logWithResponseBody(details, update) {
        const pendingResponse = this.getPendingResponse(details.requestId);
        try {
            const responseBodyListener = pendingResponse.responseBodyListener;
            const respBody = await responseBodyListener.getResponseBody();
            const contentHash = await responseBodyListener.getContentHash();
            this.dataReceiver.saveContent(respBody, Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeString"])(contentHash));
            update.content_hash = contentHash;
            this.dataReceiver.saveRecord("http_responses", update);
        }
        catch (err) {
            /*
            // TODO: Refactor to corresponding webext logic or discard
            dataReceiver.logError(
              "Unable to retrieve response body." + JSON.stringify(aReason),
            );
            update.content_hash = "<error>";
            dataReceiver.saveRecord("http_responses", update);
            */
            this.dataReceiver.logError("Unable to retrieve response body." +
                "Likely caused by a programming error. Error Message:" +
                err.name +
                err.message +
                "\n" +
                err.stack);
            update.content_hash = "<error>";
            this.dataReceiver.saveRecord("http_responses", update);
        }
    }
    // Instrument HTTP responses
    async onCompletedHandler(details, crawlID, eventOrdinal, saveContent) {
        /*
        console.log(
          "onCompletedHandler (previously httpRequestHandler)",
          details,
          crawlID,
          saveContent,
        );
        */
        const tab = details.tabId > -1
            ? await browser.tabs.get(details.tabId)
            : { windowId: undefined, incognito: undefined };
        const update = {};
        update.incognito = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["boolToInt"])(tab.incognito);
        update.browser_id = crawlID;
        update.extension_session_uuid = _lib_extension_session_uuid__WEBPACK_IMPORTED_MODULE_1__["extensionSessionUuid"];
        update.event_ordinal = eventOrdinal;
        update.window_id = tab.windowId;
        update.tab_id = details.tabId;
        update.frame_id = details.frameId;
        // requestId is a unique identifier that can be used to link requests and responses
        update.request_id = details.requestId;
        const isCached = details.fromCache;
        update.is_cached = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["boolToInt"])(isCached);
        const url = details.url;
        update.url = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeUrl"])(url);
        const requestMethod = details.method;
        update.method = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeString"])(requestMethod);
        // TODO: Refactor to corresponding webext logic or discard
        // (request headers are not available in http response event listener object,
        // but the referrer property of the corresponding request could be queried)
        //
        // let referrer = "";
        // if (details.referrer) {
        //   referrer = details.referrer.spec;
        // }
        // update.referrer = escapeString(referrer);
        const responseStatus = details.statusCode;
        update.response_status = responseStatus;
        const responseStatusText = details.statusLine;
        update.response_status_text = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeString"])(responseStatusText);
        const current_time = new Date(details.timeStamp);
        update.time_stamp = current_time.toISOString();
        const parsedHeaders = this.jsonifyHeaders(details.responseHeaders);
        update.headers = parsedHeaders.headers;
        update.location = parsedHeaders.location;
        if (this.shouldSaveContent(saveContent, details.type)) {
            this.logWithResponseBody(details, update);
        }
        else {
            this.dataReceiver.saveRecord("http_responses", update);
        }
    }
    jsonifyHeaders(headers) {
        const resultHeaders = [];
        let location = "";
        if (headers) {
            headers.map(responseHeader => {
                const { name, value } = responseHeader;
                const header_pair = [];
                header_pair.push(Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeString"])(name));
                header_pair.push(Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeString"])(value));
                resultHeaders.push(header_pair);
                if (name.toLowerCase() === "location") {
                    location = value;
                }
            });
        }
        return {
            headers: JSON.stringify(resultHeaders),
            location: Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_5__["escapeString"])(location),
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1pbnN0cnVtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JhY2tncm91bmQvaHR0cC1pbnN0cnVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ2pGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxjQUFjLEVBQXFCLE1BQU0seUJBQXlCLENBQUM7QUFDNUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3hELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUsxRCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQVd6RTs7Ozs7O0dBTUc7QUFFSCxNQUFNLE9BQU8sY0FBYztJQWF6QixZQUFZLFlBQVk7UUFYaEIsb0JBQWUsR0FFbkIsRUFBRSxDQUFDO1FBQ0MscUJBQWdCLEdBRXBCLEVBQUUsQ0FBQztRQU9MLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO0lBQ25DLENBQUM7SUFFTSxHQUFHLENBQUMsT0FBTyxFQUFFLGlCQUFvQztRQUN0RCxNQUFNLFFBQVEsR0FBbUI7WUFDL0IsUUFBUTtZQUNSLFlBQVk7WUFDWixNQUFNO1lBQ04sT0FBTztZQUNQLFVBQVU7WUFDVixZQUFZO1lBQ1osT0FBTztZQUNQLFFBQVE7WUFDUixtQkFBbUI7WUFDbkIsTUFBTTtZQUNOLFFBQVE7WUFDUixpQkFBaUI7WUFDakIsWUFBWTtZQUNaLFdBQVc7WUFDWCxjQUFjO1lBQ2QsV0FBVztZQUNYLEtBQUs7WUFDTCxTQUFTO1lBQ1QsZ0JBQWdCO1lBQ2hCLE1BQU07WUFDTixPQUFPO1NBQ1IsQ0FBQztRQUVGLE1BQU0sTUFBTSxHQUFrQixFQUFFLElBQUksRUFBRSxDQUFDLFlB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

/***/ }),

/***/ "../webext-instrumentation/build/module/background/javascript-instrument.js":
/*!**********************************************************************************!*\
  !*** ../webext-instrumentation/build/module/background/javascript-instrument.js ***!
  \**********************************************************************************/
/*! exports provided: JavascriptInstrument */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JavascriptInstrument", function() { return JavascriptInstrument; });
/* harmony import */ var _lib_extension_session_event_ordinal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/extension-session-event-ordinal */ "../webext-instrumentation/build/module/lib/extension-session-event-ordinal.js");
/* harmony import */ var _lib_extension_session_uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/extension-session-uuid */ "../webext-instrumentation/build/module/lib/extension-session-uuid.js");
/* harmony import */ var _lib_string_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/string-utils */ "../webext-instrumentation/build/module/lib/string-utils.js");



class JavascriptInstrument {
    constructor(dataReceiver) {
        this.configured = false;
        this.pendingRecords = [];
        this.dataReceiver = dataReceiver;
    }
    /**
     * Converts received call and values data from the JS Instrumentation
     * into the format that the schema expects.
     * @param data
     * @param sender
     */
    static processCallsAndValues(data, sender) {
        const update = {};
        update.extension_session_uuid = _lib_extension_session_uuid__WEBPACK_IMPORTED_MODULE_1__["extensionSessionUuid"];
        update.event_ordinal = Object(_lib_extension_session_event_ordinal__WEBPACK_IMPORTED_MODULE_0__["incrementedEventOrdinal"])();
        update.page_scoped_event_ordinal = data.ordinal;
        update.window_id = sender.tab.windowId;
        update.tab_id = sender.tab.id;
        update.frame_id = sender.frameId;
        update.script_url = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["escapeUrl"])(data.scriptUrl);
        update.script_line = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["escapeString"])(data.scriptLine);
        update.script_col = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["escapeString"])(data.scriptCol);
        update.func_name = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["escapeString"])(data.funcName);
        update.script_loc_eval = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["escapeString"])(data.scriptLocEval);
        update.call_stack = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["escapeString"])(data.callStack);
        update.symbol = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["escapeString"])(data.symbol);
        update.operation = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["escapeString"])(data.operation);
        update.value = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["escapeString"])(data.value);
        update.time_stamp = data.timeStamp;
        update.incognito = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["boolToInt"])(sender.tab.incognito);
        // document_url is the current frame's document href
        // top_level_url is the top-level frame's document href
        update.document_url = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["escapeUrl"])(sender.url);
        update.top_level_url = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["escapeUrl"])(sender.tab.url);
        if (data.operation === "call" && data.args.length > 0) {
            update.arguments = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_2__["escapeString"])(JSON.stringify(data.args));
        }
        return update;
    }
    /**
     * Start listening for messages from page/content/background scripts injected to instrument JavaScript APIs
     */
    listen() {
        this.onMessageListener = (message, sender) => {
            // console.debug("javascript-instrumentation background listener", {message, sender}, this.configured);
            if (message.namespace &&
                message.namespace === "javascript-instrumentation") {
                this.handleJsInstrumentationMessage(message, sender);
            }
        };
        browser.runtime.onMessage.addListener(this.onMessageListener);
    }
    /**
     * Either sends the log data to the dataReceiver or store it in memory
     * as a pending record if the JS instrumentation is not yet configured
     * @param message
     * @param sender
     */
    handleJsInstrumentationMessage(message, sender) {
        switch (message.type) {
            case "logCall":
            case "logValue":
                const update = JavascriptInstrument.processCallsAndValues(message.data, sender);
                if (this.configured) {
                    update.browser_id = this.crawlID;
                    this.dataReceiver.saveRecord("javascript", update);
                }
                else {
                    this.pendingRecords.push(update);
                }
                break;
        }
    }
    /**
     * Starts listening if haven't done so already, sets the crawl ID,
     * marks the JS instrumentation as configured and sends any pending
     * records that have been received up until this point.
     * @param crawlID
     */
    run(crawlID) {
        if (!this.onMessageListener) {
            this.listen();
        }
        this.crawlID = crawlID;
        this.configured = true;
        this.pendingRecords.map(update => {
            update.browser_id = this.crawlID;
            this.dataReceiver.saveRecord("javascript", update);
        });
    }
    async registerContentScript(testing, jsInstrumentationSettingsString) {
        const contentScriptConfig = {
            testing,
            jsInstrumentationSettingsString,
        };
        if (contentScriptConfig) {
            // TODO: Avoid using window to pass the content script config
            await browser.contentScripts.register({
                js: [
                    {
                        code: `window.openWpmContentScriptConfig = ${JSON.stringify(contentScriptConfig)};`,
                    },
                ],
                matches: ["<all_urls>"],
                allFrames: true,
                runAt: "document_start",
                matchAboutBlank: true,
            });
        }
        return browser.contentScripts.register({
            js: [{ file: "/content.js" }],
            matches: ["<all_urls>"],
            allFrames: true,
            runAt: "document_start",
            matchAboutBlank: true,
        });
    }
    cleanup() {
        this.pendingRecords = [];
        if (this.onMessageListener) {
            browser.runtime.onMessage.removeListener(this.onMessageListener);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamF2YXNjcmlwdC1pbnN0cnVtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JhY2tncm91bmQvamF2YXNjcmlwdC1pbnN0cnVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ2pGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBR3pFLE1BQU0sT0FBTyxvQkFBb0I7SUE0Qy9CLFlBQVksWUFBWTtRQUpoQixlQUFVLEdBQVksS0FBSyxDQUFDO1FBQzVCLG1CQUFjLEdBQTBCLEVBQUUsQ0FBQztRQUlqRCxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztJQUNuQyxDQUFDO0lBN0NEOzs7OztPQUtHO0lBQ0ssTUFBTSxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxNQUFxQjtRQUM5RCxNQUFNLE1BQU0sR0FBRyxFQUF5QixDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxzQkFBc0IsR0FBRyxvQkFBb0IsQ0FBQztRQUNyRCxNQUFNLENBQUMsYUFBYSxHQUFHLHVCQUF1QixFQUFFLENBQUM7UUFDakQsTUFBTSxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDaEQsTUFBTSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUN2QyxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNqQyxNQUFNLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUMsTUFBTSxDQUFDLFdB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

/***/ }),

/***/ "../webext-instrumentation/build/module/background/navigation-instrument.js":
/*!**********************************************************************************!*\
  !*** ../webext-instrumentation/build/module/background/navigation-instrument.js ***!
  \**********************************************************************************/
/*! exports provided: transformWebNavigationBaseEventDetailsToOpenWPMSchema, NavigationInstrument */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transformWebNavigationBaseEventDetailsToOpenWPMSchema", function() { return transformWebNavigationBaseEventDetailsToOpenWPMSchema; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavigationInstrument", function() { return NavigationInstrument; });
/* harmony import */ var _lib_extension_session_event_ordinal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/extension-session-event-ordinal */ "../webext-instrumentation/build/module/lib/extension-session-event-ordinal.js");
/* harmony import */ var _lib_extension_session_uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/extension-session-uuid */ "../webext-instrumentation/build/module/lib/extension-session-uuid.js");
/* harmony import */ var _lib_pending_navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/pending-navigation */ "../webext-instrumentation/build/module/lib/pending-navigation.js");
/* harmony import */ var _lib_string_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/string-utils */ "../webext-instrumentation/build/module/lib/string-utils.js");
/* harmony import */ var _lib_uuid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/uuid */ "../webext-instrumentation/build/module/lib/uuid.js");





const transformWebNavigationBaseEventDetailsToOpenWPMSchema = async (crawlID, details) => {
    const tab = details.tabId > -1
        ? await browser.tabs.get(details.tabId)
        : {
            windowId: undefined,
            incognito: undefined,
            cookieStoreId: undefined,
            openerTabId: undefined,
            width: undefined,
            height: undefined,
        };
    const window = tab.windowId
        ? await browser.windows.get(tab.windowId)
        : { width: undefined, height: undefined, type: undefined };
    const navigation = {
        browser_id: crawlID,
        incognito: Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_3__["boolToInt"])(tab.incognito),
        extension_session_uuid: _lib_extension_session_uuid__WEBPACK_IMPORTED_MODULE_1__["extensionSessionUuid"],
        process_id: details.processId,
        window_id: tab.windowId,
        tab_id: details.tabId,
        tab_opener_tab_id: tab.openerTabId,
        frame_id: details.frameId,
        window_width: window.width,
        window_height: window.height,
        window_type: window.type,
        tab_width: tab.width,
        tab_height: tab.height,
        tab_cookie_store_id: Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_3__["escapeString"])(tab.cookieStoreId),
        uuid: Object(_lib_uuid__WEBPACK_IMPORTED_MODULE_4__["makeUUID"])(),
        url: Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_3__["escapeUrl"])(details.url),
    };
    return navigation;
};
class NavigationInstrument {
    constructor(dataReceiver) {
        this.pendingNavigations = {};
        this.dataReceiver = dataReceiver;
    }
    static navigationId(processId, tabId, frameId) {
        return `${processId}-${tabId}-${frameId}`;
    }
    run(crawlID) {
        this.onBeforeNavigateListener = async (details) => {
            const navigationId = NavigationInstrument.navigationId(details.processId, details.tabId, details.frameId);
            const pendingNavigation = this.instantiatePendingNavigation(navigationId);
            const navigation = await transformWebNavigationBaseEventDetailsToOpenWPMSchema(crawlID, details);
            navigation.parent_frame_id = details.parentFrameId;
            navigation.before_navigate_event_ordinal = Object(_lib_extension_session_event_ordinal__WEBPACK_IMPORTED_MODULE_0__["incrementedEventOrdinal"])();
            navigation.before_navigate_time_stamp = new Date(details.timeStamp).toISOString();
            pendingNavigation.resolveOnBeforeNavigateEventNavigation(navigation);
        };
        browser.webNavigation.onBeforeNavigate.addListener(this.onBeforeNavigateListener);
        this.onCommittedListener = async (details) => {
            const navigationId = NavigationInstrument.navigationId(details.processId, details.tabId, details.frameId);
            const navigation = await transformWebNavigationBaseEventDetailsToOpenWPMSchema(crawlID, details);
            navigation.transition_qualifiers = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_3__["escapeString"])(JSON.stringify(details.transitionQualifiers));
            navigation.transition_type = Object(_lib_string_utils__WEBPACK_IMPORTED_MODULE_3__["escapeString"])(details.transitionType);
            navigation.committed_event_ordinal = Object(_lib_extension_session_event_ordinal__WEBPACK_IMPORTED_MODULE_0__["incrementedEventOrdinal"])();
            navigation.committed_time_stamp = new Date(details.timeStamp).toISOString();
            // include attributes from the corresponding onBeforeNavigation event
            const pendingNavigation = this.getPendingNavigation(navigationId);
            if (pendingNavigation) {
                pendingNavigation.resolveOnCommittedEventNavigation(navigation);
                const resolved = await pendingNavigation.resolvedWithinTimeout(1000);
                if (resolved) {
                    const onBeforeNavigateEventNavigation = await pendingNavigation.onBeforeNavigateEventNavigation;
                    navigation.parent_frame_id =
                        onBeforeNavigateEventNavigation.parent_frame_id;
                    navigation.before_navigate_event_ordinal =
                        onBeforeNavigateEventNavigation.before_navigate_event_ordinal;
                    navigation.before_navigate_time_stamp =
                        onBeforeNavigateEventNavigation.before_navigate_time_stamp;
                }
            }
            this.dataReceiver.saveRecord("navigations", navigation);
        };
        browser.webNavigation.onCommitted.addListener(this.onCommittedListener);
    }
    cleanup() {
        if (this.onBeforeNavigateListener) {
            browser.webNavigation.onBeforeNavigate.removeListener(this.onBeforeNavigateListener);
        }
        if (this.onCommittedListener) {
            browser.webNavigation.onCommitted.removeListener(this.onCommittedListener);
        }
    }
    instantiatePendingNavigation(navigationId) {
        this.pendingNavigations[navigationId] = new _lib_pending_navigation__WEBPACK_IMPORTED_MODULE_2__["PendingNavigation"]();
        return this.pendingNavigations[navigationId];
    }
    getPendingNavigation(navigationId) {
        return this.pendingNavigations[navigationId];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2aWdhdGlvbi1pbnN0cnVtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JhY2tncm91bmQvbmF2aWdhdGlvbi1pbnN0cnVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ2pGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzlELE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFRdkMsTUFBTSxDQUFDLE1BQU0scURBQXFELEdBQUcsS0FBSyxFQUN4RSxPQUFPLEVBQ1AsT0FBc0MsRUFDakIsRUFBRTtJQUN2QixNQUFNLEdBQUcsR0FDUCxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixDQUFDLENBQUMsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQztZQUNFLFFBQVEsRUFBRSxTQUFTO1lBQ25CLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLGFBQWEsRUFBRSxTQUFTO1lBQ3hCLFdBQVcsRUFBRSxTQUFTO1lBQ3RCLEtBQUssRUFBRSxTQUFTO1lBQ2hCLE1BQU0sRUFBRSxTQUFTO1NBQ2xCLENBQUM7SUFDUixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsUUFBUTtRQUN6QixDQUFDLENBQUMsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxJ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

/***/ }),

/***/ "../webext-instrumentation/build/module/content/javascript-instrument-content-scope.js":
/*!*********************************************************************************************!*\
  !*** ../webext-instrumentation/build/module/content/javascript-instrument-content-scope.js ***!
  \*********************************************************************************************/
/*! exports provided: injectJavascriptInstrumentPageScript */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "injectJavascriptInstrumentPageScript", function() { return injectJavascriptInstrumentPageScript; });
/* harmony import */ var _lib_js_instruments__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/js-instruments */ "../webext-instrumentation/build/module/lib/js-instruments.js");
/* harmony import */ var _javascript_instrument_page_scope__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./javascript-instrument-page-scope */ "../webext-instrumentation/build/module/content/javascript-instrument-page-scope.js");


function getPageScriptAsString(jsInstrumentationSettingsString) {
    // The JS Instrument Requests are setup and validated python side
    // including setting defaults for logSettings. See JSInstrumentation.py
    const pageScriptString = `
// Start of js-instruments.
${_lib_js_instruments__WEBPACK_IMPORTED_MODULE_0__["getInstrumentJS"]}
// End of js-instruments.

// Start of custom instrumentRequests.
const jsInstrumentationSettings = ${jsInstrumentationSettingsString};
// End of custom instrumentRequests.

// Start of anonymous function from javascript-instrument-page-scope.ts
(${_javascript_instrument_page_scope__WEBPACK_IMPORTED_MODULE_1__["pageScript"]}(getInstrumentJS, jsInstrumentationSettings));
// End.
  `;
    return pageScriptString;
}
function insertScript(pageScriptString, eventId, testing = false) {
    const parent = document.documentElement, script = document.createElement("script");
    script.text = pageScriptString;
    script.async = false;
    script.setAttribute("data-event-id", eventId);
    script.setAttribute("data-testing", `${testing}`);
    parent.insertBefore(script, parent.firstChild);
    parent.removeChild(script);
}
function emitMsg(type, msg) {
    msg.timeStamp = new Date().toISOString();
    browser.runtime.sendMessage({
        namespace: "javascript-instrumentation",
        type,
        data: msg,
    });
}
const eventId = Math.random().toString();
// listen for messages from the script we are about to insert
document.addEventListener(eventId, function (e) {
    // pass these on to the background page
    const msgs = e.detail;
    if (Array.isArray(msgs)) {
        msgs.forEach(function (msg) {
            emitMsg(msg.type, msg.content);
        });
    }
    else {
        emitMsg(msgs.type, msgs.content);
    }
});
function injectJavascriptInstrumentPageScript(contentScriptConfig) {
    insertScript(getPageScriptAsString(contentScriptConfig.jsInstrumentationSettingsString), eventId, contentScriptConfig.testing);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamF2YXNjcmlwdC1pbnN0cnVtZW50LWNvbnRlbnQtc2NvcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29udGVudC9qYXZhc2NyaXB0LWluc3RydW1lbnQtY29udGVudC1zY29wZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDeEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBRWhFLFNBQVMscUJBQXFCLENBQzVCLCtCQUF1QztJQUV2QyxpRUFBaUU7SUFDakUsdUVBQXVFO0lBQ3ZFLE1BQU0sZ0JBQWdCLEdBQUc7O0VBRXpCLGVBQWU7Ozs7b0NBSW1CLCtCQUErQjs7OztHQUloRSxVQUFVOztHQUVWLENBQUM7SUFDRixPQUFPLGdCQUFnQixDQUFDO0FBQzFCLENBQUM7QUFFRCxTQUFTLFlBQVksQ0FDbkIsZ0JBQXdCLEVBQ3hCLE9BQWUsRUFDZixVQUFtQixLQUFLO0lBRXhCLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxlQUFlLEVBQ3JDLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzVDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsZ0JBQWdCLENBQUM7SUFDL0IsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsTUFBTSxDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDOUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ2xELE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMvQyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFFRCxTQUFTLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRztJQUN4QixHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDekMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7UUFDMUIsU0FBUyxFQUFFLDRCQUE0QjtRQUN2QyxJQUFJO1FBQ0osSUFBSSxFQUFFLEdBQUc7S0FDVixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBRXpDLDZEQUE2RDtBQUM3RCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVMsQ0FBYztJQUN4RCx1Q0FBdUM7SUFDdkMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUN0QixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFTLEdBQUc7WUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO0tBQ0o7U0FBTTtRQUNMLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNsQztBQUNILENBQUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxVQUFVLG9DQUFvQyxDQUFDLG1CQUFtQjtJQUN0RSxZQUFZLENBQ1YscUJBQXFCLENBQUMsbUJBQW1CLENBQUMsK0JBQStCLENBQUMsRUFDMUUsT0FBTyxFQUNQLG1CQUFtQixDQUFDLE9BQU8sQ0FDNUIsQ0FBQztBQUNKLENBQUMifQ==

/***/ }),

/***/ "../webext-instrumentation/build/module/content/javascript-instrument-page-scope.js":
/*!******************************************************************************************!*\
  !*** ../webext-instrumentation/build/module/content/javascript-instrument-page-scope.js ***!
  \******************************************************************************************/
/*! exports provided: pageScript */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pageScript", function() { return pageScript; });
// Code below is not a content script: no Firefox APIs should be used
// Also, no webpack/es6 imports may be used in this file since the script
// is exported as a page script as a string
const pageScript = function (getInstrumentJS, jsInstrumentationSettings) {
    // messages the injected script
    function sendMessagesToLogger(eventId, messages) {
        document.dispatchEvent(new CustomEvent(eventId, {
            detail: messages,
        }));
    }
    const eventId = document.currentScript.getAttribute("data-event-id");
    const testing = document.currentScript.getAttribute("data-testing");
    const instrumentJS = getInstrumentJS(eventId, sendMessagesToLogger);
    let t0;
    if (testing === "true") {
        console.log("OpenWPM: Currently testing");
        t0 = performance.now();
        console.log("Begin loading JS instrumentation.");
    }
    instrumentJS(jsInstrumentationSettings);
    if (testing === "true") {
        const t1 = performance.now();
        console.log(`Call to instrumentJS took ${t1 - t0} milliseconds.`);
        window.instrumentJS = instrumentJS;
        console.log("OpenWPM: Content-side javascript instrumentation started with spec:", jsInstrumentationSettings, new Date().toISOString(), "(if spec is '<unavailable>' check web console.)");
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamF2YXNjcmlwdC1pbnN0cnVtZW50LXBhZ2Utc2NvcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29udGVudC9qYXZhc2NyaXB0LWluc3RydW1lbnQtcGFnZS1zY29wZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxRUFBcUU7QUFDckUseUVBQXlFO0FBQ3pFLDJDQUEyQztBQUUzQyxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsVUFBUyxlQUFlLEVBQUUseUJBQXlCO0lBQzNFLCtCQUErQjtJQUMvQixTQUFTLG9CQUFvQixDQUFDLE9BQU8sRUFBRSxRQUFRO1FBQzdDLFFBQVEsQ0FBQyxhQUFhLENBQ3BCLElBQUksV0FBVyxDQUFDLE9BQU8sRUFBRTtZQUN2QixNQUFNLEVBQUUsUUFBUTtTQUNqQixDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7SUFFRCxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUNyRSxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNwRSxNQUFNLFlBQVksR0FBRyxlQUFlLENBQUMsT0FBTyxFQUFFLG9CQUFvQixDQUFDLENBQUM7SUFDcEUsSUFBSSxFQUFVLENBQUM7SUFDZixJQUFJLE9BQU8sS0FBSyxNQUFNLEVBQUU7UUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1FBQzFDLEVBQUUsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0tBQ2xEO0lBQ0QsWUFBWSxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDeEMsSUFBSSxPQUFPLEtBQUssTUFBTSxFQUFFO1FBQ3RCLE1BQU0sRUFBRSxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2pFLE1BQWMsQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO1FBQzVDLE9BQU8sQ0FBQyxHQUFHLENBQ1QscUVBQXFFLEVBQ3JFLHlCQUF5QixFQUN6QixJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxFQUN4QixpREFBaUQsQ0FDbEQsQ0FBQztLQUNIO0FBQ0gsQ0FBQyxDQUFDIn0=

/***/ }),

/***/ "../webext-instrumentation/build/module/index.js":
/*!*******************************************************!*\
  !*** ../webext-instrumentation/build/module/index.js ***!
  \*******************************************************/
/*! exports provided: transformCookieObjectToMatchOpenWPMSchema, CookieInstrument, HttpInstrument, JavascriptInstrument, transformWebNavigationBaseEventDetailsToOpenWPMSchema, NavigationInstrument, injectJavascriptInstrumentPageScript, HttpPostParser, encode_utf8, escapeString, escapeUrl, Uint8ToBase64, boolToInt, dateTimeUnicodeFormatString */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _background_cookie_instrument__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./background/cookie-instrument */ "../webext-instrumentation/build/module/background/cookie-instrument.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "transformCookieObjectToMatchOpenWPMSchema", function() { return _background_cookie_instrument__WEBPACK_IMPORTED_MODULE_0__["transformCookieObjectToMatchOpenWPMSchema"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CookieInstrument", function() { return _background_cookie_instrument__WEBPACK_IMPORTED_MODULE_0__["CookieInstrument"]; });

/* harmony import */ var _background_http_instrument__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./background/http-instrument */ "../webext-instrumentation/build/module/background/http-instrument.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HttpInstrument", function() { return _background_http_instrument__WEBPACK_IMPORTED_MODULE_1__["HttpInstrument"]; });

/* harmony import */ var _background_javascript_instrument__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./background/javascript-instrument */ "../webext-instrumentation/build/module/background/javascript-instrument.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "JavascriptInstrument", function() { return _background_javascript_instrument__WEBPACK_IMPORTED_MODULE_2__["JavascriptInstrument"]; });

/* harmony import */ var _background_navigation_instrument__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./background/navigation-instrument */ "../webext-instrumentation/build/module/background/navigation-instrument.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "transformWebNavigationBaseEventDetailsToOpenWPMSchema", function() { return _background_navigation_instrument__WEBPACK_IMPORTED_MODULE_3__["transformWebNavigationBaseEventDetailsToOpenWPMSchema"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NavigationInstrument", function() { return _background_navigation_instrument__WEBPACK_IMPORTED_MODULE_3__["NavigationInstrument"]; });

/* harmony import */ var _content_javascript_instrument_content_scope__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./content/javascript-instrument-content-scope */ "../webext-instrumentation/build/module/content/javascript-instrument-content-scope.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "injectJavascriptInstrumentPageScript", function() { return _content_javascript_instrument_content_scope__WEBPACK_IMPORTED_MODULE_4__["injectJavascriptInstrumentPageScript"]; });

/* harmony import */ var _lib_http_post_parser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/http-post-parser */ "../webext-instrumentation/build/module/lib/http-post-parser.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HttpPostParser", function() { return _lib_http_post_parser__WEBPACK_IMPORTED_MODULE_5__["HttpPostParser"]; });

/* harmony import */ var _lib_string_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./lib/string-utils */ "../webext-instrumentation/build/module/lib/string-utils.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "encode_utf8", function() { return _lib_string_utils__WEBPACK_IMPORTED_MODULE_6__["encode_utf8"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "escapeString", function() { return _lib_string_utils__WEBPACK_IMPORTED_MODULE_6__["escapeString"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "escapeUrl", function() { return _lib_string_utils__WEBPACK_IMPORTED_MODULE_6__["escapeUrl"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Uint8ToBase64", function() { return _lib_string_utils__WEBPACK_IMPORTED_MODULE_6__["Uint8ToBase64"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "boolToInt", function() { return _lib_string_utils__WEBPACK_IMPORTED_MODULE_6__["boolToInt"]; });

/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./schema */ "../webext-instrumentation/build/module/schema.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "dateTimeUnicodeFormatString", function() { return _schema__WEBPACK_IMPORTED_MODULE_7__["dateTimeUnicodeFormatString"]; });









//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsY0FBYyxnQ0FBZ0MsQ0FBQztBQUMvQyxjQUFjLDhCQUE4QixDQUFDO0FBQzdDLGNBQWMsb0NBQW9DLENBQUM7QUFDbkQsY0FBYyxvQ0FBb0MsQ0FBQztBQUNuRCxjQUFjLCtDQUErQyxDQUFDO0FBQzlELGNBQWMsd0JBQXdCLENBQUM7QUFDdkMsY0FBYyxvQkFBb0IsQ0FBQztBQUNuQyxjQUFjLFVBQVUsQ0FBQyJ9

/***/ }),

/***/ "../webext-instrumentation/build/module/lib/extension-session-event-ordinal.js":
/*!*************************************************************************************!*\
  !*** ../webext-instrumentation/build/module/lib/extension-session-event-ordinal.js ***!
  \*************************************************************************************/
/*! exports provided: incrementedEventOrdinal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "incrementedEventOrdinal", function() { return incrementedEventOrdinal; });
/**
 * This enables us to keep information about the original order
 * in which events arrived to our event listeners.
 */
let eventOrdinal = 0;
const incrementedEventOrdinal = () => {
    return eventOrdinal++;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaW9uLXNlc3Npb24tZXZlbnQtb3JkaW5hbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZXh0ZW5zaW9uLXNlc3Npb24tZXZlbnQtb3JkaW5hbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFDSCxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFFckIsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQUcsR0FBRyxFQUFFO0lBQzFDLE9BQU8sWUFBWSxFQUFFLENBQUM7QUFDeEIsQ0FBQyxDQUFDIn0=

/***/ }),

/***/ "../webext-instrumentation/build/module/lib/extension-session-uuid.js":
/*!****************************************************************************!*\
  !*** ../webext-instrumentation/build/module/lib/extension-session-uuid.js ***!
  \****************************************************************************/
/*! exports provided: extensionSessionUuid */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extensionSessionUuid", function() { return extensionSessionUuid; });
/* harmony import */ var _uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./uuid */ "../webext-instrumentation/build/module/lib/uuid.js");

/**
 * This enables us to access a unique reference to this browser
 * session - regenerated any time the background process gets
 * restarted (which should only be on browser restarts)
 */
const extensionSessionUuid = Object(_uuid__WEBPACK_IMPORTED_MODULE_0__["makeUUID"])();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaW9uLXNlc3Npb24tdXVpZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZXh0ZW5zaW9uLXNlc3Npb24tdXVpZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBRWxDOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBRyxRQUFRLEVBQUUsQ0FBQyJ9

/***/ }),

/***/ "../webext-instrumentation/build/module/lib/http-post-parser.js":
/*!**********************************************************************!*\
  !*** ../webext-instrumentation/build/module/lib/http-post-parser.js ***!
  \**********************************************************************/
/*! exports provided: HttpPostParser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpPostParser", function() { return HttpPostParser; });
/* harmony import */ var _string_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./string-utils */ "../webext-instrumentation/build/module/lib/string-utils.js");
// Incorporates code from: https://github.com/redline13/selenium-jmeter/blob/6966d4b326cd78261e31e6e317076569051cac37/content/library/recorder/HttpPostParser.js
// import { escapeString, escapeUrl } from "./string-utils";

class HttpPostParser {
    /*
    private hasheaders: boolean;
    private seekablestream;
    private stream;
    private postBody;
    private postLines;
    private postHeaders;
    private body;
    */
    constructor(
    // onBeforeSendHeadersEventDetails: WebRequestOnBeforeSendHeadersEventDetails,
    onBeforeRequestEventDetails, dataReceiver) {
        // this.onBeforeSendHeadersEventDetails = onBeforeSendHeadersEventDetails;
        this.onBeforeRequestEventDetails = onBeforeRequestEventDetails;
        this.dataReceiver = dataReceiver;
        /*
        console.log(
          "HttpPostParser",
          // onBeforeSendHeadersEventDetails,
          onBeforeRequestEventDetails,
        );
        */
    }
    /**
     * @param encodingType from the HTTP Request headers
     */
    parsePostRequest( /*encodingType*/) {
        // const requestHeaders = this.onBeforeSendHeadersEventDetails.requestHeaders;
        const requestBody = this.onBeforeRequestEventDetails.requestBody;
        if (requestBody.error) {
            this.dataReceiver.logError("Exception: Upstream failed to parse POST: " + requestBody.error);
        }
        if (requestBody.formData) {
            return {
                // TODO: requestBody.formData should probably be transformed into another format
                post_body: Object(_string_utils__WEBPACK_IMPORTED_MODULE_0__["escapeString"])(JSON.stringify(requestBody.formData)),
            };
        }
        if (requestBody.raw) {
            return {
                post_body_raw: JSON.stringify(requestBody.raw.map(x => [
                    x.file,
                    Object(_string_utils__WEBPACK_IMPORTED_MODULE_0__["Uint8ToBase64"])(new Uint8Array(x.bytes)),
                ])),
            };
        }
        // Return empty response until we have all instrumentation converted
        return {};
        /*
        this.dataReceiver.logDebug(
          "Exception: Instrumentation to parse POST requests without formData is not yet restored",
        );
    
        // TODO: Refactor to corresponding webext logic or discard
        try {
          this.setupStream();
          this.parseStream();
        } catch (e) {
          this.dataReceiver.logError("Exception: Failed to parse POST: " + e);
          return {};
        }
    
        const postBody = this.postBody;
    
        if (!postBody) {
          // some scripts strangely sends empty post bodies (confirmed with the developer tools)
          return {};
        }
    
        let isMultiPart = false; // encType: multipart/form-data
        const postHeaders = this.postHeaders; // request headers from upload stream
        // See, http://stackoverflow.com/questions/16548517/what-is-request-headers-from-upload-stream
    
        // add encodingType from postHeaders if it's missing
        if (!encodingType && postHeaders && "Content-Type" in postHeaders) {
          encodingType = postHeaders["Content-Type"];
        }
    
        if (encodingType.indexOf("multipart/form-data") !== -1) {
          isMultiPart = true;
        }
    
        let jsonPostData = "";
        let escapedJsonPostData = "";
        if (isMultiPart) {
          jsonPostData = this.parseMultiPartData(postBody /*, encodingType* /);
          escapedJsonPostData = escapeString(jsonPostData);
        } else {
          jsonPostData = this.parseEncodedFormData(postBody, encodingType);
          escapedJsonPostData = escapeString(jsonPostData);
        }
        return { post_headers: postHeaders, post_body: escapedJsonPostData };
        */
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1wb3N0LXBhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaHR0cC1wb3N0LXBhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxnS0FBZ0s7QUFNaEssNERBQTREO0FBRTVELE9BQU8sRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFVN0QsTUFBTSxPQUFPLGNBQWM7SUFJekI7Ozs7Ozs7O01BUUU7SUFFRjtJQUNFLDhFQUE4RTtJQUM5RSwyQkFBa0UsRUFDbEUsWUFBWTtRQUVaLDBFQUEwRTtRQUMxRSxJQUFJLENBQUMsMkJBQTJCLEdBQUcsMkJBQTJCLENBQUM7UUFDL0QsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFDakM7Ozs7OztVQU1FO0lBQ0osQ0FBQztJQUVEOztPQUVHO0lBQ0ksZ0JBQWdCLEVBQUMsZ0JBQWdCO1FBQ3RDLDhFQUE4RTtRQUM5RSxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsV0FBVyxDQUFDO1FBQ2pFLElBQUksV0FBVyxDQUFDLEtBQUssRUFBRTtZQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FDeEIsNENBQTRDLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FDakUsQ0FBQztTQUNIO1FBQ0QsSUFBSSxXQUFXLENBQUMsUUFBUSxFQUFFO1lBQ3hCLE9BQU87Z0JBQ0wsZ0ZBQWdGO2dCQUNoRixTQUFTLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzlELENBQUM7U0FDSDtRQUNELElBQUksV0FBVyxDQUFDLEdBQUcsRUFBRTtZQUNuQixPQUFPO2dCQUNMLGFBQWEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUMzQixXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUN2QixDQUFDLENBQUMsSUFBSTtvQkFDTixhQUFhLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUN2QyxDQUFDLENBQ0g7YUFDRixDQUFDO1NBQ0g7UUFFRCxvRUFBb0U7UUFDcEUsT0FBTyxFQUFFLENBQUM7UUFDVjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7VUE0Q0U7SUFDSixDQUFDO0NBMlRGIn0=

/***/ }),

/***/ "../webext-instrumentation/build/module/lib/js-instruments.js":
/*!********************************************************************!*\
  !*** ../webext-instrumentation/build/module/lib/js-instruments.js ***!
  \********************************************************************/
/*! exports provided: getInstrumentJS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getInstrumentJS", function() { return getInstrumentJS; });
// Intrumentation injection code is based on privacybadgerfirefox
// https://github.com/EFForg/privacybadgerfirefox/blob/master/data/fingerprinting.js
function getInstrumentJS(eventId, sendMessagesToLogger) {
    /*
     * Instrumentation helpers
     * (Inlined in order for jsInstruments to be easily exportable as a string)
     */
    // Counter to cap # of calls logged for each script/api combination
    const maxLogCount = 500;
    // logCounter
    const logCounter = new Object();
    // Prevent logging of gets arising from logging
    let inLog = false;
    // To keep track of the original order of events
    let ordinal = 0;
    // Options for JSOperation
    const JSOperation = {
        call: "call",
        get: "get",
        get_failed: "get(failed)",
        get_function: "get(function)",
        set: "set",
        set_failed: "set(failed)",
        set_prevented: "set(prevented)",
    };
    // Rough implementations of Object.getPropertyDescriptor and Object.getPropertyNames
    // See http://wiki.ecmascript.org/doku.php?id=harmony:extended_object_api
    Object.getPropertyDescriptor = function (subject, name) {
        if (subject === undefined) {
            throw new Error("Can't get property descriptor for undefined");
        }
        let pd = Object.getOwnPropertyDescriptor(subject, name);
        let proto = Object.getPrototypeOf(subject);
        while (pd === undefined && proto !== null) {
            pd = Object.getOwnPropertyDescriptor(proto, name);
            proto = Object.getPrototypeOf(proto);
        }
        return pd;
    };
    Object.getPropertyNames = function (subject) {
        if (subject === undefined) {
            throw new Error("Can't get property names for undefined");
        }
        let props = Object.getOwnPropertyNames(subject);
        let proto = Object.getPrototypeOf(subject);
        while (proto !== null) {
            props = props.concat(Object.getOwnPropertyNames(proto));
            proto = Object.getPrototypeOf(proto);
        }
        // FIXME: remove duplicate property names from props
        return props;
    };
    // debounce - from Underscore v1.6.0
    function debounce(func, wait, immediate = false) {
        let timeout, args, context, timestamp, result;
        const later = function () {
            const last = Date.now() - timestamp;
            if (last < wait) {
                timeout = setTimeout(later, wait - last);
            }
            else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    context = args = null;
                }
            }
        };
        return function () {
            context = this;
            args = arguments;
            timestamp = Date.now();
            const callNow = immediate && !timeout;
            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }
            return result;
        };
    }
    // Recursively generates a path for an element
    function getPathToDomElement(element, visibilityAttr = false) {
        if (element === document.body) {
            return element.tagName;
        }
        if (element.parentNode === null) {
            return "NULL/" + element.tagName;
        }
        let siblingIndex = 1;
        const siblings = element.parentNode.childNodes;
        for (let i = 0; i < siblings.length; i++) {
            const sibling = siblings[i];
            if (sibling === element) {
                let path = getPathToDomElement(element.parentNode, visibilityAttr);
                path += "/" + element.tagName + "[" + siblingIndex;
                path += "," + element.id;
                path += "," + element.className;
                if (visibilityAttr) {
                    path += "," + element.hidden;
                    path += "," + element.style.display;
                    path += "," + element.style.visibility;
                }
                if (element.tagName === "A") {
                    path += "," + element.href;
                }
                path += "]";
                return path;
            }
            if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
                siblingIndex++;
            }
        }
    }
    // Helper for JSONifying objects
    function serializeObject(object, stringifyFunctions = false) {
        // Handle permissions errors
        try {
            if (object === null) {
                return "null";
            }
            if (typeof object === "function") {
                if (stringifyFunctions) {
                    return object.toString();
                }
                else {
                    return "FUNCTION";
                }
            }
            if (typeof object !== "object") {
                return object;
            }
            const seenObjects = [];
            return JSON.stringify(object, function (key, value) {
                if (value === null) {
                    return "null";
                }
                if (typeof value === "function") {
                    if (stringifyFunctions) {
                        return value.toString();
                    }
                    else {
                        return "FUNCTION";
                    }
                }
                if (typeof value === "object") {
                    // Remove wrapping on content objects
                    if ("wrappedJSObject" in value) {
                        value = value.wrappedJSObject;
                    }
                    // Serialize DOM elements
                    if (value instanceof HTMLElement) {
                        return getPathToDomElement(value);
                    }
                    // Prevent serialization cycles
                    if (key === "" || seenObjects.indexOf(value) < 0) {
                        seenObjects.push(value);
                        return value;
                    }
                    else {
                        return typeof value;
                    }
                }
                return value;
            });
        }
        catch (error) {
            console.log("OpenWPM: SERIALIZATION ERROR: " + error);
            return "SERIALIZATION ERROR: " + error;
        }
    }
    function updateCounterAndCheckIfOver(scriptUrl, symbol) {
        const key = scriptUrl + "|" + symbol;
        if (key in logCounter && logCounter[key] >= maxLogCount) {
            return true;
        }
        else if (!(key in logCounter)) {
            logCounter[key] = 1;
        }
        else {
            logCounter[key] += 1;
        }
        return false;
    }
    // For gets, sets, etc. on a single value
    function logValue(instrumentedVariableName, value, operation, // from JSOperation object please
    callContext, logSettings) {
        if (inLog) {
            return;
        }
        inLog = true;
        const overLimit = updateCounterAndCheckIfOver(callContext.scriptUrl, instrumentedVariableName);
        if (overLimit) {
            inLog = false;
            return;
        }
        const msg = {
            operation,
            symbol: instrumentedVariableName,
            value: serializeObject(value, logSettings.logFunctionsAsStrings),
            scriptUrl: callContext.scriptUrl,
            scriptLine: callContext.scriptLine,
            scriptCol: callContext.scriptCol,
            funcName: callContext.funcName,
            scriptLocEval: callContext.scriptLocEval,
            callStack: callContext.callStack,
            ordinal: ordinal++,
        };
        try {
            send("logValue", msg);
        }
        catch (error) {
            console.log("OpenWPM: Unsuccessful value log!");
            logErrorToConsole(error);
        }
        inLog = false;
    }
    // For functions
    function logCall(instrumentedFunctionName, args, callContext, logSettings) {
        if (inLog) {
            return;
        }
        inLog = true;
        const overLimit = updateCounterAndCheckIfOver(callContext.scriptUrl, instrumentedFunctionName);
        if (overLimit) {
            inLog = false;
            return;
        }
        try {
            // Convert special arguments array to a standard array for JSONifying
            const serialArgs = [];
            for (const arg of args) {
                serialArgs.push(serializeObject(arg, logSettings.logFunctionsAsStrings));
            }
            const msg = {
                operation: JSOperation.call,
                symbol: instrumentedFunctionName,
                args: serialArgs,
                value: "",
                scriptUrl: callContext.scriptUrl,
                scriptLine: callContext.scriptLine,
                scriptCol: callContext.scriptCol,
                funcName: callContext.funcName,
                scriptLocEval: callContext.scriptLocEval,
                callStack: callContext.callStack,
                ordinal: ordinal++,
            };
            send("logCall", msg);
        }
        catch (error) {
            console.log("OpenWPM: Unsuccessful call log: " + instrumentedFunctionName);
            logErrorToConsole(error);
        }
        inLog = false;
    }
    function logErrorToConsole(error, context = false) {
        console.error("OpenWPM: Error name: " + error.name);
        console.error("OpenWPM: Error message: " + error.message);
        console.error("OpenWPM: Error filename: " + error.fileName);
        console.error("OpenWPM: Error line number: " + error.lineNumber);
        console.error("OpenWPM: Error stack: " + error.stack);
        if (context) {
            console.error("OpenWPM: Error context: " + JSON.stringify(context));
        }
    }
    // Helper to get originating script urls
    function getStackTrace() {
        let stack;
        try {
            throw new Error();
        }
        catch (err) {
            stack = err.stack;
        }
        return stack;
    }
    // from http://stackoverflow.com/a/5202185
    const rsplit = function (source, sep, maxsplit) {
        const split = source.split(sep);
        return maxsplit
            ? [split.slice(0, -maxsplit).join(sep)].concat(split.slice(-maxsplit))
            : split;
    };
    function getOriginatingScriptContext(getCallStack = false) {
        const trace = getStackTrace()
            .trim()
            .split("\n");
        // return a context object even if there is an error
        const empty_context = {
            scriptUrl: "",
            scriptLine: "",
            scriptCol: "",
            funcName: "",
            scriptLocEval: "",
            callStack: "",
        };
        if (trace.length < 4) {
            return empty_context;
        }
        // 0, 1 and 2 are OpenWPM's own functions (e.g. getStackTrace), skip them.
        const callSite = trace[3];
        if (!callSite) {
            return empty_context;
        }
        /*
         * Stack frame format is simply: FUNC_NAME@FILENAME:LINE_NO:COLUMN_NO
         *
         * If eval or Function is involved we have an additional part after the FILENAME, e.g.:
         * FUNC_NAME@FILENAME line 123 > eval line 1 > eval:LINE_NO:COLUMN_NO
         * or FUNC_NAME@FILENAME line 234 > Function:LINE_NO:COLUMN_NO
         *
         * We store the part between the FILENAME and the LINE_NO in scriptLocEval
         */
        try {
            let scriptUrl = "";
            let scriptLocEval = ""; // for eval or Function calls
            const callSiteParts = callSite.split("@");
            const funcName = callSiteParts[0] || "";
            const items = rsplit(callSiteParts[1], ":", 2);
            const columnNo = items[items.length - 1];
            const lineNo = items[items.length - 2];
            const scriptFileName = items[items.length - 3] || "";
            const lineNoIdx = scriptFileName.indexOf(" line "); // line in the URL means eval or Function
            if (lineNoIdx === -1) {
                scriptUrl = scriptFileName; // TODO: sometimes we have filename only, e.g. XX.js
            }
            else {
                scriptUrl = scriptFileName.slice(0, lineNoIdx);
                scriptLocEval = scriptFileName.slice(lineNoIdx + 1, scriptFileName.length);
            }
            const callContext = {
                scriptUrl,
                scriptLine: lineNo,
                scriptCol: columnNo,
                funcName,
                scriptLocEval,
                callStack: getCallStack
                    ? trace
                        .slice(3)
                        .join("\n")
                        .trim()
                    : "",
            };
            return callContext;
        }
        catch (e) {
            console.log("OpenWPM: Error parsing the script context", e.toString(), callSite);
            return empty_context;
        }
    }
    function isObject(object, propertyName) {
        let property;
        try {
            property = object[propertyName];
        }
        catch (error) {
            return false;
        }
        if (property === null) {
            // null is type "object"
            return false;
        }
        return typeof property === "object";
    }
    // Log calls to a given function
    // This helper function returns a wrapper around `func` which logs calls
    // to `func`. `objectName` and `methodName` are used strictly to identify
    // which object method `func` is coming from in the logs
    function instrumentFunction(objectName, methodName, func, logSettings) {
        return function () {
            const callContext = getOriginatingScriptContext(logSettings.logCallStack);
            logCall(objectName + "." + methodName, arguments, callContext, logSettings);
            return func.apply(this, arguments);
        };
    }
    // Log properties of prototypes and objects
    function instrumentObjectProperty(object, objectName, propertyName, logSettings) {
        if (!object ||
            !objectName ||
            !propertyName ||
            propertyName === "undefined") {
            throw new Error(`Invalid request to instrumentObjectProperty.
        Object: ${object}
        objectName: ${objectName}
        propertyName: ${propertyName}
        `);
        }
        // Store original descriptor in closure
        const propDesc = Object.getPropertyDescriptor(object, propertyName);
        // Property descriptor must exist unless we are instrumenting a nonExisting property
        if (!propDesc &&
            !logSettings.nonExistingPropertiesToInstrument.includes(propertyName)) {
            console.error("Property descriptor not found for", objectName, propertyName, object);
            return;
        }
        // Property descriptor for undefined properties
        let undefinedPropValue;
        const undefinedPropDesc = {
            get: () => {
                return undefinedPropValue;
            },
            set: value => {
                undefinedPropValue = value;
            },
            enumerable: false,
        };
        // Instrument data or accessor property descriptors
        const originalGetter = propDesc ? propDesc.get : undefinedPropDesc.get;
        const originalSetter = propDesc ? propDesc.set : undefinedPropDesc.set;
        let originalValue = propDesc ? propDesc.value : undefinedPropValue;
        // We overwrite both data and accessor properties as an instrumented
        // accessor property
        Object.defineProperty(object, propertyName, {
            configurable: true,
            get: (function () {
                return function () {
                    let origProperty;
                    const callContext = getOriginatingScriptContext(logSettings.logCallStack);
                    const instrumentedVariableName = `${objectName}.${propertyName}`;
                    // get original value
                    if (!propDesc) {
                        // if undefined property
                        origProperty = undefinedPropValue;
                    }
                    else if (originalGetter) {
                        // if accessor property
                        origProperty = originalGetter.call(this);
                    }
                    else if ("value" in propDesc) {
                        // if data property
                        origProperty = originalValue;
                    }
                    else {
                        console.error(`Property descriptor for ${instrumentedVariableName} doesn't have getter or value?`);
                        logValue(instrumentedVariableName, "", JSOperation.get_failed, callContext, logSettings);
                        return;
                    }
                    // Log `gets` except those that have instrumented return values
                    // * All returned functions are instrumented with a wrapper
                    // * Returned objects may be instrumented if recursive
                    //   instrumentation is enabled and this isn't at the depth limit.
                    if (typeof origProperty === "function") {
                        if (logSettings.logFunctionGets) {
                            logValue(instrumentedVariableName, origProperty, JSOperation.get_function, callContext, logSettings);
                        }
                        const instrumentedFunctionWrapper = instrumentFunction(objectName, propertyName, origProperty, logSettings);
                        // Restore the original prototype and constructor so that instrumented classes remain intact
                        // TODO: This may have introduced prototype pollution as per https://github.com/mozilla/OpenWPM/issues/471
                        if (origProperty.prototype) {
                            instrumentedFunctionWrapper.prototype = origProperty.prototype;
                            if (origProperty.prototype.constructor) {
                                instrumentedFunctionWrapper.prototype.constructor =
                                    origProperty.prototype.constructor;
                            }
                        }
                        return instrumentedFunctionWrapper;
                    }
                    else if (typeof origProperty === "object" &&
                        logSettings.recursive &&
                        logSettings.depth > 0) {
                        return origProperty;
                    }
                    else {
                        logValue(instrumentedVariableName, origProperty, JSOperation.get, callContext, logSettings);
                        return origProperty;
                    }
                };
            })(),
            set: (function () {
                return function (value) {
                    const callContext = getOriginatingScriptContext(logSettings.logCallStack);
                    const instrumentedVariableName = `${objectName}.${propertyName}`;
                    let returnValue;
                    // Prevent sets for functions and objects if enabled
                    if (logSettings.preventSets &&
                        (typeof originalValue === "function" ||
                            typeof originalValue === "object")) {
                        logValue(instrumentedVariableName, value, JSOperation.set_prevented, callContext, logSettings);
                        return value;
                    }
                    // set new value to original setter/location
                    if (originalSetter) {
                        // if accessor property
                        returnValue = originalSetter.call(this, value);
                    }
                    else if ("value" in propDesc) {
                        inLog = true;
                        if (object.isPrototypeOf(this)) {
                            Object.defineProperty(this, propertyName, {
                                value,
                            });
                        }
                        else {
                            originalValue = value;
                        }
                        returnValue = value;
                        inLog = false;
                    }
                    else {
                        console.error(`Property descriptor for ${instrumentedVariableName} doesn't have setter or value?`);
                        logValue(instrumentedVariableName, value, JSOperation.set_failed, callContext, logSettings);
                        return value;
                    }
                    logValue(instrumentedVariableName, value, JSOperation.set, callContext, logSettings);
                    return returnValue;
                };
            })(),
        });
    }
    function instrumentObject(object, instrumentedName, logSettings) {
        // Set propertiesToInstrument to null to force no properties to be instrumented.
        // (this is used in testing for example)
        let propertiesToInstrument;
        if (logSettings.propertiesToInstrument === null) {
            propertiesToInstrument = [];
        }
        else if (logSettings.propertiesToInstrument.length === 0) {
            propertiesToInstrument = Object.getPropertyNames(object);
        }
        else {
            propertiesToInstrument = logSettings.propertiesToInstrument;
        }
        for (const propertyName of propertiesToInstrument) {
            if (logSettings.excludedProperties.includes(propertyName)) {
                continue;
            }
            // If `recursive` flag set we want to recursively instrument any
            // object properties that aren't the prototype object.
            if (logSettings.recursive &&
                logSettings.depth > 0 &&
                isObject(object, propertyName) &&
                propertyName !== "__proto__") {
                const newInstrumentedName = `${instrumentedName}.${propertyName}`;
                const newLogSettings = { ...logSettings };
                newLogSettings.depth = logSettings.depth - 1;
                newLogSettings.propertiesToInstrument = [];
                instrumentObject(object[propertyName], newInstrumentedName, newLogSettings);
            }
            try {
                instrumentObjectProperty(object, instrumentedName, propertyName, logSettings);
            }
            catch (error) {
                if (error instanceof TypeError &&
                    error.message.includes("can't redefine non-configurable property")) {
                    console.warn(`Cannot instrument non-configurable property: ${instrumentedName}:${propertyName}`);
                }
                else {
                    logErrorToConsole(error, { instrumentedName, propertyName });
                }
            }
        }
        for (const propertyName of logSettings.nonExistingPropertiesToInstrument) {
            if (logSettings.excludedProperties.includes(propertyName)) {
                continue;
            }
            try {
                instrumentObjectProperty(object, instrumentedName, propertyName, logSettings);
            }
            catch (error) {
                logErrorToConsole(error, { instrumentedName, propertyName });
            }
        }
    }
    const sendFactory = function (eventId, $sendMessagesToLogger) {
        let messages = [];
        // debounce sending queued messages
        const _send = debounce(function () {
            $sendMessagesToLogger(eventId, messages);
            // clear the queue
            messages = [];
        }, 100);
        return function (msgType, msg) {
            // queue the message
            messages.push({ type: msgType, content: msg });
            _send();
        };
    };
    const send = sendFactory(eventId, sendMessagesToLogger);
    function instrumentJS(JSInstrumentRequests) {
        // The JS Instrument Requests are setup and validated python side
        // including setting defaults for logSettings.
        // More details about how this function is invoked are in
        // content/javascript-instrument-content-scope.ts
        JSInstrumentRequests.forEach(function (item) {
            instrumentObject(item.object, item.instrumentedName, item.logSettings);
        });
    }
    // This whole function getInstrumentJS returns just the function `instrumentJS`.
    return instrumentJS;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMtaW5zdHJ1bWVudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2pzLWluc3RydW1lbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGlFQUFpRTtBQUNqRSxvRkFBb0Y7QUE4QnBGLE1BQU0sVUFBVSxlQUFlLENBQUMsT0FBZSxFQUFFLG9CQUFvQjtJQUNuRTs7O09BR0c7SUFFSCxtRUFBbUU7SUFDbkUsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDO0lBQ3hCLGFBQWE7SUFDYixNQUFNLFVBQVUsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO0lBQ2hDLCtDQUErQztJQUMvQyxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDbEIsZ0RBQWdEO0lBQ2hELElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztJQUVoQiwwQkFBMEI7SUFDMUIsTUFBTSxXQUFXLEdBQUc7UUFDbEIsSUFBSSxFQUFFLE1BQU07UUFDWixHQUFHLEVBQUUsS0FBSztRQUNWLFVBQVUsRUFBRSxhQUFhO1FBQ3pCLFlBQVksRUFBRSxlQUFlO1FBQzdCLEdBQUcsRUFBRSxLQUFLO1FBQ1YsVUFBVSxFQUFFLGFBQWE7UUFDekIsYUFBYSxFQUFFLGdCQUFnQjtLQUNoQyxDQUFDO0lBRUYsb0ZBQW9GO0lBQ3BGLHlFQUF5RTtJQUN6RSxNQUFNLENBQUMscUJBQXFCLEdBQUcsVUFBUyxPQUFPLEVBQUUsSUFBSTtRQUNuRCxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO1NBQ2hFO1FBQ0QsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLHdCQUF3QixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLE9BQU8sRUFBRSxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUss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

/***/ }),

/***/ "../webext-instrumentation/build/module/lib/pending-navigation.js":
/*!************************************************************************!*\
  !*** ../webext-instrumentation/build/module/lib/pending-navigation.js ***!
  \************************************************************************/
/*! exports provided: PendingNavigation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PendingNavigation", function() { return PendingNavigation; });
/**
 * Ties together the two separate navigation events that together holds information about both parent frame id and transition-related attributes
 */
class PendingNavigation {
    constructor() {
        this.onBeforeNavigateEventNavigation = new Promise(resolve => {
            this.resolveOnBeforeNavigateEventNavigation = resolve;
        });
        this.onCommittedEventNavigation = new Promise(resolve => {
            this.resolveOnCommittedEventNavigation = resolve;
        });
    }
    resolved() {
        return Promise.all([
            this.onBeforeNavigateEventNavigation,
            this.onCommittedEventNavigation,
        ]);
    }
    /**
     * Either returns or times out and returns undefined or
     * returns the results from resolved() above
     * @param ms
     */
    async resolvedWithinTimeout(ms) {
        const resolved = await Promise.race([
            this.resolved(),
            new Promise(resolve => setTimeout(resolve, ms)),
        ]);
        return resolved;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVuZGluZy1uYXZpZ2F0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9wZW5kaW5nLW5hdmlnYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7O0dBRUc7QUFDSCxNQUFNLE9BQU8saUJBQWlCO0lBSzVCO1FBQ0UsSUFBSSxDQUFDLCtCQUErQixHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzNELElBQUksQ0FBQyxzQ0FBc0MsR0FBRyxPQUFPLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsMEJBQTBCLEdBQUcsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDdEQsSUFBSSxDQUFDLGlDQUFpQyxHQUFHLE9BQU8sQ0FBQztRQUNuRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDTSxRQUFRO1FBQ2IsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDO1lBQ2pCLElBQUksQ0FBQywrQkFBK0I7WUFDcEMsSUFBSSxDQUFDLDBCQUEwQjtTQUNoQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFO1FBQ25DLE1BQU0sUUFBUSxHQUFHLE1BQU0sT0FBTyxDQUFDLElBQUksQ0FBQztZQUNsQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2YsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ2hELENBQUMsQ0FBQztRQUNILE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7Q0FDRiJ9

/***/ }),

/***/ "../webext-instrumentation/build/module/lib/pending-request.js":
/*!*********************************************************************!*\
  !*** ../webext-instrumentation/build/module/lib/pending-request.js ***!
  \*********************************************************************/
/*! exports provided: PendingRequest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PendingRequest", function() { return PendingRequest; });
/**
 * Ties together the two separate events that together holds information about both request headers and body
 */
class PendingRequest {
    constructor() {
        this.onBeforeRequestEventDetails = new Promise(resolve => {
            this.resolveOnBeforeRequestEventDetails = resolve;
        });
        this.onBeforeSendHeadersEventDetails = new Promise(resolve => {
            this.resolveOnBeforeSendHeadersEventDetails = resolve;
        });
    }
    resolved() {
        return Promise.all([
            this.onBeforeRequestEventDetails,
            this.onBeforeSendHeadersEventDetails,
        ]);
    }
    /**
     * Either returns or times out and returns undefined or
     * returns the results from resolved() above
     * @param ms
     */
    async resolvedWithinTimeout(ms) {
        const resolved = await Promise.race([
            this.resolved(),
            new Promise(resolve => setTimeout(resolve, ms)),
        ]);
        return resolved;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVuZGluZy1yZXF1ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9wZW5kaW5nLXJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBS0E7O0dBRUc7QUFDSCxNQUFNLE9BQU8sY0FBYztJQWF6QjtRQUNFLElBQUksQ0FBQywyQkFBMkIsR0FBRyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUN2RCxJQUFJLENBQUMsa0NBQWtDLEdBQUcsT0FBTyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLCtCQUErQixHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzNELElBQUksQ0FBQyxzQ0FBc0MsR0FBRyxPQUFPLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ00sUUFBUTtRQUNiLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQztZQUNqQixJQUFJLENBQUMsMkJBQTJCO1lBQ2hDLElBQUksQ0FBQywrQkFBK0I7U0FDckMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMscUJBQXFCLENBQUMsRUFBRTtRQUNuQyxNQUFNLFFBQVEsR0FBRyxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDbEMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNmLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztTQUNoRCxDQUFDLENBQUM7UUFDSCxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0NBQ0YifQ==

/***/ }),

/***/ "../webext-instrumentation/build/module/lib/pending-response.js":
/*!**********************************************************************!*\
  !*** ../webext-instrumentation/build/module/lib/pending-response.js ***!
  \**********************************************************************/
/*! exports provided: PendingResponse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PendingResponse", function() { return PendingResponse; });
/* harmony import */ var _response_body_listener__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./response-body-listener */ "../webext-instrumentation/build/module/lib/response-body-listener.js");

/**
 * Ties together the two separate events that together holds information about both response headers and body
 */
class PendingResponse {
    constructor() {
        this.onBeforeRequestEventDetails = new Promise(resolve => {
            this.resolveOnBeforeRequestEventDetails = resolve;
        });
        this.onCompletedEventDetails = new Promise(resolve => {
            this.resolveOnCompletedEventDetails = resolve;
        });
    }
    addResponseResponseBodyListener(details) {
        this.responseBodyListener = new _response_body_listener__WEBPACK_IMPORTED_MODULE_0__["ResponseBodyListener"](details);
    }
    resolved() {
        return Promise.all([
            this.onBeforeRequestEventDetails,
            this.onCompletedEventDetails,
        ]);
    }
    /**
     * Either returns or times out and returns undefined or
     * returns the results from resolved() above
     * @param ms
     */
    async resolvedWithinTimeout(ms) {
        const resolved = await Promise.race([
            this.resolved(),
            new Promise(resolve => setTimeout(resolve, ms)),
        ]);
        return resolved;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVuZGluZy1yZXNwb25zZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvcGVuZGluZy1yZXNwb25zZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUVoRTs7R0FFRztBQUNILE1BQU0sT0FBTyxlQUFlO0lBYzFCO1FBQ0UsSUFBSSxDQUFDLDJCQUEyQixHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3ZELElBQUksQ0FBQyxrQ0FBa0MsR0FBRyxPQUFPLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDbkQsSUFBSSxDQUFDLDhCQUE4QixHQUFHLE9BQU8sQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDTSwrQkFBK0IsQ0FDcEMsT0FBOEM7UUFFOUMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUNNLFFBQVE7UUFDYixPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDakIsSUFBSSxDQUFDLDJCQUEyQjtZQUNoQyxJQUFJLENBQUMsdUJBQXVCO1NBQzdCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLHFCQUFxQixDQUFDLEVBQUU7UUFDbkMsTUFBTSxRQUFRLEdBQUcsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDaEQsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztDQUNGIn0=

/***/ }),

/***/ "../webext-instrumentation/build/module/lib/response-body-listener.js":
/*!****************************************************************************!*\
  !*** ../webext-instrumentation/build/module/lib/response-body-listener.js ***!
  \****************************************************************************/
/*! exports provided: ResponseBodyListener */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ResponseBodyListener", function() { return ResponseBodyListener; });
/* harmony import */ var _sha256__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sha256 */ "../webext-instrumentation/build/module/lib/sha256.js");

class ResponseBodyListener {
    constructor(details) {
        this.responseBody = new Promise(resolve => {
            this.resolveResponseBody = resolve;
        });
        this.contentHash = new Promise(resolve => {
            this.resolveContentHash = resolve;
        });
        // Used to parse Response stream
        const filter = browser.webRequest.filterResponseData(details.requestId);
        let responseBody = new Uint8Array();
        filter.ondata = event => {
            Object(_sha256__WEBPACK_IMPORTED_MODULE_0__["digestMessage"])(event.data).then(digest => {
                this.resolveContentHash(digest);
            });
            const incoming = new Uint8Array(event.data);
            const tmp = new Uint8Array(responseBody.length + incoming.length);
            tmp.set(responseBody);
            tmp.set(incoming, responseBody.length);
            responseBody = tmp;
            filter.write(event.data);
        };
        filter.onstop = _event => {
            this.resolveResponseBody(responseBody);
            filter.disconnect();
        };
    }
    async getResponseBody() {
        return this.responseBody;
    }
    async getContentHash() {
        return this.contentHash;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzcG9uc2UtYm9keS1saXN0ZW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvcmVzcG9uc2UtYm9keS1saXN0ZW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRXpDLE1BQU0sT0FBTyxvQkFBb0I7SUFNL0IsWUFBWSxPQUE4QztRQUN4RCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3hDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxPQUFPLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxPQUFPLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxnQ0FBZ0M7UUFDaEMsTUFBTSxNQUFNLEdBQVEsT0FBTyxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FDdkQsT0FBTyxDQUFDLFNBQVMsQ0FDWCxDQUFDO1FBRVQsSUFBSSxZQUFZLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUNwQyxNQUFNLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxFQUFFO1lBQ3RCLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN0QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7WUFDSCxNQUFNLFFBQVEsR0FBRyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbEUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN0QixHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkMsWUFBWSxHQUFHLEdBQUcsQ0FBQztZQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUM7UUFFRixNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN2QyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDdEIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVNLEtBQUssQ0FBQyxlQUFlO1FBQzFCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUMzQixDQUFDO0lBRU0sS0FBSyxDQUFDLGNBQWM7UUFDekIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7Q0FDRiJ9

/***/ }),

/***/ "../webext-instrumentation/build/module/lib/sha256.js":
/*!************************************************************!*\
  !*** ../webext-instrumentation/build/module/lib/sha256.js ***!
  \************************************************************/
/*! exports provided: digestMessage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "digestMessage", function() { return digestMessage; });
/**
 * Code from the example at
 * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
 */
async function digestMessage(msgUint8) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
    return hashHex;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhMjU2LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9zaGEyNTYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsTUFBTSxDQUFDLEtBQUssVUFBVSxhQUFhLENBQUMsUUFBb0I7SUFDdEQsTUFBTSxVQUFVLEdBQUcsTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7SUFDdkYsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsK0JBQStCO0lBQ3pGLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyw4QkFBOEI7SUFDNUcsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQyJ9

/***/ }),

/***/ "../webext-instrumentation/build/module/lib/string-utils.js":
/*!******************************************************************!*\
  !*** ../webext-instrumentation/build/module/lib/string-utils.js ***!
  \******************************************************************/
/*! exports provided: encode_utf8, escapeString, escapeUrl, Uint8ToBase64, boolToInt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encode_utf8", function() { return encode_utf8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "escapeString", function() { return escapeString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "escapeUrl", function() { return escapeUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Uint8ToBase64", function() { return Uint8ToBase64; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "boolToInt", function() { return boolToInt; });
function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
}
const escapeString = function (str) {
    // Convert to string if necessary
    if (typeof str != "string") {
        str = String(str);
    }
    return encode_utf8(str);
};
const escapeUrl = function (url, stripDataUrlData = true) {
    url = escapeString(url);
    // data:[<mediatype>][;base64],<data>
    if (url.substr(0, 5) === "data:" &&
        stripDataUrlData &&
        url.indexOf(",") > -1) {
        url = url.substr(0, url.indexOf(",") + 1) + "<data-stripped>";
    }
    return url;
};
// Base64 encoding, found on:
// https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/25644409#25644409
const Uint8ToBase64 = function (u8Arr) {
    const CHUNK_SIZE = 0x8000; // arbitrary number
    let index = 0;
    const length = u8Arr.length;
    let result = "";
    let slice;
    while (index < length) {
        slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
        result += String.fromCharCode.apply(null, slice);
        index += CHUNK_SIZE;
    }
    return btoa(result);
};
const boolToInt = function (bool) {
    return bool ? 1 : 0;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nLXV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9zdHJpbmctdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxVQUFVLFdBQVcsQ0FBQyxDQUFDO0lBQzNCLE9BQU8sUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekMsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxVQUFTLEdBQVE7SUFDM0MsaUNBQWlDO0lBQ2pDLElBQUksT0FBTyxHQUFHLElBQUksUUFBUSxFQUFFO1FBQzFCLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDbkI7SUFFRCxPQUFPLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMxQixDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxTQUFTLEdBQUcsVUFDdkIsR0FBVyxFQUNYLG1CQUE0QixJQUFJO0lBRWhDLEdBQUcsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDeEIscUNBQXFDO0lBQ3JDLElBQ0UsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssT0FBTztRQUM1QixnQkFBZ0I7UUFDaEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFDckI7UUFDQSxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxpQkFBaUIsQ0FBQztLQUMvRDtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyxDQUFDO0FBRUYsNkJBQTZCO0FBQzdCLHFIQUFxSDtBQUNySCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsVUFBUyxLQUFpQjtJQUNyRCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsQ0FBQyxtQkFBbUI7SUFDOUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUM1QixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDaEIsSUFBSSxLQUFpQixDQUFDO0lBQ3RCLE9BQU8sS0FBSyxHQUFHLE1BQU0sRUFBRTtRQUNyQixLQUFLLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDcEUsTUFBTSxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNqRCxLQUFLLElBQUksVUFBVSxDQUFDO0tBQ3JCO0lBQ0QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEIsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFHLFVBQVMsSUFBYTtJQUM3QyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsQ0FBQyxDQUFDIn0=

/***/ }),

/***/ "../webext-instrumentation/build/module/lib/uuid.js":
/*!**********************************************************!*\
  !*** ../webext-instrumentation/build/module/lib/uuid.js ***!
  \**********************************************************/
/*! exports provided: makeUUID */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeUUID", function() { return makeUUID; });
/* tslint:disable:no-bitwise */
// from https://gist.github.com/jed/982883#gistcomment-2403369
const hex = [];
for (let i = 0; i < 256; i++) {
    hex[i] = (i < 16 ? "0" : "") + i.toString(16);
}
const makeUUID = () => {
    const r = crypto.getRandomValues(new Uint8Array(16));
    r[6] = (r[6] & 0x0f) | 0x40;
    r[8] = (r[8] & 0x3f) | 0x80;
    return (hex[r[0]] +
        hex[r[1]] +
        hex[r[2]] +
        hex[r[3]] +
        "-" +
        hex[r[4]] +
        hex[r[5]] +
        "-" +
        hex[r[6]] +
        hex[r[7]] +
        "-" +
        hex[r[8]] +
        hex[r[9]] +
        "-" +
        hex[r[10]] +
        hex[r[11]] +
        hex[r[12]] +
        hex[r[13]] +
        hex[r[14]] +
        hex[r[15]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXVpZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdXVpZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7QUFFL0IsOERBQThEO0FBQzlELE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUVmLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDNUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0NBQy9DO0FBRUQsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFHLEdBQUcsRUFBRTtJQUMzQixNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFckQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztJQUM1QixDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBRTVCLE9BQU8sQ0FDTCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNULEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1QsR0FBRztRQUNILEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1QsR0FBRztRQUNILEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1QsR0FBRztRQUNILEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1QsR0FBRztRQUNILEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDVixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ1YsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNWLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDVixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ1YsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUNYLENBQUM7QUFDSixDQUFDLENBQUMifQ==

/***/ }),

/***/ "../webext-instrumentation/build/module/schema.js":
/*!********************************************************!*\
  !*** ../webext-instrumentation/build/module/schema.js ***!
  \********************************************************/
/*! exports provided: dateTimeUnicodeFormatString */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dateTimeUnicodeFormatString", function() { return dateTimeUnicodeFormatString; });
// https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
const dateTimeUnicodeFormatString = "yyyy-MM-dd'T'HH:mm:ss.SSSXX";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSwrRUFBK0U7QUFDL0UsTUFBTSxDQUFDLE1BQU0sMkJBQTJCLEdBQUcsNkJBQTZCLENBQUMifQ==

/***/ }),

/***/ "./content.js/index.js":
/*!*****************************!*\
  !*** ./content.js/index.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var openwpm_webext_instrumentation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! openwpm-webext-instrumentation */ "../webext-instrumentation/build/module/index.js");


Object(openwpm_webext_instrumentation__WEBPACK_IMPORTED_MODULE_0__["injectJavascriptInstrumentPageScript"])(window.openWpmContentScriptConfig || {});
delete window.openWpmContentScriptConfig;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4uL3dlYmV4dC1pbnN0cnVtZW50YXRpb24vYnVpbGQvbW9kdWxlL2JhY2tncm91bmQvY29va2llLWluc3RydW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4uL3dlYmV4dC1pbnN0cnVtZW50YXRpb24vYnVpbGQvbW9kdWxlL2JhY2tncm91bmQvaHR0cC1pbnN0cnVtZW50LmpzIiwid2VicGFjazovLy8uLi93ZWJleHQtaW5zdHJ1bWVudGF0aW9uL2J1aWxkL21vZHVsZS9iYWNrZ3JvdW5kL2phdmFzY3JpcHQtaW5zdHJ1bWVudC5qcyIsIndlYnBhY2s6Ly8vLi4vd2ViZXh0LWluc3RydW1lbnRhdGlvbi9idWlsZC9tb2R1bGUvYmFja2dyb3VuZC9uYXZpZ2F0aW9uLWluc3RydW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4uL3dlYmV4dC1pbnN0cnVtZW50YXRpb24vYnVpbGQvbW9kdWxlL2NvbnRlbnQvamF2YXNjcmlwdC1pbnN0cnVtZW50LWNvbnRlbnQtc2NvcGUuanMiLCJ3ZWJwYWNrOi8vLy4uL3dlYmV4dC1pbnN0cnVtZW50YXRpb24vYnVpbGQvbW9kdWxlL2NvbnRlbnQvamF2YXNjcmlwdC1pbnN0cnVtZW50LXBhZ2Utc2NvcGUuanMiLCJ3ZWJwYWNrOi8vLy4uL3dlYmV4dC1pbnN0cnVtZW50YXRpb24vYnVpbGQvbW9kdWxlL2luZGV4LmpzIiwid2VicGFjazovLy8uLi93ZWJleHQtaW5zdHJ1bWVudGF0aW9uL2J1aWxkL21vZHVsZS9saWIvZXh0ZW5zaW9uLXNlc3Npb24tZXZlbnQtb3JkaW5hbC5qcyIsIndlYnBhY2s6Ly8vLi4vd2ViZXh0LWluc3RydW1lbnRhdGlvbi9idWlsZC9tb2R1bGUvbGliL2V4dGVuc2lvbi1zZXNzaW9uLXV1aWQuanMiLCJ3ZWJwYWNrOi8vLy4uL3dlYmV4dC1pbnN0cnVtZW50YXRpb24vYnVpbGQvbW9kdWxlL2xpYi9odHRwLXBvc3QtcGFyc2VyLmpzIiwid2VicGFjazovLy8uLi93ZWJleHQtaW5zdHJ1bWVudGF0aW9uL2J1aWxkL21vZHVsZS9saWIvanMtaW5zdHJ1bWVudHMuanMiLCJ3ZWJwYWNrOi8vLy4uL3dlYmV4dC1pbnN0cnVtZW50YXRpb24vYnVpbGQvbW9kdWxlL2xpYi9wZW5kaW5nLW5hdmlnYXRpb24uanMiLCJ3ZWJwYWNrOi8vLy4uL3dlYmV4dC1pbnN0cnVtZW50YXRpb24vYnVpbGQvbW9kdWxlL2xpYi9wZW5kaW5nLXJlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vLy4uL3dlYmV4dC1pbnN0cnVtZW50YXRpb24vYnVpbGQvbW9kdWxlL2xpYi9wZW5kaW5nLXJlc3BvbnNlLmpzIiwid2VicGFjazovLy8uLi93ZWJleHQtaW5zdHJ1bWVudGF0aW9uL2J1aWxkL21vZHVsZS9saWIvcmVzcG9uc2UtYm9keS1saXN0ZW5lci5qcyIsIndlYnBhY2s6Ly8vLi4vd2ViZXh0LWluc3RydW1lbnRhdGlvbi9idWlsZC9tb2R1bGUvbGliL3NoYTI1Ni5qcyIsIndlYnBhY2s6Ly8vLi4vd2ViZXh0LWluc3RydW1lbnRhdGlvbi9idWlsZC9tb2R1bGUvbGliL3N0cmluZy11dGlscy5qcyIsIndlYnBhY2s6Ly8vLi4vd2ViZXh0LWluc3RydW1lbnRhdGlvbi9idWlsZC9tb2R1bGUvbGliL3V1aWQuanMiLCJ3ZWJwYWNrOi8vLy4uL3dlYmV4dC1pbnN0cnVtZW50YXRpb24vYnVpbGQvbW9kdWxlL3NjaGVtYS5qcyIsIndlYnBhY2s6Ly8vLi9jb250ZW50LmpzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHFCQUFxQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9jb250ZW50LmpzL2luZGV4LmpzXCIpO1xuIiwiaW1wb3J0IHsgaW5jcmVtZW50ZWRFdmVudE9yZGluYWwgfSBmcm9tIFwiLi4vbGliL2V4dGVuc2lvbi1zZXNzaW9uLWV2ZW50LW9yZGluYWxcIjtcbmltcG9ydCB7IGV4dGVuc2lvblNlc3Npb25VdWlkIH0gZnJvbSBcIi4uL2xpYi9leHRlbnNpb24tc2Vzc2lvbi11dWlkXCI7XG5pbXBvcnQgeyBib29sVG9JbnQsIGVzY2FwZVN0cmluZyB9IGZyb20gXCIuLi9saWIvc3RyaW5nLXV0aWxzXCI7XG5leHBvcnQgY29uc3QgdHJhbnNmb3JtQ29va2llT2JqZWN0VG9NYXRjaE9wZW5XUE1TY2hlbWEgPSAoY29va2llKSA9PiB7XG4gICAgY29uc3QgamF2YXNjcmlwdENvb2tpZSA9IHt9O1xuICAgIC8vIEV4cGlyeSB0aW1lIChpbiBzZWNvbmRzKVxuICAgIC8vIE1heSByZXR1cm4gfk1heChpbnQ2NCkuIEkgYmVsaWV2ZSB0aGlzIGlzIGEgc2Vzc2lvblxuICAgIC8vIGNvb2tpZSB3aGljaCBkb2Vzbid0IGV4cGlyZS4gU2Vzc2lvbnMgY29va2llcyB3aXRoXG4gICAgLy8gbm9uLW1heCBleHBpcnkgdGltZSBleHBpcmUgYWZ0ZXIgc2Vzc2lvbiBvciBhdCBleHBpcnkuXG4gICAgY29uc3QgZXhwaXJ5VGltZSA9IGNvb2tpZS5leHBpcmF0aW9uRGF0ZTsgLy8gcmV0dXJucyBzZWNvbmRzXG4gICAgbGV0IGV4cGlyeVRpbWVTdHJpbmc7XG4gICAgY29uc3QgbWF4SW50NjQgPSA5MjIzMzcyMDM2ODU0Nzc2MDAwO1xuICAgIGlmICghY29va2llLmV4cGlyYXRpb25EYXRlIHx8IGV4cGlyeVRpbWUgPT09IG1heEludDY0KSB7XG4gICAgICAgIGV4cGlyeVRpbWVTdHJpbmcgPSBcIjk5OTktMTItMzFUMjE6NTk6NTkuMDAwWlwiO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc3QgZXhwaXJ5VGltZURhdGUgPSBuZXcgRGF0ZShleHBpcnlUaW1lICogMTAwMCk7IC8vIHJlcXVpcmVzIG1pbGxpc2Vjb25kc1xuICAgICAgICBleHBpcnlUaW1lU3RyaW5nID0gZXhwaXJ5VGltZURhdGUudG9JU09TdHJpbmcoKTtcbiAgICB9XG4gICAgamF2YXNjcmlwdENvb2tpZS5leHBpcnkgPSBleHBpcnlUaW1lU3RyaW5nO1xuICAgIGphdmFzY3JpcHRDb29raWUuaXNfaHR0cF9vbmx5ID0gYm9vbFRvSW50KGNvb2tpZS5odHRwT25seSk7XG4gICAgamF2YXNjcmlwdENvb2tpZS5pc19ob3N0X29ubHkgPSBib29sVG9JbnQoY29va2llLmhvc3RPbmx5KTtcbiAgICBqYXZhc2NyaXB0Q29va2llLmlzX3Nlc3Npb24gPSBib29sVG9JbnQoY29va2llLnNlc3Npb24pO1xuICAgIGphdmFzY3JpcHRDb29raWUuaG9zdCA9IGVzY2FwZVN0cmluZyhjb29raWUuZG9tYWluKTtcbiAgICBqYXZhc2NyaXB0Q29va2llLmlzX3NlY3VyZSA9IGJvb2xUb0ludChjb29raWUuc2VjdXJlKTtcbiAgICBqYXZhc2NyaXB0Q29va2llLm5hbWUgPSBlc2NhcGVTdHJpbmcoY29va2llLm5hbWUpO1xuICAgIGphdmFzY3JpcHRDb29raWUucGF0aCA9IGVzY2FwZVN0cmluZyhjb29raWUucGF0aCk7XG4gICAgamF2YXNjcmlwdENvb2tpZS52YWx1ZSA9IGVzY2FwZVN0cmluZyhjb29raWUudmFsdWUpO1xuICAgIGphdmFzY3JpcHRDb29raWUuc2FtZV9zaXRlID0gZXNjYXBlU3RyaW5nKGNvb2tpZS5zYW1lU2l0ZSk7XG4gICAgamF2YXNjcmlwdENvb2tpZS5maXJzdF9wYXJ0eV9kb21haW4gPSBlc2NhcGVTdHJpbmcoY29va2llLmZpcnN0UGFydHlEb21haW4pO1xuICAgIGphdmFzY3JpcHRDb29raWUuc3RvcmVfaWQgPSBlc2NhcGVTdHJpbmcoY29va2llLnN0b3JlSWQpO1xuICAgIGphdmFzY3JpcHRDb29raWUudGltZV9zdGFtcCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICByZXR1cm4gamF2YXNjcmlwdENvb2tpZTtcbn07XG5leHBvcnQgY2xhc3MgQ29va2llSW5zdHJ1bWVudCB7XG4gICAgY29uc3RydWN0b3IoZGF0YVJlY2VpdmVyKSB7XG4gICAgICAgIHRoaXMuZGF0YVJlY2VpdmVyID0gZGF0YVJlY2VpdmVyO1xuICAgIH1cbiAgICBydW4oY3Jhd2xJRCkge1xuICAgICAgICAvLyBJbnN0cnVtZW50IGNvb2tpZSBjaGFuZ2VzXG4gICAgICAgIHRoaXMub25DaGFuZ2VkTGlzdGVuZXIgPSBhc3luYyAoY2hhbmdlSW5mbykgPT4ge1xuICAgICAgICAgICAgY29uc3QgZXZlbnRUeXBlID0gY2hhbmdlSW5mby5yZW1vdmVkID8gXCJkZWxldGVkXCIgOiBcImFkZGVkLW9yLWNoYW5nZWRcIjtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICAgICAgICByZWNvcmRfdHlwZTogZXZlbnRUeXBlLFxuICAgICAgICAgICAgICAgIGNoYW5nZV9jYXVzZTogY2hhbmdlSW5mby5jYXVzZSxcbiAgICAgICAgICAgICAgICBicm93c2VyX2lkOiBjcmF3bElELFxuICAgICAgICAgICAgICAgIGV4dGVuc2lvbl9zZXNzaW9uX3V1aWQ6IGV4dGVuc2lvblNlc3Npb25VdWlkLFxuICAgICAgICAgICAgICAgIGV2ZW50X29yZGluYWw6IGluY3JlbWVudGVkRXZlbnRPcmRpbmFsKCksXG4gICAgICAgICAgICAgICAgLi4udHJhbnNmb3JtQ29va2llT2JqZWN0VG9NYXRjaE9wZW5XUE1TY2hlbWEoY2hhbmdlSW5mby5jb29raWUpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuZGF0YVJlY2VpdmVyLnNhdmVSZWNvcmQoXCJqYXZhc2NyaXB0X2Nvb2tpZXNcIiwgdXBkYXRlKTtcbiAgICAgICAgfTtcbiAgICAgICAgYnJvd3Nlci5jb29raWVzLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcih0aGlzLm9uQ2hhbmdlZExpc3RlbmVyKTtcbiAgICB9XG4gICAgYXN5bmMgc2F2ZUFsbENvb2tpZXMoY3Jhd2xJRCkge1xuICAgICAgICBjb25zdCBhbGxDb29raWVzID0gYXdhaXQgYnJvd3Nlci5jb29raWVzLmdldEFsbCh7fSk7XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKGFsbENvb2tpZXMubWFwKChjb29raWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICAgICAgICByZWNvcmRfdHlwZTogXCJtYW51YWwtZXhwb3J0XCIsXG4gICAgICAgICAgICAgICAgYnJvd3Nlcl9pZDogY3Jhd2xJRCxcbiAgICAgICAgICAgICAgICBleHRlbnNpb25fc2Vzc2lvbl91dWlkOiBleHRlbnNpb25TZXNzaW9uVXVpZCxcbiAgICAgICAgICAgICAgICAuLi50cmFuc2Zvcm1Db29raWVPYmplY3RUb01hdGNoT3BlbldQTVNjaGVtYShjb29raWUpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGFSZWNlaXZlci5zYXZlUmVjb3JkKFwiamF2YXNjcmlwdF9jb29raWVzXCIsIHVwZGF0ZSk7XG4gICAgICAgIH0pKTtcbiAgICB9XG4gICAgY2xlYW51cCgpIHtcbiAgICAgICAgaWYgKHRoaXMub25DaGFuZ2VkTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGJyb3dzZXIuY29va2llcy5vbkNoYW5nZWQucmVtb3ZlTGlzdGVuZXIodGhpcy5vbkNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lZMjl2YTJsbExXbHVjM1J5ZFcxbGJuUXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdUxpOHVMaTh1TGk5emNtTXZZbUZqYTJkeWIzVnVaQzlqYjI5cmFXVXRhVzV6ZEhKMWJXVnVkQzUwY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeFBRVUZQTEVWQlFVVXNkVUpCUVhWQ0xFVkJRVVVzVFVGQlRTeDNRMEZCZDBNc1EwRkJRenRCUVVOcVJpeFBRVUZQTEVWQlFVVXNiMEpCUVc5Q0xFVkJRVVVzVFVGQlRTd3JRa0ZCSzBJc1EwRkJRenRCUVVOeVJTeFBRVUZQTEVWQlFVVXNVMEZCVXl4RlFVRkZMRmxCUVZrc1JVRkJSU3hOUVVGTkxIRkNRVUZ4UWl4RFFVRkRPMEZCU3psRUxFMUJRVTBzUTBGQlF5eE5RVUZOTEhsRFFVRjVReXhIUVVGSExFTkJRVU1zVFVGQll5eEZRVUZGTEVWQlFVVTdTVUZETVVVc1RVRkJUU3huUWtGQlowSXNSMEZCUnl4RlFVRnpRaXhEUVVGRE8wbEJSV2hFTERKQ1FVRXlRanRKUVVNelFpeHpSRUZCYzBRN1NVRkRkRVFzY1VSQlFYRkVPMGxCUTNKRUxIbEVRVUY1UkR0SlFVTjZSQ3hOUVVGTkxGVkJRVlVzUjBGQlJ5eE5RVUZOTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNc2EwSkJRV3RDTzBsQlF6VkVMRWxCUVVrc1owSkJRV2RDTEVOQlFVTTdTVUZEY2tJc1RVRkJUU3hSUVVGUkxFZEJRVWNzYlVKQlFXMUNMRU5CUVVNN1NVRkRja01zU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4alFVRmpMRWxCUVVrc1ZVRkJWU3hMUVVGTExGRkJRVkVzUlVGQlJUdFJRVU55UkN4blFrRkJaMElzUjBGQlJ5d3dRa0ZCTUVJc1EwRkJRenRMUVVNdlF6dFRRVUZOTzFGQlEwd3NUVUZCVFN4alFVRmpMRWRCUVVjc1NVRkJTU3hKUVVGSkxFTkJRVU1zVlVGQlZTeEhRVUZITEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc2QwSkJRWGRDTzFGQlF6VkZMR2RDUVVGblFpeEhRVUZITEdOQlFXTXNRMEZCUXl4WFFVRlhMRVZCUVVVc1EwRkJRenRMUVVOcVJEdEpRVU5FTEdkQ1FVRm5RaXhEUVVGRExFMUJRVTBzUjBGQlJ5eG5Ra0ZCWjBJc1EwRkJRenRKUVVNelF5eG5Ra0ZCWjBJc1EwRkJReXhaUVVGWkxFZEJRVWNzVTBGQlV5eERRVUZETEUxQlFVMHNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRKUVVNelJDeG5Ra0ZCWjBJc1EwRkJReXhaUVVGWkxFZEJRVWNzVTBGQlV5eERRVUZETEUxQlFVMHNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRKUVVNelJDeG5Ra0ZCWjBJc1EwRkJReXhWUVVGVkxFZEJRVWNzVTBGQlV5eERRVUZETEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRKUVVWNFJDeG5Ra0ZCWjBJc1EwRkJReXhKUVVGSkxFZEJRVWNzV1VGQldTeERRVUZETEUxQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenRKUVVOd1JDeG5Ra0ZCWjBJc1EwRkJReXhUUVVGVExFZEJRVWNzVTBGQlV5eERRVUZETEUxQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenRKUVVOMFJDeG5Ra0ZCWjBJc1EwRkJReXhKUVVGSkxFZEJRVWNzV1VGQldTeERRVUZETEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRKUVVOc1JDeG5Ra0ZCWjBJc1EwRkJReXhKUVVGSkxFZEJRVWNzV1VGQldTeERRVUZETEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRKUVVOc1JDeG5Ra0ZCWjBJc1EwRkJReXhMUVVGTExFZEJRVWNzV1VGQldTeERRVUZETEUxQlFVMHNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRKUVVOd1JDeG5Ra0ZCWjBJc1EwRkJReXhUUVVGVExFZEJRVWNzV1VGQldTeERRVUZETEUxQlFVMHNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRKUVVNelJDeG5Ra0ZCWjBJc1EwRkJReXhyUWtGQmEwSXNSMEZCUnl4WlFVRlpMRU5CUVVNc1RVRkJUU3hEUVVGRExHZENRVUZuUWl4RFFVRkRMRU5CUVVNN1NVRkROVVVzWjBKQlFXZENMRU5CUVVNc1VVRkJVU3hIUVVGSExGbEJRVmtzUTBGQlF5eE5RVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1NVRkZla1FzWjBKQlFXZENMRU5CUVVNc1ZVRkJWU3hIUVVGSExFbEJRVWtzU1VGQlNTeEZRVUZGTEVOQlFVTXNWMEZCVnl4RlFVRkZMRU5CUVVNN1NVRkZka1FzVDBGQlR5eG5Ra0ZCWjBJc1EwRkJRenRCUVVNeFFpeERRVUZETEVOQlFVTTdRVUZGUml4TlFVRk5MRTlCUVU4c1owSkJRV2RDTzBsQlNUTkNMRmxCUVZrc1dVRkJXVHRSUVVOMFFpeEpRVUZKTEVOQlFVTXNXVUZCV1N4SFFVRkhMRmxCUVZrc1EwRkJRenRKUVVOdVF5eERRVUZETzBsQlJVMHNSMEZCUnl4RFFVRkRMRTlCUVU4N1VVRkRhRUlzTkVKQlFUUkNPMUZCUXpWQ0xFbEJRVWtzUTBGQlF5eHBRa0ZCYVVJc1IwRkJSeXhMUVVGTExFVkJRVVVzVlVGUEwwSXNSVUZCUlN4RlFVRkZPMWxCUTBnc1RVRkJUU3hUUVVGVExFZEJRVWNzVlVGQlZTeERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zUTBGQlF5eHJRa0ZCYTBJc1EwRkJRenRaUVVOMFJTeE5RVUZOTEUxQlFVMHNSMEZCTWtJN1owSkJRM0pETEZkQlFWY3NSVUZCUlN4VFFVRlRPMmRDUVVOMFFpeFpRVUZaTEVWQlFVVXNWVUZCVlN4RFFVRkRMRXRCUVVzN1owSkJRemxDTEZWQlFWVXNSVUZCUlN4UFFVRlBPMmRDUVVOdVFpeHpRa0ZCYzBJc1JVRkJSU3h2UWtGQmIwSTdaMEpCUXpWRExHRkJRV0VzUlVGQlJTeDFRa0ZCZFVJc1JVRkJSVHRuUWtGRGVFTXNSMEZCUnl4NVEwRkJlVU1zUTBGQlF5eFZRVUZWTEVOQlFVTXNUVUZCVFN4RFFVRkRPMkZCUTJoRkxFTkJRVU03V1VGRFJpeEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRlZCUVZVc1EwRkJReXh2UWtGQmIwSXNSVUZCUlN4TlFVRk5MRU5CUVVNc1EwRkJRenRSUVVNM1JDeERRVUZETEVOQlFVTTdVVUZEUml4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExGTkJRVk1zUTBGQlF5eFhRVUZYTEVOQlFVTXNTVUZCU1N4RFFVRkRMR2xDUVVGcFFpeERRVUZETEVOQlFVTTdTVUZEYUVVc1EwRkJRenRKUVVWTkxFdEJRVXNzUTBGQlF5eGpRVUZqTEVOQlFVTXNUMEZCVHp0UlFVTnFReXhOUVVGTkxGVkJRVlVzUjBGQlJ5eE5RVUZOTEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExFVkJRVVVzUTBGQlF5eERRVUZETzFGQlEzQkVMRTFCUVUwc1QwRkJUeXhEUVVGRExFZEJRVWNzUTBGRFppeFZRVUZWTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1RVRkJZeXhGUVVGRkxFVkJRVVU3V1VGRGFFTXNUVUZCVFN4TlFVRk5MRWRCUVRKQ08yZENRVU55UXl4WFFVRlhMRVZCUVVVc1pVRkJaVHRuUWtGRE5VSXNWVUZCVlN4RlFVRkZMRTlCUVU4N1owSkJRMjVDTEhOQ1FVRnpRaXhGUVVGRkxHOUNRVUZ2UWp0blFrRkROVU1zUjBGQlJ5eDVRMEZCZVVNc1EwRkJReXhOUVVGTkxFTkJRVU03WVVGRGNrUXNRMEZCUXp0WlFVTkdMRTlCUVU4c1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eFZRVUZWTEVOQlFVTXNiMEpCUVc5Q0xFVkJRVVVzVFVGQlRTeERRVUZETEVOQlFVTTdVVUZEY0VVc1EwRkJReXhEUVVGRExFTkJRMGdzUTBGQlF6dEpRVU5LTEVOQlFVTTdTVUZGVFN4UFFVRlBPMUZCUTFvc1NVRkJTU3hKUVVGSkxFTkJRVU1zYVVKQlFXbENMRVZCUVVVN1dVRkRNVUlzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4VFFVRlRMRU5CUVVNc1kwRkJZeXhEUVVGRExFbEJRVWtzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhEUVVGRE8xTkJRMnhGTzBsQlEwZ3NRMEZCUXp0RFFVTkdJbjA9IiwiaW1wb3J0IHsgaW5jcmVtZW50ZWRFdmVudE9yZGluYWwgfSBmcm9tIFwiLi4vbGliL2V4dGVuc2lvbi1zZXNzaW9uLWV2ZW50LW9yZGluYWxcIjtcbmltcG9ydCB7IGV4dGVuc2lvblNlc3Npb25VdWlkIH0gZnJvbSBcIi4uL2xpYi9leHRlbnNpb24tc2Vzc2lvbi11dWlkXCI7XG5pbXBvcnQgeyBIdHRwUG9zdFBhcnNlciB9IGZyb20gXCIuLi9saWIvaHR0cC1wb3N0LXBhcnNlclwiO1xuaW1wb3J0IHsgUGVuZGluZ1JlcXVlc3QgfSBmcm9tIFwiLi4vbGliL3BlbmRpbmctcmVxdWVzdFwiO1xuaW1wb3J0IHsgUGVuZGluZ1Jlc3BvbnNlIH0gZnJvbSBcIi4uL2xpYi9wZW5kaW5nLXJlc3BvbnNlXCI7XG5pbXBvcnQgeyBib29sVG9JbnQsIGVzY2FwZVN0cmluZywgZXNjYXBlVXJsIH0gZnJvbSBcIi4uL2xpYi9zdHJpbmctdXRpbHNcIjtcbi8qKlxuICogTm90ZTogRGlmZmVyZW50IHBhcnRzIG9mIHRoZSBkZXNpcmVkIGluZm9ybWF0aW9uIGFycml2ZXMgaW4gZGlmZmVyZW50IGV2ZW50cyBhcyBwZXIgYmVsb3c6XG4gKiByZXF1ZXN0ID0gaGVhZGVycyBpbiBvbkJlZm9yZVNlbmRIZWFkZXJzICsgYm9keSBpbiBvbkJlZm9yZVJlcXVlc3RcbiAqIHJlc3BvbnNlID0gaGVhZGVycyBpbiBvbkNvbXBsZXRlZCArIGJvZHkgdmlhIGEgb25CZWZvcmVSZXF1ZXN0IGZpbHRlclxuICogcmVkaXJlY3QgPSBvcmlnaW5hbCByZXF1ZXN0IGhlYWRlcnMrYm9keSwgZm9sbG93ZWQgYnkgYSBvbkJlZm9yZVJlZGlyZWN0IGFuZCB0aGVuIGEgbmV3IHNldCBvZiByZXF1ZXN0IGhlYWRlcnMrYm9keSBhbmQgcmVzcG9uc2UgaGVhZGVycytib2R5XG4gKiBEb2NzOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1VzZXI6d2JhbWJlcmcvd2ViUmVxdWVzdC5SZXF1ZXN0RGV0YWlsc1xuICovXG5leHBvcnQgY2xhc3MgSHR0cEluc3RydW1lbnQge1xuICAgIGNvbnN0cnVjdG9yKGRhdGFSZWNlaXZlcikge1xuICAgICAgICB0aGlzLnBlbmRpbmdSZXF1ZXN0cyA9IHt9O1xuICAgICAgICB0aGlzLnBlbmRpbmdSZXNwb25zZXMgPSB7fTtcbiAgICAgICAgdGhpcy5kYXRhUmVjZWl2ZXIgPSBkYXRhUmVjZWl2ZXI7XG4gICAgfVxuICAgIHJ1bihjcmF3bElELCBzYXZlQ29udGVudE9wdGlvbikge1xuICAgICAgICBjb25zdCBhbGxUeXBlcyA9IFtcbiAgICAgICAgICAgIFwiYmVhY29uXCIsXG4gICAgICAgICAgICBcImNzcF9yZXBvcnRcIixcbiAgICAgICAgICAgIFwiZm9udFwiLFxuICAgICAgICAgICAgXCJpbWFnZVwiLFxuICAgICAgICAgICAgXCJpbWFnZXNldFwiLFxuICAgICAgICAgICAgXCJtYWluX2ZyYW1lXCIsXG4gICAgICAgICAgICBcIm1lZGlhXCIsXG4gICAgICAgICAgICBcIm9iamVjdFwiLFxuICAgICAgICAgICAgXCJvYmplY3Rfc3VicmVxdWVzdFwiLFxuICAgICAgICAgICAgXCJwaW5nXCIsXG4gICAgICAgICAgICBcInNjcmlwdFwiLFxuICAgICAgICAgICAgLy8gXCJzcGVjdWxhdGl2ZVwiLFxuICAgICAgICAgICAgXCJzdHlsZXNoZWV0XCIsXG4gICAgICAgICAgICBcInN1Yl9mcmFtZVwiLFxuICAgICAgICAgICAgXCJ3ZWJfbWFuaWZlc3RcIixcbiAgICAgICAgICAgIFwid2Vic29ja2V0XCIsXG4gICAgICAgICAgICBcInhibFwiLFxuICAgICAgICAgICAgXCJ4bWxfZHRkXCIsXG4gICAgICAgICAgICBcInhtbGh0dHByZXF1ZXN0XCIsXG4gICAgICAgICAgICBcInhzbHRcIixcbiAgICAgICAgICAgIFwib3RoZXJcIixcbiAgICAgICAgXTtcbiAgICAgICAgY29uc3QgZmlsdGVyID0geyB1cmxzOiBbXCI8YWxsX3VybHM+XCJdLCB0eXBlczogYWxsVHlwZXMgfTtcbiAgICAgICAgY29uc3QgcmVxdWVzdFN0ZW1zRnJvbUV4dGVuc2lvbiA9IGRldGFpbHMgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChkZXRhaWxzLm9yaWdpblVybCAmJiBkZXRhaWxzLm9yaWdpblVybC5pbmRleE9mKFwibW96LWV4dGVuc2lvbjovL1wiKSA+IC0xKTtcbiAgICAgICAgfTtcbiAgICAgICAgLypcbiAgICAgICAgICogQXR0YWNoIGhhbmRsZXJzIHRvIGV2ZW50IGxpc3RlbmVyc1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5vbkJlZm9yZVJlcXVlc3RMaXN0ZW5lciA9IChkZXRhaWxzKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBibG9ja2luZ1Jlc3BvbnNlVGhhdERvZXNOb3RoaW5nID0ge307XG4gICAgICAgICAgICAvLyBJZ25vcmUgcmVxdWVzdHMgbWFkZSBieSBleHRlbnNpb25zXG4gICAgICAgICAgICBpZiAocmVxdWVzdFN0ZW1zRnJvbUV4dGVuc2lvbihkZXRhaWxzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBibG9ja2luZ1Jlc3BvbnNlVGhhdERvZXNOb3RoaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcGVuZGluZ1JlcXVlc3QgPSB0aGlzLmdldFBlbmRpbmdSZXF1ZXN0KGRldGFpbHMucmVxdWVzdElkKTtcbiAgICAgICAgICAgIHBlbmRpbmdSZXF1ZXN0LnJlc29sdmVPbkJlZm9yZVJlcXVlc3RFdmVudERldGFpbHMoZGV0YWlscyk7XG4gICAgICAgICAgICBjb25zdCBwZW5kaW5nUmVzcG9uc2UgPSB0aGlzLmdldFBlbmRpbmdSZXNwb25zZShkZXRhaWxzLnJlcXVlc3RJZCk7XG4gICAgICAgICAgICBwZW5kaW5nUmVzcG9uc2UucmVzb2x2ZU9uQmVmb3JlUmVxdWVzdEV2ZW50RGV0YWlscyhkZXRhaWxzKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNob3VsZFNhdmVDb250ZW50KHNhdmVDb250ZW50T3B0aW9uLCBkZXRhaWxzLnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgcGVuZGluZ1Jlc3BvbnNlLmFkZFJlc3BvbnNlUmVzcG9uc2VCb2R5TGlzdGVuZXIoZGV0YWlscyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYmxvY2tpbmdSZXNwb25zZVRoYXREb2VzTm90aGluZztcbiAgICAgICAgfTtcbiAgICAgICAgYnJvd3Nlci53ZWJSZXF1ZXN0Lm9uQmVmb3JlUmVxdWVzdC5hZGRMaXN0ZW5lcih0aGlzLm9uQmVmb3JlUmVxdWVzdExpc3RlbmVyLCBmaWx0ZXIsIHRoaXMuaXNDb250ZW50U2F2aW5nRW5hYmxlZChzYXZlQ29udGVudE9wdGlvbilcbiAgICAgICAgICAgID8gW1wicmVxdWVzdEJvZHlcIiwgXCJibG9ja2luZ1wiXVxuICAgICAgICAgICAgOiBbXCJyZXF1ZXN0Qm9keVwiXSk7XG4gICAgICAgIHRoaXMub25CZWZvcmVTZW5kSGVhZGVyc0xpc3RlbmVyID0gZGV0YWlscyA9PiB7XG4gICAgICAgICAgICAvLyBJZ25vcmUgcmVxdWVzdHMgbWFkZSBieSBleHRlbnNpb25zXG4gICAgICAgICAgICBpZiAocmVxdWVzdFN0ZW1zRnJvbUV4dGVuc2lvbihkZXRhaWxzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBlbmRpbmdSZXF1ZXN0ID0gdGhpcy5nZXRQZW5kaW5nUmVxdWVzdChkZXRhaWxzLnJlcXVlc3RJZCk7XG4gICAgICAgICAgICBwZW5kaW5nUmVxdWVzdC5yZXNvbHZlT25CZWZvcmVTZW5kSGVhZGVyc0V2ZW50RGV0YWlscyhkZXRhaWxzKTtcbiAgICAgICAgICAgIHRoaXMub25CZWZvcmVTZW5kSGVhZGVyc0hhbmRsZXIoZGV0YWlscywgY3Jhd2xJRCwgaW5jcmVtZW50ZWRFdmVudE9yZGluYWwoKSk7XG4gICAgICAgIH07XG4gICAgICAgIGJyb3dzZXIud2ViUmVxdWVzdC5vbkJlZm9yZVNlbmRIZWFkZXJzLmFkZExpc3RlbmVyKHRoaXMub25CZWZvcmVTZW5kSGVhZGVyc0xpc3RlbmVyLCBmaWx0ZXIsIFtcInJlcXVlc3RIZWFkZXJzXCJdKTtcbiAgICAgICAgdGhpcy5vbkJlZm9yZVJlZGlyZWN0TGlzdGVuZXIgPSBkZXRhaWxzID0+IHtcbiAgICAgICAgICAgIC8vIElnbm9yZSByZXF1ZXN0cyBtYWRlIGJ5IGV4dGVuc2lvbnNcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0U3RlbXNGcm9tRXh0ZW5zaW9uKGRldGFpbHMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vbkJlZm9yZVJlZGlyZWN0SGFuZGxlcihkZXRhaWxzLCBjcmF3bElELCBpbmNyZW1lbnRlZEV2ZW50T3JkaW5hbCgpKTtcbiAgICAgICAgfTtcbiAgICAgICAgYnJvd3Nlci53ZWJSZXF1ZXN0Lm9uQmVmb3JlUmVkaXJlY3QuYWRkTGlzdGVuZXIodGhpcy5vbkJlZm9yZVJlZGlyZWN0TGlzdGVuZXIsIGZpbHRlciwgW1wicmVzcG9uc2VIZWFkZXJzXCJdKTtcbiAgICAgICAgdGhpcy5vbkNvbXBsZXRlZExpc3RlbmVyID0gZGV0YWlscyA9PiB7XG4gICAgICAgICAgICAvLyBJZ25vcmUgcmVxdWVzdHMgbWFkZSBieSBleHRlbnNpb25zXG4gICAgICAgICAgICBpZiAocmVxdWVzdFN0ZW1zRnJvbUV4dGVuc2lvbihkZXRhaWxzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBlbmRpbmdSZXNwb25zZSA9IHRoaXMuZ2V0UGVuZGluZ1Jlc3BvbnNlKGRldGFpbHMucmVxdWVzdElkKTtcbiAgICAgICAgICAgIHBlbmRpbmdSZXNwb25zZS5yZXNvbHZlT25Db21wbGV0ZWRFdmVudERldGFpbHMoZGV0YWlscyk7XG4gICAgICAgICAgICB0aGlzLm9uQ29tcGxldGVkSGFuZGxlcihkZXRhaWxzLCBjcmF3bElELCBpbmNyZW1lbnRlZEV2ZW50T3JkaW5hbCgpLCBzYXZlQ29udGVudE9wdGlvbik7XG4gICAgICAgIH07XG4gICAgICAgIGJyb3dzZXIud2ViUmVxdWVzdC5vbkNvbXBsZXRlZC5hZGRMaXN0ZW5lcih0aGlzLm9uQ29tcGxldGVkTGlzdGVuZXIsIGZpbHRlciwgW1wicmVzcG9uc2VIZWFkZXJzXCJdKTtcbiAgICB9XG4gICAgY2xlYW51cCgpIHtcbiAgICAgICAgaWYgKHRoaXMub25CZWZvcmVSZXF1ZXN0TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGJyb3dzZXIud2ViUmVxdWVzdC5vbkJlZm9yZVJlcXVlc3QucmVtb3ZlTGlzdGVuZXIodGhpcy5vbkJlZm9yZVJlcXVlc3RMaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub25CZWZvcmVTZW5kSGVhZGVyc0xpc3RlbmVyKSB7XG4gICAgICAgICAgICBicm93c2VyLndlYlJlcXVlc3Qub25CZWZvcmVTZW5kSGVhZGVycy5yZW1vdmVMaXN0ZW5lcih0aGlzLm9uQmVmb3JlU2VuZEhlYWRlcnNMaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub25CZWZvcmVSZWRpcmVjdExpc3RlbmVyKSB7XG4gICAgICAgICAgICBicm93c2VyLndlYlJlcXVlc3Qub25CZWZvcmVSZWRpcmVjdC5yZW1vdmVMaXN0ZW5lcih0aGlzLm9uQmVmb3JlUmVkaXJlY3RMaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub25Db21wbGV0ZWRMaXN0ZW5lcikge1xuICAgICAgICAgICAgYnJvd3Nlci53ZWJSZXF1ZXN0Lm9uQ29tcGxldGVkLnJlbW92ZUxpc3RlbmVyKHRoaXMub25Db21wbGV0ZWRMaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaXNDb250ZW50U2F2aW5nRW5hYmxlZChzYXZlQ29udGVudE9wdGlvbikge1xuICAgICAgICBpZiAoc2F2ZUNvbnRlbnRPcHRpb24gPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzYXZlQ29udGVudE9wdGlvbiA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zYXZlQ29udGVudFJlc291cmNlVHlwZXMoc2F2ZUNvbnRlbnRPcHRpb24pLmxlbmd0aCA+IDA7XG4gICAgfVxuICAgIHNhdmVDb250ZW50UmVzb3VyY2VUeXBlcyhzYXZlQ29udGVudE9wdGlvbikge1xuICAgICAgICByZXR1cm4gc2F2ZUNvbnRlbnRPcHRpb24uc3BsaXQoXCIsXCIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBXZSByZWx5IG9uIHRoZSByZXNvdXJjZSB0eXBlIHRvIGZpbHRlciByZXNwb25zZXNcbiAgICAgKiBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvTW96aWxsYS9BZGQtb25zL1dlYkV4dGVuc2lvbnMvQVBJL3dlYlJlcXVlc3QvUmVzb3VyY2VUeXBlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2F2ZUNvbnRlbnRPcHRpb25cbiAgICAgKiBAcGFyYW0gcmVzb3VyY2VUeXBlXG4gICAgICovXG4gICAgc2hvdWxkU2F2ZUNvbnRlbnQoc2F2ZUNvbnRlbnRPcHRpb24sIHJlc291cmNlVHlwZSkge1xuICAgICAgICBpZiAoc2F2ZUNvbnRlbnRPcHRpb24gPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzYXZlQ29udGVudE9wdGlvbiA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zYXZlQ29udGVudFJlc291cmNlVHlwZXMoc2F2ZUNvbnRlbnRPcHRpb24pLmluY2x1ZGVzKHJlc291cmNlVHlwZSk7XG4gICAgfVxuICAgIGdldFBlbmRpbmdSZXF1ZXN0KHJlcXVlc3RJZCkge1xuICAgICAgICBpZiAoIXRoaXMucGVuZGluZ1JlcXVlc3RzW3JlcXVlc3RJZF0pIHtcbiAgICAgICAgICAgIHRoaXMucGVuZGluZ1JlcXVlc3RzW3JlcXVlc3RJZF0gPSBuZXcgUGVuZGluZ1JlcXVlc3QoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5wZW5kaW5nUmVxdWVzdHNbcmVxdWVzdElkXTtcbiAgICB9XG4gICAgZ2V0UGVuZGluZ1Jlc3BvbnNlKHJlcXVlc3RJZCkge1xuICAgICAgICBpZiAoIXRoaXMucGVuZGluZ1Jlc3BvbnNlc1tyZXF1ZXN0SWRdKSB7XG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdSZXNwb25zZXNbcmVxdWVzdElkXSA9IG5ldyBQZW5kaW5nUmVzcG9uc2UoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5wZW5kaW5nUmVzcG9uc2VzW3JlcXVlc3RJZF07XG4gICAgfVxuICAgIC8qXG4gICAgICogSFRUUCBSZXF1ZXN0IEhhbmRsZXIgYW5kIEhlbHBlciBGdW5jdGlvbnNcbiAgICAgKi9cbiAgICBhc3luYyBvbkJlZm9yZVNlbmRIZWFkZXJzSGFuZGxlcihkZXRhaWxzLCBjcmF3bElELCBldmVudE9yZGluYWwpIHtcbiAgICAgICAgLypcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgXCJvbkJlZm9yZVNlbmRIZWFkZXJzSGFuZGxlciAocHJldmlvdXNseSBodHRwUmVxdWVzdEhhbmRsZXIpXCIsXG4gICAgICAgICAgZGV0YWlscyxcbiAgICAgICAgICBjcmF3bElELFxuICAgICAgICApO1xuICAgICAgICAqL1xuICAgICAgICBjb25zdCB0YWIgPSBkZXRhaWxzLnRhYklkID4gLTFcbiAgICAgICAgICAgID8gYXdhaXQgYnJvd3Nlci50YWJzLmdldChkZXRhaWxzLnRhYklkKVxuICAgICAgICAgICAgOiB7IHdpbmRvd0lkOiB1bmRlZmluZWQsIGluY29nbml0bzogdW5kZWZpbmVkLCB1cmw6IHVuZGVmaW5lZCB9O1xuICAgICAgICBjb25zdCB1cGRhdGUgPSB7fTtcbiAgICAgICAgdXBkYXRlLmluY29nbml0byA9IGJvb2xUb0ludCh0YWIuaW5jb2duaXRvKTtcbiAgICAgICAgdXBkYXRlLmJyb3dzZXJfaWQgPSBjcmF3bElEO1xuICAgICAgICB1cGRhdGUuZXh0ZW5zaW9uX3Nlc3Npb25fdXVpZCA9IGV4dGVuc2lvblNlc3Npb25VdWlkO1xuICAgICAgICB1cGRhdGUuZXZlbnRfb3JkaW5hbCA9IGV2ZW50T3JkaW5hbDtcbiAgICAgICAgdXBkYXRlLndpbmRvd19pZCA9IHRhYi53aW5kb3dJZDtcbiAgICAgICAgdXBkYXRlLnRhYl9pZCA9IGRldGFpbHMudGFiSWQ7XG4gICAgICAgIHVwZGF0ZS5mcmFtZV9pZCA9IGRldGFpbHMuZnJhbWVJZDtcbiAgICAgICAgLy8gcmVxdWVzdElkIGlzIGEgdW5pcXVlIGlkZW50aWZpZXIgdGhhdCBjYW4gYmUgdXNlZCB0byBsaW5rIHJlcXVlc3RzIGFuZCByZXNwb25zZXNcbiAgICAgICAgdXBkYXRlLnJlcXVlc3RfaWQgPSBkZXRhaWxzLnJlcXVlc3RJZDtcbiAgICAgICAgY29uc3QgdXJsID0gZGV0YWlscy51cmw7XG4gICAgICAgIHVwZGF0ZS51cmwgPSBlc2NhcGVVcmwodXJsKTtcbiAgICAgICAgY29uc3QgcmVxdWVzdE1ldGhvZCA9IGRldGFpbHMubWV0aG9kO1xuICAgICAgICB1cGRhdGUubWV0aG9kID0gZXNjYXBlU3RyaW5nKHJlcXVlc3RNZXRob2QpO1xuICAgICAgICBjb25zdCBjdXJyZW50X3RpbWUgPSBuZXcgRGF0ZShkZXRhaWxzLnRpbWVTdGFtcCk7XG4gICAgICAgIHVwZGF0ZS50aW1lX3N0YW1wID0gY3VycmVudF90aW1lLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIGxldCBlbmNvZGluZ1R5cGUgPSBcIlwiO1xuICAgICAgICBsZXQgcmVmZXJyZXIgPSBcIlwiO1xuICAgICAgICBjb25zdCBoZWFkZXJzID0gW107XG4gICAgICAgIGxldCBpc09jc3AgPSBmYWxzZTtcbiAgICAgICAgaWYgKGRldGFpbHMucmVxdWVzdEhlYWRlcnMpIHtcbiAgICAgICAgICAgIGRldGFpbHMucmVxdWVzdEhlYWRlcnMubWFwKHJlcXVlc3RIZWFkZXIgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgbmFtZSwgdmFsdWUgfSA9IHJlcXVlc3RIZWFkZXI7XG4gICAgICAgICAgICAgICAgY29uc3QgaGVhZGVyX3BhaXIgPSBbXTtcbiAgICAgICAgICAgICAgICBoZWFkZXJfcGFpci5wdXNoKGVzY2FwZVN0cmluZyhuYW1lKSk7XG4gICAgICAgICAgICAgICAgaGVhZGVyX3BhaXIucHVzaChlc2NhcGVTdHJpbmcodmFsdWUpKTtcbiAgICAgICAgICAgICAgICBoZWFkZXJzLnB1c2goaGVhZGVyX3BhaXIpO1xuICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSBcIkNvbnRlbnQtVHlwZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGVuY29kaW5nVHlwZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZW5jb2RpbmdUeXBlLmluZGV4T2YoXCJhcHBsaWNhdGlvbi9vY3NwLXJlcXVlc3RcIikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc09jc3AgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSBcIlJlZmVyZXJcIikge1xuICAgICAgICAgICAgICAgICAgICByZWZlcnJlciA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHVwZGF0ZS5yZWZlcnJlciA9IGVzY2FwZVN0cmluZyhyZWZlcnJlcik7XG4gICAgICAgIGlmIChyZXF1ZXN0TWV0aG9kID09PSBcIlBPU1RcIiAmJiAhaXNPY3NwIC8qIGRvbid0IHByb2Nlc3MgT0NTUCByZXF1ZXN0cyAqLykge1xuICAgICAgICAgICAgY29uc3QgcGVuZGluZ1JlcXVlc3QgPSB0aGlzLmdldFBlbmRpbmdSZXF1ZXN0KGRldGFpbHMucmVxdWVzdElkKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc29sdmVkID0gYXdhaXQgcGVuZGluZ1JlcXVlc3QucmVzb2x2ZWRXaXRoaW5UaW1lb3V0KDEwMDApO1xuICAgICAgICAgICAgaWYgKCFyZXNvbHZlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVJlY2VpdmVyLmxvZ0Vycm9yKFwiUGVuZGluZyByZXF1ZXN0IHRpbWVkIG91dCB3YWl0aW5nIGZvciBkYXRhIGZyb20gYm90aCBvbkJlZm9yZVJlcXVlc3QgYW5kIG9uQmVmb3JlU2VuZEhlYWRlcnMgZXZlbnRzXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb25CZWZvcmVSZXF1ZXN0RXZlbnREZXRhaWxzID0gYXdhaXQgcGVuZGluZ1JlcXVlc3Qub25CZWZvcmVSZXF1ZXN0RXZlbnREZXRhaWxzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RCb2R5ID0gb25CZWZvcmVSZXF1ZXN0RXZlbnREZXRhaWxzLnJlcXVlc3RCb2R5O1xuICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0Qm9keSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3N0UGFyc2VyID0gbmV3IEh0dHBQb3N0UGFyc2VyKFxuICAgICAgICAgICAgICAgICAgICAvLyBkZXRhaWxzLFxuICAgICAgICAgICAgICAgICAgICBvbkJlZm9yZVJlcXVlc3RFdmVudERldGFpbHMsIHRoaXMuZGF0YVJlY2VpdmVyKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zdE9iaiA9IHBvc3RQYXJzZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5wYXJzZVBvc3RSZXF1ZXN0KCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFkZCAoUE9TVCkgcmVxdWVzdCBoZWFkZXJzIGZyb20gdXBsb2FkIHN0cmVhbVxuICAgICAgICAgICAgICAgICAgICBpZiAoXCJwb3N0X2hlYWRlcnNcIiBpbiBwb3N0T2JqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IHN0b3JlIFBPU1QgaGVhZGVycyB0aGF0IHdlIGtub3cgYW5kIG5lZWQuIFdlIG1heSBtaXNpbnRlcnByZXQgUE9TVCBkYXRhIGFzIGhlYWRlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFzIGRldGVjdGlvbiBpcyBiYXNlZCBvbiBcImtleTp2YWx1ZVwiIGZvcm1hdCAobm9uLWhlYWRlciBQT1NUIGRhdGEgY2FuIGJlIGluIHRoaXMgZm9ybWF0IGFzIHdlbGwpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50SGVhZGVycyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1EaXNwb3NpdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1MZW5ndGhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gcG9zdE9iai5wb3N0X2hlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudEhlYWRlcnMuaW5jbHVkZXMobmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaGVhZGVyX3BhaXIgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyX3BhaXIucHVzaChlc2NhcGVTdHJpbmcobmFtZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJfcGFpci5wdXNoKGVzY2FwZVN0cmluZyhwb3N0T2JqLnBvc3RfaGVhZGVyc1tuYW1lXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzLnB1c2goaGVhZGVyX3BhaXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyB3ZSBzdG9yZSBQT1NUIGJvZHkgaW4gSlNPTiBmb3JtYXQsIGV4Y2VwdCB3aGVuIGl0J3MgYSBzdHJpbmcgd2l0aG91dCBhIChrZXktdmFsdWUpIHN0cnVjdHVyZVxuICAgICAgICAgICAgICAgICAgICBpZiAoXCJwb3N0X2JvZHlcIiBpbiBwb3N0T2JqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUucG9zdF9ib2R5ID0gcG9zdE9iai5wb3N0X2JvZHk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKFwicG9zdF9ib2R5X3Jhd1wiIGluIHBvc3RPYmopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZS5wb3N0X2JvZHlfcmF3ID0gcG9zdE9iai5wb3N0X2JvZHlfcmF3O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHVwZGF0ZS5oZWFkZXJzID0gSlNPTi5zdHJpbmdpZnkoaGVhZGVycyk7XG4gICAgICAgIC8vIENoZWNrIGlmIHhoclxuICAgICAgICBjb25zdCBpc1hIUiA9IGRldGFpbHMudHlwZSA9PT0gXCJ4bWxodHRwcmVxdWVzdFwiO1xuICAgICAgICB1cGRhdGUuaXNfWEhSID0gYm9vbFRvSW50KGlzWEhSKTtcbiAgICAgICAgLy8gR3JhYiB0aGUgdHJpZ2dlcmluZyBhbmQgbG9hZGluZyBQcmluY2lwYWxzXG4gICAgICAgIGxldCB0cmlnZ2VyaW5nT3JpZ2luO1xuICAgICAgICBsZXQgbG9hZGluZ09yaWdpbjtcbiAgICAgICAgaWYgKGRldGFpbHMub3JpZ2luVXJsKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZWRPcmlnaW5VcmwgPSBuZXcgVVJMKGRldGFpbHMub3JpZ2luVXJsKTtcbiAgICAgICAgICAgIHRyaWdnZXJpbmdPcmlnaW4gPSBwYXJzZWRPcmlnaW5Vcmwub3JpZ2luO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkZXRhaWxzLmRvY3VtZW50VXJsKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZWREb2N1bWVudFVybCA9IG5ldyBVUkwoZGV0YWlscy5kb2N1bWVudFVybCk7XG4gICAgICAgICAgICBsb2FkaW5nT3JpZ2luID0gcGFyc2VkRG9jdW1lbnRVcmwub3JpZ2luO1xuICAgICAgICB9XG4gICAgICAgIHVwZGF0ZS50cmlnZ2VyaW5nX29yaWdpbiA9IGVzY2FwZVN0cmluZyh0cmlnZ2VyaW5nT3JpZ2luKTtcbiAgICAgICAgdXBkYXRlLmxvYWRpbmdfb3JpZ2luID0gZXNjYXBlU3RyaW5nKGxvYWRpbmdPcmlnaW4pO1xuICAgICAgICAvLyBsb2FkaW5nRG9jdW1lbnQncyBocmVmXG4gICAgICAgIC8vIFRoZSBsb2FkaW5nRG9jdW1lbnQgaXMgdGhlIGRvY3VtZW50IHRoZSBlbGVtZW50IHJlc2lkZXMsIHJlZ2FyZGxlc3Mgb2ZcbiAgICAgICAgLy8gaG93IHRoZSBsb2FkIHdhcyB0cmlnZ2VyZWQuXG4gICAgICAgIGNvbnN0IGxvYWRpbmdIcmVmID0gZGV0YWlscy5kb2N1bWVudFVybDtcbiAgICAgICAgdXBkYXRlLmxvYWRpbmdfaHJlZiA9IGVzY2FwZVN0cmluZyhsb2FkaW5nSHJlZik7XG4gICAgICAgIC8vIHJlc291cmNlVHlwZSBvZiB0aGUgcmVxdWVzdGluZyBub2RlLiBUaGlzIGlzIHNldCBieSB0aGUgdHlwZSBvZlxuICAgICAgICAvLyBub2RlIG1ha2luZyB0aGUgcmVxdWVzdCAoaS5lLiBhbiA8aW1nIHNyYz0uLi4+IG5vZGUgd2lsbCBzZXQgdG8gdHlwZSBcImltYWdlXCIpLlxuICAgICAgICAvLyBEb2N1bWVudGF0aW9uOlxuICAgICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL01vemlsbGEvQWRkLW9ucy9XZWJFeHRlbnNpb25zL0FQSS93ZWJSZXF1ZXN0L1Jlc291cmNlVHlwZVxuICAgICAgICB1cGRhdGUucmVzb3VyY2VfdHlwZSA9IGRldGFpbHMudHlwZTtcbiAgICAgICAgLypcbiAgICAgICAgLy8gVE9ETzogUmVmYWN0b3IgdG8gY29ycmVzcG9uZGluZyB3ZWJleHQgbG9naWMgb3IgZGlzY2FyZFxuICAgICAgICBjb25zdCBUaGlyZFBhcnR5VXRpbCA9IENjW1wiQG1vemlsbGEub3JnL3RoaXJkcGFydHl1dGlsOzFcIl0uZ2V0U2VydmljZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaS5tb3pJVGhpcmRQYXJ0eVV0aWwpO1xuICAgICAgICAvLyBEbyB0aGlyZC1wYXJ0eSBjaGVja3NcbiAgICAgICAgLy8gVGhlc2Ugc3BlY2lmaWMgY2hlY2tzIGFyZSBkb25lIGJlY2F1c2UgaXQncyB3aGF0J3MgdXNlZCBpbiBUcmFja2luZyBQcm90ZWN0aW9uXG4gICAgICAgIC8vIFNlZTogaHR0cDovL3NlYXJjaGZveC5vcmcvbW96aWxsYS1jZW50cmFsL3NvdXJjZS9uZXR3ZXJrL2Jhc2UvbnNDaGFubmVsQ2xhc3NpZmllci5jcHAjMTA3XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgaXNUaGlyZFBhcnR5Q2hhbm5lbCA9IFRoaXJkUGFydHlVdGlsLmlzVGhpcmRQYXJ0eUNoYW5uZWwoZGV0YWlscyk7XG4gICAgICAgICAgY29uc3QgdG9wV2luZG93ID0gVGhpcmRQYXJ0eVV0aWwuZ2V0VG9wV2luZG93Rm9yQ2hhbm5lbChkZXRhaWxzKTtcbiAgICAgICAgICBjb25zdCB0b3BVUkkgPSBUaGlyZFBhcnR5VXRpbC5nZXRVUklGcm9tV2luZG93KHRvcFdpbmRvdyk7XG4gICAgICAgICAgaWYgKHRvcFVSSSkge1xuICAgICAgICAgICAgY29uc3QgdG9wVXJsID0gdG9wVVJJLnNwZWM7XG4gICAgICAgICAgICBjb25zdCBjaGFubmVsVVJJID0gZGV0YWlscy5VUkk7XG4gICAgICAgICAgICBjb25zdCBpc1RoaXJkUGFydHlUb1RvcFdpbmRvdyA9IFRoaXJkUGFydHlVdGlsLmlzVGhpcmRQYXJ0eVVSSShcbiAgICAgICAgICAgICAgY2hhbm5lbFVSSSxcbiAgICAgICAgICAgICAgdG9wVVJJLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHVwZGF0ZS5pc190aGlyZF9wYXJ0eV90b190b3Bfd2luZG93ID0gaXNUaGlyZFBhcnR5VG9Ub3BXaW5kb3c7XG4gICAgICAgICAgICB1cGRhdGUuaXNfdGhpcmRfcGFydHlfY2hhbm5lbCA9IGlzVGhpcmRQYXJ0eUNoYW5uZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChhbkVycm9yKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9ucyBleHBlY3RlZCBmb3IgY2hhbm5lbHMgdHJpZ2dlcmVkIG9yIGxvYWRpbmcgaW4gYVxuICAgICAgICAgIC8vIE51bGxQcmluY2lwYWwgb3IgU3lzdGVtUHJpbmNpcGFsLiBUaGV5IGFyZSBhbHNvIGV4cGVjdGVkIGZvciBmYXZpY29uXG4gICAgICAgICAgLy8gbG9hZHMsIHdoaWNoIHdlIGF0dGVtcHQgdG8gZmlsdGVyLiBEZXBlbmRpbmcgb24gdGhlIG5hbWluZywgc29tZSBmYXZpY29uc1xuICAgICAgICAgIC8vIG1heSBjb250aW51ZSB0byBsZWFkIHRvIGVycm9yIGxvZ3MuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgdXBkYXRlLnRyaWdnZXJpbmdfb3JpZ2luICE9PSBcIltTeXN0ZW0gUHJpbmNpcGFsXVwiICYmXG4gICAgICAgICAgICB1cGRhdGUudHJpZ2dlcmluZ19vcmlnaW4gIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdXBkYXRlLmxvYWRpbmdfb3JpZ2luICE9PSBcIltTeXN0ZW0gUHJpbmNpcGFsXVwiICYmXG4gICAgICAgICAgICB1cGRhdGUubG9hZGluZ19vcmlnaW4gIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgIXVwZGF0ZS51cmwuZW5kc1dpdGgoXCJpY29cIilcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVJlY2VpdmVyLmxvZ0Vycm9yKFxuICAgICAgICAgICAgICBcIkVycm9yIHdoaWxlIHJldHJpZXZpbmcgYWRkaXRpb25hbCBjaGFubmVsIGluZm9ybWF0aW9uIGZvciBVUkw6IFwiICtcbiAgICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICAgIHVwZGF0ZS51cmwgK1xuICAgICAgICAgICAgICBcIlxcbiBFcnJvciB0ZXh0OlwiICtcbiAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoYW5FcnJvciksXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAqL1xuICAgICAgICB1cGRhdGUudG9wX2xldmVsX3VybCA9IGVzY2FwZVVybCh0aGlzLmdldERvY3VtZW50VXJsRm9yUmVxdWVzdChkZXRhaWxzKSk7XG4gICAgICAgIHVwZGF0ZS5wYXJlbnRfZnJhbWVfaWQgPSBkZXRhaWxzLnBhcmVudEZyYW1lSWQ7XG4gICAgICAgIHVwZGF0ZS5mcmFtZV9hbmNlc3RvcnMgPSBlc2NhcGVTdHJpbmcoSlNPTi5zdHJpbmdpZnkoZGV0YWlscy5mcmFtZUFuY2VzdG9ycykpO1xuICAgICAgICB0aGlzLmRhdGFSZWNlaXZlci5zYXZlUmVjb3JkKFwiaHR0cF9yZXF1ZXN0c1wiLCB1cGRhdGUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb2RlIHRha2VuIGFuZCBhZGFwdGVkIGZyb21cbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vRUZGb3JnL3ByaXZhY3liYWRnZXIvcHVsbC8yMTk4L2ZpbGVzXG4gICAgICpcbiAgICAgKiBHZXRzIHRoZSBVUkwgZm9yIGEgZ2l2ZW4gcmVxdWVzdCdzIHRvcC1sZXZlbCBkb2N1bWVudC5cbiAgICAgKlxuICAgICAqIFRoZSByZXF1ZXN0J3MgZG9jdW1lbnQgbWF5IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBjdXJyZW50IHRvcC1sZXZlbCBkb2N1bWVudFxuICAgICAqIGxvYWRlZCBpbiB0YWIgYXMgcmVxdWVzdHMgY2FuIGNvbWUgb3V0IG9mIG9yZGVyOlxuICAgICAqXG4gICAgICogQHBhcmFtIHtXZWJSZXF1ZXN0T25CZWZvcmVTZW5kSGVhZGVyc0V2ZW50RGV0YWlsc30gZGV0YWlsc1xuICAgICAqXG4gICAgICogQHJldHVybiB7P1N0cmluZ30gdGhlIFVSTCBmb3IgdGhlIHJlcXVlc3QncyB0b3AtbGV2ZWwgZG9jdW1lbnRcbiAgICAgKi9cbiAgICBnZXREb2N1bWVudFVybEZvclJlcXVlc3QoZGV0YWlscykge1xuICAgICAgICBsZXQgdXJsID0gXCJcIjtcbiAgICAgICAgaWYgKGRldGFpbHMudHlwZSA9PT0gXCJtYWluX2ZyYW1lXCIpIHtcbiAgICAgICAgICAgIC8vIFVybCBvZiB0aGUgdG9wLWxldmVsIGRvY3VtZW50IGl0c2VsZi5cbiAgICAgICAgICAgIHVybCA9IGRldGFpbHMudXJsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRldGFpbHMuaGFzT3duUHJvcGVydHkoXCJmcmFtZUFuY2VzdG9yc1wiKSkge1xuICAgICAgICAgICAgLy8gSW4gY2FzZSBvZiBuZXN0ZWQgZnJhbWVzLCByZXRyaWV2ZSB1cmwgZnJvbSB0b3AtbW9zdCBhbmNlc3Rvci5cbiAgICAgICAgICAgIC8vIElmIGZyYW1lQW5jZXN0b3JzID09IFtdLCByZXF1ZXN0IGNvbWVzIGZyb20gdGhlIHRvcC1sZXZlbC1kb2N1bWVudC5cbiAgICAgICAgICAgIHVybCA9IGRldGFpbHMuZnJhbWVBbmNlc3RvcnMubGVuZ3RoXG4gICAgICAgICAgICAgICAgPyBkZXRhaWxzLmZyYW1lQW5jZXN0b3JzW2RldGFpbHMuZnJhbWVBbmNlc3RvcnMubGVuZ3RoIC0gMV0udXJsXG4gICAgICAgICAgICAgICAgOiBkZXRhaWxzLmRvY3VtZW50VXJsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gdHlwZSAhPSAnbWFpbl9mcmFtZScgYW5kIGZyYW1lQW5jZXN0b3JzID09IHVuZGVmaW5lZFxuICAgICAgICAgICAgLy8gRm9yIGV4YW1wbGUgc2VydmljZSB3b3JrZXJzOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD0xNDcwNTM3I2MxM1xuICAgICAgICAgICAgdXJsID0gZGV0YWlscy5kb2N1bWVudFVybDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXJsO1xuICAgIH1cbiAgICBhc3luYyBvbkJlZm9yZVJlZGlyZWN0SGFuZGxlcihkZXRhaWxzLCBjcmF3bElELCBldmVudE9yZGluYWwpIHtcbiAgICAgICAgLypcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgXCJvbkJlZm9yZVJlZGlyZWN0SGFuZGxlciAocHJldmlvdXNseSBodHRwUmVxdWVzdEhhbmRsZXIpXCIsXG4gICAgICAgICAgZGV0YWlscyxcbiAgICAgICAgICBjcmF3bElELFxuICAgICAgICApO1xuICAgICAgICAqL1xuICAgICAgICAvLyBTYXZlIEhUVFAgcmVkaXJlY3QgZXZlbnRzXG4gICAgICAgIC8vIEV2ZW50cyBhcmUgc2F2ZWQgdG8gdGhlIGBodHRwX3JlZGlyZWN0c2AgdGFibGVcbiAgICAgICAgLypcbiAgICAgICAgLy8gVE9ETzogUmVmYWN0b3IgdG8gY29ycmVzcG9uZGluZyB3ZWJleHQgbG9naWMgb3IgZGlzY2FyZFxuICAgICAgICAvLyBFdmVudHMgYXJlIHNhdmVkIHRvIHRoZSBgaHR0cF9yZWRpcmVjdHNgIHRhYmxlLCBhbmQgbWFwIHRoZSBvbGRcbiAgICAgICAgLy8gcmVxdWVzdC9yZXNwb25zZSBjaGFubmVsIGlkIHRvIHRoZSBuZXcgcmVxdWVzdC9yZXNwb25zZSBjaGFubmVsIGlkLlxuICAgICAgICAvLyBJbXBsZW1lbnRhdGlvbiBiYXNlZCBvbjogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzExMjQwNjI3XG4gICAgICAgIGNvbnN0IG9sZE5vdGlmaWNhdGlvbnMgPSBkZXRhaWxzLm5vdGlmaWNhdGlvbkNhbGxiYWNrcztcbiAgICAgICAgbGV0IG9sZEV2ZW50U2luayA9IG51bGw7XG4gICAgICAgIGRldGFpbHMubm90aWZpY2F0aW9uQ2FsbGJhY2tzID0ge1xuICAgICAgICAgIFF1ZXJ5SW50ZXJmYWNlOiBYUENPTVV0aWxzLmdlbmVyYXRlUUkoW1xuICAgICAgICAgICAgQ2kubnNJSW50ZXJmYWNlUmVxdWVzdG9yLFxuICAgICAgICAgICAgQ2kubnNJQ2hhbm5lbEV2ZW50U2luayxcbiAgICAgICAgICBdKSxcbiAgICBcbiAgICAgICAgICBnZXRJbnRlcmZhY2UoaWlkKSB7XG4gICAgICAgICAgICAvLyBXZSBhcmUgb25seSBpbnRlcmVzdGVkIGluIG5zSUNoYW5uZWxFdmVudFNpbmssXG4gICAgICAgICAgICAvLyByZXR1cm4gdGhlIG9sZCBjYWxsYmFja3MgZm9yIGFueSBvdGhlciBpbnRlcmZhY2UgcmVxdWVzdHMuXG4gICAgICAgICAgICBpZiAoaWlkLmVxdWFscyhDaS5uc0lDaGFubmVsRXZlbnRTaW5rKSkge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG9sZEV2ZW50U2luayA9IG9sZE5vdGlmaWNhdGlvbnMuUXVlcnlJbnRlcmZhY2UoaWlkKTtcbiAgICAgICAgICAgICAgfSBjYXRjaCAoYW5FcnJvcikge1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVJlY2VpdmVyLmxvZ0Vycm9yKFxuICAgICAgICAgICAgICAgICAgXCJFcnJvciBkdXJpbmcgY2FsbCB0byBjdXN0b20gbm90aWZpY2F0aW9uQ2FsbGJhY2tzOjpnZXRJbnRlcmZhY2UuXCIgK1xuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShhbkVycm9yKSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgaWYgKG9sZE5vdGlmaWNhdGlvbnMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG9sZE5vdGlmaWNhdGlvbnMuZ2V0SW50ZXJmYWNlKGlpZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyBDci5OU19FUlJPUl9OT19JTlRFUkZBQ0U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICBcbiAgICAgICAgICBhc3luY09uQ2hhbm5lbFJlZGlyZWN0KG9sZENoYW5uZWwsIG5ld0NoYW5uZWwsIGZsYWdzLCBjYWxsYmFjaykge1xuICAgIFxuICAgICAgICAgICAgbmV3Q2hhbm5lbC5RdWVyeUludGVyZmFjZShDaS5uc0lIdHRwQ2hhbm5lbCk7XG4gICAgXG4gICAgICAgICAgICBjb25zdCBodHRwUmVkaXJlY3Q6IEh0dHBSZWRpcmVjdCA9IHtcbiAgICAgICAgICAgICAgYnJvd3Nlcl9pZDogY3Jhd2xJRCxcbiAgICAgICAgICAgICAgb2xkX3JlcXVlc3RfaWQ6IG9sZENoYW5uZWwuY2hhbm5lbElkLFxuICAgICAgICAgICAgICBuZXdfcmVxdWVzdF9pZDogbmV3Q2hhbm5lbC5jaGFubmVsSWQsXG4gICAgICAgICAgICAgIHRpbWVfc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmRhdGFSZWNlaXZlci5zYXZlUmVjb3JkKFwiaHR0cF9yZWRpcmVjdHNcIiwgaHR0cFJlZGlyZWN0KTtcbiAgICBcbiAgICAgICAgICAgIGlmIChvbGRFdmVudFNpbmspIHtcbiAgICAgICAgICAgICAgb2xkRXZlbnRTaW5rLmFzeW5jT25DaGFubmVsUmVkaXJlY3QoXG4gICAgICAgICAgICAgICAgb2xkQ2hhbm5lbCxcbiAgICAgICAgICAgICAgICBuZXdDaGFubmVsLFxuICAgICAgICAgICAgICAgIGZsYWdzLFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2sub25SZWRpcmVjdFZlcmlmeUNhbGxiYWNrKENyLk5TX09LKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICAqL1xuICAgICAgICBjb25zdCByZXNwb25zZVN0YXR1cyA9IGRldGFpbHMuc3RhdHVzQ29kZTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2VTdGF0dXNUZXh0ID0gZGV0YWlscy5zdGF0dXNMaW5lO1xuICAgICAgICBjb25zdCB0YWIgPSBkZXRhaWxzLnRhYklkID4gLTFcbiAgICAgICAgICAgID8gYXdhaXQgYnJvd3Nlci50YWJzLmdldChkZXRhaWxzLnRhYklkKVxuICAgICAgICAgICAgOiB7IHdpbmRvd0lkOiB1bmRlZmluZWQsIGluY29nbml0bzogdW5kZWZpbmVkIH07XG4gICAgICAgIGNvbnN0IGh0dHBSZWRpcmVjdCA9IHtcbiAgICAgICAgICAgIGluY29nbml0bzogYm9vbFRvSW50KHRhYi5pbmNvZ25pdG8pLFxuICAgICAgICAgICAgYnJvd3Nlcl9pZDogY3Jhd2xJRCxcbiAgICAgICAgICAgIG9sZF9yZXF1ZXN0X3VybDogZXNjYXBlVXJsKGRldGFpbHMudXJsKSxcbiAgICAgICAgICAgIG9sZF9yZXF1ZXN0X2lkOiBkZXRhaWxzLnJlcXVlc3RJZCxcbiAgICAgICAgICAgIG5ld19yZXF1ZXN0X3VybDogZXNjYXBlVXJsKGRldGFpbHMucmVkaXJlY3RVcmwpLFxuICAgICAgICAgICAgbmV3X3JlcXVlc3RfaWQ6IG51bGwsXG4gICAgICAgICAgICBleHRlbnNpb25fc2Vzc2lvbl91dWlkOiBleHRlbnNpb25TZXNzaW9uVXVpZCxcbiAgICAgICAgICAgIGV2ZW50X29yZGluYWw6IGV2ZW50T3JkaW5hbCxcbiAgICAgICAgICAgIHdpbmRvd19pZDogdGFiLndpbmRvd0lkLFxuICAgICAgICAgICAgdGFiX2lkOiBkZXRhaWxzLnRhYklkLFxuICAgICAgICAgICAgZnJhbWVfaWQ6IGRldGFpbHMuZnJhbWVJZCxcbiAgICAgICAgICAgIHJlc3BvbnNlX3N0YXR1czogcmVzcG9uc2VTdGF0dXMsXG4gICAgICAgICAgICByZXNwb25zZV9zdGF0dXNfdGV4dDogZXNjYXBlU3RyaW5nKHJlc3BvbnNlU3RhdHVzVGV4dCksXG4gICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmpzb25pZnlIZWFkZXJzKGRldGFpbHMucmVzcG9uc2VIZWFkZXJzKS5oZWFkZXJzLFxuICAgICAgICAgICAgdGltZV9zdGFtcDogbmV3IERhdGUoZGV0YWlscy50aW1lU3RhbXApLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGF0YVJlY2VpdmVyLnNhdmVSZWNvcmQoXCJodHRwX3JlZGlyZWN0c1wiLCBodHRwUmVkaXJlY3QpO1xuICAgIH1cbiAgICAvKlxuICAgICAqIEhUVFAgUmVzcG9uc2UgSGFuZGxlcnMgYW5kIEhlbHBlciBGdW5jdGlvbnNcbiAgICAgKi9cbiAgICBhc3luYyBsb2dXaXRoUmVzcG9uc2VCb2R5KGRldGFpbHMsIHVwZGF0ZSkge1xuICAgICAgICBjb25zdCBwZW5kaW5nUmVzcG9uc2UgPSB0aGlzLmdldFBlbmRpbmdSZXNwb25zZShkZXRhaWxzLnJlcXVlc3RJZCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZUJvZHlMaXN0ZW5lciA9IHBlbmRpbmdSZXNwb25zZS5yZXNwb25zZUJvZHlMaXN0ZW5lcjtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BCb2R5ID0gYXdhaXQgcmVzcG9uc2VCb2R5TGlzdGVuZXIuZ2V0UmVzcG9uc2VCb2R5KCk7XG4gICAgICAgICAgICBjb25zdCBjb250ZW50SGFzaCA9IGF3YWl0IHJlc3BvbnNlQm9keUxpc3RlbmVyLmdldENvbnRlbnRIYXNoKCk7XG4gICAgICAgICAgICB0aGlzLmRhdGFSZWNlaXZlci5zYXZlQ29udGVudChyZXNwQm9keSwgZXNjYXBlU3RyaW5nKGNvbnRlbnRIYXNoKSk7XG4gICAgICAgICAgICB1cGRhdGUuY29udGVudF9oYXNoID0gY29udGVudEhhc2g7XG4gICAgICAgICAgICB0aGlzLmRhdGFSZWNlaXZlci5zYXZlUmVjb3JkKFwiaHR0cF9yZXNwb25zZXNcIiwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgLy8gVE9ETzogUmVmYWN0b3IgdG8gY29ycmVzcG9uZGluZyB3ZWJleHQgbG9naWMgb3IgZGlzY2FyZFxuICAgICAgICAgICAgZGF0YVJlY2VpdmVyLmxvZ0Vycm9yKFxuICAgICAgICAgICAgICBcIlVuYWJsZSB0byByZXRyaWV2ZSByZXNwb25zZSBib2R5LlwiICsgSlNPTi5zdHJpbmdpZnkoYVJlYXNvbiksXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdXBkYXRlLmNvbnRlbnRfaGFzaCA9IFwiPGVycm9yPlwiO1xuICAgICAgICAgICAgZGF0YVJlY2VpdmVyLnNhdmVSZWNvcmQoXCJodHRwX3Jlc3BvbnNlc1wiLCB1cGRhdGUpO1xuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuZGF0YVJlY2VpdmVyLmxvZ0Vycm9yKFwiVW5hYmxlIHRvIHJldHJpZXZlIHJlc3BvbnNlIGJvZHkuXCIgK1xuICAgICAgICAgICAgICAgIFwiTGlrZWx5IGNhdXNlZCBieSBhIHByb2dyYW1taW5nIGVycm9yLiBFcnJvciBNZXNzYWdlOlwiICtcbiAgICAgICAgICAgICAgICBlcnIubmFtZSArXG4gICAgICAgICAgICAgICAgZXJyLm1lc3NhZ2UgK1xuICAgICAgICAgICAgICAgIFwiXFxuXCIgK1xuICAgICAgICAgICAgICAgIGVyci5zdGFjayk7XG4gICAgICAgICAgICB1cGRhdGUuY29udGVudF9oYXNoID0gXCI8ZXJyb3I+XCI7XG4gICAgICAgICAgICB0aGlzLmRhdGFSZWNlaXZlci5zYXZlUmVjb3JkKFwiaHR0cF9yZXNwb25zZXNcIiwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBJbnN0cnVtZW50IEhUVFAgcmVzcG9uc2VzXG4gICAgYXN5bmMgb25Db21wbGV0ZWRIYW5kbGVyKGRldGFpbHMsIGNyYXdsSUQsIGV2ZW50T3JkaW5hbCwgc2F2ZUNvbnRlbnQpIHtcbiAgICAgICAgLypcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgXCJvbkNvbXBsZXRlZEhhbmRsZXIgKHByZXZpb3VzbHkgaHR0cFJlcXVlc3RIYW5kbGVyKVwiLFxuICAgICAgICAgIGRldGFpbHMsXG4gICAgICAgICAgY3Jhd2xJRCxcbiAgICAgICAgICBzYXZlQ29udGVudCxcbiAgICAgICAgKTtcbiAgICAgICAgKi9cbiAgICAgICAgY29uc3QgdGFiID0gZGV0YWlscy50YWJJZCA+IC0xXG4gICAgICAgICAgICA/IGF3YWl0IGJyb3dzZXIudGFicy5nZXQoZGV0YWlscy50YWJJZClcbiAgICAgICAgICAgIDogeyB3aW5kb3dJZDogdW5kZWZpbmVkLCBpbmNvZ25pdG86IHVuZGVmaW5lZCB9O1xuICAgICAgICBjb25zdCB1cGRhdGUgPSB7fTtcbiAgICAgICAgdXBkYXRlLmluY29nbml0byA9IGJvb2xUb0ludCh0YWIuaW5jb2duaXRvKTtcbiAgICAgICAgdXBkYXRlLmJyb3dzZXJfaWQgPSBjcmF3bElEO1xuICAgICAgICB1cGRhdGUuZXh0ZW5zaW9uX3Nlc3Npb25fdXVpZCA9IGV4dGVuc2lvblNlc3Npb25VdWlkO1xuICAgICAgICB1cGRhdGUuZXZlbnRfb3JkaW5hbCA9IGV2ZW50T3JkaW5hbDtcbiAgICAgICAgdXBkYXRlLndpbmRvd19pZCA9IHRhYi53aW5kb3dJZDtcbiAgICAgICAgdXBkYXRlLnRhYl9pZCA9IGRldGFpbHMudGFiSWQ7XG4gICAgICAgIHVwZGF0ZS5mcmFtZV9pZCA9IGRldGFpbHMuZnJhbWVJZDtcbiAgICAgICAgLy8gcmVxdWVzdElkIGlzIGEgdW5pcXVlIGlkZW50aWZpZXIgdGhhdCBjYW4gYmUgdXNlZCB0byBsaW5rIHJlcXVlc3RzIGFuZCByZXNwb25zZXNcbiAgICAgICAgdXBkYXRlLnJlcXVlc3RfaWQgPSBkZXRhaWxzLnJlcXVlc3RJZDtcbiAgICAgICAgY29uc3QgaXNDYWNoZWQgPSBkZXRhaWxzLmZyb21DYWNoZTtcbiAgICAgICAgdXBkYXRlLmlzX2NhY2hlZCA9IGJvb2xUb0ludChpc0NhY2hlZCk7XG4gICAgICAgIGNvbnN0IHVybCA9IGRldGFpbHMudXJsO1xuICAgICAgICB1cGRhdGUudXJsID0gZXNjYXBlVXJsKHVybCk7XG4gICAgICAgIGNvbnN0IHJlcXVlc3RNZXRob2QgPSBkZXRhaWxzLm1ldGhvZDtcbiAgICAgICAgdXBkYXRlLm1ldGhvZCA9IGVzY2FwZVN0cmluZyhyZXF1ZXN0TWV0aG9kKTtcbiAgICAgICAgLy8gVE9ETzogUmVmYWN0b3IgdG8gY29ycmVzcG9uZGluZyB3ZWJleHQgbG9naWMgb3IgZGlzY2FyZFxuICAgICAgICAvLyAocmVxdWVzdCBoZWFkZXJzIGFyZSBub3QgYXZhaWxhYmxlIGluIGh0dHAgcmVzcG9uc2UgZXZlbnQgbGlzdGVuZXIgb2JqZWN0LFxuICAgICAgICAvLyBidXQgdGhlIHJlZmVycmVyIHByb3BlcnR5IG9mIHRoZSBjb3JyZXNwb25kaW5nIHJlcXVlc3QgY291bGQgYmUgcXVlcmllZClcbiAgICAgICAgLy9cbiAgICAgICAgLy8gbGV0IHJlZmVycmVyID0gXCJcIjtcbiAgICAgICAgLy8gaWYgKGRldGFpbHMucmVmZXJyZXIpIHtcbiAgICAgICAgLy8gICByZWZlcnJlciA9IGRldGFpbHMucmVmZXJyZXIuc3BlYztcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyB1cGRhdGUucmVmZXJyZXIgPSBlc2NhcGVTdHJpbmcocmVmZXJyZXIpO1xuICAgICAgICBjb25zdCByZXNwb25zZVN0YXR1cyA9IGRldGFpbHMuc3RhdHVzQ29kZTtcbiAgICAgICAgdXBkYXRlLnJlc3BvbnNlX3N0YXR1cyA9IHJlc3BvbnNlU3RhdHVzO1xuICAgICAgICBjb25zdCByZXNwb25zZVN0YXR1c1RleHQgPSBkZXRhaWxzLnN0YXR1c0xpbmU7XG4gICAgICAgIHVwZGF0ZS5yZXNwb25zZV9zdGF0dXNfdGV4dCA9IGVzY2FwZVN0cmluZyhyZXNwb25zZVN0YXR1c1RleHQpO1xuICAgICAgICBjb25zdCBjdXJyZW50X3RpbWUgPSBuZXcgRGF0ZShkZXRhaWxzLnRpbWVTdGFtcCk7XG4gICAgICAgIHVwZGF0ZS50aW1lX3N0YW1wID0gY3VycmVudF90aW1lLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIGNvbnN0IHBhcnNlZEhlYWRlcnMgPSB0aGlzLmpzb25pZnlIZWFkZXJzKGRldGFpbHMucmVzcG9uc2VIZWFkZXJzKTtcbiAgICAgICAgdXBkYXRlLmhlYWRlcnMgPSBwYXJzZWRIZWFkZXJzLmhlYWRlcnM7XG4gICAgICAgIHVwZGF0ZS5sb2NhdGlvbiA9IHBhcnNlZEhlYWRlcnMubG9jYXRpb247XG4gICAgICAgIGlmICh0aGlzLnNob3VsZFNhdmVDb250ZW50KHNhdmVDb250ZW50LCBkZXRhaWxzLnR5cGUpKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ1dpdGhSZXNwb25zZUJvZHkoZGV0YWlscywgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVJlY2VpdmVyLnNhdmVSZWNvcmQoXCJodHRwX3Jlc3BvbnNlc1wiLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGpzb25pZnlIZWFkZXJzKGhlYWRlcnMpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0SGVhZGVycyA9IFtdO1xuICAgICAgICBsZXQgbG9jYXRpb24gPSBcIlwiO1xuICAgICAgICBpZiAoaGVhZGVycykge1xuICAgICAgICAgICAgaGVhZGVycy5tYXAocmVzcG9uc2VIZWFkZXIgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgbmFtZSwgdmFsdWUgfSA9IHJlc3BvbnNlSGVhZGVyO1xuICAgICAgICAgICAgICAgIGNvbnN0IGhlYWRlcl9wYWlyID0gW107XG4gICAgICAgICAgICAgICAgaGVhZGVyX3BhaXIucHVzaChlc2NhcGVTdHJpbmcobmFtZSkpO1xuICAgICAgICAgICAgICAgIGhlYWRlcl9wYWlyLnB1c2goZXNjYXBlU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgICAgICAgICAgcmVzdWx0SGVhZGVycy5wdXNoKGhlYWRlcl9wYWlyKTtcbiAgICAgICAgICAgICAgICBpZiAobmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImxvY2F0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaGVhZGVyczogSlNPTi5zdHJpbmdpZnkocmVzdWx0SGVhZGVycyksXG4gICAgICAgICAgICBsb2NhdGlvbjogZXNjYXBlU3RyaW5nKGxvY2F0aW9uKSxcbiAgICAgICAgfTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lhSFIwY0MxcGJuTjBjblZ0Wlc1MExtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTGk0dkxpNHZMaTR2YzNKakwySmhZMnRuY205MWJtUXZhSFIwY0MxcGJuTjBjblZ0Wlc1MExuUnpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEU5QlFVOHNSVUZCUlN4MVFrRkJkVUlzUlVGQlJTeE5RVUZOTEhkRFFVRjNReXhEUVVGRE8wRkJRMnBHTEU5QlFVOHNSVUZCUlN4dlFrRkJiMElzUlVGQlJTeE5RVUZOTEN0Q1FVRXJRaXhEUVVGRE8wRkJRM0pGTEU5QlFVOHNSVUZCUlN4alFVRmpMRVZCUVhGQ0xFMUJRVTBzZVVKQlFYbENMRU5CUVVNN1FVRkROVVVzVDBGQlR5eEZRVUZGTEdOQlFXTXNSVUZCUlN4TlFVRk5MSGRDUVVGM1FpeERRVUZETzBGQlEzaEVMRTlCUVU4c1JVRkJSU3hsUVVGbExFVkJRVVVzVFVGQlRTeDVRa0ZCZVVJc1EwRkJRenRCUVVzeFJDeFBRVUZQTEVWQlFVVXNVMEZCVXl4RlFVRkZMRmxCUVZrc1JVRkJSU3hUUVVGVExFVkJRVVVzVFVGQlRTeHhRa0ZCY1VJc1EwRkJRenRCUVZkNlJUczdPenM3TzBkQlRVYzdRVUZGU0N4TlFVRk5MRTlCUVU4c1kwRkJZenRKUVdGNlFpeFpRVUZaTEZsQlFWazdVVUZZYUVJc2IwSkJRV1VzUjBGRmJrSXNSVUZCUlN4RFFVRkRPMUZCUTBNc2NVSkJRV2RDTEVkQlJYQkNMRVZCUVVVc1EwRkJRenRSUVU5TUxFbEJRVWtzUTBGQlF5eFpRVUZaTEVkQlFVY3NXVUZCV1N4RFFVRkRPMGxCUTI1RExFTkJRVU03U1VGRlRTeEhRVUZITEVOQlFVTXNUMEZCVHl4RlFVRkZMR2xDUVVGdlF6dFJRVU4wUkN4TlFVRk5MRkZCUVZFc1IwRkJiVUk3V1VGREwwSXNVVUZCVVR0WlFVTlNMRmxCUVZrN1dVRkRXaXhOUVVGTk8xbEJRMDRzVDBGQlR6dFpRVU5RTEZWQlFWVTdXVUZEVml4WlFVRlpPMWxCUTFvc1QwRkJUenRaUVVOUUxGRkJRVkU3V1VGRFVpeHRRa0ZCYlVJN1dVRkRia0lzVFVGQlRUdFpRVU5PTEZGQlFWRTdXVUZEVWl4cFFrRkJhVUk3V1VGRGFrSXNXVUZCV1R0WlFVTmFMRmRCUVZjN1dVRkRXQ3hqUVVGak8xbEJRMlFzVjBGQlZ6dFpRVU5ZTEV0QlFVczdXVUZEVEN4VFFVRlRPMWxCUTFRc1owSkJRV2RDTzFsQlEyaENMRTFCUVUwN1dVRkRUaXhQUVVGUE8xTkJRMUlzUTBGQlF6dFJRVVZHTEUxQlFVMHNUVUZCVFN4SFFVRnJRaXhGUVVGRkxFbEJRVWtzUlVGQlJTeERRVUZETEZsQlFWa3NRMEZCUXl4RlFVRkZMRXRCUVVzc1JVRkJSU3hSUVVGUkxFVkJRVVVzUTBGQlF6dFJRVVY0UlN4TlFVRk5MSGxDUVVGNVFpeEhRVUZITEU5QlFVOHNRMEZCUXl4RlFVRkZPMWxCUXpGRExFOUJRVThzUTBGRFRDeFBRVUZQTEVOQlFVTXNVMEZCVXl4SlFVRkpMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zVDBGQlR5eERRVUZETEd0Q1FVRnJRaXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlEzaEZMRU5CUVVNN1VVRkRTaXhEUVVGRExFTkJRVU03VVVGRlJqczdWMEZGUnp0UlFVVklMRWxCUVVrc1EwRkJReXgxUWtGQmRVSXNSMEZCUnl4RFFVTTNRaXhQUVVFNFF5eEZRVU01UXl4RlFVRkZPMWxCUTBZc1RVRkJUU3dyUWtGQkswSXNSMEZCY1VJc1JVRkJSU3hEUVVGRE8xbEJRemRFTEhGRFFVRnhRenRaUVVOeVF5eEpRVUZKTEhsQ1FVRjVRaXhEUVVGRExFOUJRVThzUTBGQlF5eEZRVUZGTzJkQ1FVTjBReXhQUVVGUExDdENRVUVyUWl4RFFVRkRPMkZCUTNoRE8xbEJRMFFzVFVGQlRTeGpRVUZqTEVkQlFVY3NTVUZCU1N4RFFVRkRMR2xDUVVGcFFpeERRVUZETEU5QlFVOHNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRaUVVOcVJTeGpRVUZqTEVOQlFVTXNhME5CUVd0RExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdXVUZETTBRc1RVRkJUU3hsUVVGbExFZEJRVWNzU1VGQlNTeERRVUZETEd0Q1FVRnJRaXhEUVVGRExFOUJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0WlFVTnVSU3hsUVVGbExFTkJRVU1zYTBOQlFXdERMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03V1VGRE5VUXNTVUZCU1N4SlFVRkpMRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNhVUpCUVdsQ0xFVkJRVVVzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4RlFVRkZPMmRDUVVNelJDeGxRVUZsTEVOQlFVTXNLMEpCUVN0Q0xFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdZVUZETVVRN1dVRkRSQ3hQUVVGUExDdENRVUVyUWl4RFFVRkRPMUZCUTNwRExFTkJRVU1zUTBGQlF6dFJRVU5HTEU5QlFVOHNRMEZCUXl4VlFVRlZMRU5CUVVNc1pVRkJaU3hEUVVGRExGZEJRVmNzUTBGRE5VTXNTVUZCU1N4RFFVRkRMSFZDUVVGMVFpeEZRVU0xUWl4TlFVRk5MRVZCUTA0c1NVRkJTU3hEUVVGRExITkNRVUZ6UWl4RFFVRkRMR2xDUVVGcFFpeERRVUZETzFsQlF6VkRMRU5CUVVNc1EwRkJReXhEUVVGRExHRkJRV0VzUlVGQlJTeFZRVUZWTEVOQlFVTTdXVUZETjBJc1EwRkJReXhEUVVGRExFTkJRVU1zWVVGQllTeERRVUZETEVOQlEzQkNMRU5CUVVNN1VVRkZSaXhKUVVGSkxFTkJRVU1zTWtKQlFUSkNMRWRCUVVjc1QwRkJUeXhEUVVGRExFVkJRVVU3V1VGRE0wTXNjVU5CUVhGRE8xbEJRM0pETEVsQlFVa3NlVUpCUVhsQ0xFTkJRVU1zVDBGQlR5eERRVUZETEVWQlFVVTdaMEpCUTNSRExFOUJRVTg3WVVGRFVqdFpRVU5FTEUxQlFVMHNZMEZCWXl4SFFVRkhMRWxCUVVrc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03V1VGRGFrVXNZMEZCWXl4RFFVRkRMSE5EUVVGelF5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMWxCUXk5RUxFbEJRVWtzUTBGQlF5d3dRa0ZCTUVJc1EwRkROMElzVDBGQlR5eEZRVU5RTEU5QlFVOHNSVUZEVUN4MVFrRkJkVUlzUlVGQlJTeERRVU14UWl4RFFVRkRPMUZCUTBvc1EwRkJReXhEUVVGRE8xRkJRMFlzVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eFhRVUZYTEVOQlEyaEVMRWxCUVVrc1EwRkJReXd5UWtGQk1rSXNSVUZEYUVNc1RVRkJUU3hGUVVOT0xFTkJRVU1zWjBKQlFXZENMRU5CUVVNc1EwRkRia0lzUTBGQlF6dFJRVVZHTEVsQlFVa3NRMEZCUXl4M1FrRkJkMElzUjBGQlJ5eFBRVUZQTEVOQlFVTXNSVUZCUlR0WlFVTjRReXh4UTBGQmNVTTdXVUZEY2tNc1NVRkJTU3g1UWtGQmVVSXNRMEZCUXl4UFFVRlBMRU5CUVVNc1JVRkJSVHRuUWtGRGRFTXNUMEZCVHp0aFFVTlNPMWxCUTBRc1NVRkJTU3hEUVVGRExIVkNRVUYxUWl4RFFVRkRMRTlCUVU4c1JVRkJSU3hQUVVGUExFVkJRVVVzZFVKQlFYVkNMRVZCUVVVc1EwRkJReXhEUVVGRE8xRkJRelZGTEVOQlFVTXNRMEZCUXp0UlFVTkdMRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU1zWjBKQlFXZENMRU5CUVVNc1YwRkJWeXhEUVVNM1F5eEpRVUZKTEVOQlFVTXNkMEpCUVhkQ0xFVkJRemRDTEUxQlFVMHNSVUZEVGl4RFFVRkRMR2xDUVVGcFFpeERRVUZETEVOQlEzQkNMRU5CUVVNN1VVRkZSaXhKUVVGSkxFTkJRVU1zYlVKQlFXMUNMRWRCUVVjc1QwRkJUeXhEUVVGRExFVkJRVVU3V1VGRGJrTXNjVU5CUVhGRE8xbEJRM0pETEVsQlFVa3NlVUpCUVhsQ0xFTkJRVU1zVDBGQlR5eERRVUZETEVWQlFVVTdaMEpCUTNSRExFOUJRVTg3WVVGRFVqdFpRVU5FTEUxQlFVMHNaVUZCWlN4SFFVRkhMRWxCUVVrc1EwRkJReXhyUWtGQmEwSXNRMEZCUXl4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03V1VGRGJrVXNaVUZCWlN4RFFVRkRMRGhDUVVFNFFpeERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMWxCUTNoRUxFbEJRVWtzUTBGQlF5eHJRa0ZCYTBJc1EwRkRja0lzVDBGQlR5eEZRVU5RTEU5QlFVOHNSVUZEVUN4MVFrRkJkVUlzUlVGQlJTeEZRVU42UWl4cFFrRkJhVUlzUTBGRGJFSXNRMEZCUXp0UlFVTktMRU5CUVVNc1EwRkJRenRSUVVOR0xFOUJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTXNWMEZCVnl4RFFVRkRMRmRCUVZjc1EwRkRlRU1zU1VGQlNTeERRVUZETEcxQ1FVRnRRaXhGUVVONFFpeE5RVUZOTEVWQlEwNHNRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eERRVU53UWl4RFFVRkRPMGxCUTBvc1EwRkJRenRKUVVWTkxFOUJRVTg3VVVGRFdpeEpRVUZKTEVsQlFVa3NRMEZCUXl4MVFrRkJkVUlzUlVGQlJUdFpRVU5vUXl4UFFVRlBMRU5CUVVNc1ZVRkJWU3hEUVVGRExHVkJRV1VzUTBGQlF5eGpRVUZqTEVOQlF5OURMRWxCUVVrc1EwRkJReXgxUWtGQmRVSXNRMEZETjBJc1EwRkJRenRUUVVOSU8xRkJRMFFzU1VGQlNTeEpRVUZKTEVOQlFVTXNNa0pCUVRKQ0xFVkJRVVU3V1VGRGNFTXNUMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXh0UWtGQmJVSXNRMEZCUXl4alFVRmpMRU5CUTI1RUxFbEJRVWtzUTBGQlF5d3lRa0ZCTWtJc1EwRkRha01zUTBGQlF6dFRRVU5JTzFGQlEwUXNTVUZCU1N4SlFVRkpMRU5CUVVNc2QwSkJRWGRDTEVWQlFVVTdXVUZEYWtNc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhqUVVGakxFTkJRMmhFTEVsQlFVa3NRMEZCUXl4M1FrRkJkMElzUTBGRE9VSXNRMEZCUXp0VFFVTklPMUZCUTBRc1NVRkJTU3hKUVVGSkxFTkJRVU1zYlVKQlFXMUNMRVZCUVVVN1dVRkROVUlzVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4WFFVRlhMRU5CUVVNc1kwRkJZeXhEUVVGRExFbEJRVWtzUTBGQlF5eHRRa0ZCYlVJc1EwRkJReXhEUVVGRE8xTkJRM3BGTzBsQlEwZ3NRMEZCUXp0SlFVVlBMSE5DUVVGelFpeERRVUZETEdsQ1FVRnZRenRSUVVOcVJTeEpRVUZKTEdsQ1FVRnBRaXhMUVVGTExFbEJRVWtzUlVGQlJUdFpRVU01UWl4UFFVRlBMRWxCUVVrc1EwRkJRenRUUVVOaU8xRkJRMFFzU1VGQlNTeHBRa0ZCYVVJc1MwRkJTeXhMUVVGTExFVkJRVVU3V1VGREwwSXNUMEZCVHl4TFFVRkxMRU5CUVVNN1UwRkRaRHRSUVVORUxFOUJRVThzU1VGQlNTeERRVUZETEhkQ1FVRjNRaXhEUVVGRExHbENRVUZwUWl4RFFVRkRMRU5CUVVNc1RVRkJUU3hIUVVGSExFTkJRVU1zUTBGQlF6dEpRVU55UlN4RFFVRkRPMGxCUlU4c2QwSkJRWGRDTEVOQlFVTXNhVUpCUVhsQ08xRkJRM2hFTEU5QlFVOHNhVUpCUVdsQ0xFTkJRVU1zUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCYlVJc1EwRkJRenRKUVVONFJDeERRVUZETzBsQlJVUTdPenM3T3p0UFFVMUhPMGxCUTBzc2FVSkJRV2xDTEVOQlEzWkNMR2xDUVVGdlF5eEZRVU53UXl4WlFVRXdRanRSUVVVeFFpeEpRVUZKTEdsQ1FVRnBRaXhMUVVGTExFbEJRVWtzUlVGQlJUdFpRVU01UWl4UFFVRlBMRWxCUVVrc1EwRkJRenRUUVVOaU8xRkJRMFFzU1VGQlNTeHBRa0ZCYVVJc1MwRkJTeXhMUVVGTExFVkJRVVU3V1VGREwwSXNUMEZCVHl4TFFVRkxMRU5CUVVNN1UwRkRaRHRSUVVORUxFOUJRVThzU1VGQlNTeERRVUZETEhkQ1FVRjNRaXhEUVVGRExHbENRVUZwUWl4RFFVRkRMRU5CUVVNc1VVRkJVU3hEUVVNNVJDeFpRVUZaTEVOQlEySXNRMEZCUXp0SlFVTktMRU5CUVVNN1NVRkZUeXhwUWtGQmFVSXNRMEZCUXl4VFFVRlRPMUZCUTJwRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNaVUZCWlN4RFFVRkRMRk5CUVZNc1EwRkJReXhGUVVGRk8xbEJRM0JETEVsQlFVa3NRMEZCUXl4bFFVRmxMRU5CUVVNc1UwRkJVeXhEUVVGRExFZEJRVWNzU1VGQlNTeGpRVUZqTEVWQlFVVXNRMEZCUXp0VFFVTjRSRHRSUVVORUxFOUJRVThzU1VGQlNTeERRVUZETEdWQlFXVXNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRKUVVONlF5eERRVUZETzBsQlJVOHNhMEpCUVd0Q0xFTkJRVU1zVTBGQlV6dFJRVU5zUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExHZENRVUZuUWl4RFFVRkRMRk5CUVZNc1EwRkJReXhGUVVGRk8xbEJRM0pETEVsQlFVa3NRMEZCUXl4blFrRkJaMElzUTBGQlF5eFRRVUZUTEVOQlFVTXNSMEZCUnl4SlFVRkpMR1ZCUVdVc1JVRkJSU3hEUVVGRE8xTkJRekZFTzFGQlEwUXNUMEZCVHl4SlFVRkpMRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1NVRkRNVU1zUTBGQlF6dEpRVVZFT3p0UFFVVkhPMGxCUlVzc1MwRkJTeXhEUVVGRExEQkNRVUV3UWl4RFFVTjBReXhQUVVGclJDeEZRVU5zUkN4UFFVRlBMRVZCUTFBc1dVRkJiMEk3VVVGRmNFSTdPenM3T3p0VlFVMUZPMUZCUlVZc1RVRkJUU3hIUVVGSExFZEJRMUFzVDBGQlR5eERRVUZETEV0QlFVc3NSMEZCUnl4RFFVRkRMRU5CUVVNN1dVRkRhRUlzUTBGQlF5eERRVUZETEUxQlFVMHNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zVDBGQlR5eERRVUZETEV0QlFVc3NRMEZCUXp0WlFVTjJReXhEUVVGRExFTkJRVU1zUlVGQlJTeFJRVUZSTEVWQlFVVXNVMEZCVXl4RlFVRkZMRk5CUVZNc1JVRkJSU3hUUVVGVExFVkJRVVVzUjBGQlJ5eEZRVUZGTEZOQlFWTXNSVUZCUlN4RFFVRkRPMUZCUlhCRkxFMUJRVTBzVFVGQlRTeEhRVUZITEVWQlFXbENMRU5CUVVNN1VVRkZha01zVFVGQlRTeERRVUZETEZOQlFWTXNSMEZCUnl4VFFVRlRMRU5CUVVNc1IwRkJSeXhEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzFGQlF6VkRMRTFCUVUwc1EwRkJReXhWUVVGVkxFZEJRVWNzVDBGQlR5eERRVUZETzFGQlF6VkNMRTFCUVUwc1EwRkJReXh6UWtGQmMwSXNSMEZCUnl4dlFrRkJiMElzUTBGQlF6dFJRVU55UkN4TlFVRk5MRU5CUVVNc1lVRkJZU3hIUVVGSExGbEJRVmtzUTBGQlF6dFJRVU53UXl4TlFVRk5MRU5CUVVNc1UwRkJVeXhIUVVGSExFZEJRVWNzUTBGQlF5eFJRVUZSTEVOQlFVTTdVVUZEYUVNc1RVRkJUU3hEUVVGRExFMUJRVTBzUjBGQlJ5eFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRPMUZCUXpsQ0xFMUJRVTBzUTBGQlF5eFJRVUZSTEVkQlFVY3NUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJRenRSUVVWc1F5eHRSa0ZCYlVZN1VVRkRia1lzVFVGQlRTeERRVUZETEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRE8xRkJSWFJETEUxQlFVMHNSMEZCUnl4SFFVRkhMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU03VVVGRGVFSXNUVUZCVFN4RFFVRkRMRWRCUVVjc1IwRkJSeXhUUVVGVExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdVVUZGTlVJc1RVRkJUU3hoUVVGaExFZEJRVWNzVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXp0UlFVTnlReXhOUVVGTkxFTkJRVU1zVFVGQlRTeEhRVUZITEZsQlFWa3NRMEZCUXl4aFFVRmhMRU5CUVVNc1EwRkJRenRSUVVVMVF5eE5RVUZOTEZsQlFWa3NSMEZCUnl4SlFVRkpMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdVVUZEYWtRc1RVRkJUU3hEUVVGRExGVkJRVlVzUjBGQlJ5eFpRVUZaTEVOQlFVTXNWMEZCVnl4RlFVRkZMRU5CUVVNN1VVRkZMME1zU1VGQlNTeFpRVUZaTEVkQlFVY3NSVUZCUlN4RFFVRkRPMUZCUTNSQ0xFbEJRVWtzVVVGQlVTeEhRVUZITEVWQlFVVXNRMEZCUXp0UlFVTnNRaXhOUVVGTkxFOUJRVThzUjBGQlJ5eEZRVUZGTEVOQlFVTTdVVUZEYmtJc1NVRkJTU3hOUVVGTkxFZEJRVWNzUzBGQlN5eERRVUZETzFGQlEyNUNMRWxCUVVrc1QwRkJUeXhEUVVGRExHTkJRV01zUlVGQlJUdFpRVU14UWl4UFFVRlBMRU5CUVVNc1kwRkJZeXhEUVVGRExFZEJRVWNzUTBGQlF5eGhRVUZoTEVOQlFVTXNSVUZCUlR0blFrRkRla01zVFVGQlRTeEZRVUZGTEVsQlFVa3NSVUZCUlN4TFFVRkxMRVZCUVVVc1IwRkJSeXhoUVVGaExFTkJRVU03WjBKQlEzUkRMRTFCUVUwc1YwRkJWeXhIUVVGSExFVkJRVVVzUTBGQlF6dG5Ra0ZEZGtJc1YwRkJWeXhEUVVGRExFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRenRuUWtGRGNrTXNWMEZCVnl4RFFVRkRMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXp0blFrRkRkRU1zVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJRenRuUWtGRE1VSXNTVUZCU1N4SlFVRkpMRXRCUVVzc1kwRkJZeXhGUVVGRk8yOUNRVU16UWl4WlFVRlpMRWRCUVVjc1MwRkJTeXhEUVVGRE8yOUNRVU55UWl4SlFVRkpMRmxCUVZrc1EwRkJReXhQUVVGUExFTkJRVU1zTUVKQlFUQkNMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUlVGQlJUdDNRa0ZETTBRc1RVRkJUU3hIUVVGSExFbEJRVWtzUTBGQlF6dHhRa0ZEWmp0cFFrRkRSanRuUWtGRFJDeEpRVUZKTEVsQlFVa3NTMEZCU3l4VFFVRlRMRVZCUVVVN2IwSkJRM1JDTEZGQlFWRXNSMEZCUnl4TFFVRkxMRU5CUVVNN2FVSkJRMnhDTzFsQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN1UwRkRTanRSUVVWRUxFMUJRVTBzUTBGQlF5eFJRVUZSTEVkQlFVY3NXVUZCV1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8xRkJSWHBETEVsQlFVa3NZVUZCWVN4TFFVRkxMRTFCUVUwc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eHBRMEZCYVVNc1JVRkJSVHRaUVVONlJTeE5RVUZOTEdOQlFXTXNSMEZCUnl4SlFVRkpMRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8xbEJRMnBGTEUxQlFVMHNVVUZCVVN4SFFVRkhMRTFCUVUwc1kwRkJZeXhEUVVGRExIRkNRVUZ4UWl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8xbEJRMnhGTEVsQlFVa3NRMEZCUXl4UlFVRlJMRVZCUVVVN1owSkJRMklzU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4UlFVRlJMRU5CUTNoQ0xIRkhRVUZ4Unl4RFFVTjBSeXhEUVVGRE8yRkJRMGc3YVVKQlFVMDdaMEpCUTB3c1RVRkJUU3d5UWtGQk1rSXNSMEZCUnl4TlFVRk5MR05CUVdNc1EwRkJReXd5UWtGQk1rSXNRMEZCUXp0blFrRkRja1lzVFVGQlRTeFhRVUZYTEVkQlFVY3NNa0pCUVRKQ0xFTkJRVU1zVjBGQlZ5eERRVUZETzJkQ1FVVTFSQ3hKUVVGSkxGZEJRVmNzUlVGQlJUdHZRa0ZEWml4TlFVRk5MRlZCUVZVc1IwRkJSeXhKUVVGSkxHTkJRV003YjBKQlEyNURMRmRCUVZjN2IwSkJRMWdzTWtKQlFUSkNMRVZCUXpOQ0xFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlEyeENMRU5CUVVNN2IwSkJRMFlzVFVGQlRTeFBRVUZQTEVkQlFYTkNMRlZCUVZVN2VVSkJRekZETEdkQ1FVRm5RaXhGUVVWbUxFTkJRVU03YjBKQlJVd3NaMFJCUVdkRU8yOUNRVU5vUkN4SlFVRkpMR05CUVdNc1NVRkJTU3hQUVVGUExFVkJRVVU3ZDBKQlF6ZENMREJHUVVFd1JqdDNRa0ZETVVZc2JVZEJRVzFITzNkQ1FVTnVSeXhOUVVGTkxHTkJRV01zUjBGQlJ6czBRa0ZEY2tJc1kwRkJZenMwUWtGRFpDeHhRa0ZCY1VJN05FSkJRM0pDTEdkQ1FVRm5RanQ1UWtGRGFrSXNRMEZCUXp0M1FrRkRSaXhMUVVGTExFMUJRVTBzU1VGQlNTeEpRVUZKTEU5QlFVOHNRMEZCUXl4WlFVRlpMRVZCUVVVN05FSkJRM1pETEVsQlFVa3NZMEZCWXl4RFFVRkRMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zUlVGQlJUdG5RMEZEYWtNc1RVRkJUU3hYUVVGWExFZEJRVWNzUlVGQlJTeERRVUZETzJkRFFVTjJRaXhYUVVGWExFTkJRVU1zU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRE8yZERRVU55UXl4WFFVRlhMRU5CUVVNc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eFBRVUZQTEVOQlFVTXNXVUZCV1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dG5RMEZETTBRc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUXpzMlFrRkRNMEk3ZVVKQlEwWTdjVUpCUTBZN2IwSkJRMFFzSzBaQlFTdEdPMjlDUVVNdlJpeEpRVUZKTEZkQlFWY3NTVUZCU1N4UFFVRlBMRVZCUVVVN2QwSkJRekZDTEUxQlFVMHNRMEZCUXl4VFFVRlRMRWRCUVVjc1QwRkJUeXhEUVVGRExGTkJRVk1zUTBGQlF6dHhRa0ZEZEVNN2IwSkJRMFFzU1VGQlNTeGxRVUZsTEVsQlFVa3NUMEZCVHl4RlFVRkZPM2RDUVVNNVFpeE5RVUZOTEVOQlFVTXNZVUZCWVN4SFFVRkhMRTlCUVU4c1EwRkJReXhoUVVGaExFTkJRVU03Y1VKQlF6bERPMmxDUVVOR08yRkJRMFk3VTBGRFJqdFJRVVZFTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0UlFVVjZReXhsUVVGbE8xRkJRMllzVFVGQlRTeExRVUZMTEVkQlFVY3NUMEZCVHl4RFFVRkRMRWxCUVVrc1MwRkJTeXhuUWtGQlowSXNRMEZCUXp0UlFVTm9SQ3hOUVVGTkxFTkJRVU1zVFVGQlRTeEhRVUZITEZOQlFWTXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRSUVVWcVF5dzJRMEZCTmtNN1VVRkROME1zU1VGQlNTeG5Ra0ZCWjBJc1EwRkJRenRSUVVOeVFpeEpRVUZKTEdGQlFXRXNRMEZCUXp0UlFVTnNRaXhKUVVGSkxFOUJRVThzUTBGQlF5eFRRVUZUTEVWQlFVVTdXVUZEY2tJc1RVRkJUU3hsUVVGbExFZEJRVWNzU1VGQlNTeEhRVUZITEVOQlFVTXNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8xbEJRMjVFTEdkQ1FVRm5RaXhIUVVGSExHVkJRV1VzUTBGQlF5eE5RVUZOTEVOQlFVTTdVMEZETTBNN1VVRkRSQ3hKUVVGSkxFOUJRVThzUTBGQlF5eFhRVUZYTEVWQlFVVTdXVUZEZGtJc1RVRkJUU3hwUWtGQmFVSXNSMEZCUnl4SlFVRkpMRWRCUVVjc1EwRkJReXhQUVVGUExFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTTdXVUZEZGtRc1lVRkJZU3hIUVVGSExHbENRVUZwUWl4RFFVRkRMRTFCUVUwc1EwRkJRenRUUVVNeFF6dFJRVU5FTEUxQlFVMHNRMEZCUXl4cFFrRkJhVUlzUjBGQlJ5eFpRVUZaTEVOQlFVTXNaMEpCUVdkQ0xFTkJRVU1zUTBGQlF6dFJRVU14UkN4TlFVRk5MRU5CUVVNc1kwRkJZeXhIUVVGSExGbEJRVmtzUTBGQlF5eGhRVUZoTEVOQlFVTXNRMEZCUXp0UlFVVndSQ3g1UWtGQmVVSTdVVUZEZWtJc2VVVkJRWGxGTzFGQlEzcEZMRGhDUVVFNFFqdFJRVU01UWl4TlFVRk5MRmRCUVZjc1IwRkJSeXhQUVVGUExFTkJRVU1zVjBGQlZ5eERRVUZETzFGQlEzaERMRTFCUVUwc1EwRkJReXhaUVVGWkxFZEJRVWNzV1VGQldTeERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRPMUZCUldoRUxHdEZRVUZyUlR0UlFVTnNSU3hwUmtGQmFVWTdVVUZEYWtZc2FVSkJRV2xDTzFGQlEycENMSEZIUVVGeFJ6dFJRVU55Unl4TlFVRk5MRU5CUVVNc1lVRkJZU3hIUVVGSExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTTdVVUZGY0VNN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenRWUVRCRFJUdFJRVU5HTEUxQlFVMHNRMEZCUXl4aFFVRmhMRWRCUVVjc1UwRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5eDNRa0ZCZDBJc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF5eERRVUZETzFGQlEzcEZMRTFCUVUwc1EwRkJReXhsUVVGbExFZEJRVWNzVDBGQlR5eERRVUZETEdGQlFXRXNRMEZCUXp0UlFVTXZReXhOUVVGTkxFTkJRVU1zWlVGQlpTeEhRVUZITEZsQlFWa3NRMEZEYmtNc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eFBRVUZQTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUTNaRExFTkJRVU03VVVGRFJpeEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRlZCUVZVc1EwRkJReXhsUVVGbExFVkJRVVVzVFVGQlRTeERRVUZETEVOQlFVTTdTVUZEZUVRc1EwRkJRenRKUVVWRU96czdPenM3T3pzN096czdUMEZaUnp0SlFVTkxMSGRDUVVGM1FpeERRVU01UWl4UFFVRnJSRHRSUVVWc1JDeEpRVUZKTEVkQlFVY3NSMEZCUnl4RlFVRkZMRU5CUVVNN1VVRkZZaXhKUVVGSkxFOUJRVThzUTBGQlF5eEpRVUZKTEV0QlFVc3NXVUZCV1N4RlFVRkZPMWxCUTJwRExIZERRVUYzUXp0WlFVTjRReXhIUVVGSExFZEJRVWNzVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXp0VFFVTnVRanRoUVVGTkxFbEJRVWtzVDBGQlR5eERRVUZETEdOQlFXTXNRMEZCUXl4blFrRkJaMElzUTBGQlF5eEZRVUZGTzFsQlEyNUVMR2xGUVVGcFJUdFpRVU5xUlN4elJVRkJjMFU3V1VGRGRFVXNSMEZCUnl4SFFVRkhMRTlCUVU4c1EwRkJReXhqUVVGakxFTkJRVU1zVFVGQlRUdG5Ra0ZEYWtNc1EwRkJReXhEUVVGRExFOUJRVThzUTBGQlF5eGpRVUZqTEVOQlFVTXNUMEZCVHl4RFFVRkRMR05CUVdNc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNSMEZCUnp0blFrRkRMMFFzUTBGQlF5eERRVUZETEU5QlFVOHNRMEZCUXl4WFFVRlhMRU5CUVVNN1UwRkRla0k3WVVGQlRUdFpRVU5NTEhWRVFVRjFSRHRaUVVOMlJDeDNSa0ZCZDBZN1dVRkRlRVlzUjBGQlJ5eEhRVUZITEU5QlFVOHNRMEZCUXl4WFFVRlhMRU5CUVVNN1UwRkRNMEk3VVVGRFJDeFBRVUZQTEVkQlFVY3NRMEZCUXp0SlFVTmlMRU5CUVVNN1NVRkZUeXhMUVVGTExFTkJRVU1zZFVKQlFYVkNMRU5CUTI1RExFOUJRU3RETEVWQlF5OURMRTlCUVU4c1JVRkRVQ3haUVVGdlFqdFJRVVZ3UWpzN096czdPMVZCVFVVN1VVRkZSaXcwUWtGQk5FSTdVVUZETlVJc2FVUkJRV2xFTzFGQlJXcEVPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3p0VlFUSkVSVHRSUVVWR0xFMUJRVTBzWTBGQll5eEhRVUZITEU5QlFVOHNRMEZCUXl4VlFVRlZMRU5CUVVNN1VVRkRNVU1zVFVGQlRTeHJRa0ZCYTBJc1IwRkJSeXhQUVVGUExFTkJRVU1zVlVGQlZTeERRVUZETzFGQlJUbERMRTFCUVUwc1IwRkJSeXhIUVVOUUxFOUJRVThzUTBGQlF5eExRVUZMTEVkQlFVY3NRMEZCUXl4RFFVRkRPMWxCUTJoQ0xFTkJRVU1zUTBGQlF5eE5RVUZOTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTTdXVUZEZGtNc1EwRkJReXhEUVVGRExFVkJRVVVzVVVGQlVTeEZRVUZGTEZOQlFWTXNSVUZCUlN4VFFVRlRMRVZCUVVVc1UwRkJVeXhGUVVGRkxFTkJRVU03VVVGRGNFUXNUVUZCVFN4WlFVRlpMRWRCUVdsQ08xbEJRMnBETEZOQlFWTXNSVUZCUlN4VFFVRlRMRU5CUVVNc1IwRkJSeXhEUVVGRExGTkJRVk1zUTBGQlF6dFpRVU51UXl4VlFVRlZMRVZCUVVVc1QwRkJUenRaUVVOdVFpeGxRVUZsTEVWQlFVVXNVMEZCVXl4RFFVRkRMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU03V1VGRGRrTXNZMEZCWXl4RlFVRkZMRTlCUVU4c1EwRkJReXhUUVVGVE8xbEJRMnBETEdWQlFXVXNSVUZCUlN4VFFVRlRMRU5CUVVNc1QwRkJUeXhEUVVGRExGZEJRVmNzUTBGQlF6dFpRVU12UXl4alFVRmpMRVZCUVVVc1NVRkJTVHRaUVVOd1FpeHpRa0ZCYzBJc1JVRkJSU3h2UWtGQmIwSTdXVUZETlVNc1lVRkJZU3hGUVVGRkxGbEJRVms3V1VGRE0wSXNVMEZCVXl4RlFVRkZMRWRCUVVjc1EwRkJReXhSUVVGUk8xbEJRM1pDTEUxQlFVMHNSVUZCUlN4UFFVRlBMRU5CUVVNc1MwRkJTenRaUVVOeVFpeFJRVUZSTEVWQlFVVXNUMEZCVHl4RFFVRkRMRTlCUVU4N1dVRkRla0lzWlVGQlpTeEZRVUZGTEdOQlFXTTdXVUZETDBJc2IwSkJRVzlDTEVWQlFVVXNXVUZCV1N4RFFVRkRMR3RDUVVGclFpeERRVUZETzFsQlEzUkVMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zWTBGQll5eERRVUZETEU5QlFVOHNRMEZCUXl4bFFVRmxMRU5CUVVNc1EwRkJReXhQUVVGUE8xbEJRemRFTEZWQlFWVXNSVUZCUlN4SlFVRkpMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTXNWMEZCVnl4RlFVRkZPMU5CUTNSRUxFTkJRVU03VVVGRlJpeEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRlZCUVZVc1EwRkJReXhuUWtGQlowSXNSVUZCUlN4WlFVRlpMRU5CUVVNc1EwRkJRenRKUVVNdlJDeERRVUZETzBsQlJVUTdPMDlCUlVjN1NVRkZTeXhMUVVGTExFTkJRVU1zYlVKQlFXMUNMRU5CUXk5Q0xFOUJRVGhETEVWQlF6bERMRTFCUVc5Q08xRkJSWEJDTEUxQlFVMHNaVUZCWlN4SFFVRkhMRWxCUVVrc1EwRkJReXhyUWtGQmEwSXNRMEZCUXl4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03VVVGRGJrVXNTVUZCU1R0WlFVTkdMRTFCUVUwc2IwSkJRVzlDTEVkQlFVY3NaVUZCWlN4RFFVRkRMRzlDUVVGdlFpeERRVUZETzFsQlEyeEZMRTFCUVUwc1VVRkJVU3hIUVVGSExFMUJRVTBzYjBKQlFXOUNMRU5CUVVNc1pVRkJaU3hGUVVGRkxFTkJRVU03V1VGRE9VUXNUVUZCVFN4WFFVRlhMRWRCUVVjc1RVRkJUU3h2UWtGQmIwSXNRMEZCUXl4alFVRmpMRVZCUVVVc1EwRkJRenRaUVVOb1JTeEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRmRCUVZjc1EwRkJReXhSUVVGUkxFVkJRVVVzV1VGQldTeERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRMRU5CUVVNN1dVRkRia1VzVFVGQlRTeERRVUZETEZsQlFWa3NSMEZCUnl4WFFVRlhMRU5CUVVNN1dVRkRiRU1zU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4VlFVRlZMRU5CUVVNc1owSkJRV2RDTEVWQlFVVXNUVUZCVFN4RFFVRkRMRU5CUVVNN1UwRkRlRVE3VVVGQlF5eFBRVUZQTEVkQlFVY3NSVUZCUlR0WlFVTmFPenM3T3pzN08yTkJUMFU3V1VGRFJpeEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRkZCUVZFc1EwRkRlRUlzYlVOQlFXMURPMmRDUVVOcVF5eHpSRUZCYzBRN1owSkJRM1JFTEVkQlFVY3NRMEZCUXl4SlFVRkpPMmRDUVVOU0xFZEJRVWNzUTBGQlF5eFBRVUZQTzJkQ1FVTllMRWxCUVVrN1owSkJRMG9zUjBGQlJ5eERRVUZETEV0QlFVc3NRMEZEV2l4RFFVRkRPMWxCUTBZc1RVRkJUU3hEUVVGRExGbEJRVmtzUjBGQlJ5eFRRVUZUTEVOQlFVTTdXVUZEYUVNc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eFZRVUZWTEVOQlFVTXNaMEpCUVdkQ0xFVkJRVVVzVFVGQlRTeERRVUZETEVOQlFVTTdVMEZEZUVRN1NVRkRTQ3hEUVVGRE8wbEJSVVFzTkVKQlFUUkNPMGxCUTNCQ0xFdEJRVXNzUTBGQlF5eHJRa0ZCYTBJc1EwRkRPVUlzVDBGQk1FTXNSVUZETVVNc1QwRkJUeXhGUVVOUUxGbEJRVmtzUlVGRFdpeFhRVUZYTzFGQlJWZzdPenM3T3pzN1ZVRlBSVHRSUVVWR0xFMUJRVTBzUjBGQlJ5eEhRVU5RTEU5QlFVOHNRMEZCUXl4TFFVRkxMRWRCUVVjc1EwRkJReXhEUVVGRE8xbEJRMmhDTEVOQlFVTXNRMEZCUXl4TlFVRk5MRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEU5QlFVOHNRMEZCUXl4TFFVRkxMRU5CUVVNN1dVRkRka01zUTBGQlF5eERRVUZETEVWQlFVVXNVVUZCVVN4RlFVRkZMRk5CUVZNc1JVRkJSU3hUUVVGVExFVkJRVVVzVTBGQlV5eEZRVUZGTEVOQlFVTTdVVUZGY0VRc1RVRkJUU3hOUVVGTkxFZEJRVWNzUlVGQmEwSXNRMEZCUXp0UlFVVnNReXhOUVVGTkxFTkJRVU1zVTBGQlV5eEhRVUZITEZOQlFWTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03VVVGRE5VTXNUVUZCVFN4RFFVRkRMRlZCUVZVc1IwRkJSeXhQUVVGUExFTkJRVU03VVVGRE5VSXNUVUZCVFN4RFFVRkRMSE5DUVVGelFpeEhRVUZITEc5Q1FVRnZRaXhEUVVGRE8xRkJRM0pFTEUxQlFVMHNRMEZCUXl4aFFVRmhMRWRCUVVjc1dVRkJXU3hEUVVGRE8xRkJRM0JETEUxQlFVMHNRMEZCUXl4VFFVRlRMRWRCUVVjc1IwRkJSeXhEUVVGRExGRkJRVkVzUTBGQlF6dFJRVU5vUXl4TlFVRk5MRU5CUVVNc1RVRkJUU3hIUVVGSExFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTTdVVUZET1VJc1RVRkJUU3hEUVVGRExGRkJRVkVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRPMUZCUld4RExHMUdRVUZ0Ump0UlFVTnVSaXhOUVVGTkxFTkJRVU1zVlVGQlZTeEhRVUZITEU5QlFVOHNRMEZCUXl4VFFVRlRMRU5CUVVNN1VVRkZkRU1zVFVGQlRTeFJRVUZSTEVkQlFVY3NUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJRenRSUVVOdVF5eE5RVUZOTEVOQlFVTXNVMEZCVXl4SFFVRkhMRk5CUVZNc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dFJRVVYyUXl4TlFVRk5MRWRCUVVjc1IwRkJSeXhQUVVGUExFTkJRVU1zUjBGQlJ5eERRVUZETzFGQlEzaENMRTFCUVUwc1EwRkJReXhIUVVGSExFZEJRVWNzVTBGQlV5eERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPMUZCUlRWQ0xFMUJRVTBzWVVGQllTeEhRVUZITEU5QlFVOHNRMEZCUXl4TlFVRk5MRU5CUVVNN1VVRkRja01zVFVGQlRTeERRVUZETEUxQlFVMHNSMEZCUnl4WlFVRlpMRU5CUVVNc1lVRkJZU3hEUVVGRExFTkJRVU03VVVGRk5VTXNNRVJCUVRCRU8xRkJRekZFTERaRlFVRTJSVHRSUVVNM1JTd3lSVUZCTWtVN1VVRkRNMFVzUlVGQlJUdFJRVU5HTEhGQ1FVRnhRanRSUVVOeVFpd3dRa0ZCTUVJN1VVRkRNVUlzYzBOQlFYTkRPMUZCUTNSRExFbEJRVWs3VVVGRFNpdzBRMEZCTkVNN1VVRkZOVU1zVFVGQlRTeGpRVUZqTEVkQlFVY3NUMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJRenRSUVVNeFF5eE5RVUZOTEVOQlFVTXNaVUZCWlN4SFFVRkhMR05CUVdNc1EwRkJRenRSUVVWNFF5eE5RVUZOTEd0Q1FVRnJRaXhIUVVGSExFOUJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTTdVVUZET1VNc1RVRkJUU3hEUVVGRExHOUNRVUZ2UWl4SFFVRkhMRmxCUVZrc1EwRkJReXhyUWtGQmEwSXNRMEZCUXl4RFFVRkRPMUZCUlM5RUxFMUJRVTBzV1VGQldTeEhRVUZITEVsQlFVa3NTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dFJRVU5xUkN4TlFVRk5MRU5CUVVNc1ZVRkJWU3hIUVVGSExGbEJRVmtzUTBGQlF5eFhRVUZYTEVWQlFVVXNRMEZCUXp0UlFVVXZReXhOUVVGTkxHRkJRV0VzUjBGQlJ5eEpRVUZKTEVOQlFVTXNZMEZCWXl4RFFVRkRMRTlCUVU4c1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF6dFJRVU51UlN4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExHRkJRV0VzUTBGQlF5eFBRVUZQTEVOQlFVTTdVVUZEZGtNc1RVRkJUU3hEUVVGRExGRkJRVkVzUjBGQlJ5eGhRVUZoTEVOQlFVTXNVVUZCVVN4RFFVRkRPMUZCUlhwRExFbEJRVWtzU1VGQlNTeERRVUZETEdsQ1FVRnBRaXhEUVVGRExGZEJRVmNzUlVGQlJTeFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRVZCUVVVN1dVRkRja1FzU1VGQlNTeERRVUZETEcxQ1FVRnRRaXhEUVVGRExFOUJRVThzUlVGQlJTeE5RVUZOTEVOQlFVTXNRMEZCUXp0VFFVTXpRenRoUVVGTk8xbEJRMHdzU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4VlFVRlZMRU5CUVVNc1owSkJRV2RDTEVWQlFVVXNUVUZCVFN4RFFVRkRMRU5CUVVNN1UwRkRlRVE3U1VGRFNDeERRVUZETzBsQlJVOHNZMEZCWXl4RFFVRkRMRTlCUVc5Q08xRkJRM3BETEUxQlFVMHNZVUZCWVN4SFFVRkhMRVZCUVVVc1EwRkJRenRSUVVONlFpeEpRVUZKTEZGQlFWRXNSMEZCUnl4RlFVRkZMRU5CUVVNN1VVRkRiRUlzU1VGQlNTeFBRVUZQTEVWQlFVVTdXVUZEV0N4UFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExHTkJRV01zUTBGQlF5eEZRVUZGTzJkQ1FVTXpRaXhOUVVGTkxFVkJRVVVzU1VGQlNTeEZRVUZGTEV0QlFVc3NSVUZCUlN4SFFVRkhMR05CUVdNc1EwRkJRenRuUWtGRGRrTXNUVUZCVFN4WFFVRlhMRWRCUVVjc1JVRkJSU3hEUVVGRE8yZENRVU4yUWl4WFFVRlhMRU5CUVVNc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RFFVRkRPMmRDUVVOeVF5eFhRVUZYTEVOQlFVTXNTVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETzJkQ1FVTjBReXhoUVVGaExFTkJRVU1zU1VGQlNTeERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRPMmRDUVVOb1F5eEpRVUZKTEVsQlFVa3NRMEZCUXl4WFFVRlhMRVZCUVVVc1MwRkJTeXhWUVVGVkxFVkJRVVU3YjBKQlEzSkRMRkZCUVZFc1IwRkJSeXhMUVVGTExFTkJRVU03YVVKQlEyeENPMWxCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03VTBGRFNqdFJRVU5FTEU5QlFVODdXVUZEVEN4UFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eGhRVUZoTEVOQlFVTTdXVUZEZEVNc1VVRkJVU3hGUVVGRkxGbEJRVmtzUTBGQlF5eFJRVUZSTEVOQlFVTTdVMEZEYWtNc1EwRkJRenRKUVVOS0xFTkJRVU03UTBGRFJpSjkiLCJpbXBvcnQgeyBpbmNyZW1lbnRlZEV2ZW50T3JkaW5hbCB9IGZyb20gXCIuLi9saWIvZXh0ZW5zaW9uLXNlc3Npb24tZXZlbnQtb3JkaW5hbFwiO1xuaW1wb3J0IHsgZXh0ZW5zaW9uU2Vzc2lvblV1aWQgfSBmcm9tIFwiLi4vbGliL2V4dGVuc2lvbi1zZXNzaW9uLXV1aWRcIjtcbmltcG9ydCB7IGJvb2xUb0ludCwgZXNjYXBlU3RyaW5nLCBlc2NhcGVVcmwgfSBmcm9tIFwiLi4vbGliL3N0cmluZy11dGlsc1wiO1xuZXhwb3J0IGNsYXNzIEphdmFzY3JpcHRJbnN0cnVtZW50IHtcbiAgICBjb25zdHJ1Y3RvcihkYXRhUmVjZWl2ZXIpIHtcbiAgICAgICAgdGhpcy5jb25maWd1cmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGVuZGluZ1JlY29yZHMgPSBbXTtcbiAgICAgICAgdGhpcy5kYXRhUmVjZWl2ZXIgPSBkYXRhUmVjZWl2ZXI7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIHJlY2VpdmVkIGNhbGwgYW5kIHZhbHVlcyBkYXRhIGZyb20gdGhlIEpTIEluc3RydW1lbnRhdGlvblxuICAgICAqIGludG8gdGhlIGZvcm1hdCB0aGF0IHRoZSBzY2hlbWEgZXhwZWN0cy5cbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEBwYXJhbSBzZW5kZXJcbiAgICAgKi9cbiAgICBzdGF0aWMgcHJvY2Vzc0NhbGxzQW5kVmFsdWVzKGRhdGEsIHNlbmRlcikge1xuICAgICAgICBjb25zdCB1cGRhdGUgPSB7fTtcbiAgICAgICAgdXBkYXRlLmV4dGVuc2lvbl9zZXNzaW9uX3V1aWQgPSBleHRlbnNpb25TZXNzaW9uVXVpZDtcbiAgICAgICAgdXBkYXRlLmV2ZW50X29yZGluYWwgPSBpbmNyZW1lbnRlZEV2ZW50T3JkaW5hbCgpO1xuICAgICAgICB1cGRhdGUucGFnZV9zY29wZWRfZXZlbnRfb3JkaW5hbCA9IGRhdGEub3JkaW5hbDtcbiAgICAgICAgdXBkYXRlLndpbmRvd19pZCA9IHNlbmRlci50YWIud2luZG93SWQ7XG4gICAgICAgIHVwZGF0ZS50YWJfaWQgPSBzZW5kZXIudGFiLmlkO1xuICAgICAgICB1cGRhdGUuZnJhbWVfaWQgPSBzZW5kZXIuZnJhbWVJZDtcbiAgICAgICAgdXBkYXRlLnNjcmlwdF91cmwgPSBlc2NhcGVVcmwoZGF0YS5zY3JpcHRVcmwpO1xuICAgICAgICB1cGRhdGUuc2NyaXB0X2xpbmUgPSBlc2NhcGVTdHJpbmcoZGF0YS5zY3JpcHRMaW5lKTtcbiAgICAgICAgdXBkYXRlLnNjcmlwdF9jb2wgPSBlc2NhcGVTdHJpbmcoZGF0YS5zY3JpcHRDb2wpO1xuICAgICAgICB1cGRhdGUuZnVuY19uYW1lID0gZXNjYXBlU3RyaW5nKGRhdGEuZnVuY05hbWUpO1xuICAgICAgICB1cGRhdGUuc2NyaXB0X2xvY19ldmFsID0gZXNjYXBlU3RyaW5nKGRhdGEuc2NyaXB0TG9jRXZhbCk7XG4gICAgICAgIHVwZGF0ZS5jYWxsX3N0YWNrID0gZXNjYXBlU3RyaW5nKGRhdGEuY2FsbFN0YWNrKTtcbiAgICAgICAgdXBkYXRlLnN5bWJvbCA9IGVzY2FwZVN0cmluZyhkYXRhLnN5bWJvbCk7XG4gICAgICAgIHVwZGF0ZS5vcGVyYXRpb24gPSBlc2NhcGVTdHJpbmcoZGF0YS5vcGVyYXRpb24pO1xuICAgICAgICB1cGRhdGUudmFsdWUgPSBlc2NhcGVTdHJpbmcoZGF0YS52YWx1ZSk7XG4gICAgICAgIHVwZGF0ZS50aW1lX3N0YW1wID0gZGF0YS50aW1lU3RhbXA7XG4gICAgICAgIHVwZGF0ZS5pbmNvZ25pdG8gPSBib29sVG9JbnQoc2VuZGVyLnRhYi5pbmNvZ25pdG8pO1xuICAgICAgICAvLyBkb2N1bWVudF91cmwgaXMgdGhlIGN1cnJlbnQgZnJhbWUncyBkb2N1bWVudCBocmVmXG4gICAgICAgIC8vIHRvcF9sZXZlbF91cmwgaXMgdGhlIHRvcC1sZXZlbCBmcmFtZSdzIGRvY3VtZW50IGhyZWZcbiAgICAgICAgdXBkYXRlLmRvY3VtZW50X3VybCA9IGVzY2FwZVVybChzZW5kZXIudXJsKTtcbiAgICAgICAgdXBkYXRlLnRvcF9sZXZlbF91cmwgPSBlc2NhcGVVcmwoc2VuZGVyLnRhYi51cmwpO1xuICAgICAgICBpZiAoZGF0YS5vcGVyYXRpb24gPT09IFwiY2FsbFwiICYmIGRhdGEuYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB1cGRhdGUuYXJndW1lbnRzID0gZXNjYXBlU3RyaW5nKEpTT04uc3RyaW5naWZ5KGRhdGEuYXJncykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN0YXJ0IGxpc3RlbmluZyBmb3IgbWVzc2FnZXMgZnJvbSBwYWdlL2NvbnRlbnQvYmFja2dyb3VuZCBzY3JpcHRzIGluamVjdGVkIHRvIGluc3RydW1lbnQgSmF2YVNjcmlwdCBBUElzXG4gICAgICovXG4gICAgbGlzdGVuKCkge1xuICAgICAgICB0aGlzLm9uTWVzc2FnZUxpc3RlbmVyID0gKG1lc3NhZ2UsIHNlbmRlcikgPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5kZWJ1ZyhcImphdmFzY3JpcHQtaW5zdHJ1bWVudGF0aW9uIGJhY2tncm91bmQgbGlzdGVuZXJcIiwge21lc3NhZ2UsIHNlbmRlcn0sIHRoaXMuY29uZmlndXJlZCk7XG4gICAgICAgICAgICBpZiAobWVzc2FnZS5uYW1lc3BhY2UgJiZcbiAgICAgICAgICAgICAgICBtZXNzYWdlLm5hbWVzcGFjZSA9PT0gXCJqYXZhc2NyaXB0LWluc3RydW1lbnRhdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVKc0luc3RydW1lbnRhdGlvbk1lc3NhZ2UobWVzc2FnZSwgc2VuZGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcih0aGlzLm9uTWVzc2FnZUxpc3RlbmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRWl0aGVyIHNlbmRzIHRoZSBsb2cgZGF0YSB0byB0aGUgZGF0YVJlY2VpdmVyIG9yIHN0b3JlIGl0IGluIG1lbW9yeVxuICAgICAqIGFzIGEgcGVuZGluZyByZWNvcmQgaWYgdGhlIEpTIGluc3RydW1lbnRhdGlvbiBpcyBub3QgeWV0IGNvbmZpZ3VyZWRcbiAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAqIEBwYXJhbSBzZW5kZXJcbiAgICAgKi9cbiAgICBoYW5kbGVKc0luc3RydW1lbnRhdGlvbk1lc3NhZ2UobWVzc2FnZSwgc2VuZGVyKSB7XG4gICAgICAgIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFwibG9nQ2FsbFwiOlxuICAgICAgICAgICAgY2FzZSBcImxvZ1ZhbHVlXCI6XG4gICAgICAgICAgICAgICAgY29uc3QgdXBkYXRlID0gSmF2YXNjcmlwdEluc3RydW1lbnQucHJvY2Vzc0NhbGxzQW5kVmFsdWVzKG1lc3NhZ2UuZGF0YSwgc2VuZGVyKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25maWd1cmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZS5icm93c2VyX2lkID0gdGhpcy5jcmF3bElEO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFSZWNlaXZlci5zYXZlUmVjb3JkKFwiamF2YXNjcmlwdFwiLCB1cGRhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wZW5kaW5nUmVjb3Jkcy5wdXNoKHVwZGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN0YXJ0cyBsaXN0ZW5pbmcgaWYgaGF2ZW4ndCBkb25lIHNvIGFscmVhZHksIHNldHMgdGhlIGNyYXdsIElELFxuICAgICAqIG1hcmtzIHRoZSBKUyBpbnN0cnVtZW50YXRpb24gYXMgY29uZmlndXJlZCBhbmQgc2VuZHMgYW55IHBlbmRpbmdcbiAgICAgKiByZWNvcmRzIHRoYXQgaGF2ZSBiZWVuIHJlY2VpdmVkIHVwIHVudGlsIHRoaXMgcG9pbnQuXG4gICAgICogQHBhcmFtIGNyYXdsSURcbiAgICAgKi9cbiAgICBydW4oY3Jhd2xJRCkge1xuICAgICAgICBpZiAoIXRoaXMub25NZXNzYWdlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jcmF3bElEID0gY3Jhd2xJRDtcbiAgICAgICAgdGhpcy5jb25maWd1cmVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5wZW5kaW5nUmVjb3Jkcy5tYXAodXBkYXRlID0+IHtcbiAgICAgICAgICAgIHVwZGF0ZS5icm93c2VyX2lkID0gdGhpcy5jcmF3bElEO1xuICAgICAgICAgICAgdGhpcy5kYXRhUmVjZWl2ZXIuc2F2ZVJlY29yZChcImphdmFzY3JpcHRcIiwgdXBkYXRlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGFzeW5jIHJlZ2lzdGVyQ29udGVudFNjcmlwdCh0ZXN0aW5nLCBqc0luc3RydW1lbnRhdGlvblNldHRpbmdzU3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRTY3JpcHRDb25maWcgPSB7XG4gICAgICAgICAgICB0ZXN0aW5nLFxuICAgICAgICAgICAganNJbnN0cnVtZW50YXRpb25TZXR0aW5nc1N0cmluZyxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGNvbnRlbnRTY3JpcHRDb25maWcpIHtcbiAgICAgICAgICAgIC8vIFRPRE86IEF2b2lkIHVzaW5nIHdpbmRvdyB0byBwYXNzIHRoZSBjb250ZW50IHNjcmlwdCBjb25maWdcbiAgICAgICAgICAgIGF3YWl0IGJyb3dzZXIuY29udGVudFNjcmlwdHMucmVnaXN0ZXIoe1xuICAgICAgICAgICAgICAgIGpzOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IGB3aW5kb3cub3BlbldwbUNvbnRlbnRTY3JpcHRDb25maWcgPSAke0pTT04uc3RyaW5naWZ5KGNvbnRlbnRTY3JpcHRDb25maWcpfTtgLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgbWF0Y2hlczogW1wiPGFsbF91cmxzPlwiXSxcbiAgICAgICAgICAgICAgICBhbGxGcmFtZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgcnVuQXQ6IFwiZG9jdW1lbnRfc3RhcnRcIixcbiAgICAgICAgICAgICAgICBtYXRjaEFib3V0Qmxhbms6IHRydWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYnJvd3Nlci5jb250ZW50U2NyaXB0cy5yZWdpc3Rlcih7XG4gICAgICAgICAgICBqczogW3sgZmlsZTogXCIvY29udGVudC5qc1wiIH1dLFxuICAgICAgICAgICAgbWF0Y2hlczogW1wiPGFsbF91cmxzPlwiXSxcbiAgICAgICAgICAgIGFsbEZyYW1lczogdHJ1ZSxcbiAgICAgICAgICAgIHJ1bkF0OiBcImRvY3VtZW50X3N0YXJ0XCIsXG4gICAgICAgICAgICBtYXRjaEFib3V0Qmxhbms6IHRydWUsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjbGVhbnVwKCkge1xuICAgICAgICB0aGlzLnBlbmRpbmdSZWNvcmRzID0gW107XG4gICAgICAgIGlmICh0aGlzLm9uTWVzc2FnZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICBicm93c2VyLnJ1bnRpbWUub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKHRoaXMub25NZXNzYWdlTGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pYW1GMllYTmpjbWx3ZEMxcGJuTjBjblZ0Wlc1MExtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTGk0dkxpNHZMaTR2YzNKakwySmhZMnRuY205MWJtUXZhbUYyWVhOamNtbHdkQzFwYm5OMGNuVnRaVzUwTG5SeklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVTkJMRTlCUVU4c1JVRkJSU3gxUWtGQmRVSXNSVUZCUlN4TlFVRk5MSGREUVVGM1F5eERRVUZETzBGQlEycEdMRTlCUVU4c1JVRkJSU3h2UWtGQmIwSXNSVUZCUlN4TlFVRk5MQ3RDUVVFclFpeERRVUZETzBGQlEzSkZMRTlCUVU4c1JVRkJSU3hUUVVGVExFVkJRVVVzV1VGQldTeEZRVUZGTEZOQlFWTXNSVUZCUlN4TlFVRk5MSEZDUVVGeFFpeERRVUZETzBGQlIzcEZMRTFCUVUwc1QwRkJUeXh2UWtGQmIwSTdTVUUwUXk5Q0xGbEJRVmtzV1VGQldUdFJRVXBvUWl4bFFVRlZMRWRCUVZrc1MwRkJTeXhEUVVGRE8xRkJRelZDTEcxQ1FVRmpMRWRCUVRCQ0xFVkJRVVVzUTBGQlF6dFJRVWxxUkN4SlFVRkpMRU5CUVVNc1dVRkJXU3hIUVVGSExGbEJRVmtzUTBGQlF6dEpRVU51UXl4RFFVRkRPMGxCTjBORU96czdPenRQUVV0SE8wbEJRMHNzVFVGQlRTeERRVUZETEhGQ1FVRnhRaXhEUVVGRExFbEJRVWtzUlVGQlJTeE5RVUZ4UWp0UlFVTTVSQ3hOUVVGTkxFMUJRVTBzUjBGQlJ5eEZRVUY1UWl4RFFVRkRPMUZCUTNwRExFMUJRVTBzUTBGQlF5eHpRa0ZCYzBJc1IwRkJSeXh2UWtGQmIwSXNRMEZCUXp0UlFVTnlSQ3hOUVVGTkxFTkJRVU1zWVVGQllTeEhRVUZITEhWQ1FVRjFRaXhGUVVGRkxFTkJRVU03VVVGRGFrUXNUVUZCVFN4RFFVRkRMSGxDUVVGNVFpeEhRVUZITEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNN1VVRkRhRVFzVFVGQlRTeERRVUZETEZOQlFWTXNSMEZCUnl4TlFVRk5MRU5CUVVNc1IwRkJSeXhEUVVGRExGRkJRVkVzUTBGQlF6dFJRVU4yUXl4TlFVRk5MRU5CUVVNc1RVRkJUU3hIUVVGSExFMUJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlN4RFFVRkRPMUZCUXpsQ0xFMUJRVTBzUTBGQlF5eFJRVUZSTEVkQlFVY3NUVUZCVFN4RFFVRkRMRTlCUVU4c1EwRkJRenRSUVVOcVF5eE5RVUZOTEVOQlFVTXNWVUZCVlN4SFFVRkhMRk5CUVZNc1EwRkJReXhKUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdVVUZET1VNc1RVRkJUU3hEUVVGRExGZEJRVmNzUjBGQlJ5eFpRVUZaTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRE8xRkJRMjVFTEUxQlFVMHNRMEZCUXl4VlFVRlZMRWRCUVVjc1dVRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0UlFVTnFSQ3hOUVVGTkxFTkJRVU1zVTBGQlV5eEhRVUZITEZsQlFWa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03VVVGREwwTXNUVUZCVFN4RFFVRkRMR1ZCUVdVc1IwRkJSeXhaUVVGWkxFTkJRVU1zU1VGQlNTeERRVUZETEdGQlFXRXNRMEZCUXl4RFFVRkRPMUZCUXpGRUxFMUJRVTBzUTBGQlF5eFZRVUZWTEVkQlFVY3NXVUZCV1N4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dFJRVU5xUkN4TlFVRk5MRU5CUVVNc1RVRkJUU3hIUVVGSExGbEJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1VVRkRNVU1zVFVGQlRTeERRVUZETEZOQlFWTXNSMEZCUnl4WlFVRlpMRU5CUVVNc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzFGQlEyaEVMRTFCUVUwc1EwRkJReXhMUVVGTExFZEJRVWNzV1VGQldTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRSUVVONFF5eE5RVUZOTEVOQlFVTXNWVUZCVlN4SFFVRkhMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU03VVVGRGJrTXNUVUZCVFN4RFFVRkRMRk5CUVZNc1IwRkJSeXhUUVVGVExFTkJRVU1zVFVGQlRTeERRVUZETEVkQlFVY3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRSUVVWdVJDeHZSRUZCYjBRN1VVRkRjRVFzZFVSQlFYVkVPMUZCUTNaRUxFMUJRVTBzUTBGQlF5eFpRVUZaTEVkQlFVY3NVMEZCVXl4RFFVRkRMRTFCUVUwc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF6dFJRVU0xUXl4TlFVRk5MRU5CUVVNc1lVRkJZU3hIUVVGSExGTkJRVk1zUTBGQlF5eE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE8xRkJSV3BFTEVsQlFVa3NTVUZCU1N4RFFVRkRMRk5CUVZNc1MwRkJTeXhOUVVGTkxFbEJRVWtzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4TlFVRk5MRWRCUVVjc1EwRkJReXhGUVVGRk8xbEJRM0pFTEUxQlFVMHNRMEZCUXl4VFFVRlRMRWRCUVVjc1dVRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU03VTBGRE5VUTdVVUZGUkN4UFFVRlBMRTFCUVUwc1EwRkJRenRKUVVOb1FpeERRVUZETzBsQlYwUTdPMDlCUlVjN1NVRkRTU3hOUVVGTk8xRkJRMWdzU1VGQlNTeERRVUZETEdsQ1FVRnBRaXhIUVVGSExFTkJRVU1zVDBGQlR5eEZRVUZGTEUxQlFVMHNSVUZCUlN4RlFVRkZPMWxCUXpORExIVkhRVUYxUnp0WlFVTjJSeXhKUVVORkxFOUJRVThzUTBGQlF5eFRRVUZUTzJkQ1FVTnFRaXhQUVVGUExFTkJRVU1zVTBGQlV5eExRVUZMTERSQ1FVRTBRaXhGUVVOc1JEdG5Ra0ZEUVN4SlFVRkpMRU5CUVVNc09FSkJRVGhDTEVOQlFVTXNUMEZCVHl4RlFVRkZMRTFCUVUwc1EwRkJReXhEUVVGRE8yRkJRM1JFTzFGQlEwZ3NRMEZCUXl4RFFVRkRPMUZCUTBZc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTXNWMEZCVnl4RFFVRkRMRWxCUVVrc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4RFFVRkRPMGxCUTJoRkxFTkJRVU03U1VGRlJEczdPenM3VDBGTFJ6dEpRVU5KTERoQ1FVRTRRaXhEUVVGRExFOUJRVThzUlVGQlJTeE5RVUZ4UWp0UlFVTnNSU3hSUVVGUkxFOUJRVThzUTBGQlF5eEpRVUZKTEVWQlFVVTdXVUZEY0VJc1MwRkJTeXhUUVVGVExFTkJRVU03V1VGRFppeExRVUZMTEZWQlFWVTdaMEpCUTJJc1RVRkJUU3hOUVVGTkxFZEJRVWNzYjBKQlFXOUNMRU5CUVVNc2NVSkJRWEZDTEVOQlEzWkVMRTlCUVU4c1EwRkJReXhKUVVGSkxFVkJRMW9zVFVGQlRTeERRVU5RTEVOQlFVTTdaMEpCUTBZc1NVRkJTU3hKUVVGSkxFTkJRVU1zVlVGQlZTeEZRVUZGTzI5Q1FVTnVRaXhOUVVGTkxFTkJRVU1zVlVGQlZTeEhRVUZITEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNN2IwSkJRMnBETEVsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNc1ZVRkJWU3hEUVVGRExGbEJRVmtzUlVGQlJTeE5RVUZOTEVOQlFVTXNRMEZCUXp0cFFrRkRjRVE3Y1VKQlFVMDdiMEpCUTB3c1NVRkJTU3hEUVVGRExHTkJRV01zUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN2FVSkJRMnhETzJkQ1FVTkVMRTFCUVUwN1UwRkRWRHRKUVVOSUxFTkJRVU03U1VGRlJEczdPenM3VDBGTFJ6dEpRVU5KTEVkQlFVY3NRMEZCUXl4UFFVRlBPMUZCUTJoQ0xFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNhVUpCUVdsQ0xFVkJRVVU3V1VGRE0wSXNTVUZCU1N4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRE8xTkJRMlk3VVVGRFJDeEpRVUZKTEVOQlFVTXNUMEZCVHl4SFFVRkhMRTlCUVU4c1EwRkJRenRSUVVOMlFpeEpRVUZKTEVOQlFVTXNWVUZCVlN4SFFVRkhMRWxCUVVrc1EwRkJRenRSUVVOMlFpeEpRVUZKTEVOQlFVTXNZMEZCWXl4RFFVRkRMRWRCUVVjc1EwRkJReXhOUVVGTkxFTkJRVU1zUlVGQlJUdFpRVU12UWl4TlFVRk5MRU5CUVVNc1ZVRkJWU3hIUVVGSExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTTdXVUZEYWtNc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eFZRVUZWTEVOQlFVTXNXVUZCV1N4RlFVRkZMRTFCUVUwc1EwRkJReXhEUVVGRE8xRkJRM0pFTEVOQlFVTXNRMEZCUXl4RFFVRkRPMGxCUTB3c1EwRkJRenRKUVVWTkxFdEJRVXNzUTBGQlF5eHhRa0ZCY1VJc1EwRkRhRU1zVDBGQlowSXNSVUZEYUVJc0swSkJRWFZETzFGQlJYWkRMRTFCUVUwc2JVSkJRVzFDTEVkQlFVYzdXVUZETVVJc1QwRkJUenRaUVVOUUxDdENRVUVyUWp0VFFVTm9ReXhEUVVGRE8xRkJRMFlzU1VGQlNTeHRRa0ZCYlVJc1JVRkJSVHRaUVVOMlFpdzJSRUZCTmtRN1dVRkROMFFzVFVGQlRTeFBRVUZQTEVOQlFVTXNZMEZCWXl4RFFVRkRMRkZCUVZFc1EwRkJRenRuUWtGRGNFTXNSVUZCUlN4RlFVRkZPMjlDUVVOR08zZENRVU5GTEVsQlFVa3NSVUZCUlN4MVEwRkJkVU1zU1VGQlNTeERRVUZETEZOQlFWTXNRMEZEZWtRc2JVSkJRVzFDTEVOQlEzQkNMRWRCUVVjN2NVSkJRMHc3YVVKQlEwWTdaMEpCUTBRc1QwRkJUeXhGUVVGRkxFTkJRVU1zV1VGQldTeERRVUZETzJkQ1FVTjJRaXhUUVVGVExFVkJRVVVzU1VGQlNUdG5Ra0ZEWml4TFFVRkxMRVZCUVVVc1owSkJRV2RDTzJkQ1FVTjJRaXhsUVVGbExFVkJRVVVzU1VGQlNUdGhRVU4wUWl4RFFVRkRMRU5CUVVNN1UwRkRTanRSUVVORUxFOUJRVThzVDBGQlR5eERRVUZETEdOQlFXTXNRMEZCUXl4UlFVRlJMRU5CUVVNN1dVRkRja01zUlVGQlJTeEZRVUZGTEVOQlFVTXNSVUZCUlN4SlFVRkpMRVZCUVVVc1lVRkJZU3hGUVVGRkxFTkJRVU03V1VGRE4wSXNUMEZCVHl4RlFVRkZMRU5CUVVNc1dVRkJXU3hEUVVGRE8xbEJRM1pDTEZOQlFWTXNSVUZCUlN4SlFVRkpPMWxCUTJZc1MwRkJTeXhGUVVGRkxHZENRVUZuUWp0WlFVTjJRaXhsUVVGbExFVkJRVVVzU1VGQlNUdFRRVU4wUWl4RFFVRkRMRU5CUVVNN1NVRkRUQ3hEUVVGRE8wbEJSVTBzVDBGQlR6dFJRVU5hTEVsQlFVa3NRMEZCUXl4alFVRmpMRWRCUVVjc1JVRkJSU3hEUVVGRE8xRkJRM3BDTEVsQlFVa3NTVUZCU1N4RFFVRkRMR2xDUVVGcFFpeEZRVUZGTzFsQlF6RkNMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zVTBGQlV5eERRVUZETEdOQlFXTXNRMEZCUXl4SlFVRkpMRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNRMEZCUXp0VFFVTnNSVHRKUVVOSUxFTkJRVU03UTBGRFJpSjkiLCJpbXBvcnQgeyBpbmNyZW1lbnRlZEV2ZW50T3JkaW5hbCB9IGZyb20gXCIuLi9saWIvZXh0ZW5zaW9uLXNlc3Npb24tZXZlbnQtb3JkaW5hbFwiO1xuaW1wb3J0IHsgZXh0ZW5zaW9uU2Vzc2lvblV1aWQgfSBmcm9tIFwiLi4vbGliL2V4dGVuc2lvbi1zZXNzaW9uLXV1aWRcIjtcbmltcG9ydCB7IFBlbmRpbmdOYXZpZ2F0aW9uIH0gZnJvbSBcIi4uL2xpYi9wZW5kaW5nLW5hdmlnYXRpb25cIjtcbmltcG9ydCB7IGJvb2xUb0ludCwgZXNjYXBlU3RyaW5nLCBlc2NhcGVVcmwgfSBmcm9tIFwiLi4vbGliL3N0cmluZy11dGlsc1wiO1xuaW1wb3J0IHsgbWFrZVVVSUQgfSBmcm9tIFwiLi4vbGliL3V1aWRcIjtcbmV4cG9ydCBjb25zdCB0cmFuc2Zvcm1XZWJOYXZpZ2F0aW9uQmFzZUV2ZW50RGV0YWlsc1RvT3BlbldQTVNjaGVtYSA9IGFzeW5jIChjcmF3bElELCBkZXRhaWxzKSA9PiB7XG4gICAgY29uc3QgdGFiID0gZGV0YWlscy50YWJJZCA+IC0xXG4gICAgICAgID8gYXdhaXQgYnJvd3Nlci50YWJzLmdldChkZXRhaWxzLnRhYklkKVxuICAgICAgICA6IHtcbiAgICAgICAgICAgIHdpbmRvd0lkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBpbmNvZ25pdG86IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGNvb2tpZVN0b3JlSWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIG9wZW5lclRhYklkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB3aWR0aDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgaGVpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgIH07XG4gICAgY29uc3Qgd2luZG93ID0gdGFiLndpbmRvd0lkXG4gICAgICAgID8gYXdhaXQgYnJvd3Nlci53aW5kb3dzLmdldCh0YWIud2luZG93SWQpXG4gICAgICAgIDogeyB3aWR0aDogdW5kZWZpbmVkLCBoZWlnaHQ6IHVuZGVmaW5lZCwgdHlwZTogdW5kZWZpbmVkIH07XG4gICAgY29uc3QgbmF2aWdhdGlvbiA9IHtcbiAgICAgICAgYnJvd3Nlcl9pZDogY3Jhd2xJRCxcbiAgICAgICAgaW5jb2duaXRvOiBib29sVG9JbnQodGFiLmluY29nbml0byksXG4gICAgICAgIGV4dGVuc2lvbl9zZXNzaW9uX3V1aWQ6IGV4dGVuc2lvblNlc3Npb25VdWlkLFxuICAgICAgICBwcm9jZXNzX2lkOiBkZXRhaWxzLnByb2Nlc3NJZCxcbiAgICAgICAgd2luZG93X2lkOiB0YWIud2luZG93SWQsXG4gICAgICAgIHRhYl9pZDogZGV0YWlscy50YWJJZCxcbiAgICAgICAgdGFiX29wZW5lcl90YWJfaWQ6IHRhYi5vcGVuZXJUYWJJZCxcbiAgICAgICAgZnJhbWVfaWQ6IGRldGFpbHMuZnJhbWVJZCxcbiAgICAgICAgd2luZG93X3dpZHRoOiB3aW5kb3cud2lkdGgsXG4gICAgICAgIHdpbmRvd19oZWlnaHQ6IHdpbmRvdy5oZWlnaHQsXG4gICAgICAgIHdpbmRvd190eXBlOiB3aW5kb3cudHlwZSxcbiAgICAgICAgdGFiX3dpZHRoOiB0YWIud2lkdGgsXG4gICAgICAgIHRhYl9oZWlnaHQ6IHRhYi5oZWlnaHQsXG4gICAgICAgIHRhYl9jb29raWVfc3RvcmVfaWQ6IGVzY2FwZVN0cmluZyh0YWIuY29va2llU3RvcmVJZCksXG4gICAgICAgIHV1aWQ6IG1ha2VVVUlEKCksXG4gICAgICAgIHVybDogZXNjYXBlVXJsKGRldGFpbHMudXJsKSxcbiAgICB9O1xuICAgIHJldHVybiBuYXZpZ2F0aW9uO1xufTtcbmV4cG9ydCBjbGFzcyBOYXZpZ2F0aW9uSW5zdHJ1bWVudCB7XG4gICAgY29uc3RydWN0b3IoZGF0YVJlY2VpdmVyKSB7XG4gICAgICAgIHRoaXMucGVuZGluZ05hdmlnYXRpb25zID0ge307XG4gICAgICAgIHRoaXMuZGF0YVJlY2VpdmVyID0gZGF0YVJlY2VpdmVyO1xuICAgIH1cbiAgICBzdGF0aWMgbmF2aWdhdGlvbklkKHByb2Nlc3NJZCwgdGFiSWQsIGZyYW1lSWQpIHtcbiAgICAgICAgcmV0dXJuIGAke3Byb2Nlc3NJZH0tJHt0YWJJZH0tJHtmcmFtZUlkfWA7XG4gICAgfVxuICAgIHJ1bihjcmF3bElEKSB7XG4gICAgICAgIHRoaXMub25CZWZvcmVOYXZpZ2F0ZUxpc3RlbmVyID0gYXN5bmMgKGRldGFpbHMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5hdmlnYXRpb25JZCA9IE5hdmlnYXRpb25JbnN0cnVtZW50Lm5hdmlnYXRpb25JZChkZXRhaWxzLnByb2Nlc3NJZCwgZGV0YWlscy50YWJJZCwgZGV0YWlscy5mcmFtZUlkKTtcbiAgICAgICAgICAgIGNvbnN0IHBlbmRpbmdOYXZpZ2F0aW9uID0gdGhpcy5pbnN0YW50aWF0ZVBlbmRpbmdOYXZpZ2F0aW9uKG5hdmlnYXRpb25JZCk7XG4gICAgICAgICAgICBjb25zdCBuYXZpZ2F0aW9uID0gYXdhaXQgdHJhbnNmb3JtV2ViTmF2aWdhdGlvbkJhc2VFdmVudERldGFpbHNUb09wZW5XUE1TY2hlbWEoY3Jhd2xJRCwgZGV0YWlscyk7XG4gICAgICAgICAgICBuYXZpZ2F0aW9uLnBhcmVudF9mcmFtZV9pZCA9IGRldGFpbHMucGFyZW50RnJhbWVJZDtcbiAgICAgICAgICAgIG5hdmlnYXRpb24uYmVmb3JlX25hdmlnYXRlX2V2ZW50X29yZGluYWwgPSBpbmNyZW1lbnRlZEV2ZW50T3JkaW5hbCgpO1xuICAgICAgICAgICAgbmF2aWdhdGlvbi5iZWZvcmVfbmF2aWdhdGVfdGltZV9zdGFtcCA9IG5ldyBEYXRlKGRldGFpbHMudGltZVN0YW1wKS50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgcGVuZGluZ05hdmlnYXRpb24ucmVzb2x2ZU9uQmVmb3JlTmF2aWdhdGVFdmVudE5hdmlnYXRpb24obmF2aWdhdGlvbik7XG4gICAgICAgIH07XG4gICAgICAgIGJyb3dzZXIud2ViTmF2aWdhdGlvbi5vbkJlZm9yZU5hdmlnYXRlLmFkZExpc3RlbmVyKHRoaXMub25CZWZvcmVOYXZpZ2F0ZUxpc3RlbmVyKTtcbiAgICAgICAgdGhpcy5vbkNvbW1pdHRlZExpc3RlbmVyID0gYXN5bmMgKGRldGFpbHMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5hdmlnYXRpb25JZCA9IE5hdmlnYXRpb25JbnN0cnVtZW50Lm5hdmlnYXRpb25JZChkZXRhaWxzLnByb2Nlc3NJZCwgZGV0YWlscy50YWJJZCwgZGV0YWlscy5mcmFtZUlkKTtcbiAgICAgICAgICAgIGNvbnN0IG5hdmlnYXRpb24gPSBhd2FpdCB0cmFuc2Zvcm1XZWJOYXZpZ2F0aW9uQmFzZUV2ZW50RGV0YWlsc1RvT3BlbldQTVNjaGVtYShjcmF3bElELCBkZXRhaWxzKTtcbiAgICAgICAgICAgIG5hdmlnYXRpb24udHJhbnNpdGlvbl9xdWFsaWZpZXJzID0gZXNjYXBlU3RyaW5nKEpTT04uc3RyaW5naWZ5KGRldGFpbHMudHJhbnNpdGlvblF1YWxpZmllcnMpKTtcbiAgICAgICAgICAgIG5hdmlnYXRpb24udHJhbnNpdGlvbl90eXBlID0gZXNjYXBlU3RyaW5nKGRldGFpbHMudHJhbnNpdGlvblR5cGUpO1xuICAgICAgICAgICAgbmF2aWdhdGlvbi5jb21taXR0ZWRfZXZlbnRfb3JkaW5hbCA9IGluY3JlbWVudGVkRXZlbnRPcmRpbmFsKCk7XG4gICAgICAgICAgICBuYXZpZ2F0aW9uLmNvbW1pdHRlZF90aW1lX3N0YW1wID0gbmV3IERhdGUoZGV0YWlscy50aW1lU3RhbXApLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgICAgICAvLyBpbmNsdWRlIGF0dHJpYnV0ZXMgZnJvbSB0aGUgY29ycmVzcG9uZGluZyBvbkJlZm9yZU5hdmlnYXRpb24gZXZlbnRcbiAgICAgICAgICAgIGNvbnN0IHBlbmRpbmdOYXZpZ2F0aW9uID0gdGhpcy5nZXRQZW5kaW5nTmF2aWdhdGlvbihuYXZpZ2F0aW9uSWQpO1xuICAgICAgICAgICAgaWYgKHBlbmRpbmdOYXZpZ2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgcGVuZGluZ05hdmlnYXRpb24ucmVzb2x2ZU9uQ29tbWl0dGVkRXZlbnROYXZpZ2F0aW9uKG5hdmlnYXRpb24pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc29sdmVkID0gYXdhaXQgcGVuZGluZ05hdmlnYXRpb24ucmVzb2x2ZWRXaXRoaW5UaW1lb3V0KDEwMDApO1xuICAgICAgICAgICAgICAgIGlmIChyZXNvbHZlZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvbkJlZm9yZU5hdmlnYXRlRXZlbnROYXZpZ2F0aW9uID0gYXdhaXQgcGVuZGluZ05hdmlnYXRpb24ub25CZWZvcmVOYXZpZ2F0ZUV2ZW50TmF2aWdhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbi5wYXJlbnRfZnJhbWVfaWQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgb25CZWZvcmVOYXZpZ2F0ZUV2ZW50TmF2aWdhdGlvbi5wYXJlbnRfZnJhbWVfaWQ7XG4gICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb24uYmVmb3JlX25hdmlnYXRlX2V2ZW50X29yZGluYWwgPVxuICAgICAgICAgICAgICAgICAgICAgICAgb25CZWZvcmVOYXZpZ2F0ZUV2ZW50TmF2aWdhdGlvbi5iZWZvcmVfbmF2aWdhdGVfZXZlbnRfb3JkaW5hbDtcbiAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbi5iZWZvcmVfbmF2aWdhdGVfdGltZV9zdGFtcCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkJlZm9yZU5hdmlnYXRlRXZlbnROYXZpZ2F0aW9uLmJlZm9yZV9uYXZpZ2F0ZV90aW1lX3N0YW1wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGF0YVJlY2VpdmVyLnNhdmVSZWNvcmQoXCJuYXZpZ2F0aW9uc1wiLCBuYXZpZ2F0aW9uKTtcbiAgICAgICAgfTtcbiAgICAgICAgYnJvd3Nlci53ZWJOYXZpZ2F0aW9uLm9uQ29tbWl0dGVkLmFkZExpc3RlbmVyKHRoaXMub25Db21taXR0ZWRMaXN0ZW5lcik7XG4gICAgfVxuICAgIGNsZWFudXAoKSB7XG4gICAgICAgIGlmICh0aGlzLm9uQmVmb3JlTmF2aWdhdGVMaXN0ZW5lcikge1xuICAgICAgICAgICAgYnJvd3Nlci53ZWJOYXZpZ2F0aW9uLm9uQmVmb3JlTmF2aWdhdGUucmVtb3ZlTGlzdGVuZXIodGhpcy5vbkJlZm9yZU5hdmlnYXRlTGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9uQ29tbWl0dGVkTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGJyb3dzZXIud2ViTmF2aWdhdGlvbi5vbkNvbW1pdHRlZC5yZW1vdmVMaXN0ZW5lcih0aGlzLm9uQ29tbWl0dGVkTGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGluc3RhbnRpYXRlUGVuZGluZ05hdmlnYXRpb24obmF2aWdhdGlvbklkKSB7XG4gICAgICAgIHRoaXMucGVuZGluZ05hdmlnYXRpb25zW25hdmlnYXRpb25JZF0gPSBuZXcgUGVuZGluZ05hdmlnYXRpb24oKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucGVuZGluZ05hdmlnYXRpb25zW25hdmlnYXRpb25JZF07XG4gICAgfVxuICAgIGdldFBlbmRpbmdOYXZpZ2F0aW9uKG5hdmlnYXRpb25JZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wZW5kaW5nTmF2aWdhdGlvbnNbbmF2aWdhdGlvbklkXTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2libUYyYVdkaGRHbHZiaTFwYm5OMGNuVnRaVzUwTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhNaU9sc2lMaTR2TGk0dkxpNHZjM0pqTDJKaFkydG5jbTkxYm1RdmJtRjJhV2RoZEdsdmJpMXBibk4wY25WdFpXNTBMblJ6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxFOUJRVThzUlVGQlJTeDFRa0ZCZFVJc1JVRkJSU3hOUVVGTkxIZERRVUYzUXl4RFFVRkRPMEZCUTJwR0xFOUJRVThzUlVGQlJTeHZRa0ZCYjBJc1JVRkJSU3hOUVVGTkxDdENRVUVyUWl4RFFVRkRPMEZCUTNKRkxFOUJRVThzUlVGQlJTeHBRa0ZCYVVJc1JVRkJSU3hOUVVGTkxESkNRVUV5UWl4RFFVRkRPMEZCUXpsRUxFOUJRVThzUlVGQlJTeFRRVUZUTEVWQlFVVXNXVUZCV1N4RlFVRkZMRk5CUVZNc1JVRkJSU3hOUVVGTkxIRkNRVUZ4UWl4RFFVRkRPMEZCUTNwRkxFOUJRVThzUlVGQlJTeFJRVUZSTEVWQlFVVXNUVUZCVFN4aFFVRmhMRU5CUVVNN1FVRlJka01zVFVGQlRTeERRVUZETEUxQlFVMHNjVVJCUVhGRUxFZEJRVWNzUzBGQlN5eEZRVU40UlN4UFFVRlBMRVZCUTFBc1QwRkJjME1zUlVGRGFrSXNSVUZCUlR0SlFVTjJRaXhOUVVGTkxFZEJRVWNzUjBGRFVDeFBRVUZQTEVOQlFVTXNTMEZCU3l4SFFVRkhMRU5CUVVNc1EwRkJRenRSUVVOb1FpeERRVUZETEVOQlFVTXNUVUZCVFN4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRPMUZCUTNaRExFTkJRVU1zUTBGQlF6dFpRVU5GTEZGQlFWRXNSVUZCUlN4VFFVRlRPMWxCUTI1Q0xGTkJRVk1zUlVGQlJTeFRRVUZUTzFsQlEzQkNMR0ZCUVdFc1JVRkJSU3hUUVVGVE8xbEJRM2hDTEZkQlFWY3NSVUZCUlN4VFFVRlRPMWxCUTNSQ0xFdEJRVXNzUlVGQlJTeFRRVUZUTzFsQlEyaENMRTFCUVUwc1JVRkJSU3hUUVVGVE8xTkJRMnhDTEVOQlFVTTdTVUZEVWl4TlFVRk5MRTFCUVUwc1IwRkJSeXhIUVVGSExFTkJRVU1zVVVGQlVUdFJRVU42UWl4RFFVRkRMRU5CUVVNc1RVRkJUU3hQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4SFFVRkhMRU5CUVVNc1VVRkJVU3hEUVVGRE8xRkJRM3BETEVOQlFVTXNRMEZCUXl4RlFVRkZMRXRCUVVzc1JVRkJSU3hUUVVGVExFVkJRVVVzVFVGQlRTeEZRVUZGTEZOQlFWTXNSVUZCUlN4SlFVRkpMRVZCUVVVc1UwRkJVeXhGUVVGRkxFTkJRVU03U1VGRE4wUXNUVUZCVFN4VlFVRlZMRWRCUVdVN1VVRkROMElzVlVGQlZTeEZRVUZGTEU5QlFVODdVVUZEYmtJc1UwRkJVeXhGUVVGRkxGTkJRVk1zUTBGQlF5eEhRVUZITEVOQlFVTXNVMEZCVXl4RFFVRkRPMUZCUTI1RExITkNRVUZ6UWl4RlFVRkZMRzlDUVVGdlFqdFJRVU0xUXl4VlFVRlZMRVZCUVVVc1QwRkJUeXhEUVVGRExGTkJRVk03VVVGRE4wSXNVMEZCVXl4RlFVRkZMRWRCUVVjc1EwRkJReXhSUVVGUk8xRkJRM1pDTEUxQlFVMHNSVUZCUlN4UFFVRlBMRU5CUVVNc1MwRkJTenRSUVVOeVFpeHBRa0ZCYVVJc1JVRkJSU3hIUVVGSExFTkJRVU1zVjBGQlZ6dFJRVU5zUXl4UlFVRlJMRVZCUVVVc1QwRkJUeXhEUVVGRExFOUJRVTg3VVVGRGVrSXNXVUZCV1N4RlFVRkZMRTFCUVUwc1EwRkJReXhMUVVGTE8xRkJRekZDTEdGQlFXRXNSVUZCUlN4TlFVRk5MRU5CUVVNc1RVRkJUVHRSUVVNMVFpeFhRVUZYTEVWQlFVVXNUVUZCVFN4RFFVRkRMRWxCUVVrN1VVRkRlRUlzVTBGQlV5eEZRVUZGTEVkQlFVY3NRMEZCUXl4TFFVRkxPMUZCUTNCQ0xGVkJRVlVzUlVGQlJTeEhRVUZITEVOQlFVTXNUVUZCVFR0UlFVTjBRaXh0UWtGQmJVSXNSVUZCUlN4WlFVRlpMRU5CUVVNc1IwRkJSeXhEUVVGRExHRkJRV0VzUTBGQlF6dFJRVU53UkN4SlFVRkpMRVZCUVVVc1VVRkJVU3hGUVVGRk8xRkJRMmhDTEVkQlFVY3NSVUZCUlN4VFFVRlRMRU5CUVVNc1QwRkJUeXhEUVVGRExFZEJRVWNzUTBGQlF6dExRVU0xUWl4RFFVRkRPMGxCUTBZc1QwRkJUeXhWUVVGVkxFTkJRVU03UVVGRGNFSXNRMEZCUXl4RFFVRkRPMEZCUlVZc1RVRkJUU3hQUVVGUExHOUNRVUZ2UWp0SlFWY3ZRaXhaUVVGWkxGbEJRVms3VVVGS2FFSXNkVUpCUVd0Q0xFZEJSWFJDTEVWQlFVVXNRMEZCUXp0UlFVZE1MRWxCUVVrc1EwRkJReXhaUVVGWkxFZEJRVWNzV1VGQldTeERRVUZETzBsQlEyNURMRU5CUVVNN1NVRmFUU3hOUVVGTkxFTkJRVU1zV1VGQldTeERRVUZETEZOQlFWTXNSVUZCUlN4TFFVRkxMRVZCUVVVc1QwRkJUenRSUVVOc1JDeFBRVUZQTEVkQlFVY3NVMEZCVXl4SlFVRkpMRXRCUVVzc1NVRkJTU3hQUVVGUExFVkJRVVVzUTBGQlF6dEpRVU0xUXl4RFFVRkRPMGxCV1Uwc1IwRkJSeXhEUVVGRExFOUJRVTg3VVVGRGFFSXNTVUZCU1N4RFFVRkRMSGRDUVVGM1FpeEhRVUZITEV0QlFVc3NSVUZEYmtNc1QwRkJhMFFzUlVGRGJFUXNSVUZCUlR0WlFVTkdMRTFCUVUwc1dVRkJXU3hIUVVGSExHOUNRVUZ2UWl4RFFVRkRMRmxCUVZrc1EwRkRjRVFzVDBGQlR5eERRVUZETEZOQlFWTXNSVUZEYWtJc1QwRkJUeXhEUVVGRExFdEJRVXNzUlVGRFlpeFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVTm9RaXhEUVVGRE8xbEJRMFlzVFVGQlRTeHBRa0ZCYVVJc1IwRkJSeXhKUVVGSkxFTkJRVU1zTkVKQlFUUkNMRU5CUVVNc1dVRkJXU3hEUVVGRExFTkJRVU03V1VGRE1VVXNUVUZCVFN4VlFVRlZMRWRCUVdVc1RVRkJUU3h4UkVGQmNVUXNRMEZEZUVZc1QwRkJUeXhGUVVOUUxFOUJRVThzUTBGRFVpeERRVUZETzFsQlEwWXNWVUZCVlN4RFFVRkRMR1ZCUVdVc1IwRkJSeXhQUVVGUExFTkJRVU1zWVVGQllTeERRVUZETzFsQlEyNUVMRlZCUVZVc1EwRkJReXcyUWtGQk5rSXNSMEZCUnl4MVFrRkJkVUlzUlVGQlJTeERRVUZETzFsQlEzSkZMRlZCUVZVc1EwRkJReXd3UWtGQk1FSXNSMEZCUnl4SlFVRkpMRWxCUVVrc1EwRkRPVU1zVDBGQlR5eERRVUZETEZOQlFWTXNRMEZEYkVJc1EwRkJReXhYUVVGWExFVkJRVVVzUTBGQlF6dFpRVU5vUWl4cFFrRkJhVUlzUTBGQlF5eHpRMEZCYzBNc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6dFJRVU4yUlN4RFFVRkRMRU5CUVVNN1VVRkRSaXhQUVVGUExFTkJRVU1zWVVGQllTeERRVUZETEdkQ1FVRm5RaXhEUVVGRExGZEJRVmNzUTBGRGFFUXNTVUZCU1N4RFFVRkRMSGRDUVVGM1FpeERRVU01UWl4RFFVRkRPMUZCUTBZc1NVRkJTU3hEUVVGRExHMUNRVUZ0UWl4SFFVRkhMRXRCUVVzc1JVRkRPVUlzVDBGQk5rTXNSVUZETjBNc1JVRkJSVHRaUVVOR0xFMUJRVTBzV1VGQldTeEhRVUZITEc5Q1FVRnZRaXhEUVVGRExGbEJRVmtzUTBGRGNFUXNUMEZCVHl4RFFVRkRMRk5CUVZNc1JVRkRha0lzVDBGQlR5eERRVUZETEV0QlFVc3NSVUZEWWl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVOb1FpeERRVUZETzFsQlEwWXNUVUZCVFN4VlFVRlZMRWRCUVdVc1RVRkJUU3h4UkVGQmNVUXNRMEZEZUVZc1QwRkJUeXhGUVVOUUxFOUJRVThzUTBGRFVpeERRVUZETzFsQlEwWXNWVUZCVlN4RFFVRkRMSEZDUVVGeFFpeEhRVUZITEZsQlFWa3NRMEZETjBNc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eFBRVUZQTEVOQlFVTXNiMEpCUVc5Q0xFTkJRVU1zUTBGRE4wTXNRMEZCUXp0WlFVTkdMRlZCUVZVc1EwRkJReXhsUVVGbExFZEJRVWNzV1VGQldTeERRVUZETEU5QlFVOHNRMEZCUXl4alFVRmpMRU5CUVVNc1EwRkJRenRaUVVOc1JTeFZRVUZWTEVOQlFVTXNkVUpCUVhWQ0xFZEJRVWNzZFVKQlFYVkNMRVZCUVVVc1EwRkJRenRaUVVNdlJDeFZRVUZWTEVOQlFVTXNiMEpCUVc5Q0xFZEJRVWNzU1VGQlNTeEpRVUZKTEVOQlEzaERMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRMnhDTEVOQlFVTXNWMEZCVnl4RlFVRkZMRU5CUVVNN1dVRkZhRUlzY1VWQlFYRkZPMWxCUTNKRkxFMUJRVTBzYVVKQlFXbENMRWRCUVVjc1NVRkJTU3hEUVVGRExHOUNRVUZ2UWl4RFFVRkRMRmxCUVZrc1EwRkJReXhEUVVGRE8xbEJRMnhGTEVsQlFVa3NhVUpCUVdsQ0xFVkJRVVU3WjBKQlEzSkNMR2xDUVVGcFFpeERRVUZETEdsRFFVRnBReXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETzJkQ1FVTm9SU3hOUVVGTkxGRkJRVkVzUjBGQlJ5eE5RVUZOTEdsQ1FVRnBRaXhEUVVGRExIRkNRVUZ4UWl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8yZENRVU55UlN4SlFVRkpMRkZCUVZFc1JVRkJSVHR2UWtGRFdpeE5RVUZOTEN0Q1FVRXJRaXhIUVVGSExFMUJRVTBzYVVKQlFXbENMRU5CUVVNc0swSkJRU3RDTEVOQlFVTTdiMEpCUTJoSExGVkJRVlVzUTBGQlF5eGxRVUZsTzNkQ1FVTjRRaXdyUWtGQkswSXNRMEZCUXl4bFFVRmxMRU5CUVVNN2IwSkJRMnhFTEZWQlFWVXNRMEZCUXl3MlFrRkJOa0k3ZDBKQlEzUkRMQ3RDUVVFclFpeERRVUZETERaQ1FVRTJRaXhEUVVGRE8yOUNRVU5vUlN4VlFVRlZMRU5CUVVNc01FSkJRVEJDTzNkQ1FVTnVReXdyUWtGQkswSXNRMEZCUXl3d1FrRkJNRUlzUTBGQlF6dHBRa0ZET1VRN1lVRkRSanRaUVVWRUxFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNWVUZCVlN4RFFVRkRMR0ZCUVdFc1JVRkJSU3hWUVVGVkxFTkJRVU1zUTBGQlF6dFJRVU14UkN4RFFVRkRMRU5CUVVNN1VVRkRSaXhQUVVGUExFTkJRVU1zWVVGQllTeERRVUZETEZkQlFWY3NRMEZCUXl4WFFVRlhMRU5CUVVNc1NVRkJTU3hEUVVGRExHMUNRVUZ0UWl4RFFVRkRMRU5CUVVNN1NVRkRNVVVzUTBGQlF6dEpRVVZOTEU5QlFVODdVVUZEV2l4SlFVRkpMRWxCUVVrc1EwRkJReXgzUWtGQmQwSXNSVUZCUlR0WlFVTnFReXhQUVVGUExFTkJRVU1zWVVGQllTeERRVUZETEdkQ1FVRm5RaXhEUVVGRExHTkJRV01zUTBGRGJrUXNTVUZCU1N4RFFVRkRMSGRDUVVGM1FpeERRVU01UWl4RFFVRkRPMU5CUTBnN1VVRkRSQ3hKUVVGSkxFbEJRVWtzUTBGQlF5eHRRa0ZCYlVJc1JVRkJSVHRaUVVNMVFpeFBRVUZQTEVOQlFVTXNZVUZCWVN4RFFVRkRMRmRCUVZjc1EwRkJReXhqUVVGakxFTkJRemxETEVsQlFVa3NRMEZCUXl4dFFrRkJiVUlzUTBGRGVrSXNRMEZCUXp0VFFVTklPMGxCUTBnc1EwRkJRenRKUVVWUExEUkNRVUUwUWl4RFFVTnNReXhaUVVGdlFqdFJRVVZ3UWl4SlFVRkpMRU5CUVVNc2EwSkJRV3RDTEVOQlFVTXNXVUZCV1N4RFFVRkRMRWRCUVVjc1NVRkJTU3hwUWtGQmFVSXNSVUZCUlN4RFFVRkRPMUZCUTJoRkxFOUJRVThzU1VGQlNTeERRVUZETEd0Q1FVRnJRaXhEUVVGRExGbEJRVmtzUTBGQlF5eERRVUZETzBsQlF5OURMRU5CUVVNN1NVRkZUeXh2UWtGQmIwSXNRMEZCUXl4WlFVRnZRanRSUVVNdlF5eFBRVUZQTEVsQlFVa3NRMEZCUXl4clFrRkJhMElzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXp0SlFVTXZReXhEUVVGRE8wTkJRMFlpZlE9PSIsImltcG9ydCB7IGdldEluc3RydW1lbnRKUyB9IGZyb20gXCIuLi9saWIvanMtaW5zdHJ1bWVudHNcIjtcbmltcG9ydCB7IHBhZ2VTY3JpcHQgfSBmcm9tIFwiLi9qYXZhc2NyaXB0LWluc3RydW1lbnQtcGFnZS1zY29wZVwiO1xuZnVuY3Rpb24gZ2V0UGFnZVNjcmlwdEFzU3RyaW5nKGpzSW5zdHJ1bWVudGF0aW9uU2V0dGluZ3NTdHJpbmcpIHtcbiAgICAvLyBUaGUgSlMgSW5zdHJ1bWVudCBSZXF1ZXN0cyBhcmUgc2V0dXAgYW5kIHZhbGlkYXRlZCBweXRob24gc2lkZVxuICAgIC8vIGluY2x1ZGluZyBzZXR0aW5nIGRlZmF1bHRzIGZvciBsb2dTZXR0aW5ncy4gU2VlIEpTSW5zdHJ1bWVudGF0aW9uLnB5XG4gICAgY29uc3QgcGFnZVNjcmlwdFN0cmluZyA9IGBcbi8vIFN0YXJ0IG9mIGpzLWluc3RydW1lbnRzLlxuJHtnZXRJbnN0cnVtZW50SlN9XG4vLyBFbmQgb2YganMtaW5zdHJ1bWVudHMuXG5cbi8vIFN0YXJ0IG9mIGN1c3RvbSBpbnN0cnVtZW50UmVxdWVzdHMuXG5jb25zdCBqc0luc3RydW1lbnRhdGlvblNldHRpbmdzID0gJHtqc0luc3RydW1lbnRhdGlvblNldHRpbmdzU3RyaW5nfTtcbi8vIEVuZCBvZiBjdXN0b20gaW5zdHJ1bWVudFJlcXVlc3RzLlxuXG4vLyBTdGFydCBvZiBhbm9ueW1vdXMgZnVuY3Rpb24gZnJvbSBqYXZhc2NyaXB0LWluc3RydW1lbnQtcGFnZS1zY29wZS50c1xuKCR7cGFnZVNjcmlwdH0oZ2V0SW5zdHJ1bWVudEpTLCBqc0luc3RydW1lbnRhdGlvblNldHRpbmdzKSk7XG4vLyBFbmQuXG4gIGA7XG4gICAgcmV0dXJuIHBhZ2VTY3JpcHRTdHJpbmc7XG59XG5mdW5jdGlvbiBpbnNlcnRTY3JpcHQocGFnZVNjcmlwdFN0cmluZywgZXZlbnRJZCwgdGVzdGluZyA9IGZhbHNlKSB7XG4gICAgY29uc3QgcGFyZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgIHNjcmlwdC50ZXh0ID0gcGFnZVNjcmlwdFN0cmluZztcbiAgICBzY3JpcHQuYXN5bmMgPSBmYWxzZTtcbiAgICBzY3JpcHQuc2V0QXR0cmlidXRlKFwiZGF0YS1ldmVudC1pZFwiLCBldmVudElkKTtcbiAgICBzY3JpcHQuc2V0QXR0cmlidXRlKFwiZGF0YS10ZXN0aW5nXCIsIGAke3Rlc3Rpbmd9YCk7XG4gICAgcGFyZW50Lmluc2VydEJlZm9yZShzY3JpcHQsIHBhcmVudC5maXJzdENoaWxkKTtcbiAgICBwYXJlbnQucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbn1cbmZ1bmN0aW9uIGVtaXRNc2codHlwZSwgbXNnKSB7XG4gICAgbXNnLnRpbWVTdGFtcCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICBicm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICBuYW1lc3BhY2U6IFwiamF2YXNjcmlwdC1pbnN0cnVtZW50YXRpb25cIixcbiAgICAgICAgdHlwZSxcbiAgICAgICAgZGF0YTogbXNnLFxuICAgIH0pO1xufVxuY29uc3QgZXZlbnRJZCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKTtcbi8vIGxpc3RlbiBmb3IgbWVzc2FnZXMgZnJvbSB0aGUgc2NyaXB0IHdlIGFyZSBhYm91dCB0byBpbnNlcnRcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRJZCwgZnVuY3Rpb24gKGUpIHtcbiAgICAvLyBwYXNzIHRoZXNlIG9uIHRvIHRoZSBiYWNrZ3JvdW5kIHBhZ2VcbiAgICBjb25zdCBtc2dzID0gZS5kZXRhaWw7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkobXNncykpIHtcbiAgICAgICAgbXNncy5mb3JFYWNoKGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgIGVtaXRNc2cobXNnLnR5cGUsIG1zZy5jb250ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBlbWl0TXNnKG1zZ3MudHlwZSwgbXNncy5jb250ZW50KTtcbiAgICB9XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBpbmplY3RKYXZhc2NyaXB0SW5zdHJ1bWVudFBhZ2VTY3JpcHQoY29udGVudFNjcmlwdENvbmZpZykge1xuICAgIGluc2VydFNjcmlwdChnZXRQYWdlU2NyaXB0QXNTdHJpbmcoY29udGVudFNjcmlwdENvbmZpZy5qc0luc3RydW1lbnRhdGlvblNldHRpbmdzU3RyaW5nKSwgZXZlbnRJZCwgY29udGVudFNjcmlwdENvbmZpZy50ZXN0aW5nKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWFtRjJZWE5qY21sd2RDMXBibk4wY25WdFpXNTBMV052Ym5SbGJuUXRjMk52Y0dVdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGN5STZXeUl1TGk4dUxpOHVMaTl6Y21NdlkyOXVkR1Z1ZEM5cVlYWmhjMk55YVhCMExXbHVjM1J5ZFcxbGJuUXRZMjl1ZEdWdWRDMXpZMjl3WlM1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hQUVVGUExFVkJRVVVzWlVGQlpTeEZRVUZGTEUxQlFVMHNkVUpCUVhWQ0xFTkJRVU03UVVGRGVFUXNUMEZCVHl4RlFVRkZMRlZCUVZVc1JVRkJSU3hOUVVGTkxHOURRVUZ2UXl4RFFVRkRPMEZCUldoRkxGTkJRVk1zY1VKQlFYRkNMRU5CUXpWQ0xDdENRVUYxUXp0SlFVVjJReXhwUlVGQmFVVTdTVUZEYWtVc2RVVkJRWFZGTzBsQlEzWkZMRTFCUVUwc1owSkJRV2RDTEVkQlFVYzdPMFZCUlhwQ0xHVkJRV1U3T3pzN2IwTkJTVzFDTEN0Q1FVRXJRanM3T3p0SFFVbG9SU3hWUVVGVk96dEhRVVZXTEVOQlFVTTdTVUZEUml4UFFVRlBMR2RDUVVGblFpeERRVUZETzBGQlF6RkNMRU5CUVVNN1FVRkZSQ3hUUVVGVExGbEJRVmtzUTBGRGJrSXNaMEpCUVhkQ0xFVkJRM2hDTEU5QlFXVXNSVUZEWml4VlFVRnRRaXhMUVVGTE8wbEJSWGhDTEUxQlFVMHNUVUZCVFN4SFFVRkhMRkZCUVZFc1EwRkJReXhsUVVGbExFVkJRM0pETEUxQlFVMHNSMEZCUnl4UlFVRlJMRU5CUVVNc1lVRkJZU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzBsQlF6VkRMRTFCUVUwc1EwRkJReXhKUVVGSkxFZEJRVWNzWjBKQlFXZENMRU5CUVVNN1NVRkRMMElzVFVGQlRTeERRVUZETEV0QlFVc3NSMEZCUnl4TFFVRkxMRU5CUVVNN1NVRkRja0lzVFVGQlRTeERRVUZETEZsQlFWa3NRMEZCUXl4bFFVRmxMRVZCUVVVc1QwRkJUeXhEUVVGRExFTkJRVU03U1VGRE9VTXNUVUZCVFN4RFFVRkRMRmxCUVZrc1EwRkJReXhqUVVGakxFVkJRVVVzUjBGQlJ5eFBRVUZQTEVWQlFVVXNRMEZCUXl4RFFVRkRPMGxCUTJ4RUxFMUJRVTBzUTBGQlF5eFpRVUZaTEVOQlFVTXNUVUZCVFN4RlFVRkZMRTFCUVUwc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6dEpRVU12UXl4TlFVRk5MRU5CUVVNc1YwRkJWeXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETzBGQlF6ZENMRU5CUVVNN1FVRkZSQ3hUUVVGVExFOUJRVThzUTBGQlF5eEpRVUZKTEVWQlFVVXNSMEZCUnp0SlFVTjRRaXhIUVVGSExFTkJRVU1zVTBGQlV5eEhRVUZITEVsQlFVa3NTVUZCU1N4RlFVRkZMRU5CUVVNc1YwRkJWeXhGUVVGRkxFTkJRVU03U1VGRGVrTXNUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhYUVVGWExFTkJRVU03VVVGRE1VSXNVMEZCVXl4RlFVRkZMRFJDUVVFMFFqdFJRVU4yUXl4SlFVRkpPMUZCUTBvc1NVRkJTU3hGUVVGRkxFZEJRVWM3UzBGRFZpeERRVUZETEVOQlFVTTdRVUZEVEN4RFFVRkRPMEZCUlVRc1RVRkJUU3hQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNSVUZCUlN4RFFVRkRMRkZCUVZFc1JVRkJSU3hEUVVGRE8wRkJSWHBETERaRVFVRTJSRHRCUVVNM1JDeFJRVUZSTEVOQlFVTXNaMEpCUVdkQ0xFTkJRVU1zVDBGQlR5eEZRVUZGTEZWQlFWTXNRMEZCWXp0SlFVTjRSQ3gxUTBGQmRVTTdTVUZEZGtNc1RVRkJUU3hKUVVGSkxFZEJRVWNzUTBGQlF5eERRVUZETEUxQlFVMHNRMEZCUXp0SlFVTjBRaXhKUVVGSkxFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRVZCUVVVN1VVRkRka0lzU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4VlFVRlRMRWRCUVVjN1dVRkRka0lzVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4SlFVRkpMRVZCUVVVc1IwRkJSeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzFGQlEycERMRU5CUVVNc1EwRkJReXhEUVVGRE8wdEJRMG83VTBGQlRUdFJRVU5NTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0TFFVTnNRenRCUVVOSUxFTkJRVU1zUTBGQlF5eERRVUZETzBGQlJVZ3NUVUZCVFN4VlFVRlZMRzlEUVVGdlF5eERRVUZETEcxQ1FVRnRRanRKUVVOMFJTeFpRVUZaTEVOQlExWXNjVUpCUVhGQ0xFTkJRVU1zYlVKQlFXMUNMRU5CUVVNc0swSkJRU3RDTEVOQlFVTXNSVUZETVVVc1QwRkJUeXhGUVVOUUxHMUNRVUZ0UWl4RFFVRkRMRTlCUVU4c1EwRkROVUlzUTBGQlF6dEJRVU5LTEVOQlFVTWlmUT09IiwiLy8gQ29kZSBiZWxvdyBpcyBub3QgYSBjb250ZW50IHNjcmlwdDogbm8gRmlyZWZveCBBUElzIHNob3VsZCBiZSB1c2VkXG4vLyBBbHNvLCBubyB3ZWJwYWNrL2VzNiBpbXBvcnRzIG1heSBiZSB1c2VkIGluIHRoaXMgZmlsZSBzaW5jZSB0aGUgc2NyaXB0XG4vLyBpcyBleHBvcnRlZCBhcyBhIHBhZ2Ugc2NyaXB0IGFzIGEgc3RyaW5nXG5leHBvcnQgY29uc3QgcGFnZVNjcmlwdCA9IGZ1bmN0aW9uIChnZXRJbnN0cnVtZW50SlMsIGpzSW5zdHJ1bWVudGF0aW9uU2V0dGluZ3MpIHtcbiAgICAvLyBtZXNzYWdlcyB0aGUgaW5qZWN0ZWQgc2NyaXB0XG4gICAgZnVuY3Rpb24gc2VuZE1lc3NhZ2VzVG9Mb2dnZXIoZXZlbnRJZCwgbWVzc2FnZXMpIHtcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZXZlbnRJZCwge1xuICAgICAgICAgICAgZGV0YWlsOiBtZXNzYWdlcyxcbiAgICAgICAgfSkpO1xuICAgIH1cbiAgICBjb25zdCBldmVudElkID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWV2ZW50LWlkXCIpO1xuICAgIGNvbnN0IHRlc3RpbmcgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LmdldEF0dHJpYnV0ZShcImRhdGEtdGVzdGluZ1wiKTtcbiAgICBjb25zdCBpbnN0cnVtZW50SlMgPSBnZXRJbnN0cnVtZW50SlMoZXZlbnRJZCwgc2VuZE1lc3NhZ2VzVG9Mb2dnZXIpO1xuICAgIGxldCB0MDtcbiAgICBpZiAodGVzdGluZyA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJPcGVuV1BNOiBDdXJyZW50bHkgdGVzdGluZ1wiKTtcbiAgICAgICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJCZWdpbiBsb2FkaW5nIEpTIGluc3RydW1lbnRhdGlvbi5cIik7XG4gICAgfVxuICAgIGluc3RydW1lbnRKUyhqc0luc3RydW1lbnRhdGlvblNldHRpbmdzKTtcbiAgICBpZiAodGVzdGluZyA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgY29uc3QgdDEgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgY29uc29sZS5sb2coYENhbGwgdG8gaW5zdHJ1bWVudEpTIHRvb2sgJHt0MSAtIHQwfSBtaWxsaXNlY29uZHMuYCk7XG4gICAgICAgIHdpbmRvdy5pbnN0cnVtZW50SlMgPSBpbnN0cnVtZW50SlM7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiT3BlbldQTTogQ29udGVudC1zaWRlIGphdmFzY3JpcHQgaW5zdHJ1bWVudGF0aW9uIHN0YXJ0ZWQgd2l0aCBzcGVjOlwiLCBqc0luc3RydW1lbnRhdGlvblNldHRpbmdzLCBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIFwiKGlmIHNwZWMgaXMgJzx1bmF2YWlsYWJsZT4nIGNoZWNrIHdlYiBjb25zb2xlLilcIik7XG4gICAgfVxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWFtRjJZWE5qY21sd2RDMXBibk4wY25WdFpXNTBMWEJoWjJVdGMyTnZjR1V1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sY3lJNld5SXVMaTh1TGk4dUxpOXpjbU12WTI5dWRHVnVkQzlxWVhaaGMyTnlhWEIwTFdsdWMzUnlkVzFsYm5RdGNHRm5aUzF6WTI5d1pTNTBjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4eFJVRkJjVVU3UVVGRGNrVXNlVVZCUVhsRk8wRkJRM3BGTERKRFFVRXlRenRCUVVVelF5eE5RVUZOTEVOQlFVTXNUVUZCVFN4VlFVRlZMRWRCUVVjc1ZVRkJVeXhsUVVGbExFVkJRVVVzZVVKQlFYbENPMGxCUXpORkxDdENRVUVyUWp0SlFVTXZRaXhUUVVGVExHOUNRVUZ2UWl4RFFVRkRMRTlCUVU4c1JVRkJSU3hSUVVGUk8xRkJRemRETEZGQlFWRXNRMEZCUXl4aFFVRmhMRU5CUTNCQ0xFbEJRVWtzVjBGQlZ5eERRVUZETEU5QlFVOHNSVUZCUlR0WlFVTjJRaXhOUVVGTkxFVkJRVVVzVVVGQlVUdFRRVU5xUWl4RFFVRkRMRU5CUTBnc1EwRkJRenRKUVVOS0xFTkJRVU03U1VGRlJDeE5RVUZOTEU5QlFVOHNSMEZCUnl4UlFVRlJMRU5CUVVNc1lVRkJZU3hEUVVGRExGbEJRVmtzUTBGQlF5eGxRVUZsTEVOQlFVTXNRMEZCUXp0SlFVTnlSU3hOUVVGTkxFOUJRVThzUjBGQlJ5eFJRVUZSTEVOQlFVTXNZVUZCWVN4RFFVRkRMRmxCUVZrc1EwRkJReXhqUVVGakxFTkJRVU1zUTBGQlF6dEpRVU53UlN4TlFVRk5MRmxCUVZrc1IwRkJSeXhsUVVGbExFTkJRVU1zVDBGQlR5eEZRVUZGTEc5Q1FVRnZRaXhEUVVGRExFTkJRVU03U1VGRGNFVXNTVUZCU1N4RlFVRlZMRU5CUVVNN1NVRkRaaXhKUVVGSkxFOUJRVThzUzBGQlN5eE5RVUZOTEVWQlFVVTdVVUZEZEVJc1QwRkJUeXhEUVVGRExFZEJRVWNzUTBGQlF5dzBRa0ZCTkVJc1EwRkJReXhEUVVGRE8xRkJRekZETEVWQlFVVXNSMEZCUnl4WFFVRlhMRU5CUVVNc1IwRkJSeXhGUVVGRkxFTkJRVU03VVVGRGRrSXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXh0UTBGQmJVTXNRMEZCUXl4RFFVRkRPMHRCUTJ4RU8wbEJRMFFzV1VGQldTeERRVUZETEhsQ1FVRjVRaXhEUVVGRExFTkJRVU03U1VGRGVFTXNTVUZCU1N4UFFVRlBMRXRCUVVzc1RVRkJUU3hGUVVGRk8xRkJRM1JDTEUxQlFVMHNSVUZCUlN4SFFVRkhMRmRCUVZjc1EwRkJReXhIUVVGSExFVkJRVVVzUTBGQlF6dFJRVU0zUWl4UFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExEWkNRVUUyUWl4RlFVRkZMRWRCUVVjc1JVRkJSU3huUWtGQlowSXNRMEZCUXl4RFFVRkRPMUZCUTJwRkxFMUJRV01zUTBGQlF5eFpRVUZaTEVkQlFVY3NXVUZCV1N4RFFVRkRPMUZCUXpWRExFOUJRVThzUTBGQlF5eEhRVUZITEVOQlExUXNjVVZCUVhGRkxFVkJRM0pGTEhsQ1FVRjVRaXhGUVVONlFpeEpRVUZKTEVsQlFVa3NSVUZCUlN4RFFVRkRMRmRCUVZjc1JVRkJSU3hGUVVONFFpeHBSRUZCYVVRc1EwRkRiRVFzUTBGQlF6dExRVU5JTzBGQlEwZ3NRMEZCUXl4RFFVRkRJbjA9IiwiZXhwb3J0ICogZnJvbSBcIi4vYmFja2dyb3VuZC9jb29raWUtaW5zdHJ1bWVudFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vYmFja2dyb3VuZC9odHRwLWluc3RydW1lbnRcIjtcbmV4cG9ydCAqIGZyb20gXCIuL2JhY2tncm91bmQvamF2YXNjcmlwdC1pbnN0cnVtZW50XCI7XG5leHBvcnQgKiBmcm9tIFwiLi9iYWNrZ3JvdW5kL25hdmlnYXRpb24taW5zdHJ1bWVudFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vY29udGVudC9qYXZhc2NyaXB0LWluc3RydW1lbnQtY29udGVudC1zY29wZVwiO1xuZXhwb3J0ICogZnJvbSBcIi4vbGliL2h0dHAtcG9zdC1wYXJzZXJcIjtcbmV4cG9ydCAqIGZyb20gXCIuL2xpYi9zdHJpbmctdXRpbHNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL3NjaGVtYVwiO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pYVc1a1pYZ3Vhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdUxpOHVMaTl6Y21NdmFXNWtaWGd1ZEhNaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNZMEZCWXl4blEwRkJaME1zUTBGQlF6dEJRVU12UXl4alFVRmpMRGhDUVVFNFFpeERRVUZETzBGQlF6ZERMR05CUVdNc2IwTkJRVzlETEVOQlFVTTdRVUZEYmtRc1kwRkJZeXh2UTBGQmIwTXNRMEZCUXp0QlFVTnVSQ3hqUVVGakxDdERRVUVyUXl4RFFVRkRPMEZCUXpsRUxHTkJRV01zZDBKQlFYZENMRU5CUVVNN1FVRkRka01zWTBGQll5eHZRa0ZCYjBJc1EwRkJRenRCUVVOdVF5eGpRVUZqTEZWQlFWVXNRMEZCUXlKOSIsIi8qKlxuICogVGhpcyBlbmFibGVzIHVzIHRvIGtlZXAgaW5mb3JtYXRpb24gYWJvdXQgdGhlIG9yaWdpbmFsIG9yZGVyXG4gKiBpbiB3aGljaCBldmVudHMgYXJyaXZlZCB0byBvdXIgZXZlbnQgbGlzdGVuZXJzLlxuICovXG5sZXQgZXZlbnRPcmRpbmFsID0gMDtcbmV4cG9ydCBjb25zdCBpbmNyZW1lbnRlZEV2ZW50T3JkaW5hbCA9ICgpID0+IHtcbiAgICByZXR1cm4gZXZlbnRPcmRpbmFsKys7XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pWlhoMFpXNXphVzl1TFhObGMzTnBiMjR0WlhabGJuUXRiM0prYVc1aGJDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMeTR1TDNOeVl5OXNhV0l2WlhoMFpXNXphVzl1TFhObGMzTnBiMjR0WlhabGJuUXRiM0prYVc1aGJDNTBjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVRzN08wZEJSMGM3UVVGRFNDeEpRVUZKTEZsQlFWa3NSMEZCUnl4RFFVRkRMRU5CUVVNN1FVRkZja0lzVFVGQlRTeERRVUZETEUxQlFVMHNkVUpCUVhWQ0xFZEJRVWNzUjBGQlJ5eEZRVUZGTzBsQlF6RkRMRTlCUVU4c1dVRkJXU3hGUVVGRkxFTkJRVU03UVVGRGVFSXNRMEZCUXl4RFFVRkRJbjA9IiwiaW1wb3J0IHsgbWFrZVVVSUQgfSBmcm9tIFwiLi91dWlkXCI7XG4vKipcbiAqIFRoaXMgZW5hYmxlcyB1cyB0byBhY2Nlc3MgYSB1bmlxdWUgcmVmZXJlbmNlIHRvIHRoaXMgYnJvd3NlclxuICogc2Vzc2lvbiAtIHJlZ2VuZXJhdGVkIGFueSB0aW1lIHRoZSBiYWNrZ3JvdW5kIHByb2Nlc3MgZ2V0c1xuICogcmVzdGFydGVkICh3aGljaCBzaG91bGQgb25seSBiZSBvbiBicm93c2VyIHJlc3RhcnRzKVxuICovXG5leHBvcnQgY29uc3QgZXh0ZW5zaW9uU2Vzc2lvblV1aWQgPSBtYWtlVVVJRCgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pWlhoMFpXNXphVzl1TFhObGMzTnBiMjR0ZFhWcFpDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMeTR1TDNOeVl5OXNhV0l2WlhoMFpXNXphVzl1TFhObGMzTnBiMjR0ZFhWcFpDNTBjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4UFFVRlBMRVZCUVVVc1VVRkJVU3hGUVVGRkxFMUJRVTBzVVVGQlVTeERRVUZETzBGQlJXeERPenM3TzBkQlNVYzdRVUZEU0N4TlFVRk5MRU5CUVVNc1RVRkJUU3h2UWtGQmIwSXNSMEZCUnl4UlFVRlJMRVZCUVVVc1EwRkJReUo5IiwiLy8gSW5jb3Jwb3JhdGVzIGNvZGUgZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL3JlZGxpbmUxMy9zZWxlbml1bS1qbWV0ZXIvYmxvYi82OTY2ZDRiMzI2Y2Q3ODI2MWUzMWU2ZTMxNzA3NjU2OTA1MWNhYzM3L2NvbnRlbnQvbGlicmFyeS9yZWNvcmRlci9IdHRwUG9zdFBhcnNlci5qc1xuLy8gaW1wb3J0IHsgZXNjYXBlU3RyaW5nLCBlc2NhcGVVcmwgfSBmcm9tIFwiLi9zdHJpbmctdXRpbHNcIjtcbmltcG9ydCB7IGVzY2FwZVN0cmluZywgVWludDhUb0Jhc2U2NCB9IGZyb20gXCIuL3N0cmluZy11dGlsc1wiO1xuZXhwb3J0IGNsYXNzIEh0dHBQb3N0UGFyc2VyIHtcbiAgICAvKlxuICAgIHByaXZhdGUgaGFzaGVhZGVyczogYm9vbGVhbjtcbiAgICBwcml2YXRlIHNlZWthYmxlc3RyZWFtO1xuICAgIHByaXZhdGUgc3RyZWFtO1xuICAgIHByaXZhdGUgcG9zdEJvZHk7XG4gICAgcHJpdmF0ZSBwb3N0TGluZXM7XG4gICAgcHJpdmF0ZSBwb3N0SGVhZGVycztcbiAgICBwcml2YXRlIGJvZHk7XG4gICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAvLyBvbkJlZm9yZVNlbmRIZWFkZXJzRXZlbnREZXRhaWxzOiBXZWJSZXF1ZXN0T25CZWZvcmVTZW5kSGVhZGVyc0V2ZW50RGV0YWlscyxcbiAgICBvbkJlZm9yZVJlcXVlc3RFdmVudERldGFpbHMsIGRhdGFSZWNlaXZlcikge1xuICAgICAgICAvLyB0aGlzLm9uQmVmb3JlU2VuZEhlYWRlcnNFdmVudERldGFpbHMgPSBvbkJlZm9yZVNlbmRIZWFkZXJzRXZlbnREZXRhaWxzO1xuICAgICAgICB0aGlzLm9uQmVmb3JlUmVxdWVzdEV2ZW50RGV0YWlscyA9IG9uQmVmb3JlUmVxdWVzdEV2ZW50RGV0YWlscztcbiAgICAgICAgdGhpcy5kYXRhUmVjZWl2ZXIgPSBkYXRhUmVjZWl2ZXI7XG4gICAgICAgIC8qXG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgIFwiSHR0cFBvc3RQYXJzZXJcIixcbiAgICAgICAgICAvLyBvbkJlZm9yZVNlbmRIZWFkZXJzRXZlbnREZXRhaWxzLFxuICAgICAgICAgIG9uQmVmb3JlUmVxdWVzdEV2ZW50RGV0YWlscyxcbiAgICAgICAgKTtcbiAgICAgICAgKi9cbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIGVuY29kaW5nVHlwZSBmcm9tIHRoZSBIVFRQIFJlcXVlc3QgaGVhZGVyc1xuICAgICAqL1xuICAgIHBhcnNlUG9zdFJlcXVlc3QoIC8qZW5jb2RpbmdUeXBlKi8pIHtcbiAgICAgICAgLy8gY29uc3QgcmVxdWVzdEhlYWRlcnMgPSB0aGlzLm9uQmVmb3JlU2VuZEhlYWRlcnNFdmVudERldGFpbHMucmVxdWVzdEhlYWRlcnM7XG4gICAgICAgIGNvbnN0IHJlcXVlc3RCb2R5ID0gdGhpcy5vbkJlZm9yZVJlcXVlc3RFdmVudERldGFpbHMucmVxdWVzdEJvZHk7XG4gICAgICAgIGlmIChyZXF1ZXN0Qm9keS5lcnJvcikge1xuICAgICAgICAgICAgdGhpcy5kYXRhUmVjZWl2ZXIubG9nRXJyb3IoXCJFeGNlcHRpb246IFVwc3RyZWFtIGZhaWxlZCB0byBwYXJzZSBQT1NUOiBcIiArIHJlcXVlc3RCb2R5LmVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVxdWVzdEJvZHkuZm9ybURhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETzogcmVxdWVzdEJvZHkuZm9ybURhdGEgc2hvdWxkIHByb2JhYmx5IGJlIHRyYW5zZm9ybWVkIGludG8gYW5vdGhlciBmb3JtYXRcbiAgICAgICAgICAgICAgICBwb3N0X2JvZHk6IGVzY2FwZVN0cmluZyhKU09OLnN0cmluZ2lmeShyZXF1ZXN0Qm9keS5mb3JtRGF0YSkpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVxdWVzdEJvZHkucmF3KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHBvc3RfYm9keV9yYXc6IEpTT04uc3RyaW5naWZ5KHJlcXVlc3RCb2R5LnJhdy5tYXAoeCA9PiBbXG4gICAgICAgICAgICAgICAgICAgIHguZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgVWludDhUb0Jhc2U2NChuZXcgVWludDhBcnJheSh4LmJ5dGVzKSksXG4gICAgICAgICAgICAgICAgXSkpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZXR1cm4gZW1wdHkgcmVzcG9uc2UgdW50aWwgd2UgaGF2ZSBhbGwgaW5zdHJ1bWVudGF0aW9uIGNvbnZlcnRlZFxuICAgICAgICByZXR1cm4ge307XG4gICAgICAgIC8qXG4gICAgICAgIHRoaXMuZGF0YVJlY2VpdmVyLmxvZ0RlYnVnKFxuICAgICAgICAgIFwiRXhjZXB0aW9uOiBJbnN0cnVtZW50YXRpb24gdG8gcGFyc2UgUE9TVCByZXF1ZXN0cyB3aXRob3V0IGZvcm1EYXRhIGlzIG5vdCB5ZXQgcmVzdG9yZWRcIixcbiAgICAgICAgKTtcbiAgICBcbiAgICAgICAgLy8gVE9ETzogUmVmYWN0b3IgdG8gY29ycmVzcG9uZGluZyB3ZWJleHQgbG9naWMgb3IgZGlzY2FyZFxuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMuc2V0dXBTdHJlYW0oKTtcbiAgICAgICAgICB0aGlzLnBhcnNlU3RyZWFtKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICB0aGlzLmRhdGFSZWNlaXZlci5sb2dFcnJvcihcIkV4Y2VwdGlvbjogRmFpbGVkIHRvIHBhcnNlIFBPU1Q6IFwiICsgZSk7XG4gICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGNvbnN0IHBvc3RCb2R5ID0gdGhpcy5wb3N0Qm9keTtcbiAgICBcbiAgICAgICAgaWYgKCFwb3N0Qm9keSkge1xuICAgICAgICAgIC8vIHNvbWUgc2NyaXB0cyBzdHJhbmdlbHkgc2VuZHMgZW1wdHkgcG9zdCBib2RpZXMgKGNvbmZpcm1lZCB3aXRoIHRoZSBkZXZlbG9wZXIgdG9vbHMpXG4gICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGxldCBpc011bHRpUGFydCA9IGZhbHNlOyAvLyBlbmNUeXBlOiBtdWx0aXBhcnQvZm9ybS1kYXRhXG4gICAgICAgIGNvbnN0IHBvc3RIZWFkZXJzID0gdGhpcy5wb3N0SGVhZGVyczsgLy8gcmVxdWVzdCBoZWFkZXJzIGZyb20gdXBsb2FkIHN0cmVhbVxuICAgICAgICAvLyBTZWUsIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTY1NDg1MTcvd2hhdC1pcy1yZXF1ZXN0LWhlYWRlcnMtZnJvbS11cGxvYWQtc3RyZWFtXG4gICAgXG4gICAgICAgIC8vIGFkZCBlbmNvZGluZ1R5cGUgZnJvbSBwb3N0SGVhZGVycyBpZiBpdCdzIG1pc3NpbmdcbiAgICAgICAgaWYgKCFlbmNvZGluZ1R5cGUgJiYgcG9zdEhlYWRlcnMgJiYgXCJDb250ZW50LVR5cGVcIiBpbiBwb3N0SGVhZGVycykge1xuICAgICAgICAgIGVuY29kaW5nVHlwZSA9IHBvc3RIZWFkZXJzW1wiQ29udGVudC1UeXBlXCJdO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGlmIChlbmNvZGluZ1R5cGUuaW5kZXhPZihcIm11bHRpcGFydC9mb3JtLWRhdGFcIikgIT09IC0xKSB7XG4gICAgICAgICAgaXNNdWx0aVBhcnQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGxldCBqc29uUG9zdERhdGEgPSBcIlwiO1xuICAgICAgICBsZXQgZXNjYXBlZEpzb25Qb3N0RGF0YSA9IFwiXCI7XG4gICAgICAgIGlmIChpc011bHRpUGFydCkge1xuICAgICAgICAgIGpzb25Qb3N0RGF0YSA9IHRoaXMucGFyc2VNdWx0aVBhcnREYXRhKHBvc3RCb2R5IC8qLCBlbmNvZGluZ1R5cGUqIC8pO1xuICAgICAgICAgIGVzY2FwZWRKc29uUG9zdERhdGEgPSBlc2NhcGVTdHJpbmcoanNvblBvc3REYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBqc29uUG9zdERhdGEgPSB0aGlzLnBhcnNlRW5jb2RlZEZvcm1EYXRhKHBvc3RCb2R5LCBlbmNvZGluZ1R5cGUpO1xuICAgICAgICAgIGVzY2FwZWRKc29uUG9zdERhdGEgPSBlc2NhcGVTdHJpbmcoanNvblBvc3REYXRhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBwb3N0X2hlYWRlcnM6IHBvc3RIZWFkZXJzLCBwb3N0X2JvZHk6IGVzY2FwZWRKc29uUG9zdERhdGEgfTtcbiAgICAgICAgKi9cbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lhSFIwY0Mxd2IzTjBMWEJoY25ObGNpNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMeTR1TDNOeVl5OXNhV0l2YUhSMGNDMXdiM04wTFhCaGNuTmxjaTUwY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeG5TMEZCWjBzN1FVRk5hRXNzTkVSQlFUUkVPMEZCUlRWRUxFOUJRVThzUlVGQlJTeFpRVUZaTEVWQlFVVXNZVUZCWVN4RlFVRkZMRTFCUVUwc1owSkJRV2RDTEVOQlFVTTdRVUZWTjBRc1RVRkJUU3hQUVVGUExHTkJRV003U1VGSmVrSTdPenM3T3pzN08wMUJVVVU3U1VGRlJqdEpRVU5GTERoRlFVRTRSVHRKUVVNNVJTd3lRa0ZCYTBVc1JVRkRiRVVzV1VGQldUdFJRVVZhTERCRlFVRXdSVHRSUVVNeFJTeEpRVUZKTEVOQlFVTXNNa0pCUVRKQ0xFZEJRVWNzTWtKQlFUSkNMRU5CUVVNN1VVRkRMMFFzU1VGQlNTeERRVUZETEZsQlFWa3NSMEZCUnl4WlFVRlpMRU5CUVVNN1VVRkRha003T3pzN096dFZRVTFGTzBsQlEwb3NRMEZCUXp0SlFVVkVPenRQUVVWSE8wbEJRMGtzWjBKQlFXZENMRVZCUVVNc1owSkJRV2RDTzFGQlEzUkRMRGhGUVVFNFJUdFJRVU01UlN4TlFVRk5MRmRCUVZjc1IwRkJSeXhKUVVGSkxFTkJRVU1zTWtKQlFUSkNMRU5CUVVNc1YwRkJWeXhEUVVGRE8xRkJRMnBGTEVsQlFVa3NWMEZCVnl4RFFVRkRMRXRCUVVzc1JVRkJSVHRaUVVOeVFpeEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRkZCUVZFc1EwRkRlRUlzTkVOQlFUUkRMRWRCUVVjc1YwRkJWeXhEUVVGRExFdEJRVXNzUTBGRGFrVXNRMEZCUXp0VFFVTklPMUZCUTBRc1NVRkJTU3hYUVVGWExFTkJRVU1zVVVGQlVTeEZRVUZGTzFsQlEzaENMRTlCUVU4N1owSkJRMHdzWjBaQlFXZEdPMmRDUVVOb1JpeFRRVUZUTEVWQlFVVXNXVUZCV1N4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zVjBGQlZ5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMkZCUXpsRUxFTkJRVU03VTBGRFNEdFJRVU5FTEVsQlFVa3NWMEZCVnl4RFFVRkRMRWRCUVVjc1JVRkJSVHRaUVVOdVFpeFBRVUZQTzJkQ1FVTk1MR0ZCUVdFc1JVRkJSU3hKUVVGSkxFTkJRVU1zVTBGQlV5eERRVU16UWl4WFFVRlhMRU5CUVVNc1IwRkJSeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNSVUZCUlN4RFFVRkRPMjlDUVVOMlFpeERRVUZETEVOQlFVTXNTVUZCU1R0dlFrRkRUaXhoUVVGaExFTkJRVU1zU1VGQlNTeFZRVUZWTEVOQlFVTXNRMEZCUXl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE8ybENRVU4yUXl4RFFVRkRMRU5CUTBnN1lVRkRSaXhEUVVGRE8xTkJRMGc3VVVGRlJDeHZSVUZCYjBVN1VVRkRjRVVzVDBGQlR5eEZRVUZGTEVOQlFVTTdVVUZEVmpzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3VlVFMFEwVTdTVUZEU2l4RFFVRkRPME5CTWxSR0luMD0iLCIvLyBJbnRydW1lbnRhdGlvbiBpbmplY3Rpb24gY29kZSBpcyBiYXNlZCBvbiBwcml2YWN5YmFkZ2VyZmlyZWZveFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL0VGRm9yZy9wcml2YWN5YmFkZ2VyZmlyZWZveC9ibG9iL21hc3Rlci9kYXRhL2ZpbmdlcnByaW50aW5nLmpzXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5zdHJ1bWVudEpTKGV2ZW50SWQsIHNlbmRNZXNzYWdlc1RvTG9nZ2VyKSB7XG4gICAgLypcbiAgICAgKiBJbnN0cnVtZW50YXRpb24gaGVscGVyc1xuICAgICAqIChJbmxpbmVkIGluIG9yZGVyIGZvciBqc0luc3RydW1lbnRzIHRvIGJlIGVhc2lseSBleHBvcnRhYmxlIGFzIGEgc3RyaW5nKVxuICAgICAqL1xuICAgIC8vIENvdW50ZXIgdG8gY2FwICMgb2YgY2FsbHMgbG9nZ2VkIGZvciBlYWNoIHNjcmlwdC9hcGkgY29tYmluYXRpb25cbiAgICBjb25zdCBtYXhMb2dDb3VudCA9IDUwMDtcbiAgICAvLyBsb2dDb3VudGVyXG4gICAgY29uc3QgbG9nQ291bnRlciA9IG5ldyBPYmplY3QoKTtcbiAgICAvLyBQcmV2ZW50IGxvZ2dpbmcgb2YgZ2V0cyBhcmlzaW5nIGZyb20gbG9nZ2luZ1xuICAgIGxldCBpbkxvZyA9IGZhbHNlO1xuICAgIC8vIFRvIGtlZXAgdHJhY2sgb2YgdGhlIG9yaWdpbmFsIG9yZGVyIG9mIGV2ZW50c1xuICAgIGxldCBvcmRpbmFsID0gMDtcbiAgICAvLyBPcHRpb25zIGZvciBKU09wZXJhdGlvblxuICAgIGNvbnN0IEpTT3BlcmF0aW9uID0ge1xuICAgICAgICBjYWxsOiBcImNhbGxcIixcbiAgICAgICAgZ2V0OiBcImdldFwiLFxuICAgICAgICBnZXRfZmFpbGVkOiBcImdldChmYWlsZWQpXCIsXG4gICAgICAgIGdldF9mdW5jdGlvbjogXCJnZXQoZnVuY3Rpb24pXCIsXG4gICAgICAgIHNldDogXCJzZXRcIixcbiAgICAgICAgc2V0X2ZhaWxlZDogXCJzZXQoZmFpbGVkKVwiLFxuICAgICAgICBzZXRfcHJldmVudGVkOiBcInNldChwcmV2ZW50ZWQpXCIsXG4gICAgfTtcbiAgICAvLyBSb3VnaCBpbXBsZW1lbnRhdGlvbnMgb2YgT2JqZWN0LmdldFByb3BlcnR5RGVzY3JpcHRvciBhbmQgT2JqZWN0LmdldFByb3BlcnR5TmFtZXNcbiAgICAvLyBTZWUgaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTpleHRlbmRlZF9vYmplY3RfYXBpXG4gICAgT2JqZWN0LmdldFByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uIChzdWJqZWN0LCBuYW1lKSB7XG4gICAgICAgIGlmIChzdWJqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IGdldCBwcm9wZXJ0eSBkZXNjcmlwdG9yIGZvciB1bmRlZmluZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBkID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzdWJqZWN0LCBuYW1lKTtcbiAgICAgICAgbGV0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHN1YmplY3QpO1xuICAgICAgICB3aGlsZSAocGQgPT09IHVuZGVmaW5lZCAmJiBwcm90byAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcGQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCBuYW1lKTtcbiAgICAgICAgICAgIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGQ7XG4gICAgfTtcbiAgICBPYmplY3QuZ2V0UHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIChzdWJqZWN0KSB7XG4gICAgICAgIGlmIChzdWJqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IGdldCBwcm9wZXJ0eSBuYW1lcyBmb3IgdW5kZWZpbmVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwcm9wcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHN1YmplY3QpO1xuICAgICAgICBsZXQgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yoc3ViamVjdCk7XG4gICAgICAgIHdoaWxlIChwcm90byAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcHJvcHMgPSBwcm9wcy5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMocHJvdG8pKTtcbiAgICAgICAgICAgIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGSVhNRTogcmVtb3ZlIGR1cGxpY2F0ZSBwcm9wZXJ0eSBuYW1lcyBmcm9tIHByb3BzXG4gICAgICAgIHJldHVybiBwcm9wcztcbiAgICB9O1xuICAgIC8vIGRlYm91bmNlIC0gZnJvbSBVbmRlcnNjb3JlIHYxLjYuMFxuICAgIGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSA9IGZhbHNlKSB7XG4gICAgICAgIGxldCB0aW1lb3V0LCBhcmdzLCBjb250ZXh0LCB0aW1lc3RhbXAsIHJlc3VsdDtcbiAgICAgICAgY29uc3QgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCBsYXN0ID0gRGF0ZS5ub3coKSAtIHRpbWVzdGFtcDtcbiAgICAgICAgICAgIGlmIChsYXN0IDwgd2FpdCkge1xuICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0IC0gbGFzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoIWltbWVkaWF0ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIGNvbnN0IGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICAgICAgICBpZiAoIXRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2FsbE5vdykge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLy8gUmVjdXJzaXZlbHkgZ2VuZXJhdGVzIGEgcGF0aCBmb3IgYW4gZWxlbWVudFxuICAgIGZ1bmN0aW9uIGdldFBhdGhUb0RvbUVsZW1lbnQoZWxlbWVudCwgdmlzaWJpbGl0eUF0dHIgPSBmYWxzZSkge1xuICAgICAgICBpZiAoZWxlbWVudCA9PT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQudGFnTmFtZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJOVUxML1wiICsgZWxlbWVudC50YWdOYW1lO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzaWJsaW5nSW5kZXggPSAxO1xuICAgICAgICBjb25zdCBzaWJsaW5ncyA9IGVsZW1lbnQucGFyZW50Tm9kZS5jaGlsZE5vZGVzO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpYmxpbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBzaWJsaW5nID0gc2libGluZ3NbaV07XG4gICAgICAgICAgICBpZiAoc2libGluZyA9PT0gZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGxldCBwYXRoID0gZ2V0UGF0aFRvRG9tRWxlbWVudChlbGVtZW50LnBhcmVudE5vZGUsIHZpc2liaWxpdHlBdHRyKTtcbiAgICAgICAgICAgICAgICBwYXRoICs9IFwiL1wiICsgZWxlbWVudC50YWdOYW1lICsgXCJbXCIgKyBzaWJsaW5nSW5kZXg7XG4gICAgICAgICAgICAgICAgcGF0aCArPSBcIixcIiArIGVsZW1lbnQuaWQ7XG4gICAgICAgICAgICAgICAgcGF0aCArPSBcIixcIiArIGVsZW1lbnQuY2xhc3NOYW1lO1xuICAgICAgICAgICAgICAgIGlmICh2aXNpYmlsaXR5QXR0cikge1xuICAgICAgICAgICAgICAgICAgICBwYXRoICs9IFwiLFwiICsgZWxlbWVudC5oaWRkZW47XG4gICAgICAgICAgICAgICAgICAgIHBhdGggKz0gXCIsXCIgKyBlbGVtZW50LnN0eWxlLmRpc3BsYXk7XG4gICAgICAgICAgICAgICAgICAgIHBhdGggKz0gXCIsXCIgKyBlbGVtZW50LnN0eWxlLnZpc2liaWxpdHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnRhZ05hbWUgPT09IFwiQVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGggKz0gXCIsXCIgKyBlbGVtZW50LmhyZWY7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBhdGggKz0gXCJdXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2libGluZy5ub2RlVHlwZSA9PT0gMSAmJiBzaWJsaW5nLnRhZ05hbWUgPT09IGVsZW1lbnQudGFnTmFtZSkge1xuICAgICAgICAgICAgICAgIHNpYmxpbmdJbmRleCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEhlbHBlciBmb3IgSlNPTmlmeWluZyBvYmplY3RzXG4gICAgZnVuY3Rpb24gc2VyaWFsaXplT2JqZWN0KG9iamVjdCwgc3RyaW5naWZ5RnVuY3Rpb25zID0gZmFsc2UpIHtcbiAgICAgICAgLy8gSGFuZGxlIHBlcm1pc3Npb25zIGVycm9yc1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKG9iamVjdCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RyaW5naWZ5RnVuY3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmplY3QudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkZVTkNUSU9OXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgc2Vlbk9iamVjdHMgPSBbXTtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmplY3QsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdHJpbmdpZnlGdW5jdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiRlVOQ1RJT05cIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB3cmFwcGluZyBvbiBjb250ZW50IG9iamVjdHNcbiAgICAgICAgICAgICAgICAgICAgaWYgKFwid3JhcHBlZEpTT2JqZWN0XCIgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUud3JhcHBlZEpTT2JqZWN0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIFNlcmlhbGl6ZSBET00gZWxlbWVudHNcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRQYXRoVG9Eb21FbGVtZW50KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBQcmV2ZW50IHNlcmlhbGl6YXRpb24gY3ljbGVzXG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IFwiXCIgfHwgc2Vlbk9iamVjdHMuaW5kZXhPZih2YWx1ZSkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWVuT2JqZWN0cy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk9wZW5XUE06IFNFUklBTElaQVRJT04gRVJST1I6IFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIFwiU0VSSUFMSVpBVElPTiBFUlJPUjogXCIgKyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiB1cGRhdGVDb3VudGVyQW5kQ2hlY2tJZk92ZXIoc2NyaXB0VXJsLCBzeW1ib2wpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gc2NyaXB0VXJsICsgXCJ8XCIgKyBzeW1ib2w7XG4gICAgICAgIGlmIChrZXkgaW4gbG9nQ291bnRlciAmJiBsb2dDb3VudGVyW2tleV0gPj0gbWF4TG9nQ291bnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCEoa2V5IGluIGxvZ0NvdW50ZXIpKSB7XG4gICAgICAgICAgICBsb2dDb3VudGVyW2tleV0gPSAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbG9nQ291bnRlcltrZXldICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBGb3IgZ2V0cywgc2V0cywgZXRjLiBvbiBhIHNpbmdsZSB2YWx1ZVxuICAgIGZ1bmN0aW9uIGxvZ1ZhbHVlKGluc3RydW1lbnRlZFZhcmlhYmxlTmFtZSwgdmFsdWUsIG9wZXJhdGlvbiwgLy8gZnJvbSBKU09wZXJhdGlvbiBvYmplY3QgcGxlYXNlXG4gICAgY2FsbENvbnRleHQsIGxvZ1NldHRpbmdzKSB7XG4gICAgICAgIGlmIChpbkxvZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGluTG9nID0gdHJ1ZTtcbiAgICAgICAgY29uc3Qgb3ZlckxpbWl0ID0gdXBkYXRlQ291bnRlckFuZENoZWNrSWZPdmVyKGNhbGxDb250ZXh0LnNjcmlwdFVybCwgaW5zdHJ1bWVudGVkVmFyaWFibGVOYW1lKTtcbiAgICAgICAgaWYgKG92ZXJMaW1pdCkge1xuICAgICAgICAgICAgaW5Mb2cgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtc2cgPSB7XG4gICAgICAgICAgICBvcGVyYXRpb24sXG4gICAgICAgICAgICBzeW1ib2w6IGluc3RydW1lbnRlZFZhcmlhYmxlTmFtZSxcbiAgICAgICAgICAgIHZhbHVlOiBzZXJpYWxpemVPYmplY3QodmFsdWUsIGxvZ1NldHRpbmdzLmxvZ0Z1bmN0aW9uc0FzU3RyaW5ncyksXG4gICAgICAgICAgICBzY3JpcHRVcmw6IGNhbGxDb250ZXh0LnNjcmlwdFVybCxcbiAgICAgICAgICAgIHNjcmlwdExpbmU6IGNhbGxDb250ZXh0LnNjcmlwdExpbmUsXG4gICAgICAgICAgICBzY3JpcHRDb2w6IGNhbGxDb250ZXh0LnNjcmlwdENvbCxcbiAgICAgICAgICAgIGZ1bmNOYW1lOiBjYWxsQ29udGV4dC5mdW5jTmFtZSxcbiAgICAgICAgICAgIHNjcmlwdExvY0V2YWw6IGNhbGxDb250ZXh0LnNjcmlwdExvY0V2YWwsXG4gICAgICAgICAgICBjYWxsU3RhY2s6IGNhbGxDb250ZXh0LmNhbGxTdGFjayxcbiAgICAgICAgICAgIG9yZGluYWw6IG9yZGluYWwrKyxcbiAgICAgICAgfTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNlbmQoXCJsb2dWYWx1ZVwiLCBtc2cpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJPcGVuV1BNOiBVbnN1Y2Nlc3NmdWwgdmFsdWUgbG9nIVwiKTtcbiAgICAgICAgICAgIGxvZ0Vycm9yVG9Db25zb2xlKGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICBpbkxvZyA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBGb3IgZnVuY3Rpb25zXG4gICAgZnVuY3Rpb24gbG9nQ2FsbChpbnN0cnVtZW50ZWRGdW5jdGlvbk5hbWUsIGFyZ3MsIGNhbGxDb250ZXh0LCBsb2dTZXR0aW5ncykge1xuICAgICAgICBpZiAoaW5Mb2cpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpbkxvZyA9IHRydWU7XG4gICAgICAgIGNvbnN0IG92ZXJMaW1pdCA9IHVwZGF0ZUNvdW50ZXJBbmRDaGVja0lmT3ZlcihjYWxsQ29udGV4dC5zY3JpcHRVcmwsIGluc3RydW1lbnRlZEZ1bmN0aW9uTmFtZSk7XG4gICAgICAgIGlmIChvdmVyTGltaXQpIHtcbiAgICAgICAgICAgIGluTG9nID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIENvbnZlcnQgc3BlY2lhbCBhcmd1bWVudHMgYXJyYXkgdG8gYSBzdGFuZGFyZCBhcnJheSBmb3IgSlNPTmlmeWluZ1xuICAgICAgICAgICAgY29uc3Qgc2VyaWFsQXJncyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xuICAgICAgICAgICAgICAgIHNlcmlhbEFyZ3MucHVzaChzZXJpYWxpemVPYmplY3QoYXJnLCBsb2dTZXR0aW5ncy5sb2dGdW5jdGlvbnNBc1N0cmluZ3MpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG1zZyA9IHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IEpTT3BlcmF0aW9uLmNhbGwsXG4gICAgICAgICAgICAgICAgc3ltYm9sOiBpbnN0cnVtZW50ZWRGdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgYXJnczogc2VyaWFsQXJncyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogXCJcIixcbiAgICAgICAgICAgICAgICBzY3JpcHRVcmw6IGNhbGxDb250ZXh0LnNjcmlwdFVybCxcbiAgICAgICAgICAgICAgICBzY3JpcHRMaW5lOiBjYWxsQ29udGV4dC5zY3JpcHRMaW5lLFxuICAgICAgICAgICAgICAgIHNjcmlwdENvbDogY2FsbENvbnRleHQuc2NyaXB0Q29sLFxuICAgICAgICAgICAgICAgIGZ1bmNOYW1lOiBjYWxsQ29udGV4dC5mdW5jTmFtZSxcbiAgICAgICAgICAgICAgICBzY3JpcHRMb2NFdmFsOiBjYWxsQ29udGV4dC5zY3JpcHRMb2NFdmFsLFxuICAgICAgICAgICAgICAgIGNhbGxTdGFjazogY2FsbENvbnRleHQuY2FsbFN0YWNrLFxuICAgICAgICAgICAgICAgIG9yZGluYWw6IG9yZGluYWwrKyxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzZW5kKFwibG9nQ2FsbFwiLCBtc2cpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJPcGVuV1BNOiBVbnN1Y2Nlc3NmdWwgY2FsbCBsb2c6IFwiICsgaW5zdHJ1bWVudGVkRnVuY3Rpb25OYW1lKTtcbiAgICAgICAgICAgIGxvZ0Vycm9yVG9Db25zb2xlKGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICBpbkxvZyA9IGZhbHNlO1xuICAgIH1cbiAgICBmdW5jdGlvbiBsb2dFcnJvclRvQ29uc29sZShlcnJvciwgY29udGV4dCA9IGZhbHNlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJPcGVuV1BNOiBFcnJvciBuYW1lOiBcIiArIGVycm9yLm5hbWUpO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiT3BlbldQTTogRXJyb3IgbWVzc2FnZTogXCIgKyBlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIk9wZW5XUE06IEVycm9yIGZpbGVuYW1lOiBcIiArIGVycm9yLmZpbGVOYW1lKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIk9wZW5XUE06IEVycm9yIGxpbmUgbnVtYmVyOiBcIiArIGVycm9yLmxpbmVOdW1iZXIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiT3BlbldQTTogRXJyb3Igc3RhY2s6IFwiICsgZXJyb3Iuc3RhY2spO1xuICAgICAgICBpZiAoY29udGV4dCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIk9wZW5XUE06IEVycm9yIGNvbnRleHQ6IFwiICsgSlNPTi5zdHJpbmdpZnkoY29udGV4dCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEhlbHBlciB0byBnZXQgb3JpZ2luYXRpbmcgc2NyaXB0IHVybHNcbiAgICBmdW5jdGlvbiBnZXRTdGFja1RyYWNlKCkge1xuICAgICAgICBsZXQgc3RhY2s7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBzdGFjayA9IGVyci5zdGFjaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RhY2s7XG4gICAgfVxuICAgIC8vIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTIwMjE4NVxuICAgIGNvbnN0IHJzcGxpdCA9IGZ1bmN0aW9uIChzb3VyY2UsIHNlcCwgbWF4c3BsaXQpIHtcbiAgICAgICAgY29uc3Qgc3BsaXQgPSBzb3VyY2Uuc3BsaXQoc2VwKTtcbiAgICAgICAgcmV0dXJuIG1heHNwbGl0XG4gICAgICAgICAgICA/IFtzcGxpdC5zbGljZSgwLCAtbWF4c3BsaXQpLmpvaW4oc2VwKV0uY29uY2F0KHNwbGl0LnNsaWNlKC1tYXhzcGxpdCkpXG4gICAgICAgICAgICA6IHNwbGl0O1xuICAgIH07XG4gICAgZnVuY3Rpb24gZ2V0T3JpZ2luYXRpbmdTY3JpcHRDb250ZXh0KGdldENhbGxTdGFjayA9IGZhbHNlKSB7XG4gICAgICAgIGNvbnN0IHRyYWNlID0gZ2V0U3RhY2tUcmFjZSgpXG4gICAgICAgICAgICAudHJpbSgpXG4gICAgICAgICAgICAuc3BsaXQoXCJcXG5cIik7XG4gICAgICAgIC8vIHJldHVybiBhIGNvbnRleHQgb2JqZWN0IGV2ZW4gaWYgdGhlcmUgaXMgYW4gZXJyb3JcbiAgICAgICAgY29uc3QgZW1wdHlfY29udGV4dCA9IHtcbiAgICAgICAgICAgIHNjcmlwdFVybDogXCJcIixcbiAgICAgICAgICAgIHNjcmlwdExpbmU6IFwiXCIsXG4gICAgICAgICAgICBzY3JpcHRDb2w6IFwiXCIsXG4gICAgICAgICAgICBmdW5jTmFtZTogXCJcIixcbiAgICAgICAgICAgIHNjcmlwdExvY0V2YWw6IFwiXCIsXG4gICAgICAgICAgICBjYWxsU3RhY2s6IFwiXCIsXG4gICAgICAgIH07XG4gICAgICAgIGlmICh0cmFjZS5sZW5ndGggPCA0KSB7XG4gICAgICAgICAgICByZXR1cm4gZW1wdHlfY29udGV4dDtcbiAgICAgICAgfVxuICAgICAgICAvLyAwLCAxIGFuZCAyIGFyZSBPcGVuV1BNJ3Mgb3duIGZ1bmN0aW9ucyAoZS5nLiBnZXRTdGFja1RyYWNlKSwgc2tpcCB0aGVtLlxuICAgICAgICBjb25zdCBjYWxsU2l0ZSA9IHRyYWNlWzNdO1xuICAgICAgICBpZiAoIWNhbGxTaXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gZW1wdHlfY29udGV4dDtcbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICAgKiBTdGFjayBmcmFtZSBmb3JtYXQgaXMgc2ltcGx5OiBGVU5DX05BTUVARklMRU5BTUU6TElORV9OTzpDT0xVTU5fTk9cbiAgICAgICAgICpcbiAgICAgICAgICogSWYgZXZhbCBvciBGdW5jdGlvbiBpcyBpbnZvbHZlZCB3ZSBoYXZlIGFuIGFkZGl0aW9uYWwgcGFydCBhZnRlciB0aGUgRklMRU5BTUUsIGUuZy46XG4gICAgICAgICAqIEZVTkNfTkFNRUBGSUxFTkFNRSBsaW5lIDEyMyA+IGV2YWwgbGluZSAxID4gZXZhbDpMSU5FX05POkNPTFVNTl9OT1xuICAgICAgICAgKiBvciBGVU5DX05BTUVARklMRU5BTUUgbGluZSAyMzQgPiBGdW5jdGlvbjpMSU5FX05POkNPTFVNTl9OT1xuICAgICAgICAgKlxuICAgICAgICAgKiBXZSBzdG9yZSB0aGUgcGFydCBiZXR3ZWVuIHRoZSBGSUxFTkFNRSBhbmQgdGhlIExJTkVfTk8gaW4gc2NyaXB0TG9jRXZhbFxuICAgICAgICAgKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzY3JpcHRVcmwgPSBcIlwiO1xuICAgICAgICAgICAgbGV0IHNjcmlwdExvY0V2YWwgPSBcIlwiOyAvLyBmb3IgZXZhbCBvciBGdW5jdGlvbiBjYWxsc1xuICAgICAgICAgICAgY29uc3QgY2FsbFNpdGVQYXJ0cyA9IGNhbGxTaXRlLnNwbGl0KFwiQFwiKTtcbiAgICAgICAgICAgIGNvbnN0IGZ1bmNOYW1lID0gY2FsbFNpdGVQYXJ0c1swXSB8fCBcIlwiO1xuICAgICAgICAgICAgY29uc3QgaXRlbXMgPSByc3BsaXQoY2FsbFNpdGVQYXJ0c1sxXSwgXCI6XCIsIDIpO1xuICAgICAgICAgICAgY29uc3QgY29sdW1uTm8gPSBpdGVtc1tpdGVtcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVObyA9IGl0ZW1zW2l0ZW1zLmxlbmd0aCAtIDJdO1xuICAgICAgICAgICAgY29uc3Qgc2NyaXB0RmlsZU5hbWUgPSBpdGVtc1tpdGVtcy5sZW5ndGggLSAzXSB8fCBcIlwiO1xuICAgICAgICAgICAgY29uc3QgbGluZU5vSWR4ID0gc2NyaXB0RmlsZU5hbWUuaW5kZXhPZihcIiBsaW5lIFwiKTsgLy8gbGluZSBpbiB0aGUgVVJMIG1lYW5zIGV2YWwgb3IgRnVuY3Rpb25cbiAgICAgICAgICAgIGlmIChsaW5lTm9JZHggPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgc2NyaXB0VXJsID0gc2NyaXB0RmlsZU5hbWU7IC8vIFRPRE86IHNvbWV0aW1lcyB3ZSBoYXZlIGZpbGVuYW1lIG9ubHksIGUuZy4gWFguanNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNjcmlwdFVybCA9IHNjcmlwdEZpbGVOYW1lLnNsaWNlKDAsIGxpbmVOb0lkeCk7XG4gICAgICAgICAgICAgICAgc2NyaXB0TG9jRXZhbCA9IHNjcmlwdEZpbGVOYW1lLnNsaWNlKGxpbmVOb0lkeCArIDEsIHNjcmlwdEZpbGVOYW1lLmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBjYWxsQ29udGV4dCA9IHtcbiAgICAgICAgICAgICAgICBzY3JpcHRVcmwsXG4gICAgICAgICAgICAgICAgc2NyaXB0TGluZTogbGluZU5vLFxuICAgICAgICAgICAgICAgIHNjcmlwdENvbDogY29sdW1uTm8sXG4gICAgICAgICAgICAgICAgZnVuY05hbWUsXG4gICAgICAgICAgICAgICAgc2NyaXB0TG9jRXZhbCxcbiAgICAgICAgICAgICAgICBjYWxsU3RhY2s6IGdldENhbGxTdGFja1xuICAgICAgICAgICAgICAgICAgICA/IHRyYWNlXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoMylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5qb2luKFwiXFxuXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAudHJpbSgpXG4gICAgICAgICAgICAgICAgICAgIDogXCJcIixcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gY2FsbENvbnRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiT3BlbldQTTogRXJyb3IgcGFyc2luZyB0aGUgc2NyaXB0IGNvbnRleHRcIiwgZS50b1N0cmluZygpLCBjYWxsU2l0ZSk7XG4gICAgICAgICAgICByZXR1cm4gZW1wdHlfY29udGV4dDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBpc09iamVjdChvYmplY3QsIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBsZXQgcHJvcGVydHk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwcm9wZXJ0eSA9IG9iamVjdFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gbnVsbCBpcyB0eXBlIFwib2JqZWN0XCJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHlwZW9mIHByb3BlcnR5ID09PSBcIm9iamVjdFwiO1xuICAgIH1cbiAgICAvLyBMb2cgY2FsbHMgdG8gYSBnaXZlbiBmdW5jdGlvblxuICAgIC8vIFRoaXMgaGVscGVyIGZ1bmN0aW9uIHJldHVybnMgYSB3cmFwcGVyIGFyb3VuZCBgZnVuY2Agd2hpY2ggbG9ncyBjYWxsc1xuICAgIC8vIHRvIGBmdW5jYC4gYG9iamVjdE5hbWVgIGFuZCBgbWV0aG9kTmFtZWAgYXJlIHVzZWQgc3RyaWN0bHkgdG8gaWRlbnRpZnlcbiAgICAvLyB3aGljaCBvYmplY3QgbWV0aG9kIGBmdW5jYCBpcyBjb21pbmcgZnJvbSBpbiB0aGUgbG9nc1xuICAgIGZ1bmN0aW9uIGluc3RydW1lbnRGdW5jdGlvbihvYmplY3ROYW1lLCBtZXRob2ROYW1lLCBmdW5jLCBsb2dTZXR0aW5ncykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgY2FsbENvbnRleHQgPSBnZXRPcmlnaW5hdGluZ1NjcmlwdENvbnRleHQobG9nU2V0dGluZ3MubG9nQ2FsbFN0YWNrKTtcbiAgICAgICAgICAgIGxvZ0NhbGwob2JqZWN0TmFtZSArIFwiLlwiICsgbWV0aG9kTmFtZSwgYXJndW1lbnRzLCBjYWxsQ29udGV4dCwgbG9nU2V0dGluZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLy8gTG9nIHByb3BlcnRpZXMgb2YgcHJvdG90eXBlcyBhbmQgb2JqZWN0c1xuICAgIGZ1bmN0aW9uIGluc3RydW1lbnRPYmplY3RQcm9wZXJ0eShvYmplY3QsIG9iamVjdE5hbWUsIHByb3BlcnR5TmFtZSwgbG9nU2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKCFvYmplY3QgfHxcbiAgICAgICAgICAgICFvYmplY3ROYW1lIHx8XG4gICAgICAgICAgICAhcHJvcGVydHlOYW1lIHx8XG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCByZXF1ZXN0IHRvIGluc3RydW1lbnRPYmplY3RQcm9wZXJ0eS5cbiAgICAgICAgT2JqZWN0OiAke29iamVjdH1cbiAgICAgICAgb2JqZWN0TmFtZTogJHtvYmplY3ROYW1lfVxuICAgICAgICBwcm9wZXJ0eU5hbWU6ICR7cHJvcGVydHlOYW1lfVxuICAgICAgICBgKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTdG9yZSBvcmlnaW5hbCBkZXNjcmlwdG9yIGluIGNsb3N1cmVcbiAgICAgICAgY29uc3QgcHJvcERlc2MgPSBPYmplY3QuZ2V0UHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHlOYW1lKTtcbiAgICAgICAgLy8gUHJvcGVydHkgZGVzY3JpcHRvciBtdXN0IGV4aXN0IHVubGVzcyB3ZSBhcmUgaW5zdHJ1bWVudGluZyBhIG5vbkV4aXN0aW5nIHByb3BlcnR5XG4gICAgICAgIGlmICghcHJvcERlc2MgJiZcbiAgICAgICAgICAgICFsb2dTZXR0aW5ncy5ub25FeGlzdGluZ1Byb3BlcnRpZXNUb0luc3RydW1lbnQuaW5jbHVkZXMocHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlByb3BlcnR5IGRlc2NyaXB0b3Igbm90IGZvdW5kIGZvclwiLCBvYmplY3ROYW1lLCBwcm9wZXJ0eU5hbWUsIG9iamVjdCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gUHJvcGVydHkgZGVzY3JpcHRvciBmb3IgdW5kZWZpbmVkIHByb3BlcnRpZXNcbiAgICAgICAgbGV0IHVuZGVmaW5lZFByb3BWYWx1ZTtcbiAgICAgICAgY29uc3QgdW5kZWZpbmVkUHJvcERlc2MgPSB7XG4gICAgICAgICAgICBnZXQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkUHJvcFZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogdmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgIHVuZGVmaW5lZFByb3BWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB9O1xuICAgICAgICAvLyBJbnN0cnVtZW50IGRhdGEgb3IgYWNjZXNzb3IgcHJvcGVydHkgZGVzY3JpcHRvcnNcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxHZXR0ZXIgPSBwcm9wRGVzYyA/IHByb3BEZXNjLmdldCA6IHVuZGVmaW5lZFByb3BEZXNjLmdldDtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxTZXR0ZXIgPSBwcm9wRGVzYyA/IHByb3BEZXNjLnNldCA6IHVuZGVmaW5lZFByb3BEZXNjLnNldDtcbiAgICAgICAgbGV0IG9yaWdpbmFsVmFsdWUgPSBwcm9wRGVzYyA/IHByb3BEZXNjLnZhbHVlIDogdW5kZWZpbmVkUHJvcFZhbHVlO1xuICAgICAgICAvLyBXZSBvdmVyd3JpdGUgYm90aCBkYXRhIGFuZCBhY2Nlc3NvciBwcm9wZXJ0aWVzIGFzIGFuIGluc3RydW1lbnRlZFxuICAgICAgICAvLyBhY2Nlc3NvciBwcm9wZXJ0eVxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eU5hbWUsIHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb3JpZ1Byb3BlcnR5O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYWxsQ29udGV4dCA9IGdldE9yaWdpbmF0aW5nU2NyaXB0Q29udGV4dChsb2dTZXR0aW5ncy5sb2dDYWxsU3RhY2spO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnN0cnVtZW50ZWRWYXJpYWJsZU5hbWUgPSBgJHtvYmplY3ROYW1lfS4ke3Byb3BlcnR5TmFtZX1gO1xuICAgICAgICAgICAgICAgICAgICAvLyBnZXQgb3JpZ2luYWwgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwcm9wRGVzYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdW5kZWZpbmVkIHByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnUHJvcGVydHkgPSB1bmRlZmluZWRQcm9wVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAob3JpZ2luYWxHZXR0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGFjY2Vzc29yIHByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnUHJvcGVydHkgPSBvcmlnaW5hbEdldHRlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKFwidmFsdWVcIiBpbiBwcm9wRGVzYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgZGF0YSBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ1Byb3BlcnR5ID0gb3JpZ2luYWxWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFByb3BlcnR5IGRlc2NyaXB0b3IgZm9yICR7aW5zdHJ1bWVudGVkVmFyaWFibGVOYW1lfSBkb2Vzbid0IGhhdmUgZ2V0dGVyIG9yIHZhbHVlP2ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nVmFsdWUoaW5zdHJ1bWVudGVkVmFyaWFibGVOYW1lLCBcIlwiLCBKU09wZXJhdGlvbi5nZXRfZmFpbGVkLCBjYWxsQ29udGV4dCwgbG9nU2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIExvZyBgZ2V0c2AgZXhjZXB0IHRob3NlIHRoYXQgaGF2ZSBpbnN0cnVtZW50ZWQgcmV0dXJuIHZhbHVlc1xuICAgICAgICAgICAgICAgICAgICAvLyAqIEFsbCByZXR1cm5lZCBmdW5jdGlvbnMgYXJlIGluc3RydW1lbnRlZCB3aXRoIGEgd3JhcHBlclxuICAgICAgICAgICAgICAgICAgICAvLyAqIFJldHVybmVkIG9iamVjdHMgbWF5IGJlIGluc3RydW1lbnRlZCBpZiByZWN1cnNpdmVcbiAgICAgICAgICAgICAgICAgICAgLy8gICBpbnN0cnVtZW50YXRpb24gaXMgZW5hYmxlZCBhbmQgdGhpcyBpc24ndCBhdCB0aGUgZGVwdGggbGltaXQuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3JpZ1Byb3BlcnR5ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2dTZXR0aW5ncy5sb2dGdW5jdGlvbkdldHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dWYWx1ZShpbnN0cnVtZW50ZWRWYXJpYWJsZU5hbWUsIG9yaWdQcm9wZXJ0eSwgSlNPcGVyYXRpb24uZ2V0X2Z1bmN0aW9uLCBjYWxsQ29udGV4dCwgbG9nU2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5zdHJ1bWVudGVkRnVuY3Rpb25XcmFwcGVyID0gaW5zdHJ1bWVudEZ1bmN0aW9uKG9iamVjdE5hbWUsIHByb3BlcnR5TmFtZSwgb3JpZ1Byb3BlcnR5LCBsb2dTZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZXN0b3JlIHRoZSBvcmlnaW5hbCBwcm90b3R5cGUgYW5kIGNvbnN0cnVjdG9yIHNvIHRoYXQgaW5zdHJ1bWVudGVkIGNsYXNzZXMgcmVtYWluIGludGFjdFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogVGhpcyBtYXkgaGF2ZSBpbnRyb2R1Y2VkIHByb3RvdHlwZSBwb2xsdXRpb24gYXMgcGVyIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL09wZW5XUE0vaXNzdWVzLzQ3MVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9yaWdQcm9wZXJ0eS5wcm90b3R5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0cnVtZW50ZWRGdW5jdGlvbldyYXBwZXIucHJvdG90eXBlID0gb3JpZ1Byb3BlcnR5LnByb3RvdHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3JpZ1Byb3BlcnR5LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0cnVtZW50ZWRGdW5jdGlvbldyYXBwZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdQcm9wZXJ0eS5wcm90b3R5cGUuY29uc3RydWN0b3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluc3RydW1lbnRlZEZ1bmN0aW9uV3JhcHBlcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2Ygb3JpZ1Byb3BlcnR5ID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dTZXR0aW5ncy5yZWN1cnNpdmUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ1NldHRpbmdzLmRlcHRoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdQcm9wZXJ0eTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ1ZhbHVlKGluc3RydW1lbnRlZFZhcmlhYmxlTmFtZSwgb3JpZ1Byb3BlcnR5LCBKU09wZXJhdGlvbi5nZXQsIGNhbGxDb250ZXh0LCBsb2dTZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ1Byb3BlcnR5O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pKCksXG4gICAgICAgICAgICBzZXQ6IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYWxsQ29udGV4dCA9IGdldE9yaWdpbmF0aW5nU2NyaXB0Q29udGV4dChsb2dTZXR0aW5ncy5sb2dDYWxsU3RhY2spO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnN0cnVtZW50ZWRWYXJpYWJsZU5hbWUgPSBgJHtvYmplY3ROYW1lfS4ke3Byb3BlcnR5TmFtZX1gO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmV0dXJuVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIC8vIFByZXZlbnQgc2V0cyBmb3IgZnVuY3Rpb25zIGFuZCBvYmplY3RzIGlmIGVuYWJsZWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvZ1NldHRpbmdzLnByZXZlbnRTZXRzICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAodHlwZW9mIG9yaWdpbmFsVmFsdWUgPT09IFwiZnVuY3Rpb25cIiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBvcmlnaW5hbFZhbHVlID09PSBcIm9iamVjdFwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nVmFsdWUoaW5zdHJ1bWVudGVkVmFyaWFibGVOYW1lLCB2YWx1ZSwgSlNPcGVyYXRpb24uc2V0X3ByZXZlbnRlZCwgY2FsbENvbnRleHQsIGxvZ1NldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBzZXQgbmV3IHZhbHVlIHRvIG9yaWdpbmFsIHNldHRlci9sb2NhdGlvblxuICAgICAgICAgICAgICAgICAgICBpZiAob3JpZ2luYWxTZXR0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGFjY2Vzc29yIHByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSA9IG9yaWdpbmFsU2V0dGVyLmNhbGwodGhpcywgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKFwidmFsdWVcIiBpbiBwcm9wRGVzYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5Mb2cgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5pc1Byb3RvdHlwZU9mKHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIHByb3BlcnR5TmFtZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbkxvZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgUHJvcGVydHkgZGVzY3JpcHRvciBmb3IgJHtpbnN0cnVtZW50ZWRWYXJpYWJsZU5hbWV9IGRvZXNuJ3QgaGF2ZSBzZXR0ZXIgb3IgdmFsdWU/YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dWYWx1ZShpbnN0cnVtZW50ZWRWYXJpYWJsZU5hbWUsIHZhbHVlLCBKU09wZXJhdGlvbi5zZXRfZmFpbGVkLCBjYWxsQ29udGV4dCwgbG9nU2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxvZ1ZhbHVlKGluc3RydW1lbnRlZFZhcmlhYmxlTmFtZSwgdmFsdWUsIEpTT3BlcmF0aW9uLnNldCwgY2FsbENvbnRleHQsIGxvZ1NldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSgpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaW5zdHJ1bWVudE9iamVjdChvYmplY3QsIGluc3RydW1lbnRlZE5hbWUsIGxvZ1NldHRpbmdzKSB7XG4gICAgICAgIC8vIFNldCBwcm9wZXJ0aWVzVG9JbnN0cnVtZW50IHRvIG51bGwgdG8gZm9yY2Ugbm8gcHJvcGVydGllcyB0byBiZSBpbnN0cnVtZW50ZWQuXG4gICAgICAgIC8vICh0aGlzIGlzIHVzZWQgaW4gdGVzdGluZyBmb3IgZXhhbXBsZSlcbiAgICAgICAgbGV0IHByb3BlcnRpZXNUb0luc3RydW1lbnQ7XG4gICAgICAgIGlmIChsb2dTZXR0aW5ncy5wcm9wZXJ0aWVzVG9JbnN0cnVtZW50ID09PSBudWxsKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzVG9JbnN0cnVtZW50ID0gW107XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobG9nU2V0dGluZ3MucHJvcGVydGllc1RvSW5zdHJ1bWVudC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXNUb0luc3RydW1lbnQgPSBPYmplY3QuZ2V0UHJvcGVydHlOYW1lcyhvYmplY3QpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcHJvcGVydGllc1RvSW5zdHJ1bWVudCA9IGxvZ1NldHRpbmdzLnByb3BlcnRpZXNUb0luc3RydW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBwcm9wZXJ0eU5hbWUgb2YgcHJvcGVydGllc1RvSW5zdHJ1bWVudCkge1xuICAgICAgICAgICAgaWYgKGxvZ1NldHRpbmdzLmV4Y2x1ZGVkUHJvcGVydGllcy5pbmNsdWRlcyhwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBJZiBgcmVjdXJzaXZlYCBmbGFnIHNldCB3ZSB3YW50IHRvIHJlY3Vyc2l2ZWx5IGluc3RydW1lbnQgYW55XG4gICAgICAgICAgICAvLyBvYmplY3QgcHJvcGVydGllcyB0aGF0IGFyZW4ndCB0aGUgcHJvdG90eXBlIG9iamVjdC5cbiAgICAgICAgICAgIGlmIChsb2dTZXR0aW5ncy5yZWN1cnNpdmUgJiZcbiAgICAgICAgICAgICAgICBsb2dTZXR0aW5ncy5kZXB0aCA+IDAgJiZcbiAgICAgICAgICAgICAgICBpc09iamVjdChvYmplY3QsIHByb3BlcnR5TmFtZSkgJiZcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUgIT09IFwiX19wcm90b19fXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdJbnN0cnVtZW50ZWROYW1lID0gYCR7aW5zdHJ1bWVudGVkTmFtZX0uJHtwcm9wZXJ0eU5hbWV9YDtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdMb2dTZXR0aW5ncyA9IHsgLi4ubG9nU2V0dGluZ3MgfTtcbiAgICAgICAgICAgICAgICBuZXdMb2dTZXR0aW5ncy5kZXB0aCA9IGxvZ1NldHRpbmdzLmRlcHRoIC0gMTtcbiAgICAgICAgICAgICAgICBuZXdMb2dTZXR0aW5ncy5wcm9wZXJ0aWVzVG9JbnN0cnVtZW50ID0gW107XG4gICAgICAgICAgICAgICAgaW5zdHJ1bWVudE9iamVjdChvYmplY3RbcHJvcGVydHlOYW1lXSwgbmV3SW5zdHJ1bWVudGVkTmFtZSwgbmV3TG9nU2V0dGluZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpbnN0cnVtZW50T2JqZWN0UHJvcGVydHkob2JqZWN0LCBpbnN0cnVtZW50ZWROYW1lLCBwcm9wZXJ0eU5hbWUsIGxvZ1NldHRpbmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIFR5cGVFcnJvciAmJlxuICAgICAgICAgICAgICAgICAgICBlcnJvci5tZXNzYWdlLmluY2x1ZGVzKFwiY2FuJ3QgcmVkZWZpbmUgbm9uLWNvbmZpZ3VyYWJsZSBwcm9wZXJ0eVwiKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYENhbm5vdCBpbnN0cnVtZW50IG5vbi1jb25maWd1cmFibGUgcHJvcGVydHk6ICR7aW5zdHJ1bWVudGVkTmFtZX06JHtwcm9wZXJ0eU5hbWV9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2dFcnJvclRvQ29uc29sZShlcnJvciwgeyBpbnN0cnVtZW50ZWROYW1lLCBwcm9wZXJ0eU5hbWUgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgcHJvcGVydHlOYW1lIG9mIGxvZ1NldHRpbmdzLm5vbkV4aXN0aW5nUHJvcGVydGllc1RvSW5zdHJ1bWVudCkge1xuICAgICAgICAgICAgaWYgKGxvZ1NldHRpbmdzLmV4Y2x1ZGVkUHJvcGVydGllcy5pbmNsdWRlcyhwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGluc3RydW1lbnRPYmplY3RQcm9wZXJ0eShvYmplY3QsIGluc3RydW1lbnRlZE5hbWUsIHByb3BlcnR5TmFtZSwgbG9nU2V0dGluZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgbG9nRXJyb3JUb0NvbnNvbGUoZXJyb3IsIHsgaW5zdHJ1bWVudGVkTmFtZSwgcHJvcGVydHlOYW1lIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHNlbmRGYWN0b3J5ID0gZnVuY3Rpb24gKGV2ZW50SWQsICRzZW5kTWVzc2FnZXNUb0xvZ2dlcikge1xuICAgICAgICBsZXQgbWVzc2FnZXMgPSBbXTtcbiAgICAgICAgLy8gZGVib3VuY2Ugc2VuZGluZyBxdWV1ZWQgbWVzc2FnZXNcbiAgICAgICAgY29uc3QgX3NlbmQgPSBkZWJvdW5jZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkc2VuZE1lc3NhZ2VzVG9Mb2dnZXIoZXZlbnRJZCwgbWVzc2FnZXMpO1xuICAgICAgICAgICAgLy8gY2xlYXIgdGhlIHF1ZXVlXG4gICAgICAgICAgICBtZXNzYWdlcyA9IFtdO1xuICAgICAgICB9LCAxMDApO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1zZ1R5cGUsIG1zZykge1xuICAgICAgICAgICAgLy8gcXVldWUgdGhlIG1lc3NhZ2VcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goeyB0eXBlOiBtc2dUeXBlLCBjb250ZW50OiBtc2cgfSk7XG4gICAgICAgICAgICBfc2VuZCgpO1xuICAgICAgICB9O1xuICAgIH07XG4gICAgY29uc3Qgc2VuZCA9IHNlbmRGYWN0b3J5KGV2ZW50SWQsIHNlbmRNZXNzYWdlc1RvTG9nZ2VyKTtcbiAgICBmdW5jdGlvbiBpbnN0cnVtZW50SlMoSlNJbnN0cnVtZW50UmVxdWVzdHMpIHtcbiAgICAgICAgLy8gVGhlIEpTIEluc3RydW1lbnQgUmVxdWVzdHMgYXJlIHNldHVwIGFuZCB2YWxpZGF0ZWQgcHl0aG9uIHNpZGVcbiAgICAgICAgLy8gaW5jbHVkaW5nIHNldHRpbmcgZGVmYXVsdHMgZm9yIGxvZ1NldHRpbmdzLlxuICAgICAgICAvLyBNb3JlIGRldGFpbHMgYWJvdXQgaG93IHRoaXMgZnVuY3Rpb24gaXMgaW52b2tlZCBhcmUgaW5cbiAgICAgICAgLy8gY29udGVudC9qYXZhc2NyaXB0LWluc3RydW1lbnQtY29udGVudC1zY29wZS50c1xuICAgICAgICBKU0luc3RydW1lbnRSZXF1ZXN0cy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICBpbnN0cnVtZW50T2JqZWN0KGl0ZW0ub2JqZWN0LCBpdGVtLmluc3RydW1lbnRlZE5hbWUsIGl0ZW0ubG9nU2V0dGluZ3MpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gVGhpcyB3aG9sZSBmdW5jdGlvbiBnZXRJbnN0cnVtZW50SlMgcmV0dXJucyBqdXN0IHRoZSBmdW5jdGlvbiBgaW5zdHJ1bWVudEpTYC5cbiAgICByZXR1cm4gaW5zdHJ1bWVudEpTO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pYW5NdGFXNXpkSEoxYldWdWRITXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdUxpOHVMaTh1TGk5emNtTXZiR2xpTDJwekxXbHVjM1J5ZFcxbGJuUnpMblJ6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxHbEZRVUZwUlR0QlFVTnFSU3h2UmtGQmIwWTdRVUU0UW5CR0xFMUJRVTBzVlVGQlZTeGxRVUZsTEVOQlFVTXNUMEZCWlN4RlFVRkZMRzlDUVVGdlFqdEpRVU51UlRzN08wOUJSMGM3U1VGRlNDeHRSVUZCYlVVN1NVRkRia1VzVFVGQlRTeFhRVUZYTEVkQlFVY3NSMEZCUnl4RFFVRkRPMGxCUTNoQ0xHRkJRV0U3U1VGRFlpeE5RVUZOTEZWQlFWVXNSMEZCUnl4SlFVRkpMRTFCUVUwc1JVRkJSU3hEUVVGRE8wbEJRMmhETEN0RFFVRXJRenRKUVVNdlF5eEpRVUZKTEV0QlFVc3NSMEZCUnl4TFFVRkxMRU5CUVVNN1NVRkRiRUlzWjBSQlFXZEVPMGxCUTJoRUxFbEJRVWtzVDBGQlR5eEhRVUZITEVOQlFVTXNRMEZCUXp0SlFVVm9RaXd3UWtGQk1FSTdTVUZETVVJc1RVRkJUU3hYUVVGWExFZEJRVWM3VVVGRGJFSXNTVUZCU1N4RlFVRkZMRTFCUVUwN1VVRkRXaXhIUVVGSExFVkJRVVVzUzBGQlN6dFJRVU5XTEZWQlFWVXNSVUZCUlN4aFFVRmhPMUZCUTNwQ0xGbEJRVmtzUlVGQlJTeGxRVUZsTzFGQlF6ZENMRWRCUVVjc1JVRkJSU3hMUVVGTE8xRkJRMVlzVlVGQlZTeEZRVUZGTEdGQlFXRTdVVUZEZWtJc1lVRkJZU3hGUVVGRkxHZENRVUZuUWp0TFFVTm9ReXhEUVVGRE8wbEJSVVlzYjBaQlFXOUdPMGxCUTNCR0xIbEZRVUY1UlR0SlFVTjZSU3hOUVVGTkxFTkJRVU1zY1VKQlFYRkNMRWRCUVVjc1ZVRkJVeXhQUVVGUExFVkJRVVVzU1VGQlNUdFJRVU51UkN4SlFVRkpMRTlCUVU4c1MwRkJTeXhUUVVGVExFVkJRVVU3V1VGRGVrSXNUVUZCVFN4SlFVRkpMRXRCUVVzc1EwRkJReXcyUTBGQk5rTXNRMEZCUXl4RFFVRkRPMU5CUTJoRk8xRkJRMFFzU1VGQlNTeEZRVUZGTEVkQlFVY3NUVUZCVFN4RFFVRkRMSGRDUVVGM1FpeERRVUZETEU5QlFVOHNSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenRSUVVONFJDeEpRVUZKTEV0QlFVc3NSMEZCUnl4TlFVRk5MRU5CUVVNc1kwRkJZeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzFGQlF6TkRMRTlCUVU4c1JVRkJSU3hMUVVGTExGTkJRVk1zU1VGQlNTeExRVUZMTEV0QlFVc3NTVUZCU1N4RlFVRkZPMWxCUTNwRExFVkJRVVVzUjBGQlJ5eE5RVUZOTEVOQlFVTXNkMEpCUVhkQ0xFTkJRVU1zUzBGQlN5eEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPMWxCUTJ4RUxFdEJRVXNzUjBGQlJ5eE5RVUZOTEVOQlFVTXNZMEZCWXl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE8xTkJRM1JETzFGQlEwUXNUMEZCVHl4RlFVRkZMRU5CUVVNN1NVRkRXaXhEUVVGRExFTkJRVU03U1VGRlJpeE5RVUZOTEVOQlFVTXNaMEpCUVdkQ0xFZEJRVWNzVlVGQlV5eFBRVUZQTzFGQlEzaERMRWxCUVVrc1QwRkJUeXhMUVVGTExGTkJRVk1zUlVGQlJUdFpRVU42UWl4TlFVRk5MRWxCUVVrc1MwRkJTeXhEUVVGRExIZERRVUYzUXl4RFFVRkRMRU5CUVVNN1UwRkRNMFE3VVVGRFJDeEpRVUZKTEV0QlFVc3NSMEZCUnl4TlFVRk5MRU5CUVVNc2JVSkJRVzFDTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1VVRkRhRVFzU1VGQlNTeExRVUZMTEVkQlFVY3NUVUZCVFN4RFFVRkRMR05CUVdNc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dFJRVU16UXl4UFFVRlBMRXRCUVVzc1MwRkJTeXhKUVVGSkxFVkJRVVU3V1VGRGNrSXNTMEZCU3l4SFFVRkhMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zVFVGQlRTeERRVUZETEcxQ1FVRnRRaXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTTdXVUZEZUVRc1MwRkJTeXhIUVVGSExFMUJRVTBzUTBGQlF5eGpRVUZqTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1UwRkRkRU03VVVGRFJDeHZSRUZCYjBRN1VVRkRjRVFzVDBGQlR5eExRVUZMTEVOQlFVTTdTVUZEWml4RFFVRkRMRU5CUVVNN1NVRkZSaXh2UTBGQmIwTTdTVUZEY0VNc1UwRkJVeXhSUVVGUkxFTkJRVU1zU1VGQlNTeEZRVUZGTEVsQlFVa3NSVUZCUlN4WlFVRnhRaXhMUVVGTE8xRkJRM1JFTEVsQlFVa3NUMEZCVHl4RlFVRkZMRWxCUVVrc1JVRkJSU3hQUVVGUExFVkJRVVVzVTBGQlV5eEZRVUZGTEUxQlFVMHNRMEZCUXp0UlFVVTVReXhOUVVGTkxFdEJRVXNzUjBGQlJ6dFpRVU5hTEUxQlFVMHNTVUZCU1N4SFFVRkhMRWxCUVVrc1EwRkJReXhIUVVGSExFVkJRVVVzUjBGQlJ5eFRRVUZUTEVOQlFVTTdXVUZEY0VNc1NVRkJTU3hKUVVGSkxFZEJRVWNzU1VGQlNTeEZRVUZGTzJkQ1FVTm1MRTlCUVU4c1IwRkJSeXhWUVVGVkxFTkJRVU1zUzBGQlN5eEZRVUZGTEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1EwRkJRenRoUVVNeFF6dHBRa0ZCVFR0blFrRkRUQ3hQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETzJkQ1FVTm1MRWxCUVVrc1EwRkJReXhUUVVGVExFVkJRVVU3YjBKQlEyUXNUVUZCVFN4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR5eEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPMjlDUVVOdVF5eFBRVUZQTEVkQlFVY3NTVUZCU1N4SFFVRkhMRWxCUVVrc1EwRkJRenRwUWtGRGRrSTdZVUZEUmp0UlFVTklMRU5CUVVNc1EwRkJRenRSUVVWR0xFOUJRVTg3V1VGRFRDeFBRVUZQTEVkQlFVY3NTVUZCU1N4RFFVRkRPMWxCUTJZc1NVRkJTU3hIUVVGSExGTkJRVk1zUTBGQlF6dFpRVU5xUWl4VFFVRlRMRWRCUVVjc1NVRkJTU3hEUVVGRExFZEJRVWNzUlVGQlJTeERRVUZETzFsQlEzWkNMRTFCUVUwc1QwRkJUeXhIUVVGSExGTkJRVk1zU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXp0WlFVTjBReXhKUVVGSkxFTkJRVU1zVDBGQlR5eEZRVUZGTzJkQ1FVTmFMRTlCUVU4c1IwRkJSeXhWUVVGVkxFTkJRVU1zUzBGQlN5eEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPMkZCUTI1RE8xbEJRMFFzU1VGQlNTeFBRVUZQTEVWQlFVVTdaMEpCUTFnc1RVRkJUU3hIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE8yZENRVU51UXl4UFFVRlBMRWRCUVVjc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF6dGhRVU4yUWp0WlFVVkVMRTlCUVU4c1RVRkJUU3hEUVVGRE8xRkJRMmhDTEVOQlFVTXNRMEZCUXp0SlFVTktMRU5CUVVNN1NVRkZSQ3c0UTBGQk9FTTdTVUZET1VNc1UwRkJVeXh0UWtGQmJVSXNRMEZCUXl4UFFVRlpMRVZCUVVVc2FVSkJRVEJDTEV0QlFVczdVVUZEZUVVc1NVRkJTU3hQUVVGUExFdEJRVXNzVVVGQlVTeERRVUZETEVsQlFVa3NSVUZCUlR0WlFVTTNRaXhQUVVGUExFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTTdVMEZEZUVJN1VVRkRSQ3hKUVVGSkxFOUJRVThzUTBGQlF5eFZRVUZWTEV0QlFVc3NTVUZCU1N4RlFVRkZPMWxCUXk5Q0xFOUJRVThzVDBGQlR5eEhRVUZITEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNN1UwRkRiRU03VVVGRlJDeEpRVUZKTEZsQlFWa3NSMEZCUnl4RFFVRkRMRU5CUVVNN1VVRkRja0lzVFVGQlRTeFJRVUZSTEVkQlFVY3NUMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhWUVVGVkxFTkJRVU03VVVGREwwTXNTMEZCU3l4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVVzUTBGQlF5eEhRVUZITEZGQlFWRXNRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJReXhGUVVGRkxFVkJRVVU3V1VGRGVFTXNUVUZCVFN4UFFVRlBMRWRCUVVjc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzFsQlF6VkNMRWxCUVVrc1QwRkJUeXhMUVVGTExFOUJRVThzUlVGQlJUdG5Ra0ZEZGtJc1NVRkJTU3hKUVVGSkxFZEJRVWNzYlVKQlFXMUNMRU5CUVVNc1QwRkJUeXhEUVVGRExGVkJRVlVzUlVGQlJTeGpRVUZqTEVOQlFVTXNRMEZCUXp0blFrRkRia1VzU1VGQlNTeEpRVUZKTEVkQlFVY3NSMEZCUnl4UFFVRlBMRU5CUVVNc1QwRkJUeXhIUVVGSExFZEJRVWNzUjBGQlJ5eFpRVUZaTEVOQlFVTTdaMEpCUTI1RUxFbEJRVWtzU1VGQlNTeEhRVUZITEVkQlFVY3NUMEZCVHl4RFFVRkRMRVZCUVVVc1EwRkJRenRuUWtGRGVrSXNTVUZCU1N4SlFVRkpMRWRCUVVjc1IwRkJSeXhQUVVGUExFTkJRVU1zVTBGQlV5eERRVUZETzJkQ1FVTm9ReXhKUVVGSkxHTkJRV01zUlVGQlJUdHZRa0ZEYkVJc1NVRkJTU3hKUVVGSkxFZEJRVWNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRPMjlDUVVNM1FpeEpRVUZKTEVsQlFVa3NSMEZCUnl4SFFVRkhMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR5eERRVUZETzI5Q1FVTndReXhKUVVGSkxFbEJRVWtzUjBGQlJ5eEhRVUZITEU5QlFVOHNRMEZCUXl4TFFVRkxMRU5CUVVNc1ZVRkJWU3hEUVVGRE8ybENRVU40UXp0blFrRkRSQ3hKUVVGSkxFOUJRVThzUTBGQlF5eFBRVUZQTEV0QlFVc3NSMEZCUnl4RlFVRkZPMjlDUVVNelFpeEpRVUZKTEVsQlFVa3NSMEZCUnl4SFFVRkhMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU03YVVKQlF6VkNPMmRDUVVORUxFbEJRVWtzU1VGQlNTeEhRVUZITEVOQlFVTTdaMEpCUTFvc1QwRkJUeXhKUVVGSkxFTkJRVU03WVVGRFlqdFpRVU5FTEVsQlFVa3NUMEZCVHl4RFFVRkRMRkZCUVZFc1MwRkJTeXhEUVVGRExFbEJRVWtzVDBGQlR5eERRVUZETEU5QlFVOHNTMEZCU3l4UFFVRlBMRU5CUVVNc1QwRkJUeXhGUVVGRk8yZENRVU5xUlN4WlFVRlpMRVZCUVVVc1EwRkJRenRoUVVOb1FqdFRRVU5HTzBsQlEwZ3NRMEZCUXp0SlFVVkVMR2REUVVGblF6dEpRVU5vUXl4VFFVRlRMR1ZCUVdVc1EwRkRkRUlzVFVGQlRTeEZRVU5PTEhGQ1FVRTRRaXhMUVVGTE8xRkJSVzVETERSQ1FVRTBRanRSUVVNMVFpeEpRVUZKTzFsQlEwWXNTVUZCU1N4TlFVRk5MRXRCUVVzc1NVRkJTU3hGUVVGRk8yZENRVU51UWl4UFFVRlBMRTFCUVUwc1EwRkJRenRoUVVObU8xbEJRMFFzU1VGQlNTeFBRVUZQTEUxQlFVMHNTMEZCU3l4VlFVRlZMRVZCUVVVN1owSkJRMmhETEVsQlFVa3NhMEpCUVd0Q0xFVkJRVVU3YjBKQlEzUkNMRTlCUVU4c1RVRkJUU3hEUVVGRExGRkJRVkVzUlVGQlJTeERRVUZETzJsQ1FVTXhRanR4UWtGQlRUdHZRa0ZEVEN4UFFVRlBMRlZCUVZVc1EwRkJRenRwUWtGRGJrSTdZVUZEUmp0WlFVTkVMRWxCUVVrc1QwRkJUeXhOUVVGTkxFdEJRVXNzVVVGQlVTeEZRVUZGTzJkQ1FVTTVRaXhQUVVGUExFMUJRVTBzUTBGQlF6dGhRVU5tTzFsQlEwUXNUVUZCVFN4WFFVRlhMRWRCUVVjc1JVRkJSU3hEUVVGRE8xbEJRM1pDTEU5QlFVOHNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhOUVVGTkxFVkJRVVVzVlVGQlV5eEhRVUZITEVWQlFVVXNTMEZCU3p0blFrRkRMME1zU1VGQlNTeExRVUZMTEV0QlFVc3NTVUZCU1N4RlFVRkZPMjlDUVVOc1FpeFBRVUZQTEUxQlFVMHNRMEZCUXp0cFFrRkRaanRuUWtGRFJDeEpRVUZKTEU5QlFVOHNTMEZCU3l4TFFVRkxMRlZCUVZVc1JVRkJSVHR2UWtGREwwSXNTVUZCU1N4clFrRkJhMElzUlVGQlJUdDNRa0ZEZEVJc1QwRkJUeXhMUVVGTExFTkJRVU1zVVVGQlVTeEZRVUZGTEVOQlFVTTdjVUpCUTNwQ08zbENRVUZOTzNkQ1FVTk1MRTlCUVU4c1ZVRkJWU3hEUVVGRE8zRkNRVU51UWp0cFFrRkRSanRuUWtGRFJDeEpRVUZKTEU5QlFVOHNTMEZCU3l4TFFVRkxMRkZCUVZFc1JVRkJSVHR2UWtGRE4wSXNjVU5CUVhGRE8yOUNRVU55UXl4SlFVRkpMR2xDUVVGcFFpeEpRVUZKTEV0QlFVc3NSVUZCUlR0M1FrRkRPVUlzUzBGQlN5eEhRVUZITEV0QlFVc3NRMEZCUXl4bFFVRmxMRU5CUVVNN2NVSkJReTlDTzI5Q1FVVkVMSGxDUVVGNVFqdHZRa0ZEZWtJc1NVRkJTU3hMUVVGTExGbEJRVmtzVjBGQlZ5eEZRVUZGTzNkQ1FVTm9ReXhQUVVGUExHMUNRVUZ0UWl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE8zRkNRVU51UXp0dlFrRkZSQ3dyUWtGQkswSTdiMEpCUXk5Q0xFbEJRVWtzUjBGQlJ5eExRVUZMTEVWQlFVVXNTVUZCU1N4WFFVRlhMRU5CUVVNc1QwRkJUeXhEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlR0M1FrRkRhRVFzVjBGQlZ5eERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenQzUWtGRGVFSXNUMEZCVHl4TFFVRkxMRU5CUVVNN2NVSkJRMlE3ZVVKQlFVMDdkMEpCUTB3c1QwRkJUeXhQUVVGUExFdEJRVXNzUTBGQlF6dHhRa0ZEY2tJN2FVSkJRMFk3WjBKQlEwUXNUMEZCVHl4TFFVRkxMRU5CUVVNN1dVRkRaaXhEUVVGRExFTkJRVU1zUTBGQlF6dFRRVU5LTzFGQlFVTXNUMEZCVHl4TFFVRkxMRVZCUVVVN1dVRkRaQ3hQUVVGUExFTkJRVU1zUjBGQlJ5eERRVUZETEdkRFFVRm5ReXhIUVVGSExFdEJRVXNzUTBGQlF5eERRVUZETzFsQlEzUkVMRTlCUVU4c2RVSkJRWFZDTEVkQlFVY3NTMEZCU3l4RFFVRkRPMU5CUTNoRE8wbEJRMGdzUTBGQlF6dEpRVVZFTEZOQlFWTXNNa0pCUVRKQ0xFTkJRVU1zVTBGQlV5eEZRVUZGTEUxQlFVMDdVVUZEY0VRc1RVRkJUU3hIUVVGSExFZEJRVWNzVTBGQlV5eEhRVUZITEVkQlFVY3NSMEZCUnl4TlFVRk5MRU5CUVVNN1VVRkRja01zU1VGQlNTeEhRVUZITEVsQlFVa3NWVUZCVlN4SlFVRkpMRlZCUVZVc1EwRkJReXhIUVVGSExFTkJRVU1zU1VGQlNTeFhRVUZYTEVWQlFVVTdXVUZEZGtRc1QwRkJUeXhKUVVGSkxFTkJRVU03VTBGRFlqdGhRVUZOTEVsQlFVa3NRMEZCUXl4RFFVRkRMRWRCUVVjc1NVRkJTU3hWUVVGVkxFTkJRVU1zUlVGQlJUdFpRVU12UWl4VlFVRlZMRU5CUVVNc1IwRkJSeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzFOQlEzSkNPMkZCUVUwN1dVRkRUQ3hWUVVGVkxFTkJRVU1zUjBGQlJ5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMU5CUTNSQ08xRkJRMFFzVDBGQlR5eExRVUZMTEVOQlFVTTdTVUZEWml4RFFVRkRPMGxCUlVRc2VVTkJRWGxETzBsQlEzcERMRk5CUVZNc1VVRkJVU3hEUVVObUxIZENRVUZuUXl4RlFVTm9ReXhMUVVGVkxFVkJRMVlzVTBGQmFVSXNSVUZCUlN4cFEwRkJhVU03U1VGRGNFUXNWMEZCWjBJc1JVRkRhRUlzVjBGQmQwSTdVVUZGZUVJc1NVRkJTU3hMUVVGTExFVkJRVVU3V1VGRFZDeFBRVUZQTzFOQlExSTdVVUZEUkN4TFFVRkxMRWRCUVVjc1NVRkJTU3hEUVVGRE8xRkJSV0lzVFVGQlRTeFRRVUZUTEVkQlFVY3NNa0pCUVRKQ0xFTkJRek5ETEZkQlFWY3NRMEZCUXl4VFFVRlRMRVZCUTNKQ0xIZENRVUYzUWl4RFFVTjZRaXhEUVVGRE8xRkJRMFlzU1VGQlNTeFRRVUZUTEVWQlFVVTdXVUZEWWl4TFFVRkxMRWRCUVVjc1MwRkJTeXhEUVVGRE8xbEJRMlFzVDBGQlR6dFRRVU5TTzFGQlJVUXNUVUZCVFN4SFFVRkhMRWRCUVVjN1dVRkRWaXhUUVVGVE8xbEJRMVFzVFVGQlRTeEZRVUZGTEhkQ1FVRjNRanRaUVVOb1F5eExRVUZMTEVWQlFVVXNaVUZCWlN4RFFVRkRMRXRCUVVzc1JVRkJSU3hYUVVGWExFTkJRVU1zY1VKQlFYRkNMRU5CUVVNN1dVRkRhRVVzVTBGQlV5eEZRVUZGTEZkQlFWY3NRMEZCUXl4VFFVRlRPMWxCUTJoRExGVkJRVlVzUlVGQlJTeFhRVUZYTEVOQlFVTXNWVUZCVlR0WlFVTnNReXhUUVVGVExFVkJRVVVzVjBGQlZ5eERRVUZETEZOQlFWTTdXVUZEYUVNc1VVRkJVU3hGUVVGRkxGZEJRVmNzUTBGQlF5eFJRVUZSTzFsQlF6bENMR0ZCUVdFc1JVRkJSU3hYUVVGWExFTkJRVU1zWVVGQllUdFpRVU40UXl4VFFVRlRMRVZCUVVVc1YwRkJWeXhEUVVGRExGTkJRVk03V1VGRGFFTXNUMEZCVHl4RlFVRkZMRTlCUVU4c1JVRkJSVHRUUVVOdVFpeERRVUZETzFGQlJVWXNTVUZCU1R0WlFVTkdMRWxCUVVrc1EwRkJReXhWUVVGVkxFVkJRVVVzUjBGQlJ5eERRVUZETEVOQlFVTTdVMEZEZGtJN1VVRkJReXhQUVVGUExFdEJRVXNzUlVGQlJUdFpRVU5rTEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc2EwTkJRV3RETEVOQlFVTXNRMEZCUXp0WlFVTm9SQ3hwUWtGQmFVSXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRUUVVNeFFqdFJRVVZFTEV0QlFVc3NSMEZCUnl4TFFVRkxMRU5CUVVNN1NVRkRhRUlzUTBGQlF6dEpRVVZFTEdkQ1FVRm5RanRKUVVOb1FpeFRRVUZUTEU5QlFVOHNRMEZEWkN4M1FrRkJaME1zUlVGRGFFTXNTVUZCWjBJc1JVRkRhRUlzVjBGQlowSXNSVUZEYUVJc1YwRkJkMEk3VVVGRmVFSXNTVUZCU1N4TFFVRkxMRVZCUVVVN1dVRkRWQ3hQUVVGUE8xTkJRMUk3VVVGRFJDeExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRPMUZCUldJc1RVRkJUU3hUUVVGVExFZEJRVWNzTWtKQlFUSkNMRU5CUXpORExGZEJRVmNzUTBGQlF5eFRRVUZUTEVWQlEzSkNMSGRDUVVGM1FpeERRVU42UWl4RFFVRkRPMUZCUTBZc1NVRkJTU3hUUVVGVExFVkJRVVU3V1VGRFlpeExRVUZMTEVkQlFVY3NTMEZCU3l4RFFVRkRPMWxCUTJRc1QwRkJUenRUUVVOU08xRkJSVVFzU1VGQlNUdFpRVU5HTEhGRlFVRnhSVHRaUVVOeVJTeE5RVUZOTEZWQlFWVXNSMEZCWVN4RlFVRkZMRU5CUVVNN1dVRkRhRU1zUzBGQlN5eE5RVUZOTEVkQlFVY3NTVUZCU1N4SlFVRkpMRVZCUVVVN1owSkJRM1JDTEZWQlFWVXNRMEZCUXl4SlFVRkpMRU5CUTJJc1pVRkJaU3hEUVVGRExFZEJRVWNzUlVGQlJTeFhRVUZYTEVOQlFVTXNjVUpCUVhGQ0xFTkJRVU1zUTBGRGVFUXNRMEZCUXp0aFFVTklPMWxCUTBRc1RVRkJUU3hIUVVGSExFZEJRVWM3WjBKQlExWXNVMEZCVXl4RlFVRkZMRmRCUVZjc1EwRkJReXhKUVVGSk8yZENRVU16UWl4TlFVRk5MRVZCUVVVc2QwSkJRWGRDTzJkQ1FVTm9ReXhKUVVGSkxFVkJRVVVzVlVGQlZUdG5Ra0ZEYUVJc1MwRkJTeXhGUVVGRkxFVkJRVVU3WjBKQlExUXNVMEZCVXl4RlFVRkZMRmRCUVZjc1EwRkJReXhUUVVGVE8yZENRVU5vUXl4VlFVRlZMRVZCUVVVc1YwRkJWeXhEUVVGRExGVkJRVlU3WjBKQlEyeERMRk5CUVZNc1JVRkJSU3hYUVVGWExFTkJRVU1zVTBGQlV6dG5Ra0ZEYUVNc1VVRkJVU3hGUVVGRkxGZEJRVmNzUTBGQlF5eFJRVUZSTzJkQ1FVTTVRaXhoUVVGaExFVkJRVVVzVjBGQlZ5eERRVUZETEdGQlFXRTdaMEpCUTNoRExGTkJRVk1zUlVGQlJTeFhRVUZYTEVOQlFVTXNVMEZCVXp0blFrRkRhRU1zVDBGQlR5eEZRVUZGTEU5QlFVOHNSVUZCUlR0aFFVTnVRaXhEUVVGRE8xbEJRMFlzU1VGQlNTeERRVUZETEZOQlFWTXNSVUZCUlN4SFFVRkhMRU5CUVVNc1EwRkJRenRUUVVOMFFqdFJRVUZETEU5QlFVOHNTMEZCU3l4RlFVRkZPMWxCUTJRc1QwRkJUeXhEUVVGRExFZEJRVWNzUTBGRFZDeHJRMEZCYTBNc1IwRkJSeXgzUWtGQmQwSXNRMEZET1VRc1EwRkJRenRaUVVOR0xHbENRVUZwUWl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE8xTkJRekZDTzFGQlEwUXNTMEZCU3l4SFFVRkhMRXRCUVVzc1EwRkJRenRKUVVOb1FpeERRVUZETzBsQlJVUXNVMEZCVXl4cFFrRkJhVUlzUTBGQlF5eExRVUZMTEVWQlFVVXNWVUZCWlN4TFFVRkxPMUZCUTNCRUxFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTXNkVUpCUVhWQ0xFZEJRVWNzUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMUZCUTNCRUxFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTXNNRUpCUVRCQ0xFZEJRVWNzUzBGQlN5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMUZCUXpGRUxFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTXNNa0pCUVRKQ0xFZEJRVWNzUzBGQlN5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMUZCUXpWRUxFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTXNPRUpCUVRoQ0xFZEJRVWNzUzBGQlN5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPMUZCUTJwRkxFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTXNkMEpCUVhkQ0xFZEJRVWNzUzBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMUZCUTNSRUxFbEJRVWtzVDBGQlR5eEZRVUZGTzFsQlExZ3NUMEZCVHl4RFFVRkRMRXRCUVVzc1EwRkJReXd3UWtGQk1FSXNSMEZCUnl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETEVOQlFVTTdVMEZEY2tVN1NVRkRTQ3hEUVVGRE8wbEJSVVFzZDBOQlFYZERPMGxCUTNoRExGTkJRVk1zWVVGQllUdFJRVU53UWl4SlFVRkpMRXRCUVVzc1EwRkJRenRSUVVWV0xFbEJRVWs3V1VGRFJpeE5RVUZOTEVsQlFVa3NTMEZCU3l4RlFVRkZMRU5CUVVNN1UwRkRia0k3VVVGQlF5eFBRVUZQTEVkQlFVY3NSVUZCUlR0WlFVTmFMRXRCUVVzc1IwRkJSeXhIUVVGSExFTkJRVU1zUzBGQlN5eERRVUZETzFOQlEyNUNPMUZCUlVRc1QwRkJUeXhMUVVGTExFTkJRVU03U1VGRFppeERRVUZETzBsQlJVUXNNRU5CUVRCRE8wbEJRekZETEUxQlFVMHNUVUZCVFN4SFFVRkhMRlZCUVZNc1RVRkJZeXhGUVVGRkxFZEJRVWNzUlVGQlJTeFJRVUZSTzFGQlEyNUVMRTFCUVUwc1MwRkJTeXhIUVVGSExFMUJRVTBzUTBGQlF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN1VVRkRhRU1zVDBGQlR5eFJRVUZSTzFsQlEySXNRMEZCUXl4RFFVRkRMRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVWQlFVVXNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMWxCUTNSRkxFTkJRVU1zUTBGQlF5eExRVUZMTEVOQlFVTTdTVUZEV2l4RFFVRkRMRU5CUVVNN1NVRkZSaXhUUVVGVExESkNRVUV5UWl4RFFVRkRMRmxCUVZrc1IwRkJSeXhMUVVGTE8xRkJRM1pFTEUxQlFVMHNTMEZCU3l4SFFVRkhMR0ZCUVdFc1JVRkJSVHRoUVVNeFFpeEpRVUZKTEVWQlFVVTdZVUZEVGl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03VVVGRFppeHZSRUZCYjBRN1VVRkRjRVFzVFVGQlRTeGhRVUZoTEVkQlFVYzdXVUZEY0VJc1UwRkJVeXhGUVVGRkxFVkJRVVU3V1VGRFlpeFZRVUZWTEVWQlFVVXNSVUZCUlR0WlFVTmtMRk5CUVZNc1JVRkJSU3hGUVVGRk8xbEJRMklzVVVGQlVTeEZRVUZGTEVWQlFVVTdXVUZEV2l4aFFVRmhMRVZCUVVVc1JVRkJSVHRaUVVOcVFpeFRRVUZUTEVWQlFVVXNSVUZCUlR0VFFVTmtMRU5CUVVNN1VVRkRSaXhKUVVGSkxFdEJRVXNzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RlFVRkZPMWxCUTNCQ0xFOUJRVThzWVVGQllTeERRVUZETzFOQlEzUkNPMUZCUTBRc01FVkJRVEJGTzFGQlF6RkZMRTFCUVUwc1VVRkJVU3hIUVVGSExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTXhRaXhKUVVGSkxFTkJRVU1zVVVGQlVTeEZRVUZGTzFsQlEySXNUMEZCVHl4aFFVRmhMRU5CUVVNN1UwRkRkRUk3VVVGRFJEczdPenM3T3pzN1YwRlJSenRSUVVOSUxFbEJRVWs3V1VGRFJpeEpRVUZKTEZOQlFWTXNSMEZCUnl4RlFVRkZMRU5CUVVNN1dVRkRia0lzU1VGQlNTeGhRVUZoTEVkQlFVY3NSVUZCUlN4RFFVRkRMRU5CUVVNc05rSkJRVFpDTzFsQlEzSkVMRTFCUVUwc1lVRkJZU3hIUVVGSExGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN1dVRkRNVU1zVFVGQlRTeFJRVUZSTEVkQlFVY3NZVUZCWVN4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxFVkJRVVVzUTBGQlF6dFpRVU40UXl4TlFVRk5MRXRCUVVzc1IwRkJSeXhOUVVGTkxFTkJRVU1zWVVGQllTeERRVUZETEVOQlFVTXNRMEZCUXl4RlFVRkZMRWRCUVVjc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF6dFpRVU12UXl4TlFVRk5MRkZCUVZFc1IwRkJSeXhMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJRenRaUVVONlF5eE5RVUZOTEUxQlFVMHNSMEZCUnl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXp0WlFVTjJReXhOUVVGTkxHTkJRV01zUjBGQlJ5eExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlFVTTdXVUZEY2tRc1RVRkJUU3hUUVVGVExFZEJRVWNzWTBGQll5eERRVUZETEU5QlFVOHNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhEUVVGRExIbERRVUY1UXp0WlFVTTNSaXhKUVVGSkxGTkJRVk1zUzBGQlN5eERRVUZETEVOQlFVTXNSVUZCUlR0blFrRkRjRUlzVTBGQlV5eEhRVUZITEdOQlFXTXNRMEZCUXl4RFFVRkRMRzlFUVVGdlJEdGhRVU5xUmp0cFFrRkJUVHRuUWtGRFRDeFRRVUZUTEVkQlFVY3NZMEZCWXl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFVkJRVVVzVTBGQlV5eERRVUZETEVOQlFVTTdaMEpCUXk5RExHRkJRV0VzUjBGQlJ5eGpRVUZqTEVOQlFVTXNTMEZCU3l4RFFVTnNReXhUUVVGVExFZEJRVWNzUTBGQlF5eEZRVU5pTEdOQlFXTXNRMEZCUXl4TlFVRk5MRU5CUTNSQ0xFTkJRVU03WVVGRFNEdFpRVU5FTEUxQlFVMHNWMEZCVnl4SFFVRkhPMmRDUVVOc1FpeFRRVUZUTzJkQ1FVTlVMRlZCUVZVc1JVRkJSU3hOUVVGTk8yZENRVU5zUWl4VFFVRlRMRVZCUVVVc1VVRkJVVHRuUWtGRGJrSXNVVUZCVVR0blFrRkRVaXhoUVVGaE8yZENRVU5pTEZOQlFWTXNSVUZCUlN4WlFVRlpPMjlDUVVOeVFpeERRVUZETEVOQlFVTXNTMEZCU3p0NVFrRkRSaXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETzNsQ1FVTlNMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU03ZVVKQlExWXNTVUZCU1N4RlFVRkZPMjlDUVVOWUxFTkJRVU1zUTBGQlF5eEZRVUZGTzJGQlExQXNRMEZCUXp0WlFVTkdMRTlCUVU4c1YwRkJWeXhEUVVGRE8xTkJRM0JDTzFGQlFVTXNUMEZCVHl4RFFVRkRMRVZCUVVVN1dVRkRWaXhQUVVGUExFTkJRVU1zUjBGQlJ5eERRVU5VTERKRFFVRXlReXhGUVVNelF5eERRVUZETEVOQlFVTXNVVUZCVVN4RlFVRkZMRVZCUTFvc1VVRkJVU3hEUVVOVUxFTkJRVU03V1VGRFJpeFBRVUZQTEdGQlFXRXNRMEZCUXp0VFFVTjBRanRKUVVOSUxFTkJRVU03U1VGRlJDeFRRVUZUTEZGQlFWRXNRMEZCUXl4TlFVRk5MRVZCUVVVc1dVRkJXVHRSUVVOd1F5eEpRVUZKTEZGQlFWRXNRMEZCUXp0UlFVTmlMRWxCUVVrN1dVRkRSaXhSUVVGUkxFZEJRVWNzVFVGQlRTeERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPMU5CUTJwRE8xRkJRVU1zVDBGQlR5eExRVUZMTEVWQlFVVTdXVUZEWkN4UFFVRlBMRXRCUVVzc1EwRkJRenRUUVVOa08xRkJRMFFzU1VGQlNTeFJRVUZSTEV0QlFVc3NTVUZCU1N4RlFVRkZPMWxCUTNKQ0xIZENRVUYzUWp0WlFVTjRRaXhQUVVGUExFdEJRVXNzUTBGQlF6dFRRVU5rTzFGQlEwUXNUMEZCVHl4UFFVRlBMRkZCUVZFc1MwRkJTeXhSUVVGUkxFTkJRVU03U1VGRGRFTXNRMEZCUXp0SlFVVkVMR2REUVVGblF6dEpRVU5vUXl4M1JVRkJkMFU3U1VGRGVFVXNlVVZCUVhsRk8wbEJRM3BGTEhkRVFVRjNSRHRKUVVONFJDeFRRVUZUTEd0Q1FVRnJRaXhEUVVONlFpeFZRVUZyUWl4RlFVTnNRaXhWUVVGclFpeEZRVU5zUWl4SlFVRlRMRVZCUTFRc1YwRkJkMEk3VVVGRmVFSXNUMEZCVHp0WlFVTk1MRTFCUVUwc1YwRkJWeXhIUVVGSExESkNRVUV5UWl4RFFVRkRMRmRCUVZjc1EwRkJReXhaUVVGWkxFTkJRVU1zUTBGQlF6dFpRVU14UlN4UFFVRlBMRU5CUTB3c1ZVRkJWU3hIUVVGSExFZEJRVWNzUjBGQlJ5eFZRVUZWTEVWQlF6ZENMRk5CUVZNc1JVRkRWQ3hYUVVGWExFVkJRMWdzVjBGQlZ5eERRVU5hTEVOQlFVTTdXVUZEUml4UFFVRlBMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeEZRVUZGTEZOQlFWTXNRMEZCUXl4RFFVRkRPMUZCUTNKRExFTkJRVU1zUTBGQlF6dEpRVU5LTEVOQlFVTTdTVUZGUkN3eVEwRkJNa003U1VGRE0wTXNVMEZCVXl4M1FrRkJkMElzUTBGREwwSXNUVUZCVFN4RlFVTk9MRlZCUVd0Q0xFVkJRMnhDTEZsQlFXOUNMRVZCUTNCQ0xGZEJRWGRDTzFGQlJYaENMRWxCUTBVc1EwRkJReXhOUVVGTk8xbEJRMUFzUTBGQlF5eFZRVUZWTzFsQlExZ3NRMEZCUXl4WlFVRlpPMWxCUTJJc1dVRkJXU3hMUVVGTExGZEJRVmNzUlVGRE5VSTdXVUZEUVN4TlFVRk5MRWxCUVVrc1MwRkJTeXhEUVVOaU8ydENRVU5WTEUxQlFVMDdjMEpCUTBZc1ZVRkJWVHQzUWtGRFVpeFpRVUZaTzFOQlF6TkNMRU5CUTBZc1EwRkJRenRUUVVOSU8xRkJSVVFzZFVOQlFYVkRPMUZCUTNaRExFMUJRVTBzVVVGQlVTeEhRVUZITEUxQlFVMHNRMEZCUXl4eFFrRkJjVUlzUTBGQlF5eE5RVUZOTEVWQlFVVXNXVUZCV1N4RFFVRkRMRU5CUVVNN1VVRkZjRVVzYjBaQlFXOUdPMUZCUTNCR0xFbEJRMFVzUTBGQlF5eFJRVUZSTzFsQlExUXNRMEZCUXl4WFFVRlhMRU5CUVVNc2FVTkJRV2xETEVOQlFVTXNVVUZCVVN4RFFVRkRMRmxCUVZrc1EwRkJReXhGUVVOeVJUdFpRVU5CTEU5QlFVOHNRMEZCUXl4TFFVRkxMRU5CUTFnc2JVTkJRVzFETEVWQlEyNURMRlZCUVZVc1JVRkRWaXhaUVVGWkxFVkJRMW9zVFVGQlRTeERRVU5RTEVOQlFVTTdXVUZEUml4UFFVRlBPMU5CUTFJN1VVRkZSQ3dyUTBGQkswTTdVVUZETDBNc1NVRkJTU3hyUWtGQmEwSXNRMEZCUXp0UlFVTjJRaXhOUVVGTkxHbENRVUZwUWl4SFFVRkhPMWxCUTNoQ0xFZEJRVWNzUlVGQlJTeEhRVUZITEVWQlFVVTdaMEpCUTFJc1QwRkJUeXhyUWtGQmEwSXNRMEZCUXp0WlFVTTFRaXhEUVVGRE8xbEJRMFFzUjBGQlJ5eEZRVUZGTEV0QlFVc3NRMEZCUXl4RlFVRkZPMmRDUVVOWUxHdENRVUZyUWl4SFFVRkhMRXRCUVVzc1EwRkJRenRaUVVNM1FpeERRVUZETzFsQlEwUXNWVUZCVlN4RlFVRkZMRXRCUVVzN1UwRkRiRUlzUTBGQlF6dFJRVVZHTEcxRVFVRnRSRHRSUVVOdVJDeE5RVUZOTEdOQlFXTXNSMEZCUnl4UlFVRlJMRU5CUVVNc1EwRkJReXhEUVVGRExGRkJRVkVzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRMR2xDUVVGcFFpeERRVUZETEVkQlFVY3NRMEZCUXp0UlFVTjJSU3hOUVVGTkxHTkJRV01zUjBGQlJ5eFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVRkRMRkZCUVZFc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETEdsQ1FVRnBRaXhEUVVGRExFZEJRVWNzUTBGQlF6dFJRVU4yUlN4SlFVRkpMR0ZCUVdFc1IwRkJSeXhSUVVGUkxFTkJRVU1zUTBGQlF5eERRVUZETEZGQlFWRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExHdENRVUZyUWl4RFFVRkRPMUZCUlc1RkxHOUZRVUZ2UlR0UlFVTndSU3h2UWtGQmIwSTdVVUZEY0VJc1RVRkJUU3hEUVVGRExHTkJRV01zUTBGQlF5eE5RVUZOTEVWQlFVVXNXVUZCV1N4RlFVRkZPMWxCUXpGRExGbEJRVmtzUlVGQlJTeEpRVUZKTzFsQlEyeENMRWRCUVVjc1JVRkJSU3hEUVVGRE8yZENRVU5LTEU5QlFVODdiMEpCUTB3c1NVRkJTU3haUVVGWkxFTkJRVU03YjBKQlEycENMRTFCUVUwc1YwRkJWeXhIUVVGSExESkNRVUV5UWl4RFFVTTNReXhYUVVGWExFTkJRVU1zV1VGQldTeERRVU42UWl4RFFVRkRPMjlDUVVOR0xFMUJRVTBzZDBKQlFYZENMRWRCUVVjc1IwRkJSeXhWUVVGVkxFbEJRVWtzV1VGQldTeEZRVUZGTEVOQlFVTTdiMEpCUldwRkxIRkNRVUZ4UWp0dlFrRkRja0lzU1VGQlNTeERRVUZETEZGQlFWRXNSVUZCUlR0M1FrRkRZaXgzUWtGQmQwSTdkMEpCUTNoQ0xGbEJRVmtzUjBGQlJ5eHJRa0ZCYTBJc1EwRkJRenR4UWtGRGJrTTdlVUpCUVUwc1NVRkJTU3hqUVVGakxFVkJRVVU3ZDBKQlEzcENMSFZDUVVGMVFqdDNRa0ZEZGtJc1dVRkJXU3hIUVVGSExHTkJRV01zUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN2NVSkJRekZETzNsQ1FVRk5MRWxCUVVrc1QwRkJUeXhKUVVGSkxGRkJRVkVzUlVGQlJUdDNRa0ZET1VJc2JVSkJRVzFDTzNkQ1FVTnVRaXhaUVVGWkxFZEJRVWNzWVVGQllTeERRVUZETzNGQ1FVTTVRanQ1UWtGQlRUdDNRa0ZEVEN4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVOWUxESkNRVUV5UWl4M1FrRkJkMElzWjBOQlFXZERMRU5CUTNCR0xFTkJRVU03ZDBKQlEwWXNVVUZCVVN4RFFVTk9MSGRDUVVGM1FpeEZRVU40UWl4RlFVRkZMRVZCUTBZc1YwRkJWeXhEUVVGRExGVkJRVlVzUlVGRGRFSXNWMEZCVnl4RlFVTllMRmRCUVZjc1EwRkRXaXhEUVVGRE8zZENRVU5HTEU5QlFVODdjVUpCUTFJN2IwSkJSVVFzSzBSQlFTdEVPMjlDUVVNdlJDd3lSRUZCTWtRN2IwSkJRek5FTEhORVFVRnpSRHR2UWtGRGRFUXNhMFZCUVd0Rk8yOUNRVU5zUlN4SlFVRkpMRTlCUVU4c1dVRkJXU3hMUVVGTExGVkJRVlVzUlVGQlJUdDNRa0ZEZEVNc1NVRkJTU3hYUVVGWExFTkJRVU1zWlVGQlpTeEZRVUZGT3pSQ1FVTXZRaXhSUVVGUkxFTkJRMDRzZDBKQlFYZENMRVZCUTNoQ0xGbEJRVmtzUlVGRFdpeFhRVUZYTEVOQlFVTXNXVUZCV1N4RlFVTjRRaXhYUVVGWExFVkJRMWdzVjBGQlZ5eERRVU5hTEVOQlFVTTdlVUpCUTBnN2QwSkJRMFFzVFVGQlRTd3lRa0ZCTWtJc1IwRkJSeXhyUWtGQmEwSXNRMEZEY0VRc1ZVRkJWU3hGUVVOV0xGbEJRVmtzUlVGRFdpeFpRVUZaTEVWQlExb3NWMEZCVnl4RFFVTmFMRU5CUVVNN2QwSkJRMFlzTkVaQlFUUkdPM2RDUVVNMVJpd3dSMEZCTUVjN2QwSkJRekZITEVsQlFVa3NXVUZCV1N4RFFVRkRMRk5CUVZNc1JVRkJSVHMwUWtGRE1VSXNNa0pCUVRKQ0xFTkJRVU1zVTBGQlV5eEhRVUZITEZsQlFWa3NRMEZCUXl4VFFVRlRMRU5CUVVNN05FSkJReTlFTEVsQlFVa3NXVUZCV1N4RFFVRkRMRk5CUVZNc1EwRkJReXhYUVVGWExFVkJRVVU3WjBOQlEzUkRMREpDUVVFeVFpeERRVUZETEZOQlFWTXNRMEZCUXl4WFFVRlhPMjlEUVVNdlF5eFpRVUZaTEVOQlFVTXNVMEZCVXl4RFFVRkRMRmRCUVZjc1EwRkJRenMyUWtGRGRFTTdlVUpCUTBZN2QwSkJRMFFzVDBGQlR5d3lRa0ZCTWtJc1EwRkJRenR4UWtGRGNFTTdlVUpCUVUwc1NVRkRUQ3hQUVVGUExGbEJRVmtzUzBGQlN5eFJRVUZSTzNkQ1FVTm9ReXhYUVVGWExFTkJRVU1zVTBGQlV6dDNRa0ZEY2tJc1YwRkJWeXhEUVVGRExFdEJRVXNzUjBGQlJ5eERRVUZETEVWQlEzSkNPM2RDUVVOQkxFOUJRVThzV1VGQldTeERRVUZETzNGQ1FVTnlRanQ1UWtGQlRUdDNRa0ZEVEN4UlFVRlJMRU5CUTA0c2QwSkJRWGRDTEVWQlEzaENMRmxCUVZrc1JVRkRXaXhYUVVGWExFTkJRVU1zUjBGQlJ5eEZRVU5tTEZkQlFWY3NSVUZEV0N4WFFVRlhMRU5CUTFvc1EwRkJRenQzUWtGRFJpeFBRVUZQTEZsQlFWa3NRMEZCUXp0eFFrRkRja0k3WjBKQlEwZ3NRMEZCUXl4RFFVRkRPMWxCUTBvc1EwRkJReXhEUVVGRExFVkJRVVU3V1VGRFNpeEhRVUZITEVWQlFVVXNRMEZCUXp0blFrRkRTaXhQUVVGUExGVkJRVk1zUzBGQlN6dHZRa0ZEYmtJc1RVRkJUU3hYUVVGWExFZEJRVWNzTWtKQlFUSkNMRU5CUXpkRExGZEJRVmNzUTBGQlF5eFpRVUZaTEVOQlEzcENMRU5CUVVNN2IwSkJRMFlzVFVGQlRTeDNRa0ZCZDBJc1IwRkJSeXhIUVVGSExGVkJRVlVzU1VGQlNTeFpRVUZaTEVWQlFVVXNRMEZCUXp0dlFrRkRha1VzU1VGQlNTeFhRVUZYTEVOQlFVTTdiMEpCUldoQ0xHOUVRVUZ2UkR0dlFrRkRjRVFzU1VGRFJTeFhRVUZYTEVOQlFVTXNWMEZCVnp0M1FrRkRka0lzUTBGQlF5eFBRVUZQTEdGQlFXRXNTMEZCU3l4VlFVRlZPelJDUVVOc1F5eFBRVUZQTEdGQlFXRXNTMEZCU3l4UlFVRlJMRU5CUVVNc1JVRkRjRU03ZDBKQlEwRXNVVUZCVVN4RFFVTk9MSGRDUVVGM1FpeEZRVU40UWl4TFFVRkxMRVZCUTB3c1YwRkJWeXhEUVVGRExHRkJRV0VzUlVGRGVrSXNWMEZCVnl4RlFVTllMRmRCUVZjc1EwRkRXaXhEUVVGRE8zZENRVU5HTEU5QlFVOHNTMEZCU3l4RFFVRkRPM0ZDUVVOa08yOUNRVVZFTERSRFFVRTBRenR2UWtGRE5VTXNTVUZCU1N4alFVRmpMRVZCUVVVN2QwSkJRMnhDTEhWQ1FVRjFRanQzUWtGRGRrSXNWMEZCVnl4SFFVRkhMR05CUVdNc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeEZRVUZGTEV0QlFVc3NRMEZCUXl4RFFVRkRPM0ZDUVVOb1JEdDVRa0ZCVFN4SlFVRkpMRTlCUVU4c1NVRkJTU3hSUVVGUkxFVkJRVVU3ZDBKQlF6bENMRXRCUVVzc1IwRkJSeXhKUVVGSkxFTkJRVU03ZDBKQlEySXNTVUZCU1N4TlFVRk5MRU5CUVVNc1lVRkJZU3hEUVVGRExFbEJRVWtzUTBGQlF5eEZRVUZGT3pSQ1FVTTVRaXhOUVVGTkxFTkJRVU1zWTBGQll5eERRVUZETEVsQlFVa3NSVUZCUlN4WlFVRlpMRVZCUVVVN1owTkJRM2hETEV0QlFVczdOa0pCUTA0c1EwRkJReXhEUVVGRE8zbENRVU5LT3paQ1FVRk5PelJDUVVOTUxHRkJRV0VzUjBGQlJ5eExRVUZMTEVOQlFVTTdlVUpCUTNaQ08zZENRVU5FTEZkQlFWY3NSMEZCUnl4TFFVRkxMRU5CUVVNN2QwSkJRM0JDTEV0QlFVc3NSMEZCUnl4TFFVRkxMRU5CUVVNN2NVSkJRMlk3ZVVKQlFVMDdkMEpCUTB3c1QwRkJUeXhEUVVGRExFdEJRVXNzUTBGRFdDd3lRa0ZCTWtJc2QwSkJRWGRDTEdkRFFVRm5ReXhEUVVOd1JpeERRVUZETzNkQ1FVTkdMRkZCUVZFc1EwRkRUaXgzUWtGQmQwSXNSVUZEZUVJc1MwRkJTeXhGUVVOTUxGZEJRVmNzUTBGQlF5eFZRVUZWTEVWQlEzUkNMRmRCUVZjc1JVRkRXQ3hYUVVGWExFTkJRMW9zUTBGQlF6dDNRa0ZEUml4UFFVRlBMRXRCUVVzc1EwRkJRenR4UWtGRFpEdHZRa0ZEUkN4UlFVRlJMRU5CUTA0c2QwSkJRWGRDTEVWQlEzaENMRXRCUVVzc1JVRkRUQ3hYUVVGWExFTkJRVU1zUjBGQlJ5eEZRVU5tTEZkQlFWY3NSVUZEV0N4WFFVRlhMRU5CUTFvc1EwRkJRenR2UWtGRFJpeFBRVUZQTEZkQlFWY3NRMEZCUXp0blFrRkRja0lzUTBGQlF5eERRVUZETzFsQlEwb3NRMEZCUXl4RFFVRkRMRVZCUVVVN1UwRkRUQ3hEUVVGRExFTkJRVU03U1VGRFRDeERRVUZETzBsQlJVUXNVMEZCVXl4blFrRkJaMElzUTBGRGRrSXNUVUZCVnl4RlFVTllMR2RDUVVGM1FpeEZRVU40UWl4WFFVRjNRanRSUVVWNFFpeG5Sa0ZCWjBZN1VVRkRhRVlzZDBOQlFYZERPMUZCUTNoRExFbEJRVWtzYzBKQlFXZERMRU5CUVVNN1VVRkRja01zU1VGQlNTeFhRVUZYTEVOQlFVTXNjMEpCUVhOQ0xFdEJRVXNzU1VGQlNTeEZRVUZGTzFsQlF5OURMSE5DUVVGelFpeEhRVUZITEVWQlFVVXNRMEZCUXp0VFFVTTNRanRoUVVGTkxFbEJRVWtzVjBGQlZ5eERRVUZETEhOQ1FVRnpRaXhEUVVGRExFMUJRVTBzUzBGQlN5eERRVUZETEVWQlFVVTdXVUZETVVRc2MwSkJRWE5DTEVkQlFVY3NUVUZCVFN4RFFVRkRMR2RDUVVGblFpeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMU5CUXpGRU8yRkJRVTA3V1VGRFRDeHpRa0ZCYzBJc1IwRkJSeXhYUVVGWExFTkJRVU1zYzBKQlFYTkNMRU5CUVVNN1UwRkROMFE3VVVGRFJDeExRVUZMTEUxQlFVMHNXVUZCV1N4SlFVRkpMSE5DUVVGelFpeEZRVUZGTzFsQlEycEVMRWxCUVVrc1YwRkJWeXhEUVVGRExHdENRVUZyUWl4RFFVRkRMRkZCUVZFc1EwRkJReXhaUVVGWkxFTkJRVU1zUlVGQlJUdG5Ra0ZEZWtRc1UwRkJVenRoUVVOV08xbEJRMFFzWjBWQlFXZEZPMWxCUTJoRkxITkVRVUZ6UkR0WlFVTjBSQ3hKUVVORkxGZEJRVmNzUTBGQlF5eFRRVUZUTzJkQ1FVTnlRaXhYUVVGWExFTkJRVU1zUzBGQlN5eEhRVUZITEVOQlFVTTdaMEpCUTNKQ0xGRkJRVkVzUTBGQlF5eE5RVUZOTEVWQlFVVXNXVUZCV1N4RFFVRkRPMmRDUVVNNVFpeFpRVUZaTEV0QlFVc3NWMEZCVnl4RlFVTTFRanRuUWtGRFFTeE5RVUZOTEcxQ1FVRnRRaXhIUVVGSExFZEJRVWNzWjBKQlFXZENMRWxCUVVrc1dVRkJXU3hGUVVGRkxFTkJRVU03WjBKQlEyeEZMRTFCUVUwc1kwRkJZeXhIUVVGSExFVkJRVVVzUjBGQlJ5eFhRVUZYTEVWQlFVVXNRMEZCUXp0blFrRkRNVU1zWTBGQll5eERRVUZETEV0QlFVc3NSMEZCUnl4WFFVRlhMRU5CUVVNc1MwRkJTeXhIUVVGSExFTkJRVU1zUTBGQlF6dG5Ra0ZETjBNc1kwRkJZeXhEUVVGRExITkNRVUZ6UWl4SFFVRkhMRVZCUVVVc1EwRkJRenRuUWtGRE0wTXNaMEpCUVdkQ0xFTkJRMlFzVFVGQlRTeERRVUZETEZsQlFWa3NRMEZCUXl4RlFVTndRaXh0UWtGQmJVSXNSVUZEYmtJc1kwRkJZeXhEUVVObUxFTkJRVU03WVVGRFNEdFpRVU5FTEVsQlFVazdaMEpCUTBZc2QwSkJRWGRDTEVOQlEzUkNMRTFCUVUwc1JVRkRUaXhuUWtGQlowSXNSVUZEYUVJc1dVRkJXU3hGUVVOYUxGZEJRVmNzUTBGRFdpeERRVUZETzJGQlEwZzdXVUZCUXl4UFFVRlBMRXRCUVVzc1JVRkJSVHRuUWtGRFpDeEpRVU5GTEV0QlFVc3NXVUZCV1N4VFFVRlRPMjlDUVVNeFFpeExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJReXd3UTBGQk1FTXNRMEZCUXl4RlFVTnNSVHR2UWtGRFFTeFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVTldMR2RFUVVGblJDeG5Ra0ZCWjBJc1NVRkJTU3haUVVGWkxFVkJRVVVzUTBGRGJrWXNRMEZCUXp0cFFrRkRTRHR4UWtGQlRUdHZRa0ZEVEN4cFFrRkJhVUlzUTBGQlF5eExRVUZMTEVWQlFVVXNSVUZCUlN4blFrRkJaMElzUlVGQlJTeFpRVUZaTEVWQlFVVXNRMEZCUXl4RFFVRkRPMmxDUVVNNVJEdGhRVU5HTzFOQlEwWTdVVUZEUkN4TFFVRkxMRTFCUVUwc1dVRkJXU3hKUVVGSkxGZEJRVmNzUTBGQlF5eHBRMEZCYVVNc1JVRkJSVHRaUVVONFJTeEpRVUZKTEZkQlFWY3NRMEZCUXl4clFrRkJhMElzUTBGQlF5eFJRVUZSTEVOQlFVTXNXVUZCV1N4RFFVRkRMRVZCUVVVN1owSkJRM3BFTEZOQlFWTTdZVUZEVmp0WlFVTkVMRWxCUVVrN1owSkJRMFlzZDBKQlFYZENMRU5CUTNSQ0xFMUJRVTBzUlVGRFRpeG5Ra0ZCWjBJc1JVRkRhRUlzV1VGQldTeEZRVU5hTEZkQlFWY3NRMEZEV2l4RFFVRkRPMkZCUTBnN1dVRkJReXhQUVVGUExFdEJRVXNzUlVGQlJUdG5Ra0ZEWkN4cFFrRkJhVUlzUTBGQlF5eExRVUZMTEVWQlFVVXNSVUZCUlN4blFrRkJaMElzUlVGQlJTeFpRVUZaTEVWQlFVVXNRMEZCUXl4RFFVRkRPMkZCUXpsRU8xTkJRMFk3U1VGRFNDeERRVUZETzBsQlJVUXNUVUZCVFN4WFFVRlhMRWRCUVVjc1ZVRkJVeXhQUVVGUExFVkJRVVVzY1VKQlFYRkNPMUZCUTNwRUxFbEJRVWtzVVVGQlVTeEhRVUZITEVWQlFVVXNRMEZCUXp0UlFVTnNRaXh0UTBGQmJVTTdVVUZEYmtNc1RVRkJUU3hMUVVGTExFZEJRVWNzVVVGQlVTeERRVUZETzFsQlEzSkNMSEZDUVVGeFFpeERRVUZETEU5QlFVOHNSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenRaUVVWNlF5eHJRa0ZCYTBJN1dVRkRiRUlzVVVGQlVTeEhRVUZITEVWQlFVVXNRMEZCUXp0UlFVTm9RaXhEUVVGRExFVkJRVVVzUjBGQlJ5eERRVUZETEVOQlFVTTdVVUZGVWl4UFFVRlBMRlZCUVZNc1QwRkJUeXhGUVVGRkxFZEJRVWM3V1VGRE1VSXNiMEpCUVc5Q08xbEJRM0JDTEZGQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1JVRkJSU3hKUVVGSkxFVkJRVVVzVDBGQlR5eEZRVUZGTEU5QlFVOHNSVUZCUlN4SFFVRkhMRVZCUVVVc1EwRkJReXhEUVVGRE8xbEJReTlETEV0QlFVc3NSVUZCUlN4RFFVRkRPMUZCUTFZc1EwRkJReXhEUVVGRE8wbEJRMG9zUTBGQlF5eERRVUZETzBsQlJVWXNUVUZCVFN4SlFVRkpMRWRCUVVjc1YwRkJWeXhEUVVGRExFOUJRVThzUlVGQlJTeHZRa0ZCYjBJc1EwRkJReXhEUVVGRE8wbEJSWGhFTEZOQlFWTXNXVUZCV1N4RFFVRkRMRzlDUVVFeVF6dFJRVU12UkN4cFJVRkJhVVU3VVVGRGFrVXNPRU5CUVRoRE8xRkJSVGxETEhsRVFVRjVSRHRSUVVONlJDeHBSRUZCYVVRN1VVRkRha1FzYjBKQlFXOUNMRU5CUVVNc1QwRkJUeXhEUVVGRExGVkJRVk1zU1VGQlNUdFpRVU40UXl4blFrRkJaMElzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RlFVRkZMRWxCUVVrc1EwRkJReXhuUWtGQlowSXNSVUZCUlN4SlFVRkpMRU5CUVVNc1YwRkJWeXhEUVVGRExFTkJRVU03VVVGRGVrVXNRMEZCUXl4RFFVRkRMRU5CUVVNN1NVRkRUQ3hEUVVGRE8wbEJSVVFzWjBaQlFXZEdPMGxCUTJoR0xFOUJRVThzV1VGQldTeERRVUZETzBGQlEzUkNMRU5CUVVNaWZRPT0iLCIvKipcbiAqIFRpZXMgdG9nZXRoZXIgdGhlIHR3byBzZXBhcmF0ZSBuYXZpZ2F0aW9uIGV2ZW50cyB0aGF0IHRvZ2V0aGVyIGhvbGRzIGluZm9ybWF0aW9uIGFib3V0IGJvdGggcGFyZW50IGZyYW1lIGlkIGFuZCB0cmFuc2l0aW9uLXJlbGF0ZWQgYXR0cmlidXRlc1xuICovXG5leHBvcnQgY2xhc3MgUGVuZGluZ05hdmlnYXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLm9uQmVmb3JlTmF2aWdhdGVFdmVudE5hdmlnYXRpb24gPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZU9uQmVmb3JlTmF2aWdhdGVFdmVudE5hdmlnYXRpb24gPSByZXNvbHZlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vbkNvbW1pdHRlZEV2ZW50TmF2aWdhdGlvbiA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlT25Db21taXR0ZWRFdmVudE5hdmlnYXRpb24gPSByZXNvbHZlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVzb2x2ZWQoKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB0aGlzLm9uQmVmb3JlTmF2aWdhdGVFdmVudE5hdmlnYXRpb24sXG4gICAgICAgICAgICB0aGlzLm9uQ29tbWl0dGVkRXZlbnROYXZpZ2F0aW9uLFxuICAgICAgICBdKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRWl0aGVyIHJldHVybnMgb3IgdGltZXMgb3V0IGFuZCByZXR1cm5zIHVuZGVmaW5lZCBvclxuICAgICAqIHJldHVybnMgdGhlIHJlc3VsdHMgZnJvbSByZXNvbHZlZCgpIGFib3ZlXG4gICAgICogQHBhcmFtIG1zXG4gICAgICovXG4gICAgYXN5bmMgcmVzb2x2ZWRXaXRoaW5UaW1lb3V0KG1zKSB7XG4gICAgICAgIGNvbnN0IHJlc29sdmVkID0gYXdhaXQgUHJvbWlzZS5yYWNlKFtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZWQoKSxcbiAgICAgICAgICAgIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpLFxuICAgICAgICBdKTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmVkO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWNHVnVaR2x1WnkxdVlYWnBaMkYwYVc5dUxtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTGk0dkxpNHZMaTR2YzNKakwyeHBZaTl3Wlc1a2FXNW5MVzVoZG1sbllYUnBiMjR1ZEhNaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlJVRTdPMGRCUlVjN1FVRkRTQ3hOUVVGTkxFOUJRVThzYVVKQlFXbENPMGxCU3pWQ08xRkJRMFVzU1VGQlNTeERRVUZETEN0Q1FVRXJRaXhIUVVGSExFbEJRVWtzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4RlFVRkZPMWxCUXpORUxFbEJRVWtzUTBGQlF5eHpRMEZCYzBNc1IwRkJSeXhQUVVGUExFTkJRVU03VVVGRGVFUXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRTQ3hKUVVGSkxFTkJRVU1zTUVKQlFUQkNMRWRCUVVjc1NVRkJTU3hQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVWQlFVVTdXVUZEZEVRc1NVRkJTU3hEUVVGRExHbERRVUZwUXl4SFFVRkhMRTlCUVU4c1EwRkJRenRSUVVOdVJDeERRVUZETEVOQlFVTXNRMEZCUXp0SlFVTk1MRU5CUVVNN1NVRkRUU3hSUVVGUk8xRkJRMklzVDBGQlR5eFBRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRPMWxCUTJwQ0xFbEJRVWtzUTBGQlF5d3JRa0ZCSzBJN1dVRkRjRU1zU1VGQlNTeERRVUZETERCQ1FVRXdRanRUUVVOb1F5eERRVUZETEVOQlFVTTdTVUZEVEN4RFFVRkRPMGxCUlVRN096czdUMEZKUnp0SlFVTkpMRXRCUVVzc1EwRkJReXh4UWtGQmNVSXNRMEZCUXl4RlFVRkZPMUZCUTI1RExFMUJRVTBzVVVGQlVTeEhRVUZITEUxQlFVMHNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJRenRaUVVOc1F5eEpRVUZKTEVOQlFVTXNVVUZCVVN4RlFVRkZPMWxCUTJZc1NVRkJTU3hQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVWQlFVVXNRMEZCUXl4VlFVRlZMRU5CUVVNc1QwRkJUeXhGUVVGRkxFVkJRVVVzUTBGQlF5eERRVUZETzFOQlEyaEVMRU5CUVVNc1EwRkJRenRSUVVOSUxFOUJRVThzVVVGQlVTeERRVUZETzBsQlEyeENMRU5CUVVNN1EwRkRSaUo5IiwiLyoqXG4gKiBUaWVzIHRvZ2V0aGVyIHRoZSB0d28gc2VwYXJhdGUgZXZlbnRzIHRoYXQgdG9nZXRoZXIgaG9sZHMgaW5mb3JtYXRpb24gYWJvdXQgYm90aCByZXF1ZXN0IGhlYWRlcnMgYW5kIGJvZHlcbiAqL1xuZXhwb3J0IGNsYXNzIFBlbmRpbmdSZXF1ZXN0IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5vbkJlZm9yZVJlcXVlc3RFdmVudERldGFpbHMgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZU9uQmVmb3JlUmVxdWVzdEV2ZW50RGV0YWlscyA9IHJlc29sdmU7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm9uQmVmb3JlU2VuZEhlYWRlcnNFdmVudERldGFpbHMgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZU9uQmVmb3JlU2VuZEhlYWRlcnNFdmVudERldGFpbHMgPSByZXNvbHZlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVzb2x2ZWQoKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB0aGlzLm9uQmVmb3JlUmVxdWVzdEV2ZW50RGV0YWlscyxcbiAgICAgICAgICAgIHRoaXMub25CZWZvcmVTZW5kSGVhZGVyc0V2ZW50RGV0YWlscyxcbiAgICAgICAgXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEVpdGhlciByZXR1cm5zIG9yIHRpbWVzIG91dCBhbmQgcmV0dXJucyB1bmRlZmluZWQgb3JcbiAgICAgKiByZXR1cm5zIHRoZSByZXN1bHRzIGZyb20gcmVzb2x2ZWQoKSBhYm92ZVxuICAgICAqIEBwYXJhbSBtc1xuICAgICAqL1xuICAgIGFzeW5jIHJlc29sdmVkV2l0aGluVGltZW91dChtcykge1xuICAgICAgICBjb25zdCByZXNvbHZlZCA9IGF3YWl0IFByb21pc2UucmFjZShbXG4gICAgICAgICAgICB0aGlzLnJlc29sdmVkKCksXG4gICAgICAgICAgICBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKSxcbiAgICAgICAgXSk7XG4gICAgICAgIHJldHVybiByZXNvbHZlZDtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2ljR1Z1WkdsdVp5MXlaWEYxWlhOMExtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTGk0dkxpNHZMaTR2YzNKakwyeHBZaTl3Wlc1a2FXNW5MWEpsY1hWbGMzUXVkSE1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUzBFN08wZEJSVWM3UVVGRFNDeE5RVUZOTEU5QlFVOHNZMEZCWXp0SlFXRjZRanRSUVVORkxFbEJRVWtzUTBGQlF5d3lRa0ZCTWtJc1IwRkJSeXhKUVVGSkxFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNSVUZCUlR0WlFVTjJSQ3hKUVVGSkxFTkJRVU1zYTBOQlFXdERMRWRCUVVjc1QwRkJUeXhEUVVGRE8xRkJRM0JFTEVOQlFVTXNRMEZCUXl4RFFVRkRPMUZCUTBnc1NVRkJTU3hEUVVGRExDdENRVUVyUWl4SFFVRkhMRWxCUVVrc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eEZRVUZGTzFsQlF6TkVMRWxCUVVrc1EwRkJReXh6UTBGQmMwTXNSMEZCUnl4UFFVRlBMRU5CUVVNN1VVRkRlRVFzUTBGQlF5eERRVUZETEVOQlFVTTdTVUZEVEN4RFFVRkRPMGxCUTAwc1VVRkJVVHRSUVVOaUxFOUJRVThzVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXp0WlFVTnFRaXhKUVVGSkxFTkJRVU1zTWtKQlFUSkNPMWxCUTJoRExFbEJRVWtzUTBGQlF5d3JRa0ZCSzBJN1UwRkRja01zUTBGQlF5eERRVUZETzBsQlEwd3NRMEZCUXp0SlFVVkVPenM3TzA5QlNVYzdTVUZEU1N4TFFVRkxMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNSVUZCUlR0UlFVTnVReXhOUVVGTkxGRkJRVkVzUjBGQlJ5eE5RVUZOTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNN1dVRkRiRU1zU1VGQlNTeERRVUZETEZGQlFWRXNSVUZCUlR0WlFVTm1MRWxCUVVrc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eEZRVUZGTEVOQlFVTXNWVUZCVlN4RFFVRkRMRTlCUVU4c1JVRkJSU3hGUVVGRkxFTkJRVU1zUTBGQlF6dFRRVU5vUkN4RFFVRkRMRU5CUVVNN1VVRkRTQ3hQUVVGUExGRkJRVkVzUTBGQlF6dEpRVU5zUWl4RFFVRkRPME5CUTBZaWZRPT0iLCJpbXBvcnQgeyBSZXNwb25zZUJvZHlMaXN0ZW5lciB9IGZyb20gXCIuL3Jlc3BvbnNlLWJvZHktbGlzdGVuZXJcIjtcbi8qKlxuICogVGllcyB0b2dldGhlciB0aGUgdHdvIHNlcGFyYXRlIGV2ZW50cyB0aGF0IHRvZ2V0aGVyIGhvbGRzIGluZm9ybWF0aW9uIGFib3V0IGJvdGggcmVzcG9uc2UgaGVhZGVycyBhbmQgYm9keVxuICovXG5leHBvcnQgY2xhc3MgUGVuZGluZ1Jlc3BvbnNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5vbkJlZm9yZVJlcXVlc3RFdmVudERldGFpbHMgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZU9uQmVmb3JlUmVxdWVzdEV2ZW50RGV0YWlscyA9IHJlc29sdmU7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm9uQ29tcGxldGVkRXZlbnREZXRhaWxzID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmVPbkNvbXBsZXRlZEV2ZW50RGV0YWlscyA9IHJlc29sdmU7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhZGRSZXNwb25zZVJlc3BvbnNlQm9keUxpc3RlbmVyKGRldGFpbHMpIHtcbiAgICAgICAgdGhpcy5yZXNwb25zZUJvZHlMaXN0ZW5lciA9IG5ldyBSZXNwb25zZUJvZHlMaXN0ZW5lcihkZXRhaWxzKTtcbiAgICB9XG4gICAgcmVzb2x2ZWQoKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB0aGlzLm9uQmVmb3JlUmVxdWVzdEV2ZW50RGV0YWlscyxcbiAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZWRFdmVudERldGFpbHMsXG4gICAgICAgIF0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBFaXRoZXIgcmV0dXJucyBvciB0aW1lcyBvdXQgYW5kIHJldHVybnMgdW5kZWZpbmVkIG9yXG4gICAgICogcmV0dXJucyB0aGUgcmVzdWx0cyBmcm9tIHJlc29sdmVkKCkgYWJvdmVcbiAgICAgKiBAcGFyYW0gbXNcbiAgICAgKi9cbiAgICBhc3luYyByZXNvbHZlZFdpdGhpblRpbWVvdXQobXMpIHtcbiAgICAgICAgY29uc3QgcmVzb2x2ZWQgPSBhd2FpdCBQcm9taXNlLnJhY2UoW1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlZCgpLFxuICAgICAgICAgICAgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSksXG4gICAgICAgIF0pO1xuICAgICAgICByZXR1cm4gcmVzb2x2ZWQ7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pY0dWdVpHbHVaeTF5WlhOd2IyNXpaUzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpNHVMeTR1THk0dUwzTnlZeTlzYVdJdmNHVnVaR2x1WnkxeVpYTndiMjV6WlM1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkpRU3hQUVVGUExFVkJRVVVzYjBKQlFXOUNMRVZCUVVVc1RVRkJUU3d3UWtGQk1FSXNRMEZCUXp0QlFVVm9SVHM3UjBGRlJ6dEJRVU5JTEUxQlFVMHNUMEZCVHl4bFFVRmxPMGxCWXpGQ08xRkJRMFVzU1VGQlNTeERRVUZETERKQ1FVRXlRaXhIUVVGSExFbEJRVWtzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4RlFVRkZPMWxCUTNaRUxFbEJRVWtzUTBGQlF5eHJRMEZCYTBNc1IwRkJSeXhQUVVGUExFTkJRVU03VVVGRGNFUXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRTQ3hKUVVGSkxFTkJRVU1zZFVKQlFYVkNMRWRCUVVjc1NVRkJTU3hQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVWQlFVVTdXVUZEYmtRc1NVRkJTU3hEUVVGRExEaENRVUU0UWl4SFFVRkhMRTlCUVU4c1EwRkJRenRSUVVOb1JDeERRVUZETEVOQlFVTXNRMEZCUXp0SlFVTk1MRU5CUVVNN1NVRkRUU3dyUWtGQkswSXNRMEZEY0VNc1QwRkJPRU03VVVGRk9VTXNTVUZCU1N4RFFVRkRMRzlDUVVGdlFpeEhRVUZITEVsQlFVa3NiMEpCUVc5Q0xFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdTVUZEYUVVc1EwRkJRenRKUVVOTkxGRkJRVkU3VVVGRFlpeFBRVUZQTEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNN1dVRkRha0lzU1VGQlNTeERRVUZETERKQ1FVRXlRanRaUVVOb1F5eEpRVUZKTEVOQlFVTXNkVUpCUVhWQ08xTkJRemRDTEVOQlFVTXNRMEZCUXp0SlFVTk1MRU5CUVVNN1NVRkZSRHM3T3p0UFFVbEhPMGxCUTBrc1MwRkJTeXhEUVVGRExIRkNRVUZ4UWl4RFFVRkRMRVZCUVVVN1VVRkRia01zVFVGQlRTeFJRVUZSTEVkQlFVY3NUVUZCVFN4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRE8xbEJRMnhETEVsQlFVa3NRMEZCUXl4UlFVRlJMRVZCUVVVN1dVRkRaaXhKUVVGSkxFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNSVUZCUlN4RFFVRkRMRlZCUVZVc1EwRkJReXhQUVVGUExFVkJRVVVzUlVGQlJTeERRVUZETEVOQlFVTTdVMEZEYUVRc1EwRkJReXhEUVVGRE8xRkJRMGdzVDBGQlR5eFJRVUZSTEVOQlFVTTdTVUZEYkVJc1EwRkJRenREUVVOR0luMD0iLCJpbXBvcnQgeyBkaWdlc3RNZXNzYWdlIH0gZnJvbSBcIi4vc2hhMjU2XCI7XG5leHBvcnQgY2xhc3MgUmVzcG9uc2VCb2R5TGlzdGVuZXIge1xuICAgIGNvbnN0cnVjdG9yKGRldGFpbHMpIHtcbiAgICAgICAgdGhpcy5yZXNwb25zZUJvZHkgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZVJlc3BvbnNlQm9keSA9IHJlc29sdmU7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNvbnRlbnRIYXNoID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmVDb250ZW50SGFzaCA9IHJlc29sdmU7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBVc2VkIHRvIHBhcnNlIFJlc3BvbnNlIHN0cmVhbVxuICAgICAgICBjb25zdCBmaWx0ZXIgPSBicm93c2VyLndlYlJlcXVlc3QuZmlsdGVyUmVzcG9uc2VEYXRhKGRldGFpbHMucmVxdWVzdElkKTtcbiAgICAgICAgbGV0IHJlc3BvbnNlQm9keSA9IG5ldyBVaW50OEFycmF5KCk7XG4gICAgICAgIGZpbHRlci5vbmRhdGEgPSBldmVudCA9PiB7XG4gICAgICAgICAgICBkaWdlc3RNZXNzYWdlKGV2ZW50LmRhdGEpLnRoZW4oZGlnZXN0ID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc29sdmVDb250ZW50SGFzaChkaWdlc3QpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBpbmNvbWluZyA9IG5ldyBVaW50OEFycmF5KGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc3QgdG1wID0gbmV3IFVpbnQ4QXJyYXkocmVzcG9uc2VCb2R5Lmxlbmd0aCArIGluY29taW5nLmxlbmd0aCk7XG4gICAgICAgICAgICB0bXAuc2V0KHJlc3BvbnNlQm9keSk7XG4gICAgICAgICAgICB0bXAuc2V0KGluY29taW5nLCByZXNwb25zZUJvZHkubGVuZ3RoKTtcbiAgICAgICAgICAgIHJlc3BvbnNlQm9keSA9IHRtcDtcbiAgICAgICAgICAgIGZpbHRlci53cml0ZShldmVudC5kYXRhKTtcbiAgICAgICAgfTtcbiAgICAgICAgZmlsdGVyLm9uc3RvcCA9IF9ldmVudCA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmVSZXNwb25zZUJvZHkocmVzcG9uc2VCb2R5KTtcbiAgICAgICAgICAgIGZpbHRlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGFzeW5jIGdldFJlc3BvbnNlQm9keSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzcG9uc2VCb2R5O1xuICAgIH1cbiAgICBhc3luYyBnZXRDb250ZW50SGFzaCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudEhhc2g7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pY21WemNHOXVjMlV0WW05a2VTMXNhWE4wWlc1bGNpNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMeTR1TDNOeVl5OXNhV0l2Y21WemNHOXVjMlV0WW05a2VTMXNhWE4wWlc1bGNpNTBjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZEUVN4UFFVRlBMRVZCUVVVc1lVRkJZU3hGUVVGRkxFMUJRVTBzVlVGQlZTeERRVUZETzBGQlJYcERMRTFCUVUwc1QwRkJUeXh2UWtGQmIwSTdTVUZOTDBJc1dVRkJXU3hQUVVFNFF6dFJRVU40UkN4SlFVRkpMRU5CUVVNc1dVRkJXU3hIUVVGSExFbEJRVWtzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4RlFVRkZPMWxCUTNoRExFbEJRVWtzUTBGQlF5eHRRa0ZCYlVJc1IwRkJSeXhQUVVGUExFTkJRVU03VVVGRGNrTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRTQ3hKUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEVsQlFVa3NUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhGUVVGRk8xbEJRM1pETEVsQlFVa3NRMEZCUXl4clFrRkJhMElzUjBGQlJ5eFBRVUZQTEVOQlFVTTdVVUZEY0VNc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRlNDeG5RMEZCWjBNN1VVRkRhRU1zVFVGQlRTeE5RVUZOTEVkQlFWRXNUMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhyUWtGQmEwSXNRMEZEZGtRc1QwRkJUeXhEUVVGRExGTkJRVk1zUTBGRFdDeERRVUZETzFGQlJWUXNTVUZCU1N4WlFVRlpMRWRCUVVjc1NVRkJTU3hWUVVGVkxFVkJRVVVzUTBGQlF6dFJRVU53UXl4TlFVRk5MRU5CUVVNc1RVRkJUU3hIUVVGSExFdEJRVXNzUTBGQlF5eEZRVUZGTzFsQlEzUkNMR0ZCUVdFc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhGUVVGRk8yZENRVU4wUXl4SlFVRkpMRU5CUVVNc2EwSkJRV3RDTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1dVRkRiRU1zUTBGQlF5eERRVUZETEVOQlFVTTdXVUZEU0N4TlFVRk5MRkZCUVZFc1IwRkJSeXhKUVVGSkxGVkJRVlVzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1dVRkROVU1zVFVGQlRTeEhRVUZITEVkQlFVY3NTVUZCU1N4VlFVRlZMRU5CUVVNc1dVRkJXU3hEUVVGRExFMUJRVTBzUjBGQlJ5eFJRVUZSTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1dVRkRiRVVzUjBGQlJ5eERRVUZETEVkQlFVY3NRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJRenRaUVVOMFFpeEhRVUZITEVOQlFVTXNSMEZCUnl4RFFVRkRMRkZCUVZFc1JVRkJSU3haUVVGWkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdXVUZEZGtNc1dVRkJXU3hIUVVGSExFZEJRVWNzUTBGQlF6dFpRVU51UWl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0UlFVTXpRaXhEUVVGRExFTkJRVU03VVVGRlJpeE5RVUZOTEVOQlFVTXNUVUZCVFN4SFFVRkhMRTFCUVUwc1EwRkJReXhGUVVGRk8xbEJRM1pDTEVsQlFVa3NRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXp0WlFVTjJReXhOUVVGTkxFTkJRVU1zVlVGQlZTeEZRVUZGTEVOQlFVTTdVVUZEZEVJc1EwRkJReXhEUVVGRE8wbEJRMG9zUTBGQlF6dEpRVVZOTEV0QlFVc3NRMEZCUXl4bFFVRmxPMUZCUXpGQ0xFOUJRVThzU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXp0SlFVTXpRaXhEUVVGRE8wbEJSVTBzUzBGQlN5eERRVUZETEdOQlFXTTdVVUZEZWtJc1QwRkJUeXhKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETzBsQlF6RkNMRU5CUVVNN1EwRkRSaUo5IiwiLyoqXG4gKiBDb2RlIGZyb20gdGhlIGV4YW1wbGUgYXRcbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9TdWJ0bGVDcnlwdG8vZGlnZXN0XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkaWdlc3RNZXNzYWdlKG1zZ1VpbnQ4KSB7XG4gICAgY29uc3QgaGFzaEJ1ZmZlciA9IGF3YWl0IGNyeXB0by5zdWJ0bGUuZGlnZXN0KFwiU0hBLTI1NlwiLCBtc2dVaW50OCk7IC8vIGhhc2ggdGhlIG1lc3NhZ2VcbiAgICBjb25zdCBoYXNoQXJyYXkgPSBBcnJheS5mcm9tKG5ldyBVaW50OEFycmF5KGhhc2hCdWZmZXIpKTsgLy8gY29udmVydCBidWZmZXIgdG8gYnl0ZSBhcnJheVxuICAgIGNvbnN0IGhhc2hIZXggPSBoYXNoQXJyYXkubWFwKGIgPT4gYi50b1N0cmluZygxNikucGFkU3RhcnQoMiwgXCIwXCIpKS5qb2luKFwiXCIpOyAvLyBjb252ZXJ0IGJ5dGVzIHRvIGhleCBzdHJpbmdcbiAgICByZXR1cm4gaGFzaEhleDtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWMyaGhNalUyTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhNaU9sc2lMaTR2TGk0dkxpNHZjM0pqTDJ4cFlpOXphR0V5TlRZdWRITWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3T3p0SFFVZEhPMEZCUlVnc1RVRkJUU3hEUVVGRExFdEJRVXNzVlVGQlZTeGhRVUZoTEVOQlFVTXNVVUZCYjBJN1NVRkRkRVFzVFVGQlRTeFZRVUZWTEVkQlFVY3NUVUZCVFN4TlFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExFMUJRVTBzUTBGQlF5eFRRVUZUTEVWQlFVVXNVVUZCVVN4RFFVRkRMRU5CUVVNc1EwRkJReXh0UWtGQmJVSTdTVUZEZGtZc1RVRkJUU3hUUVVGVExFZEJRVWNzUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRlZCUVZVc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNLMEpCUVN0Q08wbEJRM3BHTEUxQlFVMHNUMEZCVHl4SFFVRkhMRk5CUVZNc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1VVRkJVU3hEUVVGRExFVkJRVVVzUTBGQlF5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRVZCUVVVc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF5eEpRVUZKTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJReXc0UWtGQk9FSTdTVUZETlVjc1QwRkJUeXhQUVVGUExFTkJRVU03UVVGRGFrSXNRMEZCUXlKOSIsImV4cG9ydCBmdW5jdGlvbiBlbmNvZGVfdXRmOChzKSB7XG4gICAgcmV0dXJuIHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChzKSk7XG59XG5leHBvcnQgY29uc3QgZXNjYXBlU3RyaW5nID0gZnVuY3Rpb24gKHN0cikge1xuICAgIC8vIENvbnZlcnQgdG8gc3RyaW5nIGlmIG5lY2Vzc2FyeVxuICAgIGlmICh0eXBlb2Ygc3RyICE9IFwic3RyaW5nXCIpIHtcbiAgICAgICAgc3RyID0gU3RyaW5nKHN0cik7XG4gICAgfVxuICAgIHJldHVybiBlbmNvZGVfdXRmOChzdHIpO1xufTtcbmV4cG9ydCBjb25zdCBlc2NhcGVVcmwgPSBmdW5jdGlvbiAodXJsLCBzdHJpcERhdGFVcmxEYXRhID0gdHJ1ZSkge1xuICAgIHVybCA9IGVzY2FwZVN0cmluZyh1cmwpO1xuICAgIC8vIGRhdGE6WzxtZWRpYXR5cGU+XVs7YmFzZTY0XSw8ZGF0YT5cbiAgICBpZiAodXJsLnN1YnN0cigwLCA1KSA9PT0gXCJkYXRhOlwiICYmXG4gICAgICAgIHN0cmlwRGF0YVVybERhdGEgJiZcbiAgICAgICAgdXJsLmluZGV4T2YoXCIsXCIpID4gLTEpIHtcbiAgICAgICAgdXJsID0gdXJsLnN1YnN0cigwLCB1cmwuaW5kZXhPZihcIixcIikgKyAxKSArIFwiPGRhdGEtc3RyaXBwZWQ+XCI7XG4gICAgfVxuICAgIHJldHVybiB1cmw7XG59O1xuLy8gQmFzZTY0IGVuY29kaW5nLCBmb3VuZCBvbjpcbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEyNzEwMDAxL2hvdy10by1jb252ZXJ0LXVpbnQ4LWFycmF5LXRvLWJhc2U2NC1lbmNvZGVkLXN0cmluZy8yNTY0NDQwOSMyNTY0NDQwOVxuZXhwb3J0IGNvbnN0IFVpbnQ4VG9CYXNlNjQgPSBmdW5jdGlvbiAodThBcnIpIHtcbiAgICBjb25zdCBDSFVOS19TSVpFID0gMHg4MDAwOyAvLyBhcmJpdHJhcnkgbnVtYmVyXG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBjb25zdCBsZW5ndGggPSB1OEFyci5sZW5ndGg7XG4gICAgbGV0IHJlc3VsdCA9IFwiXCI7XG4gICAgbGV0IHNsaWNlO1xuICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICBzbGljZSA9IHU4QXJyLnN1YmFycmF5KGluZGV4LCBNYXRoLm1pbihpbmRleCArIENIVU5LX1NJWkUsIGxlbmd0aCkpO1xuICAgICAgICByZXN1bHQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBzbGljZSk7XG4gICAgICAgIGluZGV4ICs9IENIVU5LX1NJWkU7XG4gICAgfVxuICAgIHJldHVybiBidG9hKHJlc3VsdCk7XG59O1xuZXhwb3J0IGNvbnN0IGJvb2xUb0ludCA9IGZ1bmN0aW9uIChib29sKSB7XG4gICAgcmV0dXJuIGJvb2wgPyAxIDogMDtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2ljM1J5YVc1bkxYVjBhV3h6TG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhNaU9sc2lMaTR2TGk0dkxpNHZjM0pqTDJ4cFlpOXpkSEpwYm1jdGRYUnBiSE11ZEhNaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNUVUZCVFN4VlFVRlZMRmRCUVZjc1EwRkJReXhEUVVGRE8wbEJRek5DTEU5QlFVOHNVVUZCVVN4RFFVRkRMR3RDUVVGclFpeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRla01zUTBGQlF6dEJRVVZFTEUxQlFVMHNRMEZCUXl4TlFVRk5MRmxCUVZrc1IwRkJSeXhWUVVGVExFZEJRVkU3U1VGRE0wTXNhVU5CUVdsRE8wbEJRMnBETEVsQlFVa3NUMEZCVHl4SFFVRkhMRWxCUVVrc1VVRkJVU3hGUVVGRk8xRkJRekZDTEVkQlFVY3NSMEZCUnl4TlFVRk5MRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU03UzBGRGJrSTdTVUZGUkN4UFFVRlBMRmRCUVZjc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF6dEJRVU14UWl4RFFVRkRMRU5CUVVNN1FVRkZSaXhOUVVGTkxFTkJRVU1zVFVGQlRTeFRRVUZUTEVkQlFVY3NWVUZEZGtJc1IwRkJWeXhGUVVOWUxHMUNRVUUwUWl4SlFVRkpPMGxCUldoRExFZEJRVWNzUjBGQlJ5eFpRVUZaTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN1NVRkRlRUlzY1VOQlFYRkRPMGxCUTNKRExFbEJRMFVzUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRExFdEJRVXNzVDBGQlR6dFJRVU0xUWl4blFrRkJaMEk3VVVGRGFFSXNSMEZCUnl4RFFVRkRMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNSVUZEY2tJN1VVRkRRU3hIUVVGSExFZEJRVWNzUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRMRVZCUVVVc1IwRkJSeXhEUVVGRExFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1IwRkJSeXhwUWtGQmFVSXNRMEZCUXp0TFFVTXZSRHRKUVVORUxFOUJRVThzUjBGQlJ5eERRVUZETzBGQlEySXNRMEZCUXl4RFFVRkRPMEZCUlVZc05rSkJRVFpDTzBGQlF6ZENMSEZJUVVGeFNEdEJRVU55U0N4TlFVRk5MRU5CUVVNc1RVRkJUU3hoUVVGaExFZEJRVWNzVlVGQlV5eExRVUZwUWp0SlFVTnlSQ3hOUVVGTkxGVkJRVlVzUjBGQlJ5eE5RVUZOTEVOQlFVTXNRMEZCUXl4dFFrRkJiVUk3U1VGRE9VTXNTVUZCU1N4TFFVRkxMRWRCUVVjc1EwRkJReXhEUVVGRE8wbEJRMlFzVFVGQlRTeE5RVUZOTEVkQlFVY3NTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkJRenRKUVVNMVFpeEpRVUZKTEUxQlFVMHNSMEZCUnl4RlFVRkZMRU5CUVVNN1NVRkRhRUlzU1VGQlNTeExRVUZwUWl4RFFVRkRPMGxCUTNSQ0xFOUJRVThzUzBGQlN5eEhRVUZITEUxQlFVMHNSVUZCUlR0UlFVTnlRaXhMUVVGTExFZEJRVWNzUzBGQlN5eERRVUZETEZGQlFWRXNRMEZCUXl4TFFVRkxMRVZCUVVVc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eExRVUZMTEVkQlFVY3NWVUZCVlN4RlFVRkZMRTFCUVUwc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRGNFVXNUVUZCVFN4SlFVRkpMRTFCUVUwc1EwRkJReXhaUVVGWkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NSVUZCUlN4TFFVRkxMRU5CUVVNc1EwRkJRenRSUVVOcVJDeExRVUZMTEVsQlFVa3NWVUZCVlN4RFFVRkRPMHRCUTNKQ08wbEJRMFFzVDBGQlR5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1FVRkRkRUlzUTBGQlF5eERRVUZETzBGQlJVWXNUVUZCVFN4RFFVRkRMRTFCUVUwc1UwRkJVeXhIUVVGSExGVkJRVk1zU1VGQllUdEpRVU0zUXl4UFFVRlBMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRkRUlzUTBGQlF5eERRVUZESW4wPSIsIi8qIHRzbGludDpkaXNhYmxlOm5vLWJpdHdpc2UgKi9cbi8vIGZyb20gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vamVkLzk4Mjg4MyNnaXN0Y29tbWVudC0yNDAzMzY5XG5jb25zdCBoZXggPSBbXTtcbmZvciAobGV0IGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcbiAgICBoZXhbaV0gPSAoaSA8IDE2ID8gXCIwXCIgOiBcIlwiKSArIGkudG9TdHJpbmcoMTYpO1xufVxuZXhwb3J0IGNvbnN0IG1ha2VVVUlEID0gKCkgPT4ge1xuICAgIGNvbnN0IHIgPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KDE2KSk7XG4gICAgcls2XSA9IChyWzZdICYgMHgwZikgfCAweDQwO1xuICAgIHJbOF0gPSAocls4XSAmIDB4M2YpIHwgMHg4MDtcbiAgICByZXR1cm4gKGhleFtyWzBdXSArXG4gICAgICAgIGhleFtyWzFdXSArXG4gICAgICAgIGhleFtyWzJdXSArXG4gICAgICAgIGhleFtyWzNdXSArXG4gICAgICAgIFwiLVwiICtcbiAgICAgICAgaGV4W3JbNF1dICtcbiAgICAgICAgaGV4W3JbNV1dICtcbiAgICAgICAgXCItXCIgK1xuICAgICAgICBoZXhbcls2XV0gK1xuICAgICAgICBoZXhbcls3XV0gK1xuICAgICAgICBcIi1cIiArXG4gICAgICAgIGhleFtyWzhdXSArXG4gICAgICAgIGhleFtyWzldXSArXG4gICAgICAgIFwiLVwiICtcbiAgICAgICAgaGV4W3JbMTBdXSArXG4gICAgICAgIGhleFtyWzExXV0gK1xuICAgICAgICBoZXhbclsxMl1dICtcbiAgICAgICAgaGV4W3JbMTNdXSArXG4gICAgICAgIGhleFtyWzE0XV0gK1xuICAgICAgICBoZXhbclsxNV1dKTtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkWFZwWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUx5NHVMM055WXk5c2FXSXZkWFZwWkM1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3dyUWtGQkswSTdRVUZGTDBJc09FUkJRVGhFTzBGQlF6bEVMRTFCUVUwc1IwRkJSeXhIUVVGSExFVkJRVVVzUTBGQlF6dEJRVVZtTEV0QlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eEhRVUZITEVWQlFVVXNRMEZCUXl4RlFVRkZMRVZCUVVVN1NVRkROVUlzUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJReXhIUVVGSExFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNVVUZCVVN4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRE8wTkJReTlETzBGQlJVUXNUVUZCVFN4RFFVRkRMRTFCUVUwc1VVRkJVU3hIUVVGSExFZEJRVWNzUlVGQlJUdEpRVU16UWl4TlFVRk5MRU5CUVVNc1IwRkJSeXhOUVVGTkxFTkJRVU1zWlVGQlpTeERRVUZETEVsQlFVa3NWVUZCVlN4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU03U1VGRmNrUXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4SFFVRkhMRWxCUVVrc1EwRkJReXhIUVVGSExFbEJRVWtzUTBGQlF6dEpRVU0xUWl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZETzBsQlJUVkNMRTlCUVU4c1EwRkRUQ3hIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMUZCUTFRc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTlVMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdVVUZEVkN4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzFGQlExUXNSMEZCUnp0UlFVTklMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdVVUZEVkN4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzFGQlExUXNSMEZCUnp0UlFVTklMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdVVUZEVkN4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzFGQlExUXNSMEZCUnp0UlFVTklMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdVVUZEVkN4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzFGQlExUXNSMEZCUnp0UlFVTklMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU1zUlVGQlJTeERRVUZETEVOQlFVTTdVVUZEVml4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRExFVkJRVVVzUTBGQlF5eERRVUZETzFGQlExWXNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF6dFJRVU5XTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU03VVVGRFZpeEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRE8xRkJRMVlzUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVOWUxFTkJRVU03UVVGRFNpeERRVUZETEVOQlFVTWlmUT09IiwiLy8gaHR0cHM6Ly93d3cudW5pY29kZS5vcmcvcmVwb3J0cy90cjM1L3RyMzUtZGF0ZXMuaHRtbCNEYXRlX0ZpZWxkX1N5bWJvbF9UYWJsZVxuZXhwb3J0IGNvbnN0IGRhdGVUaW1lVW5pY29kZUZvcm1hdFN0cmluZyA9IFwieXl5eS1NTS1kZCdUJ0hIOm1tOnNzLlNTU1hYXCI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2ljMk5vWlcxaExtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTGk0dkxpNHZjM0pqTDNOamFHVnRZUzUwY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGSlFTd3JSVUZCSzBVN1FVRkRMMFVzVFVGQlRTeERRVUZETEUxQlFVMHNNa0pCUVRKQ0xFZEJRVWNzTmtKQlFUWkNMRU5CUVVNaWZRPT0iLCJpbXBvcnQgeyBpbmplY3RKYXZhc2NyaXB0SW5zdHJ1bWVudFBhZ2VTY3JpcHQgfSBmcm9tIFwib3BlbndwbS13ZWJleHQtaW5zdHJ1bWVudGF0aW9uXCI7XG5cbmluamVjdEphdmFzY3JpcHRJbnN0cnVtZW50UGFnZVNjcmlwdCh3aW5kb3cub3BlbldwbUNvbnRlbnRTY3JpcHRDb25maWcgfHwge30pO1xuZGVsZXRlIHdpbmRvdy5vcGVuV3BtQ29udGVudFNjcmlwdENvbmZpZztcbiJdLCJzb3VyY2VSb290IjoiIn0=