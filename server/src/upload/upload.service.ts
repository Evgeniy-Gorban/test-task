import { Injectable, BadRequestException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import sharp from 'sharp';
import { slugify as trSlugify } from 'transliteration';
import { Buffer } from 'buffer';

@Injectable()
export class UploadService {
  private uploadDir = path.join(process.cwd(), 'uploads', 'comments');

  async handleFile(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File not uploaded');

    await fs.mkdir(this.uploadDir, { recursive: true });

    const originalName = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    );

    const ext = path.extname(originalName).toLowerCase();
    const isImage = /^image\/(jpeg|png|gif)$/.test(file.mimetype);
    const isTxt = file.mimetype === 'text/plain';

    if (!isImage && !isTxt) {
      throw new BadRequestException('Invalid file format');
    }

    const safeBase = trSlugify(path.basename(originalName, ext), {
      lowercase: true,
      separator: '_',
    });

    const uniqueName = `${safeBase}_${Date.now()}${ext}`;

    const savePath = path.join(this.uploadDir, uniqueName);

    if (isTxt) {
      if (file.size > 100 * 1024) {
        throw new BadRequestException('TXT file must not exceed 100KB');
      }
      await fs.writeFile(savePath, file.buffer);
      return {
        filePath: `comments/${uniqueName}`,
        fileType: 'text',
        originalName,
      };
    }

    const img = sharp(file.buffer);
    const metadata = await img.metadata();

    if ((metadata.width ?? 0) > 320 || (metadata.height ?? 0) > 240) {
      await img.resize(320, 240, { fit: 'inside' }).toFile(savePath);
    } else {
      await fs.writeFile(savePath, file.buffer);
    }

    return {
      filePath: `comments/${uniqueName}`,
      fileType: 'image',
      originalName,
    };
  }
}
