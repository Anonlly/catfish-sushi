"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

var _express = _interopRequireDefault(require("express"));

var dc = _interopRequireWildcard(require("discord.js"));

var _avatar = _interopRequireDefault(require("./avatar"));

var _db = _interopRequireDefault(require("../db.json"));

var _fs = _interopRequireDefault(require("fs"));

var _play = _interopRequireDefault(require("./play.js"));

var _supabaseJs = require("@supabase/supabase-js");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

require("dotenv").config();

var supabaseUrl = 'https://hknnhacamqrcalaqobvh.supabase.co';
var supabaseKey = process.env.SUPABASE_KEY;
var supabase = (0, _supabaseJs.createClient)(supabaseUrl, supabaseKey);
supabase.from("isBusy").select("*").eq("gid", "293847298234").then(function (d, e) {
  console.log(d.data);
});

_db["default"].queue.push({
  gid: "345345345345",
  queue: [{
    title: "anggep aja title",
    link: "anggep aja link",
    duration: "PT4M2S"
  }]
});

_fs["default"].writeFile("../db.json", JSON.stringify(_db["default"]), function (e) {
  if (e) throw e;
  console.log("wrote");
});

var position = {}; // const play = (con, gi) => {
//     const gid = `${gi}`
//     console.log(position)
//     con.play(ytdl(squeue[gid][position[gid] - 1].vlink))
//     setTimeout(() => {
//         position[gid] = position[gid] + 1
//         play(con, gid)
//     }, isoToDate(squeue[gid][position[gid] - 1].duration) * 1000)
// }

var app = (0, _express["default"])();
var port = 3000;
var isBusy = {};
var voiceCon = {};
var hour = 0;
var memberJoin = 0;
var settings = {
  autoKick: false
};
var admins = ["743033649561206795", "472019006409146370", "202356156922855424", "747748126370168852"];
app.get('/', function (req, res) {
  return res.send('Hello World!');
});
app.listen(port, function () {
  return console.log("listening at http://localhost:".concat(port));
});
var bot = new dc.Client({
  ws: {
    intents: new dc.Intents(dc.Intents.ALL)
  }
});

var _require = require("discord-music-player"),
    Player = _require.Player;

var player = new Player(bot, {
  leaveOnEmpty: true,
  leaveOnStop: true,
  timeout: 300000
});
var reports = [];
var fakeIsBusy = false;
var token = process.env['TOKEN'] || "";
console.log(token);
bot.login(token);
bot.on("ready", function () {
  console.log("Logged in");
  bot.user.setActivity("Your Heart");
});
bot.on("message", function (msg) {
  console.log(msg.content); // if(msg.content.toLowerCase().startsWith("via test join")){
  //     msg.member.voice.channel.join()
  //     return
  // }
  // if(msg.content.toLowerCase().startsWith("via test")){
  //     console.log(msg.guild.voice.connection)
  // }

  if (msg.content.toLowerCase().startsWith("via help")) {
    msg.channel.send({
      embed: {
        "title": "Command List",
        "description": "**Via Avatar**\n\nGet user avatar\nusage: `via avatar {user}`\nalias: `av`\n\n\n**Via Play**\n\nPlay a song, unavailable if you're not in a voice channel.\nusage: `via play {song title}`\nalias: `p`\n\n**Via NowPlaying**\n\nGet now playing song, unavailable if you're not in a voice channel.\nusage: `via nowplaying`\nalias: `np`\n\n**Via Skip**\nSkip the currently playing song.\nusage: `via skip`\nalias:\n\n**Via Remove**\nRemove a song in the queue.\nusage: `via remove {song number}`\nalias: `rm`\n\n**Via Queue**\nGet queue.\nusage: `via queue`\nalias: `q`\n\n**Via Loop**\nLoop current song/queue.\nusage: `via loop`\n   `via loopqueue`\n\n**Via Stop**\nDisconnect from a voice channel.\nusage: `via stop`\nalias: `dc`",
        "author": {
          "name": "Via",
          "icon_url": "https://cdn.discordapp.com/attachments/793814695319437326/846632751254994984/index.jpg"
        },
        "color": 16223655
      }
    });
    return;
  }

  if (msg.content.toLowerCase().startsWith("via avatar") || msg.content.toLowerCase().startsWith("via av")) {
    (0, _avatar["default"])(msg, bot);
    return;
  }

  if (msg.content.toLowerCase().startsWith("via nowplaying") || msg.content.toLowerCase().startsWith("via np")) {
    player.nowPlaying(msg).then(function (song) {
      if (song) msg.channel.send({
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
    });
    return;
  }

  if (msg.content.toLowerCase().startsWith("via play") || msg.content.toLowerCase().startsWith("via p")) {
    var arr = msg.content.split(" ");
    arr.shift();
    arr.shift();
    var suffix = arr.join(" ");

    if (player.isPlaying(msg)) {
      player.addToQueue(msg, {
        search: suffix,
        requestedBy: msg.author.tag
      }).then(function (song) {
        if (song) {
          msg.channel.send("".concat(song.name, " added to queue"));
        }
      });
    } else {
      player.play(msg, {
        search: suffix,
        requestedBy: msg.author.tag
      }).then(function (song) {
        if (song) {
          msg.channel.send("Playing ".concat(song.name));
        }
      });
    }

    return;
  }

  if (msg.content.toLowerCase().startsWith("via skip")) {
    var song = player.skip(msg);

    if (song) {
      msg.channel.send("".concat(song.name, " was skipped"));
    }

    return;
  }

  if (msg.content.toLowerCase().startsWith("via remove") || msg.content.toLowerCase().startsWith("via rm")) {
    var _arr = msg.content.split(" ");

    _arr.shift();

    _arr.shift();

    if (!isNaN(parseInt(_arr.join("")))) {
      var _song = player.remove(msg, parseInt(_arr.join("")) - 1);

      if (_song) {
        msg.channel.send("Removed song ".concat(_song.name, " from queue"));
      }
    }

    return;
  }

  if (msg.content.toLowerCase().startsWith("via stop") || msg.content.toLowerCase().startsWith("via dc")) {
    if (player.stop(msg)) {
      msg.channel.send("Ok");
    }

    return;
  }

  if (msg.content.toLowerCase().startsWith("via loopqueue")) {
    var toggle = player.toggleQueueLoop(msg);
    if (toggle === null) return;else if (toggle) msg.channel.send('Queue Loop On');else msg.channel.send('Queue Loop Off');
    return;
  }

  if (msg.content.toLowerCase().startsWith("via loop")) {
    var _toggle = player.toggleLoop(msg);

    if (_toggle === null) return;else if (_toggle) msg.channel.send('Loop On');else msg.channel.send('Loop Off');
    return;
  }

  if (msg.content.toLowerCase().startsWith("via queue") || msg.content.toLowerCase().startsWith("via q")) {
    var queue = player.getQueue(msg);

    if (queue) {
      msg.channel.send({
        embed: {
          "title": "Song Queue",
          "description": "```".concat(queue.songs.map(function (q, index) {
            return "".concat(index + 1, ". ").concat(q.name);
          }).join("\n"), "```"),
          "color": 16223655
        }
      });
    }

    return;
  }

  admins.forEach(function (id) {
    if (msg.author.id === id) {
      if (msg.content.toLowerCase().startsWith("%")) {
        var _arr2 = msg.content.split("%");

        _arr2.shift();

        var text = _arr2.join("");

        msg.channel.send(text);
        msg["delete"]();
        return;
      } else if (msg.content.toLowerCase().startsWith("via say")) {
        try {
          var prayer = msg.content.split(" ");
          bot.channels.fetch(prayer[2]).then(function (c) {
            prayer.shift();
            prayer.shift();
            prayer.shift();
            var text = prayer.join(" ");
            c.send(text);
          });
        } catch (e) {
          console.log(e);
        }
      } else if (msg.content.toLowerCase().startsWith("via spam")) {
        try {
          var _prayer = msg.content.split(" ");

          bot.users.fetch(_prayer[2]).then(function (u) {
            var numberOfText = _prayer[3];

            _prayer.shift();

            _prayer.shift();

            _prayer.shift();

            _prayer.shift();

            var text = _prayer.join(" ");

            for (var i = 0; i < numberOfText; i++) {
              u.send(text);
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
    }
  });

  if (msg.content.toLowerCase().startsWith("via report")) {
    var cnt = msg.content.toLowerCase().split(" "),
        target = cnt[2];
    cnt.shift();
    cnt.shift();
    cnt.shift();
    var d = new Date();
    var reportMsg = cnt.join(" ");
    var report = {
      reporter: msg.author.username,
      target: target,
      report: reportMsg,
      date: "".concat(d.getDate(), " ").concat(d.getMonth() + 1, " ").concat(d.getFullYear())
    };
    reports.push(report);
    msg.reply("Reported");
    msg.guild.members.fetch({
      query: "BlackCoffee",
      limit: 1
    }).then(function (u) {
      u.array()[0].createDM().then(function (a) {
        a.send("\n\n                Reporter:".concat(report.reporter, "\nTarget:").concat(report.target, "\nReport:").concat(report.report, "\nDate:").concat(report.date, "\n                "));
      });
    });
    return;
  }

  if (msg.content.toLowerCase().startsWith("via autokick")) {
    admins.forEach(function (id) {
      if (msg.author.id === id) {
        settings.autoKick = true;
        msg.reply("OK");
      }
    });
    return;
  }
});
bot.on("guildMemberAdd", function (member) {
  var d = new Date();

  if (hour < d.getHours()) {
    memberJoin = 0;
    hour = d.getHours();
  }

  memberJoin += 1;

  if (memberJoin >= 10) {
    settings.autoKick = true;
    var chn = member.guild.channels.cache.array().find(function (c) {
      return c.name === "general" || c.name === "main-chat";
    });
    chn.send("Auto kick activated due to high amount of new-member");
  }

  console.log("joined");

  if (settings.autoKick) {
    member.kick().then(function (a) {
      console.log("done");
    });
  }
});
bot.on("messageDelete", function (msg) {
  if (msg.author.bot) {
    return 0;
  }

  bot.users.fetch("747748126370168852").then(function (user) {
    user.createDM().then(function (a) {
      a.send("**" + msg.author.username + "**");
      a.send(msg.content);
    });
  });
  bot.users.fetch("472019006409146370").then(function (user) {
    user.createDM().then(function (a) {
      a.send("**" + msg.author.username + "**");
      a.send(msg.content);
    });
  });
});
bot.on("messageUpdate", function (msg, newMsg) {
  if (msg.author.bot) {
    return 0;
  }

  bot.users.fetch("747748126370168852").then(function (user) {
    user.createDM().then(function (a) {
      a.send("**" + msg.author.username + "**");
      a.send(msg.content);
    });
  });
  bot.users.fetch("472019006409146370").then(function (user) {
    user.createDM().then(function (a) {
      a.send("**" + msg.author.username + "**");
      a.send(msg.content);
    });
  });
});