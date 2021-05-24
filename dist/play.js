"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _modules = require("./modules.js");

var _googleapis = require("googleapis");

var _supabaseJs = require("@supabase/supabase-js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var supabaseUrl = 'https://hknnhacamqrcalaqobvh.supabase.co';
var supabaseKey = process.env.SUPABASE_KEY;
var supabase = (0, _supabaseJs.createClient)(supabaseUrl, supabaseKey);

var yt = _googleapis.google.youtube({
  version: 'v3',
  auth: "AIzaSyBtugmskNppTMOpcd9sCtScsMIYGBGmzqM"
});

var _default = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(msg) {
    var holder, title, authid, u, c;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            holder = msg.content.split(" ");
            holder.shift();
            holder.shift();
            title = holder.join(" ");

            if (!(title === "" || title == undefined)) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", 0);

          case 6:
            if (isBusy[msg.guild.id]) {
              _context.next = 16;
              break;
            }

            authid = msg.author.id;
            _context.next = 10;
            return msg.guild.members.fetch(authid);

          case 10:
            u = _context.sent;
            _context.next = 13;
            return u.voice.channel.join();

          case 13:
            c = _context.sent;
            isBusy[msg.guild.id] = true;
            voiceCon[msg.guild.id] = c;

          case 16:
            // const r = await search(title)
            // const res = r.videos.slice(0,1)
            yt.search.list({
              part: "snippet",
              q: title
            }, function (err, res) {
              if (err) console.log(err);
              var link = "https://www.youtube.com/watch?v=" + res.data.items[0].id.videoId;
              console.log(res.data.items);
              (0, _nodeFetch["default"])("https://www.googleapis.com/youtube/v3/videos?id=".concat(res.data.items[0].id.videoId, "&part=contentDetails&key=AIzaSyBtugmskNppTMOpcd9sCtScsMIYGBGmzqM")).then(function (r) {
                return r.json();
              }).then(function (r) {
                console.log(r.items[0].contentDetails);

                if (squeue[msg.guild.id] !== undefined) {
                  squeue[msg.guild.id].push({
                    vlink: link,
                    duration: r.items[0].contentDetails.duration,
                    title: res.data.items[0].snippet.title
                  }); // console.log(squeue)

                  return;
                }

                position[msg.guild.id] = 0;
                squeue[msg.guild.id] = [{
                  vlink: link,
                  duration: r.items[0].contentDetails.duration,
                  title: res.data.items[0].snippet.title
                }];
                play(voiceCon[msg.guild.id], msg.guild.id);
              });
              voiceCon[msg.guild.id].on("disconnect", function () {
                isBusy[msg.guild.id] = false;
                voiceCon[msg.guild.id] = undefined;
                position[msg.guild.id] = 0;
              }); // console.log(voiceCon)
              // console.log(isBusy)
            });

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;