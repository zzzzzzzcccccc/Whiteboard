import React, { useState, useCallback, useEffect, useLayoutEffect, useRef, useMemo } from 'react'
import GlobalStyle from './global-style'
import { ConfigProvider, theme } from 'antd'
import { IInitializeContext, InitializeProviderProps } from './types'
import { history, i18n } from '../../config'
import { Keyboard, KeyCode } from '../../utils'
import {
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_ANTD_COMPONENT_SIZE,
  DEFAULT_INITIALIZE_STATUS,
  NOT_FOUND_INITIALIZE_CONTEXT,
  SUCCESS_INITIALIZE_STATUS,
} from '../../constant'
import { Update } from 'history'

const initialContext: IInitializeContext = {
  status: DEFAULT_INITIALIZE_STATUS,
  update: { location: history.location, action: history.action },
  theme: {
    token: {
      colorPrimary: DEFAULT_PRIMARY_COLOR,
    },
    algorithm: theme.defaultAlgorithm,
    antdComponentSize: DEFAULT_ANTD_COMPONENT_SIZE,
  },
  language: 'zh-CN',
  updateTheme: () => new Error(NOT_FOUND_INITIALIZE_CONTEXT),
  updateLanguage: () => new Error(NOT_FOUND_INITIALIZE_CONTEXT),
  onResize: () => () => new Error(NOT_FOUND_INITIALIZE_CONTEXT),
  offResize: () => new Error(NOT_FOUND_INITIALIZE_CONTEXT),
  onKeyboard: () => () => new Error(NOT_FOUND_INITIALIZE_CONTEXT),
  offKeyboard: () => new Error(NOT_FOUND_INITIALIZE_CONTEXT),
  onRouterChange: () => () => new Error(NOT_FOUND_INITIALIZE_CONTEXT),
  offRouterChange: () => new Error(NOT_FOUND_INITIALIZE_CONTEXT),
}

export const InitializeContext = React.createContext(initialContext)

function InitializeProvider(props: InitializeProviderProps) {
  const { children } = props

  const [status, setStatus] = useState(initialContext.status)
  const [theme, setTheme] = useState(initialContext.theme)
  const [language, setLanguage] = useState(initialContext.language)
  const [update, setUpdate] = useState(initialContext.update)

  const resizeCallbacksRef = useRef(new Set<() => void>([]))
  const changeCallbacksRef = useRef(new Set<(target: Update) => void>([]))
  const keyboardRef = useRef<Keyboard<HTMLElement> | null>(null)

  const { isStatusPending } = useMemo(() => {
    return {
      isStatusPending: status === DEFAULT_INITIALIZE_STATUS,
    }
  }, [status])

  const updateTheme = useCallback((target: Partial<IInitializeContext['theme']>) => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      ...target,
    }))
  }, [])

  const updateLanguage = useCallback((target: IInitializeContext['language']) => {
    setLanguage(target)
  }, [])

  const offResize = useCallback((cb: () => void) => {
    resizeCallbacksRef.current.delete(cb)
  }, [])

  const onResize = useCallback(
    (cb: () => void) => {
      resizeCallbacksRef.current.add(cb)

      return () => offResize(cb)
    },
    [offResize],
  )

  const offKeyboard = useCallback((cb: (keyCode: KeyCode, event: KeyboardEvent) => void) => {
    keyboardRef.current?.remove(cb)
  }, [])

  const onKeyboard = useCallback(
    (cb: (keyCode: KeyCode, event: KeyboardEvent) => void) => {
      keyboardRef.current?.add(cb)
      return () => offKeyboard(cb)
    },
    [offKeyboard],
  )

  const offRouterChange = useCallback((cb: (target: Update) => void) => changeCallbacksRef.current.delete(cb), [])

  const onRouterChange = useCallback(
    (cb: (target: Update) => void) => {
      changeCallbacksRef.current.add(cb)

      return () => offRouterChange(cb)
    },
    [offRouterChange],
  )

  const handlerOnResize = useCallback(() => {
    resizeCallbacksRef.current.forEach((callback) => callback())
  }, [])

  const handleOnRouterChange = useCallback((target: Update) => {
    setUpdate(target)
    changeCallbacksRef.current.forEach((callback) => callback(target))
  }, [])

  useEffect(() => {
    keyboardRef.current = new Keyboard(document.body, {
      eventName: 'keydown',
      keyCodes: [],
    })

    keyboardRef.current?.start()

    return () => {
      keyboardRef.current?.stop()
      keyboardRef.current = null
    }
  }, [])

  useEffect(() => {
    document.addEventListener('resize', handlerOnResize)

    return () => document.removeEventListener('resize', handlerOnResize)
  }, [handlerOnResize])

  useEffect(() => {
    const mounted = async () => {
      if (isStatusPending) {
        await i18n.using(language)
        setStatus(SUCCESS_INITIALIZE_STATUS)
      }
    }

    mounted()
  }, [language, isStatusPending])

  useLayoutEffect(() => {
    const unbind = history.listen(handleOnRouterChange)

    return () => unbind()
  }, [handleOnRouterChange])

  return (
    <InitializeContext.Provider
      value={{
        update,
        theme,
        language,
        updateTheme,
        updateLanguage,
        onResize,
        offResize,
        onKeyboard,
        offKeyboard,
        onRouterChange,
        offRouterChange,
      }}
    >
      <GlobalStyle />
      <ConfigProvider theme={theme} componentSize={theme.antdComponentSize}>
        {isStatusPending ? null : children}
      </ConfigProvider>
    </InitializeContext.Provider>
  )
}

export default InitializeProvider
