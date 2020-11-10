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
    path('algo/<int:algo_id>/report', views.get_reports_by_algo, name='report'),
    path('algo/<int:algo_id>/performance', views.get_performance_by_algo, name='performance'),
    path('performance', views.get_all_performances, name='all-performances')
]
