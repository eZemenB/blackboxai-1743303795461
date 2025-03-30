from rest_framework import serializers
from .models import Project, Status, Campus, Collage, Department
from accounts.serializers import UserProfileSerializer

class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = '__all__'

class CampusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campus
        fields = '__all__'

class CollageSerializer(serializers.ModelSerializer):
    campus = CampusSerializer(read_only=True)
    
    class Meta:
        model = Collage
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    collage = CollageSerializer(read_only=True)
    
    class Meta:
        model = Department
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    created_by = UserProfileSerializer(read_only=True)
    approver = UserProfileSerializer(read_only=True)
    campus = CampusSerializer(read_only=True)
    collage = CollageSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)
    status = StatusSerializer(read_only=True)
    completion_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'submitted_at', 'approved_at']
    
    def get_completion_percentage(self, obj):
        return obj.get_completion_percentage()

class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['title', 'campus', 'collage', 'department', 'status']
    
    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['created_by'] = request.user
        return super().create(validated_data)

class ProjectUpdateStepSerializer(serializers.Serializer):
    step = serializers.CharField(required=True)
    data = serializers.JSONField(required=True)

    def validate_step(self, value):
        if value not in [
            'basic_info', 'funding_details', 'team_members', 
            'project_documents', 'agreements', 'timelines',
            'reports', 'resources', 'risks', 'publications', 'funders'
        ]:
            raise serializers.ValidationError("Invalid step name")
        return value