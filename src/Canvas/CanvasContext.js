const { Vec2, Vec3, Vec4 } = require('../Mat');
const { BufferType, DrawMode } = require('../Constants');
const VertexArray = require('../Renderer/VertexArray');
const Shader = require('../Renderer/Shader');
const API = require('./CanvasApi');

module.exports = class CanvasContext {
    /**@type {Array.<Object>}*/
    m_Buffers = [];

    /**@type {Array.<Object>}*/
    m_BindedBuffers = Array(Object.keys(BufferType).length);

    /**@type {VertexArray} */
    m_VertexArray = [];

    /**@type {Array.<any>}*/
    m_Locations = [];

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    constructor(context) {
        this.m_Context = context;
        this.RendererBuffer = context.createImageData(this.Width, this.Height);

        this.Shader = new Shader();
        this.Shader.UploadData('ambientColor', new Vec3(0.1, 0.09, 0.0));
        this.Shader.UploadData('specularColor', new Vec3(1.0, 1.0, 1.0));
        this.Shader.UploadData('Ka', 1.0);
        this.Shader.UploadData('Kd', 0.9);
        this.Shader.UploadData('Ks', 0.4);
        this.Shader.UploadData('n', 5);
        this.Shader.Compile((ava, location) => {
            let N = location.normal;
            let L = Vec3.Sub(location.lightPos, ava.position).Normalize();
            let R = (N.Clone().Mult(2 * N.Dot(L))).Sub(L);
            let S = Vec3.Sub(location.observatorPos, ava.position).Normalize();

            let cosTeta = Math.abs((N.Dot(L)) / (N.Norm() * L.Norm()));
            let cosAlpha = Math.abs((R.Dot(S)) / (R.Norm() * S.Norm()));

            let d = Vec3.Sub(location.lightPos, ava.position).Norm()/70;
            //console.log(d);
            let k = 0.1;
            ava.color = new Vec4(
                Vec3.Add(
                    location.ambientColor.Mult(location.Ka),
                    ava.color.Mult(location.Kd * cosTeta))
                , 1.0);

            // ava.color = new Vec4(
            //     Vec3.Add(
            //         location.ambientColor.Mult(location.Ka),
            //         ava.color.Mult((location.Kd * cosTeta + location.Ks * cosAlpha * cosAlpha)/(k + d)))
            //     , 1.0);
        });
    }

    /**
     * 
     * @param {number} n
     * @returns {Array.<number>} 
     */
    AvaCreateBuffer(n) {
        let emptyIndex = 0;
        let bufferIndex = [];
        while (n--) {
            while (this.m_Buffers[emptyIndex])++emptyIndex;
            this.m_Buffers[emptyIndex] = [];
            bufferIndex.push(emptyIndex);
        }
        return bufferIndex;
    }

    /**
     * 
     * @param {BufferType} bufferType 
     * @param {number} buffer 
     */
    AvaBindBuffer(bufferType, buffer) {
        switch (bufferType) {
            case BufferType.AVA_ARRAY_BUFFER:
            case BufferType.AVA_ELEMENT_ARRAY_BUFFER:
                this.m_BindedBuffers[bufferType] = buffer;
                break;
            default:
                throw "Invalid BufferType"
        }
    }

    /**
     * 
     * @param {BufferType} bufferType 
     * @param {number} buffer 
     * @param {Array.<number> | Array.<Vec3>} data 
     */
    AvaSetBufferData(bufferType, buffer, data) {
        this.AvaBindBuffer(bufferType, buffer);
        this.m_Buffers[buffer] = data;
    }

    /**
     * 
     * @param {VertexArray} vertexArray 
     */
    AvaBindVertexArray(vertexArray) {
        this.m_VertexArray = vertexArray;
    }

    /**
     * 
     * @param {DrawMode} mode 
     * @param {number} n 
     * @param {number} offset
     */
    AvaDrawElements(mode, n, offset = 0) {
        switch (mode) {
            case DrawMode.AVA_LINES:
                this._DrawLine(n, offset);
                break;
            case DrawMode.AVA_TRIANGLES:
                this._DrawTriangle(n, offset);
                break;
        }
    }

    /**
     * 
     * @param {number} n 
     * @param {number} offset      
     */
    _DrawLine(n, offset) {
        /**@type {Array} */
        const vertexBuffer = this.m_Buffers[this.m_BindedBuffers[BufferType.AVA_ARRAY_BUFFER]];
        /**@type {Array} */
        const indexBuffer = this.m_Buffers[this.m_BindedBuffers[BufferType.AVA_ELEMENT_ARRAY_BUFFER]];

        /**@type {Vec3} */
        let v1, v2;

        let vertexBufferSize = vertexBuffer.length;
        let indexBufferSize = indexBuffer.length;

        let lines = [];
        for (let i = 2; i <= indexBufferSize; i += 2) lines.push(indexBuffer.slice(i - 2, i));

        for (let line of lines) {
            v1 = new Vec3(vertexBuffer[line[0] * n], vertexBuffer[line[0] * n + 1], vertexBuffer[line[0] * n + 2]);
            v2 = new Vec3(vertexBuffer[line[1] * n], vertexBuffer[line[1] * n + 1], vertexBuffer[line[1] * n + 2]);

            this.DrawLine(v1, v2, { x: 1.0, y: 0, z: 0, w: 1.0 });
        }
    }

    /**
     * 
     * @param {number} n 
     * @param {number} offset      
     */
    _DrawTriangle(n, offset) {
        /**@type {Array} */
        const vertexBuffer = this.m_Buffers[this.m_BindedBuffers[BufferType.AVA_ARRAY_BUFFER]];
        /**@type {Array} */
        const indexBuffer = this.m_Buffers[this.m_BindedBuffers[BufferType.AVA_ELEMENT_ARRAY_BUFFER]];

        /**@type {Vec3} */
        let v1, v2, v3;

        let vertexBufferSize = vertexBuffer.length;
        let indexBufferSize = indexBuffer.length;

        let triangles = [];
        for (let i = 3; i <= indexBufferSize; i += 3) triangles.push(indexBuffer.slice(i - 3, i));

        for (let triangle of triangles) {
            v1 = vertexBuffer[triangle[0]];
            v2 = vertexBuffer[triangle[1]];
            v3 = vertexBuffer[triangle[2]];
        }
    }

    /**
     * 
     * @param {Vec2} v1 
     * @param {Vec2} v2 
     * @param {Vec3} color 
     * @param {number} size 
     */
    DrawLine(v1, v2, color, size = 1) {
        const dx = v2.x - v1.x;
        const dy = v2.y - v1.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            for (let i = 0; i < size; i++) {
                this._DrawHorizontalLine({ x: v1.x, y: v1.y + i }, { x: v2.x, y: v2.y + i }, color);
            }
        }
        else {
            for (let i = 0; i < size; i++) {
                this._DrawVerticalLine({ x: v1.x + i, y: v1.y }, { x: v2.x + i, y: v2.y }, color);
            }
        }
    }

    /**
     *  
     * @param {Vec2} origin 
     * @param {Vec2} dest 
     * @param {Vec3} color 
     */
    _DrawVerticalLine(origin, dest, color) {
        const dx = dest.x - origin.x;
        const dy = dest.y - origin.y;

        const derr = Math.abs(dx / dy);
        let err = 0.0;

        let x = origin.x;
        if (dest.y < origin.y) return this._DrawVerticalLine(dest, origin, color);

        if (dest.x - origin.x != 0) {
            const a = (dest.y - origin.y) / (dest.x - origin.x);
            const b = -a * origin.x + origin.y;
            for (let i = origin.y; i <= dest.y; i++) {
                let x = (i - b) / a;
                this.DrawPixel({ x: x, y: i }, color);
            }
        } else {
            for (let i = origin.y; i <= dest.y; i++) {
                this.DrawPixel({ x: origin.x, y: i }, color);
            }
        }
    }

    /**
     * 
     * @param {Vec2} origin 
     * @param {Vec2} dest 
     * @param {Vec3} color 
     */
    _DrawHorizontalLine(origin, dest, color) {
        const dx = dest.x - origin.x;
        const dy = dest.y - origin.y;

        const derr = Math.abs(dy / dx);
        let err = 0.0;

        let y = origin.y;
        if (dest.x < origin.x) return this._DrawHorizontalLine(dest, origin, color);

        const a = (dest.y - origin.y) / (dest.x - origin.x);
        const b = -a * origin.x + origin.y;
        for (let i = origin.x; i <= dest.x; i++) {
            let y = a * i + b;
            this.DrawPixel({ x: i, y: y }, color);
        }
        return;
    }

    /**
     * @param {number} location
     * @param {any} value 
     */
    SetLocation(location, value) {
        this.m_Locations[location] = value;
    }

    /**
     * @param {number} location
     * @returns {any}
     */
    GetLocation(location) {
        return this.m_Locations[location];
    }

    get RawContext() { return this.m_Context; }
    get Width() { return this.m_Context.canvas.width; }
    get Height() { return this.m_Context.canvas.height; }
}