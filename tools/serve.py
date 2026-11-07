# language: Python 3.11, file: tools/serve.py
# Static server for AnormalMath that forbids caching, so a rebuilt file is
# always the one the browser executes.
import http.server
import os
import socketserver

ROOT = r"N:\DeepSeekHarness\apk\anormalmath"
PORT = 8017


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass


os.chdir(ROOT)
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
    print(f"serving {ROOT} on http://127.0.0.1:{PORT} (no-store)")
    httpd.serve_forever()
