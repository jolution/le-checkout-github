/*function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}*/

const targetURL = 'ENTER_YOUR_URL_HERE';

const LogLevels = 1;
const LogIdentifier = '[JOLUTION]';

function logThis(message) {
    if (LogLevels > 0) {
        // eslint-disable-next-line no-console
        console.log(`${LogIdentifier} ${message}`);
    }
}

if (window.location.href.startsWith(targetURL)) {
    logThis(`Url starts with ${targetURL}`);

    window.onload = function() {
        logThis('Page fully loaded');

        // TODO: Insert your code here

    }
}
