import { OAuthApi, OpenIdConnectApi, ProfileInfoApi, BackstageIdentityApi, SessionApi } from '@backstage/core-plugin-api';
/**
 * 1. DEFINE API REFS FIRST
 * Moving this to the top prevents the "Cannot access before initialization" error.
 */
export declare const oidcAuthApiRef: import("@backstage/frontend-plugin-api").ApiRef<OAuthApi & OpenIdConnectApi & ProfileInfoApi & BackstageIdentityApi & SessionApi>;
declare const _default: import("react").ComponentType<{
    children?: import("react").ReactNode | undefined;
}>;
export default _default;
