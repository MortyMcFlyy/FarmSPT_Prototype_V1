"""
URL configuration for API project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from API.django_api import views
from rest_framework import routers
from django.conf import settings
from django.views.static import serve

router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet)
router.register(r"groups", views.GroupViewSet)
router.register(r"fieldboundaries", views.FieldBoundaryViewSet)
router.register(r"traces", views.ABTraceViewSet)

FRONTEND_DIR = settings.BASE_DIR / "API" / "_frontend_test"

urlpatterns = [
    path("", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path('admin/', admin.site.urls),
    
    # Statische Dateien (.js, .css, .html) direkt servieren
    path('app/<path:path>', serve, {"document_root": FRONTEND_DIR}),
    # Nur root /app/ auf index.html
    path('app/', serve, {"path": "index.html", "document_root": FRONTEND_DIR}),
    path('oidc/', include('mozilla_django_oidc.urls')),
]
