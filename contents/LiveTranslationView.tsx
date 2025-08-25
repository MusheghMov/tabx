import cssText from "data-text:~style.css"
import { XIcon } from "lucide-react"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import createLanguageDetector from "~lib/create-language-detector"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

const PlasmoOverlay = () => {
  const [active, setActive] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [translation, setTranslation] = useState("")
  const [maxWidth, setMaxWidth] = useState(0)

  useEffect(() => {
    document.addEventListener("mouseup", async () => {
      const selection = window.getSelection()
      const selectedText = selection.toString()

      if (selectedText.length > 0) {
        const range = selection.getRangeAt(0)
        const rects = range.getClientRects()
        setTranslation("")
        const { translateOnSelect } =
          await chrome.storage.sync.get("translateOnSelect")

        if (rects.length > 0 && translateOnSelect) {
          const rects = [...range.getClientRects()]

          let minLeft = Infinity
          let maxRight = -Infinity
          let maxBottom = -Infinity

          rects.forEach((rect) => {
            if (rect.left < minLeft) minLeft = rect.left
            if (rect.right > maxRight) maxRight = rect.right
            if (rect.bottom > maxBottom) maxBottom = rect.bottom
          })

          const width = maxRight - minLeft

          setMaxWidth(width)
          setActive(true)
          setPos({
            x: minLeft + window.scrollX,
            y: maxBottom + window.scrollY
          })

          try {
            const translationStream = await detectAndTranslate(selectedText)
            let translatedText = ""
            for await (const chunk of translationStream) {
              translatedText += chunk
              setTranslation(translatedText)
            }
          } catch (e) {
            console.log("Error translating: ", e)
          }

          selection.removeAllRanges()
        }
      }
    })
  }, [])

  if (!active) {
    return null
  }
  return (
    <div
      className="bg-gray/50 backdrop-blur-lg min-w-fit rounded border-dashed border px-0 py-2 top-0 left-0 absolute border-gray-400 w-max h-fit flex items-start"
      style={{
        top: pos.y,
        left: pos.x,
        maxWidth: maxWidth
      }}>
      <p className="pl-4">{translation || "Translating..."}</p>
      <button
        onClick={() => {
          setTranslation("")
          setActive(false)
        }}
        className="bg-transparent h-min w-min p-2 border-none text-gray-400 hover:text-gray-500 focus:outline-none">
        <XIcon size={12} />
      </button>
    </div>
  )
}

export default PlasmoOverlay

const detectAndTranslate = async (selectedText: string) => {
  let translator: any
  let detector = await createLanguageDetector()
  if (!detector) {
    return
  }

  const detectedLanguages = await detector.detect(selectedText)
  const mostLikelyLanguage = detectedLanguages[0].detectedLanguage

  const { targetLanguage } = await chrome.storage.sync.get("targetLanguage")
  const selectedTargetLanguage = targetLanguage || "en"

  if (targetLanguage === detectedLanguages[0].detectedLanguage) {
    return selectedText
  }

  try {
    // @ts-ignore
    translator = await Translator.create({
      sourceLanguage: mostLikelyLanguage,
      targetLanguage: selectedTargetLanguage,
      monitor(m: any) {
        m.addEventListener("downloadprogress", (e: any) => {
          console.log(`Downloaded ${e.loaded * 100}%`)
        })
      }
    })
    return translator.translateStreaming(selectedText)
  } catch (e) {
    console.log("Error Translating: ", e)
  }
}
