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

if (localStorage.tester == "epic123") {
    alert("Running Test Version!");
    if (location.hostname != "bettermope.io") {
        alert("Epic Modpack - Redirecting to https://bettermope.io/");
        location.href = "https://bettermope.io/";
        IGNORE_THIS; //Forces an error, causing the rest of the modpack to not load.
    }
    
    var observer = new MutationObserver(onMutation);
    observer.observe(document, {
        childList: true,
        subtree: true
    });
    
    function onMutation(mutations) {
        mutations.forEach(m => {
            [...m.addedNodes]
                .filter(node =>
                        node.localName === 'script' && /hcaptcha|client|config/.test(node.src))
                .forEach(h1 => {
                h1.src = "";
            });
        });
    }
    
    function importScript(type, script) {
        var s = document.createElement('script');
        switch (type) {
            case 0:
                s.src = script;
                break;
            case 1:
                s.innerHTML = script;
                break;
        }
        document.head.appendChild(s);
    }
    
    function wait() {
        if (typeof hcaptcha == 'undefined') return setTimeout(wait, 10);
        try {
            loadedCaptcha();
            GameConfig;
        } catch (err) {
            location.reload();
        }
    }
    
    fetch(`client.js?x=${+new Date()}`)
        .then(res => {return res.text()})
        .then(res => {
        res = res.replaceAll('const ', 'var ');
        res = res.replaceAll('let ', 'var ');
        res = res.replace('((()=>{', '');
        res = res.replace('})());', '');
        importScript(0, `config.js?x=${+new Date() + "lol"}`);
        importScript(1, res);
        importScript(0, "https://js.hcaptcha.com/1/api.js?onload=loadedCaptcha&render=explicit");
        wait();
    })
    
    function checkClient() {
        typeof Animal != 'undefined' ? setTimeout(clientLoaded, 500, window.unsafeWindow) : setTimeout(checkClient, 100);
    }; checkClient();
    
    function clientLoaded() {
        var all = ["formatNumK", "col_edibleOutline", "col_dangerOutline", "outlineColForBiome", "isSpectateMode", "lbCanvas", "miniMapCanvas", "pixelRat", "camzoom", "camx", "camy", "interfS", "canvasW", "canvasH", "dangerAniTypes", "gameObjsByID", "gameObjs", "myPlayerID", "serverCon_aliveInAGame", "serverFirstConnected", "xpPer_n", "playerCount", "respawnMsgText", "aniChoice_isOpen", "aniChoice_choiceButtons", "minimapW", "minimapH", "drawPlayerOnMiniMap", "curServer", "PingUrl", "main", "joinBestServerInRegion", "drawGameInterface", "aniChoiceButtonClicked", "MsgWriter", "wsSendMsg", "ESC_down", "toggleChatOpen"];
        window.all = all;
        var canvas = document.getElementById('gCanvas');
        window.ctx = canvas.getContext('2d');
        window.vars = {};
        var dump = Object.keys(window).filter(index => index.startsWith('_0x'));
        window.dump = dump;
        var evaled = dump.map((v) => {return window[v]});
        window.evaled = evaled;
        var stringed = evaled.map((v) => {return typeof v == 'function' ? v.toString() : ''});
        window.stringed = stringed;
        for (let i in dump) {
            i = Number(i);
            if (!vars.formatNumK && /toPrecision/.test(stringed[i])) { //350
                vars.formatNumK = dump[i];
            } else if (!vars.col_edibleOutline && /#EF3C31/.test(evaled[i])) { //750
                vars.col_edibleOutline = dump[i - 1];
                vars.col_dangerOutline = dump[i];
                vars.outlineColForBiome = dump[i + 2];
            } else if (!vars.isSpectateMode && evaled[i] == canvas) { //800
                vars.isSpectateMode = dump[i - 2];
                vars.lbCanvas = dump[i + 1];
            } else if (!vars.miniMapCanvas && /audio\/music_menu.mp3/.test(evaled[i])) { //850
                vars.miniMapCanvas = dump[i - 11];
                vars.pixelRat = dump[i - 8];
                vars.camzoom = dump[i + 4];
                vars.camx = dump[i + 5];
                vars.camy = dump[i + 6];
                vars.interfS = dump[i + 11];
            } else if (!vars.canvasW && /new Image\(\)/.test(evaled[i])) { //850
                vars.canvasW = dump[i - 7];
                vars.canvasH = dump[i - 6];
            } else if (!vars.dangerAniTypes && /optionsContainer/.test(stringed[i])) { //900
                vars.dangerAniTypes = dump[i - 24];
                vars.gameObjsByID = dump[i - 18];
                vars.gameObjs = dump[i - 19];
            } else if (!vars.myPlayerID && evaled[i]?._color == 'white') { //1000
                vars.myPlayerID = dump[i - 12];
                vars.serverCon_aliveInAGame = dump[i - 10];
                vars.serverFirstConnected = dump[i - 7];
                vars.xpPer_n = dump[i - 1];
                vars.playerCount = dump[i + 4];
                vars.respawnMsgText = dump[i + 6];
            } else if (!vars.aniChoice_isOpen && /=\+new Date\(\)\+_0x/.test(stringed[i])) { //1000
                vars.aniChoice_isOpen = dump[i - 6];
                vars.aniChoice_choiceButtons = dump[i - 4];
                vars.minimapW = dump[i + 1];
                vars.minimapH = dump[i + 2];
                vars.drawPlayerOnMiniMap = dump[i + 9];
            } else if (!vars.curServer && /invalid\\x20url/.test(stringed[i])) { //1200
                vars.curServer = dump[i - 5];
                vars.PingUrl = dump[i];
            } else if (!vars.main && /wss/.test(stringed[i])) {
                vars.main = dump[i];
            } else if (!vars.joinBestServerInRegion && /Joining\\x20best\\x20server.../.test(stringed[i])) { //1300
                vars.joinBestServerInRegion = dump[i];
                vars.drawGameInterface = dump[i + 6];
            } else if (!vars.MsgWriter && /new DataView\(new ArrayBuffer\(/.test(stringed[i])) { //5000
                vars.MsgWriter = dump[i];
            } else if (!vars.wsSendMsg && /send/.test(stringed[i])) { //5000
                vars.wsSendMsg = dump[i];
            } else if (!vars.aniChoiceButtonClicked && /'audio\/click.mp3'/.test(stringed[i]) && /newMsg/.test(stringed[i])) { //500
                vars.aniChoiceButtonClicked = dump[i];
            } else if (!vars.ESC_down && /onblur/.test(stringed[i])) { //5500
                vars.ESC_down = dump[i - 1];
                vars.toggleChatOpen = dump[i];
            }
        }
    
        window.drawGame = '';
        var old = window.requestAnimationFrame;
        window.requestAnimationFrame = function(a) {
            let { name } = a;
            if (!name.startsWith("_0x")) return old.apply(this, arguments);
            if (window.drawGame == name) return old(window[name]);
            window.drawGame = name;
            window[name] = a;
            var entire = window[drawGame].toString();
            setTimeout(`window.${drawGame} = ` + entire.slice(entire.indexOf("(")).replace("){", ") => {"));
            return old(window[name]);
        }
    
        var keyed = Object.keys(vars);
        window.keyed = keyed;
        window.ev = {};
        for (var i in keyed) {
            ev[keyed[i]] = window[vars[keyed[i]]];
        };
    
        if (keyed.length < all.length) {
            var list = "";
            for (var o in all) {
                if (!keyed.includes(all[o])) {
                    list += (o == keyed.length - 1 ? `${all[o]}` : `${all[o]},\n`);
                }
            }
            alert(`Error! Captured ${keyed.length} instead of ${all.length}! - Epic Modpack\n\nCould not find:\n${list}`);
            alert("Epic Modpack is unable to load!");
            return; //Prevents modpack loading
        }
    
        // START OF MODPACK
        
    }
}

alert("sry epic modpack is offline for everyone for a lil")