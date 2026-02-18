# Usamos una imagen base de Nginx (tu base)
FROM nginx:alpine

# 1. Copia los archivos precompilados (build) de Vite
COPY dist /usr/share/nginx/html

# 2. Elimina la config por defecto y usa la tuya
# (Esto es mejor hacerlo *después* de copiar los archivos, por el caché de Docker)
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 3. ¡NUEVO! Copia el script de entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# 4. Expone el puerto 80 (el puerto estándar DENTRO del contenedor)
#    Tu Nginx en el host (puerto 443) hablará con este puerto 80
EXPOSE 80

# 5. ¡NUEVO! Usa el script como punto de entrada
ENTRYPOINT ["/entrypoint.sh"]

# 6. Comando por defecto (será ejecutado por el entrypoint)
CMD ["nginx", "-g", "daemon off;"]