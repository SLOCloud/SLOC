import { isEqual as _isEqual } from 'lodash';
import { ClassDecoratorFn, Constructor, SlocMetadataUtils } from '../util';

/**
 * Describes a SLOC type that is transformable to/from an orchestrator-specific object.
 */
export interface SlocTransformableMetadata {

    /**
     * The unique ID of this SlocTransformable type.
     *
     * This is used to resolve a `SlocTransformer` for the type.
     */
    slocTypeId: string;

}

/**
 * Marks the decorated class as being transformable between an orchestrator-independent and an orchestrator-specific format.
 *
 * @param metadataOrSlocTypeId The metadata for configuring the transformation or the unique SlocTypeId of the decorated type.
 */
export function SlocTransformable(metadataOrSlocTypeId: SlocTransformableMetadata | string): ClassDecoratorFn {
    let metadata: SlocTransformableMetadata;
    if (typeof metadataOrSlocTypeId === 'string') {
        metadata = { slocTypeId: metadataOrSlocTypeId };
    } else {
        metadata = metadataOrSlocTypeId;
    }

    return (target: Constructor<any>) => {
        const existingMetada = SlocMetadataUtils.getSlocTransformableMetadata(target);
        if (!_isEqual(metadata, existingMetada)) {
            SlocMetadataUtils.setSlocTransformableMetadata(metadata, target);
        }
    }
}

/**
 * This error is thrown when attempting a SLOC -> orchestrator-specific transformation
 * on an object that is not `SlocTransformable`.
 */
export class NotSlocTransformableError extends Error {

    constructor(obj: any) {
        super(
            'The specified object is not SlocTransformable. ' +
            `Make sure that it is an instance of a class with that has the @SlocTransformable decorator applied. ${obj}`,
        );
    }

}
