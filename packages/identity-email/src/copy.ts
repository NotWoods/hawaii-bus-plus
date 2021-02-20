import { mkdir, readdir, readFile, writeFile } from 'fs/promises';

const templatesFolder = new URL('../templates/', import.meta.url);
const distFolder = new URL('../../../dist/', templatesFolder);

function fileAlreadyExists(err: unknown): err is Error {
  return (err as { code?: string }).code === 'EEXIST';
}

async function mkdirIfNotExists(folder: string | URL) {
  try {
    await mkdir(folder);
  } catch (err: unknown) {
    if (fileAlreadyExists(err)) {
      // Folder already exists
    } else {
      throw err;
    }
  }
}

async function makeOutDir() {
  await mkdirIfNotExists(distFolder);
  await mkdirIfNotExists(new URL(`./email/`, distFolder));
}

async function copyFile(file: string) {
  const path = new URL(`./${file}`, templatesFolder);
  const body = await readFile(path);

  const outPath = new URL(`./email/${file}`, distFolder);
  await writeFile(outPath, body, 'utf8');
}

async function main() {
  const [files] = await Promise.all([readdir(templatesFolder), makeOutDir()]);
  await Promise.all(files.map(copyFile));
}
main().catch((err) => console.error(err));
