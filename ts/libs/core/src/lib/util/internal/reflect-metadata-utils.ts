import { SlocMicrocontrollerFactoryMetadata } from '../../runtime';
import { SlocTransformationMetadata } from '../../transformation';
import { Constructor } from '../public/util-types';

/**
 * Defines the keys used store SLOC metadata using the Reflect API.
 */
const SLOC_METADATA_KEYS = {
/* eslint-disable @typescript-eslint/naming-convention */

    /** The key for storing `SlocTransformationMetadata`. */
    CLASS_TRANSFORMATION: 'sloc:transformation',

    /** The key for storing `SlocMicrocontrollerFactoryMetadata`. */
    MICROCONTROLLER_FACTORY: 'sloc:microcontroller-factory',

    /** The key for storing the Type of a property. */
    PROPERTY_TYPE: 'sloc:property-type:',

/* eslint-enable @typescript-eslint/naming-convention */
};

/**
 * Provides utility methods for manipulating SLOC metadata using the Reflect API.
 */
export class SlocMetadataUtils {

    /**
     * Gets the `SlocTransformationMetadata` that has been applied to the constructor of the type `T`.
     *
     * @note The `SlocTransformationMetada` of a parent class is only considered if its `inheritable` property has been set to `true`.
     *
     * @returns The `SlocTransformationMetadata` of the `target` object or `undefined` if `target` does not have this metadata.
     */
    static getSlocTransformationMetadata<T>(target: T | Constructor<T>): SlocTransformationMetadata<T> {
        const ctor = this.coerceToConstructor(target);
        const metadata: SlocTransformationMetadata<T> = Reflect.getMetadata(SLOC_METADATA_KEYS.CLASS_TRANSFORMATION, ctor);

        if (metadata) {
            if (metadata.typeRegistered !== ctor && !metadata.inheritable) {
                return undefined;
            }
        }
        return metadata;
    }

    /**
     * Sets the specified `SlocTransformationMetadata` on the `target` object.
     */
    static setSlocTransformationMetadata<T>(metadata: SlocTransformationMetadata<T>, target: Constructor<T>): void {
        Reflect.defineMetadata(SLOC_METADATA_KEYS.CLASS_TRANSFORMATION, metadata, target);
    }

    /**
     * Gets the `SlocMicrocontrollerFactoryMetadata` that has been applied to the constructor of the type `T` or one of its parents.
     *
     * @returns The `SlocMicrocontrollerFactoryMetadata` of the `target` object or one of its parents,
     * or `undefined` if the `target` type hierarchy does not have this metadata.
     */
    static getSlocMicrocontrollerFactoryMetadata<T>(target: T | Constructor<T>): SlocMicrocontrollerFactoryMetadata<T, any> {
        const ctor = this.coerceToConstructor(target);
        const metadata: SlocMicrocontrollerFactoryMetadata<T, any> = Reflect.getMetadata(SLOC_METADATA_KEYS.MICROCONTROLLER_FACTORY, ctor);
        return metadata;
    }

    /**
     * Sets the specified `SlocTransformationMetadata` on the `target` object.
     */
    static setSlocMicrocontrollerFactoryMetadata<T>(metadata: SlocMicrocontrollerFactoryMetadata<T, any>, target: Constructor<T>): void {
        Reflect.defineMetadata(SLOC_METADATA_KEYS.MICROCONTROLLER_FACTORY, metadata, target);
    }

    /**
     * Gets the type that has been defined for the property `propertyKey` of the class `target` using
     * the `@SlocType` decorator.
     *
     * If no type has been defined for the `target` class, the prototype hierarchy is traversed upwards.
     *
     * @returns The type that has been defined for the specified property or `undefined` if this information is not available.
     */
    static getPropertySlocType<T>(target: Constructor<T>, propertyKey: keyof T & string): Constructor<any> {
        const metadataKey = this.getPropertyMetadataKey(propertyKey);
        return Reflect.getMetadata(metadataKey, target) as Constructor<any>;
    }

    /**
     * Sets the type that has been defined for the property `propertyKey` of the class `target` using
     * the `@SlocType` decorator.
     */
    static setPropertySlocType<T>(target: Constructor<T>, propertyKey: keyof T & string, propertyType: Constructor<any>): void {
        const metadataKey = this.getPropertyMetadataKey(propertyKey);
        Reflect.defineMetadata(metadataKey, propertyType, target);
    }

    private static coerceToConstructor<T>(target: T | Constructor<T>): Constructor<T> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return target instanceof Function ? (target as any) : (target as any).constructor;
    }

    private static getPropertyMetadataKey(propertyKey: string): string {
        return SLOC_METADATA_KEYS.PROPERTY_TYPE + propertyKey;
    }

}
