import CONFIG from "../config.js";
import TRANSLATION from "./language.js";
import { insertAfter, logThis } from "./utils.js";

// check and limit the maximum length of a text
function checkMaxLength(text) {
    return text.length > 255 ? text.slice(0, 255) : text;
}

// approve a valid git branch name
function approveValidGitBranchName(branchName) {
    // Ersetze ungültige Zeichen durch Leerzeichen
    const sanitizedBranchName = branchName.replace(/[^a-zA-Z0-9\/\-_]/g, '');

    // Überprüfe die maximale Länge
    return checkMaxLength(sanitizedBranchName);
}

window.onload = function () {
    logThis('Page fully loaded');

    const buttonCreateBranch = document.querySelector('button[data-action="click:create-branch#openDialog"][data-view-component="true"]');
    const writable = !!buttonCreateBranch;

    logThis(`Button exist: ${writable}`);

    // Creating radio buttons
    const radioContainer = document.createElement('div');

    const select = document.createElement('select');

    for (const prefix in CONFIG.BRANCH_PREFIXES) {
        const option = document.createElement('option');
        option.value = prefix;
        const emoji = CONFIG.BRANCH_PREFIXES[prefix];
        option.textContent = `${emoji} ${prefix}`;

        // TODO: @raj please preselect the option based on the Github Issue Type ID
        // option.selected = prefix === 'feature';

        select.appendChild(option);
    }

    // Doesn't need it if we have rights to create a branch
    if (!writable) {
        const issueNumber = window.location.href.match(/\/issues\/(\d+)/)[1];

        // Extrahieren des Titels
        const titleElement = document.querySelector('.js-issue-title');
        const title = titleElement.textContent.trim();

        // Add select field
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

        select.addEventListener('change', () => {
            updateBranchName(select.value);
        });

        // Erstellen des "Copy"-Buttons
        const copyButton = document.createElement('button');
        copyButton.innerHTML = `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy js-clipboard-copy-icon d-inline-block"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path> ${TRANSLATION.COPY}</svg>`;

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
    } else {

        const parentElement = document.getElementById('partial-discussion-sidebar');

        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                // Überprüfen Sie, ob das Formular hinzugefügt wurde
                if (mutation.addedNodes) {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const addedNode = mutation.addedNodes[i];
                        if (addedNode instanceof HTMLElement && addedNode.matches('form[data-target="create-branch.form"]')) {

                            const formInput = addedNode.querySelector('input[name="name"]');
                            const formInputValue = formInput.textContent || formInput.value;
                            formInput.value = select[0].value + '/' + formInputValue;

                            // Add select field
                            insertAfter(select, formInput);
                            select.addEventListener('change', () => {
                                formInput.value = select.value + '/' + formInputValue;
                            });

                        }
                    }
                }
            });
        });

        observer.observe(parentElement, {childList: true, subtree: true});


    }

}

