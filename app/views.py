from typing import Any
from django import http
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views.generic import ListView, RedirectView
from .forms import *
from .models import *
from django.contrib.auth import login, authenticate
from django.contrib.auth.mixins import LoginRequiredMixin
from datetime import date

# Authentication:
class LoginView(ListView):
    def get(self, request):
        return render(request, 'login.html')
    def post(self, request):
        username = request.POST.get('Username')
        password = request.POST.get('Password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('editor')
        return render(request, 'login.html', {'message': 'Invalid credentials! Try again'})

class HomeView(ListView):
    def get(self, request):
        if (request.GET.get('Programme') is None) or (request.GET.get('Course') is None) or (request.GET.get('Year') is None) or (request.GET.get('Section') is None):
            return render(request, 'home.html', {'form': ClassForm})
        Programme = request.GET.get('Programme')
        Course = request.GET.get('Course')
        Year = request.GET.get('Year')
        Section = str(request.GET.get('Section')).upper()
        classroom = Class.objects.get(Programme=Programme, Course=Course, Year=Year, Section=Section)

        orderobject = DayOrder.objects.get(id=1)
        db_date = orderobject.Date
        order = orderobject.Order
        day_diff = (date.today() - db_date).days
        week_day_no = (db_date).weekday()
        for i in range(day_diff):
            if week_day_no < 5:
                order += 1
            week_day_no += 1
            if week_day_no > 6: week_day_no = 0
            if order == 6: order = 1
        
        slot = classroom.Slot
        do1 = Period.objects.filter(Class=classroom, Order=1, Slot=slot)
        do2 = Period.objects.filter(Class=classroom, Order=2, Slot=slot)
        do3 = Period.objects.filter(Class=classroom, Order=3, Slot=slot)
        do4 = Period.objects.filter(Class=classroom, Order=4, Slot=slot)
        do5 = Period.objects.filter(Class=classroom, Order=5, Slot=slot)
        return render(request, 'timetable.html', {'do1': do1, 'do2': do2, 'do3': do3, 'do4': do4, 'do5': do5, 'class': classroom, 'order': order, 'slot': slot})
    
class StudentView(ListView):
    def get(self, request):
        if (request.GET.get('Programme') is None) or (request.GET.get('Course') is None) or (request.GET.get('Year') is None) or (request.GET.get('Section') is None):
            return render(request, 'home.html', {'form': ClassForm})
        Programme = request.GET.get('Programme')
        Course = request.GET.get('Course')
        Year = request.GET.get('Year')
        Section = str(request.GET.get('Section')).upper()
        classroom = Class.objects.get(Programme=Programme, Course=Course, Year=Year, Section=Section)
        
        orderobject = DayOrder.objects.get(id=1)
        db_date = orderobject.Date
        order = orderobject.Order
        day_diff = (date.today() - db_date).days
        week_day_no = (db_date).weekday()
        for i in range(day_diff):
            if week_day_no < 5:
                order += 1
            week_day_no += 1
            if week_day_no > 6: week_day_no = 0
            if order == 6: order = 1

        tt = Period.objects.filter(Class=classroom, Order=order)
        return render(request, 'studenttimetable.html', {'tt': tt, 'class': classroom, 'dayorder': order})

class StaffView(ListView):
    def get(self, request):
        if (request.GET.get('Email') is None):
            return render(request, 'staff.html')
        Email = request.GET.get('Email')
        staff = Staff.objects.get(Email=Email)
        
        orderobject = DayOrder.objects.get(id=1)
        db_date = orderobject.Date
        order = orderobject.Order
        day_diff = (date.today() - db_date).days
        week_day_no = (db_date).weekday()
        for i in range(day_diff):
            if week_day_no < 5:
                order += 1
            week_day_no += 1
            if week_day_no > 6: week_day_no = 0
            if order == 6: order = 1

        do1A = Period.objects.filter(Staff=staff, Order=1, Slot='A')
        do2A = Period.objects.filter(Staff=staff, Order=2, Slot='A')
        do3A = Period.objects.filter(Staff=staff, Order=3, Slot='A')
        do4A = Period.objects.filter(Staff=staff, Order=4, Slot='A')
        do5A = Period.objects.filter(Staff=staff, Order=5, Slot='A')
        do1B = Period.objects.filter(Staff=staff, Order=1, Slot='B')
        do2B = Period.objects.filter(Staff=staff, Order=2, Slot='B')
        do3B = Period.objects.filter(Staff=staff, Order=3, Slot='B')
        do4B = Period.objects.filter(Staff=staff, Order=4, Slot='B')
        do5B = Period.objects.filter(Staff=staff, Order=5, Slot='B')
        return render(request, 'stafftt.html', {'do1A': do1A, 'do2A': do2A, 'do3A': do3A, 'do4A': do4A, 'do5A': do5A, 'do1B': do1B, 'do2B': do2B, 'do3B': do3B, 'do4B': do4B, 'do5B': do5B, 'staff': staff, 'order': order})
    
class ClassRoomView(ListView):
    def get(self, request):
        if (request.GET.get('Classroom') is None):
            return render(request, 'classroom.html')
        Classroom = request.GET.get('Classroom')
        
        orderobject = DayOrder.objects.get(id=1)
        db_date = orderobject.Date
        order = orderobject.Order
        day_diff = (date.today() - db_date).days
        week_day_no = (db_date).weekday()
        for i in range(day_diff):
            if week_day_no < 5:
                order += 1
            week_day_no += 1
            if week_day_no > 6: week_day_no = 0
            if order == 6: order = 1

        do1A = Period.objects.filter(ClassRoom=Classroom, Order=1, Slot='A')
        do2A = Period.objects.filter(ClassRoom=Classroom, Order=2, Slot='A')
        do3A = Period.objects.filter(ClassRoom=Classroom, Order=3, Slot='A')
        do4A = Period.objects.filter(ClassRoom=Classroom, Order=4, Slot='A')
        do5A = Period.objects.filter(ClassRoom=Classroom, Order=5, Slot='A')
        do1B = Period.objects.filter(ClassRoom=Classroom, Order=1, Slot='B')
        do2B = Period.objects.filter(ClassRoom=Classroom, Order=2, Slot='B')
        do3B = Period.objects.filter(ClassRoom=Classroom, Order=3, Slot='B')
        do4B = Period.objects.filter(ClassRoom=Classroom, Order=4, Slot='B')
        do5B = Period.objects.filter(ClassRoom=Classroom, Order=5, Slot='B')
        return render(request, 'classroomtt.html', {'do1A': do1A, 'do2A': do2A, 'do3A': do3A, 'do4A': do4A, 'do5A': do5A, 'do1B': do1B, 'do2B': do2B, 'do3B': do3B, 'do4B': do4B, 'do5B': do5B, 'order': order, 'classroom': Classroom})

class EditorView(LoginRequiredMixin , ListView):
    login_url = 'login'
    def get(self, request):
        orderobject = DayOrder.objects.get(id=1)
        db_date = orderobject.Date
        current_dayorder = orderobject.Order
        day_diff = (date.today() - db_date).days
        week_day_no = (db_date).weekday()
        for i in range(day_diff):
            if week_day_no < 5:
                current_dayorder += 1
            week_day_no += 1
            if week_day_no > 6: week_day_no = 0
            if current_dayorder == 6: current_dayorder = 1

        if (request.GET.get('Programme') is None) or (request.GET.get('Course') is None) or (request.GET.get('Year') is None) or (request.GET.get('Section') is None):
            return render(request, 'editorclass.html', {'form': ClassForm, 'current_dayorder': current_dayorder})
        
        Programme = request.GET.get('Programme')
        Course = request.GET.get('Course')
        Year = request.GET.get('Year')
        Section = str(request.GET.get('Section')).upper()
        classname = Class.objects.get(Programme=Programme, Course=Course, Year=Year, Section=Section)
        order = request.GET.get('Order')

        slot = classname.Slot

        periodlist = Period.objects.filter(Order=order, Slot=slot).values_list('Period', 'ClassRoom').distinct()

        classtt = Period.objects.filter(Class=classname, Order=order, Slot=slot)
        staffs = Staff.objects.filter(subject__Class=classname).distinct()
        stafftt = Period.objects.filter(Staff__in=staffs, Order=order, Slot=slot)

        error = request.GET.get('Error')
        return render(request, 'editor.html', {'tt': classtt, 'stafftt': stafftt, 'staffs': staffs, 'Order': order, 'class': classname, 'form': EditorForm(classname=classname), 'Error': error, 'current_dayorder': current_dayorder, 'slot': slot, 'periodlist': periodlist})
    def post(self, request):
        Programme = request.GET.get('Programme')
        Course = request.GET.get('Course')
        Year = request.GET.get('Year')
        Section = str(request.GET.get('Section')).upper()
        Class_Obj = Class.objects.get(Programme=Programme, Course=Course, Year=Year, Section=Section)
        order = request.GET.get('Order')
        period = request.POST.get('Period')
        classroom = request.POST.get("ClassNo")
        subject = request.POST.get("Subject")
        flag_modify = request.POST.get('modify')
        Sub_Obj = Subject.objects.get(Subject=subject, Class=Class_Obj)
        slot = Class_Obj.Slot
        if (flag_modify is None and Period.objects.filter(Order=order, Period=period, ClassRoom=classroom, Slot=slot).exists()):
            url = f"{reverse('editor')}?Programme={Programme}&Course={Course}&Year={Year}&Section={Section}&Order={order}&Error=Classroom"
            return redirect(url)
        if (Period.objects.filter(Order=order, Period=period, Staff=Sub_Obj.Staff, Slot=slot).exclude(Class=Class_Obj).exists()):
            url = f"{reverse('editor')}?Programme={Programme}&Course={Course}&Year={Year}&Section={Section}&Order={order}&Error=Staff"
            return redirect(url)
        if Sub_Obj.Type == "Elective":
            class_list = Subject.objects.filter(Subject=Sub_Obj.Subject, Staff=Sub_Obj.Staff)
            subj_list = Subject.objects.filter(Class=Class_Obj, Type="Elective")
            classroom = str(classroom).split(',')
            for i in range(len(subj_list)):
                for classes in class_list:
                    if (slot == 'A' and period == '7'):
                        TT_dup_Obj = Period.objects.create(Class=classes.Class, Order=order, Period=1, Slot='B')
                        TT_dup_Obj.ClassRoom = classroom[i]
                        TT_dup_Obj.Subject = subj_list[i]
                        TT_dup_Obj.Staff = subj_list[i].Staff
                        TT_dup_Obj.save()
                    if (slot == 'B' and period == '1'):
                        TT_dup_Obj = Period.objects.create(Class=classes.Class, Order=order, Period=7, Slot='A')
                        TT_dup_Obj.ClassRoom = classroom[i]
                        TT_dup_Obj.Subject = subj_list[i]
                        TT_dup_Obj.Staff = subj_list[i].Staff
                        TT_dup_Obj.save()
                    TT_Obj = Period.objects.create(Class=classes.Class, Order=order, Period=period, Slot=slot)
                    TT_Obj.ClassRoom = classroom[i]
                    TT_Obj.Subject = subj_list[i]
                    TT_Obj.Staff = subj_list[i].Staff
                    TT_Obj.save()
        else:
            if (slot == 'A' and period == '7'):
                TT_dup_Obj, created = Period.objects.get_or_create(Class=Class_Obj, Order=order, Period=1, Slot='B')
                TT_dup_Obj.ClassRoom = classroom
                TT_dup_Obj.Subject = Sub_Obj
                TT_dup_Obj.Staff = Sub_Obj.Staff
                TT_dup_Obj.save()
            if (slot == 'B' and period == '1'):
                TT_dup_Obj, created = Period.objects.get_or_create(Class=Class_Obj, Order=order, Period=7, Slot='A')
                TT_dup_Obj.ClassRoom = classroom
                TT_dup_Obj.Subject = Sub_Obj
                TT_dup_Obj.Staff = Sub_Obj.Staff
                TT_dup_Obj.save()
            TT_Obj, created = Period.objects.get_or_create(Class=Class_Obj, Order=order, Period=period, Slot=slot)
            TT_Obj.ClassRoom = classroom
            TT_Obj.Subject = Sub_Obj
            TT_Obj.Staff = Sub_Obj.Staff
            TT_Obj.save()
        url = f"{reverse('editor')}?Programme={Programme}&Course={Course}&Year={Year}&Section={Section}&Order={order}"
        return redirect(url)
    
class StaffEditorView(LoginRequiredMixin, ListView):
    def get(self, request):
        return render(request, 'staffeditor.html')
    def post(self, request):
        Name = request.POST.get('Name')
        Email = request.POST.get('Email')
        Staff.objects.create(Name=Name, Email=Email)
        return render(request, 'staffeditor.html', {'message': 'Staff added successfully'})
    
class SubjectEditorView(LoginRequiredMixin, ListView):
    def get(self, request):
        if (request.GET.get('Programme') is None) or (request.GET.get('Course') is None) or (request.GET.get('Year') is None) or (request.GET.get('Section') is None) or (request.GET.get('Slot') is None):
            return render(request, 'subjecteditorclass.html', {'form': ClassForm})
        Programme = request.GET.get('Programme')
        Course = request.GET.get('Course')
        Year = request.GET.get('Year')
        Section = str(request.GET.get('Section')).upper()
        Slot = request.GET.get('Slot')
        classroom, created = Class.objects.get_or_create(Programme=Programme, Course=Course, Year=Year, Section=Section, Slot=Slot)
        subjects = Subject.objects.filter(Class=classroom)
        return render(request, 'subjecteditor.html', {'form': SubjectEditorForm, 'subjects': subjects, 'class': classroom})
    def post(self, request):
        Programme = request.GET.get('Programme')
        Course = request.GET.get('Course')
        Year = request.GET.get('Year')
        Section = str(request.GET.get('Section')).upper()
        Slot = request.GET.get('Slot')
        classroom = Class.objects.get(Programme=Programme, Course=Course, Year=Year, Section=Section, Slot=Slot)
        staffmail = request.POST.get('Staff')
        subject = request.POST.get('Subject')
        subjtype = request.POST.get('Type')
        Subject.objects.create(Class=classroom, Staff=Staff.objects.get(Email=staffmail), Subject=subject, Type=subjtype)
        subjects = Subject.objects.filter(Class=classroom)
        return render(request, 'subjecteditor.html', {'form': SubjectEditorForm, 'message': 'Staff and Subject linked successfully', 'subjects': subjects, 'class': classroom})
    
class Period_Delete(LoginRequiredMixin, RedirectView):
    def get(self, request):
        Programme = request.GET.get('Programme')
        Course = request.GET.get('Course')
        Year = request.GET.get('Year')
        Section = str(request.GET.get('Section')).upper()
        Class_Obj = Class.objects.get(Programme=Programme, Course=Course, Year=Year, Section=Section)
        order = request.GET.get('Order')
        period = request.GET.get('Period')
        slot = request.GET.get('Slot')
        if (slot == 'A' and period == '7'):
            Period_dup_Obj = Period.objects.filter(Class=Class_Obj, Order=order, Period=1, Slot='B')
            Period_dup_Obj.delete()
        if (slot == 'B' and period == '1'):
            Period_dup_Obj = Period.objects.filter(Class=Class_Obj, Order=order, Period=7, Slot='A')
            Period_dup_Obj.delete()
        Period_Obj = Period.objects.filter(Class=Class_Obj, Order=order, Period=period, Slot=slot)
        Period_Obj.delete()
        url = f"{reverse('editor')}?Programme={Programme}&Course={Course}&Year={Year}&Section={Section}&Order={order}"
        return redirect(url)
    
class Change_DayOrder(LoginRequiredMixin, RedirectView):
    def post(self, request):
        do_obj = DayOrder.objects.filter(id=1)
        do_obj.update(
            Date = date.today(),
            Order = request.POST.get('Order')
        )
        return redirect('editor')