import { GoogleDriveConfigType } from 'nestjs-google-drive/src/google-drive/types';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();

const configService = new ConfigService();
export const getGoogleDriveConfig = (): GoogleDriveConfigType => {
  return {
    clientId: configService.get('CLIENT_ID'),
    clientSecret: configService.get('CLIENT_SECRET'),
    redirectUrl: configService.get('REDIRECT_URL'),
    refreshToken: configService.get('REFRESH_TOKEN'),
  };
};
