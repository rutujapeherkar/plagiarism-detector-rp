"""
Gunicorn Configuration for Memory-Efficient Deployment
Single worker to minimize memory usage

"""

import os

# Bind to PORT environment variable
bind = f"0.0.0.0:{os.environ.get('PORT', 5000)}"

# Single worker to save memory (critical for 512MB limit)
workers = 1

# Worker class
worker_class = "sync"

# Timeout for long-running model inference
timeout = 120

# Graceful timeout
graceful_timeout = 30

# Max requests per worker before restart (prevent memory leaks)
max_requests = 100
max_requests_jitter = 10

# Preload app to share memory (but models are lazy-loaded)
preload_app = False

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Worker connections
worker_connections = 10

# Disable request logging for memory
disable_redirect_access_to_syslog = True