const MonoBehavior = require('../MonoBehavior');
const CanvasApi = require('../../../Canvas/CanvasApi');
const { Vec4, Mat4 } = require('../../../Mat');
const Mesh = require('../Classes/Mesh');
const MeshRenderer = require('./MeshRenderer');
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

        CanvasApi.AvaDrawElements(CanvasApi.s_Context, DrawMode.AVA_TRIANGLES_STRIP, 10);
    }

    CalculateTriangles() {
        let indices = [];
        let vertices = [];
        let stackCount = 9;
        let sectorCount = 18;

        let sectorStep = 2 * Math.PI / sectorCount;
        let stackStep = Math.PI / stackCount;
        let sectorAngle, stackAngle;
        let lengthInv = 1.0 / this.m_Radius;
        let normals = [];

        for (let i = 0; i <= stackCount; ++i) {
            stackAngle = Math.PI / 2 - i * stackStep;
            let xy = this.m_Radius * Math.cos(stackAngle);
            let z = this.m_Radius * Math.sin(stackAngle);

            for (let j = 0; j <= sectorCount; ++j) {
                sectorAngle = j * sectorStep;

                let x = xy * Math.cos(sectorAngle);
                let y = xy * Math.sin(sectorAngle);
                vertices.push(x, y, z, this.m_Color.x, this.m_Color.y, this.m_Color.z, 1, x * lengthInv, y * lengthInv, z * lengthInv);

                normals.push(x * lengthInv);
                normals.push(y * lengthInv);
                normals.push(z * lengthInv);
            }
        }

        for (let i = 0; i < stackCount; i++) {
            let k1 = i * (sectorCount + 1);
            let k2 = k1 + sectorCount + 1;

            for (let j = 0; j < sectorCount; ++j, ++k1, ++k2) {
                if (i != 0) {
                    indices.push(k1, k2);
                    indices.push(k2, k1 + 1);
                    indices.push(k1 + 1, k1);
                }

                if (i != (stackCount - 1)) {
                    indices.push(k1 + 1, k2);
                    indices.push(k2, k2 + 1);
                    indices.push(k2 + 1, k1 + 1);
                }
            }
        }
        // let indices = [0];
        // let vertices = [this.GameObject.Transform.m_Position.x, this.GameObject.Transform.m_Position.y, this.GameObject.Transform.m_Position.z, this.m_Radius, this.m_Color.x, this.m_Color.y, this.m_Color.z, this.m_Color.w];

        this.m_Mesh.Index = indices;
        this.m_Mesh.Vertex = vertices;
    }

    set Radius(newRadius) {
        this.m_Radius = newRadius;
        this.CalculateTriangles();
    }

    set Color(newColor) {
        this.m_Color = newColor;
        this.CalculateTriangles();
    }

    /**@type {Mesh} */
    set Mesh(newMesh) {
        this.m_Mesh = newMesh;
        this.m_Mesh.EBO = this.m_EBO;
        this.m_Mesh.VBO = this.m_VBO;
    }
}