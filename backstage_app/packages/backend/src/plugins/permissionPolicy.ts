import {
  PermissionPolicy,
  PolicyQuery,
  PolicyQueryUser,
} from '@backstage/plugin-permission-node';
import {
  templateParameterReadPermission,
  templateStepReadPermission,
  actionExecutePermission,
} from '@backstage/plugin-scaffolder-common/alpha';

import {
  catalogEntityReadPermission
} from '@backstage/plugin-catalog-common/alpha'; // Ensure this exact path is used
import {
  AuthorizeResult,
  PolicyDecision,
  isPermission
} from '@backstage/plugin-permission-common';

const INFRA = 'group:default/infra-admins';
const BACKEND = 'group:default/backend-admins';
const FRONTEND = 'group:default/frontend-admins';

function hasGroup(user: PolicyQueryUser | undefined, groupRef: string): boolean {
  if (!user) return false;
  const ownershipRefs = user.info.ownershipEntityRefs ?? [];
  return ownershipRefs.includes(groupRef);
}

export class CustomPermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    // IaC template actions: only infrastructure admins
    if (isPermission(request.permission, actionExecutePermission)) {
      const actionId = request.resourceRef;
      if (actionId?.startsWith('scaffolder.action.kubernetes:')) {
        return {
          result: hasGroup(user, INFRA)
            ? AuthorizeResult.ALLOW
            : AuthorizeResult.DENY,
        };
      }
    }

    if (isPermission(request.permission, catalogEntityReadPermission)) {
    return {
      result: AuthorizeResult.CONDITIONAL,
      pluginId: 'catalog',
      resourceType: 'catalog-entity',
      conditions: {
        anyOf: [
          // Allow reading non-template entities (Components, APIs, etc.)
          {
            rule: 'IS_ENTITY_KIND',
            params: { kinds: ['Component', 'API', 'Group', 'User', 'Location', 'Resource', 'System'] },
          },
          // For Templates, only allow if the user is in the 'owner' group
          {
            rule: 'IS_ENTITY_OWNER',
            params: { claims: user?.info.ownershipEntityRefs ?? [] },
          },
        ],
      },
    };
  }

    // Visibility of sensitive template fields/steps by tag
    if (
      isPermission(request.permission, templateParameterReadPermission) ||
      isPermission(request.permission, templateStepReadPermission)
    ) {
      const tags = request.resourceRef?.split(',') ?? [];

      if (tags.includes('infra-only')) {
        return {
          result: hasGroup(user, INFRA)
            ? AuthorizeResult.ALLOW
            : AuthorizeResult.DENY,
        };
      }
      if (tags.includes('backend-only')) {
        return {
          result: hasGroup(user, BACKEND)
            ? AuthorizeResult.ALLOW
            : AuthorizeResult.DENY,
        };
      }
      if (tags.includes('frontend-only')) {
        return {
          result: hasGroup(user, FRONTEND)
            ? AuthorizeResult.ALLOW
            : AuthorizeResult.DENY,
        };
      }
    }

    // Default allow (adjust to DENY by default if you prefer strict mode)
    //return { result: AuthorizeResult.ALLOW };
    return { result: AuthorizeResult.DENY };
  }
}
