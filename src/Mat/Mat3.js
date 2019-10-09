const Vec3 = require('./Vec3'); 

class Mat3 {
    /**
     * 
     * @param {Array<Array<number>>|null} elements; 
     */
    constructor(elements) {
        if (Array.isArray(elements)
            && elements.length == 3
            && elements[0].length == 3
            && elements[1].length == 3
            && elements[2].length == 3) {
            this.elements = elements;
        } else if (elements == null) {
            this.elements = new Array(3);
            for(let i = 0; i < 3; i++) this.elements[i] = new Array(3).fill(0);
        } else {
            throw new Error("Invalid Array")
        }
    }

    static Identity() {
        let mat3 = new Mat3();
        for(let i = 0; i < 3; i++) mat3.elements[i][i] = 1;
        return mat3;
    }

    multiplyVec3(vec3) {
        let x = vec3.x * this.elements[0][0] + vec3.y * this.elements[0][1] + this.elements[0][2];
        let y = vec3.x * this.elements[1][0] + vec3.y * this.elements[1][1] + this.elements[1][2];
        let z = vec3.x * this.elements[2][0] + vec3.y * this.elements[2][1] + this.elements[2][2];

        let v3 = new Vec3(x / z, y / z, 1);
        return v3;
    }

    Get(row) {
        return this.elements[row];
    }
}

module.exports = Mat3;