// packages/app/src/App.tsx
import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import {
  CatalogImportPage,
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { orgPlugin } from '@backstage/plugin-org';
import { SearchPage } from '@backstage/plugin-search';
import {
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { entityPage } from './components/catalog/EntityPage';
import { searchPage } from './components/search/SearchPage';
import { Root } from './components/Root';

import {
  AlertDisplay,
  OAuthRequestDialog,
  SignInPage,
  SignInProviderConfig,
} from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import { AppRouter, FlatRoutes, OAuth2 } from '@backstage/core-app-api';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { SignalsDisplay } from '@backstage/plugin-signals';
import { 
  githubAuthApiRef, 
  createApiFactory, 
  discoveryApiRef, 
  configApiRef,
  fetchApiRef,
  createApiRef,
  OAuthApi,
  OpenIdConnectApi,
  ProfileInfoApi,
  BackstageIdentityApi
} from '@backstage/core-plugin-api';

import { 
  notificationsApiRef, 
  NotificationsApiClient, 
  NotificationsPage 
} from '@backstage/plugin-notifications';

/**
 * 1. DEFINE API REFS FIRST
 * Moving this to the top prevents the "Cannot access before initialization" error.
 */
export const oidcAuthApiRef = createApiRef<
  OAuthApi & OpenIdConnectApi & ProfileInfoApi & BackstageIdentityApi
>({
  id: 'auth.oidc',
});

/**
 * 2. DEFINE PROVIDERS
 */
const keycloakProvider: SignInProviderConfig = {
  id: 'oidc',
  title: 'Keycloak SSO',
  message: 'Sign in with Keycloak SSO',
  apiRef: oidcAuthApiRef,
};

const githubProvider: SignInProviderConfig = {
  id: 'github-auth-provider',
  title: 'GitHub',
  message: 'Sign in using GitHub',
  apiRef: githubAuthApiRef,
};

/**
 * 3. CREATE APP WITH API FACTORIES
 */
const app = createApp({
  apis: [
    // Register Notifications API
    createApiFactory({
      api: notificationsApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        new NotificationsApiClient({ discoveryApi, fetchApi }),
    }),
    // Register OIDC/Keycloak API Implementation
    createApiFactory({
      api: oidcAuthApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        configApi: configApiRef
      },
      factory: ({ discoveryApi, configApi }) => {
        if (!configApi) {
          throw new Error('ConfigApi was not successfully injected into the OIDC factory');
        }
        return OAuth2.create({
          configApi: configApi,
          discoveryApi: discoveryApi,
          provider: {
            id: 'oidc',
            title: 'Keycloak SSO',
            icon: () => null,
          },
          defaultScopes: ['openid', 'profile', 'email'],
        });
      },
    }),
  ],
  components: {
    AlertDisplay,
    OAuthRequestDialog,
    SignInPage: props => (
      <SignInPage
        {...props}
        providers={[keycloakProvider, githubProvider]}
      />
    ),
  },
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
      createFromTemplate: scaffolderPlugin.routes.selectedTemplate,
    });
    bind(apiDocsPlugin.externalRoutes, {
      registerApi: catalogImportPlugin.routes.importPage,
    });
    bind(scaffolderPlugin.externalRoutes, {
      registerComponent: catalogImportPlugin.routes.importPage,
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
  },
});

const routes = (
  <FlatRoutes>
    <Route path="/" element={<Navigate to="catalog" />} />
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/docs" element={<TechDocsIndexPage />} />
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
      <TechDocsAddons>
        <ReportIssue />
      </TechDocsAddons>
    </Route>
    <Route path="/create" element={<ScaffolderPage />} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route
      path="/catalog-import"
      element={
        <RequirePermission permission={catalogEntityCreatePermission}>
          <CatalogImportPage />
        </RequirePermission>
      }
    />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route path="/catalog-graph" element={<CatalogGraphPage />} />
    <Route path="/notifications" element={<NotificationsPage />} />
  </FlatRoutes>
);

export default app.createRoot(
  <>
    <AlertDisplay />
    <OAuthRequestDialog />
    <SignalsDisplay />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);
