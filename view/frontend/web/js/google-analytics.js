// Taken direct from Mage cookie helper.
function getCookie(name) {
    'use strict';

    var arg = name + '=',
        aLength = arg.length,
        cookie = document.cookie,
        cLength = cookie.length,
        i = 0,
        j = 0;

    while (i < cLength) {
        j = i + aLength;

        if (cookie.substring(i, j) === arg) {
            return this.getCookieVal(j);
        }
        i = cookie.indexOf(' ', i) + 1;

        if (i === 0) {
            break;
        }
    }

    return null;
}

function geneInitGtm(config) {
    'use strict';

    var allowServices = false,
        allowedCookies,
        allowedWebsites,
        measurementId;

    if (config.isCookieRestrictionModeEnabled) {
        allowedCookies = getCookie(config.cookieName);

        if (allowedCookies !== null) {
            allowedWebsites = JSON.parse(allowedCookies);

            allowServices = allowedWebsites[config.currentWebsite] === 1;
        }
    } else {
        allowServices = true;
    }

    function gtag() { window.dataLayer.push(arguments); }

    function emitPurchaseEvent() {
        // Purchase Event
        if (config.ordersTrackingData.hasOwnProperty('currency')) {
            let purchaseObject = config.ordersTrackingData.orders[0];

            purchaseObject['items'] = config.ordersTrackingData.products;
            gtag('event', 'purchase', purchaseObject);
        }
    }

    if (allowServices) {
        /* Global site tag (gtag.js) - Google Analytics */
        measurementId = config.pageTrackingData.measurementId;
        if (window.gtag) {
            window.gtag('config', measurementId, { 'anonymize_ip': true });
            emitPurchaseEvent();
        } else {
            (function (d, s, u) {
                let gtagScript = d.createElement(s);

                gtagScript.type = 'text/javascript';
                gtagScript.async = true;
                gtagScript.src = u;
                d.head.insertBefore(gtagScript, d.head.children[0]);
            })(document, 'script', 'https://www.googletagmanager.com/gtag/js?id=' + measurementId);
            window.dataLayer = window.dataLayer || [];

            gtag('js', new Date());
            gtag('set', 'developer_id.dYjhlMD', true);
            gtag('config', measurementId, { 'anonymize_ip': true });

            emitPurchaseEvent();
        }
    }
}

window.geneInitGtm = geneInitGtm;

let initEvent = new Event('geneGa:inited');

document.dispatchEvent(initEvent);
