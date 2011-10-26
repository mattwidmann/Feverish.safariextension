safari.application.addEventListener('popover', popoverHandler, false)

function popoverHandler (event) {
    var url = safari.application.activeBrowserWindow.activeTab.url
    var title = safari.application.activeBrowserWindow.activeTab.title

    document.feed.title.value = title
    document.feed.url.value = ''

    safari.application.activeBrowserWindow.activeTab.page.dispatchMessage('updateFeeds')
}

safari.application.addEventListener('validate', validateHandler, false)

function validateHandler (event) {
    event.target.disabled = !event.target.browserWindow.activeTab.url
}

document.feed.add.addEventListener('click', submitAction, false)

function submitAction (event) {
    var data = new FormData()
    data.append('action', 'add-feed')
    data.append('feed[url]', document.feed.url.value)
    data.append('feed[title]', document.feed.title.value)

    sendPost(manageEndpoint(), data, function (request) { safari.extension.popovers[0].hide() })
}

safari.application.addEventListener('message', respondToMessage, false)

function respondToMessage (event) {
    if (event.name !== 'feedsForTab') return

    if (!event.message) return

    document.feed.url.value = event.message[0]

    // could check if feed already exists
}

function sendGet (url, callback) {
    var request = newRequest(callback)

    request.open('GET', url)
    request.send(null)
}

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

function log (text) {
    document.getElementById('console').innerText += text + '\n'
}

function manageEndpoint (parameters) {
    return (safari.extension.secureSettings.url + '/?manage')
}

function feverEndpoint (parameters) {
    return safari.extension.secureSettings.url + '/?api&api_key=' + apiKey() + '&' + parameters
}

function apiKey () {
    return MD5(safari.extension.secureSettings.username + ':' + safari.extension.secureSettings.password)
}
