import { ClusterDetails, KubernetesClustersSupplier } from '@backstage/plugin-kubernetes-node';
export declare class CustomClustersSupplier implements KubernetesClustersSupplier {
    private clusterDetails;
    constructor(clusterDetails?: ClusterDetails[]);
    static create(): CustomClustersSupplier;
    refreshClusters(): Promise<void>;
    getClusters(): Promise<ClusterDetails[]>;
}
