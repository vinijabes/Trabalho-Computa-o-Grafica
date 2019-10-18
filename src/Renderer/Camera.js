const { Vec3, Mat4 } = require('../Mat/index');
const CanvasApi = require('../Canvas/CanvasApi');
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
        return;
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

    /**
     * 
     * @param {Vec3} point 
     */
    PointToWorldCoord(point) {
        let p = point.multiplyMat4(this.projectionViewMatrix);
        p.x = (p.x / 2 + 0.5) * CanvasApi.s_Context.Width;
        p.y = (-p.y / 2 + 0.5) * CanvasApi.s_Context.Height;
    }

    get unProject() { return new Mat4(Utils.invertMatrix(this.projection.elements)); }
}