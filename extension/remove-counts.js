// source: https://davidwalsh.name/javascript-debounce-function
const debounce = function(func, wait, immediate) {
  var timeout
  return function() {
    var context = this,
      args = arguments
    var later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

const removeViewsFromList = function() {
  console.log("[Unbiased Tube]: Removing views from list...")

  const metadataLines = document.querySelectorAll(
    "#metadata-line:not([data-unbiased-tube])"
  )

  for (const line of metadataLines) {
    try {
      window.requestAnimationFrame(function() {
        // line might be count or something like "Recommended for you"
        const maybeCount = line.querySelector("span:first-of-type")
        const count = /\d/.test(maybeCount.textContent) ? maybeCount : null
        if (count) {
          line.setAttribute("data-unbiased-tube", "")
          count.remove && count.remove()
        }
      })
    } catch (e) {}
  }
}

const removeViewsFromPlayer = function() {
  console.log("[Unbiased Tube]: Removing views from player...")

  const counts = document.querySelectorAll("#count:not([data-unbiased-tube])")

  for (const count of counts) {
    try {
      window.requestAnimationFrame(function() {
        count.setAttribute("data-unbiased-tube", "")
        count.remove && count.remove()
      })
    } catch (e) {}
  }
}

const removeSubscribers = function() {
  console.log("[Unbiased Tube]: Removing subscribers...")

  const subscribeButtons = document.querySelectorAll(
    "#subscribe-button:not([data-unbiased-tube])"
  )

  for (const button of subscribeButtons) {
    try {
      window.requestAnimationFrame(function() {
        const count = button.querySelector("#text > span")
        if (count) {
          button.setAttribute("data-unbiased-tube", "")
          count.remove && count.remove()
        }
      })
    } catch (e) {}
  }
}

const removeLikesAndDislikes = function() {
  console.log("[Unbiased Tube]: Removing likes and dislikes...")

  const menuButtons = document.querySelectorAll(
    "#menu #top-level-buttons:not([data-unbiased-tube])"
  )

  for (const buttonGroup of menuButtons) {
    try {
      window.requestAnimationFrame(function() {
        // like and dislike buttons
        const counts = buttonGroup.querySelectorAll("a #text[aria-label]")
        if (counts) {
          buttonGroup.setAttribute("data-unbiased-tube", "")
          for (const count of counts) {
            count && count.remove && count.remove()
          }
        }
      })
    } catch (e) {}
  }
}

const removeCounts = function() {
  removeViewsFromList()
  removeViewsFromPlayer()
  removeSubscribers()
  removeLikesAndDislikes()
}

const DEBOUNCE_TIME = 200

const debouncedRemoveCounts = debounce(removeCounts, DEBOUNCE_TIME)

const observerConfig = { attributes: false, childList: true, subtree: true }

const observerCallback = function(mutationList) {
  console.log("[Unbiased Tube]: Document mutation detected...")

  debouncedRemoveCounts()
}

const observer = new MutationObserver(observerCallback)

// ---

removeCounts()
observer.observe(document, observerConfig)
