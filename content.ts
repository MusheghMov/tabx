import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

let popover: any
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (popover) {
    popover.remove()
  }

  const selection = window.getSelection()
  const anchorNode = selection.anchorNode.parentElement
  const anchorRect = anchorNode.getBoundingClientRect()
  popover = document.createElement("div")

  anchorNode.appendChild(popover)
  popover.style.position = "absolute"
  popover.style.backgroundColor = "white"
  popover.style.color = "black"
  popover.style.padding = "10px"
  popover.style.borderRadius = "5px"
  popover.style.zIndex = "9999"
  popover.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)"
  popover.style.display = "flex"
  popover.style.alignItems = "center"
  popover.style.justifyContent = "center"
  popover.style.fontSize = anchorNode.style.fontSize
  popover.style.fontWeight = anchorNode.style.fontWeight
  popover.style.maxWidth = anchorRect.width + "px"
  popover.textContent = "Loading..."

  // @ts-ignore
  const availability = await LanguageDetector.availability()

  let detector: any
  let translator: any

  if (availability === "available") {
    // @ts-ignore
    detector = await LanguageDetector.create()
  }
  const selectedText = selection.toString()
  const detectedLanguages = await detector.detect(selectedText)
  const mostLikelyLanguage = detectedLanguages[0].detectedLanguage
  const userLanguage = await chrome.i18n.getAcceptLanguages()

  // @ts-ignore
  translator = await Translator.create({
    sourceLanguage: mostLikelyLanguage,
    targetLanguage: "ru" || userLanguage[1]
  })
  const translationStream = translator.translateStreaming(selectedText)
  console.log("Translation stream: ", translationStream)
  let translation = ""
  for await (const chunk of translationStream) {
    console.log("chunk: ", chunk)
    translation += chunk
    popover.textContent = translation
  }
  console.log("Translation: ", translation)

  // const translation = request.translation
  // popover.textContent = translation
  selection.removeAllRanges()

  sendResponse({ response: "Hello from the content script!" })
})
