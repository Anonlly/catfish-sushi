require("dotenv").config()
import fetch from "node-fetch"
import ytdl from "ytdl-core"

// import { isoToDate, queue } from "./modules.js"
import { google } from "googleapis"
import { createClient } from '@supabase/supabase-js'

const isoToDate = (duration) => {
    let charlist = duration.split("")
    let lastnum = ""
    const dur = { h: "0", m: "0", s: "0" }
    let d = charlist.map((c, id) => {
        if (isNaN(parseInt(c))) {
            switch (c) {
                case "M":
                    dur.m = dur.m + lastnum
                    break
                case "H":
                    dur.h = dur.h + lastnum
                    break
                case "S":
                    dur.s = dur.s + lastnum
                    break
                default:
                    break
            }
        } else {
            if (!isNaN(parseInt(charlist[id - 1]))) {
                lastnum = lastnum + "" + c
                return
            }
            lastnum = c

        }
    })
    console.log(dur)
    const seconds = (parseInt(dur.h) * 3600) + (parseInt(dur.m) * 60) + parseInt(dur.s)
    return seconds
}

const supabaseUrl = 'https://hknnhacamqrcalaqobvh.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


const yt = google.youtube({
    version: 'v3',
    auth: "AIzaSyBtugmskNppTMOpcd9sCtScsMIYGBGmzqM"
})

const play = (gid, vc)=>{
    supabase
    .from("queues")
    .select("*")
    .eq("gid", gid)
    .then((res)=>{
        let data
        try{
            data = JSON.parse(res.data[0].queue)
        }catch(e){
            console.log(e)
            console.log(res)
        }
        supabase
        .from("positions")
        .select("*")
        .eq("gid", gid)
        .then((res)=>{
            const pos = res.data[0].pos
            const duration = data[pos].duration
            const sec = isoToDate(duration)
            vc.play(ytdl(data[pos].vlink))
            setTimeout(() => {
                supabase.from("positions")
                .update({pos:pos+1})
                .eq("gid", gid)
                .then((data)=>{
                    play(gid, vc)
                })
            }, sec*1000);
        })
    })
    .catch(e=>{})
}


export default async (msg) => {
    let connection
    const holder = msg.content.split(" ")
    let isfirst
    holder.shift()
    holder.shift()
    const title = holder.join(" ")
    if (title === "" || title == undefined) {
        return 0
    }
    let queue = []
    const {data, err} = await supabase
    .from("queues")
    .select("*")
    .eq("gid", msg.guild.id)
    if(err) console.err(err)
    if(data.length !== 0){
        try{
            queue = JSON.parse(data[0].queue)
        }catch(e){console.log(e)}
    }
    else{
        supabase.from("queues").insert([{
            gid:msg.guild.id,
            queue:JSON.stringify([])
        }]).then((data, err)=>{
            if(err) console.err(err)
        })
    }

    if(msg.guild.voice !== undefined && msg.guild.voice.connection !== undefined && msg.guild.voice.connection !== null){
        connection = msg.guild.voice.connection
        isfirst = false
        
    }else{
        const authid = msg.author.id
        const u = await msg.guild.members.fetch(authid)
        connection = await u.voice.channel.join()
        isfirst = true
    }
    
    // const r = await search(title)
    // const res = r.videos.slice(0,1)
    yt.search.list({
        part: "snippet",
        q: title
    }, (err, res) => {
        if (err) console.log(err)
        const link = "https://www.youtube.com/watch?v=" + res.data.items[0].id.videoId
        // console.log(res.data.items)
        fetch(`https://www.googleapis.com/youtube/v3/videos?id=${res.data.items[0].id.videoId}&part=contentDetails&key=AIzaSyBtugmskNppTMOpcd9sCtScsMIYGBGmzqM`)
            .then((r) => r.json())
            .then(r => {

                queue.push({
                    vlink: link,
                    duration: r.items[0].contentDetails.duration,
                    title: res.data.items[0].snippet.title
                })
                supabase
                .from("queues")
                .update({queue:JSON.stringify(queue)})
                .eq("gid", msg.guild.id)
                .then((data, err)=>{
                    if(err) console.err(err)
                })

                supabase
                .from("positions")
                .select("*")
                .eq("gid", msg.guild.id)
                .then((data, err)=>{
                    (async()=>{
                        if(err) console.err(err)
                        let pos
                        if(data.data.length == 0){
                            pos = 0
                            await supabase.from("positions")
                            .insert({gid:msg.guild.id, pos:0})
                            .then((data, err)=>{
                                console.log("pos add")
                                if (err) console.err(err)
                            })
                        }else{
                            await supabase.from("positions")
                            .select("*")
                            .eq("gid", msg.guild.id)
                            .then((data)=>{
                                if(data.err) console.err(data.err)

                                pos = data.data[0].pos
                            })
                        }
                        if(isfirst || pos >= queue.length){
                            play(msg.guild.id, connection)
                        }else{
                            console.log(msg.guild.voice)
                        }
                    })()
                })
            })

        connection.on("disconnect", () => {
            console.log("voice dc")
            supabase.from("positions")
            .delete()
            .eq("gid", msg.guild.id)
            .then((data, err)=>{
                if(err) console.err(err)
            })
            supabase.from("queues")
            .delete()
            .eq("gid", msg.guild.id)
            .then((data, err)=>{
                if(err) console.err(err)
            })

        })
        // console.log(voiceCon)
        // console.log(isBusy)

    })
}