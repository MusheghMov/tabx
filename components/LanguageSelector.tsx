import { useQuery } from "@tanstack/react-query"
import ReactCountryFlag from "react-country-flag"

import { cn } from "~lib/utils"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select"

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", countryCode: "US" },
  { code: "es", name: "Spanish", countryCode: "ES" },
  { code: "fr", name: "French", countryCode: "FR" },
  { code: "de", name: "German", countryCode: "DE" },
  { code: "it", name: "Italian", countryCode: "IT" },
  { code: "pt", name: "Portuguese", countryCode: "PT" },
  { code: "ja", name: "Japanese", countryCode: "JP" },
  { code: "ko", name: "Korean", countryCode: "KR" },
  { code: "zh", name: "Chinese", countryCode: "CN" },
  { code: "ar", name: "Arabic", countryCode: "SA" },
  { code: "hi", name: "Hindi", countryCode: "IN" },
  { code: "ru", name: "Russian", countryCode: "RU" }
]

export default function LanguageSelector() {
  const {
    data: targetLanguage,
    isPending: isPendingTargetLanguage,
    refetch
  } = useQuery({
    queryKey: ["targetLanguage"],
    queryFn: async () => {
      const { targetLanguage } = await chrome.storage.sync.get("targetLanguage")
      return targetLanguage || "en"
    }
  })

  const handleLanguageChange = async (languageCode: string) => {
    await chrome.storage.sync.set({ targetLanguage: languageCode })
    refetch()
  }

  const selectedLanguage = SUPPORTED_LANGUAGES.find(
    (lang) => lang.code === targetLanguage
  )

  if (isPendingTargetLanguage) {
    return (
      <div className="flex flex-col gap-1">
        <p className="text-neutral-400">Target language:</p>
        <div className="h-9 w-full bg-neutral-400/20 rounded-md animate-pulse" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="text-neutral-400">Target language:</p>
      <Select value={targetLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger
          className={cn(
            "uppercase border flex items-center gap-2 justify-center p-1 bg-transparent hover:bg-neutral-400/20 border-dashed backdrop-blur-lg text-white rounded-md border-neutral-600 h-9 w-full text-center"
          )}>
          <SelectValue>
            {selectedLanguage && (
              <div className="flex items-center gap-2">
                <span className="text-xs">{selectedLanguage.name}</span>
                <ReactCountryFlag
                  countryCode={selectedLanguage.countryCode}
                  svg
                />
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-black border-neutral-600">
          {SUPPORTED_LANGUAGES.map((language) => (
            <SelectItem
              key={language.code}
              value={language.code}
              className="text-white hover:bg-neutral-800 focus:bg-neutral-800">
              <div className="flex items-center gap-2">
                <span>{language.name}</span>
                <ReactCountryFlag countryCode={language.countryCode} svg />
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
