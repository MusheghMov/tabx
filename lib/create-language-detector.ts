export default async function createLanguageDetector() {
  let detector: any

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
  return detector
}
