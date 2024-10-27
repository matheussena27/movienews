from django.shortcuts import render
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import UserSerializer
import os
from django.conf import settings
from django.http import JsonResponse
import numpy as np
import pandas as pd
import sklearn.metrics.pairwise as pw
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

class EditPasswordAPIView(APIView):
    def post(self, request):
        usuario = request.data.get("usuario")
        nova_senha = request.data.get("nova_senha")

        try:
            user = User.objects.get(username=usuario)
            user.set_password(nova_senha)
            user.save()
            return Response({"mensagem": "Senha alterada com sucesso!"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"erro": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"erro": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RegisterAPIView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            print("teste")
            serializer.save()  # Salva o usuário
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'token': str(refresh.access_token),
        })
    return Response({'error': 'Credenciais inválidas'}, status=status.HTTP_400_BAD_REQUEST)

class FilmesAPIView(APIView):
    def get(self, request):
        api = funcoesApi()
        nome_filme = request.query_params.get('filme')  # Captura o nome do filme da query string
        return JsonResponse(api.lista_filme(nome_filme), safe=False)

class FilmeAPIView(APIView):
    def get(self, request):
        api = funcoesApi()
        nome_filme = request.query_params.get('filme')  # Captura o nome do filme da query string

        return JsonResponse(api.dados_filme(nome_filme), safe=False)
    
class RecomendacaoAPIView(APIView):
    def get(self, request):
        api = funcoesApi()
        nome_filme = request.query_params.get('filme')  # Captura o nome do filme da query string

        recomendacoes =  api.ia(nome_filme)

        recomendacoes_final = []
        for recomendacao in recomendacoes:
            print(recomendacao)
            recomendacao_info = api.dados_filme(recomendacao["title"])

            if (recomendacao_info): 
                recomendacoes_final.append(recomendacao_info)
        
        return JsonResponse(recomendacoes_final, safe=False,  json_dumps_params={'ensure_ascii': False})
        
        
class funcoesApi:

    def dados_filme(self, nome_filme): #api para coletar informacoes completas de filmes
        response = requests.get(f'http://www.omdbapi.com/?t={nome_filme}&apikey=e982fb10')
        
        if response.status_code == 200:
            return response.json()
        
        return None
    
    def lista_filme(self, nome_filme): #pegando a lista de filmes do csv
        caminho= os.path.join(settings.BASE_DIR, 'static', 'csv', 'filmes.csv')
        df = pd.read_csv(caminho)
        resultados = df[df['title'].notna() & df['title'].str.contains(nome_filme, case=False)]
        
        if not resultados.empty:
            titulos = resultados['title'].tolist() #transformando o df em list

            informacoes_filme = [] #pegando as informacoes completas de cada filme da lista
            for titulo in titulos:
                informacao = self.dados_filme(titulo)
                if informacao:
                    informacoes_filme.append(informacao)
            
            return informacoes_filme
        else:
            return None
        
    def ia(self, nome_filme):
        caminho_filmes = os.path.join(settings.BASE_DIR, 'static', 'csv', 'filmes.csv')
        caminho_ratings = os.path.join(settings.BASE_DIR, 'static', 'csv', 'ratings.csv')


        filmes = pd.read_csv(caminho_filmes, sep=",")
        ratings = pd.read_csv(caminho_ratings, sep=";")

        df = filmes.merge(ratings, on='movieId')
        tabela_filmes = pd.pivot_table(df, index='title', columns='userId', values='rating').fillna(0)

        rec = pw.cosine_similarity(tabela_filmes)
        rec_df = pd.DataFrame(rec, columns=tabela_filmes.index, index=tabela_filmes.index)

        cossine_df = pd.DataFrame(rec_df[nome_filme].sort_values(ascending=False))
        cossine_df.columns = ['Recomendações']
        cossine_df = cossine_df.head(10)

        resultado_dict = cossine_df.reset_index().to_dict(orient='records')

        recomendacoes = []
        for result in resultado_dict:
            if(result['title'] != nome_filme):
                recomendacoes.append(result)
        return recomendacoes