from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Project
from .serializers import (
    ProjectSerializer, 
    ProjectCreateSerializer,
    ProjectUpdateStepSerializer
)

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Project.objects.all()
        return Project.objects.filter(created_by=user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ProjectCreateSerializer
        return super().get_serializer_class()
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        project = self.get_object()
        if project.created_by != request.user:
            return Response(
                {'detail': 'You can only submit your own projects.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        if project.submit_for_approval():
            return Response({'status': 'Project submitted for approval'})
        return Response(
            {'status': 'Project is not complete. Complete all steps before submitting.'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        if not request.user.is_staff:
            return Response(
                {'detail': 'Only staff can approve projects.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        project = self.get_object()
        project.approval_status = 'approved'
        project.approved_at = timezone.now()
        project.approver = request.user
        project.save()
        return Response({'status': 'Project approved'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        if not request.user.is_staff:
            return Response(
                {'detail': 'Only staff can reject projects.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        reason = request.data.get('reason', '')
        if not reason:
            return Response(
                {'reason': 'This field is required.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        project = self.get_object()
        project.approval_status = 'rejected'
        project.rejection_reason = reason
        project.save()
        return Response({'status': 'Project rejected'})
    
    @action(detail=True, methods=['post'])
    def update_step(self, request, pk=None):
        project = self.get_object()
        serializer = ProjectUpdateStepSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        step = serializer.validated_data['step']
        data = serializer.validated_data['data']
        
        if hasattr(project, step):
            setattr(project, step, data)
            project.save()
            return Response({'status': f'{step} updated successfully'})
        
        return Response(
            {'error': 'Invalid step.'}, 
            status=status.HTTP_400_BAD_REQUEST
        )