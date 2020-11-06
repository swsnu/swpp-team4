"""
Utility functions and decorators useful in views.
"""
from django.http import HttpResponse


def check_request_method(valid_methods):
    """
    Check the HttpRequest method is appropriate.
    If not, return 405.
    """
    def decorator(func):
        def wrapper(request, *args, **kwargs):
            if request.method not in valid_methods:
                return HttpResponse(status=405)
            return func(request, *args, **kwargs)
        return wrapper
    return decorator
