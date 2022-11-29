export default class Manifest {
    static structures = [];

    static register(key, type, properties) {
        const header = this.structures.length + 1;

        this.structures.push({
            header,
            key,
            type,

            properties
        });

        return this.structures[this.structures.length - 1];
    };
};
