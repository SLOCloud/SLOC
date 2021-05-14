import { DefaultElasticityStrategyService, ElasticityStrategyService } from '../../../elasticity';
import { DefaultSloControlLoop, SloControlLoop, SloEvaluator } from '../../../slo';
import { DefaultSlocTransformationService, SlocTransformationService } from '../../../transformation/public/service';
import { DefaultMetricsSourcesManager } from '../../internal/metrics-source';
import { MetricsSourcesManager } from '../metrics-source';
import { DefaultWatchManager, ObjectKindWatcher, WatchManager } from '../watch';
import { SlocRuntime } from './sloc-runtime';

export abstract class SlocRuntimeBase implements SlocRuntime {

    transformer: SlocTransformationService = new DefaultSlocTransformationService();

    elasticityStrategyService: ElasticityStrategyService;

    metricsSourcesManager: MetricsSourcesManager = new DefaultMetricsSourcesManager(this);

    constructor() {
        this.elasticityStrategyService = new DefaultElasticityStrategyService(this.transformer);
    }

    abstract createSloEvaluator(): SloEvaluator;

    abstract createObjectKindWatcher(): ObjectKindWatcher;

    createSloControlLoop(): SloControlLoop {
        return new DefaultSloControlLoop();
    }

    createWatchManager(): WatchManager {
        return new DefaultWatchManager(this);
    }

}