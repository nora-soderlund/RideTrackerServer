export default class Container {
    private static instances: { type: any, instance: any }[] = [];

    static register(type: any, instance: any) {
        this.instances.push({
            type,
            instance
        });

        return instance;
    };

    static resolve(type: any) {
        return this.instances.find((instance: { type: any, instance: any }) => instance.type === type)?.instance as typeof type;
    };
};
