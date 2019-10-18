const CanvasApi = require('../../../Canvas/CanvasApi');
const { BufferType } = require('../../../Constants');

module.exports = class Mesh {
    /**@type {number} */
    m_VBO;

    /**@type {number} */
    m_EBO;

    /**@type {Array<number>} */
    m_Vertex = [];

    /**@type {Array<number>} */
    m_Index = [];

    _UpdateBufferData() {
        if (this.m_VBO) {
            CanvasApi.AvaBindBuffer(CanvasApi.s_Context, BufferType.AVA_ARRAY_BUFFER, this.m_VBO);
            CanvasApi.AvaSetBufferData(CanvasApi.s_Context, BufferType.AVA_ARRAY_BUFFER, this.m_VBO, this.Vertex);
        }

        if (this.m_EBO) {
            CanvasApi.AvaBindBuffer(CanvasApi.s_Context, BufferType.AVA_ELEMENT_ARRAY_BUFFER, this.m_EBO);
            CanvasApi.AvaSetBufferData(CanvasApi.s_Context, BufferType.AVA_ELEMENT_ARRAY_BUFFER, this.m_EBO, this.Index);
        }        
    }

    get Vertex() { return this.m_Vertex; }
    get Index() { return this.m_Index; }

    set Vertex(newVertex) {
        this.m_Vertex = newVertex;
        this._UpdateBufferData();
    }
    set Index(newIndex) {
        this.m_Index = newIndex;
        this._UpdateBufferData();
    }
    set VBO(newVBO) {
        this.m_VBO = newVBO;
        this._UpdateBufferData();
    }
    set EBO(newEBO) {
        this.m_EBO = newEBO;
        this._UpdateBufferData();
    }
}