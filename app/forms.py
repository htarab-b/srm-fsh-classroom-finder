from django import forms
from .models import *

class ClassForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(ClassForm, self).__init__(*args, **kwargs)
    class Meta:
        model = Class
        fields = ('__all__')

class EditorForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        classname = kwargs.pop('classname', None)
        super(EditorForm, self).__init__(*args, **kwargs)
        self.fields['Subject'].widget = forms.Select(choices = Subject.objects.filter(Class=classname).values_list('Subject', 'Staff__Name'))
    class Meta:
        model = Period
        fields = '__all__'

class SubjectEditorForm(forms.ModelForm):
    Class = forms.ChoiceField(widget=forms.Select())
    def __init__(self, *args, **kwargs):
        super(SubjectEditorForm, self).__init__(*args, **kwargs)
        self.fields['Staff'].widget = forms.Select(choices = Staff.objects.values_list('Email', 'Name'))
    class Meta:
        model = Subject
        fields = '__all__'