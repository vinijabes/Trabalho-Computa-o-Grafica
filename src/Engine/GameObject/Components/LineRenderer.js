const MonoBehavior = require('../MonoBehavior');
const CanvasApi = require('../../../Canvas/CanvasApi');
const Math = require('../../../Mat');
const Mesh = require('../Classes/Mesh');
const MeshRenderer = require('./MeshRenderer'); 
const { Vec3, Mat4 } = Math;
const { DrawMode, BufferType } = require('../../../Constants');
const Renderer = require('../../RendererSystem');

module.exports = class LineRenderer extends MeshRenderer {
    Render() {
        this.GameObject.m_Material.m_Shader.UploadData('Ks', this.GameObject.m_Material.m_Ks);
        this.GameObject.m_Material.m_Shader.UploadData('Kd', this.GameObject.m_Material.m_Kd);
        this.GameObject.m_Material.m_Shader.UploadData('n', this.GameObject.m_Material.m_N);


        CanvasApi.AvaBindBuffer(CanvasApi.s_Context, BufferType.AVA_ARRAY_BUFFER, this.m_VBO);
        CanvasApi.AvaBindBuffer(CanvasApi.s_Context, BufferType.AVA_ELEMENT_ARRAY_BUFFER, this.m_EBO);
        
        CanvasApi.SetLocation(CanvasApi.s_Context, 1, this.GameObject.Transform.Transformation);
    
        CanvasApi.AvaDrawElements(CanvasApi.s_Context, DrawMode.AVA_LINES, 10);
    }

    /**@type {Mesh} */
    set Mesh(newMesh) {
        this.m_Mesh = newMesh;
        this.m_Mesh.EBO = this.m_EBO;
        this.m_Mesh.VBO = this.m_VBO;
    }
}