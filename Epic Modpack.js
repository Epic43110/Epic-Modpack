var epicModpack = {
    clientVersion: 6.2,
    firstCheck: true,
    showUpdate: true
}
window.epicModpack = epicModpack;

function fetchVersion() {
    fetch(`https://raw.githubusercontent.com/Epic43110/Epic-Modpack/main/version.json?x=${+new Date}`, {mode: "cors"})
        .then((response) => response.text())
        .then((data) => {
            data = JSON.parse(data)
            var liveVersion = data.version;
            var info = data.info;

            localStorage.epicUpdating = localStorage.epicUpdating ?? "false";

            if (JSON.parse(localStorage.epicUpdating) && epicModpack.clientVersion != liveVersion) {
                setTimeout("location.reload();", 10000);
                clearInterval(checkUpdate);
                alert("Trying to fetch update.. Reloading in 10 seconds");
                return;
            }

            if (epicModpack.firstCheck) {
                if (localStorage.epicVersion != epicModpack.clientVersion) {
                    localStorage.epicUpdating = false;
                    alert(`Epic Modpack updated successfully!\n\nUpdate info: ${info}\nUpdate Version: ${liveVersion}`);
                }
                localStorage.epicVersion = epicModpack.clientVersion;
                epicModpack.firstCheck = false;
            } else if (epicModpack.clientVersion != liveVersion && epicModpack.showUpdate) {
                epicModpack.showUpdate = false;
                if (confirm(`Update required for Epic Modpack!\n\nUpdate info: ${info}\nUpdate Version: ${liveVersion}\n\nModpack will update next time you open BetterMope.\nWould you like to update right now? (This will refresh your page)`)) {
                    localStorage.epicUpdating = true;
                    location.reload();
                }
            }
        })
}

window.checkUpdate = setInterval(fetchVersion, 5000);

if (localStorage.epictester == "lol") {
    alert("No test version found!\nDisabling Testing mode!");
    localStorage.removeItem('epictester');
}

alert("Epic modpack is currently offline!\nIt will come back very soon!\nCheck my discord server for progress updates.\nhttps://discord.gg/SHxwnYuxwK")