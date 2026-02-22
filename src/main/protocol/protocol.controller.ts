import { app, protocol } from 'electron';

export class ProtocolController {
  init() {
    protocol.handle('icon', (request) => this.handleIcon(request));
  }

  private async handleIcon(request: Request) {
    try {
      const url = new URL(request.url);

      const filePath = decodeURIComponent(url.hostname + url.pathname);

      const icon = await app.getFileIcon(filePath, { size: 'large' });
      const pngBuffer = icon.toPNG();

      return new Response(new Uint8Array(pngBuffer), {
        headers: { 'Content-Type': 'image/png' },
      });
    } catch (e) {
      console.error(e);

      return new Response(null, {
        status: 404,
      });
    }
  }
}
