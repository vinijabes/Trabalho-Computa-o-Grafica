const { Vec3 } = require('../../../Mat');

module.exports = class Plane {
    /**@type {Vec3} */
    m_Normal;

    /**@type {number} */
    m_Distance = 0;

    /**@type {Vec3} */
    DistanceToPoint(point){
        let dist = this.m_Normal.Dot(point) + this.m_Distance;
        return dist;
    }

    ClosestPointInPlane(point){
        let dist = this.DistanceToPoint(point);
        let pointInPlane = Vec3.Sub(point, Vec3.Mult(this.m_Normal, dist));

        return pointInPlane;
    }
}