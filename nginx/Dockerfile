# Base on offical NGINX Alpine image
FROM nginx:alpine

# Remove any existing config files
RUN rm /etc/nginx/conf.d/*

# Copy config files
# *.conf files in conf.d/ dir get included in main config
COPY ./financegoras.conf /etc/nginx/conf.d/
COPY ./cert.pem /etc/cert/financegoras.com/cert.pem
COPY ./pkey.pem /etc/cert/financegoras.com/pkey.pem

# Expose the listening port
EXPOSE 80

# Launch NGINX
CMD [ "nginx", "-g", "daemon off;" ]
