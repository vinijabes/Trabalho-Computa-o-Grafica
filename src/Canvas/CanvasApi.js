const CanvasContext = require('./CanvasContext');
const { Vec2, Vec3, Vec4, Mat3, Mat4 } = require('../Mat');
const { Shader, VertexArray, Window, Camera } = require('../Renderer');

const BufferType = {
    AVA_ARRAY_BUFFER: 0,
    AVA_ELEMENT_ARRAY_BUFFER: 1
};

const DrawMode = {
    AVA_LINES: 0,
    AVA_TRIANGLES: 1
}

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

    /**
     * 
     * @param {CanvasContext} context 
     */
    static SwapBuffer(context){
        //console.log(context.RendererBuffer);
        context.RawContext.putImageData(context.RendererBuffer, 0, 0);
        context.RendererBuffer = context.RawContext.createImageData(context.Width, context.Height);
    }

    /**
     * 
     * @param {CanvasContext} context 
     */
    static DrawPixel(context, position, color) {
        //const id = context.RawContext.createImageData(1, 1);
        const d = context.RendererBuffer.data;

        d[(Math.round(position.y) * Math.floor(context.Width) + Math.round(position.x))*4] = color.x * 255;
        d[(Math.round(position.y) * Math.floor(context.Width) + Math.round(position.x))*4 + 1] = color.y * 255;
        d[(Math.round(position.y) * Math.floor(context.Width) + Math.round(position.x))*4 + 2] = color.z * 255;
        d[(Math.round(position.y) * Math.floor(context.Width) + Math.round(position.x))*4 + 3] = color.w * 255;
        //context.RawContext.putImageData(id, position.x, position.y);
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
            for (let i = 0; i < size; i++) {
                this._DrawHorizontalLine(context, { x: v1.x, y: v1.y + i }, { x: v2.x, y: v2.y + i }, color);
            }
        }
        else {
            for (let i = 0; i < size; i++) {
                this._DrawVerticalLine(context, { x: v1.x + i, y: v1.y }, { x: v2.x + i, y: v2.y }, color);
            }
        }
    }

    /**
     * 
     * @param {CanvasContext} context 
     * @param {Vec2} center 
     * @param {number} radius 
     * @param {Vec3} color 
     */
    static DrawCircle(context, center, radius, color) {
        //let inc = 1.5/radius*Math.sqrt(radius);
        // this.DrawPixel(context, center, color);
        // for(let i = 0; i < 360; i += inc){
        //     let x = Math.round(radius*Math.cos(i/180*Math.PI)) + center.x;
        //     let y = Math.round(radius*Math.sin(i/180*Math.PI)) + center.y;

        //     this.DrawPixel(context, {x, y}, color);
        // }

        let inc = 1.5 / radius * Math.sqrt(radius);


        for (let y = -radius * Math.sqrt(2) / 2; y < radius * Math.sqrt(2) / 2; y += inc) {
            let x = Math.sqrt(radius * radius - y * y);
            this.DrawPixel(context, { x: center.x + x, y: center.y + y }, color);
            this.DrawPixel(context, { x: center.x - x, y: center.y + y }, color);
        }

        for (let x = -radius * Math.sqrt(2) / 2; x < radius * Math.sqrt(2) / 2; x += inc) {
            let y = Math.sqrt(radius * radius - x * x);
            this.DrawPixel(context, { x: center.x + x, y: center.y + y }, color);
            this.DrawPixel(context, { x: center.x + x, y: center.y - y }, color);
        }

        // for(let y = 0; y < radius*Math.sqrt(2)/2; y += inc){
        //     let x = Math.sqrt(radius*radius - y*y);
        //     this.DrawPixel(context, {x: center.x + x, y: center.y + y}, color);
        //     this.DrawPixel(context, {x: center.x - x, y: center.y + y}, color);
        // }
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

        const dX = Math.abs(dest.x - origin.x);
        const dY = Math.abs(dest.y - origin.y);

        let signalX = Math.sign(dest.x - origin.x);
        let signalY = Math.sign(dest.y - origin.y);

        if (signalX < 0) x -= 1;
        if (signalY < 0) y -= 1;

        var err = 2 * dY - dX;

        for (let i = 0; i < dY; i++) {
            this.DrawPixel(context, { x, y }, color);
            while (err >= 0) {
                x += signalX;
                err = err - 2 * dY;
            }

            y += signalY;
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

        const dX = Math.abs(dest.x - origin.x);
        const dY = Math.abs(dest.y - origin.y);

        let signalX = Math.sign(dest.x - origin.x);
        let signalY = Math.sign(dest.y - origin.y);

        var err = 2 * dY - dX;

        if (signalX < 0) x -= 1;
        if (signalY < 0) y -= 1;

        for (let i = 0; i < dX; i++) {
            this.DrawPixel(context, { x, y }, color);
            while (err >= 0) {
                y += signalY;
                err = err - 2 * dX;
            }

            x += signalX;
            err = err + 2 * dY;
        }
    }

    static DrawTriangle(context, v1, v2, v3) {
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
    static SetLocation(context, location, value){
        context.SetLocation(location, value);
    }

    /**
     * @param {CanvasContext} context
     * @param {number} location
     */
    static GetLocation(context, location){
        return context.GetLocation(location);
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
                this._DrawTriangle(n, offset);
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
        const ortho = Mat4.Ortho();
        const matrix = new Mat3([[1, 0, 0.2], [0, 1, 0.1], [0, 0, 1]]);
        // const rotationX = Mat4.RotationX(angleX);
        // const rotationY = Mat4.RotationY(angleY);
        const translation1 = Mat4.Translation(-150, -150, -(100 + 320) / 2);
        const translation2 = Mat4.Translation(150, 150, (100 + 320) / 2);
        const cavaleira = Mat4.Cavaleira();
        const cabinet = Mat4.Cabinet();
        const scaleM = Mat4.Scale(1, 1, 1, 0.5);
        const identity = Mat4.Identity();
        const viewport = Mat4.Viewport(-context.Width/2, context.Width/2, -context.Height/2, context.Height/2, -1, 1, 0, 0);

        const camera = context.GetLocation(0);
        const transformation = context.GetLocation(1);
        
        const window = new Window(new Vec2(-1, -1), new Vec2(2, 2));

        for (let line of lines) {
            v1 = new Vec3((vertexBuffer[line[0] * n + offset]), (vertexBuffer[line[0] * n + 1 + offset]), vertexBuffer[line[0] * n + 2]);
            v2 = new Vec3((vertexBuffer[line[1] * n + offset]), (vertexBuffer[line[1] * n + 1 + offset]), vertexBuffer[line[1] * n + 2]);

            // v1 = v1.multiplyMat4(translation1);
            // v2 = v2.multiplyMat4(translation1);

            // v1 = v1.multiplyMat4(rotationX);
            // v2 = v2.multiplyMat4(rotationX);

            // v1 = v1.multiplyMat4(rotationY);
            // v2 = v2.multiplyMat4(rotationY);

            // v1 = v1.multiplyMat4(scaleM);
            // v2 = v2.multiplyMat4(scaleM);

            // v1 = v1.multiplyMat4(translation2);
            // v2 = v2.multiplyMat4(translation2);
            
            if(transformation){
                v1 = v1.multiplyMat4(transformation);
                v2 = v2.multiplyMat4(transformation);
            }

            v1 = v1.multiplyMat4(camera.m_Transformation.multiplyMat4(camera.projectionViewMatrix));
            v2 = v2.multiplyMat4(camera.m_Transformation.multiplyMat4(camera.projectionViewMatrix));

            //v1 = viewport.multiplyVec3(v1);
            //v2 = viewport.multiplyVec3(v2);

            //console.log(v1);
            // v1 = v1.multiplyMat3(matrix);
            // v2 = v2.multiplyMat3(matrix);

            // let scale = 1;

            // v1.x = v1.x / context.Width;
            // v1.y = v1.y / context.Height;

            // v2.x = v2.x / context.Width;
            // v2.y = v2.y / context.Height;
            if (!window.Clip(v1, v2)) continue;

            v1.x = (v1.x / 2 + 0.5) * context.Width;
            v1.y = (-v1.y / 2 + 0.5) * context.Height;

            v2.x = (v2.x / 2 + 0.5) * context.Width;
            v2.y = (-v2.y / 2 + 0.5) * context.Height;



            this.DrawLine(context, v1, v2, { x: 0, y: 0, z: 0, w: 1.0 });
        }
    }
}