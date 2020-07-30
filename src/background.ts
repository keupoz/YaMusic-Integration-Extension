chrome.browserAction.onClicked.addListener(() => {
    chrome.tabs.query({
        url: "https://music.yandex.ru/*"
    }, (result) => {
        if (result.length && typeof result[0].id === "number") {
            chrome.tabs.update(result[0].id, {
                active: true
            });
        } else chrome.tabs.create({
            url: "https://music.yandex.ru/home"
        });
    });
});
