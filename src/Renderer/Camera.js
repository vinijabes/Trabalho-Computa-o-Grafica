const { Mat4 } = require('../Mat/index');
const Utils = require('../Util');

module.exports = class Camera {
    projection = new Mat4();
    view = Mat4.Identity();

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

    get unProject() { return new Mat4(Utils.invertMatrix(this.projection.elements)); }
}