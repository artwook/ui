var alt = require("alt-instance");
import IntlActions from "actions/IntlActions";
import SettingsActions from "actions/SettingsActions";
import counterpart from "counterpart";
var locale_en = require("json-loader!assets/locales/locale-en");
import ls from "common/localStorage";
let ss = new ls("__artwook__");

counterpart.registerTranslations("en", locale_en);
counterpart.setFallbackLocale("en");

import {addLocaleData} from "react-intl";

import en from "react-intl/locale-data/en";
import es from "react-intl/locale-data/es";
import fr from "react-intl/locale-data/fr";
import ko from "react-intl/locale-data/ko";
import zh from "react-intl/locale-data/zh";
import de from "react-intl/locale-data/de";
import tr from "react-intl/locale-data/tr";

addLocaleData(en);
addLocaleData(es);
addLocaleData(fr);
addLocaleData(ko);
addLocaleData(zh);
addLocaleData(de);
addLocaleData(tr);

class IntlStore {
    constructor() {
        this.locales = ["en","cn","fr","ko","de","es","tr"];
        this.localesObject = {en: locale_en};

        // for the first time, try to determine default language from explorer's language setting
        this.defaultLang = (window.navigator.language || window.navigator.userLanguage).toLowerCase().replace(/-.*/,'');
        if (this.defaultLang == "zh") this.defaultLang = "cn";

        // if language not supported, fallback to english
        if (!this.hasLocale(this.defaultLang)) this.defaultLang = "en";

        // view setting (manual setting) has higher priority
        this.currentLocale = ss.has("settings_v3") ? ss.get("settings_v3").locale : this.defaultLang;

        this.bindListeners({
            onSwitchLocale: IntlActions.switchLocale,
            onGetLocale: IntlActions.getLocale,
            onClearSettings: SettingsActions.clearSettings
        });

        // this._export("getCurrentLocale", "hasLocale");
    }

    hasLocale(locale) {
        return this.locales.indexOf(locale) !== -1;
    }

    getCurrentLocale() {
        return this.currentLocale;
    }

    onSwitchLocale({locale, localeData}) {
        switch (locale) {
            case "en":
                counterpart.registerTranslations("en", this.localesObject.en);
                break;

            default:
                // let newLocale = this.localesObject[locale];
                // if (!newLocale) {
                    // newLocale = require("assets/locales/locale-" + locale);
                //     this.localesObject[locale] = newLocale;
                // }
                counterpart.registerTranslations(locale, localeData);
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

    onClearSettings() {
        this.onSwitchLocale(this.defaultLang);
    }
}

export default alt.createStore(IntlStore, "IntlStore");
