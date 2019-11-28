const Camera = require('./Camera');
const { Vec3, Mat4 } = require('../Mat/index');

module.exports = class CavaleiraCamera extends Camera {
    projection = Mat4.Cavaleira();

    UpdateProjectionViewMatrix() {
        this.projectionViewMatrix = this.projection.multiplyMat4(this.view);
    }


    Update(delta) {
        super.Update();
    }

    Contains(v1){
        return true;
    }
}