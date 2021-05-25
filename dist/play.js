"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _ytdlCore = _interopRequireDefault(require("ytdl-core"));

var _googleapis = require("googleapis");

var _supabaseJs = require("@supabase/supabase-js");

require("dotenv").config();

var isoToDate = function isoToDate(duration) {
  var charlist = duration.split("");
  var lastnum = "";
  var dur = {
    h: "0",
    m: "0",
    s: "0"
  };
  var d = charlist.map(function (c, id) {
    if (isNaN(parseInt(c))) {
      switch (c) {
        case "M":
          dur.m = dur.m + lastnum;
          break;

        case "H":
          dur.h = dur.h + lastnum;
          break;

        case "S":
          dur.s = dur.s + lastnum;
          break;

        default:
          break;
      }
    } else {
      if (!isNaN(parseInt(charlist[id - 1]))) {
        lastnum = lastnum + "" + c;
        return;
      }

      lastnum = c;
    }
  });
  console.log(dur);
  var seconds = parseInt(dur.h) * 3600 + parseInt(dur.m) * 60 + parseInt(dur.s);
  return seconds;
};

var supabaseUrl = 'https://hknnhacamqrcalaqobvh.supabase.co';
var supabaseKey = process.env.SUPABASE_KEY;
var supabase = (0, _supabaseJs.createClient)(supabaseUrl, supabaseKey);

var yt = _googleapis.google.youtube({
  version: 'v3',
  auth: "AIzaSyBtugmskNppTMOpcd9sCtScsMIYGBGmzqM"
});

var play = function play(gid, vc) {
  supabase.from("queues").select("*").eq("gid", gid).then(function (res) {
    var data;

    try {
      data = JSON.parse(res.data[0].queue);
    } catch (e) {
      console.log(e);
      console.log(res);
    }

    supabase.from("positions").select("*").eq("gid", gid).then(function (res) {
      var pos = res.data[0].pos;
      var duration = data[pos].duration;
      var sec = isoToDate(duration);
      vc.play((0, _ytdlCore["default"])(data[pos].vlink));
      setTimeout(function () {
        supabase.from("positions").update({
          pos: pos + 1
        }).eq("gid", gid).then(function (data) {
          play(gid, vc);
        });
      }, sec * 1000);
    });
  })["catch"](function (e) {});
};

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(msg) {
    var connection, holder, isfirst, title, queue, _yield$supabase$from$, data, err, authid, u;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            holder = msg.content.split(" ");
            holder.shift();
            holder.shift();
            title = holder.join(" ");

            if (!(title === "" || title == undefined)) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt("return", 0);

          case 6:
            queue = [];
            _context2.next = 9;
            return supabase.from("queues").select("*").eq("gid", msg.guild.id);

          case 9:
            _yield$supabase$from$ = _context2.sent;
            data = _yield$supabase$from$.data;
            err = _yield$supabase$from$.err;
            if (err) console.err(err);

            if (data.length !== 0) {
              try {
                queue = JSON.parse(data[0].queue);
              } catch (e) {
                console.log(e);
              }
            } else {
              supabase.from("queues").insert([{
                gid: msg.guild.id,
                queue: JSON.stringify([])
              }]).then(function (data, err) {
                if (err) console.err(err);
              });
            }

            if (!(msg.guild.voice !== undefined && msg.guild.voice.connection !== undefined && msg.guild.voice.connection !== null)) {
              _context2.next = 19;
              break;
            }

            connection = msg.guild.voice.connection;
            isfirst = false;
            _context2.next = 27;
            break;

          case 19:
            authid = msg.author.id;
            _context2.next = 22;
            return msg.guild.members.fetch(authid);

          case 22:
            u = _context2.sent;
            _context2.next = 25;
            return u.voice.channel.join();

          case 25:
            connection = _context2.sent;
            isfirst = true;

          case 27:
            // const r = await search(title)
            // const res = r.videos.slice(0,1)
            yt.search.list({
              part: "snippet",
              q: title
            }, function (err, res) {
              if (err) console.log(err);
              var link = "https://www.youtube.com/watch?v=" + res.data.items[0].id.videoId; // console.log(res.data.items)

              (0, _nodeFetch["default"])("https://www.googleapis.com/youtube/v3/videos?id=".concat(res.data.items[0].id.videoId, "&part=contentDetails&key=AIzaSyBtugmskNppTMOpcd9sCtScsMIYGBGmzqM")).then(function (r) {
                return r.json();
              }).then(function (r) {
                queue.push({
                  vlink: link,
                  duration: r.items[0].contentDetails.duration,
                  title: res.data.items[0].snippet.title
                });
                supabase.from("queues").update({
                  queue: JSON.stringify(queue)
                }).eq("gid", msg.guild.id).then(function (data, err) {
                  if (err) console.err(err);
                });
                supabase.from("positions").select("*").eq("gid", msg.guild.id).then(function (data, err) {
                  (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                    var pos;
                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            if (err) console.err(err);

                            if (!(data.data.length == 0)) {
                              _context.next = 7;
                              break;
                            }

                            pos = 0;
                            _context.next = 5;
                            return supabase.from("positions").insert({
                              gid: msg.guild.id,
                              pos: 0
                            }).then(function (data, err) {
                              console.log("pos add");
                              if (err) console.err(err);
                            });

                          case 5:
                            _context.next = 9;
                            break;

                          case 7:
                            _context.next = 9;
                            return supabase.from("positions").select("*").eq("gid", msg.guild.id).then(function (data) {
                              if (data.err) console.err(data.err);
                              pos = data.data[0].pos;
                            });

                          case 9:
                            if (isfirst || pos >= queue.length) {
                              play(msg.guild.id, connection);
                            } else {
                              console.log(msg.guild.voice);
                            }

                          case 10:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }))();
                });
              });
              connection.on("disconnect", function () {
                console.log("voice dc");
                supabase.from("positions")["delete"]().eq("gid", msg.guild.id).then(function (data, err) {
                  if (err) console.err(err);
                });
                supabase.from("queues")["delete"]().eq("gid", msg.guild.id).then(function (data, err) {
                  if (err) console.err(err);
                });
              }); // console.log(voiceCon)
              // console.log(isBusy)
            });

          case 28:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;