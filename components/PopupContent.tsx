import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import ReactCountryFlag from "react-country-flag"

import {
  getCountryCodeForLanguage,
  getLanguageName
} from "~lib/language-country-mapping"
import { cn } from "~lib/utils"

import LanguageSelector from "./LanguageSelector"
import SummarizationType from "./SummarizationType"
import { Skeleton } from "./ui/skeleton"

export default function PopupContent({
  article,
  summarizeIsLoading
}: {
  selection: string
  article: string
  summarizeIsLoading: boolean
}) {
  const [summarizationTypeLocal, setSummarizationTypeLocal] =
    useState<string>("key-points")
  const [languageName, setLanguageName] = useState("")
  const [countryCode, setCountryCode] = useState("")

  const {
    data: translateOnSelect,
    isPending: isPendingTranslateOnSelect,
    refetch
  } = useQuery({
    queryKey: ["translateOnSelect"],
    queryFn: async () => {
      const { translateOnSelect } =
        await chrome.storage.sync.get("translateOnSelect")
      return translateOnSelect
    }
  })

  const { data: _detectedLanguage, isPending: isPendingLanguage } = useQuery({
    queryKey: ["detectedLanguage"],
    queryFn: async () => {
      const { language } = await chrome.runtime.sendMessage({
        type: "get-language"
      })
      const name = getLanguageName(language)
      const code = getCountryCodeForLanguage(language)
      setCountryCode(code)
      setLanguageName(name)

      return language
    }
  })

  if (isPendingTranslateOnSelect) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex p-2 w-[500px] h-[600px] flex-col gap-2 items-start justify-start bg-black">
      <div className="flex w-full justify-between items-start gap-2">
        <div className="flex flex-col gap-1">
          <div>
            <p className="text-neutral-400">Live translation:</p>
            <button
              onClick={async () => {
                await chrome.storage.sync.set({
                  translateOnSelect: !translateOnSelect
                })
                refetch()
              }}
              className={cn(
                "border-2 border-black p-1 bg-neutral-400/20 outline-dashed backdrop-blur-lg text-neutral-400 rounded-md outline-neutral-600 h-9 w-full text-center",
                translateOnSelect
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              )}>
              {translateOnSelect ? "on" : "off"}
            </button>
          </div>

          <div>
            <p className="text-neutral-400">Detected language:</p>

            <button
              className={cn(
                "uppercase border flex items-center gap-2 justify-center p-1 bg-transparent hover:bg-neutral-400/20 border-dashed backdrop-blur-lg text-white rounded-md border-neutral-600 h-9 w-full text-center"
              )}>
              {isPendingLanguage ? (
                ""
              ) : (
                <>
                  {languageName || "Unknown"}
                  <ReactCountryFlag countryCode={countryCode || "UN"} svg />
                </>
              )}
            </button>
          </div>
          <LanguageSelector />
        </div>

        <SummarizationType
          summarizationTypeLocal={summarizationTypeLocal}
          setSummarizationTypeLocal={setSummarizationTypeLocal}
          article={article}
        />
      </div>

      {summarizeIsLoading && (
        <div className="h-full w-full !overflow-y-hidden flex flex-col gap-2">
          <p className="text-neutral-400 font-bold text-base animate-pulse">
            Summarizing...
          </p>
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="min-h-4" />
          ))}
        </div>
      )}

      {article && (
        <div className="h-full w-full overflow-y-auto">
          <p className="text-neutral-200 font-bold text-base uppercase">
            {summarizationTypeLocal}:
          </p>
          <article
            className="prose dark:prose-invert lg:prose-xl text-neutral-400 prose-strong:text-neutral-200 prose-code:text-neutral-200"
            dangerouslySetInnerHTML={{ __html: article }}
          />
        </div>
      )}
    </div>
  )
}
