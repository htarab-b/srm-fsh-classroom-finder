from django.urls import path
from .views import *

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('staff', StaffView.as_view(), name='staff'),
    path('classroom', ClassRoomView.as_view(), name='classroom'),
    path('login', LoginView.as_view(), name='login'),
    path('editor', EditorView.as_view(), name='editor'),
    path('staffeditor', StaffEditorView.as_view(), name='staffeditor'),
    path('addstaff', StaffAddView.as_view(), name='addstaff'),
    path('subjecteditor', SubjectEditorView.as_view(), name='subjecteditor'),
    path('perioddeletionhandler', Period_Delete.as_view(), name='perioddelete'),
    path('subjectdeletionhandler', Subject_Delete.as_view(), name='subjectdelete'),
    path('dayorderchangehandler', Change_DayOrder.as_view(), name='changedayorder'),
    path('downloadclassttcsv', download_schedule_csv, name='downloadclassttcsv'),
]