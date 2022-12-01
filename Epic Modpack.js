alert("Epic Modpack loaded!")

function fetchVersion() {
  fetch("https://raw.githubusercontent.com/Epic43110/Epic-Modpack/main/version.txt", {mode: "cors"})
    .then((response) => response.text())
    .then((text) => return(text))
}

var clientVersion = fetchVersion();

if (localStorage.epicVersion != clientVersion) {
  localStorage.epicVersion = clientVersion
}

setInterval(function() {
  var newVersion = fetchVersion();
  if (clientVersion < newVersion) {
    if (confirm("New Update for Epic Modpack!\n\nModpack will update next time you open BetterMope.\nWould you like to update right now? (This will refresh your page)")) {
      localStorage.epicVersion = newVersion;
      location.reload();
  }
}, 5000)
