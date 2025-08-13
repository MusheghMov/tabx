import "./style.css"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { marked } from "marked"
import { useCallback, useEffect, useRef, useState } from "react"

import PopupContent from "~components/PopupContent"

const queryClient = new QueryClient()

function IndexPopup() {
  const [selection, setSelection] = useState("")
  const [article, setArticle] = useState("")
  const [summarizeIsLoading, setSummarizeIsLoading] = useState(false)
  const articleTextRef = useRef("")

  const messageHandler = useCallback(
    async (
      request: any,
      _sender: any,
      _sendResponse: (response?: any) => void
    ) => {
      if (request.type === "send-selection-to-popup") {
        const selection = request.selection
        setSelection(selection)
      }
      if (request.type === "summarize-is-loading") {
        articleTextRef.current = ""
        setArticle("")
        setSummarizeIsLoading(true)
      }

      if (request.type === "send-chunk-to-popup") {
        if (summarizeIsLoading) {
          setSummarizeIsLoading(false)
        }
        const chunk = request.chunk
        articleTextRef.current += chunk
        const markdown = await marked(articleTextRef.current)
        setArticle(markdown)
      }
    },
    [summarizeIsLoading]
  )

  useEffect(() => {
    chrome.runtime.onMessage.addListener(messageHandler)
    return () => {
      chrome.runtime.onMessage.removeListener(messageHandler)
    }
  }, [messageHandler])

  return (
    <QueryClientProvider client={queryClient}>
      <PopupContent
        selection={selection}
        article={article}
        summarizeIsLoading={summarizeIsLoading}
      />
    </QueryClientProvider>
  )
}

export default IndexPopup
