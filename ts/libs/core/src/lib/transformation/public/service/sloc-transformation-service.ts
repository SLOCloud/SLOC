import { ObjectKind } from '../../../model';
import { SlocConstructor } from '../../../util';
import { SlocTransformationConfig, SlocTransformer } from '../common';

/**
 * Implementations of this service should be used for converting between orchestrator-independent SLOC objects
 * and orchestrator-specific plain objects, which can be serialized.
 *
 * A `SlocTransformationService` uses the `SlocTransformers` that have been registered with it to transform complex objects.
 * If no transformer has been registered for a particular type, the `DefaultSlocTransformer` will be used.
 *
 * Transformation from an orchestrator-specific plain object to a SLOC object can be done either by
 * - specifying the class of the SLOC object, or
 * - specifying the `ObjectKind` from the orchestrator-specific plain object (in this case, the `ObjectKind` must have been
 * registered with the `SlocTransformationService` first).
 *
 * By default a transformer registration for a class `A` applies only to direct instances of `A`, not to instances of any of its subclasses.
 * This is an intentional design decision, because model subclasses often add additional properties and they thus need
 * to be transformed differently than their parents.
 *
 * Typically a transformer for a subclass would also contain an instance of the transformer of the parent class, such
 * that the transformation of the parent's properties can be delegated.
 *
 * If the same transformer should be used for a parent- and a subclass, there are two possibilities:
 * - it can be registered for both of them or
 * - `SlocTransformationConfig.inheritable` can be set to `true`, which will make all subclasses inherit the
 * transformer, unless they register their own.
 */
export interface SlocTransformationService {

    /**
     * The default `SlocTransformer` that is used if no specific transformer has been registered for a particular type.
     */
    readonly defaultTransformer: SlocTransformer<any, any>;

    /**
     * Replaces the current default `SlocTransformer` with the one provided.
     */
    changeDefaultTransformer(newDefaultTransformer: SlocTransformer<any, any>): void;

    /**
     * Registers the specified transformer with this `SlocTransformationService`.
     *
     * @note A transformer registration for a class `A` applies only to direct instances of `A`, not to instances of any of its subclasses.
     * @param slocType The SLOC type for which to register the transformer.
     * @param transformer The `SlocTransformer` for the type.
     * @param config (optional) Additional configuration for registration of the `SlocTransformer`.
     */
    registerTransformer<T>(slocType: SlocConstructor<T>, transformer: SlocTransformer<T, any>, config?: SlocTransformationConfig): void;

    /**
     * Associates the specified object kind with a SLOC type and optionally also with a transformer.
     *
     * This allows the `SlocTransformationService` to automatically instantiate the appropriate class for a raw orchestrator object,
     * based on the kind information that it provides.
     *
     * @note A transformer registration for a class `A` applies only to direct instances of `A`, not to instances of any of its subclasses.
     * @param kind The `ObjectKind` that should be registered.
     * @param slocType The SLOC type to be associated with the object kind.
     * @param transformer The `SlocTransformer` for the type.
     * @param config (optional) Additional configuration for registration of the `SlocTransformer`.
     */
    registerObjectKind<T>(kind: ObjectKind, slocType: SlocConstructor<T>, transformer?: SlocTransformer<T, any>, config?: SlocTransformationConfig): void;

    /**
     * Transforms the specified orchestrator-specific plain object into a corresponding SLOC object.
     *
     * @param slocType The SLOC type into which the plain object should be transformed.
     * @param orchPlainObj The orchestrator-specific plain object to be transformed.
     * @retuns A new SLOC object that results from transforming `orchPlainObj` or `null` if `orchPlainObj` was `null` or `undefined`.
     */
    transformToSlocObject<T>(slocType: SlocConstructor<T>, orchPlainObj: any): T;

    /**
     * Transforms the specified orchestrator-specific plain object into a corresponding SLOC object.
     *
     * @param kind The registered `ObjectKind` that can be used to deduce the SLOC type of the object.
     * @param orchPlainObj The orchestrator-specific plain object to be transformed.
     * @retuns A new SLOC object that results from transforming `orchPlainObj` or `null` if `orchPlainObj` was `null` or `undefined`.
     */
    transformToSlocObject(kind: ObjectKind, orchPlainObj: any): any;

    /**
     * Transforms the specified SLOC object into an orchestrator-specific plain object that may be serialized without any further changes.
     *
     * @param slocObj The SLOC object to be transformed.
     * @retuns A new orchestrator-specific plain object that may be serialized without any further changes or `null` if `slocObj` was `null` or `undefined.
     */
    transformToOrchestratorPlainObject(slocObj: any): any;

    /**
     * Gets the type that has been defined for the property `propertyKey` of the class `slocType` using
     * the `@SlocType` decorator.
     *
     * @param slocType The SLOC type that owns the property.
     * @param propertyKey The name of the property.
     * @returns The type that has been defined for the specified property or `undefined` if this information is not available.
     */
    getPropertyType<T>(slocType: SlocConstructor<T>, propertyKey: keyof T & string): SlocConstructor<any>;

    /**
     * Gets the SLOC type that has been registered for the specified `ObjectKind`.
     *
     * @param kind The registered `ObjectKind` that can be used to deduce the SLOC type.
     * @returns The type that has been defined for the specified `ObjectKind` or `undefined` if this information is not available.
     */
    getSlocType(kind: ObjectKind): SlocConstructor<any>;

}