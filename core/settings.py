from pathlib import Path
from datetime import timedelta  # <-- EKLENDİ: Zaman ayarı için gerekli

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
SECRET_KEY = 'django-insecure-^pg0_&y9nmy09(3t^j8lxys6s%i4!hop5h8j00y9)*2*=9s4zb'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # 3. Parti Uygulamalar
    'rest_framework',
    'rest_framework_simplejwt',  # <-- EKLENDİ: JWT Kütüphanesi
    'corsheaders',               # <-- React bağlantısı için
    'storages',                  # <-- AWS S3 için

    # Senin Uygulaman
    'api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # <-- En üstlerde olmalı
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# --- VERİTABANI AYARLARI ---
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'course_outline_db',  # <-- pgAdmin'de açtığın isim
        'USER': 'postgres',           # Standart kullanıcı
        'PASSWORD': '12345', 
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- ÖZEL AYARLAR ---

# 1. CORS İZNİ
CORS_ALLOW_ALL_ORIGINS = True

# 2. REST FRAMEWORK GÜVENLİK AYARLARI (GÜNCELLENDİ)
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication', # <-- ARTIK JWT KULLANIYORUZ
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny', # Test aşamasında rahat çalış diye AllowAny yaptık
    ],
}

# 3. JWT AYARLARI (YENİ EKLENDİ)
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),  # Token 1 gün geçerli (geliştirme için)
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
}

# --- AWS S3 AYARLARI ---
AWS_ACCESS_KEY_ID = 'AKIA4IVNG4KKCKSYVXJK'
AWS_SECRET_ACCESS_KEY = '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'
AWS_STORAGE_BUCKET_NAME = 'fiu-course-project-files'
AWS_S3_REGION_NAME = 'eu-north-1' 

AWS_S3_SIGNATURE_VERSION = 's3v4'
AWS_S3_FILE_OVERWRITE = False
AWS_DEFAULT_ACL = None
AWS_S3_VERIFY = True
AWS_QUERYSTRING_AUTH = False

# Dosya Depolama Ayarları
STORAGES = {
    "default": {
        "BACKEND": "storages.backends.s3boto3.S3Boto3Storage",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}
