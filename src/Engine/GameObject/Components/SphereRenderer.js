const MonoBehavior = require('../MonoBehavior');
const CanvasApi = require('../../../Canvas/CanvasApi');
const Math = require('../../../Mat');
const Mesh = require('../Classes/Mesh');
const MeshRenderer = require('./MeshRenderer');
const { Vec4, Mat4 } = Math;
const { DrawMode, BufferType } = require('../../../Constants');
const Renderer = require('../../RendererSystem');

module.exports = class SphereRenderer extends MeshRenderer {
    m_Color = new Vec4(1, 1, 1, 1);

    Render() {
        CanvasApi.AvaBindShader(CanvasApi.s_Context, this.GameObject.m_Material.m_Shader);
        this.GameObject.m_Material.m_Shader.UploadData('Ks', this.GameObject.m_Material.m_Ks);
        this.GameObject.m_Material.m_Shader.UploadData('Kd', this.GameObject.m_Material.m_Kd);
        this.GameObject.m_Material.m_Shader.UploadData('n', this.GameObject.m_Material.m_N);

        CanvasApi.AvaBindBuffer(CanvasApi.s_Context, BufferType.AVA_ARRAY_BUFFER, this.m_VBO);
        CanvasApi.AvaBindBuffer(CanvasApi.s_Context, BufferType.AVA_ELEMENT_ARRAY_BUFFER, this.m_EBO);

        if (!this.m_Transform)
            CanvasApi.SetLocation(CanvasApi.s_Context, 1, this.GameObject.Transform.Transformation);
        else
            CanvasApi.SetLocation(CanvasApi.s_Context, 1, this.GameObject.Transform.m_Transform);

        CanvasApi.AvaDrawElements(CanvasApi.s_Context, DrawMode.AVA_SPHERE, 8);
    }

    set Radius(newRadius) {
        this.m_Radius = newRadius;

        let indices = [0];
        let vertices = [this.GameObject.Transform.m_Position.x, this.GameObject.Transform.m_Position.y, this.GameObject.Transform.m_Position.z, this.m_Radius, this.m_Color.x, this.m_Color.y, this.m_Color.z, this.m_Color.w];

        this.m_Mesh.Index = indices;
        this.m_Mesh.Vertex = vertices;
    }

    set Color(newColor) {
        this.m_Color = newColor;
        let vertices = [this.GameObject.Transform.m_Position.x, this.GameObject.Transform.m_Position.y, this.GameObject.Transform.m_Position.z, this.m_Radius, this.m_Color.x, this.m_Color.y, this.m_Color.z, this.m_Color.w];

        this.m_Mesh.Vertex = vertices;
    }

    /**@type {Mesh} */
    set Mesh(newMesh) {
        this.m_Mesh = newMesh;
        this.m_Mesh.EBO = this.m_EBO;
        this.m_Mesh.VBO = this.m_VBO;
    }
}