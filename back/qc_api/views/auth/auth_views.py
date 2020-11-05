from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse, HttpResponseBadRequest
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
import json


# Create your views here.
def sign_up(request):
    req_data = json.loads(request.body.decode())
    username = req_data['username']
    password = req_data['password']
    User.objects.create_user(username=username, password=password)
    return HttpResponse(status=201)


@csrf_exempt
def sign_in(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)


def sign_out(request):
    logout(request)
    return HttpResponse(status=204)