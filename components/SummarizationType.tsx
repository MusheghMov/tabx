import { useQuery } from "@tanstack/react-query"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "components/ui/select"

import { cn } from "~lib/utils"

export default function SummarizationType({
  summarizationTypeLocal,
  setSummarizationTypeLocal,
  article
}: {
  summarizationTypeLocal: string
  setSummarizationTypeLocal: React.Dispatch<React.SetStateAction<string>>
  article: string
}) {
  const { refetch: refetchSummarizationType } = useQuery({
    queryKey: ["summarizationType"],
    queryFn: async () => {
      const { summarizationType } =
        await chrome.storage.local.get("summarizationType")

      if (!summarizationType) return

      setSummarizationTypeLocal(summarizationType)
    }
  })

  const onTriggerSummarization = async () => {
    chrome.runtime.sendMessage({
      type: "summarize-on-select"
    })
  }

  const onSummarizationTypeChange = async (value: string) => {
    if (!value) return

    setSummarizationTypeLocal(value)

    await chrome.storage.local.set({
      summarizationType: value
    })

    if (article) {
      onTriggerSummarization()
    }

    refetchSummarizationType()
  }

  return (
    <div className="space-y-1">
      <p className="text-neutral-400">Summarization type:</p>
      <Select
        onValueChange={onSummarizationTypeChange}
        defaultValue={summarizationTypeLocal}
        value={summarizationTypeLocal}>
        <SelectTrigger className="w-[180px] text-neutral-100 border-input border border-neutral-600 rounded-md px-3 py-1 border-dashed">
          <SelectValue placeholder="Summarization type" />
        </SelectTrigger>
        <SelectContent className="text-neutral-400 border-input border border-neutral-600 bg-black">
          <SelectItem value="key-points">Key Points</SelectItem>
          <SelectItem value="tldr">TL;DR</SelectItem>
          <SelectItem value="teaser">Teaser</SelectItem>
          <SelectItem value="headline">Headline</SelectItem>
        </SelectContent>
      </Select>

      <button
        onClick={onTriggerSummarization}
        className={cn(
          "border p-1 bg-transparent hover:bg-neutral-400/20 border-dashed backdrop-blur-lg text-white rounded-md border-neutral-600 h-9 w-full text-center"
        )}>
        Summarize
      </button>
    </div>
  )
}
