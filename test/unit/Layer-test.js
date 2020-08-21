suite('Layer', function () {
  // ======================================================
  test('test canvas inline styles', function () {
    var stage = addStage();

    var layer = new Konva.Layer();

    var circle = new Konva.Circle({
      x: 100,
      y: stage.getHeight() / 2,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
    });

    layer.add(circle);
    stage.add(layer);

    var style = layer.getCanvas()._canvas.style;

    assert.equal(
      style.position,
      'absolute',
      'canvas position style should be absolute'
    );
    assert.equal(
      style.border.indexOf('0px'),
      0,
      'canvas border style should be 0px'
    );
    assert.equal(style.margin, '0px', 'canvas margin style should be 0px');
    assert.equal(style.padding, '0px', 'canvas padding style should be 0px');
    assert.equal(
      style.backgroundColor,
      'transparent',
      'canvas backgroundColor style should be transparent'
    );
    assert.equal(style.top, '0px', 'canvas top should be 0px');
    assert.equal(style.left, '0px', 'canvas left should be 0px');
  });

  test('test clear()', function () {
    var stage = addStage();
    var layer = new Konva.Layer();
    var circle = new Konva.Circle({
      x: 100,
      y: 100,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle',
      draggable: true,
    });

    circle.colorKey = '#000000';

    circle.on('mouseover', function () {
      console.log('mouseover');
    });

    layer.add(circle);
    stage.add(layer);

    layer.clear();

    var trace = layer.getContext().getTrace();
    //console.log(trace);
    assert.equal(
      trace,
      'clearRect(0,0,578,200);save();transform(1,0,0,1,100,100);beginPath();arc(0,0,70,0,6.283,false);closePath();fillStyle=green;fill();lineWidth=4;strokeStyle=black;stroke();restore();clearRect(0,0,578,200);'
    );

    var hitTrace = layer.getHitCanvas().getContext().getTrace();
    //console.log(hitTrace);
    assert.equal(
      hitTrace,
      'clearRect(0,0,578,200);save();transform(1,0,0,1,100,100);beginPath();arc(0,0,70,0,6.283,false);closePath();save();fillStyle=#000000;fill();restore();lineWidth=4;strokeStyle=#000000;stroke();restore();clearRect(0,0,578,200);'
    );

    showHit(layer);
  });

  test('test clear() with bounds', function () {
    var stage = addStage();
    var layer = new Konva.Layer();
    var circle = new Konva.Circle({
      x: 100,
      y: 100,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle',
      draggable: true,
    });

    circle.colorKey = '#000000';

    circle.on('mouseover', function () {
      console.log('mouseover');
    });

    layer.add(circle);
    stage.add(layer);

    layer.clear({ x: 100, y: 100, width: 100, height: 100 });

    var trace = layer.getContext().getTrace();
    //console.log(trace);
    assert.equal(
      trace,
      'clearRect(0,0,578,200);save();transform(1,0,0,1,100,100);beginPath();arc(0,0,70,0,6.283,false);closePath();fillStyle=green;fill();lineWidth=4;strokeStyle=black;stroke();restore();clearRect(100,100,100,100);'
    );

    var hitTrace = layer.getHitCanvas().getContext().getTrace();
    //console.log(hitTrace);
    assert.equal(
      hitTrace,
      'clearRect(0,0,578,200);save();transform(1,0,0,1,100,100);beginPath();arc(0,0,70,0,6.283,false);closePath();save();fillStyle=#000000;fill();restore();lineWidth=4;strokeStyle=#000000;stroke();restore();clearRect(100,100,100,100);'
    );

    showHit(layer);
  });

  // ======================================================
  test('layer getIntersection()', function () {
    var stage = addStage();
    var layer = new Konva.Layer();

    var redCircle = new Konva.Circle({
      x: 380,
      y: stage.getHeight() / 2,
      radius: 70,
      strokeWidth: 4,
      fill: 'red',
      stroke: 'black',
      id: 'redCircle',
    });

    var greenCircle = new Konva.Circle({
      x: 300,
      y: stage.getHeight() / 2,
      radius: 70,
      strokeWidth: 4,
      fill: 'green',
      stroke: 'black',
      id: 'greenCircle',
    });

    layer.add(redCircle);
    layer.add(greenCircle);
    stage.add(layer);

    assert.equal(
      layer.getIntersection({ x: 300, y: 100 }).getId(),
      'greenCircle',
      'shape should be greenCircle'
    );
    assert.equal(
      layer.getIntersection({ x: 380, y: 100 }).getId(),
      'redCircle',
      'shape should be redCircle'
    );
    assert.equal(
      layer.getIntersection({ x: 100, y: 100 }),
      null,
      'shape should be null'
    );
  });

  // ======================================================
  test('layer getIntersection() with selector', function () {
    var stage = addStage();
    var layer = new Konva.Layer({
      name: 'layer',
    });

    var group = new Konva.Group({
      name: 'group',
    });

    var circle = new Konva.Circle({
      x: stage.getWidth() / 2,
      y: stage.getHeight() / 2,
      radius: 70,
      strokeWidth: 4,
      fill: 'red',
      stroke: 'black',
    });

    group.add(circle);
    layer.add(group);
    stage.add(layer);

    assert.equal(
      layer.getIntersection(
        { x: stage.width() / 2, y: stage.height() / 2 },
        'Circle'
      ),
      circle,
      'intersection with shape selector'
    );
    assert.equal(
      layer.getIntersection(
        { x: stage.width() / 2, y: stage.height() / 2 },
        '.group'
      ),
      group,
      'intersection with group selector'
    );
    assert.equal(
      layer.getIntersection(
        { x: stage.width() / 2, y: stage.height() / 2 },
        'Stage'
      ),
      stage,
      'intersection with stage selector'
    );
  });

  // ======================================================
  test('set layer visibility', function () {
    var stage = addStage();
    var layer = new Konva.Layer({
      visible: false,
    });
    var rect = new Konva.Rect({
      x: 200,
      width: 100,
      height: 50,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      scale: { x: 3, y: 1 },
      draggable: true,
      strokeScaleEnabled: false,
    });

    rect.colorKey = '000000';

    layer.add(rect);
    stage.add(layer);
  });

  // ======================================================
  test('set clearBeforeDraw to false, and test toDataURL for stage, layer, group, and shape', function () {
    var stage = addStage();

    var layer = new Konva.Layer({
      clearBeforeDraw: false,
      throttle: 999,
    });

    var group = new Konva.Group();

    var circle = new Konva.Circle({
      x: 100,
      y: stage.getHeight() / 2,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
    });

    group.add(circle);
    layer.add(group);
    stage.add(layer);

    for (var n = 0; n < 20; n++) {
      circle.move({ x: 10, y: 0 });
      layer.draw();
    }

    var trace = layer.getContext().getTrace();
    //console.log(trace);
    assert.equal(
      trace,
      'save();transform(1,0,0,1,220,100);beginPath();arc(0,0,70,0,6.283,false);closePath();fillStyle=green;fill();lineWidth=4;strokeStyle=black;stroke();restore();save();transform(1,0,0,1,230,100);beginPath();arc(0,0,70,0,6.283,false);closePath();fillStyle=green;fill();lineWidth=4;strokeStyle=black;stroke();restore();save();transform(1,0,0,1,240,100);beginPath();arc(0,0,70,0,6.283,false);closePath();fillStyle=green;fill();lineWidth=4;strokeStyle=black;stroke();restore();save();transform(1,0,0,1,250,100);beginPath();arc(0,0,70,0,6.283,false);closePath();fillStyle=green;fill();lineWidth=4;strokeStyle=black;stroke();restore();save();transform(1,0,0,1,260,100);beginPath();arc(0,0,70,0,6.283,false);closePath();fillStyle=green;fill();lineWidth=4;strokeStyle=black;stroke();restore();save();transform(1,0,0,1,270,100);beginPath();arc(0,0,70,0,6.283,false);closePath();fillStyle=green;fill();lineWidth=4;strokeStyle=black;stroke();restore();save();transform(1,0,0,1,280,100);beginPath();arc(0,0,70,0,6.283,false);closePath();fillStyle=green;fill();lineWidth=4;strokeStyle=black;stroke();restore();save();transform(1,0,0,1,290,100);beginPath();arc(0,0,70,0,6.283,false);closePath();fillStyle=green;fill();lineWidth=4;strokeStyle=black;stroke();restore();save();transform(1,0,0,1,300,100);beginPath();arc(0,0,70,0,6.283,false);closePath();fillStyle=green;fill();lineWidth=4;strokeStyle=black;stroke();restore();'
    );
  });

  // ======================================================
  test('save layer as png', function () {
    var stage = addStage();
    var layer = new Konva.Layer();

    var Circle = new Konva.Circle({
      x: stage.getWidth() / 2,
      y: stage.getHeight() / 2,
      radius: 70,
      fill: 'violet',
      stroke: 'black',
      strokeWidth: 4,
    });

    layer.add(Circle);
    stage.add(layer);

    var dataUrl = layer.toDataURL();
  });

  // ======================================================
  test('save layer as low quality jpg', function () {
    var stage = addStage();
    var layer = new Konva.Layer();

    var circle = new Konva.Circle({
      x: stage.getWidth() / 2,
      y: stage.getHeight() / 2,
      radius: 70,
      fill: 'violet',
      stroke: 'black',
      strokeWidth: 4,
    });

    layer.add(circle);
    stage.add(layer);

    var dataUrl = layer.toDataURL({
      mimeType: 'image/jpeg',
      quality: 0.2,
    });
  });

  // ======================================================
  test('save layer as high quality jpg', function () {
    var stage = addStage();
    var layer = new Konva.Layer();

    var circle = new Konva.Circle({
      x: stage.getWidth() / 2,
      y: stage.getHeight() / 2,
      radius: 70,
      fill: 'violet',
      stroke: 'black',
      strokeWidth: 4,
    });

    layer.add(circle);
    stage.add(layer);

    var dataUrl = layer.toDataURL({
      mimeType: 'image/jpeg',
      quality: 1,
    });
  });

  // ======================================================
  test('hit graph enable disable', function () {
    var stage = addStage();
    var layer = new Konva.Layer();

    var circle = new Konva.Circle({
      x: stage.getWidth() / 2,
      y: stage.getHeight() / 2,
      radius: 70,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 4,
    });

    layer.add(circle);
    stage.add(layer);

    assert.equal(layer.hitGraphEnabled(), true);
    assert.equal(layer.shouldDrawHit(), true);

    layer.disableHitGraph();

    assert.equal(layer.hitGraphEnabled(), false);
    assert.equal(layer.shouldDrawHit(), false);

    layer.enableHitGraph();

    assert.equal(layer.hitGraphEnabled(), true);
    assert.equal(layer.shouldDrawHit(), true);
  });

  // ======================================================
  test('should not draw hit on stage drag', function () {
    var stage = addStage();
    stage.draggable(true);
    var layer = new Konva.Layer();

    var circle = new Konva.Circle({
      x: stage.getWidth() / 2,
      y: stage.getHeight() / 2,
      radius: 70,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 4,
    });

    layer.add(circle);
    stage.add(layer);

    stage.simulateMouseDown({
      x: circle.x(),
      y: circle.y(),
    });

    stage.simulateMouseMove({
      x: circle.x() + 10,
      y: circle.y() + 10,
    });
    assert.equal(stage.isDragging(), true, 'dragging of stage is ok');
    assert.equal(layer.shouldDrawHit(), false);

    stage.simulateMouseUp({
      x: 291,
      y: 112,
    });
  });

  test('get/set layer size', function () {
    var stage = addStage();
    var layer = new Konva.Layer();
    stage.add(layer);
    assert.deepEqual(layer.size(), stage.size());
    assert.equal(layer.width(), stage.width());
    assert.equal(layer.height(), stage.height());
  });

  test('get/set imageSmoothingEnabled', function (done) {
    var imageObj = new Image();
    imageObj.onload = function () {
      var stage = addStage();

      var layer = new Konva.Layer({
        imageSmoothingEnabled: false,
      });
      var darth = new Konva.Image({
        image: imageObj,
        scaleX: 5,
        scaleY: 5,
      });

      layer.add(darth);
      stage.add(layer);

      assert.equal(layer.getContext().imageSmoothingEnabled, false);

      layer.imageSmoothingEnabled(true);

      assert.equal(layer.getContext().imageSmoothingEnabled, true);

      layer.imageSmoothingEnabled(false);
      // change size
      stage.width(stage.width() + 1);
      assert.equal(layer.getContext().imageSmoothingEnabled, false);

      done();
    };
    imageObj.src = 'assets/darth-vader.jpg';
  });
});
