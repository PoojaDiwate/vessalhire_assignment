from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        token['username'] = user.username
        
        return token


