import type { Article } from "~types"

export default async function getActivePageArticle() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  })

  if (!tab) return

  const { article } = await chrome.tabs.sendMessage(tab.id, {
    type: "get-article"
  })
  return article as Article
}
