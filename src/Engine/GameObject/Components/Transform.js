const MonoBehavior = require('../MonoBehavior');
const Math = require('../../../Mat');
const { Vec3, Mat4 } = Math;

module.exports = class Transform extends MonoBehavior {
    /**@type {Vec3} */
    m_Position;

    /**@type {Vec3} */
    m_LocalPosition;

    /**@type {Vec3} */
    m_Scale;

    /**@type {Vec3} */
    m_LocalScale;

    /**@type {Mat4} */
    m_Rotation;

    /**@type {Mat4} */
    m_LocalRotation;

    /**@type {Vec3} */
    m_LocalEulerAngles;

    /**@type {boolean} */
    m_HasChanged;

    /**@type {Transform} */
    m_Parent;


    Start() {
        this.m_Position = new Vec3(0, 0, 0);
        this.m_LocalPosition = new Vec3(0, 0, 0);
        this.m_Scale = new Vec3(1, 1, 1);
        this.m_LocalScale = new Vec3(1, 1, 1);
        this.m_Rotation = Mat4.Identity();
        this.m_LocalRotation = Mat4.Identity();
        this.m_LocalEulerAngles = new Vec3(0, 0, 0);
        this._BuildTransformationMatrix();
    }

    Update() {
        if (this.m_HasChanged) {
            this._BuildTransformationMatrix();
            this.m_HasChanged = false;
        }
    }

    _BuildTransformationMatrix() {
        this.m_TransformationMatrix = Math.Mat4.Scale(this.m_Scale.x, this.m_Scale.y, this.m_Scale.z, this.m_Scale.w).multiplyMat4(this.m_Rotation).multiplyMat4(Math.Mat4.Translation(this.m_Position.x, this.m_Position.y, this.m_Position.z));
    }

    get Up() { return Math.Vec3.Up().multiplyMat4(this.m_Rotation).Normalize(); }
    get Right() { return Math.Vec3.Right().multiplyMat4(this.m_Rotation).Normalize(); }
    get Forward() { return Math.Vec3.Forward().multiplyMat4(this.m_Rotation).Normalize(); }
    get Transformation() { return this.m_TransformationMatrix; }

    Rotate(xAngle, yAngle, zAngle, relativeTo) {
        this.m_HasChanged = true;
        this.m_LocalEulerAngles.x += xAngle;
        this.m_LocalEulerAngles.y += yAngle;
        this.m_LocalEulerAngles.z += zAngle;

        const X1 = Math.Mat4.RotationX(this.m_LocalEulerAngles.x);
        const Z2 = Math.Mat4.RotationZ(this.m_LocalEulerAngles.y);
        const X3 = Math.Mat4.RotationX(this.m_LocalEulerAngles.z);

        const RotationMatrix = X1.multiplyMat4(Z2).multiplyMat4(X3);
        this.m_LocalRotation = RotationMatrix;
        if (this.m_Parent) this.m_Rotation = this.m_Parent.m_Rotation.multiplyMat4(this.m_LocalRotation);
        else this.m_Rotation = this.m_LocalRotation;
    }

    Translate(translation, relativeTo) {
        this.m_HasChanged = true;
        this.m_Position.Add(translation);
    }


}