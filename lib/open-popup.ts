export default async function openPopup() {
  try {
    await chrome.action.openPopup()
  } catch (e) {
    console.log("Error Openning Popup or it is already open: ", e)
  }
}
