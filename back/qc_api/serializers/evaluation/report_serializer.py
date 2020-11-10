from rest_framework import serializers
from qc_api.models.evaluation.report import Report


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'
        read_only_fields = '__all__'
