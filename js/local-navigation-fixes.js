(function () {
    "use strict";

    var currentScript = document.currentScript;
    if (!currentScript || !currentScript.src) return;

    var rootUrl = new URL("../", currentScript.src).href;
    var locales = ["ar", "de", "es", "fr", "hi", "id", "it", "ja", "ko", "pl", "pt", "th", "tr", "vi"];
    var languageLocales = {
        "Bahasa Indonesia": "id", "Deutsch": "de", "English (United States)": "en",
        "Espa\u00f1ol (Espa\u00f1a)": "es", "Fran\u00e7ais (France)": "fr", "Italiano": "it",
        "Polski": "pl", "Portugu\u00eas (Brasil)": "pt", "Ti\u1ebfng Vi\u1ec7t": "vi",
        "T\u00fcrk\u00e7e": "tr", "\u0627\u0644\u0639\u0631\u0628\u064a\u0629": "ar",
        "\u0939\u093f\u0928\u094d\u0926\u0940": "hi", "\u0e20\u0e32\u0e29\u0e32\u0e44\u0e17\u0e22": "th",
        "\u65e5\u672c\u8a9e": "ja", "\ud55c\uad6d\uc5b4": "ko"
    };

    function pageKind() {
        var path = window.location.pathname.toLowerCase();
        if (path.indexOf("/charts/") !== -1 || document.getElementById("game-carousel-web-app")) return "charts";
        if (path.indexOf("/catalog/") !== -1 || document.getElementById("catalog-react-container")) return "catalog";
        return "login";
    }

    function localPageForLanguage(locale) {
        var page = pageKind();
        var path = window.location.pathname;
        var relativeRoot = /^\/(ar|de|es|fr|hi|id|it|ja|ko|pl|pt|th|tr|vi)\//i.test(path)
            ? "../../"
            : /^\/(login|charts|catalog)\//i.test(path) || /^\/Login\//.test(path)
                ? "../"
                : "./";
        if (locale === "en") return relativeRoot + (page === "login" ? "Login/index.html" : page + "/index.html");
        return relativeRoot + locale + "/" + page + "/index.html";
    }

    function repairLinks() {
        var fixed = {
            "nav-logo-link": "https://www.roblox.com/",
            "header-develop-md-link": "https://create.roblox.com/",
            "header-develop-sm-link": "https://create.roblox.com/",
            "nav-charts-md-link": "https://www.roblox.com/charts",
            "nav-charts-sm-link": "https://www.roblox.com/charts",
            "nav-marketplace-md-link": "https://www.roblox.com/catalog",
            "nav-marketplace-sm-link": "https://www.roblox.com/catalog",
            "sign-up-button": "https://www.roblox.com/",
            "sign-up-link": "https://www.roblox.com/"
        };
        Object.keys(fixed).forEach(function (id) {
            var link = document.getElementById(id);
            if (link) link.href = fixed[id];
        });
        var locale = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
        var isRootLoginPage = window.location.pathname.toLowerCase().endsWith("/index.html")
            && !/\/(login|charts|catalog)\/index\.html$/i.test(window.location.pathname);
        var loginHref = isRootLoginPage
            ? new URL("index.html", rootUrl).href
            : locales.indexOf(locale) >= 0
                ? new URL(locale + "/login/index.html", rootUrl).href
                : new URL("Login/index.html", rootUrl).href;
        var nav = document.getElementById("navigation-container");
        if (nav) Array.prototype.forEach.call(nav.querySelectorAll("a"), function (link) {
            var label = (link.textContent || "").trim().toLowerCase();
            if (["log in", "login", "sign in", "anmelden", "iniciar sesi\u00f3n", "connexion", "masuk", "accedi", "entrar", "giri\u015f yap"].indexOf(label) >= 0 || label === "\ub85c\uadf8\uc778") link.href = loginHref;
        });
    }

    document.addEventListener("click", function (event) {
        var target = event.target;
        var option = target && target.closest ? target.closest("[role='listbox'] button, [role='listbox'] [role='option']") : null;
        if (option) {
            var locale = languageLocales[(option.textContent || "").trim()];
            if (locale) {
                event.preventDefault();
                event.stopImmediatePropagation();
                window.location.href = localPageForLanguage(locale);
                return;
            }
        }
        var link = target && target.closest ? target.closest("a") : null;
        if (!link) return;
        if (/^(nav-charts-|nav-marketplace-|header-develop-|nav-logo-link|sign-up-button|sign-up-link)/.test(link.id)) {
            event.preventDefault();
            window.location.href = link.href;
        }
    }, true);

    repairLinks();
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", repairLinks, { once: true });
    if (document.documentElement && typeof MutationObserver !== "undefined") {
        new MutationObserver(repairLinks).observe(document.documentElement, { childList: true, subtree: true });
    }
})();
