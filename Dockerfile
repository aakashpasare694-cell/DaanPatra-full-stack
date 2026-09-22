FROM php:8.4-cli

# Prevent interactive prompts and allow composer as superuser
ENV DEBIAN_FRONTEND=noninteractive
ENV COMPOSER_ALLOW_SUPERUSER=1

# Install system dependencies & PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libssl-dev \
    pkg-config \
    nodejs \
    npm \
    && docker-php-ext-install zip \
    && pecl install mongodb || true \
    && docker-php-ext-enable mongodb || true

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install PHP dependencies & build React assets
RUN composer install --no-dev --optimize-autoloader --ignore-platform-reqs
RUN npm install && npm run build

# Expose port
EXPOSE 8000

# Start command
CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"]

