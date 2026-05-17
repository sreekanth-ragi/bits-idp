import { PermissionPolicy, PolicyQuery, PolicyQueryUser } from '@backstage/plugin-permission-node';
import { PolicyDecision } from '@backstage/plugin-permission-common';
export declare class CustomPermissionPolicy implements PermissionPolicy {
    handle(request: PolicyQuery, user?: PolicyQueryUser): Promise<PolicyDecision>;
}
