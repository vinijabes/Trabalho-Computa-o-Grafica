const Camera = require('./Camera');
const { Vec3, Mat4 } = require('../Mat/index');

module.exports = class CavaleiraCamera extends Camera {
    projection = Mat4.Cavaleira();

    UpdateProjectionViewMatrix() {
        this.projectionViewMatrix = this.view.multiplyMat4(this.projection);
    }


    Update(delta) {
        super.Update();
    }

    /**
     * 
     * @param {Vec3} point 
     */
    PointToWorldCoord(point) {
        let p = point.multiplyMat4(this.projectionViewMatrix);
        p.x = (p.x / 2 + 0.5) * CanvasApi.s_Context.Width;
        p.y = (-p.y / 2 + 0.5) * CanvasApi.s_Context.Height;
    }

    Follow(GameObject) {
        this.following = GameObject;
    }

    get unProject() { return new Mat4(Utils.invertMatrix(this.projectionViewMatrix.elements)); }
    get Position() { return this.m_Transform.m_Position; }
    get Back() {
        if (this.following) {
            let v = Vec3.Sub(this.Position, this.following.Transform.m_Position).Mult(-1).Normalize();
            if (v.Norm() > 0) return v;
        }

        let back = new Vec3();
        let pitch = Math.PI / 180 * this.m_Transform.m_LocalEulerAngles.x;
        let yaw = Math.PI / 180 * this.m_Transform.m_LocalEulerAngles.y;
        back.x = Math.cos(pitch) * Math.cos(yaw);
        back.y = Math.sin(pitch);
        back.z = Math.cos(pitch) * Math.sin(yaw);
        return back.Normalize();
    }

    get Front() {
        return this.Back.Mult(-1);
    }

    get Up() {
        if (this.following) {
            let v = Vec3.Sub(this.Position, this.following.Transform.m_Position).Mult(-1).multiplyMat4(Mat4.RotationX(90, 0, 0)).Normalize();
            if (v.Norm() > 0) return v;
        }

        let up = new Vec3();
        let pitch = Math.PI / 180 * (this.m_Transform.m_LocalEulerAngles.x + 90);
        let yaw = Math.PI / 180 * this.m_Transform.m_LocalEulerAngles.y;
        up.x = Math.cos(pitch) * Math.cos(yaw);
        up.y = Math.sin(pitch);
        up.z = Math.cos(pitch) * Math.sin(yaw);

        return up.Normalize();
    }

    Contains(v1){
        return true;
    }

    get Right() {
        return this.Front.Cross(this.Up);
    }
}