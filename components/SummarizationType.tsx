import { useQuery } from "@tanstack/react-query"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "components/ui/select"

export default function SummarizationType({
  summarizationTypeLocal,
  setSummarizationTypeLocal
}: {
  summarizationTypeLocal: string
  setSummarizationTypeLocal: React.Dispatch<React.SetStateAction<string>>
}) {
  const {
    data: summarizationType,
    isPending: isPendingSummarizationType,
    refetch: refetchSummarizationType
  } = useQuery({
    queryKey: ["summarizationType"],
    queryFn: async () => {
      const { summarizationType } =
        await chrome.storage.local.get("summarizationType")
      setSummarizationTypeLocal(summarizationType)
      return summarizationType
    }
  })

  const onSummarizationTypeChange = async (value: string) => {
    setSummarizationTypeLocal(value)
    await chrome.storage.local.set({
      summarizationType: value
    })
    refetchSummarizationType()
  }
  return (
    <div>
      <p className="text-neutral-400">Summarization type:</p>
      <Select
        onValueChange={onSummarizationTypeChange}
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
    </div>
  )
}
