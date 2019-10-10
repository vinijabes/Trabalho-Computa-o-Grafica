const Ava = require('./src/Ava.js');
const Canvas = Ava.Canvas;
const { Mat4, Vec3 } = require('./src/Mat');
const Camera = require('./src/Renderer/Camera');
const VertexArray = require('./src/Renderer/VertexArray');

const c = document.getElementById('view');
const offscreen = new OffscreenCanvas(document.documentElement.clientWidth, document.documentElement.clientHeight);
c.width = document.documentElement.clientWidth;
c.height = document.documentElement.clientHeight;

window.addEventListener("resize", () => {
  c.width = document.documentElement.clientWidth;
  c.height = document.documentElement.clientHeight;
  offscreen.width = c.width;
  offscreen.height = c.height;
})

const context = c.getContext('bitmaprenderer');
const CanvasContext = new Canvas.CanvasContext(offscreen.getContext('2d'));

// Canvas.CanvasApi.DrawLine(CanvasContext, { x: 0, y: 0 }, { x: 50, y: 0 }, { x: 1.0, y: 0, z: 0, w: 1.0 }, 1);
// Canvas.CanvasApi.DrawLine(CanvasContext, { x: 0, y: 600 }, { x: 0, y: 0 }, { x: 1.0, y: 0, z: 0, w: 1.0 }, 1);
// Canvas.CanvasApi.DrawLine(CanvasContext, { x: 50, y: 600 }, { x: 0, y: 600 }, { x: 1.0, y: 0, z: 0, w: 1.0 }, 1);
// Canvas.CanvasApi.DrawLine(CanvasContext, { x: 50, y: 0 }, { x: 50, y: 600 }, { x: 0.0, y: 0, z: 0, w: 1.0 }, 1);
//Canvas.CanvasApi.DrawLine(CanvasContext, { x: 50, y: 50 }, { x: 1280, y: 720 }, { x: 1.0, y: 0, z: 0, w: 1.0 }, 1);

// const vertices =
//     [-0.5, -0.5, 0.0,
//       0.5, -0.5, 0.0,
//       0.5,  0.5, 0.0,
//      -0.5,  0.5, 0.0]
const vertices =
  [10, 100, 0.0,
    100, 100, 0.0,
    100, 10, 0.0,
    10, 10, 0.0,
    55, 55, 0.0];

const vertexArray = new VertexArray();
vertexArray.AddVextexAttrib(0, VertexArray.AvaType.Vec3);
vertexArray.AddVextexAttrib(1, VertexArray.AvaType.Vec4);

Canvas.CanvasApi.AvaBindVertexArray(CanvasContext, vertexArray);
let ArrayBufferCasa = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);
let IndexBufferCasa = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);

const verticesCasa =
  [
    100, 100, 100,//0
    200, 100, 100,//1
    200, 100, 250,//2
    100, 100, 250,//3
    100, 200, 250,//4
    200, 200, 250,//5
    200, 200, 100,//6
    100, 200, 100,//7
    150, 100, 320,//8
    150, 200, 320, //9
  ];
const indicesVertices =
  [
    0, 1,//1
    1, 2,//2
    2, 3,//3
    3, 0,//4
    3, 4,//5
    0, 7,//6
    1, 6,//7
    2, 5,//8
    4, 5,//9
    4, 7,//10
    7, 6,//11
    6, 5,//12
    4, 9,//13
    5, 9,//14
    3, 8,//15
    2, 8,//16
    8, 9
  ]

let ArrayBufferLinhas = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);
let IndexBufferLinhas = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);

const verticesLinhas =
  [
    0, 200, 0,
    0, -200, 0
  ];
const indicesLinhas =
  [
    0, 1
  ];

let camera = new Camera();
let projection = Mat4.Ortho();

camera.SetProjection(projection);
camera.SetView(Mat4.Viewport(-CanvasContext.Width/2, CanvasContext.Width/2, -CanvasContext.Height/2, CanvasContext.Height/2, -1, 1));

Canvas.CanvasApi.SetLocation(CanvasContext, 0, camera);

var render = () => {

  Canvas.CanvasApi.AvaBindBuffer(CanvasContext, Canvas.CanvasContext.BufferType.AVA_ARRAY_BUFFER, ArrayBufferCasa);
  Canvas.CanvasApi.AvaSetBufferData(CanvasContext, Canvas.CanvasContext.BufferType.AVA_ARRAY_BUFFER, ArrayBufferCasa, verticesCasa);
  
  Canvas.CanvasApi.AvaBindBuffer(CanvasContext, Canvas.CanvasContext.BufferType.AVA_ELEMENT_ARRAY_BUFFER, IndexBufferCasa);
  Canvas.CanvasApi.AvaSetBufferData(CanvasContext, Canvas.CanvasContext.BufferType.AVA_ELEMENT_ARRAY_BUFFER, IndexBufferCasa, indicesVertices);

  Canvas.CanvasApi.AvaDrawElements(CanvasContext, Canvas.CanvasContext.DrawMode.AVA_LINES, 3);

  Canvas.CanvasApi.AvaBindBuffer(CanvasContext, Canvas.CanvasContext.BufferType.AVA_ARRAY_BUFFER, ArrayBufferLinhas);
  Canvas.CanvasApi.AvaSetBufferData(CanvasContext, Canvas.CanvasContext.BufferType.AVA_ARRAY_BUFFER, ArrayBufferLinhas, verticesLinhas);
  
  Canvas.CanvasApi.AvaBindBuffer(CanvasContext, Canvas.CanvasContext.BufferType.AVA_ELEMENT_ARRAY_BUFFER, IndexBufferLinhas);
  Canvas.CanvasApi.AvaSetBufferData(CanvasContext, Canvas.CanvasContext.BufferType.AVA_ELEMENT_ARRAY_BUFFER, IndexBufferLinhas, indicesLinhas);

  Canvas.CanvasApi.AvaDrawElements(CanvasContext, Canvas.CanvasContext.DrawMode.AVA_LINES, 3);
  Canvas.CanvasApi.SwapBuffer(CanvasContext);
  let bitmap = offscreen.transferToImageBitmap();
  context.transferFromImageBitmap(bitmap);
}

let count = 0;
let delta = 0;
let last = 0;
var frame = function (now) {
  delta += now - last;
  last = now;
  count++;

  if (delta > 1000) {
    //console.log(count);
    count = 0;
    delta = 0;
  }

  //update();
  CanvasContext.RawContext.clearRect(0, 0, CanvasContext.Width, CanvasContext.Height);
  Canvas.CanvasApi.DrawCircle(CanvasContext, { x: CanvasContext.Width / 2, y: CanvasContext.Height / 2 }, 2, { x: 0, y: 0, z: 0, w: 1.0 })
  render();
  requestAnimationFrame(frame, CanvasContext.RawContext);
};

frame(0);

let initial = {};
let end = {};

c.onmousedown = (e) => {
  initial.x = e.offsetX - CanvasContext.Width / 2;
  initial.y = -(e.offsetY - CanvasContext.Height / 2);
  console.log("X:", e.offsetX - CanvasContext.Width / 2, "Y:", -(e.offsetY - CanvasContext.Height / 2));
}

c.onmouseup = (e) => {
  end.x = e.offsetX - CanvasContext.Width / 2;
  end.y = -(e.offsetY - CanvasContext.Height / 2);
  console.log("X:", e.offsetX - CanvasContext.Width / 2, "Y:", -(e.offsetY - CanvasContext.Height / 2));

  indicesVertices.push(verticesCasa.push(initial.x, initial.y, 0) / 3 - 1);
  indicesVertices.push(verticesCasa.push(end.x, end.y, 0) / 3 - 1);

  //Canvas.CanvasApi.DrawLine(CanvasContext, initial, end, { x: 1.0, y: 0, z: 0, w: 1.0 }, 1);
  //Canvas.CanvasApi.DrawCircle(CanvasContext, initial, Math.sqrt((initial.x - end.x) ** 2 + (initial.y - end.y) ** 2), { x: Math.random(), y: Math.random(), z: Math.random(), w: 1.0 })
}

c.onmousemove = (e) => {
  //console.log("X:", e.offsetX - CanvasContext.Width / 2, "Y:", -(e.offsetY - CanvasContext.Height / 2));
}