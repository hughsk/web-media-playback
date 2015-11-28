# web-media-playback

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Retrieve playback and buffering information about audio or video playing in the browser. Easily makes it possible to build your own media controls.

## Usage

[![NPM](https://nodei.co/npm/web-media-playback.png)](https://www.npmjs.com/package/web-media-playback)

### `playback = Playback([media])`

Creates a new `playback` instance. Optionally, you can pass a `media` object to use on creation. This should be an instance of `Audio`, `HTMLAudioElement` or `HTMLVideoElement`.

``` javascript
const Playback = require('web-media-playback')

const audio = new window.Audio()
const playback = Playback(audio)

audio.src = 'yay.mp3'
```

### `playback.info()`

Retrieves playback and buffering information about the selected media. The data returned should look something like this:

``` javascript
{
  playing: true,
  loaded: true,
  ready: true,
  duration: 217.324884,
  current: 25.3842934,
  buffer: 180.923398,
  buffered: [[0, 180.923398]],
  playback: [[0, 25.3842934]],
  seekable: [[0, 217.324884]]
}
```

Note that `buffered`, `playback` and `seekable` are lists of time ranges — each element is a `[start, stop]` array, and there can be more than one element for each of these metrics. For example:

``` javascript
{
  playback: [[0, 25], [35, 45]]
}
```

The above would occur if:

1. The media started at 0 seconds.
1. The media played for 25 seconds.
1. At that point, the media was manually seeked to 35 seconds.
1. And `.info()` was then called 45 seconds into the audio/video.

#### `info.playing`

A boolean reflecting whether or not the media is currently playing.

#### `info.loaded`

A boolean reflecting whether or not the media is loaded at all.

#### `info.ready`

A boolean reflecting whether or not the media is ready to play.

#### `info.duration`

The total duration of the media, in seconds.

#### `info.current`

The current playback time, in seconds.

#### `info.buffer`

An approximation of how far the media has been buffered. Intended for convenience — use `info.buffered` for more exact metrics.

#### `info.buffered`

A list of time ranges displaying the parts of the media that have been buffered. Note that this may be split up into multiple ranges if you're seeking through the video quickly enough.

#### `info.playback`

A list of time ranges that have been played at least once in the current session.

#### `info.seekable`

A list of the seekable time ranges in the current media. This should almost always be `[[0, info.duration]]`.

### `playback.use(media)`

Changes the currently observed media. You can use this when swapping songs/videos to maintain the existing instance, and future calls to `.info()` will be updated as soon as the media is ready.

### `playback.dispose()`

Cleans up any external references for better garbage collection. After calling this, `.info()` will no longer be updated

## See Also

* [HTMLAudioElement](https://developer.mozilla.org/en/docs/Web/API/HTMLAudioElement)
* [HTMLVideoElement](https://developer.mozilla.org/en/docs/Web/API/HTMLVideoElement)
* [Video buffering demo](http://jsfiddle.net/AbdiasSoftware/Drw6M/)
* [TimeRanges](https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges)

## License

MIT, see [LICENSE.md](http://github.com/hughsk/web-media-playback/blob/master/LICENSE.md) for details.
