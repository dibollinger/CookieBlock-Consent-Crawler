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
/******/ 	return __webpack_require__(__webpack_require__.s = "./feature.js/index.js");
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

/***/ "./feature.js/callstack-instrument.js":
/*!********************************************!*\
  !*** ./feature.js/callstack-instrument.js ***!
  \********************************************/
/*! exports provided: CallstackInstrument */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallstackInstrument", function() { return CallstackInstrument; });
/*
  We capture the JS callstack when we detect a dynamically created http request
  and bubble it up via a WebExtension Experiment API stackDump.
  This instrumentation captures those and saves them to the "callstacks" table.
*/
class CallstackInstrument {
  constructor(dataReceiver) {
    this.dataReceiver = dataReceiver;
  }
  run(browser_id) {
    browser.stackDump.onStackAvailable.addListener((request_id, call_stack) => {
      const record = {
        browser_id,
        request_id,
        call_stack
      };
      this.dataReceiver.saveRecord("callstacks", record);
    });
  }
}

/***/ }),

/***/ "./feature.js/index.js":
/*!*****************************!*\
  !*** ./feature.js/index.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var openwpm_webext_instrumentation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! openwpm-webext-instrumentation */ "../webext-instrumentation/build/module/index.js");
/* harmony import */ var _loggingdb_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./loggingdb.js */ "./feature.js/loggingdb.js");
/* harmony import */ var _callstack_instrument_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./callstack-instrument.js */ "./feature.js/callstack-instrument.js");





async function main() {
  // Read the browser configuration from file
  let filename = "browser_params.json";
  let config = await browser.profileDirIO.readFile(filename);
  if (config) {
    config = JSON.parse(config);
    console.log("Browser Config:", config);
  } else {
    config = {
      navigation_instrument:true,
      cookie_instrument:true,
      js_instrument:true,
      js_instrument_settings: `
      [
        {
          object: window.CanvasRenderingContext2D.prototype,
          instrumentedName: "CanvasRenderingContext2D",
          logSettings: {
            propertiesToInstrument: [],
            nonExistingPropertiesToInstrument: [],
            excludedProperties: [],
            excludedProperties: [],
            logCallStack: false,
            logFunctionsAsStrings: false,
            logFunctionGets: false,
            preventSets: false,
            recursive: false,
            depth: 5,
          }
        },
      ]`,
      http_instrument:true,
      callstack_instrument:true,
      save_content:false,
      testing:true,
      browser_id:0
    };
    console.log("WARNING: config not found. Assuming this is a test run of",
                "the extension. Outputting all queries to console.", {config});
  }

  await _loggingdb_js__WEBPACK_IMPORTED_MODULE_1__["open"](config['aggregator_address'],
                       config['logger_address'],
                       config['browser_id']);

  if (config["navigation_instrument"]) {
    _loggingdb_js__WEBPACK_IMPORTED_MODULE_1__["logDebug"]("Navigation instrumentation enabled");
    let navigationInstrument = new openwpm_webext_instrumentation__WEBPACK_IMPORTED_MODULE_0__["NavigationInstrument"](_loggingdb_js__WEBPACK_IMPORTED_MODULE_1__);
    navigationInstrument.run(config["browser_id"]);
  }

  if (config['cookie_instrument']) {
    _loggingdb_js__WEBPACK_IMPORTED_MODULE_1__["logDebug"]("Cookie instrumentation enabled");
    let cookieInstrument = new openwpm_webext_instrumentation__WEBPACK_IMPORTED_MODULE_0__["CookieInstrument"](_loggingdb_js__WEBPACK_IMPORTED_MODULE_1__);
    cookieInstrument.run(config['browser_id']);
  }

  if (config['js_instrument']) {
    _loggingdb_js__WEBPACK_IMPORTED_MODULE_1__["logDebug"]("Javascript instrumentation enabled");
    let jsInstrument = new openwpm_webext_instrumentation__WEBPACK_IMPORTED_MODULE_0__["JavascriptInstrument"](_loggingdb_js__WEBPACK_IMPORTED_MODULE_1__);
    jsInstrument.run(config['browser_id']);
    await jsInstrument.registerContentScript(config['testing'], config['js_instrument_settings']);
  }

  if (config['http_instrument']) {
    _loggingdb_js__WEBPACK_IMPORTED_MODULE_1__["logDebug"]("HTTP Instrumentation enabled");
    let httpInstrument = new openwpm_webext_instrumentation__WEBPACK_IMPORTED_MODULE_0__["HttpInstrument"](_loggingdb_js__WEBPACK_IMPORTED_MODULE_1__);
    httpInstrument.run(config['browser_id'],
                       config['save_content']);
  }

  if (config['callstack_instrument']) {
    _loggingdb_js__WEBPACK_IMPORTED_MODULE_1__["logDebug"]("Callstack Instrumentation enabled");
    let callstackInstrument = new _callstack_instrument_js__WEBPACK_IMPORTED_MODULE_2__["CallstackInstrument"](_loggingdb_js__WEBPACK_IMPORTED_MODULE_1__);
    callstackInstrument.run(config['browser_id']);
  }
}

main();



/***/ }),

/***/ "./feature.js/loggingdb.js":
/*!*********************************!*\
  !*** ./feature.js/loggingdb.js ***!
  \*********************************/
/*! exports provided: open, close, logInfo, logDebug, logWarn, logError, logCritical, dataReceiver, saveRecord, saveContent, escapeString, boolToInt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "open", function() { return open; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "close", function() { return close; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logInfo", function() { return logInfo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logDebug", function() { return logDebug; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logWarn", function() { return logWarn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logError", function() { return logError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logCritical", function() { return logCritical; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dataReceiver", function() { return dataReceiver; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveRecord", function() { return saveRecord; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveContent", function() { return saveContent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "escapeString", function() { return escapeString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "boolToInt", function() { return boolToInt; });
/* harmony import */ var _socket_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./socket.js */ "./feature.js/socket.js");


let crawlID = null;
let visitID = null;
let debugging = false;
let dataAggregator = null;
let logAggregator = null;
let listeningSocket = null;


let listeningSocketCallback =  async (data) => {
    //This works even if data is an int
    let action = data["action"];
    let _visitID = data["visit_id"]
    switch (action) {
        case "Initialize":
            if (visitID) {
                logWarn("Set visit_id while another visit_id was set")
            }
            visitID = _visitID;
            data["browser_id"] = crawlID;
            dataAggregator.send(JSON.stringify(["meta_information", data]));
            break;
        case "Finalize":
            if (!visitID) {
                logWarn("Send Finalize while no visit_id was set")
            }
            if (_visitID != visitID ) {
                logError("Send Finalize but visit_id didn't match. " +
                `Current visit_id ${visit_id}, sent visit_id ${_visit_id}.`);
            }
            data["browser_id"] = crawlID;
            data["success"] = true;
            dataAggregator.send(JSON.stringify(["meta_information", data]));
            visitID = null;
            break;
        default:
            // Just making sure that it's a valid number before logging
            _visitID = parseInt(data, 10);
            logDebug("Setting visit_id the legacy way");
            visitID = _visitID

    }

}
let open = async function(aggregatorAddress, logAddress, curr_crawlID) {
    if (aggregatorAddress == null && logAddress == null && curr_crawlID == '') {
        console.log("Debugging, everything will output to console");
        debugging = true;
        return;
    }
    crawlID = curr_crawlID;

    console.log("Opening socket connections...");

    // Connect to MPLogger for extension info/debug/error logging
    if (logAddress != null) {
        logAggregator = new _socket_js__WEBPACK_IMPORTED_MODULE_0__["SendingSocket"]();
        let rv = await logAggregator.connect(logAddress[0], logAddress[1]);
        console.log("logSocket started?", rv)
    }

    // Connect to databases for saving data
    if (aggregatorAddress != null) {
        dataAggregator = new _socket_js__WEBPACK_IMPORTED_MODULE_0__["SendingSocket"]();
        let rv = await dataAggregator.connect(aggregatorAddress[0], aggregatorAddress[1]);
        console.log("sqliteSocket started?",rv);
    }

    // Listen for incoming urls as visit ids
    listeningSocket = new _socket_js__WEBPACK_IMPORTED_MODULE_0__["ListeningSocket"](listeningSocketCallback);
    console.log("Starting socket listening for incoming connections.");
    listeningSocket.startListening().then(() => {
        browser.profileDirIO.writeFile("extension_port.txt", `${listeningSocket.port}`);
    });
};

let close = function() {
    if (dataAggregator != null) {
        dataAggregator.close();
    }
    if (logAggregator != null) {
        logAggregator.close();
    }
};

let makeLogJSON = function(lvl, msg) {
    var log_json = {
        'name': 'Extension-Logger',
        'level': lvl,
        'pathname': 'FirefoxExtension',
        'lineno': 1,
        'msg': escapeString(msg),
        'args': null,
        'exc_info': null,
        'func': null
    }
    return log_json;
}

let logInfo = function(msg) {
    // Always log to browser console
    console.log(msg);

    if (debugging) {
        return;
    }

    // Log level INFO == 20 (https://docs.python.org/2/library/logging.html#logging-levels)
    var log_json = makeLogJSON(20, msg);
    logAggregator.send(JSON.stringify(['EXT', JSON.stringify(log_json)]));
};

let logDebug = function(msg) {
    // Always log to browser console
    console.log(msg);

    if (debugging) {
        return;
    }

    // Log level DEBUG == 10 (https://docs.python.org/2/library/logging.html#logging-levels)
    var log_json = makeLogJSON(10, msg);
    logAggregator.send(JSON.stringify(['EXT', JSON.stringify(log_json)]));
};

let logWarn = function(msg) {
    // Always log to browser console
    console.warn(msg);

    if (debugging) {
        return;
    }

    // Log level WARN == 30 (https://docs.python.org/2/library/logging.html#logging-levels)
    var log_json = makeLogJSON(30, msg);
    logAggregator.send(JSON.stringify(['EXT', JSON.stringify(log_json)]));
};

let logError = function(msg) {
    // Always log to browser console
    console.error(msg);

    if (debugging) {
        return;
    }

    // Log level INFO == 40 (https://docs.python.org/2/library/logging.html#logging-levels)
    var log_json = makeLogJSON(40, msg);
    logAggregator.send(JSON.stringify(['EXT', JSON.stringify(log_json)]));
};

let logCritical = function(msg) {
    // Always log to browser console
    console.error(msg);

    if (debugging) {
        return;
    }

    // Log level CRITICAL == 50 (https://docs.python.org/2/library/logging.html#logging-levels)
    var log_json = makeLogJSON(50, msg);
    logAggregator.send(JSON.stringify(['EXT', JSON.stringify(log_json)]));
};

let dataReceiver = {
    saveRecord(a, b) {
        console.log(b);
    },
};

let saveRecord = function(instrument, record) {
    record["visit_id"] = visitID;

    if (!visitID && !debugging) {
        // Navigations to about:blank can be triggered by OpenWPM. We drop those.
        if(instrument === 'navigations' && record['url'] === 'about:blank') {
            logDebug('Extension-' + crawlID + ' : Dropping navigation to about:blank in intermediate period');
            return;
        }
        logWarn(`Extension-${crawlID} : visitID is null while attempting to insert into table ${instrument}\n` +
                    JSON.stringify(record));
        record["visit_id"] = -1;
        
    }

    // send to console if debugging
    if (debugging) {
      console.log("EXTENSION", instrument, record);
      return;
    }
    dataAggregator.send(JSON.stringify([instrument, record]));
};

// Stub for now
let saveContent = async function(content, contentHash) {
  // Send page content to the data aggregator
  // deduplicated by contentHash in a levelDB database
  if (debugging) {
    console.log("LDB contentHash:",contentHash,"with length",content.length);
    return;
  }
  // Since the content might not be a valid utf8 string and it needs to be
  // json encoded later, it is encoded using base64 first.
  const b64 = Uint8ToBase64(content);
  dataAggregator.send(JSON.stringify(['page_content', [b64, contentHash]]));
};

function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}

// Base64 encoding, found on:
// https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/25644409#25644409
function Uint8ToBase64(u8Arr){
  var CHUNK_SIZE = 0x8000; //arbitrary number
  var index = 0;
  var length = u8Arr.length;
  var result = '';
  var slice;
  while (index < length) {
    slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }
  return btoa(result);
}

let escapeString = function(string) {
    // Convert to string if necessary
    if(typeof string != "string")
        string = "" + string;

    return encode_utf8(string);
};

let boolToInt = function(bool) {
    return bool ? 1 : 0;
};


/***/ }),

/***/ "./feature.js/socket.js":
/*!******************************!*\
  !*** ./feature.js/socket.js ***!
  \******************************/
/*! exports provided: ListeningSocket, SendingSocket */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ListeningSocket", function() { return ListeningSocket; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SendingSocket", function() { return SendingSocket; });
let DataReceiver = {
  callbacks: new Map(),
  onDataReceived: (aSocketId, aData, aJSON) => {
    if (!DataReceiver.callbacks.has(aSocketId)) {
      return;
    }
    if (aJSON) {
      aData = JSON.parse(aData);
    }
    DataReceiver.callbacks.get(aSocketId)(aData);
  },
};

browser.sockets.onDataReceived.addListener(DataReceiver.onDataReceived);

let ListeningSockets = new Map();

class ListeningSocket {
  constructor(callback) {
    this.callback = callback
  }

  async startListening() {
    this.port = await browser.sockets.createServerSocket();
    DataReceiver.callbacks.set(this.port, this.callback);
    browser.sockets.startListening(this.port);
    console.log('Listening on port ' + this.port);
  }
}

class SendingSocket {
  constructor() {
  }

  async connect(host, port) {
    this.id = await browser.sockets.createSendingSocket();
    browser.sockets.connect(this.id, host, port);
    console.log(`Connected to ${host}:${port}`);
  }

  send(aData, aJSON=true) {
    try {
      browser.sockets.sendData(this.id, aData, !!aJSON);
      return true;
    } catch (err) {
      console.error(err,err.message);
      return false;
    }
  }

  close() {
    browser.sockets.close(this.id);
  }
}



/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4uL3dlYmV4dC1pbnN0cnVtZW50YXRpb24vYnVpbGQvbW9kdWxlL2JhY2tncm91bmQvY29va2llLWluc3RydW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4uL3dlYmV4dC1pbnN0cnVtZW50YXRpb24vYnVpbGQvbW9kdWxlL2JhY2tncm91bmQvaHR0cC1pbnN0cnVtZW50LmpzIiwid2VicGFjazovLy8uLi93ZWJleHQtaW5zdHJ1bWVudGF0aW9uL2J1aWxkL21vZHVsZS9iYWNrZ3JvdW5kL2phdmFzY3JpcHQtaW5zdHJ1bWVudC5qcyIsIndlYnBhY2s6Ly8vLi4vd2ViZXh0LWluc3RydW1lbnRhdGlvbi9idWlsZC9tb2R1bGUvYmFja2dyb3VuZC9uYXZpZ2F0aW9uLWluc3RydW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4uL3dlYmV4dC1pbnN0cnVtZW50YXRpb24vYnVpbGQvbW9kdWxlL2NvbnRlbnQvamF2YXNjcmlwdC1pbnN0cnVtZW50LWNvbnRlbnQtc2NvcGUuanMiLCJ3ZWJwYWNrOi8vLy4uL3dlYmV4dC1pbnN0cnVtZW50YXRpb24vYnVpbGQvbW9kdWxlL2NvbnRlbnQvamF2YXNjcmlwdC1pbnN0cnVtZW50LXBhZ2Utc2NvcGUuanMiLCJ3ZWJwYWNrOi8vLy4uL3dlYmV4dC1pbnN0cnVtZW50YXRpb24vYnVpbGQvbW9kdWxlL2luZGV4LmpzIiwid2VicGFjazovLy8uLi93ZWJleHQtaW5zdHJ1bWVudGF0aW9uL2J1aWxkL21vZHVsZS9saWIvZXh0ZW5zaW9uLXNlc3Npb24tZXZlbnQtb3JkaW5hbC5qcyIsIndlYnBhY2s6Ly8vLi4vd2ViZXh0LWluc3RydW1lbnRhdGlvbi9idWlsZC9tb2R1bGUvbGliL2V4dGVuc2lvbi1zZXNzaW9uLXV1aWQuanMiLCJ3ZWJwYWNrOi8vLy4uL3dlYmV4dC1pbnN0cnVtZW50YXRpb24vYnVpbGQvbW9kdWxlL2xpYi9odHRwLXBvc3QtcGFyc2VyLmpzIiwid2VicGFjazovLy8uLi93ZWJleHQtaW5zdHJ1bWVudGF0aW9uL2J1aWxkL21vZHVsZS9saWIvanMtaW5zdHJ1bWVudHMuanMiLCJ3ZWJwYWNrOi8vLy4uL3dlYmV4dC1pbnN0cnVtZW50YXRpb24vYnVpbGQvbW9kdWxlL2xpYi9wZW5kaW5nLW5hdmlnYXRpb24uanMiLCJ3ZWJwYWNrOi8vLy4uL3dlYmV4dC1pbnN0cnVtZW50YXRpb24vYnVpbGQvbW9kdWxlL2xpYi9wZW5kaW5nLXJlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vLy4uL3dlYmV4dC1pbnN0cnVtZW50YXRpb24vYnVpbGQvbW9kdWxlL2xpYi9wZW5kaW5nLXJlc3BvbnNlLmpzIiwid2VicGFjazovLy8uLi93ZWJleHQtaW5zdHJ1bWVudGF0aW9uL2J1aWxkL21vZHVsZS9saWIvcmVzcG9uc2UtYm9keS1saXN0ZW5lci5qcyIsIndlYnBhY2s6Ly8vLi4vd2ViZXh0LWluc3RydW1lbnRhdGlvbi9idWlsZC9tb2R1bGUvbGliL3NoYTI1Ni5qcyIsIndlYnBhY2s6Ly8vLi4vd2ViZXh0LWluc3RydW1lbnRhdGlvbi9idWlsZC9tb2R1bGUvbGliL3N0cmluZy11dGlscy5qcyIsIndlYnBhY2s6Ly8vLi4vd2ViZXh0LWluc3RydW1lbnRhdGlvbi9idWlsZC9tb2R1bGUvbGliL3V1aWQuanMiLCJ3ZWJwYWNrOi8vLy4uL3dlYmV4dC1pbnN0cnVtZW50YXRpb24vYnVpbGQvbW9kdWxlL3NjaGVtYS5qcyIsIndlYnBhY2s6Ly8vLi9mZWF0dXJlLmpzL2NhbGxzdGFjay1pbnN0cnVtZW50LmpzIiwid2VicGFjazovLy8uL2ZlYXR1cmUuanMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vZmVhdHVyZS5qcy9sb2dnaW5nZGIuanMiLCJ3ZWJwYWNrOi8vLy4vZmVhdHVyZS5qcy9zb2NrZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIscUJBQXFCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0RBQStEO0FBQy9EO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQixzQkFBc0I7QUFDdEIsd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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LDZCQUE2QixRQUFRLDJEQUEyRCxXQUFXO0FBQzNHO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOzs7Ozs7Ozs7Ozs7O0FDOU9BO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBOztBQUVBOztBQUVPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsS0FBSyxHQUFHLEtBQUs7QUFDN0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZmVhdHVyZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vZmVhdHVyZS5qcy9pbmRleC5qc1wiKTtcbiIsImltcG9ydCB7IGluY3JlbWVudGVkRXZlbnRPcmRpbmFsIH0gZnJvbSBcIi4uL2xpYi9leHRlbnNpb24tc2Vzc2lvbi1ldmVudC1vcmRpbmFsXCI7XG5pbXBvcnQgeyBleHRlbnNpb25TZXNzaW9uVXVpZCB9IGZyb20gXCIuLi9saWIvZXh0ZW5zaW9uLXNlc3Npb24tdXVpZFwiO1xuaW1wb3J0IHsgYm9vbFRvSW50LCBlc2NhcGVTdHJpbmcgfSBmcm9tIFwiLi4vbGliL3N0cmluZy11dGlsc1wiO1xuZXhwb3J0IGNvbnN0IHRyYW5zZm9ybUNvb2tpZU9iamVjdFRvTWF0Y2hPcGVuV1BNU2NoZW1hID0gKGNvb2tpZSkgPT4ge1xuICAgIGNvbnN0IGphdmFzY3JpcHRDb29raWUgPSB7fTtcbiAgICAvLyBFeHBpcnkgdGltZSAoaW4gc2Vjb25kcylcbiAgICAvLyBNYXkgcmV0dXJuIH5NYXgoaW50NjQpLiBJIGJlbGlldmUgdGhpcyBpcyBhIHNlc3Npb25cbiAgICAvLyBjb29raWUgd2hpY2ggZG9lc24ndCBleHBpcmUuIFNlc3Npb25zIGNvb2tpZXMgd2l0aFxuICAgIC8vIG5vbi1tYXggZXhwaXJ5IHRpbWUgZXhwaXJlIGFmdGVyIHNlc3Npb24gb3IgYXQgZXhwaXJ5LlxuICAgIGNvbnN0IGV4cGlyeVRpbWUgPSBjb29raWUuZXhwaXJhdGlvbkRhdGU7IC8vIHJldHVybnMgc2Vjb25kc1xuICAgIGxldCBleHBpcnlUaW1lU3RyaW5nO1xuICAgIGNvbnN0IG1heEludDY0ID0gOTIyMzM3MjAzNjg1NDc3NjAwMDtcbiAgICBpZiAoIWNvb2tpZS5leHBpcmF0aW9uRGF0ZSB8fCBleHBpcnlUaW1lID09PSBtYXhJbnQ2NCkge1xuICAgICAgICBleHBpcnlUaW1lU3RyaW5nID0gXCI5OTk5LTEyLTMxVDIxOjU5OjU5LjAwMFpcIjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IGV4cGlyeVRpbWVEYXRlID0gbmV3IERhdGUoZXhwaXJ5VGltZSAqIDEwMDApOyAvLyByZXF1aXJlcyBtaWxsaXNlY29uZHNcbiAgICAgICAgZXhwaXJ5VGltZVN0cmluZyA9IGV4cGlyeVRpbWVEYXRlLnRvSVNPU3RyaW5nKCk7XG4gICAgfVxuICAgIGphdmFzY3JpcHRDb29raWUuZXhwaXJ5ID0gZXhwaXJ5VGltZVN0cmluZztcbiAgICBqYXZhc2NyaXB0Q29va2llLmlzX2h0dHBfb25seSA9IGJvb2xUb0ludChjb29raWUuaHR0cE9ubHkpO1xuICAgIGphdmFzY3JpcHRDb29raWUuaXNfaG9zdF9vbmx5ID0gYm9vbFRvSW50KGNvb2tpZS5ob3N0T25seSk7XG4gICAgamF2YXNjcmlwdENvb2tpZS5pc19zZXNzaW9uID0gYm9vbFRvSW50KGNvb2tpZS5zZXNzaW9uKTtcbiAgICBqYXZhc2NyaXB0Q29va2llLmhvc3QgPSBlc2NhcGVTdHJpbmcoY29va2llLmRvbWFpbik7XG4gICAgamF2YXNjcmlwdENvb2tpZS5pc19zZWN1cmUgPSBib29sVG9JbnQoY29va2llLnNlY3VyZSk7XG4gICAgamF2YXNjcmlwdENvb2tpZS5uYW1lID0gZXNjYXBlU3RyaW5nKGNvb2tpZS5uYW1lKTtcbiAgICBqYXZhc2NyaXB0Q29va2llLnBhdGggPSBlc2NhcGVTdHJpbmcoY29va2llLnBhdGgpO1xuICAgIGphdmFzY3JpcHRDb29raWUudmFsdWUgPSBlc2NhcGVTdHJpbmcoY29va2llLnZhbHVlKTtcbiAgICBqYXZhc2NyaXB0Q29va2llLnNhbWVfc2l0ZSA9IGVzY2FwZVN0cmluZyhjb29raWUuc2FtZVNpdGUpO1xuICAgIGphdmFzY3JpcHRDb29raWUuZmlyc3RfcGFydHlfZG9tYWluID0gZXNjYXBlU3RyaW5nKGNvb2tpZS5maXJzdFBhcnR5RG9tYWluKTtcbiAgICBqYXZhc2NyaXB0Q29va2llLnN0b3JlX2lkID0gZXNjYXBlU3RyaW5nKGNvb2tpZS5zdG9yZUlkKTtcbiAgICBqYXZhc2NyaXB0Q29va2llLnRpbWVfc3RhbXAgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgcmV0dXJuIGphdmFzY3JpcHRDb29raWU7XG59O1xuZXhwb3J0IGNsYXNzIENvb2tpZUluc3RydW1lbnQge1xuICAgIGNvbnN0cnVjdG9yKGRhdGFSZWNlaXZlcikge1xuICAgICAgICB0aGlzLmRhdGFSZWNlaXZlciA9IGRhdGFSZWNlaXZlcjtcbiAgICB9XG4gICAgcnVuKGNyYXdsSUQpIHtcbiAgICAgICAgLy8gSW5zdHJ1bWVudCBjb29raWUgY2hhbmdlc1xuICAgICAgICB0aGlzLm9uQ2hhbmdlZExpc3RlbmVyID0gYXN5bmMgKGNoYW5nZUluZm8pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50VHlwZSA9IGNoYW5nZUluZm8ucmVtb3ZlZCA/IFwiZGVsZXRlZFwiIDogXCJhZGRlZC1vci1jaGFuZ2VkXCI7XG4gICAgICAgICAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICAgICAgICAgICAgcmVjb3JkX3R5cGU6IGV2ZW50VHlwZSxcbiAgICAgICAgICAgICAgICBjaGFuZ2VfY2F1c2U6IGNoYW5nZUluZm8uY2F1c2UsXG4gICAgICAgICAgICAgICAgYnJvd3Nlcl9pZDogY3Jhd2xJRCxcbiAgICAgICAgICAgICAgICBleHRlbnNpb25fc2Vzc2lvbl91dWlkOiBleHRlbnNpb25TZXNzaW9uVXVpZCxcbiAgICAgICAgICAgICAgICBldmVudF9vcmRpbmFsOiBpbmNyZW1lbnRlZEV2ZW50T3JkaW5hbCgpLFxuICAgICAgICAgICAgICAgIC4uLnRyYW5zZm9ybUNvb2tpZU9iamVjdFRvTWF0Y2hPcGVuV1BNU2NoZW1hKGNoYW5nZUluZm8uY29va2llKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmRhdGFSZWNlaXZlci5zYXZlUmVjb3JkKFwiamF2YXNjcmlwdF9jb29raWVzXCIsIHVwZGF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIGJyb3dzZXIuY29va2llcy5vbkNoYW5nZWQuYWRkTGlzdGVuZXIodGhpcy5vbkNoYW5nZWRMaXN0ZW5lcik7XG4gICAgfVxuICAgIGFzeW5jIHNhdmVBbGxDb29raWVzKGNyYXdsSUQpIHtcbiAgICAgICAgY29uc3QgYWxsQ29va2llcyA9IGF3YWl0IGJyb3dzZXIuY29va2llcy5nZXRBbGwoe30pO1xuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChhbGxDb29raWVzLm1hcCgoY29va2llKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICAgICAgICAgICAgcmVjb3JkX3R5cGU6IFwibWFudWFsLWV4cG9ydFwiLFxuICAgICAgICAgICAgICAgIGJyb3dzZXJfaWQ6IGNyYXdsSUQsXG4gICAgICAgICAgICAgICAgZXh0ZW5zaW9uX3Nlc3Npb25fdXVpZDogZXh0ZW5zaW9uU2Vzc2lvblV1aWQsXG4gICAgICAgICAgICAgICAgLi4udHJhbnNmb3JtQ29va2llT2JqZWN0VG9NYXRjaE9wZW5XUE1TY2hlbWEoY29va2llKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhUmVjZWl2ZXIuc2F2ZVJlY29yZChcImphdmFzY3JpcHRfY29va2llc1wiLCB1cGRhdGUpO1xuICAgICAgICB9KSk7XG4gICAgfVxuICAgIGNsZWFudXAoKSB7XG4gICAgICAgIGlmICh0aGlzLm9uQ2hhbmdlZExpc3RlbmVyKSB7XG4gICAgICAgICAgICBicm93c2VyLmNvb2tpZXMub25DaGFuZ2VkLnJlbW92ZUxpc3RlbmVyKHRoaXMub25DaGFuZ2VkTGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pWTI5dmEybGxMV2x1YzNSeWRXMWxiblF1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sY3lJNld5SXVMaTh1TGk4dUxpOXpjbU12WW1GamEyZHliM1Z1WkM5amIyOXJhV1V0YVc1emRISjFiV1Z1ZEM1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hQUVVGUExFVkJRVVVzZFVKQlFYVkNMRVZCUVVVc1RVRkJUU3gzUTBGQmQwTXNRMEZCUXp0QlFVTnFSaXhQUVVGUExFVkJRVVVzYjBKQlFXOUNMRVZCUVVVc1RVRkJUU3dyUWtGQkswSXNRMEZCUXp0QlFVTnlSU3hQUVVGUExFVkJRVVVzVTBGQlV5eEZRVUZGTEZsQlFWa3NSVUZCUlN4TlFVRk5MSEZDUVVGeFFpeERRVUZETzBGQlN6bEVMRTFCUVUwc1EwRkJReXhOUVVGTkxIbERRVUY1UXl4SFFVRkhMRU5CUVVNc1RVRkJZeXhGUVVGRkxFVkJRVVU3U1VGRE1VVXNUVUZCVFN4blFrRkJaMElzUjBGQlJ5eEZRVUZ6UWl4RFFVRkRPMGxCUldoRUxESkNRVUV5UWp0SlFVTXpRaXh6UkVGQmMwUTdTVUZEZEVRc2NVUkJRWEZFTzBsQlEzSkVMSGxFUVVGNVJEdEpRVU42UkN4TlFVRk5MRlZCUVZVc1IwRkJSeXhOUVVGTkxFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTXNhMEpCUVd0Q08wbEJRelZFTEVsQlFVa3NaMEpCUVdkQ0xFTkJRVU03U1VGRGNrSXNUVUZCVFN4UlFVRlJMRWRCUVVjc2JVSkJRVzFDTEVOQlFVTTdTVUZEY2tNc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eGpRVUZqTEVsQlFVa3NWVUZCVlN4TFFVRkxMRkZCUVZFc1JVRkJSVHRSUVVOeVJDeG5Ra0ZCWjBJc1IwRkJSeXd3UWtGQk1FSXNRMEZCUXp0TFFVTXZRenRUUVVGTk8xRkJRMHdzVFVGQlRTeGpRVUZqTEVkQlFVY3NTVUZCU1N4SlFVRkpMRU5CUVVNc1ZVRkJWU3hIUVVGSExFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTXNkMEpCUVhkQ08xRkJRelZGTEdkQ1FVRm5RaXhIUVVGSExHTkJRV01zUTBGQlF5eFhRVUZYTEVWQlFVVXNRMEZCUXp0TFFVTnFSRHRKUVVORUxHZENRVUZuUWl4RFFVRkRMRTFCUVUwc1IwRkJSeXhuUWtGQlowSXNRMEZCUXp0SlFVTXpReXhuUWtGQlowSXNRMEZCUXl4WlFVRlpMRWRCUVVjc1UwRkJVeXhEUVVGRExFMUJRVTBzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0SlFVTXpSQ3huUWtGQlowSXNRMEZCUXl4WlFVRlpMRWRCUVVjc1UwRkJVeXhEUVVGRExFMUJRVTBzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0SlFVTXpSQ3huUWtGQlowSXNRMEZCUXl4VlFVRlZMRWRCUVVjc1UwRkJVeXhEUVVGRExFMUJRVTBzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0SlFVVjRSQ3huUWtGQlowSXNRMEZCUXl4SlFVRkpMRWRCUVVjc1dVRkJXU3hEUVVGRExFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0SlFVTndSQ3huUWtGQlowSXNRMEZCUXl4VFFVRlRMRWRCUVVjc1UwRkJVeXhEUVVGRExFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0SlFVTjBSQ3huUWtGQlowSXNRMEZCUXl4SlFVRkpMRWRCUVVjc1dVRkJXU3hEUVVGRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0SlFVTnNSQ3huUWtGQlowSXNRMEZCUXl4SlFVRkpMRWRCUVVjc1dVRkJXU3hEUVVGRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0SlFVTnNSQ3huUWtGQlowSXNRMEZCUXl4TFFVRkxMRWRCUVVjc1dVRkJXU3hEUVVGRExFMUJRVTBzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0SlFVTndSQ3huUWtGQlowSXNRMEZCUXl4VFFVRlRMRWRCUVVjc1dVRkJXU3hEUVVGRExFMUJRVTBzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0SlFVTXpSQ3huUWtGQlowSXNRMEZCUXl4clFrRkJhMElzUjBGQlJ5eFpRVUZaTEVOQlFVTXNUVUZCVFN4RFFVRkRMR2RDUVVGblFpeERRVUZETEVOQlFVTTdTVUZETlVVc1owSkJRV2RDTEVOQlFVTXNVVUZCVVN4SFFVRkhMRmxCUVZrc1EwRkJReXhOUVVGTkxFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdTVUZGZWtRc1owSkJRV2RDTEVOQlFVTXNWVUZCVlN4SFFVRkhMRWxCUVVrc1NVRkJTU3hGUVVGRkxFTkJRVU1zVjBGQlZ5eEZRVUZGTEVOQlFVTTdTVUZGZGtRc1QwRkJUeXhuUWtGQlowSXNRMEZCUXp0QlFVTXhRaXhEUVVGRExFTkJRVU03UVVGRlJpeE5RVUZOTEU5QlFVOHNaMEpCUVdkQ08wbEJTVE5DTEZsQlFWa3NXVUZCV1R0UlFVTjBRaXhKUVVGSkxFTkJRVU1zV1VGQldTeEhRVUZITEZsQlFWa3NRMEZCUXp0SlFVTnVReXhEUVVGRE8wbEJSVTBzUjBGQlJ5eERRVUZETEU5QlFVODdVVUZEYUVJc05FSkJRVFJDTzFGQlF6VkNMRWxCUVVrc1EwRkJReXhwUWtGQmFVSXNSMEZCUnl4TFFVRkxMRVZCUVVVc1ZVRlBMMElzUlVGQlJTeEZRVUZGTzFsQlEwZ3NUVUZCVFN4VFFVRlRMRWRCUVVjc1ZVRkJWU3hEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNc1EwRkJReXhyUWtGQmEwSXNRMEZCUXp0WlFVTjBSU3hOUVVGTkxFMUJRVTBzUjBGQk1rSTdaMEpCUTNKRExGZEJRVmNzUlVGQlJTeFRRVUZUTzJkQ1FVTjBRaXhaUVVGWkxFVkJRVVVzVlVGQlZTeERRVUZETEV0QlFVczdaMEpCUXpsQ0xGVkJRVlVzUlVGQlJTeFBRVUZQTzJkQ1FVTnVRaXh6UWtGQmMwSXNSVUZCUlN4dlFrRkJiMEk3WjBKQlF6VkRMR0ZCUVdFc1JVRkJSU3gxUWtGQmRVSXNSVUZCUlR0blFrRkRlRU1zUjBGQlJ5eDVRMEZCZVVNc1EwRkJReXhWUVVGVkxFTkJRVU1zVFVGQlRTeERRVUZETzJGQlEyaEZMRU5CUVVNN1dVRkRSaXhKUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEZWQlFWVXNRMEZCUXl4dlFrRkJiMElzUlVGQlJTeE5RVUZOTEVOQlFVTXNRMEZCUXp0UlFVTTNSQ3hEUVVGRExFTkJRVU03VVVGRFJpeFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhYUVVGWExFTkJRVU1zU1VGQlNTeERRVUZETEdsQ1FVRnBRaXhEUVVGRExFTkJRVU03U1VGRGFFVXNRMEZCUXp0SlFVVk5MRXRCUVVzc1EwRkJReXhqUVVGakxFTkJRVU1zVDBGQlR6dFJRVU5xUXl4TlFVRk5MRlZCUVZVc1IwRkJSeXhOUVVGTkxFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRE8xRkJRM0JFTEUxQlFVMHNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkRaaXhWUVVGVkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNUVUZCWXl4RlFVRkZMRVZCUVVVN1dVRkRhRU1zVFVGQlRTeE5RVUZOTEVkQlFUSkNPMmRDUVVOeVF5eFhRVUZYTEVWQlFVVXNaVUZCWlR0blFrRkROVUlzVlVGQlZTeEZRVUZGTEU5QlFVODdaMEpCUTI1Q0xITkNRVUZ6UWl4RlFVRkZMRzlDUVVGdlFqdG5Ra0ZETlVNc1IwRkJSeXg1UTBGQmVVTXNRMEZCUXl4TlFVRk5MRU5CUVVNN1lVRkRja1FzUTBGQlF6dFpRVU5HTEU5QlFVOHNTVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJReXhWUVVGVkxFTkJRVU1zYjBKQlFXOUNMRVZCUVVVc1RVRkJUU3hEUVVGRExFTkJRVU03VVVGRGNFVXNRMEZCUXl4RFFVRkRMRU5CUTBnc1EwRkJRenRKUVVOS0xFTkJRVU03U1VGRlRTeFBRVUZQTzFGQlExb3NTVUZCU1N4SlFVRkpMRU5CUVVNc2FVSkJRV2xDTEVWQlFVVTdXVUZETVVJc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTXNZMEZCWXl4RFFVRkRMRWxCUVVrc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4RFFVRkRPMU5CUTJ4Rk8wbEJRMGdzUTBGQlF6dERRVU5HSW4wPSIsImltcG9ydCB7IGluY3JlbWVudGVkRXZlbnRPcmRpbmFsIH0gZnJvbSBcIi4uL2xpYi9leHRlbnNpb24tc2Vzc2lvbi1ldmVudC1vcmRpbmFsXCI7XG5pbXBvcnQgeyBleHRlbnNpb25TZXNzaW9uVXVpZCB9IGZyb20gXCIuLi9saWIvZXh0ZW5zaW9uLXNlc3Npb24tdXVpZFwiO1xuaW1wb3J0IHsgSHR0cFBvc3RQYXJzZXIgfSBmcm9tIFwiLi4vbGliL2h0dHAtcG9zdC1wYXJzZXJcIjtcbmltcG9ydCB7IFBlbmRpbmdSZXF1ZXN0IH0gZnJvbSBcIi4uL2xpYi9wZW5kaW5nLXJlcXVlc3RcIjtcbmltcG9ydCB7IFBlbmRpbmdSZXNwb25zZSB9IGZyb20gXCIuLi9saWIvcGVuZGluZy1yZXNwb25zZVwiO1xuaW1wb3J0IHsgYm9vbFRvSW50LCBlc2NhcGVTdHJpbmcsIGVzY2FwZVVybCB9IGZyb20gXCIuLi9saWIvc3RyaW5nLXV0aWxzXCI7XG4vKipcbiAqIE5vdGU6IERpZmZlcmVudCBwYXJ0cyBvZiB0aGUgZGVzaXJlZCBpbmZvcm1hdGlvbiBhcnJpdmVzIGluIGRpZmZlcmVudCBldmVudHMgYXMgcGVyIGJlbG93OlxuICogcmVxdWVzdCA9IGhlYWRlcnMgaW4gb25CZWZvcmVTZW5kSGVhZGVycyArIGJvZHkgaW4gb25CZWZvcmVSZXF1ZXN0XG4gKiByZXNwb25zZSA9IGhlYWRlcnMgaW4gb25Db21wbGV0ZWQgKyBib2R5IHZpYSBhIG9uQmVmb3JlUmVxdWVzdCBmaWx0ZXJcbiAqIHJlZGlyZWN0ID0gb3JpZ2luYWwgcmVxdWVzdCBoZWFkZXJzK2JvZHksIGZvbGxvd2VkIGJ5IGEgb25CZWZvcmVSZWRpcmVjdCBhbmQgdGhlbiBhIG5ldyBzZXQgb2YgcmVxdWVzdCBoZWFkZXJzK2JvZHkgYW5kIHJlc3BvbnNlIGhlYWRlcnMrYm9keVxuICogRG9jczogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9Vc2VyOndiYW1iZXJnL3dlYlJlcXVlc3QuUmVxdWVzdERldGFpbHNcbiAqL1xuZXhwb3J0IGNsYXNzIEh0dHBJbnN0cnVtZW50IHtcbiAgICBjb25zdHJ1Y3RvcihkYXRhUmVjZWl2ZXIpIHtcbiAgICAgICAgdGhpcy5wZW5kaW5nUmVxdWVzdHMgPSB7fTtcbiAgICAgICAgdGhpcy5wZW5kaW5nUmVzcG9uc2VzID0ge307XG4gICAgICAgIHRoaXMuZGF0YVJlY2VpdmVyID0gZGF0YVJlY2VpdmVyO1xuICAgIH1cbiAgICBydW4oY3Jhd2xJRCwgc2F2ZUNvbnRlbnRPcHRpb24pIHtcbiAgICAgICAgY29uc3QgYWxsVHlwZXMgPSBbXG4gICAgICAgICAgICBcImJlYWNvblwiLFxuICAgICAgICAgICAgXCJjc3BfcmVwb3J0XCIsXG4gICAgICAgICAgICBcImZvbnRcIixcbiAgICAgICAgICAgIFwiaW1hZ2VcIixcbiAgICAgICAgICAgIFwiaW1hZ2VzZXRcIixcbiAgICAgICAgICAgIFwibWFpbl9mcmFtZVwiLFxuICAgICAgICAgICAgXCJtZWRpYVwiLFxuICAgICAgICAgICAgXCJvYmplY3RcIixcbiAgICAgICAgICAgIFwib2JqZWN0X3N1YnJlcXVlc3RcIixcbiAgICAgICAgICAgIFwicGluZ1wiLFxuICAgICAgICAgICAgXCJzY3JpcHRcIixcbiAgICAgICAgICAgIC8vIFwic3BlY3VsYXRpdmVcIixcbiAgICAgICAgICAgIFwic3R5bGVzaGVldFwiLFxuICAgICAgICAgICAgXCJzdWJfZnJhbWVcIixcbiAgICAgICAgICAgIFwid2ViX21hbmlmZXN0XCIsXG4gICAgICAgICAgICBcIndlYnNvY2tldFwiLFxuICAgICAgICAgICAgXCJ4YmxcIixcbiAgICAgICAgICAgIFwieG1sX2R0ZFwiLFxuICAgICAgICAgICAgXCJ4bWxodHRwcmVxdWVzdFwiLFxuICAgICAgICAgICAgXCJ4c2x0XCIsXG4gICAgICAgICAgICBcIm90aGVyXCIsXG4gICAgICAgIF07XG4gICAgICAgIGNvbnN0IGZpbHRlciA9IHsgdXJsczogW1wiPGFsbF91cmxzPlwiXSwgdHlwZXM6IGFsbFR5cGVzIH07XG4gICAgICAgIGNvbnN0IHJlcXVlc3RTdGVtc0Zyb21FeHRlbnNpb24gPSBkZXRhaWxzID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoZGV0YWlscy5vcmlnaW5VcmwgJiYgZGV0YWlscy5vcmlnaW5VcmwuaW5kZXhPZihcIm1vei1leHRlbnNpb246Ly9cIikgPiAtMSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qXG4gICAgICAgICAqIEF0dGFjaCBoYW5kbGVycyB0byBldmVudCBsaXN0ZW5lcnNcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMub25CZWZvcmVSZXF1ZXN0TGlzdGVuZXIgPSAoZGV0YWlscykgPT4ge1xuICAgICAgICAgICAgY29uc3QgYmxvY2tpbmdSZXNwb25zZVRoYXREb2VzTm90aGluZyA9IHt9O1xuICAgICAgICAgICAgLy8gSWdub3JlIHJlcXVlc3RzIG1hZGUgYnkgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgaWYgKHJlcXVlc3RTdGVtc0Zyb21FeHRlbnNpb24oZGV0YWlscykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmxvY2tpbmdSZXNwb25zZVRoYXREb2VzTm90aGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBlbmRpbmdSZXF1ZXN0ID0gdGhpcy5nZXRQZW5kaW5nUmVxdWVzdChkZXRhaWxzLnJlcXVlc3RJZCk7XG4gICAgICAgICAgICBwZW5kaW5nUmVxdWVzdC5yZXNvbHZlT25CZWZvcmVSZXF1ZXN0RXZlbnREZXRhaWxzKGRldGFpbHMpO1xuICAgICAgICAgICAgY29uc3QgcGVuZGluZ1Jlc3BvbnNlID0gdGhpcy5nZXRQZW5kaW5nUmVzcG9uc2UoZGV0YWlscy5yZXF1ZXN0SWQpO1xuICAgICAgICAgICAgcGVuZGluZ1Jlc3BvbnNlLnJlc29sdmVPbkJlZm9yZVJlcXVlc3RFdmVudERldGFpbHMoZGV0YWlscyk7XG4gICAgICAgICAgICBpZiAodGhpcy5zaG91bGRTYXZlQ29udGVudChzYXZlQ29udGVudE9wdGlvbiwgZGV0YWlscy50eXBlKSkge1xuICAgICAgICAgICAgICAgIHBlbmRpbmdSZXNwb25zZS5hZGRSZXNwb25zZVJlc3BvbnNlQm9keUxpc3RlbmVyKGRldGFpbHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGJsb2NraW5nUmVzcG9uc2VUaGF0RG9lc05vdGhpbmc7XG4gICAgICAgIH07XG4gICAgICAgIGJyb3dzZXIud2ViUmVxdWVzdC5vbkJlZm9yZVJlcXVlc3QuYWRkTGlzdGVuZXIodGhpcy5vbkJlZm9yZVJlcXVlc3RMaXN0ZW5lciwgZmlsdGVyLCB0aGlzLmlzQ29udGVudFNhdmluZ0VuYWJsZWQoc2F2ZUNvbnRlbnRPcHRpb24pXG4gICAgICAgICAgICA/IFtcInJlcXVlc3RCb2R5XCIsIFwiYmxvY2tpbmdcIl1cbiAgICAgICAgICAgIDogW1wicmVxdWVzdEJvZHlcIl0pO1xuICAgICAgICB0aGlzLm9uQmVmb3JlU2VuZEhlYWRlcnNMaXN0ZW5lciA9IGRldGFpbHMgPT4ge1xuICAgICAgICAgICAgLy8gSWdub3JlIHJlcXVlc3RzIG1hZGUgYnkgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgaWYgKHJlcXVlc3RTdGVtc0Zyb21FeHRlbnNpb24oZGV0YWlscykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwZW5kaW5nUmVxdWVzdCA9IHRoaXMuZ2V0UGVuZGluZ1JlcXVlc3QoZGV0YWlscy5yZXF1ZXN0SWQpO1xuICAgICAgICAgICAgcGVuZGluZ1JlcXVlc3QucmVzb2x2ZU9uQmVmb3JlU2VuZEhlYWRlcnNFdmVudERldGFpbHMoZGV0YWlscyk7XG4gICAgICAgICAgICB0aGlzLm9uQmVmb3JlU2VuZEhlYWRlcnNIYW5kbGVyKGRldGFpbHMsIGNyYXdsSUQsIGluY3JlbWVudGVkRXZlbnRPcmRpbmFsKCkpO1xuICAgICAgICB9O1xuICAgICAgICBicm93c2VyLndlYlJlcXVlc3Qub25CZWZvcmVTZW5kSGVhZGVycy5hZGRMaXN0ZW5lcih0aGlzLm9uQmVmb3JlU2VuZEhlYWRlcnNMaXN0ZW5lciwgZmlsdGVyLCBbXCJyZXF1ZXN0SGVhZGVyc1wiXSk7XG4gICAgICAgIHRoaXMub25CZWZvcmVSZWRpcmVjdExpc3RlbmVyID0gZGV0YWlscyA9PiB7XG4gICAgICAgICAgICAvLyBJZ25vcmUgcmVxdWVzdHMgbWFkZSBieSBleHRlbnNpb25zXG4gICAgICAgICAgICBpZiAocmVxdWVzdFN0ZW1zRnJvbUV4dGVuc2lvbihkZXRhaWxzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub25CZWZvcmVSZWRpcmVjdEhhbmRsZXIoZGV0YWlscywgY3Jhd2xJRCwgaW5jcmVtZW50ZWRFdmVudE9yZGluYWwoKSk7XG4gICAgICAgIH07XG4gICAgICAgIGJyb3dzZXIud2ViUmVxdWVzdC5vbkJlZm9yZVJlZGlyZWN0LmFkZExpc3RlbmVyKHRoaXMub25CZWZvcmVSZWRpcmVjdExpc3RlbmVyLCBmaWx0ZXIsIFtcInJlc3BvbnNlSGVhZGVyc1wiXSk7XG4gICAgICAgIHRoaXMub25Db21wbGV0ZWRMaXN0ZW5lciA9IGRldGFpbHMgPT4ge1xuICAgICAgICAgICAgLy8gSWdub3JlIHJlcXVlc3RzIG1hZGUgYnkgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgaWYgKHJlcXVlc3RTdGVtc0Zyb21FeHRlbnNpb24oZGV0YWlscykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwZW5kaW5nUmVzcG9uc2UgPSB0aGlzLmdldFBlbmRpbmdSZXNwb25zZShkZXRhaWxzLnJlcXVlc3RJZCk7XG4gICAgICAgICAgICBwZW5kaW5nUmVzcG9uc2UucmVzb2x2ZU9uQ29tcGxldGVkRXZlbnREZXRhaWxzKGRldGFpbHMpO1xuICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlZEhhbmRsZXIoZGV0YWlscywgY3Jhd2xJRCwgaW5jcmVtZW50ZWRFdmVudE9yZGluYWwoKSwgc2F2ZUNvbnRlbnRPcHRpb24pO1xuICAgICAgICB9O1xuICAgICAgICBicm93c2VyLndlYlJlcXVlc3Qub25Db21wbGV0ZWQuYWRkTGlzdGVuZXIodGhpcy5vbkNvbXBsZXRlZExpc3RlbmVyLCBmaWx0ZXIsIFtcInJlc3BvbnNlSGVhZGVyc1wiXSk7XG4gICAgfVxuICAgIGNsZWFudXAoKSB7XG4gICAgICAgIGlmICh0aGlzLm9uQmVmb3JlUmVxdWVzdExpc3RlbmVyKSB7XG4gICAgICAgICAgICBicm93c2VyLndlYlJlcXVlc3Qub25CZWZvcmVSZXF1ZXN0LnJlbW92ZUxpc3RlbmVyKHRoaXMub25CZWZvcmVSZXF1ZXN0TGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9uQmVmb3JlU2VuZEhlYWRlcnNMaXN0ZW5lcikge1xuICAgICAgICAgICAgYnJvd3Nlci53ZWJSZXF1ZXN0Lm9uQmVmb3JlU2VuZEhlYWRlcnMucmVtb3ZlTGlzdGVuZXIodGhpcy5vbkJlZm9yZVNlbmRIZWFkZXJzTGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9uQmVmb3JlUmVkaXJlY3RMaXN0ZW5lcikge1xuICAgICAgICAgICAgYnJvd3Nlci53ZWJSZXF1ZXN0Lm9uQmVmb3JlUmVkaXJlY3QucmVtb3ZlTGlzdGVuZXIodGhpcy5vbkJlZm9yZVJlZGlyZWN0TGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9uQ29tcGxldGVkTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGJyb3dzZXIud2ViUmVxdWVzdC5vbkNvbXBsZXRlZC5yZW1vdmVMaXN0ZW5lcih0aGlzLm9uQ29tcGxldGVkTGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlzQ29udGVudFNhdmluZ0VuYWJsZWQoc2F2ZUNvbnRlbnRPcHRpb24pIHtcbiAgICAgICAgaWYgKHNhdmVDb250ZW50T3B0aW9uID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2F2ZUNvbnRlbnRPcHRpb24gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZUNvbnRlbnRSZXNvdXJjZVR5cGVzKHNhdmVDb250ZW50T3B0aW9uKS5sZW5ndGggPiAwO1xuICAgIH1cbiAgICBzYXZlQ29udGVudFJlc291cmNlVHlwZXMoc2F2ZUNvbnRlbnRPcHRpb24pIHtcbiAgICAgICAgcmV0dXJuIHNhdmVDb250ZW50T3B0aW9uLnNwbGl0KFwiLFwiKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogV2UgcmVseSBvbiB0aGUgcmVzb3VyY2UgdHlwZSB0byBmaWx0ZXIgcmVzcG9uc2VzXG4gICAgICogU2VlOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL01vemlsbGEvQWRkLW9ucy9XZWJFeHRlbnNpb25zL0FQSS93ZWJSZXF1ZXN0L1Jlc291cmNlVHlwZVxuICAgICAqXG4gICAgICogQHBhcmFtIHNhdmVDb250ZW50T3B0aW9uXG4gICAgICogQHBhcmFtIHJlc291cmNlVHlwZVxuICAgICAqL1xuICAgIHNob3VsZFNhdmVDb250ZW50KHNhdmVDb250ZW50T3B0aW9uLCByZXNvdXJjZVR5cGUpIHtcbiAgICAgICAgaWYgKHNhdmVDb250ZW50T3B0aW9uID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2F2ZUNvbnRlbnRPcHRpb24gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZUNvbnRlbnRSZXNvdXJjZVR5cGVzKHNhdmVDb250ZW50T3B0aW9uKS5pbmNsdWRlcyhyZXNvdXJjZVR5cGUpO1xuICAgIH1cbiAgICBnZXRQZW5kaW5nUmVxdWVzdChyZXF1ZXN0SWQpIHtcbiAgICAgICAgaWYgKCF0aGlzLnBlbmRpbmdSZXF1ZXN0c1tyZXF1ZXN0SWRdKSB7XG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdSZXF1ZXN0c1tyZXF1ZXN0SWRdID0gbmV3IFBlbmRpbmdSZXF1ZXN0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucGVuZGluZ1JlcXVlc3RzW3JlcXVlc3RJZF07XG4gICAgfVxuICAgIGdldFBlbmRpbmdSZXNwb25zZShyZXF1ZXN0SWQpIHtcbiAgICAgICAgaWYgKCF0aGlzLnBlbmRpbmdSZXNwb25zZXNbcmVxdWVzdElkXSkge1xuICAgICAgICAgICAgdGhpcy5wZW5kaW5nUmVzcG9uc2VzW3JlcXVlc3RJZF0gPSBuZXcgUGVuZGluZ1Jlc3BvbnNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucGVuZGluZ1Jlc3BvbnNlc1tyZXF1ZXN0SWRdO1xuICAgIH1cbiAgICAvKlxuICAgICAqIEhUVFAgUmVxdWVzdCBIYW5kbGVyIGFuZCBIZWxwZXIgRnVuY3Rpb25zXG4gICAgICovXG4gICAgYXN5bmMgb25CZWZvcmVTZW5kSGVhZGVyc0hhbmRsZXIoZGV0YWlscywgY3Jhd2xJRCwgZXZlbnRPcmRpbmFsKSB7XG4gICAgICAgIC8qXG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgIFwib25CZWZvcmVTZW5kSGVhZGVyc0hhbmRsZXIgKHByZXZpb3VzbHkgaHR0cFJlcXVlc3RIYW5kbGVyKVwiLFxuICAgICAgICAgIGRldGFpbHMsXG4gICAgICAgICAgY3Jhd2xJRCxcbiAgICAgICAgKTtcbiAgICAgICAgKi9cbiAgICAgICAgY29uc3QgdGFiID0gZGV0YWlscy50YWJJZCA+IC0xXG4gICAgICAgICAgICA/IGF3YWl0IGJyb3dzZXIudGFicy5nZXQoZGV0YWlscy50YWJJZClcbiAgICAgICAgICAgIDogeyB3aW5kb3dJZDogdW5kZWZpbmVkLCBpbmNvZ25pdG86IHVuZGVmaW5lZCwgdXJsOiB1bmRlZmluZWQgfTtcbiAgICAgICAgY29uc3QgdXBkYXRlID0ge307XG4gICAgICAgIHVwZGF0ZS5pbmNvZ25pdG8gPSBib29sVG9JbnQodGFiLmluY29nbml0byk7XG4gICAgICAgIHVwZGF0ZS5icm93c2VyX2lkID0gY3Jhd2xJRDtcbiAgICAgICAgdXBkYXRlLmV4dGVuc2lvbl9zZXNzaW9uX3V1aWQgPSBleHRlbnNpb25TZXNzaW9uVXVpZDtcbiAgICAgICAgdXBkYXRlLmV2ZW50X29yZGluYWwgPSBldmVudE9yZGluYWw7XG4gICAgICAgIHVwZGF0ZS53aW5kb3dfaWQgPSB0YWIud2luZG93SWQ7XG4gICAgICAgIHVwZGF0ZS50YWJfaWQgPSBkZXRhaWxzLnRhYklkO1xuICAgICAgICB1cGRhdGUuZnJhbWVfaWQgPSBkZXRhaWxzLmZyYW1lSWQ7XG4gICAgICAgIC8vIHJlcXVlc3RJZCBpcyBhIHVuaXF1ZSBpZGVudGlmaWVyIHRoYXQgY2FuIGJlIHVzZWQgdG8gbGluayByZXF1ZXN0cyBhbmQgcmVzcG9uc2VzXG4gICAgICAgIHVwZGF0ZS5yZXF1ZXN0X2lkID0gZGV0YWlscy5yZXF1ZXN0SWQ7XG4gICAgICAgIGNvbnN0IHVybCA9IGRldGFpbHMudXJsO1xuICAgICAgICB1cGRhdGUudXJsID0gZXNjYXBlVXJsKHVybCk7XG4gICAgICAgIGNvbnN0IHJlcXVlc3RNZXRob2QgPSBkZXRhaWxzLm1ldGhvZDtcbiAgICAgICAgdXBkYXRlLm1ldGhvZCA9IGVzY2FwZVN0cmluZyhyZXF1ZXN0TWV0aG9kKTtcbiAgICAgICAgY29uc3QgY3VycmVudF90aW1lID0gbmV3IERhdGUoZGV0YWlscy50aW1lU3RhbXApO1xuICAgICAgICB1cGRhdGUudGltZV9zdGFtcCA9IGN1cnJlbnRfdGltZS50b0lTT1N0cmluZygpO1xuICAgICAgICBsZXQgZW5jb2RpbmdUeXBlID0gXCJcIjtcbiAgICAgICAgbGV0IHJlZmVycmVyID0gXCJcIjtcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IFtdO1xuICAgICAgICBsZXQgaXNPY3NwID0gZmFsc2U7XG4gICAgICAgIGlmIChkZXRhaWxzLnJlcXVlc3RIZWFkZXJzKSB7XG4gICAgICAgICAgICBkZXRhaWxzLnJlcXVlc3RIZWFkZXJzLm1hcChyZXF1ZXN0SGVhZGVyID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IG5hbWUsIHZhbHVlIH0gPSByZXF1ZXN0SGVhZGVyO1xuICAgICAgICAgICAgICAgIGNvbnN0IGhlYWRlcl9wYWlyID0gW107XG4gICAgICAgICAgICAgICAgaGVhZGVyX3BhaXIucHVzaChlc2NhcGVTdHJpbmcobmFtZSkpO1xuICAgICAgICAgICAgICAgIGhlYWRlcl9wYWlyLnB1c2goZXNjYXBlU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgICAgICAgICAgaGVhZGVycy5wdXNoKGhlYWRlcl9wYWlyKTtcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gXCJDb250ZW50LVR5cGVcIikge1xuICAgICAgICAgICAgICAgICAgICBlbmNvZGluZ1R5cGUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuY29kaW5nVHlwZS5pbmRleE9mKFwiYXBwbGljYXRpb24vb2NzcC1yZXF1ZXN0XCIpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNPY3NwID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gXCJSZWZlcmVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVmZXJyZXIgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB1cGRhdGUucmVmZXJyZXIgPSBlc2NhcGVTdHJpbmcocmVmZXJyZXIpO1xuICAgICAgICBpZiAocmVxdWVzdE1ldGhvZCA9PT0gXCJQT1NUXCIgJiYgIWlzT2NzcCAvKiBkb24ndCBwcm9jZXNzIE9DU1AgcmVxdWVzdHMgKi8pIHtcbiAgICAgICAgICAgIGNvbnN0IHBlbmRpbmdSZXF1ZXN0ID0gdGhpcy5nZXRQZW5kaW5nUmVxdWVzdChkZXRhaWxzLnJlcXVlc3RJZCk7XG4gICAgICAgICAgICBjb25zdCByZXNvbHZlZCA9IGF3YWl0IHBlbmRpbmdSZXF1ZXN0LnJlc29sdmVkV2l0aGluVGltZW91dCgxMDAwKTtcbiAgICAgICAgICAgIGlmICghcmVzb2x2ZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFSZWNlaXZlci5sb2dFcnJvcihcIlBlbmRpbmcgcmVxdWVzdCB0aW1lZCBvdXQgd2FpdGluZyBmb3IgZGF0YSBmcm9tIGJvdGggb25CZWZvcmVSZXF1ZXN0IGFuZCBvbkJlZm9yZVNlbmRIZWFkZXJzIGV2ZW50c1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9uQmVmb3JlUmVxdWVzdEV2ZW50RGV0YWlscyA9IGF3YWl0IHBlbmRpbmdSZXF1ZXN0Lm9uQmVmb3JlUmVxdWVzdEV2ZW50RGV0YWlscztcbiAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0Qm9keSA9IG9uQmVmb3JlUmVxdWVzdEV2ZW50RGV0YWlscy5yZXF1ZXN0Qm9keTtcbiAgICAgICAgICAgICAgICBpZiAocmVxdWVzdEJvZHkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zdFBhcnNlciA9IG5ldyBIdHRwUG9zdFBhcnNlcihcbiAgICAgICAgICAgICAgICAgICAgLy8gZGV0YWlscyxcbiAgICAgICAgICAgICAgICAgICAgb25CZWZvcmVSZXF1ZXN0RXZlbnREZXRhaWxzLCB0aGlzLmRhdGFSZWNlaXZlcik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvc3RPYmogPSBwb3N0UGFyc2VyXG4gICAgICAgICAgICAgICAgICAgICAgICAucGFyc2VQb3N0UmVxdWVzdCgpO1xuICAgICAgICAgICAgICAgICAgICAvLyBBZGQgKFBPU1QpIHJlcXVlc3QgaGVhZGVycyBmcm9tIHVwbG9hZCBzdHJlYW1cbiAgICAgICAgICAgICAgICAgICAgaWYgKFwicG9zdF9oZWFkZXJzXCIgaW4gcG9zdE9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gT25seSBzdG9yZSBQT1NUIGhlYWRlcnMgdGhhdCB3ZSBrbm93IGFuZCBuZWVkLiBXZSBtYXkgbWlzaW50ZXJwcmV0IFBPU1QgZGF0YSBhcyBoZWFkZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhcyBkZXRlY3Rpb24gaXMgYmFzZWQgb24gXCJrZXk6dmFsdWVcIiBmb3JtYXQgKG5vbi1oZWFkZXIgUE9TVCBkYXRhIGNhbiBiZSBpbiB0aGlzIGZvcm1hdCBhcyB3ZWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGVudEhlYWRlcnMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtRGlzcG9zaXRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtTGVuZ3RoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBuYW1lIGluIHBvc3RPYmoucG9zdF9oZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRIZWFkZXJzLmluY2x1ZGVzKG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGhlYWRlcl9wYWlyID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcl9wYWlyLnB1c2goZXNjYXBlU3RyaW5nKG5hbWUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyX3BhaXIucHVzaChlc2NhcGVTdHJpbmcocG9zdE9iai5wb3N0X2hlYWRlcnNbbmFtZV0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVycy5wdXNoKGhlYWRlcl9wYWlyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gd2Ugc3RvcmUgUE9TVCBib2R5IGluIEpTT04gZm9ybWF0LCBleGNlcHQgd2hlbiBpdCdzIGEgc3RyaW5nIHdpdGhvdXQgYSAoa2V5LXZhbHVlKSBzdHJ1Y3R1cmVcbiAgICAgICAgICAgICAgICAgICAgaWYgKFwicG9zdF9ib2R5XCIgaW4gcG9zdE9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlLnBvc3RfYm9keSA9IHBvc3RPYmoucG9zdF9ib2R5O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChcInBvc3RfYm9keV9yYXdcIiBpbiBwb3N0T2JqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUucG9zdF9ib2R5X3JhdyA9IHBvc3RPYmoucG9zdF9ib2R5X3JhdztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB1cGRhdGUuaGVhZGVycyA9IEpTT04uc3RyaW5naWZ5KGhlYWRlcnMpO1xuICAgICAgICAvLyBDaGVjayBpZiB4aHJcbiAgICAgICAgY29uc3QgaXNYSFIgPSBkZXRhaWxzLnR5cGUgPT09IFwieG1saHR0cHJlcXVlc3RcIjtcbiAgICAgICAgdXBkYXRlLmlzX1hIUiA9IGJvb2xUb0ludChpc1hIUik7XG4gICAgICAgIC8vIEdyYWIgdGhlIHRyaWdnZXJpbmcgYW5kIGxvYWRpbmcgUHJpbmNpcGFsc1xuICAgICAgICBsZXQgdHJpZ2dlcmluZ09yaWdpbjtcbiAgICAgICAgbGV0IGxvYWRpbmdPcmlnaW47XG4gICAgICAgIGlmIChkZXRhaWxzLm9yaWdpblVybCkge1xuICAgICAgICAgICAgY29uc3QgcGFyc2VkT3JpZ2luVXJsID0gbmV3IFVSTChkZXRhaWxzLm9yaWdpblVybCk7XG4gICAgICAgICAgICB0cmlnZ2VyaW5nT3JpZ2luID0gcGFyc2VkT3JpZ2luVXJsLm9yaWdpbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGV0YWlscy5kb2N1bWVudFVybCkge1xuICAgICAgICAgICAgY29uc3QgcGFyc2VkRG9jdW1lbnRVcmwgPSBuZXcgVVJMKGRldGFpbHMuZG9jdW1lbnRVcmwpO1xuICAgICAgICAgICAgbG9hZGluZ09yaWdpbiA9IHBhcnNlZERvY3VtZW50VXJsLm9yaWdpbjtcbiAgICAgICAgfVxuICAgICAgICB1cGRhdGUudHJpZ2dlcmluZ19vcmlnaW4gPSBlc2NhcGVTdHJpbmcodHJpZ2dlcmluZ09yaWdpbik7XG4gICAgICAgIHVwZGF0ZS5sb2FkaW5nX29yaWdpbiA9IGVzY2FwZVN0cmluZyhsb2FkaW5nT3JpZ2luKTtcbiAgICAgICAgLy8gbG9hZGluZ0RvY3VtZW50J3MgaHJlZlxuICAgICAgICAvLyBUaGUgbG9hZGluZ0RvY3VtZW50IGlzIHRoZSBkb2N1bWVudCB0aGUgZWxlbWVudCByZXNpZGVzLCByZWdhcmRsZXNzIG9mXG4gICAgICAgIC8vIGhvdyB0aGUgbG9hZCB3YXMgdHJpZ2dlcmVkLlxuICAgICAgICBjb25zdCBsb2FkaW5nSHJlZiA9IGRldGFpbHMuZG9jdW1lbnRVcmw7XG4gICAgICAgIHVwZGF0ZS5sb2FkaW5nX2hyZWYgPSBlc2NhcGVTdHJpbmcobG9hZGluZ0hyZWYpO1xuICAgICAgICAvLyByZXNvdXJjZVR5cGUgb2YgdGhlIHJlcXVlc3Rpbmcgbm9kZS4gVGhpcyBpcyBzZXQgYnkgdGhlIHR5cGUgb2ZcbiAgICAgICAgLy8gbm9kZSBtYWtpbmcgdGhlIHJlcXVlc3QgKGkuZS4gYW4gPGltZyBzcmM9Li4uPiBub2RlIHdpbGwgc2V0IHRvIHR5cGUgXCJpbWFnZVwiKS5cbiAgICAgICAgLy8gRG9jdW1lbnRhdGlvbjpcbiAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9Nb3ppbGxhL0FkZC1vbnMvV2ViRXh0ZW5zaW9ucy9BUEkvd2ViUmVxdWVzdC9SZXNvdXJjZVR5cGVcbiAgICAgICAgdXBkYXRlLnJlc291cmNlX3R5cGUgPSBkZXRhaWxzLnR5cGU7XG4gICAgICAgIC8qXG4gICAgICAgIC8vIFRPRE86IFJlZmFjdG9yIHRvIGNvcnJlc3BvbmRpbmcgd2ViZXh0IGxvZ2ljIG9yIGRpc2NhcmRcbiAgICAgICAgY29uc3QgVGhpcmRQYXJ0eVV0aWwgPSBDY1tcIkBtb3ppbGxhLm9yZy90aGlyZHBhcnR5dXRpbDsxXCJdLmdldFNlcnZpY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2kubW96SVRoaXJkUGFydHlVdGlsKTtcbiAgICAgICAgLy8gRG8gdGhpcmQtcGFydHkgY2hlY2tzXG4gICAgICAgIC8vIFRoZXNlIHNwZWNpZmljIGNoZWNrcyBhcmUgZG9uZSBiZWNhdXNlIGl0J3Mgd2hhdCdzIHVzZWQgaW4gVHJhY2tpbmcgUHJvdGVjdGlvblxuICAgICAgICAvLyBTZWU6IGh0dHA6Ly9zZWFyY2hmb3gub3JnL21vemlsbGEtY2VudHJhbC9zb3VyY2UvbmV0d2Vyay9iYXNlL25zQ2hhbm5lbENsYXNzaWZpZXIuY3BwIzEwN1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGlzVGhpcmRQYXJ0eUNoYW5uZWwgPSBUaGlyZFBhcnR5VXRpbC5pc1RoaXJkUGFydHlDaGFubmVsKGRldGFpbHMpO1xuICAgICAgICAgIGNvbnN0IHRvcFdpbmRvdyA9IFRoaXJkUGFydHlVdGlsLmdldFRvcFdpbmRvd0ZvckNoYW5uZWwoZGV0YWlscyk7XG4gICAgICAgICAgY29uc3QgdG9wVVJJID0gVGhpcmRQYXJ0eVV0aWwuZ2V0VVJJRnJvbVdpbmRvdyh0b3BXaW5kb3cpO1xuICAgICAgICAgIGlmICh0b3BVUkkpIHtcbiAgICAgICAgICAgIGNvbnN0IHRvcFVybCA9IHRvcFVSSS5zcGVjO1xuICAgICAgICAgICAgY29uc3QgY2hhbm5lbFVSSSA9IGRldGFpbHMuVVJJO1xuICAgICAgICAgICAgY29uc3QgaXNUaGlyZFBhcnR5VG9Ub3BXaW5kb3cgPSBUaGlyZFBhcnR5VXRpbC5pc1RoaXJkUGFydHlVUkkoXG4gICAgICAgICAgICAgIGNoYW5uZWxVUkksXG4gICAgICAgICAgICAgIHRvcFVSSSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB1cGRhdGUuaXNfdGhpcmRfcGFydHlfdG9fdG9wX3dpbmRvdyA9IGlzVGhpcmRQYXJ0eVRvVG9wV2luZG93O1xuICAgICAgICAgICAgdXBkYXRlLmlzX3RoaXJkX3BhcnR5X2NoYW5uZWwgPSBpc1RoaXJkUGFydHlDaGFubmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoYW5FcnJvcikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbnMgZXhwZWN0ZWQgZm9yIGNoYW5uZWxzIHRyaWdnZXJlZCBvciBsb2FkaW5nIGluIGFcbiAgICAgICAgICAvLyBOdWxsUHJpbmNpcGFsIG9yIFN5c3RlbVByaW5jaXBhbC4gVGhleSBhcmUgYWxzbyBleHBlY3RlZCBmb3IgZmF2aWNvblxuICAgICAgICAgIC8vIGxvYWRzLCB3aGljaCB3ZSBhdHRlbXB0IHRvIGZpbHRlci4gRGVwZW5kaW5nIG9uIHRoZSBuYW1pbmcsIHNvbWUgZmF2aWNvbnNcbiAgICAgICAgICAvLyBtYXkgY29udGludWUgdG8gbGVhZCB0byBlcnJvciBsb2dzLlxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHVwZGF0ZS50cmlnZ2VyaW5nX29yaWdpbiAhPT0gXCJbU3lzdGVtIFByaW5jaXBhbF1cIiAmJlxuICAgICAgICAgICAgdXBkYXRlLnRyaWdnZXJpbmdfb3JpZ2luICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIHVwZGF0ZS5sb2FkaW5nX29yaWdpbiAhPT0gXCJbU3lzdGVtIFByaW5jaXBhbF1cIiAmJlxuICAgICAgICAgICAgdXBkYXRlLmxvYWRpbmdfb3JpZ2luICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgICF1cGRhdGUudXJsLmVuZHNXaXRoKFwiaWNvXCIpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFSZWNlaXZlci5sb2dFcnJvcihcbiAgICAgICAgICAgICAgXCJFcnJvciB3aGlsZSByZXRyaWV2aW5nIGFkZGl0aW9uYWwgY2hhbm5lbCBpbmZvcm1hdGlvbiBmb3IgVVJMOiBcIiArXG4gICAgICAgICAgICAgIFwiXFxuXCIgK1xuICAgICAgICAgICAgICB1cGRhdGUudXJsICtcbiAgICAgICAgICAgICAgXCJcXG4gRXJyb3IgdGV4dDpcIiArXG4gICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGFuRXJyb3IpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgKi9cbiAgICAgICAgdXBkYXRlLnRvcF9sZXZlbF91cmwgPSBlc2NhcGVVcmwodGhpcy5nZXREb2N1bWVudFVybEZvclJlcXVlc3QoZGV0YWlscykpO1xuICAgICAgICB1cGRhdGUucGFyZW50X2ZyYW1lX2lkID0gZGV0YWlscy5wYXJlbnRGcmFtZUlkO1xuICAgICAgICB1cGRhdGUuZnJhbWVfYW5jZXN0b3JzID0gZXNjYXBlU3RyaW5nKEpTT04uc3RyaW5naWZ5KGRldGFpbHMuZnJhbWVBbmNlc3RvcnMpKTtcbiAgICAgICAgdGhpcy5kYXRhUmVjZWl2ZXIuc2F2ZVJlY29yZChcImh0dHBfcmVxdWVzdHNcIiwgdXBkYXRlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29kZSB0YWtlbiBhbmQgYWRhcHRlZCBmcm9tXG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL0VGRm9yZy9wcml2YWN5YmFkZ2VyL3B1bGwvMjE5OC9maWxlc1xuICAgICAqXG4gICAgICogR2V0cyB0aGUgVVJMIGZvciBhIGdpdmVuIHJlcXVlc3QncyB0b3AtbGV2ZWwgZG9jdW1lbnQuXG4gICAgICpcbiAgICAgKiBUaGUgcmVxdWVzdCdzIGRvY3VtZW50IG1heSBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgY3VycmVudCB0b3AtbGV2ZWwgZG9jdW1lbnRcbiAgICAgKiBsb2FkZWQgaW4gdGFiIGFzIHJlcXVlc3RzIGNhbiBjb21lIG91dCBvZiBvcmRlcjpcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7V2ViUmVxdWVzdE9uQmVmb3JlU2VuZEhlYWRlcnNFdmVudERldGFpbHN9IGRldGFpbHNcbiAgICAgKlxuICAgICAqIEByZXR1cm4gez9TdHJpbmd9IHRoZSBVUkwgZm9yIHRoZSByZXF1ZXN0J3MgdG9wLWxldmVsIGRvY3VtZW50XG4gICAgICovXG4gICAgZ2V0RG9jdW1lbnRVcmxGb3JSZXF1ZXN0KGRldGFpbHMpIHtcbiAgICAgICAgbGV0IHVybCA9IFwiXCI7XG4gICAgICAgIGlmIChkZXRhaWxzLnR5cGUgPT09IFwibWFpbl9mcmFtZVwiKSB7XG4gICAgICAgICAgICAvLyBVcmwgb2YgdGhlIHRvcC1sZXZlbCBkb2N1bWVudCBpdHNlbGYuXG4gICAgICAgICAgICB1cmwgPSBkZXRhaWxzLnVybDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkZXRhaWxzLmhhc093blByb3BlcnR5KFwiZnJhbWVBbmNlc3RvcnNcIikpIHtcbiAgICAgICAgICAgIC8vIEluIGNhc2Ugb2YgbmVzdGVkIGZyYW1lcywgcmV0cmlldmUgdXJsIGZyb20gdG9wLW1vc3QgYW5jZXN0b3IuXG4gICAgICAgICAgICAvLyBJZiBmcmFtZUFuY2VzdG9ycyA9PSBbXSwgcmVxdWVzdCBjb21lcyBmcm9tIHRoZSB0b3AtbGV2ZWwtZG9jdW1lbnQuXG4gICAgICAgICAgICB1cmwgPSBkZXRhaWxzLmZyYW1lQW5jZXN0b3JzLmxlbmd0aFxuICAgICAgICAgICAgICAgID8gZGV0YWlscy5mcmFtZUFuY2VzdG9yc1tkZXRhaWxzLmZyYW1lQW5jZXN0b3JzLmxlbmd0aCAtIDFdLnVybFxuICAgICAgICAgICAgICAgIDogZGV0YWlscy5kb2N1bWVudFVybDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIHR5cGUgIT0gJ21haW5fZnJhbWUnIGFuZCBmcmFtZUFuY2VzdG9ycyA9PSB1bmRlZmluZWRcbiAgICAgICAgICAgIC8vIEZvciBleGFtcGxlIHNlcnZpY2Ugd29ya2VyczogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTQ3MDUzNyNjMTNcbiAgICAgICAgICAgIHVybCA9IGRldGFpbHMuZG9jdW1lbnRVcmw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG4gICAgYXN5bmMgb25CZWZvcmVSZWRpcmVjdEhhbmRsZXIoZGV0YWlscywgY3Jhd2xJRCwgZXZlbnRPcmRpbmFsKSB7XG4gICAgICAgIC8qXG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgIFwib25CZWZvcmVSZWRpcmVjdEhhbmRsZXIgKHByZXZpb3VzbHkgaHR0cFJlcXVlc3RIYW5kbGVyKVwiLFxuICAgICAgICAgIGRldGFpbHMsXG4gICAgICAgICAgY3Jhd2xJRCxcbiAgICAgICAgKTtcbiAgICAgICAgKi9cbiAgICAgICAgLy8gU2F2ZSBIVFRQIHJlZGlyZWN0IGV2ZW50c1xuICAgICAgICAvLyBFdmVudHMgYXJlIHNhdmVkIHRvIHRoZSBgaHR0cF9yZWRpcmVjdHNgIHRhYmxlXG4gICAgICAgIC8qXG4gICAgICAgIC8vIFRPRE86IFJlZmFjdG9yIHRvIGNvcnJlc3BvbmRpbmcgd2ViZXh0IGxvZ2ljIG9yIGRpc2NhcmRcbiAgICAgICAgLy8gRXZlbnRzIGFyZSBzYXZlZCB0byB0aGUgYGh0dHBfcmVkaXJlY3RzYCB0YWJsZSwgYW5kIG1hcCB0aGUgb2xkXG4gICAgICAgIC8vIHJlcXVlc3QvcmVzcG9uc2UgY2hhbm5lbCBpZCB0byB0aGUgbmV3IHJlcXVlc3QvcmVzcG9uc2UgY2hhbm5lbCBpZC5cbiAgICAgICAgLy8gSW1wbGVtZW50YXRpb24gYmFzZWQgb246IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMTI0MDYyN1xuICAgICAgICBjb25zdCBvbGROb3RpZmljYXRpb25zID0gZGV0YWlscy5ub3RpZmljYXRpb25DYWxsYmFja3M7XG4gICAgICAgIGxldCBvbGRFdmVudFNpbmsgPSBudWxsO1xuICAgICAgICBkZXRhaWxzLm5vdGlmaWNhdGlvbkNhbGxiYWNrcyA9IHtcbiAgICAgICAgICBRdWVyeUludGVyZmFjZTogWFBDT01VdGlscy5nZW5lcmF0ZVFJKFtcbiAgICAgICAgICAgIENpLm5zSUludGVyZmFjZVJlcXVlc3RvcixcbiAgICAgICAgICAgIENpLm5zSUNoYW5uZWxFdmVudFNpbmssXG4gICAgICAgICAgXSksXG4gICAgXG4gICAgICAgICAgZ2V0SW50ZXJmYWNlKGlpZCkge1xuICAgICAgICAgICAgLy8gV2UgYXJlIG9ubHkgaW50ZXJlc3RlZCBpbiBuc0lDaGFubmVsRXZlbnRTaW5rLFxuICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBvbGQgY2FsbGJhY2tzIGZvciBhbnkgb3RoZXIgaW50ZXJmYWNlIHJlcXVlc3RzLlxuICAgICAgICAgICAgaWYgKGlpZC5lcXVhbHMoQ2kubnNJQ2hhbm5lbEV2ZW50U2luaykpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBvbGRFdmVudFNpbmsgPSBvbGROb3RpZmljYXRpb25zLlF1ZXJ5SW50ZXJmYWNlKGlpZCk7XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGFuRXJyb3IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFSZWNlaXZlci5sb2dFcnJvcihcbiAgICAgICAgICAgICAgICAgIFwiRXJyb3IgZHVyaW5nIGNhbGwgdG8gY3VzdG9tIG5vdGlmaWNhdGlvbkNhbGxiYWNrczo6Z2V0SW50ZXJmYWNlLlwiICtcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoYW5FcnJvciksXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGlmIChvbGROb3RpZmljYXRpb25zKSB7XG4gICAgICAgICAgICAgIHJldHVybiBvbGROb3RpZmljYXRpb25zLmdldEludGVyZmFjZShpaWQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cgQ3IuTlNfRVJST1JfTk9fSU5URVJGQUNFO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgXG4gICAgICAgICAgYXN5bmNPbkNoYW5uZWxSZWRpcmVjdChvbGRDaGFubmVsLCBuZXdDaGFubmVsLCBmbGFncywgY2FsbGJhY2spIHtcbiAgICBcbiAgICAgICAgICAgIG5ld0NoYW5uZWwuUXVlcnlJbnRlcmZhY2UoQ2kubnNJSHR0cENoYW5uZWwpO1xuICAgIFxuICAgICAgICAgICAgY29uc3QgaHR0cFJlZGlyZWN0OiBIdHRwUmVkaXJlY3QgPSB7XG4gICAgICAgICAgICAgIGJyb3dzZXJfaWQ6IGNyYXdsSUQsXG4gICAgICAgICAgICAgIG9sZF9yZXF1ZXN0X2lkOiBvbGRDaGFubmVsLmNoYW5uZWxJZCxcbiAgICAgICAgICAgICAgbmV3X3JlcXVlc3RfaWQ6IG5ld0NoYW5uZWwuY2hhbm5lbElkLFxuICAgICAgICAgICAgICB0aW1lX3N0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5kYXRhUmVjZWl2ZXIuc2F2ZVJlY29yZChcImh0dHBfcmVkaXJlY3RzXCIsIGh0dHBSZWRpcmVjdCk7XG4gICAgXG4gICAgICAgICAgICBpZiAob2xkRXZlbnRTaW5rKSB7XG4gICAgICAgICAgICAgIG9sZEV2ZW50U2luay5hc3luY09uQ2hhbm5lbFJlZGlyZWN0KFxuICAgICAgICAgICAgICAgIG9sZENoYW5uZWwsXG4gICAgICAgICAgICAgICAgbmV3Q2hhbm5lbCxcbiAgICAgICAgICAgICAgICBmbGFncyxcbiAgICAgICAgICAgICAgICBjYWxsYmFjayxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrLm9uUmVkaXJlY3RWZXJpZnlDYWxsYmFjayhDci5OU19PSyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgKi9cbiAgICAgICAgY29uc3QgcmVzcG9uc2VTdGF0dXMgPSBkZXRhaWxzLnN0YXR1c0NvZGU7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlU3RhdHVzVGV4dCA9IGRldGFpbHMuc3RhdHVzTGluZTtcbiAgICAgICAgY29uc3QgdGFiID0gZGV0YWlscy50YWJJZCA+IC0xXG4gICAgICAgICAgICA/IGF3YWl0IGJyb3dzZXIudGFicy5nZXQoZGV0YWlscy50YWJJZClcbiAgICAgICAgICAgIDogeyB3aW5kb3dJZDogdW5kZWZpbmVkLCBpbmNvZ25pdG86IHVuZGVmaW5lZCB9O1xuICAgICAgICBjb25zdCBodHRwUmVkaXJlY3QgPSB7XG4gICAgICAgICAgICBpbmNvZ25pdG86IGJvb2xUb0ludCh0YWIuaW5jb2duaXRvKSxcbiAgICAgICAgICAgIGJyb3dzZXJfaWQ6IGNyYXdsSUQsXG4gICAgICAgICAgICBvbGRfcmVxdWVzdF91cmw6IGVzY2FwZVVybChkZXRhaWxzLnVybCksXG4gICAgICAgICAgICBvbGRfcmVxdWVzdF9pZDogZGV0YWlscy5yZXF1ZXN0SWQsXG4gICAgICAgICAgICBuZXdfcmVxdWVzdF91cmw6IGVzY2FwZVVybChkZXRhaWxzLnJlZGlyZWN0VXJsKSxcbiAgICAgICAgICAgIG5ld19yZXF1ZXN0X2lkOiBudWxsLFxuICAgICAgICAgICAgZXh0ZW5zaW9uX3Nlc3Npb25fdXVpZDogZXh0ZW5zaW9uU2Vzc2lvblV1aWQsXG4gICAgICAgICAgICBldmVudF9vcmRpbmFsOiBldmVudE9yZGluYWwsXG4gICAgICAgICAgICB3aW5kb3dfaWQ6IHRhYi53aW5kb3dJZCxcbiAgICAgICAgICAgIHRhYl9pZDogZGV0YWlscy50YWJJZCxcbiAgICAgICAgICAgIGZyYW1lX2lkOiBkZXRhaWxzLmZyYW1lSWQsXG4gICAgICAgICAgICByZXNwb25zZV9zdGF0dXM6IHJlc3BvbnNlU3RhdHVzLFxuICAgICAgICAgICAgcmVzcG9uc2Vfc3RhdHVzX3RleHQ6IGVzY2FwZVN0cmluZyhyZXNwb25zZVN0YXR1c1RleHQpLFxuICAgICAgICAgICAgaGVhZGVyczogdGhpcy5qc29uaWZ5SGVhZGVycyhkZXRhaWxzLnJlc3BvbnNlSGVhZGVycykuaGVhZGVycyxcbiAgICAgICAgICAgIHRpbWVfc3RhbXA6IG5ldyBEYXRlKGRldGFpbHMudGltZVN0YW1wKS50b0lTT1N0cmluZygpLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRhdGFSZWNlaXZlci5zYXZlUmVjb3JkKFwiaHR0cF9yZWRpcmVjdHNcIiwgaHR0cFJlZGlyZWN0KTtcbiAgICB9XG4gICAgLypcbiAgICAgKiBIVFRQIFJlc3BvbnNlIEhhbmRsZXJzIGFuZCBIZWxwZXIgRnVuY3Rpb25zXG4gICAgICovXG4gICAgYXN5bmMgbG9nV2l0aFJlc3BvbnNlQm9keShkZXRhaWxzLCB1cGRhdGUpIHtcbiAgICAgICAgY29uc3QgcGVuZGluZ1Jlc3BvbnNlID0gdGhpcy5nZXRQZW5kaW5nUmVzcG9uc2UoZGV0YWlscy5yZXF1ZXN0SWQpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VCb2R5TGlzdGVuZXIgPSBwZW5kaW5nUmVzcG9uc2UucmVzcG9uc2VCb2R5TGlzdGVuZXI7XG4gICAgICAgICAgICBjb25zdCByZXNwQm9keSA9IGF3YWl0IHJlc3BvbnNlQm9keUxpc3RlbmVyLmdldFJlc3BvbnNlQm9keSgpO1xuICAgICAgICAgICAgY29uc3QgY29udGVudEhhc2ggPSBhd2FpdCByZXNwb25zZUJvZHlMaXN0ZW5lci5nZXRDb250ZW50SGFzaCgpO1xuICAgICAgICAgICAgdGhpcy5kYXRhUmVjZWl2ZXIuc2F2ZUNvbnRlbnQocmVzcEJvZHksIGVzY2FwZVN0cmluZyhjb250ZW50SGFzaCkpO1xuICAgICAgICAgICAgdXBkYXRlLmNvbnRlbnRfaGFzaCA9IGNvbnRlbnRIYXNoO1xuICAgICAgICAgICAgdGhpcy5kYXRhUmVjZWl2ZXIuc2F2ZVJlY29yZChcImh0dHBfcmVzcG9uc2VzXCIsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIC8vIFRPRE86IFJlZmFjdG9yIHRvIGNvcnJlc3BvbmRpbmcgd2ViZXh0IGxvZ2ljIG9yIGRpc2NhcmRcbiAgICAgICAgICAgIGRhdGFSZWNlaXZlci5sb2dFcnJvcihcbiAgICAgICAgICAgICAgXCJVbmFibGUgdG8gcmV0cmlldmUgcmVzcG9uc2UgYm9keS5cIiArIEpTT04uc3RyaW5naWZ5KGFSZWFzb24pLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHVwZGF0ZS5jb250ZW50X2hhc2ggPSBcIjxlcnJvcj5cIjtcbiAgICAgICAgICAgIGRhdGFSZWNlaXZlci5zYXZlUmVjb3JkKFwiaHR0cF9yZXNwb25zZXNcIiwgdXBkYXRlKTtcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmRhdGFSZWNlaXZlci5sb2dFcnJvcihcIlVuYWJsZSB0byByZXRyaWV2ZSByZXNwb25zZSBib2R5LlwiICtcbiAgICAgICAgICAgICAgICBcIkxpa2VseSBjYXVzZWQgYnkgYSBwcm9ncmFtbWluZyBlcnJvci4gRXJyb3IgTWVzc2FnZTpcIiArXG4gICAgICAgICAgICAgICAgZXJyLm5hbWUgK1xuICAgICAgICAgICAgICAgIGVyci5tZXNzYWdlICtcbiAgICAgICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgICAgICBlcnIuc3RhY2spO1xuICAgICAgICAgICAgdXBkYXRlLmNvbnRlbnRfaGFzaCA9IFwiPGVycm9yPlwiO1xuICAgICAgICAgICAgdGhpcy5kYXRhUmVjZWl2ZXIuc2F2ZVJlY29yZChcImh0dHBfcmVzcG9uc2VzXCIsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gSW5zdHJ1bWVudCBIVFRQIHJlc3BvbnNlc1xuICAgIGFzeW5jIG9uQ29tcGxldGVkSGFuZGxlcihkZXRhaWxzLCBjcmF3bElELCBldmVudE9yZGluYWwsIHNhdmVDb250ZW50KSB7XG4gICAgICAgIC8qXG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgIFwib25Db21wbGV0ZWRIYW5kbGVyIChwcmV2aW91c2x5IGh0dHBSZXF1ZXN0SGFuZGxlcilcIixcbiAgICAgICAgICBkZXRhaWxzLFxuICAgICAgICAgIGNyYXdsSUQsXG4gICAgICAgICAgc2F2ZUNvbnRlbnQsXG4gICAgICAgICk7XG4gICAgICAgICovXG4gICAgICAgIGNvbnN0IHRhYiA9IGRldGFpbHMudGFiSWQgPiAtMVxuICAgICAgICAgICAgPyBhd2FpdCBicm93c2VyLnRhYnMuZ2V0KGRldGFpbHMudGFiSWQpXG4gICAgICAgICAgICA6IHsgd2luZG93SWQ6IHVuZGVmaW5lZCwgaW5jb2duaXRvOiB1bmRlZmluZWQgfTtcbiAgICAgICAgY29uc3QgdXBkYXRlID0ge307XG4gICAgICAgIHVwZGF0ZS5pbmNvZ25pdG8gPSBib29sVG9JbnQodGFiLmluY29nbml0byk7XG4gICAgICAgIHVwZGF0ZS5icm93c2VyX2lkID0gY3Jhd2xJRDtcbiAgICAgICAgdXBkYXRlLmV4dGVuc2lvbl9zZXNzaW9uX3V1aWQgPSBleHRlbnNpb25TZXNzaW9uVXVpZDtcbiAgICAgICAgdXBkYXRlLmV2ZW50X29yZGluYWwgPSBldmVudE9yZGluYWw7XG4gICAgICAgIHVwZGF0ZS53aW5kb3dfaWQgPSB0YWIud2luZG93SWQ7XG4gICAgICAgIHVwZGF0ZS50YWJfaWQgPSBkZXRhaWxzLnRhYklkO1xuICAgICAgICB1cGRhdGUuZnJhbWVfaWQgPSBkZXRhaWxzLmZyYW1lSWQ7XG4gICAgICAgIC8vIHJlcXVlc3RJZCBpcyBhIHVuaXF1ZSBpZGVudGlmaWVyIHRoYXQgY2FuIGJlIHVzZWQgdG8gbGluayByZXF1ZXN0cyBhbmQgcmVzcG9uc2VzXG4gICAgICAgIHVwZGF0ZS5yZXF1ZXN0X2lkID0gZGV0YWlscy5yZXF1ZXN0SWQ7XG4gICAgICAgIGNvbnN0IGlzQ2FjaGVkID0gZGV0YWlscy5mcm9tQ2FjaGU7XG4gICAgICAgIHVwZGF0ZS5pc19jYWNoZWQgPSBib29sVG9JbnQoaXNDYWNoZWQpO1xuICAgICAgICBjb25zdCB1cmwgPSBkZXRhaWxzLnVybDtcbiAgICAgICAgdXBkYXRlLnVybCA9IGVzY2FwZVVybCh1cmwpO1xuICAgICAgICBjb25zdCByZXF1ZXN0TWV0aG9kID0gZGV0YWlscy5tZXRob2Q7XG4gICAgICAgIHVwZGF0ZS5tZXRob2QgPSBlc2NhcGVTdHJpbmcocmVxdWVzdE1ldGhvZCk7XG4gICAgICAgIC8vIFRPRE86IFJlZmFjdG9yIHRvIGNvcnJlc3BvbmRpbmcgd2ViZXh0IGxvZ2ljIG9yIGRpc2NhcmRcbiAgICAgICAgLy8gKHJlcXVlc3QgaGVhZGVycyBhcmUgbm90IGF2YWlsYWJsZSBpbiBodHRwIHJlc3BvbnNlIGV2ZW50IGxpc3RlbmVyIG9iamVjdCxcbiAgICAgICAgLy8gYnV0IHRoZSByZWZlcnJlciBwcm9wZXJ0eSBvZiB0aGUgY29ycmVzcG9uZGluZyByZXF1ZXN0IGNvdWxkIGJlIHF1ZXJpZWQpXG4gICAgICAgIC8vXG4gICAgICAgIC8vIGxldCByZWZlcnJlciA9IFwiXCI7XG4gICAgICAgIC8vIGlmIChkZXRhaWxzLnJlZmVycmVyKSB7XG4gICAgICAgIC8vICAgcmVmZXJyZXIgPSBkZXRhaWxzLnJlZmVycmVyLnNwZWM7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gdXBkYXRlLnJlZmVycmVyID0gZXNjYXBlU3RyaW5nKHJlZmVycmVyKTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2VTdGF0dXMgPSBkZXRhaWxzLnN0YXR1c0NvZGU7XG4gICAgICAgIHVwZGF0ZS5yZXNwb25zZV9zdGF0dXMgPSByZXNwb25zZVN0YXR1cztcbiAgICAgICAgY29uc3QgcmVzcG9uc2VTdGF0dXNUZXh0ID0gZGV0YWlscy5zdGF0dXNMaW5lO1xuICAgICAgICB1cGRhdGUucmVzcG9uc2Vfc3RhdHVzX3RleHQgPSBlc2NhcGVTdHJpbmcocmVzcG9uc2VTdGF0dXNUZXh0KTtcbiAgICAgICAgY29uc3QgY3VycmVudF90aW1lID0gbmV3IERhdGUoZGV0YWlscy50aW1lU3RhbXApO1xuICAgICAgICB1cGRhdGUudGltZV9zdGFtcCA9IGN1cnJlbnRfdGltZS50b0lTT1N0cmluZygpO1xuICAgICAgICBjb25zdCBwYXJzZWRIZWFkZXJzID0gdGhpcy5qc29uaWZ5SGVhZGVycyhkZXRhaWxzLnJlc3BvbnNlSGVhZGVycyk7XG4gICAgICAgIHVwZGF0ZS5oZWFkZXJzID0gcGFyc2VkSGVhZGVycy5oZWFkZXJzO1xuICAgICAgICB1cGRhdGUubG9jYXRpb24gPSBwYXJzZWRIZWFkZXJzLmxvY2F0aW9uO1xuICAgICAgICBpZiAodGhpcy5zaG91bGRTYXZlQ29udGVudChzYXZlQ29udGVudCwgZGV0YWlscy50eXBlKSkge1xuICAgICAgICAgICAgdGhpcy5sb2dXaXRoUmVzcG9uc2VCb2R5KGRldGFpbHMsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFSZWNlaXZlci5zYXZlUmVjb3JkKFwiaHR0cF9yZXNwb25zZXNcIiwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBqc29uaWZ5SGVhZGVycyhoZWFkZXJzKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdEhlYWRlcnMgPSBbXTtcbiAgICAgICAgbGV0IGxvY2F0aW9uID0gXCJcIjtcbiAgICAgICAgaWYgKGhlYWRlcnMpIHtcbiAgICAgICAgICAgIGhlYWRlcnMubWFwKHJlc3BvbnNlSGVhZGVyID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IG5hbWUsIHZhbHVlIH0gPSByZXNwb25zZUhlYWRlcjtcbiAgICAgICAgICAgICAgICBjb25zdCBoZWFkZXJfcGFpciA9IFtdO1xuICAgICAgICAgICAgICAgIGhlYWRlcl9wYWlyLnB1c2goZXNjYXBlU3RyaW5nKG5hbWUpKTtcbiAgICAgICAgICAgICAgICBoZWFkZXJfcGFpci5wdXNoKGVzY2FwZVN0cmluZyh2YWx1ZSkpO1xuICAgICAgICAgICAgICAgIHJlc3VsdEhlYWRlcnMucHVzaChoZWFkZXJfcGFpcik7XG4gICAgICAgICAgICAgICAgaWYgKG5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJsb2NhdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IEpTT04uc3RyaW5naWZ5KHJlc3VsdEhlYWRlcnMpLFxuICAgICAgICAgICAgbG9jYXRpb246IGVzY2FwZVN0cmluZyhsb2NhdGlvbiksXG4gICAgICAgIH07XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pYUhSMGNDMXBibk4wY25WdFpXNTBMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUxpNHZMaTR2TGk0dmMzSmpMMkpoWTJ0bmNtOTFibVF2YUhSMGNDMXBibk4wY25WdFpXNTBMblJ6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxFOUJRVThzUlVGQlJTeDFRa0ZCZFVJc1JVRkJSU3hOUVVGTkxIZERRVUYzUXl4RFFVRkRPMEZCUTJwR0xFOUJRVThzUlVGQlJTeHZRa0ZCYjBJc1JVRkJSU3hOUVVGTkxDdENRVUVyUWl4RFFVRkRPMEZCUTNKRkxFOUJRVThzUlVGQlJTeGpRVUZqTEVWQlFYRkNMRTFCUVUwc2VVSkJRWGxDTEVOQlFVTTdRVUZETlVVc1QwRkJUeXhGUVVGRkxHTkJRV01zUlVGQlJTeE5RVUZOTEhkQ1FVRjNRaXhEUVVGRE8wRkJRM2hFTEU5QlFVOHNSVUZCUlN4bFFVRmxMRVZCUVVVc1RVRkJUU3g1UWtGQmVVSXNRMEZCUXp0QlFVc3hSQ3hQUVVGUExFVkJRVVVzVTBGQlV5eEZRVUZGTEZsQlFWa3NSVUZCUlN4VFFVRlRMRVZCUVVVc1RVRkJUU3h4UWtGQmNVSXNRMEZCUXp0QlFWZDZSVHM3T3pzN08wZEJUVWM3UVVGRlNDeE5RVUZOTEU5QlFVOHNZMEZCWXp0SlFXRjZRaXhaUVVGWkxGbEJRVms3VVVGWWFFSXNiMEpCUVdVc1IwRkZia0lzUlVGQlJTeERRVUZETzFGQlEwTXNjVUpCUVdkQ0xFZEJSWEJDTEVWQlFVVXNRMEZCUXp0UlFVOU1MRWxCUVVrc1EwRkJReXhaUVVGWkxFZEJRVWNzV1VGQldTeERRVUZETzBsQlEyNURMRU5CUVVNN1NVRkZUU3hIUVVGSExFTkJRVU1zVDBGQlR5eEZRVUZGTEdsQ1FVRnZRenRSUVVOMFJDeE5RVUZOTEZGQlFWRXNSMEZCYlVJN1dVRkRMMElzVVVGQlVUdFpRVU5TTEZsQlFWazdXVUZEV2l4TlFVRk5PMWxCUTA0c1QwRkJUenRaUVVOUUxGVkJRVlU3V1VGRFZpeFpRVUZaTzFsQlExb3NUMEZCVHp0WlFVTlFMRkZCUVZFN1dVRkRVaXh0UWtGQmJVSTdXVUZEYmtJc1RVRkJUVHRaUVVOT0xGRkJRVkU3V1VGRFVpeHBRa0ZCYVVJN1dVRkRha0lzV1VGQldUdFpRVU5hTEZkQlFWYzdXVUZEV0N4alFVRmpPMWxCUTJRc1YwRkJWenRaUVVOWUxFdEJRVXM3V1VGRFRDeFRRVUZUTzFsQlExUXNaMEpCUVdkQ08xbEJRMmhDTEUxQlFVMDdXVUZEVGl4UFFVRlBPMU5CUTFJc1EwRkJRenRSUVVWR0xFMUJRVTBzVFVGQlRTeEhRVUZyUWl4RlFVRkZMRWxCUVVrc1JVRkJSU3hEUVVGRExGbEJRVmtzUTBGQlF5eEZRVUZGTEV0QlFVc3NSVUZCUlN4UlFVRlJMRVZCUVVVc1EwRkJRenRSUVVWNFJTeE5RVUZOTEhsQ1FVRjVRaXhIUVVGSExFOUJRVThzUTBGQlF5eEZRVUZGTzFsQlF6RkRMRTlCUVU4c1EwRkRUQ3hQUVVGUExFTkJRVU1zVTBGQlV5eEpRVUZKTEU5QlFVOHNRMEZCUXl4VFFVRlRMRU5CUVVNc1QwRkJUeXhEUVVGRExHdENRVUZyUWl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRM2hGTEVOQlFVTTdVVUZEU2l4RFFVRkRMRU5CUVVNN1VVRkZSanM3VjBGRlJ6dFJRVVZJTEVsQlFVa3NRMEZCUXl4MVFrRkJkVUlzUjBGQlJ5eERRVU0zUWl4UFFVRTRReXhGUVVNNVF5eEZRVUZGTzFsQlEwWXNUVUZCVFN3clFrRkJLMElzUjBGQmNVSXNSVUZCUlN4RFFVRkRPMWxCUXpkRUxIRkRRVUZ4UXp0WlFVTnlReXhKUVVGSkxIbENRVUY1UWl4RFFVRkRMRTlCUVU4c1EwRkJReXhGUVVGRk8yZENRVU4wUXl4UFFVRlBMQ3RDUVVFclFpeERRVUZETzJGQlEzaERPMWxCUTBRc1RVRkJUU3hqUVVGakxFZEJRVWNzU1VGQlNTeERRVUZETEdsQ1FVRnBRaXhEUVVGRExFOUJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0WlFVTnFSU3hqUVVGakxFTkJRVU1zYTBOQlFXdERMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03V1VGRE0wUXNUVUZCVFN4bFFVRmxMRWRCUVVjc1NVRkJTU3hEUVVGRExHdENRVUZyUWl4RFFVRkRMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dFpRVU51UlN4bFFVRmxMRU5CUVVNc2EwTkJRV3RETEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1dVRkROVVFzU1VGQlNTeEpRVUZKTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zYVVKQlFXbENMRVZCUVVVc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eEZRVUZGTzJkQ1FVTXpSQ3hsUVVGbExFTkJRVU1zSzBKQlFTdENMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03WVVGRE1VUTdXVUZEUkN4UFFVRlBMQ3RDUVVFclFpeERRVUZETzFGQlEzcERMRU5CUVVNc1EwRkJRenRSUVVOR0xFOUJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTXNaVUZCWlN4RFFVRkRMRmRCUVZjc1EwRkROVU1zU1VGQlNTeERRVUZETEhWQ1FVRjFRaXhGUVVNMVFpeE5RVUZOTEVWQlEwNHNTVUZCU1N4RFFVRkRMSE5DUVVGelFpeERRVUZETEdsQ1FVRnBRaXhEUVVGRE8xbEJRelZETEVOQlFVTXNRMEZCUXl4RFFVRkRMR0ZCUVdFc1JVRkJSU3hWUVVGVkxFTkJRVU03V1VGRE4wSXNRMEZCUXl4RFFVRkRMRU5CUVVNc1lVRkJZU3hEUVVGRExFTkJRM0JDTEVOQlFVTTdVVUZGUml4SlFVRkpMRU5CUVVNc01rSkJRVEpDTEVkQlFVY3NUMEZCVHl4RFFVRkRMRVZCUVVVN1dVRkRNME1zY1VOQlFYRkRPMWxCUTNKRExFbEJRVWtzZVVKQlFYbENMRU5CUVVNc1QwRkJUeXhEUVVGRExFVkJRVVU3WjBKQlEzUkRMRTlCUVU4N1lVRkRVanRaUVVORUxFMUJRVTBzWTBGQll5eEhRVUZITEVsQlFVa3NRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eFBRVUZQTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1dVRkRha1VzWTBGQll5eERRVUZETEhORFFVRnpReXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzFsQlF5OUVMRWxCUVVrc1EwRkJReXd3UWtGQk1FSXNRMEZETjBJc1QwRkJUeXhGUVVOUUxFOUJRVThzUlVGRFVDeDFRa0ZCZFVJc1JVRkJSU3hEUVVNeFFpeERRVUZETzFGQlEwb3NRMEZCUXl4RFFVRkRPMUZCUTBZc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eHRRa0ZCYlVJc1EwRkJReXhYUVVGWExFTkJRMmhFTEVsQlFVa3NRMEZCUXl3eVFrRkJNa0lzUlVGRGFFTXNUVUZCVFN4RlFVTk9MRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNRMEZEYmtJc1EwRkJRenRSUVVWR0xFbEJRVWtzUTBGQlF5eDNRa0ZCZDBJc1IwRkJSeXhQUVVGUExFTkJRVU1zUlVGQlJUdFpRVU40UXl4eFEwRkJjVU03V1VGRGNrTXNTVUZCU1N4NVFrRkJlVUlzUTBGQlF5eFBRVUZQTEVOQlFVTXNSVUZCUlR0blFrRkRkRU1zVDBGQlR6dGhRVU5TTzFsQlEwUXNTVUZCU1N4RFFVRkRMSFZDUVVGMVFpeERRVUZETEU5QlFVOHNSVUZCUlN4UFFVRlBMRVZCUVVVc2RVSkJRWFZDTEVWQlFVVXNRMEZCUXl4RFFVRkRPMUZCUXpWRkxFTkJRVU1zUTBGQlF6dFJRVU5HTEU5QlFVOHNRMEZCUXl4VlFVRlZMRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNWMEZCVnl4RFFVTTNReXhKUVVGSkxFTkJRVU1zZDBKQlFYZENMRVZCUXpkQ0xFMUJRVTBzUlVGRFRpeERRVUZETEdsQ1FVRnBRaXhEUVVGRExFTkJRM0JDTEVOQlFVTTdVVUZGUml4SlFVRkpMRU5CUVVNc2JVSkJRVzFDTEVkQlFVY3NUMEZCVHl4RFFVRkRMRVZCUVVVN1dVRkRia01zY1VOQlFYRkRPMWxCUTNKRExFbEJRVWtzZVVKQlFYbENMRU5CUVVNc1QwRkJUeXhEUVVGRExFVkJRVVU3WjBKQlEzUkRMRTlCUVU4N1lVRkRVanRaUVVORUxFMUJRVTBzWlVGQlpTeEhRVUZITEVsQlFVa3NRMEZCUXl4clFrRkJhMElzUTBGQlF5eFBRVUZQTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1dVRkRia1VzWlVGQlpTeERRVUZETERoQ1FVRTRRaXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzFsQlEzaEVMRWxCUVVrc1EwRkJReXhyUWtGQmEwSXNRMEZEY2tJc1QwRkJUeXhGUVVOUUxFOUJRVThzUlVGRFVDeDFRa0ZCZFVJc1JVRkJSU3hGUVVONlFpeHBRa0ZCYVVJc1EwRkRiRUlzUTBGQlF6dFJRVU5LTEVOQlFVTXNRMEZCUXp0UlFVTkdMRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU1zVjBGQlZ5eERRVUZETEZkQlFWY3NRMEZEZUVNc1NVRkJTU3hEUVVGRExHMUNRVUZ0UWl4RlFVTjRRaXhOUVVGTkxFVkJRMDRzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhEUVVOd1FpeERRVUZETzBsQlEwb3NRMEZCUXp0SlFVVk5MRTlCUVU4N1VVRkRXaXhKUVVGSkxFbEJRVWtzUTBGQlF5eDFRa0ZCZFVJc1JVRkJSVHRaUVVOb1F5eFBRVUZQTEVOQlFVTXNWVUZCVlN4RFFVRkRMR1ZCUVdVc1EwRkJReXhqUVVGakxFTkJReTlETEVsQlFVa3NRMEZCUXl4MVFrRkJkVUlzUTBGRE4wSXNRMEZCUXp0VFFVTklPMUZCUTBRc1NVRkJTU3hKUVVGSkxFTkJRVU1zTWtKQlFUSkNMRVZCUVVVN1dVRkRjRU1zVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eGpRVUZqTEVOQlEyNUVMRWxCUVVrc1EwRkJReXd5UWtGQk1rSXNRMEZEYWtNc1EwRkJRenRUUVVOSU8xRkJRMFFzU1VGQlNTeEpRVUZKTEVOQlFVTXNkMEpCUVhkQ0xFVkJRVVU3V1VGRGFrTXNUMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhuUWtGQlowSXNRMEZCUXl4alFVRmpMRU5CUTJoRUxFbEJRVWtzUTBGQlF5eDNRa0ZCZDBJc1EwRkRPVUlzUTBGQlF6dFRRVU5JTzFGQlEwUXNTVUZCU1N4SlFVRkpMRU5CUVVNc2JVSkJRVzFDTEVWQlFVVTdXVUZETlVJc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eFhRVUZYTEVOQlFVTXNZMEZCWXl4RFFVRkRMRWxCUVVrc1EwRkJReXh0UWtGQmJVSXNRMEZCUXl4RFFVRkRPMU5CUTNwRk8wbEJRMGdzUTBGQlF6dEpRVVZQTEhOQ1FVRnpRaXhEUVVGRExHbENRVUZ2UXp0UlFVTnFSU3hKUVVGSkxHbENRVUZwUWl4TFFVRkxMRWxCUVVrc1JVRkJSVHRaUVVNNVFpeFBRVUZQTEVsQlFVa3NRMEZCUXp0VFFVTmlPMUZCUTBRc1NVRkJTU3hwUWtGQmFVSXNTMEZCU3l4TFFVRkxMRVZCUVVVN1dVRkRMMElzVDBGQlR5eExRVUZMTEVOQlFVTTdVMEZEWkR0UlFVTkVMRTlCUVU4c1NVRkJTU3hEUVVGRExIZENRVUYzUWl4RFFVRkRMR2xDUVVGcFFpeERRVUZETEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJRenRKUVVOeVJTeERRVUZETzBsQlJVOHNkMEpCUVhkQ0xFTkJRVU1zYVVKQlFYbENPMUZCUTNoRUxFOUJRVThzYVVKQlFXbENMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQmJVSXNRMEZCUXp0SlFVTjRSQ3hEUVVGRE8wbEJSVVE3T3pzN096dFBRVTFITzBsQlEwc3NhVUpCUVdsQ0xFTkJRM1pDTEdsQ1FVRnZReXhGUVVOd1F5eFpRVUV3UWp0UlFVVXhRaXhKUVVGSkxHbENRVUZwUWl4TFFVRkxMRWxCUVVrc1JVRkJSVHRaUVVNNVFpeFBRVUZQTEVsQlFVa3NRMEZCUXp0VFFVTmlPMUZCUTBRc1NVRkJTU3hwUWtGQmFVSXNTMEZCU3l4TFFVRkxMRVZCUVVVN1dVRkRMMElzVDBGQlR5eExRVUZMTEVOQlFVTTdVMEZEWkR0UlFVTkVMRTlCUVU4c1NVRkJTU3hEUVVGRExIZENRVUYzUWl4RFFVRkRMR2xDUVVGcFFpeERRVUZETEVOQlFVTXNVVUZCVVN4RFFVTTVSQ3haUVVGWkxFTkJRMklzUTBGQlF6dEpRVU5LTEVOQlFVTTdTVUZGVHl4cFFrRkJhVUlzUTBGQlF5eFRRVUZUTzFGQlEycERMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zWlVGQlpTeERRVUZETEZOQlFWTXNRMEZCUXl4RlFVRkZPMWxCUTNCRExFbEJRVWtzUTBGQlF5eGxRVUZsTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWRCUVVjc1NVRkJTU3hqUVVGakxFVkJRVVVzUTBGQlF6dFRRVU40UkR0UlFVTkVMRTlCUVU4c1NVRkJTU3hEUVVGRExHVkJRV1VzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0SlFVTjZReXhEUVVGRE8wbEJSVThzYTBKQlFXdENMRU5CUVVNc1UwRkJVenRSUVVOc1F5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMR2RDUVVGblFpeERRVUZETEZOQlFWTXNRMEZCUXl4RlFVRkZPMWxCUTNKRExFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhUUVVGVExFTkJRVU1zUjBGQlJ5eEpRVUZKTEdWQlFXVXNSVUZCUlN4RFFVRkRPMU5CUXpGRU8xRkJRMFFzVDBGQlR5eEpRVUZKTEVOQlFVTXNaMEpCUVdkQ0xFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdTVUZETVVNc1EwRkJRenRKUVVWRU96dFBRVVZITzBsQlJVc3NTMEZCU3l4RFFVRkRMREJDUVVFd1FpeERRVU4wUXl4UFFVRnJSQ3hGUVVOc1JDeFBRVUZQTEVWQlExQXNXVUZCYjBJN1VVRkZjRUk3T3pzN096dFZRVTFGTzFGQlJVWXNUVUZCVFN4SFFVRkhMRWRCUTFBc1QwRkJUeXhEUVVGRExFdEJRVXNzUjBGQlJ5eERRVUZETEVOQlFVTTdXVUZEYUVJc1EwRkJReXhEUVVGRExFMUJRVTBzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1QwRkJUeXhEUVVGRExFdEJRVXNzUTBGQlF6dFpRVU4yUXl4RFFVRkRMRU5CUVVNc1JVRkJSU3hSUVVGUkxFVkJRVVVzVTBGQlV5eEZRVUZGTEZOQlFWTXNSVUZCUlN4VFFVRlRMRVZCUVVVc1IwRkJSeXhGUVVGRkxGTkJRVk1zUlVGQlJTeERRVUZETzFGQlJYQkZMRTFCUVUwc1RVRkJUU3hIUVVGSExFVkJRV2xDTEVOQlFVTTdVVUZGYWtNc1RVRkJUU3hEUVVGRExGTkJRVk1zUjBGQlJ5eFRRVUZUTEVOQlFVTXNSMEZCUnl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8xRkJRelZETEUxQlFVMHNRMEZCUXl4VlFVRlZMRWRCUVVjc1QwRkJUeXhEUVVGRE8xRkJRelZDTEUxQlFVMHNRMEZCUXl4elFrRkJjMElzUjBGQlJ5eHZRa0ZCYjBJc1EwRkJRenRSUVVOeVJDeE5RVUZOTEVOQlFVTXNZVUZCWVN4SFFVRkhMRmxCUVZrc1EwRkJRenRSUVVOd1F5eE5RVUZOTEVOQlFVTXNVMEZCVXl4SFFVRkhMRWRCUVVjc1EwRkJReXhSUVVGUkxFTkJRVU03VVVGRGFFTXNUVUZCVFN4RFFVRkRMRTFCUVUwc1IwRkJSeXhQUVVGUExFTkJRVU1zUzBGQlN5eERRVUZETzFGQlF6bENMRTFCUVUwc1EwRkJReXhSUVVGUkxFZEJRVWNzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXp0UlFVVnNReXh0UmtGQmJVWTdVVUZEYmtZc1RVRkJUU3hEUVVGRExGVkJRVlVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNVMEZCVXl4RFFVRkRPMUZCUlhSRExFMUJRVTBzUjBGQlJ5eEhRVUZITEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNN1VVRkRlRUlzVFVGQlRTeERRVUZETEVkQlFVY3NSMEZCUnl4VFFVRlRMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU03VVVGRk5VSXNUVUZCVFN4aFFVRmhMRWRCUVVjc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF6dFJRVU55UXl4TlFVRk5MRU5CUVVNc1RVRkJUU3hIUVVGSExGbEJRVmtzUTBGQlF5eGhRVUZoTEVOQlFVTXNRMEZCUXp0UlFVVTFReXhOUVVGTkxGbEJRVmtzUjBGQlJ5eEpRVUZKTEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03VVVGRGFrUXNUVUZCVFN4RFFVRkRMRlZCUVZVc1IwRkJSeXhaUVVGWkxFTkJRVU1zVjBGQlZ5eEZRVUZGTEVOQlFVTTdVVUZGTDBNc1NVRkJTU3haUVVGWkxFZEJRVWNzUlVGQlJTeERRVUZETzFGQlEzUkNMRWxCUVVrc1VVRkJVU3hIUVVGSExFVkJRVVVzUTBGQlF6dFJRVU5zUWl4TlFVRk5MRTlCUVU4c1IwRkJSeXhGUVVGRkxFTkJRVU03VVVGRGJrSXNTVUZCU1N4TlFVRk5MRWRCUVVjc1MwRkJTeXhEUVVGRE8xRkJRMjVDTEVsQlFVa3NUMEZCVHl4RFFVRkRMR05CUVdNc1JVRkJSVHRaUVVNeFFpeFBRVUZQTEVOQlFVTXNZMEZCWXl4RFFVRkRMRWRCUVVjc1EwRkJReXhoUVVGaExFTkJRVU1zUlVGQlJUdG5Ra0ZEZWtNc1RVRkJUU3hGUVVGRkxFbEJRVWtzUlVGQlJTeExRVUZMTEVWQlFVVXNSMEZCUnl4aFFVRmhMRU5CUVVNN1owSkJRM1JETEUxQlFVMHNWMEZCVnl4SFFVRkhMRVZCUVVVc1EwRkJRenRuUWtGRGRrSXNWMEZCVnl4RFFVRkRMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXp0blFrRkRja01zVjBGQlZ5eERRVUZETEVsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF6dG5Ra0ZEZEVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUXp0blFrRkRNVUlzU1VGQlNTeEpRVUZKTEV0QlFVc3NZMEZCWXl4RlFVRkZPMjlDUVVNelFpeFpRVUZaTEVkQlFVY3NTMEZCU3l4RFFVRkRPMjlDUVVOeVFpeEpRVUZKTEZsQlFWa3NRMEZCUXl4UFFVRlBMRU5CUVVNc01FSkJRVEJDTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1JVRkJSVHQzUWtGRE0wUXNUVUZCVFN4SFFVRkhMRWxCUVVrc1EwRkJRenR4UWtGRFpqdHBRa0ZEUmp0blFrRkRSQ3hKUVVGSkxFbEJRVWtzUzBGQlN5eFRRVUZUTEVWQlFVVTdiMEpCUTNSQ0xGRkJRVkVzUjBGQlJ5eExRVUZMTEVOQlFVTTdhVUpCUTJ4Q08xbEJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdVMEZEU2p0UlFVVkVMRTFCUVUwc1EwRkJReXhSUVVGUkxFZEJRVWNzV1VGQldTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMUZCUlhwRExFbEJRVWtzWVVGQllTeExRVUZMTEUxQlFVMHNTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhwUTBGQmFVTXNSVUZCUlR0WlFVTjZSU3hOUVVGTkxHTkJRV01zUjBGQlJ5eEpRVUZKTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMWxCUTJwRkxFMUJRVTBzVVVGQlVTeEhRVUZITEUxQlFVMHNZMEZCWXl4RFFVRkRMSEZDUVVGeFFpeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMWxCUTJ4RkxFbEJRVWtzUTBGQlF5eFJRVUZSTEVWQlFVVTdaMEpCUTJJc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eFJRVUZSTEVOQlEzaENMSEZIUVVGeFJ5eERRVU4wUnl4RFFVRkRPMkZCUTBnN2FVSkJRVTA3WjBKQlEwd3NUVUZCVFN3eVFrRkJNa0lzUjBGQlJ5eE5RVUZOTEdOQlFXTXNRMEZCUXl3eVFrRkJNa0lzUTBGQlF6dG5Ra0ZEY2tZc1RVRkJUU3hYUVVGWExFZEJRVWNzTWtKQlFUSkNMRU5CUVVNc1YwRkJWeXhEUVVGRE8yZENRVVUxUkN4SlFVRkpMRmRCUVZjc1JVRkJSVHR2UWtGRFppeE5RVUZOTEZWQlFWVXNSMEZCUnl4SlFVRkpMR05CUVdNN2IwSkJRMjVETEZkQlFWYzdiMEpCUTFnc01rSkJRVEpDTEVWQlF6TkNMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRMnhDTEVOQlFVTTdiMEpCUTBZc1RVRkJUU3hQUVVGUExFZEJRWE5DTEZWQlFWVTdlVUpCUXpGRExHZENRVUZuUWl4RlFVVm1MRU5CUVVNN2IwSkJSVXdzWjBSQlFXZEVPMjlDUVVOb1JDeEpRVUZKTEdOQlFXTXNTVUZCU1N4UFFVRlBMRVZCUVVVN2QwSkJRemRDTERCR1FVRXdSanQzUWtGRE1VWXNiVWRCUVcxSE8zZENRVU51Unl4TlFVRk5MR05CUVdNc1IwRkJSenMwUWtGRGNrSXNZMEZCWXpzMFFrRkRaQ3h4UWtGQmNVSTdORUpCUTNKQ0xHZENRVUZuUWp0NVFrRkRha0lzUTBGQlF6dDNRa0ZEUml4TFFVRkxMRTFCUVUwc1NVRkJTU3hKUVVGSkxFOUJRVThzUTBGQlF5eFpRVUZaTEVWQlFVVTdORUpCUTNaRExFbEJRVWtzWTBGQll5eERRVUZETEZGQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1JVRkJSVHRuUTBGRGFrTXNUVUZCVFN4WFFVRlhMRWRCUVVjc1JVRkJSU3hEUVVGRE8yZERRVU4yUWl4WFFVRlhMRU5CUVVNc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RFFVRkRPMmREUVVOeVF5eFhRVUZYTEVOQlFVTXNTVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJReXhQUVVGUExFTkJRVU1zV1VGQldTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRuUTBGRE0wUXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlF6czJRa0ZETTBJN2VVSkJRMFk3Y1VKQlEwWTdiMEpCUTBRc0swWkJRU3RHTzI5Q1FVTXZSaXhKUVVGSkxGZEJRVmNzU1VGQlNTeFBRVUZQTEVWQlFVVTdkMEpCUXpGQ0xFMUJRVTBzUTBGQlF5eFRRVUZUTEVkQlFVY3NUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJRenR4UWtGRGRFTTdiMEpCUTBRc1NVRkJTU3hsUVVGbExFbEJRVWtzVDBGQlR5eEZRVUZGTzNkQ1FVTTVRaXhOUVVGTkxFTkJRVU1zWVVGQllTeEhRVUZITEU5QlFVOHNRMEZCUXl4aFFVRmhMRU5CUVVNN2NVSkJRemxETzJsQ1FVTkdPMkZCUTBZN1UwRkRSanRSUVVWRUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dFJRVVY2UXl4bFFVRmxPMUZCUTJZc1RVRkJUU3hMUVVGTExFZEJRVWNzVDBGQlR5eERRVUZETEVsQlFVa3NTMEZCU3l4blFrRkJaMElzUTBGQlF6dFJRVU5vUkN4TlFVRk5MRU5CUVVNc1RVRkJUU3hIUVVGSExGTkJRVk1zUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0UlFVVnFReXcyUTBGQk5rTTdVVUZETjBNc1NVRkJTU3huUWtGQlowSXNRMEZCUXp0UlFVTnlRaXhKUVVGSkxHRkJRV0VzUTBGQlF6dFJRVU5zUWl4SlFVRkpMRTlCUVU4c1EwRkJReXhUUVVGVExFVkJRVVU3V1VGRGNrSXNUVUZCVFN4bFFVRmxMRWRCUVVjc1NVRkJTU3hIUVVGSExFTkJRVU1zVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMWxCUTI1RUxHZENRVUZuUWl4SFFVRkhMR1ZCUVdVc1EwRkJReXhOUVVGTkxFTkJRVU03VTBGRE0wTTdVVUZEUkN4SlFVRkpMRTlCUVU4c1EwRkJReXhYUVVGWExFVkJRVVU3V1VGRGRrSXNUVUZCVFN4cFFrRkJhVUlzUjBGQlJ5eEpRVUZKTEVkQlFVY3NRMEZCUXl4UFFVRlBMRU5CUVVNc1YwRkJWeXhEUVVGRExFTkJRVU03V1VGRGRrUXNZVUZCWVN4SFFVRkhMR2xDUVVGcFFpeERRVUZETEUxQlFVMHNRMEZCUXp0VFFVTXhRenRSUVVORUxFMUJRVTBzUTBGQlF5eHBRa0ZCYVVJc1IwRkJSeXhaUVVGWkxFTkJRVU1zWjBKQlFXZENMRU5CUVVNc1EwRkJRenRSUVVNeFJDeE5RVUZOTEVOQlFVTXNZMEZCWXl4SFFVRkhMRmxCUVZrc1EwRkJReXhoUVVGaExFTkJRVU1zUTBGQlF6dFJRVVZ3UkN4NVFrRkJlVUk3VVVGRGVrSXNlVVZCUVhsRk8xRkJRM3BGTERoQ1FVRTRRanRSUVVNNVFpeE5RVUZOTEZkQlFWY3NSMEZCUnl4UFFVRlBMRU5CUVVNc1YwRkJWeXhEUVVGRE8xRkJRM2hETEUxQlFVMHNRMEZCUXl4WlFVRlpMRWRCUVVjc1dVRkJXU3hEUVVGRExGZEJRVmNzUTBGQlF5eERRVUZETzFGQlJXaEVMR3RGUVVGclJUdFJRVU5zUlN4cFJrRkJhVVk3VVVGRGFrWXNhVUpCUVdsQ08xRkJRMnBDTEhGSFFVRnhSenRSUVVOeVJ5eE5RVUZOTEVOQlFVTXNZVUZCWVN4SFFVRkhMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU03VVVGRmNFTTdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3p0VlFUQkRSVHRSUVVOR0xFMUJRVTBzUTBGQlF5eGhRVUZoTEVkQlFVY3NVMEZCVXl4RFFVRkRMRWxCUVVrc1EwRkJReXgzUWtGQmQwSXNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVGRE8xRkJRM3BGTEUxQlFVMHNRMEZCUXl4bFFVRmxMRWRCUVVjc1QwRkJUeXhEUVVGRExHRkJRV0VzUTBGQlF6dFJRVU12UXl4TlFVRk5MRU5CUVVNc1pVRkJaU3hIUVVGSExGbEJRVmtzUTBGRGJrTXNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETEVOQlEzWkRMRU5CUVVNN1VVRkRSaXhKUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEZWQlFWVXNRMEZCUXl4bFFVRmxMRVZCUVVVc1RVRkJUU3hEUVVGRExFTkJRVU03U1VGRGVFUXNRMEZCUXp0SlFVVkVPenM3T3pzN096czdPenM3VDBGWlJ6dEpRVU5MTEhkQ1FVRjNRaXhEUVVNNVFpeFBRVUZyUkR0UlFVVnNSQ3hKUVVGSkxFZEJRVWNzUjBGQlJ5eEZRVUZGTEVOQlFVTTdVVUZGWWl4SlFVRkpMRTlCUVU4c1EwRkJReXhKUVVGSkxFdEJRVXNzV1VGQldTeEZRVUZGTzFsQlEycERMSGREUVVGM1F6dFpRVU40UXl4SFFVRkhMRWRCUVVjc1QwRkJUeXhEUVVGRExFZEJRVWNzUTBGQlF6dFRRVU51UWp0aFFVRk5MRWxCUVVrc1QwRkJUeXhEUVVGRExHTkJRV01zUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhGUVVGRk8xbEJRMjVFTEdsRlFVRnBSVHRaUVVOcVJTeHpSVUZCYzBVN1dVRkRkRVVzUjBGQlJ5eEhRVUZITEU5QlFVOHNRMEZCUXl4alFVRmpMRU5CUVVNc1RVRkJUVHRuUWtGRGFrTXNRMEZCUXl4RFFVRkRMRTlCUVU4c1EwRkJReXhqUVVGakxFTkJRVU1zVDBGQlR5eERRVUZETEdOQlFXTXNRMEZCUXl4TlFVRk5MRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU1zUjBGQlJ6dG5Ra0ZETDBRc1EwRkJReXhEUVVGRExFOUJRVThzUTBGQlF5eFhRVUZYTEVOQlFVTTdVMEZEZWtJN1lVRkJUVHRaUVVOTUxIVkVRVUYxUkR0WlFVTjJSQ3gzUmtGQmQwWTdXVUZEZUVZc1IwRkJSeXhIUVVGSExFOUJRVThzUTBGQlF5eFhRVUZYTEVOQlFVTTdVMEZETTBJN1VVRkRSQ3hQUVVGUExFZEJRVWNzUTBGQlF6dEpRVU5pTEVOQlFVTTdTVUZGVHl4TFFVRkxMRU5CUVVNc2RVSkJRWFZDTEVOQlEyNURMRTlCUVN0RExFVkJReTlETEU5QlFVOHNSVUZEVUN4WlFVRnZRanRSUVVWd1FqczdPenM3TzFWQlRVVTdVVUZGUml3MFFrRkJORUk3VVVGRE5VSXNhVVJCUVdsRU8xRkJSV3BFT3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096dFZRVEpFUlR0UlFVVkdMRTFCUVUwc1kwRkJZeXhIUVVGSExFOUJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTTdVVUZETVVNc1RVRkJUU3hyUWtGQmEwSXNSMEZCUnl4UFFVRlBMRU5CUVVNc1ZVRkJWU3hEUVVGRE8xRkJSVGxETEUxQlFVMHNSMEZCUnl4SFFVTlFMRTlCUVU4c1EwRkJReXhMUVVGTExFZEJRVWNzUTBGQlF5eERRVUZETzFsQlEyaENMRU5CUVVNc1EwRkJReXhOUVVGTkxFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU03V1VGRGRrTXNRMEZCUXl4RFFVRkRMRVZCUVVVc1VVRkJVU3hGUVVGRkxGTkJRVk1zUlVGQlJTeFRRVUZUTEVWQlFVVXNVMEZCVXl4RlFVRkZMRU5CUVVNN1VVRkRjRVFzVFVGQlRTeFpRVUZaTEVkQlFXbENPMWxCUTJwRExGTkJRVk1zUlVGQlJTeFRRVUZUTEVOQlFVTXNSMEZCUnl4RFFVRkRMRk5CUVZNc1EwRkJRenRaUVVOdVF5eFZRVUZWTEVWQlFVVXNUMEZCVHp0WlFVTnVRaXhsUVVGbExFVkJRVVVzVTBGQlV5eERRVUZETEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNN1dVRkRka01zWTBGQll5eEZRVUZGTEU5QlFVOHNRMEZCUXl4VFFVRlRPMWxCUTJwRExHVkJRV1VzUlVGQlJTeFRRVUZUTEVOQlFVTXNUMEZCVHl4RFFVRkRMRmRCUVZjc1EwRkJRenRaUVVNdlF5eGpRVUZqTEVWQlFVVXNTVUZCU1R0WlFVTndRaXh6UWtGQmMwSXNSVUZCUlN4dlFrRkJiMEk3V1VGRE5VTXNZVUZCWVN4RlFVRkZMRmxCUVZrN1dVRkRNMElzVTBGQlV5eEZRVUZGTEVkQlFVY3NRMEZCUXl4UlFVRlJPMWxCUTNaQ0xFMUJRVTBzUlVGQlJTeFBRVUZQTEVOQlFVTXNTMEZCU3p0WlFVTnlRaXhSUVVGUkxFVkJRVVVzVDBGQlR5eERRVUZETEU5QlFVODdXVUZEZWtJc1pVRkJaU3hGUVVGRkxHTkJRV003V1VGREwwSXNiMEpCUVc5Q0xFVkJRVVVzV1VGQldTeERRVUZETEd0Q1FVRnJRaXhEUVVGRE8xbEJRM1JFTEU5QlFVOHNSVUZCUlN4SlFVRkpMRU5CUVVNc1kwRkJZeXhEUVVGRExFOUJRVThzUTBGQlF5eGxRVUZsTEVOQlFVTXNRMEZCUXl4UFFVRlBPMWxCUXpkRUxGVkJRVlVzUlVGQlJTeEpRVUZKTEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zVjBGQlZ5eEZRVUZGTzFOQlEzUkVMRU5CUVVNN1VVRkZSaXhKUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEZWQlFWVXNRMEZCUXl4blFrRkJaMElzUlVGQlJTeFpRVUZaTEVOQlFVTXNRMEZCUXp0SlFVTXZSQ3hEUVVGRE8wbEJSVVE3TzA5QlJVYzdTVUZGU3l4TFFVRkxMRU5CUVVNc2JVSkJRVzFDTEVOQlF5OUNMRTlCUVRoRExFVkJRemxETEUxQlFXOUNPMUZCUlhCQ0xFMUJRVTBzWlVGQlpTeEhRVUZITEVsQlFVa3NRMEZCUXl4clFrRkJhMElzUTBGQlF5eFBRVUZQTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1VVRkRia1VzU1VGQlNUdFpRVU5HTEUxQlFVMHNiMEpCUVc5Q0xFZEJRVWNzWlVGQlpTeERRVUZETEc5Q1FVRnZRaXhEUVVGRE8xbEJRMnhGTEUxQlFVMHNVVUZCVVN4SFFVRkhMRTFCUVUwc2IwSkJRVzlDTEVOQlFVTXNaVUZCWlN4RlFVRkZMRU5CUVVNN1dVRkRPVVFzVFVGQlRTeFhRVUZYTEVkQlFVY3NUVUZCVFN4dlFrRkJiMElzUTBGQlF5eGpRVUZqTEVWQlFVVXNRMEZCUXp0WlFVTm9SU3hKUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEZkQlFWY3NRMEZCUXl4UlFVRlJMRVZCUVVVc1dVRkJXU3hEUVVGRExGZEJRVmNzUTBGQlF5eERRVUZETEVOQlFVTTdXVUZEYmtVc1RVRkJUU3hEUVVGRExGbEJRVmtzUjBGQlJ5eFhRVUZYTEVOQlFVTTdXVUZEYkVNc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eFZRVUZWTEVOQlFVTXNaMEpCUVdkQ0xFVkJRVVVzVFVGQlRTeERRVUZETEVOQlFVTTdVMEZEZUVRN1VVRkJReXhQUVVGUExFZEJRVWNzUlVGQlJUdFpRVU5hT3pzN096czdPMk5CVDBVN1dVRkRSaXhKUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEZGQlFWRXNRMEZEZUVJc2JVTkJRVzFETzJkQ1FVTnFReXh6UkVGQmMwUTdaMEpCUTNSRUxFZEJRVWNzUTBGQlF5eEpRVUZKTzJkQ1FVTlNMRWRCUVVjc1EwRkJReXhQUVVGUE8yZENRVU5ZTEVsQlFVazdaMEpCUTBvc1IwRkJSeXhEUVVGRExFdEJRVXNzUTBGRFdpeERRVUZETzFsQlEwWXNUVUZCVFN4RFFVRkRMRmxCUVZrc1IwRkJSeXhUUVVGVExFTkJRVU03V1VGRGFFTXNTVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJReXhWUVVGVkxFTkJRVU1zWjBKQlFXZENMRVZCUVVVc1RVRkJUU3hEUVVGRExFTkJRVU03VTBGRGVFUTdTVUZEU0N4RFFVRkRPMGxCUlVRc05FSkJRVFJDTzBsQlEzQkNMRXRCUVVzc1EwRkJReXhyUWtGQmEwSXNRMEZET1VJc1QwRkJNRU1zUlVGRE1VTXNUMEZCVHl4RlFVTlFMRmxCUVZrc1JVRkRXaXhYUVVGWE8xRkJSVmc3T3pzN096czdWVUZQUlR0UlFVVkdMRTFCUVUwc1IwRkJSeXhIUVVOUUxFOUJRVThzUTBGQlF5eExRVUZMTEVkQlFVY3NRMEZCUXl4RFFVRkRPMWxCUTJoQ0xFTkJRVU1zUTBGQlF5eE5RVUZOTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTTdXVUZEZGtNc1EwRkJReXhEUVVGRExFVkJRVVVzVVVGQlVTeEZRVUZGTEZOQlFWTXNSVUZCUlN4VFFVRlRMRVZCUVVVc1UwRkJVeXhGUVVGRkxFTkJRVU03VVVGRmNFUXNUVUZCVFN4TlFVRk5MRWRCUVVjc1JVRkJhMElzUTBGQlF6dFJRVVZzUXl4TlFVRk5MRU5CUVVNc1UwRkJVeXhIUVVGSExGTkJRVk1zUTBGQlF5eEhRVUZITEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1VVRkROVU1zVFVGQlRTeERRVUZETEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNN1VVRkROVUlzVFVGQlRTeERRVUZETEhOQ1FVRnpRaXhIUVVGSExHOUNRVUZ2UWl4RFFVRkRPMUZCUTNKRUxFMUJRVTBzUTBGQlF5eGhRVUZoTEVkQlFVY3NXVUZCV1N4RFFVRkRPMUZCUTNCRExFMUJRVTBzUTBGQlF5eFRRVUZUTEVkQlFVY3NSMEZCUnl4RFFVRkRMRkZCUVZFc1EwRkJRenRSUVVOb1F5eE5RVUZOTEVOQlFVTXNUVUZCVFN4SFFVRkhMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU03VVVGRE9VSXNUVUZCVFN4RFFVRkRMRkZCUVZFc1IwRkJSeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETzFGQlJXeERMRzFHUVVGdFJqdFJRVU51Uml4TlFVRk5MRU5CUVVNc1ZVRkJWU3hIUVVGSExFOUJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTTdVVUZGZEVNc1RVRkJUU3hSUVVGUkxFZEJRVWNzVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXp0UlFVTnVReXhOUVVGTkxFTkJRVU1zVTBGQlV5eEhRVUZITEZOQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRSUVVWMlF5eE5RVUZOTEVkQlFVY3NSMEZCUnl4UFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRE8xRkJRM2hDTEUxQlFVMHNRMEZCUXl4SFFVRkhMRWRCUVVjc1UwRkJVeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzFGQlJUVkNMRTFCUVUwc1lVRkJZU3hIUVVGSExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTTdVVUZEY2tNc1RVRkJUU3hEUVVGRExFMUJRVTBzUjBGQlJ5eFpRVUZaTEVOQlFVTXNZVUZCWVN4RFFVRkRMRU5CUVVNN1VVRkZOVU1zTUVSQlFUQkVPMUZCUXpGRUxEWkZRVUUyUlR0UlFVTTNSU3d5UlVGQk1rVTdVVUZETTBVc1JVRkJSVHRSUVVOR0xIRkNRVUZ4UWp0UlFVTnlRaXd3UWtGQk1FSTdVVUZETVVJc2MwTkJRWE5ETzFGQlEzUkRMRWxCUVVrN1VVRkRTaXcwUTBGQk5FTTdVVUZGTlVNc1RVRkJUU3hqUVVGakxFZEJRVWNzVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXp0UlFVTXhReXhOUVVGTkxFTkJRVU1zWlVGQlpTeEhRVUZITEdOQlFXTXNRMEZCUXp0UlFVVjRReXhOUVVGTkxHdENRVUZyUWl4SFFVRkhMRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU03VVVGRE9VTXNUVUZCVFN4RFFVRkRMRzlDUVVGdlFpeEhRVUZITEZsQlFWa3NRMEZCUXl4clFrRkJhMElzUTBGQlF5eERRVUZETzFGQlJTOUVMRTFCUVUwc1dVRkJXU3hIUVVGSExFbEJRVWtzU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRSUVVOcVJDeE5RVUZOTEVOQlFVTXNWVUZCVlN4SFFVRkhMRmxCUVZrc1EwRkJReXhYUVVGWExFVkJRVVVzUTBGQlF6dFJRVVV2UXl4TlFVRk5MR0ZCUVdFc1IwRkJSeXhKUVVGSkxFTkJRVU1zWTBGQll5eERRVUZETEU5QlFVOHNRMEZCUXl4bFFVRmxMRU5CUVVNc1EwRkJRenRSUVVOdVJTeE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMR0ZCUVdFc1EwRkJReXhQUVVGUExFTkJRVU03VVVGRGRrTXNUVUZCVFN4RFFVRkRMRkZCUVZFc1IwRkJSeXhoUVVGaExFTkJRVU1zVVVGQlVTeERRVUZETzFGQlJYcERMRWxCUVVrc1NVRkJTU3hEUVVGRExHbENRVUZwUWl4RFFVRkRMRmRCUVZjc1JVRkJSU3hQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVWQlFVVTdXVUZEY2tRc1NVRkJTU3hEUVVGRExHMUNRVUZ0UWl4RFFVRkRMRTlCUVU4c1JVRkJSU3hOUVVGTkxFTkJRVU1zUTBGQlF6dFRRVU16UXp0aFFVRk5PMWxCUTB3c1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eFZRVUZWTEVOQlFVTXNaMEpCUVdkQ0xFVkJRVVVzVFVGQlRTeERRVUZETEVOQlFVTTdVMEZEZUVRN1NVRkRTQ3hEUVVGRE8wbEJSVThzWTBGQll5eERRVUZETEU5QlFXOUNPMUZCUTNwRExFMUJRVTBzWVVGQllTeEhRVUZITEVWQlFVVXNRMEZCUXp0UlFVTjZRaXhKUVVGSkxGRkJRVkVzUjBGQlJ5eEZRVUZGTEVOQlFVTTdVVUZEYkVJc1NVRkJTU3hQUVVGUExFVkJRVVU3V1VGRFdDeFBRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMR05CUVdNc1EwRkJReXhGUVVGRk8yZENRVU16UWl4TlFVRk5MRVZCUVVVc1NVRkJTU3hGUVVGRkxFdEJRVXNzUlVGQlJTeEhRVUZITEdOQlFXTXNRMEZCUXp0blFrRkRka01zVFVGQlRTeFhRVUZYTEVkQlFVY3NSVUZCUlN4RFFVRkRPMmRDUVVOMlFpeFhRVUZYTEVOQlFVTXNTVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETzJkQ1FVTnlReXhYUVVGWExFTkJRVU1zU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRE8yZENRVU4wUXl4aFFVRmhMRU5CUVVNc1NVRkJTU3hEUVVGRExGZEJRVmNzUTBGQlF5eERRVUZETzJkQ1FVTm9ReXhKUVVGSkxFbEJRVWtzUTBGQlF5eFhRVUZYTEVWQlFVVXNTMEZCU3l4VlFVRlZMRVZCUVVVN2IwSkJRM0pETEZGQlFWRXNSMEZCUnl4TFFVRkxMRU5CUVVNN2FVSkJRMnhDTzFsQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN1UwRkRTanRSUVVORUxFOUJRVTg3V1VGRFRDeFBRVUZQTEVWQlFVVXNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhoUVVGaExFTkJRVU03V1VGRGRFTXNVVUZCVVN4RlFVRkZMRmxCUVZrc1EwRkJReXhSUVVGUkxFTkJRVU03VTBGRGFrTXNRMEZCUXp0SlFVTktMRU5CUVVNN1EwRkRSaUo5IiwiaW1wb3J0IHsgaW5jcmVtZW50ZWRFdmVudE9yZGluYWwgfSBmcm9tIFwiLi4vbGliL2V4dGVuc2lvbi1zZXNzaW9uLWV2ZW50LW9yZGluYWxcIjtcbmltcG9ydCB7IGV4dGVuc2lvblNlc3Npb25VdWlkIH0gZnJvbSBcIi4uL2xpYi9leHRlbnNpb24tc2Vzc2lvbi11dWlkXCI7XG5pbXBvcnQgeyBib29sVG9JbnQsIGVzY2FwZVN0cmluZywgZXNjYXBlVXJsIH0gZnJvbSBcIi4uL2xpYi9zdHJpbmctdXRpbHNcIjtcbmV4cG9ydCBjbGFzcyBKYXZhc2NyaXB0SW5zdHJ1bWVudCB7XG4gICAgY29uc3RydWN0b3IoZGF0YVJlY2VpdmVyKSB7XG4gICAgICAgIHRoaXMuY29uZmlndXJlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBlbmRpbmdSZWNvcmRzID0gW107XG4gICAgICAgIHRoaXMuZGF0YVJlY2VpdmVyID0gZGF0YVJlY2VpdmVyO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyByZWNlaXZlZCBjYWxsIGFuZCB2YWx1ZXMgZGF0YSBmcm9tIHRoZSBKUyBJbnN0cnVtZW50YXRpb25cbiAgICAgKiBpbnRvIHRoZSBmb3JtYXQgdGhhdCB0aGUgc2NoZW1hIGV4cGVjdHMuXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcGFyYW0gc2VuZGVyXG4gICAgICovXG4gICAgc3RhdGljIHByb2Nlc3NDYWxsc0FuZFZhbHVlcyhkYXRhLCBzZW5kZXIpIHtcbiAgICAgICAgY29uc3QgdXBkYXRlID0ge307XG4gICAgICAgIHVwZGF0ZS5leHRlbnNpb25fc2Vzc2lvbl91dWlkID0gZXh0ZW5zaW9uU2Vzc2lvblV1aWQ7XG4gICAgICAgIHVwZGF0ZS5ldmVudF9vcmRpbmFsID0gaW5jcmVtZW50ZWRFdmVudE9yZGluYWwoKTtcbiAgICAgICAgdXBkYXRlLnBhZ2Vfc2NvcGVkX2V2ZW50X29yZGluYWwgPSBkYXRhLm9yZGluYWw7XG4gICAgICAgIHVwZGF0ZS53aW5kb3dfaWQgPSBzZW5kZXIudGFiLndpbmRvd0lkO1xuICAgICAgICB1cGRhdGUudGFiX2lkID0gc2VuZGVyLnRhYi5pZDtcbiAgICAgICAgdXBkYXRlLmZyYW1lX2lkID0gc2VuZGVyLmZyYW1lSWQ7XG4gICAgICAgIHVwZGF0ZS5zY3JpcHRfdXJsID0gZXNjYXBlVXJsKGRhdGEuc2NyaXB0VXJsKTtcbiAgICAgICAgdXBkYXRlLnNjcmlwdF9saW5lID0gZXNjYXBlU3RyaW5nKGRhdGEuc2NyaXB0TGluZSk7XG4gICAgICAgIHVwZGF0ZS5zY3JpcHRfY29sID0gZXNjYXBlU3RyaW5nKGRhdGEuc2NyaXB0Q29sKTtcbiAgICAgICAgdXBkYXRlLmZ1bmNfbmFtZSA9IGVzY2FwZVN0cmluZyhkYXRhLmZ1bmNOYW1lKTtcbiAgICAgICAgdXBkYXRlLnNjcmlwdF9sb2NfZXZhbCA9IGVzY2FwZVN0cmluZyhkYXRhLnNjcmlwdExvY0V2YWwpO1xuICAgICAgICB1cGRhdGUuY2FsbF9zdGFjayA9IGVzY2FwZVN0cmluZyhkYXRhLmNhbGxTdGFjayk7XG4gICAgICAgIHVwZGF0ZS5zeW1ib2wgPSBlc2NhcGVTdHJpbmcoZGF0YS5zeW1ib2wpO1xuICAgICAgICB1cGRhdGUub3BlcmF0aW9uID0gZXNjYXBlU3RyaW5nKGRhdGEub3BlcmF0aW9uKTtcbiAgICAgICAgdXBkYXRlLnZhbHVlID0gZXNjYXBlU3RyaW5nKGRhdGEudmFsdWUpO1xuICAgICAgICB1cGRhdGUudGltZV9zdGFtcCA9IGRhdGEudGltZVN0YW1wO1xuICAgICAgICB1cGRhdGUuaW5jb2duaXRvID0gYm9vbFRvSW50KHNlbmRlci50YWIuaW5jb2duaXRvKTtcbiAgICAgICAgLy8gZG9jdW1lbnRfdXJsIGlzIHRoZSBjdXJyZW50IGZyYW1lJ3MgZG9jdW1lbnQgaHJlZlxuICAgICAgICAvLyB0b3BfbGV2ZWxfdXJsIGlzIHRoZSB0b3AtbGV2ZWwgZnJhbWUncyBkb2N1bWVudCBocmVmXG4gICAgICAgIHVwZGF0ZS5kb2N1bWVudF91cmwgPSBlc2NhcGVVcmwoc2VuZGVyLnVybCk7XG4gICAgICAgIHVwZGF0ZS50b3BfbGV2ZWxfdXJsID0gZXNjYXBlVXJsKHNlbmRlci50YWIudXJsKTtcbiAgICAgICAgaWYgKGRhdGEub3BlcmF0aW9uID09PSBcImNhbGxcIiAmJiBkYXRhLmFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdXBkYXRlLmFyZ3VtZW50cyA9IGVzY2FwZVN0cmluZyhKU09OLnN0cmluZ2lmeShkYXRhLmFyZ3MpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXBkYXRlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTdGFydCBsaXN0ZW5pbmcgZm9yIG1lc3NhZ2VzIGZyb20gcGFnZS9jb250ZW50L2JhY2tncm91bmQgc2NyaXB0cyBpbmplY3RlZCB0byBpbnN0cnVtZW50IEphdmFTY3JpcHQgQVBJc1xuICAgICAqL1xuICAgIGxpc3RlbigpIHtcbiAgICAgICAgdGhpcy5vbk1lc3NhZ2VMaXN0ZW5lciA9IChtZXNzYWdlLCBzZW5kZXIpID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUuZGVidWcoXCJqYXZhc2NyaXB0LWluc3RydW1lbnRhdGlvbiBiYWNrZ3JvdW5kIGxpc3RlbmVyXCIsIHttZXNzYWdlLCBzZW5kZXJ9LCB0aGlzLmNvbmZpZ3VyZWQpO1xuICAgICAgICAgICAgaWYgKG1lc3NhZ2UubmFtZXNwYWNlICYmXG4gICAgICAgICAgICAgICAgbWVzc2FnZS5uYW1lc3BhY2UgPT09IFwiamF2YXNjcmlwdC1pbnN0cnVtZW50YXRpb25cIikge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlSnNJbnN0cnVtZW50YXRpb25NZXNzYWdlKG1lc3NhZ2UsIHNlbmRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIodGhpcy5vbk1lc3NhZ2VMaXN0ZW5lcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEVpdGhlciBzZW5kcyB0aGUgbG9nIGRhdGEgdG8gdGhlIGRhdGFSZWNlaXZlciBvciBzdG9yZSBpdCBpbiBtZW1vcnlcbiAgICAgKiBhcyBhIHBlbmRpbmcgcmVjb3JkIGlmIHRoZSBKUyBpbnN0cnVtZW50YXRpb24gaXMgbm90IHlldCBjb25maWd1cmVkXG4gICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0gc2VuZGVyXG4gICAgICovXG4gICAgaGFuZGxlSnNJbnN0cnVtZW50YXRpb25NZXNzYWdlKG1lc3NhZ2UsIHNlbmRlcikge1xuICAgICAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcImxvZ0NhbGxcIjpcbiAgICAgICAgICAgIGNhc2UgXCJsb2dWYWx1ZVwiOlxuICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZSA9IEphdmFzY3JpcHRJbnN0cnVtZW50LnByb2Nlc3NDYWxsc0FuZFZhbHVlcyhtZXNzYWdlLmRhdGEsIHNlbmRlcik7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlndXJlZCkge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGUuYnJvd3Nlcl9pZCA9IHRoaXMuY3Jhd2xJRDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhUmVjZWl2ZXIuc2F2ZVJlY29yZChcImphdmFzY3JpcHRcIiwgdXBkYXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGVuZGluZ1JlY29yZHMucHVzaCh1cGRhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTdGFydHMgbGlzdGVuaW5nIGlmIGhhdmVuJ3QgZG9uZSBzbyBhbHJlYWR5LCBzZXRzIHRoZSBjcmF3bCBJRCxcbiAgICAgKiBtYXJrcyB0aGUgSlMgaW5zdHJ1bWVudGF0aW9uIGFzIGNvbmZpZ3VyZWQgYW5kIHNlbmRzIGFueSBwZW5kaW5nXG4gICAgICogcmVjb3JkcyB0aGF0IGhhdmUgYmVlbiByZWNlaXZlZCB1cCB1bnRpbCB0aGlzIHBvaW50LlxuICAgICAqIEBwYXJhbSBjcmF3bElEXG4gICAgICovXG4gICAgcnVuKGNyYXdsSUQpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9uTWVzc2FnZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3Jhd2xJRCA9IGNyYXdsSUQ7XG4gICAgICAgIHRoaXMuY29uZmlndXJlZCA9IHRydWU7XG4gICAgICAgIHRoaXMucGVuZGluZ1JlY29yZHMubWFwKHVwZGF0ZSA9PiB7XG4gICAgICAgICAgICB1cGRhdGUuYnJvd3Nlcl9pZCA9IHRoaXMuY3Jhd2xJRDtcbiAgICAgICAgICAgIHRoaXMuZGF0YVJlY2VpdmVyLnNhdmVSZWNvcmQoXCJqYXZhc2NyaXB0XCIsIHVwZGF0ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhc3luYyByZWdpc3RlckNvbnRlbnRTY3JpcHQodGVzdGluZywganNJbnN0cnVtZW50YXRpb25TZXR0aW5nc1N0cmluZykge1xuICAgICAgICBjb25zdCBjb250ZW50U2NyaXB0Q29uZmlnID0ge1xuICAgICAgICAgICAgdGVzdGluZyxcbiAgICAgICAgICAgIGpzSW5zdHJ1bWVudGF0aW9uU2V0dGluZ3NTdHJpbmcsXG4gICAgICAgIH07XG4gICAgICAgIGlmIChjb250ZW50U2NyaXB0Q29uZmlnKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBBdm9pZCB1c2luZyB3aW5kb3cgdG8gcGFzcyB0aGUgY29udGVudCBzY3JpcHQgY29uZmlnXG4gICAgICAgICAgICBhd2FpdCBicm93c2VyLmNvbnRlbnRTY3JpcHRzLnJlZ2lzdGVyKHtcbiAgICAgICAgICAgICAgICBqczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBgd2luZG93Lm9wZW5XcG1Db250ZW50U2NyaXB0Q29uZmlnID0gJHtKU09OLnN0cmluZ2lmeShjb250ZW50U2NyaXB0Q29uZmlnKX07YCxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIG1hdGNoZXM6IFtcIjxhbGxfdXJscz5cIl0sXG4gICAgICAgICAgICAgICAgYWxsRnJhbWVzOiB0cnVlLFxuICAgICAgICAgICAgICAgIHJ1bkF0OiBcImRvY3VtZW50X3N0YXJ0XCIsXG4gICAgICAgICAgICAgICAgbWF0Y2hBYm91dEJsYW5rOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJyb3dzZXIuY29udGVudFNjcmlwdHMucmVnaXN0ZXIoe1xuICAgICAgICAgICAganM6IFt7IGZpbGU6IFwiL2NvbnRlbnQuanNcIiB9XSxcbiAgICAgICAgICAgIG1hdGNoZXM6IFtcIjxhbGxfdXJscz5cIl0sXG4gICAgICAgICAgICBhbGxGcmFtZXM6IHRydWUsXG4gICAgICAgICAgICBydW5BdDogXCJkb2N1bWVudF9zdGFydFwiLFxuICAgICAgICAgICAgbWF0Y2hBYm91dEJsYW5rOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgY2xlYW51cCgpIHtcbiAgICAgICAgdGhpcy5wZW5kaW5nUmVjb3JkcyA9IFtdO1xuICAgICAgICBpZiAodGhpcy5vbk1lc3NhZ2VMaXN0ZW5lcikge1xuICAgICAgICAgICAgYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcih0aGlzLm9uTWVzc2FnZUxpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWFtRjJZWE5qY21sd2RDMXBibk4wY25WdFpXNTBMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUxpNHZMaTR2TGk0dmMzSmpMMkpoWTJ0bmNtOTFibVF2YW1GMllYTmpjbWx3ZEMxcGJuTjBjblZ0Wlc1MExuUnpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVU5CTEU5QlFVOHNSVUZCUlN4MVFrRkJkVUlzUlVGQlJTeE5RVUZOTEhkRFFVRjNReXhEUVVGRE8wRkJRMnBHTEU5QlFVOHNSVUZCUlN4dlFrRkJiMElzUlVGQlJTeE5RVUZOTEN0Q1FVRXJRaXhEUVVGRE8wRkJRM0pGTEU5QlFVOHNSVUZCUlN4VFFVRlRMRVZCUVVVc1dVRkJXU3hGUVVGRkxGTkJRVk1zUlVGQlJTeE5RVUZOTEhGQ1FVRnhRaXhEUVVGRE8wRkJSM3BGTEUxQlFVMHNUMEZCVHl4dlFrRkJiMEk3U1VFMFF5OUNMRmxCUVZrc1dVRkJXVHRSUVVwb1FpeGxRVUZWTEVkQlFWa3NTMEZCU3l4RFFVRkRPMUZCUXpWQ0xHMUNRVUZqTEVkQlFUQkNMRVZCUVVVc1EwRkJRenRSUVVscVJDeEpRVUZKTEVOQlFVTXNXVUZCV1N4SFFVRkhMRmxCUVZrc1EwRkJRenRKUVVOdVF5eERRVUZETzBsQk4wTkVPenM3T3p0UFFVdEhPMGxCUTBzc1RVRkJUU3hEUVVGRExIRkNRVUZ4UWl4RFFVRkRMRWxCUVVrc1JVRkJSU3hOUVVGeFFqdFJRVU01UkN4TlFVRk5MRTFCUVUwc1IwRkJSeXhGUVVGNVFpeERRVUZETzFGQlEzcERMRTFCUVUwc1EwRkJReXh6UWtGQmMwSXNSMEZCUnl4dlFrRkJiMElzUTBGQlF6dFJRVU55UkN4TlFVRk5MRU5CUVVNc1lVRkJZU3hIUVVGSExIVkNRVUYxUWl4RlFVRkZMRU5CUVVNN1VVRkRha1FzVFVGQlRTeERRVUZETEhsQ1FVRjVRaXhIUVVGSExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTTdVVUZEYUVRc1RVRkJUU3hEUVVGRExGTkJRVk1zUjBGQlJ5eE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRMRkZCUVZFc1EwRkJRenRSUVVOMlF5eE5RVUZOTEVOQlFVTXNUVUZCVFN4SFFVRkhMRTFCUVUwc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETzFGQlF6bENMRTFCUVUwc1EwRkJReXhSUVVGUkxFZEJRVWNzVFVGQlRTeERRVUZETEU5QlFVOHNRMEZCUXp0UlFVTnFReXhOUVVGTkxFTkJRVU1zVlVGQlZTeEhRVUZITEZOQlFWTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03VVVGRE9VTXNUVUZCVFN4RFFVRkRMRmRCUVZjc1IwRkJSeXhaUVVGWkxFTkJRVU1zU1VGQlNTeERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPMUZCUTI1RUxFMUJRVTBzUTBGQlF5eFZRVUZWTEVkQlFVY3NXVUZCV1N4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dFJRVU5xUkN4TlFVRk5MRU5CUVVNc1UwRkJVeXhIUVVGSExGbEJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1VVRkRMME1zVFVGQlRTeERRVUZETEdWQlFXVXNSMEZCUnl4WlFVRlpMRU5CUVVNc1NVRkJTU3hEUVVGRExHRkJRV0VzUTBGQlF5eERRVUZETzFGQlF6RkVMRTFCUVUwc1EwRkJReXhWUVVGVkxFZEJRVWNzV1VGQldTeERRVUZETEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRSUVVOcVJDeE5RVUZOTEVOQlFVTXNUVUZCVFN4SFFVRkhMRmxCUVZrc1EwRkJReXhKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdVVUZETVVNc1RVRkJUU3hEUVVGRExGTkJRVk1zUjBGQlJ5eFpRVUZaTEVOQlFVTXNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8xRkJRMmhFTEUxQlFVMHNRMEZCUXl4TFFVRkxMRWRCUVVjc1dVRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0UlFVTjRReXhOUVVGTkxFTkJRVU1zVlVGQlZTeEhRVUZITEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNN1VVRkRia01zVFVGQlRTeERRVUZETEZOQlFWTXNSMEZCUnl4VFFVRlRMRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0UlFVVnVSQ3h2UkVGQmIwUTdVVUZEY0VRc2RVUkJRWFZFTzFGQlEzWkVMRTFCUVUwc1EwRkJReXhaUVVGWkxFZEJRVWNzVTBGQlV5eERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJRenRSUVVNMVF5eE5RVUZOTEVOQlFVTXNZVUZCWVN4SFFVRkhMRk5CUVZNc1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPMUZCUldwRUxFbEJRVWtzU1VGQlNTeERRVUZETEZOQlFWTXNTMEZCU3l4TlFVRk5MRWxCUVVrc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RlFVRkZPMWxCUTNKRUxFMUJRVTBzUTBGQlF5eFRRVUZUTEVkQlFVY3NXVUZCV1N4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNN1UwRkROVVE3VVVGRlJDeFBRVUZQTEUxQlFVMHNRMEZCUXp0SlFVTm9RaXhEUVVGRE8wbEJWMFE3TzA5QlJVYzdTVUZEU1N4TlFVRk5PMUZCUTFnc1NVRkJTU3hEUVVGRExHbENRVUZwUWl4SFFVRkhMRU5CUVVNc1QwRkJUeXhGUVVGRkxFMUJRVTBzUlVGQlJTeEZRVUZGTzFsQlF6TkRMSFZIUVVGMVJ6dFpRVU4yUnl4SlFVTkZMRTlCUVU4c1EwRkJReXhUUVVGVE8yZENRVU5xUWl4UFFVRlBMRU5CUVVNc1UwRkJVeXhMUVVGTExEUkNRVUUwUWl4RlFVTnNSRHRuUWtGRFFTeEpRVUZKTEVOQlFVTXNPRUpCUVRoQ0xFTkJRVU1zVDBGQlR5eEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVRkRPMkZCUTNSRU8xRkJRMGdzUTBGQlF5eERRVUZETzFGQlEwWXNUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zVjBGQlZ5eERRVUZETEVsQlFVa3NRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eERRVUZETzBsQlEyaEZMRU5CUVVNN1NVRkZSRHM3T3pzN1QwRkxSenRKUVVOSkxEaENRVUU0UWl4RFFVRkRMRTlCUVU4c1JVRkJSU3hOUVVGeFFqdFJRVU5zUlN4UlFVRlJMRTlCUVU4c1EwRkJReXhKUVVGSkxFVkJRVVU3V1VGRGNFSXNTMEZCU3l4VFFVRlRMRU5CUVVNN1dVRkRaaXhMUVVGTExGVkJRVlU3WjBKQlEySXNUVUZCVFN4TlFVRk5MRWRCUVVjc2IwSkJRVzlDTEVOQlFVTXNjVUpCUVhGQ0xFTkJRM1pFTEU5QlFVOHNRMEZCUXl4SlFVRkpMRVZCUTFvc1RVRkJUU3hEUVVOUUxFTkJRVU03WjBKQlEwWXNTVUZCU1N4SlFVRkpMRU5CUVVNc1ZVRkJWU3hGUVVGRk8yOUNRVU51UWl4TlFVRk5MRU5CUVVNc1ZVRkJWU3hIUVVGSExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTTdiMEpCUTJwRExFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNWVUZCVlN4RFFVRkRMRmxCUVZrc1JVRkJSU3hOUVVGTkxFTkJRVU1zUTBGQlF6dHBRa0ZEY0VRN2NVSkJRVTA3YjBKQlEwd3NTVUZCU1N4RFFVRkRMR05CUVdNc1EwRkJReXhKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdhVUpCUTJ4RE8yZENRVU5FTEUxQlFVMDdVMEZEVkR0SlFVTklMRU5CUVVNN1NVRkZSRHM3T3pzN1QwRkxSenRKUVVOSkxFZEJRVWNzUTBGQlF5eFBRVUZQTzFGQlEyaENMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zYVVKQlFXbENMRVZCUVVVN1dVRkRNMElzU1VGQlNTeERRVUZETEUxQlFVMHNSVUZCUlN4RFFVRkRPMU5CUTJZN1VVRkRSQ3hKUVVGSkxFTkJRVU1zVDBGQlR5eEhRVUZITEU5QlFVOHNRMEZCUXp0UlFVTjJRaXhKUVVGSkxFTkJRVU1zVlVGQlZTeEhRVUZITEVsQlFVa3NRMEZCUXp0UlFVTjJRaXhKUVVGSkxFTkJRVU1zWTBGQll5eERRVUZETEVkQlFVY3NRMEZCUXl4TlFVRk5MRU5CUVVNc1JVRkJSVHRaUVVNdlFpeE5RVUZOTEVOQlFVTXNWVUZCVlN4SFFVRkhMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU03V1VGRGFrTXNTVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJReXhWUVVGVkxFTkJRVU1zV1VGQldTeEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVRkRPMUZCUTNKRUxFTkJRVU1zUTBGQlF5eERRVUZETzBsQlEwd3NRMEZCUXp0SlFVVk5MRXRCUVVzc1EwRkJReXh4UWtGQmNVSXNRMEZEYUVNc1QwRkJaMElzUlVGRGFFSXNLMEpCUVhWRE8xRkJSWFpETEUxQlFVMHNiVUpCUVcxQ0xFZEJRVWM3V1VGRE1VSXNUMEZCVHp0WlFVTlFMQ3RDUVVFclFqdFRRVU5vUXl4RFFVRkRPMUZCUTBZc1NVRkJTU3h0UWtGQmJVSXNSVUZCUlR0WlFVTjJRaXcyUkVGQk5rUTdXVUZETjBRc1RVRkJUU3hQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETEZGQlFWRXNRMEZCUXp0blFrRkRjRU1zUlVGQlJTeEZRVUZGTzI5Q1FVTkdPM2RDUVVORkxFbEJRVWtzUlVGQlJTeDFRMEZCZFVNc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGRGVrUXNiVUpCUVcxQ0xFTkJRM0JDTEVkQlFVYzdjVUpCUTB3N2FVSkJRMFk3WjBKQlEwUXNUMEZCVHl4RlFVRkZMRU5CUVVNc1dVRkJXU3hEUVVGRE8yZENRVU4yUWl4VFFVRlRMRVZCUVVVc1NVRkJTVHRuUWtGRFppeExRVUZMTEVWQlFVVXNaMEpCUVdkQ08yZENRVU4yUWl4bFFVRmxMRVZCUVVVc1NVRkJTVHRoUVVOMFFpeERRVUZETEVOQlFVTTdVMEZEU2p0UlFVTkVMRTlCUVU4c1QwRkJUeXhEUVVGRExHTkJRV01zUTBGQlF5eFJRVUZSTEVOQlFVTTdXVUZEY2tNc1JVRkJSU3hGUVVGRkxFTkJRVU1zUlVGQlJTeEpRVUZKTEVWQlFVVXNZVUZCWVN4RlFVRkZMRU5CUVVNN1dVRkROMElzVDBGQlR5eEZRVUZGTEVOQlFVTXNXVUZCV1N4RFFVRkRPMWxCUTNaQ0xGTkJRVk1zUlVGQlJTeEpRVUZKTzFsQlEyWXNTMEZCU3l4RlFVRkZMR2RDUVVGblFqdFpRVU4yUWl4bFFVRmxMRVZCUVVVc1NVRkJTVHRUUVVOMFFpeERRVUZETEVOQlFVTTdTVUZEVEN4RFFVRkRPMGxCUlUwc1QwRkJUenRSUVVOYUxFbEJRVWtzUTBGQlF5eGpRVUZqTEVkQlFVY3NSVUZCUlN4RFFVRkRPMUZCUTNwQ0xFbEJRVWtzU1VGQlNTeERRVUZETEdsQ1FVRnBRaXhGUVVGRk8xbEJRekZDTEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRExHTkJRV01zUTBGQlF5eEpRVUZKTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zUTBGQlF6dFRRVU5zUlR0SlFVTklMRU5CUVVNN1EwRkRSaUo5IiwiaW1wb3J0IHsgaW5jcmVtZW50ZWRFdmVudE9yZGluYWwgfSBmcm9tIFwiLi4vbGliL2V4dGVuc2lvbi1zZXNzaW9uLWV2ZW50LW9yZGluYWxcIjtcbmltcG9ydCB7IGV4dGVuc2lvblNlc3Npb25VdWlkIH0gZnJvbSBcIi4uL2xpYi9leHRlbnNpb24tc2Vzc2lvbi11dWlkXCI7XG5pbXBvcnQgeyBQZW5kaW5nTmF2aWdhdGlvbiB9IGZyb20gXCIuLi9saWIvcGVuZGluZy1uYXZpZ2F0aW9uXCI7XG5pbXBvcnQgeyBib29sVG9JbnQsIGVzY2FwZVN0cmluZywgZXNjYXBlVXJsIH0gZnJvbSBcIi4uL2xpYi9zdHJpbmctdXRpbHNcIjtcbmltcG9ydCB7IG1ha2VVVUlEIH0gZnJvbSBcIi4uL2xpYi91dWlkXCI7XG5leHBvcnQgY29uc3QgdHJhbnNmb3JtV2ViTmF2aWdhdGlvbkJhc2VFdmVudERldGFpbHNUb09wZW5XUE1TY2hlbWEgPSBhc3luYyAoY3Jhd2xJRCwgZGV0YWlscykgPT4ge1xuICAgIGNvbnN0IHRhYiA9IGRldGFpbHMudGFiSWQgPiAtMVxuICAgICAgICA/IGF3YWl0IGJyb3dzZXIudGFicy5nZXQoZGV0YWlscy50YWJJZClcbiAgICAgICAgOiB7XG4gICAgICAgICAgICB3aW5kb3dJZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgaW5jb2duaXRvOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBjb29raWVTdG9yZUlkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBvcGVuZXJUYWJJZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgd2lkdGg6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGhlaWdodDogdW5kZWZpbmVkLFxuICAgICAgICB9O1xuICAgIGNvbnN0IHdpbmRvdyA9IHRhYi53aW5kb3dJZFxuICAgICAgICA/IGF3YWl0IGJyb3dzZXIud2luZG93cy5nZXQodGFiLndpbmRvd0lkKVxuICAgICAgICA6IHsgd2lkdGg6IHVuZGVmaW5lZCwgaGVpZ2h0OiB1bmRlZmluZWQsIHR5cGU6IHVuZGVmaW5lZCB9O1xuICAgIGNvbnN0IG5hdmlnYXRpb24gPSB7XG4gICAgICAgIGJyb3dzZXJfaWQ6IGNyYXdsSUQsXG4gICAgICAgIGluY29nbml0bzogYm9vbFRvSW50KHRhYi5pbmNvZ25pdG8pLFxuICAgICAgICBleHRlbnNpb25fc2Vzc2lvbl91dWlkOiBleHRlbnNpb25TZXNzaW9uVXVpZCxcbiAgICAgICAgcHJvY2Vzc19pZDogZGV0YWlscy5wcm9jZXNzSWQsXG4gICAgICAgIHdpbmRvd19pZDogdGFiLndpbmRvd0lkLFxuICAgICAgICB0YWJfaWQ6IGRldGFpbHMudGFiSWQsXG4gICAgICAgIHRhYl9vcGVuZXJfdGFiX2lkOiB0YWIub3BlbmVyVGFiSWQsXG4gICAgICAgIGZyYW1lX2lkOiBkZXRhaWxzLmZyYW1lSWQsXG4gICAgICAgIHdpbmRvd193aWR0aDogd2luZG93LndpZHRoLFxuICAgICAgICB3aW5kb3dfaGVpZ2h0OiB3aW5kb3cuaGVpZ2h0LFxuICAgICAgICB3aW5kb3dfdHlwZTogd2luZG93LnR5cGUsXG4gICAgICAgIHRhYl93aWR0aDogdGFiLndpZHRoLFxuICAgICAgICB0YWJfaGVpZ2h0OiB0YWIuaGVpZ2h0LFxuICAgICAgICB0YWJfY29va2llX3N0b3JlX2lkOiBlc2NhcGVTdHJpbmcodGFiLmNvb2tpZVN0b3JlSWQpLFxuICAgICAgICB1dWlkOiBtYWtlVVVJRCgpLFxuICAgICAgICB1cmw6IGVzY2FwZVVybChkZXRhaWxzLnVybCksXG4gICAgfTtcbiAgICByZXR1cm4gbmF2aWdhdGlvbjtcbn07XG5leHBvcnQgY2xhc3MgTmF2aWdhdGlvbkluc3RydW1lbnQge1xuICAgIGNvbnN0cnVjdG9yKGRhdGFSZWNlaXZlcikge1xuICAgICAgICB0aGlzLnBlbmRpbmdOYXZpZ2F0aW9ucyA9IHt9O1xuICAgICAgICB0aGlzLmRhdGFSZWNlaXZlciA9IGRhdGFSZWNlaXZlcjtcbiAgICB9XG4gICAgc3RhdGljIG5hdmlnYXRpb25JZChwcm9jZXNzSWQsIHRhYklkLCBmcmFtZUlkKSB7XG4gICAgICAgIHJldHVybiBgJHtwcm9jZXNzSWR9LSR7dGFiSWR9LSR7ZnJhbWVJZH1gO1xuICAgIH1cbiAgICBydW4oY3Jhd2xJRCkge1xuICAgICAgICB0aGlzLm9uQmVmb3JlTmF2aWdhdGVMaXN0ZW5lciA9IGFzeW5jIChkZXRhaWxzKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuYXZpZ2F0aW9uSWQgPSBOYXZpZ2F0aW9uSW5zdHJ1bWVudC5uYXZpZ2F0aW9uSWQoZGV0YWlscy5wcm9jZXNzSWQsIGRldGFpbHMudGFiSWQsIGRldGFpbHMuZnJhbWVJZCk7XG4gICAgICAgICAgICBjb25zdCBwZW5kaW5nTmF2aWdhdGlvbiA9IHRoaXMuaW5zdGFudGlhdGVQZW5kaW5nTmF2aWdhdGlvbihuYXZpZ2F0aW9uSWQpO1xuICAgICAgICAgICAgY29uc3QgbmF2aWdhdGlvbiA9IGF3YWl0IHRyYW5zZm9ybVdlYk5hdmlnYXRpb25CYXNlRXZlbnREZXRhaWxzVG9PcGVuV1BNU2NoZW1hKGNyYXdsSUQsIGRldGFpbHMpO1xuICAgICAgICAgICAgbmF2aWdhdGlvbi5wYXJlbnRfZnJhbWVfaWQgPSBkZXRhaWxzLnBhcmVudEZyYW1lSWQ7XG4gICAgICAgICAgICBuYXZpZ2F0aW9uLmJlZm9yZV9uYXZpZ2F0ZV9ldmVudF9vcmRpbmFsID0gaW5jcmVtZW50ZWRFdmVudE9yZGluYWwoKTtcbiAgICAgICAgICAgIG5hdmlnYXRpb24uYmVmb3JlX25hdmlnYXRlX3RpbWVfc3RhbXAgPSBuZXcgRGF0ZShkZXRhaWxzLnRpbWVTdGFtcCkudG9JU09TdHJpbmcoKTtcbiAgICAgICAgICAgIHBlbmRpbmdOYXZpZ2F0aW9uLnJlc29sdmVPbkJlZm9yZU5hdmlnYXRlRXZlbnROYXZpZ2F0aW9uKG5hdmlnYXRpb24pO1xuICAgICAgICB9O1xuICAgICAgICBicm93c2VyLndlYk5hdmlnYXRpb24ub25CZWZvcmVOYXZpZ2F0ZS5hZGRMaXN0ZW5lcih0aGlzLm9uQmVmb3JlTmF2aWdhdGVMaXN0ZW5lcik7XG4gICAgICAgIHRoaXMub25Db21taXR0ZWRMaXN0ZW5lciA9IGFzeW5jIChkZXRhaWxzKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuYXZpZ2F0aW9uSWQgPSBOYXZpZ2F0aW9uSW5zdHJ1bWVudC5uYXZpZ2F0aW9uSWQoZGV0YWlscy5wcm9jZXNzSWQsIGRldGFpbHMudGFiSWQsIGRldGFpbHMuZnJhbWVJZCk7XG4gICAgICAgICAgICBjb25zdCBuYXZpZ2F0aW9uID0gYXdhaXQgdHJhbnNmb3JtV2ViTmF2aWdhdGlvbkJhc2VFdmVudERldGFpbHNUb09wZW5XUE1TY2hlbWEoY3Jhd2xJRCwgZGV0YWlscyk7XG4gICAgICAgICAgICBuYXZpZ2F0aW9uLnRyYW5zaXRpb25fcXVhbGlmaWVycyA9IGVzY2FwZVN0cmluZyhKU09OLnN0cmluZ2lmeShkZXRhaWxzLnRyYW5zaXRpb25RdWFsaWZpZXJzKSk7XG4gICAgICAgICAgICBuYXZpZ2F0aW9uLnRyYW5zaXRpb25fdHlwZSA9IGVzY2FwZVN0cmluZyhkZXRhaWxzLnRyYW5zaXRpb25UeXBlKTtcbiAgICAgICAgICAgIG5hdmlnYXRpb24uY29tbWl0dGVkX2V2ZW50X29yZGluYWwgPSBpbmNyZW1lbnRlZEV2ZW50T3JkaW5hbCgpO1xuICAgICAgICAgICAgbmF2aWdhdGlvbi5jb21taXR0ZWRfdGltZV9zdGFtcCA9IG5ldyBEYXRlKGRldGFpbHMudGltZVN0YW1wKS50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgLy8gaW5jbHVkZSBhdHRyaWJ1dGVzIGZyb20gdGhlIGNvcnJlc3BvbmRpbmcgb25CZWZvcmVOYXZpZ2F0aW9uIGV2ZW50XG4gICAgICAgICAgICBjb25zdCBwZW5kaW5nTmF2aWdhdGlvbiA9IHRoaXMuZ2V0UGVuZGluZ05hdmlnYXRpb24obmF2aWdhdGlvbklkKTtcbiAgICAgICAgICAgIGlmIChwZW5kaW5nTmF2aWdhdGlvbikge1xuICAgICAgICAgICAgICAgIHBlbmRpbmdOYXZpZ2F0aW9uLnJlc29sdmVPbkNvbW1pdHRlZEV2ZW50TmF2aWdhdGlvbihuYXZpZ2F0aW9uKTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNvbHZlZCA9IGF3YWl0IHBlbmRpbmdOYXZpZ2F0aW9uLnJlc29sdmVkV2l0aGluVGltZW91dCgxMDAwKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzb2x2ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb25CZWZvcmVOYXZpZ2F0ZUV2ZW50TmF2aWdhdGlvbiA9IGF3YWl0IHBlbmRpbmdOYXZpZ2F0aW9uLm9uQmVmb3JlTmF2aWdhdGVFdmVudE5hdmlnYXRpb247XG4gICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb24ucGFyZW50X2ZyYW1lX2lkID1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQmVmb3JlTmF2aWdhdGVFdmVudE5hdmlnYXRpb24ucGFyZW50X2ZyYW1lX2lkO1xuICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uLmJlZm9yZV9uYXZpZ2F0ZV9ldmVudF9vcmRpbmFsID1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQmVmb3JlTmF2aWdhdGVFdmVudE5hdmlnYXRpb24uYmVmb3JlX25hdmlnYXRlX2V2ZW50X29yZGluYWw7XG4gICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb24uYmVmb3JlX25hdmlnYXRlX3RpbWVfc3RhbXAgPVxuICAgICAgICAgICAgICAgICAgICAgICAgb25CZWZvcmVOYXZpZ2F0ZUV2ZW50TmF2aWdhdGlvbi5iZWZvcmVfbmF2aWdhdGVfdGltZV9zdGFtcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRhdGFSZWNlaXZlci5zYXZlUmVjb3JkKFwibmF2aWdhdGlvbnNcIiwgbmF2aWdhdGlvbik7XG4gICAgICAgIH07XG4gICAgICAgIGJyb3dzZXIud2ViTmF2aWdhdGlvbi5vbkNvbW1pdHRlZC5hZGRMaXN0ZW5lcih0aGlzLm9uQ29tbWl0dGVkTGlzdGVuZXIpO1xuICAgIH1cbiAgICBjbGVhbnVwKCkge1xuICAgICAgICBpZiAodGhpcy5vbkJlZm9yZU5hdmlnYXRlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGJyb3dzZXIud2ViTmF2aWdhdGlvbi5vbkJlZm9yZU5hdmlnYXRlLnJlbW92ZUxpc3RlbmVyKHRoaXMub25CZWZvcmVOYXZpZ2F0ZUxpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vbkNvbW1pdHRlZExpc3RlbmVyKSB7XG4gICAgICAgICAgICBicm93c2VyLndlYk5hdmlnYXRpb24ub25Db21taXR0ZWQucmVtb3ZlTGlzdGVuZXIodGhpcy5vbkNvbW1pdHRlZExpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpbnN0YW50aWF0ZVBlbmRpbmdOYXZpZ2F0aW9uKG5hdmlnYXRpb25JZCkge1xuICAgICAgICB0aGlzLnBlbmRpbmdOYXZpZ2F0aW9uc1tuYXZpZ2F0aW9uSWRdID0gbmV3IFBlbmRpbmdOYXZpZ2F0aW9uKCk7XG4gICAgICAgIHJldHVybiB0aGlzLnBlbmRpbmdOYXZpZ2F0aW9uc1tuYXZpZ2F0aW9uSWRdO1xuICAgIH1cbiAgICBnZXRQZW5kaW5nTmF2aWdhdGlvbihuYXZpZ2F0aW9uSWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGVuZGluZ05hdmlnYXRpb25zW25hdmlnYXRpb25JZF07XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pYm1GMmFXZGhkR2x2YmkxcGJuTjBjblZ0Wlc1MExtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTGk0dkxpNHZMaTR2YzNKakwySmhZMnRuY205MWJtUXZibUYyYVdkaGRHbHZiaTFwYm5OMGNuVnRaVzUwTG5SeklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRTlCUVU4c1JVRkJSU3gxUWtGQmRVSXNSVUZCUlN4TlFVRk5MSGREUVVGM1F5eERRVUZETzBGQlEycEdMRTlCUVU4c1JVRkJSU3h2UWtGQmIwSXNSVUZCUlN4TlFVRk5MQ3RDUVVFclFpeERRVUZETzBGQlEzSkZMRTlCUVU4c1JVRkJSU3hwUWtGQmFVSXNSVUZCUlN4TlFVRk5MREpDUVVFeVFpeERRVUZETzBGQlF6bEVMRTlCUVU4c1JVRkJSU3hUUVVGVExFVkJRVVVzV1VGQldTeEZRVUZGTEZOQlFWTXNSVUZCUlN4TlFVRk5MSEZDUVVGeFFpeERRVUZETzBGQlEzcEZMRTlCUVU4c1JVRkJSU3hSUVVGUkxFVkJRVVVzVFVGQlRTeGhRVUZoTEVOQlFVTTdRVUZSZGtNc1RVRkJUU3hEUVVGRExFMUJRVTBzY1VSQlFYRkVMRWRCUVVjc1MwRkJTeXhGUVVONFJTeFBRVUZQTEVWQlExQXNUMEZCYzBNc1JVRkRha0lzUlVGQlJUdEpRVU4yUWl4TlFVRk5MRWRCUVVjc1IwRkRVQ3hQUVVGUExFTkJRVU1zUzBGQlN5eEhRVUZITEVOQlFVTXNRMEZCUXp0UlFVTm9RaXhEUVVGRExFTkJRVU1zVFVGQlRTeFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhQUVVGUExFTkJRVU1zUzBGQlN5eERRVUZETzFGQlEzWkRMRU5CUVVNc1EwRkJRenRaUVVORkxGRkJRVkVzUlVGQlJTeFRRVUZUTzFsQlEyNUNMRk5CUVZNc1JVRkJSU3hUUVVGVE8xbEJRM0JDTEdGQlFXRXNSVUZCUlN4VFFVRlRPMWxCUTNoQ0xGZEJRVmNzUlVGQlJTeFRRVUZUTzFsQlEzUkNMRXRCUVVzc1JVRkJSU3hUUVVGVE8xbEJRMmhDTEUxQlFVMHNSVUZCUlN4VFFVRlRPMU5CUTJ4Q0xFTkJRVU03U1VGRFVpeE5RVUZOTEUxQlFVMHNSMEZCUnl4SFFVRkhMRU5CUVVNc1VVRkJVVHRSUVVONlFpeERRVUZETEVOQlFVTXNUVUZCVFN4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFZEJRVWNzUTBGQlF5eEhRVUZITEVOQlFVTXNVVUZCVVN4RFFVRkRPMUZCUTNwRExFTkJRVU1zUTBGQlF5eEZRVUZGTEV0QlFVc3NSVUZCUlN4VFFVRlRMRVZCUVVVc1RVRkJUU3hGUVVGRkxGTkJRVk1zUlVGQlJTeEpRVUZKTEVWQlFVVXNVMEZCVXl4RlFVRkZMRU5CUVVNN1NVRkROMFFzVFVGQlRTeFZRVUZWTEVkQlFXVTdVVUZETjBJc1ZVRkJWU3hGUVVGRkxFOUJRVTg3VVVGRGJrSXNVMEZCVXl4RlFVRkZMRk5CUVZNc1EwRkJReXhIUVVGSExFTkJRVU1zVTBGQlV5eERRVUZETzFGQlEyNURMSE5DUVVGelFpeEZRVUZGTEc5Q1FVRnZRanRSUVVNMVF5eFZRVUZWTEVWQlFVVXNUMEZCVHl4RFFVRkRMRk5CUVZNN1VVRkROMElzVTBGQlV5eEZRVUZGTEVkQlFVY3NRMEZCUXl4UlFVRlJPMUZCUTNaQ0xFMUJRVTBzUlVGQlJTeFBRVUZQTEVOQlFVTXNTMEZCU3p0UlFVTnlRaXhwUWtGQmFVSXNSVUZCUlN4SFFVRkhMRU5CUVVNc1YwRkJWenRSUVVOc1F5eFJRVUZSTEVWQlFVVXNUMEZCVHl4RFFVRkRMRTlCUVU4N1VVRkRla0lzV1VGQldTeEZRVUZGTEUxQlFVMHNRMEZCUXl4TFFVRkxPMUZCUXpGQ0xHRkJRV0VzUlVGQlJTeE5RVUZOTEVOQlFVTXNUVUZCVFR0UlFVTTFRaXhYUVVGWExFVkJRVVVzVFVGQlRTeERRVUZETEVsQlFVazdVVUZEZUVJc1UwRkJVeXhGUVVGRkxFZEJRVWNzUTBGQlF5eExRVUZMTzFGQlEzQkNMRlZCUVZVc1JVRkJSU3hIUVVGSExFTkJRVU1zVFVGQlRUdFJRVU4wUWl4dFFrRkJiVUlzUlVGQlJTeFpRVUZaTEVOQlFVTXNSMEZCUnl4RFFVRkRMR0ZCUVdFc1EwRkJRenRSUVVOd1JDeEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVRkZPMUZCUTJoQ0xFZEJRVWNzUlVGQlJTeFRRVUZUTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJRenRMUVVNMVFpeERRVUZETzBsQlEwWXNUMEZCVHl4VlFVRlZMRU5CUVVNN1FVRkRjRUlzUTBGQlF5eERRVUZETzBGQlJVWXNUVUZCVFN4UFFVRlBMRzlDUVVGdlFqdEpRVmN2UWl4WlFVRlpMRmxCUVZrN1VVRkthRUlzZFVKQlFXdENMRWRCUlhSQ0xFVkJRVVVzUTBGQlF6dFJRVWRNTEVsQlFVa3NRMEZCUXl4WlFVRlpMRWRCUVVjc1dVRkJXU3hEUVVGRE8wbEJRMjVETEVOQlFVTTdTVUZhVFN4TlFVRk5MRU5CUVVNc1dVRkJXU3hEUVVGRExGTkJRVk1zUlVGQlJTeExRVUZMTEVWQlFVVXNUMEZCVHp0UlFVTnNSQ3hQUVVGUExFZEJRVWNzVTBGQlV5eEpRVUZKTEV0QlFVc3NTVUZCU1N4UFFVRlBMRVZCUVVVc1EwRkJRenRKUVVNMVF5eERRVUZETzBsQldVMHNSMEZCUnl4RFFVRkRMRTlCUVU4N1VVRkRhRUlzU1VGQlNTeERRVUZETEhkQ1FVRjNRaXhIUVVGSExFdEJRVXNzUlVGRGJrTXNUMEZCYTBRc1JVRkRiRVFzUlVGQlJUdFpRVU5HTEUxQlFVMHNXVUZCV1N4SFFVRkhMRzlDUVVGdlFpeERRVUZETEZsQlFWa3NRMEZEY0VRc1QwRkJUeXhEUVVGRExGTkJRVk1zUlVGRGFrSXNUMEZCVHl4RFFVRkRMRXRCUVVzc1JVRkRZaXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVU5vUWl4RFFVRkRPMWxCUTBZc1RVRkJUU3hwUWtGQmFVSXNSMEZCUnl4SlFVRkpMRU5CUVVNc05FSkJRVFJDTEVOQlFVTXNXVUZCV1N4RFFVRkRMRU5CUVVNN1dVRkRNVVVzVFVGQlRTeFZRVUZWTEVkQlFXVXNUVUZCVFN4eFJFRkJjVVFzUTBGRGVFWXNUMEZCVHl4RlFVTlFMRTlCUVU4c1EwRkRVaXhEUVVGRE8xbEJRMFlzVlVGQlZTeERRVUZETEdWQlFXVXNSMEZCUnl4UFFVRlBMRU5CUVVNc1lVRkJZU3hEUVVGRE8xbEJRMjVFTEZWQlFWVXNRMEZCUXl3MlFrRkJOa0lzUjBGQlJ5eDFRa0ZCZFVJc1JVRkJSU3hEUVVGRE8xbEJRM0pGTEZWQlFWVXNRMEZCUXl3d1FrRkJNRUlzUjBGQlJ5eEpRVUZKTEVsQlFVa3NRMEZET1VNc1QwRkJUeXhEUVVGRExGTkJRVk1zUTBGRGJFSXNRMEZCUXl4WFFVRlhMRVZCUVVVc1EwRkJRenRaUVVOb1FpeHBRa0ZCYVVJc1EwRkJReXh6UTBGQmMwTXNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJRenRSUVVOMlJTeERRVUZETEVOQlFVTTdVVUZEUml4UFFVRlBMRU5CUVVNc1lVRkJZU3hEUVVGRExHZENRVUZuUWl4RFFVRkRMRmRCUVZjc1EwRkRhRVFzU1VGQlNTeERRVUZETEhkQ1FVRjNRaXhEUVVNNVFpeERRVUZETzFGQlEwWXNTVUZCU1N4RFFVRkRMRzFDUVVGdFFpeEhRVUZITEV0QlFVc3NSVUZET1VJc1QwRkJOa01zUlVGRE4wTXNSVUZCUlR0WlFVTkdMRTFCUVUwc1dVRkJXU3hIUVVGSExHOUNRVUZ2UWl4RFFVRkRMRmxCUVZrc1EwRkRjRVFzVDBGQlR5eERRVUZETEZOQlFWTXNSVUZEYWtJc1QwRkJUeXhEUVVGRExFdEJRVXNzUlVGRFlpeFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVTm9RaXhEUVVGRE8xbEJRMFlzVFVGQlRTeFZRVUZWTEVkQlFXVXNUVUZCVFN4eFJFRkJjVVFzUTBGRGVFWXNUMEZCVHl4RlFVTlFMRTlCUVU4c1EwRkRVaXhEUVVGRE8xbEJRMFlzVlVGQlZTeERRVUZETEhGQ1FVRnhRaXhIUVVGSExGbEJRVmtzUTBGRE4wTXNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhQUVVGUExFTkJRVU1zYjBKQlFXOUNMRU5CUVVNc1EwRkROME1zUTBGQlF6dFpRVU5HTEZWQlFWVXNRMEZCUXl4bFFVRmxMRWRCUVVjc1dVRkJXU3hEUVVGRExFOUJRVThzUTBGQlF5eGpRVUZqTEVOQlFVTXNRMEZCUXp0WlFVTnNSU3hWUVVGVkxFTkJRVU1zZFVKQlFYVkNMRWRCUVVjc2RVSkJRWFZDTEVWQlFVVXNRMEZCUXp0WlFVTXZSQ3hWUVVGVkxFTkJRVU1zYjBKQlFXOUNMRWRCUVVjc1NVRkJTU3hKUVVGSkxFTkJRM2hETEU5QlFVOHNRMEZCUXl4VFFVRlRMRU5CUTJ4Q0xFTkJRVU1zVjBGQlZ5eEZRVUZGTEVOQlFVTTdXVUZGYUVJc2NVVkJRWEZGTzFsQlEzSkZMRTFCUVUwc2FVSkJRV2xDTEVkQlFVY3NTVUZCU1N4RFFVRkRMRzlDUVVGdlFpeERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPMWxCUTJ4RkxFbEJRVWtzYVVKQlFXbENMRVZCUVVVN1owSkJRM0pDTEdsQ1FVRnBRaXhEUVVGRExHbERRVUZwUXl4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRE8yZENRVU5vUlN4TlFVRk5MRkZCUVZFc1IwRkJSeXhOUVVGTkxHbENRVUZwUWl4RFFVRkRMSEZDUVVGeFFpeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMmRDUVVOeVJTeEpRVUZKTEZGQlFWRXNSVUZCUlR0dlFrRkRXaXhOUVVGTkxDdENRVUVyUWl4SFFVRkhMRTFCUVUwc2FVSkJRV2xDTEVOQlFVTXNLMEpCUVN0Q0xFTkJRVU03YjBKQlEyaEhMRlZCUVZVc1EwRkJReXhsUVVGbE8zZENRVU40UWl3clFrRkJLMElzUTBGQlF5eGxRVUZsTEVOQlFVTTdiMEpCUTJ4RUxGVkJRVlVzUTBGQlF5dzJRa0ZCTmtJN2QwSkJRM1JETEN0Q1FVRXJRaXhEUVVGRExEWkNRVUUyUWl4RFFVRkRPMjlDUVVOb1JTeFZRVUZWTEVOQlFVTXNNRUpCUVRCQ08zZENRVU51UXl3clFrRkJLMElzUTBGQlF5d3dRa0ZCTUVJc1EwRkJRenRwUWtGRE9VUTdZVUZEUmp0WlFVVkVMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zVlVGQlZTeERRVUZETEdGQlFXRXNSVUZCUlN4VlFVRlZMRU5CUVVNc1EwRkJRenRSUVVNeFJDeERRVUZETEVOQlFVTTdVVUZEUml4UFFVRlBMRU5CUVVNc1lVRkJZU3hEUVVGRExGZEJRVmNzUTBGQlF5eFhRVUZYTEVOQlFVTXNTVUZCU1N4RFFVRkRMRzFDUVVGdFFpeERRVUZETEVOQlFVTTdTVUZETVVVc1EwRkJRenRKUVVWTkxFOUJRVTg3VVVGRFdpeEpRVUZKTEVsQlFVa3NRMEZCUXl4M1FrRkJkMElzUlVGQlJUdFpRVU5xUXl4UFFVRlBMRU5CUVVNc1lVRkJZU3hEUVVGRExHZENRVUZuUWl4RFFVRkRMR05CUVdNc1EwRkRia1FzU1VGQlNTeERRVUZETEhkQ1FVRjNRaXhEUVVNNVFpeERRVUZETzFOQlEwZzdVVUZEUkN4SlFVRkpMRWxCUVVrc1EwRkJReXh0UWtGQmJVSXNSVUZCUlR0WlFVTTFRaXhQUVVGUExFTkJRVU1zWVVGQllTeERRVUZETEZkQlFWY3NRMEZCUXl4alFVRmpMRU5CUXpsRExFbEJRVWtzUTBGQlF5eHRRa0ZCYlVJc1EwRkRla0lzUTBGQlF6dFRRVU5JTzBsQlEwZ3NRMEZCUXp0SlFVVlBMRFJDUVVFMFFpeERRVU5zUXl4WlFVRnZRanRSUVVWd1FpeEpRVUZKTEVOQlFVTXNhMEpCUVd0Q0xFTkJRVU1zV1VGQldTeERRVUZETEVkQlFVY3NTVUZCU1N4cFFrRkJhVUlzUlVGQlJTeERRVUZETzFGQlEyaEZMRTlCUVU4c1NVRkJTU3hEUVVGRExHdENRVUZyUWl4RFFVRkRMRmxCUVZrc1EwRkJReXhEUVVGRE8wbEJReTlETEVOQlFVTTdTVUZGVHl4dlFrRkJiMElzUTBGQlF5eFpRVUZ2UWp0UlFVTXZReXhQUVVGUExFbEJRVWtzUTBGQlF5eHJRa0ZCYTBJc1EwRkJReXhaUVVGWkxFTkJRVU1zUTBGQlF6dEpRVU12UXl4RFFVRkRPME5CUTBZaWZRPT0iLCJpbXBvcnQgeyBnZXRJbnN0cnVtZW50SlMgfSBmcm9tIFwiLi4vbGliL2pzLWluc3RydW1lbnRzXCI7XG5pbXBvcnQgeyBwYWdlU2NyaXB0IH0gZnJvbSBcIi4vamF2YXNjcmlwdC1pbnN0cnVtZW50LXBhZ2Utc2NvcGVcIjtcbmZ1bmN0aW9uIGdldFBhZ2VTY3JpcHRBc1N0cmluZyhqc0luc3RydW1lbnRhdGlvblNldHRpbmdzU3RyaW5nKSB7XG4gICAgLy8gVGhlIEpTIEluc3RydW1lbnQgUmVxdWVzdHMgYXJlIHNldHVwIGFuZCB2YWxpZGF0ZWQgcHl0aG9uIHNpZGVcbiAgICAvLyBpbmNsdWRpbmcgc2V0dGluZyBkZWZhdWx0cyBmb3IgbG9nU2V0dGluZ3MuIFNlZSBKU0luc3RydW1lbnRhdGlvbi5weVxuICAgIGNvbnN0IHBhZ2VTY3JpcHRTdHJpbmcgPSBgXG4vLyBTdGFydCBvZiBqcy1pbnN0cnVtZW50cy5cbiR7Z2V0SW5zdHJ1bWVudEpTfVxuLy8gRW5kIG9mIGpzLWluc3RydW1lbnRzLlxuXG4vLyBTdGFydCBvZiBjdXN0b20gaW5zdHJ1bWVudFJlcXVlc3RzLlxuY29uc3QganNJbnN0cnVtZW50YXRpb25TZXR0aW5ncyA9ICR7anNJbnN0cnVtZW50YXRpb25TZXR0aW5nc1N0cmluZ307XG4vLyBFbmQgb2YgY3VzdG9tIGluc3RydW1lbnRSZXF1ZXN0cy5cblxuLy8gU3RhcnQgb2YgYW5vbnltb3VzIGZ1bmN0aW9uIGZyb20gamF2YXNjcmlwdC1pbnN0cnVtZW50LXBhZ2Utc2NvcGUudHNcbigke3BhZ2VTY3JpcHR9KGdldEluc3RydW1lbnRKUywganNJbnN0cnVtZW50YXRpb25TZXR0aW5ncykpO1xuLy8gRW5kLlxuICBgO1xuICAgIHJldHVybiBwYWdlU2NyaXB0U3RyaW5nO1xufVxuZnVuY3Rpb24gaW5zZXJ0U2NyaXB0KHBhZ2VTY3JpcHRTdHJpbmcsIGV2ZW50SWQsIHRlc3RpbmcgPSBmYWxzZSkge1xuICAgIGNvbnN0IHBhcmVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICBzY3JpcHQudGV4dCA9IHBhZ2VTY3JpcHRTdHJpbmc7XG4gICAgc2NyaXB0LmFzeW5jID0gZmFsc2U7XG4gICAgc2NyaXB0LnNldEF0dHJpYnV0ZShcImRhdGEtZXZlbnQtaWRcIiwgZXZlbnRJZCk7XG4gICAgc2NyaXB0LnNldEF0dHJpYnV0ZShcImRhdGEtdGVzdGluZ1wiLCBgJHt0ZXN0aW5nfWApO1xuICAgIHBhcmVudC5pbnNlcnRCZWZvcmUoc2NyaXB0LCBwYXJlbnQuZmlyc3RDaGlsZCk7XG4gICAgcGFyZW50LnJlbW92ZUNoaWxkKHNjcmlwdCk7XG59XG5mdW5jdGlvbiBlbWl0TXNnKHR5cGUsIG1zZykge1xuICAgIG1zZy50aW1lU3RhbXAgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgbmFtZXNwYWNlOiBcImphdmFzY3JpcHQtaW5zdHJ1bWVudGF0aW9uXCIsXG4gICAgICAgIHR5cGUsXG4gICAgICAgIGRhdGE6IG1zZyxcbiAgICB9KTtcbn1cbmNvbnN0IGV2ZW50SWQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCk7XG4vLyBsaXN0ZW4gZm9yIG1lc3NhZ2VzIGZyb20gdGhlIHNjcmlwdCB3ZSBhcmUgYWJvdXQgdG8gaW5zZXJ0XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50SWQsIGZ1bmN0aW9uIChlKSB7XG4gICAgLy8gcGFzcyB0aGVzZSBvbiB0byB0aGUgYmFja2dyb3VuZCBwYWdlXG4gICAgY29uc3QgbXNncyA9IGUuZGV0YWlsO1xuICAgIGlmIChBcnJheS5pc0FycmF5KG1zZ3MpKSB7XG4gICAgICAgIG1zZ3MuZm9yRWFjaChmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICBlbWl0TXNnKG1zZy50eXBlLCBtc2cuY29udGVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZW1pdE1zZyhtc2dzLnR5cGUsIG1zZ3MuY29udGVudCk7XG4gICAgfVxufSk7XG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0SmF2YXNjcmlwdEluc3RydW1lbnRQYWdlU2NyaXB0KGNvbnRlbnRTY3JpcHRDb25maWcpIHtcbiAgICBpbnNlcnRTY3JpcHQoZ2V0UGFnZVNjcmlwdEFzU3RyaW5nKGNvbnRlbnRTY3JpcHRDb25maWcuanNJbnN0cnVtZW50YXRpb25TZXR0aW5nc1N0cmluZyksIGV2ZW50SWQsIGNvbnRlbnRTY3JpcHRDb25maWcudGVzdGluZyk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lhbUYyWVhOamNtbHdkQzFwYm5OMGNuVnRaVzUwTFdOdmJuUmxiblF0YzJOdmNHVXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdUxpOHVMaTh1TGk5emNtTXZZMjl1ZEdWdWRDOXFZWFpoYzJOeWFYQjBMV2x1YzNSeWRXMWxiblF0WTI5dWRHVnVkQzF6WTI5d1pTNTBjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4UFFVRlBMRVZCUVVVc1pVRkJaU3hGUVVGRkxFMUJRVTBzZFVKQlFYVkNMRU5CUVVNN1FVRkRlRVFzVDBGQlR5eEZRVUZGTEZWQlFWVXNSVUZCUlN4TlFVRk5MRzlEUVVGdlF5eERRVUZETzBGQlJXaEZMRk5CUVZNc2NVSkJRWEZDTEVOQlF6VkNMQ3RDUVVGMVF6dEpRVVYyUXl4cFJVRkJhVVU3U1VGRGFrVXNkVVZCUVhWRk8wbEJRM1pGTEUxQlFVMHNaMEpCUVdkQ0xFZEJRVWM3TzBWQlJYcENMR1ZCUVdVN096czdiME5CU1cxQ0xDdENRVUVyUWpzN096dEhRVWxvUlN4VlFVRlZPenRIUVVWV0xFTkJRVU03U1VGRFJpeFBRVUZQTEdkQ1FVRm5RaXhEUVVGRE8wRkJRekZDTEVOQlFVTTdRVUZGUkN4VFFVRlRMRmxCUVZrc1EwRkRia0lzWjBKQlFYZENMRVZCUTNoQ0xFOUJRV1VzUlVGRFppeFZRVUZ0UWl4TFFVRkxPMGxCUlhoQ0xFMUJRVTBzVFVGQlRTeEhRVUZITEZGQlFWRXNRMEZCUXl4bFFVRmxMRVZCUTNKRExFMUJRVTBzUjBGQlJ5eFJRVUZSTEVOQlFVTXNZVUZCWVN4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8wbEJRelZETEUxQlFVMHNRMEZCUXl4SlFVRkpMRWRCUVVjc1owSkJRV2RDTEVOQlFVTTdTVUZETDBJc1RVRkJUU3hEUVVGRExFdEJRVXNzUjBGQlJ5eExRVUZMTEVOQlFVTTdTVUZEY2tJc1RVRkJUU3hEUVVGRExGbEJRVmtzUTBGQlF5eGxRVUZsTEVWQlFVVXNUMEZCVHl4RFFVRkRMRU5CUVVNN1NVRkRPVU1zVFVGQlRTeERRVUZETEZsQlFWa3NRMEZCUXl4alFVRmpMRVZCUVVVc1IwRkJSeXhQUVVGUExFVkJRVVVzUTBGQlF5eERRVUZETzBsQlEyeEVMRTFCUVUwc1EwRkJReXhaUVVGWkxFTkJRVU1zVFVGQlRTeEZRVUZGTEUxQlFVMHNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJRenRKUVVNdlF5eE5RVUZOTEVOQlFVTXNWMEZCVnl4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRE8wRkJRemRDTEVOQlFVTTdRVUZGUkN4VFFVRlRMRTlCUVU4c1EwRkJReXhKUVVGSkxFVkJRVVVzUjBGQlJ6dEpRVU40UWl4SFFVRkhMRU5CUVVNc1UwRkJVeXhIUVVGSExFbEJRVWtzU1VGQlNTeEZRVUZGTEVOQlFVTXNWMEZCVnl4RlFVRkZMRU5CUVVNN1NVRkRla01zVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4WFFVRlhMRU5CUVVNN1VVRkRNVUlzVTBGQlV5eEZRVUZGTERSQ1FVRTBRanRSUVVOMlF5eEpRVUZKTzFGQlEwb3NTVUZCU1N4RlFVRkZMRWRCUVVjN1MwRkRWaXhEUVVGRExFTkJRVU03UVVGRFRDeERRVUZETzBGQlJVUXNUVUZCVFN4UFFVRlBMRWRCUVVjc1NVRkJTU3hEUVVGRExFMUJRVTBzUlVGQlJTeERRVUZETEZGQlFWRXNSVUZCUlN4RFFVRkRPMEZCUlhwRExEWkVRVUUyUkR0QlFVTTNSQ3hSUVVGUkxFTkJRVU1zWjBKQlFXZENMRU5CUVVNc1QwRkJUeXhGUVVGRkxGVkJRVk1zUTBGQll6dEpRVU40UkN4MVEwRkJkVU03U1VGRGRrTXNUVUZCVFN4SlFVRkpMRWRCUVVjc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF6dEpRVU4wUWl4SlFVRkpMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVWQlFVVTdVVUZEZGtJc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eFZRVUZUTEVkQlFVYzdXVUZEZGtJc1QwRkJUeXhEUVVGRExFZEJRVWNzUTBGQlF5eEpRVUZKTEVWQlFVVXNSMEZCUnl4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8xRkJRMnBETEVOQlFVTXNRMEZCUXl4RFFVRkRPMHRCUTBvN1UwRkJUVHRSUVVOTUxFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dExRVU5zUXp0QlFVTklMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJSVWdzVFVGQlRTeFZRVUZWTEc5RFFVRnZReXhEUVVGRExHMUNRVUZ0UWp0SlFVTjBSU3haUVVGWkxFTkJRMVlzY1VKQlFYRkNMRU5CUVVNc2JVSkJRVzFDTEVOQlFVTXNLMEpCUVN0Q0xFTkJRVU1zUlVGRE1VVXNUMEZCVHl4RlFVTlFMRzFDUVVGdFFpeERRVUZETEU5QlFVOHNRMEZETlVJc1EwRkJRenRCUVVOS0xFTkJRVU1pZlE9PSIsIi8vIENvZGUgYmVsb3cgaXMgbm90IGEgY29udGVudCBzY3JpcHQ6IG5vIEZpcmVmb3ggQVBJcyBzaG91bGQgYmUgdXNlZFxuLy8gQWxzbywgbm8gd2VicGFjay9lczYgaW1wb3J0cyBtYXkgYmUgdXNlZCBpbiB0aGlzIGZpbGUgc2luY2UgdGhlIHNjcmlwdFxuLy8gaXMgZXhwb3J0ZWQgYXMgYSBwYWdlIHNjcmlwdCBhcyBhIHN0cmluZ1xuZXhwb3J0IGNvbnN0IHBhZ2VTY3JpcHQgPSBmdW5jdGlvbiAoZ2V0SW5zdHJ1bWVudEpTLCBqc0luc3RydW1lbnRhdGlvblNldHRpbmdzKSB7XG4gICAgLy8gbWVzc2FnZXMgdGhlIGluamVjdGVkIHNjcmlwdFxuICAgIGZ1bmN0aW9uIHNlbmRNZXNzYWdlc1RvTG9nZ2VyKGV2ZW50SWQsIG1lc3NhZ2VzKSB7XG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGV2ZW50SWQsIHtcbiAgICAgICAgICAgIGRldGFpbDogbWVzc2FnZXMsXG4gICAgICAgIH0pKTtcbiAgICB9XG4gICAgY29uc3QgZXZlbnRJZCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuZ2V0QXR0cmlidXRlKFwiZGF0YS1ldmVudC1pZFwiKTtcbiAgICBjb25zdCB0ZXN0aW5nID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRlc3RpbmdcIik7XG4gICAgY29uc3QgaW5zdHJ1bWVudEpTID0gZ2V0SW5zdHJ1bWVudEpTKGV2ZW50SWQsIHNlbmRNZXNzYWdlc1RvTG9nZ2VyKTtcbiAgICBsZXQgdDA7XG4gICAgaWYgKHRlc3RpbmcgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiT3BlbldQTTogQ3VycmVudGx5IHRlc3RpbmdcIik7XG4gICAgICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQmVnaW4gbG9hZGluZyBKUyBpbnN0cnVtZW50YXRpb24uXCIpO1xuICAgIH1cbiAgICBpbnN0cnVtZW50SlMoanNJbnN0cnVtZW50YXRpb25TZXR0aW5ncyk7XG4gICAgaWYgKHRlc3RpbmcgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgIGNvbnN0IHQxID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGBDYWxsIHRvIGluc3RydW1lbnRKUyB0b29rICR7dDEgLSB0MH0gbWlsbGlzZWNvbmRzLmApO1xuICAgICAgICB3aW5kb3cuaW5zdHJ1bWVudEpTID0gaW5zdHJ1bWVudEpTO1xuICAgICAgICBjb25zb2xlLmxvZyhcIk9wZW5XUE06IENvbnRlbnQtc2lkZSBqYXZhc2NyaXB0IGluc3RydW1lbnRhdGlvbiBzdGFydGVkIHdpdGggc3BlYzpcIiwganNJbnN0cnVtZW50YXRpb25TZXR0aW5ncywgbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCBcIihpZiBzcGVjIGlzICc8dW5hdmFpbGFibGU+JyBjaGVjayB3ZWIgY29uc29sZS4pXCIpO1xuICAgIH1cbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lhbUYyWVhOamNtbHdkQzFwYm5OMGNuVnRaVzUwTFhCaFoyVXRjMk52Y0dVdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGN5STZXeUl1TGk4dUxpOHVMaTl6Y21NdlkyOXVkR1Z1ZEM5cVlYWmhjMk55YVhCMExXbHVjM1J5ZFcxbGJuUXRjR0ZuWlMxelkyOXdaUzUwY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeHhSVUZCY1VVN1FVRkRja1VzZVVWQlFYbEZPMEZCUTNwRkxESkRRVUV5UXp0QlFVVXpReXhOUVVGTkxFTkJRVU1zVFVGQlRTeFZRVUZWTEVkQlFVY3NWVUZCVXl4bFFVRmxMRVZCUVVVc2VVSkJRWGxDTzBsQlF6TkZMQ3RDUVVFclFqdEpRVU12UWl4VFFVRlRMRzlDUVVGdlFpeERRVUZETEU5QlFVOHNSVUZCUlN4UlFVRlJPMUZCUXpkRExGRkJRVkVzUTBGQlF5eGhRVUZoTEVOQlEzQkNMRWxCUVVrc1YwRkJWeXhEUVVGRExFOUJRVThzUlVGQlJUdFpRVU4yUWl4TlFVRk5MRVZCUVVVc1VVRkJVVHRUUVVOcVFpeERRVUZETEVOQlEwZ3NRMEZCUXp0SlFVTktMRU5CUVVNN1NVRkZSQ3hOUVVGTkxFOUJRVThzUjBGQlJ5eFJRVUZSTEVOQlFVTXNZVUZCWVN4RFFVRkRMRmxCUVZrc1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF6dEpRVU55UlN4TlFVRk5MRTlCUVU4c1IwRkJSeXhSUVVGUkxFTkJRVU1zWVVGQllTeERRVUZETEZsQlFWa3NRMEZCUXl4alFVRmpMRU5CUVVNc1EwRkJRenRKUVVOd1JTeE5RVUZOTEZsQlFWa3NSMEZCUnl4bFFVRmxMRU5CUVVNc1QwRkJUeXhGUVVGRkxHOUNRVUZ2UWl4RFFVRkRMRU5CUVVNN1NVRkRjRVVzU1VGQlNTeEZRVUZWTEVOQlFVTTdTVUZEWml4SlFVRkpMRTlCUVU4c1MwRkJTeXhOUVVGTkxFVkJRVVU3VVVGRGRFSXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXcwUWtGQk5FSXNRMEZCUXl4RFFVRkRPMUZCUXpGRExFVkJRVVVzUjBGQlJ5eFhRVUZYTEVOQlFVTXNSMEZCUnl4RlFVRkZMRU5CUVVNN1VVRkRka0lzVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4dFEwRkJiVU1zUTBGQlF5eERRVUZETzB0QlEyeEVPMGxCUTBRc1dVRkJXU3hEUVVGRExIbENRVUY1UWl4RFFVRkRMRU5CUVVNN1NVRkRlRU1zU1VGQlNTeFBRVUZQTEV0QlFVc3NUVUZCVFN4RlFVRkZPMUZCUTNSQ0xFMUJRVTBzUlVGQlJTeEhRVUZITEZkQlFWY3NRMEZCUXl4SFFVRkhMRVZCUVVVc1EwRkJRenRSUVVNM1FpeFBRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMRFpDUVVFMlFpeEZRVUZGTEVkQlFVY3NSVUZCUlN4blFrRkJaMElzUTBGQlF5eERRVUZETzFGQlEycEZMRTFCUVdNc1EwRkJReXhaUVVGWkxFZEJRVWNzV1VGQldTeERRVUZETzFGQlF6VkRMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRMVFzY1VWQlFYRkZMRVZCUTNKRkxIbENRVUY1UWl4RlFVTjZRaXhKUVVGSkxFbEJRVWtzUlVGQlJTeERRVUZETEZkQlFWY3NSVUZCUlN4RlFVTjRRaXhwUkVGQmFVUXNRMEZEYkVRc1EwRkJRenRMUVVOSU8wRkJRMGdzUTBGQlF5eERRVUZESW4wPSIsImV4cG9ydCAqIGZyb20gXCIuL2JhY2tncm91bmQvY29va2llLWluc3RydW1lbnRcIjtcbmV4cG9ydCAqIGZyb20gXCIuL2JhY2tncm91bmQvaHR0cC1pbnN0cnVtZW50XCI7XG5leHBvcnQgKiBmcm9tIFwiLi9iYWNrZ3JvdW5kL2phdmFzY3JpcHQtaW5zdHJ1bWVudFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vYmFja2dyb3VuZC9uYXZpZ2F0aW9uLWluc3RydW1lbnRcIjtcbmV4cG9ydCAqIGZyb20gXCIuL2NvbnRlbnQvamF2YXNjcmlwdC1pbnN0cnVtZW50LWNvbnRlbnQtc2NvcGVcIjtcbmV4cG9ydCAqIGZyb20gXCIuL2xpYi9odHRwLXBvc3QtcGFyc2VyXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9saWIvc3RyaW5nLXV0aWxzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9zY2hlbWFcIjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWFXNWtaWGd1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sY3lJNld5SXVMaTh1TGk5emNtTXZhVzVrWlhndWRITWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzWTBGQll5eG5RMEZCWjBNc1EwRkJRenRCUVVNdlF5eGpRVUZqTERoQ1FVRTRRaXhEUVVGRE8wRkJRemRETEdOQlFXTXNiME5CUVc5RExFTkJRVU03UVVGRGJrUXNZMEZCWXl4dlEwRkJiME1zUTBGQlF6dEJRVU51UkN4alFVRmpMQ3REUVVFclF5eERRVUZETzBGQlF6bEVMR05CUVdNc2QwSkJRWGRDTEVOQlFVTTdRVUZEZGtNc1kwRkJZeXh2UWtGQmIwSXNRMEZCUXp0QlFVTnVReXhqUVVGakxGVkJRVlVzUTBGQlF5SjkiLCIvKipcbiAqIFRoaXMgZW5hYmxlcyB1cyB0byBrZWVwIGluZm9ybWF0aW9uIGFib3V0IHRoZSBvcmlnaW5hbCBvcmRlclxuICogaW4gd2hpY2ggZXZlbnRzIGFycml2ZWQgdG8gb3VyIGV2ZW50IGxpc3RlbmVycy5cbiAqL1xubGV0IGV2ZW50T3JkaW5hbCA9IDA7XG5leHBvcnQgY29uc3QgaW5jcmVtZW50ZWRFdmVudE9yZGluYWwgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGV2ZW50T3JkaW5hbCsrO1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaVpYaDBaVzV6YVc5dUxYTmxjM05wYjI0dFpYWmxiblF0YjNKa2FXNWhiQzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpNHVMeTR1THk0dUwzTnlZeTlzYVdJdlpYaDBaVzV6YVc5dUxYTmxjM05wYjI0dFpYWmxiblF0YjNKa2FXNWhiQzUwY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFUczdPMGRCUjBjN1FVRkRTQ3hKUVVGSkxGbEJRVmtzUjBGQlJ5eERRVUZETEVOQlFVTTdRVUZGY2tJc1RVRkJUU3hEUVVGRExFMUJRVTBzZFVKQlFYVkNMRWRCUVVjc1IwRkJSeXhGUVVGRk8wbEJRekZETEU5QlFVOHNXVUZCV1N4RlFVRkZMRU5CUVVNN1FVRkRlRUlzUTBGQlF5eERRVUZESW4wPSIsImltcG9ydCB7IG1ha2VVVUlEIH0gZnJvbSBcIi4vdXVpZFwiO1xuLyoqXG4gKiBUaGlzIGVuYWJsZXMgdXMgdG8gYWNjZXNzIGEgdW5pcXVlIHJlZmVyZW5jZSB0byB0aGlzIGJyb3dzZXJcbiAqIHNlc3Npb24gLSByZWdlbmVyYXRlZCBhbnkgdGltZSB0aGUgYmFja2dyb3VuZCBwcm9jZXNzIGdldHNcbiAqIHJlc3RhcnRlZCAod2hpY2ggc2hvdWxkIG9ubHkgYmUgb24gYnJvd3NlciByZXN0YXJ0cylcbiAqL1xuZXhwb3J0IGNvbnN0IGV4dGVuc2lvblNlc3Npb25VdWlkID0gbWFrZVVVSUQoKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaVpYaDBaVzV6YVc5dUxYTmxjM05wYjI0dGRYVnBaQzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpNHVMeTR1THk0dUwzTnlZeTlzYVdJdlpYaDBaVzV6YVc5dUxYTmxjM05wYjI0dGRYVnBaQzUwY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeFBRVUZQTEVWQlFVVXNVVUZCVVN4RlFVRkZMRTFCUVUwc1VVRkJVU3hEUVVGRE8wRkJSV3hET3pzN08wZEJTVWM3UVVGRFNDeE5RVUZOTEVOQlFVTXNUVUZCVFN4dlFrRkJiMElzUjBGQlJ5eFJRVUZSTEVWQlFVVXNRMEZCUXlKOSIsIi8vIEluY29ycG9yYXRlcyBjb2RlIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9yZWRsaW5lMTMvc2VsZW5pdW0tam1ldGVyL2Jsb2IvNjk2NmQ0YjMyNmNkNzgyNjFlMzFlNmUzMTcwNzY1NjkwNTFjYWMzNy9jb250ZW50L2xpYnJhcnkvcmVjb3JkZXIvSHR0cFBvc3RQYXJzZXIuanNcbi8vIGltcG9ydCB7IGVzY2FwZVN0cmluZywgZXNjYXBlVXJsIH0gZnJvbSBcIi4vc3RyaW5nLXV0aWxzXCI7XG5pbXBvcnQgeyBlc2NhcGVTdHJpbmcsIFVpbnQ4VG9CYXNlNjQgfSBmcm9tIFwiLi9zdHJpbmctdXRpbHNcIjtcbmV4cG9ydCBjbGFzcyBIdHRwUG9zdFBhcnNlciB7XG4gICAgLypcbiAgICBwcml2YXRlIGhhc2hlYWRlcnM6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBzZWVrYWJsZXN0cmVhbTtcbiAgICBwcml2YXRlIHN0cmVhbTtcbiAgICBwcml2YXRlIHBvc3RCb2R5O1xuICAgIHByaXZhdGUgcG9zdExpbmVzO1xuICAgIHByaXZhdGUgcG9zdEhlYWRlcnM7XG4gICAgcHJpdmF0ZSBib2R5O1xuICAgICovXG4gICAgY29uc3RydWN0b3IoXG4gICAgLy8gb25CZWZvcmVTZW5kSGVhZGVyc0V2ZW50RGV0YWlsczogV2ViUmVxdWVzdE9uQmVmb3JlU2VuZEhlYWRlcnNFdmVudERldGFpbHMsXG4gICAgb25CZWZvcmVSZXF1ZXN0RXZlbnREZXRhaWxzLCBkYXRhUmVjZWl2ZXIpIHtcbiAgICAgICAgLy8gdGhpcy5vbkJlZm9yZVNlbmRIZWFkZXJzRXZlbnREZXRhaWxzID0gb25CZWZvcmVTZW5kSGVhZGVyc0V2ZW50RGV0YWlscztcbiAgICAgICAgdGhpcy5vbkJlZm9yZVJlcXVlc3RFdmVudERldGFpbHMgPSBvbkJlZm9yZVJlcXVlc3RFdmVudERldGFpbHM7XG4gICAgICAgIHRoaXMuZGF0YVJlY2VpdmVyID0gZGF0YVJlY2VpdmVyO1xuICAgICAgICAvKlxuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBcIkh0dHBQb3N0UGFyc2VyXCIsXG4gICAgICAgICAgLy8gb25CZWZvcmVTZW5kSGVhZGVyc0V2ZW50RGV0YWlscyxcbiAgICAgICAgICBvbkJlZm9yZVJlcXVlc3RFdmVudERldGFpbHMsXG4gICAgICAgICk7XG4gICAgICAgICovXG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBlbmNvZGluZ1R5cGUgZnJvbSB0aGUgSFRUUCBSZXF1ZXN0IGhlYWRlcnNcbiAgICAgKi9cbiAgICBwYXJzZVBvc3RSZXF1ZXN0KCAvKmVuY29kaW5nVHlwZSovKSB7XG4gICAgICAgIC8vIGNvbnN0IHJlcXVlc3RIZWFkZXJzID0gdGhpcy5vbkJlZm9yZVNlbmRIZWFkZXJzRXZlbnREZXRhaWxzLnJlcXVlc3RIZWFkZXJzO1xuICAgICAgICBjb25zdCByZXF1ZXN0Qm9keSA9IHRoaXMub25CZWZvcmVSZXF1ZXN0RXZlbnREZXRhaWxzLnJlcXVlc3RCb2R5O1xuICAgICAgICBpZiAocmVxdWVzdEJvZHkuZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVJlY2VpdmVyLmxvZ0Vycm9yKFwiRXhjZXB0aW9uOiBVcHN0cmVhbSBmYWlsZWQgdG8gcGFyc2UgUE9TVDogXCIgKyByZXF1ZXN0Qm9keS5lcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlcXVlc3RCb2R5LmZvcm1EYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IHJlcXVlc3RCb2R5LmZvcm1EYXRhIHNob3VsZCBwcm9iYWJseSBiZSB0cmFuc2Zvcm1lZCBpbnRvIGFub3RoZXIgZm9ybWF0XG4gICAgICAgICAgICAgICAgcG9zdF9ib2R5OiBlc2NhcGVTdHJpbmcoSlNPTi5zdHJpbmdpZnkocmVxdWVzdEJvZHkuZm9ybURhdGEpKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlcXVlc3RCb2R5LnJhdykge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBwb3N0X2JvZHlfcmF3OiBKU09OLnN0cmluZ2lmeShyZXF1ZXN0Qm9keS5yYXcubWFwKHggPT4gW1xuICAgICAgICAgICAgICAgICAgICB4LmZpbGUsXG4gICAgICAgICAgICAgICAgICAgIFVpbnQ4VG9CYXNlNjQobmV3IFVpbnQ4QXJyYXkoeC5ieXRlcykpLFxuICAgICAgICAgICAgICAgIF0pKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmV0dXJuIGVtcHR5IHJlc3BvbnNlIHVudGlsIHdlIGhhdmUgYWxsIGluc3RydW1lbnRhdGlvbiBjb252ZXJ0ZWRcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICAvKlxuICAgICAgICB0aGlzLmRhdGFSZWNlaXZlci5sb2dEZWJ1ZyhcbiAgICAgICAgICBcIkV4Y2VwdGlvbjogSW5zdHJ1bWVudGF0aW9uIHRvIHBhcnNlIFBPU1QgcmVxdWVzdHMgd2l0aG91dCBmb3JtRGF0YSBpcyBub3QgeWV0IHJlc3RvcmVkXCIsXG4gICAgICAgICk7XG4gICAgXG4gICAgICAgIC8vIFRPRE86IFJlZmFjdG9yIHRvIGNvcnJlc3BvbmRpbmcgd2ViZXh0IGxvZ2ljIG9yIGRpc2NhcmRcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGlzLnNldHVwU3RyZWFtKCk7XG4gICAgICAgICAgdGhpcy5wYXJzZVN0cmVhbSgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgdGhpcy5kYXRhUmVjZWl2ZXIubG9nRXJyb3IoXCJFeGNlcHRpb246IEZhaWxlZCB0byBwYXJzZSBQT1NUOiBcIiArIGUpO1xuICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBjb25zdCBwb3N0Qm9keSA9IHRoaXMucG9zdEJvZHk7XG4gICAgXG4gICAgICAgIGlmICghcG9zdEJvZHkpIHtcbiAgICAgICAgICAvLyBzb21lIHNjcmlwdHMgc3RyYW5nZWx5IHNlbmRzIGVtcHR5IHBvc3QgYm9kaWVzIChjb25maXJtZWQgd2l0aCB0aGUgZGV2ZWxvcGVyIHRvb2xzKVxuICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBsZXQgaXNNdWx0aVBhcnQgPSBmYWxzZTsgLy8gZW5jVHlwZTogbXVsdGlwYXJ0L2Zvcm0tZGF0YVxuICAgICAgICBjb25zdCBwb3N0SGVhZGVycyA9IHRoaXMucG9zdEhlYWRlcnM7IC8vIHJlcXVlc3QgaGVhZGVycyBmcm9tIHVwbG9hZCBzdHJlYW1cbiAgICAgICAgLy8gU2VlLCBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE2NTQ4NTE3L3doYXQtaXMtcmVxdWVzdC1oZWFkZXJzLWZyb20tdXBsb2FkLXN0cmVhbVxuICAgIFxuICAgICAgICAvLyBhZGQgZW5jb2RpbmdUeXBlIGZyb20gcG9zdEhlYWRlcnMgaWYgaXQncyBtaXNzaW5nXG4gICAgICAgIGlmICghZW5jb2RpbmdUeXBlICYmIHBvc3RIZWFkZXJzICYmIFwiQ29udGVudC1UeXBlXCIgaW4gcG9zdEhlYWRlcnMpIHtcbiAgICAgICAgICBlbmNvZGluZ1R5cGUgPSBwb3N0SGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBpZiAoZW5jb2RpbmdUeXBlLmluZGV4T2YoXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIpICE9PSAtMSkge1xuICAgICAgICAgIGlzTXVsdGlQYXJ0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBsZXQganNvblBvc3REYXRhID0gXCJcIjtcbiAgICAgICAgbGV0IGVzY2FwZWRKc29uUG9zdERhdGEgPSBcIlwiO1xuICAgICAgICBpZiAoaXNNdWx0aVBhcnQpIHtcbiAgICAgICAgICBqc29uUG9zdERhdGEgPSB0aGlzLnBhcnNlTXVsdGlQYXJ0RGF0YShwb3N0Qm9keSAvKiwgZW5jb2RpbmdUeXBlKiAvKTtcbiAgICAgICAgICBlc2NhcGVkSnNvblBvc3REYXRhID0gZXNjYXBlU3RyaW5nKGpzb25Qb3N0RGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAganNvblBvc3REYXRhID0gdGhpcy5wYXJzZUVuY29kZWRGb3JtRGF0YShwb3N0Qm9keSwgZW5jb2RpbmdUeXBlKTtcbiAgICAgICAgICBlc2NhcGVkSnNvblBvc3REYXRhID0gZXNjYXBlU3RyaW5nKGpzb25Qb3N0RGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgcG9zdF9oZWFkZXJzOiBwb3N0SGVhZGVycywgcG9zdF9ib2R5OiBlc2NhcGVkSnNvblBvc3REYXRhIH07XG4gICAgICAgICovXG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pYUhSMGNDMXdiM04wTFhCaGNuTmxjaTVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpNHVMeTR1THk0dUwzTnlZeTlzYVdJdmFIUjBjQzF3YjNOMExYQmhjbk5sY2k1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3huUzBGQlowczdRVUZOYUVzc05FUkJRVFJFTzBGQlJUVkVMRTlCUVU4c1JVRkJSU3haUVVGWkxFVkJRVVVzWVVGQllTeEZRVUZGTEUxQlFVMHNaMEpCUVdkQ0xFTkJRVU03UVVGVk4wUXNUVUZCVFN4UFFVRlBMR05CUVdNN1NVRkpla0k3T3pzN096czdPMDFCVVVVN1NVRkZSanRKUVVORkxEaEZRVUU0UlR0SlFVTTVSU3d5UWtGQmEwVXNSVUZEYkVVc1dVRkJXVHRSUVVWYUxEQkZRVUV3UlR0UlFVTXhSU3hKUVVGSkxFTkJRVU1zTWtKQlFUSkNMRWRCUVVjc01rSkJRVEpDTEVOQlFVTTdVVUZETDBRc1NVRkJTU3hEUVVGRExGbEJRVmtzUjBGQlJ5eFpRVUZaTEVOQlFVTTdVVUZEYWtNN096czdPenRWUVUxRk8wbEJRMG9zUTBGQlF6dEpRVVZFT3p0UFFVVkhPMGxCUTBrc1owSkJRV2RDTEVWQlFVTXNaMEpCUVdkQ08xRkJRM1JETERoRlFVRTRSVHRSUVVNNVJTeE5RVUZOTEZkQlFWY3NSMEZCUnl4SlFVRkpMRU5CUVVNc01rSkJRVEpDTEVOQlFVTXNWMEZCVnl4RFFVRkRPMUZCUTJwRkxFbEJRVWtzVjBGQlZ5eERRVUZETEV0QlFVc3NSVUZCUlR0WlFVTnlRaXhKUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEZGQlFWRXNRMEZEZUVJc05FTkJRVFJETEVkQlFVY3NWMEZCVnl4RFFVRkRMRXRCUVVzc1EwRkRha1VzUTBGQlF6dFRRVU5JTzFGQlEwUXNTVUZCU1N4WFFVRlhMRU5CUVVNc1VVRkJVU3hGUVVGRk8xbEJRM2hDTEU5QlFVODdaMEpCUTB3c1owWkJRV2RHTzJkQ1FVTm9SaXhUUVVGVExFVkJRVVVzV1VGQldTeERRVUZETEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1YwRkJWeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzJGQlF6bEVMRU5CUVVNN1UwRkRTRHRSUVVORUxFbEJRVWtzVjBGQlZ5eERRVUZETEVkQlFVY3NSVUZCUlR0WlFVTnVRaXhQUVVGUE8yZENRVU5NTEdGQlFXRXNSVUZCUlN4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVNelFpeFhRVUZYTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU1zUlVGQlJTeERRVUZETzI5Q1FVTjJRaXhEUVVGRExFTkJRVU1zU1VGQlNUdHZRa0ZEVGl4aFFVRmhMRU5CUVVNc1NVRkJTU3hWUVVGVkxFTkJRVU1zUTBGQlF5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMmxDUVVOMlF5eERRVUZETEVOQlEwZzdZVUZEUml4RFFVRkRPMU5CUTBnN1VVRkZSQ3h2UlVGQmIwVTdVVUZEY0VVc1QwRkJUeXhGUVVGRkxFTkJRVU03VVVGRFZqczdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN1ZVRTBRMFU3U1VGRFNpeERRVUZETzBOQk1sUkdJbjA9IiwiLy8gSW50cnVtZW50YXRpb24gaW5qZWN0aW9uIGNvZGUgaXMgYmFzZWQgb24gcHJpdmFjeWJhZGdlcmZpcmVmb3hcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9FRkZvcmcvcHJpdmFjeWJhZGdlcmZpcmVmb3gvYmxvYi9tYXN0ZXIvZGF0YS9maW5nZXJwcmludGluZy5qc1xuZXhwb3J0IGZ1bmN0aW9uIGdldEluc3RydW1lbnRKUyhldmVudElkLCBzZW5kTWVzc2FnZXNUb0xvZ2dlcikge1xuICAgIC8qXG4gICAgICogSW5zdHJ1bWVudGF0aW9uIGhlbHBlcnNcbiAgICAgKiAoSW5saW5lZCBpbiBvcmRlciBmb3IganNJbnN0cnVtZW50cyB0byBiZSBlYXNpbHkgZXhwb3J0YWJsZSBhcyBhIHN0cmluZylcbiAgICAgKi9cbiAgICAvLyBDb3VudGVyIHRvIGNhcCAjIG9mIGNhbGxzIGxvZ2dlZCBmb3IgZWFjaCBzY3JpcHQvYXBpIGNvbWJpbmF0aW9uXG4gICAgY29uc3QgbWF4TG9nQ291bnQgPSA1MDA7XG4gICAgLy8gbG9nQ291bnRlclxuICAgIGNvbnN0IGxvZ0NvdW50ZXIgPSBuZXcgT2JqZWN0KCk7XG4gICAgLy8gUHJldmVudCBsb2dnaW5nIG9mIGdldHMgYXJpc2luZyBmcm9tIGxvZ2dpbmdcbiAgICBsZXQgaW5Mb2cgPSBmYWxzZTtcbiAgICAvLyBUbyBrZWVwIHRyYWNrIG9mIHRoZSBvcmlnaW5hbCBvcmRlciBvZiBldmVudHNcbiAgICBsZXQgb3JkaW5hbCA9IDA7XG4gICAgLy8gT3B0aW9ucyBmb3IgSlNPcGVyYXRpb25cbiAgICBjb25zdCBKU09wZXJhdGlvbiA9IHtcbiAgICAgICAgY2FsbDogXCJjYWxsXCIsXG4gICAgICAgIGdldDogXCJnZXRcIixcbiAgICAgICAgZ2V0X2ZhaWxlZDogXCJnZXQoZmFpbGVkKVwiLFxuICAgICAgICBnZXRfZnVuY3Rpb246IFwiZ2V0KGZ1bmN0aW9uKVwiLFxuICAgICAgICBzZXQ6IFwic2V0XCIsXG4gICAgICAgIHNldF9mYWlsZWQ6IFwic2V0KGZhaWxlZClcIixcbiAgICAgICAgc2V0X3ByZXZlbnRlZDogXCJzZXQocHJldmVudGVkKVwiLFxuICAgIH07XG4gICAgLy8gUm91Z2ggaW1wbGVtZW50YXRpb25zIG9mIE9iamVjdC5nZXRQcm9wZXJ0eURlc2NyaXB0b3IgYW5kIE9iamVjdC5nZXRQcm9wZXJ0eU5hbWVzXG4gICAgLy8gU2VlIGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6ZXh0ZW5kZWRfb2JqZWN0X2FwaVxuICAgIE9iamVjdC5nZXRQcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiAoc3ViamVjdCwgbmFtZSkge1xuICAgICAgICBpZiAoc3ViamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBnZXQgcHJvcGVydHkgZGVzY3JpcHRvciBmb3IgdW5kZWZpbmVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwZCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc3ViamVjdCwgbmFtZSk7XG4gICAgICAgIGxldCBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihzdWJqZWN0KTtcbiAgICAgICAgd2hpbGUgKHBkID09PSB1bmRlZmluZWQgJiYgcHJvdG8gIT09IG51bGwpIHtcbiAgICAgICAgICAgIHBkID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgbmFtZSk7XG4gICAgICAgICAgICBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90byk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBkO1xuICAgIH07XG4gICAgT2JqZWN0LmdldFByb3BlcnR5TmFtZXMgPSBmdW5jdGlvbiAoc3ViamVjdCkge1xuICAgICAgICBpZiAoc3ViamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBnZXQgcHJvcGVydHkgbmFtZXMgZm9yIHVuZGVmaW5lZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcHJvcHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzdWJqZWN0KTtcbiAgICAgICAgbGV0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHN1YmplY3QpO1xuICAgICAgICB3aGlsZSAocHJvdG8gIT09IG51bGwpIHtcbiAgICAgICAgICAgIHByb3BzID0gcHJvcHMuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3RvKSk7XG4gICAgICAgICAgICBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90byk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRklYTUU6IHJlbW92ZSBkdXBsaWNhdGUgcHJvcGVydHkgbmFtZXMgZnJvbSBwcm9wc1xuICAgICAgICByZXR1cm4gcHJvcHM7XG4gICAgfTtcbiAgICAvLyBkZWJvdW5jZSAtIGZyb20gVW5kZXJzY29yZSB2MS42LjBcbiAgICBmdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBpbW1lZGlhdGUgPSBmYWxzZSkge1xuICAgICAgICBsZXQgdGltZW91dCwgYXJncywgY29udGV4dCwgdGltZXN0YW1wLCByZXN1bHQ7XG4gICAgICAgIGNvbnN0IGxhdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgbGFzdCA9IERhdGUubm93KCkgLSB0aW1lc3RhbXA7XG4gICAgICAgICAgICBpZiAobGFzdCA8IHdhaXQpIHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKCFpbW1lZGlhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgIHRpbWVzdGFtcCA9IERhdGUubm93KCk7XG4gICAgICAgICAgICBjb25zdCBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgICAgICAgaWYgKCF0aW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNhbGxOb3cpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGdlbmVyYXRlcyBhIHBhdGggZm9yIGFuIGVsZW1lbnRcbiAgICBmdW5jdGlvbiBnZXRQYXRoVG9Eb21FbGVtZW50KGVsZW1lbnQsIHZpc2liaWxpdHlBdHRyID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQgPT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50LnRhZ05hbWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiTlVMTC9cIiArIGVsZW1lbnQudGFnTmFtZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc2libGluZ0luZGV4ID0gMTtcbiAgICAgICAgY29uc3Qgc2libGluZ3MgPSBlbGVtZW50LnBhcmVudE5vZGUuY2hpbGROb2RlcztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaWJsaW5ncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgc2libGluZyA9IHNpYmxpbmdzW2ldO1xuICAgICAgICAgICAgaWYgKHNpYmxpbmcgPT09IGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBsZXQgcGF0aCA9IGdldFBhdGhUb0RvbUVsZW1lbnQoZWxlbWVudC5wYXJlbnROb2RlLCB2aXNpYmlsaXR5QXR0cik7XG4gICAgICAgICAgICAgICAgcGF0aCArPSBcIi9cIiArIGVsZW1lbnQudGFnTmFtZSArIFwiW1wiICsgc2libGluZ0luZGV4O1xuICAgICAgICAgICAgICAgIHBhdGggKz0gXCIsXCIgKyBlbGVtZW50LmlkO1xuICAgICAgICAgICAgICAgIHBhdGggKz0gXCIsXCIgKyBlbGVtZW50LmNsYXNzTmFtZTtcbiAgICAgICAgICAgICAgICBpZiAodmlzaWJpbGl0eUF0dHIpIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0aCArPSBcIixcIiArIGVsZW1lbnQuaGlkZGVuO1xuICAgICAgICAgICAgICAgICAgICBwYXRoICs9IFwiLFwiICsgZWxlbWVudC5zdHlsZS5kaXNwbGF5O1xuICAgICAgICAgICAgICAgICAgICBwYXRoICs9IFwiLFwiICsgZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC50YWdOYW1lID09PSBcIkFcIikge1xuICAgICAgICAgICAgICAgICAgICBwYXRoICs9IFwiLFwiICsgZWxlbWVudC5ocmVmO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwYXRoICs9IFwiXVwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXRoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNpYmxpbmcubm9kZVR5cGUgPT09IDEgJiYgc2libGluZy50YWdOYW1lID09PSBlbGVtZW50LnRhZ05hbWUpIHtcbiAgICAgICAgICAgICAgICBzaWJsaW5nSW5kZXgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBIZWxwZXIgZm9yIEpTT05pZnlpbmcgb2JqZWN0c1xuICAgIGZ1bmN0aW9uIHNlcmlhbGl6ZU9iamVjdChvYmplY3QsIHN0cmluZ2lmeUZ1bmN0aW9ucyA9IGZhbHNlKSB7XG4gICAgICAgIC8vIEhhbmRsZSBwZXJtaXNzaW9ucyBlcnJvcnNcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChvYmplY3QgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJudWxsXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9iamVjdCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0cmluZ2lmeUZ1bmN0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqZWN0LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJGVU5DVElPTlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0ICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHNlZW5PYmplY3RzID0gW107XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqZWN0LCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJudWxsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RyaW5naWZ5RnVuY3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkZVTkNUSU9OXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgd3JhcHBpbmcgb24gY29udGVudCBvYmplY3RzXG4gICAgICAgICAgICAgICAgICAgIGlmIChcIndyYXBwZWRKU09iamVjdFwiIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLndyYXBwZWRKU09iamVjdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBTZXJpYWxpemUgRE9NIGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0UGF0aFRvRG9tRWxlbWVudCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gUHJldmVudCBzZXJpYWxpemF0aW9uIGN5Y2xlc1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSBcIlwiIHx8IHNlZW5PYmplY3RzLmluZGV4T2YodmFsdWUpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Vlbk9iamVjdHMucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJPcGVuV1BNOiBTRVJJQUxJWkFUSU9OIEVSUk9SOiBcIiArIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBcIlNFUklBTElaQVRJT04gRVJST1I6IFwiICsgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gdXBkYXRlQ291bnRlckFuZENoZWNrSWZPdmVyKHNjcmlwdFVybCwgc3ltYm9sKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHNjcmlwdFVybCArIFwifFwiICsgc3ltYm9sO1xuICAgICAgICBpZiAoa2V5IGluIGxvZ0NvdW50ZXIgJiYgbG9nQ291bnRlcltrZXldID49IG1heExvZ0NvdW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghKGtleSBpbiBsb2dDb3VudGVyKSkge1xuICAgICAgICAgICAgbG9nQ291bnRlcltrZXldID0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxvZ0NvdW50ZXJba2V5XSArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gRm9yIGdldHMsIHNldHMsIGV0Yy4gb24gYSBzaW5nbGUgdmFsdWVcbiAgICBmdW5jdGlvbiBsb2dWYWx1ZShpbnN0cnVtZW50ZWRWYXJpYWJsZU5hbWUsIHZhbHVlLCBvcGVyYXRpb24sIC8vIGZyb20gSlNPcGVyYXRpb24gb2JqZWN0IHBsZWFzZVxuICAgIGNhbGxDb250ZXh0LCBsb2dTZXR0aW5ncykge1xuICAgICAgICBpZiAoaW5Mb2cpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpbkxvZyA9IHRydWU7XG4gICAgICAgIGNvbnN0IG92ZXJMaW1pdCA9IHVwZGF0ZUNvdW50ZXJBbmRDaGVja0lmT3ZlcihjYWxsQ29udGV4dC5zY3JpcHRVcmwsIGluc3RydW1lbnRlZFZhcmlhYmxlTmFtZSk7XG4gICAgICAgIGlmIChvdmVyTGltaXQpIHtcbiAgICAgICAgICAgIGluTG9nID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbXNnID0ge1xuICAgICAgICAgICAgb3BlcmF0aW9uLFxuICAgICAgICAgICAgc3ltYm9sOiBpbnN0cnVtZW50ZWRWYXJpYWJsZU5hbWUsXG4gICAgICAgICAgICB2YWx1ZTogc2VyaWFsaXplT2JqZWN0KHZhbHVlLCBsb2dTZXR0aW5ncy5sb2dGdW5jdGlvbnNBc1N0cmluZ3MpLFxuICAgICAgICAgICAgc2NyaXB0VXJsOiBjYWxsQ29udGV4dC5zY3JpcHRVcmwsXG4gICAgICAgICAgICBzY3JpcHRMaW5lOiBjYWxsQ29udGV4dC5zY3JpcHRMaW5lLFxuICAgICAgICAgICAgc2NyaXB0Q29sOiBjYWxsQ29udGV4dC5zY3JpcHRDb2wsXG4gICAgICAgICAgICBmdW5jTmFtZTogY2FsbENvbnRleHQuZnVuY05hbWUsXG4gICAgICAgICAgICBzY3JpcHRMb2NFdmFsOiBjYWxsQ29udGV4dC5zY3JpcHRMb2NFdmFsLFxuICAgICAgICAgICAgY2FsbFN0YWNrOiBjYWxsQ29udGV4dC5jYWxsU3RhY2ssXG4gICAgICAgICAgICBvcmRpbmFsOiBvcmRpbmFsKyssXG4gICAgICAgIH07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZW5kKFwibG9nVmFsdWVcIiwgbXNnKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiT3BlbldQTTogVW5zdWNjZXNzZnVsIHZhbHVlIGxvZyFcIik7XG4gICAgICAgICAgICBsb2dFcnJvclRvQ29uc29sZShlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgaW5Mb2cgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8gRm9yIGZ1bmN0aW9uc1xuICAgIGZ1bmN0aW9uIGxvZ0NhbGwoaW5zdHJ1bWVudGVkRnVuY3Rpb25OYW1lLCBhcmdzLCBjYWxsQ29udGV4dCwgbG9nU2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKGluTG9nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaW5Mb2cgPSB0cnVlO1xuICAgICAgICBjb25zdCBvdmVyTGltaXQgPSB1cGRhdGVDb3VudGVyQW5kQ2hlY2tJZk92ZXIoY2FsbENvbnRleHQuc2NyaXB0VXJsLCBpbnN0cnVtZW50ZWRGdW5jdGlvbk5hbWUpO1xuICAgICAgICBpZiAob3ZlckxpbWl0KSB7XG4gICAgICAgICAgICBpbkxvZyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBDb252ZXJ0IHNwZWNpYWwgYXJndW1lbnRzIGFycmF5IHRvIGEgc3RhbmRhcmQgYXJyYXkgZm9yIEpTT05pZnlpbmdcbiAgICAgICAgICAgIGNvbnN0IHNlcmlhbEFyZ3MgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBzZXJpYWxBcmdzLnB1c2goc2VyaWFsaXplT2JqZWN0KGFyZywgbG9nU2V0dGluZ3MubG9nRnVuY3Rpb25zQXNTdHJpbmdzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBtc2cgPSB7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBKU09wZXJhdGlvbi5jYWxsLFxuICAgICAgICAgICAgICAgIHN5bWJvbDogaW5zdHJ1bWVudGVkRnVuY3Rpb25OYW1lLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHNlcmlhbEFyZ3MsXG4gICAgICAgICAgICAgICAgdmFsdWU6IFwiXCIsXG4gICAgICAgICAgICAgICAgc2NyaXB0VXJsOiBjYWxsQ29udGV4dC5zY3JpcHRVcmwsXG4gICAgICAgICAgICAgICAgc2NyaXB0TGluZTogY2FsbENvbnRleHQuc2NyaXB0TGluZSxcbiAgICAgICAgICAgICAgICBzY3JpcHRDb2w6IGNhbGxDb250ZXh0LnNjcmlwdENvbCxcbiAgICAgICAgICAgICAgICBmdW5jTmFtZTogY2FsbENvbnRleHQuZnVuY05hbWUsXG4gICAgICAgICAgICAgICAgc2NyaXB0TG9jRXZhbDogY2FsbENvbnRleHQuc2NyaXB0TG9jRXZhbCxcbiAgICAgICAgICAgICAgICBjYWxsU3RhY2s6IGNhbGxDb250ZXh0LmNhbGxTdGFjayxcbiAgICAgICAgICAgICAgICBvcmRpbmFsOiBvcmRpbmFsKyssXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgc2VuZChcImxvZ0NhbGxcIiwgbXNnKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiT3BlbldQTTogVW5zdWNjZXNzZnVsIGNhbGwgbG9nOiBcIiArIGluc3RydW1lbnRlZEZ1bmN0aW9uTmFtZSk7XG4gICAgICAgICAgICBsb2dFcnJvclRvQ29uc29sZShlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgaW5Mb2cgPSBmYWxzZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gbG9nRXJyb3JUb0NvbnNvbGUoZXJyb3IsIGNvbnRleHQgPSBmYWxzZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiT3BlbldQTTogRXJyb3IgbmFtZTogXCIgKyBlcnJvci5uYW1lKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIk9wZW5XUE06IEVycm9yIG1lc3NhZ2U6IFwiICsgZXJyb3IubWVzc2FnZSk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJPcGVuV1BNOiBFcnJvciBmaWxlbmFtZTogXCIgKyBlcnJvci5maWxlTmFtZSk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJPcGVuV1BNOiBFcnJvciBsaW5lIG51bWJlcjogXCIgKyBlcnJvci5saW5lTnVtYmVyKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIk9wZW5XUE06IEVycm9yIHN0YWNrOiBcIiArIGVycm9yLnN0YWNrKTtcbiAgICAgICAgaWYgKGNvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJPcGVuV1BNOiBFcnJvciBjb250ZXh0OiBcIiArIEpTT04uc3RyaW5naWZ5KGNvbnRleHQpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBIZWxwZXIgdG8gZ2V0IG9yaWdpbmF0aW5nIHNjcmlwdCB1cmxzXG4gICAgZnVuY3Rpb24gZ2V0U3RhY2tUcmFjZSgpIHtcbiAgICAgICAgbGV0IHN0YWNrO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgc3RhY2sgPSBlcnIuc3RhY2s7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0YWNrO1xuICAgIH1cbiAgICAvLyBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzUyMDIxODVcbiAgICBjb25zdCByc3BsaXQgPSBmdW5jdGlvbiAoc291cmNlLCBzZXAsIG1heHNwbGl0KSB7XG4gICAgICAgIGNvbnN0IHNwbGl0ID0gc291cmNlLnNwbGl0KHNlcCk7XG4gICAgICAgIHJldHVybiBtYXhzcGxpdFxuICAgICAgICAgICAgPyBbc3BsaXQuc2xpY2UoMCwgLW1heHNwbGl0KS5qb2luKHNlcCldLmNvbmNhdChzcGxpdC5zbGljZSgtbWF4c3BsaXQpKVxuICAgICAgICAgICAgOiBzcGxpdDtcbiAgICB9O1xuICAgIGZ1bmN0aW9uIGdldE9yaWdpbmF0aW5nU2NyaXB0Q29udGV4dChnZXRDYWxsU3RhY2sgPSBmYWxzZSkge1xuICAgICAgICBjb25zdCB0cmFjZSA9IGdldFN0YWNrVHJhY2UoKVxuICAgICAgICAgICAgLnRyaW0oKVxuICAgICAgICAgICAgLnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICAvLyByZXR1cm4gYSBjb250ZXh0IG9iamVjdCBldmVuIGlmIHRoZXJlIGlzIGFuIGVycm9yXG4gICAgICAgIGNvbnN0IGVtcHR5X2NvbnRleHQgPSB7XG4gICAgICAgICAgICBzY3JpcHRVcmw6IFwiXCIsXG4gICAgICAgICAgICBzY3JpcHRMaW5lOiBcIlwiLFxuICAgICAgICAgICAgc2NyaXB0Q29sOiBcIlwiLFxuICAgICAgICAgICAgZnVuY05hbWU6IFwiXCIsXG4gICAgICAgICAgICBzY3JpcHRMb2NFdmFsOiBcIlwiLFxuICAgICAgICAgICAgY2FsbFN0YWNrOiBcIlwiLFxuICAgICAgICB9O1xuICAgICAgICBpZiAodHJhY2UubGVuZ3RoIDwgNCkge1xuICAgICAgICAgICAgcmV0dXJuIGVtcHR5X2NvbnRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gMCwgMSBhbmQgMiBhcmUgT3BlbldQTSdzIG93biBmdW5jdGlvbnMgKGUuZy4gZ2V0U3RhY2tUcmFjZSksIHNraXAgdGhlbS5cbiAgICAgICAgY29uc3QgY2FsbFNpdGUgPSB0cmFjZVszXTtcbiAgICAgICAgaWYgKCFjYWxsU2l0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGVtcHR5X2NvbnRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgLypcbiAgICAgICAgICogU3RhY2sgZnJhbWUgZm9ybWF0IGlzIHNpbXBseTogRlVOQ19OQU1FQEZJTEVOQU1FOkxJTkVfTk86Q09MVU1OX05PXG4gICAgICAgICAqXG4gICAgICAgICAqIElmIGV2YWwgb3IgRnVuY3Rpb24gaXMgaW52b2x2ZWQgd2UgaGF2ZSBhbiBhZGRpdGlvbmFsIHBhcnQgYWZ0ZXIgdGhlIEZJTEVOQU1FLCBlLmcuOlxuICAgICAgICAgKiBGVU5DX05BTUVARklMRU5BTUUgbGluZSAxMjMgPiBldmFsIGxpbmUgMSA+IGV2YWw6TElORV9OTzpDT0xVTU5fTk9cbiAgICAgICAgICogb3IgRlVOQ19OQU1FQEZJTEVOQU1FIGxpbmUgMjM0ID4gRnVuY3Rpb246TElORV9OTzpDT0xVTU5fTk9cbiAgICAgICAgICpcbiAgICAgICAgICogV2Ugc3RvcmUgdGhlIHBhcnQgYmV0d2VlbiB0aGUgRklMRU5BTUUgYW5kIHRoZSBMSU5FX05PIGluIHNjcmlwdExvY0V2YWxcbiAgICAgICAgICovXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2NyaXB0VXJsID0gXCJcIjtcbiAgICAgICAgICAgIGxldCBzY3JpcHRMb2NFdmFsID0gXCJcIjsgLy8gZm9yIGV2YWwgb3IgRnVuY3Rpb24gY2FsbHNcbiAgICAgICAgICAgIGNvbnN0IGNhbGxTaXRlUGFydHMgPSBjYWxsU2l0ZS5zcGxpdChcIkBcIik7XG4gICAgICAgICAgICBjb25zdCBmdW5jTmFtZSA9IGNhbGxTaXRlUGFydHNbMF0gfHwgXCJcIjtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gcnNwbGl0KGNhbGxTaXRlUGFydHNbMV0sIFwiOlwiLCAyKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbk5vID0gaXRlbXNbaXRlbXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBjb25zdCBsaW5lTm8gPSBpdGVtc1tpdGVtcy5sZW5ndGggLSAyXTtcbiAgICAgICAgICAgIGNvbnN0IHNjcmlwdEZpbGVOYW1lID0gaXRlbXNbaXRlbXMubGVuZ3RoIC0gM10gfHwgXCJcIjtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVOb0lkeCA9IHNjcmlwdEZpbGVOYW1lLmluZGV4T2YoXCIgbGluZSBcIik7IC8vIGxpbmUgaW4gdGhlIFVSTCBtZWFucyBldmFsIG9yIEZ1bmN0aW9uXG4gICAgICAgICAgICBpZiAobGluZU5vSWR4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHNjcmlwdFVybCA9IHNjcmlwdEZpbGVOYW1lOyAvLyBUT0RPOiBzb21ldGltZXMgd2UgaGF2ZSBmaWxlbmFtZSBvbmx5LCBlLmcuIFhYLmpzXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY3JpcHRVcmwgPSBzY3JpcHRGaWxlTmFtZS5zbGljZSgwLCBsaW5lTm9JZHgpO1xuICAgICAgICAgICAgICAgIHNjcmlwdExvY0V2YWwgPSBzY3JpcHRGaWxlTmFtZS5zbGljZShsaW5lTm9JZHggKyAxLCBzY3JpcHRGaWxlTmFtZS5sZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY2FsbENvbnRleHQgPSB7XG4gICAgICAgICAgICAgICAgc2NyaXB0VXJsLFxuICAgICAgICAgICAgICAgIHNjcmlwdExpbmU6IGxpbmVObyxcbiAgICAgICAgICAgICAgICBzY3JpcHRDb2w6IGNvbHVtbk5vLFxuICAgICAgICAgICAgICAgIGZ1bmNOYW1lLFxuICAgICAgICAgICAgICAgIHNjcmlwdExvY0V2YWwsXG4gICAgICAgICAgICAgICAgY2FsbFN0YWNrOiBnZXRDYWxsU3RhY2tcbiAgICAgICAgICAgICAgICAgICAgPyB0cmFjZVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNsaWNlKDMpXG4gICAgICAgICAgICAgICAgICAgICAgICAuam9pbihcIlxcblwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRyaW0oKVxuICAgICAgICAgICAgICAgICAgICA6IFwiXCIsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxDb250ZXh0O1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk9wZW5XUE06IEVycm9yIHBhcnNpbmcgdGhlIHNjcmlwdCBjb250ZXh0XCIsIGUudG9TdHJpbmcoKSwgY2FsbFNpdGUpO1xuICAgICAgICAgICAgcmV0dXJuIGVtcHR5X2NvbnRleHQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gaXNPYmplY3Qob2JqZWN0LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgbGV0IHByb3BlcnR5O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcHJvcGVydHkgPSBvYmplY3RbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcGVydHkgPT09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIG51bGwgaXMgdHlwZSBcIm9iamVjdFwiXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHR5cGVvZiBwcm9wZXJ0eSA9PT0gXCJvYmplY3RcIjtcbiAgICB9XG4gICAgLy8gTG9nIGNhbGxzIHRvIGEgZ2l2ZW4gZnVuY3Rpb25cbiAgICAvLyBUaGlzIGhlbHBlciBmdW5jdGlvbiByZXR1cm5zIGEgd3JhcHBlciBhcm91bmQgYGZ1bmNgIHdoaWNoIGxvZ3MgY2FsbHNcbiAgICAvLyB0byBgZnVuY2AuIGBvYmplY3ROYW1lYCBhbmQgYG1ldGhvZE5hbWVgIGFyZSB1c2VkIHN0cmljdGx5IHRvIGlkZW50aWZ5XG4gICAgLy8gd2hpY2ggb2JqZWN0IG1ldGhvZCBgZnVuY2AgaXMgY29taW5nIGZyb20gaW4gdGhlIGxvZ3NcbiAgICBmdW5jdGlvbiBpbnN0cnVtZW50RnVuY3Rpb24ob2JqZWN0TmFtZSwgbWV0aG9kTmFtZSwgZnVuYywgbG9nU2V0dGluZ3MpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbGxDb250ZXh0ID0gZ2V0T3JpZ2luYXRpbmdTY3JpcHRDb250ZXh0KGxvZ1NldHRpbmdzLmxvZ0NhbGxTdGFjayk7XG4gICAgICAgICAgICBsb2dDYWxsKG9iamVjdE5hbWUgKyBcIi5cIiArIG1ldGhvZE5hbWUsIGFyZ3VtZW50cywgY2FsbENvbnRleHQsIGxvZ1NldHRpbmdzKTtcbiAgICAgICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vIExvZyBwcm9wZXJ0aWVzIG9mIHByb3RvdHlwZXMgYW5kIG9iamVjdHNcbiAgICBmdW5jdGlvbiBpbnN0cnVtZW50T2JqZWN0UHJvcGVydHkob2JqZWN0LCBvYmplY3ROYW1lLCBwcm9wZXJ0eU5hbWUsIGxvZ1NldHRpbmdzKSB7XG4gICAgICAgIGlmICghb2JqZWN0IHx8XG4gICAgICAgICAgICAhb2JqZWN0TmFtZSB8fFxuICAgICAgICAgICAgIXByb3BlcnR5TmFtZSB8fFxuICAgICAgICAgICAgcHJvcGVydHlOYW1lID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcmVxdWVzdCB0byBpbnN0cnVtZW50T2JqZWN0UHJvcGVydHkuXG4gICAgICAgIE9iamVjdDogJHtvYmplY3R9XG4gICAgICAgIG9iamVjdE5hbWU6ICR7b2JqZWN0TmFtZX1cbiAgICAgICAgcHJvcGVydHlOYW1lOiAke3Byb3BlcnR5TmFtZX1cbiAgICAgICAgYCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU3RvcmUgb3JpZ2luYWwgZGVzY3JpcHRvciBpbiBjbG9zdXJlXG4gICAgICAgIGNvbnN0IHByb3BEZXNjID0gT2JqZWN0LmdldFByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5TmFtZSk7XG4gICAgICAgIC8vIFByb3BlcnR5IGRlc2NyaXB0b3IgbXVzdCBleGlzdCB1bmxlc3Mgd2UgYXJlIGluc3RydW1lbnRpbmcgYSBub25FeGlzdGluZyBwcm9wZXJ0eVxuICAgICAgICBpZiAoIXByb3BEZXNjICYmXG4gICAgICAgICAgICAhbG9nU2V0dGluZ3Mubm9uRXhpc3RpbmdQcm9wZXJ0aWVzVG9JbnN0cnVtZW50LmluY2x1ZGVzKHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJQcm9wZXJ0eSBkZXNjcmlwdG9yIG5vdCBmb3VuZCBmb3JcIiwgb2JqZWN0TmFtZSwgcHJvcGVydHlOYW1lLCBvYmplY3QpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIFByb3BlcnR5IGRlc2NyaXB0b3IgZm9yIHVuZGVmaW5lZCBwcm9wZXJ0aWVzXG4gICAgICAgIGxldCB1bmRlZmluZWRQcm9wVmFsdWU7XG4gICAgICAgIGNvbnN0IHVuZGVmaW5lZFByb3BEZXNjID0ge1xuICAgICAgICAgICAgZ2V0OiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFByb3BWYWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IHZhbHVlID0+IHtcbiAgICAgICAgICAgICAgICB1bmRlZmluZWRQcm9wVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgfTtcbiAgICAgICAgLy8gSW5zdHJ1bWVudCBkYXRhIG9yIGFjY2Vzc29yIHByb3BlcnR5IGRlc2NyaXB0b3JzXG4gICAgICAgIGNvbnN0IG9yaWdpbmFsR2V0dGVyID0gcHJvcERlc2MgPyBwcm9wRGVzYy5nZXQgOiB1bmRlZmluZWRQcm9wRGVzYy5nZXQ7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsU2V0dGVyID0gcHJvcERlc2MgPyBwcm9wRGVzYy5zZXQgOiB1bmRlZmluZWRQcm9wRGVzYy5zZXQ7XG4gICAgICAgIGxldCBvcmlnaW5hbFZhbHVlID0gcHJvcERlc2MgPyBwcm9wRGVzYy52YWx1ZSA6IHVuZGVmaW5lZFByb3BWYWx1ZTtcbiAgICAgICAgLy8gV2Ugb3ZlcndyaXRlIGJvdGggZGF0YSBhbmQgYWNjZXNzb3IgcHJvcGVydGllcyBhcyBhbiBpbnN0cnVtZW50ZWRcbiAgICAgICAgLy8gYWNjZXNzb3IgcHJvcGVydHlcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgcHJvcGVydHlOYW1lLCB7XG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICBnZXQ6IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9yaWdQcm9wZXJ0eTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FsbENvbnRleHQgPSBnZXRPcmlnaW5hdGluZ1NjcmlwdENvbnRleHQobG9nU2V0dGluZ3MubG9nQ2FsbFN0YWNrKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5zdHJ1bWVudGVkVmFyaWFibGVOYW1lID0gYCR7b2JqZWN0TmFtZX0uJHtwcm9wZXJ0eU5hbWV9YDtcbiAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IG9yaWdpbmFsIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIGlmICghcHJvcERlc2MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHVuZGVmaW5lZCBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ1Byb3BlcnR5ID0gdW5kZWZpbmVkUHJvcFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG9yaWdpbmFsR2V0dGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBhY2Nlc3NvciBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ1Byb3BlcnR5ID0gb3JpZ2luYWxHZXR0ZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChcInZhbHVlXCIgaW4gcHJvcERlc2MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGRhdGEgcHJvcGVydHlcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdQcm9wZXJ0eSA9IG9yaWdpbmFsVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBQcm9wZXJ0eSBkZXNjcmlwdG9yIGZvciAke2luc3RydW1lbnRlZFZhcmlhYmxlTmFtZX0gZG9lc24ndCBoYXZlIGdldHRlciBvciB2YWx1ZT9gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ1ZhbHVlKGluc3RydW1lbnRlZFZhcmlhYmxlTmFtZSwgXCJcIiwgSlNPcGVyYXRpb24uZ2V0X2ZhaWxlZCwgY2FsbENvbnRleHQsIGxvZ1NldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBMb2cgYGdldHNgIGV4Y2VwdCB0aG9zZSB0aGF0IGhhdmUgaW5zdHJ1bWVudGVkIHJldHVybiB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgLy8gKiBBbGwgcmV0dXJuZWQgZnVuY3Rpb25zIGFyZSBpbnN0cnVtZW50ZWQgd2l0aCBhIHdyYXBwZXJcbiAgICAgICAgICAgICAgICAgICAgLy8gKiBSZXR1cm5lZCBvYmplY3RzIG1heSBiZSBpbnN0cnVtZW50ZWQgaWYgcmVjdXJzaXZlXG4gICAgICAgICAgICAgICAgICAgIC8vICAgaW5zdHJ1bWVudGF0aW9uIGlzIGVuYWJsZWQgYW5kIHRoaXMgaXNuJ3QgYXQgdGhlIGRlcHRoIGxpbWl0LlxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9yaWdQcm9wZXJ0eSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9nU2V0dGluZ3MubG9nRnVuY3Rpb25HZXRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nVmFsdWUoaW5zdHJ1bWVudGVkVmFyaWFibGVOYW1lLCBvcmlnUHJvcGVydHksIEpTT3BlcmF0aW9uLmdldF9mdW5jdGlvbiwgY2FsbENvbnRleHQsIGxvZ1NldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc3RydW1lbnRlZEZ1bmN0aW9uV3JhcHBlciA9IGluc3RydW1lbnRGdW5jdGlvbihvYmplY3ROYW1lLCBwcm9wZXJ0eU5hbWUsIG9yaWdQcm9wZXJ0eSwgbG9nU2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVzdG9yZSB0aGUgb3JpZ2luYWwgcHJvdG90eXBlIGFuZCBjb25zdHJ1Y3RvciBzbyB0aGF0IGluc3RydW1lbnRlZCBjbGFzc2VzIHJlbWFpbiBpbnRhY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IFRoaXMgbWF5IGhhdmUgaW50cm9kdWNlZCBwcm90b3R5cGUgcG9sbHV0aW9uIGFzIHBlciBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9PcGVuV1BNL2lzc3Vlcy80NzFcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcmlnUHJvcGVydHkucHJvdG90eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zdHJ1bWVudGVkRnVuY3Rpb25XcmFwcGVyLnByb3RvdHlwZSA9IG9yaWdQcm9wZXJ0eS5wcm90b3R5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9yaWdQcm9wZXJ0eS5wcm90b3R5cGUuY29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zdHJ1bWVudGVkRnVuY3Rpb25XcmFwcGVyLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmlnUHJvcGVydHkucHJvdG90eXBlLmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnN0cnVtZW50ZWRGdW5jdGlvbldyYXBwZXI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIG9yaWdQcm9wZXJ0eSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nU2V0dGluZ3MucmVjdXJzaXZlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dTZXR0aW5ncy5kZXB0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnUHJvcGVydHk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dWYWx1ZShpbnN0cnVtZW50ZWRWYXJpYWJsZU5hbWUsIG9yaWdQcm9wZXJ0eSwgSlNPcGVyYXRpb24uZ2V0LCBjYWxsQ29udGV4dCwgbG9nU2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdQcm9wZXJ0eTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSgpLFxuICAgICAgICAgICAgc2V0OiAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FsbENvbnRleHQgPSBnZXRPcmlnaW5hdGluZ1NjcmlwdENvbnRleHQobG9nU2V0dGluZ3MubG9nQ2FsbFN0YWNrKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5zdHJ1bWVudGVkVmFyaWFibGVOYW1lID0gYCR7b2JqZWN0TmFtZX0uJHtwcm9wZXJ0eU5hbWV9YDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJldHVyblZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAvLyBQcmV2ZW50IHNldHMgZm9yIGZ1bmN0aW9ucyBhbmQgb2JqZWN0cyBpZiBlbmFibGVkXG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2dTZXR0aW5ncy5wcmV2ZW50U2V0cyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKHR5cGVvZiBvcmlnaW5hbFZhbHVlID09PSBcImZ1bmN0aW9uXCIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2Ygb3JpZ2luYWxWYWx1ZSA9PT0gXCJvYmplY3RcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ1ZhbHVlKGluc3RydW1lbnRlZFZhcmlhYmxlTmFtZSwgdmFsdWUsIEpTT3BlcmF0aW9uLnNldF9wcmV2ZW50ZWQsIGNhbGxDb250ZXh0LCBsb2dTZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0IG5ldyB2YWx1ZSB0byBvcmlnaW5hbCBzZXR0ZXIvbG9jYXRpb25cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9yaWdpbmFsU2V0dGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBhY2Nlc3NvciBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSBvcmlnaW5hbFNldHRlci5jYWxsKHRoaXMsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChcInZhbHVlXCIgaW4gcHJvcERlc2MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluTG9nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QuaXNQcm90b3R5cGVPZih0aGlzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBwcm9wZXJ0eU5hbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5Mb2cgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFByb3BlcnR5IGRlc2NyaXB0b3IgZm9yICR7aW5zdHJ1bWVudGVkVmFyaWFibGVOYW1lfSBkb2Vzbid0IGhhdmUgc2V0dGVyIG9yIHZhbHVlP2ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nVmFsdWUoaW5zdHJ1bWVudGVkVmFyaWFibGVOYW1lLCB2YWx1ZSwgSlNPcGVyYXRpb24uc2V0X2ZhaWxlZCwgY2FsbENvbnRleHQsIGxvZ1NldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsb2dWYWx1ZShpbnN0cnVtZW50ZWRWYXJpYWJsZU5hbWUsIHZhbHVlLCBKU09wZXJhdGlvbi5zZXQsIGNhbGxDb250ZXh0LCBsb2dTZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSkoKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGluc3RydW1lbnRPYmplY3Qob2JqZWN0LCBpbnN0cnVtZW50ZWROYW1lLCBsb2dTZXR0aW5ncykge1xuICAgICAgICAvLyBTZXQgcHJvcGVydGllc1RvSW5zdHJ1bWVudCB0byBudWxsIHRvIGZvcmNlIG5vIHByb3BlcnRpZXMgdG8gYmUgaW5zdHJ1bWVudGVkLlxuICAgICAgICAvLyAodGhpcyBpcyB1c2VkIGluIHRlc3RpbmcgZm9yIGV4YW1wbGUpXG4gICAgICAgIGxldCBwcm9wZXJ0aWVzVG9JbnN0cnVtZW50O1xuICAgICAgICBpZiAobG9nU2V0dGluZ3MucHJvcGVydGllc1RvSW5zdHJ1bWVudCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcHJvcGVydGllc1RvSW5zdHJ1bWVudCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGxvZ1NldHRpbmdzLnByb3BlcnRpZXNUb0luc3RydW1lbnQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzVG9JbnN0cnVtZW50ID0gT2JqZWN0LmdldFByb3BlcnR5TmFtZXMob2JqZWN0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXNUb0luc3RydW1lbnQgPSBsb2dTZXR0aW5ncy5wcm9wZXJ0aWVzVG9JbnN0cnVtZW50O1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgcHJvcGVydHlOYW1lIG9mIHByb3BlcnRpZXNUb0luc3RydW1lbnQpIHtcbiAgICAgICAgICAgIGlmIChsb2dTZXR0aW5ncy5leGNsdWRlZFByb3BlcnRpZXMuaW5jbHVkZXMocHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSWYgYHJlY3Vyc2l2ZWAgZmxhZyBzZXQgd2Ugd2FudCB0byByZWN1cnNpdmVseSBpbnN0cnVtZW50IGFueVxuICAgICAgICAgICAgLy8gb2JqZWN0IHByb3BlcnRpZXMgdGhhdCBhcmVuJ3QgdGhlIHByb3RvdHlwZSBvYmplY3QuXG4gICAgICAgICAgICBpZiAobG9nU2V0dGluZ3MucmVjdXJzaXZlICYmXG4gICAgICAgICAgICAgICAgbG9nU2V0dGluZ3MuZGVwdGggPiAwICYmXG4gICAgICAgICAgICAgICAgaXNPYmplY3Qob2JqZWN0LCBwcm9wZXJ0eU5hbWUpICYmXG4gICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lICE9PSBcIl9fcHJvdG9fX1wiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3SW5zdHJ1bWVudGVkTmFtZSA9IGAke2luc3RydW1lbnRlZE5hbWV9LiR7cHJvcGVydHlOYW1lfWA7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3TG9nU2V0dGluZ3MgPSB7IC4uLmxvZ1NldHRpbmdzIH07XG4gICAgICAgICAgICAgICAgbmV3TG9nU2V0dGluZ3MuZGVwdGggPSBsb2dTZXR0aW5ncy5kZXB0aCAtIDE7XG4gICAgICAgICAgICAgICAgbmV3TG9nU2V0dGluZ3MucHJvcGVydGllc1RvSW5zdHJ1bWVudCA9IFtdO1xuICAgICAgICAgICAgICAgIGluc3RydW1lbnRPYmplY3Qob2JqZWN0W3Byb3BlcnR5TmFtZV0sIG5ld0luc3RydW1lbnRlZE5hbWUsIG5ld0xvZ1NldHRpbmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaW5zdHJ1bWVudE9iamVjdFByb3BlcnR5KG9iamVjdCwgaW5zdHJ1bWVudGVkTmFtZSwgcHJvcGVydHlOYW1lLCBsb2dTZXR0aW5ncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBUeXBlRXJyb3IgJiZcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IubWVzc2FnZS5pbmNsdWRlcyhcImNhbid0IHJlZGVmaW5lIG5vbi1jb25maWd1cmFibGUgcHJvcGVydHlcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBDYW5ub3QgaW5zdHJ1bWVudCBub24tY29uZmlndXJhYmxlIHByb3BlcnR5OiAke2luc3RydW1lbnRlZE5hbWV9OiR7cHJvcGVydHlOYW1lfWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nRXJyb3JUb0NvbnNvbGUoZXJyb3IsIHsgaW5zdHJ1bWVudGVkTmFtZSwgcHJvcGVydHlOYW1lIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHByb3BlcnR5TmFtZSBvZiBsb2dTZXR0aW5ncy5ub25FeGlzdGluZ1Byb3BlcnRpZXNUb0luc3RydW1lbnQpIHtcbiAgICAgICAgICAgIGlmIChsb2dTZXR0aW5ncy5leGNsdWRlZFByb3BlcnRpZXMuaW5jbHVkZXMocHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpbnN0cnVtZW50T2JqZWN0UHJvcGVydHkob2JqZWN0LCBpbnN0cnVtZW50ZWROYW1lLCBwcm9wZXJ0eU5hbWUsIGxvZ1NldHRpbmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGxvZ0Vycm9yVG9Db25zb2xlKGVycm9yLCB7IGluc3RydW1lbnRlZE5hbWUsIHByb3BlcnR5TmFtZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBzZW5kRmFjdG9yeSA9IGZ1bmN0aW9uIChldmVudElkLCAkc2VuZE1lc3NhZ2VzVG9Mb2dnZXIpIHtcbiAgICAgICAgbGV0IG1lc3NhZ2VzID0gW107XG4gICAgICAgIC8vIGRlYm91bmNlIHNlbmRpbmcgcXVldWVkIG1lc3NhZ2VzXG4gICAgICAgIGNvbnN0IF9zZW5kID0gZGVib3VuY2UoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHNlbmRNZXNzYWdlc1RvTG9nZ2VyKGV2ZW50SWQsIG1lc3NhZ2VzKTtcbiAgICAgICAgICAgIC8vIGNsZWFyIHRoZSBxdWV1ZVxuICAgICAgICAgICAgbWVzc2FnZXMgPSBbXTtcbiAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChtc2dUeXBlLCBtc2cpIHtcbiAgICAgICAgICAgIC8vIHF1ZXVlIHRoZSBtZXNzYWdlXG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKHsgdHlwZTogbXNnVHlwZSwgY29udGVudDogbXNnIH0pO1xuICAgICAgICAgICAgX3NlbmQoKTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIGNvbnN0IHNlbmQgPSBzZW5kRmFjdG9yeShldmVudElkLCBzZW5kTWVzc2FnZXNUb0xvZ2dlcik7XG4gICAgZnVuY3Rpb24gaW5zdHJ1bWVudEpTKEpTSW5zdHJ1bWVudFJlcXVlc3RzKSB7XG4gICAgICAgIC8vIFRoZSBKUyBJbnN0cnVtZW50IFJlcXVlc3RzIGFyZSBzZXR1cCBhbmQgdmFsaWRhdGVkIHB5dGhvbiBzaWRlXG4gICAgICAgIC8vIGluY2x1ZGluZyBzZXR0aW5nIGRlZmF1bHRzIGZvciBsb2dTZXR0aW5ncy5cbiAgICAgICAgLy8gTW9yZSBkZXRhaWxzIGFib3V0IGhvdyB0aGlzIGZ1bmN0aW9uIGlzIGludm9rZWQgYXJlIGluXG4gICAgICAgIC8vIGNvbnRlbnQvamF2YXNjcmlwdC1pbnN0cnVtZW50LWNvbnRlbnQtc2NvcGUudHNcbiAgICAgICAgSlNJbnN0cnVtZW50UmVxdWVzdHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgaW5zdHJ1bWVudE9iamVjdChpdGVtLm9iamVjdCwgaXRlbS5pbnN0cnVtZW50ZWROYW1lLCBpdGVtLmxvZ1NldHRpbmdzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIFRoaXMgd2hvbGUgZnVuY3Rpb24gZ2V0SW5zdHJ1bWVudEpTIHJldHVybnMganVzdCB0aGUgZnVuY3Rpb24gYGluc3RydW1lbnRKU2AuXG4gICAgcmV0dXJuIGluc3RydW1lbnRKUztcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWFuTXRhVzV6ZEhKMWJXVnVkSE11YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sY3lJNld5SXVMaTh1TGk4dUxpOXpjbU12YkdsaUwycHpMV2x1YzNSeWRXMWxiblJ6TG5SeklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMR2xGUVVGcFJUdEJRVU5xUlN4dlJrRkJiMFk3UVVFNFFuQkdMRTFCUVUwc1ZVRkJWU3hsUVVGbExFTkJRVU1zVDBGQlpTeEZRVUZGTEc5Q1FVRnZRanRKUVVOdVJUczdPMDlCUjBjN1NVRkZTQ3h0UlVGQmJVVTdTVUZEYmtVc1RVRkJUU3hYUVVGWExFZEJRVWNzUjBGQlJ5eERRVUZETzBsQlEzaENMR0ZCUVdFN1NVRkRZaXhOUVVGTkxGVkJRVlVzUjBGQlJ5eEpRVUZKTEUxQlFVMHNSVUZCUlN4RFFVRkRPMGxCUTJoRExDdERRVUVyUXp0SlFVTXZReXhKUVVGSkxFdEJRVXNzUjBGQlJ5eExRVUZMTEVOQlFVTTdTVUZEYkVJc1owUkJRV2RFTzBsQlEyaEVMRWxCUVVrc1QwRkJUeXhIUVVGSExFTkJRVU1zUTBGQlF6dEpRVVZvUWl3d1FrRkJNRUk3U1VGRE1VSXNUVUZCVFN4WFFVRlhMRWRCUVVjN1VVRkRiRUlzU1VGQlNTeEZRVUZGTEUxQlFVMDdVVUZEV2l4SFFVRkhMRVZCUVVVc1MwRkJTenRSUVVOV0xGVkJRVlVzUlVGQlJTeGhRVUZoTzFGQlEzcENMRmxCUVZrc1JVRkJSU3hsUVVGbE8xRkJRemRDTEVkQlFVY3NSVUZCUlN4TFFVRkxPMUZCUTFZc1ZVRkJWU3hGUVVGRkxHRkJRV0U3VVVGRGVrSXNZVUZCWVN4RlFVRkZMR2RDUVVGblFqdExRVU5vUXl4RFFVRkRPMGxCUlVZc2IwWkJRVzlHTzBsQlEzQkdMSGxGUVVGNVJUdEpRVU42UlN4TlFVRk5MRU5CUVVNc2NVSkJRWEZDTEVkQlFVY3NWVUZCVXl4UFFVRlBMRVZCUVVVc1NVRkJTVHRSUVVOdVJDeEpRVUZKTEU5QlFVOHNTMEZCU3l4VFFVRlRMRVZCUVVVN1dVRkRla0lzVFVGQlRTeEpRVUZKTEV0QlFVc3NRMEZCUXl3MlEwRkJOa01zUTBGQlF5eERRVUZETzFOQlEyaEZPMUZCUTBRc1NVRkJTU3hGUVVGRkxFZEJRVWNzVFVGQlRTeERRVUZETEhkQ1FVRjNRaXhEUVVGRExFOUJRVThzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0UlFVTjRSQ3hKUVVGSkxFdEJRVXNzUjBGQlJ5eE5RVUZOTEVOQlFVTXNZMEZCWXl4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8xRkJRek5ETEU5QlFVOHNSVUZCUlN4TFFVRkxMRk5CUVZNc1NVRkJTU3hMUVVGTExFdEJRVXNzU1VGQlNTeEZRVUZGTzFsQlEzcERMRVZCUVVVc1IwRkJSeXhOUVVGTkxFTkJRVU1zZDBKQlFYZENMRU5CUVVNc1MwRkJTeXhGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETzFsQlEyeEVMRXRCUVVzc1IwRkJSeXhOUVVGTkxFTkJRVU1zWTBGQll5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMU5CUTNSRE8xRkJRMFFzVDBGQlR5eEZRVUZGTEVOQlFVTTdTVUZEV2l4RFFVRkRMRU5CUVVNN1NVRkZSaXhOUVVGTkxFTkJRVU1zWjBKQlFXZENMRWRCUVVjc1ZVRkJVeXhQUVVGUE8xRkJRM2hETEVsQlFVa3NUMEZCVHl4TFFVRkxMRk5CUVZNc1JVRkJSVHRaUVVONlFpeE5RVUZOTEVsQlFVa3NTMEZCU3l4RFFVRkRMSGREUVVGM1F5eERRVUZETEVOQlFVTTdVMEZETTBRN1VVRkRSQ3hKUVVGSkxFdEJRVXNzUjBGQlJ5eE5RVUZOTEVOQlFVTXNiVUpCUVcxQ0xFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdVVUZEYUVRc1NVRkJTU3hMUVVGTExFZEJRVWNzVFVGQlRTeERRVUZETEdOQlFXTXNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRSUVVNelF5eFBRVUZQTEV0QlFVc3NTMEZCU3l4SlFVRkpMRVZCUVVVN1dVRkRja0lzUzBGQlN5eEhRVUZITEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExHMUNRVUZ0UWl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU03V1VGRGVFUXNTMEZCU3l4SFFVRkhMRTFCUVUwc1EwRkJReXhqUVVGakxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdVMEZEZEVNN1VVRkRSQ3h2UkVGQmIwUTdVVUZEY0VRc1QwRkJUeXhMUVVGTExFTkJRVU03U1VGRFppeERRVUZETEVOQlFVTTdTVUZGUml4dlEwRkJiME03U1VGRGNFTXNVMEZCVXl4UlFVRlJMRU5CUVVNc1NVRkJTU3hGUVVGRkxFbEJRVWtzUlVGQlJTeFpRVUZ4UWl4TFFVRkxPMUZCUTNSRUxFbEJRVWtzVDBGQlR5eEZRVUZGTEVsQlFVa3NSVUZCUlN4UFFVRlBMRVZCUVVVc1UwRkJVeXhGUVVGRkxFMUJRVTBzUTBGQlF6dFJRVVU1UXl4TlFVRk5MRXRCUVVzc1IwRkJSenRaUVVOYUxFMUJRVTBzU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXl4SFFVRkhMRVZCUVVVc1IwRkJSeXhUUVVGVExFTkJRVU03V1VGRGNFTXNTVUZCU1N4SlFVRkpMRWRCUVVjc1NVRkJTU3hGUVVGRk8yZENRVU5tTEU5QlFVOHNSMEZCUnl4VlFVRlZMRU5CUVVNc1MwRkJTeXhGUVVGRkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTXNRMEZCUXp0aFFVTXhRenRwUWtGQlRUdG5Ra0ZEVEN4UFFVRlBMRWRCUVVjc1NVRkJTU3hEUVVGRE8yZENRVU5tTEVsQlFVa3NRMEZCUXl4VFFVRlRMRVZCUVVVN2IwSkJRMlFzVFVGQlRTeEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETzI5Q1FVTnVReXhQUVVGUExFZEJRVWNzU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXp0cFFrRkRka0k3WVVGRFJqdFJRVU5JTEVOQlFVTXNRMEZCUXp0UlFVVkdMRTlCUVU4N1dVRkRUQ3hQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETzFsQlEyWXNTVUZCU1N4SFFVRkhMRk5CUVZNc1EwRkJRenRaUVVOcVFpeFRRVUZUTEVkQlFVY3NTVUZCU1N4RFFVRkRMRWRCUVVjc1JVRkJSU3hEUVVGRE8xbEJRM1pDTEUxQlFVMHNUMEZCVHl4SFFVRkhMRk5CUVZNc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF6dFpRVU4wUXl4SlFVRkpMRU5CUVVNc1QwRkJUeXhGUVVGRk8yZENRVU5hTEU5QlFVOHNSMEZCUnl4VlFVRlZMRU5CUVVNc1MwRkJTeXhGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETzJGQlEyNURPMWxCUTBRc1NVRkJTU3hQUVVGUExFVkJRVVU3WjBKQlExZ3NUVUZCVFN4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR5eEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPMmRDUVVOdVF5eFBRVUZQTEVkQlFVY3NTVUZCU1N4SFFVRkhMRWxCUVVrc1EwRkJRenRoUVVOMlFqdFpRVVZFTEU5QlFVOHNUVUZCVFN4RFFVRkRPMUZCUTJoQ0xFTkJRVU1zUTBGQlF6dEpRVU5LTEVOQlFVTTdTVUZGUkN3NFEwRkJPRU03U1VGRE9VTXNVMEZCVXl4dFFrRkJiVUlzUTBGQlF5eFBRVUZaTEVWQlFVVXNhVUpCUVRCQ0xFdEJRVXM3VVVGRGVFVXNTVUZCU1N4UFFVRlBMRXRCUVVzc1VVRkJVU3hEUVVGRExFbEJRVWtzUlVGQlJUdFpRVU0zUWl4UFFVRlBMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU03VTBGRGVFSTdVVUZEUkN4SlFVRkpMRTlCUVU4c1EwRkJReXhWUVVGVkxFdEJRVXNzU1VGQlNTeEZRVUZGTzFsQlF5OUNMRTlCUVU4c1QwRkJUeXhIUVVGSExFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTTdVMEZEYkVNN1VVRkZSQ3hKUVVGSkxGbEJRVmtzUjBGQlJ5eERRVUZETEVOQlFVTTdVVUZEY2tJc1RVRkJUU3hSUVVGUkxFZEJRVWNzVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4VlFVRlZMRU5CUVVNN1VVRkRMME1zUzBGQlN5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVVc1EwRkJReXhIUVVGSExGRkJRVkVzUTBGQlF5eE5RVUZOTEVWQlFVVXNRMEZCUXl4RlFVRkZMRVZCUVVVN1dVRkRlRU1zVFVGQlRTeFBRVUZQTEVkQlFVY3NVVUZCVVN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8xbEJRelZDTEVsQlFVa3NUMEZCVHl4TFFVRkxMRTlCUVU4c1JVRkJSVHRuUWtGRGRrSXNTVUZCU1N4SlFVRkpMRWRCUVVjc2JVSkJRVzFDTEVOQlFVTXNUMEZCVHl4RFFVRkRMRlZCUVZVc1JVRkJSU3hqUVVGakxFTkJRVU1zUTBGQlF6dG5Ra0ZEYmtVc1NVRkJTU3hKUVVGSkxFZEJRVWNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUMEZCVHl4SFFVRkhMRWRCUVVjc1IwRkJSeXhaUVVGWkxFTkJRVU03WjBKQlEyNUVMRWxCUVVrc1NVRkJTU3hIUVVGSExFZEJRVWNzVDBGQlR5eERRVUZETEVWQlFVVXNRMEZCUXp0blFrRkRla0lzU1VGQlNTeEpRVUZKTEVkQlFVY3NSMEZCUnl4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRE8yZENRVU5vUXl4SlFVRkpMR05CUVdNc1JVRkJSVHR2UWtGRGJFSXNTVUZCU1N4SlFVRkpMRWRCUVVjc1IwRkJSeXhQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETzI5Q1FVTTNRaXhKUVVGSkxFbEJRVWtzUjBGQlJ5eEhRVUZITEU5QlFVOHNRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRE8yOUNRVU53UXl4SlFVRkpMRWxCUVVrc1IwRkJSeXhIUVVGSExFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTXNWVUZCVlN4RFFVRkRPMmxDUVVONFF6dG5Ra0ZEUkN4SlFVRkpMRTlCUVU4c1EwRkJReXhQUVVGUExFdEJRVXNzUjBGQlJ5eEZRVUZGTzI5Q1FVTXpRaXhKUVVGSkxFbEJRVWtzUjBGQlJ5eEhRVUZITEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNN2FVSkJRelZDTzJkQ1FVTkVMRWxCUVVrc1NVRkJTU3hIUVVGSExFTkJRVU03WjBKQlExb3NUMEZCVHl4SlFVRkpMRU5CUVVNN1lVRkRZanRaUVVORUxFbEJRVWtzVDBGQlR5eERRVUZETEZGQlFWRXNTMEZCU3l4RFFVRkRMRWxCUVVrc1QwRkJUeXhEUVVGRExFOUJRVThzUzBGQlN5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RlFVRkZPMmRDUVVOcVJTeFpRVUZaTEVWQlFVVXNRMEZCUXp0aFFVTm9RanRUUVVOR08wbEJRMGdzUTBGQlF6dEpRVVZFTEdkRFFVRm5RenRKUVVOb1F5eFRRVUZUTEdWQlFXVXNRMEZEZEVJc1RVRkJUU3hGUVVOT0xIRkNRVUU0UWl4TFFVRkxPMUZCUlc1RExEUkNRVUUwUWp0UlFVTTFRaXhKUVVGSk8xbEJRMFlzU1VGQlNTeE5RVUZOTEV0QlFVc3NTVUZCU1N4RlFVRkZPMmRDUVVOdVFpeFBRVUZQTEUxQlFVMHNRMEZCUXp0aFFVTm1PMWxCUTBRc1NVRkJTU3hQUVVGUExFMUJRVTBzUzBGQlN5eFZRVUZWTEVWQlFVVTdaMEpCUTJoRExFbEJRVWtzYTBKQlFXdENMRVZCUVVVN2IwSkJRM1JDTEU5QlFVOHNUVUZCVFN4RFFVRkRMRkZCUVZFc1JVRkJSU3hEUVVGRE8ybENRVU14UWp0eFFrRkJUVHR2UWtGRFRDeFBRVUZQTEZWQlFWVXNRMEZCUXp0cFFrRkRia0k3WVVGRFJqdFpRVU5FTEVsQlFVa3NUMEZCVHl4TlFVRk5MRXRCUVVzc1VVRkJVU3hGUVVGRk8yZENRVU01UWl4UFFVRlBMRTFCUVUwc1EwRkJRenRoUVVObU8xbEJRMFFzVFVGQlRTeFhRVUZYTEVkQlFVY3NSVUZCUlN4RFFVRkRPMWxCUTNaQ0xFOUJRVThzU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4TlFVRk5MRVZCUVVVc1ZVRkJVeXhIUVVGSExFVkJRVVVzUzBGQlN6dG5Ra0ZETDBNc1NVRkJTU3hMUVVGTExFdEJRVXNzU1VGQlNTeEZRVUZGTzI5Q1FVTnNRaXhQUVVGUExFMUJRVTBzUTBGQlF6dHBRa0ZEWmp0blFrRkRSQ3hKUVVGSkxFOUJRVThzUzBGQlN5eExRVUZMTEZWQlFWVXNSVUZCUlR0dlFrRkRMMElzU1VGQlNTeHJRa0ZCYTBJc1JVRkJSVHQzUWtGRGRFSXNUMEZCVHl4TFFVRkxMRU5CUVVNc1VVRkJVU3hGUVVGRkxFTkJRVU03Y1VKQlEzcENPM2xDUVVGTk8zZENRVU5NTEU5QlFVOHNWVUZCVlN4RFFVRkRPM0ZDUVVOdVFqdHBRa0ZEUmp0blFrRkRSQ3hKUVVGSkxFOUJRVThzUzBGQlN5eExRVUZMTEZGQlFWRXNSVUZCUlR0dlFrRkROMElzY1VOQlFYRkRPMjlDUVVOeVF5eEpRVUZKTEdsQ1FVRnBRaXhKUVVGSkxFdEJRVXNzUlVGQlJUdDNRa0ZET1VJc1MwRkJTeXhIUVVGSExFdEJRVXNzUTBGQlF5eGxRVUZsTEVOQlFVTTdjVUpCUXk5Q08yOUNRVVZFTEhsQ1FVRjVRanR2UWtGRGVrSXNTVUZCU1N4TFFVRkxMRmxCUVZrc1YwRkJWeXhGUVVGRk8zZENRVU5vUXl4UFFVRlBMRzFDUVVGdFFpeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPM0ZDUVVOdVF6dHZRa0ZGUkN3clFrRkJLMEk3YjBKQlF5OUNMRWxCUVVrc1IwRkJSeXhMUVVGTExFVkJRVVVzU1VGQlNTeFhRVUZYTEVOQlFVTXNUMEZCVHl4RFFVRkRMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJUdDNRa0ZEYUVRc1YwRkJWeXhEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0M1FrRkRlRUlzVDBGQlR5eExRVUZMTEVOQlFVTTdjVUpCUTJRN2VVSkJRVTA3ZDBKQlEwd3NUMEZCVHl4UFFVRlBMRXRCUVVzc1EwRkJRenR4UWtGRGNrSTdhVUpCUTBZN1owSkJRMFFzVDBGQlR5eExRVUZMTEVOQlFVTTdXVUZEWml4RFFVRkRMRU5CUVVNc1EwRkJRenRUUVVOS08xRkJRVU1zVDBGQlR5eExRVUZMTEVWQlFVVTdXVUZEWkN4UFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExHZERRVUZuUXl4SFFVRkhMRXRCUVVzc1EwRkJReXhEUVVGRE8xbEJRM1JFTEU5QlFVOHNkVUpCUVhWQ0xFZEJRVWNzUzBGQlN5eERRVUZETzFOQlEzaERPMGxCUTBnc1EwRkJRenRKUVVWRUxGTkJRVk1zTWtKQlFUSkNMRU5CUVVNc1UwRkJVeXhGUVVGRkxFMUJRVTA3VVVGRGNFUXNUVUZCVFN4SFFVRkhMRWRCUVVjc1UwRkJVeXhIUVVGSExFZEJRVWNzUjBGQlJ5eE5RVUZOTEVOQlFVTTdVVUZEY2tNc1NVRkJTU3hIUVVGSExFbEJRVWtzVlVGQlZTeEpRVUZKTEZWQlFWVXNRMEZCUXl4SFFVRkhMRU5CUVVNc1NVRkJTU3hYUVVGWExFVkJRVVU3V1VGRGRrUXNUMEZCVHl4SlFVRkpMRU5CUVVNN1UwRkRZanRoUVVGTkxFbEJRVWtzUTBGQlF5eERRVUZETEVkQlFVY3NTVUZCU1N4VlFVRlZMRU5CUVVNc1JVRkJSVHRaUVVNdlFpeFZRVUZWTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE8xTkJRM0pDTzJGQlFVMDdXVUZEVEN4VlFVRlZMRU5CUVVNc1IwRkJSeXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzFOQlEzUkNPMUZCUTBRc1QwRkJUeXhMUVVGTExFTkJRVU03U1VGRFppeERRVUZETzBsQlJVUXNlVU5CUVhsRE8wbEJRM3BETEZOQlFWTXNVVUZCVVN4RFFVTm1MSGRDUVVGblF5eEZRVU5vUXl4TFFVRlZMRVZCUTFZc1UwRkJhVUlzUlVGQlJTeHBRMEZCYVVNN1NVRkRjRVFzVjBGQlowSXNSVUZEYUVJc1YwRkJkMEk3VVVGRmVFSXNTVUZCU1N4TFFVRkxMRVZCUVVVN1dVRkRWQ3hQUVVGUE8xTkJRMUk3VVVGRFJDeExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRPMUZCUldJc1RVRkJUU3hUUVVGVExFZEJRVWNzTWtKQlFUSkNMRU5CUXpORExGZEJRVmNzUTBGQlF5eFRRVUZUTEVWQlEzSkNMSGRDUVVGM1FpeERRVU42UWl4RFFVRkRPMUZCUTBZc1NVRkJTU3hUUVVGVExFVkJRVVU3V1VGRFlpeExRVUZMTEVkQlFVY3NTMEZCU3l4RFFVRkRPMWxCUTJRc1QwRkJUenRUUVVOU08xRkJSVVFzVFVGQlRTeEhRVUZITEVkQlFVYzdXVUZEVml4VFFVRlRPMWxCUTFRc1RVRkJUU3hGUVVGRkxIZENRVUYzUWp0WlFVTm9ReXhMUVVGTExFVkJRVVVzWlVGQlpTeERRVUZETEV0QlFVc3NSVUZCUlN4WFFVRlhMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTTdXVUZEYUVVc1UwRkJVeXhGUVVGRkxGZEJRVmNzUTBGQlF5eFRRVUZUTzFsQlEyaERMRlZCUVZVc1JVRkJSU3hYUVVGWExFTkJRVU1zVlVGQlZUdFpRVU5zUXl4VFFVRlRMRVZCUVVVc1YwRkJWeXhEUVVGRExGTkJRVk03V1VGRGFFTXNVVUZCVVN4RlFVRkZMRmRCUVZjc1EwRkJReXhSUVVGUk8xbEJRemxDTEdGQlFXRXNSVUZCUlN4WFFVRlhMRU5CUVVNc1lVRkJZVHRaUVVONFF5eFRRVUZUTEVWQlFVVXNWMEZCVnl4RFFVRkRMRk5CUVZNN1dVRkRhRU1zVDBGQlR5eEZRVUZGTEU5QlFVOHNSVUZCUlR0VFFVTnVRaXhEUVVGRE8xRkJSVVlzU1VGQlNUdFpRVU5HTEVsQlFVa3NRMEZCUXl4VlFVRlZMRVZCUVVVc1IwRkJSeXhEUVVGRExFTkJRVU03VTBGRGRrSTdVVUZCUXl4UFFVRlBMRXRCUVVzc1JVRkJSVHRaUVVOa0xFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNhME5CUVd0RExFTkJRVU1zUTBGQlF6dFpRVU5vUkN4cFFrRkJhVUlzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0VFFVTXhRanRSUVVWRUxFdEJRVXNzUjBGQlJ5eExRVUZMTEVOQlFVTTdTVUZEYUVJc1EwRkJRenRKUVVWRUxHZENRVUZuUWp0SlFVTm9RaXhUUVVGVExFOUJRVThzUTBGRFpDeDNRa0ZCWjBNc1JVRkRhRU1zU1VGQlowSXNSVUZEYUVJc1YwRkJaMElzUlVGRGFFSXNWMEZCZDBJN1VVRkZlRUlzU1VGQlNTeExRVUZMTEVWQlFVVTdXVUZEVkN4UFFVRlBPMU5CUTFJN1VVRkRSQ3hMUVVGTExFZEJRVWNzU1VGQlNTeERRVUZETzFGQlJXSXNUVUZCVFN4VFFVRlRMRWRCUVVjc01rSkJRVEpDTEVOQlF6TkRMRmRCUVZjc1EwRkJReXhUUVVGVExFVkJRM0pDTEhkQ1FVRjNRaXhEUVVONlFpeERRVUZETzFGQlEwWXNTVUZCU1N4VFFVRlRMRVZCUVVVN1dVRkRZaXhMUVVGTExFZEJRVWNzUzBGQlN5eERRVUZETzFsQlEyUXNUMEZCVHp0VFFVTlNPMUZCUlVRc1NVRkJTVHRaUVVOR0xIRkZRVUZ4UlR0WlFVTnlSU3hOUVVGTkxGVkJRVlVzUjBGQllTeEZRVUZGTEVOQlFVTTdXVUZEYUVNc1MwRkJTeXhOUVVGTkxFZEJRVWNzU1VGQlNTeEpRVUZKTEVWQlFVVTdaMEpCUTNSQ0xGVkJRVlVzUTBGQlF5eEpRVUZKTEVOQlEySXNaVUZCWlN4RFFVRkRMRWRCUVVjc1JVRkJSU3hYUVVGWExFTkJRVU1zY1VKQlFYRkNMRU5CUVVNc1EwRkRlRVFzUTBGQlF6dGhRVU5JTzFsQlEwUXNUVUZCVFN4SFFVRkhMRWRCUVVjN1owSkJRMVlzVTBGQlV5eEZRVUZGTEZkQlFWY3NRMEZCUXl4SlFVRkpPMmRDUVVNelFpeE5RVUZOTEVWQlFVVXNkMEpCUVhkQ08yZENRVU5vUXl4SlFVRkpMRVZCUVVVc1ZVRkJWVHRuUWtGRGFFSXNTMEZCU3l4RlFVRkZMRVZCUVVVN1owSkJRMVFzVTBGQlV5eEZRVUZGTEZkQlFWY3NRMEZCUXl4VFFVRlRPMmRDUVVOb1F5eFZRVUZWTEVWQlFVVXNWMEZCVnl4RFFVRkRMRlZCUVZVN1owSkJRMnhETEZOQlFWTXNSVUZCUlN4WFFVRlhMRU5CUVVNc1UwRkJVenRuUWtGRGFFTXNVVUZCVVN4RlFVRkZMRmRCUVZjc1EwRkJReXhSUVVGUk8yZENRVU01UWl4aFFVRmhMRVZCUVVVc1YwRkJWeXhEUVVGRExHRkJRV0U3WjBKQlEzaERMRk5CUVZNc1JVRkJSU3hYUVVGWExFTkJRVU1zVTBGQlV6dG5Ra0ZEYUVNc1QwRkJUeXhGUVVGRkxFOUJRVThzUlVGQlJUdGhRVU51UWl4RFFVRkRPMWxCUTBZc1NVRkJTU3hEUVVGRExGTkJRVk1zUlVGQlJTeEhRVUZITEVOQlFVTXNRMEZCUXp0VFFVTjBRanRSUVVGRExFOUJRVThzUzBGQlN5eEZRVUZGTzFsQlEyUXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkRWQ3hyUTBGQmEwTXNSMEZCUnl4M1FrRkJkMElzUTBGRE9VUXNRMEZCUXp0WlFVTkdMR2xDUVVGcFFpeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMU5CUXpGQ08xRkJRMFFzUzBGQlN5eEhRVUZITEV0QlFVc3NRMEZCUXp0SlFVTm9RaXhEUVVGRE8wbEJSVVFzVTBGQlV5eHBRa0ZCYVVJc1EwRkJReXhMUVVGTExFVkJRVVVzVlVGQlpTeExRVUZMTzFGQlEzQkVMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU1zZFVKQlFYVkNMRWRCUVVjc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzFGQlEzQkVMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU1zTUVKQlFUQkNMRWRCUVVjc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzFGQlF6RkVMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU1zTWtKQlFUSkNMRWRCUVVjc1MwRkJTeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzFGQlF6VkVMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU1zT0VKQlFUaENMRWRCUVVjc1MwRkJTeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETzFGQlEycEZMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU1zZDBKQlFYZENMRWRCUVVjc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzFGQlEzUkVMRWxCUVVrc1QwRkJUeXhGUVVGRk8xbEJRMWdzVDBGQlR5eERRVUZETEV0QlFVc3NRMEZCUXl3d1FrRkJNRUlzUjBGQlJ5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRExFTkJRVU03VTBGRGNrVTdTVUZEU0N4RFFVRkRPMGxCUlVRc2QwTkJRWGRETzBsQlEzaERMRk5CUVZNc1lVRkJZVHRSUVVOd1FpeEpRVUZKTEV0QlFVc3NRMEZCUXp0UlFVVldMRWxCUVVrN1dVRkRSaXhOUVVGTkxFbEJRVWtzUzBGQlN5eEZRVUZGTEVOQlFVTTdVMEZEYmtJN1VVRkJReXhQUVVGUExFZEJRVWNzUlVGQlJUdFpRVU5hTEV0QlFVc3NSMEZCUnl4SFFVRkhMRU5CUVVNc1MwRkJTeXhEUVVGRE8xTkJRMjVDTzFGQlJVUXNUMEZCVHl4TFFVRkxMRU5CUVVNN1NVRkRaaXhEUVVGRE8wbEJSVVFzTUVOQlFUQkRPMGxCUXpGRExFMUJRVTBzVFVGQlRTeEhRVUZITEZWQlFWTXNUVUZCWXl4RlFVRkZMRWRCUVVjc1JVRkJSU3hSUVVGUk8xRkJRMjVFTEUxQlFVMHNTMEZCU3l4SFFVRkhMRTFCUVUwc1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdVVUZEYUVNc1QwRkJUeXhSUVVGUk8xbEJRMklzUTBGQlF5eERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFVkJRVVVzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzFsQlEzUkZMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU03U1VGRFdpeERRVUZETEVOQlFVTTdTVUZGUml4VFFVRlRMREpDUVVFeVFpeERRVUZETEZsQlFWa3NSMEZCUnl4TFFVRkxPMUZCUTNaRUxFMUJRVTBzUzBGQlN5eEhRVUZITEdGQlFXRXNSVUZCUlR0aFFVTXhRaXhKUVVGSkxFVkJRVVU3WVVGRFRpeExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1VVRkRaaXh2UkVGQmIwUTdVVUZEY0VRc1RVRkJUU3hoUVVGaExFZEJRVWM3V1VGRGNFSXNVMEZCVXl4RlFVRkZMRVZCUVVVN1dVRkRZaXhWUVVGVkxFVkJRVVVzUlVGQlJUdFpRVU5rTEZOQlFWTXNSVUZCUlN4RlFVRkZPMWxCUTJJc1VVRkJVU3hGUVVGRkxFVkJRVVU3V1VGRFdpeGhRVUZoTEVWQlFVVXNSVUZCUlR0WlFVTnFRaXhUUVVGVExFVkJRVVVzUlVGQlJUdFRRVU5rTEVOQlFVTTdVVUZEUml4SlFVRkpMRXRCUVVzc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eEZRVUZGTzFsQlEzQkNMRTlCUVU4c1lVRkJZU3hEUVVGRE8xTkJRM1JDTzFGQlEwUXNNRVZCUVRCRk8xRkJRekZGTEUxQlFVMHNVVUZCVVN4SFFVRkhMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU14UWl4SlFVRkpMRU5CUVVNc1VVRkJVU3hGUVVGRk8xbEJRMklzVDBGQlR5eGhRVUZoTEVOQlFVTTdVMEZEZEVJN1VVRkRSRHM3T3pzN096czdWMEZSUnp0UlFVTklMRWxCUVVrN1dVRkRSaXhKUVVGSkxGTkJRVk1zUjBGQlJ5eEZRVUZGTEVOQlFVTTdXVUZEYmtJc1NVRkJTU3hoUVVGaExFZEJRVWNzUlVGQlJTeERRVUZETEVOQlFVTXNOa0pCUVRaQ08xbEJRM0pFTEUxQlFVMHNZVUZCWVN4SFFVRkhMRkZCUVZFc1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdXVUZETVVNc1RVRkJUU3hSUVVGUkxFZEJRVWNzWVVGQllTeERRVUZETEVOQlFVTXNRMEZCUXl4SlFVRkpMRVZCUVVVc1EwRkJRenRaUVVONFF5eE5RVUZOTEV0QlFVc3NSMEZCUnl4TlFVRk5MRU5CUVVNc1lVRkJZU3hEUVVGRExFTkJRVU1zUTBGQlF5eEZRVUZGTEVkQlFVY3NSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRenRaUVVNdlF5eE5RVUZOTEZGQlFWRXNSMEZCUnl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXp0WlFVTjZReXhOUVVGTkxFMUJRVTBzUjBGQlJ5eExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF6dFpRVU4yUXl4TlFVRk5MR05CUVdNc1IwRkJSeXhMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNc1NVRkJTU3hGUVVGRkxFTkJRVU03V1VGRGNrUXNUVUZCVFN4VFFVRlRMRWRCUVVjc1kwRkJZeXhEUVVGRExFOUJRVThzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVRkRMSGxEUVVGNVF6dFpRVU0zUml4SlFVRkpMRk5CUVZNc1MwRkJTeXhEUVVGRExFTkJRVU1zUlVGQlJUdG5Ra0ZEY0VJc1UwRkJVeXhIUVVGSExHTkJRV01zUTBGQlF5eERRVUZETEc5RVFVRnZSRHRoUVVOcVJqdHBRa0ZCVFR0blFrRkRUQ3hUUVVGVExFZEJRVWNzWTBGQll5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRVZCUVVVc1UwRkJVeXhEUVVGRExFTkJRVU03WjBKQlF5OURMR0ZCUVdFc1IwRkJSeXhqUVVGakxFTkJRVU1zUzBGQlN5eERRVU5zUXl4VFFVRlRMRWRCUVVjc1EwRkJReXhGUVVOaUxHTkJRV01zUTBGQlF5eE5RVUZOTEVOQlEzUkNMRU5CUVVNN1lVRkRTRHRaUVVORUxFMUJRVTBzVjBGQlZ5eEhRVUZITzJkQ1FVTnNRaXhUUVVGVE8yZENRVU5VTEZWQlFWVXNSVUZCUlN4TlFVRk5PMmRDUVVOc1FpeFRRVUZUTEVWQlFVVXNVVUZCVVR0blFrRkRia0lzVVVGQlVUdG5Ra0ZEVWl4aFFVRmhPMmRDUVVOaUxGTkJRVk1zUlVGQlJTeFpRVUZaTzI5Q1FVTnlRaXhEUVVGRExFTkJRVU1zUzBGQlN6dDVRa0ZEUml4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRE8zbENRVU5TTEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNN2VVSkJRMVlzU1VGQlNTeEZRVUZGTzI5Q1FVTllMRU5CUVVNc1EwRkJReXhGUVVGRk8yRkJRMUFzUTBGQlF6dFpRVU5HTEU5QlFVOHNWMEZCVnl4RFFVRkRPMU5CUTNCQ08xRkJRVU1zVDBGQlR5eERRVUZETEVWQlFVVTdXVUZEVml4UFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVOVUxESkRRVUV5UXl4RlFVTXpReXhEUVVGRExFTkJRVU1zVVVGQlVTeEZRVUZGTEVWQlExb3NVVUZCVVN4RFFVTlVMRU5CUVVNN1dVRkRSaXhQUVVGUExHRkJRV0VzUTBGQlF6dFRRVU4wUWp0SlFVTklMRU5CUVVNN1NVRkZSQ3hUUVVGVExGRkJRVkVzUTBGQlF5eE5RVUZOTEVWQlFVVXNXVUZCV1R0UlFVTndReXhKUVVGSkxGRkJRVkVzUTBGQlF6dFJRVU5pTEVsQlFVazdXVUZEUml4UlFVRlJMRWRCUVVjc1RVRkJUU3hEUVVGRExGbEJRVmtzUTBGQlF5eERRVUZETzFOQlEycERPMUZCUVVNc1QwRkJUeXhMUVVGTExFVkJRVVU3V1VGRFpDeFBRVUZQTEV0QlFVc3NRMEZCUXp0VFFVTmtPMUZCUTBRc1NVRkJTU3hSUVVGUkxFdEJRVXNzU1VGQlNTeEZRVUZGTzFsQlEzSkNMSGRDUVVGM1FqdFpRVU40UWl4UFFVRlBMRXRCUVVzc1EwRkJRenRUUVVOa08xRkJRMFFzVDBGQlR5eFBRVUZQTEZGQlFWRXNTMEZCU3l4UlFVRlJMRU5CUVVNN1NVRkRkRU1zUTBGQlF6dEpRVVZFTEdkRFFVRm5RenRKUVVOb1F5eDNSVUZCZDBVN1NVRkRlRVVzZVVWQlFYbEZPMGxCUTNwRkxIZEVRVUYzUkR0SlFVTjRSQ3hUUVVGVExHdENRVUZyUWl4RFFVTjZRaXhWUVVGclFpeEZRVU5zUWl4VlFVRnJRaXhGUVVOc1FpeEpRVUZUTEVWQlExUXNWMEZCZDBJN1VVRkZlRUlzVDBGQlR6dFpRVU5NTEUxQlFVMHNWMEZCVnl4SFFVRkhMREpDUVVFeVFpeERRVUZETEZkQlFWY3NRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJRenRaUVVNeFJTeFBRVUZQTEVOQlEwd3NWVUZCVlN4SFFVRkhMRWRCUVVjc1IwRkJSeXhWUVVGVkxFVkJRemRDTEZOQlFWTXNSVUZEVkN4WFFVRlhMRVZCUTFnc1YwRkJWeXhEUVVOYUxFTkJRVU03V1VGRFJpeFBRVUZQTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hGUVVGRkxGTkJRVk1zUTBGQlF5eERRVUZETzFGQlEzSkRMRU5CUVVNc1EwRkJRenRKUVVOS0xFTkJRVU03U1VGRlJDd3lRMEZCTWtNN1NVRkRNME1zVTBGQlV5eDNRa0ZCZDBJc1EwRkRMMElzVFVGQlRTeEZRVU5PTEZWQlFXdENMRVZCUTJ4Q0xGbEJRVzlDTEVWQlEzQkNMRmRCUVhkQ08xRkJSWGhDTEVsQlEwVXNRMEZCUXl4TlFVRk5PMWxCUTFBc1EwRkJReXhWUVVGVk8xbEJRMWdzUTBGQlF5eFpRVUZaTzFsQlEySXNXVUZCV1N4TFFVRkxMRmRCUVZjc1JVRkROVUk3V1VGRFFTeE5RVUZOTEVsQlFVa3NTMEZCU3l4RFFVTmlPMnRDUVVOVkxFMUJRVTA3YzBKQlEwWXNWVUZCVlR0M1FrRkRVaXhaUVVGWk8xTkJRek5DTEVOQlEwWXNRMEZCUXp0VFFVTklPMUZCUlVRc2RVTkJRWFZETzFGQlEzWkRMRTFCUVUwc1VVRkJVU3hIUVVGSExFMUJRVTBzUTBGQlF5eHhRa0ZCY1VJc1EwRkJReXhOUVVGTkxFVkJRVVVzV1VGQldTeERRVUZETEVOQlFVTTdVVUZGY0VVc2IwWkJRVzlHTzFGQlEzQkdMRWxCUTBVc1EwRkJReXhSUVVGUk8xbEJRMVFzUTBGQlF5eFhRVUZYTEVOQlFVTXNhVU5CUVdsRExFTkJRVU1zVVVGQlVTeERRVUZETEZsQlFWa3NRMEZCUXl4RlFVTnlSVHRaUVVOQkxFOUJRVThzUTBGQlF5eExRVUZMTEVOQlExZ3NiVU5CUVcxRExFVkJRMjVETEZWQlFWVXNSVUZEVml4WlFVRlpMRVZCUTFvc1RVRkJUU3hEUVVOUUxFTkJRVU03V1VGRFJpeFBRVUZQTzFOQlExSTdVVUZGUkN3clEwRkJLME03VVVGREwwTXNTVUZCU1N4clFrRkJhMElzUTBGQlF6dFJRVU4yUWl4TlFVRk5MR2xDUVVGcFFpeEhRVUZITzFsQlEzaENMRWRCUVVjc1JVRkJSU3hIUVVGSExFVkJRVVU3WjBKQlExSXNUMEZCVHl4clFrRkJhMElzUTBGQlF6dFpRVU0xUWl4RFFVRkRPMWxCUTBRc1IwRkJSeXhGUVVGRkxFdEJRVXNzUTBGQlF5eEZRVUZGTzJkQ1FVTllMR3RDUVVGclFpeEhRVUZITEV0QlFVc3NRMEZCUXp0WlFVTTNRaXhEUVVGRE8xbEJRMFFzVlVGQlZTeEZRVUZGTEV0QlFVczdVMEZEYkVJc1EwRkJRenRSUVVWR0xHMUVRVUZ0UkR0UlFVTnVSQ3hOUVVGTkxHTkJRV01zUjBGQlJ5eFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVRkRMRkZCUVZFc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETEdsQ1FVRnBRaXhEUVVGRExFZEJRVWNzUTBGQlF6dFJRVU4yUlN4TlFVRk5MR05CUVdNc1IwRkJSeXhSUVVGUkxFTkJRVU1zUTBGQlF5eERRVUZETEZGQlFWRXNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRExHbENRVUZwUWl4RFFVRkRMRWRCUVVjc1EwRkJRenRSUVVOMlJTeEpRVUZKTEdGQlFXRXNSMEZCUnl4UlFVRlJMRU5CUVVNc1EwRkJReXhEUVVGRExGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMR3RDUVVGclFpeERRVUZETzFGQlJXNUZMRzlGUVVGdlJUdFJRVU53UlN4dlFrRkJiMEk3VVVGRGNFSXNUVUZCVFN4RFFVRkRMR05CUVdNc1EwRkJReXhOUVVGTkxFVkJRVVVzV1VGQldTeEZRVUZGTzFsQlF6RkRMRmxCUVZrc1JVRkJSU3hKUVVGSk8xbEJRMnhDTEVkQlFVY3NSVUZCUlN4RFFVRkRPMmRDUVVOS0xFOUJRVTg3YjBKQlEwd3NTVUZCU1N4WlFVRlpMRU5CUVVNN2IwSkJRMnBDTEUxQlFVMHNWMEZCVnl4SFFVRkhMREpDUVVFeVFpeERRVU0zUXl4WFFVRlhMRU5CUVVNc1dVRkJXU3hEUVVONlFpeERRVUZETzI5Q1FVTkdMRTFCUVUwc2QwSkJRWGRDTEVkQlFVY3NSMEZCUnl4VlFVRlZMRWxCUVVrc1dVRkJXU3hGUVVGRkxFTkJRVU03YjBKQlJXcEZMSEZDUVVGeFFqdHZRa0ZEY2tJc1NVRkJTU3hEUVVGRExGRkJRVkVzUlVGQlJUdDNRa0ZEWWl4M1FrRkJkMEk3ZDBKQlEzaENMRmxCUVZrc1IwRkJSeXhyUWtGQmEwSXNRMEZCUXp0eFFrRkRia003ZVVKQlFVMHNTVUZCU1N4alFVRmpMRVZCUVVVN2QwSkJRM3BDTEhWQ1FVRjFRanQzUWtGRGRrSXNXVUZCV1N4SFFVRkhMR05CUVdNc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdjVUpCUXpGRE8zbENRVUZOTEVsQlFVa3NUMEZCVHl4SlFVRkpMRkZCUVZFc1JVRkJSVHQzUWtGRE9VSXNiVUpCUVcxQ08zZENRVU51UWl4WlFVRlpMRWRCUVVjc1lVRkJZU3hEUVVGRE8zRkNRVU01UWp0NVFrRkJUVHQzUWtGRFRDeFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVTllMREpDUVVFeVFpeDNRa0ZCZDBJc1owTkJRV2RETEVOQlEzQkdMRU5CUVVNN2QwSkJRMFlzVVVGQlVTeERRVU5PTEhkQ1FVRjNRaXhGUVVONFFpeEZRVUZGTEVWQlEwWXNWMEZCVnl4RFFVRkRMRlZCUVZVc1JVRkRkRUlzVjBGQlZ5eEZRVU5ZTEZkQlFWY3NRMEZEV2l4RFFVRkRPM2RDUVVOR0xFOUJRVTg3Y1VKQlExSTdiMEpCUlVRc0swUkJRU3RFTzI5Q1FVTXZSQ3d5UkVGQk1rUTdiMEpCUXpORUxITkVRVUZ6UkR0dlFrRkRkRVFzYTBWQlFXdEZPMjlDUVVOc1JTeEpRVUZKTEU5QlFVOHNXVUZCV1N4TFFVRkxMRlZCUVZVc1JVRkJSVHQzUWtGRGRFTXNTVUZCU1N4WFFVRlhMRU5CUVVNc1pVRkJaU3hGUVVGRk96UkNRVU12UWl4UlFVRlJMRU5CUTA0c2QwSkJRWGRDTEVWQlEzaENMRmxCUVZrc1JVRkRXaXhYUVVGWExFTkJRVU1zV1VGQldTeEZRVU40UWl4WFFVRlhMRVZCUTFnc1YwRkJWeXhEUVVOYUxFTkJRVU03ZVVKQlEwZzdkMEpCUTBRc1RVRkJUU3d5UWtGQk1rSXNSMEZCUnl4clFrRkJhMElzUTBGRGNFUXNWVUZCVlN4RlFVTldMRmxCUVZrc1JVRkRXaXhaUVVGWkxFVkJRMW9zVjBGQlZ5eERRVU5hTEVOQlFVTTdkMEpCUTBZc05FWkJRVFJHTzNkQ1FVTTFSaXd3UjBGQk1FYzdkMEpCUXpGSExFbEJRVWtzV1VGQldTeERRVUZETEZOQlFWTXNSVUZCUlRzMFFrRkRNVUlzTWtKQlFUSkNMRU5CUVVNc1UwRkJVeXhIUVVGSExGbEJRVmtzUTBGQlF5eFRRVUZUTEVOQlFVTTdORUpCUXk5RUxFbEJRVWtzV1VGQldTeERRVUZETEZOQlFWTXNRMEZCUXl4WFFVRlhMRVZCUVVVN1owTkJRM1JETERKQ1FVRXlRaXhEUVVGRExGTkJRVk1zUTBGQlF5eFhRVUZYTzI5RFFVTXZReXhaUVVGWkxFTkJRVU1zVTBGQlV5eERRVUZETEZkQlFWY3NRMEZCUXpzMlFrRkRkRU03ZVVKQlEwWTdkMEpCUTBRc1QwRkJUeXd5UWtGQk1rSXNRMEZCUXp0eFFrRkRjRU03ZVVKQlFVMHNTVUZEVEN4UFFVRlBMRmxCUVZrc1MwRkJTeXhSUVVGUk8zZENRVU5vUXl4WFFVRlhMRU5CUVVNc1UwRkJVenQzUWtGRGNrSXNWMEZCVnl4RFFVRkRMRXRCUVVzc1IwRkJSeXhEUVVGRExFVkJRM0pDTzNkQ1FVTkJMRTlCUVU4c1dVRkJXU3hEUVVGRE8zRkNRVU55UWp0NVFrRkJUVHQzUWtGRFRDeFJRVUZSTEVOQlEwNHNkMEpCUVhkQ0xFVkJRM2hDTEZsQlFWa3NSVUZEV2l4WFFVRlhMRU5CUVVNc1IwRkJSeXhGUVVObUxGZEJRVmNzUlVGRFdDeFhRVUZYTEVOQlExb3NRMEZCUXp0M1FrRkRSaXhQUVVGUExGbEJRVmtzUTBGQlF6dHhRa0ZEY2tJN1owSkJRMGdzUTBGQlF5eERRVUZETzFsQlEwb3NRMEZCUXl4RFFVRkRMRVZCUVVVN1dVRkRTaXhIUVVGSExFVkJRVVVzUTBGQlF6dG5Ra0ZEU2l4UFFVRlBMRlZCUVZNc1MwRkJTenR2UWtGRGJrSXNUVUZCVFN4WFFVRlhMRWRCUVVjc01rSkJRVEpDTEVOQlF6ZERMRmRCUVZjc1EwRkJReXhaUVVGWkxFTkJRM3BDTEVOQlFVTTdiMEpCUTBZc1RVRkJUU3gzUWtGQmQwSXNSMEZCUnl4SFFVRkhMRlZCUVZVc1NVRkJTU3haUVVGWkxFVkJRVVVzUTBGQlF6dHZRa0ZEYWtVc1NVRkJTU3hYUVVGWExFTkJRVU03YjBKQlJXaENMRzlFUVVGdlJEdHZRa0ZEY0VRc1NVRkRSU3hYUVVGWExFTkJRVU1zVjBGQlZ6dDNRa0ZEZGtJc1EwRkJReXhQUVVGUExHRkJRV0VzUzBGQlN5eFZRVUZWT3pSQ1FVTnNReXhQUVVGUExHRkJRV0VzUzBGQlN5eFJRVUZSTEVOQlFVTXNSVUZEY0VNN2QwSkJRMEVzVVVGQlVTeERRVU5PTEhkQ1FVRjNRaXhGUVVONFFpeExRVUZMTEVWQlEwd3NWMEZCVnl4RFFVRkRMR0ZCUVdFc1JVRkRla0lzVjBGQlZ5eEZRVU5ZTEZkQlFWY3NRMEZEV2l4RFFVRkRPM2RDUVVOR0xFOUJRVThzUzBGQlN5eERRVUZETzNGQ1FVTmtPMjlDUVVWRUxEUkRRVUUwUXp0dlFrRkROVU1zU1VGQlNTeGpRVUZqTEVWQlFVVTdkMEpCUTJ4Q0xIVkNRVUYxUWp0M1FrRkRka0lzVjBGQlZ5eEhRVUZITEdOQlFXTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxFdEJRVXNzUTBGQlF5eERRVUZETzNGQ1FVTm9SRHQ1UWtGQlRTeEpRVUZKTEU5QlFVOHNTVUZCU1N4UlFVRlJMRVZCUVVVN2QwSkJRemxDTEV0QlFVc3NSMEZCUnl4SlFVRkpMRU5CUVVNN2QwSkJRMklzU1VGQlNTeE5RVUZOTEVOQlFVTXNZVUZCWVN4RFFVRkRMRWxCUVVrc1EwRkJReXhGUVVGRk96UkNRVU01UWl4TlFVRk5MRU5CUVVNc1kwRkJZeXhEUVVGRExFbEJRVWtzUlVGQlJTeFpRVUZaTEVWQlFVVTdaME5CUTNoRExFdEJRVXM3TmtKQlEwNHNRMEZCUXl4RFFVRkRPM2xDUVVOS096WkNRVUZOT3pSQ1FVTk1MR0ZCUVdFc1IwRkJSeXhMUVVGTExFTkJRVU03ZVVKQlEzWkNPM2RDUVVORUxGZEJRVmNzUjBGQlJ5eExRVUZMTEVOQlFVTTdkMEpCUTNCQ0xFdEJRVXNzUjBGQlJ5eExRVUZMTEVOQlFVTTdjVUpCUTJZN2VVSkJRVTA3ZDBKQlEwd3NUMEZCVHl4RFFVRkRMRXRCUVVzc1EwRkRXQ3d5UWtGQk1rSXNkMEpCUVhkQ0xHZERRVUZuUXl4RFFVTndSaXhEUVVGRE8zZENRVU5HTEZGQlFWRXNRMEZEVGl4M1FrRkJkMElzUlVGRGVFSXNTMEZCU3l4RlFVTk1MRmRCUVZjc1EwRkJReXhWUVVGVkxFVkJRM1JDTEZkQlFWY3NSVUZEV0N4WFFVRlhMRU5CUTFvc1EwRkJRenQzUWtGRFJpeFBRVUZQTEV0QlFVc3NRMEZCUXp0eFFrRkRaRHR2UWtGRFJDeFJRVUZSTEVOQlEwNHNkMEpCUVhkQ0xFVkJRM2hDTEV0QlFVc3NSVUZEVEN4WFFVRlhMRU5CUVVNc1IwRkJSeXhGUVVObUxGZEJRVmNzUlVGRFdDeFhRVUZYTEVOQlExb3NRMEZCUXp0dlFrRkRSaXhQUVVGUExGZEJRVmNzUTBGQlF6dG5Ra0ZEY2tJc1EwRkJReXhEUVVGRE8xbEJRMG9zUTBGQlF5eERRVUZETEVWQlFVVTdVMEZEVEN4RFFVRkRMRU5CUVVNN1NVRkRUQ3hEUVVGRE8wbEJSVVFzVTBGQlV5eG5Ra0ZCWjBJc1EwRkRka0lzVFVGQlZ5eEZRVU5ZTEdkQ1FVRjNRaXhGUVVONFFpeFhRVUYzUWp0UlFVVjRRaXhuUmtGQlowWTdVVUZEYUVZc2QwTkJRWGRETzFGQlEzaERMRWxCUVVrc2MwSkJRV2RETEVOQlFVTTdVVUZEY2tNc1NVRkJTU3hYUVVGWExFTkJRVU1zYzBKQlFYTkNMRXRCUVVzc1NVRkJTU3hGUVVGRk8xbEJReTlETEhOQ1FVRnpRaXhIUVVGSExFVkJRVVVzUTBGQlF6dFRRVU0zUWp0aFFVRk5MRWxCUVVrc1YwRkJWeXhEUVVGRExITkNRVUZ6UWl4RFFVRkRMRTFCUVUwc1MwRkJTeXhEUVVGRExFVkJRVVU3V1VGRE1VUXNjMEpCUVhOQ0xFZEJRVWNzVFVGQlRTeERRVUZETEdkQ1FVRm5RaXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETzFOQlF6RkVPMkZCUVUwN1dVRkRUQ3h6UWtGQmMwSXNSMEZCUnl4WFFVRlhMRU5CUVVNc2MwSkJRWE5DTEVOQlFVTTdVMEZETjBRN1VVRkRSQ3hMUVVGTExFMUJRVTBzV1VGQldTeEpRVUZKTEhOQ1FVRnpRaXhGUVVGRk8xbEJRMnBFTEVsQlFVa3NWMEZCVnl4RFFVRkRMR3RDUVVGclFpeERRVUZETEZGQlFWRXNRMEZCUXl4WlFVRlpMRU5CUVVNc1JVRkJSVHRuUWtGRGVrUXNVMEZCVXp0aFFVTldPMWxCUTBRc1owVkJRV2RGTzFsQlEyaEZMSE5FUVVGelJEdFpRVU4wUkN4SlFVTkZMRmRCUVZjc1EwRkJReXhUUVVGVE8yZENRVU55UWl4WFFVRlhMRU5CUVVNc1MwRkJTeXhIUVVGSExFTkJRVU03WjBKQlEzSkNMRkZCUVZFc1EwRkJReXhOUVVGTkxFVkJRVVVzV1VGQldTeERRVUZETzJkQ1FVTTVRaXhaUVVGWkxFdEJRVXNzVjBGQlZ5eEZRVU0xUWp0blFrRkRRU3hOUVVGTkxHMUNRVUZ0UWl4SFFVRkhMRWRCUVVjc1owSkJRV2RDTEVsQlFVa3NXVUZCV1N4RlFVRkZMRU5CUVVNN1owSkJRMnhGTEUxQlFVMHNZMEZCWXl4SFFVRkhMRVZCUVVVc1IwRkJSeXhYUVVGWExFVkJRVVVzUTBGQlF6dG5Ra0ZETVVNc1kwRkJZeXhEUVVGRExFdEJRVXNzUjBGQlJ5eFhRVUZYTEVOQlFVTXNTMEZCU3l4SFFVRkhMRU5CUVVNc1EwRkJRenRuUWtGRE4wTXNZMEZCWXl4RFFVRkRMSE5DUVVGelFpeEhRVUZITEVWQlFVVXNRMEZCUXp0blFrRkRNME1zWjBKQlFXZENMRU5CUTJRc1RVRkJUU3hEUVVGRExGbEJRVmtzUTBGQlF5eEZRVU53UWl4dFFrRkJiVUlzUlVGRGJrSXNZMEZCWXl4RFFVTm1MRU5CUVVNN1lVRkRTRHRaUVVORUxFbEJRVWs3WjBKQlEwWXNkMEpCUVhkQ0xFTkJRM1JDTEUxQlFVMHNSVUZEVGl4blFrRkJaMElzUlVGRGFFSXNXVUZCV1N4RlFVTmFMRmRCUVZjc1EwRkRXaXhEUVVGRE8yRkJRMGc3V1VGQlF5eFBRVUZQTEV0QlFVc3NSVUZCUlR0blFrRkRaQ3hKUVVORkxFdEJRVXNzV1VGQldTeFRRVUZUTzI5Q1FVTXhRaXhMUVVGTExFTkJRVU1zVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl3d1EwRkJNRU1zUTBGQlF5eEZRVU5zUlR0dlFrRkRRU3hQUVVGUExFTkJRVU1zU1VGQlNTeERRVU5XTEdkRVFVRm5SQ3huUWtGQlowSXNTVUZCU1N4WlFVRlpMRVZCUVVVc1EwRkRia1lzUTBGQlF6dHBRa0ZEU0R0eFFrRkJUVHR2UWtGRFRDeHBRa0ZCYVVJc1EwRkJReXhMUVVGTExFVkJRVVVzUlVGQlJTeG5Ra0ZCWjBJc1JVRkJSU3haUVVGWkxFVkJRVVVzUTBGQlF5eERRVUZETzJsQ1FVTTVSRHRoUVVOR08xTkJRMFk3VVVGRFJDeExRVUZMTEUxQlFVMHNXVUZCV1N4SlFVRkpMRmRCUVZjc1EwRkJReXhwUTBGQmFVTXNSVUZCUlR0WlFVTjRSU3hKUVVGSkxGZEJRVmNzUTBGQlF5eHJRa0ZCYTBJc1EwRkJReXhSUVVGUkxFTkJRVU1zV1VGQldTeERRVUZETEVWQlFVVTdaMEpCUTNwRUxGTkJRVk03WVVGRFZqdFpRVU5FTEVsQlFVazdaMEpCUTBZc2QwSkJRWGRDTEVOQlEzUkNMRTFCUVUwc1JVRkRUaXhuUWtGQlowSXNSVUZEYUVJc1dVRkJXU3hGUVVOYUxGZEJRVmNzUTBGRFdpeERRVUZETzJGQlEwZzdXVUZCUXl4UFFVRlBMRXRCUVVzc1JVRkJSVHRuUWtGRFpDeHBRa0ZCYVVJc1EwRkJReXhMUVVGTExFVkJRVVVzUlVGQlJTeG5Ra0ZCWjBJc1JVRkJSU3haUVVGWkxFVkJRVVVzUTBGQlF5eERRVUZETzJGQlF6bEVPMU5CUTBZN1NVRkRTQ3hEUVVGRE8wbEJSVVFzVFVGQlRTeFhRVUZYTEVkQlFVY3NWVUZCVXl4UFFVRlBMRVZCUVVVc2NVSkJRWEZDTzFGQlEzcEVMRWxCUVVrc1VVRkJVU3hIUVVGSExFVkJRVVVzUTBGQlF6dFJRVU5zUWl4dFEwRkJiVU03VVVGRGJrTXNUVUZCVFN4TFFVRkxMRWRCUVVjc1VVRkJVU3hEUVVGRE8xbEJRM0pDTEhGQ1FVRnhRaXhEUVVGRExFOUJRVThzUlVGQlJTeFJRVUZSTEVOQlFVTXNRMEZCUXp0WlFVVjZReXhyUWtGQmEwSTdXVUZEYkVJc1VVRkJVU3hIUVVGSExFVkJRVVVzUTBGQlF6dFJRVU5vUWl4RFFVRkRMRVZCUVVVc1IwRkJSeXhEUVVGRExFTkJRVU03VVVGRlVpeFBRVUZQTEZWQlFWTXNUMEZCVHl4RlFVRkZMRWRCUVVjN1dVRkRNVUlzYjBKQlFXOUNPMWxCUTNCQ0xGRkJRVkVzUTBGQlF5eEpRVUZKTEVOQlFVTXNSVUZCUlN4SlFVRkpMRVZCUVVVc1QwRkJUeXhGUVVGRkxFOUJRVThzUlVGQlJTeEhRVUZITEVWQlFVVXNRMEZCUXl4RFFVRkRPMWxCUXk5RExFdEJRVXNzUlVGQlJTeERRVUZETzFGQlExWXNRMEZCUXl4RFFVRkRPMGxCUTBvc1EwRkJReXhEUVVGRE8wbEJSVVlzVFVGQlRTeEpRVUZKTEVkQlFVY3NWMEZCVnl4RFFVRkRMRTlCUVU4c1JVRkJSU3h2UWtGQmIwSXNRMEZCUXl4RFFVRkRPMGxCUlhoRUxGTkJRVk1zV1VGQldTeERRVUZETEc5Q1FVRXlRenRSUVVNdlJDeHBSVUZCYVVVN1VVRkRha1VzT0VOQlFUaERPMUZCUlRsRExIbEVRVUY1UkR0UlFVTjZSQ3hwUkVGQmFVUTdVVUZEYWtRc2IwSkJRVzlDTEVOQlFVTXNUMEZCVHl4RFFVRkRMRlZCUVZNc1NVRkJTVHRaUVVONFF5eG5Ra0ZCWjBJc1EwRkJReXhKUVVGSkxFTkJRVU1zVFVGQlRTeEZRVUZGTEVsQlFVa3NRMEZCUXl4blFrRkJaMElzUlVGQlJTeEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRMRU5CUVVNN1VVRkRla1VzUTBGQlF5eERRVUZETEVOQlFVTTdTVUZEVEN4RFFVRkRPMGxCUlVRc1owWkJRV2RHTzBsQlEyaEdMRTlCUVU4c1dVRkJXU3hEUVVGRE8wRkJRM1JDTEVOQlFVTWlmUT09IiwiLyoqXG4gKiBUaWVzIHRvZ2V0aGVyIHRoZSB0d28gc2VwYXJhdGUgbmF2aWdhdGlvbiBldmVudHMgdGhhdCB0b2dldGhlciBob2xkcyBpbmZvcm1hdGlvbiBhYm91dCBib3RoIHBhcmVudCBmcmFtZSBpZCBhbmQgdHJhbnNpdGlvbi1yZWxhdGVkIGF0dHJpYnV0ZXNcbiAqL1xuZXhwb3J0IGNsYXNzIFBlbmRpbmdOYXZpZ2F0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5vbkJlZm9yZU5hdmlnYXRlRXZlbnROYXZpZ2F0aW9uID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmVPbkJlZm9yZU5hdmlnYXRlRXZlbnROYXZpZ2F0aW9uID0gcmVzb2x2ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMub25Db21taXR0ZWRFdmVudE5hdmlnYXRpb24gPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZU9uQ29tbWl0dGVkRXZlbnROYXZpZ2F0aW9uID0gcmVzb2x2ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlc29sdmVkKCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGhpcy5vbkJlZm9yZU5hdmlnYXRlRXZlbnROYXZpZ2F0aW9uLFxuICAgICAgICAgICAgdGhpcy5vbkNvbW1pdHRlZEV2ZW50TmF2aWdhdGlvbixcbiAgICAgICAgXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEVpdGhlciByZXR1cm5zIG9yIHRpbWVzIG91dCBhbmQgcmV0dXJucyB1bmRlZmluZWQgb3JcbiAgICAgKiByZXR1cm5zIHRoZSByZXN1bHRzIGZyb20gcmVzb2x2ZWQoKSBhYm92ZVxuICAgICAqIEBwYXJhbSBtc1xuICAgICAqL1xuICAgIGFzeW5jIHJlc29sdmVkV2l0aGluVGltZW91dChtcykge1xuICAgICAgICBjb25zdCByZXNvbHZlZCA9IGF3YWl0IFByb21pc2UucmFjZShbXG4gICAgICAgICAgICB0aGlzLnJlc29sdmVkKCksXG4gICAgICAgICAgICBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKSxcbiAgICAgICAgXSk7XG4gICAgICAgIHJldHVybiByZXNvbHZlZDtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2ljR1Z1WkdsdVp5MXVZWFpwWjJGMGFXOXVMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUxpNHZMaTR2TGk0dmMzSmpMMnhwWWk5d1pXNWthVzVuTFc1aGRtbG5ZWFJwYjI0dWRITWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJSVUU3TzBkQlJVYzdRVUZEU0N4TlFVRk5MRTlCUVU4c2FVSkJRV2xDTzBsQlN6VkNPMUZCUTBVc1NVRkJTU3hEUVVGRExDdENRVUVyUWl4SFFVRkhMRWxCUVVrc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eEZRVUZGTzFsQlF6TkVMRWxCUVVrc1EwRkJReXh6UTBGQmMwTXNSMEZCUnl4UFFVRlBMRU5CUVVNN1VVRkRlRVFzUTBGQlF5eERRVUZETEVOQlFVTTdVVUZEU0N4SlFVRkpMRU5CUVVNc01FSkJRVEJDTEVkQlFVY3NTVUZCU1N4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFVkJRVVU3V1VGRGRFUXNTVUZCU1N4RFFVRkRMR2xEUVVGcFF5eEhRVUZITEU5QlFVOHNRMEZCUXp0UlFVTnVSQ3hEUVVGRExFTkJRVU1zUTBGQlF6dEpRVU5NTEVOQlFVTTdTVUZEVFN4UlFVRlJPMUZCUTJJc1QwRkJUeXhQUVVGUExFTkJRVU1zUjBGQlJ5eERRVUZETzFsQlEycENMRWxCUVVrc1EwRkJReXdyUWtGQkswSTdXVUZEY0VNc1NVRkJTU3hEUVVGRExEQkNRVUV3UWp0VFFVTm9ReXhEUVVGRExFTkJRVU03U1VGRFRDeERRVUZETzBsQlJVUTdPenM3VDBGSlJ6dEpRVU5KTEV0QlFVc3NRMEZCUXl4eFFrRkJjVUlzUTBGQlF5eEZRVUZGTzFGQlEyNURMRTFCUVUwc1VVRkJVU3hIUVVGSExFMUJRVTBzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXp0WlFVTnNReXhKUVVGSkxFTkJRVU1zVVVGQlVTeEZRVUZGTzFsQlEyWXNTVUZCU1N4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFVkJRVVVzUTBGQlF5eFZRVUZWTEVOQlFVTXNUMEZCVHl4RlFVRkZMRVZCUVVVc1EwRkJReXhEUVVGRE8xTkJRMmhFTEVOQlFVTXNRMEZCUXp0UlFVTklMRTlCUVU4c1VVRkJVU3hEUVVGRE8wbEJRMnhDTEVOQlFVTTdRMEZEUmlKOSIsIi8qKlxuICogVGllcyB0b2dldGhlciB0aGUgdHdvIHNlcGFyYXRlIGV2ZW50cyB0aGF0IHRvZ2V0aGVyIGhvbGRzIGluZm9ybWF0aW9uIGFib3V0IGJvdGggcmVxdWVzdCBoZWFkZXJzIGFuZCBib2R5XG4gKi9cbmV4cG9ydCBjbGFzcyBQZW5kaW5nUmVxdWVzdCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMub25CZWZvcmVSZXF1ZXN0RXZlbnREZXRhaWxzID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmVPbkJlZm9yZVJlcXVlc3RFdmVudERldGFpbHMgPSByZXNvbHZlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vbkJlZm9yZVNlbmRIZWFkZXJzRXZlbnREZXRhaWxzID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmVPbkJlZm9yZVNlbmRIZWFkZXJzRXZlbnREZXRhaWxzID0gcmVzb2x2ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlc29sdmVkKCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGhpcy5vbkJlZm9yZVJlcXVlc3RFdmVudERldGFpbHMsXG4gICAgICAgICAgICB0aGlzLm9uQmVmb3JlU2VuZEhlYWRlcnNFdmVudERldGFpbHMsXG4gICAgICAgIF0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBFaXRoZXIgcmV0dXJucyBvciB0aW1lcyBvdXQgYW5kIHJldHVybnMgdW5kZWZpbmVkIG9yXG4gICAgICogcmV0dXJucyB0aGUgcmVzdWx0cyBmcm9tIHJlc29sdmVkKCkgYWJvdmVcbiAgICAgKiBAcGFyYW0gbXNcbiAgICAgKi9cbiAgICBhc3luYyByZXNvbHZlZFdpdGhpblRpbWVvdXQobXMpIHtcbiAgICAgICAgY29uc3QgcmVzb2x2ZWQgPSBhd2FpdCBQcm9taXNlLnJhY2UoW1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlZCgpLFxuICAgICAgICAgICAgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSksXG4gICAgICAgIF0pO1xuICAgICAgICByZXR1cm4gcmVzb2x2ZWQ7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pY0dWdVpHbHVaeTF5WlhGMVpYTjBMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUxpNHZMaTR2TGk0dmMzSmpMMnhwWWk5d1pXNWthVzVuTFhKbGNYVmxjM1F1ZEhNaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlMwRTdPMGRCUlVjN1FVRkRTQ3hOUVVGTkxFOUJRVThzWTBGQll6dEpRV0Y2UWp0UlFVTkZMRWxCUVVrc1EwRkJReXd5UWtGQk1rSXNSMEZCUnl4SlFVRkpMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUlVGQlJUdFpRVU4yUkN4SlFVRkpMRU5CUVVNc2EwTkJRV3RETEVkQlFVY3NUMEZCVHl4RFFVRkRPMUZCUTNCRUxFTkJRVU1zUTBGQlF5eERRVUZETzFGQlEwZ3NTVUZCU1N4RFFVRkRMQ3RDUVVFclFpeEhRVUZITEVsQlFVa3NUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhGUVVGRk8xbEJRek5FTEVsQlFVa3NRMEZCUXl4elEwRkJjME1zUjBGQlJ5eFBRVUZQTEVOQlFVTTdVVUZEZUVRc1EwRkJReXhEUVVGRExFTkJRVU03U1VGRFRDeERRVUZETzBsQlEwMHNVVUZCVVR0UlFVTmlMRTlCUVU4c1QwRkJUeXhEUVVGRExFZEJRVWNzUTBGQlF6dFpRVU5xUWl4SlFVRkpMRU5CUVVNc01rSkJRVEpDTzFsQlEyaERMRWxCUVVrc1EwRkJReXdyUWtGQkswSTdVMEZEY2tNc1EwRkJReXhEUVVGRE8wbEJRMHdzUTBGQlF6dEpRVVZFT3pzN08wOUJTVWM3U1VGRFNTeExRVUZMTEVOQlFVTXNjVUpCUVhGQ0xFTkJRVU1zUlVGQlJUdFJRVU51UXl4TlFVRk5MRkZCUVZFc1IwRkJSeXhOUVVGTkxFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTTdXVUZEYkVNc1NVRkJTU3hEUVVGRExGRkJRVkVzUlVGQlJUdFpRVU5tTEVsQlFVa3NUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhGUVVGRkxFTkJRVU1zVlVGQlZTeERRVUZETEU5QlFVOHNSVUZCUlN4RlFVRkZMRU5CUVVNc1EwRkJRenRUUVVOb1JDeERRVUZETEVOQlFVTTdVVUZEU0N4UFFVRlBMRkZCUVZFc1EwRkJRenRKUVVOc1FpeERRVUZETzBOQlEwWWlmUT09IiwiaW1wb3J0IHsgUmVzcG9uc2VCb2R5TGlzdGVuZXIgfSBmcm9tIFwiLi9yZXNwb25zZS1ib2R5LWxpc3RlbmVyXCI7XG4vKipcbiAqIFRpZXMgdG9nZXRoZXIgdGhlIHR3byBzZXBhcmF0ZSBldmVudHMgdGhhdCB0b2dldGhlciBob2xkcyBpbmZvcm1hdGlvbiBhYm91dCBib3RoIHJlc3BvbnNlIGhlYWRlcnMgYW5kIGJvZHlcbiAqL1xuZXhwb3J0IGNsYXNzIFBlbmRpbmdSZXNwb25zZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMub25CZWZvcmVSZXF1ZXN0RXZlbnREZXRhaWxzID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmVPbkJlZm9yZVJlcXVlc3RFdmVudERldGFpbHMgPSByZXNvbHZlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vbkNvbXBsZXRlZEV2ZW50RGV0YWlscyA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlT25Db21wbGV0ZWRFdmVudERldGFpbHMgPSByZXNvbHZlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYWRkUmVzcG9uc2VSZXNwb25zZUJvZHlMaXN0ZW5lcihkZXRhaWxzKSB7XG4gICAgICAgIHRoaXMucmVzcG9uc2VCb2R5TGlzdGVuZXIgPSBuZXcgUmVzcG9uc2VCb2R5TGlzdGVuZXIoZGV0YWlscyk7XG4gICAgfVxuICAgIHJlc29sdmVkKCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGhpcy5vbkJlZm9yZVJlcXVlc3RFdmVudERldGFpbHMsXG4gICAgICAgICAgICB0aGlzLm9uQ29tcGxldGVkRXZlbnREZXRhaWxzLFxuICAgICAgICBdKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRWl0aGVyIHJldHVybnMgb3IgdGltZXMgb3V0IGFuZCByZXR1cm5zIHVuZGVmaW5lZCBvclxuICAgICAqIHJldHVybnMgdGhlIHJlc3VsdHMgZnJvbSByZXNvbHZlZCgpIGFib3ZlXG4gICAgICogQHBhcmFtIG1zXG4gICAgICovXG4gICAgYXN5bmMgcmVzb2x2ZWRXaXRoaW5UaW1lb3V0KG1zKSB7XG4gICAgICAgIGNvbnN0IHJlc29sdmVkID0gYXdhaXQgUHJvbWlzZS5yYWNlKFtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZWQoKSxcbiAgICAgICAgICAgIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpLFxuICAgICAgICBdKTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmVkO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWNHVnVaR2x1WnkxeVpYTndiMjV6WlM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUx5NHVMM055WXk5c2FXSXZjR1Z1WkdsdVp5MXlaWE53YjI1elpTNTBjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZKUVN4UFFVRlBMRVZCUVVVc2IwSkJRVzlDTEVWQlFVVXNUVUZCVFN3d1FrRkJNRUlzUTBGQlF6dEJRVVZvUlRzN1IwRkZSenRCUVVOSUxFMUJRVTBzVDBGQlR5eGxRVUZsTzBsQll6RkNPMUZCUTBVc1NVRkJTU3hEUVVGRExESkNRVUV5UWl4SFFVRkhMRWxCUVVrc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eEZRVUZGTzFsQlEzWkVMRWxCUVVrc1EwRkJReXhyUTBGQmEwTXNSMEZCUnl4UFFVRlBMRU5CUVVNN1VVRkRjRVFzUTBGQlF5eERRVUZETEVOQlFVTTdVVUZEU0N4SlFVRkpMRU5CUVVNc2RVSkJRWFZDTEVkQlFVY3NTVUZCU1N4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFVkJRVVU3V1VGRGJrUXNTVUZCU1N4RFFVRkRMRGhDUVVFNFFpeEhRVUZITEU5QlFVOHNRMEZCUXp0UlFVTm9SQ3hEUVVGRExFTkJRVU1zUTBGQlF6dEpRVU5NTEVOQlFVTTdTVUZEVFN3clFrRkJLMElzUTBGRGNFTXNUMEZCT0VNN1VVRkZPVU1zU1VGQlNTeERRVUZETEc5Q1FVRnZRaXhIUVVGSExFbEJRVWtzYjBKQlFXOUNMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03U1VGRGFFVXNRMEZCUXp0SlFVTk5MRkZCUVZFN1VVRkRZaXhQUVVGUExFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTTdXVUZEYWtJc1NVRkJTU3hEUVVGRExESkNRVUV5UWp0WlFVTm9ReXhKUVVGSkxFTkJRVU1zZFVKQlFYVkNPMU5CUXpkQ0xFTkJRVU1zUTBGQlF6dEpRVU5NTEVOQlFVTTdTVUZGUkRzN096dFBRVWxITzBsQlEwa3NTMEZCU3l4RFFVRkRMSEZDUVVGeFFpeERRVUZETEVWQlFVVTdVVUZEYmtNc1RVRkJUU3hSUVVGUkxFZEJRVWNzVFVGQlRTeFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRPMWxCUTJ4RExFbEJRVWtzUTBGQlF5eFJRVUZSTEVWQlFVVTdXVUZEWml4SlFVRkpMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUlVGQlJTeERRVUZETEZWQlFWVXNRMEZCUXl4UFFVRlBMRVZCUVVVc1JVRkJSU3hEUVVGRExFTkJRVU03VTBGRGFFUXNRMEZCUXl4RFFVRkRPMUZCUTBnc1QwRkJUeXhSUVVGUkxFTkJRVU03U1VGRGJFSXNRMEZCUXp0RFFVTkdJbjA9IiwiaW1wb3J0IHsgZGlnZXN0TWVzc2FnZSB9IGZyb20gXCIuL3NoYTI1NlwiO1xuZXhwb3J0IGNsYXNzIFJlc3BvbnNlQm9keUxpc3RlbmVyIHtcbiAgICBjb25zdHJ1Y3RvcihkZXRhaWxzKSB7XG4gICAgICAgIHRoaXMucmVzcG9uc2VCb2R5ID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmVSZXNwb25zZUJvZHkgPSByZXNvbHZlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jb250ZW50SGFzaCA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlQ29udGVudEhhc2ggPSByZXNvbHZlO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gVXNlZCB0byBwYXJzZSBSZXNwb25zZSBzdHJlYW1cbiAgICAgICAgY29uc3QgZmlsdGVyID0gYnJvd3Nlci53ZWJSZXF1ZXN0LmZpbHRlclJlc3BvbnNlRGF0YShkZXRhaWxzLnJlcXVlc3RJZCk7XG4gICAgICAgIGxldCByZXNwb25zZUJvZHkgPSBuZXcgVWludDhBcnJheSgpO1xuICAgICAgICBmaWx0ZXIub25kYXRhID0gZXZlbnQgPT4ge1xuICAgICAgICAgICAgZGlnZXN0TWVzc2FnZShldmVudC5kYXRhKS50aGVuKGRpZ2VzdCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlQ29udGVudEhhc2goZGlnZXN0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgaW5jb21pbmcgPSBuZXcgVWludDhBcnJheShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnN0IHRtcCA9IG5ldyBVaW50OEFycmF5KHJlc3BvbnNlQm9keS5sZW5ndGggKyBpbmNvbWluZy5sZW5ndGgpO1xuICAgICAgICAgICAgdG1wLnNldChyZXNwb25zZUJvZHkpO1xuICAgICAgICAgICAgdG1wLnNldChpbmNvbWluZywgcmVzcG9uc2VCb2R5Lmxlbmd0aCk7XG4gICAgICAgICAgICByZXNwb25zZUJvZHkgPSB0bXA7XG4gICAgICAgICAgICBmaWx0ZXIud3JpdGUoZXZlbnQuZGF0YSk7XG4gICAgICAgIH07XG4gICAgICAgIGZpbHRlci5vbnN0b3AgPSBfZXZlbnQgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlUmVzcG9uc2VCb2R5KHJlc3BvbnNlQm9keSk7XG4gICAgICAgICAgICBmaWx0ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBhc3luYyBnZXRSZXNwb25zZUJvZHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlc3BvbnNlQm9keTtcbiAgICB9XG4gICAgYXN5bmMgZ2V0Q29udGVudEhhc2goKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnRIYXNoO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWNtVnpjRzl1YzJVdFltOWtlUzFzYVhOMFpXNWxjaTVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpNHVMeTR1THk0dUwzTnlZeTlzYVdJdmNtVnpjRzl1YzJVdFltOWtlUzFzYVhOMFpXNWxjaTUwY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGRFFTeFBRVUZQTEVWQlFVVXNZVUZCWVN4RlFVRkZMRTFCUVUwc1ZVRkJWU3hEUVVGRE8wRkJSWHBETEUxQlFVMHNUMEZCVHl4dlFrRkJiMEk3U1VGTkwwSXNXVUZCV1N4UFFVRTRRenRSUVVONFJDeEpRVUZKTEVOQlFVTXNXVUZCV1N4SFFVRkhMRWxCUVVrc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eEZRVUZGTzFsQlEzaERMRWxCUVVrc1EwRkJReXh0UWtGQmJVSXNSMEZCUnl4UFFVRlBMRU5CUVVNN1VVRkRja01zUTBGQlF5eERRVUZETEVOQlFVTTdVVUZEU0N4SlFVRkpMRU5CUVVNc1YwRkJWeXhIUVVGSExFbEJRVWtzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4RlFVRkZPMWxCUTNaRExFbEJRVWtzUTBGQlF5eHJRa0ZCYTBJc1IwRkJSeXhQUVVGUExFTkJRVU03VVVGRGNFTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkZTQ3huUTBGQlowTTdVVUZEYUVNc1RVRkJUU3hOUVVGTkxFZEJRVkVzVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4clFrRkJhMElzUTBGRGRrUXNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkRXQ3hEUVVGRE8xRkJSVlFzU1VGQlNTeFpRVUZaTEVkQlFVY3NTVUZCU1N4VlFVRlZMRVZCUVVVc1EwRkJRenRSUVVOd1F5eE5RVUZOTEVOQlFVTXNUVUZCVFN4SFFVRkhMRXRCUVVzc1EwRkJReXhGUVVGRk8xbEJRM1JDTEdGQlFXRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4RlFVRkZPMmRDUVVOMFF5eEpRVUZKTEVOQlFVTXNhMEpCUVd0Q0xFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdXVUZEYkVNc1EwRkJReXhEUVVGRExFTkJRVU03V1VGRFNDeE5RVUZOTEZGQlFWRXNSMEZCUnl4SlFVRkpMRlZCUVZVc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdXVUZETlVNc1RVRkJUU3hIUVVGSExFZEJRVWNzU1VGQlNTeFZRVUZWTEVOQlFVTXNXVUZCV1N4RFFVRkRMRTFCUVUwc1IwRkJSeXhSUVVGUkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdXVUZEYkVVc1IwRkJSeXhEUVVGRExFZEJRVWNzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXp0WlFVTjBRaXhIUVVGSExFTkJRVU1zUjBGQlJ5eERRVUZETEZGQlFWRXNSVUZCUlN4WlFVRlpMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03V1VGRGRrTXNXVUZCV1N4SFFVRkhMRWRCUVVjc1EwRkJRenRaUVVOdVFpeE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dFJRVU16UWl4RFFVRkRMRU5CUVVNN1VVRkZSaXhOUVVGTkxFTkJRVU1zVFVGQlRTeEhRVUZITEUxQlFVMHNRMEZCUXl4RlFVRkZPMWxCUTNaQ0xFbEJRVWtzUTBGQlF5eHRRa0ZCYlVJc1EwRkJReXhaUVVGWkxFTkJRVU1zUTBGQlF6dFpRVU4yUXl4TlFVRk5MRU5CUVVNc1ZVRkJWU3hGUVVGRkxFTkJRVU03VVVGRGRFSXNRMEZCUXl4RFFVRkRPMGxCUTBvc1EwRkJRenRKUVVWTkxFdEJRVXNzUTBGQlF5eGxRVUZsTzFGQlF6RkNMRTlCUVU4c1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF6dEpRVU16UWl4RFFVRkRPMGxCUlUwc1MwRkJTeXhEUVVGRExHTkJRV003VVVGRGVrSXNUMEZCVHl4SlFVRkpMRU5CUVVNc1YwRkJWeXhEUVVGRE8wbEJRekZDTEVOQlFVTTdRMEZEUmlKOSIsIi8qKlxuICogQ29kZSBmcm9tIHRoZSBleGFtcGxlIGF0XG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvU3VidGxlQ3J5cHRvL2RpZ2VzdFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGlnZXN0TWVzc2FnZShtc2dVaW50OCkge1xuICAgIGNvbnN0IGhhc2hCdWZmZXIgPSBhd2FpdCBjcnlwdG8uc3VidGxlLmRpZ2VzdChcIlNIQS0yNTZcIiwgbXNnVWludDgpOyAvLyBoYXNoIHRoZSBtZXNzYWdlXG4gICAgY29uc3QgaGFzaEFycmF5ID0gQXJyYXkuZnJvbShuZXcgVWludDhBcnJheShoYXNoQnVmZmVyKSk7IC8vIGNvbnZlcnQgYnVmZmVyIHRvIGJ5dGUgYXJyYXlcbiAgICBjb25zdCBoYXNoSGV4ID0gaGFzaEFycmF5Lm1hcChiID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsIFwiMFwiKSkuam9pbihcIlwiKTsgLy8gY29udmVydCBieXRlcyB0byBoZXggc3RyaW5nXG4gICAgcmV0dXJuIGhhc2hIZXg7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2ljMmhoTWpVMkxtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTGk0dkxpNHZMaTR2YzNKakwyeHBZaTl6YUdFeU5UWXVkSE1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN096dEhRVWRITzBGQlJVZ3NUVUZCVFN4RFFVRkRMRXRCUVVzc1ZVRkJWU3hoUVVGaExFTkJRVU1zVVVGQmIwSTdTVUZEZEVRc1RVRkJUU3hWUVVGVkxFZEJRVWNzVFVGQlRTeE5RVUZOTEVOQlFVTXNUVUZCVFN4RFFVRkRMRTFCUVUwc1EwRkJReXhUUVVGVExFVkJRVVVzVVVGQlVTeERRVUZETEVOQlFVTXNRMEZCUXl4dFFrRkJiVUk3U1VGRGRrWXNUVUZCVFN4VFFVRlRMRWRCUVVjc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEZWQlFWVXNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zSzBKQlFTdENPMGxCUTNwR0xFMUJRVTBzVDBGQlR5eEhRVUZITEZOQlFWTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRExFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTXNVVUZCVVN4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEVWQlFVVXNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXl3NFFrRkJPRUk3U1VGRE5VY3NUMEZCVHl4UFFVRlBMRU5CUVVNN1FVRkRha0lzUTBGQlF5SjkiLCJleHBvcnQgZnVuY3Rpb24gZW5jb2RlX3V0Zjgocykge1xuICAgIHJldHVybiB1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQocykpO1xufVxuZXhwb3J0IGNvbnN0IGVzY2FwZVN0cmluZyA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAvLyBDb252ZXJ0IHRvIHN0cmluZyBpZiBuZWNlc3NhcnlcbiAgICBpZiAodHlwZW9mIHN0ciAhPSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHN0ciA9IFN0cmluZyhzdHIpO1xuICAgIH1cbiAgICByZXR1cm4gZW5jb2RlX3V0Zjgoc3RyKTtcbn07XG5leHBvcnQgY29uc3QgZXNjYXBlVXJsID0gZnVuY3Rpb24gKHVybCwgc3RyaXBEYXRhVXJsRGF0YSA9IHRydWUpIHtcbiAgICB1cmwgPSBlc2NhcGVTdHJpbmcodXJsKTtcbiAgICAvLyBkYXRhOls8bWVkaWF0eXBlPl1bO2Jhc2U2NF0sPGRhdGE+XG4gICAgaWYgKHVybC5zdWJzdHIoMCwgNSkgPT09IFwiZGF0YTpcIiAmJlxuICAgICAgICBzdHJpcERhdGFVcmxEYXRhICYmXG4gICAgICAgIHVybC5pbmRleE9mKFwiLFwiKSA+IC0xKSB7XG4gICAgICAgIHVybCA9IHVybC5zdWJzdHIoMCwgdXJsLmluZGV4T2YoXCIsXCIpICsgMSkgKyBcIjxkYXRhLXN0cmlwcGVkPlwiO1xuICAgIH1cbiAgICByZXR1cm4gdXJsO1xufTtcbi8vIEJhc2U2NCBlbmNvZGluZywgZm91bmQgb246XG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMjcxMDAwMS9ob3ctdG8tY29udmVydC11aW50OC1hcnJheS10by1iYXNlNjQtZW5jb2RlZC1zdHJpbmcvMjU2NDQ0MDkjMjU2NDQ0MDlcbmV4cG9ydCBjb25zdCBVaW50OFRvQmFzZTY0ID0gZnVuY3Rpb24gKHU4QXJyKSB7XG4gICAgY29uc3QgQ0hVTktfU0laRSA9IDB4ODAwMDsgLy8gYXJiaXRyYXJ5IG51bWJlclxuICAgIGxldCBpbmRleCA9IDA7XG4gICAgY29uc3QgbGVuZ3RoID0gdThBcnIubGVuZ3RoO1xuICAgIGxldCByZXN1bHQgPSBcIlwiO1xuICAgIGxldCBzbGljZTtcbiAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgc2xpY2UgPSB1OEFyci5zdWJhcnJheShpbmRleCwgTWF0aC5taW4oaW5kZXggKyBDSFVOS19TSVpFLCBsZW5ndGgpKTtcbiAgICAgICAgcmVzdWx0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgc2xpY2UpO1xuICAgICAgICBpbmRleCArPSBDSFVOS19TSVpFO1xuICAgIH1cbiAgICByZXR1cm4gYnRvYShyZXN1bHQpO1xufTtcbmV4cG9ydCBjb25zdCBib29sVG9JbnQgPSBmdW5jdGlvbiAoYm9vbCkge1xuICAgIHJldHVybiBib29sID8gMSA6IDA7XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pYzNSeWFXNW5MWFYwYVd4ekxtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTGk0dkxpNHZMaTR2YzNKakwyeHBZaTl6ZEhKcGJtY3RkWFJwYkhNdWRITWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzVFVGQlRTeFZRVUZWTEZkQlFWY3NRMEZCUXl4RFFVRkRPMGxCUXpOQ0xFOUJRVThzVVVGQlVTeERRVUZETEd0Q1FVRnJRaXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEZWtNc1EwRkJRenRCUVVWRUxFMUJRVTBzUTBGQlF5eE5RVUZOTEZsQlFWa3NSMEZCUnl4VlFVRlRMRWRCUVZFN1NVRkRNME1zYVVOQlFXbERPMGxCUTJwRExFbEJRVWtzVDBGQlR5eEhRVUZITEVsQlFVa3NVVUZCVVN4RlFVRkZPMUZCUXpGQ0xFZEJRVWNzUjBGQlJ5eE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN1MwRkRia0k3U1VGRlJDeFBRVUZQTEZkQlFWY3NRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVNeFFpeERRVUZETEVOQlFVTTdRVUZGUml4TlFVRk5MRU5CUVVNc1RVRkJUU3hUUVVGVExFZEJRVWNzVlVGRGRrSXNSMEZCVnl4RlFVTllMRzFDUVVFMFFpeEpRVUZKTzBsQlJXaERMRWRCUVVjc1IwRkJSeXhaUVVGWkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdTVUZEZUVJc2NVTkJRWEZETzBsQlEzSkRMRWxCUTBVc1IwRkJSeXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETEVWQlFVVXNRMEZCUXl4RFFVRkRMRXRCUVVzc1QwRkJUenRSUVVNMVFpeG5Ra0ZCWjBJN1VVRkRhRUlzUjBGQlJ5eERRVUZETEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUlVGRGNrSTdVVUZEUVN4SFFVRkhMRWRCUVVjc1IwRkJSeXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETEVWQlFVVXNSMEZCUnl4RFFVRkRMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNSMEZCUnl4cFFrRkJhVUlzUTBGQlF6dExRVU12UkR0SlFVTkVMRTlCUVU4c1IwRkJSeXhEUVVGRE8wRkJRMklzUTBGQlF5eERRVUZETzBGQlJVWXNOa0pCUVRaQ08wRkJRemRDTEhGSVFVRnhTRHRCUVVOeVNDeE5RVUZOTEVOQlFVTXNUVUZCVFN4aFFVRmhMRWRCUVVjc1ZVRkJVeXhMUVVGcFFqdEpRVU55UkN4TlFVRk5MRlZCUVZVc1IwRkJSeXhOUVVGTkxFTkJRVU1zUTBGQlF5eHRRa0ZCYlVJN1NVRkRPVU1zU1VGQlNTeExRVUZMTEVkQlFVY3NRMEZCUXl4RFFVRkRPMGxCUTJRc1RVRkJUU3hOUVVGTkxFZEJRVWNzUzBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXp0SlFVTTFRaXhKUVVGSkxFMUJRVTBzUjBGQlJ5eEZRVUZGTEVOQlFVTTdTVUZEYUVJc1NVRkJTU3hMUVVGcFFpeERRVUZETzBsQlEzUkNMRTlCUVU4c1MwRkJTeXhIUVVGSExFMUJRVTBzUlVGQlJUdFJRVU55UWl4TFFVRkxMRWRCUVVjc1MwRkJTeXhEUVVGRExGRkJRVkVzUTBGQlF5eExRVUZMTEVWQlFVVXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhMUVVGTExFZEJRVWNzVlVGQlZTeEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRjRVVzVFVGQlRTeEpRVUZKTEUxQlFVMHNRMEZCUXl4WlFVRlpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUlVGQlJTeExRVUZMTEVOQlFVTXNRMEZCUXp0UlFVTnFSQ3hMUVVGTExFbEJRVWtzVlVGQlZTeERRVUZETzB0QlEzSkNPMGxCUTBRc1QwRkJUeXhKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdRVUZEZEVJc1EwRkJReXhEUVVGRE8wRkJSVVlzVFVGQlRTeERRVUZETEUxQlFVMHNVMEZCVXl4SFFVRkhMRlZCUVZNc1NVRkJZVHRKUVVNM1F5eFBRVUZQTEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEZEVJc1EwRkJReXhEUVVGREluMD0iLCIvKiB0c2xpbnQ6ZGlzYWJsZTpuby1iaXR3aXNlICovXG4vLyBmcm9tIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2plZC85ODI4ODMjZ2lzdGNvbW1lbnQtMjQwMzM2OVxuY29uc3QgaGV4ID0gW107XG5mb3IgKGxldCBpID0gMDsgaSA8IDI1NjsgaSsrKSB7XG4gICAgaGV4W2ldID0gKGkgPCAxNiA/IFwiMFwiIDogXCJcIikgKyBpLnRvU3RyaW5nKDE2KTtcbn1cbmV4cG9ydCBjb25zdCBtYWtlVVVJRCA9ICgpID0+IHtcbiAgICBjb25zdCByID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheSgxNikpO1xuICAgIHJbNl0gPSAocls2XSAmIDB4MGYpIHwgMHg0MDtcbiAgICByWzhdID0gKHJbOF0gJiAweDNmKSB8IDB4ODA7XG4gICAgcmV0dXJuIChoZXhbclswXV0gK1xuICAgICAgICBoZXhbclsxXV0gK1xuICAgICAgICBoZXhbclsyXV0gK1xuICAgICAgICBoZXhbclszXV0gK1xuICAgICAgICBcIi1cIiArXG4gICAgICAgIGhleFtyWzRdXSArXG4gICAgICAgIGhleFtyWzVdXSArXG4gICAgICAgIFwiLVwiICtcbiAgICAgICAgaGV4W3JbNl1dICtcbiAgICAgICAgaGV4W3JbN11dICtcbiAgICAgICAgXCItXCIgK1xuICAgICAgICBoZXhbcls4XV0gK1xuICAgICAgICBoZXhbcls5XV0gK1xuICAgICAgICBcIi1cIiArXG4gICAgICAgIGhleFtyWzEwXV0gK1xuICAgICAgICBoZXhbclsxMV1dICtcbiAgICAgICAgaGV4W3JbMTJdXSArXG4gICAgICAgIGhleFtyWzEzXV0gK1xuICAgICAgICBoZXhbclsxNF1dICtcbiAgICAgICAgaGV4W3JbMTVdXSk7XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZFhWcFpDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMeTR1TDNOeVl5OXNhV0l2ZFhWcFpDNTBjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN3clFrRkJLMEk3UVVGRkwwSXNPRVJCUVRoRU8wRkJRemxFTEUxQlFVMHNSMEZCUnl4SFFVRkhMRVZCUVVVc1EwRkJRenRCUVVWbUxFdEJRVXNzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc1IwRkJSeXhIUVVGSExFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdTVUZETlVJc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4SFFVRkhMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zVVVGQlVTeERRVUZETEVWQlFVVXNRMEZCUXl4RFFVRkRPME5CUXk5RE8wRkJSVVFzVFVGQlRTeERRVUZETEUxQlFVMHNVVUZCVVN4SFFVRkhMRWRCUVVjc1JVRkJSVHRKUVVNelFpeE5RVUZOTEVOQlFVTXNSMEZCUnl4TlFVRk5MRU5CUVVNc1pVRkJaU3hEUVVGRExFbEJRVWtzVlVGQlZTeERRVUZETEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNN1NVRkZja1FzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eEhRVUZITEVsQlFVa3NRMEZCUXl4SFFVRkhMRWxCUVVrc1EwRkJRenRKUVVNMVFpeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRE8wbEJSVFZDTEU5QlFVOHNRMEZEVEN4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzFGQlExUXNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU5VTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRFZDeEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8xRkJRMVFzUjBGQlJ6dFJRVU5JTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRFZDeEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8xRkJRMVFzUjBGQlJ6dFJRVU5JTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRFZDeEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8xRkJRMVFzUjBGQlJ6dFJRVU5JTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRFZDeEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8xRkJRMVFzUjBGQlJ6dFJRVU5JTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU03VVVGRFZpeEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRE8xRkJRMVlzUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJRenRSUVVOV0xFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNN1VVRkRWaXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETEVWQlFVVXNRMEZCUXl4RFFVRkRPMUZCUTFZc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF5eEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVTllMRU5CUVVNN1FVRkRTaXhEUVVGRExFTkJRVU1pZlE9PSIsIi8vIGh0dHBzOi8vd3d3LnVuaWNvZGUub3JnL3JlcG9ydHMvdHIzNS90cjM1LWRhdGVzLmh0bWwjRGF0ZV9GaWVsZF9TeW1ib2xfVGFibGVcbmV4cG9ydCBjb25zdCBkYXRlVGltZVVuaWNvZGVGb3JtYXRTdHJpbmcgPSBcInl5eXktTU0tZGQnVCdISDptbTpzcy5TU1NYWFwiO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pYzJOb1pXMWhMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUxpNHZMaTR2YzNKakwzTmphR1Z0WVM1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkpRU3dyUlVGQkswVTdRVUZETDBVc1RVRkJUU3hEUVVGRExFMUJRVTBzTWtKQlFUSkNMRWRCUVVjc05rSkJRVFpDTEVOQlFVTWlmUT09IiwiLypcbiAgV2UgY2FwdHVyZSB0aGUgSlMgY2FsbHN0YWNrIHdoZW4gd2UgZGV0ZWN0IGEgZHluYW1pY2FsbHkgY3JlYXRlZCBodHRwIHJlcXVlc3RcbiAgYW5kIGJ1YmJsZSBpdCB1cCB2aWEgYSBXZWJFeHRlbnNpb24gRXhwZXJpbWVudCBBUEkgc3RhY2tEdW1wLlxuICBUaGlzIGluc3RydW1lbnRhdGlvbiBjYXB0dXJlcyB0aG9zZSBhbmQgc2F2ZXMgdGhlbSB0byB0aGUgXCJjYWxsc3RhY2tzXCIgdGFibGUuXG4qL1xuZXhwb3J0IGNsYXNzIENhbGxzdGFja0luc3RydW1lbnQge1xuICBjb25zdHJ1Y3RvcihkYXRhUmVjZWl2ZXIpIHtcbiAgICB0aGlzLmRhdGFSZWNlaXZlciA9IGRhdGFSZWNlaXZlcjtcbiAgfVxuICBydW4oYnJvd3Nlcl9pZCkge1xuICAgIGJyb3dzZXIuc3RhY2tEdW1wLm9uU3RhY2tBdmFpbGFibGUuYWRkTGlzdGVuZXIoKHJlcXVlc3RfaWQsIGNhbGxfc3RhY2spID0+IHtcbiAgICAgIGNvbnN0IHJlY29yZCA9IHtcbiAgICAgICAgYnJvd3Nlcl9pZCxcbiAgICAgICAgcmVxdWVzdF9pZCxcbiAgICAgICAgY2FsbF9zdGFja1xuICAgICAgfTtcbiAgICAgIHRoaXMuZGF0YVJlY2VpdmVyLnNhdmVSZWNvcmQoXCJjYWxsc3RhY2tzXCIsIHJlY29yZCk7XG4gICAgfSk7XG4gIH1cbn0iLCJpbXBvcnQge1xuICBDb29raWVJbnN0cnVtZW50LFxuICBKYXZhc2NyaXB0SW5zdHJ1bWVudCxcbiAgSHR0cEluc3RydW1lbnQsXG4gIE5hdmlnYXRpb25JbnN0cnVtZW50XG59IGZyb20gXCJvcGVud3BtLXdlYmV4dC1pbnN0cnVtZW50YXRpb25cIjtcblxuaW1wb3J0ICogYXMgbG9nZ2luZ0RCIGZyb20gXCIuL2xvZ2dpbmdkYi5qc1wiO1xuaW1wb3J0IHsgQ2FsbHN0YWNrSW5zdHJ1bWVudCB9IGZyb20gXCIuL2NhbGxzdGFjay1pbnN0cnVtZW50LmpzXCI7XG5cbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XG4gIC8vIFJlYWQgdGhlIGJyb3dzZXIgY29uZmlndXJhdGlvbiBmcm9tIGZpbGVcbiAgbGV0IGZpbGVuYW1lID0gXCJicm93c2VyX3BhcmFtcy5qc29uXCI7XG4gIGxldCBjb25maWcgPSBhd2FpdCBicm93c2VyLnByb2ZpbGVEaXJJTy5yZWFkRmlsZShmaWxlbmFtZSk7XG4gIGlmIChjb25maWcpIHtcbiAgICBjb25maWcgPSBKU09OLnBhcnNlKGNvbmZpZyk7XG4gICAgY29uc29sZS5sb2coXCJCcm93c2VyIENvbmZpZzpcIiwgY29uZmlnKTtcbiAgfSBlbHNlIHtcbiAgICBjb25maWcgPSB7XG4gICAgICBuYXZpZ2F0aW9uX2luc3RydW1lbnQ6dHJ1ZSxcbiAgICAgIGNvb2tpZV9pbnN0cnVtZW50OnRydWUsXG4gICAgICBqc19pbnN0cnVtZW50OnRydWUsXG4gICAgICBqc19pbnN0cnVtZW50X3NldHRpbmdzOiBgXG4gICAgICBbXG4gICAgICAgIHtcbiAgICAgICAgICBvYmplY3Q6IHdpbmRvdy5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlLFxuICAgICAgICAgIGluc3RydW1lbnRlZE5hbWU6IFwiQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEXCIsXG4gICAgICAgICAgbG9nU2V0dGluZ3M6IHtcbiAgICAgICAgICAgIHByb3BlcnRpZXNUb0luc3RydW1lbnQ6IFtdLFxuICAgICAgICAgICAgbm9uRXhpc3RpbmdQcm9wZXJ0aWVzVG9JbnN0cnVtZW50OiBbXSxcbiAgICAgICAgICAgIGV4Y2x1ZGVkUHJvcGVydGllczogW10sXG4gICAgICAgICAgICBleGNsdWRlZFByb3BlcnRpZXM6IFtdLFxuICAgICAgICAgICAgbG9nQ2FsbFN0YWNrOiBmYWxzZSxcbiAgICAgICAgICAgIGxvZ0Z1bmN0aW9uc0FzU3RyaW5nczogZmFsc2UsXG4gICAgICAgICAgICBsb2dGdW5jdGlvbkdldHM6IGZhbHNlLFxuICAgICAgICAgICAgcHJldmVudFNldHM6IGZhbHNlLFxuICAgICAgICAgICAgcmVjdXJzaXZlOiBmYWxzZSxcbiAgICAgICAgICAgIGRlcHRoOiA1LFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIF1gLFxuICAgICAgaHR0cF9pbnN0cnVtZW50OnRydWUsXG4gICAgICBjYWxsc3RhY2tfaW5zdHJ1bWVudDp0cnVlLFxuICAgICAgc2F2ZV9jb250ZW50OmZhbHNlLFxuICAgICAgdGVzdGluZzp0cnVlLFxuICAgICAgYnJvd3Nlcl9pZDowXG4gICAgfTtcbiAgICBjb25zb2xlLmxvZyhcIldBUk5JTkc6IGNvbmZpZyBub3QgZm91bmQuIEFzc3VtaW5nIHRoaXMgaXMgYSB0ZXN0IHJ1biBvZlwiLFxuICAgICAgICAgICAgICAgIFwidGhlIGV4dGVuc2lvbi4gT3V0cHV0dGluZyBhbGwgcXVlcmllcyB0byBjb25zb2xlLlwiLCB7Y29uZmlnfSk7XG4gIH1cblxuICBhd2FpdCBsb2dnaW5nREIub3Blbihjb25maWdbJ2FnZ3JlZ2F0b3JfYWRkcmVzcyddLFxuICAgICAgICAgICAgICAgICAgICAgICBjb25maWdbJ2xvZ2dlcl9hZGRyZXNzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ1snYnJvd3Nlcl9pZCddKTtcblxuICBpZiAoY29uZmlnW1wibmF2aWdhdGlvbl9pbnN0cnVtZW50XCJdKSB7XG4gICAgbG9nZ2luZ0RCLmxvZ0RlYnVnKFwiTmF2aWdhdGlvbiBpbnN0cnVtZW50YXRpb24gZW5hYmxlZFwiKTtcbiAgICBsZXQgbmF2aWdhdGlvbkluc3RydW1lbnQgPSBuZXcgTmF2aWdhdGlvbkluc3RydW1lbnQobG9nZ2luZ0RCKTtcbiAgICBuYXZpZ2F0aW9uSW5zdHJ1bWVudC5ydW4oY29uZmlnW1wiYnJvd3Nlcl9pZFwiXSk7XG4gIH1cblxuICBpZiAoY29uZmlnWydjb29raWVfaW5zdHJ1bWVudCddKSB7XG4gICAgbG9nZ2luZ0RCLmxvZ0RlYnVnKFwiQ29va2llIGluc3RydW1lbnRhdGlvbiBlbmFibGVkXCIpO1xuICAgIGxldCBjb29raWVJbnN0cnVtZW50ID0gbmV3IENvb2tpZUluc3RydW1lbnQobG9nZ2luZ0RCKTtcbiAgICBjb29raWVJbnN0cnVtZW50LnJ1bihjb25maWdbJ2Jyb3dzZXJfaWQnXSk7XG4gIH1cblxuICBpZiAoY29uZmlnWydqc19pbnN0cnVtZW50J10pIHtcbiAgICBsb2dnaW5nREIubG9nRGVidWcoXCJKYXZhc2NyaXB0IGluc3RydW1lbnRhdGlvbiBlbmFibGVkXCIpO1xuICAgIGxldCBqc0luc3RydW1lbnQgPSBuZXcgSmF2YXNjcmlwdEluc3RydW1lbnQobG9nZ2luZ0RCKTtcbiAgICBqc0luc3RydW1lbnQucnVuKGNvbmZpZ1snYnJvd3Nlcl9pZCddKTtcbiAgICBhd2FpdCBqc0luc3RydW1lbnQucmVnaXN0ZXJDb250ZW50U2NyaXB0KGNvbmZpZ1sndGVzdGluZyddLCBjb25maWdbJ2pzX2luc3RydW1lbnRfc2V0dGluZ3MnXSk7XG4gIH1cblxuICBpZiAoY29uZmlnWydodHRwX2luc3RydW1lbnQnXSkge1xuICAgIGxvZ2dpbmdEQi5sb2dEZWJ1ZyhcIkhUVFAgSW5zdHJ1bWVudGF0aW9uIGVuYWJsZWRcIik7XG4gICAgbGV0IGh0dHBJbnN0cnVtZW50ID0gbmV3IEh0dHBJbnN0cnVtZW50KGxvZ2dpbmdEQik7XG4gICAgaHR0cEluc3RydW1lbnQucnVuKGNvbmZpZ1snYnJvd3Nlcl9pZCddLFxuICAgICAgICAgICAgICAgICAgICAgICBjb25maWdbJ3NhdmVfY29udGVudCddKTtcbiAgfVxuXG4gIGlmIChjb25maWdbJ2NhbGxzdGFja19pbnN0cnVtZW50J10pIHtcbiAgICBsb2dnaW5nREIubG9nRGVidWcoXCJDYWxsc3RhY2sgSW5zdHJ1bWVudGF0aW9uIGVuYWJsZWRcIik7XG4gICAgbGV0IGNhbGxzdGFja0luc3RydW1lbnQgPSBuZXcgQ2FsbHN0YWNrSW5zdHJ1bWVudChsb2dnaW5nREIpO1xuICAgIGNhbGxzdGFja0luc3RydW1lbnQucnVuKGNvbmZpZ1snYnJvd3Nlcl9pZCddKTtcbiAgfVxufVxuXG5tYWluKCk7XG5cbiIsImltcG9ydCAqIGFzIHNvY2tldCBmcm9tIFwiLi9zb2NrZXQuanNcIjtcblxubGV0IGNyYXdsSUQgPSBudWxsO1xubGV0IHZpc2l0SUQgPSBudWxsO1xubGV0IGRlYnVnZ2luZyA9IGZhbHNlO1xubGV0IGRhdGFBZ2dyZWdhdG9yID0gbnVsbDtcbmxldCBsb2dBZ2dyZWdhdG9yID0gbnVsbDtcbmxldCBsaXN0ZW5pbmdTb2NrZXQgPSBudWxsO1xuXG5cbmxldCBsaXN0ZW5pbmdTb2NrZXRDYWxsYmFjayA9ICBhc3luYyAoZGF0YSkgPT4ge1xuICAgIC8vVGhpcyB3b3JrcyBldmVuIGlmIGRhdGEgaXMgYW4gaW50XG4gICAgbGV0IGFjdGlvbiA9IGRhdGFbXCJhY3Rpb25cIl07XG4gICAgbGV0IF92aXNpdElEID0gZGF0YVtcInZpc2l0X2lkXCJdXG4gICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgY2FzZSBcIkluaXRpYWxpemVcIjpcbiAgICAgICAgICAgIGlmICh2aXNpdElEKSB7XG4gICAgICAgICAgICAgICAgbG9nV2FybihcIlNldCB2aXNpdF9pZCB3aGlsZSBhbm90aGVyIHZpc2l0X2lkIHdhcyBzZXRcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZpc2l0SUQgPSBfdmlzaXRJRDtcbiAgICAgICAgICAgIGRhdGFbXCJicm93c2VyX2lkXCJdID0gY3Jhd2xJRDtcbiAgICAgICAgICAgIGRhdGFBZ2dyZWdhdG9yLnNlbmQoSlNPTi5zdHJpbmdpZnkoW1wibWV0YV9pbmZvcm1hdGlvblwiLCBkYXRhXSkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJGaW5hbGl6ZVwiOlxuICAgICAgICAgICAgaWYgKCF2aXNpdElEKSB7XG4gICAgICAgICAgICAgICAgbG9nV2FybihcIlNlbmQgRmluYWxpemUgd2hpbGUgbm8gdmlzaXRfaWQgd2FzIHNldFwiKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF92aXNpdElEICE9IHZpc2l0SUQgKSB7XG4gICAgICAgICAgICAgICAgbG9nRXJyb3IoXCJTZW5kIEZpbmFsaXplIGJ1dCB2aXNpdF9pZCBkaWRuJ3QgbWF0Y2guIFwiICtcbiAgICAgICAgICAgICAgICBgQ3VycmVudCB2aXNpdF9pZCAke3Zpc2l0X2lkfSwgc2VudCB2aXNpdF9pZCAke192aXNpdF9pZH0uYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkYXRhW1wiYnJvd3Nlcl9pZFwiXSA9IGNyYXdsSUQ7XG4gICAgICAgICAgICBkYXRhW1wic3VjY2Vzc1wiXSA9IHRydWU7XG4gICAgICAgICAgICBkYXRhQWdncmVnYXRvci5zZW5kKEpTT04uc3RyaW5naWZ5KFtcIm1ldGFfaW5mb3JtYXRpb25cIiwgZGF0YV0pKTtcbiAgICAgICAgICAgIHZpc2l0SUQgPSBudWxsO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAvLyBKdXN0IG1ha2luZyBzdXJlIHRoYXQgaXQncyBhIHZhbGlkIG51bWJlciBiZWZvcmUgbG9nZ2luZ1xuICAgICAgICAgICAgX3Zpc2l0SUQgPSBwYXJzZUludChkYXRhLCAxMCk7XG4gICAgICAgICAgICBsb2dEZWJ1ZyhcIlNldHRpbmcgdmlzaXRfaWQgdGhlIGxlZ2FjeSB3YXlcIik7XG4gICAgICAgICAgICB2aXNpdElEID0gX3Zpc2l0SURcblxuICAgIH1cblxufVxuZXhwb3J0IGxldCBvcGVuID0gYXN5bmMgZnVuY3Rpb24oYWdncmVnYXRvckFkZHJlc3MsIGxvZ0FkZHJlc3MsIGN1cnJfY3Jhd2xJRCkge1xuICAgIGlmIChhZ2dyZWdhdG9yQWRkcmVzcyA9PSBudWxsICYmIGxvZ0FkZHJlc3MgPT0gbnVsbCAmJiBjdXJyX2NyYXdsSUQgPT0gJycpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJEZWJ1Z2dpbmcsIGV2ZXJ5dGhpbmcgd2lsbCBvdXRwdXQgdG8gY29uc29sZVwiKTtcbiAgICAgICAgZGVidWdnaW5nID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjcmF3bElEID0gY3Vycl9jcmF3bElEO1xuXG4gICAgY29uc29sZS5sb2coXCJPcGVuaW5nIHNvY2tldCBjb25uZWN0aW9ucy4uLlwiKTtcblxuICAgIC8vIENvbm5lY3QgdG8gTVBMb2dnZXIgZm9yIGV4dGVuc2lvbiBpbmZvL2RlYnVnL2Vycm9yIGxvZ2dpbmdcbiAgICBpZiAobG9nQWRkcmVzcyAhPSBudWxsKSB7XG4gICAgICAgIGxvZ0FnZ3JlZ2F0b3IgPSBuZXcgc29ja2V0LlNlbmRpbmdTb2NrZXQoKTtcbiAgICAgICAgbGV0IHJ2ID0gYXdhaXQgbG9nQWdncmVnYXRvci5jb25uZWN0KGxvZ0FkZHJlc3NbMF0sIGxvZ0FkZHJlc3NbMV0pO1xuICAgICAgICBjb25zb2xlLmxvZyhcImxvZ1NvY2tldCBzdGFydGVkP1wiLCBydilcbiAgICB9XG5cbiAgICAvLyBDb25uZWN0IHRvIGRhdGFiYXNlcyBmb3Igc2F2aW5nIGRhdGFcbiAgICBpZiAoYWdncmVnYXRvckFkZHJlc3MgIT0gbnVsbCkge1xuICAgICAgICBkYXRhQWdncmVnYXRvciA9IG5ldyBzb2NrZXQuU2VuZGluZ1NvY2tldCgpO1xuICAgICAgICBsZXQgcnYgPSBhd2FpdCBkYXRhQWdncmVnYXRvci5jb25uZWN0KGFnZ3JlZ2F0b3JBZGRyZXNzWzBdLCBhZ2dyZWdhdG9yQWRkcmVzc1sxXSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwic3FsaXRlU29ja2V0IHN0YXJ0ZWQ/XCIscnYpO1xuICAgIH1cblxuICAgIC8vIExpc3RlbiBmb3IgaW5jb21pbmcgdXJscyBhcyB2aXNpdCBpZHNcbiAgICBsaXN0ZW5pbmdTb2NrZXQgPSBuZXcgc29ja2V0Lkxpc3RlbmluZ1NvY2tldChsaXN0ZW5pbmdTb2NrZXRDYWxsYmFjayk7XG4gICAgY29uc29sZS5sb2coXCJTdGFydGluZyBzb2NrZXQgbGlzdGVuaW5nIGZvciBpbmNvbWluZyBjb25uZWN0aW9ucy5cIik7XG4gICAgbGlzdGVuaW5nU29ja2V0LnN0YXJ0TGlzdGVuaW5nKCkudGhlbigoKSA9PiB7XG4gICAgICAgIGJyb3dzZXIucHJvZmlsZURpcklPLndyaXRlRmlsZShcImV4dGVuc2lvbl9wb3J0LnR4dFwiLCBgJHtsaXN0ZW5pbmdTb2NrZXQucG9ydH1gKTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBsZXQgY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoZGF0YUFnZ3JlZ2F0b3IgIT0gbnVsbCkge1xuICAgICAgICBkYXRhQWdncmVnYXRvci5jbG9zZSgpO1xuICAgIH1cbiAgICBpZiAobG9nQWdncmVnYXRvciAhPSBudWxsKSB7XG4gICAgICAgIGxvZ0FnZ3JlZ2F0b3IuY2xvc2UoKTtcbiAgICB9XG59O1xuXG5sZXQgbWFrZUxvZ0pTT04gPSBmdW5jdGlvbihsdmwsIG1zZykge1xuICAgIHZhciBsb2dfanNvbiA9IHtcbiAgICAgICAgJ25hbWUnOiAnRXh0ZW5zaW9uLUxvZ2dlcicsXG4gICAgICAgICdsZXZlbCc6IGx2bCxcbiAgICAgICAgJ3BhdGhuYW1lJzogJ0ZpcmVmb3hFeHRlbnNpb24nLFxuICAgICAgICAnbGluZW5vJzogMSxcbiAgICAgICAgJ21zZyc6IGVzY2FwZVN0cmluZyhtc2cpLFxuICAgICAgICAnYXJncyc6IG51bGwsXG4gICAgICAgICdleGNfaW5mbyc6IG51bGwsXG4gICAgICAgICdmdW5jJzogbnVsbFxuICAgIH1cbiAgICByZXR1cm4gbG9nX2pzb247XG59XG5cbmV4cG9ydCBsZXQgbG9nSW5mbyA9IGZ1bmN0aW9uKG1zZykge1xuICAgIC8vIEFsd2F5cyBsb2cgdG8gYnJvd3NlciBjb25zb2xlXG4gICAgY29uc29sZS5sb2cobXNnKTtcblxuICAgIGlmIChkZWJ1Z2dpbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIExvZyBsZXZlbCBJTkZPID09IDIwIChodHRwczovL2RvY3MucHl0aG9uLm9yZy8yL2xpYnJhcnkvbG9nZ2luZy5odG1sI2xvZ2dpbmctbGV2ZWxzKVxuICAgIHZhciBsb2dfanNvbiA9IG1ha2VMb2dKU09OKDIwLCBtc2cpO1xuICAgIGxvZ0FnZ3JlZ2F0b3Iuc2VuZChKU09OLnN0cmluZ2lmeShbJ0VYVCcsIEpTT04uc3RyaW5naWZ5KGxvZ19qc29uKV0pKTtcbn07XG5cbmV4cG9ydCBsZXQgbG9nRGVidWcgPSBmdW5jdGlvbihtc2cpIHtcbiAgICAvLyBBbHdheXMgbG9nIHRvIGJyb3dzZXIgY29uc29sZVxuICAgIGNvbnNvbGUubG9nKG1zZyk7XG5cbiAgICBpZiAoZGVidWdnaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBMb2cgbGV2ZWwgREVCVUcgPT0gMTAgKGh0dHBzOi8vZG9jcy5weXRob24ub3JnLzIvbGlicmFyeS9sb2dnaW5nLmh0bWwjbG9nZ2luZy1sZXZlbHMpXG4gICAgdmFyIGxvZ19qc29uID0gbWFrZUxvZ0pTT04oMTAsIG1zZyk7XG4gICAgbG9nQWdncmVnYXRvci5zZW5kKEpTT04uc3RyaW5naWZ5KFsnRVhUJywgSlNPTi5zdHJpbmdpZnkobG9nX2pzb24pXSkpO1xufTtcblxuZXhwb3J0IGxldCBsb2dXYXJuID0gZnVuY3Rpb24obXNnKSB7XG4gICAgLy8gQWx3YXlzIGxvZyB0byBicm93c2VyIGNvbnNvbGVcbiAgICBjb25zb2xlLndhcm4obXNnKTtcblxuICAgIGlmIChkZWJ1Z2dpbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIExvZyBsZXZlbCBXQVJOID09IDMwIChodHRwczovL2RvY3MucHl0aG9uLm9yZy8yL2xpYnJhcnkvbG9nZ2luZy5odG1sI2xvZ2dpbmctbGV2ZWxzKVxuICAgIHZhciBsb2dfanNvbiA9IG1ha2VMb2dKU09OKDMwLCBtc2cpO1xuICAgIGxvZ0FnZ3JlZ2F0b3Iuc2VuZChKU09OLnN0cmluZ2lmeShbJ0VYVCcsIEpTT04uc3RyaW5naWZ5KGxvZ19qc29uKV0pKTtcbn07XG5cbmV4cG9ydCBsZXQgbG9nRXJyb3IgPSBmdW5jdGlvbihtc2cpIHtcbiAgICAvLyBBbHdheXMgbG9nIHRvIGJyb3dzZXIgY29uc29sZVxuICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcblxuICAgIGlmIChkZWJ1Z2dpbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIExvZyBsZXZlbCBJTkZPID09IDQwIChodHRwczovL2RvY3MucHl0aG9uLm9yZy8yL2xpYnJhcnkvbG9nZ2luZy5odG1sI2xvZ2dpbmctbGV2ZWxzKVxuICAgIHZhciBsb2dfanNvbiA9IG1ha2VMb2dKU09OKDQwLCBtc2cpO1xuICAgIGxvZ0FnZ3JlZ2F0b3Iuc2VuZChKU09OLnN0cmluZ2lmeShbJ0VYVCcsIEpTT04uc3RyaW5naWZ5KGxvZ19qc29uKV0pKTtcbn07XG5cbmV4cG9ydCBsZXQgbG9nQ3JpdGljYWwgPSBmdW5jdGlvbihtc2cpIHtcbiAgICAvLyBBbHdheXMgbG9nIHRvIGJyb3dzZXIgY29uc29sZVxuICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcblxuICAgIGlmIChkZWJ1Z2dpbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIExvZyBsZXZlbCBDUklUSUNBTCA9PSA1MCAoaHR0cHM6Ly9kb2NzLnB5dGhvbi5vcmcvMi9saWJyYXJ5L2xvZ2dpbmcuaHRtbCNsb2dnaW5nLWxldmVscylcbiAgICB2YXIgbG9nX2pzb24gPSBtYWtlTG9nSlNPTig1MCwgbXNnKTtcbiAgICBsb2dBZ2dyZWdhdG9yLnNlbmQoSlNPTi5zdHJpbmdpZnkoWydFWFQnLCBKU09OLnN0cmluZ2lmeShsb2dfanNvbildKSk7XG59O1xuXG5leHBvcnQgbGV0IGRhdGFSZWNlaXZlciA9IHtcbiAgICBzYXZlUmVjb3JkKGEsIGIpIHtcbiAgICAgICAgY29uc29sZS5sb2coYik7XG4gICAgfSxcbn07XG5cbmV4cG9ydCBsZXQgc2F2ZVJlY29yZCA9IGZ1bmN0aW9uKGluc3RydW1lbnQsIHJlY29yZCkge1xuICAgIHJlY29yZFtcInZpc2l0X2lkXCJdID0gdmlzaXRJRDtcblxuICAgIGlmICghdmlzaXRJRCAmJiAhZGVidWdnaW5nKSB7XG4gICAgICAgIC8vIE5hdmlnYXRpb25zIHRvIGFib3V0OmJsYW5rIGNhbiBiZSB0cmlnZ2VyZWQgYnkgT3BlbldQTS4gV2UgZHJvcCB0aG9zZS5cbiAgICAgICAgaWYoaW5zdHJ1bWVudCA9PT0gJ25hdmlnYXRpb25zJyAmJiByZWNvcmRbJ3VybCddID09PSAnYWJvdXQ6YmxhbmsnKSB7XG4gICAgICAgICAgICBsb2dEZWJ1ZygnRXh0ZW5zaW9uLScgKyBjcmF3bElEICsgJyA6IERyb3BwaW5nIG5hdmlnYXRpb24gdG8gYWJvdXQ6YmxhbmsgaW4gaW50ZXJtZWRpYXRlIHBlcmlvZCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxvZ1dhcm4oYEV4dGVuc2lvbi0ke2NyYXdsSUR9IDogdmlzaXRJRCBpcyBudWxsIHdoaWxlIGF0dGVtcHRpbmcgdG8gaW5zZXJ0IGludG8gdGFibGUgJHtpbnN0cnVtZW50fVxcbmAgK1xuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShyZWNvcmQpKTtcbiAgICAgICAgcmVjb3JkW1widmlzaXRfaWRcIl0gPSAtMTtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgLy8gc2VuZCB0byBjb25zb2xlIGlmIGRlYnVnZ2luZ1xuICAgIGlmIChkZWJ1Z2dpbmcpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRVhURU5TSU9OXCIsIGluc3RydW1lbnQsIHJlY29yZCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRhdGFBZ2dyZWdhdG9yLnNlbmQoSlNPTi5zdHJpbmdpZnkoW2luc3RydW1lbnQsIHJlY29yZF0pKTtcbn07XG5cbi8vIFN0dWIgZm9yIG5vd1xuZXhwb3J0IGxldCBzYXZlQ29udGVudCA9IGFzeW5jIGZ1bmN0aW9uKGNvbnRlbnQsIGNvbnRlbnRIYXNoKSB7XG4gIC8vIFNlbmQgcGFnZSBjb250ZW50IHRvIHRoZSBkYXRhIGFnZ3JlZ2F0b3JcbiAgLy8gZGVkdXBsaWNhdGVkIGJ5IGNvbnRlbnRIYXNoIGluIGEgbGV2ZWxEQiBkYXRhYmFzZVxuICBpZiAoZGVidWdnaW5nKSB7XG4gICAgY29uc29sZS5sb2coXCJMREIgY29udGVudEhhc2g6XCIsY29udGVudEhhc2gsXCJ3aXRoIGxlbmd0aFwiLGNvbnRlbnQubGVuZ3RoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gU2luY2UgdGhlIGNvbnRlbnQgbWlnaHQgbm90IGJlIGEgdmFsaWQgdXRmOCBzdHJpbmcgYW5kIGl0IG5lZWRzIHRvIGJlXG4gIC8vIGpzb24gZW5jb2RlZCBsYXRlciwgaXQgaXMgZW5jb2RlZCB1c2luZyBiYXNlNjQgZmlyc3QuXG4gIGNvbnN0IGI2NCA9IFVpbnQ4VG9CYXNlNjQoY29udGVudCk7XG4gIGRhdGFBZ2dyZWdhdG9yLnNlbmQoSlNPTi5zdHJpbmdpZnkoWydwYWdlX2NvbnRlbnQnLCBbYjY0LCBjb250ZW50SGFzaF1dKSk7XG59O1xuXG5mdW5jdGlvbiBlbmNvZGVfdXRmOChzKSB7XG4gIHJldHVybiB1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQocykpO1xufVxuXG4vLyBCYXNlNjQgZW5jb2RpbmcsIGZvdW5kIG9uOlxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTI3MTAwMDEvaG93LXRvLWNvbnZlcnQtdWludDgtYXJyYXktdG8tYmFzZTY0LWVuY29kZWQtc3RyaW5nLzI1NjQ0NDA5IzI1NjQ0NDA5XG5mdW5jdGlvbiBVaW50OFRvQmFzZTY0KHU4QXJyKXtcbiAgdmFyIENIVU5LX1NJWkUgPSAweDgwMDA7IC8vYXJiaXRyYXJ5IG51bWJlclxuICB2YXIgaW5kZXggPSAwO1xuICB2YXIgbGVuZ3RoID0gdThBcnIubGVuZ3RoO1xuICB2YXIgcmVzdWx0ID0gJyc7XG4gIHZhciBzbGljZTtcbiAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgc2xpY2UgPSB1OEFyci5zdWJhcnJheShpbmRleCwgTWF0aC5taW4oaW5kZXggKyBDSFVOS19TSVpFLCBsZW5ndGgpKTtcbiAgICByZXN1bHQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBzbGljZSk7XG4gICAgaW5kZXggKz0gQ0hVTktfU0laRTtcbiAgfVxuICByZXR1cm4gYnRvYShyZXN1bHQpO1xufVxuXG5leHBvcnQgbGV0IGVzY2FwZVN0cmluZyA9IGZ1bmN0aW9uKHN0cmluZykge1xuICAgIC8vIENvbnZlcnQgdG8gc3RyaW5nIGlmIG5lY2Vzc2FyeVxuICAgIGlmKHR5cGVvZiBzdHJpbmcgIT0gXCJzdHJpbmdcIilcbiAgICAgICAgc3RyaW5nID0gXCJcIiArIHN0cmluZztcblxuICAgIHJldHVybiBlbmNvZGVfdXRmOChzdHJpbmcpO1xufTtcblxuZXhwb3J0IGxldCBib29sVG9JbnQgPSBmdW5jdGlvbihib29sKSB7XG4gICAgcmV0dXJuIGJvb2wgPyAxIDogMDtcbn07XG4iLCJsZXQgRGF0YVJlY2VpdmVyID0ge1xuICBjYWxsYmFja3M6IG5ldyBNYXAoKSxcbiAgb25EYXRhUmVjZWl2ZWQ6IChhU29ja2V0SWQsIGFEYXRhLCBhSlNPTikgPT4ge1xuICAgIGlmICghRGF0YVJlY2VpdmVyLmNhbGxiYWNrcy5oYXMoYVNvY2tldElkKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoYUpTT04pIHtcbiAgICAgIGFEYXRhID0gSlNPTi5wYXJzZShhRGF0YSk7XG4gICAgfVxuICAgIERhdGFSZWNlaXZlci5jYWxsYmFja3MuZ2V0KGFTb2NrZXRJZCkoYURhdGEpO1xuICB9LFxufTtcblxuYnJvd3Nlci5zb2NrZXRzLm9uRGF0YVJlY2VpdmVkLmFkZExpc3RlbmVyKERhdGFSZWNlaXZlci5vbkRhdGFSZWNlaXZlZCk7XG5cbmxldCBMaXN0ZW5pbmdTb2NrZXRzID0gbmV3IE1hcCgpO1xuXG5leHBvcnQgY2xhc3MgTGlzdGVuaW5nU29ja2V0IHtcbiAgY29uc3RydWN0b3IoY2FsbGJhY2spIHtcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2tcbiAgfVxuXG4gIGFzeW5jIHN0YXJ0TGlzdGVuaW5nKCkge1xuICAgIHRoaXMucG9ydCA9IGF3YWl0IGJyb3dzZXIuc29ja2V0cy5jcmVhdGVTZXJ2ZXJTb2NrZXQoKTtcbiAgICBEYXRhUmVjZWl2ZXIuY2FsbGJhY2tzLnNldCh0aGlzLnBvcnQsIHRoaXMuY2FsbGJhY2spO1xuICAgIGJyb3dzZXIuc29ja2V0cy5zdGFydExpc3RlbmluZyh0aGlzLnBvcnQpO1xuICAgIGNvbnNvbGUubG9nKCdMaXN0ZW5pbmcgb24gcG9ydCAnICsgdGhpcy5wb3J0KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2VuZGluZ1NvY2tldCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbiAgYXN5bmMgY29ubmVjdChob3N0LCBwb3J0KSB7XG4gICAgdGhpcy5pZCA9IGF3YWl0IGJyb3dzZXIuc29ja2V0cy5jcmVhdGVTZW5kaW5nU29ja2V0KCk7XG4gICAgYnJvd3Nlci5zb2NrZXRzLmNvbm5lY3QodGhpcy5pZCwgaG9zdCwgcG9ydCk7XG4gICAgY29uc29sZS5sb2coYENvbm5lY3RlZCB0byAke2hvc3R9OiR7cG9ydH1gKTtcbiAgfVxuXG4gIHNlbmQoYURhdGEsIGFKU09OPXRydWUpIHtcbiAgICB0cnkge1xuICAgICAgYnJvd3Nlci5zb2NrZXRzLnNlbmREYXRhKHRoaXMuaWQsIGFEYXRhLCAhIWFKU09OKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIsZXJyLm1lc3NhZ2UpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIGJyb3dzZXIuc29ja2V0cy5jbG9zZSh0aGlzLmlkKTtcbiAgfVxufVxuXG4iXSwic291cmNlUm9vdCI6IiJ9