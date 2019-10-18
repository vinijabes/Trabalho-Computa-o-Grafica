const MonoBehavior = require('../MonoBehavior');
const CanvasApi = require('../../../Canvas/CanvasApi');
const Math = require('../../../Mat');
const Mesh = require('../Classes/Mesh');
const { Vec3, Mat4 } = Math;
const { DrawMode, BufferType } = require('../../../Constants');
const Renderer = require('../../RendererSystem');

module.exports = class MeshRenderer extends MonoBehavior {
    /**@type {Mesh} */
    m_Mesh;

    /**@type {number} */
    m_VAO;

    /**@type {number} */
    m_VBO;

    /**@type {number} */
    m_EBO;

    Start() {
        //this.m_VAO = CanvasApi.AvaCreateVertexArray(CanvasApi.s_Context, 1);
        this.m_VBO = CanvasApi.AvaCreateBuffer(CanvasApi.s_Context, 1);
        this.m_EBO = CanvasApi.AvaCreateBuffer(CanvasApi.s_Context, 1);
        this.Mesh = new Mesh();
    }

    Update() {
        Renderer.Submit(this);
    }

    Render() {
        CanvasApi.AvaBindBuffer(CanvasApi.s_Context, BufferType.AVA_ARRAY_BUFFER, this.m_VBO);
        CanvasApi.AvaBindBuffer(CanvasApi.s_Context, BufferType.AVA_ELEMENT_ARRAY_BUFFER, this.m_EBO);

        CanvasApi.SetLocation(CanvasApi.s_Context, 1, this.GameObject.Transform.Transformation);
        
        CanvasApi.AvaDrawElements(CanvasApi.s_Context, DrawMode.AVA_LINES, 3);
    }

    /**@type {Mesh} */
    set Mesh(newMesh) {
        this.m_Mesh = newMesh;
        this.m_Mesh.EBO = this.m_EBO;
        this.m_Mesh.VBO = this.m_VBO;
    }
}