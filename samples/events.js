
var pos = 0;
function demo(container) {

var Thing = function(o) {
  var self = this;
  
  self.animated = {x: 0, y: 0, r: 0, a: 1.0, s: 1.0};

  if (o) {
   for (var p in o) {
     if (!o.hasOwnProperty(p)) continue;
     self[p] = o[p];
   }
  }
  
  self.update = function(g, t) {
    if (!self.startTime) {
      self.startTime = t;
      if (self.start) {
        var s = self.start;
        for (var p in s) {
          if (!s.hasOwnProperty(p)) continue;
          self.animated[p] = s[p];
        }
      }
    }
    if (self.animation) {
      for (var i = 0; i < self.animation.length; i++) {
        var a = self.animation[i];
        var t0 = self.startTime + a.t0*1000;
        var t1 = self.startTime + a.t1*1000;
        if (t0 <= t && t <= t1) {
          self.animated[a.k] = a.v0 + (((t-t0)/(t1-t0)) * (a.v1-a.v0));
        }
        else if (t1 < t) self.animated[a.k] = a.v1;
      }
    }
    if (self.onDraw)
    {
      var c = g.ctx;
      var a = self.animated;
      var r = a.r * Math.PI / 180;
      c.save();
      c.globalAlpha = a.a;
      c.translate(a.x, a.y);
      c.scale(a.s, a.s);
      c.rotate(r);
      self.onDraw(g, t);
      c.restore();
    }
    return (self.startTime + self.duration*1000 >= t);
  }
};

var Things = function() {

  var self = this;
  var things = [];
  
  self.add = function(t) {
    things.splice(0, 0, t);
  }

  self.update = function(g, t) {  
    for (var i = things.length-1; i >= 0; i--) {
      var thing = things[i];
      if (!thing.update(g, t))
        things.splice(i, 1);
    }  
  }

};

var foreThings = new Things();
var backThings = new Things();

var addBall = function(s) {

  var x = 90 + (g.width - 180)*Math.random();
  var y = 90 + 100 * Math.random();
  var r = (60 * Math.random())-30;
  var u = 0.4 + Math.random() * 0.2;

  var ballStartY = g.height-100;
  var ball = [
    {t0: 0, t1: 0.03, v0: 0.3, v1: 0.85, k:"a"},
    {t0: 0, t1: 0.1, v0: ballStartY, v1: y, k:"y"},
    {t0: 0.1, t1: 1.0, v0: y, v1: y+30, k:"y"},
    {t0: 0.1, t1: 1.0, v0: 0, v1: r, k:"r"},
    {t0: 1.0, t1: 1.2, v0: 0.7, v1: 0.1, k:"s"},
    {t0: 1.0, t1: 1.2, v0: 1.0, v1: 0.1, k:"a"},
    ];
    
  var thing = new Thing({start: {x:x, s: u, a: 0.3}, animation: ball, duration: 1.2, onDraw: function(g, t){
    g.ctx.beginPath();
    g.ctx.arc(0, 0, 60, 0, Math.PI*2, false);
    g.ctx.shadowColor = "rgb(128,128,128)";
    g.ctx.fillStyle = "#31D900";
    g.ctx.fill();
    g.ctx.strokeStyle = "white";
    g.ctx.lineWidth = 8;
    
    g.ctx.shadowBlur = 2;
    g.ctx.shadowOffsetX = 1;
    g.ctx.shadowOffsetY = 1;
    g.ctx.shadowColor = "rgb(127,127,127)";
    
    g.ctx.fillStyle="white";
    g.ctx.font = '60px Arial, sans-serif';
    g.ctx.textAlign="center";
    g.ctx.fillText(s,0,24);
    g.ctx.stroke();
    g.ctx.shadowBlur = 0;
    g.ctx.shadowOffsetX = 0;
    g.ctx.shadowOffsetY = 0;
    g.ctx.shadowColor = "";    
    
  }});  
  foreThings.add(thing);
};

var addSign = function(x,y,s,b,f,z,m,t) {

  if (!z) z = 1.0;
  if (!m) m = 5;
  var r = (30 * Math.random())-15;

  var ballStartY = g.height+200;
  var ball = [{t0: 0, t1: 0.3, v0: y, v1: y-m, k: "y"}
    ];
    
  var thing = new Thing({start: {x:x, y:y, r:r, s:z}, animation: ball, duration: 0.6, onDraw: function(g, t){
    g.ctx.fillStyle = b;
    g.ctx.shadowBlur = 3;
    g.ctx.shadowOffsetX = 1;
    g.ctx.shadowOffsetY = 1;
    g.ctx.shadowColor = "rgb(127,127,127)";

    var ctx = g.ctx;    
    {
      var x = -60;
      var y = -30;
      var width = 120;
      var height = 25
      var radius = 7;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(5,y+height);
      ctx.lineTo(0,0);
      ctx.lineTo(-5,y+height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }
    
    ctx.fill();
    g.ctx.shadowBlur = 0;
    g.ctx.shadowOffsetX = 0;
    g.ctx.shadowOffsetY = 0;
    g.ctx.shadowColor = "";
    g.ctx.fillStyle=f;
    g.ctx.font = '12px Arial, sans-serif';
    g.ctx.textAlign="center";
    g.ctx.fillText(s,0,-14);
  }});  
  if (t) foreThings.add(thing);
  else backThings.add(thing);
};

 objects = []; 

 g = new Goo({
  container: container,
  width: 600,
  height:600,
  onMouseDrag: function(g) {
      addSign(g.mouseX, g.mouseY, "g.onMouseDrag()", "black", "white");
    },
  onMouseDown:function(g){
    addSign(g.mouseX, g.mouseY, "g.onMouseDown()", "#3380FF", "white", 1.5, 40, true);
  },
  onMouseUp:function(g){
      addSign(g.mouseX, g.mouseY, "g.onMouseUp()", "#E30B5D", "white", 1.5, 10, true);
  },
  onKeyDown:function(g){
      addBall(g.keyCode);
    },
  onMouseMove: function(g) {
    addSign(g.mouseX, g.mouseY, "g.onMouseMove()", "white", "black");
  },
  onDraw: function(g, t) {
    g.ctx.clearRect(0, 0, g.width, g.height);
    backThings.update(g, t);
    foreThings.update(g, t);
  }
  });

}

