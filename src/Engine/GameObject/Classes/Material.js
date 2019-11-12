const Math = require('../../../Mat');
const { Vec3, Mat4 } = Math;
const Shader = require('../../../Renderer/Shader');

module.exports = class Material{
    
    /**@type {Shader} */
    m_Shader;

    /**@type {number} */
    m_Ks;

    /**@type {number} */
    m_Kd;

    constructor(){
        this.m_Shader = new Shader();
        this.m_Shader.Compile("");
    }
}