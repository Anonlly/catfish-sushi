require("dotenv").config()
import express from "express";
import * as dc from "discord.js"
import avatar from "./avatar"
import db from "../db.json"
import fs from "fs"
import play from "./play.js"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hknnhacamqrcalaqobvh.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

supabase
.from("isBusy")
.select("*")
.eq("gid", "293847298234")
.then((d, e)=>{
    console.log(d.data)
})

db.queue.push({
    gid:"345345345345", 
    queue:[{
        title:"anggep aja title",
        link:"anggep aja link",
        duration:"PT4M2S"
    }]
})

fs.writeFile("../db.json", JSON.stringify(db), (e)=>{
    if(e) throw e
    console.log("wrote")
})

let position = {}
// const play = (con, gi) => {
//     const gid = `${gi}`
//     console.log(position)
//     con.play(ytdl(squeue[gid][position[gid] - 1].vlink))
//     setTimeout(() => {
//         position[gid] = position[gid] + 1
//         play(con, gid)
//     }, isoToDate(squeue[gid][position[gid] - 1].duration) * 1000)
// }
const app = express();
const port = 3000;
let isBusy = {}
let voiceCon = {}
let hour = 0
let memberJoin = 0

const settings = {
    autoKick: false
}

const admins = [
    "743033649561206795",
    "472019006409146370",
    "202356156922855424",
    "747748126370168852"
]

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`listening at http://localhost:${port}`));
const bot = new dc.Client({ ws: { intents: new dc.Intents(dc.Intents.ALL) } });


const { Player } = require("discord-music-player");
const player = new Player(bot, {
    leaveOnEmpty: true,
    leaveOnStop: true,
    timeout:300000,

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
    // if(msg.content.toLowerCase().startsWith("via test join")){
    //     msg.member.voice.channel.join()
    //     return
    // }

    // if(msg.content.toLowerCase().startsWith("via test")){
    //     console.log(msg.guild.voice.connection)
    // }
    if (msg.content.toLowerCase().startsWith("via help")) {
        msg.channel.send({
            embed:{
                "title": "Command List",
                "description": "**Via Avatar**\n\nGet user avatar\nusage: `via avatar {user}`\nalias: `av`\n\n\n**Via Play**\n\nPlay a song, unavailable if you're not in a voice channel.\nusage: `via play {song title}`\nalias: `p`\n\n**Via NowPlaying**\n\nGet now playing song, unavailable if you're not in a voice channel.\nusage: `via nowplaying`\nalias: `np`\n\n**Via Skip**\nSkip the currently playing song.\nusage: `via skip`\nalias:\n\n**Via Remove**\nRemove a song in the queue.\nusage: `via remove {song number}`\nalias: `rm`\n\n**Via Queue**\nGet queue.\nusage: `via queue`\nalias: `q`\n\n**Via Loop**\nLoop current song/queue.\nusage: `via loop`\n   `via loopqueue`\n\n**Via Stop**\nDisconnect from a voice channel.\nusage: `via stop`\nalias: `dc`",
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
        avatar(msg, bot)
        return
    }
    if (msg.content.toLowerCase().startsWith("via nowplaying") || msg.content.toLowerCase().startsWith("via np")) {
        player.nowPlaying(msg).then(song=>{
            if(song)
                msg.channel.send({
                    embed:{
                        "title": "Now Playing",
                        "description": "```\n"+song.name+"\n"+player.createProgressBar(msg, {
                            size: 15,
                            block: '=',
                            arrow: '>'
                        })+"```",
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
        if(player.isPlaying(msg)){
            player.addToQueue(msg, {
                search: suffix,
                requestedBy: msg.author.tag
            }).then((song)=>{
                if(song){
                    msg.channel.send(`${song.name} added to queue`)
                }
            })
        }else{
            player.play(msg, {
                search: suffix,
                requestedBy: msg.author.tag
            }).then((song)=>{
                if(song){
                    msg.channel.send(`Playing ${song.name}`)
                }
            })
        }

        return
    }
    if(msg.content.toLowerCase().startsWith("via skip")){
        const song = player.skip(msg)
        if(song){
            msg.channel.send(`${song.name} was skipped`)
        }
        return
    }
    if(msg.content.toLowerCase().startsWith("via remove") || msg.content.toLowerCase().startsWith("via rm")){
        const arr = msg.content.split(" ")
        arr.shift()
        arr.shift()
        if(!isNaN(parseInt(arr.join("")))){
            const song = player.remove(msg, parseInt(arr.join(""))-1)
            if(song){
                msg.channel.send(`Removed song ${song.name} from queue`)
            }

        }
        return
    }
    if(msg.content.toLowerCase().startsWith("via stop") || msg.content.toLowerCase().startsWith("via dc")){
        if(player.stop(msg)){
            msg.channel.send("Ok")
        }
        return
    }
    if(msg.content.toLowerCase().startsWith("via loopqueue")){
        let toggle = player.toggleQueueLoop(msg);
        
        if(toggle === null)
            return;
        else if (toggle)
            msg.channel.send('Queue Loop On');
        else msg.channel.send('Queue Loop Off');
        return
    }
    if(msg.content.toLowerCase().startsWith("via loop")){
        let toggle = player.toggleLoop(msg);
        
        if(toggle === null)
            return;
        else if (toggle)
            msg.channel.send('Loop On');
        else msg.channel.send('Loop Off');
        return
    }
    if(msg.content.toLowerCase().startsWith("via queue")||msg.content.toLowerCase().startsWith("via q")){
        const queue = player.getQueue(msg)
        if(queue){
            msg.channel.send({
                embed:{
                    "title": "Song Queue",
                    "description": `\`\`\`${(queue.songs.map((q, index)=>(`${index+1}. ${q.name}`))).join("\n")}\`\`\``,
                    "color": 16223655
                  }
            })
        }
        return
    }

    admins.forEach(id => {
        if (msg.author.id === id) {
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