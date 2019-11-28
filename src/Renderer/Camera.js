const InputController = require('../Engine/InputController');
const Transform = require('../Engine/GameObject/Components/Transform');
const Plane = require('../Engine/GameObject/Classes/Plane');
const CanvasApi = require('../Canvas/CanvasApi');
const Utils = require('../Util');
const { Vec3, Mat4 } = require('../Mat/index');
const Bounds = require('../Engine/GameObject/Classes/Bounds');

module.exports = class Camera {
    projection = new Mat4();
    view = Mat4.Identity();
    lookAt = Mat4.Identity();
    m_Transformation = Mat4.Identity();
    m_Back = new Vec3(0, 0, 1);

    m_RotationSpeed = 30.0;
    m_TranslationSpeed = 100;

    /**@type {Plane} */
    m_Plane;

    m_Position = new Vec3(0, 0, 0);

    constructor() {
        this.m_Transform = new Transform();
        this.m_Transform.Start();
        this.m_Plane = new Plane();
        this.m_Plane.m_Normal = new Vec3(0, 0, 1);
        this.m_Transform.Rotate(0, 90, 0);
        this.SetLookAt(new Vec3(0, 0, 1));

        this.m_Bounds = new Bounds();
        this.m_Bounds.SetMinMax(
            new Vec3(-1, -1, -3.0),
            new Vec3(1, 1, -1)
        );
    }

    SetProjection(projectionMatrix) {
        this.projection = projectionMatrix;
        this.UpdateProjectionViewMatrix();
    }

    SetView(viewMatrix) {
        this.view = viewMatrix;
        this.UpdateProjectionViewMatrix();
    }

    SetLookAt(target) {
        this.lookAt = this.LookAt(target);
        this.UpdateProjectionViewMatrix();
    }

    SetLookAtDirection(direction) {
        let cameraDirection = direction.Normalize();
        let Up = new Vec3(0, 1, 0);
        let cameraRight = Up.Cross(cameraDirection).Normalize();
        let cameraUp = cameraDirection.Cross(cameraRight);

        let lookAtMatrix = new Mat4();
        lookAtMatrix.elements[0][0] = cameraRight.x;
        lookAtMatrix.elements[1][0] = cameraRight.y;
        lookAtMatrix.elements[2][0] = cameraRight.z;
        lookAtMatrix.elements[0][1] = cameraUp.x;
        lookAtMatrix.elements[1][1] = cameraUp.y;
        lookAtMatrix.elements[2][1] = cameraUp.z;
        lookAtMatrix.elements[0][2] = cameraDirection.x;
        lookAtMatrix.elements[1][2] = cameraDirection.y;
        lookAtMatrix.elements[2][2] = cameraDirection.z;
        lookAtMatrix.elements[3][3] = 1;
        let translation = Mat4.Translation(-this.m_Transform.m_Position.x, -this.m_Transform.m_Position.y, -this.m_Transform.m_Position.z);

        this.m_Plane.m_Normal = Vec3.Mult(cameraDirection, -1);
        this.m_Plane.m_Distance = 0;

        this.lookAt = translation.multiplyMat4(lookAtMatrix);//translation.multiplyMat4(lookAtMatrix);            
        this.UpdateProjectionViewMatrix();
        return this.lookAt;
    }

    LookAt(target) {
        let cameraDirection = Vec3.Sub(this.m_Transform.m_Position, target).Normalize();
        return this.SetLookAtDirection(cameraDirection);
    }

    UpdateProjectionViewMatrix() {
        this.projectionViewMatrix = this.lookAt.multiplyMat4(this.view).multiplyMat4(this.projection);
    }


    Update(delta) {
        //console.log(this.m_Transform.m_Position);
        // if (InputController.Instance().IsKeyDown(37)) {
        //     this.m_Transform.Translate(this.Right.Mult(-delta * this.m_TranslationSpeed));
        // }

        // if (InputController.Instance().IsKeyDown(39)) {
        //     this.m_Transform.Translate(this.Right.Mult(delta * this.m_TranslationSpeed));
        // }

        // if (InputController.Instance().IsKeyDown(38)) {
        //     this.m_Transform.Translate(this.Up.Mult(-delta * this.m_TranslationSpeed));
        // }

        // if (InputController.Instance().IsKeyDown(40)) {
        //     this.m_Transform.Translate(this.Up.Mult(delta * this.m_TranslationSpeed));
        // }

        // if (InputController.Instance().IsKeyDown(65)) {
        //     this.m_Transform.Rotate(this.m_RotationSpeed * delta, 0, 0);
        //     this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationX(this.m_RotationSpeed * delta));
        //     this.SetLookAtDirection(this.Back);
        //     console.log(this.Front, this.m_Transform.m_LocalEulerAngles.x);
        // }

        // if (InputController.Instance().IsKeyDown(68)) {
        //     this.m_Transform.Rotate(this.m_RotationSpeed * -delta, 0, 0);
        //     this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationX(-this.m_RotationSpeed * delta));
        //     this.SetLookAtDirection(this.Back);
        //     console.log(this.Front, this.m_Transform.m_LocalEulerAngles.x);
        // }

        // if (InputController.Instance().IsKeyDown(87)) {
        //     this.m_Transform.Rotate(0, this.m_RotationSpeed * delta, 0);
        //     this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationY(this.m_RotationSpeed * delta));
        //     this.SetLookAtDirection(this.Back);
        // }

        // if (InputController.Instance().IsKeyDown(83)) {
        //     this.m_Transform.Rotate(0, this.m_RotationSpeed * -delta, 0);
        //     this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationY(-this.m_RotationSpeed * delta));
        //     this.SetLookAtDirection(this.Back);
        // }

        // if (InputController.Instance().IsKeyDown(17)) {
        //     this.m_Transform.Translate(this.Back.Mult(delta * this.m_TranslationSpeed));
        // }

        // if (InputController.Instance().IsKeyDown(32)) {
        //     this.m_Transform.Translate(this.Front.Mult(delta * this.m_TranslationSpeed));
        // }

        this.SetLookAtDirection(this.Back);
        // if (this.following) this.SetLookAt(this.following.Transform.m_Position);
        // else {
        // }

        this.m_Transform.Update();
        this.m_Transformation = this.m_Transform.m_TransformationMatrix;
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
        return this.m_Bounds.Contains(v1);
    }

    get Right() {
        return this.Front.Cross(this.Up);
    }
}