require("dotenv").config()
const dc = require("discord.js")
const fb = require("firebase/app")
require("firebase/firestore")
const settings = {
    autoKick:false
}
const express = require('express');
const app = express();
const port = 3000;
let hour = 0
let memberJoin = 0
app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`listening at http://localhost:${port}`));

const admins = [
    "743033649561206795",
    "472019006409146370",
    "202356156922855424",
    "747748126370168852"
]
const bot = new dc.Client({ ws: { intents: new dc.Intents(dc.Intents.ALL) }});

var firebaseConfig = {
    apiKey: "AIzaSyBMeK5J98-ee_irRAl-9pfGwUZOrPOSFi8",
    authDomain: "via-bot-rin.firebaseapp.com",
    projectId: "via-bot-rin",
    storageBucket: "via-bot-rin.appspot.com",
    messagingSenderId: "660889746199",
    appId: "1:660889746199:web:bfedb912b3d2c1d51c9552",
    measurementId: "G-T7M6QQ5TL1"
  };

let reports = []

const token = process.env['TOKEN'] || ""
console.log(token)
bot.login(token)
bot.on("ready", () => {
    console.log("Logged in")
})
bot.on("message", (msg) => {
    console.log(msg.content)
    if(msg.content.toLowerCase().startsWith("via avatar")){
      try{

        const cntm = msg.content.toLowerCase().split(" ")
        cntm.shift()
        cntm.shift()
        const cnt = cntm.join(" ")
        if(cnt === "via"){
          msg.channel.send("Ngapain liat pp saya")
          return 0
        }
        console.log(cnt)
        msg.guild.members.fetch({ query: cnt, limit: 1 })
        .then((usr)=>{
            const urlav = usr.array()[0].user.displayAvatarURL({format:"jpg", size:4096})
            msg.channel.send({files:[urlav]})
        })
        .catch(console.error);
      }
      catch(e){console.log(e)}
    }
    if(msg.content.toLowerCase().startsWith("via, scat boong gak?")){
        msg.reply("iya")
    }
    admins.forEach(id=>{
        if(msg.author.id === id){
            if(msg.content.toLowerCase().startsWith("%")){
                let arr = msg.content.split("%")
                arr.shift()
                const text = arr.join("")
                msg.channel.send(text)
                msg.delete()
            }
            else if(msg.content.toLowerCase().startsWith("via say")){
              try{

                const prayer = msg.content.split(" ")
                bot.channels.fetch(prayer[2]).then(c=>{
                  prayer.shift()
                  prayer.shift()
                  prayer.shift()
                  const text = prayer.join(" ")
                  c.send(text)
                });
              }catch(e){console.log(e)}
            }
            else if(msg.content.toLowerCase().startsWith("via spam")){
              try{
                const prayer = msg.content.split(" ")
                bot.users.fetch(prayer[2]).then(u=>{
                  const numberOfText = prayer[3]
                  prayer.shift()
                  prayer.shift()
                  prayer.shift()
                  prayer.shift()
                  const text = prayer.join(" ")
                  for(let i = 0; i < numberOfText;i++){
                    u.send(text)
                  }
                });
              }catch(e){console.log(e)}
            }
        }
    })
    if(msg.content.toLowerCase().startsWith("via report")){
        let cnt = msg.content.toLowerCase().split(" "),
        target = cnt[2]
        cnt.shift()
        cnt.shift()
        cnt.shift()
        const d = new Date()
        const reportMsg = cnt.join(" ")
        const report = {
            reporter : msg.author.username,
            target:target,
            report : reportMsg,
            date : `${d.getDate()} ${d.getMonth()+1} ${d.getFullYear()}`
        }
        reports.push(report)
        msg.reply("Reported")
        msg.guild.members.fetch({query:"BlackCoffee", limit:1}).then(u=>{
            u.array()[0].createDM().then(a=>{
                a.send(`

                Reporter:${report.reporter}
Target:${report.target}
Report:${report.report}
Date:${report.date}
                `)
            })
        })
    }
    if(msg.content.toLowerCase().startsWith("via autokick")){
        admins.forEach(id=>{
            if(msg.author.id === id){
                settings.autoKick = true
                msg.reply("OK")
            }
        })

    }
})
bot.on("guildMemberAdd", member => {
    const d = new Date()
    if(hour < d.getHours()){
      memberJoin = 0
      hour = d.getHours()
    }
    memberJoin += 1
    if(memberJoin >= 10){
      settings.autoKick = true
      const chn = member.guild.channels.cache.array().find(c=>c.name === "general" || c.name === "main-chat")
      chn.send("Auto kick activated due to high amount of new-member")
    }
    console.log("joined")
    if(settings.autoKick){
        member.kick().then(a=>{console.log("done")})
    }
})
bot.on("messageDelete", msg=>{
  if(msg.author.bot){
    return 0
  }
  bot.users.fetch("747748126370168852").then(user=>{
    user.createDM().then(a=>{
      a.send("**"+msg.author.username+"**")
      a.send(msg.content)
    })
  })
  bot.users.fetch("472019006409146370").then(user=>{
    user.createDM().then(a=>{
      a.send("**"+msg.author.username+"**")
      a.send(msg.content)
    })
  })
})

bot.on("messageUpdate", (msg, newMsg)=>{
  if(msg.author.bot){
    return 0
  }
  bot.users.fetch("747748126370168852").then(user=>{
    user.createDM().then(a=>{
      a.send("**"+msg.author.username+"**")
      a.send(msg.content)
    })
  })
  bot.users.fetch("472019006409146370").then(user=>{
    user.createDM().then(a=>{
      a.send("**"+msg.author.username+"**")
      a.send(msg.content)
    })
  })
})