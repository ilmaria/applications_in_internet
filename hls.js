if (Hls.isSupported()) {
  var video = document.getElementById('video')
  var hls = new Hls()
  hls.loadSource('https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8')
  hls.attachMedia(video)
  hls.on(Hls.Events.MANIFEST_PARSED, function() {
    video.play()
  })

  hls.on(Hls.Events.LEVEL_SWITCHING, levelSwitching)
  hls.on(Hls.Events.BUFFER_APPENDING, bufferAppending)
  hls.on(Hls.Events.FRAG_BUFFERED, fragBuffered)
  hls.on(Hls.Events.FPS_DROP, fpsDrop)
}

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

function levelSwitching(event, data) {
  log('quality_change', {
    // width: data.width,
    // height: data.height,
    // videoCodec: data.videoCodec,
    // bitrate: data.bitrate,
    // audioCodec: data.audioCodec,
    quality: data.level
  })
}

function bufferAppending(event, data) {
  // log(event, {
  //   type: data.type,
  //   content: data.content,
  //   byteLength: data.data.byteLength,
  //   byteOffset: data.data.byteOffset
  // })
}

function fragBuffered(event, data) {
  var duration = data.stats.tbuffered - data.stats.tfirst
  var size = data.stats.total
  log('frag_loaded', {
    type: data.frag.type,
    index: data.frag.sn,
    startTime: performance.timing.navigationStart + data.stats.tfirst,
    latency: data.stats.tfirst - data.stats.trequest,
    duration: duration,
    //bandwidth: Math.round(8 * size / duration),
    byteLength: size,
    quality: data.frag.level
  })
}

function fpsDrop(event, data) {
  // log(event, {
  //   currentDropped: data.currentDropped,
  //   totalDropped: data.totalDropped
  // })
}
