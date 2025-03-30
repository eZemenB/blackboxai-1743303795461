from django.contrib import admin
from .models import Status, Campus, Collage, Department, Project

class StatusAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

class CampusAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')

class CollageAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'campus')
    list_filter = ('campus',)
    search_fields = ('name', 'code')

class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'collage')
    list_filter = ('collage__campus', 'collage')
    search_fields = ('name', 'code')

class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'campus', 'collage', 'department', 
                   'approval_status', 'created_at')
    list_filter = ('approval_status', 'campus', 'collage', 'department')
    search_fields = ('title', 'created_by__username')
    readonly_fields = ('created_at', 'updated_at', 'submitted_at', 'approved_at')
    filter_horizontal = ()
    fieldsets = (
        (None, {'fields': ('title', 'created_by', 'approval_status')}),
        ('Institutional Information', {
            'fields': ('campus', 'collage', 'department', 'status')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'submitted_at', 'approved_at'),
            'classes': ('collapse',)
        }),
        ('Approval Details', {
            'fields': ('approver', 'rejection_reason'),
            'classes': ('collapse',)
        }),
        ('Project Data', {
            'fields': (
                'basic_info', 'funding_details', 'team_members',
                'project_documents', 'agreements', 'timelines',
                'reports', 'resources', 'risks', 'publications', 'funders'
            ),
            'classes': ('collapse',)
        }),
    )

admin.site.register(Status, StatusAdmin)
admin.site.register(Campus, CampusAdmin)
admin.site.register(Collage, CollageAdmin)
admin.site.register(Department, DepartmentAdmin)
admin.site.register(Project, ProjectAdmin)