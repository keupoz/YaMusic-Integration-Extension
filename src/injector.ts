const internalScript = document.createElement("script");

internalScript.id = "kYaMusicHelper349";
internalScript.setAttribute("data-ext-id", chrome.runtime.id);
internalScript.src = chrome.runtime.getURL("main.js");

document.body.appendChild(internalScript);
