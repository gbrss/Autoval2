import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const baseDir = process.cwd();
    const zipScript = path.join(baseDir, 'scripts', 'generate_zip.py');
    const zipPath = path.join(baseDir, 'autoval-clon-astro.zip');

    try {
      execSync(`python3 "${zipScript}"`, { stdio: 'ignore' });
    } catch (e) {
      console.warn('Zip generation warning:', e);
    }

    if (fs.existsSync(zipPath)) {
      const fileBuffer = fs.readFileSync(zipPath);
      return new Response(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': 'attachment; filename="autoval-clon-astro.zip"',
          'Content-Length': fileBuffer.length.toString()
        }
      });
    }

    return new Response(JSON.stringify({ success: false, error: 'Archivo no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: 'Error al generar ZIP' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
