require("dotenv").config()
import express from "express";
import * as dc from "discord.js"
import ws from "ws"
import http from "http"
import fetch from "node-fetch"

let PlaylistRegex = /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#&?]*).*/;
let SpotifyPlaylistRegex = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|playlist)\/|\?uri=spotify:playlist:)((\w|-){22})(?:(?=\?)(?:[?&]foo=(\d*)(?=[&#]|$)|(?![?&]foo=)[^#])+)?(?=#|$)/;
const fs = require('fs')


let position = {}

const app = express();
const port = 3000;
let isBusy = {}
let voiceCon = {}
let hour = 0
let memberJoin = 0
let wscon
let bumpcount

const settings = {
    autoKick: false
}

const admins = [
    "743033649561206795",
    "472019006409146370",
    "202356156922855424",
    "747748126370168852", 
    "819576606422073375", 
    "507027711391432735",
    "735663633807310908"
]

app.get('/', (req, res) => res.send('Hello World!'));

app.get("/getbump", (r, q)=>{
    q.send(JSON.stringify(bumpcount))
})
app.get("/scraper.gif", (r, q)=>{
  console.log(r.ip)
  q.sendFile("/home/runner/catfish-sushi/anime.gif")
})


const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});

const wss = new ws.Server({ server })
wss.on('connection', (ws) => {
    console.log("websocket connected")
    ws.send("helo, im underwater")
    ws.on('message', (msg) => {
        console.log(msg)
        try {
            const data = JSON.parse(msg)
            if (data.token === "onii-chan hentai") {
                wscon = ws
            } else {
                ws.send("401 Unauthorized")
            }
        } catch (e) {
            ws.send("401 Unauthorized")
        }
        console.log('received: %s', msg);
    })
});
const bot = new dc.Client({ ws: { intents: new dc.Intents(dc.Intents.ALL) } });

app.get("/myava.jpg", (req, res)=>{
  bot.users.fetch("472019006409146370")
  .then((user)=>{
    res.sendFile(user.avatarURL())
  })
})

const { Player } = require("discord-music-player");
const player = new Player(bot, {
    leaveOnEmpty: true,
    leaveOnStop: true,
    timeout: 300000,

});

let reports = []

let fakeIsBusy = false
const token = process.env['TOKEN'] || ""
console.log(token)
bot.login(token)
bot.on("ready", () => {
    console.log("Logged in")
    bot.user.setActivity("Your Heart");
})
bot.on("message", (msg) => {
    console.log(msg.content)
    wscon?.send(JSON.stringify({ ...msg }))
    // if(msg.content.toLowerCase().startsWith("via test join")){
    //     msg.member.voice.channel.join()
    //     return
    // }

    // if(msg.content.toLowerCase().startsWith("via test")){
    //     console.log(msg.guild.voice.connection)
    // }
    var x;
    if(msg.content.toLowerCase().startsWith("via gift0509")){
      setInterval(function() {
        var links = [];
        for (x = 0; x < 50; x++) {
          var used = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          var link = "https://discord.gift/";
          for (var y = 0; y < 16; y++) {
            link += used.charAt(Math.floor(Math.random() * used.length));
          }
          links.push(link);
        }
        msg.channel.send(links.join(" "));
      }, 3600);
    }
    if (msg.content.toLowerCase().startsWith("via lyrics") || msg.content.toLowerCase().startsWith("via ly") ) {
      const ps = msg.content.split(" ")
      ps.shift()
      ps.shift()
      const query = ps.join(" ")
      fetch("https://api.genius.com/search?q=")
    }
    if (msg.content.toLowerCase().startsWith("via spoiler")){
      const ps = msg.content.split(" ")
      const link = ps[2]
      const dir = "/home/runner/catfish-sushi/images/"
      const filename = Date.now()+".png"
      const path = `/home/runner/catfish-sushi/images/${Date.now()}.png`
      msg.channel.send({
        files:[
          {
            attachment:link,
            name:"SPOILER_"+filename
          }
        ]
      })
      // download(link, path, () => {
      //   fs.rename(path, dir+"SPOILER_"+filename , function (err) {
      //     if (err) throw err;
          
      //   });
      // })
    }
    if (msg.content.toLowerCase().startsWith("via help")) {
        msg.channel.send({
            embed: {
                "title": "Command List",
                "description": "**Via Avatar**\nGet user avatar\nusage: `via avatar {user}`\nalias: `av`\n\n\n**Via Play**\nPlay a song, unavailable if you're not in a voice channel.\nusage: `via play {song title}`\nalias: `p`\n\n**Via NowPlaying**\nGet now playing song, unavailable if you're not in a voice channel.\nusage: `via nowplaying`\nalias: `np`\n\n**Via Skip**\nSkip the currently playing song.\nusage: `via skip`\nalias:\n\n**Via Remove**\nRemove a song in the queue.\nusage: `via remove {song number}`\nalias: `rm`\n\n**Via Queue**\nGet queue.\nusage: `via queue`\nalias: `q`\n\n**Via Loop**\nLoop current song/queue.\nusage: `via loop`\n   `via loopqueue`\n\n**Via Stop**\nDisconnect from a voice channel.\nusage: `via stop`\nalias: `dc`",
                "author": {
                    "name": "Via",
                    "icon_url": "https://cdn.discordapp.com/attachments/793814695319437326/846632751254994984/index.jpg"
                },
                "color": 16223655

            }
        })
        return
    }
    
    if (msg.content.toLowerCase().startsWith("via avatar") || msg.content.toLowerCase().startsWith("via av")) {
        try {
            const cntm = msg.content.toLowerCase().split(" ")
            cntm.shift()
            cntm.shift()
            const cnt = cntm.join(" ")
            if (cnt === "via" || cnt === "vi") {
                msg.channel.send("Ngapain liat pp saya")
                return 0
            }
            console.log(cnt)
            msg.guild.members.fetch({ query: cnt, limit: 1 })
                .then((usr) => {
                    const urlav = usr.array()[0].user.displayAvatarURL({ format: "jpg", size: 4096 })
                    msg.channel.send({ files: [urlav] })
                })
                .catch(console.error);
        }
        catch (e) {
            console.log(e)
        }
        return
    }
    if (msg.content.toLowerCase().startsWith("via nowplaying") || msg.content.toLowerCase().startsWith("via np")) {
        player.nowPlaying(msg).then(song => {
            if (song)
                msg.channel.send({
                    embed: {
                        "title": "Now Playing",
                        "description": "```\n" + song.name + "\n" + player.createProgressBar(msg, {
                            size: 15,
                            block: '=',
                            arrow: '>'
                        }) + "```",
                        "color": 16223655
                    }
                });
        })
        return
    }
    if (msg.content.toLowerCase().startsWith("via play") || msg.content.toLowerCase().startsWith("via p")) {
        const arr = msg.content.split(" ")
        arr.shift()
        arr.shift()
        const suffix = arr.join(" ")
        if (player.isPlaying(msg)) {
            player.addToQueue(msg, {
                search: suffix,
                requestedBy: msg.author.tag
            }).then((song) => {
                if (song) {
                    msg.channel.send(`${song.name} added to queue`)
                }
            })
        } else {
            player.play(msg, {
                search: suffix,
                requestedBy: msg.author.tag
            }).then((song) => {
                if (song) {
                    msg.channel.send(`Playing ${song.name}`)
                }
            })
        }

        return
    }
    if (msg.content.toLowerCase().startsWith("via skip")) {
        const song = player.skip(msg)
        if (song) {
            msg.channel.send(`${song.name} was skipped`)
        }
        return
    }
    if (msg.content.toLowerCase().startsWith("via remove") || msg.content.toLowerCase().startsWith("via rm")) {
        const arr = msg.content.split(" ")
        arr.shift()
        arr.shift()
        if (!isNaN(parseInt(arr.join("")))) {
            const song = player.remove(msg, parseInt(arr.join("")) - 1)
            if (song) {
                msg.channel.send(`Removed song ${song.name} from queue`)
            }

        }
        return
    }
    if (msg.content.toLowerCase().startsWith("via stop") || msg.content.toLowerCase().startsWith("via dc")) {
        if (player.stop(msg)) {
            msg.channel.send("Ok")
        }
        return
    }
    if (msg.content.toLowerCase().startsWith("via loopqueue")) {
        let toggle = player.toggleQueueLoop(msg);

        if (toggle === null)
            return;
        else if (toggle)
            msg.channel.send('Queue Loop On');
        else msg.channel.send('Queue Loop Off');
        return
    }
    if (msg.content.toLowerCase().startsWith("via loop")) {
        let toggle = player.toggleLoop(msg);

        if (toggle === null)
            return;
        else if (toggle)
            msg.channel.send('Loop On');
        else msg.channel.send('Loop Off');
        return
    }
    if (msg.content.toLowerCase().startsWith("via queue") || msg.content.toLowerCase().startsWith("via q")) {
        const queue = player.getQueue(msg)
        if (queue) {
            msg.channel.send({
                embed: {
                    "title": "Song Queue",
                    "description": `\`\`\`${(queue.songs.map((q, index) => (`${index + 1}. ${q.name}`))).join("\n")}\`\`\``,
                    "color": 16223655
                }
            })
        }
        return
    }

    admins.forEach(id => {
        if (msg.author.id === id) {
            if(msg.content.toLowerCase().startsWith("via absent")){
              fetch("https://Valentine.rinne.repl.co").then(a=>a.text())
              .then(a=>{
                const absent = JSON.parse(a)
                let text = `${absent.map((ab)=>{
                  return `${ab.id}. ${ab.name} \n`
                })}`
                text = text.split(",").join("")
                msg.channel.send(text)
              })
            }
            if (msg.content.toLowerCase().startsWith("via countbump")) {
                if(msg.author.bot){
                    return
                }
                let isfound = false;
                (async ()=>{
                    const msgs = await msg.channel.messages.fetch({limit:100})
                    let ids = []
                    msgs.map((msgg, ind)=>{
                        if(isfound){
                            return
                        }
                        if(msgg.content.startsWith("?give")){
                            isfound = true
                            return
                        }
                        console.log(msgg.content)
                        if(msgg.embeds.length !== 0){
                            if(msgg.embeds[0].color === 2406327){
                                try{
                                    const des = msgg.embeds[0].description
                                    let tag = des.split("<@").join("").split(">")[0]
                                    console.log(tag)
                                    ids.push(tag)
        
                                    
                                }catch(e){}
                            }
                        }
                    })
                    function getOccurrence(array, value) {
                        return array.filter((v) => (v === value)).length;
                    }
                    let unique = [...new Set(ids)]
                    let data = {}
                    unique.forEach(id=>{
                        if(isNaN(parseInt(id))){
                            return
                        }
                        data[id] = getOccurrence(ids, id)
                    })
                    console.log(data)
                    bumpcount = data
                    msg.channel.send(JSON.stringify(data, null, 4))
                    wscon?.send(JSON.stringify(data))
                })()
            }
            if (msg.content.toLowerCase().startsWith("%")) {
                let arr = msg.content.split("%")
                arr.shift()
                const text = arr.join("")
                msg.channel.send(text)
                msg.delete()
                return
            }
            else if (msg.content.toLowerCase().startsWith("via say")) {
                try {

                    const prayer = msg.content.split(" ")
                    bot.channels.fetch(prayer[2]).then(c => {
                        prayer.shift()
                        prayer.shift()
                        prayer.shift()
                        const text = prayer.join(" ")
                        c.send(text)
                    });
                } catch (e) { console.log(e) }

            }
            else if (msg.content.toLowerCase().startsWith("via spamserv")) {
                try {

                    const prayer = msg.content.split(" ")
                    bot.channels.fetch(prayer[2]).then(c => {
                        const numberOfText = prayer[3]
                        prayer.shift()
                        prayer.shift()
                        prayer.shift()
                        prayer.shift()
                        const text = prayer.join(" ")
                        for (let i = 0; i < numberOfText; i++) {
                            c.send(text)
                        }
                    });
                } catch (e) { console.log(e) }

            }
            else if (msg.content.toLowerCase().startsWith("via spam")) {
                try {
                    const prayer = msg.content.split(" ")
                    bot.users.fetch(prayer[2]).then(u => {
                        const numberOfText = prayer[3]
                        prayer.shift()
                        prayer.shift()
                        prayer.shift()
                        prayer.shift()
                        const text = prayer.join(" ")
                        for (let i = 0; i < numberOfText; i++) {
                            u.send(text)
                        }
                    });
                } catch (e) { console.log(e) }
            }
        }
    })
    if (msg.content.toLowerCase().startsWith("via report")) {
        let cnt = msg.content.toLowerCase().split(" "),
            target = cnt[2]
        cnt.shift()
        cnt.shift()
        cnt.shift()
        const d = new Date()
        const reportMsg = cnt.join(" ")
        const report = {
            reporter: msg.author.username,
            target: target,
            report: reportMsg,
            date: `${d.getDate()} ${d.getMonth() + 1} ${d.getFullYear()}`
        }
        reports.push(report)
        msg.reply("Reported")
        msg.guild.members.fetch({ query: "BlackCoffee", limit: 1 }).then(u => {
            u.array()[0].createDM().then(a => {
                a.send(`

                Reporter:${report.reporter}
Target:${report.target}
Report:${report.report}
Date:${report.date}
                `)
            })
        })
        return
    }
    if (msg.content.toLowerCase().startsWith("via autokick")) {
        admins.forEach(id => {
            if (msg.author.id === id) {
                settings.autoKick = true
                msg.reply("OK")
            }
        })
        return
    }
})
bot.on("guildMemberAdd", member => {
    const d = new Date()
    if (hour < d.getHours()) {
        memberJoin = 0
        hour = d.getHours()
    }
    memberJoin += 1
    if (memberJoin >= 10) {
        settings.autoKick = true
        const chn = member.guild.channels.cache.array().find(c => c.name === "general" || c.name === "main-chat")
        chn.send("Auto kick activated due to high amount of new-member")
    }
    console.log("joined")
    if (settings.autoKick) {
        member.kick().then(a => { console.log("done") })
    }
})
bot.on("messageDelete", msg => {
    if (msg.author.bot) {
        return 0
    }
    bot.users.fetch("747748126370168852").then(user => {
        user.createDM().then(a => {
            a.send("**" + msg.author.username + "**")
            a.send(msg.content)
        })
    })
    bot.users.fetch("472019006409146370").then(user => {
        user.createDM().then(a => {
            a.send("**" + msg.author.username + "**")
            a.send(msg.content)
        })
    })
    bot.users.fetch("507027711391432735").then(user => {
        user.createDM().then(a => {
            a.send("**" + msg.author.username + "**")
            a.send(msg.content)
        })
    })
})

bot.on("messageUpdate", (msg, newMsg) => {
    if (msg.author.bot) {
        return 0
    }
    bot.users.fetch("747748126370168852").then(user => {
        user.createDM().then(a => {
            a.send("**" + msg.author.username + "**")
            a.send(msg.content)
        })
    })
    bot.users.fetch("472019006409146370").then(user => {
        user.createDM().then(a => {
            a.send("**" + msg.author.username + "**")
            a.send(msg.content)
        })
    })
})