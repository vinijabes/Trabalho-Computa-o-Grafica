const {Vec3, Mat4} = require('../Mat');
const {CanvasApi, CanvasContext} = require('../Canvas');

module.exports = class GameObject{
    /**@type {Vec3}*/
    m_Position;

    /**@type {Mat4}*/
    m_Transformation;

    /**@type {number}*/
    m_VertexBuffer;

    /**@type {number}*/
    m_IndexBuffer;

    /**@type {Array<Vec3>} */
    m_Vertex;

    /**@type {Array<Vec3>} */
    m_Index;

    constructor(){

    }

    Update(delta){

    }

    /**
     * 
     * @param {CanvasContext} context 
     */
    Render(context){
        CanvasApi.AvaBindBuffer(context, CanvasContext.BufferType.AVA_ARRAY_BUFFER, this.m_VertexBuffer);
        CanvasApi.AvaSetBufferData(context, CanvasContext.BufferType.AVA_ARRAY_BUFFER, this.m_VertexBuffer, this.m_Vertex);

        CanvasApi.AvaBindBuffer(context, CanvasContext.BufferType.AVA_ELEMENT_ARRAY_BUFFER, this.m_IndexBuffer);
        CanvasApi.AvaSetBufferData(context, CanvasContext.BufferType.AVA_ELEMENT_ARRAY_BUFFER, this.m_IndexBuffer, this.m_Index);

        CanvasApi.AvaDrawElements(context, CanvasContext.DrawMode.AVA_LINES, 3);
    }
}