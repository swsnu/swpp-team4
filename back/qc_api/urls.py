""" qc_api/urls.py"""
from django.urls import path, include
from . import views

urlpatterns = [
    path('sign_in', views.sign_in, name='sign_in'),
    path('sign_up', views.sign_up, name='sign_up'),
    path('sign_out', views.sign_out, name='sign_out'),
    path('snippet', views.get_put_post_snippets, name='snippet'),
    path('snippet/me', views.get_my_snippets, name='my_snippets'),
    path('snippet/<int:snippet_id>', views.share_or_not_snippet, name='share_snippet'),
    path('like/snippet', views.get_or_post_liked_snippets, name='liked_snippets'),
    path('algo', views.get_or_post_algorithms, name='algo'),
    path('algo/backtest', views.run_backtest, name='backtest'),
    path('algo/<int:algo_id>', views.share_or_delete_algorithm, name='share_algo'),
    path('algo/<int:algo_id>/report', views.get_reports_by_algo, name='report'),
    path('algo/<int:algo_id>/performance', views.get_performance_by_algo, name='performance'),
    path('algo/me', views.get_my_algorithms, name='my_algorithms'),
    path('performance', views.get_all_performances, name='all-performances'),
    path('performancetest', views.test_performance, name='test-performances'),
    # path('celery', views.sample_celery, name='celery'),
    # path('webpush', views.webpush_example, name='webpush')
    path('webpush/', include('webpush.urls')),
    path('like/snippet', views.get_liked_snippets, name='liked_snippets'),
    path('like/snippet/<int:snippet_id>', views.like_or_unlike_snippet, name='like_snippet'),
    path('performance', views.get_all_performances, name='all-performances')
]
