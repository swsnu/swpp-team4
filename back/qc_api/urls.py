""" qc_api/urls.py"""
from django.urls import path
from . import views

urlpatterns = [
    path('sign_in', views.sign_in, name='sign_in'),
    path('sign-up', views.sign_up, name='sign-up'),
    path('sign-out', views.sign_out, name='sign-out'),
    path('snippet', views.get_or_post_snippets, name='snippet'),
    path('algo', views.get_or_post_algorithms, name='algo'),
    path('algo/backtest', views.run_backtest, name='backtest'),
    path('algo/<int:algo_id>/report', views.get_report, name='report'),
]
