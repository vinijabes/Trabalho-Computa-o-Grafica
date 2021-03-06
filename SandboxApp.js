const Ava = require('./src/Ava.js');
const Canvas = Ava.Canvas;
const GO = Ava.Engine.GameObject;
const { Mat4, Vec3, Vec2, Vec4 } = Ava.Math;
const Camera = Ava.Renderer.Camera;
const CavaleiraCamera = Ava.Renderer.CavaleiraCamera;
const VertexArray = Ava.Renderer.VertexArray;
const Window = Ava.Renderer.Window;
const Shader = Ava.Renderer.Shader;
const UI = require('./src/UI');
const TransformationUI = require('./src/Scripts/TransformationUI');
const MeshRenderer = Ava.Engine.Components.MeshRenderer;
const SphereRenderer = Ava.Engine.Components.SphereRenderer;
const PixelRenderer = Ava.Engine.Components.PixelRenderer;
const RendererSystem = Ava.Engine.RendererSystem;
const Time = Ava.Engine.Time;
const Util = require('./src/Util/index');
const BilinearSurface = require('./Sandbox/BilinearSurface');
const SeedFill = require('./Sandbox/SeedFill');
const ColorInvertion = require('./Sandbox/ColorInvertion');
const Sweeping = require('./Sandbox/Sweeping');

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

let shader = new Shader();
shader.UploadData('phong', true);
shader.UploadData('lightPos', new Vec3(0, 0, 100));
shader.Compile((ava, location) => {
  let N = location.normal;
  let L = Vec3.Sub(location.lightPos, ava.position).Normalize();
  let R = (N.Clone().Mult(2 * N.Dot(L))).Sub(L).Normalize();
  let S = Vec3.Sub(location.observatorPos, ava.position).Normalize();
  let cosTeta = ((N.Dot(L)) / (N.Norm() * L.Norm()));
  let cosAlpha = (R.Dot(S)) / (R.Norm() * S.Norm());
  if (cosTeta < 0 || cosAlpha < 0) cosAlpha = 0;

  let d = Vec3.Sub(location.lightPos, ava.position).Norm() / (Math.sqrt(ava.width ** 2 + ava.height ** 2) / 8);
  let k = 0.3;

  if (!location.phong) {
    ava.color = new Vec4(
      Vec3.Add(
        Vec3.Mult(ava.color, 0.26),
        ava.color.Mult(location.Kd * cosTeta))
      , 1.0);
  } else {
    ava.color = new Vec4(Vec3.Mult(ava.color, 0.2 + 1 * (location.Kd * cosTeta + location.Ks * Math.pow(cosAlpha, location.n)) / (k + d)), 1.0);
  }
});


let multipleLightPointsShader = new Shader();
multipleLightPointsShader.Compile("let N = location.normal; let L = this.Vec3.Sub(location.lightPos, ava.position).Normalize(); let R = (N.Clone().Mult(2 * N.Dot(L))).Sub(L).Normalize(); let S = this.Vec3.Sub(location.observatorPos, ava.position).Normalize(); let cosTeta = ((N.Dot(L)) / (N.Norm() * L.Norm())); let cosAlpha = (R.Dot(S)) / (R.Norm() * S.Norm()); if(cosAlpha < 0) cosAlpha = 0; let d = this.Vec3.Sub(location.lightPos, ava.position).Norm() / (Math.sqrt(ava.width**2 + ava.height**2)/8); let k = 0.3; ava.color = new this.Vec4(this.Vec3.Mult(ava.color, 0.2 + 1.4 * (location.Kd * cosTeta + location.Ks * Math.pow(cosAlpha, location.n)) / (k + d)), 1.0);");

let sphere = new GO();
sphere.m_Material.m_Shader = shader;
sphere.m_Material.m_Ks = 0.8;
sphere.m_Material.m_Kd = 0.3;
sphere.m_Material.m_N = 50;
sphere.AddComponent(SphereRenderer);
sphere.GetComponent(SphereRenderer).Radius = 50;
sphere.GetComponent(SphereRenderer).Color = new Vec4(1, 0, 1, 1);
sphere.GetComponent(SphereRenderer).m_Strip = true;

let sphere2 = new GO();
sphere2.m_Material.m_Shader = shader;
sphere2.m_Material.m_Ks = 0.8;
sphere2.m_Material.m_Kd = 0.3;
sphere2.m_Material.m_N = 50;
sphere2.AddComponent(SphereRenderer);
sphere2.GetComponent(SphereRenderer).Radius = 35;
sphere2.GetComponent(SphereRenderer).Color = new Vec4(1, 0, 0, 1);
sphere2.Transform.Translate(new Vec3(100, 0, 35));

/**RAMPA INIT */

let b1 = new BilinearSurface(new Vec3(0, 0, 80), new Vec3(20, 0, 80), new Vec3(0, 0, 0), new Vec3(20, 0, 0), new Vec4(0, 0, 1, 1));
let b2 = new BilinearSurface(new Vec3(20, 0, 80), new Vec3(20, 20, 80), new Vec3(20, 0, 0), new Vec3(20, 20, 0), new Vec4(1, 1, 0, 1));
let b3 = new BilinearSurface(new Vec3(0, 20, 80), new Vec3(20, 20, 80), new Vec3(0, 0, 80), new Vec3(20, 0, 80), new Vec4(0, 1, 0, 1));
let b4 = new BilinearSurface(new Vec3(20, 20, 0), new Vec3(60, 20, 0), new Vec3(20, 0, 0), new Vec3(60, 0, 0), new Vec4(1, 0, 0, 1));
let b5 = new BilinearSurface(new Vec3(20, 20, 80), new Vec3(40, 20, 0), new Vec3(20, 0, 80), new Vec3(40, 0, 0), new Vec4(0, 1, 1, 1));

let object = new GO();
object.AddChild(b1);
object.AddChild(b2);
object.AddChild(b3);
object.AddChild(b4);
object.AddChild(b5);

object.m_Center = new Vec3(30, 10, 40);
object.Transform.Scale(1, 1, 1, 0.5);

/**RAMPA END */

/**SEED FILL INIT */

let seed = new SeedFill();

/**SEED FILL END */

/**COLOR INVERTION INIT */

let CI = new ColorInvertion([
  { v1: new Vec3(0, 0, 0), v2: new Vec3(0, 100, 0), color: new Vec4(1, 1, 1, 1) },
  { v1: new Vec3(0, 100, 0), v2: new Vec3(70, 50, 0), color: new Vec4(1, 1, 1, 1) },
  { v1: new Vec3(70, 50, 0), v2: new Vec3(140, 100, 0), color: new Vec4(1, 1, 1, 1) },
  { v1: new Vec3(140, 100, 0), v2: new Vec3(140, 0, 0), color: new Vec4(1, 1, 1, 1) },
  { v1: new Vec3(140, 0, 0), v2: new Vec3(0, 0, 0), color: new Vec4(1, 1, 1, 1) },
]);

/**COLOR INVERTION END */

/**SWEEPING INIT */

let SW = new Sweeping();
SW.AddPoint(new Vec3(30, 0, 0));
SW.AddPoint(new Vec3(70, 40, 0));
SW.AddPoint(new Vec3(100, 100, 0));
SW.AddPoint(new Vec3(150, 60, 0));

/**SWEEPING END */

let plane = new GO();
plane.m_Material.m_Ks = 0.4;
plane.m_Material.m_Kd = 0.7;
plane.m_Material.m_N = 5;
plane.m_Material.m_Shader = shader;
plane.AddComponent(MeshRenderer);

TestObject.m_Material.m_Ks = 0.4;
TestObject.m_Material.m_Kd = 0.7;
TestObject.m_Material.m_N = 5;

let light = new GO();
light.AddComponent(SphereRenderer);
light.GetComponent(SphereRenderer).Radius = 5;
light.GetComponent(SphereRenderer).Color = new Vec4(1, 1, 1, 1);
light.Transform.Translate(new Vec3(100, 0, 100));
light.SetActive(false);

const verticesPlano =
  [
    0, 0, 0, 0, 0, 1, 1, 0, 0, 1,
    100, 0, 0, 0, 0, 1, 1, 0, 0, 1,
    0, 100, 0, 0, 0, 1, 1, 0, 0, 1,
    100, 100, 0, 0, 0, 1, 1, 0, 0, 1
  ]

const indicesPlano = [
  0, 1, 2,
  1, 2, 3
];

plane.GetComponent(MeshRenderer).m_Mesh.Index = indicesPlano;
plane.GetComponent(MeshRenderer).m_Mesh.Vertex = verticesPlano;
//plane.GetComponent(MeshRenderer).m_Strip = true;

let boundings = new GO();
boundings.AddComponent(MeshRenderer);
boundings.GetComponent(MeshRenderer).m_Strip = true;
boundings.GetComponent(MeshRenderer).m_Mesh.Vertex = [
  -CanvasContext.Width / 2 + 2, -CanvasContext.Height / 2 + 2, 999, 1, 1, 1, 1, 0, 0, 0,
  -CanvasContext.Width / 2 + 2, CanvasContext.Height / 2 - 2, 999, 1, 1, 1, 1, 0, 0, 0,
  CanvasContext.Width / 2 - 2, CanvasContext.Height / 2 - 2, 1, 1, 1, 1, 1, 0, 0, 0,
]

boundings.GetComponent(MeshRenderer).m_Mesh.Index = [
  0, 1, 2
]

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

//console.log(Mat4.Frustum(-1.0, 1.0, 1.0, -1.0, -1.0, 1.0));

TestObject.Transform.Scale(1, 1, 1, 1 / 4);
TestObject.Transform

let camera = new CavaleiraCamera();
let projection = () => {
  return Mat4.Cavaleira();
  return Mat4.OrthoFrustum(-1.0, 1.0, -1.0, 1.0, 0.1, 1000);
  //return Mat4.Perspective(45, 1, 0.1, 1000)
};//Mat4.Frustum(-1.0, 1.0, -1.0, 1.0, 50, 600);//Mat4.Ortho();//

camera.SetProjection(projection());
camera.SetView(Mat4.Viewport(-CanvasContext.Width / 2, CanvasContext.Width / 2, -CanvasContext.Height / 2, CanvasContext.Height / 2, -1, 1));
//camera.Follow(sphere);

let viewport = Mat4.Viewport(-CanvasContext.Width / 2, CanvasContext.Width / 2, -CanvasContext.Height / 2, CanvasContext.Height / 2, -1, 1);

let testInvert = new Mat4(Util.invertMatrix(camera.projectionViewMatrix.elements));

let points = [];

points.push(new Vec3(0, 0, 0));
points.push(new Vec3(0, 0, 400));
points.push(new Vec3(0, 0, -400));
points.push(new Vec3(0, Math.floor(CanvasContext.Height / 2), 0));
points.push(new Vec3(0, -Math.floor(CanvasContext.Height / 2), 0));
points.push(new Vec3(Math.floor(CanvasContext.Width / 2), 0, 0));
points.push(new Vec3(-Math.floor(CanvasContext.Width / 2), 0, 0));

//camera.m_Transform.GoTo(new Vec3(10, 10, 10));
console.groupCollapsed("(0, 0, 1) CAMERA");
camera.m_Transform.RotateTo(0, 90, 0);
camera.Update();

console.log(camera.Position);
console.log(camera.Back);
for (let p of points) {
  console.log(p.multiplyMat4(camera.projectionViewMatrix), p);
}
console.groupEnd("(0, 0, 1) CAMERA");

console.groupCollapsed("(0, 0, -1) CAMERA");
camera.m_Transform.RotateTo(180, 90, 0);
camera.Update();

console.log(camera.Position);
console.log(camera.Back);
for (let p of points) {
  console.log(p.multiplyMat4(camera.projectionViewMatrix), p);
}
console.groupEnd("(0, 0, -1) CAMERA");

console.groupCollapsed("(0, 1, 0) CAMERA");
camera.m_Transform.RotateTo(90, 90, 0);
camera.Update();

console.log(camera.Position);
console.log(camera.Back);
for (let p of points) {
  console.log(p.multiplyMat4(camera.projectionViewMatrix), p);
}
console.groupEnd("(0, 1, 0) CAMERA");

console.groupCollapsed("(0, -1, 0) CAMERA");
camera.m_Transform.RotateTo(-90, 90, 0);
camera.Update();

console.log(camera.Position);
console.log(camera.Back);
for (let p of points) {
  console.log(p.multiplyMat4(camera.projectionViewMatrix), p);
}
console.groupEnd("(0, -1, 0) CAMERA");

console.groupCollapsed("(1, 0, 0) CAMERA");
camera.m_Transform.RotateTo(0, 0, 0);
camera.Update();

console.log(camera.Position);
console.log(camera.Back);
for (let p of points) {
  console.log(p.multiplyMat4(camera.projectionViewMatrix), p);
}
console.groupEnd("(1, 0, 0) CAMERA");

console.groupCollapsed("(-1, 0, 0) CAMERA");
camera.m_Transform.RotateTo(0, 180, 0);
camera.Update();

console.log(camera.Position);
console.log(camera.Back);
for (let p of points) {
  console.log(p.multiplyMat4(camera.projectionViewMatrix), p);
}
console.groupEnd("(-1, 0, 0) CAMERA");

console.groupCollapsed("(1, 0, 1) CAMERA");
camera.m_Transform.RotateTo(0, 45, 0);
camera.Update();

console.log(camera.Position);
console.log(camera.Back);
for (let p of points) {
  console.log(p.multiplyMat4(camera.projectionViewMatrix), p);
}
console.groupEnd("(1, 0, 1) CAMERA");

camera.m_Transform.GoTo(new Vec3(0, 0, 100))
for (let i = 180; i >= 0; i--) {
  camera.m_Transform.RotateTo(i, 90, 0);
  camera.Update();
  console.log(i, camera.Front, new Vec3(100, 100, 0).multiplyMat4(camera.projectionViewMatrix));
}

camera.m_Transform.RotateTo(0, 90, 0);
camera.m_Transform.GoTo(new Vec3(0, 0, -50))

Canvas.CanvasApi.SetLocation(CanvasContext, 0, camera);
Canvas.CanvasApi.SetLocation(CanvasContext, 2, new Window(new Vec2(-1, -1), new Vec2(2, 2)));

let gameObjects = [];
//gameObjects.push(sphere);


let menu = new UI.Menu(new UI.HTMLObject(document.getElementById('menu')));
let select = new UI.Select(null);

let projectionSelect = new UI.Select(null);
projectionSelect.AddOption('Ortogonal', Mat4.Ortho());
// projectionSelect.AddOption('Cavaleira', Mat4.Cavaleira());
// projectionSelect.AddOption('Cabinet', Mat4.Cabinet());

projectionSelect.onChange = (value) => {
  camera.SetProjection(value);
}

let v1Text = new UI.Text(null, "v1: (0, 0, 0)");
let v2Text = new UI.Text(null, "v2: (0, 0, 0)");
let v3Text = new UI.Text(null, "v3: (0, 0, 0)");
let v4Text = new UI.Text(null, "v4: (0, 0, 0)");

let vxInput = new UI.Input(null, "");
let vyInput = new UI.Input(null, "");
let vzInput = new UI.Input(null, "");
let v5Text = new UI.Text(null, "v4: (0, 0, 0)");

let TextX = new UI.Text(null, "X: ");
let TextY = new UI.Text(null, "Y: ");
let TextZ = new UI.Text(null, "Z: ");

let CasaButton = new UI.Button(null, 'Casa');
let JanelaButton = new UI.Button(null, 'Janela + Linhas');
let CirculosButton = new UI.Button(null, 'Círculos + Linhas');
let PauseButton = new UI.Button(null, 'Pause');

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

// DrawingMenu.AddChild(DrawLineButton);
// DrawingMenu.AddChild(DrawCircleButton);
//DrawingMenu.AddChild(PauseButton);

DrawingMenu.m_DomNode.style.marginTop = '8px';

let checkMenu = new UI.Menu(null);
checkMenu.m_DomNode.style.flexDirection = 'row';
checkMenu.m_DomNode.style.justifyContent = 'start';
checkMenu.m_DomNode.style.marginTop = '8px';
checkMenu.m_DomNode.style.marginLeft = '12px';
let Checkbox = new UI.Checkbox(null, true);
Checkbox.m_DomNode.style.marginTop = 'auto';
Checkbox.m_DomNode.style.marginBottom = 'auto';

checkMenu.AddChild(Checkbox);
checkMenu.AddChild(new UI.Text(null, "Phong Shader"));

// menu.AddChild(select);
menu.AddChild(projectionSelect);
menu.AddChild(checkMenu);
menu.AddChild(v1Text);
menu.AddChild(v2Text);
menu.AddChild(v3Text);
menu.AddChild(v4Text);
menu.AddChild(vxInput);
menu.AddChild(vyInput);
menu.AddChild(vzInput);
menu.AddChild(v5Text);
// menu.AddChild(TextX);
// menu.AddChild(TextY);
// menu.AddChild(TextZ);
// menu.AddChild(CasaButton);
// menu.AddChild(JanelaButton);
// menu.AddChild(CirculosButton);

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

  shader.UploadData('phong', Checkbox.Value());
  //test.Update();

  //object.Update(delta);
  //seed.Update();
  //CI.Update();
  SW.Update();

  //sphere.Update();
  //sphere2.Update();
  //plane.Update();
  //boundings.Update();
  //light.Update();
  //TestObject.Update();
  camera.Update(delta);
  menu.Update(delta);

  let v1 = new Vec3(-CanvasContext.Width / 2, -CanvasContext.Height / 2, 0.1).multiplyMat4(camera.projectionViewMatrix);
  let v2 = new Vec3(CanvasContext.Width / 2, CanvasContext.Height / 2, 0.1).multiplyMat4(camera.projectionViewMatrix);
  let v3 = new Vec3(CanvasContext.Width / 2, CanvasContext.Height / 2, 999).multiplyMat4(camera.projectionViewMatrix);
  let v4 = camera.Position.multiplyMat4(camera.projectionViewMatrix);

  let v5 = new Vec3(parseInt(vxInput.Value()), parseInt(vyInput.Value()), parseInt(vzInput.Value())).multiplyMat4(camera.projectionViewMatrix);

  let bounds = new Ava.Engine.Classes.Bounds();
  bounds.SetMinMax(v1, v3);
  //console.log(bounds.Contains(new Vec3(100, 100, 0)), bounds.Contains(new Vec3(0, 100, 0)), bounds.Contains(new Vec3(100, 0, 0)));
  v1Text.SetText(`v1: (${v1.x.toFixed(2)}, ${v1.y.toFixed(2)}, ${v1.z.toFixed(2)})`);
  v2Text.SetText(`v2: (${v2.x.toFixed(2)}, ${v2.y.toFixed(2)}, ${v2.z.toFixed(2)})`);
  v3Text.SetText(`v3: (${v3.x.toFixed(2)}, ${v3.y.toFixed(2)}, ${v3.z.toFixed(2)})`);
  v4Text.SetText(`v4: (${v4.x.toFixed(2)}, ${v4.y.toFixed(2)}, ${v4.z.toFixed(2)})`);
  v5Text.SetText(`v5: (${v5.x.toFixed(2)}, ${v5.y.toFixed(2)}, ${v5.z.toFixed(2)})`);
  let v = bounds.Max.Sub(bounds.Min);
  //console.log(v.x ** 2 + v.y ** 2 + v.z ** 2);
  if (!select.Value()) return;
  // TextX.SetText(`X: ${select.Value().center().x.toFixed(2)}`);
  // TextY.SetText(`Y: ${select.Value().center().y.toFixed(2)}`);
  // TextZ.SetText(`Z: ${select.Value().center().z.toFixed(2)}`);
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
let elapsed = 0;
let fpsInterval = 1000 / 60;
var frame = function (now) {
  delta += now - last;
  elapsed = now - last;

  if (!paused && elapsed > fpsInterval) {
    //if (!Ava.Engine.InputController.Instance().IsKeyDown(13)) return;
    update(1 / 60);

    last = now - (elapsed % fpsInterval);
    count++;

    if (delta > 1000) {
      //console.clear();
      console.log(count);
      count = 0;
      delta = 0;
    }

    //update();
    CanvasContext.RawContext.clearRect(0, 0, CanvasContext.Width, CanvasContext.Height);
    //Canvas.CanvasApi.DrawCircle(CanvasContext, { x: CanvasContext.Width / 2, y: CanvasContext.Height / 2 }, new Vec3(0, 0, 1), 2, { x: 0, y: 0, z: 0, w: 1.0 })
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
  initial = {};
  return;
  if (!settingWindow) { 
    if (selectedOption == 1) {
      select.AddOption('Linha', g);
    } else if (selectedOption == 2) {
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

    Canvas.CanvasApi.SetLocation(CanvasContext, 2, new Window(new Vec2(Math.min(v3I.x, v3F.x), Math.min(v3I.y, v3F.y)), new Vec2(Math.abs(v3F.x - v3I.x), Math.abs(v3F.y - v3I.y))));
    settingWindow = false;
  }
  initial = {};
  //Canvas.CanvasApi.DrawLine(CanvasContext, initial, end, { x: 1.0, y: 0, z: 0, w: 1.0 }, 1);
  //Canvas.CanvasApi.DrawCircle(CanvasContext, initial, Math.sqrt((initial.x - end.x) ** 2 + (initial.y - end.y) ** 2), { x: Math.random(), y: Math.random(), z: Math.random(), w: 1.0 })
}

c.onmousemove = (e) => {
  if (initial.x && initial.y)
    SW.AddPoint(new Vec3(e.offsetX - CanvasContext.Width / 2, -(e.offsetY - CanvasContext.Height / 2), 0));
  return;
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
  return;
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
  camera.SetProjection(projection());
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

//gameObjects = [cartesian];
Canvas.CanvasApi.SetLocation(CanvasContext, 2, new Window(new Vec2(-1, -1), new Vec2(2, 2)));
selectedOption = 1;
DrawingMenu.Show();