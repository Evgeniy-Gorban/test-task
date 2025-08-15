import { BadRequestException } from '@nestjs/common';
import { DOMParser } from '@xmldom/xmldom';
import sanitizeHtml from 'sanitize-html';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';

export function sanitizeUserName(name: string): string {
  return sanitizeHtml(name, { allowedTags: [], allowedAttributes: {} }).trim();
}

export function sanitizeUrl(url: string): string {
  const clean = sanitizeHtml(url, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();

  if (!/^https?:\/\//i.test(clean)) {
    throw new BadRequestException('Invalid URL');
  }

  return clean;
}

function validateXHTML(html: string) {
  try {
    const parser = new DOMParser({
      errorHandler: (level) => {
        if (['error', 'fatalError'].includes(level)) {
          throw new BadRequestException('Comment HTML is not valid XHTML');
        }
      },
    });

    parser.parseFromString(`<root>${html}</root>`, 'application/xhtml+xml');
  } catch {
    throw new BadRequestException('Comment HTML is not valid XHTML');
  }
}

export function sanitizeCommentData(dto: CreateCommentDto) {
  validateXHTML(dto.text);

  const cleanText = sanitizeHtml(String(dto.text), {
    allowedTags: ['a', 'code', 'i', 'strong'],
    allowedAttributes: {
      a: ['href', 'title'],
    },
    transformTags: {
      a: (tagName, attribs) => {
        if (attribs.href && !/^https?:\/\//i.test(attribs.href)) {
          delete attribs.href;
        }
        attribs.rel = 'nofollow ugc noopener noreferrer';
        attribs.target = '_blank';
        return { tagName, attribs };
      },
    },
  });

  if (!cleanText) {
    throw new BadRequestException('Comment contains no valid content');
  }

  return {
    text: cleanText,
    userName: dto.userName ? sanitizeUserName(dto.userName) : undefined,
    email: dto.email ? dto.email.trim().toLowerCase() : undefined,
    homePage: dto.homePage ? sanitizeUrl(dto.homePage) : undefined,
  };
}

export function sanitizeUserData(dto: RegisterUserDto) {
  return {
    email: dto.email.trim().toLowerCase(),
    name: sanitizeUserName(dto.name),
    homePage: sanitizeUrl(dto.homePage),
  };
}
