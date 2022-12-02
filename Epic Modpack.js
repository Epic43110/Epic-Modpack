alert("Epic Modpack loaded!")

var epicModpack = {
    clientVersion: 0,
    firstCheck: true,
    showUpdate: true,
    updateChecks: 0
}
window.epicModpack = epicModpack;

function fetchVersion() {
    fetch("https://raw.githubusercontent.com/Epic43110/Epic-Modpack/main/version.json", {mode: "cors"})
        .then((response) => response.text())
        .then((data) => {
            epicModpack.updateChecks += 1;
            data = JSON.parse(data)
            var liveVersion = data.version;
            var lastUpdate = data.lastUpdated;
            if (epicModpack.firstCheck) {
                epicModpack.clientVersion = liveVersion;
                localStorage.epicVersion = epicModpack.clientVersion;
                epicModpack.firstCheck = false;
            }

            if (epicModpack.clientVersion != liveVersion && epicModpack.showUpdate) {
                epicModpack.showUpdate = false;
                if (confirm(`Update required for Epic Modpack!\n(Update: Version ${liveVersion} on ${lastUpdate})\n\nModpack will update next time you open BetterMope.\nWould you like to update right now? (This will refresh your page)`)) {
                    localStorage.epicVersion = liveVersion;
                    location.reload();
                }
            }
        })
}

setInterval(fetchVersion, 5000)
