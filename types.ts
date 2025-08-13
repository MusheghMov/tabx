export type Article = {
  title: string
  content: string
  textContent: string
  length: number
  excerpt: string
  byline: string
  dir: string
  siteName: string
  lang: string
  publishedTime: string
}

export type SummarizationOptions = {
  sharedContext?: string
  type?: "key-points" | "tldr" | "teaser" | "headline"
  format?: "markdown" | "plain-text"
  length?: "long" | "medium" | "short"
}
