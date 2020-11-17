""" Serialization utils for report model."""
from rest_framework import serializers
from qc_api.models import Report


class ReportSerializer(serializers.ModelSerializer):
    """ Serializer for Report Model"""

    class Meta:
        model = Report
        fields = '__all__'

        read_only_fields = ('create_at', 'update_at')

