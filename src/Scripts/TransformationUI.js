
const UIObject = require('../UI/UIObject');
const UIMenu = require('../UI/UIMenu');
const UIText = require('../UI/UIText');
const UIInput = require('../UI/UIInput');
const UIButton = require('../UI/UIButton');

class ActionInput extends UIMenu{
    /**@type {UIText} */
    m_Text;

    /**@type {UIInput} */
    m_Input;

    /**@type {UIButton} */
    m_Button;

    constructor(parent, label, buttonText){
        super(parent);

        this.m_DomNode.style.flexDirection = 'row';

        this.m_Text = new UIText(null, label);
        this.m_Input = new UIInput(null, '');
        this.m_Button = new UIButton(null, buttonText);

        this.m_Input.m_DomNode.style.width = '75%';
        this.m_Button.onClick = () => {
            if(this.onSubmit) this.onSubmit(this.m_Input.Value());
        }

        this.AddChild(this.m_Text);
        this.AddChild(this.m_Input);
        this.AddChild(this.m_Button);
    }

    onSubmit;
}

module.exports = class TransformationUI extends UIMenu{

    /**@type {UIMenu} */
    m_TranslationMenu;
    /**@type {ActionInput} */
    m_XTranslationInput;
    /**@type {ActionInput} */
    m_YTranslationInput;
    /**@type {ActionInput} */
    m_ZTranslationInput;

    /**@type {UIMenu} */
    m_RotationMenu;
    /**@type {ActionInput} */
    m_XRotationInput;
    /**@type {ActionInput} */
    m_YRotationInput;
    /**@type {ActionInput} */
    m_ZRotationInput;

    /**@type {UIMenu} */
    m_ShearingMenu;
    /**@type {ActionInput} */
    m_ShearXYInput;
    /**@type {ActionInput} */
    m_ShearXZInput;
    /**@type {ActionInput} */
    m_ShearYZInput;
    /**@type {ActionInput} */
    m_ShearYXInput;
    /**@type {ActionInput} */
    m_ShearZXInput;
    /**@type {ActionInput} */
    m_ShearZYInput;

    /**
     * 
     * @param {UIObject} parent 
     */
    constructor(parent){
        super(parent);

        /** TRANSLATION MENU */

        this.m_TranslationMenu = new UIMenu(null);
        this.m_XTranslationInput = new ActionInput(null, "X:", "Translate");
        this.m_XTranslationInput.onSubmit = (value) => {
            console.log(value);
        }

        this.m_YTranslationInput = new ActionInput(null, "Y:", "Translate");
        this.m_YTranslationInput.onSubmit = (value) => {
            console.log(value);
        }

        this.m_ZTranslationInput = new ActionInput(null, "Z:", "Translate");
        this.m_ZTranslationInput.onSubmit = (value) => {
            console.log(value);
        }

        
        this.m_TranslationMenu.AddChild(this.m_XTranslationInput);
        this.m_TranslationMenu.AddChild(this.m_YTranslationInput);
        this.m_TranslationMenu.AddChild(this.m_ZTranslationInput);

        this.m_TranslationMenu.m_DomNode.style.marginTop = '8px';
        this.m_TranslationMenu.m_DomNode.style.padding = '8px';
        this.m_TranslationMenu.m_DomNode.style.borderTop = '1px solid black';

        this.AddChild(this.m_TranslationMenu);

        /** ROTATION MENU */

        this.m_RotationMenu = new UIMenu(null);

        this.m_XRotationInput = new ActionInput(null, "X:", "Rotate");
        this.m_XRotationInput.onSubmit = (value) => {
            console.log(value);
        }

        this.m_YRotationInput = new ActionInput(null, "Y:", "Rotate");
        this.m_YRotationInput.onSubmit = (value) => {
            console.log(value);
        }

        this.m_ZRotationInput = new ActionInput(null, "Z:", "Rotate");
        this.m_ZRotationInput.onSubmit = (value) => {
            console.log(value);
        }

        
        this.m_RotationMenu.AddChild(this.m_XRotationInput);
        this.m_RotationMenu.AddChild(this.m_YRotationInput);
        this.m_RotationMenu.AddChild(this.m_ZRotationInput);

        this.m_RotationMenu.m_DomNode.style.padding = '8px';
        this.m_RotationMenu.m_DomNode.style.borderTop = '1px solid black';

        this.AddChild(this.m_RotationMenu);

        /** SHEARING MENU */

        this.m_ShearingMenu = new UIMenu(null);

        this.m_ShearXYInput = new ActionInput(null, "XY:", "Shear");
        this.m_ShearXYInput.onSubmit = (value) => {
            console.log(value);
        }

        this.m_ShearXZInput = new ActionInput(null, "XZ:", "Shear");
        this.m_ShearXZInput.onSubmit = (value) => {
            console.log(value);
        }

        this.m_ShearYZInput = new ActionInput(null, "YZ:", "Shear");
        this.m_ShearYZInput.onSubmit = (value) => {
            console.log(value);
        }

        this.m_ShearYXInput = new ActionInput(null, "YX:", "Shear");
        this.m_ShearYXInput.onSubmit = (value) => {
            console.log(value);
        }

        this.m_ShearZXInput = new ActionInput(null, "ZX:", "Shear");
        this.m_ShearZXInput.onSubmit = (value) => {
            console.log(value);
        }

        this.m_ShearZYInput = new ActionInput(null, "ZY:", "Shear");
        this.m_ShearZYInput.onSubmit = (value) => {
            console.log(value);
        }

        
        this.m_ShearingMenu.AddChild(this.m_ShearXYInput);
        this.m_ShearingMenu.AddChild(this.m_ShearXZInput);
        this.m_ShearingMenu.AddChild(this.m_ShearYZInput);
        this.m_ShearingMenu.AddChild(this.m_ShearYXInput);
        this.m_ShearingMenu.AddChild(this.m_ShearZXInput);
        this.m_ShearingMenu.AddChild(this.m_ShearZYInput);

        this.m_ShearingMenu.m_DomNode.style.padding = '8px';
        this.m_ShearingMenu.m_DomNode.style.borderTop = '1px solid black';
        this.m_ShearingMenu.m_DomNode.style.borderBottom = '1px solid black';

        this.AddChild(this.m_ShearingMenu);
    }
}