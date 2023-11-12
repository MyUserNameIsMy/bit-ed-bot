import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IFile, IFolder } from '../interfaces/directus.interface';

@Injectable()
export class DirectusService {
  constructor(private readonly httpService: HttpService) {}

  async findAllFolders() {
    try {
      console.log('Here Folder');
      const { data } = await firstValueFrom(
        this.httpService.get<IFolder[]>(process.env.DIRECTUS_BASE + '/folders'),
      );
      console.log('Exit Folder');
      return data['data'];
    } catch (err) {
      throw err;
    }
  }

  async createFolder(data: IFolder) {
    try {
      const res = await firstValueFrom(
        this.httpService.post(process.env.DIRECTUS_BASE + '/folders', data),
      );
      console.log(res);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async importFile(url: string, folderId: string, mimetype: string) {
    const body = {
      url: url,
      data: {
        storage: 'local',
        folder: folderId,
        type: mimetype,
      },
    };

    try {
      const res = await firstValueFrom(
        this.httpService.post(
          process.env.DIRECTUS_BASE + '/files/import',
          body,
        ),
      );
      console.log(res);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async uploadFile(title: string, data: any, folderId: string) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', data);
    formData.append(
      'data',
      JSON.stringify({
        storage: 'local',
        folder: folderId,
      }),
    );

    try {
      const res = await firstValueFrom(
        this.httpService.post(process.env.DIRECTUS_BASE + '/files', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }),
      );
      console.log(res);
    } catch (err) {
      console.log(
        err + 'HEREFklsdafhsdfjasflkdhsjafhsdalfhsjdfashdfjhsdajfhsalhfdj',
      );
      throw err;
    }
  }
}
