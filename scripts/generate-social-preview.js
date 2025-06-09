import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const WIDTH = 1200;
const HEIGHT = 630;
const BACKGROUND_COLOR = '#FFFFFF';
const LOGO_WIDTH = 800;

async function generateSocialPreview() {
  try {
    const sourceLogo = path.join(process.cwd(), 'public', 'logo-new.png');
    const outputPath = path.join(process.cwd(), 'public', 'social-preview.png');

    await sharp({
      create: {
        width: WIDTH,
        height: HEIGHT,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .composite([
      {
        input: await sharp(sourceLogo)
          .resize(LOGO_WIDTH, null, { fit: 'contain' })
          .toBuffer(),
        gravity: 'center'
      }
    ])
    .png()
    .toFile(outputPath);

    console.log('✅ Social preview image generated successfully!');
  } catch (error) {
    console.error('❌ Error generating social preview:', error);
    process.exit(1);
  }
}

generateSocialPreview(); 