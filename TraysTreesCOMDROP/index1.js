$(document).ready(function() {
    const startButton = $('#startButton');
    startButton.click(function() {
        const selectedStake = $('#stakeSelector').val();
        chrome.runtime.sendMessage({ type: 'startFetchingCookies', domain: selectedStake }, function(response) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
            } else {
                console.log('Background script responded:', response);
            }
        });
        const mainUrl = `index.html?selectedStake=${selectedStake}`;
        const infoUrl = `https://${selectedStake}/?info`;
        window.close();
        window.open(infoUrl, '_blank');
        window.open(mainUrl, '_blank');
    });
});
