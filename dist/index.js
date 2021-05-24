"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _express = _interopRequireDefault(require("express"));

var dc = _interopRequireWildcard(require("discord.js"));

var _modules = require("./modules.js");

var _ytdlCore = _interopRequireDefault(require("ytdl-core"));

var _avatar = _interopRequireDefault(require("./avatar"));

var _db = _interopRequireDefault(require("../db.json"));

var _fs = _interopRequireDefault(require("fs"));

var _supabaseJs = require("@supabase/supabase-js");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
  console.log(msg.content);

  if (msg.content.toLowerCase().startsWith("via test join")) {
    msg.member.voice.channel.join();
    return;
  }

  if (msg.content.toLowerCase().startsWith("via test")) {
    console.log(msg.guild.voice.connection);
  }

  if (msg.content.toLowerCase().startsWith("via avatar")) {
    (0, _avatar["default"])(msg);
  }

  if (msg.content.toLowerCase().startsWith("via play")) {}

  admins.forEach(function (id) {
    if (msg.author.id === id) {
      if (msg.content.toLowerCase().startsWith("%")) {
        var arr = msg.content.split("%");
        arr.shift();
        var text = arr.join("");
        msg.channel.send(text);
        msg["delete"]();
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
  }

  if (msg.content.toLowerCase().startsWith("via autokick")) {
    admins.forEach(function (id) {
      if (msg.author.id === id) {
        settings.autoKick = true;
        msg.reply("OK");
      }
    });
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