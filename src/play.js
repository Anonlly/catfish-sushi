import fetch from "node-fetch"
import { isoToDate, queue } from "./modules.js"
import { google } from "googleapis"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hknnhacamqrcalaqobvh.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


const yt = google.youtube({
    version: 'v3',
    auth: "AIzaSyBtugmskNppTMOpcd9sCtScsMIYGBGmzqM"
})

export default async (msg) => {
    const holder = msg.content.split(" ")
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
        }])
    }

    if(!msg.guild.voice.connection){
        const authid = msg.author.id
        const u = await msg.guild.members.fetch(authid)
        const c = await u.voice.channel.join()
    }   
    
    // const r = await search(title)
    // const res = r.videos.slice(0,1)
    yt.search.list({
        part: "snippet",
        q: title
    }, (err, res) => {
        if (err) console.log(err)
        const link = "https://www.youtube.com/watch?v=" + res.data.items[0].id.videoId
        console.log(res.data.items)
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

                supabase
                .from("positions")
                .select("*")
                .eq("gid", msg.guild.id)
                .then((data, err)=>{
                    if(data.length == 0){
                        supabase.from("positions").insert({gid:msg.guild.id, pos:0})
                    }
                })
            })

        voiceCon.on("disconnect", () => {
            position[msg.guild.id] = 0
            supabase.from("queues")
            .delete()
            .eq("gid", msg.guild.id)

        })
        // console.log(voiceCon)
        // console.log(isBusy)

    })
}