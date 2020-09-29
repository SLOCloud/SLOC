import { SlocType } from '../transformation';
import { IndexByKey, initSelf } from '../util';
import { ElasticityStrategyKind } from './elasticity-strategy-kind';
import { SloTarget } from './slo-target';

/**
 * Defines the minimum configuration data that is needed for an SLO mapping.
 */
export interface SloMappingSpec {

    /** Specifies the target on which to execute the elasticity strategy. */
    targetRef: SloTarget;

    /** Specifies the type of ElasticityStrategy to use for this SLO mapping. */
    elasticityStrategy: ElasticityStrategyKind;

    /**
     * Any static parameters, which are unknown to the SLO, but which may be required to configure
     * the chosen kind of elasticity strategy should be specified here. They will be copied over
     * into the spec of the elasticity strategy.
     *
     * For example, suppose the SLO knows only about the parameters in `SloCompliance`, but you want
     * to use an elasticity strategy that requires an additional parameter, e.g., `maxReplicas`.
     * This can be configured when instantiating the SloMapping:
     *
     * ```
     * new MySloMapping({
     *      elasticityStrategy: new ElasticityStrategyKind({
     *          kind: 'my-special-elasticity-strategy-kind',
     *          ...
     *      }),
     *      ...,
     *      staticElasticityStrategyParams: {
     *          // Anything in here will be copied over to the spec of the elasticity strategy.
     *          maxReplicas: 100,
     *      },
     * });
     * ```
     */
    staticElasticityStrategyParams?: IndexByKey<any>;

}

/**
 * Common superclass for SloMappingSpecs.
 */
export abstract class SloMappingSpecBase implements SloMappingSpec {

    @SlocType(() => SloTarget)
    targetRef: SloTarget;

    @SlocType(() => ElasticityStrategyKind)
    elasticityStrategy: ElasticityStrategyKind;

    staticElasticityStrategyParams?: IndexByKey<any>;

    constructor(initData?: Partial<SloMappingSpecBase>) {
        initSelf(this, initData);
    }

}
