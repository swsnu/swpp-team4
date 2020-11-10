""" Serialization utils for performance model."""
from rest_framework import serializers
from qc_api.models import Performance


class PerformanceSerializer(serializers.ModelSerializer):
    """ Serializer for Performance Model"""
    class Meta:
        model = Performance
        fields = '__all__'
        read_only_fields = '__all__'
