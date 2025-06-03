#!/bin/sh

# Docker entrypoint script for injecting environment variables at runtime

# Default values
VITE_API_BASE_URL=${VITE_API_BASE_URL:-"http://localhost:3000/api"}

# Create a temporary config file with environment variables
cat > /usr/share/nginx/html/config.js << EOF
window.ENV = {
  VITE_API_BASE_URL: "${VITE_API_BASE_URL}"
};
EOF

echo "Environment variables injected:"
echo "VITE_API_BASE_URL: ${VITE_API_BASE_URL}"

# Execute the original command
exec "$@"
