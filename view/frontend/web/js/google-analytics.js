// Taken direct from Mage cookie helper.
function getCookie(name) {
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
    var allowServices = false,
        allowedCookies,
        allowedWebsites,
        measurementId;

    if (config.isCookieRestrictionModeEnabled) {
        allowedCookies = getCookie(config.cookieName);

        if (allowedCookies !== null) {
            allowedWebsites = JSON.parse(allowedCookies);

            if (allowedWebsites[config.currentWebsite] === 1) {
                allowServices = true;
            }
        }
    } else {
        allowServices = true;
    }

    if (allowServices) {
        /* Global site tag (gtag.js) - Google Analytics */
        measurementId = config.pageTrackingData.measurementId;
        if (window.gtag) {
            gtag('config', measurementId, { 'anonymize_ip': true });
            // Purchase Event
            if (config.ordersTrackingData.hasOwnProperty('currency')) {
                var purchaseObject = config.ordersTrackingData.orders[0];
                purchaseObject['items'] = config.ordersTrackingData.products;
                gtag('event', 'purchase', purchaseObject);
            }
        } else {
            (function (d, s, u) {
                var gtagScript = d.createElement(s);
                gtagScript.type = 'text/javascript';
                gtagScript.async = true;
                gtagScript.src = u;
                d.head.insertBefore(gtagScript, d.head.children[0]);
            })(document, 'script', 'https://www.googletagmanager.com/gtag/js?id=' + measurementId);
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('set', 'developer_id.dYjhlMD', true);
            gtag('config', measurementId, { 'anonymize_ip': true });
            // Purchase Event
            if (config.ordersTrackingData.hasOwnProperty('currency')) {
                var purchaseObject = config.ordersTrackingData.orders[0];
                purchaseObject['items'] = config.ordersTrackingData.products;
                gtag('event', 'purchase', purchaseObject);
            }
        }
    }
}

window.geneInitGtm = geneInitGtm;

var initEvent = new Event('geneGa:inited');

document.dispatchEvent(initEvent);
