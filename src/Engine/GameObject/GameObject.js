const MonoBehavior = require('./MonoBehavior')

module.exports = class GameObject {
    /**@type {Array<MonoBehavior>} */
    m_Components = [];

    /**@type {boolean} */
    m_Active;

    /**
     * 
     * @param {MonoBehavior} ComponentType 
     */
    AddComponent(ComponentType) {
        let newComponent = new ComponentType();
        newComponent.Start();
        this.m_Components.push(newComponent);
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

    Update(){
        for(let component of this.m_Components){
            component.Update();
        }
    }
}