from django.urls import path
from myapp.views import upload_file  
from myapp.views import view_pdf

urlpatterns = [
    path('upload/', upload_file, name='gridfs-upload'),
    path('view/<str:file_id>/', view_pdf, name='view-pdf'),
]
