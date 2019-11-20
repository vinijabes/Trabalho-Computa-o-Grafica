const { Vec3, Mat4 } = require('../Mat');
const { CanvasApi, CanvasContext } = require('../Canvas');
const { BufferType, DrawMode } = require('../Constants')
const GameObject = require('./Object');

module.exports = class Circle extends GameObject {
    /**
     * 
     * @param {Vec3} position 
     */
    constructor(position) {
        super("Circle", true);
        this.m_Vertex = [position.x, position.y, 0, position.z];
        this.m_Index = [0];
        this.m_Position = position;
    }

    /**
     * 
     * @param {CanvasContext} context 
     */
    Render(context) {
        CanvasApi.AvaBindBuffer(context, BufferType.AVA_ARRAY_BUFFER, this.m_VertexBuffer);
        CanvasApi.AvaSetBufferData(context, BufferType.AVA_ARRAY_BUFFER, this.m_VertexBuffer, this.m_Vertex);

        CanvasApi.AvaBindBuffer(context, BufferType.AVA_ELEMENT_ARRAY_BUFFER, this.m_IndexBuffer);
        CanvasApi.AvaSetBufferData(context, BufferType.AVA_ELEMENT_ARRAY_BUFFER, this.m_IndexBuffer, this.m_Index);

        this.m_Transformation = Mat4.RotationX(45, this.center().x, this.center().y, this.center().z);

        CanvasApi.SetLocation(context, 1, this.m_Transformation);
        CanvasApi.AvaDrawElements(context, DrawMode.AVA_CIRCLE, 4);
    }

    center() {
        return new Vec3(this.m_Position.x, this.m_Position.y, 0);
    }
}