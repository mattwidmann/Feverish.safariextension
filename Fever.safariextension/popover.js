// set up popover when clicked
safari.application.addEventListener('popover', popoverHandler, false)

function popoverHandler (event) {
    document.feed.title.value = safari.application.activeBrowserWindow.activeTab.title
    document.feed.url.value = ''

    safari.application.activeBrowserWindow.activeTab.page.dispatchMessage('updateFeeds')
}

// validate the toolbar item for each tab
safari.application.addEventListener('validate', validateHandler, false)

function validateHandler (event) {
    event.target.disabled = !event.target.browserWindow.activeTab.url
}

// submit form in popover
document.feed.add.addEventListener('click', submitAction, false)

function submitAction (event) {
    var data = new FormData()
    data.append('action', 'add-feed')
    data.append('feed[url]', document.feed.url.value)
    data.append('feed[title]', document.feed.title.value)

    sendPost(manageEndpoint(), data, function (request) { safari.extension.popovers[0].hide() })
}

// populate feed url from injected script
safari.application.addEventListener('message', respondToMessage, false)

function respondToMessage (event) {
    if (event.name !== 'feedsForTab') return

    if (!event.message) return

    document.feed.url.value = event.message[0]

    // could check if feed already exists
}

// unofficial API

function sendPost (url, data, callback) {
    var request = newRequest(callback)

    request.open('POST', url)
    request.send(data)
}

function newRequest (callback) {
    var request = new XMLHttpRequest()

    request.addEventListener('load', function (event) { callback(request) }, false)

    return request
}

function manageEndpoint (parameters) {
    return (safari.extension.secureSettings.url + '/?manage')
}

// official API

function sendGet (url, callback) {
    var request = newRequest(callback)

    request.open('GET', url)
    request.send(null)
}

function feverEndpoint (parameters) {
    return safari.extension.secureSettings.url + '/?api&api_key=' + apiKey() + '&' + parameters
}

function apiKey () {
    return MD5(safari.extension.secureSettings.username + ':' + safari.extension.secureSettings.password)
}
