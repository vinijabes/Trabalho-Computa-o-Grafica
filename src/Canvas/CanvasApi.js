const CanvasContext = require('./CanvasContext');
const { Vec2, Vec3, Vec4, Mat3, Mat4 } = require('../Mat');
const { Shader, VertexArray, Window, Camera } = require('../Renderer');
const { BufferType, DrawMode } = require('../Constants');
const Plane = require('../Engine/GameObject/Classes/Plane');
const Bounds = require('../Engine/GameObject/Classes/Bounds');
const Util = require('../Util');
const Triangle = require('../Engine/GameObject/Classes/Triangle');

var angleX = 0;
var angleY = 0;
var rotationSpeed = 2;

window.onkeypress = function (e) {
    switch (e.keyCode) {
        case 97:
            angleY += rotationSpeed;
            break;
        case 100:
            angleY -= rotationSpeed;
            break;
        case 119:
            angleX += rotationSpeed;
            break;
        case 115:
            angleX -= rotationSpeed;
            break;
    }
}

module.exports = class CanvasApi {

    /** @type {Shader}*/
    static s_Shader;

    /** @type {VertexBuffer}*/
    static s_VertexBuffer;

    /** @type {IndexBuffer}*/
    static s_IndexBuffer;

    /** @type {VertexArray}*/
    static s_VertexArray;

    /** @type {CanvasContext} */
    static s_Context

    static s_zBuffer = [];

    /**
     * 
     * @param {CanvasContext} context 
     */
    static SwapBuffer(context) {
        this.s_zBuffer = this.s_zBuffer.fill(-Infinity);
        context.RawContext.putImageData(context.RendererBuffer, 0, 0);
        context.RendererBuffer = context.RawContext.createImageData(context.Width, context.Height);
    }

    /**
     * 
     * @param {CanvasContext} context 
     */
    static Clear(context, color) {
        context.RawContext.clearRect(0, 0, context.Width, context.Height);
    }

    /**
     * 
     * @param {CanvasContext} context 
     */
    static DrawPixel(context, position, color) {
        if (position.x > context.Width - 2 || position.x < 0 || position.y > context.Height || position.y < 0) return;
        let i = (Math.round(position.y) * Math.floor(context.Width) + Math.round(position.x));
        if (position.z <= this.s_zBuffer[i]) {
            return;
        }
        else {
            this.s_zBuffer[i] = Math.round(position.z);
        }
        //console.log(position, color);  

        const d = context.RendererBuffer.data;
        i *= 4;
        d[i] = color.x * 255;
        d[i + 1] = color.y * 255;
        d[i + 2] = color.z * 255;
        d[i + 3] = color.w * 255;
    }

    /**
     * 
     * @param {CanvasContext} context 
     * @param {Vec2} v1 
     * @param {Vec2} v2 
     * @param {Vec3} color 
     * @param {number} size 
     */
    static DrawLine(context, v1, v2, color, size = 1) {
        const dx = v2.x - v1.x;
        const dy = v2.y - v1.y;
        if (Math.abs(dx) > Math.abs(dy)) {
            this._DrawHorizontalLine(context, { x: v1.x, y: v1.y, z: v1.z }, { x: v2.x, y: v2.y, z: v2.z }, color);
        }
        else {
            this._DrawVerticalLine(context, { x: v1.x, y: v1.y, z: v1.z }, { x: v2.x, y: v2.y, z: v2.z }, color);
        }
    }

    /**
     * 
     * @param {CanvasContext} context 
     * @param {Vec2} center 
     * @param {number} x 
     * @param {number} y 
     */
    static DrawCircleSimetry(context, center, x, y, z, color) {
        // const window = context.GetLocation(2);
        // let transformation = context.GetLocation(1);
        // if (!transformation) transformation = Mat4.Identity();
        let transformation = Mat4.Identity();

        let data = { width: context.Width, height: context.Height, position: new Vec3(x, y, Math.round(origin.z)), color: new Vec4(color.x, color.y, color.z, color.w) };
        context.Shader.Execute(data);

        this.DrawPixel(context, new Vec3(center.x + x, center.y + y, center.z).multiplyMat4(transformation), data.color);
        this.DrawPixel(context, new Vec3(center.x - x, center.y + y, center.z).multiplyMat4(transformation), data.color);
        this.DrawPixel(context, new Vec3(center.x + x, center.y - y, center.z).multiplyMat4(transformation), data.color);
        this.DrawPixel(context, new Vec3(center.x - x, center.y - y, center.z).multiplyMat4(transformation), data.color);
        this.DrawPixel(context, new Vec3(center.x + y, center.y + x, center.z).multiplyMat4(transformation), data.color);
        this.DrawPixel(context, new Vec3(center.x - y, center.y + x, center.z).multiplyMat4(transformation), data.color);
        this.DrawPixel(context, new Vec3(center.x + y, center.y - x, center.z).multiplyMat4(transformation), data.color);
        this.DrawPixel(context, new Vec3(center.x - y, center.y - x, center.z).multiplyMat4(transformation), data.color);
    }

    /**
     * 
     * @param {CanvasContext} context 
     * @param {Vec3} center 
     * @param {Vec3} normal 
     * @param {number} radius 
     * @param {Vec3} color 
     */
    static DrawCircle(context, center, normal, radius, color) {
        let x = 0;
        let y = radius;
        let d = 3 - 2 * radius;
        this.DrawCircleSimetry(context, center, x, y, 0, color);

        while (y >= x) {
            x++;

            if (d > 0) {
                y--;
                d = d + 4 * (x - y) + 10;
            } else {
                d = d + 4 * x + 6;
            }

            this.DrawCircleSimetry(context, center, x, y, 0, color);
        }
    }


    /**
     * 
     * @param {CanvasContext} context 
     * @param {Vec2} center 
     * @param {number} x 
     * @param {number} y 
     */
    static DrawSphereSimetry(context, sphereCenter, center, x, y, z, color) {
        let camera = context.GetLocation(0);
        let aT = camera.projectionViewMatrix.multiplyMat4(Mat4.Scale(0.5, -0.5, 1, 1).multiplyMat4(Mat4.Translation(0.5, 0.5, 0).multiplyMat4(Mat4.Scale(context.Width, context.Height, -999.9, 1))));
        let bT = new Mat4(Util.invertMatrix(aT.elements));

        let radius = Vec3.Sub(sphereCenter, center).Norm();
        sphereCenter = sphereCenter.multiplyMat4(bT);
        let worldCenter = sphereCenter.Clone();
        worldCenter.z += radius;


        let data = { width: context.Width, height: context.Height, position: new Vec3(worldCenter.x + x, worldCenter.y + y, worldCenter.z), color: new Vec4(color.x, color.y, color.z, color.w) };
        //console.log(data.position, sphereCenter);
        context.Shader.UploadData('normal', Vec3.Sub(data.position, sphereCenter).Normalize());
        context.Shader.Execute(data);
        this.DrawPixel(context, new Vec3(center.x + x, center.y + y, center.z), data.color);

        data = { width: context.Width, height: context.Height, position: new Vec3(worldCenter.x - x, worldCenter.y + y, worldCenter.z), color: new Vec4(color.x, color.y, color.z, color.w) };
        context.Shader.UploadData('normal', Vec3.Sub(data.position, sphereCenter).Normalize());
        context.Shader.Execute(data);
        this.DrawPixel(context, new Vec3(center.x - x, center.y + y, center.z), data.color);

        data = { width: context.Width, height: context.Height, position: new Vec3(worldCenter.x + x, worldCenter.y - y, worldCenter.z), color: new Vec4(color.x, color.y, color.z, color.w) };
        context.Shader.UploadData('normal', Vec3.Sub(data.position, sphereCenter).Normalize());
        context.Shader.Execute(data);
        this.DrawPixel(context, new Vec3(center.x + x, center.y - y, center.z), data.color);

        data = { width: context.Width, height: context.Height, position: new Vec3(worldCenter.x - x, worldCenter.y - y, worldCenter.z), color: new Vec4(color.x, color.y, color.z, color.w) };
        context.Shader.UploadData('normal', Vec3.Sub(data.position, sphereCenter).Normalize());
        context.Shader.Execute(data);
        this.DrawPixel(context, new Vec3(center.x - x, center.y - y, center.z), data.color);

        data = { width: context.Width, height: context.Height, position: new Vec3(worldCenter.x + y, worldCenter.y + x, worldCenter.z), color: new Vec4(color.x, color.y, color.z, color.w) };
        context.Shader.UploadData('normal', Vec3.Sub(data.position, sphereCenter).Normalize());
        context.Shader.Execute(data);
        this.DrawPixel(context, new Vec3(center.x + y, center.y + x, center.z), data.color);

        data = { width: context.Width, height: context.Height, position: new Vec3(worldCenter.x - y, worldCenter.y + x, worldCenter.z), color: new Vec4(color.x, color.y, color.z, color.w) };
        context.Shader.UploadData('normal', Vec3.Sub(data.position, sphereCenter).Normalize());
        context.Shader.Execute(data);
        this.DrawPixel(context, new Vec3(center.x - y, center.y + x, center.z), data.color);

        data = { width: context.Width, height: context.Height, position: new Vec3(worldCenter.x + y, worldCenter.y - x, worldCenter.z), color: new Vec4(color.x, color.y, color.z, color.w) };
        context.Shader.UploadData('normal', Vec3.Sub(data.position, sphereCenter).Normalize());
        context.Shader.Execute(data);
        this.DrawPixel(context, new Vec3(center.x + y, center.y - x, center.z), data.color);

        data = { width: context.Width, height: context.Height, position: new Vec3(worldCenter.x - y, worldCenter.y - x, worldCenter.z), color: new Vec4(color.x, color.y, color.z, color.w) };
        context.Shader.UploadData('normal', Vec3.Sub(data.position, sphereCenter).Normalize());
        context.Shader.Execute(data);
        this.DrawPixel(context, new Vec3(center.x - y, center.y - x, center.z), data.color);
    }

    /**
     * 
     * @param {CanvasContext} context 
     * @param {Vec3} center 
     * @param {Vec3} normal 
     * @param {number} radius 
     * @param {Vec3} color 
     */
    static DrawSphere(context, center, normal, radius, color) {
        for (let i = 0; i < radius; i++) {
            let x = 0;
            let y = i;
            let d = 3 - 2 * i;
            this.DrawSphereSimetry(context, center, new Vec3(center.x, center.y, center.z + radius - i), x, y, 0, color);
            this.DrawSphereSimetry(context, center, new Vec3(center.x, center.y, center.z - radius + i), x, y, 0, color);
            this.DrawSphereSimetry(context, center, new Vec3(center.x + 1, center.y, center.z + radius - i), x, y, 0, color);
            this.DrawSphereSimetry(context, center, new Vec3(center.x + 1, center.y, center.z - radius + i), x, y, 0, color);

            while (y >= x) {
                x++;

                if (d > 0) {
                    y--;
                    d = d + 4 * (x - y) + 10;
                } else {
                    d = d + 4 * x + 6;
                }

                this.DrawSphereSimetry(context, center, new Vec3(center.x, center.y, center.z + radius - i), x, y, 0, color);
                this.DrawSphereSimetry(context, center, new Vec3(center.x, center.y, center.z - radius + i), x, y, 0, color);
                this.DrawSphereSimetry(context, center, new Vec3(center.x + 1, center.y, center.z + radius - i), x, y, 0, color);
                this.DrawSphereSimetry(context, center, new Vec3(center.x + 1, center.y, center.z - radius + i), x, y, 0, color);
            }
        }
    }

    /**
     * 
     * @param {CanvasContext} context 
     * @param {Vec2} origin 
     * @param {Vec2} dest 
     * @param {Vec3} color 
     */
    static _DrawVerticalLine(context, origin, dest, color) {
        if (dest.y < origin.y) return this._DrawVerticalLine(context, dest, origin, color);

        let x = origin.x;
        let y = origin.y;

        let dX = dest.x - origin.x;
        const dY = dest.y - origin.y;
        let signalX = Math.sign(dX);
        dX = Math.abs(dX);

        var err = 2 * dX - dY;
        for (let i = y; i < dest.y; i++) {
            let data = { width: context.Width, height: context.Height, position: new Vec3(x, i, Math.round(origin.z)), color: new Vec4(color.x, color.y, color.z, color.w) };
            context.Shader.Execute(data);
            this.DrawPixel(context, data.position, data.color);
            if (err > 0) {
                x += signalX;
                err = err - 2 * dY;
            }

            err = err + 2 * dX;
        }
    }

    /**
     * 
     * @param {CanvasContext} context 
     * @param {Vec2} origin 
     * @param {Vec2} dest 
     * @param {Vec3} color 
     */
    static _DrawHorizontalLine(context, origin, dest, color) {
        if (dest.x < origin.x) return this._DrawHorizontalLine(context, dest, origin, color);

        let x = origin.x;
        let y = origin.y;
        let z = origin.z;

        const dX = dest.x - origin.x;
        let dY = dest.y - origin.y;
        let dZ = dest.z - origin.z;
        let signalY = Math.sign(dY);
        dY = Math.abs(dY);

        var err = 2 * dY - dX;

        let dZStep = (dX != 0) ? dZ / dX : 0;

        let camera = context.GetLocation(0);

        let aT = camera.projectionViewMatrix.multiplyMat4(Mat4.Scale(0.5, -0.5, 1, 1).multiplyMat4(Mat4.Translation(0.5, 0.5, 0).multiplyMat4(Mat4.Scale(context.Width, context.Height, -999.9, 1))));
        let bT = new Mat4(Util.invertMatrix(aT.elements));

        for (let i = x; i < dest.x; i++) {
            let data = { width: context.Width, height: context.Height, position: new Vec3(i, y, Math.round(z)).multiplyMat4(bT), color: new Vec4(color.x, color.y, color.z, color.w) };
            context.Shader.Execute(data);
            this.DrawPixel(context, new Vec3(i, y, Math.round(z)), data.color);
            if (err > 0) {
                y += signalY;
                err = err - 2 * dX;
            }
            err = err + 2 * dY;
            z += dZStep;
        }
    }

    /**
     * 
     * @param {CanvasContext} context 
     * @param {number} n 
     * @param {number} offset 
     */
    static _DrawTriangle(context, n, offset, lineStrip = false) {
        /**@type {Array} */
        const vertexBuffer = context.m_Buffers[context.m_BindedBuffers[BufferType.AVA_ARRAY_BUFFER]];
        /**@type {Array} */
        const indexBuffer = context.m_Buffers[context.m_BindedBuffers[BufferType.AVA_ELEMENT_ARRAY_BUFFER]];
        /**@type {VertexArray} */
        const vertexArray = context.m_VertexArray;

        /**@type {Vec3} */
        let v1, v2, v3;
        let color, normal;

        let vertexBufferSize = vertexBuffer.length;
        let indexBufferSize = indexBuffer.length;

        let triangles = [];
        for (let i = 3; i <= indexBufferSize; i += 3) triangles.push(indexBuffer.slice(i - 3, i));

        const camera = context.GetLocation(0);
        const transformation = context.GetLocation(1);
        const window = context.GetLocation(2);
        let test = [];

        let lightPos = new Vec3(0, 0, 100)
        let observatorPos = camera.m_Transform.m_Position.Clone()//new Vec3(100, 0, 100)//Vec3.Mult(camera.m_Transform.m_Position, 1);
        observatorPos.z += 30;

        context.Shader.UploadData('lightPos', lightPos);
        context.Shader.UploadData('observatorPos', observatorPos);

        let unView = Mat4.Scale(0.5, -0.5, 1, 1).multiplyMat4(Mat4.Translation(0.5, 0.5, 0).multiplyMat4(Mat4.Scale(context.Width, context.Height, -999.9, 1)));
        for (let triangle of triangles) {
            v1 = new Vec3((vertexBuffer[triangle[0] * n + offset]), (vertexBuffer[triangle[0] * n + 1 + offset]), vertexBuffer[triangle[0] * n + 2 + offset]);
            v2 = new Vec3((vertexBuffer[triangle[1] * n + offset]), (vertexBuffer[triangle[1] * n + 1 + offset]), vertexBuffer[triangle[1] * n + 2 + offset]);
            v3 = new Vec3((vertexBuffer[triangle[2] * n + offset]), (vertexBuffer[triangle[2] * n + 1 + offset]), vertexBuffer[triangle[2] * n + 2 + offset]);
            color = new Vec4((vertexBuffer[triangle[0] * n + 3 + offset]), (vertexBuffer[triangle[0] * n + 4 + offset]), vertexBuffer[triangle[0] * n + 5 + offset], vertexBuffer[triangle[0] * n + 6 + offset]);
            normal = new Vec3((vertexBuffer[triangle[0] * n + 7 + offset]), (vertexBuffer[triangle[0] * n + 8 + offset]), vertexBuffer[triangle[0] * n + 9 + offset]);

            if (transformation) {
                v1 = v1.multiplyMat4(transformation);
                v2 = v2.multiplyMat4(transformation);
                v3 = v3.multiplyMat4(transformation);
            }

            v1 = v1.multiplyMat4(camera.projectionViewMatrix);
            v2 = v2.multiplyMat4(camera.projectionViewMatrix);
            v3 = v3.multiplyMat4(camera.projectionViewMatrix);


            // if ((v1.z < -1 || v1.z > 1) && (v2.z < -1 || v2.z > 1) && (v3.z < -1 || v3.z > 1)) {
            //     continue;
            // }
            let clipped;
            if (!(clipped = this.Clip(context, v1, v2, v3))) continue;

            for (let i = 0; i < clipped.length; i++) {
                clipped[i] = clipped[i].multiplyMat4(unView);
            }

            v1 = v1.multiplyMat4(unView);
            v2 = v2.multiplyMat4(unView);
            v3 = v3.multiplyMat4(unView);


            context.Shader.UploadData('normal', normal.Normalize());
            if (!lineStrip) {
                if (clipped.length == 6) {
                    this.DrawTriangle(context, clipped[0], clipped[2], clipped[5], color, normal);
                    this.DrawTriangle(context, clipped[1], clipped[3], clipped[5], color, normal);
                    this.DrawTriangle(context, clipped[0], clipped[1], clipped[5], color, normal);
                    this.DrawTriangle(context, clipped[1], clipped[4], clipped[5], color, normal);
                } else if (clipped.length == 4) {
                    // this.DrawTriangle(context, clipped[0], clipped[2], clipped[5], color, normal);
                    // this.DrawTriangle(context, clipped[1], clipped[3], clipped[5], color, normal);
                    // this.DrawTriangle(context, clipped[0], clipped[1], clipped[5], color, normal);
                    // this.DrawTriangle(context, clipped[1], clipped[4], clipped[5], color, normal);
                } else if (clipped.length == 2) {

                }
                //this.DrawTriangle(context, v1, v2, v3, color, normal);
            } else {
                for (let i = 0; i < clipped.length; i += 2) {
                    this.DrawLine(context, clipped[i], clipped[i + 1], color);
                }
                // this.DrawLine(context, v1, v2, color);
                // this.DrawLine(context, v2, v3, color);
                // this.DrawLine(context, v3, v1, color);
            }
        }
        test = this._ProcessTriangles(test);

        for (let t of test) {
            this.DrawTriangle(context, t.a, t.b, t.c, t.color);
        }
    }

    static Clip(context, v1, v2, v3, striped = true) {
        const camera = context.GetLocation(0);
        let bounds = new Bounds();
        bounds.SetMinMax(
            new Vec3(-1, -1, -3.0),
            new Vec3(1, 1, -1)
        );

        let a = false, b = false, c = false;

        let vertex = [], resultingVertex;

        let result = bounds.ClipEdge(v1, v2);
        if (result) {
            a = b = true;
            vertex.push(...result);
        }

        result = bounds.ClipEdge(v1, v3);
        if (result) {
            a = c = true;
            vertex.push(...result);
        }

        result = bounds.ClipEdge(v2, v3);
        if (result) {
            b = c = true;
            vertex.push(...result);
        }

        if (result.length == 0) return false;

        if(a + b + c == 2){
            let outsideVertex;
            if(!a) outsideVertex = v1;
            if(!b) outsideVertex = v2;
            if(!c) outsideVertex = v3;
        }

        return vertex;
    }

    /**
     * 
     * @param {Array<Triangle>} triangles 
     */
    static _ProcessTriangles(triangles) {
        let rendering = triangles.slice();
        return rendering;
        for (let i = 0; i < rendering.length - 1; i++) {
            for (let j = i + 1; j < rendering.length; j++) {
                let plane = new Plane();
                plane.Set3Points(rendering[i].a, rendering[i].b, rendering[i].c);

                if (plane.m_Normal.Norm() == 0) {
                    //rendering.splice(i--, 1);
                    break;
                }

                let distA = plane.DistanceToPoint(rendering[j].a);
                let distB = plane.DistanceToPoint(rendering[j].b);
                let distC = plane.DistanceToPoint(rendering[j].c);

                if (Math.sign(Math.max(distA, distB, distC)) != Math.sign(Math.min(distA, distB, distC))) {
                } else if ((distA < 0.00000001) + (distB < 0.00000001) + (distC < 0.00000001) < 2) {
                    let iMaxZ = Math.max(rendering[i].a.z, rendering[i].b.z, rendering[i].c.z);
                    let jMaxZ = Math.max(rendering[j].a.z, rendering[j].b.z, rendering[j].c.z);
                    if (iMaxZ < jMaxZ) {
                        if (rendering[j].Inside(rendering[i].a) && rendering[j].Inside(rendering[i].b) && rendering[j].Inside(rendering[i].c)) {
                            //rendering[i].color = new Vec4(0, 0, 0, 1);
                            break;
                        }
                    } else if (iMaxZ >= jMaxZ) {
                        if (rendering[i].Inside(rendering[j].a) && rendering[i].Inside(rendering[j].b) && rendering[i].Inside(rendering[j].c)) {
                            //rendering.splice(j--, 1);
                        }
                    }
                }
            }
        }

        return rendering;
    }

    /**
     * 
     * @param {CanvasContext} context 
     * @param {Vec3} v1 
     * @param {*} v2 
     * @param {*} v3 
     * @param {*} color1 
     * @param {*} color2 
     * @param {*} color3 
     */
    static DrawTriangle(context, v1, v2, v3, color1, normal) {
        const plane = new Plane();
        let camera = context.GetLocation(0);

        let aT = camera.projectionViewMatrix.multiplyMat4(Mat4.Scale(0.5, -0.5, 1, 1).multiplyMat4(Mat4.Translation(0.5, 0.5, 0).multiplyMat4(Mat4.Scale(context.Width, context.Height, -999.9, 1))));
        let bT = new Mat4(Util.invertMatrix(aT.elements));

        plane.Set3Points(v1.multiplyMat4(bT), v2.multiplyMat4(bT), v3.multiplyMat4(bT));

        let lightDist = Vec3.Sub(v1.multiplyMat4(bT), new Vec3(0, 0, 100));
        let lightAngleSign = Math.sign(lightDist.Dot(camera.m_Transform.m_Position) / (lightDist.Norm() * camera.m_Transform.m_Position.Norm()));
        let distSign = Math.sign(plane.DistanceToPoint(new Vec3(0, 0, 100)));
        if (distSign == lightAngleSign) {
            plane.m_Normal.Mult(-1);
            plane.m_Distance *= -1;
        }


        if (v1.y == v2.y && v1.y == v3.y) return;
        let A, B, C;
        if (v1.y >= v2.y && v1.y >= v3.y) {
            C = v1;
            if (v2.y > v3.y) {
                B = v2;
                A = v3;
            } else {
                B = v3;
                A = v2;
            }
        } else if (v2.y >= v1.y && v2.y >= v3.y) {
            C = v2;
            if (v1.y > v3.y) {
                B = v1;
                A = v3;
            } else {
                B = v3;
                A = v1;
            }
        } else {
            C = v3;
            if (v1.y > v2.y) {
                B = v1;
                A = v2;
            } else {
                B = v2;
                A = v1;
            }
        }

        context.Shader.UploadData('normal', normal.Normalize());
        if (B.y == C.y) {
            this._FillBottomFlatTriangle(context, A, B, C, color1);
        } else if (A.y == B.y) {
            this._FillTopFlatTriangle(context, A, B, C, color1);
        } else {
            let plane = new Plane();
            plane.Set3Points(A, B, C);
            let x = (A.x + (B.y - A.y) / (C.y - A.y) * (C.x - A.x));
            let y = B.y;
            let z = plane.m_Normal.z != 0 ? (-plane.m_Distance - plane.m_Normal.x * x - plane.m_Normal.y * y) / plane.m_Normal.z : B.z;
            let D = new Vec3(x, y, z);
            this._DrawHorizontalLine(context, B, D, color1);
            this._FillBottomFlatTriangle(context, A, B, D, color1);
            this._FillTopFlatTriangle(context, B, D, C, color1);
        }
    }

    static _FillBottomFlatTriangle(context, v1, v2, v3, color) {
        let plane = new Plane();
        plane.Set3Points(v1, v2, v3);

        let invslope1 = (v2.y - v1.y > 0) ? (v2.x - v1.x) / (v2.y - v1.y) : 0;
        let invslope2 = (v3.y - v1.y > 0) ? (v3.x - v1.x) / (v3.y - v1.y) : 0;
        let dZ1 = plane.m_Normal.z != 0 ? -(plane.m_Normal.x * invslope1 + plane.m_Normal.y) / plane.m_Normal.z : 0;
        let dZ2 = plane.m_Normal.z != 0 ? -(plane.m_Normal.x * invslope2 + plane.m_Normal.y) / plane.m_Normal.z : 0;

        let curx1 = v1.x;
        let curx2 = v1.x;
        let currz1 = v1.z;
        let currz2 = v1.z;

        for (let scanlineY = v1.y; scanlineY <= v2.y; scanlineY++) {
            this._DrawHorizontalLine(context, { x: curx1, y: scanlineY, z: currz1 }, { x: curx2, y: scanlineY, z: currz2 }, color);
            curx1 += invslope1;
            curx2 += invslope2;
            currz1 += dZ1;
            currz2 += dZ2;
        }
    }

    static _FillTopFlatTriangle(context, v1, v2, v3, color) {
        let plane = new Plane();
        plane.Set3Points(v1, v2, v3);

        let invslope1 = (v3.y - v1.y > 0) ? (v3.x - v1.x) / (v3.y - v1.y) : 0;
        let invslope2 = (v3.y - v2.y > 0) ? (v3.x - v2.x) / (v3.y - v2.y) : 0;
        let dZ1 = plane.m_Normal.z != 0 ? -(plane.m_Normal.x * invslope1 + plane.m_Normal.y) / plane.m_Normal.z : 0;
        let dZ2 = plane.m_Normal.z != 0 ? -(plane.m_Normal.x * invslope2 + plane.m_Normal.y) / plane.m_Normal.z : 0;
        let curx1 = v3.x;
        let curx2 = v3.x;
        let currz1 = v3.z;
        let currz2 = v3.z;

        for (let scanlineY = v3.y; scanlineY > v1.y; scanlineY--) {
            this._DrawHorizontalLine(context, { x: curx1, y: scanlineY, z: currz1 }, { x: curx2, y: scanlineY, z: currz2 }, color);
            curx1 -= invslope1;
            curx2 -= invslope2;
            currz1 -= dZ1;
            currz2 -= dZ2;
        }
    }

    /**
     * @param {CanvasContext} context
     * @param {number} n
     * @returns {Array.<number>} 
     */
    static AvaCreateBuffer(context, n) {
        return context.AvaCreateBuffer(n);
    }

    /**
     * @param {CanvasContext} context
     * @param {BufferType} bufferType 
     * @param {number} buffer 
     */
    static AvaBindBuffer(context, bufferType, buffer) {
        return context.AvaBindBuffer(bufferType, buffer);
    }

    /**
     * @param {CanvasContext} context
     * @param {BufferType} bufferType 
     * @param {number} buffer 
     * @param {Array.<number>} data 
     */
    static AvaSetBufferData(context, bufferType, buffer, data) {
        return context.AvaSetBufferData(bufferType, buffer, data);
    }

    /**
     * @param {CanvasContext} context
     * @param {VertexArray} vertexArray 
     */
    static AvaBindVertexArray(context, vertexArray) {
        context.AvaBindVertexArray(vertexArray);
    }

    /**
     * @param {CanvasContext} context
     * @param {number} location
     * @param {any} value 
     */
    static SetLocation(context, location, value) {
        context.SetLocation(location, value);
    }

    /**
     * @param {CanvasContext} context
     * @param {number} location
     */
    static GetLocation(context, location) {
        return context.GetLocation(location);
    }

    /**
     * @param {CanvasContext} context
     * @param {Shader} shader 
     */
    static AvaBindShader(context, shader) {
        context.Shader = shader;
    }

    /**
     * @param {CanvasContext} context
     * @param {DrawMode} mode 
     * @param {number} n 
     * @param {number} offset
     */
    static AvaDrawElements(context, mode, n, offset = 0) {
        switch (mode) {
            case DrawMode.AVA_LINES:
                this._DrawLine(context, n, offset);
                break;
            case DrawMode.AVA_TRIANGLES:
                this._DrawTriangle(context, n, offset);
                break;
            case DrawMode.AVA_TRIANGLES_STRIP:
                this._DrawTriangle(context, n, offset, true);
                break;
            case DrawMode.AVA_CIRCLE:
                this._DrawCircle(context, n, offset);
                break;
            case DrawMode.AVA_SPHERE:
                this._DrawSphere(context, n, offset);
                break;
        }
        //return context.AvaDrawElements(mode, n, offset);
    }

    /**
     *
     * @param {CanvasContext} context  
     * @param {number} n 
     * @param {number} offset      
     */
    static _DrawLine(context, n, offset) {
        /**@type {Array} */
        const vertexBuffer = context.m_Buffers[context.m_BindedBuffers[BufferType.AVA_ARRAY_BUFFER]];
        /**@type {Array} */
        const indexBuffer = context.m_Buffers[context.m_BindedBuffers[BufferType.AVA_ELEMENT_ARRAY_BUFFER]];
        /**@type {VertexArray} */
        const vertexArray = context.m_VertexArray;

        /**@type {Vec3} */
        let v1, v2;

        let vertexBufferSize = vertexBuffer.length;
        let indexBufferSize = indexBuffer.length;

        let lines = [];
        for (let i = 2; i <= indexBufferSize; i += 2) lines.push(indexBuffer.slice(i - 2, i));

        const camera = context.GetLocation(0);
        const transformation = context.GetLocation(1);

        const window = context.GetLocation(2);
        let unView = Mat4.Scale(0.5, -0.5, 1, 1).multiplyMat4(Mat4.Translation(0.5, 0.5, 0).multiplyMat4(Mat4.Scale(context.Width, context.Height, -999.9, 1)));

        for (let line of lines) {
            v1 = new Vec3((vertexBuffer[line[0] * n + offset]), (vertexBuffer[line[0] * n + 1 + offset]), vertexBuffer[line[0] * n + 2]);
            v2 = new Vec3((vertexBuffer[line[1] * n + offset]), (vertexBuffer[line[1] * n + 1 + offset]), vertexBuffer[line[1] * n + 2]);

            if (transformation) {
                v1 = v1.multiplyMat4(transformation);
                v2 = v2.multiplyMat4(transformation);
            }

            v1 = v1.multiplyMat4((camera.projectionViewMatrix));
            v2 = v2.multiplyMat4((camera.projectionViewMatrix));

            if (v1.z < -1 || v1.z > 1 && v2.z < -1 || v2.z > 1) {
                continue;
            }

            if (!window.Clip(v1, v2)) continue;

            v1 = v1.multiplyMat4(unView);
            v2 = v2.multiplyMat4(unView);

            this.DrawLine(context, v1, v2, { x: 1, y: 1, z: 1, w: 1.0 });
        }
    }

    /**
     *
     * @param {CanvasContext} context  
     * @param {number} n 
     * @param {number} offset      
     */
    static _DrawCircle(context, n, offset) {
        /**@type {Array} */
        const vertexBuffer = context.m_Buffers[context.m_BindedBuffers[BufferType.AVA_ARRAY_BUFFER]];
        /**@type {Array} */
        const indexBuffer = context.m_Buffers[context.m_BindedBuffers[BufferType.AVA_ELEMENT_ARRAY_BUFFER]];
        /**@type {VertexArray} */
        const vertexArray = context.m_VertexArray;

        /**@type {Vec3} */
        let v1;
        let indexBufferSize = indexBuffer.length;

        let circles = indexBuffer.slice();

        const camera = context.GetLocation(0);
        const transformation = context.GetLocation(1);

        for (let circle of circles) {
            v1 = new Vec3((vertexBuffer[circle * n + offset]), (vertexBuffer[circle * n + 1 + offset]), vertexBuffer[circle * n + 2 + offset]);
            let radius = vertexBuffer[circle * n + 3 + offset];
            if (transformation) v1 = v1.multiplyMat4(transformation);

            v1 = v1.multiplyMat4(camera.projectionViewMatrix);

            //if (camera.m_Plane.DistanceToPoint(v1) < 0) continue;

            v1.x = (v1.x / 2 + 0.5) * context.Width;
            v1.y = (-v1.y / 2 + 0.5) * context.Height;

            this.DrawCircle(context, new Vec2(v1.x, v1.y), new Vec3(0, 0, 1), radius, { x: 0, y: 0, z: 0, w: 1.0 });

        }

    }

    /**
     *
     * @param {CanvasContext} context  
     * @param {number} n 
     * @param {number} offset      
     */
    static _DrawSphere(context, n, offset) {
        /**@type {Array} */
        const vertexBuffer = context.m_Buffers[context.m_BindedBuffers[BufferType.AVA_ARRAY_BUFFER]];
        /**@type {Array} */
        const indexBuffer = context.m_Buffers[context.m_BindedBuffers[BufferType.AVA_ELEMENT_ARRAY_BUFFER]];
        /**@type {VertexArray} */
        const vertexArray = context.m_VertexArray;

        /**@type {Vec3} */
        let v1, v2;
        let indexBufferSize = indexBuffer.length;

        let circles = indexBuffer.slice();

        const camera = context.GetLocation(0);
        const transformation = context.GetLocation(1);

        let lightPos = new Vec3(0, 0, 100);

        let observatorPos = camera.m_Transform.m_Position.Clone();//Vec3.Mult(camera.m_Transform.m_Position, 1);
        observatorPos.z += 30;

        context.Shader.UploadData('lightPos', lightPos);
        context.Shader.UploadData('observatorPos', observatorPos);
        let unView = Mat4.Scale(0.5, -0.5, 1, 1).multiplyMat4(Mat4.Translation(0.5, 0.5, 0).multiplyMat4(Mat4.Scale(context.Width, context.Height, -999.9, 1)));

        for (let circle of circles) {
            let radius = vertexBuffer[circle * n + 3 + offset];
            v1 = new Vec3((vertexBuffer[circle * n + offset]), (vertexBuffer[circle * n + 1 + offset]), vertexBuffer[circle * n + 2 + offset]);
            v2 = new Vec3((vertexBuffer[circle * n + offset]), (vertexBuffer[circle * n + 1 + offset]), vertexBuffer[circle * n + 2 + offset] - radius);

            let color = new Vec4(vertexBuffer[circle * n + 4 + offset], vertexBuffer[circle * n + 5 + offset], vertexBuffer[circle * n + 6 + offset], vertexBuffer[circle * n + 7 + offset])
            if (transformation) {
                v1 = v1.multiplyMat4(transformation);
                v2 = v2.multiplyMat4(transformation);
            }


            v1 = v1.multiplyMat4((camera.projectionViewMatrix));
            v2 = v2.multiplyMat4((camera.projectionViewMatrix));
            //console.log(v1, v2, new Vec3(0, 0, 0).multiplyMat4((camera.projectionViewMatrix)));

            if (v1.z < -1 || v1.z > 1 && v2.z < -1 || v2.z > 1) continue;

            v1 = v1.multiplyMat4(unView);
            v2 = v2.multiplyMat4(unView);


            //radius = Vec3.Sub(v1, v2).Norm();
            return;

            this.DrawSphere(context, new Vec3(v1.x, v1.y, v1.z), new Vec3(0, 0, 1), radius, color);
        }

    }
}