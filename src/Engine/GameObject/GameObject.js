const MonoBehavior = require('./MonoBehavior')
const Transform = require('./Components/Transform');
const InputController = require('../InputController');
const Time = require('../Time');
const Vec3 = require('../../Mat/Vec3');
const Material = require('./Classes/Material');

module.exports = class GameObject {
    /**@type {Array<MonoBehavior>} */
    m_Components = [];

    /**@type {boolean} */
    m_Active;

    /**@type {Material} */
    m_Material;

    m_Name;
    m_RotationSpeed = 60;
    m_TranslationSpeed = 80;

    constructor(name = 'GameObject') {
        this.m_Name = name;

        this.AddComponent(Transform);
        this.m_Material = new Material();
    }

    /**
     * 
     * @param {MonoBehavior} ComponentType 
     */
    AddComponent(ComponentType) {
        if (ComponentType.prototype && ComponentType == ComponentType.prototype.constructor) {
            let newComponent = new ComponentType();
            newComponent.m_GameObject = this;
            newComponent.Start();
            this.m_Components.push(newComponent);
        }else{
            ComponentType.m_GameObject = this;
            ComponentType.Start();
            this.m_Components.push(ComponentType);
        }
    }

    /**
     * 
     * @param {MonoBehavior} ComponentType 
     */
    GetComponent(ComponentType) {
        for (let component of this.m_Components) {
            if (component instanceof ComponentType) {
                return component;
            }
        }
        return null;
    }

    /**
     * 
     * @param {MonoBehavior} ComponentType 
     */
    GetComponents(ComponentType) {
        let components = [];
        for (let component of this.m_Components) {
            if (component instanceof ComponentType) {
                components.push(component);
            }
        }
        return components;
    }

    SetActive(active) {
        this.m_active = active;
    }

    Update() {
        for (let component of this.m_Components) {
            component.Update();
        }

        return;
        if (!InputController.Instance().IsKeyDown(16)) {
            if (InputController.Instance().IsKeyDown(65)) {
                this.Transform.Rotate(this.m_RotationSpeed * Time.delta, 0, 0);
            }

            if (InputController.Instance().IsKeyDown(68)) {
                this.Transform.Rotate(-this.m_RotationSpeed * Time.delta, 0, 0);
            }

            if (InputController.Instance().IsKeyDown(87)) {
                this.Transform.Rotate(0, this.m_RotationSpeed * Time.delta, 0);
            }

            if (InputController.Instance().IsKeyDown(83)) {
                this.Transform.Rotate(0, -this.m_RotationSpeed * Time.delta, 0);
            }

            if (InputController.Instance().IsKeyDown(81)) {
                this.Transform.Rotate(0, 0, this.m_RotationSpeed * Time.delta);
            }

            if (InputController.Instance().IsKeyDown(69)) {
                this.Transform.Rotate(0, 0, -this.m_RotationSpeed * Time.delta);
            }

            if (InputController.Instance().IsKeyDown(37)) {
                this.Transform.Translate(new Vec3(-this.m_TranslationSpeed * Time.delta, 0, 0));
            }

            if (InputController.Instance().IsKeyDown(39)) {
                this.Transform.Translate(new Vec3(this.m_TranslationSpeed * Time.delta, 0, 0));
            }

            if (InputController.Instance().IsKeyDown(38)) {
                this.Transform.Translate(new Vec3(0, this.m_TranslationSpeed * Time.delta, 0));
            }

            if (InputController.Instance().IsKeyDown(40)) {
                this.Transform.Translate(new Vec3(0, -this.m_TranslationSpeed * Time.delta, 0));
            }

            if (InputController.Instance().IsKeyDown(17)) {
                this.Transform.Translate(new Vec3(0, 0, -this.m_TranslationSpeed * Time.delta));
            }

            if (InputController.Instance().IsKeyDown(32)) {
                this.Transform.Translate(new Vec3(0, 0, this.m_TranslationSpeed * Time.delta));
            }
        } else {
            if (InputController.Instance().IsKeyDown(65)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationX(this.m_RotationSpeed * Time.delta));
            }

            if (InputController.Instance().IsKeyDown(68)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationX(-this.m_RotationSpeed * Time.delta));
            }

            if (InputController.Instance().IsKeyDown(87)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationY(this.m_RotationSpeed * Time.delta));
            }

            if (InputController.Instance().IsKeyDown(83)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationY(-this.m_RotationSpeed * Time.delta));
            }

            if (InputController.Instance().IsKeyDown(81)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationZ(-this.m_RotationSpeed * Time.delta));
            }

            if (InputController.Instance().IsKeyDown(69)) {
                this.m_Transformation = this.m_Transformation.multiplyMat4(Mat4.RotationZ(this.m_RotationSpeed * Time.delta));
            }
        }
    }

    get Name() { return this.m_Name; }
    /**@type {Transform} */
    get Transform() { return this.GetComponent(Transform); }
}