var alt = require("../alt-instance");
var IntlActions = require("../actions/IntlActions");
var BaseStore = require("./BaseStore");
var counterpart = require("counterpart-instance");
var cookies = require("cookies-js");
var locale_cn = require("assets/locales/locale-cn");
counterpart.registerTranslations("cn", locale_cn);
counterpart.setFallbackLocale("cn");

class IntlStore extends BaseStore {
    constructor() {
        super();
        this.currentLocale = cookies.get("graphene_locale") || "cn";
        this.locales = ["cn"];
        this.localesObject = {cn: locale_cn};

        this.bindListeners({
            onSwitchLocale: IntlActions.switchLocale,
            onGetLocale: IntlActions.getLocale
        });

        this._export("getCurrentLocale", "hasLocale");
    }

    hasLocale(locale) {
        console.log("hasLocale:", this.locales.indexOf(locale));
        return this.locales.indexOf(locale) !== -1;
    }

    getCurrentLocale() {
        return this.currentLocale;
    }

    onSwitchLocale(locale) {
        switch (locale) {
            case "cn":
                counterpart.registerTranslations("cn", this.localesObject.cn);
                break;

            default:
                let newLocale = this.localesObject[locale];
                if (!newLocale) {
                    newLocale = require("assets/locales/locale-" + locale);
                    this.localesObject[locale] = newLocale;
                }
                counterpart.registerTranslations(locale, newLocale);
                break;
        }

        counterpart.setLocale(locale);
        this.currentLocale = locale;
    }

    onGetLocale(locale) {
        if (this.locales.indexOf(locale) === -1) {
            this.locales.push(locale);
        }
    }
}

module.exports = alt.createStore(IntlStore, "IntlStore");
