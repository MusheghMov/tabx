import { Readability } from "@mozilla/readability"

export {}

chrome.runtime.onMessage.addListener(async (request, _sender, sendResponse) => {
  if (request.type === "get-article") {
    try {
      var documentClone = document.cloneNode(true)
      var article = new Readability(documentClone as Document).parse()

      sendResponse({ article: article })
    } catch (e) {
      console.log("Error: ", e)
    }
  }
  return true
})
