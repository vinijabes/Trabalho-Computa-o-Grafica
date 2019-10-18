const Collider = require('./Collider');
const Math = require('../../../Mat');
const { Vec3, Mat4 } = Math;
const RigidBody = require('./RigidBody');
const Plane = require('../Classes/Plane');
const CircleRenderer = require('./CircleRenderer')
const MeshRenderer = require('./MeshRenderer');

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
        this.plane.m_Normal = new Vec3(0, 1, 0).Normalize();
        this.m_Bounds.m_Center = this.GameObject.Transform.m_Position;

        this.m_CircleTest = new CircleRenderer();
        this.m_CircleTest.m_Transform = Mat4.Identity();
        this.GameObject.AddComponent(this.m_CircleTest);

        this.m_MeshTest = new MeshRenderer();
        this.m_MeshTest.m_Transform = Mat4.Identity();
        this.GameObject.AddComponent(this.m_MeshTest);
    }

    Update() {
        super.Update();
        let point = this.plane.ClosestPointInPlane(this.m_Center, this.m_Radius);
        let circlePoint = Vec3.Sub(this.m_Center, Vec3.Mult(this.plane.m_Normal, this.m_Radius));
        let minDist = this.plane.DistanceToPoint(circlePoint);
        if (minDist < 0) {
            circlePoint = Vec3.Add(this.m_Center, Vec3.Mult(this.plane.m_Normal, this.m_Radius));
            minDist = this.plane.DistanceToPoint(circlePoint);
            if (minDist < 0) {
                this.m_MeshTest.m_Mesh.Vertex = [point.x, point.y, point.z, circlePoint.x, circlePoint.y, circlePoint.z];
                this.m_MeshTest.m_Mesh.Index = [0, 1];
            }else{                
                this.m_MeshTest.m_Mesh.Index = [];
            }
        } else {
            this.m_MeshTest.m_Mesh.Vertex = [point.x, point.y, point.z, circlePoint.x, circlePoint.y, circlePoint.z];
            this.m_MeshTest.m_Mesh.Index = [0, 1];
        }

        this.m_CircleTest.m_Mesh.Index = [0];
        this.m_CircleTest.m_Mesh.Vertex = [this.m_Center.x, this.m_Center.y, this.m_Radius];

        this.UpdateBounds();
    }

    UpdateBounds() {
        this.m_Center = this.m_Bounds.m_Center;
        this.m_Radius = this.m_Bounds.m_Extents.Norm();
    }

    /**
     * 
     * @param {Vec3} point 
     */
    InsideSphere(point) {
        let dist = Vec3.Sub(this.m_Center, point).Norm();
        return dist < this.m_Radius;
    }
}