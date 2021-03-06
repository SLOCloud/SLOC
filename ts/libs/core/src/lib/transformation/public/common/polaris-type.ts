import { Transform } from 'class-transformer';
import { PolarisMetadataUtils, TypeFn } from '../../../util';
import { PropertyTransformer } from '../../internal/property-transformer';

/**
 * Property decorator to define the Polaris type of a property.
 *
 * @param typeFn A function that returns the constructor of the Polaris type.
 * @returns A `PropertyDecorator` factory.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function PolarisType(typeFn: TypeFn<any>): PropertyDecorator {
    return (prototype: any, propertyKey: string) => {
        const polarisType = typeFn();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        PolarisMetadataUtils.setPropertyPolarisType(prototype.constructor, propertyKey, polarisType);

        const propertyTransformer = new PropertyTransformer(polarisType);
        const origDecorator = Transform(transformParams => propertyTransformer.transform(transformParams));
        origDecorator(prototype, propertyKey);
    };
}
