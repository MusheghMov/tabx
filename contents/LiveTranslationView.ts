import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

let popover: any
let selectionText: string

document.addEventListener("mouseup", async () => {
  const selection = window.getSelection()
  if (selection.toString().length > 0) {
    const { translateOnSelect } =
      await chrome.storage.sync.get("translateOnSelect")

    if (translateOnSelect) {
      createPopover(selection)
    }
  }
})

chrome.runtime.onMessage.addListener(async (request, _sender, sendResponse) => {
  const type = request.type
  switch (type) {
    case "translate":
      const selection = window.getSelection()
      if (selection.toString().length > 0) {
        createPopover(selection)
      }
      break
    default:
      break
  }
})

const createPopover = async (selection: Selection) => {
  if (popover) {
    popover.remove()
  }
  const anchorNode = selection.anchorNode.parentElement
  const anchorRect = anchorNode.getBoundingClientRect()
  // Create main popover container
  popover = document.createElement("div")
  anchorNode.appendChild(popover)

  // Style main popover container
  popover.style.position = "absolute"
  popover.style.backgroundColor = "white"
  popover.style.color = "black"
  popover.style.padding = "10px"
  popover.style.borderRadius = "5px"
  popover.style.zIndex = "9999"
  popover.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)"
  popover.style.fontSize = anchorNode.style.fontSize
  popover.style.fontWeight = anchorNode.style.fontWeight
  popover.style.maxWidth = anchorRect.width + "px"
  popover.style.position = "relative"

  // Create close button
  const closeButton = document.createElement("button")
  closeButton.innerHTML = "×"
  closeButton.style.position = "absolute"
  closeButton.style.top = "2px"
  closeButton.style.right = "2px"
  closeButton.style.background = "transparent"
  closeButton.style.border = "none"
  closeButton.style.fontSize = "16px"
  closeButton.style.fontWeight = "bold"
  closeButton.style.cursor = "pointer"
  closeButton.style.color = "#666"
  closeButton.style.width = "20px"
  closeButton.style.height = "20px"
  closeButton.style.display = "flex"
  closeButton.style.alignItems = "center"
  closeButton.style.justifyContent = "center"
  closeButton.style.borderRadius = "50%"
  closeButton.title = "Close translation"

  const sendToPopupButton = document.createElement("button")
  sendToPopupButton.innerHTML = "s"
  sendToPopupButton.style.position = "absolute"
  sendToPopupButton.style.top = "20px"
  sendToPopupButton.style.right = "2px"
  sendToPopupButton.style.background = "transparent"
  sendToPopupButton.style.border = "none"
  sendToPopupButton.style.fontSize = "16px"
  sendToPopupButton.style.fontWeight = "bold"
  sendToPopupButton.style.cursor = "pointer"
  sendToPopupButton.style.color = "#666"
  sendToPopupButton.style.width = "20px"
  sendToPopupButton.style.height = "20px"
  sendToPopupButton.style.display = "flex"
  sendToPopupButton.style.alignItems = "center"
  sendToPopupButton.style.justifyContent = "center"
  sendToPopupButton.style.borderRadius = "50%"
  sendToPopupButton.title = "Send to popup"

  // Add hover effect for close button
  closeButton.addEventListener("mouseenter", () => {
    closeButton.style.backgroundColor = "#f0f0f0"
    closeButton.style.color = "#000"
    sendToPopupButton.style.backgroundColor = "#f0f0f0"
    sendToPopupButton.style.color = "#000"
  })
  closeButton.addEventListener("mouseleave", () => {
    closeButton.style.backgroundColor = "transparent"
    closeButton.style.color = "#666"
    sendToPopupButton.style.backgroundColor = "transparent"
    sendToPopupButton.style.color = "#666"
  })

  // Add close functionality
  closeButton.addEventListener("click", (e) => {
    e.stopPropagation()
    if (popover) {
      popover.remove()
      popover = null
    }
  })
  sendToPopupButton.addEventListener("click", async (e) => {
    e.stopPropagation()

    chrome.runtime.sendMessage({
      type: "send-selection-to-popup",
      selection: selectionText
    })
    selectionText = ""
  })

  // Create text container for translation
  const textContainer = document.createElement("div")
  textContainer.style.paddingRight = "25px" // Make room for close button
  textContainer.style.minHeight = "20px"
  textContainer.style.display = "flex"
  textContainer.style.alignItems = "center"
  textContainer.style.justifyContent = "center"
  textContainer.textContent = "Loading..."

  // Append elements to popover
  popover.appendChild(closeButton)
  popover.appendChild(textContainer)
  popover.appendChild(sendToPopupButton)

  const selectedText = selection.toString()
  const translationStream = await detectAndTranslate(selectedText)
  let translation = ""
  for await (const chunk of translationStream) {
    translation += chunk
    textContainer.textContent = translation
  }

  selectionText = selection.toString()
  selection.removeAllRanges()
}
const detectAndTranslate = async (selectedText: string) => {
  let detector: any
  let translator: any

  // @ts-ignore
  const availability = await LanguageDetector.availability()

  if (availability === "unavailable") {
    // The language detector isn't usable.
    return
  }
  if (availability === "available") {
    // The language detector can immediately be used.
    // @ts-ignore
    detector = await LanguageDetector.create()
  } else {
    // The language detector can be used after model download.
    // @ts-ignore
    detector = await LanguageDetector.create({
      monitor(m: any) {
        m.addEventListener("downloadprogress", (e: any) => {
          console.log(`Downloaded ${e.loaded * 100}%`)
        })
      }
    })
    await detector.ready
  }

  const detectedLanguages = await detector.detect(selectedText)
  const mostLikelyLanguage = detectedLanguages[0].detectedLanguage

  const userLanguage = await chrome.i18n.getAcceptLanguages()

  try {
    // @ts-ignore
    translator = await Translator.create({
      sourceLanguage: mostLikelyLanguage,
      targetLanguage: "ru" || userLanguage[1],
      monitor(m: any) {
        m.addEventListener("downloadprogress", (e: any) => {
          console.log(`Downloaded ${e.loaded * 100}%`)
        })
      }
    })
  } catch (e) {
    console.log("Error Translating: ", e)
  }

  return translator.translateStreaming(selectedText)
}
