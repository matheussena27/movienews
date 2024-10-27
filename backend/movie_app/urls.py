# movie_app/urls.py

from django.urls import path
from .views import FilmesAPIView  # Importe a view que você criou
from .views import FilmeAPIView  # Importe a view que você criou
from .views import  RecomendacaoAPIView  # Importe a view que você criou
from .views import login_view
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import RegisterAPIView  
from .views import EditPasswordAPIView


urlpatterns = [
    path('filmes/', FilmesAPIView.as_view(), name='filmes-api'),  # Rota para a sua API
    path('filme/', FilmeAPIView.as_view(), name='filme-api'),  # Rota para a sua API
    path('recomendacao/', RecomendacaoAPIView.as_view(), name='recomendacao-api'),  # Rota para a sua API
    path('login/', login_view, name='login'),  # Rota para o login
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('edit-password/', EditPasswordAPIView.as_view(), name='edit-password'), 
]
