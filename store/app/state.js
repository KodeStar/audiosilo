export default function () {
  return {
    collections: [],
    currentCollection: 0,
    cacheKey: 'audioserve-',
    loginStatus: false,
    loginsecret: null,
    server: null,
    folder: null,
    group: null,
    search: false,
    searchterm: '',
    menu: false,
    activepage: 'library',
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
