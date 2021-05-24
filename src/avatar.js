export default (msg, bot)=>{
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
    catch(e){
        console.log(e)
    }
}