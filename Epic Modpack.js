alert("Epic Modpack loaded!")

var epicModpack = {
  clientVersion : 0,
  firstCheck : false,
  showUpdate : true,
  updateChecks : 0
}
window.epicModpack = epicModpack;

function fetchVersion() {
  fetch("https://raw.githubusercontent.com/Epic43110/Epic-Modpack/main/version.txt", {mode: "cors"})
    .then((response) => response.text())
    .then((text) => {
      epicModpack.updateChecks += 1;
      text = Number(text.replaceAll('\n', ''));
      if (epicModpack.firstCheck) {
        epicModpack.clientVersion = text;
        if (localStorage.epicVersion) {
          localStorage.epicVersion = epicModpack.clientVersion;
        }
        epicModpack.firstCheck = false;
        return;
      }

      if (epicModpack.clientVersion < text && epicModpack.showUpdate) {
        epicModpack.showUpdate = false;
        if (confirm("Update required for Epic Modpack!\n\nModpack will update next time you open BetterMope.\nWould you like to update right now? (This will refresh your page)")) {
          localStorage.epicVersion = text;
          location.reload();
        }
      }
    })
}

setInterval(fetchVersion, 5000)
