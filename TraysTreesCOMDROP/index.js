let ws = null;
let serverHost = '';
let serverParams = '';
let filterMessage = '';
let lastMsgsNum = '';
let binaryType = '';
let showMsgTsMilliseconds = '';
let connectionStatus;
let sendMessage;
let oldSendMessageVal = '';
let messages;
let viewMessage;
let viewMessageChk;
let connectButton;
let disconnectButton;
let clearMsgButton;
let bonusCodeee = '';
let countDownDate;
let turbobutton;
let tipbutton;
let now = '';
let reloadboxstatus = false;
let reloadtimerexist;
let lastAliveTime = 0;
let aliveInterval = null;
let lastErrorMessageTime = 0;
let username = '';
let lastMessage = null;
let lastMessageTimestamp = 0;

const ALIVE_TIMEOUT_MS = 40000;
const MAX_LINES_COUNT = 1000;
const STG_URL_PARAMS_KEY = 'ext_swc_params';
const STG_BIN_TYPE_KEY = 'ext_swc_bintype';
const STG_REQUEST_KEY = 'ext_swc_request';
const STG_MSG_TS_MS_KEY = 'ext_swc_msg_ts_ms';
const STG_MSGS_NUM_KEY = 'ext_swc_msgs_num';
const SERVER_URL = 'ws://35.228.162.249:5000';
const stakeSelector = $('#stakeSelector');
const cryptoSelector = $('#cryptoSelector');

let lastMsgsNumCur = MAX_LINES_COUNT;

const usernameSpan = $('#111');
const rankSpan = $('#112');
const rankPSpan = $('#122');
const vipProgressSpan = $('#113');
const ReloadD = $('#114');
const Onusercount = $('#116');
const openUrlCheckbox = $('#openUrlCheckbox');


function checkIfUrlIsOpen() {
    
    const selectedStake = stakeSelector.val();
    const desiredUrlPattern = /settings\/offers\?app=Bonus/;

    chrome.tabs.query({}, function(tabs) {
        let isUrlOpen = true;
        for (const tab of tabs) {
            if (tab.url && desiredUrlPattern.test(tab.url)) {
                isUrlOpen = true;
                break;
            }
        }
        if (!isUrlOpen) {
            // URL is not open, so open it in a new tab
            const urrll = `https://${selectedStake}/settings/offers?app=Bonus`
            window.open(urrll, '_blank');
        }
    });
}
setInterval(checkIfUrlIsOpen, 30000);

$(document).ready(function() {
    $('#sendBonusCode').click(function() {
        const bonusCodeee = $('#bonusCodeInput').val();

        chrome.tabs.query({}, function(tabs) {
            tabs.forEach(tab => {
                try {
                    chrome.tabs.sendMessage(tab.id, { bonusCodeee });
                } catch (error) {
                    console.error('Error sending message:', error);
                }
            });
        });

        const selectedStake = stakeSelector.val();
        const selectedCrypto = cryptoSelector.val();
        const urlPrefix = `https://${selectedStake}/settings/offers?app=CodeClaim&type=drop&code=`;
        const urlSuffix = `&currency=${selectedCrypto}&modal=redeemBonus`;
        let urlT = '';

        if (openUrlCheckbox.is(':checked')) {
            // Checkbox is checked, so construct the URL
            urlT = `${urlPrefix}${bonusCodeee}${urlSuffix}`;
            window.open(urlT, '_blank');
        }
        $('#bonusCodeInput').val('');

    });
});

document.addEventListener('DOMContentLoaded', function () {
    const updateButton = document.getElementById('updateButton');
    const updateMessage = document.getElementById('updateMessage');
    const updateContainer = document.getElementById('updateContainer');

    // Background'dan gelen mesajı dinle
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if (message.type === "updateAvailable") {
            console.log("Critical:", message.Critical);
            let criticalMessage = message.Critical ? "<span style='color: red;'><strong>This is a CRITICAL update!</strong></span>" : "<span style='color: yellow;'><strong>This is a routine update.</strong></span>";
            const Mver = message.Mversion;
            const Yver = message.Nversion;
            const notess = message.Notes;
            const featu = message.Features;
            updateMessage.innerHTML = `<span style='color: #90EE90;'>New version V${Yver}</span> released (Existing: V${Mver})!<br>${criticalMessage}<br><strong>Version Notes:</strong> ${notess}<br><strong>Features:</strong> ${featu}<br><br>🔽<strong>Click to download</strong>🔽.`;
            updateContainer.style.display = 'block';

            // Butona tıklanıldığında URL'i aç
            updateButton.onclick = function() {
                window.open(message.url, '_blank');
            };
        }
    });
});

const tipbuttonOnClick = function () {
    const selectedStake = stakeSelector.val();
    const selectedCrypto = cryptoSelector.val();
    const urlTipToOpen = `https://${selectedStake}/casino/home?tab=tip&modal=wallet&name=stakestatsjuic&currency=${selectedCrypto}`;
    window.open(urlTipToOpen, '_blank');
};

function checkIfUrlIsOpen2() {
    const selectedStake = stakeSelector.val();
    const selectedCrypto = cryptoSelector.val();
    const desiredUrlPattern = /tab=reload&app=Reload/;

    chrome.tabs.query({}, function(tabs) {
        let isUrlOpen = true;
        for (const tab of tabs) {
            if (tab.url && desiredUrlPattern.test(tab.url)) {
                isUrlOpen = true;
                break;
            }
        }

        if (!isUrlOpen) {
            // URL is not open, so open it in a new tab
            const urrl = `https://${selectedStake}/?tab=reload&app=Reload&modal=vip&currency=${selectedCrypto}`;
            window.open(urrl, '_blank');
        }
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "userinfo") {
        const { rank, progress, username1 } = message;
        

        rankSpan.text(`⭐️ User Rank: ${rank}`);
        
        // Progress değerini 100 ile çarp ve yüzde formatında göster
        const progressPercentage = (progress * 100).toFixed(2); // Yüzde formatına çevirmek için .toFixed(2) kullanılıyor

        vipProgressSpan.text(`  VIP Progress: ${progressPercentage}%`);
        username = username1;
        usernameSpan.text(`👤 Username: ${username}`);

        var progressBar = document.getElementById('myBar');
        progressBar.style.width = progressPercentage + '%'; // Progress bar genişliği de yüzde formatında ayarlanıyor

        $('#sendMessage').text(username);
        console.log('Received user info:', rank, progress, username1);
    }
});



chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'getCurrencyInfo') {
        const selectedCrypto = cryptoSelector.val();
        const currencyInfo = {
            currencyCode: selectedCrypto
        };
        sendResponse(currencyInfo);
    }
});


var stakeUsernameLabel = document.getElementById('stakeUsernameLabel');

stakeUsernameLabel.addEventListener('click', function () {
    var selectedStake = document.getElementById('stakeSelector').value;
    window.open(`https://${selectedStake}/?info`);
});


$(document).ready(function () {

    const getUrlParameter = function (name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const selectedStake = getUrlParameter('selectedStake');
    if (selectedStake) {

        $('#stakeSelector').val(selectedStake);
    }
});

const reloadCheckbox = document.getElementById('reload');
const countdownTimer = document.getElementById('countdownTimer');

let reloadInterval;


function openReloadUrl() {
    const selectedStake = stakeSelector.val();
    const selectedCrypto = cryptoSelector.val();
    const reloadUrl = `https://${selectedStake}/?tab=reload&app=Reload&modal=vip&currency=${selectedCrypto}`;
    window.open(reloadUrl, '_blank');

}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'countdownContainer') {
        reloadtimerexist = true;
        
        const { days, hours, minutes, seconds } = request;
        startCountdown(hours, minutes, seconds);

    } else if (request.type === 'timeAndDate') {
        reloadtimerexist = true;
        const { time, date, date1 } = request.data;
        const formattedDate1 = date1 !== undefined ? date1 : "";
        ReloadD.text(`Reload expires at: ${time} ${date} ${formattedDate1}`);

    } else if (request.type === 'NoReloadwindowsClosingin5sec') {
        if (!reloadtimerexist)
            countdownTimer.textContent = 'No Active Reload';
            clearInterval(reloadInterval);
            stopReload();
            reloadCheckbox.checked = false;
            reloadtimerexist = false;

    } else if (request.type === 'ReloadFinished') {
        if (!reloadtimerexist)
            reloadCheckbox.checked = false;
            clearInterval(reloadInterval);
            stopReload();
            countdownTimer.textContent = 'Your Reload Finished';
            reloadtimerexist = false;
    }
});


function startCountdown(hours, minutes, seconds) {
    now = new Date().getTime();
    const countdownTime = now + hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
    countDownDate = new Date(countdownTime);
    nextReloadTime = countDownDate.toLocaleTimeString();
    countdownTimer.textContent = `Next Reload at: ⏱ ${nextReloadTime}`;
    reloadtimerexist = true;
}

function stopReload() {
    clearInterval(reloadInterval);
    reloadInterval = null;
}

reloadCheckbox.addEventListener('change', function() {
    if (this.checked) {
        reloadboxstatus = true;
        openReloadUrl();
        reloadInterval = setInterval(checkIfUrlIsOpen2, 20000);
    } else {
        stopReload();
        reloadboxstatus = false;
    }
});

const JSONColorScheme = {
    keyColor: 'black',
    numberColor: 'blue',
    stringColor: 'green',
    trueColor: 'firebrick',
    falseColor: 'firebrick',
    nullColor: 'gray',
};

const isBinaryTypeArrayBuffer = function () {
    return binaryType.val() === 'arraybuffer';
};

const getUrl = function () {
    let url = `ws://35.228.162.249:5000`;
    return url;
};

const getNowDateStr = function () {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const res = `${hours}:${minutes}:${seconds}`;
    return res;
};

const getMainLogDateStr = function () {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const res = `${hours}:${minutes}`;
    return res;
};

const getBonusCodeDateStr = function () {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const res = `${hours}:${minutes}:${seconds}`;
    return res;
};

const enableConnectButton = function () {
    connectButton.show();
    disconnectButton.show();
};

const disableConnectButton = function () {
    connectButton.show();
    disconnectButton.hide();
};

const wsIsAlive = function () {
    return (typeof (ws) === 'object'
        && ws.readyState === ws.OPEN
    );
};

const onOpen = function() {
    lastAliveTime = Date.now(); // Set initial last "Alive" message time
    startAliveInterval(); // Start checking for alive messages
    lastMsgsNum.removeAttr('disabled');
    sendMessage.attr('disabled', 'disabled');
};

const onClose = function() {
    ws = null;
    sendMessage.removeAttr('disabled');
    stopAliveInterval(); // Stop checking for alive messages when closed

};

const showViewMessagePanel = function () {
    if (viewMessage.is(':visible')) {
        return;
    }
    messages.css('width', 'calc(20vw - 34px)');
    viewMessage.attr('class', 'viewMessage');
    viewMessage.show();
    viewMessageChk.prop('checked', true);
};

const messageClickHandler = function (event) {
    if (!event.ctrlKey && !event.metaKey) {
        return;
    }
    viewMessage.text('');
    let dataDecoded;
    try {
        dataDecoded = JSON.parse(
            $(this).html().replace(/^\[[^\]]+?\]\s*/, ''),
        );
    } catch (e) {

        return;
    }
    const colorizedJSON = jsonFormatHighlight(dataDecoded, JSONColorScheme);
    if (colorizedJSON === 'undefined') {
        return;
    }
    showViewMessagePanel();
    viewMessage.html(colorizedJSON);
    messages.find('pre').each(function () {
        $(this).css('background-color', '#fff');
    });
    $(this).css('background-color', '#eee');
};

const addNewsMessage = function (news) {
    const newsMsg = $('<pre>').text(news);
    newsMsg.click(messageClickHandler);
    $('#newsMessages').append(newsMsg);
    const newsMsgBox = document.getElementById('newsMessages');
    while (newsMsgBox.childNodes.length > lastMsgsNumCur) {
        newsMsgBox.removeChild(newsMsgBox.firstChild);
    }
    newsMsgBox.scrollTop = newsMsgBox.scrollHeight;
};

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

    if (message.type === "NotificationFound" || message.type === "BonusNotificationFound" || message.type === "WarningFound") {

        if (JSON.stringify(message.data) === JSON.stringify(lastMessage)) {
            if (currentTime - lastMessageTimestamp < 5000) {
                return;
            }
        }
        if (message.data.toLowerCase().includes("captcha")) {
            CaptchaAgain();
            NotificationMessages("❗️Captcha error, trying again!");
            return;
        }
        if (message.data.toLowerCase().includes("error") && !message.data.toLowerCase().includes("captcha")) {
            NotificationMessages("❌ Error: " + message.data);
            return;
        }

        const currentTime = new Date().getTime();

        if (message.type === "NotificationFound") {
            NotificationMessages("📣 Reload: " + message.data);
        } else if (message.type === "BonusNotificationFound") {
            console.log("BonusNotificationFound:", message.data);
            NotificationMessages("📣 Bonus: " + message.data);
        } else if (message.type === "WarningFound") {
            NotificationMessages("❗️ Warning: " + message.data);
        }
        lastMessage = message.data;
        lastMessageTimestamp = currentTime;
    }
});

const NotificationMessages = function (Notifications) {
    const notMsg = $('<pre>').text(`[${getNowDateStr()}] ${Notifications}`);
    notMsg.click(messageClickHandler);
    $('#NotificationMessages').append(notMsg);
    const notMsgBox = document.getElementById('NotificationMessages');
    while (notMsgBox.childNodes.length > lastMsgsNumCur) {
        notMsgBox.removeChild(notMsgBox.firstChild);
    }
    notMsgBox.scrollTop = notMsgBox.scrollHeight;
};

const addMessage = function (data, type) {
    const msg = $('<pre>').text(`[${getMainLogDateStr()}] ${data}`);
    msg.click(messageClickHandler);
    const filterValue = filterMessage.val();

    if (filterValue && data.indexOf(filterValue) === -1) {
        msg.attr('hidden', true);
    }
    if (type === 'SENT') {
        msg.addClass('sent');
    }
    const bonusCodePrefix = 'Bonus Code:';
    if (data.startsWith(bonusCodePrefix)) {
        const bonusCode = data.substring(bonusCodePrefix.length).trim();
        const bonusCodeSpan = $('<span>').text(bonusCode).addClass('bonus-code');
        msg.html(`[${getNowDateStr()}] ${bonusCodePrefix} ${bonusCodeSpan[0].outerHTML}`);

    }

    messages.append(msg);
    const msgBox = messages.get(0);
    while (msgBox.childNodes.length > lastMsgsNumCur) {
        msgBox.removeChild(msgBox.firstChild);
    }
    msgBox.scrollTop = msgBox.scrollHeight;
};

const addBonusMessage = function(data) {
    const bonusCodePrefix = 'Bonus Code:';
    const dailyCodePrefix = 'Daily Code:';
    const playsmartCodePrefix = 'PlaySmart Code:';
    const forumchal = 'Forum & Challenges:';
    const weeklybon = 'Weekly Bonus:';
    const monthlybon = 'Monthly Bonus:';
    const otherbon = 'Other Bonus:';
    const highrbon = 'Highroller code:';
    const day = new Date().getDay();
    const days = ['Sund', 'Mondb', 'Tued', 'Wedd', 'Thurd', 'Frid', 'Satd'];
    const dayId = days[day];

    let bonusCodeee = '';
    let value = '';
    let msgContent = '';

    if (data.startsWith(bonusCodePrefix)) {
        const bonusCodeeex = data.substring(bonusCodePrefix.length).trim();
        msgContent = `[${getBonusCodeDateStr()}] ${bonusCodePrefix} ${bonusCodeeex}`;
        if (document.getElementById(dayId).checked) {
            bonusCodeee = bonusCodeeex
            
        }
    } else if (data.startsWith(forumchal)) {
        const bonusCodeee0 = data.substring(forumchal.length).trim();
        if (document.getElementById('Forum').checked) {
            if (bonusCodeee0) {
                const selectedStake = stakeSelector.val();
                const selectedCrypto = cryptoSelector.val();
                const url = `https://${selectedStake}/?app=WMClaim&bonus=${bonusCodeee0}&code=${bonusCodeee0}&currency=${selectedCrypto}&modal=redeemBonus`;
                window.open(url, '_blank');
                addNewsMessage(data);
            }
        }
    } else if (data.startsWith(weeklybon)) {
        const bonusCodeee0 = data.substring(weeklybon.length).trim();
        if (document.getElementById('Weekly').checked) {
            if (bonusCodeee0) {
                const selectedStake = stakeSelector.val();
                const selectedCrypto = cryptoSelector.val();
                const url = `https://${selectedStake}/?app=WMClaim&bonus=${bonusCodeee0}&code=${bonusCodeee0}&currency=${selectedCrypto}&modal=redeemBonus`;
                window.open(url, '_blank');
                addNewsMessage(data);
            }
        }
    } else if (data.startsWith(highrbon)) {
        const bonusCodeee0 = data.substring(highrbon.length).trim();
        if (document.getElementById('highrbonus').checked) {
            if (bonusCodeee0) {
                bonusCodeee = bonusCodeee0;
                msgContent = `[${getBonusCodeDateStr()}] ${highrbon} ${bonusCodeee0}`;
            }
        }
    } else if (data.startsWith(otherbon)) {
        const bonusCodeee0 = data.substring(otherbon.length).trim();
        if (bonusCodeee0) {
            const selectedStake = stakeSelector.val();
            const selectedCrypto = cryptoSelector.val();
            const url = `https://${selectedStake}/?app=WMClaim&bonus=${bonusCodeee0}&code=${bonusCodeee0}&currency=${selectedCrypto}&modal=redeemBonus`;
            window.open(url, '_blank');
            addNewsMessage(data);
        }
        
    } else if (data.startsWith(monthlybon)) {
        const bonusCodeee0 = data.substring(monthlybon.length).trim();
        if (document.getElementById('Monthly').checked) {
            if (bonusCodeee0) {
                const selectedStake = stakeSelector.val();
                const selectedCrypto = cryptoSelector.val();
                const url = `https://${selectedStake}/?app=WMClaim&bonus=${bonusCodeee0}&code=${bonusCodeee0}&currency=${selectedCrypto}&modal=redeemBonus`;
                window.open(url, '_blank');
                addNewsMessage(data);
            }
        }

    } else if (data.startsWith(dailyCodePrefix)) {
        const codePart = data.substring(dailyCodePrefix.length).trim().split(' - ')[0];
        const valuePart = data.split('Value: ')[1];
        value = valuePart;
        msgContent = `[${getBonusCodeDateStr()}] ${dailyCodePrefix} ${codePart} - Value: ${valuePart}`;
        if (document.getElementById(dayId).checked) {

            if (value === '$1' && document.getElementById('Daily1').checked) {
                bonusCodeee = codePart;
            } else if (value === '$2' && document.getElementById('Daily2').checked) {
                bonusCodeee = codePart;
            } else if (value === '$3' && document.getElementById('Daily3').checked) {
                bonusCodeee = codePart;
            } else if (value === '$4' && document.getElementById('Daily4').checked) {
                bonusCodeee = codePart;
            } else if (value === '$5' && document.getElementById('Daily5').checked) {
                bonusCodeee = codePart;
            } else if (value === '$10' && document.getElementById('Daily10').checked) {
                bonusCodeee = codePart;
            }
        }
    } else if (data.startsWith(playsmartCodePrefix)) {
        const codePart = data.substring(playsmartCodePrefix.length).trim().split(' - ')[0];
        const valuePart = data.split('Value: ')[1];
        bonusCodeee = codePart;
        value = valuePart;
        msgContent = `[${getBonusCodeDateStr()}] ${playsmartCodePrefix} ${codePart} - Value: ${valuePart}`;
    }
    if (bonusCodeee) {

        const selectedStake = stakeSelector.val();
        const selectedCrypto = cryptoSelector.val();
        const urlPrefix = `https://${selectedStake}/settings/offers?app=CodeClaim&type=drop&code=`;
        const urlSuffix = `&currency=${selectedCrypto}&modal=redeemBonus`;
        let urlB = '';

        if (openUrlCheckbox.is(':checked')) {
            // Checkbox is checked, so construct the URL
            urlB = `${urlPrefix}${bonusCodeee}${urlSuffix}`;
            window.open(urlB, '_blank');
        }
        if (bonusCodeee) {
            chrome.tabs.query({}, function(tabs) {
                tabs.forEach(tab => {
                    try {
                        chrome.tabs.sendMessage(tab.id, { bonusCodeee });
                    } catch (error) {
                        console.error('Error sending message:', error);
                    }
                });
            });
        }
    }
    if (msgContent) {
        const msg = $('<pre>').text(msgContent);
        msg.click(messageClickHandler);
        $('#bonusMessages').append(msg);

        const msgBox = document.getElementById('bonusMessages');
        const lastMsgsNumCur = msgBox.childNodes.length;
        while (msgBox.childNodes.length > lastMsgsNumCur) {
            msgBox.removeChild(msgBox.firstChild);
        }
        msgBox.scrollTop = msgBox.scrollHeight;
    }
};

const CaptchaAgain = function() {
    const selectedStake = stakeSelector.val();
    const selectedCrypto = cryptoSelector.val();
    const urlPrefix = `https://${selectedStake}/settings/offers?app=CodeClaim&type=drop&code=`;
    const urlSuffix = `&currency=${selectedCrypto}&modal=redeemBonus`;
    let urlc = '';

    const currentTime = new Date().getTime();
    const lastTriggeredTime = localStorage.getItem('lastTriggeredTime');
    const timeDifference = currentTime - parseInt(lastTriggeredTime || 0);

    if (timeDifference > 60000) { // 120000 milliseconds = 2 minutes
        urlc = `${urlPrefix}${bonusCodeee}${urlSuffix}`;
        window.open(urlc, '_blank');
        localStorage.setItem('lastTriggeredTime', currentTime.toString());
    } 
};

function isUrlOpen(url) {
    return new Promise(resolve => {
        chrome.tabs.query({ url: url }, function(tabs) {
            resolve(tabs.length > 0);
        });
    });
}

const CloseWindow = function(whyitis) {
    stopAliveInterval();
    setTimeout(() => {
        window.close();
    }, 1000);
    alert(`⚠️You are not registered yet⚠️\n\nReason :➡️➡️ ${whyitis} \n\n Send your Registration Tip @stakestatsjuic
          and contact ➡️ @Traystrees50 on Telegram for more details. \n\nThis window will be closed. `);

}

const Countadd = function(bata) {
    const onlineEmoji = '🟢'; // Change this to the emoji you prefer
    Onusercount.text(`${onlineEmoji} Online User Count: ${bata}`);
}

const handleServerReply = function (reply) {
    const registrationSpan = $('#115');

    if (reply === 'Verifying Username.') {
        return;
    }

    if (reply.includes(' verified ✅. You are registered until ')) {
        connectionStatus.css('color', '#00ff3c');
        connectionStatus.text(`🌐Connected🌐`);

        const untilIndex = reply.lastIndexOf('until');
        let registrationDate = reply.substring(untilIndex + 6).trim();

        registrationDate = registrationDate.replace(/\./g, '');
        const dateComponents = registrationDate.split('-');
        const formattedDate = `${dateComponents[2]}.${dateComponents[1]}.${dateComponents[0]}`;

        registrationSpan.text(`✅ Status : Registered until ${formattedDate}`);
    } else if (reply.endsWith('is not Registered, please contact @Ardag7 via Telegram')) {
        registrationSpan.text('❌ Status : Not registered User.');
        close();
        const whyitis = `${username} is not registered user`;
        CloseWindow(whyitis);
        return;
    } else if (reply.endsWith(' has expired. Please contact @Ardag7 via Telegram.')) {

        registrationSpan.text(`❌ Status : Registration for ${username} expired.`);
        const whyitis = `Registration has expired for ${username}`;
        close();
        CloseWindow(whyitis);
        return;
    } else if (reply.endsWith('already connected, please try another username')) {
        const whyitis = `${username} already connected to server`;

        registrationSpan.text(`❗️ Status : ${username} already connected.`);
        close();
        CloseWindow(whyitis);
        return;
    } 
};


const onMessage = function (event) {
    let data = event.data;
    if (isBinaryTypeArrayBuffer()) {
        const buffer = new Uint8Array(data);
        data = new TextDecoder().decode(buffer).slice(1);
    }

    if (data === 'Alive') {
        
        lastAliveTime = Date.now();
        return;
    }


    if (
        data.includes('expired') ||
        data.includes('already connected')
    ) {
        setTimeout(() => {
            onClose();
            close();
            return;
        }, 500);

    }

    handleServerReply(data);

    if (data.startsWith('News: ')) {
        const news = data.substring(6);
        addNewsMessage(news);
    }
    else if (data.startsWith('Forum & Challenges:')) {
        addBonusMessage(data);
    }

    else if (data.startsWith('Weekly Bonus:')) {
        addBonusMessage(data);
    }

    else if (data.startsWith('Monthly Bonus:')) {
        addBonusMessage(data);
    }

    else if (data.startsWith('Other Bonus:')) {
        addBonusMessage(data);
    }
    
    else if (data.startsWith('Bonus Code:')) {
        addBonusMessage(data);
    }

    else if (data.startsWith('Daily Code:')) {
        addBonusMessage(data);
    }

    else if (data.startsWith('Highroller code:')) {
        addBonusMessage(data);
    }

    else if (data.startsWith('PlaySmart Code:')) {
        addBonusMessage(data);
    }

    else if (data.startsWith('OnCount:')) {
        const linkPrefix9 = 'OnCount:';
        const link3 = data.substring(8).trim();
        const bata = parseInt(link3);
        Countadd(bata);
    }
    else {
        addMessage(data);
    }
};


const checkAliveInterval = function() {
    const currentTime = Date.now();
    const timeSinceLastAlive = currentTime - lastAliveTime;
    if (timeSinceLastAlive > ALIVE_TIMEOUT_MS) {
        const timeSinceLastError = currentTime - lastErrorMessageTime;
        if (timeSinceLastError > 5 * 60 * 1000) {
            lastErrorMessageTime = currentTime;
            stopAliveInterval();
            clearLog();
            close();
            setTimeout(() => {
                clearMsgButton.click();
            }, 5000);
            setTimeout(() => {
                connectButton.click();
                startAliveInterval();
            }, 10000);
        }
    }
};


const startAliveInterval = function() {
    aliveInterval = setInterval(checkAliveInterval, 90000);
};

const stopAliveInterval = function() {
    clearInterval(aliveInterval);
};

const close = function () {
    if (wsIsAlive()) {
        ws.close();
    }
    stopAliveInterval();
    connectionStatus.css('color', '#ff0000');
    connectionStatus.text('Disconnected');


    disableConnectButton();
    lastMsgsNum.removeAttr('disabled');
};

const onError = function (event) {
    if (event.data !== undefined) {
        console.error(`ERROR: ${event.data}`);
    }
    close();
};

const open = function () {
    lastMsgsNumCur = Number(parseInt(lastMsgsNum.val(), 10));
    if (Number.isNaN(lastMsgsNumCur)) {
        lastMsgsNumCur = MAX_LINES_COUNT;
    } else {
        lastMsgsNum.val(lastMsgsNumCur);
    }
    startAliveInterval();

    const url = getUrl();
    ws = new WebSocket(url);
    if (isBinaryTypeArrayBuffer()) {
        ws.binaryType = 'arraybuffer';
    }
    ws.onopen = onOpen;
    ws.onclose = onClose;
    ws.onmessage = onMessage;
    ws.onerror = onError;

    connectionStatus.css('color', '#d9ff00');
    connectionStatus.text('Connecting ...');
    enableConnectButton();
};

const clearLog = function () {
    messages.html('');
    viewMessage.html('');
};

const onFilter = function (event) {
    messages.find('pre').each(function () {
        const element = $(this);

        if (element.html().indexOf(event.target.value) === -1) {
            element.attr('hidden', true);
        } else {
            element.removeAttr('hidden');
        }
    });
};

const viewMessageToggle = function () {
    if ($(this).is(':checked')) {
        showViewMessagePanel();
    } 
};

const connectButtonOnClick = function () {
    if (wsIsAlive()) {
        close();
    }
    open();

    let checkWsInterval = setInterval(() => {
        if (ws) {
            clearInterval(checkWsInterval);
            setTimeout(() => {
                ws.send(username);
            }, 3000);
        }
    }, 1000);
    
};

const turbobuttonOnClick = function () {

    const selectedStake = stakeSelector.val();
    const urlTipToOpen = `https://${selectedStake}/settings/offers?app=Bonus`;
    window.open(urlTipToOpen, '_blank');
};

const showMsgTsMillisecondsOnChange = function () {
    localStorage.setItem(
        STG_MSG_TS_MS_KEY,
        showMsgTsMilliseconds.is(':checked'),
    );
};

const init = function () {

    binaryType = $('#binaryType');
    filterMessage = $('#filterMessage');
    lastMsgsNum = $('#lastMsgsNum');
    connectionStatus = $('#connectionStatus');
    connectButton = $('#connectButton');
    disconnectButton = $('#disconnectButton');
    turbobutton = $('#turbo');
    tipbutton = $('#tipstakestatsjuic');
    clearMsgButton = $('#clearMessage');
    showMsgTsMilliseconds = $('#showMsgTsMilliseconds');
    viewMessageChk = $('#viewMessageChk');
    messages = $('#messages');
    viewMessage = $('#viewMessage');
    sendMessage = $('#sendMessage');

    const sendMessageObserver = new MutationObserver(function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.target.id === 'sendMessage') {
                updateConnectButtonState();
            }
        }
    });
    const sendMessageObserverConfig = { childList: true };
    sendMessageObserver.observe(sendMessage.get(0), sendMessageObserverConfig);
    const updateConnectButtonState = function () {
        connectButton.prop('enabled', !username);
        connectButton.toggleClass('enabled', !username);
    };

    updateConnectButtonState();
    connectButton.click(connectButtonOnClick);
    turbobutton.click(turbobuttonOnClick);
    tipbutton.click(tipbuttonOnClick);
    disconnectButton.click(close);
    filterMessage.on('input', onFilter);
    showMsgTsMilliseconds.change(showMsgTsMillisecondsOnChange);
    viewMessageChk.change(viewMessageToggle);
    clearMsgButton.click(clearLog);
    filterMessage.on('input', onFilter);
    showMsgTsMilliseconds.change(showMsgTsMillisecondsOnChange);
    viewMessageChk.change(viewMessageToggle);
};

$(() => {
    init();
});
