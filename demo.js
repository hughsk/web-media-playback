var badge = require('soundcloud-badge')
var Playback = require('./')

var pre = document.body.appendChild(document.createElement('pre'))
var audio = window.audio = new window.Audio()
var playback = Playback(audio)

pre.style.padding = '10rem'

badge({
  client_id: 'ded451c6d8f9ff1c62f72523f49dab68',
  song: 'https://soundcloud.com/dzasterpeace/swimming',
  getFonts: true,
  dark: true
}, function (err, src, json) {
  if (err) throw err

  audio.loop = true
  audio.addEventListener('canplay', function () {
    audio.play()
  }, false)

  audio.src = src
  audio.currentTime = 15

  setInterval(function () {
    pre.innerHTML = JSON.stringify(playback.info(), null, 2)
  }, 100)
})
