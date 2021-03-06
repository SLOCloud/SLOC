import { SloMapping } from '../../../model';

/**
 * Describes the output of `ServiceLevelObjective.execute()`.
 *
 * @param T The type of `ElasticityStrategySpec.sloOutputParams` that should be submitted to the cluster.
 */
export interface SloOutput<T> {

    /**
     * The `SloMapping` that was used to configure this SLO.
     *
     * This contains information on the SLO target and the elasticity strategy to be used.
     */
    sloMapping: SloMapping<any, T>;

    /**
     * The `ElasticityStrategySpec.sloOutputParams` that should be submitted to the cluster.
     */
    elasticityStrategyParams: T;

    // We could use this to delete a strategy in the future.
    // deleteStrategy?: boolean;

}
