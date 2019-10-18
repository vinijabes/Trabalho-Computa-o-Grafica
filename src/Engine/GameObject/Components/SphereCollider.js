const Collider = require('./Collider');
const Math = require('../../../Mat');
const { Vec3, Mat4 } = Math;
const RigidBody = require('./RigidBody');
const Plane = require('../Classes/Plane');
const MeshRenderer = require('./MeshRenderer')

module.exports = class SphereCollider extends Collider {
    /**@type {RigidBody} */
    m_AttachedRigidBody;

    /**@type {Vec3} */
    m_Center;

    /**@type {number} */
    m_Radius;

    Start() {
        super.Start();
        this.UpdateBounds();
        this.plane = new Plane();
        this.plane.m_Normal = new Vec3(1, 1, 0).Normalize();
        this.m_Bounds.m_Center = this.GameObject.Transform.m_Position;

        this.m_MeshTest = new MeshRenderer();
        this.m_MeshTest.m_Transform = Mat4.Identity();
        this.GameObject.AddComponent(this.m_MeshTest);
    }

    Update() {
        super.Update();
        let point = this.plane.ClosestPointInPlane(this.m_Center);
        this.m_MeshTest.m_Mesh.Vertex = [point.x, point.y, point.z, this.m_Center.x, this.m_Center.y, this.m_Center.z];
        this.m_MeshTest.m_Mesh.Index = [0, 1];
        this.UpdateBounds();
    }

    UpdateBounds() {
        this.m_Center = this.m_Bounds.m_Center;
        this.m_Radius = this.m_Bounds.m_Extents.Norm();
    }
}