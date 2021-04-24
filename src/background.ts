chrome.browserAction.onClicked.addListener(() => {
    chrome.tabs.query({ url: "https://music.yandex.ru/*" }, (result) => {
        const targetTab = result[0];

        if (targetTab === undefined || targetTab.id === undefined) {
            chrome.tabs.create({
                url: "https://music.yandex.ru/home"
            });

            return;
        }

        chrome.tabs.update(targetTab.id, {
            active: true
        });
    });
});
