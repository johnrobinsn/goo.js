function demo(container){
 
 var g = new Goo({ width: 600,height: 600,
  container: container,
  userData: {startAngle: 0},
  onDraw: function(g) {
    var canvas = g.canvas;
    var ctx = g.ctx;
    ctx.clearRect(0, 0, g.width, g.height);

    // Draw a sun-like figure by rotating and adding rectangles in a loop
    ctx.globalAlpha = 0.20;
    var n = 5;
    var a = g.userData.startAngle + ((2* 3.1415) / n);
    var s = ((canvas.width < canvas.height)?canvas.width:canvas.height)/2;
    for (var i = 0; i < n; i++) {
      ctx.save();
      ctx.beginPath();
      ctx.translate(canvas.width/2, canvas.height/2);
      ctx.rotate(i * a);
      ctx.translate(-s/2,-s/2);
      ctx.rect(0, 0, s, s);
      ctx.fillStyle="#E30B5D"; // raspberry
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  },
  onMouseDrag: function(g) {
    var delta = (g.mouseX - g.prevMouseX) + (g.mouseY - g.prevMouseY);
    g.userData.startAngle += ((delta * Math.PI) / 180) / 2;
  }
  });
}