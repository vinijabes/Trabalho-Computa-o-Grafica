const { Vec3 } = require('../../../Mat');
const Plane = require('./Plane');

module.exports = class Triangle {

    /**
     * 
     * @param {Vec3} v1 
     * @param {Vec3} v2 
     * @param {Vec3} v3 
     */
    constructor(v1, v2, v3, color) {
        this.m_Plane = new Plane();
        this.m_Plane.Set3Points(v1, v2, v3);

        this.a = v1.Clone();
        this.b = v2.Clone();
        this.c = v3.Clone();
        this.color = color;
    }

    _sign(p1, p2, p3) {
        return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y)
    }

    Inside(point) {
        let d1, d2, d3;
        let has_neg, has_pos;

        d1 = this._sign(point, this.a, this.b);
        d2 = this._sign(point, this.b, this.c);
        d3 = this._sign(point, this.c, this.a);

        has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
        has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);
        return !(has_neg && has_pos);
    }

    get Normal() { return this.m_Plane.m_Normal; }
}