import { ObjectKind, SlocRuntime, initSlocRuntime } from '@sloc/core';
import { KubernetesSlocRuntime } from './runtime';
import { ObjectKindTransformer } from './transformation';

/**
 * Initializes the Kubernetes SLOC runtime and sets it as the global singleton.
 */
export function initSlocKubernetes(): SlocRuntime {
    const runtime = new KubernetesSlocRuntime();
    registerTransformers(runtime);
    initSlocRuntime(runtime);
    return runtime;
}

function registerTransformers(runtime: SlocRuntime): void {
    // Registering the DefaultTransformer is actually not necessary.
    runtime.transformer.registerTransformer(ObjectKind, new ObjectKindTransformer());
}
