// env.d.ts

declare namespace NodeJS {
  interface ProcessEnv {
    AUTH_SECRET: string;
    AUTH_GOOGLE_ID: string;
    AUTH_GOOGLE_SECRET: string;

    NEXT_PUBLIC_GA_MEASUREMENT_ID: string;
    NEXT_PUBLIC_GTM_ID: string;

    // AUTH_URL: string;
    COGNITO_CLIENT_ID: string;
    COGNITO_CLIENT_SECRET: string;
    COGNITO_USERPOOL_ID: string;
    COGNITO_ISSUER: string;
    COGNITO_DOMAIN: string;

    LMD_AWS_ACCESS_KEY_ID: string;
    LMD_AWS_SECRET_ACCESS_KEY: string;
    LMD_AWS_REGION: string;
    LMD_S3BUCKETNAME: string;
    LMD_S3BUCKETLINK: string;
    LMD_API_BASE_URL: string;

    // recapture
    // NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string;
    // RECAPTCHA_SECRET_KEY: string;
  }
}
