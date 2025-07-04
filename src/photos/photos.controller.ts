/* src/photos/photos.controller.ts */
import {
  Controller,
  Post,
  Get,
  Delete,
  Query,
  Param,
  HttpException,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { extname, join } from 'path';

@Controller('photos')
export class PhotosController {
  private readonly uploadDir = join(__dirname, '../../uploads');

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_, __, cb) => cb(null, join(__dirname, '../../uploads')),
        filename: (_, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          callback(null, `${uniqueSuffix}${fileExt}`);
        },
      }),
    }),
  )
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/${file.filename}` };
  }

  @Get()
  listPhotos(@Query('page') page: string = '1') {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const files = fs
      .readdirSync(this.uploadDir)
      .sort((a, b) => b.localeCompare(a));

    const perPage = 10;
    const start = (pageNum - 1) * perPage;
    const paged = files.slice(start, start + perPage);
    const urls = paged.map(filename => `http://localhost:3029/uploads/${filename}`);
    return { page: pageNum, perPage, urls };
  }

  @Delete(':filename')
  deletePhoto(@Param('filename') filename: string) {
    const filePath = join(this.uploadDir, filename);
    if (!fs.existsSync(filePath)) {
      throw new HttpException('Archivo no encontrado', HttpStatus.NOT_FOUND);
    }
    try {
      fs.unlinkSync(filePath);
      return { message: 'Archivo eliminado', filename };
    } catch {
      throw new HttpException(
        'Error al eliminar archivo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
