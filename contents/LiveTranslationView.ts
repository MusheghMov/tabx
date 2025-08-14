import type { PlasmoCSConfig } from "plasmo"

import createLanguageDetector from "~lib/create-language-detector"

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

  // Add hover effect for close button
  closeButton.addEventListener("mouseenter", () => {
    closeButton.style.backgroundColor = "#f0f0f0"
    closeButton.style.color = "#000"
  })
  closeButton.addEventListener("mouseleave", () => {
    closeButton.style.backgroundColor = "transparent"
    closeButton.style.color = "#666"
  })

  // Add close functionality
  closeButton.addEventListener("click", (e) => {
    e.stopPropagation()
    if (popover) {
      popover.remove()
      popover = null
    }
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

  const selectedText = selection.toString()
  try {
    const translationStream = await detectAndTranslate(selectedText)
    let translation = ""
    for await (const chunk of translationStream) {
      translation += chunk
      textContainer.textContent = translation
    }
  } catch (e) {
    console.log("Error translating: ", e)
  }

  selectionText = selection.toString()
  selection.removeAllRanges()
}
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
