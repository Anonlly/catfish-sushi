require("dotenv").config()
let isBusy = {}
let voiceCon = {}
const dc = require("discord.js")
const settings = {
    autoKick:false
}

const isoToDate = (duration)=>{
  let charlist = duration.split("")
  let lastnum = ""
  const dur = {h:"", m:"", s:""}
  let d = charlist.map((c, id)=>{
      if(isNaN(parseInt(c))){
          switch(c){
              case "M":
                  dur.m = dur.m+lastnum
                  break
              case "H":
                  dur.h = dur.h+lastnum
                  break
              case "S":
                  dur.s = dur.s+lastnum
                  break
              default:
                  break
          }
      }else{
          if(!isNaN(parseInt(charlist[id-1]))){
              lastnum = lastnum + "" + c
              return
          }
          lastnum = c
          
      }
  })
  const seconds = (parseInt(dur.h)*3600)+(parseInt(dur.m)*60)+parseInt(dur.s)
  return seconds
}

const fetch = require("node-fetch")
const {google} = require("googleapis")
var yt = google.youtube({
   version: 'v3',
   auth: "AIzaSyBtugmskNppTMOpcd9sCtScsMIYGBGmzqM"
});
const search = require("yt-search")
const squeue = {}
let position = {}
const ytdl = require("ytdl-core")
const play = (con, gi)=>{
  const gid = `${gi}`
  console.log(position)
  con.play(ytdl(squeue[gid][position[gid]-1].vlink))
  setTimeout(()=>{
    position[gid] = position[gid] + 1
    play(con, gid)
  }, isoToDate(squeue[gid][position[gid]-1].duration)*1000)
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
let reports = []

const token = process.env['TOKEN'] || ""
console.log(token)
bot.login(token)
bot.on("ready", () => {
    console.log("Logged in")
    bot.user.setActivity("Your Heart");
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


    // if(msg.content.toLowerCase().startsWith("via voice")){
    //   const authid = msg.author.id
    //   msg.guild.members.fetch(authid).then( u => {
    //     u.voice.channel.join().then(c=>{
    //       isBusy = true
    //       voiceCon = c
    //     })
    //   })
    // }


    if(msg.content.toLowerCase().startsWith("via play")){
      (async()=>{
        const holder = msg.content.split(" ")
        holder.shift()
        holder.shift()
        const title = holder.join(" ")
        if(title === "" || title == undefined){
          return 0
        }
        if(!isBusy[msg.guild.id]){
            const authid = msg.author.id
            const u = await msg.guild.members.fetch(authid)
            const c = await u.voice.channel.join()
            isBusy[msg.guild.id] = true
            voiceCon[msg.guild.id] = c
        }
        // const r = await search(title)
        // const res = r.videos.slice(0,1)
        yt.search.list({
          part:"snippet",
          q:title
        }, (err, res)=>{
          if(err) console.log(err)
          const link = "https://www.youtube.com/watch?v="+res.data.items[0].id.videoId
          console.log(res.data.items)
          fetch(`https://www.googleapis.com/youtube/v3/videos?id=${res.data.items[0].id.videoId}&part=contentDetails&key=AIzaSyBtugmskNppTMOpcd9sCtScsMIYGBGmzqM`)
          .then((r)=>r.json())
          .then(r=>{
            console.log(r.items[0].contentDetails)
            if(squeue[msg.guild.id] !== undefined){
              squeue[msg.guild.id].push({
                vlink:link,
                duration:r.items[0].contentDetails.duration,
                title:res.data.items[0].snippet.title
                })
              // console.log(squeue)

              return
            }
            position[msg.guild.id] = 0
            squeue[msg.guild.id] = [{vlink:link, duration:r.items[0].contentDetails.duration,title:res.data.items[0].snippet.title}]
            play(voiceCon[msg.guild.id], msg.guild.id)
            console.log(squeue)
            console.log(squeue[msg.guild.id][position[msg.guild.id]])
          })
          
          voiceCon[msg.guild.id].on("disconnect", ()=>{
            isBusy[msg.guild.id] = false
            voiceCon[msg.guild.id] = undefined
            position[msg.guild.id] = 0
            console.log(isBusy)
            console.log(voiceCon)
            console.log(position)

          })
          // console.log(voiceCon)
          // console.log(isBusy)

        })
      })()

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