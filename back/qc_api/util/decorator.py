"""
Personal decorators in use.
"""
from rest_framework.response import Response
from rest_framework import status


def catch_bad_request(func):
    """
    Raises HTTP 400 when there is a key error.
    """
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except KeyError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    return wrapper
