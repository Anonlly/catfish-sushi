"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var isoToDate = function isoToDate(duration) {
  var charlist = duration.split("");
  var lastnum = "";
  var dur = {
    h: "",
    m: "",
    s: ""
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
  var seconds = parseInt(dur.h) * 3600 + parseInt(dur.m) * 60 + parseInt(dur.s);
  return seconds;
};

var queue = /*#__PURE__*/function () {
  function queue(gid) {
    _classCallCheck(this, queue);

    this.gid = gid;
    this.queue = new Array();
  }

  _createClass(queue, [{
    key: "addQueue",
    value: function addQueue(link, title, duration) {
      this.queue.push({
        link: link,
        title: title,
        duration: duration
      });
    }
  }, {
    key: "removeQueue",
    value: function removeQueue(number) {
      try {
        this.queue.splice(number - 1, 1);
      } catch (e) {}
    }
  }, {
    key: "getQueue",
    value: function getQueue() {
      return this.queue;
    }
  }, {
    key: "exportAsJson",
    value: function exportAsJson() {
      return JSON.stringify({
        queue: this.queue,
        gid: this.gid
      });
    }
  }, {
    key: "importFromJson",
    value: function importFromJson(json) {
      try {
        var f = JSON.parse(json);
        this.queue = f.queue;
        this.gid = f.gid;
      } catch (e) {
        throw e;
      }
    }
  }]);

  return queue;
}();

var position = /*#__PURE__*/function () {
  function position(gid, pos) {
    _classCallCheck(this, position);

    this.pos = pos;
    this.gid = gid;
  }

  _createClass(position, [{
    key: "getPos",
    value: function getPos() {
      return this.pos;
    }
  }, {
    key: "setPos",
    value: function setPos(pos) {
      this.pos = pos;
    }
  }]);

  return position;
}();

var _default = {
  isoToDate: isoToDate,
  queue: queue,
  position: position
};
exports["default"] = _default;