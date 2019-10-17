const { Vec3, Mat4 } = require('../Mat');
const { CanvasApi, CanvasContext } = require('../Canvas');
const GameObject = require('./GameObject');

module.exports = class Circle extends GameObject {
    /**
     * 
     * @param {Vec3} position 
     */
    constructor(position) {
        super("Circle", false);
        this.m_Vertex = [position.x, position.y, position.z];
        this.m_Index = [0];
    }

    /**
     * 
     * @param {CanvasContext} context 
     */
    Render(context) {
        CanvasApi.AvaBindBuffer(context, CanvasContext.BufferType.AVA_ARRAY_BUFFER, this.m_VertexBuffer);
        CanvasApi.AvaSetBufferData(context, CanvasContext.BufferType.AVA_ARRAY_BUFFER, this.m_VertexBuffer, this.m_Vertex);

        CanvasApi.AvaBindBuffer(context, CanvasContext.BufferType.AVA_ELEMENT_ARRAY_BUFFER, this.m_IndexBuffer);
        CanvasApi.AvaSetBufferData(context, CanvasContext.BufferType.AVA_ELEMENT_ARRAY_BUFFER, this.m_IndexBuffer, this.m_Index);

        CanvasApi.SetLocation(context, 1, this.m_Transformation);
        CanvasApi.AvaDrawElements(context, CanvasContext.DrawMode.AVA_CIRCLE, 3);
    }
}