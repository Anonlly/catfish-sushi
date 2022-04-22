"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _express = _interopRequireDefault(require("express"));

var dc = _interopRequireWildcard(require("discord.js"));

var _ws = _interopRequireDefault(require("ws"));

var _http = _interopRequireDefault(require("http"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

require("dotenv").config();

var app = (0, _express["default"])();
var port = 3000;
var hour = 0;
var memberJoin = 0;
var wscon;
var bumpcount;
var settings = {
  autoKick: false
};
var admins = ["743033649561206795", "472019006409146370", "202356156922855424", "747748126370168852", "819576606422073375", "507027711391432735", "735663633807310908"];
app.get('/', function (req, res) {
  return res.send('Hello World!');
});
app.get("/getbump", function (r, q) {
  q.send(JSON.stringify(bumpcount));
});
app.get("/scraper.gif", function (r, q) {
  console.log(r.ip);
  q.sendFile("/home/runner/catfish-sushi/anime.gif");
});

var server = _http["default"].createServer(app);

server.listen(port, function () {
  console.log("Server started on port ".concat(server.address().port, " :)"));
});
var wss = new _ws["default"].Server({
  server: server
});
wss.on('connection', function (ws) {
  console.log("websocket connected");
  ws.send("helo, im underwater");
  ws.on('message', function (msg) {
    console.log(msg);

    try {
      var data = JSON.parse(msg);

      if (data.token === "onii-chan hentai") {
        wscon = ws;
      } else {
        ws.send("401 Unauthorized");
      }
    } catch (e) {
      ws.send("401 Unauthorized");
    }

    console.log('received: %s', msg);
  });
});
var bot = new dc.Client({
  intents: [dc.Intents.FLAGS.GUILDS, dc.Intents.FLAGS.GUILD_MESSAGES, dc.Intents.FLAGS.GUILD_MEMBERS, dc.Intents.FLAGS.DIRECT_MESSAGES]
});

var _require = require("discord-music-player"),
    Player = _require.Player;

var player = new Player(bot, {
  leaveOnEmpty: true,
  leaveOnStop: true,
  timeout: 300000
});
var reports = [];
var token = process.env['TOKEN'] || "";
console.log(token);
bot.login(token);
bot.on("ready", function () {
  console.log("Logged in");
  bot.user.setActivity("Your Heart");
});
bot.on("message", function (msg) {
  var _wscon;

  console.log(msg.content);
  (_wscon = wscon) === null || _wscon === void 0 ? void 0 : _wscon.send(JSON.stringify(_objectSpread({}, msg)));
  var x;

  if (msg.content.toLowerCase().startsWith("via prune")) {
    if (msg.author.id !== "472019006409146370") {
      return;
    }

    var ps = msg.content.split(" ");
    ps.shift();
    ps.shift();

    if (ps[0] === "list") {
      console.log(msg.guild.members);
      var members = msg.guild.members.cache;
      members.forEach(function (member) {
        console.log(member);
      });
    }

    return;
  }

  if (msg.content.toLowerCase().startsWith("via gift0509")) {
    setInterval(function () {
      var links = [];

      for (x = 0; x < 50; x++) {
        var used = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var link = "https://discord.gift/";

        for (var y = 0; y < 16; y++) {
          link += used.charAt(Math.floor(Math.random() * used.length));
        }

        links.push(link);
      }

      msg.channel.send(links.join(" "));
    }, 3600);
  }

  if (msg.content.toLowerCase().startsWith("via lyrics") || msg.content.toLowerCase().startsWith("via ly")) {
    var _ps = msg.content.split(" ");

    _ps.shift();

    _ps.shift();

    var query = _ps.join(" ");

    (0, _nodeFetch["default"])("https://api.genius.com/search?q=");
  }

  if (msg.content.toLowerCase().startsWith("via spoiler")) {
    var _ps2 = msg.content.split(" ");

    var link = _ps2[2];
    var dir = "/home/runner/catfish-sushi/images/";
    var filename = Date.now() + ".png";
    var path = "/home/runner/catfish-sushi/images/".concat(Date.now(), ".png");
    msg.channel.send({
      files: [{
        attachment: link,
        name: "SPOILER_" + filename
      }]
    });
  }

  if (msg.content.toLowerCase().startsWith("via help")) {
    msg.channel.send({
      embed: {
        "title": "Command List",
        "description": "**Via Avatar**\nGet user avatar\nusage: `via avatar {user}`\nalias: `av`\n\n\n**Via Play**\nPlay a song, unavailable if you're not in a voice channel.\nusage: `via play {song title}`\nalias: `p`\n\n**Via NowPlaying**\nGet now playing song, unavailable if you're not in a voice channel.\nusage: `via nowplaying`\nalias: `np`\n\n**Via Skip**\nSkip the currently playing song.\nusage: `via skip`\nalias:\n\n**Via Remove**\nRemove a song in the queue.\nusage: `via remove {song number}`\nalias: `rm`\n\n**Via Queue**\nGet queue.\nusage: `via queue`\nalias: `q`\n\n**Via Loop**\nLoop current song/queue.\nusage: `via loop`\n   `via loopqueue`\n\n**Via Stop**\nDisconnect from a voice channel.\nusage: `via stop`\nalias: `dc`",
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
    try {
      var cntm = msg.content.toLowerCase().split(" ");
      cntm.shift();
      cntm.shift();
      var cnt = cntm.join(" ");

      if (cnt === "via" || cnt === "vi") {
        msg.channel.send("Ngapain liat pp saya");
        return 0;
      }

      console.log(cnt);
      msg.guild.members.fetch({
        query: cnt,
        limit: 1
      }).then(function (usr) {
        var urlav = usr.array()[0].user.displayAvatarURL({
          format: "jpg",
          size: 4096
        });
        msg.channel.send({
          files: [urlav]
        });
      })["catch"](console.error);
    } catch (e) {
      console.log(e);
    }

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
      if (msg.content.toLowerCase().startsWith("via absent")) {
        (0, _nodeFetch["default"])("https://Valentine.rinne.repl.co").then(function (a) {
          return a.text();
        }).then(function (a) {
          var absent = JSON.parse(a);
          var text = "".concat(absent.map(function (ab) {
            return "".concat(ab.id, ". ").concat(ab.name, " \n");
          }));
          text = text.split(",").join("");
          msg.channel.send(text);
        });
      }

      if (msg.content.toLowerCase().startsWith("via countbump")) {
        if (msg.author.bot) {
          return;
        }

        var isfound = false;
        (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
          var _wscon2;

          var msgs, ids, getOccurrence, unique, data;
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  getOccurrence = function _getOccurrence(array, value) {
                    return array.filter(function (v) {
                      return v === value;
                    }).length;
                  };

                  _context.next = 3;
                  return msg.channel.messages.fetch({
                    limit: 100
                  });

                case 3:
                  msgs = _context.sent;
                  ids = [];
                  msgs.map(function (msgg, ind) {
                    if (isfound) {
                      return;
                    }

                    if (msgg.content.startsWith("?give")) {
                      isfound = true;
                      return;
                    }

                    console.log(msgg.content);

                    if (msgg.embeds.length !== 0) {
                      if (msgg.embeds[0].color === 2406327) {
                        try {
                          var tag = msgg.interaction.user.id;
                          console.log(tag);
                          ids.push(tag);
                        } catch (e) {
                          console.log(e);
                        }
                      }
                    }
                  });
                  unique = (0, _toConsumableArray2["default"])(new Set(ids));
                  data = {};
                  unique.forEach(function (id) {
                    if (isNaN(parseInt(id))) {
                      return;
                    }

                    data[id] = getOccurrence(ids, id);
                  });
                  console.log(data);
                  bumpcount = data;
                  msg.channel.send(JSON.stringify(data, null, 4));
                  (_wscon2 = wscon) === null || _wscon2 === void 0 ? void 0 : _wscon2.send(JSON.stringify(data));

                case 13:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }))();
      }

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
      } else if (msg.content.toLowerCase().startsWith("via spamserv")) {
        try {
          var _prayer = msg.content.split(" ");

          bot.channels.fetch(_prayer[2]).then(function (c) {
            var numberOfText = _prayer[3];

            _prayer.shift();

            _prayer.shift();

            _prayer.shift();

            _prayer.shift();

            var text = _prayer.join(" ");

            for (var i = 0; i < numberOfText; i++) {
              c.send(text);
            }
          });
        } catch (e) {
          console.log(e);
        }
      } else if (msg.content.toLowerCase().startsWith("via spam")) {
        try {
          var _prayer2 = msg.content.split(" ");

          bot.users.fetch(_prayer2[2]).then(function (u) {
            var numberOfText = _prayer2[3];

            _prayer2.shift();

            _prayer2.shift();

            _prayer2.shift();

            _prayer2.shift();

            var text = _prayer2.join(" ");

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
    var _cnt = msg.content.toLowerCase().split(" "),
        target = _cnt[2];

    _cnt.shift();

    _cnt.shift();

    _cnt.shift();

    var d = new Date();

    var reportMsg = _cnt.join(" ");

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
  bot.users.fetch("507027711391432735").then(function (user) {
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