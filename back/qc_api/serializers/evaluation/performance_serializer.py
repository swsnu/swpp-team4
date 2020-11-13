""" Serialization utils for performance model."""
from rest_framework import serializers
from qc_api.models import Performance


class PerformanceSerializer(serializers.ModelSerializer):
    """ Serializer for Performance Model"""

    def __init__(self, *args, **kwargs):
        super(PerformanceSerializer, self).__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].read_only = True

    class Meta:
        model = Performance
        fields = '__all__'
