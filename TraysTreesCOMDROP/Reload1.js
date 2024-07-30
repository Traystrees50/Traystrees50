let tabbuttonFound = false;
let PtabbuttonFound = false;
let ReloadbuttonFound = false;
let yolla = true;
let countdownInterval;
let reloadInProgress = false;
let countdownStopped = false;

function findReloadTab() {
    console.log('findReloadTab triggered');
    const reloadTab = document.querySelector('button[data-dd-action-name="vip-reload-tab"]');
    if (reloadTab) {
        console.log('Reload Tab found');
        tabbuttonFound = true;
        ButtonLogic();
    } else {
        console.log('Progress Tab found but Reload Tab not found, window closing in 2 sec!!!!!!!!!!');
        chrome.runtime.sendMessage({ type: "NoReloadwindowsClosingin5sec" }, function(response) {
            if (chrome.runtime.lastError) {
                // Hata mesajını yoksay
            }
        });
        ReloadbuttonFound = false;
        PtabbuttonFound = false;
        setTimeout(() => {
            window.close();
        }, 3000);
    }
}

function ButtonLogic() {
    if (reloadInProgress) {
        console.log('Reload already in progress. Waiting...');
        return;
    }

    console.log('inject started for Button logic');
    const reloadButton = document.querySelector('[data-dd-action-name="claim-reload"]');
    if (reloadButton) {
        console.log('Reload Button found');
        reloadButton.focus(); // Buttona tıklamadan önce focuslanıyoruz
        ReloadbuttonFound = true;
        if (reloadButton.disabled) {
            console.log('Reload Button found but not active.');
            setTimeout(() => {
                countdownInterval = setInterval(fetchCountdownAndReload, 1100);
            }, 10000);
        } else {
            console.log('Reload Button found and active.');
            setTimeout(() => {
                reloadButton.click();
                console.log('Reload Button clicked.');
                reloadInProgress = true;
                setTimeout(() => {
                    yolla = true;
                    reloadInProgress = false; // Reset flag after reload process
                    countdownStopped = false; // Allow countdown fetching after reload process
                    setTimeout(() => {
                        countdownInterval = setInterval(fetchCountdownAndReload, 1100);
                    }, 10000);
                }, 20000);
            }, 500); // Click işlemini gerçekleştirmeden önce 500ms bekle
        }
    } else {
        console.log('Button not found, it will try again');
        setTimeout(() => {
            ButtonLogic();
        }, 1000);
    }
}

function fetchCountdownAndReload() {
    if (countdownStopped) {
        return;
    }

    let days, hours, minutes, seconds;
    console.log('Fetching countdown for auto-reload');
    const countdownContainer = document.querySelector(".timer");
    if (countdownContainer) {
        const countdownItems = countdownContainer.querySelectorAll('.item');
        countdownItems.forEach((item, index) => {
            const valueElement = item.querySelector('.digits');
            const value = parseInt(valueElement.innerText.trim());
            switch (index) {
                case 0:
                    if (!isNaN(value)) {
                        days = value;
                    }
                    break;
                case 1:
                    if (!isNaN(value)) {
                        hours = value;
                    }
                    break;
                case 2:
                    if (!isNaN(value)) {
                        minutes = value;
                    }
                    break;
                case 3:
                    if (!isNaN(value)) {
                        seconds = value;
                    }
                    break;
                default:
                    break;
            }
        });

        const remainingTime = seconds + minutes * 60 + hours * 3600;
        console.log('Remaining time:', `${hours} hours ${minutes} minutes ${seconds} seconds`);

        if (days !== undefined && hours !== undefined && minutes !== undefined && seconds !== undefined) {
            if (yolla) {
                console.log('Countdown sent');
                chrome.runtime.sendMessage({ type: "CountDFoundandsent" }, function(response) {
                    if (chrome.runtime.lastError) {
                        // Hata mesajını yoksay
                    }
                });
                chrome.runtime.sendMessage({
                    type: "countdownContainer",
                    days: days,
                    hours: hours,
                    minutes: minutes,
                    seconds: seconds
                });
                if (seconds > 0) {
                    yolla = false;
                }
            }
        } else {
            findReloadTab();
        }

        if (remainingTime === 30) {
            console.log('Last 30 sec, refreshing page');
            yolla = true;
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
        if (remainingTime === 0) {
            console.log('Countdown reached 0, button logic will start');
            yolla = false;
            countdownStopped = true; // Stop countdown fetching for a minute
            setTimeout(() => {
                countdownStopped = false; // Allow countdown fetching again after a minute
            }, 30000);
            setTimeout(() => {
                ButtonLogic();
            }, 2000);
        }
    } else {
        console.log('Countdown container not found, re trying');
        findReloadTab();
    }
}

function fetchNotification() {
    console.log('Fetching notification started');
    const checkNotificationExist = setInterval(function () {
        const notificationContainer = document.querySelector("div > div > div > div.notification-body.svelte-tm583l > span");
        if (notificationContainer) {
            console.log('Notification found');
            clearInterval(checkNotificationExist); // Notification bulunduğunda interval durdurulur
            const notificationText = notificationContainer.innerText.replace(/\s+/g, ' ').trim();
            chrome.runtime.sendMessage({ type: "NotificationFound", data: notificationText }, function (response) {
                if (chrome.runtime.lastError) {
                    // Hata mesajını yoksay
                }
            });
        }
    }, 1000); // Kontrol aralığını 1 saniye olarak belirledik
}

console.log('Script started executing');

window.addEventListener('load', () => {
    findProgressTab();
});

function findProgressTab() {
    const progressTab = document.querySelector('button[data-dd-action-name="vip-progress-tab"]');
    if (progressTab) {
        console.log('Progress Tab found');
        PtabbuttonFound = true;
        findReloadTab();
    } else {
        setTimeout(() => {
            findProgressTab();
        }, 1000);
    }
}
