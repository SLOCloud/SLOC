import { CostEfficiencySloConfig } from '@sloc/common-mappings';
import { MetricsSource, ObservableOrPromise, ServiceLevelObjective, SloCompliance, SloMapping, SloOutput, SlocRuntime } from '@sloc/core';
import { of as observableOf } from 'rxjs';

const LOWER_BOUND = 1;
const UPPER_BOUND = 200;

export class CostEfficiencySlo implements ServiceLevelObjective<CostEfficiencySloConfig, SloCompliance>  {

    sloMapping: SloMapping<CostEfficiencySloConfig, SloCompliance>;

    private metricsSource: MetricsSource;

    configure(
        sloMapping: SloMapping<CostEfficiencySloConfig, SloCompliance>,
        metricsSource: MetricsSource,
        slocRuntime: SlocRuntime,
    ): ObservableOrPromise<void> {
        this.sloMapping = sloMapping;
        this.metricsSource = metricsSource;
        return observableOf(null);
    }

    evaluate(): ObservableOrPromise<SloOutput<SloCompliance>> {
        return Promise.resolve({
            sloMapping: this.sloMapping,
            elasticityStrategyParams: {
                currSloCompliancePercentage: this.calculateSloCompliance(),
            },
        });
    }

    private calculateSloCompliance(): number {
        // Get some metrics.
        // Do some calculations, based on sloMapping.spec

        const currSloCompliance = Math.ceil(Math.random() * UPPER_BOUND);
        return currSloCompliance || LOWER_BOUND;
    }

}