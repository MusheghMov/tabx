import type { Article, SummarizationOptions } from "~types"

export default async function summarizeStream(
  article: Article,
  options: SummarizationOptions,
  context?: string
) {
  const summarizeOptions = {
    ...options,
    monitor(m: any) {
      m.addEventListener("downloadprogress", (e: any) => {
        console.log(`Downloaded ${e.loaded * 100}%`)
      })
    }
  }

  // @ts-ignore
  const availability = await Summarizer.availability()
  if (availability === "unavailable") {
    console.warn("The Summarizer API isn't usable.")
    return
  }

  // @ts-ignore
  const summarizer = await Summarizer.create(summarizeOptions)
  const textContent = article.textContent
  try {
    const stream = summarizer.summarizeStreaming(textContent, {
      context: context || article.excerpt || ""
    })
    return stream
  } catch (e) {
    console.log("Error summarizing article:", e)
  }
}
