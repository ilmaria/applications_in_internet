var url = 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd'
var event = dashjs.MediaPlayer.events

var player = dashjs.MediaPlayer().create()
player.initialize(document.querySelector('#video'), url, true)
//player.on(event.BUFFER_LEVEL_STATE_CHANGED, log)
player.on(event.FRAGMENT_LOADING_COMPLETED, fragLoaded)
player.on(event.QUALITY_CHANGE_REQUESTED, qualityChange)

var LOG_DATA = []

function log(event, data) {
  var newLogData = JSON.stringify({
    // Highres timestamp
    timestamp: performance.timing.navigationStart + performance.now(),
    event: event,
    data: data
  })

  // Append to current log
  LOG_DATA.push(newLogData)
}

function downloadLog() {
  var logElem = document.getElementById('log-btn')
  logElem.setAttribute(
    'href',
    'data:application/json;charset=utf-8,' +
      '[' +
      encodeURIComponent(LOG_DATA) +
      ']'
  )
}

function logEvent(event) {
  console.log('mylog', event)
}

function fragLoaded(event) {
  var startTime = event.request.requestStartDate.getTime()
  var endTime = event.request.requestEndDate.getTime()
  log('frag_loaded', {
    startTime: startTime,
    duration: endTime - startTime,
    type: event.request.mediaType,
    index: event.request.index,
    byteLength: event.response.byteLength,
    latency: event.request.firstByteDate - startTime,
    quality: event.request.quality
  })
}

function qualityChange(event) {
  log('quality_change', {
    // old: event.oldQuality,
    quality: event.newQuality
    // type: event.mediaType
  })
}
