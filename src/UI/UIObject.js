module.exports = class UIObject {

    /**@type {UIObject} */
    m_Parent;

    /**@type {Array<UIObject>} */
    m_Children;

    /**@type {HTMLElement} */
    m_DomNode;

    /**
     * 
     * @param {UIObject} children  
     * @param {HTMLElement} domElement  
     * @param {Array<UIObject>} children 
     */
    constructor(parent = null, domElement = null, children = []) {
        this.m_Parent = parent;
        this.m_Children = children;
        this.m_DomNode = domElement;
        this.SetParent(parent);
    }

    /**
     * 
     * @param {UIObject} child 
     */
    AddChild(child) {
        this.m_Children.push(child);
        console.log(child);
        child.SetParent(this);
        this.Render();
    }

    RemoveChild(child){
        this.m_Children.splice(this.m_Children.indexOf(child), 1);
        this.Render();
    }

    /**
     * 
     * @param {UIObject} parent 
     */
    SetParent(parent) {
        if (this.m_DomNode && this.m_Parent && this.m_Parent.m_DomNode) {
            if (this.m_Parent.m_DomNode.contains(this.m_DomNode))
                this.m_Parent.m_DomNode.removeChild(this.m_DomNode);
        }

        this.m_Parent = parent;        

        if (this.m_DomNode && this.m_Parent) {
            this.m_Parent.m_DomNode.appendChild(this.m_DomNode);
        }
    }

    Update(delta) {
        for(let c of this.m_Children){
            c.Update(delta);
        }
    }

    Render() {
        for (let c of this.m_Children) c.Render();
    }
}