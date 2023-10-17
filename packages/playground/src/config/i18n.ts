import i18n, { InitOptions } from 'i18next'
import HttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

function ConfigI18n() {
  let initialized = false

  const changeLanguage = (lng: string) => {
    if (!initialized) return
    return i18n.changeLanguage(lng)
  }

  const initialize = async (lng: string) => {
    if (initialized) return
    initialized = true

    const config = {
      lng,
      fallbackLng: lng, // defining the default/fallback language
      defaultNS: 'app', // defining the default polyglot translation namespace
      ns: ['app'], // defining the list of all polyglot translations namespaces
      backend: {
        crossDomain: true,
        loadPath: (language: string) => {
          return `./locales/${language}/{{ns}}.json`
        },
        requestOptions: {
          mode: 'cors',
          credentials: 'same-origin',
          cache: 'no-cache',
        },
      },
      keySeparator: false,
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      react: {
        useSuspense: false,
      },
      load: 'currentOnly',
    } as InitOptions

    await i18n.use(HttpBackend).use(initReactI18next).init(config)
  }

  return {
    using: (lng: string) => {
      if (!initialized) {
        return initialize(lng)
      } else {
        return changeLanguage(lng)
      }
    },
  }
}

const configI18n = ConfigI18n()

export default configI18n
