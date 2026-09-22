import { readdir } from 'node:fs/promises';
import { extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const imageDirectory = new URL('../public/img/', import.meta.url);
const filenames = await readdir(imageDirectory);

const conversions = filenames
  .filter((filename) => extname(filename).toLocaleLowerCase() === '.png')
  .map(async (filename) => {
    const source = new URL(filename, imageDirectory);
    const output = new URL(filename.replace(/\.png$/i, '.webp'), imageDirectory);
    await sharp(fileURLToPath(source)).webp({ quality: 82, effort: 6 }).toFile(fileURLToPath(output));
    return filename;
  });

const converted = await Promise.all(conversions);
console.log(`Optimized ${converted.length} project images.`);
