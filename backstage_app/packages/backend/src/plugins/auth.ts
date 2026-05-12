import { 
  createRouter, 
  providers, 
  defaultAuthProviderFactories 
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { stringifyEntityRef, DEFAULT_NAMESPACE } from '@backstage/catalog-model';


export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
   return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    discovery: env.discovery,
    tokenManager: env.tokenManager,
    providerFactories: {
      ...defaultAuthProviderFactories,
      'oidc': providers.oidc.create({
        signIn: {
          resolver(info, ctx) {
            const email = info.result.userinfo.email;
            env.logger.info('result info = ', info)

            if (!email) {
              throw new Error('Profile contained no email');
            }

            const username = email.split('@')[0];

            const userRef = stringifyEntityRef({
              kind: 'User',
              namespace: DEFAULT_NAMESPACE,
              name: username
            });
            return ctx.issueToken({
              claims: {
                sub: userRef, // The user's own identity
                ent: [userRef], // A list of identities that the user claims ownership through
              },
            });
          },
        },
      }),
    }
   })
}
