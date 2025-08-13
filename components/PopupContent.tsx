import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { cn } from "~lib/utils"

import SummarizationType from "./SummarizationType"

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

  if (isPendingTranslateOnSelect) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex p-2 w-[500px] h-[600px] flex-col gap-2 items-start justify-start bg-black">
      <div className="flex w-full justify-between items-start gap-2">
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
              "border p-1 bg-neutral-400/20 border-dashed backdrop-blur-lg text-neutral-400 rounded-md border-neutral-600 h-9 w-full text-center",
              translateOnSelect
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            )}>
            {translateOnSelect ? "on" : "off"}
          </button>
        </div>
        <SummarizationType
          summarizationTypeLocal={summarizationTypeLocal}
          setSummarizationTypeLocal={setSummarizationTypeLocal}
          article={article}
        />
      </div>

      {summarizeIsLoading && (
        <div className="h-full w-full overflow-y-auto">
          <p className="text-neutral-400 font-bold text-base animate-pulse">
            Summarizing...
          </p>
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
