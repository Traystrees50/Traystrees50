let domain = '';

function extractAndSendUserInfo() {
    setTimeout(() => {
        chrome.runtime.sendMessage({ type: 'GetSessionCookie' }, function(response) {
            if (response && response.value) {
                domain = window.location.hostname;
                sendGraphQLRequest(response.value, domain);
            } 
        });
    }, 500);
}

document.addEventListener('DOMContentLoaded', extractAndSendUserInfo);
extractAndSendUserInfo();

let wager = '';
let progress = '';
let username1 = '';
let rank = 'NoRank';

function sendGraphQLRequest(token, domain) {
    fetch("https://" + domain + "/_api/graphql", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7",
            "access-control-allow-origin": "*",
            "content-type": "application/json",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
            "sec-ch-ua-arch": "\"x86\"",
            "sec-ch-ua-bitness": "\"64\"",
            "sec-ch-ua-full-version": "\"126.0.6478.63\"",
            "sec-ch-ua-full-version-list": "\"Not/A)Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"126.0.6478.63\", \"Google Chrome\";v=\"126.0.6478.63\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-model": "\"\"",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-ch-ua-platform-version": "\"15.0.0\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-access-token": token,
            "x-language": "en"
        },
        "referrer": "https://" + domain + "/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "{\"query\":\"query UserMeta($name: String, $signupCode: Boolean = false) {\\n  user(name: $name) {\\n    id\\n    name\\n    isMuted\\n    isRainproof\\n    isBanned\\n    createdAt\\n    campaignSet\\n    selfExclude {\\n      id\\n      status\\n      active\\n      createdAt\\n      expireAt\\n    }\\n    signupCode @include(if: $signupCode) {\\n      id\\n      code {\\n        id\\n        code\\n      }\\n    }\\n  }\\n}\\n\",\"variables\":{\"signupCode\":true}}",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.data && data.data.user && data.data.user.name) {
            username1 = data.data.user.name;
            console.log('username:', username1);
        } else {
            console.log('Name not found in the response');
        }
    })
    .catch(error => {
        console.error('GraphQL Request Failed:', error);
    });

    fetch("https://" + domain + "/_api/graphql", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7",
            "access-control-allow-origin": "*",
            "content-type": "application/json",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
            "sec-ch-ua-arch": "\"x86\"",
            "sec-ch-ua-bitness": "\"64\"",
            "sec-ch-ua-full-version": "\"126.0.6478.63\"",
            "sec-ch-ua-full-version-list": "\"Not/A)Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"126.0.6478.63\", \"Google Chrome\";v=\"126.0.6478.63\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-model": "\"\"",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-ch-ua-platform-version": "\"15.0.0\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-access-token": token,
            "x-language": "en"
        },
        "referrer": "https://" + domain + "/?tab=progress&modal=vip",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "{\"query\":\"query VipProgressMeta {\\n  user {\\n    id\\n    flagProgress {\\n      flag\\n      progress\\n    }\\n  }\\n}\\n\",\"variables\":{}}",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.data && data.data.user && data.data.user.flagProgress) {
            wager = data.data.user.flagProgress.flag || 'NoRank';
            progress = data.data.user.flagProgress.progress || 0;

            if (wager === 'bronze') {
                rank = 'Bronze';
            } else if (wager === 'silver') {
                rank = 'Silver';
            } else if (wager === 'gold') {
                rank = 'Gold';
            } else if (wager === 'platinum') {
                rank = 'Platinum 1';
            } else if (wager === 'wagered(500k)') {
                rank = 'Platinum 2';
            } else if (wager === 'wagered(1m)') {
                rank = 'Platinum 3';
            } else if (wager === 'wagered(2.5m)') {
                rank = 'Platinum 4';
            } else if (wager === 'wagered(5m)') {
                rank = 'Platinum 5';
            } else if (wager === 'wagered(10m)') {
                rank = 'Platinum 6';
            } else {
                rank = 'NoRank';
            }

            console.log('wager:', wager);
            console.log('progress:', progress);
        } else {
            rank = 'NoRank';
            progress = 0;
        }

        if (username1) {
            chrome.runtime.sendMessage({ type: "userinfo", rank, progress, username1 });
            setTimeout(() => {
                window.close();
            }, 500);
        } else {
            setTimeout(() => {
                chrome.runtime.sendMessage({ type: "userinfo", rank, progress, username1 });
                setTimeout(() => {
                    window.close();
                }, 500);
            }, 2000);
        }
    })
    .catch(error => {
        console.error('GraphQL Request Failed:', error);
        rank = 'NoRank';
        progress = 0;
        chrome.runtime.sendMessage({ type: "userinfo", rank, progress, username1 });
    });
}
