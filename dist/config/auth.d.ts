export interface AuthConfig {
    secret: string;
    issuer: string;
    audience: string;
}
export declare const getAuthConfig: () => AuthConfig;
export declare const assertAuthConfiguration: () => void;
