const { Vec3 } = require('../../../Mat');

module.exports = class Plane {
    /**@type {Vec3} */
    m_Normal;

    /**@type {number} */
    m_Distance = 0;

    /**@type {Vec3} */
    DistanceToPoint(point) {
        let dist = this.m_Normal.Dot(point) + this.m_Distance;
        return dist;
    }

    ClosestPointInPlane(point) {
        let dist = this.DistanceToPoint(point);
        let pointInPlane = Vec3.Sub(point, Vec3.Mult(this.m_Normal, dist));

        return pointInPlane;
    }

    Set3Points(a, b, c) {
        let ab = Vec3.Sub(b, a);
        let ac = Vec3.Sub(c, a);

        let normal = ab.Cross(ac);
        let distance = normal.Norm() != 0 ? (-normal.x * a.x - normal.y * a.y - normal.z * a.z) / normal.Norm() : 0;

        this.m_Normal = normal.Normalize();
        this.m_Distance = distance;
    }
}