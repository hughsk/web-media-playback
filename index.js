var NO_SOURCE = window.HTMLMediaElement.NETWORK_NO_SOURCE

module.exports = Playback

function Playback (media) {
  if (!(this instanceof Playback)) {
    return new Playback(media)
  }

  this.ready = false
  this.media = null

  // data is resused between multiple calls to .info()
  // to minimise allocations and avoid any GC pressure,
  // however small.
  this.data = {
    playing: false,
    loaded: false,
    ready: false,
    duration: 0,
    current: 0,
    buffer: 0,
    buffered: [[]],
    playback: [[]],
    seekable: [[]]
  }

  if (media) this.use(media)
}

Playback.prototype.use = function (media) {
  if (media === this.media) return

  var self = this

  this.ready = false
  this.media = media

  if (media.readyState === 4) {
    this.ready = true
  } else {
    checkReady()
  }

  // Repeatedly check if any of the content has been buffered. This
  // avoids getting caught up in a mix of (sometimes inconsistent) events
  // and should allow .use() to be called both before and after the content
  // is loaded.
  function checkReady () {
    if (self.media !== media) return

    try {
      media.buffered && media.buffered.start(0)
    } catch (e) {
      return setTimeout(checkReady, 150)
    }

    self.ready = true
  }
}

Playback.prototype.dispose = function () {
  this.media = null
  this.disposed = true
}

Playback.prototype.info = function () {
  if (!this.media) return this.data
  if (!this.ready) return this.data

  var media = this.media
  var data = this.data
  var curr = media.currentTime

  data.ready = this.ready
  data.current = curr
  data.loaded = media.networkState !== NO_SOURCE
  data.playing = data.ready && !media.paused
  data.duration = media.duration

  // TimeRanges are a little icky to work with when you
  // want to be conservative with your allocations, hence
  // the following code.
  //
  // See also:
  // https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges
  var buff = media.buffered
  var seek = media.seekable
  var play = media.played
  var currBuffer = 0

  for (var b = 0; b < buff.length; b++) {
    data.buffered[b] = data.buffered[b] || []
    var init = data.buffered[b][0] = buff.start(b)
    var stop = data.buffered[b][1] = buff.end(b)
    if (init > curr) continue
    if (stop < curr) continue
    currBuffer = stop
  }

  for (var s = 0; s < seek.length; s++) {
    data.seekable[s] = data.seekable[s] || []
    data.seekable[s][0] = seek.start(s)
    data.seekable[s][1] = seek.end(s)
  }

  for (var p = 0; p < play.length; p++) {
    data.playback[p] = data.playback[p] || []
    data.playback[p][0] = play.start(p)
    data.playback[p][1] = play.end(p)
  }

  data.buffer = currBuffer
  data.buffered.length = buff.length
  data.seekable.length = seek.length
  data.playback.length = play.length

  return this.data
}
