"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(msg, bot) {
  try {
    var cntm = msg.content.toLowerCase().split(" ");
    cntm.shift();
    cntm.shift();
    var cnt = cntm.join(" ");

    if (cnt === "via") {
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
};

exports["default"] = _default;