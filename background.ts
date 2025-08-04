export {}

// let session: any
let detector: any
let translator: any

chrome.runtime.onInstalled.addListener(async () => {
  try {
    const asd = chrome.contextMenus.create({
      id: "tabx",
      title: "Tabx",
      contexts: ["all"]
    })
    console.log("Context menu created: ", asd)
  } catch (e) {
    console.log("Error: ", e)
  }

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

  // @ts-ignore
  // session = await self.LanguageModel.create()
  // console.log("Session created: ", session)
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log("Info: ", info)
  const selectedText = info.selectionText
  const detectedLanguages = await detector.detect(selectedText)
  console.log("Detected language: ", detectedLanguages)
  const mostLikelyLanguage = detectedLanguages[0].detectedLanguage
  console.log("Most likely language: ", mostLikelyLanguage)

  const userLanguage = await chrome.i18n.getAcceptLanguages()
  console.log("User language: ", userLanguage[1])

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
  console.log("Translator created: ", translator)
  const translation = await translator.translate(selectedText)

  chrome.tabs.sendMessage(tab.id, {
    message: "Hello from the background script!",
    translation: translation
  })
  console.log("Translation: ", translation)
})

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === "translate") {
    chrome.tabs.sendMessage(tab.id, {
      message: "Hello from the background script!"
      // translation: translation
    })
  }
})
// chrome.action.onClicked.addListener(async () => {
//   const currentTab = await chrome.tabs.query({
//     active: true,
//     currentWindow: true
//   })
//   const prompt = `What is the ${currentTab[0].title} doing?`
//   // @ts-ignore
//   const result = await session.prompt(prompt)
//   console.log("Result: ", result)
// })
