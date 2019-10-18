const MonoBehavior = require('../MonoBehavior');
const Math = require('../../../Mat');
const { Vec3, Mat4 } = Math;
const RigidBody = require('./RigidBody');
const Bounds = require('../Classes/Bounds');
const MeshRenderer = require('./MeshRenderer');

module.exports = class Collider extends MonoBehavior {
    /**@type {RigidBody} */
    m_AttachedRigidBody;

    /**@type {Bounds} */
    m_Bounds;


    Start() {
        this.m_Bounds = new Bounds();
        this.m_Bounds.SetMinMax(new Vec3(-50, -50, -110), new Vec3(50, 50, 110));

        this.m_mesh = new MeshRenderer();
        this.GameObject.AddComponent(this.m_mesh);

        this.m_mesh.m_Mesh.Vertex = [
            this.m_Bounds.Min.x,
            this.m_Bounds.Min.y,
            this.m_Bounds.Min.z,
            this.m_Bounds.Min.x + this.m_Bounds.m_Size.x,
            this.m_Bounds.Min.y,
            this.m_Bounds.Min.z,
            this.m_Bounds.Min.x,
            this.m_Bounds.Min.y + this.m_Bounds.m_Size.y,
            this.m_Bounds.Min.z,
            this.m_Bounds.Min.x,
            this.m_Bounds.Min.y,
            this.m_Bounds.Min.z + this.m_Bounds.m_Size.z,
            this.m_Bounds.Min.x + this.m_Bounds.m_Size.x,
            this.m_Bounds.Min.y + this.m_Bounds.m_Size.y,
            this.m_Bounds.Min.z,
            this.m_Bounds.Min.x + this.m_Bounds.m_Size.x,
            this.m_Bounds.Min.y,
            this.m_Bounds.Min.z + this.m_Bounds.m_Size.z,
            this.m_Bounds.Min.x,
            this.m_Bounds.Min.y + this.m_Bounds.m_Size.y,
            this.m_Bounds.Min.z + this.m_Bounds.m_Size.z,
            this.m_Bounds.Min.x + this.m_Bounds.m_Size.x,
            this.m_Bounds.Min.y + this.m_Bounds.m_Size.y,
            this.m_Bounds.Min.z + this.m_Bounds.m_Size.z,
        ];
        this.m_mesh.m_Mesh.Index = [0, 1, 0, 2, 0, 3, 1, 4, 1, 5, 2, 6, 3, 5, 3, 6, 4, 7, 5, 7, 6, 7];
    }
}