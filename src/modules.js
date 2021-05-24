const isoToDate = (duration) => {
    let charlist = duration.split("")
    let lastnum = ""
    const dur = { h: "", m: "", s: "" }
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
    const seconds = (parseInt(dur.h) * 3600) + (parseInt(dur.m) * 60) + parseInt(dur.s)
    return seconds
}

class queue {
    constructor(gid){
        this.gid = gid
        this.queue = new Array()
    }
    addQueue(link, title, duration){
        this.queue.push({link, title, duration})
    }
    removeQueue(number){
        try{
            this.queue.splice(number-1, 1)
        }catch(e){}
    }
    getQueue(){
        return this.queue
    }
    exportAsJson(){
        return JSON.stringify({
            queue:this.queue,
            gid:this.gid
        })
    }
    importFromJson(json){
        try{
            const f = JSON.parse(json)
            this.queue = f.queue
            this.gid = f.gid
        }catch(e){throw e}
    }
}

class position {
    constructor(gid, pos){
        this.pos = pos
        this.gid = gid
    }
    getPos(){
        return this.pos
    }
    setPos(pos){
        this.pos = pos
    }
}

export default { isoToDate, queue, position }