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
            var info = data.info;
            if (epicModpack.firstCheck) {
                epicModpack.clientVersion = liveVersion;
                if (localStorage.epicVersion && localStorage.epicVersion != liveVersion) {
                    localStorage.epicVersion = liveVersion;
                    alert(`Epic Modpack updated while you were gone!\n\nUpdate Version: ${liveVersion}\nUpdate Sent: ${lastUpdate}\nUpdate Recieved: ${new Date}\nUpdate info: ${info}`)
                } else {
                    localStorage.epicVersion = liveVersion;
                }
                localStorage.epicVersion = epicModpack.clientVersion;
                epicModpack.firstCheck = false;
            }

            if (epicModpack.clientVersion != liveVersion && epicModpack.showUpdate) {
                epicModpack.showUpdate = false;
                if (confirm(`Update required for Epic Modpack!\n\nUpdate Version: ${liveVersion}\nUpdate Sent: ${lastUpdate}\nUpdate Recieved: ${new Date}\nUpdate info: ${info}\n\nModpack will update next time you open BetterMope.\nWould you like to update right now? (This will refresh your page)`)) {
                    localStorage.epicVersion = liveVersion;
                    location.reload();
                }
            }
        })
}
setInterval(fetchVersion, 5000);

alert('Sorry for the inconvenience! Epic Modpack is currently updating!')