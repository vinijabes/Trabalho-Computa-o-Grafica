const UIObject = require('./UIObject');

module.exports = class UIMenu extends UIObject {
    constructor(parent, children) {
        super(parent, document.createElement("div"), children);

        this.m_DomNode.style.display = 'flex';
        this.m_DomNode.style.justifyContent = 'center';
        this.m_DomNode.style.flexDirection = 'column';
    }
}