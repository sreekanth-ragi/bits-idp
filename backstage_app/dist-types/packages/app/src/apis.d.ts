import { AnyApiFactory, OpenIdConnectApi, ProfileInfoApi, BackstageIdentityApi, SessionApi } from '@backstage/core-plugin-api';
import { ApiRef } from '@backstage/core-plugin-api';
export declare const oidcAuthApiRef: ApiRef<OpenIdConnectApi & ProfileInfoApi & BackstageIdentityApi & SessionApi>;
export declare const apis: AnyApiFactory[];
