#!/usr/bin/env python3
"""Servidor estático mínimo da landing.

Uso:  python server.py        ->  http://localhost:5173
      PORT=8080 python server.py

ThreadingHTTPServer (e não TCPServer) porque o navegador abre várias conexões
em paralelo: com um servidor de uma thread só, a página trava carregando.
"""
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(os.environ.get("PORT", 5173))
RAIZ = os.path.dirname(os.path.abspath(__file__))


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".webp": "image/webp",
        ".avif": "image/avif",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".svg": "image/svg+xml",
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=RAIZ, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass


if __name__ == "__main__":
    servidor = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    servidor.daemon_threads = True
    print(f"Landing Nathalia Siqueira  ->  http://localhost:{PORT}")
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        servidor.shutdown()
