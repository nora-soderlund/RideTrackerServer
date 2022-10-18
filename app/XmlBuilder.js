export default class XmlBuilder {
    constructor(version = "1.0", encoding = "UTF-8") {
        this.version = version;
        this.encoding = encoding;
    };

    elements = [];

    addElement(element) {
        this.elements.push(element);
    };

    toString(pretty) {
        const lines = [];

        lines.push(`<?xml version="${this.version}" encoding="${this.encoding}"?>`);

        this.elements.forEach((element) => {
            lines.push(element.toString(pretty));
        });
        
        return lines.join((pretty)?("\n"):(""));
    };
};
