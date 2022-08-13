import mainSrc from './main?script&module'

const internalScript = document.createElement('script')

internalScript.id = 'kYaMusicHelper349'
internalScript.setAttribute('data-ext-id', chrome.runtime.id)
internalScript.type = 'module'
internalScript.src = chrome.runtime.getURL(mainSrc)

document.body.appendChild(internalScript)
