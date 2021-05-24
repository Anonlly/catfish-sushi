require("dotenv").config()
import express from "express";
import * as dc from "discord.js"
import { isoToDate } from "./modules.js"
import ytdl from "ytdl-core"
import avatar from "./avatar"
import db from "../db.json"
import fs from "fs"
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

    if (msg.content.toLowerCase().startsWith("via avatar")) {
        avatar(msg)
    }

    if (msg.content.toLowerCase().startsWith("via play")) {
        
    }


    admins.forEach(id => {
        if (msg.author.id === id) {
            if (msg.content.toLowerCase().startsWith("%")) {
                let arr = msg.content.split("%")
                arr.shift()
                const text = arr.join("")
                msg.channel.send(text)
                msg.delete()
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
    }
    if (msg.content.toLowerCase().startsWith("via autokick")) {
        admins.forEach(id => {
            if (msg.author.id === id) {
                settings.autoKick = true
                msg.reply("OK")
            }
        })

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