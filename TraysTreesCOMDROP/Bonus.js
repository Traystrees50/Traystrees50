let intervalId2;
let Code = '';

function extractBonusCodeFromURL() {
    console.log("extractBonusCodeFromURL çalıştı");
    const urlParams = new URLSearchParams(window.location.search);
    Code = urlParams.get('code');
    console.log("Code extracted from URL:", Code);
    injectBonusScript();
    return Code;
}
extractBonusCodeFromURL();

function injectBonusScript() {
    console.log("injectBonusScript çalıştı");
    chrome.runtime.sendMessage({ type: "Done" }, function(response) {
        if (chrome.runtime.lastError) {
            // Hata mesajını yoksay
        }
    });
    let activeButton = null;
    let attempts = 0;
    const maxAttempts = 200;

    const checkActiveButton = () => {
        const bonusButtons = document.querySelectorAll("button[type='submit'][data-test='redeem-bonus'], button[type='submit'][data-test='redeem-drop'], button[type='submit'][data-test='redeem-promo']");
        
        if (bonusButtons.length > 0) {
            for (const button of bonusButtons) {
                if (!button.disabled) {
                    activeButton = button;
                    break;
                }
            }
        }

        if (activeButton) {
            ButtonLogic(activeButton);
            clearInterval(intervalId2);
            console.log('Active Bonus Button found');
            chrome.runtime.sendMessage({ type: "BonusButtonfound" }, function(response) {
                if (chrome.runtime.lastError) {
                    // Hata mesajını yoksay
                }
            });
        } else {
            attempts++;
            if (attempts >= maxAttempts) {
                chrome.runtime.sendMessage({ type: "BonusButtonnotfound" }, function(response) {
                    if (chrome.runtime.lastError) {
                        // Hata mesajını yoksay
                    }
                });
                Code = '';
                console.log('No active Bonus Button found, window closing in 10 seconds');
                setTimeout(() => {
                    window.close();
                }, 10000);
                clearInterval(intervalId2);
            }
        }
    };

    checkActiveButton();
    intervalId2 = setInterval(checkActiveButton, 50);
}

function ButtonLogic(activeButton) {
    let clickCount = 0;
    const clickInterval = setInterval(() => {
        if (clickCount < 10) {
            activeButton.click();
            console.log('Active Bonus Button clicked.');
            clickCount++;
        } else {
            fetchNotification();
            clearInterval(clickInterval);
            console.log('Active Bonus Button clicked 10 times, window closing in 40 seconds');
            setTimeout(() => {
                window.close();
            }, 40000);
        }
    }, 100);
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
            chrome.runtime.sendMessage({ 
                type: "BonusNotificationFound", 
                data: "Code: " + Code + " - " + BonusnotificationText 
            }, function(response) {
                if (chrome.runtime.lastError) {
                    // Hata mesajını yoksay
                }
            });
            Code = '';
            setTimeout(() => {
                window.close();
            }, 3000);
        }
    }, 1500);
}

const checkNotificationExist1 = setInterval(function() {
    const warningcontainer = document.querySelector('.system-message.svelte-1myqlgz.info');
    if (warningcontainer) {
        console.log('warning found');
        clearInterval(checkNotificationExist1);
        const warningcontainerText = warningcontainer.innerText.replace(/\s+/g, ' ').trim();
        
        chrome.runtime.sendMessage({ 
            type: "WarningFound", 
            data: "Code: " + Code + " - " + warningcontainerText 
        }, function(response) {
            if (chrome.runtime.lastError) {
                // Hata mesajını yoksay
            }
        });
        Code = '';
        setTimeout(() => {
            window.close();
        }, 3000);
    }
}, 1500);
