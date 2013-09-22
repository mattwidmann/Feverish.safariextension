safari.self.addEventListener('message', respondToMessage, false)

function respondToMessage (event) {
    if (event.name !== 'updateFeeds') return
    // don't run within an iframe
    if (window.top !== window) return

    var links = document.getElementsByTagName('link')
    var feeds = []

    for (var i = 0; i < links.length; i += 1) {
        if (links[i].href && links[i].type && links[i].rel && links[i].rel.toLowerCase() === 'alternate' && links[i].type.match(/^application\/(rss|atom)\+xml$/i)) {
            feeds.push(links[i].href)
        }
    }

    if (feeds.length > 0) {
        event.target.tab.dispatchMessage('feedsForTab', feeds)
        return
    }

    //var anchors = document.getElementByTagName('a')
    //for (var i = 0; i < anchors.length; i += 1) {}
}
