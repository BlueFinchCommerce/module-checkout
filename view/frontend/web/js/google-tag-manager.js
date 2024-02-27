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
        f,
        j,
        dl;

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
            dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', config.gtmAccountId);

        var gaEvent = new Event('ga:inited');

        document.dispatchEvent(gaEvent);
    }
}

window.geneInitGtm = geneInitGtm;

var initEvent = new Event('geneGa:inited');

document.dispatchEvent(initEvent);
