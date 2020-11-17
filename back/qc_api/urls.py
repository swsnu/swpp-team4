""" qc_api/urls.py"""
from django.urls import path
from . import views

urlpatterns = [
    path('sign_in', views.sign_in, name='sign_in'),
    path('sign_up', views.sign_up, name='sign_up'),
    path('sign_out', views.sign_out, name='sign_out'),
    path('snippet', views.get_or_post_snippets, name='snippet'),
    path('snippet/me', views.get_my_snippets, name='my_snippets'),
    path('algo', views.get_or_post_algorithms, name='algo'),
    path('algo/backtest', views.run_backtest, name='backtest'),
    path('algo/<int:algo_id>/report', views.get_reports_by_algo, name='report'),
    path('algo/<int:algo_id>/performance', views.get_performance_by_algo, name='performance'),
    path('algo/me', views.get_my_algorithms, name='my_algorithms'),
    path('performance', views.get_all_performances, name='all-performances')
]
