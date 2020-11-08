from rest_framework.response import Response
from rest_framework import status


def catch_bad_request(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except KeyError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    return wrapper
