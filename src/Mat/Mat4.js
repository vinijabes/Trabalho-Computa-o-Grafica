const Vec3 = require('./Vec3');

class Mat4 {
    /**
     * 
     * @param {Array<Array<number>>|null} elements; 
     */
    constructor(elements) {
        if (Array.isArray(elements)
            && elements.length == 4
            && elements[0].length == 4
            && elements[1].length == 4
            && elements[2].length == 4
            && elements[3].length == 4) {
            this.elements = elements;
        } else if (elements == null) {
            this.elements = new Array(4);
            for (let i = 0; i < 4; i++) this.elements[i] = new Array(4).fill(0);
        } else {
            throw new Error("Invalid Array")
        }
    }

    static Identity() {
        let mat4 = new Mat4();
        for (let i = 0; i < 4; i++) mat4.elements[i][i] = 1;
        return mat4;
    }

    static Ortho() {
        let mat4 = new Mat4();
        mat4.elements[0][0] = 1;
        mat4.elements[1][1] = 1;
        mat4.elements[2][2] = 1;
        mat4.elements[3][3] = 1;
        return mat4;
    }

    static Cavaleira() {
        let mat4 = this.Identity();
        mat4.elements[2][2] = 0;
        mat4.elements[2][0] = Math.cos(45 * Math.PI / 180);
        mat4.elements[2][1] = Math.sin(45 * Math.PI / 180);
        return mat4;
    }

    static Cabinet() {
        let mat4 = this.Identity();
        mat4.elements[2][2] = 0;
        mat4.elements[2][0] = Math.cos(63.4 * Math.PI / 180) / 2;
        mat4.elements[2][1] = Math.sin(63.4 * Math.PI / 180) / 2;
        return mat4;
    }

    static RotationZ(angle, x = 0, y = 0, z = 0) {
        angle = angle * Math.PI / 180;
        let mat4 = this.Identity();
        mat4.elements[0][0] = Math.cos(angle);
        mat4.elements[1][0] = -Math.sin(angle);
        mat4.elements[0][1] = Math.sin(angle);
        mat4.elements[1][1] = Math.cos(angle);
        return Mat4.Translation(-x, -y, -z).multiplyMat4(mat4).multiplyMat4(Mat4.Translation(x, y, z));
    }

    static RotationY(angle, x = 0, y = 0, z = 0) {
        angle = angle * Math.PI / 180;
        let mat4 = this.Identity();
        mat4.elements[0][0] = Math.cos(angle);
        mat4.elements[2][0] = Math.sin(angle);
        mat4.elements[0][2] = -Math.sin(angle);
        mat4.elements[2][2] = Math.cos(angle);
        return Mat4.Translation(-x, -y, -z).multiplyMat4(mat4).multiplyMat4(Mat4.Translation(x, y, z));
    }

    static RotationX(angle, x = 0, y = 0, z = 0) {
        angle = angle * Math.PI / 180;
        let mat4 = this.Identity();
        mat4.elements[1][1] = Math.cos(angle);
        mat4.elements[2][1] = -Math.sin(angle);
        mat4.elements[1][2] = Math.sin(angle);
        mat4.elements[2][2] = Math.cos(angle);
        
        return Mat4.Translation(-x, -y, -z).multiplyMat4(mat4).multiplyMat4(Mat4.Translation(x, y, z));
    }

    static Translation(x, y, z) {
        let mat4 = this.Identity();

        mat4.elements[3][0] = x;
        mat4.elements[3][1] = y;
        mat4.elements[3][2] = z;

        return mat4;
    }

    static Scale(x, y = 1, z = 1, global = 1, xPos = 0, yPos = 0, zPos = 0) {
        let mat4 = this.Identity();
        mat4.elements[0][0] = x;
        mat4.elements[1][1] = y;
        mat4.elements[2][2] = z;
        mat4.elements[3][3] = global;

        return Mat4.Translation(-xPos, -yPos, -zPos).multiplyMat4(mat4).multiplyMat4(Mat4.Translation(xPos, yPos, zPos));
    }

    static Shear(xy, xz, yz, yx, zx, zy) {
        let mat4 = this.Identity();
        mat4.elements[0][1] = yx;
        mat4.elements[0][2] = zx;
        mat4.elements[1][2] = yz;

        mat4.elements[1][0] = xy;
        mat4.elements[2][0] = xz;
        mat4.elements[2][1] = zy;

        return mat4;
    }

    static Viewport(left, right, bottom, top, near, far) {
        let mat4 = new Mat4();
        let ws = right - left;
        let hs = top - bottom;

        mat4.elements[0][0] = (far - near) / ws;
        mat4.elements[1][1] = (far - near) / hs;
        mat4.elements[2][2] = 1;
        mat4.elements[3][3] = 1;

        return mat4;
    }

    multiplyVec3(vec3) {
        let x = vec3.x * this.elements[0][0] + vec3.y * this.elements[0][1] + vec3.z * this.elements[0][2] + this.elements[0][3];
        let y = vec3.x * this.elements[1][0] + vec3.y * this.elements[1][1] + vec3.z * this.elements[1][2] + this.elements[1][3];
        let z = vec3.x * this.elements[2][0] + vec3.y * this.elements[2][1] + vec3.z * this.elements[2][2] + this.elements[2][3];
        let w = vec3.x * this.elements[3][0] + vec3.y * this.elements[3][1] + vec3.z * this.elements[3][2] + this.elements[3][3];

        let v3 = new Vec3(x / w, y / w, z / w);
        return v3;
    }

    multiplyMat4(mat4) {
        let elements1 = this.elements;
        let elements2 = mat4.elements;

        let result = new Mat4();

        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                for (let k = 0; k < 4; k++) {
                    result.elements[i][j] += Math.round((elements1[i][k] * elements2[k][j])*100000)/100000;
                }
            }
        }

        return result;
    }

    Get(row) {
        return this.elements[row];
    }
}

module.exports = Mat4;