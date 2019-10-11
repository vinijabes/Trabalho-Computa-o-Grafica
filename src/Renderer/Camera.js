const { Mat4 } = require('../Mat/index');
const Utils = require('../Util');
const InputController = require('../Engine/InputController');

module.exports = class Camera {
    projection = new Mat4();
    view = Mat4.Identity();
    m_Transformation = Mat4.Identity();

    m_RotationSpeed = 30.0;

    SetProjection(projectionMatrix) {
        this.projection = projectionMatrix;
        this.UpdateProjectionViewMatrix();
    }

    SetView(viewMatrix) {
        this.view = viewMatrix;
        this.UpdateProjectionViewMatrix();
    }

    UpdateProjectionViewMatrix() {
        this.projectionViewMatrix = this.projection.multiplyMat4(this.view);
    }

    Update(delta) {
        if (InputController.Instance().IsKeyDown(16)) {
            if (InputController.Instance().IsKeyDown(65)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationX(this.m_RotationSpeed * delta));
            }

            if (InputController.Instance().IsKeyDown(68)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationX(-this.m_RotationSpeed * delta));
            }

            if (InputController.Instance().IsKeyDown(87)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationY(this.m_RotationSpeed * delta));
            }

            if (InputController.Instance().IsKeyDown(83)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationY(-this.m_RotationSpeed * delta));
            }
        }
    }

    get unProject() { return new Mat4(Utils.invertMatrix(this.projection.elements)); }
}