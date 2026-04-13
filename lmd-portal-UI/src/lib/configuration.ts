// APP CONFIGURATION

const AppConfiguration = {
  ClientId: process.env.COGNITO_CLIENT_ID,
  UserPoolId: process.env.COGNITO_USERPOOL_ID,
  CognitoClientSecret: process.env.COGNITO_CLIENT_SECRET,
  CognitoIssuer: process.env.COGNITO_ISSUER,
  CognitoDomain: process.env.COGNITO_DOMAIN,
  AWSConfig: {
    region: process.env.LMD_AWS_REGION,
    credentials: {
      accessKeyId: process.env.LMD_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.LMD_AWS_SECRET_ACCESS_KEY,
    },
  },
  s3BucketName: process.env.LMD_S3BUCKETNAME,
};

export default AppConfiguration;
