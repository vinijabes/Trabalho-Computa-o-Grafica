const MonoBehavior = require('../MonoBehavior');
const CanvasApi = require('../../../Canvas/CanvasApi');
const Math = require('../../../Mat');
const Mesh = require('../Classes/Mesh');
const MeshRenderer = require('./MeshRenderer'); 
const { Vec3, Mat4 } = Math;
const { DrawMode, BufferType } = require('../../../Constants');
const Renderer = require('../../RendererSystem');

module.exports = class SphereRenderer extends MeshRenderer {
    Render() {
        CanvasApi.AvaBindBuffer(CanvasApi.s_Context, BufferType.AVA_ARRAY_BUFFER, this.m_VBO);
        CanvasApi.AvaBindBuffer(CanvasApi.s_Context, BufferType.AVA_ELEMENT_ARRAY_BUFFER, this.m_EBO);
        
        CanvasApi.SetLocation(CanvasApi.s_Context, 1, Mat4.Identity()); 
        CanvasApi.AvaDrawElements(CanvasApi.s_Context, DrawMode.AVA_SPHERE, 4);
    }

    set Radius(newRadius){
        this.m_Radius = newRadius;

        let indices = [0];
        let vertices = [this.GameObject.Transform.m_Position.x, this.GameObject.Transform.m_Position.y, this.GameObject.Transform.m_Position.z, newRadius];

        this.m_Mesh.Index = indices;
        this.m_Mesh.Vertex = vertices;
    }

    /**@type {Mesh} */
    set Mesh(newMesh) {
        this.m_Mesh = newMesh;
        this.m_Mesh.EBO = this.m_EBO;
        this.m_Mesh.VBO = this.m_VBO;
    }
}