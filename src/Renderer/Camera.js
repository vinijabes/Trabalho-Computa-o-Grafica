const InputController = require('../Engine/InputController');
const Transform = require('../Engine/GameObject/Components/Transform');
const Plane = require('../Engine/GameObject/Classes/Plane');
const CanvasApi = require('../Canvas/CanvasApi');
const Utils = require('../Util');
const { Vec3, Mat4 } = require('../Mat/index');

module.exports = class Camera {
    projection = new Mat4();
    view = Mat4.Identity();
    lookAt = Mat4.Identity();
    m_Transformation = Mat4.Identity();

    m_RotationSpeed = 30.0;
    m_TranslationSpeed = 50;

    /**@type {Plane} */
    m_Plane;

    m_Position = new Vec3(0, 0, 0);

    constructor() {
        this.m_Transform = new Transform();
        this.m_Transform.Start();
        this.m_Plane = new Plane();
        this.m_Plane.m_Normal = new Vec3(0, 0, 1);
        this.SetLookAt(new Vec3(0, 0, 1));
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

    LookAt(target) {
        let cameraDirection = Vec3.Sub(this.m_Transform.m_Position, target).Normalize();
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
        let translation = Mat4.Translation(-this.m_Transform.m_Position.x, -this.m_Transform.m_Position.y, -this.m_Transform.m_Position.z).multiplyMat4(this.m_Transform.m_Rotation);

        this.m_Plane.m_Normal = Vec3.Mult(cameraDirection, -1);
        this.m_Plane.m_Distance = 0;

        return lookAtMatrix.multiplyMat4(translation);
    }

    UpdateProjectionViewMatrix() {
        this.projectionViewMatrix = this.lookAt.multiplyMat4(this.projection.multiplyMat4(this.view));
    }

    Update(delta) {
        //console.log(this.m_Position);
        if (InputController.Instance().IsKeyDown(37)) {
            this.m_Transform.Translate(new Vec3(this.m_TranslationSpeed * delta, 0, 0));
        }

        if (InputController.Instance().IsKeyDown(39)) {
            this.m_Transform.Translate(new Vec3(-this.m_TranslationSpeed * delta, 0, 0));
        }

        if (InputController.Instance().IsKeyDown(38)) {
            this.m_Transform.Translate(new Vec3(0, -this.m_TranslationSpeed * delta, 0));
        }

        if (InputController.Instance().IsKeyDown(40)) {
            this.m_Transform.Translate(new Vec3(0, this.m_TranslationSpeed * delta, 0));
        }

        if (InputController.Instance().IsKeyDown(65)) {
            this.m_Transform.Rotate(this.m_RotationSpeed * delta, 0, 0);
            //this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationX(this.m_RotationSpeed * delta));
        }

        if (InputController.Instance().IsKeyDown(68)) {
            this.m_Transform.Rotate(this.m_RotationSpeed * -delta, 0, 0);
            //this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationX(-this.m_RotationSpeed * delta));
        }

        if (InputController.Instance().IsKeyDown(87)) {
            this.m_Transform.Rotate(0, this.m_RotationSpeed * delta, 0);
            //this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationY(this.m_RotationSpeed * delta));
        }

        if (InputController.Instance().IsKeyDown(83)) {
            this.m_Transform.Rotate(0, this.m_RotationSpeed * -delta, 0);
            //this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationY(-this.m_RotationSpeed * delta));
        }

        if (InputController.Instance().IsKeyDown(17)) {
            this.m_Transform.Translate(new Vec3(0, 0, 10 * -this.m_TranslationSpeed * delta));
        }

        if (InputController.Instance().IsKeyDown(32)) {
            this.m_Transform.Translate(new Vec3(0, 0, 10 * this.m_TranslationSpeed * delta));
        }

        if (this.following) this.SetLookAt(this.following.Transform.m_Position);
        else this.SetLookAt(new Vec3(0, 0, 0));

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

    get unProject() { return new Mat4(Utils.invertMatrix(this.projection.elements)); }
    get Position() { return this.m_Transform.m_Position; }
}