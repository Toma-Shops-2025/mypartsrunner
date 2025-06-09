import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const SIZES = [
  16, 32, 72, 96, 128, 144, 152, 192, 384, 512
];

const SOURCE_LOGO = path.join(process.cwd(), 'public', 'logo-new.png');
const ICONS_DIR = path.join(process.cwd(), 'public', 'icons');

async function generateIcons() {
  try {
    // Ensure icons directory exists
    await fs.mkdir(ICONS_DIR, { recursive: true });

    // Generate favicon sizes
    await sharp(SOURCE_LOGO)
      .resize(16, 16)
      .toFile(path.join(ICONS_DIR, 'favicon-16x16.png'));

    await sharp(SOURCE_LOGO)
      .resize(32, 32)
      .toFile(path.join(ICONS_DIR, 'favicon-32x32.png'));

    // Generate apple touch icon
    await sharp(SOURCE_LOGO)
      .resize(180, 180)
      .toFile(path.join(ICONS_DIR, 'apple-touch-icon.png'));

    // Generate PWA icons
    for (const size of SIZES) {
      await sharp(SOURCE_LOGO)
        .resize(size, size)
        .toFile(path.join(ICONS_DIR, `icon-${size}x${size}.png`));
    }

    // Generate special icons
    await sharp(SOURCE_LOGO)
      .resize(72, 72)
      .toFile(path.join(ICONS_DIR, 'badge-72x72.png'));

    // Generate notification icons
    const checkmark = await sharp({
      create: {
        width: 32,
        height: 32,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite([{
      input: Buffer.from(
        `<svg viewBox="0 0 32 32">
          <path d="M4 16L12 24L28 8" stroke="#6FD7D7" stroke-width="4" fill="none"/>
        </svg>`
      ),
      top: 0,
      left: 0
    }])
    .png()
    .toFile(path.join(ICONS_DIR, 'checkmark.png'));

    const close = await sharp({
      create: {
        width: 32,
        height: 32,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite([{
      input: Buffer.from(
        `<svg viewBox="0 0 32 32">
          <path d="M8 8L24 24M8 24L24 8" stroke="#6FD7D7" stroke-width="4" fill="none"/>
        </svg>`
      ),
      top: 0,
      left: 0
    }])
    .png()
    .toFile(path.join(ICONS_DIR, 'close.png'));

    console.log('✅ All icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons(); 