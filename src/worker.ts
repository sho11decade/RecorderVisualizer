/**
 * Cloudflare Worker スクリプト
 * SPA（Single Page Application）モードで静的アセットを提供
 */

interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

interface ExportedHandler<Env = Record<string, unknown>> {
  fetch: (request: Request, env: Env) => Promise<Response> | Response;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // キャッシュキーの設定
    const cacheKey = new Request(url.toString(), {
      method: 'GET',
    });

    // 静的アセットリクエストの場合
    if (
      pathname.startsWith('/assets/') ||
      pathname.endsWith('.js') ||
      pathname.endsWith('.css') ||
      pathname.endsWith('.woff2') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.svg') ||
      pathname.endsWith('.ico')
    ) {
      try {
        let response = await env.ASSETS.fetch(cacheKey);
        if (response.status === 200) {
          // アセットをキャッシュ
          const cacheControl =
            pathname.startsWith('/assets/') && pathname.match(/\.[a-f0-9]{8}\./)
              ? 'public, max-age=31536000, immutable'
              : 'public, max-age=3600';
          response = new Response(response.body, response);
          response.headers.set('Cache-Control', cacheControl);
          return response;
        }
      } catch (error) {
        console.error('Asset fetch error:', error);
      }
    }

    // すべてのルートをindex.htmlにルーティング（SPA）
    try {
      const indexResponse = await env.ASSETS.fetch(
        new Request(new URL('/index.html', url).toString(), {
          method: 'GET',
        })
      );

      if (indexResponse.status === 200) {
        const response = new Response(indexResponse.body, indexResponse);
        response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
        response.headers.set('Content-Type', 'text/html; charset=utf-8');
        return response;
      }
    } catch (error) {
      console.error('Index fetch error:', error);
    }

    return new Response('Not Found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;
