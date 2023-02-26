var epicModpack = {
    clientVersion: 7.1,
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
    res = res.replace(',((()=>{', ',((()=>{})));');
    res = res.replace('})()));', ';');
    if (typeof Animal != 'undefined') prompt("Error! Failure to intercept client!\n\nMake sure you have updated the modpack at the link below!\n\nReloading page..", "https://greasyfork.org/en/scripts/455807-epic-modpack"), location.reload();
    importScript(0, `config.js?x=${+new Date() + "lol"}`);
    importScript(1, res);
    importScript(0, "https://js.hcaptcha.com/1/api.js?onload=loadedCaptcha&render=explicit");
    wait();
})

function checkClient() {
    typeof Animal != 'undefined' ? setTimeout(clientLoaded, 500, (window.unsafeWindow || window)) : setTimeout(checkClient, 100);
}; checkClient();

function clientLoaded(window) {
    var all = ["convert", "formatNumK", "col_edibleOutline", "col_dangerOutline", "outlineColForBiome", "isSpectateMode", "lbCanvas", "miniMapCanvas", "pixelRat", "camzoom", "camx", "camy", "interfS", "canvasW", "canvasH", "dangerAniTypes", "gameObjsByID", "gameObjs", "myPlayerID", "serverCon_aliveInAGame", "serverFirstConnected", "xpPer_n", "playerCount", "respawnMsgText", "aniChoice_isOpen", "aniChoice_choiceButtons", "minimapW", "minimapH", "drawPlayerOnMiniMap", "curServer", "PingUrl", "main", "joinBestServerInRegion", "drawGameInterface", "aniChoiceButtonClicked", "MsgWriter", "wsSendMsg", "ESC_down", "toggleChatOpen"];
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

    vars.convert = dump[0];

    function getNumber(searchValue) {
        for (var e = 100; e < 3000; e++) {
            try {
                var stringtest = window[vars.convert](e);
                if (stringtest == searchValue) { //match whole word case
                    return e;
                    break;
                }
            } catch {}
        }
        return null;
    }


    function checkString(target, string) {
        var num = getNumber(string);
        if (!num) return false;
        var pattern = `(0x${(num).toString(16)})`;
        var re = new RegExp(pattern, "g");
        return re.test(target);
    }

    for (let i in dump) {
        i = Number(i);
        if (!vars.formatNumK && checkString(stringed[i], "toPrecision")) { //350
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
        } else if (!vars.main && checkString(stringed[i], "wss://")) {
            vars.main = dump[i];
        } else if (!vars.joinBestServerInRegion && checkString(stringed[i], "Joining\x20best\x20server...")) { //1300
            vars.joinBestServerInRegion = dump[i];
            vars.drawGameInterface = dump[i + 6];
        } else if (!vars.MsgWriter && /new DataView\(new ArrayBuffer\(/.test(stringed[i])) { //5000
            vars.MsgWriter = dump[i];
        } else if (!vars.wsSendMsg && checkString(stringed[i], "send")) { //5000
            vars.wsSendMsg = dump[i];
        } else if (!vars.aniChoiceButtonClicked && /'audio\/click.mp3'/.test(stringed[i]) && /newMsg/.test(stringed[i])) { //500
            vars.aniChoiceButtonClicked = dump[i];
        } else if (!vars.ESC_down && checkString(stringed[i], "onblur")) { //5500
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
        setTimeout(`window.${drawGame} = ` + entire.slice(entire.indexOf("(")).replace("){", ") => {'injected';"));
        return old(window[name]);
    }

    var keyed = Object.keys(vars);
    window.keyed = keyed;
    window.evalvars = function() {
        window.ev = {};
        for (var i in keyed) {
            ev[keyed[i]] = window[vars[keyed[i]]];
        };
        return ev;
    }();

    if (keyed.length < all.length) {
        var list = "";
        for (var o in all) {
            if (!keyed.includes(all[o])) {
                list += (o == all.length - 1 ? `${all[o]}` : `${all[o]},\n`);
            }
        }
        let msg = `Error! Captured ${keyed.length} instead of ${all.length}! - Epic Modpack\n\nCould not find:\n${list}`;
        alert(msg);
        console.log(msg);
        alert("Epic Modpack is unable to load!");
        return; //Prevents modpack loading
    }

    // START OF MODPACK
// ==UserScript==
// @name         Epic Modpack Master Renewed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Epic#7027
// @match        https://bettermope.io/*
// @match        https://old-mope.netlify.app/*
// @match        https://mopemohio.netlify.app/*
// @icon         https://mope.io/assets/s/1/skins/land/mouse/100/mouse.png
// @run-at       document-end
// @grant        none
// ==/UserScript==

/*#########################

CURRENT MODS:
+ Find #1
+ Spectate In Game
+ Player Data Display
+ Data Copier
+ Name/Chat Cache
+ Generate Alias
+ Auto Upgrade
+ Chat Hotkeys
+ Epic Stats
+ Hide Interface
+ Chat Filter Bypass
+ Server Info
+ Instant DC
+ Makeshift KOA
+ Animal Colors
+ Client Chat
+ Chat Shortcuts
+ Camera Zoom
+ View Hunger Games Leaderboard
+ Player Indicators
+ Ignore Players
+ Upgrade Menu Keybinds
+ Last Death Location
+ Skin Switcher
+ Auto Translate

#########################*/

// UI IS FITTED FOR 125% DISPLAY SCALE (DISPLAY MONITER SCALE)


// if (location.hostname != "bettermope.io") { //In client mods
    //     alert("Epic Modpack - Redirecting to https://bettermope.io/");
    //     location.href = "https://bettermope.io/";
    //     IGNORE_THIS; //Forces an error, causing the rest of the modpack to not load.
    // }


    function checkClient() {
        typeof Animal != 'undefined' && typeof vars != 'undefined' ? setTimeout(runFunctions, 100) : setTimeout(checkClient, 100);
    }
    checkClient();
    
    var onLoadFunctions = [];
    
    function onClientLoad(func) {
        // setTimeout(func, 1000);
        onLoadFunctions.push(func);
    }
    
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time))
    }
    
    async function runFunctions() {
        for (let func of onLoadFunctions) {
            await sleep(1);
            func();
        };
    }
    
    // General Stuff
    
    document.getElementById('logo').src = "https://media.discordapp.net/attachments/371011006740037653/1044685640094199849/logo.png";
    document.getElementById('logo').width = 350;
    document.getElementById('logo').height = 99;
    
    function click() {
        new Audio('audio/click.mp3').play();
    }
    
    var epicPopupDiv = document.createElement("div");
    epicPopupDiv.id = 'epicpopup';
    epicPopupDiv.style.display = 'none';
    epicPopupDiv.style.position = 'absolute';
    epicPopupDiv.style.padding = "1vh";
    epicPopupDiv.style.font = "bold 2.24vh Arial";
    epicPopupDiv.style.top = '25%';
    epicPopupDiv.style.left = '50%';
    epicPopupDiv.style.textAlign = 'center';
    epicPopupDiv.style.background = 'rgba(0, 255, 0, 0.8)';
    epicPopupDiv.style.border = "0.8vh outset green";
    epicPopupDiv.style.borderRadius = '1vh';
    epicPopupDiv.style.color = 'black';
    epicPopupDiv.style.userSelect = 'none';
    epicPopupDiv.style.pointerEvents = 'none';
    epicPopupDiv.style.webkitTransform = 'translate(-50%, -50%)';
    epicPopupDiv.style.transform = 'translate(-50%, -50%)';
    epicPopupDiv.style.zIndex = '5643563875';
    document.body.appendChild(epicPopupDiv);
    
    window.epicPopup = epicPopup;
    window.showPopup = false;
    var outsideTimeout = null;
    function epicPopup(message, timeout = 60000, type = 'success') {
        clearInterval(outsideTimeout);
        epicPopupDiv.innerText = message;
        switch (type) {
            case 'success': // prevents color overlapping
                epicPopupDiv.style.background = 'rgba(0, 255, 0, 0.8)';
                epicPopupDiv.style.borderColor = 'green';
                break;
            case 'warn':
                epicPopupDiv.style.background = 'rgba(255, 255, 0, 0.8)';
                epicPopupDiv.style.borderColor = 'black';
                break;
            case 'urgent':
                epicPopupDiv.style.background = 'rgba(255, 0, 0, 0.8)';
                epicPopupDiv.style.borderColor = 'black';
                break;
        }
    
        showPopup = true;
    
        outsideTimeout = setTimeout(function() {
            showPopup = false
        }, timeout * 1000);
    }
    
    setInterval(function(){
        if (showPopup) {
            epicPopupDiv.style.display = 'block'
        } else {
            epicPopupDiv.style.display = 'none';
        }
    }, 5)
    
    function getPlayers(excludeSelf = false) {
        var keyed = Object.keys(window[vars.gameObjsByID]);
        var players = [];
        for (var i in keyed) {
            if (window[vars.gameObjsByID][keyed[i]].oType == 2) {
                switch (window[vars.gameObjsByID][keyed[i]].animalType) {
                    case 45:
                    case 60:
                    case 62:
                    case 69:
                    case 58:
                    case 67:
                        continue;
                }
                if (!excludeSelf || keyed[i] != window[vars.myPlayerID]) players.push(window[vars.gameObjsByID][keyed[i]]);
            }
        }
        return players;
    }
    
    // drawGame Modifications
    
    onClientLoad(_ => {
        var entire = window[drawGame].toString();
        var final = entire.slice(entire.indexOf("("))
        .replace(`'white',0x1);`, `koaColorOn ? 'cyan' : 'white', 1);if(num1) ${vars.drawPlayerOnMiniMap}(num1, "rgba(0, 0, 255, 0.9)", 2);`)
        .replace('0x19', 'zoom_n')
        .replace(',xpPer+=0.03', ';if(hide_interface)return;xpPer+=0.03')
        .replace('&&(null!=_0x', '&& !hide_interface &&(null!=_0x')
        .replace(`if(num1)`, `if (dead) ${vars.drawPlayerOnMiniMap}(deathplace, "red", 0.25);if(num1)`)
        
        setTimeout(`window.${drawGame} = ${final}`);
        if (!/injected/.test(entire)) return alert("Injection Error!\nReloading page."), location.reload();
        
    })
    
    // Find #1
    
    function spectate() {
        window[vars.wsSendMsg](spec);
    }
    
    var spec;
    window.num1 = {};
    
    onClientLoad(_ => {
        spec = new window[vars.MsgWriter](1);
        spec.writeUInt8(56);
    })
    
    
    function checkForTop(initialCheck, after) {
        if (!active) return;
        var playersOnScreen = getPlayers();
        for (var player of playersOnScreen) {
            if ((lbData[0].name) || "mope.io" != player.nickName.split('\n')[0]) continue;
            num1 = Object.assign({}, player);
            num1.rad = 35;
            if (!initialCheck) setTimeout(spectate, 1000);
            if (after) after();
            clearTimeout(findtimeout);
            return num1;
        }
    
        if (!initialCheck) setTimeout(checkForTop, 100, false, after);
    }
    
    
    
    window.num1 = null; // Variable to assign found #1 to
    var active = false;
    var findtimeout = null;
    
    function find() {
        if (active) return;
    
        if (typeof lbData == 'undefined') {
            epicPopup("Wait for leaderboard to load..", 1, "warn");
            return;
        }
    
        if (!window[vars.serverCon_aliveInAGame]) {
            //epicPopup("Must be in game!", 1, "warn");
            return;
        }
    
        active = true;
    
        findtimeout = setTimeout(function() {
            active = false;
            epicPopup("Could not find #1!", 3, "warn");
            spectate();
            setTimeout(function() {
                window[vars.ESC_down] = og;
            }, 750);
            var menuInterval = setInterval(function(){
                if (document.getElementById('startMenuWrapper').style.display == 'block') {
                    document.getElementById('startMenuWrapper').style.display = 'none';
                    clearInterval(menuInterval);
                }
            }, 5);
        }, 2000);
    
        var top = checkForTop(true); // no await because we're not using settimeout
        if (top != null) {
            active = false;
            epicPopup("Results may not be accurate if someone\non screen has the same name as #1", 5, 'warn')
            return;
        }
    
        var og = window[vars.ESC_down];
        window[vars.ESC_down] = true;
    
        spectate();
        checkForTop(false, function() { // after
            setTimeout(function() {
                window[vars.ESC_down] = og;
            }, 1000);
    
            active = false;
            var menuInterval = setInterval(function(){
                if (document.getElementById('startMenuWrapper').style.display == 'block') {
                    document.getElementById('startMenuWrapper').style.display = 'none';
                    clearInterval(menuInterval);
                }
            }, 5);
        });
    }
    
    // Zoom mod
    
    window.zoom = true;
    window.zoom_n = 25;
    
    document.addEventListener('mousedown', function(data) {
        if (data.button === 1) {
            zoom_n = 25;
        }
    });
    
    document.addEventListener('wheel', function(data) {
        var data = window.event || data
        if (data.ctrlKey || data.target != document.getElementById('gCanvas')) return;
        var delta = Math.max(-1, Math.min(1, data.wheelDelta || -data.detail));
        if (delta == -1) {
            if (zoom_n > 24) zoom_n -= (zoom_n > 20 ? 0.1 : zoom_n > 9 ? 1.0 : 0.5);
        } else {
            if (zoom_n < 26) zoom_n += (zoom_n > 20 ? 0.1 : zoom_n > 9 ? 1.0 : 0.5)
        }
    });
    
    // Random Name
    
    function generateName(type) {
        if (type == 0) {
            var name1 = ["abandoned", "able", "absolute", "adorable", "adventurous", "academic", "acceptable", "acclaimed", "accomplished", "accurate", "aching", "acidic", "acrobatic", "active", "actual", "adept", "admirable", "admired", "adolescent", "adorable", "adored", "advanced", "afraid", "affectionate", "aged", "aggravating", "aggressive", "agile", "agitated", "agonizing", "agreeable", "ajar", "alarmed", "alarming", "alert", "alienated", "alive", "all", "altruistic", "amazing", "ambitious", "ample", "amused", "amusing", "anchored", "ancient", "angelic", "angry", "anguished", "animated", "annual", "another", "antique", "anxious", "any", "apprehensive", "appropriate", "apt", "arctic", "arid", "aromatic", "artistic", "ashamed", "assured", "astonishing", "athletic", "attached", "attentive", "attractive", "austere", "authentic", "authorized", "automatic", "avaricious", "average", "aware", "awesome", "awful", "awkward", "babyish", "bad", "back", "baggy", "bare", "barren", "basic", "beautiful", "belated", "beloved", "beneficial", "better", "best", "bewitched", "big", "big-hearted", "biodegradable", "bite-sized", "bitter", "black", "black-and-white", "bland", "blank", "blaring", "bleak", "blind", "blissful", "blond", "blue", "blushing", "bogus", "boiling", "bold", "bony", "boring", "bossy", "both", "bouncy", "bountiful", "bowed", "brave", "breakable", "brief", "bright", "brilliant", "brisk", "broken", "bronze", "brown", "bruised", "bubbly", "bulky", "bumpy", "buoyant", "burdensome", "burly", "bustling", "busy", "buttery", "buzzing", "calculating", "calm", "candid", "canine", "capital", "carefree", "careful", "careless", "caring", "cautious", "cavernous", "celebrated", "charming", "cheap", "cheerful", "cheery", "chief", "chilly", "chubby", "circular", "classic", "clean", "clear", "clear-cut", "clever", "close", "closed", "cloudy", "clueless", "clumsy", "cluttered", "coarse", "cold", "colorful", "colorless", "colossal", "comfortable", "common", "compassionate", "competent", "complete", "complex", "complicated", "composed", "concerned", "concrete", "confused", "conscious", "considerate", "constant", "content", "conventional", "cooked", "cool", "cooperative", "coordinated", "corny", "corrupt", "costly", "courageous", "courteous", "crafty", "crazy", "creamy", "creative", "creepy", "criminal", "crisp", "critical", "crooked", "crowded", "cruel", "crushing", "cuddly", "cultivated", "cultured", "cumbersome", "curly", "curvy", "cute", "cylindrical", "damaged", "damp", "dangerous", "dapper", "daring", "darling", "dark", "dazzling", "dead", "deadly", "deafening", "dear", "dearest", "decent", "decimal", "decisive", "deep", "defenseless", "defensive", "defiant", "deficient", "definite", "definitive", "delayed", "delectable", "delicious", "delightful", "delirious", "demanding", "dense", "dental", "dependable", "dependent", "descriptive", "deserted", "detailed", "determined", "devoted", "different", "difficult", "digital", "diligent", "dim", "dimpled", "dimwitted", "direct", "disastrous", "discrete", "disfigured", "disgusting", "disloyal", "dismal", "distant", "downright", "dreary", "dirty", "disguised", "dishonest", "dismal", "distant", "distinct", "distorted", "dizzy", "dopey", "doting", "double", "downright", "drab", "drafty", "dramatic", "dreary", "droopy", "dry", "dual", "dull", "dutiful", "each", "eager", "earnest", "early", "easy", "easy-going", "ecstatic", "edible", "educated", "elaborate", "elastic", "elated", "elderly", "electric", "elegant", "elementary", "elliptical", "embarrassed", "embellished", "eminent", "emotional", "empty", "enchanted", "enchanting", "energetic", "enlightened", "enormous", "enraged", "entire", "envious", "equal", "equatorial", "essential", "esteemed", "ethical", "euphoric", "even", "evergreen", "everlasting", "every", "evil", "exalted", "excellent", "exemplary", "exhausted", "excitable", "excited", "exciting", "exotic", "expensive", "experienced", "expert", "extraneous", "extroverted", "extra-large", "extra-small", "fabulous", "failing", "faint", "fair", "faithful", "fake", "false", "familiar", "famous", "fancy", "fantastic", "far", "faraway", "far-flung", "far-off", "fast", "fat", "fatal", "fatherly", "favorable", "favorite", "fearful", "fearless", "feisty", "feline", "female", "feminine", "few", "fickle", "filthy", "fine", "finished", "firm", "first", "firsthand", "fitting", "fixed", "flaky", "flamboyant", "flashy", "flat", "flawed", "flawless", "flickering", "flimsy", "flippant", "flowery", "fluffy", "fluid", "flustered", "focused", "fond", "foolhardy", "foolish", "forceful", "forked", "formal", "forsaken", "forthright", "fortunate", "fragrant", "frail", "frank", "frayed", "free", "French", "fresh", "frequent", "friendly", "frightened", "frightening", "frigid", "frilly", "frizzy", "frivolous", "front", "frosty", "frozen", "frugal", "fruitful", "full", "fumbling", "functional", "funny", "fussy", "fuzzy", "gargantuan", "gaseous", "general", "generous", "gentle", "genuine", "giant", "giddy", "gigantic", "gifted", "giving", "glamorous", "glaring", "glass", "gleaming", "gleeful", "glistening", "glittering", "gloomy", "glorious", "glossy", "glum", "golden", "good", "good-natured", "gorgeous", "graceful", "gracious", "grand", "grandiose", "granular", "grateful", "grave", "gray", "great", "greedy", "green", "gregarious", "grim", "grimy", "gripping", "grizzled", "gross", "grotesque", "grouchy", "grounded", "growing", "growling", "grown", "grubby", "gruesome", "grumpy", "guilty", "gullible", "gummy", "hairy", "half", "handmade", "handsome", "handy", "happy", "happy-go-lucky", "hard", "hard-to-find", "harmful", "harmless", "harmonious", "harsh", "hasty", "hateful", "haunting", "healthy", "heartfelt", "hearty", "heavenly", "heavy", "hefty", "helpful", "helpless", "hidden", "hideous", "high", "high-level", "hilarious", "hoarse", "hollow", "homely", "honest", "honorable", "honored", "hopeful", "horrible", "hospitable", "hot", "huge", "humble", "humiliating", "humming", "humongous", "hungry", "hurtful", "husky", "icky", "icy", "ideal", "idealistic", "identical", "idle", "idiotic", "idolized", "ignorant", "ill", "illegal", "ill-fated", "ill-informed", "illiterate", "illustrious", "imaginary", "imaginative", "immaculate", "immaterial", "immediate", "immense", "impassioned", "impeccable", "impartial", "imperfect", "imperturbable", "impish", "impolite", "important", "impossible", "impractical", "impressionable", "impressive", "improbable", "impure", "inborn", "incomparable", "incompatible", "incomplete", "inconsequential", "incredible", "indelible", "inexperienced", "indolent", "infamous", "infantile", "infatuated", "inferior", "infinite", "informal", "innocent", "insecure", "insidious", "insignificant", "insistent", "instructive", "insubstantial", "intelligent", "intent", "intentional", "interesting", "internal", "international", "intrepid", "ironclad", "irresponsible", "irritating", "itchy", "jaded", "jagged", "jam-packed", "jaunty", "jealous", "jittery", "joint", "jolly", "jovial", "joyful", "joyous", "jubilant", "judicious", "juicy", "jumbo", "junior", "jumpy", "juvenile", "kaleidoscopic", "keen", "key", "kind", "kindhearted", "kindly", "klutzy", "knobby", "knotty", "knowledgeable", "knowing", "known", "kooky", "kosher", "lame", "lanky", "large", "last", "lasting", "late", "lavish", "lawful", "lazy", "leading", "lean", "leafy", "left", "legal", "legitimate", "light", "lighthearted", "likable", "likely", "limited", "limp", "limping", "linear", "lined", "liquid", "little", "live", "lively", "livid", "loathsome", "lone", "lonely", "long", "long-term", "loose", "lopsided", "lost", "loud", "lovable", "lovely", "loving", "low", "loyal", "lucky", "lumbering", "luminous", "lumpy", "lustrous", "luxurious", "mad", "made-up", "magnificent", "majestic", "major", "male", "mammoth", "married", "marvelous", "masculine", "massive", "mature", "meager", "mealy", "mean", "measly", "meaty", "medical", "mediocre", "medium", "meek", "mellow", "melodic", "memorable", "menacing", "merry", "messy", "metallic", "mild", "milky", "mindless", "miniature", "minor", "minty", "miserable", "miserly", "misguided", "misty", "mixed", "modern", "modest", "moist", "monstrous", "monthly", "monumental", "moral", "mortified", "motherly", "motionless", "mountainous", "muddy", "muffled", "multicolored", "mundane", "murky", "mushy", "musty", "muted", "mysterious", "naive", "narrow", "nasty", "natural", "naughty", "nautical", "near", "neat", "necessary", "needy", "negative", "neglected", "negligible", "neighboring", "nervous", "new", "next", "nice", "nifty", "nimble", "nippy", "nocturnal", "noisy", "nonstop", "normal", "notable", "noted", "noteworthy", "novel", "noxious", "numb", "nutritious", "nutty", "obedient", "obese", "oblong", "oily", "oblong", "obvious", "occasional", "odd", "oddball", "offbeat", "offensive", "official", "old", "old-fashioned", "only", "open", "optimal", "optimistic", "opulent", "orange", "orderly", "organic", "ornate", "ornery", "ordinary", "original", "other", "our", "outlying", "outgoing", "outlandish", "outrageous", "outstanding", "oval", "overcooked", "overdue", "overjoyed", "overlooked", "palatable", "pale", "paltry", "parallel", "parched", "partial", "passionate", "past", "pastel", "peaceful", "peppery", "perfect", "perfumed", "periodic", "perky", "personal", "pertinent", "pesky", "pessimistic", "petty", "phony", "physical", "piercing", "pink", "pitiful", "plain", "plaintive", "plastic", "playful", "pleasant", "pleased", "pleasing", "plump", "plush", "polished", "polite", "political", "pointed", "pointless", "poised", "poor", "popular", "portly", "posh", "positive", "possible", "potable", "powerful", "powerless", "practical", "precious", "present", "prestigious", "pretty", "precious", "previous", "pricey", "prickly", "primary", "prime", "pristine", "private", "prize", "probable", "productive", "profitable", "profuse", "proper", "proud", "prudent", "punctual", "pungent", "puny", "pure", "purple", "pushy", "putrid", "puzzled", "puzzling", "quaint", "qualified", "quarrelsome", "quarterly", "queasy", "querulous", "questionable", "quick", "quick-witted", "quiet", "quintessential", "quirky", "quixotic", "quizzical", "radiant", "ragged", "rapid", "rare", "rash", "raw", "recent", "reckless", "rectangular", "ready", "real", "realistic", "reasonable", "red", "reflecting", "regal", "regular", "reliable", "relieved", "remarkable", "remorseful", "remote", "repentant", "required", "respectful", "responsible", "repulsive", "revolving", "rewarding", "rich", "rigid", "right", "ringed", "ripe", "roasted", "robust", "rosy", "rotating", "rotten", "rough", "round", "rowdy", "royal", "rubbery", "rundown", "ruddy", "rude", "runny", "rural", "rusty", "sad", "safe", "salty", "same", "sandy", "sane", "sarcastic", "sardonic", "satisfied", "scaly", "scarce", "scared", "scary", "scented", "scholarly", "scientific", "scornful", "scratchy", "scrawny", "second", "secondary", "second-hand", "secret", "self-assured", "self-reliant", "selfish", "sentimental", "separate", "serene", "serious", "serpentine", "several", "severe", "shabby", "shadowy", "shady", "shallow", "shameful", "shameless", "sharp", "shimmering", "shiny", "shocked", "shocking", "shoddy", "short", "short-term", "showy", "shrill", "shy", "sick", "silent", "silky", "silly", "silver", "similar", "simple", "simplistic", "sinful", "single", "sizzling", "skeletal", "skinny", "sleepy", "slight", "slim", "slimy", "slippery", "slow", "slushy", "small", "smart", "smoggy", "smooth", "smug", "snappy", "snarling", "sneaky", "sniveling", "snoopy", "sociable", "soft", "soggy", "solid", "somber", "some", "spherical", "sophisticated", "sore", "sorrowful", "soulful", "soupy", "sour", "Spanish", "sparkling", "sparse", "specific", "spectacular", "speedy", "spicy", "spiffy", "spirited", "spiteful", "splendid", "spotless", "spotted", "spry", "square", "squeaky", "squiggly", "stable", "staid", "stained", "stale", "standard", "starchy", "stark", "starry", "steep", "sticky", "stiff", "stimulating", "stingy", "stormy", "straight", "strange", "steel", "strict", "strident", "striking", "striped", "strong", "studious", "stunning", "stupendous", "stupid", "sturdy", "stylish", "subdued", "submissive", "substantial", "subtle", "suburban", "sudden", "sugary", "sunny", "super", "superb", "superficial", "superior", "supportive", "sure-footed", "surprised", "suspicious", "svelte", "sweaty", "sweet", "sweltering", "swift", "sympathetic", "tall", "talkative", "tame", "tan", "tangible", "tart", "tasty", "tattered", "taut", "tedious", "teeming", "tempting", "tender", "tense", "tepid", "terrible", "terrific", "testy", "thankful", "that", "these", "thick", "thin", "third", "thirsty", "this", "thorough", "thorny", "those", "thoughtful", "threadbare", "thrifty", "thunderous", "tidy", "tight", "timely", "tinted", "tiny", "tired", "torn", "total", "tough", "traumatic", "treasured", "tremendous", "tragic", "trained", "tremendous", "triangular", "tricky", "trifling", "trim", "trivial", "troubled", "true", "trusting", "trustworthy", "trusty", "truthful", "tubby", "turbulent", "twin", "ugly", "ultimate", "unacceptable", "unaware", "uncomfortable", "uncommon", "unconscious", "understated", "unequaled", "uneven", "unfinished", "unfit", "unfolded", "unfortunate", "unhappy", "unhealthy", "uniform", "unimportant", "unique", "united", "unkempt", "unknown", "unlawful", "unlined", "unlucky", "unnatural", "unpleasant", "unrealistic", "unripe", "unruly", "unselfish", "unsightly", "unsteady", "unsung", "untidy", "untimely", "untried", "untrue", "unused", "unusual", "unwelcome", "unwieldy", "unwilling", "unwitting", "unwritten", "upbeat", "upright", "upset", "urban", "usable", "used", "useful", "useless", "utilized", "utter", "vacant", "vague", "vain", "valid", "valuable", "vapid", "variable", "vast", "velvety", "venerated", "vengeful", "verifiable", "vibrant", "vicious", "victorious", "vigilant", "vigorous", "villainous", "violet", "violent", "virtual", "virtuous", "visible", "vital", "vivacious", "vivid", "voluminous", "wan", "warlike", "warm", "warmhearted", "warped", "wary", "wasteful", "watchful", "waterlogged", "watery", "wavy", "wealthy", "weak", "weary", "webbed", "wee", "weekly", "weepy", "weighty", "weird", "welcome", "well-documented", "well-groomed", "well-informed", "well-lit", "well-made", "well-off", "well-to-do", "well-worn", "wet", "which", "whimsical", "whirlwind", "whispered", "white", "whole", "whopping", "wicked", "wide", "wide-eyed", "wiggly", "wild", "willing", "wilted", "winding", "windy", "winged", "wiry", "wise", "witty", "wobbly", "woeful", "wonderful", "wooden", "woozy", "wordy", "worldly", "worn", "worried", "worrisome", "worse", "worst", "worthless", "worthwhile", "worthy", "wrathful", "wretched", "writhing", "wrong", "wry", "yawning", "yearly", "yellow", "yellowish", "young", "youthful", "yummy", "zany", "zealous", "zesty", "zigzag", "rocky"];
            var name2 = ["people", "history", "way", "art", "world", "information", "map", "family", "government", "health", "system", "computer", "meat", "year", "thanks", "music", "person", "reading", "method", "data", "food", "understanding", "theory", "law", "bird", "literature", "problem", "software", "control", "knowledge", "power", "ability", "economics", "love", "internet", "television", "science", "library", "nature", "fact", "product", "idea", "temperature", "investment", "area", "society", "activity", "story", "industry", "media", "thing", "oven", "community", "definition", "safety", "quality", "development", "language", "management", "player", "variety", "video", "week", "security", "country", "exam", "movie", "organization", "equipment", "physics", "analysis", "policy", "series", "thought", "basis", "boyfriend", "direction", "strategy", "technology", "army", "camera", "freedom", "paper", "environment", "child", "instance", "month", "truth", "marketing", "university", "writing", "article", "department", "difference", "goal", "news", "audience", "fishing", "growth", "income", "marriage", "user", "combination", "failure", "meaning", "medicine", "philosophy", "teacher", "communication", "night", "chemistry", "disease", "disk", "energy", "nation", "road", "role", "soup", "advertising", "location", "success", "addition", "apartment", "education", "math", "moment", "painting", "politics", "attention", "decision", "event", "property", "shopping", "student", "wood", "competition", "distribution", "entertainment", "office", "population", "president", "unit", "category", "cigarette", "context", "introduction", "opportunity", "performance", "driver", "flight", "length", "magazine", "newspaper", "relationship", "teaching", "cell", "dealer", "debate", "finding", "lake", "member", "message", "phone", "scene", "appearance", "association", "concept", "customer", "death", "discussion", "housing", "inflation", "insurance", "mood", "woman", "advice", "blood", "effort", "expression", "importance", "opinion", "payment", "reality", "responsibility", "situation", "skill", "statement", "wealth", "application", "city", "county", "depth", "estate", "foundation", "grandmother", "heart", "perspective", "photo", "recipe", "studio", "topic", "collection", "depression", "imagination", "passion", "percentage", "resource", "setting", "ad", "agency", "college", "connection", "criticism", "debt", "description", "memory", "patience", "secretary", "solution", "administration", "aspect", "attitude", "director", "personality", "psychology", "recommendation", "response", "selection", "storage", "version", "alcohol", "argument", "complaint", "contract", "emphasis", "highway", "loss", "membership", "possession", "preparation", "steak", "union", "agreement", "cancer", "currency", "employment", "engineering", "entry", "interaction", "limit", "mixture", "preference", "region", "republic", "seat", "tradition", "virus", "actor", "classroom", "delivery", "device", "difficulty", "drama", "election", "engine", "football", "guidance", "hotel", "match", "owner", "priority", "protection", "suggestion", "tension", "variation", "anxiety", "atmosphere", "awareness", "bread", "climate", "comparison", "confusion", "construction", "elevator", "emotion", "employee", "employer", "guest", "height", "leadership", "mall", "manager", "operation", "recording", "respect", "sample", "transportation", "boring", "charity", "cousin", "disaster", "editor", "efficiency", "excitement", "extent", "feedback", "guitar", "homework", "leader", "mom", "outcome", "permission", "presentation", "promotion", "reflection", "refrigerator", "resolution", "revenue", "session", "singer", "tennis", "basket", "bonus", "cabinet", "childhood", "church", "clothes", "coffee", "dinner", "drawing", "hair", "hearing", "initiative", "judgment", "lab", "measurement", "mode", "mud", "orange", "poetry", "police", "possibility", "procedure", "queen", "ratio", "relation", "restaurant", "satisfaction", "sector", "signature", "significance", "song", "tooth", "town", "vehicle", "volume", "wife", "accident", "airport", "appointment", "arrival", "assumption", "baseball", "chapter", "committee", "conversation", "database", "enthusiasm", "error", "explanation", "farmer", "gate", "girl", "hall", "historian", "hospital", "injury", "instruction", "maintenance", "manufacturer", "meal", "perception", "pie", "poem", "presence", "proposal", "reception", "replacement", "revolution", "river", "son", "speech", "tea", "village", "warning", "winner", "worker", "writer", "assistance", "breath", "buyer", "chest", "chocolate", "conclusion", "contribution", "cookie", "courage", "desk", "drawer", "establishment", "examination", "garbage", "grocery", "honey", "impression", "improvement", "independence", "insect", "inspection", "inspector", "king", "ladder", "menu", "penalty", "piano", "potato", "profession", "professor", "quantity", "reaction", "requirement", "salad", "sister", "supermarket", "tongue", "weakness", "wedding", "affair", "ambition", "analyst", "apple", "assignment", "assistant", "bathroom", "bedroom", "beer", "birthday", "celebration", "championship", "cheek", "client", "consequence", "departure", "diamond", "dirt", "ear", "fortune", "friendship", "funeral", "gene", "girlfriend", "hat", "indication", "intention", "lady", "midnight", "negotiation", "obligation", "passenger", "pizza", "platform", "poet", "pollution", "recognition", "reputation", "shirt", "speaker", "stranger", "surgery", "sympathy", "tale", "throat", "trainer", "uncle", "youth", "time", "work", "film", "water", "money", "example", "while", "business", "study", "game", "life", "form", "air", "day", "place", "number", "part", "field", "fish", "back", "process", "heat", "hand", "experience", "job", "book", "end", "point", "type", "home", "economy", "value", "body", "market", "guide", "interest", "state", "radio", "course", "company", "price", "size", "card", "list", "mind", "trade", "line", "care", "group", "risk", "word", "fat", "force", "key", "light", "training", "name", "school", "top", "amount", "level", "order", "practice", "research", "sense", "service", "piece", "web", "boss", "sport", "fun", "house", "page", "term", "test", "answer", "sound", "focus", "matter", "kind", "soil", "board", "oil", "picture", "access", "garden", "range", "rate", "reason", "future", "site", "demand", "exercise", "image", "case", "cause", "coast", "action", "age", "bad", "boat", "record", "result", "section", "building", "mouse", "cash", "class", "period", "plan", "store", "tax", "side", "subject", "space", "rule", "stock", "weather", "chance", "figure", "man", "model", "source", "beginning", "earth", "program", "chicken", "design", "feature", "head", "material", "purpose", "question", "rock", "salt", "act", "birth", "car", "dog", "object", "scale", "sun", "note", "profit", "rent", "speed", "style", "war", "bank", "craft", "half", "inside", "outside", "standard", "bus", "exchange", "eye", "fire", "position", "pressure", "stress", "advantage", "benefit", "box", "frame", "issue", "step", "cycle", "face", "item", "metal", "paint", "review", "room", "screen", "structure", "view", "account", "ball", "discipline", "medium", "share", "balance", "bit", "black", "bottom", "choice", "gift", "impact", "machine", "shape", "tool", "wind", "address", "average", "career", "culture", "morning", "pot", "sign", "table", "task", "condition", "contact", "credit", "egg", "hope", "ice", "network", "north", "square", "attempt", "date", "effect", "link", "post", "star", "voice", "capital", "challenge", "friend", "self", "shot", "brush", "couple", "exit", "front", "function", "lack", "living", "plant", "plastic", "spot", "summer", "taste", "theme", "track", "wing", "brain", "button", "click", "desire", "foot", "gas", "influence", "notice", "rain", "wall", "base", "damage", "distance", "feeling", "pair", "savings", "staff", "sugar", "target", "text", "animal", "author", "budget", "discount", "file", "ground", "lesson", "minute", "officer", "phase", "reference", "register", "sky", "stage", "stick", "title", "trouble", "bowl", "bridge", "campaign", "character", "club", "edge", "evidence", "fan", "letter", "lock", "maximum", "novel", "option", "pack", "park", "quarter", "skin", "sort", "weight", "baby", "background", "carry", "dish", "factor", "fruit", "glass", "joint", "master", "muscle", "red", "strength", "traffic", "trip", "vegetable", "appeal", "chart", "gear", "ideal", "kitchen", "land", "log", "mother", "net", "party", "principle", "relative", "sale", "season", "signal", "spirit", "street", "tree", "wave", "belt", "bench", "commission", "copy", "drop", "minimum", "path", "progress", "project", "sea", "south", "status", "stuff", "ticket", "tour", "angle", "blue", "breakfast", "confidence", "daughter", "degree", "doctor", "dot", "dream", "duty", "essay", "father", "fee", "finance", "hour", "juice", "luck", "milk", "mouth", "peace", "pipe", "stable", "storm", "substance", "team", "trick", "afternoon", "bat", "beach", "blank", "catch", "chain", "consideration", "cream", "crew", "detail", "gold", "interview", "kid", "mark", "mission", "pain", "pleasure", "score", "screw", "sex", "shop", "shower", "suit", "tone", "window", "agent", "band", "bath", "block", "bone", "calendar", "candidate", "cap", "coat", "contest", "corner", "court", "cup", "district", "door", "east", "finger", "garage", "guarantee", "hole", "hook", "implement", "layer", "lecture", "lie", "manner", "meeting", "nose", "parking", "partner", "profile", "rice", "routine", "schedule", "swimming", "telephone", "tip", "winter", "airline", "bag", "battle", "bed", "bill", "bother", "cake", "code", "curve", "designer", "dimension", "dress", "ease", "emergency", "evening", "extension", "farm", "fight", "gap", "grade", "holiday", "horror", "horse", "host", "husband", "loan", "mistake", "mountain", "nail", "noise", "occasion", "package", "patient", "pause", "phrase", "proof", "race", "relief", "sand", "sentence", "shoulder", "smoke", "stomach", "string", "tourist", "towel", "vacation", "west", "wheel", "wine", "arm", "aside", "associate", "bet", "blow", "border", "branch", "breast", "brother", "buddy", "bunch", "chip", "coach", "cross", "document", "draft", "dust", "expert", "floor", "god", "golf", "habit", "iron", "judge", "knife", "landscape", "league", "mail", "mess", "native", "opening", "parent", "pattern", "pin", "pool", "pound", "request", "salary", "shame", "shelter", "shoe", "silver", "tackle", "tank", "trust", "assist", "bake", "bar", "bell", "bike", "blame", "boy", "brick", "chair", "closet", "clue", "collar", "comment", "conference", "devil", "diet", "fear", "fuel", "glove", "jacket", "lunch", "monitor", "mortgage", "nurse", "pace", "panic", "peak", "plane", "reward", "row", "sandwich", "shock", "spite", "spray", "surprise", "till", "transition", "weekend", "welcome", "yard", "alarm", "bend", "bicycle", "bite", "blind", "bottle", "cable", "candle", "clerk", "cloud", "concert", "counter", "flower", "grandfather", "harm", "knee", "lawyer", "leather", "load", "mirror", "neck", "pension", "plate", "purple", "ruin", "ship", "skirt", "slice", "snow", "specialist", "stroke", "switch", "trash", "tune", "zone", "anger", "award", "bid", "bitter", "boot", "bug", "camp", "candy", "carpet", "cat", "champion", "channel", "clock", "comfort", "cow", "crack", "engineer", "entrance", "fault", "grass", "guy", "hell", "highlight", "incident", "island", "joke", "jury", "leg", "lip", "mate", "motor", "nerve", "passage", "pen", "pride", "priest", "prize", "promise", "resident", "resort", "ring", "roof", "rope", "sail", "scheme", "script", "sock", "station", "toe", "tower", "truck", "witness", "can", "will", "other", "use", "make", "good", "look", "help", "go", "great", "being", "still", "public", "read", "keep", "start", "give", "human", "local", "general", "specific", "long", "play", "feel", "high", "put", "common", "set", "change", "simple", "past", "big", "possible", "particular", "major", "personal", "current", "national", "cut", "natural", "physical", "show", "try", "check", "second", "call", "move", "pay", "let", "increase", "single", "individual", "turn", "ask", "buy", "guard", "hold", "main", "offer", "potential", "professional", "international", "travel", "cook", "alternative", "special", "working", "whole", "dance", "excuse", "cold", "commercial", "low", "purchase", "deal", "primary", "worth", "fall", "necessary", "positive", "produce", "search", "present", "spend", "talk", "creative", "tell", "cost", "drive", "green", "support", "glad", "remove", "return", "run", "complex", "due", "effective", "middle", "regular", "reserve", "independent", "leave", "original", "reach", "rest", "serve", "watch", "beautiful", "charge", "active", "break", "negative", "safe", "stay", "visit", "visual", "affect", "cover", "report", "rise", "walk", "white", "junior", "pick", "unique", "classic", "final", "lift", "mix", "private", "stop", "teach", "western", "concern", "familiar", "fly", "official", "broad", "comfortable", "gain", "rich", "save", "stand", "young", "heavy", "lead", "listen", "valuable", "worry", "handle", "leading", "meet", "release", "sell", "finish", "normal", "press", "ride", "secret", "spread", "spring", "tough", "wait", "brown", "deep", "display", "flow", "hit", "objective", "shoot", "touch", "cancel", "chemical", "cry", "dump", "extreme", "push", "conflict", "eat", "fill", "formal", "jump", "kick", "opposite", "pass", "pitch", "remote", "total", "treat", "vast", "abuse", "beat", "burn", "deposit", "print", "raise", "sleep", "somewhere", "advance", "consist", "dark", "double", "draw", "equal", "fix", "hire", "internal", "join", "kill", "sensitive", "tap", "win", "attack", "claim", "constant", "drag", "drink", "guess", "minor", "pull", "raw", "soft", "solid", "wear", "weird", "wonder", "annual", "count", "dead", "doubt", "feed", "forever", "impress", "repeat", "round", "sing", "slide", "strip", "wish", "combine", "command", "dig", "divide", "equivalent", "hang", "hunt", "initial", "march", "mention", "spiritual", "survey", "tie", "adult", "brief", "crazy", "escape", "gather", "hate", "prior", "repair", "rough", "sad", "scratch", "sick", "strike", "employ", "external", "hurt", "illegal", "laugh", "lay", "mobile", "nasty", "ordinary", "respond", "royal", "senior", "split", "strain", "struggle", "swim", "train", "upper", "wash", "yellow", "convert", "crash", "dependent", "fold", "funny", "grab", "hide", "miss", "permit", "quote", "recover", "resolve", "roll", "sink", "slip", "spare", "suspect", "sweet", "swing", "twist", "upstairs", "usual", "abroad", "brave", "calm", "concentrate", "estimate", "grand", "male", "mine", "prompt", "quiet", "refuse", "regret", "reveal", "rush", "shake", "shift", "shine", "steal", "suck", "surround", "bear", "brilliant", "dare", "dear", "delay", "drunk", "female", "hurry", "inevitable", "invite", "kiss", "neat", "pop", "punch", "quit", "reply", "representative", "resist", "rip", "rub", "silly", "smile", "spell", "stretch", "stupid", "tear", "temporary", "tomorrow", "wake", "wrap", "yesterday", "Thomas", "Tom", "Lieuwe"];
            var newname1 = Math.floor(Math.random() * (name1.length));
            var newname2 = Math.floor(Math.random() * (name2.length));
            var idk1 = name1[newname1]
            var idk2 = name2[newname2]
            let which = [idk1, idk2]
            let truename = (Math.random() > 0.5) ? 1 : 0;
            document.getElementById('nickInput').value = which[truename];
            epicPopup(`Name randomized to:\n\n${which[truename]}\n\n(Hold CTRL to reset)`, 3);
        } else if (type == 1) {
            document.getElementById('nickInput').value = '';
            epicPopup('Name Reset!', 2);
        }
    }
    
    // Auto Upgrade
    
    var autoUpgrade = false;
    
    var notif = document.createElement("div");
    notif.id = 'notif';
    notif.style.display = 'none';
    notif.style.position = 'absolute';
    notif.style.padding = "1vh";
    notif.style.font = "bold 2.24vh Arial";
    notif.style.top = "34%";
    notif.style.right = '1%';
    notif.style.textAlign = 'center';
    notif.style.background = 'rgba(16,172,44,0.6)';
    notif.style.border = "0.8vh outset darkgreen";
    notif.style.borderRadius = '1vh';
    notif.style.color = 'black';
    notif.style.userSelect = 'none';
    notif.style.pointerEvents = 'none';
    notif.style.zIndex = '5643563875';
    notif.innerText = 'Auto Upgrade is ON';
    document.body.appendChild(notif);
    
    setInterval(function(){
        if (!autoUpgrade) {
            notif.style.display = 'none';
            return;
        } else {
            notif.style.display = 'block';
        }
        if (window[vars.aniChoice_isOpen]) window[vars.aniChoiceButtonClicked](window[vars.aniChoice_choiceButtons][0]);
    }, 5);
    
    // Chat Hotkeys
    
    if (!localStorage.getItem('epichotkeys')) {
        localStorage.setItem('epichotkeys','["","","","","","","","",""]')
    }
    
    window.presets = JSON.parse(localStorage.getItem('epichotkeys'));
    
    function sendPreset(msgNUM) {
        var newMsg = new window[vars.MsgWriter](3 + unescape(encodeURIComponent(presets[msgNUM - 1])).length);
        newMsg.writeUInt8(19);
        newMsg.writeString(presets[msgNUM - 1]);
        window[vars.wsSendMsg](newMsg);
    }
    
    // Anti AFK
    
    setInterval(resetAfk, 5000);
    
    // Epic Stats
    
    var epicstats = document.createElement("div");
    epicstats.id = 'epicstats'
    epicstats.style.padding = '1vh';
    epicstats.style.font = "bold 2vh Arial";
    epicstats.style.display = "block";
    epicstats.style.color = 'rgb(0,0,0)';
    epicstats.style.background = 'rgba(16,172,44,0.6)';
    epicstats.style.position = "absolute";
    epicstats.style.borderRadius = '1vh';
    epicstats.style.bottom = '5%';
    epicstats.style.left = '1%';
    epicstats.style.userSelect = 'none';
    epicstats.style.pointerEvents = 'none';
    epicstats.style.border = "0.8vh outset darkgreen";
    epicstats.innerHTML = "<b>FPS: N/A<br>Ping: N/A<br>Health: N/A<br>Energy: N/A<br>Time Alive: N/A<br>1v1 Wins: N/A<br>XP: N/A<br>To Next Animal: N/A<br>(Join game to show all stats)</b>";
    document.body.append(epicstats);
    
    function convertTime(t) {
        var sec_num = parseInt(t, 10)
        var hours = Math.floor(sec_num / 3600)
        var minutes = Math.floor(sec_num / 60) % 60
        var seconds = sec_num % 60
    
        return [hours,minutes,seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v,i) => v !== "00" || i > 0)
            .join(":")
    }
    
    var spawnTime,
        oldTimeAlive,
        old1v1wins,
        UPDATE_DELAY = 700,
        updatePing = true,
        lastUpdate = 0,
        frames = 0,
        fps = 0,
        ping = 0;
    
    function getPlayerInfo() {
        try {
            var info = [];
            if (window[vars.serverCon_aliveInAGame]) {
                if (window[vars.gameObjsByID][window[vars.myPlayerID]] == undefined) {
                    info[0] = 'Upgrading..';
                    info[1] = 'Upgrading..';
                    return info;
                }
                if (window[vars.gameObjsByID][window[vars.myPlayerID]].hpPer_n == 0) {
                    info[0] = 100 + '%';
                } else {
                    info[0] = window[vars.gameObjsByID][window[vars.myPlayerID]].hpPer_n + '%';
                }
                info[1] = waterBarPerc_n + '%';
            } else {
                if (window[vars.respawnMsgText] != '') {
                    info[2] = window[vars.respawnMsgText].split('+')[1].split(' ')[0];
                } else {
                    info[2] = '0';
                }
            }
            return info;
        } catch (err) {}
    }
    
    setInterval(function(){
        updatePing = true;
    },5000)
    
    async function resetServerStats() {
        if (!stats) return setTimeout(resetServerStats, 1000);
        var now = Date.now();
        var elapsed = now - lastUpdate;
        if (elapsed < UPDATE_DELAY) {
            ++frames;
        } else {
            fps = Math.round(frames / (elapsed / 1000));
            frames = 0;
            lastUpdate = now;
            try {
                if (!window[vars.serverFirstConnected]) {
                    ping = 'Waiting..';
                } else if (window[vars.curServer]) {
                    if (updatePing) {
                        updatePing = false;
                        await window[vars.PingUrl](`https://${window[vars.curServer].ip}/serverInfo`).then(res => { ping = res });
                        if (window[vars.curServer].ping != 10000) {
                            ping = `${Math.round(ping.toFixed(1))} MS`;
                        } else {
                            ping = 'Searching..';
                        }
                    }
                }
            } catch {};
        }
        requestAnimationFrame(resetServerStats);
    }
    
    lastUpdate = Date.now();
    requestAnimationFrame(resetServerStats);
    
    function updateStats() {
        if (!stats) return;
        if (typeof spawnTime == 'undefined') spawnTime = Date.now();
    
        if (window[vars.serverCon_aliveInAGame]) {
            oldTimeAlive = convertTime(Math.round((Date.now() - spawnTime) / 1000));
            if (window[vars.gameObjsByID][window[vars.myPlayerID]]) old1v1wins = window[vars.gameObjsByID][window[vars.myPlayerID]].wins1v1 //Gives error which doesnt matter, so a try and catch statement has been placed.
            document.getElementById('epicstats').innerHTML = `FPS: <u>${fps}</u><br>Ping: <u>${ping}</u><br>Health: <u>${getPlayerInfo()[0]}</u><br>Energy: <u>${getPlayerInfo()[1]}</u><br>Time Alive: <u>${convertTime(Math.round((Date.now() - spawnTime) / 1000))}</u><br>XP: <u>${window[vars.formatNumK](xp)}</u><br>To Next Animal: <u>${window[vars.xpPer_n]}%</u>`;
        } else {
            if (typeof oldTimeAlive != 'undefined') {
                document.getElementById('epicstats').innerHTML = `FPS: <u>${fps}</u><br>Ping: <u>${ping}</u><br>Health: <u>Dead</u><br>Energy: <u>Dead</u><br>Time Alive: <u>${oldTimeAlive}</u><br>Died with <u>${window[vars.formatNumK](xp)}</u> XP<br>To Next Animal: <u>${window[vars.xpPer_n]}%</u><br>Spawning with: <u>${getPlayerInfo()[2]} XP</u>`;
            } else {
                epicstats.innerHTML = `FPS: <u>${fps}</u><br>Ping: <u>${ping}</u><br>Health: N/A<br>Energy: N/A<br>Time Alive: N/A<br>XP: N/A<br>To Next Animal: N/A<br>(Join game to show stats)`;
            }
            spawnTime = Date.now();
        }
    }
    
    setInterval(updateStats,100);
    
    setInterval(_ => {
        if (document.getElementById('startMenuWrapper').style.display == 'block') document.getElementById('epicstats').style.bottom = '5%';
        else document.getElementById('epicstats').style.bottom = '30%';
    
        if (hide_interface || !stats) document.getElementById('epicstats').style.display = 'none';
        else document.getElementById('epicstats').style.display = 'block';
    }, 5);
    
    // Chat Functions
    
    function sendChat(msg) {
        var newMsg = new window[vars.MsgWriter](3 + unescape(encodeURIComponent(msg)).length);
        newMsg.writeUInt8(19);
        newMsg.writeString(msg);
        window[vars.wsSendMsg](newMsg);
    }
    
    function copyToClipboard(text) {
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }
    
    window.hide_interface = false;
    
    setInterval(function() {
        window[vars.playerCount].renderScale = hide_interface;
    }, 5);
    
    window.chatBypass = typeof JSON.parse(localStorage.getItem('byp')) != 'boolean' ? true : JSON.parse(localStorage.getItem('byp'));
    
    var listLower = ["anus","anus plug","apeshit","apeshite","ar5e","b00bz","b1+ch","b17ch","b1otch","b1otchs","b1tch","b1tch1ng","b1tch35","b1tch3s","b1tchees","b1tches","b1tchez","b1tchin","b1tching","b1tchs","b1tchy","baby batter","ballbag","bangbros","bassturd","bastard","bastardish","bastards","basterd","bastid","bastinado","basturd","bater","bates","beeotch","bell end","bellend","bender","bewbs","beyoch","beyotch","bi + ch","bi+ch","biatch","biches","biotch","biotches","biotchez","bishes","bitch","bitch3s","bitchass","bitchasses","bitched","bitcher","bitchers","bitches","bitchez","bitchfuck","bitchhole","bitchin","bitchin'","bitching","bitchlike","bitchness","bitchs","bitchslap","bitchtits","bitchy","bitchy ass","bizzach","blacky","blumpkin boy","boll0ck","bollock","bollockchops","bollocks","bollocktician","bollox","bondage","boner","bonk juice","boobs","booty","breasticles","breasts","bugger","bugger off","bull shit","bullshi","bullshit","bullshite","bum-bandits","bum-driller","bumhole","bung hole","butt fuck","butt fucker","butt hole","butt pirate","butt-fucker","butt-fuckers","butt-fucking-bandit","butt-munchers","buttermilk","buttfuck","buttfucker","buttfuckers","butthole","butthole boy","bwc","c*nt","c*ntface","c*nts","c*nty","c00n","c00nies","c0ck","c0ckhead","c0cks","c0cksuccer","c0cksucked","c0cksucker","c0cksuckers","c0x","c0xux0r","caaak","caca","cack","cagone","cajones","Camel jockey","cameltoe","carpet muncher","carpetmuncher","carpetmunchers","carpetmunching","cawk","cawk muncher","cawkmuncher","cawks","cawksucker","ch1nk","chesticles","chingchong","chink","chinky","choad nectar","chocha","choke the chicken","cholo","clitlickers","closet fuckhead","clusterfuck","clusterfucked","clusterfucker","clusterfucking","clusterfucks","cobb knobbler","cock","cock droplets","cock head","cock jockey","cock knocker","cock licker","cock munch","cock rider","cock smoker","cock snot","cock suck","cock sucker","cock sucking","cock sucking boiolas","cock sucking nob jokeys","cock tease","cock-face","cock-gobbler","cock-head","cock-sucker","cock-suckers","cockboy","cockeater","cockface","cockgobbler","cockh3ad","cockhead","cockheads","cockhed","cockless","cocklicker","cockmonger","cockmunch","cockmuncher","cocks","cockshit","cockskin","cocksmoker","cocksucc","cocksuccas","cocksuccer","cocksuccers","cocksuck","cocksuckas","cocksucked","cocksucker","cocksuckers","cocksucking","cocksucking mothafuckers","cocksucks","cocksuk","cocksuka","cocksukka","cocsuck","cokmuncher","coksucka","coolie","coon","coon1es","cooni3s","coonie","coonies","coons","coot","coot coot","cooter","cooter shooting","cooterpuffing","cooties","cotton picker","crazy mofos","crazy sob","creampie","crotch","crotch fiddler","crotchy","crow","crows","cuksuker","cuksukka","cum goon","cumball","cumdumpster","cumming","cums","cumslut","cumz","cunnilingus","cunt","cunt ass","cunt fart","cunt lick","cunt licker","cunt lips","cuntasaurus rex","cuntbag","cuntbollock","cuntelope","cuntits","cuntless","cuntlick","cuntlicker","cuntlickers","cuntness","cunts","cunty","cuntz","cuunt","cyberfck","cyberfcks","cyberfuccs","cyberfucks","cyberfucs","cyberfukk","cyberfukks","cyberfvcks","d!ck","d!cks","d!ld0","d!ldo","d0ggy style","d1ck","d1ckhead","d1ckheads","d1cks","d1cksucker","d1cksukka","d1ckz","d1ldo","dafuq","dago","darkass","darkfuck","darkie","darkshit","darktard","darky","dick breath","dick face","dick fucker","dick head","dick licker","dick milker","dick nibbler","dick smoker","dick sucker","dick-face","dick-gobbler","dick-head","dickface","dickfucker","dickhead","dickheads","dickjockies","dickless","dicklicker","dickmuncher","dicks","dickskin","dickslapper","dicksmoker","dicksucker","dickvag","dickz","diddle","dikhead","diks","dild0","dipsh1t","dipsh1tty","dipshat","dipshidiot","dipshit","dipshite","dipshits","dipshitter","dipshitty","dipstick","dirty sanchez","dix","dlck","dlcks","dog fuck","dog fucker","dog fucking","dog shit","dog-fucker","dog's bollocks","doggo style","doggy style","doggy_style","dogie style","dogsh1t","dogsh1ts","dogshit","dogshits","dogstyle","dolt","dong","doosh","dothead","double dick","double dicking","double pen","double-dong","douche","douche bag","douche canoe","douchebag","dumasses","dumb bastard","dumb fucker","dumb@ss","dumbarrassed","dumbass","dumbass fucker","dumbass mofoes","dumbass mothafuckers","dumbass son-of-a-bitch","dumbasses","dumbfucks","dumbshit","dump a load","dune coon","dyke","erectoplasm","f_u_c_k","f'ed","f'er","f@ck","f@cker bunny","f@g","f@gg0t","f@gging","f@ggot","f@gs","f@gshit","f@k","f0ck","f0cked","f0cker","f0ckers","face fuck","fack","fackuhs","fag","fag asses","fag bag","fag hag","fag queen","fag0t","faget","fagg0t","fagging","faggo","faggot","faggot mofoes","faggot mothafuckers","faggot nob jokeys","faggot nobjockies","faggot son-of-a-bitch","faggoting","faggots","faggs","faggy","fagot","fags","fagshit","fart-fucker","fatass","fatasses","fccuker","fck","fck you","fcka","fckahz","fcked","fckedup","fcker","fckin","fcking","Fckk","fckked","fckking","fcks","fcktard","fckyeah","fcuk","fcuked","fcuker","fcukers","fcuking","fcukker","fcuks","fcvking","feck","feck arse","fecker","feg","fellatio aficionado","fellator","fick","finger","finger fuck","fingerbanged","fingerpop","fk bunny","fkbny","fked","fker","fking","fkings","fkker","flamer","flamers","focker","fook","fooker","fookuh","forked","fothermuckers","fuc","fucc","fucca","fuccers","fuccing","fuccs","Fuck","fuck arse","fuck face","fuck faces","fuck goblin","fuck head","fuck off","fuck up","fuck y0u","fuck you","fuck your","fuck your mother","fucka","fuckahs","fuckass","fuckasses","fuckaz","fuckbag","fuckboy","fucked","fucked up","fuckem","fucker","fucker off","fuckers","fuckface","fuckfaces","fuckhead","fuckheaded","fuckheads","fuckin","fucking","fucking A","fucking asshole","fucking bastard","fucking hell","fucking me","fucking retard","fucking shit","fuckk","fuckless","fuckmachine","fucknuckle","fucks","fuckshit","fuckshitface","fuckshithead","fuckstar","fuckster","fuckstick","fucktard","fucktards","fuckup","fuckwad","fuckwhore","fucs","fucx","fudgefucker","fudgepacker","fudgepackers","fudgepackershitter","fudgepacking fucker","fugged","fugger","fuggerz","fuggings","fugly","fuk","fuk1n","fuk1ng","fukcs","fuker","fukheads","fukin","fuking","fukk","fukka","fukked","fukker","fukkers","fukking","fukkings","fukkuh","fuks","fuku","fukwhore","fukwit","full of shit","funbags","fuq","futhamucka","fux","fux0r","fvck","fvck you","fvcka","fvckbunny","fvcker","fvckers","fvckin","fvcking","fvckker bunny","fvckwhi","fxck","fxcked","fxcker","fxcking","gin jockey","girlieboy","gook","gowl","greaser","groid","groper","gyp","harry palms","heeb","higg@","higg3r","higga","higger","higgers","hoar","jewboy","jigaboo","jigaboos","jigga","jiggaboo","jiggabooboo","jiggaboos","jiggabu","jiggas","jigger","jiggerboo","jiggerboos","jiggs","jiggyboo","jigro","jim crow","jizz","jizz eater","jizz licker","jizz-jockey","jizzbags","jizzed","jizzes","jizzfucker","jizzing","jizzsacks","jizzstain","jizzy","k!k3","k!ke","k..!ke","k1k3","k1ke","kid diddler","kiddy touch","kike","kikes","kiss ass","kiss my ass","kitty puncher","kkk","klan","klitoris","kneegrows","knickers","knob","knob eater","knob gobbler","knob jockey","knob-face","knob-gobbler","knob-head","knob3d","knob3nd","knobd","knobe","knobead","knobeads","knobed","knobeds","knobend","knobender","knobends","knobendy","knobendz","knober","knobes","knobgobbler","knobhead","knobheads","knobjockies","knobjocky","knobjokey","knobjokeys","ku kluxer","kyke","l@dyb0i","l@dyb0y","l@dyboy","l3i + ch","l3i+ch","l3itch","l3itches","ladboys","ladboyz","ladiboy","lady-boy","ladyb0i","ladyb0y","ladyboy","ladyboys","ladyboyz","lesbo","loose woman","m@asterbated","m@derfaker","m@derfuck","m@derfuckers","m0f0","m0f0s","m0fo","m0foes","m0fos","m0ng0l0id","m0ngoloid","m0thafucked","m0thafucker","m0thafucking","m0therfuckeds","m0therfucker","m0therfucking","m0therfvcker","man chowder","man meat","man seed","markasses","meat curtains","meat-sword","mecha fag","mega fag","mf'er","mf'ers","mf'ing","mfckers","MFer","MFers","mfing","mfk","mfs","mfukk","mfukker","milf","mindfuck","mof0es","mof0s","mofcker","mofo","mofo ass","mofoes","mofos","mofoshit","mofuccers","mofucckers","mofuck","mofucker","mofuckkas","mofuk","mofukkas","molester","mong","mongoloid","mongrel","motha fucka","motha fucker","motha fuckers","mothaf@cked","mothafcked","mothafcking","Mothafucc","mothafucced","mothafuccer","mothafuccing","mothafuck","mothafucka","mothafuckas","mothafuckasses","mothafuckaz","mothafuckazzes","mothafucked","mothafuckeds","mothafucker","mothafuckers","mothafuckin","mothafucking","mothafuckings","mothafuckins","mothafucks","mothafuckz","mothafvcked","mother effer","mother fuck","mother fuck you","mother fucka","mother fucker","mother fuckers","mother fucking","mothercker","motherf@kka","motherfacking","motherfcked","motherfckin","motherfcking","motherfcks","motherfckshit","motherfecka","motherfecker","motherfk","motherfucca","motherfuccas","motherfuccers","motherfuck","motherfucked","motherfuckeds","motherfucker","motherfuckers","motherfuckin","motherfucking","motherfuckings","motherfuckingshit","motherfuckins","motherfuckka","motherfuckkas","motherfuckkers","motherfucks","motherfukka","motherfukker","motherfukkings","motherfvck","motherfvcked","motherfvckeds","motherfvcker","motherfvckers","motherfvcking","motherfxck","motherfxcking","mothfck","mothter fuck","mtherfuker","mthrfcker","muddafukkas","mudderfuk","mudderfukker","mufdive","mufdivin","muff","muffdiving","muffdivings","muffindivin","muffindiving","muhfucking","mushroom tip","mutha fucka","mutha fucker","muthafecker","muthafeckers","muthafucka","muthafuckers","muthafuckings","muthafuckker","muthafuckkers","muthafukka","mutherfucker","mutherfuckers","n0bhead","n0bj0cky","n1ckker","n1g3r","n1g3rz","n1gg@","n1gg@hs","n1gg3r","n1gg3rs","n1gga","n1ggah","n1ggahs","n1ggas","n1ggazes","n1gger","n1ggers","n1gguh","n3gro","negga","neggar","negr0","negro","negroes","negroid","niccer","nicka","nickas","nicker","nickk3r","nickker","nig-nog","niga","nigah","nigasses","nigers","nigg","nigg@","nigg@hs","nigg@s","nigg@z","nigg@zzes","nigg3r","nigg3rs","nigg4h","nigg4hs","nigga","nigga lover","niggah","niggahs","niggahz","niggas","niggass","niggaz","niggazzes","nigger","niggers","niggerz","niggir","niggress","nigguh","nigguhs","nigguhz","niglet","nignigs","nignog","nigra","nigre","nigs","niguh","nikk3r","nikkas","nikker","pussylickers","pussys","pussywhipped","puta","puussy","puzzies","puzzy","queerasses","S&M","sack","salad tosser","sambo","sand nigger","sausage jockey","scamfuck","schlong","scumfuck","scumfucker","scumfvck","scummy","shytfeisterfuck","sissy","snatch licker","soab","soppy bollucks","sphincter","spic","spicfuck","spick","spics","spicshit","spig","spik","spix","spook","spooks","spunk","stump chewer","stupid fucker","stupidasses","sum of a bitch","sumbitch","swine","swine fucker","tacohead","tadger","tallywacker","tar-baby","throater","tits","tosser","tossing salad","towelhead","towelheads","towelshithead","trashybitches","trouser snake","trousersnake","turdcutter","turdhead","tw@t","twa+","twat","twat waffle","twatface","twats","twatt","twattish","twatzilla","twink","upskirts","vag","vulva","w@nker","w@nkers","w4nk3r","w4nker","wang","wang wrangler","wank","wank off","wank3r","wank3rs","wankbastard","wanked","wanker","wankers","wankies","wanking","wanks","we1back","weenie","weiner","wet back","wetback","wetbacks","wh0r3","wh0re"];
    
    window.koainv = false;
    var oldread = Animal.prototype.readCustomData_onUpdate;
    onClientLoad(function(){
        Animal.prototype.readCustomData_onUpdate = function() {
            oldread.apply(this, arguments);
            if (koainv) this.flag_eff_invincible = true;
        }
    })
    
    onClientLoad(function() {
        var entire = window[vars.toggleChatOpen].toString();
        var chatthingy = 0;
        var re = new RegExp(vars.serverCon_aliveInAGame, "g");
        setTimeout(`window.${vars.toggleChatOpen} = ` + entire.slice(entire.indexOf("(")).replace("){", ") => {").replace(re, match => ++chatthingy === 2 ? `${vars.serverCon_aliveInAGame} && !isClientCmd(document.getElementById("chatinput").value + '')` : match).replace("'';", "''; document.getElementById('chatinput').maxLength = 175;"));
    })
    
    async function displayPing() {
        if (window[vars.curServer].ping <= 9000 && window[vars.curServer].ping >= 0) {
            epicPopup(`${Math.round(window[vars.curServer].ping)} MS`, 4);
        } else {
            epicPopup('Searching for ping...', 4, 'warn');
            var ping;
            await window[vars.PingUrl](`https://${window[vars.curServer].ip}/serverInfo`).then(res => { ping = res });
            ping.toFixed(1);
            setTimeout(displayPing, 100);
        }
    }
    
    var helpMessage = document.createElement("div");
    helpMessage.style.display = 'none';
    helpMessage.style.padding = "8px";
    helpMessage.style.font = "bold 17px Arial";
    helpMessage.style.position = "absolute";
    helpMessage.style.background = 'rgba(16,172,44,0.3)';
    helpMessage.style.border = "6px outset darkgreen";
    helpMessage.style.borderRadius = '8px';
    helpMessage.style.top = '20px';
    helpMessage.style.left = '245px';
    helpMessage.style.textAlign = 'left';
    helpMessage.style.color = 'black';
    helpMessage.style.userSelect = 'none'
    helpMessage.style.pointerEvents = 'none';
    document.body.appendChild(helpMessage);
    
    var messagepopup = false;
    var helpTimeout = null;
    function messageHelp(message, timeout) {
        clearInterval(helpTimeout);
        helpMessage.innerText = message;
    
        messagepopup = true;
    
        helpTimeout = setTimeout(function() {
            messagepopup = false
        }, timeout * 1000);
    }
    
    setInterval(function(){
        if (messagepopup) {
            helpMessage.style.display = 'block';
        } else {
            helpMessage.style.display = 'none';
        }
    }, 5)
    
    window.clientChat = false;
    
    window.isClientCmd = function (arg) {
        if (arg.includes('show:')) {
            let seperatedCMD = arg.replace('show:', ''); //show interface commands
            if (seperatedCMD == 'interface') {
                hide_interface = false;
                return true;
            }
        }
    
        if (arg.includes('hide:')) {
            let seperatedCMD = arg.replace('hide:', ''); //hide interface commands
            if (seperatedCMD == 'interface') {
                hide_interface = true;
                return true;
            }
        }
    
        if (arg.includes('server:')) {
            let seperatedCMD = arg.replace('server:', ''); //server commands
            switch (seperatedCMD) {
                case 'dc':
                    window[vars.joinBestServerInRegion]();
                    return true;
                case 'ip':
                    epicPopup(window[vars.curServer].serverConnURL, 4);
                    return true;
                case 'name':
                    epicPopup(window[vars.curServer].name, 4);
                    return true;
                case 'ping':
                    displayPing();
                    return true;
            }
        }
    
        if (arg.includes('bypass:')) {
            let seperatedCMD = arg.replace('bypass:', '');
            switch (seperatedCMD) {
                case '0':
                    window.chatBypass = false;
                    localStorage.setItem('byp', false);
                    return true;
                case '1':
                    window.chatBypass = true;
                    localStorage.setItem('byp', true);
                    return true;
            }
        }
    
        if (arg.includes('koa:')) {
            let seperatedCMD = arg.replace('koa:', '');
            switch (seperatedCMD) {
                case '0':
                    koaColorOn = false;
                    window[vars.gameObjsByID][window[vars.myPlayerID]].rad = -10
                    koainv = true;
                    setTimeout('koainv = false', 3000);
                    return true;
                case '1':
                    koaColorOn = true;
                    window[vars.gameObjsByID][window[vars.myPlayerID]].rad = -10
                    koainv = true;
                    setTimeout('koainv = false', 3000);
                    return true;
            }
        }
    
        if (arg.includes('color:')) {
            let seperatedCMD = arg.split(':');
            switch (seperatedCMD[1]) {
                case 'name':
                    switch (seperatedCMD[2]) {
                        case '0':
                            document.getElementById('nameon').checked = false;
                            return true;
                        case '1':
                            document.getElementById('nameon').checked = true;
                            return true;
                        default:
                            document.getElementById('namecolor').value = seperatedCMD[2];
                            return true;
                    }
                    break;
                case 'outline':
                    switch (seperatedCMD[2]) {
                        case '0':
                            document.getElementById('outlineon').checked = false;
                            return true;
                        case '1':
                            document.getElementById('outlineon').checked = true;
                            return true;
                        default:
                            document.getElementById('outlinecolor').value = seperatedCMD[2];
                            return true;
                    }
                    break;
                case '0':
                    document.getElementById('nameon').checked = false;
                    document.getElementById('outlineon').checked = false;
                    return true;
                case '1':
                    document.getElementById('nameon').checked = true;
                    document.getElementById('outlineon').checked = true;
                    return true;
                default:
                    document.getElementById('namecolor').value = seperatedCMD[1];
                    document.getElementById('outlinecolor').value = seperatedCMD[1];
                    return true;
            }
        }
    
        if (arg.includes('player:')) {
            let seperatedCMD = arg.split(':');
            switch (seperatedCMD[1]) {
                case 'id':
                    switch (seperatedCMD[2]) {
                        case 'show':
                            showPlayerID = true;
                            return true;
                        case 'hide':
                            showPlayerID = false;
                            return true;
                    }
                    break;
                case 'lava':
                    switch (seperatedCMD[2]) {
                        case 'show':
                            showPlayerLava = true;
                            return true;
                        case 'hide':
                            showPlayerLava = false;
                            return true;
                    }
                    break;
                case 'wins':
                    switch (seperatedCMD[2]) {
                        case 'show':
                            showPlayerWins = true;
                            return true;
                        case 'hide':
                            showPlayerWins = false;
                            return true;
                    }
                    break;
                case 'dive':
                    switch (seperatedCMD[2]) {
                        case 'show':
                            showPlayerDive = true;
                            return true;
                        case 'hide':
                            showPlayerDive = false;
                            return true;
                        default:
                            seperatedCMD[2] = Number(seperatedCMD[2]);
                            if (!Number.isNaN(seperatedCMD[2]) && seperatedCMD[2] >= 0 && seperatedCMD[2] <= 1) {
                                window.playerDiveOp = seperatedCMD[2];
                                return true;
                            }
                            break;
                    }
                    break;
                case 'all':
                    switch (seperatedCMD[2]) {
                        case 'show':
                            showPlayerWins = false;
                            showPlayerID = false;
                            showPlayerLava = false;
                            setTimeout("window.showPlayerWins = true; window.showPlayerID = true; window.showPlayerLava = true;", 5);
                            return true;
                        case 'hide':
                            showPlayerWins = false;
                            showPlayerID = false;
                            showPlayerLava = false;
                            return true;
                    }
                    break;
            }
        }
    
        if (arg.indexOf('cc:') != -1) {
            let seperatedCMD = arg.replace('cc:', '');
            switch (seperatedCMD) {
                case '1':
                    window.clientChat = true;
                    epicPopup('Client Chat Enabled!', 2);
                    return true;
                case '0':
                    window.clientChat = false;
                    epicPopup('Client Chat Disabled!', 2);
                    return true;
            }
        }
    
        // if (arg.indexOf('help:') != -1) { //show all commands
        //     let seperatedCMD = arg.replace('help:', '');
        //     switch (seperatedCMD) {
        //         case '1':
        //             messageHelp("Commands:\n\nInterface Toggle -\n    [show | hide]:interface\n\nServer Commands -\n    server:[dc | name | ip | ping]\n\nPlayer Colors -\n    koa:[0 | 1] - Makeshift KOA command\n    color:\n        1\n        0\n        <color>\n        name:[1 | 0 | <color>]  - Sets Name Color\n        outline:[1 | 0 | <color>]  - Sets Outline Color\n\nPlayer Utilities -\n    player:\n        id:[show | hide] - Shows All Player's ID\n        lava:[show | hide] - Shows All Player's Lava Count\n        dive:[show | hide | <new opacity>] - Lets you see underwater animals / Set opacity\n        all:[show | hide]\n\nCopier -\n    copy:\n        [1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 ] - Copy Leaderboard Player's Name\n        <playerID> - Copy Player's Name\n        <playerID>:<messageNumber> - Copy Player's Specific Message\n\nOther -\n    help: [1] - Command List\n    cc: [1 | 0] - Client Chat",7);
        //             return true;
        //     }
        // }
    
        if (arg.indexOf('copy:') != -1) {
            let seperatedCMD = arg.split(':');
            seperatedCMD[1] = Number(seperatedCMD[1]);
            if (seperatedCMD[2]) seperatedCMD[2] = Number(seperatedCMD[2]);
    
            if (seperatedCMD[1] > 0 && seperatedCMD[1] < 10) {
                copyToClipboard(lbData[seperatedCMD[1] - 1].name);
                epicPopup('Name Copied!', 1.5);
                return true;
            } else if (seperatedCMD[2] == undefined) {
                if (window[vars.gameObjsByID][seperatedCMD[1]] != undefined) {
                    copyToClipboard(window[vars.gameObjsByID][Number(seperatedCMD[1])].nickName.split('\n')[0]);
                    epicPopup('Name Copied!', 1.5);
                    return true;
                } else {
                    epicPopup('Invalid Input', 2, 'error');
                    return true;
                }
            } else {
                seperatedCMD[2] = Number(seperatedCMD[2])
                if (typeof window[vars.gameObjsByID][seperatedCMD[1]].chatLines[seperatedCMD[2] - 1] != 'undefined') {
                    copyToClipboard(window[vars.gameObjsByID][seperatedCMD[1]].chatLines[seperatedCMD[2] - 1].chatTxt);
                    epicPopup('Message Copied!', 1.5);
                } else {
                    epicPopup('Message Doesn\'t Exist', 2, 'error');
                }
            }
            return true;
        }
    
        window.shortcuts = {
            ":welp:": "¯\\_(ツ)_/¯",
            ":dead:": "💀",
            ":skull:": "💀"
        }
    
        var hasShortcut = false;
        var shortcutsKeyed = Object.keys(shortcuts);
        for (let i of shortcutsKeyed) {
            if (arg.includes(i)) {
                arg = arg.replaceAll(i, shortcuts[i]);
                hasShortcut = true;
            }
        }
    
        if (hasShortcut) {
            sendChat(arg);
            return true;
        }
    
        if (!clientChat && chatBypass) {
            var message = arg;
            var badword = false;
            for (var i of listLower) {
                var lower = message.toLowerCase();
                if (lower.includes(i)) {
                    badword = true;
                    message = message.slice(0, lower.indexOf(i) + (i.length / 2)) + "​" + message.slice(lower.indexOf(i) + (i.length / 2));
                }
            }
    
            if (badword) {
                sendChat(message);
                return true;
            }
        }
    
        if (clientChat) {
            window[vars.gameObjsByID][window[vars.myPlayerID]].gotChat(arg);
            return true;
        }
    
        if (sendtrans) {
            arg = arg.substr(0, 35);
            sendTranslation(arg);
            return true;
        }
    
        if (arg.length > 35) {
            for (var i = 0; i < Math.ceil(arg.length / 35); i++) {
                setTimeout(sendChat, i * 600, arg.substr(i * 35,35));
            }
            return true;
        }
    
        return false;
    }
    
    async function sendTranslation(msg) {
        var transData;
        await translate(msg, document.getElementById('sendchatlanguage').value, "auto", true)
            .then(res => { transData = res});
        sendChat(transData.text);
        await delchat(transData.text);
        window[vars.gameObjsByID][window[vars.myPlayerID]].gotChat(`${transData.text}​​ (${transData.src}: "${msg}")`);
    }
    
    async function delchat(msg) {
        return new Promise((resolve, reject) => {
            for (let i in window[vars.gameObjsByID][window[vars.myPlayerID]].chatLines) {
                if (window[vars.gameObjsByID][window[vars.myPlayerID]].chatLines[i].chatTxt == msg) {
                    window[vars.gameObjsByID][window[vars.myPlayerID]].chatLines.splice(i, 1);
                    return resolve(true);
                }
            }
    
            setTimeout(async () => {
                let res = await delchat(msg);
                resolve(res);
            }, 100);
        })
    }
    
    // Enable HG Leaderboard
    
    onClientLoad(function() {
        HungerGames.prototype.drawLeaderboard = FreeForAll.prototype.drawLeaderboard;
    });
    
    // Player Indicators
    
    // window.indicators = true;
    // window.col_prey = "#4AE05E";
    // window.col_predator = "#EF3C31";
    // window.col_neutral = "#BF40BF";
    
    // function GetPointAtAngleForDistance(p, d, a) {
    //     var forX = p.x + d * Math.cos(a);
    //     var forY = p.y + d * Math.sin(a);
      
    //     return {
    //         x: forX,
    //         y: forY
    //     };
    // }
      
    // function drawTriangle(x, y, degrees, color, alpha) { //here; something aint working idk
    //     // console.log(arguments);
    //     // first save the untranslated/unrotated context
    //     ctx.save();
    //     ctx.globalAlpha = alpha;
      
    //     ctx.beginPath();
      
    //     //ctx.translate(x-(s/4), y-(s/4));
    //     ctx.translate(x, y);
    //     //degress += Math.PI;
    //     ctx.rotate(degrees); // * Math.PI / 180);
      
    //     ctx.moveTo(-5, -5);
    //     ctx.lineTo(-5, 5);
    //     ctx.lineTo(5, 5);
      
    //     ctx.lineWidth = 1.5;
    //     ctx.strokeStyle = color;
    //     ctx.fillStyle = color;
    //     //ctx.fill();
    //     ctx.stroke();
      
    //     // restore the context to its untranslated/unrotated state
    //     ctx.restore();
    // }
    
    // function getDistance(p1, p2) {
    //     var a = p1.x - p2.x;
    //     var b = p1.y - p2.y;
      
    //     var c = Math.sqrt(a * a + b * b);
      
    //     return c;
    //   }
    
    // function screenXForGameX(gameX) {
    //     return gameX * window[vars.camzoom] + (window[vars.canvasW] / 2 - window[vars.camx] * window[vars.camzoom]);
    // }
      
    // function screenYForGameY(gameY) {
    //     return gameY * window[vars.camzoom] + (window[vars.canvasH] / 2 - window[vars.camy] * window[vars.camzoom]);
    // }
    
    // var angleAimingBetweenPoints = function(x1, y1, x2, y2) {
    //     return Math.atan2(y2 - y1, x2 - x1);
    // }
    
    // function drawArrow(src, dest, color) {
    //     //log("Drawing arrow");
    //     var xMid = window[vars.canvasW] / 2;
    //     var yMid = window[vars.canvasH] / 2;
    //     var angle = angleAimingBetweenPoints(dest.x, dest.y, src.x, src.y);
      
    //     var srcScreenX = screenXForGameX(dest.x);
    //     var srcScreenY = screenYForGameY(dest.y);
    //     var srcScreenRad = dest.rad * camzoom_n;
    //     //console.log("screen pos "+srcScreenX+","+srcScreenY);
    //     //all in screen coords
    //     var distFromXScreenEdge = Math.min(
    //         Math.abs(srcScreenX - srcScreenRad - 0),
    //         Math.abs(srcScreenX + srcScreenRad - window[vars.canvasW])
    //     );
    //     var distFromYScreenEdge = Math.min(
    //         Math.abs(srcScreenY - srcScreenRad - 0),
    //         Math.abs(srcScreenY + srcScreenRad - window[vars.canvasH])
    //     );
    //     //console.log("x dist "+distFromXScreenEdge+", y "+distFromYScreenEdge);
      
    //     var atDistance = window[vars.col_dangerOutline] ? -85 : -25 - src.rad; // from the animal mid.
    //     var point = GetPointAtAngleForDistance(
    //         {
    //             x: src.x,
    //             y: src.y
    //         },
    //         atDistance,
    //         angle
    //     );
    //     var distance = getDistance(
    //         {
    //             x: point.x,
    //             y: point.y
    //         },
    //         {
    //             x: dest.x,
    //             y: dest.y
    //         }
    //     );
    //     //if ((dest.rad < 100 && distance < dest.rad * 0.5)) return;
    //     //angle += Math.PI
    //     angle += (45 * (Math.PI / 180));
      
    //     var alpha = 1;
    //     var size = 20; // size of the triangle
    //     drawTriangle(point.x, point.y, angle, color, alpha);
    // }
    
    // window.trackAnimals = function() {
    //     //if (gameObjsByID[myPlayerID].flag_underWater) return;
    //     var player = window[vars.gameObjsByID][window[vars.myPlayerID]];
    //     if (player) {
    //         for (d of window[vars.gameObjs]) {
    //             if (player.id != d.id) {
    //                 if (d.oType === 2) {
    //                     //#EF3C31
    //                     var linecolor = d.getOutlineColor();
    //                     //console.log("linecolor: " + linecolor);
    //                     var track = false;
    //                     if (linecolor == window[vars.col_dangerOutline]) {
    //                         console.log('predator')
    //                         drawArrow(player, d, col_predator);
    //                     } else if (linecolor == window[vars.col_edibleOutline]) {
    //                         console.log('prey')
    //                         drawArrow(player, d, col_prey);
    //                     } else {
    //                         console.log('neutral')
    //                         drawArrow(player, d, col_neutral);
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
    
    // onClientLoad = (al) => al();
    // onClientLoad(function() { //good
    //     var oldd = window[drawGame];
    //     window[drawGame] = function () {
    //         oldd.apply(this, arguments);
    //         if (indicators) trackAnimals();
    //     }
    // });
    
    // Player Functions
    
    window.ignoredUsers = [];
    window.nameCache = [];
    window.chatCache = [];
    window.showPlayerID = false;
    window.showPlayerLava = false;
    window.showPlayerWins = false;
    window.showPlayerDive = true;
    window.playerDiveOp = 0.35;
    window.koaColorOn = false;
    // window.document.getElementById('outlineon').checked = false;
    // window.document.getElementById('namecolor').valueOn = true;
    // window.document.getElementById('outlinecolor').value = 'black';
    // window.document.getElementById('namecolor').value = 'orange';
    window.teamEnabled = false;
    window.teamTag = '';
    window.teamColor = '';
    
    onClientLoad(function() {
        CachedText.prototype.multiLine = true;
    
        setTimeout("Animal.prototype.customDraw = " + Animal.prototype.customDraw.toString().replace("0x0", 'showPlayerDive ? playerDiveOp : 0.0'));
    
        setTimeout("Animal.prototype.getOutlineColor = " + Animal.prototype.getOutlineColor.toString().replace(";}", ';};if(window[vars.gameObjsByID][window[vars.myPlayerID]]){if(koaColorOn&&this.id==window[vars.myPlayerID])return"cyan";if(outlineon&&this.id==window[vars.myPlayerID])return outlinecolor}if(teamEnabled&&this.nickName.split("\\n")[0].toLowerCase().includes(teamTag.toLowerCase()))return teamColor;'));
    
        // Animal.prototype.getOutlineColor = function() {
        //     if (this.alwaysPlainOutline) return outlineColForBiome(this.curBiome);
    
        //     if (this.isEdibleOutlined()) return window[vars.col_edibleOutline];
    
        //     if (
        //         this.oType == 2 &&
        //         dangerAniTypes[this.animalType - 1] > 0 &&
        //         this.id != myPlayerID
        //     ) return col_dangerOutline;
    
        //     if (this.flag_inWater) {
        //         this.curBiome = biome_ocean;
        //     } else if (this.flag_inLava) {
        //         return this.flag_inLavaSpec == 0 ? "#c64a00" : "#c62f00";
        //     }
    
        //     if (window[vars.gameObjsByID][window[vars.myPlayerID]]) {
        //         if (koaColorOn && this.id == window[vars.myPlayerID]) {
        //             return 'cyan'; //makeshift koa
        //         }
        //         if (outlineon && this.id == window[vars.myPlayerID]) {
        //             return outlinecolor; //custom color
        //         }
        //     };
        //     if (teamEnabled) {
        //         if (this.nickName.split('\n')[0].toLowerCase().includes(teamTag.toLowerCase())) {
        //             return teamColor;
        //         }
        //     };
    
        //     return outlineColForBiome(this.curBiome);
        // }
    
        Animal.prototype.drawNickName = function(idealOp) {
            var nameOpIdeal = idealOp;
            this.nickNameA += (nameOpIdeal - this.nickNameA) * 0.1;
    
            if (this.nickName && this.nickTXT && !document.getElementById('options_noNames').checked) {
                ctx.save();
    
                if (this.dead) ctx.globalAlpha *= 1 - this.moveUpdF;
                else ctx.globalAlpha = 1;
                ctx.globalAlpha *= this.nickNameA; //name alpha
    
                this.nickTXT.x = 0;
                this.nickTXT.y = this.rad + 9;
                var nickColor = "#FFFFFF";
    
                if (ignoredUsers.includes(this.id)) {
                    this.chatLines = [];
                }
                if (window[vars.gameObjsByID][window[vars.myPlayerID]] != undefined) {
                    if (koaColorOn && this.id == window[vars.myPlayerID]) {
                        nickColor = 'cyan'; //makeshift koa
                    }
                    if (nameon && this.id == window[vars.myPlayerID]) {
                        nickColor = namecolor; //custom color
                    }
                }
                if (teamEnabled) {
                    if (this.nickName.split('\n')[0].toLowerCase().includes(teamTag.toLowerCase())) {
                        nickColor = teamColor;
                    }
                }
                if (!nameCache.includes(this.nickName.split('\n')[0])) {
                    nameCache.push(this.nickName.split('\n')[0]);
                }
    
                for (let i = this.chatLines.length; i-- > 0;) {
                    if (!chatCache.includes(this.chatLines[i].chatTxt)) {
                        chatCache.push(this.chatLines[i].chatTxt.replaceAll("​​", ""));
                    }
                }
    
                if (showPlayerID) {
                    if (!this.nickName.includes(`\n${this.id}`)) {
                        this.setNick(`${this.nickName}\n${this.id}`);
                    }
                } else {
                    if (this.nickName.includes(`\n${this.id}`)) {
                        this.setNick(this.nickName.split('\n')[0]);
                    }
                }
                if (showPlayerWins) {
                    if (!this.nickName.includes(`\nWins: `)) {
                        this.setNick(`${this.nickName}\nWins: ${this.wins1v1}`);
                    }
                } else {
                    if (this.nickName.includes(`\n${this.wins1v1}`)) {
                        this.setNick(this.nickName.split('\nWins: ')[0]);
                    }
                }
                if (this.lava != undefined) {
                    if (showPlayerLava) {
                        if (this.nickName.includes('\nLava: ')) {
                            this.setNick(this.nickName.split('\nLava: ')[0]);
                        };
                        this.setNick(`${this.nickName}\nLava: ${this.lava}`);
                    } else {
                        if (this.nickName.includes('\nLava: ')) {
                            this.setNick(this.nickName.split('\nLava: ')[0]);
                        };
                    };
                }
                this.id != window[vars.myPlayerID] && this.nickName.startsWith('​') && otherson ? this.nickTXT.setColor(otherscolor) : this.nickTXT.setColor(nickColor);
                this.nickTXT.draw();
                ctx.restore();
            }
        };
    });
    
    window.updateLeaderBoard = function(lbData, roomPlayers, ownRank) {
        window[vars.lbCanvas] = null;
        if (0 != lbData.length) {
            window[vars.lbCanvas] = document.createElement("canvas");
            var ctx_ = window[vars.lbCanvas].getContext("2d"),
                boardLength = 55;
            var nameH = 22;
            boardLength = boardLength + nameH * lbData.length;
            window[vars.lbCanvas].width = 270;
            window[vars.lbCanvas].height = boardLength;
    
            ctx_.globalAlpha = 0.2;
            ctx_.fillStyle = "#000000";
            ctx_.fillRect(0, 0, window[vars.lbCanvas].width, window[vars.lbCanvas].height);
    
            ctx_.globalAlpha = 1;
            ctx_.fillStyle = "#FFFFFF";
            var str = window[vars.curServer].name; //"Top Players";
            ctx_.font = "24px Arial";
            if (!options_lowGraphics) {
                ctx_.shadowOffsetX = 1;
                ctx_.shadowOffsetY = 1;
            }
            ctx_.shadowColor = "black";
            ctx_.fillText(
                str,
                window[vars.lbCanvas].width / 2 - ctx_.measureText(str).width / 2,
                40
            );
            var rank;
    
            ctx_.textAlign = "left";
    
            for (ctx_.font = "17px Arial", rank = 0; rank < lbData.length; ++rank) {
                str = document.getElementById('options_noNames').checked ? "" : lbData[rank].name || "mope.io";
    
                if (ownRank == lbData[rank].rank) {
                    if (lbcolor && nameon) ctx_.fillStyle = namecolor;
                    else ctx_.fillStyle = "#FEED92"
                    if (document.getElementById('options_noNames').checked) str = "you";
                } else if (lbData[rank].name.includes('​') && otherson && lbcolor) {
                    ctx_.fillStyle = otherscolor;
                } else ctx_.fillStyle = "#FFFFFF";
    
                str =
                    lbData[rank].rank +
                    ". " +
                    str +
                    " (" +
                    window[vars.formatNumK](lbData[rank].score) +
                    ")";
                ctx_.fillText(str, 15, 65 + nameH * rank);
            }
        }
    }
    
    onClientLoad(function() {
        setTimeout(window[vars.main].toString()
            .replace('0x37;', '0x37;updateLeaderBoard.apply(this, arguments);return;')
        );
    })
    
    document.getElementById('nickInput').value = localStorage.nick ?? "";
    setInterval(_ => {
        if (!document.getElementById('nickInput').value.startsWith('​')) {
            document.getElementById('nickInput').value = '​' + document.getElementById('nickInput').value;
        }
    
        if (localStorage.nick) localStorage.nick = localStorage.nick.replaceAll('​','');
    }, 5)
    
    // Title
    
    var versionDisplayDiv = document.createElement('div');
    versionDisplayDiv.id = "versionDisplay";
    versionDisplayDiv.style.padding = '0.4vh';
    versionDisplayDiv.style.font = 'bold 1.86vh Arial';
    versionDisplayDiv.style.display = 'block';
    versionDisplayDiv.style.color = 'rgb(0, 0, 0)';
    versionDisplayDiv.style.background = 'rgba(0, 255, 255, 0.6)';
    versionDisplayDiv.style.position = 'absolute';
    versionDisplayDiv.style.borderRadius = '1vh';
    versionDisplayDiv.style.top = '1.4%';
    versionDisplayDiv.style.left = '50%';
    versionDisplayDiv.style.transform = 'translate(-50%, 0)';
    versionDisplayDiv.style.userSelect = 'none';
    versionDisplayDiv.style.pointerEvents = 'none';
    versionDisplayDiv.style.border = '0.8vh outset skyblue';
    versionDisplayDiv.style.zIndex = "1000000";
    versionDisplayDiv.innerHTML = `<u>Epic Modpack Loading..</u>`;
    document.body.append(versionDisplayDiv);
    
    setInterval(function() {
        if (!epicModpack.firstCheck) versionDisplayDiv.innerHTML = `<u>Epic Modpack Version ${epicModpack.clientVersion}</u>`;
    }, 5);
    
    // Options
    
    var optionsMinimized = false;
    
    var optionsDiv = document.createElement('div');
    optionsDiv.id = 'options';
    optionsDiv.innerHTML = `
    <center><u>Epic Modpack Options</u>
        <br>Press <u>KeyE</u> to toggle menu</center>
    <br>Name Color
    <input id="nameon" class="optioncheck" type="checkbox" checked="true" style="position: relative;">
    <input id="namecolor" class="optiontext" type="text" spellcheck="false" value="orange">
    <br>Outline Color
    <input id="outlineon" class="optioncheck" type="checkbox" style="position: relative;">
    <input id="outlinecolor" class="optiontext" type="text" spellcheck="false" value="orange">
    <br>Modpack Users Color
    <input id="otherson" class="optioncheck" type="checkbox" checked="true" style="position: relative;">
    <input id="otherscolor" class="optiontext" type="text" spellcheck="false" value="orange">
    <br>Leaderboard Colors
    <input id="lbcolor" class="optioncheck" type="checkbox" checked="true" style="position: relative;">
    <br>
    <br>Player Indicators
    <input id="indicators" class="optioncheck" type="checkbox" checked="true" style="position: relative;">
    <br>Prey Color
    <input id="preycolor" class="optiontext" type="text" spellcheck="false" value="#4AE05E">
    <br>Predator Color
    <input id="predatorcolor" class="optiontext" type="text" spellcheck="false" value="#EF3C31">
    <br>Neutral Color
    <input id="neutralcolor" class="optiontext" type="text" spellcheck="false" value="#BF40BF">
    <br>
    <button class="optionbtn" type="button" onclick="if (confirm('Are you sure?')) resetIndicators();">Reset Indicators to default</button>
    <br>
    <br>Auto Upgrade
    <input id="autoupgrade" class="optioncheck" type="checkbox" style="position: relative;">
    <br>Toggle Upgrade Menu
    <input id="togglechoice" class="optiontext" type="text" spellcheck="false" value="Home" onkeydown="formatCode(event, this)">
    <br>Generate Alias
    <input id="aliasKey" class="optiontext" type="text" spellcheck="false" value="Backslash" onkeydown="formatCode(event, this)">
    <br>Ignore Players
    <input id="ignoreplayers" class="optiontext" type="text" spellcheck="false" value="KeyO" onkeydown="formatCode(event, this)">
    <br>Unignore Players
    <input id="unignoreplayers" class="optiontext" type="text" spellcheck="false" value="KeyP" onkeydown="formatCode(event, this)">
    <br>
    <br>Toggle Option Menu
    <input id="toggleMenuKey" class="optiontext" type="text" spellcheck="false" value="KeyE" onkeydown="formatCode(event, this)">
    <br>Minimize Menu instead of Hiding
    <input id="miniokay" class="optioncheck" type="checkbox" checked="true" style="position: relative;">
    <br>
    <br>Show Version Display
    <input id="versiond" class="optioncheck" type="checkbox" checked="true" style="position: relative;">
    <br>Enable Statistics
    <input id="stats" class="optioncheck" type="checkbox" checked="true" style="position: relative;">
    <br>
    <br>Receiving Chat Translation
    <input id="trans" class="optioncheck" type="checkbox" checked="true" style="position: relative;">
    <br>Receiving Translation Language
    <select id="chatlanguage" class="optionselect">
        <option value="af">Afrikaans / Afrikaans</option><option value="am">Amharic / አማርኛ</option><option value="ar">Arabic / العربية</option><option value="as">Assamese / অসমীয়া</option><option value="az">Azerbaijani / azərbaycan</option><option value="be">Belarusian / беларуская</option><option value="bg">Bulgarian / български</option><option value="bn">Bangla / বাংলা</option><option value="bs">Bosnian / bosanski</option><option value="ca">Catalan / català</option><option value="ceb">Cebuano / Binisaya</option><option value="ckb">Central Kurdish / کوردیی ناوەندی</option><option value="co">Corsican / Corsican</option><option value="cs">Czech / Čeština</option><option value="cy">Welsh / Cymraeg</option><option value="da">Danish / Dansk</option><option value="de">German / Deutsch</option><option value="el">Greek / Ελληνικά</option><option value="en">English / English</option><option value="eo">Esperanto / esperanto</option><option value="es">Spanish / Español</option><option value="et">Estonian / eesti</option><option value="eu">Basque / euskara</option><option value="fa">Persian / فارسی</option><option value="fi">Finnish / Suomi</option><option value="fil">Filipino / Filipino</option><option value="fr">French / Français</option><option value="fy">Western Frisian / Frysk</option><option value="ga">Irish / Gaeilge</option><option value="gd">Scottish Gaelic / Gàidhlig</option><option value="gl">Galician / galego</option><option value="gu">Gujarati / ગુજરાતી</option><option value="haw">Hawaiian / ʻŌlelo Hawaiʻi</option><option value="he">Hebrew / עברית</option><option value="hi">Hindi / हिन्दी</option><option value="hmn">Hmong / Hmong</option><option value="hr">Croatian / Hrvatski</option><option value="ht">Haitian Creole / Haitian Creole</option><option value="hu">Hungarian / magyar</option><option value="hy">Armenian / հայերեն</option><option value="id">Indonesian / Indonesia</option><option value="is">Icelandic / íslenska</option><option value="it">Italian / Italiano</option><option value="ja">Japanese / 日本語</option><option value="jv">Javanese / Jawa</option><option value="jw">Javanese / Jawa</option><option value="ka">Georgian / ქართული</option><option value="kk">Kazakh / қазақ тілі</option><option value="km">Khmer / ខ្មែរ</option><option value="kn">Kannada / ಕನ್ನಡ</option><option value="ko">Korean / 한국어</option><option value="ku">Kurdish / kurdî</option><option value="ky">Kyrgyz / кыргызча</option><option value="la">Latin / Latin</option><option value="lb">Luxembourgish / Lëtzebuergesch</option><option value="lo">Lao / ລາວ</option><option value="lt">Lithuanian / lietuvių</option><option value="lv">Latvian / latviešu</option><option value="mg">Malagasy / Malagasy</option><option value="mi">Māori / te reo Māori</option><option value="mk">Macedonian / македонски</option><option value="ml">Malayalam / മലയാളം</option><option value="mn">Mongolian / монгол</option><option value="mni-Mtei">Manipuri (Meitei Mayek) / মৈতৈলোন্ (মেইটেই মায়েক)</option><option value="mr">Marathi / मराठी</option><option value="ms">Malay / Melayu</option><option value="mt">Maltese / Malti</option><option value="my">Burmese / မြန်မာ</option><option value="nb">Norwegian / norsk</option><option value="ne">Nepali / नेपाली</option><option value="nl">Dutch / Nederlands</option><option value="no">Norwegian / norsk</option><option value="ny">Nyanja / Nyanja</option><option value="or">Odia / ଓଡ଼ିଆ</option><option value="pa">Punjabi / ਪੰਜਾਬੀ</option><option value="pl">Polish / polski</option><option value="ps">Pashto / پښتو</option><option value="pt-BR">Portuguese (Brazil) / Português (Brasil)</option><option value="pt-PT">Portuguese (Portugal) / Português (Portugal)</option><option value="ro">Romanian / română</option><option value="ru">Russian / Русский</option><option value="sd">Sindhi / سنڌي</option><option value="si">Sinhala / සිංහල</option><option value="sk">Slovak / Slovenčina</option><option value="sl">Slovenian / slovenščina</option><option value="sm">Samoan / Samoan</option><option value="sn">Shona / chiShona</option><option value="so">Somali / Soomaali</option><option value="sq">Albanian / shqip</option><option value="sr">Serbian / српски</option><option value="su">Sundanese / Basa Sunda</option><option value="sv">Swedish / Svenska</option><option value="sw">Swahili / Kiswahili</option><option value="ta">Tamil / தமிழ்</option><option value="te">Telugu / తెలుగు</option><option value="tg">Tajik / тоҷикӣ</option><option value="ti">Tigrinya / ትግርኛ</option><option value="tl">Filipino / Filipino</option><option value="tr">Turkish / Türkçe</option><option value="tt">Tatar / татар</option><option value="ug">Uyghur / ئۇيغۇرچە</option><option value="uk">Ukrainian / Українська</option><option value="ur">Urdu / اردو</option><option value="uz">Uzbek / o‘zbek</option><option value="vi">Vietnamese / Tiếng Việt</option><option value="xh">Xhosa / isiXhosa</option><option value="yi">Yiddish / ייִדיש</option><option value="yo">Yoruba / Èdè Yorùbá</option><option value="zh-CN">Chinese (Simplified) / 简体中文</option><option value="zh-HK">Chinese (Hong Kong) / 中文（香港）</option><option value="zh-Hans">Chinese (Simplified, China) / 简体中文（中国）</option><option value="zh-Hant">Chinese (Traditional, Taiwan) / 繁體中文（台灣）</option><option value="zh-TW">Chinese (Traditional) / 繁體中文</option><option value="zu">Zulu / isiZulu</option>
    </select>
    <br>Sending Chat Translation
    <input id="sendtrans" class="optioncheck" type="checkbox" checked="true" style="position: relative;">
    <br>Sending Translation Language
    <select id="sendchatlanguage" class="optionselect">
        <option value="af">Afrikaans / Afrikaans</option><option value="am">Amharic / አማርኛ</option><option value="ar">Arabic / العربية</option><option value="as">Assamese / অসমীয়া</option><option value="az">Azerbaijani / azərbaycan</option><option value="be">Belarusian / беларуская</option><option value="bg">Bulgarian / български</option><option value="bn">Bangla / বাংলা</option><option value="bs">Bosnian / bosanski</option><option value="ca">Catalan / català</option><option value="ceb">Cebuano / Binisaya</option><option value="ckb">Central Kurdish / کوردیی ناوەندی</option><option value="co">Corsican / Corsican</option><option value="cs">Czech / Čeština</option><option value="cy">Welsh / Cymraeg</option><option value="da">Danish / Dansk</option><option value="de">German / Deutsch</option><option value="el">Greek / Ελληνικά</option><option value="en">English / English</option><option value="eo">Esperanto / esperanto</option><option value="es">Spanish / Español</option><option value="et">Estonian / eesti</option><option value="eu">Basque / euskara</option><option value="fa">Persian / فارسی</option><option value="fi">Finnish / Suomi</option><option value="fil">Filipino / Filipino</option><option value="fr">French / Français</option><option value="fy">Western Frisian / Frysk</option><option value="ga">Irish / Gaeilge</option><option value="gd">Scottish Gaelic / Gàidhlig</option><option value="gl">Galician / galego</option><option value="gu">Gujarati / ગુજરાતી</option><option value="haw">Hawaiian / ʻŌlelo Hawaiʻi</option><option value="he">Hebrew / עברית</option><option value="hi">Hindi / हिन्दी</option><option value="hmn">Hmong / Hmong</option><option value="hr">Croatian / Hrvatski</option><option value="ht">Haitian Creole / Haitian Creole</option><option value="hu">Hungarian / magyar</option><option value="hy">Armenian / հայերեն</option><option value="id">Indonesian / Indonesia</option><option value="is">Icelandic / íslenska</option><option value="it">Italian / Italiano</option><option value="ja">Japanese / 日本語</option><option value="jv">Javanese / Jawa</option><option value="jw">Javanese / Jawa</option><option value="ka">Georgian / ქართული</option><option value="kk">Kazakh / қазақ тілі</option><option value="km">Khmer / ខ្មែរ</option><option value="kn">Kannada / ಕನ್ನಡ</option><option value="ko">Korean / 한국어</option><option value="ku">Kurdish / kurdî</option><option value="ky">Kyrgyz / кыргызча</option><option value="la">Latin / Latin</option><option value="lb">Luxembourgish / Lëtzebuergesch</option><option value="lo">Lao / ລາວ</option><option value="lt">Lithuanian / lietuvių</option><option value="lv">Latvian / latviešu</option><option value="mg">Malagasy / Malagasy</option><option value="mi">Māori / te reo Māori</option><option value="mk">Macedonian / македонски</option><option value="ml">Malayalam / മലയാളം</option><option value="mn">Mongolian / монгол</option><option value="mni-Mtei">Manipuri (Meitei Mayek) / মৈতৈলোন্ (মেইটেই মায়েক)</option><option value="mr">Marathi / मराठी</option><option value="ms">Malay / Melayu</option><option value="mt">Maltese / Malti</option><option value="my">Burmese / မြန်မာ</option><option value="nb">Norwegian / norsk</option><option value="ne">Nepali / नेपाली</option><option value="nl">Dutch / Nederlands</option><option value="no">Norwegian / norsk</option><option value="ny">Nyanja / Nyanja</option><option value="or">Odia / ଓଡ଼ିଆ</option><option value="pa">Punjabi / ਪੰਜਾਬੀ</option><option value="pl">Polish / polski</option><option value="ps">Pashto / پښتو</option><option value="pt-BR">Portuguese (Brazil) / Português (Brasil)</option><option value="pt-PT">Portuguese (Portugal) / Português (Portugal)</option><option value="ro">Romanian / română</option><option value="ru">Russian / Русский</option><option value="sd">Sindhi / سنڌي</option><option value="si">Sinhala / සිංහල</option><option value="sk">Slovak / Slovenčina</option><option value="sl">Slovenian / slovenščina</option><option value="sm">Samoan / Samoan</option><option value="sn">Shona / chiShona</option><option value="so">Somali / Soomaali</option><option value="sq">Albanian / shqip</option><option value="sr">Serbian / српски</option><option value="su">Sundanese / Basa Sunda</option><option value="sv">Swedish / Svenska</option><option value="sw">Swahili / Kiswahili</option><option value="ta">Tamil / தமிழ்</option><option value="te">Telugu / తెలుగు</option><option value="tg">Tajik / тоҷикӣ</option><option value="ti">Tigrinya / ትግርኛ</option><option value="tl">Filipino / Filipino</option><option value="tr">Turkish / Türkçe</option><option value="tt">Tatar / татар</option><option value="ug">Uyghur / ئۇيغۇرچە</option><option value="uk">Ukrainian / Українська</option><option value="ur">Urdu / اردو</option><option value="uz">Uzbek / o‘zbek</option><option value="vi">Vietnamese / Tiếng Việt</option><option value="xh">Xhosa / isiXhosa</option><option value="yi">Yiddish / ייִדיש</option><option value="yo">Yoruba / Èdè Yorùbá</option><option value="zh-CN">Chinese (Simplified) / 简体中文</option><option value="zh-HK">Chinese (Hong Kong) / 中文（香港）</option><option value="zh-Hans">Chinese (Simplified, China) / 简体中文（中国）</option><option value="zh-Hant">Chinese (Traditional, Taiwan) / 繁體中文（台灣）</option><option value="zh-TW">Chinese (Traditional) / 繁體中文</option><option value="zu">Zulu / isiZulu</option>
    </select>
    <br>
    <br>
    <button class="optionbtn" type="button" onclick="if (confirm('Are you sure?')) resetOptions();">RESET ALL OPTIONS TO DEFAULT</button>`;
    optionsDiv.style.padding = '1vh';
    optionsDiv.style.font = 'bold 2vh Arial';
    optionsDiv.style.textAlign = 'right'
    optionsDiv.style.display = 'block';
    optionsDiv.style.color = 'rgb(0, 0, 0)';
    optionsDiv.style.background = 'rgba(16, 172, 44, 0.6)';
    optionsDiv.style.position = 'absolute';
    optionsDiv.style.borderRadius = '1vh 0 0 1vh';
    
    optionsDiv.style.border = '0.8vh outset darkgreen';
    optionsDiv.style.borderRadius = '1vh';
    optionsDiv.style.right = '1%';
    // optionsDiv.style.border = '0.8vh outset darkgreen';
    // optionsDiv.style.borderRight = '';
    // optionsDiv.style.right = '0';
    
    optionsDiv.style.bottom = '15%';
    optionsDiv.style.zIndex = '10000';
    optionsDiv.style.maxHeight = "40vh";
    optionsDiv.style.width = "38vh";
    optionsDiv.style.overflow = "auto";
    document.body.appendChild(optionsDiv);
    
    var minimizedOptionsDiv = document.createElement('div');
    minimizedOptionsDiv.id = 'minimizedOptions';
    minimizedOptionsDiv.innerHTML = `<center>Press <u>KeyE</u> to toggle menu</center>`;
    minimizedOptionsDiv.style.padding = '1vh';
    minimizedOptionsDiv.style.font = 'bold 2vh Arial';
    minimizedOptionsDiv.style.textAlign = 'right'
    minimizedOptionsDiv.style.display = 'none';
    minimizedOptionsDiv.style.color = 'rgb(0, 0, 0)';
    minimizedOptionsDiv.style.background = 'rgba(16, 172, 44, 0.6)';
    minimizedOptionsDiv.style.position = 'absolute';
    
    minimizedOptionsDiv.style.border = '0.8vh outset darkgreen';
    minimizedOptionsDiv.style.borderRadius = '1vh';
    minimizedOptionsDiv.style.right = '1%';
    // minimizedOptionsDiv.style.borderRadius = '1vh 0 0 1vh';
    // minimizedOptionsDiv.style.border = '0.8vh outset darkgreen';
    // minimizedOptionsDiv.style.borderRight = '';
    // minimizedOptionsDiv.style.right = '0';
    
    minimizedOptionsDiv.style.bottom = '15%';
    minimizedOptionsDiv.style.userSelect = 'none'
    minimizedOptionsDiv.style.pointerEvents = 'none';
    minimizedOptionsDiv.style.zIndex = '10000';
    document.body.appendChild(minimizedOptionsDiv);
    
    var optionstyle = document.createElement('style');
    optionstyle.innerText = `
    #options::-webkit-scrollbar {
        background: 0 0;
        overflow: visible;
        width: 1.25vh
    }
    
    #options::-webkit-scrollbar-thumb {
        background-color: #1c651f;
        border: solid #1c651f
    }
    
    #options::-webkit-scrollbar-track-piece {
        background-color: rgba(37, 131, 31, .3)
    }
    
    #options::-webkit-scrollbar-corner {
        background: 0 0
    }
    
    #options::-webkit-scrollbar-thumb {
        background-color: #248329;
        -webkit-box-shadow: inset 0.125vh 0.125vh 0 rgba(0, 0, 0, .1), inset 0 -0.125vh 0 rgba(0, 0, 0, .07)
    }
    
    #options::-webkit-scrollbar-thumb:hover {
        background-color: #1c651f
    }
    
    .optioncheck {
        border-style: none;
        top: 0.5vh;
        margin: 0 0 3% 1.5%;
        width: 2vh;
        height: 2vh;
    }
    
    .optiontext {
        font: 1.8vh Arial;
        padding: 0.25vh;
        max-width: 10.5vh;
        max-height: 2.5vh;
        text-align: center;
        border-style: none;
        margin: 0 0 1% 2%;
    }
    
    .optionbtn {
        font: 1.8vh Arial;
        padding: 0.4vh;
        border-style: none;
    }
    
    .optionselect {
        font: 1.8vh Arial;
        padding: 0.25vh;
        max-width: 10.5vh;
        max-height: 2.5vh;
        border-style: none;
        margin: 0 0 1% 2%;
    }
    `;
    document.querySelector('head').append(optionstyle);
    
    window.formatCode = function(e, t) {
        setTimeout(_ =>{t.value = e.code},1);
    }
    
    window.resetIndicators = function() {
        document.getElementById('preycolor').value = "#4AE05E";
        document.getElementById('predatorcolor').value = "#EF3C31";
        document.getElementById('neutralcolor').value = "#BF40BF";
    }
    
    var options = JSON.parse(localStorage.options ?? "{}");
    
    var defaults = [true, "orange", false, "cyan", true, "orange", true, true, "#4AE05E", "#EF3C31", "#BF40BF", false, "Home", "Backslash", "KeyO", "KeyP", "KeyE", true, true, true, false, 18, false, 18];
    
    localStorage.options = JSON.stringify( // default values
        {
            "nameon": options.nameon ?? true,
            "namecolor": options.namecolor == undefined || options.namecolor == 'undefined' ? "orange" : options.namecolor,
            "outlineon": options.outlineon ?? false,
            "outlinecolor": options.outlinecolor == undefined || options.outlinecolor == 'undefined' ? "cyan" : options.outlinecolor,
            "otherson": options.otherson ?? true,
            "otherscolor": options.otherscolor == undefined || options.otherscolor == 'undefined' ? "orange" : options.otherscolor,
            "lbcolor": options.lbcolor ?? true,
            "playerIndicators": options.playerIndicators ?? true,
            "prey": options.prey == undefined || options.prey == 'undefined' ? "#4AE05E" : options.prey,
            "predator": options.predator == undefined || options.predator == 'undefined' ? "#EF3C31" : options.predator,
            "neutral": options.neutral == undefined || options.neutral == 'undefined' ? "#BF40BF" : options.neutral,
            "autoUpgradeOn": options.autoUpgradeOn ?? false,
            "togglechoice": options.togglechoice == undefined || options.togglechoice == 'undefined' ? "Home" : options.togglechoice,
            "alias": options.alias == undefined || options.alias == 'undefined' ? "Backslash" : options.alias,
            "ignoreplayers": options.ignoreplayers == undefined || options.ignoreplayers == 'undefined' ? "KeyO" : options.ignoreplayers,
            "unignoreplayers": options.unignoreplayers == undefined || options.unignoreplayers == 'undefined' ? "KeyP" : options.unignoreplayers,
            "toggleMenu": options.toggleMenu == undefined || options.toggleMenu == 'undefined' ? "KeyE" : options.toggleMenu,
            "miniokay": options.miniokay ?? true,
            "versiond": options.versiond ?? true,
            "stats": options.stats ?? true,
            "trans": options.trans ?? false,
            "chatlanguage": options.chatlanguage ?? 18,
            "sendtrans": options.sendtrans ?? false,
            "sendchatlanguage": options.sendchatlanguage ?? 18
        }
    );
    
    options = JSON.parse(localStorage.options);
    window.nameon = options.nameon;
    window.namecolor = options.namecolor;
    window.outlineon = options.outlineon;
    window.outlinecolor = options.outlinecolor;
    window.otherson = options.otherson;
    window.otherscolor = options.otherscolor;
    window.lbcolor = options.lbcolor;
    window.indicators = options.playerIndicators;
    window.prey = options.prey;
    window.predator = options.predator;
    window.neutral = options.neutral;
    window.autoUpgradeOn = options.autoUpgradeOn;
    window.togglechoice = options.togglechoice;
    window.alias = options.alias;
    window.ignoreplayers = options.ignoreplayers;
    window.unignoreplayers = options.unignoreplayers;
    window.toggleMenu = options.toggleMenu;
    window.miniokay = options.miniokay;
    window.versiond = options.versiond;
    window.stats = options.stats;
    window.trans = options.trans;
    window.chatlanguage = options.chatlanguage;
    window.sendtrans = options.sendtrans;
    window.sendchatlanguage = options.sendchatlanguage;
    
    document.getElementById('nameon').checked = nameon;
    document.getElementById('namecolor').value = namecolor;
    document.getElementById('outlineon').checked = outlineon;
    document.getElementById('outlinecolor').value = outlinecolor;
    document.getElementById('otherson').checked = otherson;
    document.getElementById('otherscolor').value = otherscolor;
    document.getElementById('lbcolor').checked = lbcolor;
    document.getElementById('indicators').checked = indicators;
    document.getElementById('preycolor').value = prey;
    document.getElementById('predatorcolor').value = predator;
    document.getElementById('neutralcolor').value = neutral;
    document.getElementById('autoupgrade').checked = autoUpgradeOn;
    document.getElementById('togglechoice').value = togglechoice;
    document.getElementById('aliasKey').value = alias;
    document.getElementById('ignoreplayers').value = ignoreplayers;
    document.getElementById('unignoreplayers').value = unignoreplayers;
    document.getElementById('toggleMenuKey').value = toggleMenu;
    document.getElementById('miniokay').checked = miniokay;
    document.getElementById('versiond').checked = versiond;
    document.getElementById('stats').checked = stats;
    document.getElementById('trans').checked = trans;
    document.getElementById('chatlanguage').selectedIndex = chatlanguage;
    document.getElementById('sendtrans').checked = sendtrans;
    document.getElementById('sendchatlanguage').selectedIndex = sendchatlanguage;
    
    window.resetOptions = function() {
        document.getElementById('nameon').checked = defaults[0];
        document.getElementById('namecolor').value = defaults[1];
        document.getElementById('outlineon').checked = defaults[2];
        document.getElementById('outlinecolor').value = defaults[3];
        document.getElementById('otherson').checked = defaults[4];
        document.getElementById('otherscolor').value = defaults[5];
        document.getElementById('lbcolor').checked = defaults[6];
        document.getElementById('indicators').checked = defaults[7];
        document.getElementById('preycolor').value = defaults[8];
        document.getElementById('predatorcolor').value = defaults[9];
        document.getElementById('neutralcolor').value = defaults[10];
        document.getElementById('autoupgrade').checked = defaults[11];
        document.getElementById('togglechoice').value = defaults[12];
        document.getElementById('aliasKey').value = defaults[13];
        document.getElementById('ignoreplayers').value = defaults[14];
        document.getElementById('unignoreplayers').value = defaults[15];
        document.getElementById('toggleMenuKey').value = defaults[16];
        document.getElementById('miniokay').checked = defaults[17];
        document.getElementById('versiond').checked = defaults[18];
        document.getElementById('stats').chcked = defaults[19];
        document.getElementById('trans').checked = defaults[20];
        document.getElementById('chatlanguage').selectedIndex = defaults[21];
        document.getElementById('sendtrans').checked = defaults[22];
        document.getElementById('sendchatlanguage').selectedIndex = defaults[23];
    }
    
    setInterval(function(){
        localStorage.options = JSON.stringify(
            {
                "nameon": nameon,
                "namecolor": namecolor,
                "outlineon": outlineon,
                "outlinecolor": outlinecolor,
                "otherson": otherson,
                "otherscolor": otherscolor,
                "lbcolor": lbcolor,
                "playerIndicators": indicators,
                "prey": prey,
                "predator": predator,
                "neutral": neutral,
                "autoUpgradeOn": autoUpgradeOn,
                "togglechoice": togglechoice,
                "alias": alias,
                "ignoreplayers": ignoreplayers,
                "unignoreplayers": unignoreplayers,
                "toggleMenu": toggleMenu,
                "miniokay": miniokay,
                "versiond": versiond,
                "stats": stats,
                "trans": trans,
                "chatlanguage": chatlanguage,
                "sendtrans": sendtrans,
                "sendchatlanguage": sendchatlanguage
            }
        );
    
        col_prey = prey;
        col_predator = predator;
        col_neutral = neutral;
    
        if (optionsDiv.style.display == 'block') {
            minimizedOptionsDiv.style.display = 'none';
            optionsDiv.children[0].innerHTML = `<u>Epic Modpack Options</u><br>Press <u>${document.getElementById('toggleMenuKey').value}</u> to toggle menu`;
        } else if (miniokay) {
            minimizedOptionsDiv.style.display = hide_interface ? 'none' : 'block';
            minimizedOptionsDiv.innerHTML = `<center>Press <u>${document.getElementById('toggleMenuKey').value}</u> to toggle menu</center>`
        }
    
        versionDisplayDiv.style.display = versiond && !hide_interface ? "block" : "none";
    
        nameon = document.getElementById('nameon').checked;
        namecolor = document.getElementById('namecolor').value;
        outlineon = document.getElementById('outlineon').checked;
        outlinecolor = document.getElementById('outlinecolor').value;
        otherson = document.getElementById('otherson').checked;
        otherscolor = document.getElementById('otherscolor').value;
        lbcolor = document.getElementById('lbcolor').checked;
        indicators = document.getElementById('indicators').checked;
        prey = document.getElementById('preycolor').value;
        predator = document.getElementById('predatorcolor').value;
        neutral = document.getElementById('neutralcolor').value;
        autoUpgradeOn = autoUpgrade = document.getElementById('autoupgrade').checked;
        togglechoice = document.getElementById('togglechoice').value;
        alias = document.getElementById('aliasKey').value;
        ignoreplayers = document.getElementById('ignoreplayers').value;
        unignoreplayers = document.getElementById('unignoreplayers').value;
        toggleMenu = document.getElementById('toggleMenuKey').value;
        miniokay = document.getElementById('miniokay').checked;
        versiond = document.getElementById('versiond').checked;
        stats = document.getElementById('stats').checked;
        trans = document.getElementById('trans').checked;
        chatlanguage = document.getElementById('chatlanguage').selectedIndex;
        sendtrans = document.getElementById('sendtrans').checked;
        sendchatlanguage = document.getElementById('sendchatlanguage').selectedIndex;
    }, 5)
    
    document.addEventListener('keydown', function(e) {
        if (e.code == toggleMenu && e.target.tagName != 'INPUT') {
            e.preventDefault();
            optionsDiv.style.display = optionsDiv.style.display == 'block' ? 'none' : 'block'
        }
    })
    
    var olddisplay = false;
    var firstreset = false;
    setInterval(function() {
        if (firstreset) optionsDiv.style.display = olddisplay, firstreset = false;
        if (!hide_interface) olddisplay = optionsDiv.style.display;
        else optionsDiv.style.display = "none", firstreset = true;
    }, 5)
    
    onClientLoad(function() {
        let keydown = document.onkeydown.toString();
        let arg = keydown.substring(keydown.indexOf("(") + 1, keydown.indexOf(")"));
        setTimeout("document.onkeydown = " + document.onkeydown.toString().replace(`${vars.serverCon_aliveInAGame}`, `${vars.serverCon_aliveInAGame} && !isTyping(${arg})`));
    });
    
    // Chat Translation
    
    function getobjs() {
        var keyed = Object.keys(window[vars.gameObjsByID]);
        var players = [];
        for (var i in keyed) {
            if (window[vars.gameObjsByID][keyed[i]].oType == 2 || window[vars.gameObjsByID][keyed[i]].oType == 5 || window[vars.gameObjsByID][keyed[i]].oType == 9) {
                switch (window[vars.gameObjsByID][keyed[i]].animalType) {
                    case 45:
                    case 60:
                    case 62:
                    case 69:
                    case 58:
                    case 67:
                        continue;
                }
                if (keyed[i] != window[vars.myPlayerID]) players.push(window[vars.gameObjsByID][keyed[i]]);
            }
        }
        return players;
    }
    
    var languages = {"af":"Afrikaans","am":"አማርኛ","ar":"العربية","as":"অসমীয়া","az":"azərbaycan","be":"беларуская","bg":"български","bn":"বাংলা","bo":"བོད་སྐད་","bs":"bosanski","ca":"català","ccp":"Chakma","ceb":"Binisaya","ckb":"کوردیی ناوەندی","co":"Corsican","crk":"Plains Cree","cs":"Čeština","cy":"Cymraeg","da":"Dansk","de":"Deutsch","dz":"རྫོང་ཁ","el":"Ελληνικά","en":"English","eo":"esperanto","es":"Español","et":"eesti","eu":"euskara","fa":"فارسی","ff":"Pulaar","fi":"Suomi","fil":"Filipino","fr":"Français","fy":"Frysk","ga":"Gaeilge","gd":"Gàidhlig","gl":"galego","gu":"ગુજરાતી","haw":"ʻŌlelo Hawaiʻi","he":"עברית","hi":"हिन्दी","hmn":"Hmong","hr":"Hrvatski","ht":"Haitian Creole","hu":"magyar","hy":"հայերեն","id":"Indonesia","is":"íslenska","it":"Italiano","iu":"Inuktitut","ja":"日本語","jv":"Jawa","jw":"Jawa","ka":"ქართული","kk":"қазақ тілі","km":"ខ្មែរ","kn":"ಕನ್ನಡ","ko":"한국어","ku":"kurdî","ky":"кыргызча","la":"Latin","lb":"Lëtzebuergesch","lis":"Lisu","lo":"ລາວ","lt":"lietuvių","lv":"latviešu","mez":"Menominee","mg":"Malagasy","mi":"te reo Māori","mk":"македонски","ml":"മലയാളം","mn":"монгол","mni-Mtei":"মৈতৈলোন্ (মেইটেই মায়েক)","mr":"मराठी","ms":"Melayu","mt":"Malti","mul":"Multiple languages","mul-beng":"Multiple languages (Bangla)","mul-cyrl":"Multiple languages (Cyrillic)","mul-deva":"Multiple languages (Devanagari)","mul-ethi":"Multiple languages (Ethiopic)","mul-latn":"Multiple languages (Latin)","my":"မြန်မာ","myh":"Makah","nb":"norsk","ne":"नेपाली","nl":"Nederlands","nn":"norsk nynorsk","no":"norsk","nv":"Navajo","ny":"Nyanja","oj":"Ojibwa","one":"Oneida","or":"ଓଡ଼ିଆ","osa":"Osage","pa":"ਪੰਜਾਬੀ","pl":"polski","ps":"پښتو","pt-BR":"Português (Brasil)","pt-PT":"Português (Portugal)","rhg":"Rohingya","ro":"română","rom":"Romany","ru":"Русский","sa":"संस्कृत भाषा","sd":"سنڌي","see":"Seneca","si":"සිංහල","sk":"Slovenčina","sl":"slovenščina","sm":"Samoan","sn":"chiShona","so":"Soomaali","sq":"shqip","sr":"српски","su":"Basa Sunda","sv":"Svenska","sw":"Kiswahili","ta":"தமிழ்","te":"తెలుగు","tg":"тоҷикӣ","th":"ไทย","ti":"ትግርኛ","tl":"Filipino","tr":"Türkçe","tt":"татар","ug":"ئۇيغۇرچە","uk":"Українська","ur":"اردو","uz":"o‘zbek","uzs":"Southern Uzbek","vi":"Tiếng Việt","win":"Hoocąk","xh":"isiXhosa","yi":"ייִדיש","yo":"Èdè Yorùbá","zh-CN":"简体中文","zh-HK":"中文（香港）","zh-Hans":"简体中文（中国）","zh-Hant":"繁體中文（台灣）","zh-TW":"繁體中文","zh-yue":"粵語","zu":"isiZulu"};
    var keyedLanguages = Object.keys(languages);
    
    async function translate(message, target = 'en', source = "auto", defaultLang = false) {
        var data;
        await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&dj=1&source=input&q=${encodeURI(message)}`)
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(res => { 
                data = {
                    text: res.sentences?.[0]?.trans,
                    src: keyedLanguages.find(k => k.includes(res.src))
                }
            });
        await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${data.src}&tl=${defaultLang ? "en" : target}&dt=t&dj=1&source=input&q=${encodeURI(languages[data.src])}`)
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(res => { 
                data.src = res.sentences?.[0]?.trans ?? "Unknown";
            });
        return data;
    }
    
    async function checkMessages() {
        if (!trans) return;
        var players = getobjs();
        for (let index in players) {
            for (let line in players[index].chatLines) {
                var original = players[index].chatLines?.[line].chatTxt
                if (!original || original.includes("​​")) continue;
    
                var transData;
                await translate(original, document.getElementById('chatlanguage').value)
                    .then(res => { transData = res});
    
                players[index].chatLines[line].chatTxt += "​​";
                if (original.toLowerCase() == transData.text.toLowerCase()) continue;
                players[index].chatLines[line].chatTxt = `${transData.text}​​ (${transData.src}: "${original}")`;
            }
        }
    };
    
    setInterval(checkMessages, 500);
    
    // Upgrade Menu Keybinds
    
    onClientLoad(function(){
        setInterval(function(){
            if (!window[vars.aniChoice_isOpen]) return;
            if (window[vars.aniChoice_choiceButtons][0].buttonTXT._text.includes(" (")) return;
            for (let i in window[vars.aniChoice_choiceButtons]) {
                if (i > 10) break;
    
                let button;
                if (i == 9) {
                    button = 0;
                } else if (i == 10) {
                    button = "-";
                } else {
                    button = (Number(i) + 1);
                }
    
                if (!window[vars.aniChoice_choiceButtons][i].buttonTXT._text.includes(" (")) window[vars.aniChoice_choiceButtons][i].buttonTXT.setText(window[vars.aniChoice_choiceButtons][i].buttonTXT._text + ` (${button})`)
            }
        }, 50)
    })
    
    // Last Death Location
    
    window.copy = {};
    window.deathplace = {};
    var firstjoin = false;
    window.dead = false;
    onClientLoad(function() { //HERE
        setInterval(function(){
            if (window[vars.serverCon_aliveInAGame]) {
                firstjoin = true;
                copy = Object.assign({}, window[vars.gameObjsByID][window[vars.myPlayerID]]);
                copy.rad = 25;
            } else if (firstjoin) {
                deathplace = Object.assign({}, copy);
                window.dead = true;
            }
        }, 5)
    })
    
    // Skin Switcher
    
    var skinswitcher = document.createElement('div');
    skinswitcher.id = "skinswitcher";
    skinswitcher.innerHTML = `<img src="./img/x.png" draggable="false" style="max-width:6%;position: sticky;top: 1.3vh;right: 1.3vh;cursor: pointer;z-index: 10001;" onclick="document.getElementById('skinswitcher').style.display = 'none';"><button type="button" id="resetskins" style="padding: 1vh; display: block; color: rgb(0, 0, 0); background: rgba(16, 172, 44, 0.6); position: absolute; border-radius: 1vh; top: 1.3vh; left: 1.3vh; border: 0.8vh outset darkgreen; cursor: pointer; z-index: 10000; font: bold 1.6vh Arial;" onclick="if (confirm('Are you sure you want to reset ALL skins to default?'))setSkinValues(true)" onmousedown="document.getElementById('resetskins').style.borderStyle = 'inset'" onmouseup="document.getElementById('resetskins').style.borderStyle = 'outset'"><u>RESET ALL SKINS</u></button><center><br><div style="font-size: 2.65vh"><u>Epic Modpack Skin Switcher</u></div><br><button type="button" class="skinbtn" onclick="switchBiomeTab(0);">Land Biome</button><button type="button" class="skinbtn" onclick="switchBiomeTab(1);">Ocean Biome</button><button type="button" class="skinbtn" onclick="switchBiomeTab(2);">Arctic Biome</button><button type="button" class="skinbtn" onclick="switchBiomeTab(3);">Volcano Biome</button><br><br><div style="font: Arial 1.9vh">Presets:</div><br><button type="button" class="skinbtn" onclick="if (confirm('Are you sure?')) setSkinPreset(0);">Black Animals</button><div id="landskins" style="display: block;"><br>Mouse<br><img src="https://bettermope.io/skins/mouse.png" id="mouseimg" class="aimg" draggable="false"><br><input id="mouseurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/mouse.png"><br><br>Rabbit<br><img src="https://bettermope.io/skins/rabbit.png" id="rabbitimg" class="aimg" draggable="false"><br><input id="rabbiturl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/rabbit.png"><br><br>Pig<br><img src="https://bettermope.io/skins/pig.png" id="pigimg" class="aimg" draggable="false"><br><input id="pigurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/pig.png"><br><br>Mole<br><img src="https://bettermope.io/skins/mole.png" id="moleimg" class="aimg" draggable="false"><br><input id="moleurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/mole.png"><br><br>Pigeon<br><img src="https://bettermope.io/skins/pigeon/0/pigeon.png" id="pigeonimg" class="aimg" draggable="false"><br><input id="pigeonurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/pigeon/0/pigeon.png"><br><br>Deer<br><img src="https://bettermope.io/skins/deer.png" id="deerimg" class="aimg" draggable="false"><br><input id="deerurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/deer.png"><br><br>Fox<br><img src="https://bettermope.io/skins/fox.png" id="foximg" class="aimg" draggable="false"><br><input id="foxurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/fox.png"><br><br>Hedgehog<br><img src="https://bettermope.io/skins/hedgehog.png" id="hedgehogimg" class="aimg" draggable="false"><br><input id="hedgehogurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/hedgehog.png"><br><br>Zebra<br><img src="https://bettermope.io/skins/zebra.png" id="zebraimg" class="aimg" draggable="false"><br><input id="zebraurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/zebra.png"><br><br>Donkey<br><img src="https://bettermope.io/skins/donkey.png" id="donkeyimg" class="aimg" draggable="false"><br><input id="donkeyurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/donkey.png"><br><br>Cheetah<br><img src="https://bettermope.io/skins/bigcat/cheetah.png" id="cheetahimg" class="aimg" draggable="false"><br><input id="cheetahurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/bigcat/cheetah.png"><br><br>Giraffe<br><img src="https://bettermope.io/skins/giraffe.png" id="giraffeimg" class="aimg" draggable="false"><br><input id="giraffeurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/giraffe.png"><br><br>Lion<br><img src="https://bettermope.io/skins/lion.png" id="lionimg" class="aimg" draggable="false"><br><input id="lionurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/lion.png"><br><br>Gorilla<br><img src="https://bettermope.io/skins/gorilla.png" id="gorillaimg" class="aimg" draggable="false"><br><input id="gorillaurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/gorilla.png"><br><br>Toco Toucan<br><img src="https://bettermope.io/skins/toucan/0/toucan.png" id="tocotoucanimg" class="aimg" draggable="false"><br><input id="tocotoucanurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/toucan/0/toucan.png"><br><br>Bear<br><img src="https://bettermope.io/skins/bear/0.png" id="bearimg" class="aimg" draggable="false"><br><input id="bearurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/bear/0.png"><br><br>Cobra<br><img src="https://bettermope.io/skins/cobra.png" id="cobraimg" class="aimg" draggable="false"><br><input id="cobraurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/cobra.png"><br><br>Cobra Ability<br><img src="https://bettermope.io/skins/cobra2.png" id="cobra_aimg" class="aimg" draggable="false"><br><input id="cobra_aurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/cobra2.png"><br><br>Croc<br><img src="https://bettermope.io/skins/croc.png" id="crocimg" class="aimg" draggable="false"><br><input id="crocurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/croc.png"><br><br>Tiger<br><img src="https://bettermope.io/skins/tiger/0/tiger.png" id="tigerimg" class="aimg" draggable="false"><br><input id="tigerurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/tiger/0/tiger.png">        <br><br>Tiger Ability<br><img src="https://bettermope.io/skins/tiger/0/tiger4.png" id="tiger_aimg" class="aimg" draggable="false"><br><input id="tiger_aurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/tiger/0/tiger4.png"><br><br>Falcon<br><img src="https://bettermope.io/skins/falcon/0/falcon.png" id="falconimg" class="aimg" draggable="false"><br><input id="falconurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/falcon/0/falcon.png"><br><br>Rhino<br><img src="https://bettermope.io/skins/rhino.png" id="rhinoimg" class="aimg" draggable="false"><br><input id="rhinourl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/rhino.png"><br><br>Eagle<br><img src="https://bettermope.io/skins/eagle/0/eagle.png" id="eagleimg" class="aimg" draggable="false"><br><input id="eagleurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/eagle/0/eagle.png"><br><br>Hippo<br><img src="https://bettermope.io/skins/hippo.png" id="hippoimg" class="aimg" draggable="false"><br><input id="hippourl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/hippo.png"><br><br>Boa Constrictor<br><img src="https://bettermope.io/skins/boaConstrictor.png" id="boaimg" class="aimg" draggable="false"><br><input id="boaurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/boaConstrictor.png"><br><br>Boa Constrictor Ability<br><img src="https://bettermope.io/skins/boaConstrictor2.png" id="boa_aimg" class="aimg" draggable="false"><br><input id="boa_aurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/boaConstrictor2.png"><br><br>Ostrich<br><img src="https://bettermope.io/skins/ostrich/ostrich.png" id="ostrichimg" class="aimg" draggable="false"><br><input id="ostrichurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/ostrich/ostrich.png"><br><br>Elephant<br><img src="https://bettermope.io/skins/elephant.png" id="elephantimg" class="aimg" draggable="false"><br><input id="elephanturl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/elephant.png"><br><br>Giant Spider<br><img src="https://bettermope.io/skins/giantSpider/0.png" id="spiderimg" class="aimg" draggable="false"><br><input id="spiderurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/giantSpider/0.png"><br><br>Dragon<br><img src="https://bettermope.io/skins/dragon.png" id="dragonimg" class="aimg" draggable="false"><br><input id="dragonurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/dragon.png"><br><br>Trex<br><img src="https://bettermope.io/skins/trex/0/trex.png" id="treximg" class="aimg" draggable="false"><br><input id="trexurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/trex/0/trex.png"><br><br>Dino Monster<br><img src="https://bettermope.io/skins/dinomonster.png" id="dinoimg" class="aimg" draggable="false"><br><input id="dinourl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/dinomonster.png"><br><br></div><div id="oceanskins" style="display: none"><br>Shrimp<br><img src="https://bettermope.io/skins/shrimp.png" id="shrimpimg" class="aimg" draggable="false"><br><input id="shrimpurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/shrimp.png"><br><br>Trout<br><img src="https://bettermope.io/skins/trout.png" id="troutimg" class="aimg" draggable="false"><br><input id="trouturl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/trout.png"><br><br>Crab<br><img src="https://bettermope.io/skins/crab.png" id="crabimg" class="aimg" draggable="false"><br><input id="craburl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/crab.png"><br><br>Crab Ability<br><img src="https://bettermope.io/skins/crab2.png" id="crab_aimg" class="aimg" draggable="false"><br><input id="crab_aurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/crab2.png"><br><br>Sea Horse<br><img src="https://bettermope.io/skins/seahorse.png" id="seahorseimg" class="aimg" draggable="false"><br><input id="seahorseurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/seahorse.png"><br><br>Squid<br><img src="https://bettermope.io/skins/squid.png" id="squidimg" class="aimg" draggable="false"><br><input id="squidurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/squid.png"><br><br>Jellyfish<br><img src="https://bettermope.io/skins/jellyfish.png" id="jellyfishimg" class="aimg" draggable="false"><br><input id="jellyfishurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/jellyfish.png"><br><br>Turtle<br><img src="https://bettermope.io/skins/turtle.png" id="turtleimg" class="aimg" draggable="false"><br><input id="turtleurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/turtle.png"><br><br>Turtle Ability<br><img src="https://bettermope.io/skins/turtle2.png" id="turtle_aimg" class="aimg" draggable="false"><br><input id="turtle_aurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/turtle2.png"><br><br>Stingray<br><img src="https://bettermope.io/skins/stingray.png" id="stingrayimg" class="aimg" draggable="false"><br><input id="stingrayurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/stingray.png"><br><br>Pufferfish<br><img src="https://bettermope.io/skins/pufferfish.png" id="pufferfishimg" class="aimg" draggable="false"><br><input id="pufferfishurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/pufferfish.png"><br><br>Pufferfish Ability<br><img src="https://bettermope.io/skins/pufferfish2.png" id="pufferfish_aimg" class="aimg" draggable="false"><br><input id="pufferfish_aurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/pufferfish2.png"><br><br>Swordfish<br><img src="https://bettermope.io/skins/swordfish.png" id="swordfishimg" class="aimg" draggable="false"><br><input id="swordfishurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/swordfish.png"><br><br>Swordfish Ability<br><img src="https://bettermope.io/skins/swordfish2.png" id="swordfish_aimg" class="aimg" draggable="false"><br><input id="swordfish_aurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/swordfish2.png"><br><br>Pelican<br><img src="https://bettermope.io/skins/pelican/pelican.png" id="pelicanimg" class="aimg" draggable="false"><br><input id="pelicanurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/pelican/pelican.png"><br><br>Octopus<br><img src="https://bettermope.io/skins/octopus.png" id="octopusimg" class="aimg" draggable="false"><br><input id="octopusurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/octopus.png"><br><br>Shark<br><img src="https://bettermope.io/skins/shark.png" id="sharkimg" class="aimg" draggable="false"><br><input id="sharkurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/shark.png"><br><br>Killer Whale<br><img src="https://bettermope.io/skins/killerwhale.png" id="orcaimg" class="aimg" draggable="false"><br><input id="orcaurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/killerwhale.png"><br><br>Blue Whale<br><img src="https://bettermope.io/skins/whale/0/whale.png" id="whaleimg" class="aimg" draggable="false"><br><input id="whaleurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/whale/0/whale.png"><br><br>Kraken<br><img src="https://bettermope.io/skins/kraken.png" id="krakenimg" class="aimg" draggable="false"><br><input id="krakenurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/kraken.png">        <br><br>Sea Monster<br><img src="https://bettermope.io/skins/seaMonster.png" id="seamonsterimg" class="aimg" draggable="false"><br><input id="seamonsterurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/seaMonster.png">        <br><br>Megalodon<br><img src="https://bettermope.io/skins/megalodon/megalodon.png" id="megaimg" class="aimg" draggable="false"><br><input id="megaurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/megalodon/megalodon.png"></div><div id="arcticskins" style="display: none"><br>Chipmunk<br><img src="https://bettermope.io/skins/arctic/chipmunk.png" id="chipmunkimg" class="aimg" draggable="false"><br><input id="chipmunkurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/arctic/chipmunk.png"><br><br><br>Arctic Hare<br><img src="https://bettermope.io/skins/arctic/arctichare.png" id="arctichareimg" class="aimg" draggable="false"><br><input id="arctichareurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/arctic/arctichare.png"><br><br><br>Penguin<br><img src="https://bettermope.io/skins/arctic/penguin.png" id="penguinimg" class="aimg" draggable="false"><br><input id="penguinurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/arctic/penguin.png"><br><br><br>Seal<br><img src="https://bettermope.io/skins/arctic/seal.png" id="sealimg" class="aimg" draggable="false"><br><input id="sealurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/arctic/seal.png"><br><br><br>Reindeer<br><img src="https://bettermope.io/skins/arctic/reindeer.png" id="reindeerimg" class="aimg" draggable="false"><br><input id="reindeerurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/arctic/reindeer.png"><br><br><br>Arctic Fox<br><img src="https://bettermope.io/skins/arctic/arcticfox.png" id="arcticfoximg" class="aimg" draggable="false"><br><input id="arcticfoxurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/arctic/arcticfox.png"><br><br><br>Muskox<br><img src="https://bettermope.io/skins/arctic/muskox.png" id="muskoximg" class="aimg" draggable="false"><br><input id="muskoxurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/arctic/muskox.png"><br><br>Muskox Ability<br><img src="https://bettermope.io/skins/arctic/muskox2.png" id="muskox_aimg" class="aimg" draggable="false"><br><input id="muskox_aurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/arctic/muskox2.png"><br><br><br>Wolf<br><img src="https://bettermope.io/skins/arctic/wolf.png" id="wolfimg" class="aimg" draggable="false"><br><input id="wolfurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/arctic/wolf.png"><br><br><br>Snowy Owl<br><img src="https://bettermope.io/skins/snowyowl/snowyowl.png" id="snowyowlimg" class="aimg" draggable="false"><br><input id="snowyowlurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/snowyowl/snowyowl.png"><br><br><br>Snow Leopard<br><img src="https://bettermope.io/skins/arctic/snowleopard.png" id="snowleopardimg" class="aimg" draggable="false"><br><input id="snowleopardurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/arctic/snowleopard.png"><br><br><br>Walrus<br><img src="https://bettermope.io/skins/arctic/walrus.png" id="walrusimg" class="aimg" draggable="false"><br><input id="walrusurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/arctic/walrus.png"><br><br><br>Polar Bear<br><img src="https://bettermope.io/skins/arctic/polarbear.png" id="polarbearimg" class="aimg" draggable="false"><br><input id="polarbearurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/arctic/polarbear.png"><br><br><br>Wolverine<br><img src="https://bettermope.io/skins/arctic/wolverine.png" id="wolverineimg" class="aimg" draggable="false"><br><input id="wolverineurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/arctic/wolverine.png"><br><br><br>Sabertooth Tiger<br><img src="https://bettermope.io/skins/sabertoothtiger.png" id="sabertoothimg" class="aimg" draggable="false"><br><input id="sabertoothurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/sabertoothtiger.png"><br><br><br>Mammoth<br><img src="https://bettermope.io/skins/arctic/mammoth/0.png" id="mammothimg" class="aimg" draggable="false"><br><input id="mammothurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/arctic/mammoth/0.png"><br><br><br>Yeti<br><img src="https://bettermope.io/skins/arctic/yeti.png" id="yetiimg" class="aimg" draggable="false"><br><input id="yetiurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/arctic/yeti.png">        <br><br><br>Ice Monster<br><img src="https://bettermope.io/skins/monsters/icemonster/icemonster_.png" id="icemonsterimg" class="aimg" draggable="false"><br><input id="icemonsterurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/monsters/icemonster/icemonster_.png"></div><div id="volcanoskins" style="display: none"><br>Phoenix<br><img src="https://bettermope.io/skins/phoenix/0/phoenix.png" id="phoeniximg" class="aimg" draggable="false"><br><input id="phoenixurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/phoenix/0/phoenix.png">        <br><br><br>Land Monster<br><img src="https://bettermope.io/skins/monsters/lavamonster/lavamonster.png" id="landmonsterimg" class="aimg" draggable="false"><br><input id="landmonsterurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/monsters/lavamonster/lavamonster.png"><br><br><br>Black Dragon<br><img src="https://bettermope.io/skins/blackdragon/blackdragon.png" id="bdimg" class="aimg" draggable="false"><br><input id="bdurl" class="atext" type="text" spellcheck="false" value="https://bettermope.io/skins/blackdragon/blackdragon.png"></div></center>`;
    skinswitcher.style.padding = "1vh";
    skinswitcher.style.font = "bold 2vh Arial";
    skinswitcher.style.textAlign = "right";
    skinswitcher.style.display = "none";
    skinswitcher.style.color = "rgb(0, 0, 0)";
    skinswitcher.style.background = "rgba(16, 180, 44, 0.9)";
    skinswitcher.style.position = "absolute";
    skinswitcher.style.borderRadius = "1vh";
    skinswitcher.style.top = "50%";
    skinswitcher.style.border = "0.8vh outset darkgreen";
    skinswitcher.style.left = "50%";
    skinswitcher.style.transform = "translate(-50%, -50%)";
    skinswitcher.style.maxWidth = "40%";
    skinswitcher.style.width = "40%";
    skinswitcher.style.zIndex = "10000";
    skinswitcher.style.maxHeight = "80%";
    skinswitcher.style.height = "80%";
    skinswitcher.style.overflow = "auto";
    document.body.append(skinswitcher);
    
    var openswitcher = document.createElement("img");
    openswitcher.id = 'openswitcher';
    openswitcher.style.padding = '1vh';
    openswitcher.style.display = "block";
    openswitcher.style.color = 'rgb(0,0,0)';
    openswitcher.style.background = 'rgba(16,172,44,0.6)';
    openswitcher.style.position = "absolute";
    openswitcher.style.borderRadius = '1vh';
    openswitcher.style.bottom = '1.3vh';
    openswitcher.style.right = '1.3vh';
    openswitcher.style.border = "0.8vh outset darkgreen";
    openswitcher.style.cursor = 'pointer';
    openswitcher.style.zIndex = 10000;
    openswitcher.style.width = '5vh';
    openswitcher.style.height = '5vh';
    openswitcher.title = "Open Skin Switcher";
    openswitcher.src = "https://www.clipartmax.com/png/full/286-2860346_neondragon-mope-io-black-dragon-skin.png";
    openswitcher.width = "35";
    openswitcher.height = "35";
    openswitcher.onclick = function(){document.getElementById('skinswitcher').style.display = document.getElementById('skinswitcher').style.display == 'block' ? 'none' : 'block';};
    openswitcher.onmousedown = function(){openswitcher.style.borderStyle = 'inset';};
    openswitcher.onmouseup = function(){openswitcher.style.borderStyle = 'outset';};
    document.body.appendChild(openswitcher);
    
    setInterval(function() {
        openswitcher.style.display = hide_interface ? "none" : "block";
    }, 5);
    
    var switcherstyle = document.createElement('style');
    switcherstyle.innerText = `
    #skinswitcher::-webkit-scrollbar {
        background: 0 0;
        overflow: visible;
        width: 1.25vh
    }
    
    #skinswitcher::-webkit-scrollbar-thumb {
        background-color: #1c651f;
        border: solid #1c651f
    }
    
    #skinswitcher::-webkit-scrollbar-track-piece {
        background-color: rgba(37, 131, 31, .3)
    }
    
    #skinswitcher::-webkit-scrollbar-corner {
        background: 0 0
    }
    
    #skinswitcher::-webkit-scrollbar-thumb {
        background-color: #248329;
        -webkit-box-shadow: inset 0.125vh 0.125vh 0 rgba(0, 0, 0, .1), inset 0 -0.125vh 0 rgba(0, 0, 0, .07)
    }
    
    #skinswitcher::-webkit-scrollbar-thumb:hover {
        background-color: #1c651f
    }
    
    .skinbtn {
        font: 1.8vh Arial;
        padding: 0.4vh;
        margin: 0.3vh;
        border-style: none;
    }
    
    .skinbtn:hover {
        background-color: #DCDCDC;
    }
    
    .skinbtn:active {
        background-color: #CCCCCC;
    }
    
    .aimg {
        width: 13vh;
        height: 13vh;
    }
    
    .atext {
        font: 1.7vh Arial;
        width: 52vh;
        height: 2vh;
        padding: 0.3vh;
        text-align: center;
        border-style: none;
    }
    `;
    document.querySelector('head').append(switcherstyle);
    
    window.switchBiomeTab = function(biome) {
        document.getElementById('landskins').style.display = (biome == 0 ? 'block' : 'none');
        document.getElementById('oceanskins').style.display = (biome == 1  ? 'block' : 'none');
        document.getElementById('arcticskins').style.display = (biome == 2  ? 'block' : 'none');
        document.getElementById('volcanoskins').style.display = (biome == 3  ? 'block' : 'none');
    }
    
    var assets = {
        "mouse": "https://bettermope.io/skins/mouse.png",
        "rabbit": "https://bettermope.io/skins/rabbit.png",
        "pig": "https://bettermope.io/skins/pig.png",
        "mole": "https://bettermope.io/skins/mole.png",
        "pigeon": "https://bettermope.io/skins/pigeon/0/pigeon.png",
        "deer": "https://bettermope.io/skins/deer.png",
        "fox": "https://bettermope.io/skins/fox.png",
        "hedgehog": "https://bettermope.io/skins/hedgehog.png",
        "zebra": "https://bettermope.io/skins/zebra.png",
        "donkey": "https://bettermope.io/skins/donkey.png",
        "cheetah": "https://bettermope.io/skins/bigcat/cheetah.png",
        "giraffe": "https://bettermope.io/skins/giraffe.png",
        "lion": "https://bettermope.io/skins/lion.png",
        "gorilla": "https://bettermope.io/skins/gorilla.png",
        "tocotoucan": "https://bettermope.io/skins/toucan/0/toucan.png",
        "bear": "https://bettermope.io/skins/bear/0.png",
        "cobra": "https://bettermope.io/skins/cobra.png",
        "cobra_a": "https://bettermope.io/skins/cobra2.png",
        "croc": "https://bettermope.io/skins/croc.png",
        "tiger": "https://bettermope.io/skins/tiger/0/tiger.png",
        "tiger_a": "https://bettermope.io/skins/tiger/0/tiger4.png",
        "falcon": "https://bettermope.io/skins/falcon/0/falcon.png",
        "rhino": "https://bettermope.io/skins/rhino.png",
        "eagle": "https://bettermope.io/skins/eagle/0/eagle.png",
        "hippo": "https://bettermope.io/skins/hippo.png",
        "boa": "https://bettermope.io/skins/boaConstrictor.png",
        "boa_a": "https://bettermope.io/skins/boaConstrictor2.png",
        "ostrich": "https://bettermope.io/skins/ostrich/ostrich.png",
        "elephant": "https://bettermope.io/skins/elephant.png",
        "spider": "https://bettermope.io/skins/giantSpider/0.png",
        "dragon": "https://bettermope.io/skins/dragon.png",
        "trex": "https://bettermope.io/skins/trex/0/trex.png",
        "dino": "https://bettermope.io/skins/dinomonster.png",
    
        "shrimp": "https://bettermope.io/skins/shrimp.png",
        "trout": "https://bettermope.io/skins/trout.png",
        "crab": "https://bettermope.io/skins/crab.png",
        "crab_a": "https://bettermope.io/skins/crab2.png",
        "seahorse": "https://bettermope.io/skins/seahorse.png",
        "squid": "https://bettermope.io/skins/squid.png",
        "jellyfish": "https://bettermope.io/skins/jellyfish.png",
        "turtle": "https://bettermope.io/skins/turtle.png",
        "turtle_a": "https://bettermope.io/skins/turtle2.png",
        "stingray": "https://bettermope.io/skins/stingray.png",
        "pufferfish": "https://bettermope.io/skins/pufferfish.png",
        "pufferfish_a": "https://bettermope.io/skins/pufferfish2.png",
        "swordfish": "https://bettermope.io/skins/swordfish.png",
        "swordfish_a": "https://bettermope.io/skins/swordfish2.png",
        "pelican": "https://bettermope.io/skins/pelican/pelican.png",
        "octopus": "https://bettermope.io/skins/octopus.png",
        "shark": "https://bettermope.io/skins/shark.png",
        "orca": "https://bettermope.io/skins/killerwhale.png",
        "whale": "https://bettermope.io/skins/whale/0/whale.png",
        "kraken": "https://bettermope.io/skins/kraken.png",
        "seamonster": "https://bettermope.io/skins/seaMonster.png",
        "mega": "https://bettermope.io/skins/megalodon/megalodon.png",
    
        "chipmunk": "https://bettermope.io/skins/arctic/chipmunk.png",
        "arctichare": "https://bettermope.io/skins/arctic/arctichare.png",
        "penguin": "https://bettermope.io/skins/arctic/penguin.png",
        "seal": "https://bettermope.io/skins/arctic/seal.png",
        "reindeer": "https://bettermope.io/skins/arctic/reindeer.png",
        "arcticfox": "https://bettermope.io/skins/arctic/arcticfox.png",
        "muskox": "https://bettermope.io/skins/arctic/muskox.png",
        "muskox_a": "https://bettermope.io/skins/arctic/muskox2.png",
        "wolf": "https://bettermope.io/skins/arctic/wolf.png",
        "snowyowl": "https://bettermope.io/skins/snowyowl/snowyowl.png",
        "snowleopard": "https://bettermope.io/skins/arctic/snowleopard.png",
        "walrus": "https://bettermope.io/skins/arctic/walrus.png",
        "polarbear": "https://bettermope.io/skins/arctic/polarbear.png",
        "wolverine": "https://bettermope.io/skins/arctic/wolverine.png",
        "sabertooth": "https://bettermope.io/skins/sabertoothtiger.png",
        "mammoth": "https://bettermope.io/skins/arctic/mammoth/0.png",
        "yeti": "https://bettermope.io/skins/arctic/yeti.png",
        "icemonster": "https://bettermope.io/skins/monsters/icemonster/icemonster_.png",
    
        "phoenix": "https://bettermope.io/skins//phoenix/0/phoenix.png",
        "landmonster": "https://bettermope.io/skins/monsters/lavamonster/lavamonster.png",
        "bd": "https://bettermope.io/skins/blackdragon/blackdragon.png"
    };
    
    var blackassets = {
        "mouse": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-mouse.png",
        "rabbit": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-rabbit.png",
        "pig": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-pig.png",
        "mole": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-mole.png",
        "deer": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-deer.png",
        "hedgehog": "https://media.discordapp.net/attachments/371011006740037653/1065825030107312239/Untitled_-_2023-01-19T185103.png",
        "fox": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-fox.png",
        "zebra": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-zebra.png",
        "donkey": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-donkey.png",
        "cheetah": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-cheetah.png",
        "giraffe": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-giraffe.png",
        "lion": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-lion.png",
        "gorilla": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-gorilla.png",
        "bear": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-bear.png",
        "cobra": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-cobra.png",
        "cobra_a": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-cobra2.png",
        "croc": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-croc.png",
        "tiger": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-tiger.png",
        "tiger_a": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-tiger2.png",
        "rhino": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-rhino.png",
        "hippo": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-hippo.png",
        "boa": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-boaConstrictor.png",
        "boa_a": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-boaConstrictor2.png",
        "elephant": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-elephant.png",
        "spider": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-giantSpider.png",
        "dragon": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/pseudo-black-dragon.png",
        "trex": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/tbmods/mope/skins/volcanic/black-trex.png",
    
        "shrimp": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-shrimp.png",
        "trout": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-trout.png",
        "crab": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-crab.png",
        "crab_a": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-crab2.png",
        "seahorse": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-seahorse.png",
        "squid": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-squid.png",
        "jellyfish": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-jellyfish.png",
        "turtle": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-turtle.png",
        "turtle_a": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-turtle2.png",
        "stingray": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-stingray.png",
        "pufferfish": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-pufferfish.png",
        "pufferfish_a": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-pufferfish2.png",
        "swordfish": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-swordfish.png",
        "swordfish_a": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-swordfish2.png",
        "octopus": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-octopus.png",
        "shark": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-shark.png",
        "orca": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-killerwhale.png",
        "whale": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-bluewhale.png",
        "kraken": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-kraken.png",
    
        "chipmunk": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-chipmunk.png",
        "arctichare": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-arctichare.png",
        "penguin": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-penguin.png",
        "seal": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-seal.png",
        "reindeer": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-reindeer.png",
        "arcticfox": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-arcticfox.png",
        "muskox": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-muskox.png",
        "muskox_a": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-muskox2.png",
        "wolf": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-wolf.png",
        "snowleopard": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-snowleopard.png",
        "walrus": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-walrus.png",
        "polarbear": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-polarbear.png",
        "wolverine": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-wolverine.png",
        "sabertooth": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-sabertoothtiger.png",
        "mammoth": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-mammoth.png",
        "yeti": "https://gitlab.teddybear.pro/TeddyBearX/tb-mods-mopeio/-/raw/main/Teddy%20Bear%20Extension%203.0/skins/volcanic/black-yeti.png"
    };
    
    window.setSkinPreset = function(preset) {
        switch (preset) {
            case 0:
                preset = blackassets;
                break;
            default:
                return;
        }
    
        for (let [k, v] of Object.entries(preset)) {
            if (document.getElementById(`${k}url`)) document.getElementById(`${k}url`).value = v;
        }
    }
    
    var urls = Object.values(assets);
    var names = Object.keys(assets);
    
    window.setSkinValues = function(reset = false) {
        var savedimgs = reset ? {} : JSON.parse(localStorage.savedimgs || "{}");
        for (let i of names) {
            document.getElementById(`${i}url`).value = savedimgs[i] || assets[i];
        }
    }; setSkinValues();
    
    var curAssets = Object.assign({}, assets);
    
    var letLoad = Object.assign({}, assets);
    for (let i of names) {
        letLoad[i] = true;
    }
    
    var lastDraw = Object.assign({}, assets);
    for (let i of names) {
        lastDraw[i] = Date.now();
    }
    
    var allAssets = {};
    
    for (let i of names) {
        allAssets[i] = [curAssets[i]];
    
        document.getElementById(`${i}img`).onerror = function(reddit = false) {
            console.log('err');
            if (typeof reddit != 'boolean') reddit = false;
            document.getElementById(`${i}img`).src =
            reddit ? "https://media.discordapp.net/attachments/371011006740037653/1065140371547488277/reddit.png" :
            "https://media.discordapp.net/attachments/371011006740037653/1056765606738796604/a.png";
            clearTimeout(document.getElementById(`${i}img`).loadInterval);
            letLoad[i] = false;
            document.getElementById(`${i}img`).loadInterval = setTimeout(function(){
                letLoad[i] = true;
            }, 1000);
        }
    }
    
    setInterval(function(){
        var result = {};
        for (let i of names) {
            let url = document.getElementById(`${i}url`).value;
            if (url.includes("redd.it")) {
                document.getElementById(`${i}img`).onerror(true);
                continue;
            }
    
            document.getElementById(`${i}img`).src = url;
            result[i] = curAssets[i] = url;
    
            if (allAssets[i].length == 4) allAssets[i].splice(1, 1);
            if (letLoad[i] && !allAssets[i].includes(url)) allAssets[i].push(url);
        }
        localStorage.savedimgs = JSON.stringify(result);
    }, 500)
    
    var olddrawimg = ctx.drawImage;
    ctx.drawImage = function(a) {
        if (a.src) a.src = a.src.split("?x=1")[0];
    
        if (a.src?.includes("/img/")) return olddrawimg.apply(this, arguments);
    
        first:
        for (let i in urls) {
            if (!letLoad[names[i]]) continue;
            if (Date.now() - lastDraw[names[i]] < 1000) continue;
            if (a.src == curAssets[names[i]]) continue;
            if (a.src == (curAssets[names[i]] + `?og=${names[i]}`)) continue;
    
            for (let o in allAssets[names[i]]) {
                if (a.src != allAssets[names[i]][o]) continue first;
                allAssets[names[i]][o] = a.src = curAssets[names[i]] + (curAssets[names[i]] != assets[names[i]] ? `?og=${names[i]}` : '');
                lastDraw[names[i]] = Date.now();
                console.log(a.src);
                continue first;
            }
        }
        try {
            olddrawimg.apply(this, arguments);
        } catch (err) {}
    };
    
    // Keydown Event Listeners
    
    window.isTyping = function(evt) { // check name input but a lot better
        const formElements = ['INPUT', 'TEXTAREA', 'SELECT', 'OPTION'];
        evt = evt || window.event;
        if (formElements.includes(evt.target.tagName)) {
            return true; //yes user is typing
        } else {
            return false; //no user is not typing
        }
    }
    
    document.addEventListener('keydown', function(e) {
        if (isTyping(e)) {
            for (let i of names) {
                lastDraw[i] = Date.now();
            }
        }
    
        var key = e.code;
        switch (key) {
            case "Escape":
                window[vars.ESC_down] = !window[vars.ESC_down];
                epicPopup(`Movement lock: ${window[vars.ESC_down] ? "ON" : "OFF"}`, 2);
                break;
            case "PageUp": // Find #1
                if (!isTyping(e)) find();
                break;
            case "Delete": // Toggle Menu
                if (isTyping(e) || !e.ctrlKey) return;
                document.getElementById('startMenuWrapper').style.display == 'block' ?
                    document.getElementById('startMenuWrapper').style.display = 'none' :
                document.getElementById('startMenuWrapper').style.display = 'block';
                break;
            case "PageDown": // Spectate In Game
                if (isTyping(e)) return;
                if (!window[vars.serverCon_aliveInAGame]) return;
                if (window[vars.isSpectateMode]) {
                    var menuTimeout = setTimeout(clearInterval, 5000, menuInterval);
                    var menuInterval = setInterval(function(){
                        if (document.getElementById('startMenuWrapper').style.display == 'block') {
                            document.getElementById('startMenuWrapper').style.display = 'none';
                            clearInterval(menuInterval);
                            clearTimeout(menuTimeout);
                        }
                    }, 5);
                }
                window[vars.wsSendMsg](spec);
                break;
            case togglechoice:
                if (isTyping(e)) return;
                if (window[vars.serverCon_aliveInAGame]) window[vars.aniChoice_isOpen] = !window[vars.aniChoice_isOpen];
                break;
            case alias:
                if (isTyping(e)) return;
                if (document.getElementById('startMenuWrapper').style.display == 'block') {
                    e.ctrlKey ? generateName(1): generateName(0);
                }
                break;
                // case 73:
                //     if (isTyping(e)) return;
                //     autoUpgrade = !autoUpgrade;
                //     //epicPopup(`Auto Upgrade is ${autoUpgrade ? 'ON' : 'OFF'}`, 2, 'success');
                //     break;
            case "Digit0": // Chat Hotkeys
                if (isTyping(e)) return;
                if (aniChoice_isOpen) {
                    if (window[vars.aniChoice_choiceButtons][9]) window[vars.aniChoiceButtonClicked](window[vars.aniChoice_choiceButtons][9]);
                    return;
                }
                if (!e.ctrlKey) {
                    let result = '';
                    for (let i in presets) {
                        i = Number(i);
                        result += `Chat Hotkey ${i + 1}: ${presets[i]}${i != presets.length - 1 ? '\n' : ''}`;
                    }
                    epicPopup(result, 3, 'success');
                } else {
                    if (!confirm('Edit Chat Hotkeys?')) return;
                    var msgtoedit = prompt('Which hotkey? (1-9)\n\nType /del to delete all.');
                    if (msgtoedit == '/del') {
                        presets = ["","","","","","","","",""];
                        localStorage.setItem('epichotkeys','["","","","","","","","",""]');
                        epicPopup('All Chat Hotkeys Reset!', 2, 'success');
                    } else if (msgtoedit != null) {
                        msgtoedit = Number(msgtoedit);
                        if (msgtoedit >= 1 && msgtoedit <= 9) {
                            if (Number.isInteger(msgtoedit)) {
                                var finaledit = prompt(`New Message for hotkey ${msgtoedit}\n\nType '/del' to delete.`, presets[msgtoedit-1]);
                                if (finaledit == '/del') {
                                    presets[msgtoedit - 1] = '';
                                    let result = '';
                                    for (let i in presets) result += `${i == 0 ? '[' : ''}"${presets[i]}"${i == presets.length - 1 ? ']' : ','}`;
                                    localStorage.setItem('epichotkeys', result);
                                    epicPopup('Chat Hotkey deleted.', 2, 'success');
                                } else {
                                    presets[msgtoedit - 1] = finaledit;
                                    let result = '';
                                    for (let i in presets) result += `${i == 0 ? '[' : ''}"${presets[i]}"${i == presets.length - 1 ? ']' : ','}`;
                                    localStorage.setItem('epichotkeys', result);
                                    epicPopup('Chat Hotkey set!', 2, 'success');
                                }
                            }
                        } else {
                            epicPopup('Invalid Hotkey!', 2, 'error');
                        }
                    }
                }
                break;
            case "Digit1":
            case "Digit2":
            case "Digit3":
            case "Digit4":
            case "Digit5":
            case "Digit6":
            case "Digit7":
            case "Digit8":
            case "Digit9":
                if (isTyping(e)) return;
                if (window[vars.aniChoice_isOpen] && window[vars.aniChoice_choiceButtons][key.replace("Digit", "") - 1]) window[vars.aniChoiceButtonClicked](window[vars.aniChoice_choiceButtons][key.replace("Digit", "") - 1]);
                else if (window[vars.aniChoice_isOpen] && presets[Number(key.replace("Digit", "")) - 1] != '') sendPreset(Number(key.replace("Digit", "")));
                break;
            case "Minus":
                if (isTyping(e)) return;
                if (window[vars.aniChoice_isOpen] && window[vars.aniChoice_choiceButtons][10]) {
                    window[vars.aniChoiceButtonClicked](window[vars.aniChoice_choiceButtons][10]);
                }
                break;
            case "Backquote":
                if (isTyping(e)) return;
                clearInterval(outsideTimeout);
                showPopup = false;
                epicPopupDiv.style.background = 'rgba(0, 255, 0, 0.8)';
                epicPopupDiv.style.borderColor = 'green';
                break;
            case ignoreplayers: {
                if (window[vars.aniChoice_isOpen] || isTyping(e)) return;
                let playersOnScreen = getPlayers(true);
                let options = [];
    
                for (let player of playersOnScreen) {
                    player.ignoreNick = player.nickName;
                    if (player.id == window[vars.myPlayerID]) {
                        player.ignoreNick = 'You';
                    };
                };
                let displayMsg = 'Please type the number corresponding with the player to be ignored:';
                for (let i in playersOnScreen) {
                    displayMsg += `\n${Number(i) + 1} - ${playersOnScreen[i].ignoreNick.split('\n')[0]}`;
                    options.push(Number(i) + 1);
                };
                let playerIgnore = Number(prompt(displayMsg));
                if (!playerIgnore)
                    return;
                for (let i in options) {
                    if (playerIgnore == Number(i) + 1) {
                        ignoredUsers.push(playersOnScreen[i].id);
                    };
                };
                epicPopup('Player Ignored!', 2);
                break;
            }
            case unignoreplayers: {
                if (window[vars.aniChoice_isOpen] || isTyping(e)) return;
                let options = [];
                let displayMsg = 'Please type the number corresponding with the player to be unignored:';
                for (let i in ignoredUsers) {
                    displayMsg += `\n${Number(i) + 1} - ${window[vars.gameObjsByID][ignoredUsers[i]].ignoreNick.split('\n')[0]}`;
                    options.push(Number(i) + 1);
                }
                let playerUnignore = Number(prompt(displayMsg));
                if (!playerUnignore)
                    return;
                for (let i in options) {
                    if (playerUnignore == Number(i) + 1) {
                        ignoredUsers.splice(ignoredUsers.indexOf(ignoredUsers[i].id), 1);
                    };
                };
                epicPopup('Player Unignored!', 2);
                break;
            }
        }
    })
}

if (localStorage.epicmsgread != "true") {
    prompt("If the modpack is not loading correctly, please update the modpack at:", "https://greasyfork.org/en/scripts/455807-epic-modpack");
    localStorage.epicmsgread = "true";
}