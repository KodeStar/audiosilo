export default function () {
  return {
    collections: [],
    currentCollection: 0,
    cacheKey: 'audioserve-',
    loginStatus: false,
    loginsecret: null,
    server: null,
    folder: {
      cover: null,
      description: null,
      files: [],
      subfolders: []
    },
    location: {
      name: 'Home',
      backname: null,
      backpath: null
    },
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
      finished_books: [],
      cached_books: [],
      transcode: '0',
      darkMode: true
    },
    book: {
      hash: null,
      name: null,
      author: null,
      description: null,
      cover: null,
      seek: 0,
      path: null,
      history: [],
      bookmarks: []
    },
    folderDescription: '',
    secret: null,
    player: false,
    transcode: '0',
    rightbar: false
  }
}
