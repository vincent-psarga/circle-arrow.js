var circleArrow = {
  svgns: "http://www.w3.org/2000/svg",
  defaultOptions: {
    colors: ['red', 'green', 'blue'],
    cx: 150,
    cy: 150,
    radius: 100,
    arrowWidth: 30,
    background: 'black',
    separatorWidth: 5
  },

  makeOptions: function (opts) {
    // Waiting for Object.assign to be available.

    var options = {};

    Object.keys(this.defaultOptions).forEach(function (k) {
      options[k] = this.defaultOptions[k];
    }, this);

    Object.keys(opts).forEach(function (k) {
      options[k] = opts[k];
    });
    return options;
  },

  toRadian: function (degree) {
    return degree * Math.PI / 180;
  },

  positionInCircle: function (cx, cy, radius, angle) {
    return {
      x: Math.cos(angle) * radius + cx,
      y: Math.sin(angle) * radius + cy
    }
  },

  createElement: function (svgContainer, type, attributes) {
    var element = document.createElementNS(this.svgns, type);

    Object.keys(attributes).forEach(function (key) {
      element.setAttribute(key, attributes[key]);
    });

    svgContainer.appendChild(element);
  },

  regularArcData: function (cx, cy, radius, startDegrees, endDegrees, isCounterClockwise) {
    // From: http://stackoverflow.com/questions/16498673/svg-how-can-i-draw-stroked-circle-with-cuted-element
    // Thanks to MarkE for the answer and the regularArcData method.
    var offsetRadians=0;  // -Math.PI/2 for 12 o'clock
    var sweepFlag=(isCounterClockwise)?0:1;
    var startRadians=offsetRadians+startDegrees*Math.PI/180;
    var endRadians=offsetRadians+endDegrees*Math.PI/180;
    var largeArc=( (endRadians-startRadians) % (2*Math.PI) ) > Math.PI ? 1 : 0;
    var startX=parseInt(cx+radius*Math.cos(startRadians));
    var startY=parseInt(cy+radius*Math.sin(startRadians));
    var endX=  parseInt(cx+radius*Math.cos(endRadians));
    var endY=  parseInt(cy+radius*Math.sin(endRadians));
    var space=" ";
    var arcData="";

    arcData+="M"+space+startX         +space
                      +startY         +space;
    arcData+="A"+space+radius         +space
                      +radius         +space
                      +offsetRadians  +space
                      +largeArc       +space
                      +sweepFlag      +space
                      +endX           +space
                      +endY;
    return(arcData);
  },

  findHeadCenter: function (endDegrees, options) {
    return this.positionInCircle(options.cx, options.cy, options.radius, this.toRadian(endDegrees));
  },

  makePolygonPoints: function (points) {
    return points.map(function (point) {return point.x + "," + point.y}).join(" ");
  },

  createShaft: function (svgContainer, index, startDegrees, endDegrees, color, options) {
    this.createElement(svgContainer, 'path', {
      id: options.containerId + '-shaft-' + index,
      class: 'circle-arrow-shaft',
      fill: 'none',
      stroke: color,
      'stroke-width': options.arrowWidth,
      d: this.regularArcData(options.cx, options.cy, options.radius, startDegrees, endDegrees)
    })
  },

  createHead: function (svgContainer, index, endDegrees, color, options) {
    var hc = this.findHeadCenter(endDegrees, options),
      points = [
        this.positionInCircle(hc.x, hc.y, options.arrowWidth, this.toRadian(endDegrees + 330)),
        this.positionInCircle(hc.x, hc.y, options.arrowWidth, this.toRadian(endDegrees + 210)),
        this.positionInCircle(hc.x, hc.y, options.arrowWidth, this.toRadian(endDegrees + 90))
      ];

    this.createElement(svgContainer, 'polygon', {
      id: options.containerId + '-head-' + index,
      class: 'circle-arrow-separator',
      fill: color,
      stroke: 'none',
      points: this.makePolygonPoints(points)
    });
  },

  createSeparator: function (svgContainer, index, endDegrees, options) {
    if (options.separatorWidth == 0) {
      return;
    }

    var hc = this.findHeadCenter(endDegrees, options),
      points = [
        this.positionInCircle(hc.x, hc.y, options.arrowWidth, this.toRadian(endDegrees + 330)),
        this.positionInCircle(hc.x, hc.y, options.arrowWidth + options.separatorWidth, this.toRadian(endDegrees + 330)),
        this.positionInCircle(hc.x, hc.y, options.arrowWidth + options.separatorWidth, this.toRadian(endDegrees + 90)),
        this.positionInCircle(hc.x, hc.y, options.arrowWidth + options.separatorWidth, this.toRadian(endDegrees + 210)),
        this.positionInCircle(hc.x, hc.y, options.arrowWidth, this.toRadian(endDegrees + 210)),
        this.positionInCircle(hc.x, hc.y, options.arrowWidth, this.toRadian(endDegrees + 90))
      ];

    this.createElement(svgContainer, 'polygon', {
      id: options.containerId + '-separator-' + index,
      class: 'circle-arrow-separator',
      fill: options.background,
      stroke: 'none',
      points: this.makePolygonPoints(points)
    })
  },

  addCircleArrow: function (opts) {
    var options = this.makeOptions(opts),
      svgContainer = document.getElementById(options.containerId),
      colorCount = options.colors.length,
      angle = 360 / colorCount,
      index = 0;

    options.colors.forEach(function (color, index) {
      var startDegrees = angle * index,
        endDegrees = angle * (index + 1),
        prevColor = options.colors[(index - 1 + colorCount) % colorCount]

      this.createShaft(svgContainer, index, startDegrees, endDegrees, color, options);
      this.createHead(svgContainer, index, startDegrees, prevColor, options);
      this.createSeparator(svgContainer, index, startDegrees, options);
    }, this);
  }
}