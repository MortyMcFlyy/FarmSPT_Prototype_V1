from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import requests
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()

class KeycloakAuthentication(BaseAuthentication):
    """Einfache Keycloak Token Validierung"""
    
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '').split()
        
        if len(auth_header) != 2 or auth_header[0] != 'Bearer':
            return None
        
        token = auth_header[1]
        
        try:
            # Validiere Token gegen Keycloak UserInfo Endpoint
            userinfo_url = settings.OIDC_OP_USER_ENDPOINT
            response = requests.get(
                userinfo_url,
                headers={'Authorization': f'Bearer {token}'},
                verify=False
            )
            
            if response.status_code != 200:
                raise AuthenticationFailed('Token ungültig')
            
            user_info = response.json()
            
            # User in Django erstellen/aktualisieren
            user, created = User.objects.get_or_create(
                username=user_info.get('preferred_username'),
                defaults={
                    'first_name': user_info.get('given_name', ''),
                    'last_name': user_info.get('family_name', ''),
                    'email': user_info.get('email', '')
                }
            )
            
            return (user, None)
            
        except Exception as e:
            raise AuthenticationFailed(f'Token Validierung fehlgeschlagen: {str(e)}')