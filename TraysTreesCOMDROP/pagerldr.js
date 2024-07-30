let currentDomain1;
currentDomain1 = window.location.hostname;
console.log("Current Domain:", currentDomain1);
Refreash(currentDomain1);

function Refreash(currentDomain1) {
  setInterval(function() {
    window.location.replace(`https://${currentDomain1}/settings/offers?app=Bonus`)
  }, 3600000)
}