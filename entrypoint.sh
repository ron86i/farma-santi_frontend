#!/bin/sh

# Ruta donde Nginx sirve los archivos (según tu Dockerfile)
HTML_DIR=/usr/share/nginx/html

# Creamos el archivo de configuración JS
echo "window.ENV = {" > $HTML_DIR/env-config.js

# --- ¡IMPORTANTE! ---
# Añade aquí TODAS las variables que tu app ADMIN necesita.
# Deben coincidir con las que pones en /home/ron86/docker-envs/admin.env

echo "  VITE_API_URL: \"$VITE_API_URL\"," >> $HTML_DIR/env-config.js

# --- Variables de Firebase (si el admin también las usa) ---
echo "  VITE_FIREBASE_API_KEY: \"$VITE_FIREBASE_API_KEY\"," >> $HTML_DIR/env-config.js
echo "  VITE_FIREBASE_AUTH_DOMAIN: \"$VITE_FIREBASE_AUTH_DOMAIN\"," >> $HTML_DIR/env-config.js
echo "  VITE_FIREBASE_PROJECT_ID: \"$VITE_FIREBASE_PROJECT_ID\"," >> $HTML_DIR/env-config.js
echo "  VITE_FIREBASE_STORAGE_BUCKET: \"$VITE_FIREBASE_STORAGE_BUCKET\"," >> $HTML_DIR/env-config.js
echo "  VITE_FIREBASE_MESSAGING_SENDER_ID: \"$VITE_FIREBASE_MESSAGING_SENDER_ID\"," >> $HTML_DIR/env-config.js
echo "  VITE_FIREBASE_APP_ID: \"$VITE_FIREBASE_APP_ID\"," >> $HTML_DIR/env-config.js
echo "  VITE_FIREBASE_MEASUREMENT_ID: \"$VITE_FIREBASE_MEASUREMENT_ID\"" >> $HTML_DIR/env-config.js

echo "}" >> $HTML_DIR/env-config.js

echo ">>> env-config.js para ADMIN generado:"
cat $HTML_DIR/env-config.js

echo ">>> Iniciando Nginx..."
# Ejecuta el comando original del Dockerfile (nginx)
exec "$@"