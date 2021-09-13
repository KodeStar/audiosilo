export default function () {
  return {
    cacheKey: 'audioserve-',
    loginStatus: false,
    loginsecret: null,
    server: null,
    folder: null,
    group: null,
    groupDetails: {
      playback_speed: 1,
      seekForwards: 45,
      seekBackwards: 30,
      active_books: [],
      finished_books: []
    },
    book: {
      hash: null,
      name: null,
      author: null,
      description: null,
      cover: null,
      seek: 0
    },
    folderDescription: '',
    secret: null,
    player: false,
    transcode: '0',
    rightbar: false
  }
}
