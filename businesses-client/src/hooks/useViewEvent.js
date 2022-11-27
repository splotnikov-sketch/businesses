import { useEffect, useState, useRef } from 'react'
import { useAppContext } from 'contexts/AppContext'
import { isNullOrEmpty } from 'utils'
import postViewEvent from 'api/cdp/postViewEvent'

const useViewEvent = (page, ext) => {
  const { state } = useAppContext()
  const { browser_id } = state.cdp

  const wasSent = useRef(false)
  const sending = useRef(false)

  const sendEvent = async (ext) => {
    if (isNullOrEmpty(browser_id)) {
      return
    }

    if (wasSent.current) {
      return
    }

    if (sending.current) {
      return
    }

    sending.current = true

    const result = await postViewEvent({ browser_id, page, ext })

    sending.current = false

    if (result) {
      wasSent.current = true
    }
  }

  useEffect(() => {
    sendEvent(ext)
  }, [])

  useEffect(() => {
    sendEvent(ext)
  }, [state.cdp.browser_id])

  return { wasSent, sendEvent }
}

export default useViewEvent
