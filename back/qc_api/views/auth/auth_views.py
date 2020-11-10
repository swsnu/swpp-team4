"""
Views for authorization.
"""
import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view


# Create your views here.
def sign_up(request):
    """ Handle sign up request """
    req_data = json.loads(request.body.decode())
    username = req_data['username']
    password = req_data['password']
    User.objects.create_user(username=username, password=password)
    return HttpResponse(status=201)


@csrf_exempt
@api_view(['POST'])
def sign_in(request):
    """ Handle sign in request """
    req_data = json.loads(request.body.decode())
    username = req_data['username']
    password = req_data['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return HttpResponse(status=204)
    return HttpResponse(status=401)


def sign_out(request):
    """ Handle sign out request """
    logout(request)
    return HttpResponse(status=204)
