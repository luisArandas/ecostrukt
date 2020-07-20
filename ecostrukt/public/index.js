//https://github.com/miguelmota/spectrogram
var spectrocanvas = document.querySelector('#texturecanvas');
var _spectrocanvas = document.querySelector('#texturecanvas2');

var spectro = Spectrogram(spectrocanvas, {
    canvas: {
      width: function() {
        return window.innerWidth;
      },
      height: 500
    },
    audio: {
      enable: true
    },
    colors: function(steps) {
      var baseColors = [[0,0,255,1], [0,255,255,1], [0,255,0,1], [255,255,0,1], [ 255,0,0,1]];
      var positions = [0, 0.15, 0.30, 0.50, 0.75];

      var scale = new chroma.scale(baseColors, positions)
      .domain([0, steps]);

      function toRGBString(rgb) {
        return 'rgba(' + rgb.map(function(x) { return x>>0; }).toString() + ')';
      }

      var colors = [];

      for (var i = 0; i < steps; ++i) {
        var color = scale(i);
        color = toRGBString(color._rgb || color);
        colors.push(color);
      }

      return colors;
    }
  });

document.body.onkeydown = function(e){
    if(e.keyCode == 32){
      console.log(spectro);
      var request = new XMLHttpRequest();
      request.open('GET', 'hiphop.wav', true);
      request.responseType = 'arraybuffer';

      request.onload = function() {
        init(request.response);

      };

      request.send();
    }
}



async function init(v) {
  var audioContext = new AudioContext();
  const aud_buf = await audioContext.decodeAudioData(v);
  const source = audioContext.createBufferSource();
  source.buffer = aud_buf;
  source.loop = true;

  const analyser = audioContext.createAnalyser();
  const fftSize = analyser.fftSize = 2048;
  source.connect(analyser);
  //source.start(0);

  spectro.connectSource(analyser, audioContext);
  spectro.start();
  source.start();


  var _ctx = spectrocanvas.getContext("2d");
  var _ctx2 = _spectrocanvas.getContext("2d");

  var imageData = _ctx.getImageData(0, 0, spectrocanvas.width, spectrocanvas.height);
  var _imageData = _ctx2.getImageData(0, 0, _spectrocanvas.width, _spectrocanvas.height);

  var data = imageData.data; //rgba
  var _data = _imageData.data;

  for (let i = 0; i < data.length; i+= 200) {
    data[i + 0] = 0;    // R value
    data[i + 1] = 190;  // G value
    data[i + 2] = 0;    // B value
    data[i + 3] = 255;  // A value


  }//https://github.com/node-dmx/dmx

  var id = _ctx2.createImageData(1,200);
  var d = id.data;
  for (let i = 0; i < d.length; i+= 4) {
    d[i+0]   = 0;
    d[i+1]   = 255;
    d[i+2]   = 0;
    d[i+3]   = 255;
  }

  _ctx2.putImageData( id, 0, 0 );

/*

console.log(_imageData);
  for (let i = 0; i < _data.length; i+= 4) {
    _data[i + 0] = 0;    // R value
    _data[i + 1] = 190;  // G value
    _data[i + 2] = 0;    // B value
    _data[i + 3] = 255;  // A value
  }
  // Initialize a new ImageData object
  let __imageData = new ImageData(_data, 1);

  // Draw image data to the canvas
  _ctx2.putImageData(__imageData, 20, 20);*/


  console.log(_ctx);
  console.log(imageData);
//var gl = document.querySelector('#texturecanvas2').getContext("webgl");


//render to webgl context
//https://webglfundamentals.org/webgl/lessons/webgl-render-to-texture.html


}
