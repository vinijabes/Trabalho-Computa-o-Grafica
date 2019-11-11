const Ava = require('./src/Ava.js');
const Canvas = Ava.Canvas;
const { Mat4, Vec3, Vec2 } = require('./src/Mat');
const Camera = require('./src/Renderer/Camera');
const VertexArray = require('./src/Renderer/VertexArray');
const GameObject = require('./src/Engine/GameObject');
const Circle = require('./src/Engine/Circle');
const Window = require('./src/Renderer/Window');
const UI = require('./src/UI');
const TransformationUI = require('./src/Scripts/TransformationUI');
const GO = require('./src/Engine/GameObject/GameObject');
const MeshRenderer = require('./src/Engine/GameObject/Components/MeshRenderer');
const Collider = require('./src/Engine/GameObject/Components/SphereCollider');
const RendererSystem = require('./src/Engine/RendererSystem');
const Time = require('./src/Engine/Time');

const gameObjectsSelect = document.getElementById("gameobjects");
const c = document.getElementById('view');
const offscreen = new OffscreenCanvas(document.documentElement.clientWidth * 0.75, document.documentElement.clientHeight);
c.width = document.documentElement.clientWidth * 0.75;
c.height = document.documentElement.clientHeight;

const context = c.getContext('bitmaprenderer');
const CanvasContext = new Canvas.CanvasContext(offscreen.getContext('2d'));

Ava.Canvas.CanvasApi.s_Context = CanvasContext;

let test = new GO();
test.AddComponent(MeshRenderer);
test.Transform.Translate({ x: 200, y: 200, z: 100 });


let TestObject = new GO();
TestObject.AddComponent(MeshRenderer);

const vertexArray = new VertexArray();
vertexArray.AddVextexAttrib(0, VertexArray.AvaType.Vec3);
vertexArray.AddVextexAttrib(1, VertexArray.AvaType.Vec4);

Canvas.CanvasApi.AvaBindVertexArray(CanvasContext, vertexArray);
let ArrayBufferCasa = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);
let IndexBufferCasa = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);

const verticesCasa =
  [
    -100, 0, -100, 0, 0, 1, 1,
    -100, 0, 100, 0, 0, 1, 1,
    100, 0, -100, 0, 0, 1, 1,
    100, 0, 100, 0, 0, 1, 1,
    -100, 100, 0, 0, 1, 0, 1,
    -100, -100, 0, 0, 1, 0, 1,
    100, 100, 0, 0, 1, 0, 1,
    100, -100, 0, 0, 1, 0, 1,
  ];
const indicesVertices =
  [
    0, 1, 2,
    1, 2, 3,
    4, 5, 6,
    5, 6, 7
  ]

test.GetComponent(MeshRenderer).m_Mesh.Index = indicesVertices;
test.GetComponent(MeshRenderer).m_Mesh.Vertex = verticesCasa;

TestObject.GetComponent(MeshRenderer).m_Mesh.Vertex = [
  -30, -10, -40, 0, 0, 1, 1,//0
  -10, -10, -40, 1, 1, 0, 1,//1
  -30, -10, 40, 0, 1, 0, 1,//2
  -10, -10, 40, 0, 1, 1, 1,//3
  -30, 10, -40, 0, 0, 0, 1,//4
  -10, 10, -40, 0, 0, 0, 1,//5
  -30, 10, 40, 0, 0, 0, 1,//6
  -10, 10, 40, 0, 0, 0, 1,//7
  10, -10, -40, 0, 0, 0, 1, //8
  10, 10, -40, 0, 0, 0, 1, //9
  30, -10, -40, 0, 0, 0, 1, //10
  30, 10, -40, 0, 0, 0, 1, //11
  -10, -10, -40, 0, 0, 1, 1,//12
  -10, -10, 40, 0, 1, 0, 1,//13
  -10, -10, -40, 1, 0, 0, 1,//1
  -10, -10, 40, 1, 1, 0, 1,//3
]

TestObject.GetComponent(MeshRenderer).m_Mesh.Index = [
  0, 1, 2,
  12, 2, 3,
  1, 3, 5,
  14, 5, 11,
  14, 10, 11,
  2, 3, 6,
  15, 5, 7,
  13, 6, 7,
  3, 7, 9,
  3, 8, 9,
]

TestObject.Transform.Scale(1, 1, 1, 1 / 4);

let camera = new Camera();
let projection = Mat4.Ortho();

camera.SetProjection(projection);
camera.SetView(Mat4.Viewport(-CanvasContext.Width / 2, CanvasContext.Width / 2, -CanvasContext.Height / 2, CanvasContext.Height / 2, -1, 1));
Canvas.CanvasApi.SetLocation(CanvasContext, 0, camera);
Canvas.CanvasApi.SetLocation(CanvasContext, 2, new Window(new Vec2(-1, -1), new Vec2(2, 2)));

let gameObjects = [];


let cartesian = new GameObject("Plano Cartesiano", false);
cartesian.m_VertexBuffer = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);
cartesian.m_IndexBuffer = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);
cartesian.m_Vertex =
  [
    -CanvasContext.Width / 2, 0, 0,
    CanvasContext.Width / 2, 0, 0,
    0, -CanvasContext.Height / 2, 0,
    0, CanvasContext.Height / 2, 0,
  ];
cartesian.m_Index = [0, 1, 2, 3];

let menu = new UI.Menu(new UI.HTMLObject(document.getElementById('menu')));
let select = new UI.Select(null);

let projectionSelect = new UI.Select(null);
projectionSelect.AddOption('Ortogonal', Mat4.Ortho());
projectionSelect.AddOption('Cavaleira', Mat4.Cavaleira());
projectionSelect.AddOption('Cabinet', Mat4.Cabinet());

projectionSelect.onChange = (value) => {
  camera.SetProjection(value);
}

let TextX = new UI.Text(null, "X: ");
let TextY = new UI.Text(null, "Y: ");
let TextZ = new UI.Text(null, "Z: ");

let CasaButton = new UI.Button(null, 'Casa');
let JanelaButton = new UI.Button(null, 'Janela + Linhas');
let CirculosButton = new UI.Button(null, 'Círculos + Linhas');
let PauseButton = new UI.Button(null, 'Pause');

CasaButton.onClick = () => {
  let go = new GameObject("Casa");
  go.m_VertexBuffer = ArrayBufferCasa;
  go.m_IndexBuffer = IndexBufferCasa;
  go.m_Vertex = verticesCasa;
  go.m_Index = indicesVertices;
  gameObjects = [];
  gameObjects.push(go);
  gameObjects.push(cartesian);

  transformationUI.Show();
  WindowMenu.Hide();
  DrawingMenu.Hide();

  select.m_Options = [];
  select.AddOption(go.m_Name, go);
  Canvas.CanvasApi.SetLocation(CanvasContext, 2, new Window(new Vec2(-1, -1), new Vec2(2, 2)));
  selectedOption = 0;
  transformationUI.Reset();
}

JanelaButton.onClick = () => {
  transformationUI.Hide();
  DrawingMenu.Hide();
  WindowMenu.Show();

  select.m_Options = [];
  select.Render();
  gameObjects = [cartesian];
  Canvas.CanvasApi.SetLocation(CanvasContext, 2, new Window(new Vec2(-1, -1), new Vec2(2, 2)));
  selectedOption = 1;
}

CirculosButton.onClick = () => {
  transformationUI.Hide();
  WindowMenu.Hide();

  gameObjects = [cartesian];
  Canvas.CanvasApi.SetLocation(CanvasContext, 2, new Window(new Vec2(-1, -1), new Vec2(2, 2)));
  selectedOption = 1;
  DrawingMenu.Show();

  select.m_Options = [];
  select.Render();
}

let paused = false;
PauseButton.onClick = () => {
  paused = !paused;
}

let WindowMenu = new UI.Menu(null);
let DrawingMenu = new UI.Menu(null);

let selectedOption = 0;
let DrawCircleButton = new UI.Button(null, "Draw Circle");
let DrawLineButton = new UI.Button(null, "Draw Line");

DrawCircleButton.onClick = () => { selectedOption = 2; }
DrawLineButton.onClick = () => { selectedOption = 1; }

DrawingMenu.AddChild(DrawLineButton);
DrawingMenu.AddChild(DrawCircleButton);
DrawingMenu.AddChild(PauseButton);

DrawingMenu.m_DomNode.style.marginTop = '8px';

menu.AddChild(select);
menu.AddChild(projectionSelect);
menu.AddChild(TextX);
menu.AddChild(TextY);
menu.AddChild(TextZ);
menu.AddChild(CasaButton);
menu.AddChild(JanelaButton);
menu.AddChild(CirculosButton);

let settingWindow = false;
let transformationUI = new TransformationUI(null);
let windowButton = new UI.Button(null, 'Set new Window');
windowButton.m_DomNode.style.marginTop = '8px';
windowButton.onClick = () => {
  settingWindow = true;
}

let resetWindowButton = new UI.Button(null, 'Reset Window');
resetWindowButton.m_DomNode.style.marginTop = '8px';
resetWindowButton.onClick = () => {
  Canvas.CanvasApi.SetLocation(CanvasContext, 2, new Window(new Vec2(-1, -1), new Vec2(2, 2)));
  if (gameObjects.indexOf(windowObject) != -1)
    gameObjects.splice(gameObjects.indexOf(windowObject), 1);
}

WindowMenu.AddChild(windowButton);
WindowMenu.AddChild(resetWindowButton);
menu.AddChild(transformationUI);
menu.AddChild(WindowMenu);
menu.AddChild(DrawingMenu);

menu.Render();

var update = (delta) => {
  Time.delta = delta;
  for (let g of gameObjects) {
    g.Update(delta);
  }
  //test.Update();
  TestObject.Update();
  camera.Update(delta);
  menu.Update(delta);
  if (!select.Value()) return;
  TextX.SetText(`X: ${select.Value().center().x.toFixed(2)}`);
  TextY.SetText(`Y: ${select.Value().center().y.toFixed(2)}`);
  TextZ.SetText(`Z: ${select.Value().center().z.toFixed(2)}`);
}

var render = () => {
  for (let g of gameObjects) g.Render(CanvasContext);
  RendererSystem.Flush();
  //Canvas.CanvasApi.Clear(new Vec4(0, 0, 0, 1));
  Canvas.CanvasApi.SwapBuffer(CanvasContext);
  let bitmap = offscreen.transferToImageBitmap();
  context.transferFromImageBitmap(bitmap);
}

let count = 0;
let delta = 0;
let last = 0;
var frame = function (now) {
  delta += now - last;
  if (!paused) {
    update((now - last) / 1000);

    last = now;
    count++;

    if (delta > 1000) {
      //console.clear();
      console.log(count);
      count = 0;
      delta = 0;
    }

    //update();
    CanvasContext.RawContext.clearRect(0, 0, CanvasContext.Width, CanvasContext.Height);
    Canvas.CanvasApi.DrawCircle(CanvasContext, { x: CanvasContext.Width / 2, y: CanvasContext.Height / 2 }, new Vec3(0, 0, 1), 2, { x: 0, y: 0, z: 0, w: 1.0 })
    render();
  }
  requestAnimationFrame(frame, CanvasContext.RawContext);
};

frame(0);

let initial = {};
let end = {};

c.onmousedown = (e) => {
  initial.x = (e.offsetX - CanvasContext.Width / 2)
  initial.y = (-(e.offsetY - CanvasContext.Height / 2))
}

let windowObject = null;

c.onmouseup = (e) => {
  end.x = e.offsetX - CanvasContext.Width / 2;
  end.y = -(e.offsetY - CanvasContext.Height / 2);

  if (!settingWindow) {
    if (selectedOption == 1) {
      let g = new GameObject('Linha', false);
      g.m_VertexBuffer = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);
      g.m_IndexBuffer = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);
      g.m_Vertex =
        [
          initial.x, initial.y, 0,
          end.x, end.y, 0
        ];
      g.m_Index = [0, 1];

      gameObjects.push(g);
      select.AddOption('Linha', g);
    } else if (selectedOption == 2) {
      if (gameObjects.indexOf(circlePreview) != -1) gameObjects.splice(gameObjects.indexOf(circlePreview), 1);
      let g = new Circle(new Vec3(initial.x, initial.y, Math.floor(Math.sqrt(Math.pow(end.x - initial.x, 2) + Math.pow(end.y - initial.y, 2)))));
      g.m_VertexBuffer = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);
      g.m_IndexBuffer = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);

      gameObjects.push(g);
      select.AddOption('Circle', g);
    }
  } else {
    let v3I = new Vec3(initial.x, initial.y, 0);
    let v3F = new Vec3(end.x, end.y, 0);
    v3I = v3I.multiplyMat4(camera.view);
    v3F = v3F.multiplyMat4(camera.view);

    if (gameObjects.indexOf(windowObject) != -1)
      gameObjects.splice(gameObjects.indexOf(windowObject), 1);

    let top = Math.max(initial.y, end.y);
    let bottom = Math.min(initial.y, end.y);
    let left = Math.min(initial.x, end.x);
    let right = Math.max(initial.x, end.x);

    windowObject = new GameObject("Window", false);
    windowObject.m_VertexBuffer = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);
    windowObject.m_IndexBuffer = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);
    windowObject.m_Vertex =
      [
        left + 1, top - 1, 0,
        right - 1, top - 1, 0,
        right - 1, bottom + 1, 0,
        left + 1, bottom + 1, 0
      ];
    windowObject.m_Index = [0, 1, 1, 2, 2, 3, 3, 0];
    gameObjects.push(windowObject);

    Canvas.CanvasApi.SetLocation(CanvasContext, 2, new Window(new Vec2(Math.min(v3I.x, v3F.x), Math.min(v3I.y, v3F.y)), new Vec2(Math.abs(v3F.x - v3I.x), Math.abs(v3F.y - v3I.y))));
    settingWindow = false;
  }
  initial = {};
  //Canvas.CanvasApi.DrawLine(CanvasContext, initial, end, { x: 1.0, y: 0, z: 0, w: 1.0 }, 1);
  //Canvas.CanvasApi.DrawCircle(CanvasContext, initial, Math.sqrt((initial.x - end.x) ** 2 + (initial.y - end.y) ** 2), { x: Math.random(), y: Math.random(), z: Math.random(), w: 1.0 })
}

let linePreview = new GameObject('Linha', false);
linePreview.m_VertexBuffer = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);
linePreview.m_IndexBuffer = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);
linePreview.m_Index = [0, 1];

let circlePreview = new Circle(new Vec3(0, 0, 0));
circlePreview.m_VertexBuffer = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);
circlePreview.m_IndexBuffer = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);

c.onmousemove = (e) => {
  if (settingWindow && initial.x && initial.y) {
    let v3I = new Vec3(initial.x, initial.y, 0);
    let v3F = new Vec3(e.offsetX - CanvasContext.Width / 2, -(e.offsetY - CanvasContext.Height / 2), 0);
    v3I = v3I.multiplyMat4(camera.view);
    v3F = v3F.multiplyMat4(camera.view);

    if (gameObjects.indexOf(windowObject) != -1)
      gameObjects.splice(gameObjects.indexOf(windowObject), 1);

    let top = Math.max(initial.y, -(e.offsetY - CanvasContext.Height / 2));
    let bottom = Math.min(initial.y, -(e.offsetY - CanvasContext.Height / 2));
    let left = Math.min(initial.x, e.offsetX - CanvasContext.Width / 2);
    let right = Math.max(initial.x, e.offsetX - CanvasContext.Width / 2);

    windowObject = new GameObject("Window", false);
    windowObject.m_VertexBuffer = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);
    windowObject.m_IndexBuffer = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);
    windowObject.m_Vertex =
      [
        left + 1, top - 1, 0,
        right - 1, top - 1, 0,
        right - 1, bottom + 1, 0,
        left + 1, bottom + 1, 0
      ];
    windowObject.m_Index = [0, 1, 1, 2, 2, 3, 3, 0];
    gameObjects.push(windowObject);


    Canvas.CanvasApi.SetLocation(CanvasContext, 2, new Window(new Vec2(Math.min(v3I.x, v3F.x), Math.min(v3I.y, v3F.y)), new Vec2(Math.abs(v3F.x - v3I.x), Math.abs(v3F.y - v3I.y))));
  } else if (settingWindow) {
    if (gameObjects.indexOf(windowObject) != -1)
      gameObjects.splice(gameObjects.indexOf(windowObject), 1);
    Canvas.CanvasApi.SetLocation(CanvasContext, 2, new Window(new Vec2(-1, -1), new Vec2(2, 2)));
  } else {
    if (gameObjects.indexOf(linePreview) != -1) gameObjects.splice(gameObjects.indexOf(linePreview), 1);

    if (selectedOption == 1) {
      linePreview.m_Vertex =
        [
          initial.x, initial.y, 0,
          e.offsetX - CanvasContext.Width / 2, -(e.offsetY - CanvasContext.Height / 2), 0
        ];
      gameObjects.push(linePreview);
    } else if (selectedOption == 2 && initial.x && initial.y) {
      if (gameObjects.indexOf(circlePreview) != -1) gameObjects.splice(gameObjects.indexOf(circlePreview), 1);

      endX = e.offsetX - CanvasContext.Width / 2;
      endY = -(e.offsetY - CanvasContext.Height / 2);

      circlePreview.m_Vertex = [initial.x, initial.y, 0, Math.floor(Math.sqrt(Math.pow(endX - initial.x, 2) + Math.pow(endY - initial.y, 2)))]
      gameObjects.push(circlePreview);
    }
  }
}

c.onmouseleave = (e) => {
  if (settingWindow && initial.x && initial.y) {
    let v3I = new Vec3(initial.x, initial.y, 0);
    let v3F = new Vec3(e.offsetX - CanvasContext.Width / 2, -(e.offsetY - CanvasContext.Height / 2), 0);
    v3I = v3I.multiplyMat4(camera.view);
    v3F = v3F.multiplyMat4(camera.view);

    if (gameObjects.indexOf(windowObject) != -1)
      gameObjects.splice(gameObjects.indexOf(windowObject), 1);

    let top = Math.max(initial.y, -(e.offsetY - CanvasContext.Height / 2));
    let bottom = Math.min(initial.y, -(e.offsetY - CanvasContext.Height / 2));
    let left = Math.min(initial.x, e.offsetX - CanvasContext.Width / 2);
    let right = Math.max(initial.x, e.offsetX - CanvasContext.Width / 2);

    top = Math.min(Math.max(top, - CanvasContext.Height / 2), CanvasContext.Height / 2);
    bottom = Math.min(Math.max(bottom, - CanvasContext.Height / 2), CanvasContext.Height / 2);
    left = Math.min(Math.max(left, - CanvasContext.Width / 2), CanvasContext.Width / 2);
    right = Math.min(Math.max(right, - CanvasContext.Width / 2), CanvasContext.Width / 2);

    windowObject = new GameObject("Window", false);
    windowObject.m_VertexBuffer = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);
    windowObject.m_IndexBuffer = Canvas.CanvasApi.AvaCreateBuffer(CanvasContext, 1);
    windowObject.m_Vertex =
      [
        left + 1, top - 1, 0,
        right - 1, top - 1, 0,
        right - 1, bottom + 1, 0,
        left + 1, bottom + 1, 0
      ];
    windowObject.m_Index = [0, 1, 1, 2, 2, 3, 3, 0];
    gameObjects.push(windowObject);

    Canvas.CanvasApi.SetLocation(CanvasContext, 2, new Window(new Vec2(Math.min(v3I.x, v3F.x), Math.min(v3I.y, v3F.y)), new Vec2(Math.abs(v3F.x - v3I.x), Math.abs(v3F.y - v3I.y))));
    settingWindow = false;
  } else {
    if (gameObjects.indexOf(linePreview) != -1) gameObjects.splice(gameObjects.indexOf(linePreview), 1);
    if (gameObjects.indexOf(circlePreview) != -1) gameObjects.splice(gameObjects.indexOf(circlePreview), 1);
  }

  initial = {};
}

window.addEventListener("resize", () => {
  c.width = document.documentElement.clientWidth * 0.75;
  c.height = document.documentElement.clientHeight;
  offscreen.width = c.width;
  offscreen.height = c.height;
  camera.SetView(Mat4.Viewport(-CanvasContext.Width / 2, CanvasContext.Width / 2, -CanvasContext.Height / 2, CanvasContext.Height / 2, -1, 1));
  Canvas.CanvasApi.SetLocation(CanvasContext, 0, camera);

  cartesian.m_Vertex =
    [
      -CanvasContext.Width / 2, 0, 0,
      CanvasContext.Width / 2, 0, 0,
      0, -CanvasContext.Height / 2, 0,
      0, CanvasContext.Height / 2, 0,
    ];
})


transformationUI.Hide();
WindowMenu.Hide();

gameObjects = [cartesian];
Canvas.CanvasApi.SetLocation(CanvasContext, 2, new Window(new Vec2(-1, -1), new Vec2(2, 2)));
selectedOption = 1;
DrawingMenu.Show();