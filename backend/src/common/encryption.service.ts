
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-cbc';
  // In production, this should be in an environment variable
  // 32 bytes for AES-256
  private readonly key = process.env.ENCRYPTION_KEY 
    ? crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32) 
    : crypto.scryptSync('default-secret-key-do-not-use-in-prod', 'salt', 32);

  encrypt(text: string): string {
    if (!text) return text;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  decrypt(text: string): string {
    if (!text || !text.includes(':')) return text; // Return as is if not encrypted format
    try {
      const [ivHex, encryptedHex] = text.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error.message);
      return text; // Return original if decryption fails (might be unencrypted old data)
    }
  }

  isEncrypted(text: string): boolean {
    if (!text) return false;
    const parts = text.split(':');
    // Basic check: IV is 16 bytes (32 hex chars) and we have 2 parts
    return parts.length === 2 && parts[0].length === 32;
  }
}
