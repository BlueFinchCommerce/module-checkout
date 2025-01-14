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

function bluefinchInitGtm(config) {
    'use strict';

    let allowServices = false,
        allowedCookies,
        allowedWebsites,
        f,
        j,
        dl;

    if (config.isCookieRestrictionModeEnabled) {
        allowedCookies = getCookie(config.cookieName);

        if (allowedCookies !== null) {
            allowedWebsites = JSON.parse(allowedCookies);

            allowServices = allowedWebsites[config.currentWebsite] === 1;
        }
    } else {
        allowServices = true;
    }

    if (allowServices) {
        window.dataLayer = window.dataLayer || [];
        window.dlCurrencyCode = config.storeCurrencyCode;

        (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });
            f = d.getElementsByTagName(s)[0];
            j = d.createElement(s);
            dl = l !== 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', config.gtmAccountId);

        let gaEvent = new Event('ga:inited');

        document.dispatchEvent(gaEvent);
    }
}

window.bluefinchInitGtm = bluefinchInitGtm;

let initEvent = new Event('bluefinchGa:inited');

document.dispatchEvent(initEvent);
