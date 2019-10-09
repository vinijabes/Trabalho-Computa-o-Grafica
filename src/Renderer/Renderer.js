const Camera = require('./Camera.js');
const Shader = require('./Shader');
const VertexArray = require('./VertexArray');

module.exports = class Renderer {
    constructor() {
    }

    /**
     * 
     * @param {Camera} camera
     * @returns {void}
     */
    static BeginScene(camera) {
    }

    /**
     * @returns {void}
     */
    static EndScene() {

    }

    /**
     * @param {Shader} shader
     * @param {VertexArray} vertexArray
     * @param {Mat4} transform
     * @returns {void}
     */
    static Submit(shader, vertexArray, transform) {
        shader.Bind();

        this.DrawIndexed(vertexArray);
    }

    /**
     * 
     * @param {VertexArray} vertexArray 
     */
    static DrawIndexed(vertexArray) {
        
    }
}