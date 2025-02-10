/*
Desarrollado por Luis Alberto Huaney Lino 
*/
SegmentDisplay.SevenSegment    = 7;
SegmentDisplay.FourteenSegment = 14;
SegmentDisplay.SixteenSegment  = 16;
SegmentDisplay.SymmetricCorner = 0;
SegmentDisplay.SquaredCorner   = 1;
SegmentDisplay.RoundedCorner   = 2;
// function SegmentDisplay(displayId) {
//   this.displayId       = displayId;
//   this.pattern         = '##:##:##';
//   this.value           = '12:34:56';
//   this.digitHeight     = 20;
//   this.digitWidth      = 10;
//   this.digitDistance   = 2.5;
//   this.displayAngle    = 12;
//   this.segmentWidth    = 2.5;
//   this.segmentDistance = 0.2;
//   this.segmentCount    = SegmentDisplay.SevenSegment;
//   this.cornerType      = SegmentDisplay.RoundedCorner;
//   this.colorOn         = 'rgb(14, 110, 173)';
//   this.colorOff        = 'rgb(228, 31, 17)';
// };
function SegmentDisplay(displayId) {
    this.displayId       = displayId;
    this.pattern         = '#####';
    this.value           = 'TUTEC';
    this.digitHeight     = 24;
    this.digitWidth      = 15;
    this.digitDistance   = 2.5;
    this.displayAngle    = 6;
    this.segmentWidth    = 3;
    this.segmentDistance = 0.3;
    this.segmentCount    = SegmentDisplay.FourteenSegment;
    this.cornerType      = SegmentDisplay.RoundedCorner;
    this.colorOn         = 'rgb(7, 93, 151)';
    this.colorOff        = 'rgba(118, 130, 151, 0.25)';
  

};
export default SegmentDisplay;
SegmentDisplay.prototype.setValue = function(value) {
  this.value = value;
  this.draw();
};

SegmentDisplay.prototype.draw = function() {
  var display = document.getElementById(this.displayId);
  if (display) {
    var context = display.getContext('2d');
    if (context) {
      // clear canvas
      context.clearRect(0, 0, display.width, display.height);
      
      // compute and check display width
      var width = 0;
      var first = true;
      if (this.pattern) {
        for (var i = 0; i < this.pattern.length; i++) {
          var c = this.pattern.charAt(i).toLowerCase();
          if (c == '#') {
            width += this.digitWidth;
          } else if (c == '.' || c == ':') {
            width += this.segmentWidth;
          } else if (c != ' ') {
            return;
          }
          width += first ? 0 : this.digitDistance;
          first = false;
        }
      }
      if (width <= 0) {
        return;
      }
      
      // compute skew factor
      var angle = -1.0 * Math.max(-45.0, Math.min(45.0, this.displayAngle));
      var skew  = Math.tan((angle * Math.PI) / 180.0);
      
      // compute scale factor
      var scale = Math.min(display.width / (width + Math.abs(skew * this.digitHeight)), display.height / this.digitHeight);
      
      // compute display offset
      var offsetX = (display.width - (width + skew * this.digitHeight) * scale) / 2.0;
      var offsetY = (display.height - this.digitHeight * scale) / 2.0;
      
      // context transformation
      context.save();
      context.translate(offsetX, offsetY);
      context.scale(scale, scale);
      context.transform(1, 0, skew, 1, 0, 0);

      // draw segments
      var xPos = 0;
      var size = (this.value) ? this.value.length : 0;
      for (var i = 0; i < this.pattern.length; i++) {
        var mask  = this.pattern.charAt(i);
        var value = (i < size) ? this.value.charAt(i).toLowerCase() : ' ';
        xPos += this.drawDigit(context, xPos, mask, value);
      }

      // finish drawing
      context.restore();
    }
  }
};

SegmentDisplay.prototype.drawDigit = function(context, xPos, mask, c) {
  switch (mask) {
    case '#':
      var r = Math.sqrt(this.segmentWidth * this.segmentWidth / 2.0);
      var d = Math.sqrt(this.segmentDistance * this.segmentDistance / 2.0);
      var e = d / 2.0; 
      var f = (this.segmentWidth - d) * Math.sin((45.0 * Math.PI) / 180.0);
      var g = f / 2.0;
      var h = (this.digitHeight - 3.0 * this.segmentWidth) / 2.0;
      var w = (this.digitWidth - 3.0 * this.segmentWidth) / 2.0;
      var s = this.segmentWidth / 2.0;
      var t = this.digitWidth / 2.0;

      // draw segment a (a1 and a2 for 16 segments)
      if (this.segmentCount == 16) {
        var x = xPos;
        var y = 0;
        context.fillStyle = this.getSegmentColor(c, null, '02356789abcdefgiopqrstz@%');
        context.beginPath();
        switch (this.cornerType) {
          case SegmentDisplay.SymmetricCorner:
            context.moveTo(x + s + d, y + s);
            context.lineTo(x + this.segmentWidth + d, y);
            break;
          case SegmentDisplay.SquaredCorner:
            context.moveTo(x + s + e, y + s - e);
            context.lineTo(x + this.segmentWidth, y);
            break;
          default:
            context.moveTo(x + this.segmentWidth - f, y + this.segmentWidth - f - d);
            context.quadraticCurveTo(x + this.segmentWidth - g, y, x + this.segmentWidth, y);
        }
        context.lineTo(x + t - d - s, y);
        context.lineTo(x + t - d, y + s);
        context.lineTo(x + t - d - s, y + this.segmentWidth);
        context.lineTo(x + this.segmentWidth + d, y + this.segmentWidth);
        context.fill();
        
        var x = xPos;
        var y = 0;
        context.fillStyle = this.getSegmentColor(c, null, '02356789abcdefgiopqrstz@');
        context.beginPath();
        context.moveTo(x + this.digitWidth - this.segmentWidth - d, y + this.segmentWidth);
        context.lineTo(x + t + d + s, y + this.segmentWidth);
        context.lineTo(x + t + d, y + s);
        context.lineTo(x + t + d + s, y);
        switch (this.cornerType) {
          case SegmentDisplay.SymmetricCorner:
            context.lineTo(x + this.digitWidth - this.segmentWidth - d, y);
            context.lineTo(x + this.digitWidth - s - d, y + s);
            break;
          case SegmentDisplay.SquaredCorner:
            context.lineTo(x + this.digitWidth - this.segmentWidth, y);
            context.lineTo(x + this.digitWidth - s - e, y + s - e);
            break;
          default:
            context.lineTo(x + this.digitWidth - this.segmentWidth, y);
            context.quadraticCurveTo(x + this.digitWidth - this.segmentWidth + g, y, x + this.digitWidth - this.segmentWidth + f, y + this.segmentWidth - f - d);
        }
        context.fill();
        
      } else {
        var x = xPos;
        var y = 0;
        context.fillStyle = this.getSegmentColor(c, '02356789acefp', '02356789abcdefgiopqrstz@');
        context.beginPath();
        switch (this.cornerType) {
          case SegmentDisplay.SymmetricCorner:
            context.moveTo(x + s + d, y + s);
            context.lineTo(x + this.segmentWidth + d, y);
            context.lineTo(x + this.digitWidth - this.segmentWidth - d, y);
            context.lineTo(x + this.digitWidth - s - d, y + s);
            break;
          case SegmentDisplay.SquaredCorner:
            context.moveTo(x + s + e, y + s - e);
            context.lineTo(x + this.segmentWidth, y);
            context.lineTo(x + this.digitWidth - this.segmentWidth, y);
            context.lineTo(x + this.digitWidth - s - e, y + s - e);
            break;
          default:
            context.moveTo(x + this.segmentWidth - f, y + this.segmentWidth - f - d);
            context.quadraticCurveTo(x + this.segmentWidth - g, y, x + this.segmentWidth, y);
            context.lineTo(x + this.digitWidth - this.segmentWidth, y);
            context.quadraticCurveTo(x + this.digitWidth - this.segmentWidth + g, y, x + this.digitWidth - this.segmentWidth + f, y + this.segmentWidth - f - d);
        }
        context.lineTo(x + this.digitWidth - this.segmentWidth - d, y + this.segmentWidth);
        context.lineTo(x + this.segmentWidth + d, y + this.segmentWidth);
        context.fill();
      }
      
      // draw segment b
      x = xPos + this.digitWidth - this.segmentWidth;
      y = 0;
      context.fillStyle = this.getSegmentColor(c, '01234789adhpy', '01234789abdhjmnopqruwy');
      context.beginPath();
      switch (this.cornerType) {
        case SegmentDisplay.SymmetricCorner:
          context.moveTo(x + s, y + s + d);
          context.lineTo(x + this.segmentWidth, y + this.segmentWidth + d);
          break;
        case SegmentDisplay.SquaredCorner:
          context.moveTo(x + s + e, y + s + e);
          context.lineTo(x + this.segmentWidth, y + this.segmentWidth);
          break;
        default:
          context.moveTo(x + f + d, y + this.segmentWidth - f);
          context.quadraticCurveTo(x + this.segmentWidth, y + this.segmentWidth - g, x + this.segmentWidth, y + this.segmentWidth);
      }
      context.lineTo(x + this.segmentWidth, y + h + this.segmentWidth - d);
      context.lineTo(x + s, y + h + this.segmentWidth + s - d);
      context.lineTo(x, y + h + this.segmentWidth - d);
      context.lineTo(x, y + this.segmentWidth + d);
      context.fill();
      
      // draw segment c
      x = xPos + this.digitWidth - this.segmentWidth;
      y = h + this.segmentWidth;
      context.fillStyle = this.getSegmentColor(c, '013456789abdhnouy', '01346789abdghjmnoqsuw@', '%');
      context.beginPath();
      context.moveTo(x, y + this.segmentWidth + d);
      context.lineTo(x + s, y + s + d);
      context.lineTo(x + this.segmentWidth, y + this.segmentWidth + d);
      context.lineTo(x + this.segmentWidth, y + h + this.segmentWidth - d);
      switch (this.cornerType) {
        case SegmentDisplay.SymmetricCorner:
          context.lineTo(x + s, y + h + this.segmentWidth + s - d);
          context.lineTo(x, y + h + this.segmentWidth - d);
          break;
        case SegmentDisplay.SquaredCorner:
          context.lineTo(x + s + e, y + h + this.segmentWidth + s - e);
          context.lineTo(x, y + h + this.segmentWidth - d);
          break;
        default:
          context.quadraticCurveTo(x + this.segmentWidth, y + h + this.segmentWidth + g, x + f + d, y + h + this.segmentWidth + f); //
          context.lineTo(x, y + h + this.segmentWidth - d);
      }
      context.fill();
      
      // draw segment d (d1 and d2 for 16 segments)
      if (this.segmentCount == 16) {
        x = xPos;
        y = this.digitHeight - this.segmentWidth;
        context.fillStyle = this.getSegmentColor(c, null, '0235689bcdegijloqsuz_=@');
        context.beginPath();
        context.moveTo(x + this.segmentWidth + d, y);
        context.lineTo(x + t - d - s, y);
        context.lineTo(x + t - d, y + s);
        context.lineTo(x + t - d - s, y + this.segmentWidth);
        switch (this.cornerType) {
          case SegmentDisplay.SymmetricCorner:
            context.lineTo(x + this.segmentWidth + d, y + this.segmentWidth);
            context.lineTo(x + s + d, y + s);
            break;
          case SegmentDisplay.SquaredCorner:
            context.lineTo(x + this.segmentWidth, y + this.segmentWidth);
            context.lineTo(x + s + e, y + s + e);
            break;
          default:
            context.lineTo(x + this.segmentWidth, y + this.segmentWidth);
            context.quadraticCurveTo(x + this.segmentWidth - g, y + this.segmentWidth, x + this.segmentWidth - f, y + f + d);
            context.lineTo(x + this.segmentWidth - f, y + f + d);
        }
        context.fill();

        x = xPos;
        y = this.digitHeight - this.segmentWidth;
        context.fillStyle = this.getSegmentColor(c, null, '0235689bcdegijloqsuz_=@', '%');
        context.beginPath();
        context.moveTo(x + t + d + s, y + this.segmentWidth);
        context.lineTo(x + t + d, y + s);
        context.lineTo(x + t + d + s, y);
        context.lineTo(x + this.digitWidth - this.segmentWidth - d, y);
        switch (this.cornerType) {
          case SegmentDisplay.SymmetricCorner:
            context.lineTo(x + this.digitWidth - s - d, y + s);
            context.lineTo(x + this.digitWidth - this.segmentWidth - d, y + this.segmentWidth);
            break;
          case SegmentDisplay.SquaredCorner:
            context.lineTo(x + this.digitWidth - s - e, y + s + e);
            context.lineTo(x + this.digitWidth - this.segmentWidth, y + this.segmentWidth);
            break;
          default:
            context.lineTo(x + this.digitWidth - this.segmentWidth + f, y + f + d);
            context.quadraticCurveTo(x + this.digitWidth - this.segmentWidth + g, y + this.segmentWidth, x + this.digitWidth - this.segmentWidth, y + this.segmentWidth);
        }
        context.fill();
      }
      else {
        x = xPos;
        y = this.digitHeight - this.segmentWidth;
        context.fillStyle = this.getSegmentColor(c, '0235689bcdelotuy_', '0235689bcdegijloqsuz_=@');
        context.beginPath();
        context.moveTo(x + this.segmentWidth + d, y);
        context.lineTo(x + this.digitWidth - this.segmentWidth - d, y);
        switch (this.cornerType) {
          case SegmentDisplay.SymmetricCorner:
            context.lineTo(x + this.digitWidth - s - d, y + s);
            context.lineTo(x + this.digitWidth - this.segmentWidth - d, y + this.segmentWidth);
            context.lineTo(x + this.segmentWidth + d, y + this.segmentWidth);
            context.lineTo(x + s + d, y + s);
            break;
          case SegmentDisplay.SquaredCorner:
            context.lineTo(x + this.digitWidth - s - e, y + s + e);
            context.lineTo(x + this.digitWidth - this.segmentWidth, y + this.segmentWidth);
            context.lineTo(x + this.segmentWidth, y + this.segmentWidth);
            context.lineTo(x + s + e, y + s + e);
            break;
          default:
            context.lineTo(x + this.digitWidth - this.segmentWidth + f, y + f + d);
            context.quadraticCurveTo(x + this.digitWidth - this.segmentWidth + g, y + this.segmentWidth, x + this.digitWidth - this.segmentWidth, y + this.segmentWidth);
            context.lineTo(x + this.segmentWidth, y + this.segmentWidth);
            context.quadraticCurveTo(x + this.segmentWidth - g, y + this.segmentWidth, x + this.segmentWidth - f, y + f + d);
            context.lineTo(x + this.segmentWidth - f, y + f + d);
        }
        context.fill();
      }
      
      // draw segment e
      x = xPos;
      y = h + this.segmentWidth;
      context.fillStyle = this.getSegmentColor(c, '0268abcdefhlnoprtu', '0268acefghjklmnopqruvw@');
      context.beginPath();
      context.moveTo(x, y + this.segmentWidth + d);
      context.lineTo(x + s, y + s + d);
      context.lineTo(x + this.segmentWidth, y + this.segmentWidth + d);
      context.lineTo(x + this.segmentWidth, y + h + this.segmentWidth - d);
      switch (this.cornerType) {
        case SegmentDisplay.SymmetricCorner:
          context.lineTo(x + s, y + h + this.segmentWidth + s - d);
          context.lineTo(x, y + h + this.segmentWidth - d);
          break;
        case SegmentDisplay.SquaredCorner:
          context.lineTo(x + s - e, y + h + this.segmentWidth + s - d + e);
          context.lineTo(x, y + h + this.segmentWidth);
          break;
        default:
          context.lineTo(x + this.segmentWidth - f - d, y + h + this.segmentWidth + f); 
          context.quadraticCurveTo(x, y + h + this.segmentWidth + g, x, y + h + this.segmentWidth);
      }
      context.fill();
      
      // draw segment f
      x = xPos;
      y = 0;
      context.fillStyle = this.getSegmentColor(c, '045689abcefhlpty', '045689acefghklmnopqrsuvwy@', '%');
      context.beginPath();
      context.moveTo(x + this.segmentWidth, y + this.segmentWidth + d);
      context.lineTo(x + this.segmentWidth, y + h + this.segmentWidth - d);
      context.lineTo(x + s, y + h + this.segmentWidth + s - d);
      context.lineTo(x, y + h + this.segmentWidth - d);
      switch (this.cornerType) {
        case SegmentDisplay.SymmetricCorner:
          context.lineTo(x, y + this.segmentWidth + d);
          context.lineTo(x + s, y + s + d);
          break;
        case SegmentDisplay.SquaredCorner:
          context.lineTo(x, y + this.segmentWidth);
          context.lineTo(x + s - e, y + s + e);
          break;
        default:
          context.lineTo(x, y + this.segmentWidth);
          context.quadraticCurveTo(x, y + this.segmentWidth - g, x + this.segmentWidth - f - d, y + this.segmentWidth - f); 
          context.lineTo(x + this.segmentWidth - f - d, y + this.segmentWidth - f); 
      }
      context.fill();

      // draw segment g for 7 segments
      if (this.segmentCount == 7) {
        x = xPos;
        y = (this.digitHeight - this.segmentWidth) / 2.0;
        context.fillStyle = this.getSegmentColor(c, '2345689abdefhnoprty-=');
        context.beginPath();
        context.moveTo(x + s + d, y + s);
        context.lineTo(x + this.segmentWidth + d, y);
        context.lineTo(x + this.digitWidth - this.segmentWidth - d, y);
        context.lineTo(x + this.digitWidth - s - d, y + s);
        context.lineTo(x + this.digitWidth - this.segmentWidth - d, y + this.segmentWidth);
        context.lineTo(x + this.segmentWidth + d, y + this.segmentWidth);
        context.fill();
      }
            
      // draw inner segments for the fourteen- and sixteen-segment-display
      if (this.segmentCount != 7) {
        // draw segment g1
        x = xPos;
        y = (this.digitHeight - this.segmentWidth) / 2.0;
        context.fillStyle = this.getSegmentColor(c, null, '2345689aefhkprsy-+*=', '%');
        context.beginPath();
        context.moveTo(x + s + d, y + s);
        context.lineTo(x + this.segmentWidth + d, y);
        context.lineTo(x + t - d - s, y);
        context.lineTo(x + t - d, y + s);
        context.lineTo(x + t - d - s, y + this.segmentWidth);
        context.lineTo(x + this.segmentWidth + d, y + this.segmentWidth);
        context.fill();
        
        // draw segment g2
        x = xPos;
        y = (this.digitHeight - this.segmentWidth) / 2.0;
        context.fillStyle = this.getSegmentColor(c, null, '234689abefghprsy-+*=@', '%');
        context.beginPath();
        context.moveTo(x + t + d, y + s);
        context.lineTo(x + t + d + s, y);
        context.lineTo(x + this.digitWidth - this.segmentWidth - d, y);
        context.lineTo(x + this.digitWidth - s - d, y + s);
        context.lineTo(x + this.digitWidth - this.segmentWidth - d, y + this.segmentWidth);
        context.lineTo(x + t + d + s, y + this.segmentWidth);
        context.fill();
        
        // draw segment j 
        x = xPos + t - s;
        y = 0;
        context.fillStyle = this.getSegmentColor(c, null, 'bdit+*', '%');
        context.beginPath();
        if (this.segmentCount == 14) {
          context.moveTo(x, y + this.segmentWidth + this.segmentDistance);
          context.lineTo(x + this.segmentWidth, y + this.segmentWidth + this.segmentDistance);
        } else {
          context.moveTo(x, y + this.segmentWidth + d);
          context.lineTo(x + s, y + s + d);
          context.lineTo(x + this.segmentWidth, y + this.segmentWidth + d);
        }
        context.lineTo(x + this.segmentWidth, y + h + this.segmentWidth - d);
        context.lineTo(x + s, y + h + this.segmentWidth + s - d);
        context.lineTo(x, y + h + this.segmentWidth - d);
        context.fill();
        
        // draw segment m
        x = xPos + t - s;
        y = this.digitHeight;
        context.fillStyle = this.getSegmentColor(c, null, 'bdity+*@', '%');
        context.beginPath();
        if (this.segmentCount == 14) {
          context.moveTo(x, y - this.segmentWidth - this.segmentDistance);
          context.lineTo(x + this.segmentWidth, y - this.segmentWidth - this.segmentDistance);
        } else {
          context.moveTo(x, y - this.segmentWidth - d);
          context.lineTo(x + s, y - s - d);
          context.lineTo(x + this.segmentWidth, y - this.segmentWidth - d);
        }
        context.lineTo(x + this.segmentWidth, y - h - this.segmentWidth + d);
        context.lineTo(x + s, y - h - this.segmentWidth - s + d);
        context.lineTo(x, y - h - this.segmentWidth + d);
        context.fill();
        
        // draw segment h
        x = xPos + this.segmentWidth;
        y = this.segmentWidth;
        context.fillStyle = this.getSegmentColor(c, null, 'mnx\\*');
        context.beginPath();
        context.moveTo(x + this.segmentDistance, y + this.segmentDistance);
        context.lineTo(x + this.segmentDistance + r, y + this.segmentDistance);
        context.lineTo(x + w - this.segmentDistance , y + h - this.segmentDistance - r);
        context.lineTo(x + w - this.segmentDistance , y + h - this.segmentDistance);
        context.lineTo(x + w - this.segmentDistance - r , y + h - this.segmentDistance);
        context.lineTo(x + this.segmentDistance, y + this.segmentDistance + r);
        context.fill();
        
        // draw segment k
        x = xPos + w + 2.0 * this.segmentWidth;
        y = this.segmentWidth;
        context.fillStyle = this.getSegmentColor(c, null, '0kmvxz/*', '%');
        context.beginPath();
        context.moveTo(x + w - this.segmentDistance, y + this.segmentDistance);
        context.lineTo(x + w - this.segmentDistance, y + this.segmentDistance + r);
        context.lineTo(x + this.segmentDistance + r, y + h - this.segmentDistance);
        context.lineTo(x + this.segmentDistance, y + h - this.segmentDistance);
        context.lineTo(x + this.segmentDistance, y + h - this.segmentDistance - r);
        context.lineTo(x + w - this.segmentDistance - r, y + this.segmentDistance);
        context.fill();
        
        // draw segment l
        x = xPos + w + 2.0 * this.segmentWidth;
        y = h + 2.0 * this.segmentWidth;
        context.fillStyle = this.getSegmentColor(c, null, '5knqrwx\\*');
        context.beginPath();
        context.moveTo(x + this.segmentDistance, y + this.segmentDistance);
        context.lineTo(x + this.segmentDistance + r, y + this.segmentDistance);
        context.lineTo(x + w - this.segmentDistance , y + h - this.segmentDistance - r);
        context.lineTo(x + w - this.segmentDistance , y + h - this.segmentDistance);
        context.lineTo(x + w - this.segmentDistance - r , y + h - this.segmentDistance);
        context.lineTo(x + this.segmentDistance, y + this.segmentDistance + r);
        context.fill();
        
        // draw segment n
        x = xPos + this.segmentWidth;
        y = h + 2.0 * this.segmentWidth;
        context.fillStyle = this.getSegmentColor(c, null, '0vwxz/*', '%');
        context.beginPath();
        context.moveTo(x + w - this.segmentDistance, y + this.segmentDistance);
        context.lineTo(x + w - this.segmentDistance, y + this.segmentDistance + r);
        context.lineTo(x + this.segmentDistance + r, y + h - this.segmentDistance);
        context.lineTo(x + this.segmentDistance, y + h - this.segmentDistance);
        context.lineTo(x + this.segmentDistance, y + h - this.segmentDistance - r);
        context.lineTo(x + w - this.segmentDistance - r, y + this.segmentDistance);
        context.fill();
      }
      
      return this.digitDistance + this.digitWidth;
      
    case '.':
      context.fillStyle = (c == '#') || (c == '.') ? this.colorOn : this.colorOff;
      this.drawPoint(context, xPos, this.digitHeight - this.segmentWidth, this.segmentWidth);
      return this.digitDistance + this.segmentWidth;
      
    case ':':
      context.fillStyle = (c == '#') || (c == ':') ? this.colorOn : this.colorOff;
      var y = (this.digitHeight - this.segmentWidth) / 2.0 - this.segmentWidth;
      this.drawPoint(context, xPos, y, this.segmentWidth);
      this.drawPoint(context, xPos, y + 2.0 * this.segmentWidth, this.segmentWidth);
      return this.digitDistance + this.segmentWidth;
      
    default:
      return this.digitDistance;    
  }
};

SegmentDisplay.prototype.drawPoint = function(context, x1, y1, size) {
  var x2 = x1 + size;
  var y2 = y1 + size;
  var d  = size / 4.0;
  
  context.beginPath();
  context.moveTo(x2 - d, y1);
  context.quadraticCurveTo(x2, y1, x2, y1 + d);
  context.lineTo(x2, y2 - d);
  context.quadraticCurveTo(x2, y2, x2 - d, y2);
  context.lineTo(x1 + d, y2);
  context.quadraticCurveTo(x1, y2, x1, y2 - d);
  context.lineTo(x1, y1 + d);
  context.quadraticCurveTo(x1, y1, x1 + d, y1);
  context.fill();
}; 

SegmentDisplay.prototype.getSegmentColor = function(c, charSet7, charSet14, charSet16) {
  if (c == '#') {
    return this.colorOn;
  } else {
    switch (this.segmentCount) {
      case 7:  return (charSet7.indexOf(c) == -1) ? this.colorOff : this.colorOn;
      case 14: return (charSet14.indexOf(c) == -1) ? this.colorOff : this.colorOn;
      case 16: var pattern = charSet14 + (charSet16 === undefined ? '' : charSet16);
               return (pattern.indexOf(c) == -1) ? this.colorOff : this.colorOn;
      default: return this.colorOff;
    }
  }
};




if (!document.createElement("canvas").getContext) {
    (function () {
      // alias some functions to make (compiled) code shorter
      var m = Math;
      var mr = m.round;
      var ms = m.sin;
      var mc = m.cos;
      var abs = m.abs;
      var sqrt = m.sqrt;
  
      // this is used for sub pixel precision
      var Z = 10;
      var Z2 = Z / 2;
  
      /**
       * This funtion is assigned to the <canvas> elements as element.getContext().
       * @this {HTMLElement}
       * @return {CanvasRenderingContext2D_}
       */
      function getContext() {
        return (
          this.context_ || (this.context_ = new CanvasRenderingContext2D_(this))
        );
      }
  
      var slice = Array.prototype.slice;
  
      /**
       * Binds a function to an object. The returned function will always use the
       * passed in {@code obj} as {@code this}.
       *
       * Example:
       *
       *   g = bind(f, obj, a, b)
       *   g(c, d) // will do f.call(obj, a, b, c, d)
       *
       * @param {Function} f The function to bind the object to
       * @param {Object} obj The object that should act as this when the function
       *     is called
       * @param {*} var_args Rest arguments that will be used as the initial
       *     arguments when the function is called
       * @return {Function} A new function that has bound this
       */
      function bind(f, obj, var_args) {
        var a = slice.call(arguments, 2);
        return function () {
          return f.apply(obj, a.concat(slice.call(arguments)));
        };
      }
  
      var G_vmlCanvasManager_ = {
        init: function (opt_doc) {
          if (/MSIE/.test(navigator.userAgent) && !window.opera) {
            var doc = opt_doc || document;
            // Create a dummy element so that IE will allow canvas elements to be
            // recognized.
            doc.createElement("canvas");
            doc.attachEvent("onreadystatechange", bind(this.init_, this, doc));
          }
        },
  
        init_: function (doc) {
          // create xmlns
          if (!doc.namespaces["g_vml_"]) {
            doc.namespaces.add(
              "g_vml_",
              "urn:schemas-microsoft-com:vml",
              "#default#VML"
            );
          }
          if (!doc.namespaces["g_o_"]) {
            doc.namespaces.add(
              "g_o_",
              "urn:schemas-microsoft-com:office:office",
              "#default#VML"
            );
          }
  
          // Setup default CSS.  Only add one style sheet per document
          if (!doc.styleSheets["ex_canvas_"]) {
            var ss = doc.createStyleSheet();
            ss.owningElement.id = "ex_canvas_";
            ss.cssText =
              "canvas{display:inline-block;overflow:hidden;" +
              // default size is 300x150 in Gecko and Opera
              "text-align:left;width:300px;height:150px}" +
              "g_vml_\\:*{behavior:url(#default#VML)}" +
              "g_o_\\:*{behavior:url(#default#VML)}";
          }
  
          // find all canvas elements
          var els = doc.getElementsByTagName("canvas");
          for (var i = 0; i < els.length; i++) {
            this.initElement(els[i]);
          }
        },
  
        /**
         * Public initializes a canvas element so that it can be used as canvas
         * element from now on. This is called automatically before the page is
         * loaded but if you are creating elements using createElement you need to
         * make sure this is called on the element.
         * @param {HTMLElement} el The canvas element to initialize.
         * @return {HTMLElement} the element that was created.
         */
        initElement: function (el) {
          if (!el.getContext) {
            el.getContext = getContext;
  
            // Remove fallback content. There is no way to hide text nodes so we
            // just remove all childNodes. We could hide all elements and remove
            // text nodes but who really cares about the fallback content.
            el.innerHTML = "";
  
            // do not use inline function because that will leak memory
            el.attachEvent("onpropertychange", onPropertyChange);
            el.attachEvent("onresize", onResize);
  
            var attrs = el.attributes;
            if (attrs.width && attrs.width.specified) {
              // TODO: use runtimeStyle and coordsize
              // el.getContext().setWidth_(attrs.width.nodeValue);
              el.style.width = attrs.width.nodeValue + "px";
            } else {
              el.width = el.clientWidth;
            }
            if (attrs.height && attrs.height.specified) {
              // TODO: use runtimeStyle and coordsize
              // el.getContext().setHeight_(attrs.height.nodeValue);
              el.style.height = attrs.height.nodeValue + "px";
            } else {
              el.height = el.clientHeight;
            }
            //el.getContext().setCoordsize_()
          }
          return el;
        },
      };
  
      function onPropertyChange(e) {
        var el = e.srcElement;
  
        switch (e.propertyName) {
          case "width":
            el.style.width = el.attributes.width.nodeValue + "px";
            el.getContext().clearRect();
            break;
          case "height":
            el.style.height = el.attributes.height.nodeValue + "px";
            el.getContext().clearRect();
            break;
        }
      }
  
      function onResize(e) {
        var el = e.srcElement;
        if (el.firstChild) {
          el.firstChild.style.width = el.clientWidth + "px";
          el.firstChild.style.height = el.clientHeight + "px";
        }
      }
  
      G_vmlCanvasManager_.init();
  
      // precompute "00" to "FF"
      var dec2hex = [];
      for (var i = 0; i < 16; i++) {
        for (var j = 0; j < 16; j++) {
          dec2hex[i * 16 + j] = i.toString(16) + j.toString(16);
        }
      }
  
      function createMatrixIdentity() {
        return [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ];
      }
  
      function matrixMultiply(m1, m2) {
        var result = createMatrixIdentity();
  
        for (var x = 0; x < 3; x++) {
          for (var y = 0; y < 3; y++) {
            var sum = 0;
  
            for (var z = 0; z < 3; z++) {
              sum += m1[x][z] * m2[z][y];
            }
  
            result[x][y] = sum;
          }
        }
        return result;
      }
  
      function copyState(o1, o2) {
        o2.fillStyle = o1.fillStyle;
        o2.lineCap = o1.lineCap;
        o2.lineJoin = o1.lineJoin;
        o2.lineWidth = o1.lineWidth;
        o2.miterLimit = o1.miterLimit;
        o2.shadowBlur = o1.shadowBlur;
        o2.shadowColor = o1.shadowColor;
        o2.shadowOffsetX = o1.shadowOffsetX;
        o2.shadowOffsetY = o1.shadowOffsetY;
        o2.strokeStyle = o1.strokeStyle;
        o2.globalAlpha = o1.globalAlpha;
        o2.arcScaleX_ = o1.arcScaleX_;
        o2.arcScaleY_ = o1.arcScaleY_;
        o2.lineScale_ = o1.lineScale_;
      }
  
      function processStyle(styleString) {
        var str,
          alpha = 1;
  
        styleString = String(styleString);
        if (styleString.substring(0, 3) == "rgb") {
          var start = styleString.indexOf("(", 3);
          var end = styleString.indexOf(")", start + 1);
          var guts = styleString.substring(start + 1, end).split(",");
  
          str = "#";
          for (var i = 0; i < 3; i++) {
            str += dec2hex[Number(guts[i])];
          }
  
          if (guts.length == 4 && styleString.substr(3, 1) == "a") {
            alpha = guts[3];
          }
        } else {
          str = styleString;
        }
  
        return { color: str, alpha: alpha };
      }
  
      function processLineCap(lineCap) {
        switch (lineCap) {
          case "butt":
            return "flat";
          case "round":
            return "round";
          case "square":
          default:
            return "square";
        }
      }
  
      /**
       * This class implements CanvasRenderingContext2D interface as described by
       * the WHATWG.
       * @param {HTMLElement} surfaceElement The element that the 2D context should
       * be associated with
       */
      function CanvasRenderingContext2D_(surfaceElement) {
        this.m_ = createMatrixIdentity();
  
        this.mStack_ = [];
        this.aStack_ = [];
        this.currentPath_ = [];
  
        // Canvas context properties
        this.strokeStyle = "#000";
        this.fillStyle = "#000";
  
        this.lineWidth = 1;
        this.lineJoin = "miter";
        this.lineCap = "butt";
        this.miterLimit = Z * 1;
        this.globalAlpha = 1;
        this.canvas = surfaceElement;
  
        var el = surfaceElement.ownerDocument.createElement("div");
        el.style.width = surfaceElement.clientWidth + "px";
        el.style.height = surfaceElement.clientHeight + "px";
        el.style.overflow = "hidden";
        el.style.position = "absolute";
        surfaceElement.appendChild(el);
  
        this.element_ = el;
        this.arcScaleX_ = 1;
        this.arcScaleY_ = 1;
        this.lineScale_ = 1;
      }
  
      var contextPrototype = CanvasRenderingContext2D_.prototype;
      contextPrototype.clearRect = function () {
        this.element_.innerHTML = "";
      };
  
      contextPrototype.beginPath = function () {
        // TODO: Branch current matrix so that save/restore has no effect
        //       as per safari docs.
        this.currentPath_ = [];
      };
  
      contextPrototype.moveTo = function (aX, aY) {
        var p = this.getCoords_(aX, aY);
        this.currentPath_.push({ type: "moveTo", x: p.x, y: p.y });
        this.currentX_ = p.x;
        this.currentY_ = p.y;
      };
  
      contextPrototype.lineTo = function (aX, aY) {
        var p = this.getCoords_(aX, aY);
        this.currentPath_.push({ type: "lineTo", x: p.x, y: p.y });
  
        this.currentX_ = p.x;
        this.currentY_ = p.y;
      };
  
      contextPrototype.bezierCurveTo = function (
        aCP1x,
        aCP1y,
        aCP2x,
        aCP2y,
        aX,
        aY
      ) {
        var p = this.getCoords_(aX, aY);
        var cp1 = this.getCoords_(aCP1x, aCP1y);
        var cp2 = this.getCoords_(aCP2x, aCP2y);
        bezierCurveTo(this, cp1, cp2, p);
      };
  
      // Helper function that takes the already fixed cordinates.
      function bezierCurveTo(self, cp1, cp2, p) {
        self.currentPath_.push({
          type: "bezierCurveTo",
          cp1x: cp1.x,
          cp1y: cp1.y,
          cp2x: cp2.x,
          cp2y: cp2.y,
          x: p.x,
          y: p.y,
        });
        self.currentX_ = p.x;
        self.currentY_ = p.y;
      }
  
      contextPrototype.quadraticCurveTo = function (aCPx, aCPy, aX, aY) {
        // the following is lifted almost directly from
        // http://developer.mozilla.org/en/docs/Canvas_tutorial:Drawing_shapes
  
        var cp = this.getCoords_(aCPx, aCPy);
        var p = this.getCoords_(aX, aY);
  
        var cp1 = {
          x: this.currentX_ + (2.0 / 3.0) * (cp.x - this.currentX_),
          y: this.currentY_ + (2.0 / 3.0) * (cp.y - this.currentY_),
        };
        var cp2 = {
          x: cp1.x + (p.x - this.currentX_) / 3.0,
          y: cp1.y + (p.y - this.currentY_) / 3.0,
        };
  
        bezierCurveTo(this, cp1, cp2, p);
      };
  
      contextPrototype.arc = function (
        aX,
        aY,
        aRadius,
        aStartAngle,
        aEndAngle,
        aClockwise
      ) {
        aRadius *= Z;
        var arcType = aClockwise ? "at" : "wa";
  
        var xStart = aX + mc(aStartAngle) * aRadius - Z2;
        var yStart = aY + ms(aStartAngle) * aRadius - Z2;
  
        var xEnd = aX + mc(aEndAngle) * aRadius - Z2;
        var yEnd = aY + ms(aEndAngle) * aRadius - Z2;
  
        // IE won't render arches drawn counter clockwise if xStart == xEnd.
        if (xStart == xEnd && !aClockwise) {
          xStart += 0.125; // Offset xStart by 1/80 of a pixel. Use something
          // that can be represented in binary
        }
  
        var p = this.getCoords_(aX, aY);
        var pStart = this.getCoords_(xStart, yStart);
        var pEnd = this.getCoords_(xEnd, yEnd);
  
        this.currentPath_.push({
          type: arcType,
          x: p.x,
          y: p.y,
          radius: aRadius,
          xStart: pStart.x,
          yStart: pStart.y,
          xEnd: pEnd.x,
          yEnd: pEnd.y,
        });
      };
  
      contextPrototype.rect = function (aX, aY, aWidth, aHeight) {
        this.moveTo(aX, aY);
        this.lineTo(aX + aWidth, aY);
        this.lineTo(aX + aWidth, aY + aHeight);
        this.lineTo(aX, aY + aHeight);
        this.closePath();
      };
  
      contextPrototype.strokeRect = function (aX, aY, aWidth, aHeight) {
        var oldPath = this.currentPath_;
        this.beginPath();
  
        this.moveTo(aX, aY);
        this.lineTo(aX + aWidth, aY);
        this.lineTo(aX + aWidth, aY + aHeight);
        this.lineTo(aX, aY + aHeight);
        this.closePath();
        this.stroke();
  
        this.currentPath_ = oldPath;
      };
  
      contextPrototype.fillRect = function (aX, aY, aWidth, aHeight) {
        var oldPath = this.currentPath_;
        this.beginPath();
  
        this.moveTo(aX, aY);
        this.lineTo(aX + aWidth, aY);
        this.lineTo(aX + aWidth, aY + aHeight);
        this.lineTo(aX, aY + aHeight);
        this.closePath();
        this.fill();
  
        this.currentPath_ = oldPath;
      };
  
      contextPrototype.createLinearGradient = function (aX0, aY0, aX1, aY1) {
        var gradient = new CanvasGradient_("gradient");
        gradient.x0_ = aX0;
        gradient.y0_ = aY0;
        gradient.x1_ = aX1;
        gradient.y1_ = aY1;
        return gradient;
      };
  
      contextPrototype.createRadialGradient = function (
        aX0,
        aY0,
        aR0,
        aX1,
        aY1,
        aR1
      ) {
        var gradient = new CanvasGradient_("gradientradial");
        gradient.x0_ = aX0;
        gradient.y0_ = aY0;
        gradient.r0_ = aR0;
        gradient.x1_ = aX1;
        gradient.y1_ = aY1;
        gradient.r1_ = aR1;
        return gradient;
      };
  
      contextPrototype.drawImage = function (image, var_args) {
        var dx, dy, dw, dh, sx, sy, sw, sh;
  
        // to find the original width we overide the width and height
        var oldRuntimeWidth = image.runtimeStyle.width;
        var oldRuntimeHeight = image.runtimeStyle.height;
        image.runtimeStyle.width = "auto";
        image.runtimeStyle.height = "auto";
  
        // get the original size
        var w = image.width;
        var h = image.height;
  
        // and remove overides
        image.runtimeStyle.width = oldRuntimeWidth;
        image.runtimeStyle.height = oldRuntimeHeight;
  
        if (arguments.length == 3) {
          dx = arguments[1];
          dy = arguments[2];
          sx = sy = 0;
          sw = dw = w;
          sh = dh = h;
        } else if (arguments.length == 5) {
          dx = arguments[1];
          dy = arguments[2];
          dw = arguments[3];
          dh = arguments[4];
          sx = sy = 0;
          sw = w;
          sh = h;
        } else if (arguments.length == 9) {
          sx = arguments[1];
          sy = arguments[2];
          sw = arguments[3];
          sh = arguments[4];
          dx = arguments[5];
          dy = arguments[6];
          dw = arguments[7];
          dh = arguments[8];
        } else {
          throw Error("Invalid number of arguments");
        }
  
        var d = this.getCoords_(dx, dy);
  
        var w2 = sw / 2;
        var h2 = sh / 2;
  
        var vmlStr = [];
  
        var W = 10;
        var H = 10;
  
        // For some reason that I've now forgotten, using divs didn't work
        vmlStr.push(
          " <g_vml_:group",
          ' coordsize="',
          Z * W,
          ",",
          Z * H,
          '"',
          ' coordorigin="0,0"',
          ' style="width:',
          W,
          "px;height:",
          H,
          "px;position:absolute;"
        );
  
        // If filters are necessary (rotation exists), create them
        // filters are bog-slow, so only create them if abbsolutely necessary
        // The following check doesn't account for skews (which don't exist
        // in the canvas spec (yet) anyway.
  
        if (this.m_[0][0] != 1 || this.m_[0][1]) {
          var filter = [];
  
          // Note the 12/21 reversal
          filter.push(
            "M11=",
            this.m_[0][0],
            ",",
            "M12=",
            this.m_[1][0],
            ",",
            "M21=",
            this.m_[0][1],
            ",",
            "M22=",
            this.m_[1][1],
            ",",
            "Dx=",
            mr(d.x / Z),
            ",",
            "Dy=",
            mr(d.y / Z),
            ""
          );
  
          // Bounding box calculation (need to minimize displayed area so that
          // filters don't waste time on unused pixels.
          var max = d;
          var c2 = this.getCoords_(dx + dw, dy);
          var c3 = this.getCoords_(dx, dy + dh);
          var c4 = this.getCoords_(dx + dw, dy + dh);
  
          max.x = m.max(max.x, c2.x, c3.x, c4.x);
          max.y = m.max(max.y, c2.y, c3.y, c4.y);
  
          vmlStr.push(
            "padding:0 ",
            mr(max.x / Z),
            "px ",
            mr(max.y / Z),
            "px 0;filter:progid:DXImageTransform.Microsoft.Matrix(",
            filter.join(""),
            ", sizingmethod='clip');"
          );
        } else {
          vmlStr.push("top:", mr(d.y / Z), "px;left:", mr(d.x / Z), "px;");
        }
  
        vmlStr.push(
          ' ">',
          '<g_vml_:image src="',
          image.src,
          '"',
          ' style="width:',
          Z * dw,
          "px;",
          " height:",
          Z * dh,
          'px;"',
          ' cropleft="',
          sx / w,
          '"',
          ' croptop="',
          sy / h,
          '"',
          ' cropright="',
          (w - sx - sw) / w,
          '"',
          ' cropbottom="',
          (h - sy - sh) / h,
          '"',
          " />",
          "</g_vml_:group>"
        );
  
        this.element_.insertAdjacentHTML("BeforeEnd", vmlStr.join(""));
      };
  
      contextPrototype.stroke = function (aFill) {
        var lineStr = [];
        var lineOpen = false;
        var a = processStyle(aFill ? this.fillStyle : this.strokeStyle);
        var color = a.color;
        var opacity = a.alpha * this.globalAlpha;
  
        var W = 10;
        var H = 10;
  
        lineStr.push(
          "<g_vml_:shape",
          ' filled="',
          !!aFill,
          '"',
          ' style="position:absolute;width:',
          W,
          "px;height:",
          H,
          'px;"',
          ' coordorigin="0 0" coordsize="',
          Z * W,
          " ",
          Z * H,
          '"',
          ' stroked="',
          !aFill,
          '"',
          ' path="'
        );
  
        var newSeq = false;
        var min = { x: null, y: null };
        var max = { x: null, y: null };
  
        for (var i = 0; i < this.currentPath_.length; i++) {
          var p = this.currentPath_[i];
          var c;
  
          switch (p.type) {
            case "moveTo":
              c = p;
              lineStr.push(" m ", mr(p.x), ",", mr(p.y));
              break;
            case "lineTo":
              lineStr.push(" l ", mr(p.x), ",", mr(p.y));
              break;
            case "close":
              lineStr.push(" x ");
              p = null;
              break;
            case "bezierCurveTo":
              lineStr.push(
                " c ",
                mr(p.cp1x),
                ",",
                mr(p.cp1y),
                ",",
                mr(p.cp2x),
                ",",
                mr(p.cp2y),
                ",",
                mr(p.x),
                ",",
                mr(p.y)
              );
              break;
            case "at":
            case "wa":
              lineStr.push(
                " ",
                p.type,
                " ",
                mr(p.x - this.arcScaleX_ * p.radius),
                ",",
                mr(p.y - this.arcScaleY_ * p.radius),
                " ",
                mr(p.x + this.arcScaleX_ * p.radius),
                ",",
                mr(p.y + this.arcScaleY_ * p.radius),
                " ",
                mr(p.xStart),
                ",",
                mr(p.yStart),
                " ",
                mr(p.xEnd),
                ",",
                mr(p.yEnd)
              );
              break;
          }
  
          // TODO: Following is broken for curves due to
          //       move to proper paths.
  
          // Figure out dimensions so we can do gradient fills
          // properly
          if (p) {
            if (min.x == null || p.x < min.x) {
              min.x = p.x;
            }
            if (max.x == null || p.x > max.x) {
              max.x = p.x;
            }
            if (min.y == null || p.y < min.y) {
              min.y = p.y;
            }
            if (max.y == null || p.y > max.y) {
              max.y = p.y;
            }
          }
        }
        lineStr.push(' ">');
  
        if (!aFill) {
          var lineWidth = this.lineScale_ * this.lineWidth;
  
          // VML cannot correctly render a line if the width is less than 1px.
          // In that case, we dilute the color to make the line look thinner.
          if (lineWidth < 1) {
            opacity *= lineWidth;
          }
  
          lineStr.push(
            "<g_vml_:stroke",
            ' opacity="',
            opacity,
            '"',
            ' joinstyle="',
            this.lineJoin,
            '"',
            ' miterlimit="',
            this.miterLimit,
            '"',
            ' endcap="',
            processLineCap(this.lineCap),
            '"',
            ' weight="',
            lineWidth,
            'px"',
            ' color="',
            color,
            '" />'
          );
        } else if (typeof this.fillStyle == "object") {
          var fillStyle = this.fillStyle;
          var angle = 0;
          var focus = { x: 0, y: 0 };
  
          // additional offset
          var shift = 0;
          // scale factor for offset
          var expansion = 1;
  
          if (fillStyle.type_ == "gradient") {
            var x0 = fillStyle.x0_ / this.arcScaleX_;
            var y0 = fillStyle.y0_ / this.arcScaleY_;
            var x1 = fillStyle.x1_ / this.arcScaleX_;
            var y1 = fillStyle.y1_ / this.arcScaleY_;
            var p0 = this.getCoords_(x0, y0);
            var p1 = this.getCoords_(x1, y1);
            var dx = p1.x - p0.x;
            var dy = p1.y - p0.y;
            angle = (Math.atan2(dx, dy) * 180) / Math.PI;
  
            // The angle should be a non-negative number.
            if (angle < 0) {
              angle += 360;
            }
  
            // Very small angles produce an unexpected result because they are
            // converted to a scientific notation string.
            if (angle < 1e-6) {
              angle = 0;
            }
          } else {
            var p0 = this.getCoords_(fillStyle.x0_, fillStyle.y0_);
            var width = max.x - min.x;
            var height = max.y - min.y;
            focus = {
              x: (p0.x - min.x) / width,
              y: (p0.y - min.y) / height,
            };
  
            width /= this.arcScaleX_ * Z;
            height /= this.arcScaleY_ * Z;
            var dimension = m.max(width, height);
            shift = (2 * fillStyle.r0_) / dimension;
            expansion = (2 * fillStyle.r1_) / dimension - shift;
          }
  
          // We need to sort the color stops in ascending order by offset,
          // otherwise IE won't interpret it correctly.
          var stops = fillStyle.colors_;
          stops.sort(function (cs1, cs2) {
            return cs1.offset - cs2.offset;
          });
  
          var length = stops.length;
          var color1 = stops[0].color;
          var color2 = stops[length - 1].color;
          var opacity1 = stops[0].alpha * this.globalAlpha;
          var opacity2 = stops[length - 1].alpha * this.globalAlpha;
  
          var colors = [];
          for (var i = 0; i < length; i++) {
            var stop = stops[i];
            colors.push(stop.offset * expansion + shift + " " + stop.color);
          }
  
          // When colors attribute is used, the meanings of opacity and o:opacity2
          // are reversed.
          lineStr.push(
            '<g_vml_:fill type="',
            fillStyle.type_,
            '"',
            ' method="none" focus="100%"',
            ' color="',
            color1,
            '"',
            ' color2="',
            color2,
            '"',
            ' colors="',
            colors.join(","),
            '"',
            ' opacity="',
            opacity2,
            '"',
            ' g_o_:opacity2="',
            opacity1,
            '"',
            ' angle="',
            angle,
            '"',
            ' focusposition="',
            focus.x,
            ",",
            focus.y,
            '" />'
          );
        } else {
          lineStr.push(
            '<g_vml_:fill color="',
            color,
            '" opacity="',
            opacity,
            '" />'
          );
        }
  
        lineStr.push("</g_vml_:shape>");
  
        this.element_.insertAdjacentHTML("beforeEnd", lineStr.join(""));
      };
  
      contextPrototype.fill = function () {
        this.stroke(true);
      };
  
      contextPrototype.closePath = function () {
        this.currentPath_.push({ type: "close" });
      };
  
      /**
       * @private
       */
      contextPrototype.getCoords_ = function (aX, aY) {
        var m = this.m_;
        return {
          x: Z * (aX * m[0][0] + aY * m[1][0] + m[2][0]) - Z2,
          y: Z * (aX * m[0][1] + aY * m[1][1] + m[2][1]) - Z2,
        };
      };
  
      contextPrototype.save = function () {
        var o = {};
        copyState(this, o);
        this.aStack_.push(o);
        this.mStack_.push(this.m_);
        this.m_ = matrixMultiply(createMatrixIdentity(), this.m_);
      };
  
      contextPrototype.restore = function () {
        copyState(this.aStack_.pop(), this);
        this.m_ = this.mStack_.pop();
      };
  
      function matrixIsFinite(m) {
        for (var j = 0; j < 3; j++) {
          for (var k = 0; k < 2; k++) {
            if (!isFinite(m[j][k]) || isNaN(m[j][k])) {
              return false;
            }
          }
        }
        return true;
      }
  
      function setM(ctx, m, updateLineScale) {
        if (!matrixIsFinite(m)) {
          return;
        }
        ctx.m_ = m;
  
        if (updateLineScale) {
          // Get the line scale.
          // Determinant of this.m_ means how much the area is enlarged by the
          // transformation. So its square root can be used as a scale factor
          // for width.
          var det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
          ctx.lineScale_ = sqrt(abs(det));
        }
      }
  
      contextPrototype.translate = function (aX, aY) {
        var m1 = [
          [1, 0, 0],
          [0, 1, 0],
          [aX, aY, 1],
        ];
  
        setM(this, matrixMultiply(m1, this.m_), false);
      };
  
      contextPrototype.rotate = function (aRot) {
        var c = mc(aRot);
        var s = ms(aRot);
  
        var m1 = [
          [c, s, 0],
          [-s, c, 0],
          [0, 0, 1],
        ];
  
        setM(this, matrixMultiply(m1, this.m_), false);
      };
  
      contextPrototype.scale = function (aX, aY) {
        this.arcScaleX_ *= aX;
        this.arcScaleY_ *= aY;
        var m1 = [
          [aX, 0, 0],
          [0, aY, 0],
          [0, 0, 1],
        ];
  
        setM(this, matrixMultiply(m1, this.m_), true);
      };
  
      contextPrototype.transform = function (m11, m12, m21, m22, dx, dy) {
        var m1 = [
          [m11, m12, 0],
          [m21, m22, 0],
          [dx, dy, 1],
        ];
  
        setM(this, matrixMultiply(m1, this.m_), true);
      };
  
      contextPrototype.setTransform = function (m11, m12, m21, m22, dx, dy) {
        var m = [
          [m11, m12, 0],
          [m21, m22, 0],
          [dx, dy, 1],
        ];
  
        setM(this, m, true);
      };
  
      /******** STUBS ********/
      contextPrototype.clip = function () {
        // TODO: Implement
      };
  
      contextPrototype.arcTo = function () {
        // TODO: Implement
      };
  
      contextPrototype.createPattern = function () {
        return new CanvasPattern_();
      };
  
      // Gradient / Pattern Stubs
      function CanvasGradient_(aType) {
        this.type_ = aType;
        this.x0_ = 0;
        this.y0_ = 0;
        this.r0_ = 0;
        this.x1_ = 0;
        this.y1_ = 0;
        this.r1_ = 0;
        this.colors_ = [];
      }
  
      CanvasGradient_.prototype.addColorStop = function (aOffset, aColor) {
        aColor = processStyle(aColor);
        this.colors_.push({
          offset: aOffset,
          color: aColor.color,
          alpha: aColor.alpha,
        });
      };
  
      function CanvasPattern_() {}
  
      // set up externs
      G_vmlCanvasManager = G_vmlCanvasManager_;
      CanvasRenderingContext2D = CanvasRenderingContext2D_;
      CanvasGradient = CanvasGradient_;
      CanvasPattern = CanvasPattern_;
    })();
  }