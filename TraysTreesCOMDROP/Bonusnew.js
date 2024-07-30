let Code = '';
let currentDomain;
let currencyCode;
currentDomain = window.location.hostname;

const handleMessage = function(message, sender, sendResponse) {
    // Check if the message contains the bonus code and additional data
    if (message.bonusCodeee) {
        Code = message.bonusCodeee;
        // Do something with the bonus code and additional data
        console.log("Code :", Code);
        injectBonus3Script(Code)
        // Send a response back to the background script
        sendResponse({ received: true });
    }
};

chrome.runtime.sendMessage({ type: 'getCurrencyInfo' }, (response) => {
    // Handle the response containing currency info
    if (response && response.currencyCode) {
        const currencyCode = response.currencyCode;
        console.log(`Currency: ${currencyCode}`);
        setTimeout(() => {
            const button1 = document.querySelector('[data-test="coin-toggle"]');
            
            // Check if the button exists
            if (button1) {
                const activeCurrency = button1.getAttribute('data-active-currency');
                if (activeCurrency && activeCurrency !== currencyCode) {
                    button1.click();
                    setTimeout(() => {
                        const qselector = `[data-test="coin-toggle-currency-${currencyCode}"]`;
                        const button2 = document.querySelector(qselector);
                        if (button2) {
                            button2.click();
                        } else {
                            console.log("Second button not found.");
                        }
                    }, 200);
                } else {
                    console.log("Already on the correct currency or no active currency set.");
                }
            } else {
                console.log("Button not found.");
            }
        }, 1000);
    }
    if (chrome.runtime.lastError) {
        // Hata mesajını yoksay
    }
});


chrome.runtime.onMessage.addListener(handleMessage);


function injectBonus3Script(Code) { // Receive bonusCode as a parameter
    const inputField = document.querySelector('.input.spacing-expanded.svelte-1u979cd:not([disabled])');
    const submitButton = document.querySelector("#main-content > div > div:nth-child(2) > div > div > div > div.stack.x-flex-start.y-flex-start.gap-larger.padding-none.direction-horizontal.padding-left-auto.padding-top-auto.padding-bottom-auto.padding-right-auto.svelte-1cd1boi > div:nth-child(2) > div > div > div > section:nth-child(2) > div.section-footer.svelte-1uegh18 > button");

    if (!inputField) {
        console.log("Input field not found.");
        return; // Exit function if input field is not found
    }

    if (!submitButton) {
        console.log("Submit button not found.");
        return; // Exit function if submit button is not found
    }

    // Set the value of the input field
    inputField.value = Code;
    
    // Trigger input event manually
    inputField.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Trigger click event on the submit button
    submitButton.removeAttribute("disabled");
    submitButton.click();
    injectBonusScript();
}

function injectBonusScript() {
    const POLLING_INTERVAL = 100; // Poll every 100 ms
    const MAX_DURATION = 8000; // Total duration to check for the button
    const CLOSE_DELAY = 2000; // Delay before closing the window
    let intervalId2;
    let bonusButtonFound = false;

    const findBonusButton = () => {
        // Directly select the first button that matches, as only one exists
        const bonusButton = document.querySelector("button[type='submit'][data-test='redeem-drop']");
        
        // Check if the button is not disabled
        if (bonusButton && !bonusButton.disabled) {
            console.log('Active Bonus Button found');
            chrome.runtime.sendMessage({ type: "BonusButtonFound" }, function(response) {
                if (chrome.runtime.lastError) {
                    // Hata mesajını yoksay
                }
            });
            bonusButtonFound = true;
            clearInterval(intervalId2);
            ButtonLogic(bonusButton); // Execute logic for the found button
        }
    };
    
    // Initial check followed by repeated checks
    findBonusButton();
    intervalId2 = setInterval(findBonusButton, POLLING_INTERVAL);
    
    // Set a timeout to stop trying after a set duration
    setTimeout(() => {
        clearInterval(intervalId2);
        if (!bonusButtonFound) {
            console.log('Active Bonus Button not found, window closing in 5 sec');
            chrome.runtime.sendMessage({ type: "BonusButtonNotFound" }, function(response) {
                if (chrome.runtime.lastError) {
                    // Hata mesajını yoksay
                }
            });
            setTimeout(() => {
                window.location.replace(`https://${currentDomain}/settings/offers?app=Bonus`);
            }, CLOSE_DELAY);
        }
    }, MAX_DURATION);
}



function ButtonLogic(Bonusbutton) {
    let clickCount = 0;
    const clickInterval = setInterval(() => {
        if (clickCount < 30 && !Bonusbutton.disabled) {
            Bonusbutton.click();
            console.log('Bonus Button clicked.');
            clickCount++;
        } else {
            clearInterval(clickInterval);
            fetchNotification();
            console.log('Bonus Button clicked Done, window closing in 40 seconds');
            setTimeout(() => {
                window.location.replace(`https://${currentDomain}/settings/offers?app=Bonus`);
            }, 40000);
        }
    }, 50);
}

function fetchNotification() {
    console.log('Fetching notification started');
    const checkNotificationExist = setInterval(function() {
        const notificationContainer = document.querySelector(".notification-body");
        if (notificationContainer) {
            console.log('Bonus Notification found');
            clearInterval(checkNotificationExist);
            const BonusnotificationText = notificationContainer.innerText.replace(/\s+/g, ' ').trim();
            console.log("Note :", BonusnotificationText);
            chrome.runtime.sendMessage({ type: "BonusNotificationFound", data: "Code: " + Code + " - " + BonusnotificationText }, function(response) {
                if (chrome.runtime.lastError) {
                    // Hata mesajını yoksay
                }
            });
            setTimeout(() => {
                window.location.replace(`https://${currentDomain}/settings/offers?app=Bonus`);
            }, 4000);
        }
    }, 1500);
}

const checkNotificationExist1 = setInterval(function() {
    const warningcontainer = document.querySelector('.system-message.svelte-1myqlgz.info');
    if (warningcontainer) {
        console.log('warning found');
        clearInterval(checkNotificationExist1);
        const warningcontainerText = warningcontainer.innerText.replace(/\s+/g, ' ').trim();
        
        chrome.runtime.sendMessage({ type: "WarningFound", data: "Code: " + Code + " - " + warningcontainerText }, function(response) {
            if (chrome.runtime.lastError) {
                // Hata mesajını yoksay
            }
        });
        Code = '';

        setTimeout(() => {
            window.location.replace(`https://${currentDomain}/settings/offers?app=Bonus`);
        }, 5000);
    }
}, 1500);