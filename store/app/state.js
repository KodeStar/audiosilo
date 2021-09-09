export default function () {
  return {
    loginStatus: false,
    loginsecret: null,
    server: null,
    group: null,
    groupDetails: {
      playback_speed: 1,
      active_books: [],
      finished_books: []
    },
    book: {
      name: null,
      author: null,
      description: null,
      cover: null
    },
    folderDescription: '',
    secret: null,
    player: false,
    transcode: '0'
  }
}
