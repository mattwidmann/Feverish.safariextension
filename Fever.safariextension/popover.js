safari.application.addEventListener('popover', popoverHandler, false)

function popoverHandler (event) {
    var url = safari.application.activeBrowserWindow.activeTab.url
    var title = safari.application.activeBrowserWindow.activeTab.title

    document.feed.title.value = title
    safari.application.activeBrowserWindow.activeTab.page.dispatchMessage('updateFeeds')

    // check if this is already added
}

safari.application.addEventListener('validate', validateHandler, false)

function validateHandler (event) {
    event.target.disabled = !event.target.browserWindow.activeTab.url
}

document.feed.add.addEventListener('click', submitAction, false)

function submitAction(event) {
    // add this to fever
}

safari.application.addEventListener('message', respondToMessage, false)

function respondToMessage (event) {
    if (event.name !== 'feedsForTab') return

    document.feed.url.value = event.message[0]
}

function sendRequest (url, callback) {
    var request = new XMLHttpRequest()

    request.addEventListener('load', function (event) { callback(request) }, false)

    request.open('GET', url)
    request.send(null)
}

function log (text) {
    document.getElementById('console').innerText += text + '\n'
}
