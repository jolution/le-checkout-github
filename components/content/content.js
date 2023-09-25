// Function to insert a new node after a reference node
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// Function to check and limit the maximum length of text
function checkMaxLength(text) {
    return text.length > 255 ? text.slice(0, 255) : text;
}

function approveValidGitBranchName(branchName) {
    // Ersetze ungültige Zeichen durch Leerzeichen
    const sanitizedBranchName = branchName.replace(/[^a-zA-Z0-9\/\-_]/g, '');

    // Überprüfe die maximale Länge
    return checkMaxLength(sanitizedBranchName);
}

// TODO: outsource to config file
// Info: Set the log level to 0 to disable logging
const LogLevels = 1;
const LogIdentifier = '[JOLUTION]';

// Function to log a message if LogLevels is greater than 0
function logThis(message) {
    if (LogLevels > 0) {
        // eslint-disable-next-line no-console
        console.log(`${LogIdentifier} ${message}`);
    }
}

window.onload = function () {
    logThis('Page fully loaded');

    const buttonCreateBranch = document.querySelector('button[data-action="click:create-branch#openDialog"][data-view-component="true"]');
    const writable = !!buttonCreateBranch;

    logThis(`Der Button existiert: ${writable}`);

    // Doesn't need if we have rights to create a branch
    if (!writable) {
        const issueNumber = window.location.href.match(/\/issues\/(\d+)/)[1];

        // Extrahieren des Titels
        const titleElement = document.querySelector('.js-issue-title');
        const title = titleElement.textContent.trim();

        // Creating radio buttons
        const radioContainer = document.createElement('div');
        const prefixes = ['feature', 'fix', 'build', 'ci', 'docs', 'perf', 'refactor', 'style', 'test', 'chore', 'research'];

        const select = document.createElement('select');
        select.addEventListener('change', () => {
            updateBranchName(select.value);
        });

        prefixes.forEach(prefix => {
            const option = document.createElement('option');
            option.value = prefix;
            option.textContent = prefix;

            // TODO: @raj please preselect the option based on the Github Issue Type ID
            // option.selected = prefix === 'feature';

            select.appendChild(option);
        });

        radioContainer.appendChild(select);

        // Formatting the branch name
        // TODO: duplicate code, please outsource to function 1/2
        const formattedBranchName = approveValidGitBranchName(`${title.toLowerCase().replace(/\s+/g, '-')}`);
        const formattedBranchNameWithPrefix = `feature/${issueNumber}-${formattedBranchName}`;

        // Erstellen des Eingabefelds mit dem formatierten Branch-Namen
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.readOnly = true;
        inputElement.className = 'form-control input-monospace input-sm color-bg-subtle';
        inputElement.value = `git checkout -b ${formattedBranchNameWithPrefix}`;

        // TODO: outsource to css file
        inputElement.style.width = '84%';

        // Function to update the branch name based on the selected prefix
        function updateBranchName(prefix) {
            // TODO: duplicate code, please outsource to function 2/2
            const formattedBranchName = approveValidGitBranchName(`${title.toLowerCase().replace(/\s+/g, '-')}`);
            const formattedBranchNameWithPrefix = `${prefix}/${issueNumber}-${formattedBranchName}`;

            inputElement.value = `git checkout -b ${formattedBranchNameWithPrefix}`;
        }

        // Erstellen des "Copy"-Buttons
        const copyButton = document.createElement('button');
        copyButton.innerHTML = '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy js-clipboard-copy-icon d-inline-block"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg>';

        // TODO: outsource to css file
        copyButton.style.width = '15%';
        copyButton.style.marginLeft = '1%';
        copyButton.addEventListener('click', () => {
            inputElement.select();
            document.execCommand('copy');
        });

        // Erstellen des Container-Elements
        const containerElement = document.createElement('div');
        containerElement.id = 'browser-extension-gitbranch__container';

        containerElement.appendChild(inputElement);
        containerElement.appendChild(copyButton);
        containerElement.appendChild(radioContainer);

        // Auswählen des Ziels für das Eingabefeld und Hinzufügen des Eingabefelds
        const sidebarContainer = document.querySelector('[data-target="create-branch.sidebarContainer"]');
        // sidebarContainer.appendChild(containerElement);

        // devStatusPanel.appendChild(containerElement);
        insertAfter(containerElement, sidebarContainer);
    }

}

