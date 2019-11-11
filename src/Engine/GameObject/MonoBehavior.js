const GameObject = require('./GameObject');

module.exports = class MonoBehavior {

    Start() {

    }

    Update() {

    }

    FixedUpdate() {

    }

    LateUpdate() {

    }

    OnEnable() {

    }

    OnDisable() {

    }

    GetComponent(componentType) {
        return this.GameObject.GetComponent(componentType);
    }

    GetComponents(componentType) {
        return this.GameObject.GetComponents(componentType);
    }

    toString() { return this.Name; }

    get Enabled() { return this.m_Enabled; }

    /**@type {GameObject} */
    get GameObject() { return this.m_GameObject; }

    get Transform() { return this.GameObject.Transform; }
    get Name() { return this.GameObject.Name; }
    get Tag() { return this.GameObject.Tag; }
}