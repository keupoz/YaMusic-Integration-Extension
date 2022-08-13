export { }

chrome.action.onClicked.addListener(() => {
  void chrome.tabs.query({ url: 'https://music.yandex.ru/*' })
    .then(async ([result]) => {
      if (result === undefined || result.id === undefined) {
        return await chrome.tabs.create({
          url: 'https://music.yandex.ru/home'
        })
      }

      return await chrome.tabs.update(result.id, {
        active: true
      })
    })
})
