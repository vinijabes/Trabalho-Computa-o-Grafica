const MonoBehavior = require('../MonoBehavior');
const Math = require('../../../Mat');
const { Vec3, Mat4 } = Math;

module.exports = class RigidBody extends MonoBehavior {
    /**@type {number} */
    m_Mass;

    /**@type {Vec3} */
    m_Position;

    /**@type {Mat4} */
    m_Rotation;

    /**@type {Vec3} */
    m_Velocity;


    FixedUpdate(){
        this.Transform.m_Position = this.m_Position;
        this.Transform.m_Rotation = this.m_Rotation;
    }
}