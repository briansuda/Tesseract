(function () {

"use strict";
// for munging niceness
const SEP = ' ';
var slice = Array.prototype.slice,
    window = this, 
    undefined;

window.direction = {
  up: 0,
  down: 1,
  left: 2,
  right: 3,
  forward: 4,
  forwards: 4, // alternative spelling backup
  front: 4,
  back: 5,
  backward: 5,
  backwards: 5
};
window.opposite = {
  left: 'right',
  right: 'left',
  up: 'down',
  down: 'up',
  front: 'back',
  back: 'front'
};

// global for debugging
window.door2direction = 'up down left right forward back'.split(SEP);

window.Cube = function (name, locked, debug) {
  var i = 6;
  this.name = name;
  this.debug = debug || false; // echos debug info
  this.doors = [];
  while (i--) {
    this.doors.push({
      opened: false,
      joinedto: undefined
    });
  }
  
  // TODO ensure you can only move through to a cube that is unlocked
  this.locked = locked || false;
  
  this.log = this._log('LOG');
  this.warn = this._log('WARN');
  this.die = this._log('DIE');
};

Cube.prototype = {
  _log: function (type) {
    return function () {
      console.log.call(console, type.toUpperCase(), slice.call(arguments));
      if (type == 'die') {
        console.log('GAME OVER.');
      }
    };
  },
  go: function (door) {
    // warning if null?
    if (this.doors[door].opened == false && this.doors[door].joinedto != undefined) {
      this.doors[door].opened = true; // open door
      
      this.log('leaving cube: ' + this + ' going to: ' + this.doors[door].joinedto + ' via door: ' + door2direction[door]);
      return this.doors[door].joinedto;
    } else if (this.doors[door].opened == true && this.doors[door].joinedto) {
      this.warn('already been in room ' + this);
      return this.doors[door].joinedto;
    } else {
      this.die('tried to open door ' + door2direction[door] + ', with no room on other side');
    }
    return null;
  },
  
  // should be called for both sides of the cube you're joining
  join: function (door, cube, ajoiningDoor) {
    this.log('joining: ' + this + ' to: ' + cube + ' via ' + door2direction[door]);
    if (this.doors[door].joinedto != undefined) {
      this.warn(this + ' already joined to ' + this.doors[door].joinedto + ' via ' + door2direction[door]);
      debugger;
    }
    
    this.doors[door].joinedto = cube;
    if (ajoiningDoor != undefined) {
      cube.join(ajoiningDoor, this);
    }
  },
  
  toString: function () {
    return this.name;
  }
};

window.Tesseract = function (debug) {
  // create 6 rooms
  var names = 'centre top bottom left right front back outer'.split(SEP), // allows for reverse loop I'm using
      rooms = {},
      i = 0,
      j = 0,
      l;
      
  for (i = 0; i < 8; i++) {
    rooms[names[i]] = new Cube(names[i], false, debug);
  }
  
  // reference http://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Tesseract2.svg/500px-Tesseract2.svg.png
  // reference http://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Hypercube.svg/500px-Hypercube.svg.png
  
  // centre room
  rooms.centre.join(direction.up, rooms.top, direction.down); 
  rooms.centre.join(direction.down, rooms.bottom, direction.up);
  rooms.centre.join(direction.left, rooms.left, direction.right);
  rooms.centre.join(direction.right, rooms.right, direction.left);
  rooms.centre.join(direction.forward, rooms.front, direction.back);
  rooms.centre.join(direction.back, rooms.back, direction.forward);
    
  // the outer room is inside out - yeah, head explodes....
  rooms.outer.join(direction.up, rooms.bottom, direction.down);
  rooms.outer.join(direction.down, rooms.top, direction.up);
  rooms.outer.join(direction.left, rooms.right, direction.right);
  rooms.outer.join(direction.right, rooms.left, direction.left);
  rooms.outer.join(direction.forward, rooms.back, direction.back);
  rooms.outer.join(direction.back, rooms.front, direction.forward);

  // now go around the centre room join doors
  
  // we pass around the rooms around the centre, joining the top, botton and door ahead (if we had entered it)
  var pass = { rooms: 'left front right back'.split(SEP), top: 'top', bottom: 'bottom' },
      current = '',
      next = null;
  
  for (i = 0; i < 4; i++) {
    current = rooms[pass.rooms[i]].name;
    next = rooms[pass.rooms[i + 1]] || rooms[pass.rooms[0]];
    rooms[pass.rooms[i]].join(direction.up, rooms.top, direction[current]);
    rooms[pass.rooms[i]].join(direction.down, rooms.bottom, direction[current]);
    // rotating around the centre, turning right each time, join the door directly ahead as I pass in to each room
    rooms[pass.rooms[i]].join(
      direction[next.name], 
      next, 
      direction[current]);
  }
  
  this.rooms = rooms;
};

Tesseract.prototype = {
  
};

})();





