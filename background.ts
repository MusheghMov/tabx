import icon from "data-base64:~assets/icon.png"

import createLanguageDetector from "~lib/create-language-detector"
import getActivePageArticle from "~lib/get-active-page-article"
import openPopup from "~lib/open-popup"
import summarizeStream from "~lib/summarize-stream"

export {}

chrome.runtime.onInstalled.addListener(async () => {
  try {
    chrome.contextMenus.create({
      id: "summarize",
      title: "Summarize",
      contexts: ["all"]
    })
    chrome.contextMenus.create({
      id: "translate",
      title: "Translate",
      contexts: ["all"]
    })

    // @ts-ignore
    const detector = await LanguageDetector.create({
      monitor(m: any) {
        m.addEventListener("downloadprogress", (e: any) => {
          console.log(`Downloaded ${e.loaded * 100}%`)

          chrome.notifications.create(
            "init-detector",
            {
              type: "progress",
              progress: e.loaded * 100,
              iconUrl: icon,
              title: "Downloading language detector",
              message: "Language detector"
            },
            () => {
              let interval = setInterval(() => {
                if (e.loaded === 1) {
                  clearInterval(interval)
                  chrome.notifications.clear("init-detector")
                  chrome.notifications.create(
                    "init-detector",
                    {
                      type: "progress",
                      progress: e.loaded * 100,
                      iconUrl: icon,
                      title: "Downloading language detector",
                      message: "Language detector"
                    },
                    () => {
                      setTimeout(() => {
                        chrome.notifications.clear("init-detector")
                      }, 3000)
                    }
                  )
                }
              }, 10)
            }
          )
        })
      }
    })

    // @ts-ignore
    const translator = await Translator.create({
      sourceLanguage: "en",
      targetLanguage: "ru",
      monitor(m: any) {
        m.addEventListener("downloadprogress", (e: any) => {
          console.log(`Downloaded ${e.loaded * 100}%`)

          chrome.notifications.create(
            "init-translator",
            {
              type: "progress",
              progress: e.loaded * 100,
              iconUrl: icon,
              title: "Downloading language translator",
              message: "Language translator"
            },
            () => {
              let interval = setInterval(() => {
                if (e.loaded === 1) {
                  clearInterval(interval)
                  chrome.notifications.clear("init-translator")
                  chrome.notifications.create(
                    "init-translator",
                    {
                      type: "progress",
                      progress: e.loaded * 100,
                      iconUrl: icon,
                      title: "Downloading language translator",
                      message: "Language translator"
                    },
                    () => {
                      setTimeout(() => {
                        chrome.notifications.clear("init-translator")
                      }, 3000)
                    }
                  )
                }
              }, 10)
            }
          )

          if (e.loaded === 1) {
            chrome.notifications.clear("init-translator")
          }
        })
      }
    })

    // @ts-ignore
    const summarizer = await Summarizer.create({
      monitor(m) {
        m.addEventListener("downloadprogress", (e) => {
          console.log(`Downloaded ${e.loaded * 100}%`)

          chrome.notifications.create(
            "init-summarizer",
            {
              type: "progress",
              progress: e.loaded * 100,
              iconUrl: icon,
              title: "Downloading language summarizer",
              message: "Language summarizer"
            },
            () => {
              let interval = setInterval(() => {
                if (e.loaded === 1) {
                  clearInterval(interval)
                  chrome.notifications.clear("init-summarizer")
                  chrome.notifications.create(
                    "init-summarizer",
                    {
                      type: "progress",
                      progress: e.loaded * 100,
                      iconUrl: icon,
                      title: "Downloading language summarizer",
                      message: "Language summarizer"
                    },
                    () => {
                      setTimeout(() => {
                        chrome.notifications.clear("init-summarizer")
                      }, 3000)
                    }
                  )
                }
              }, 10)
            }
          )

          if (e.loaded === 1) {
            chrome.notifications.clear("init-summarizer")
          }
        })
      }
    })

    await detector.destroy()
    await translator.destroy()
    await summarizer.destroy()
  } catch (e) {
    console.log("Error: ", e)
  }
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "translate") {
    chrome.tabs.sendMessage(tab.id, {
      type: "translate"
    })
  }
  if (info.menuItemId === "summarize") {
    const article = await getActivePageArticle()

    await openPopup()

    chrome.runtime.sendMessage({
      type: "summarize-is-loading"
    })

    const { summarizationType } =
      await chrome.storage.local.get("summarizationType")

    try {
      const stream = await summarizeStream(article, {
        length: "long",
        type: summarizationType || "key-points",
        format: "markdown"
      })
      for await (const chunk of stream) {
        chrome.runtime.sendMessage({
          type: "send-chunk-to-popup",
          chunk: chunk
        })
      }
    } catch (e) {
      console.log("Error Streaming Summarization: ", e)
    }
  }
})

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const type = request.type
  switch (type) {
    case "send-selection-to-popup":
      await chrome.action.openPopup()
      const selection = request.selection
      chrome.runtime.sendMessage({
        type: "send-selection-to-popup",
        selection: selection
      })
      break
    case "get-language":
      const currentArticle = await getActivePageArticle()
      const detector = await createLanguageDetector()
      const detectedLanguages = await detector.detect(
        currentArticle.textContent
      )
      const mostLikelyLanguage = detectedLanguages[0].detectedLanguage

      sendResponse({
        language: mostLikelyLanguage
      })

      return true
    case "summarize-on-select":
      const article = await getActivePageArticle()

      await openPopup()

      chrome.runtime.sendMessage({
        type: "summarize-is-loading"
      })

      const { summarizationType } =
        await chrome.storage.local.get("summarizationType")

      try {
        const stream = await summarizeStream(article, {
          length: "long",
          type: summarizationType || "key-points",
          format: "markdown"
        })
        for await (const chunk of stream) {
          chrome.runtime.sendMessage({
            type: "send-chunk-to-popup",
            chunk: chunk
          })
        }
      } catch (e) {
        console.log("Error Streaming Summarization: ", e)
      }
      break
    default:
      break
  }
})
