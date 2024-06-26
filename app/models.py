from django.db import models
from django.contrib.auth.models import AbstractUser

# Choice Fields
programmes = [
    ['BA', 'BA'],
    ['BCA', 'BCA'],
    ['BCom', 'BCom'],
    ['BEd', 'BEd'],
    ['BS', 'BS'],
    ['BSc', 'BSc'],
    ['Certificate', 'Certificate'],
    ['Diploma', 'Diploma'],
    ['MA', 'MA'],
    ['MCA', 'MCA'],
    ['MCom', 'MCom'],
    ['MSc', 'MSc'],
    ['MSW', 'MSW'],
    ['PG Diploma', 'PG Diploma'],
    ['PhD', 'PhD'],
]
courses = [
    ['English', 'English'],
    ['Journalism and Mass Communication', 'Journalism and Mass Communication'],
    ['Computer Applications', 'Computer Applications'],
    ['Data Science', 'Data Science'],
    ['Accounting & Finance', 'Accounting & Finance'],
    ['Commerce', 'Commerce'],
    ['Corporate Secretaryship', 'Corporate Secretaryship'],
    ['Finance and Taxation', 'Finance and Taxation'],
    ['Information System and Management', 'Information System and Management'],
    ['Professional Accounting', 'Professional Accounting'],
    ['Banking, Financial Services, and Insurance', 'Banking, Financial Services, and Insurance'],
    ['International Accounting & Finance', 'International Accounting & Finance'],
    ['Biological Science', 'Biological Science'],
    ['Commerce & Accounting', 'Commerce & Accounting'],
    ['Computer Science', 'Computer Science'],
    ['Economics', 'Economics'],
    ['Mathematics', 'Mathematics'],
    ['Physical Science', 'Physical Science'],
    ['Social Science', 'Social Science'],
    ['Tamil', 'Tamil'],
    ['Chemistry', 'Chemistry'],
    ['Hotel & Catering Management', 'Hotel & Catering Management'],
    ['Biotechnology', 'Biotechnology'],
    ['Computer Science Specialization in Cyber Security', 'Computer Science Specialization in Cyber Security'],
    ['Defence and Strategic Studies', 'Defence and Strategic Studies'],
    ['Fashion Designing', 'Fashion Designing'],
    ['Physical Education, Health Education and Sports', 'Physical Education, Health Education and Sports'],
    ['Psychology', 'Psychology'],
    ['Statistics', 'Statistics'],
    ['Visual Communication', 'Visual Communication'],
    ['Basic French', 'Basic French'],
    ['Certified Financial Management', 'Certified Financial Management'],
    ['Counter-Terrorism', 'Counter-Terrorism'],
    ['Financial Management', 'Financial Management'],
    ['Fire Fighting and Fire Safety', 'Fire Fighting and Fire Safety'],
    ['First Aid and Safety Management', 'First Aid and Safety Management'],
    ['Hotel Management and Catering Science', 'Hotel Management and Catering Science'],
    ['Yoga', 'Yoga'],
    ['Applied Data Science', 'Applied Data Science'],
    ['Organic Chemistry', 'Organic Chemistry'],
    ['Disaster Management', 'Disaster Management'],
    ['Master of Social Work', 'Master of Social Work'],
    ['Culinary Arts', 'Culinary Arts'],
]
years = [
    ['I', 'I'],
    ['II', 'II'],
    ['III', 'III']
]
orders = [
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
    [5, 5],
]
subject_types = [
    ["Major", "Major"],
    ["Elective", "Elective"],
]
status = [
    ['PRESENT', 'PRESENT'],
    ['ABSENT', 'ABSENT']
]
slots = [
    ['A', 'A'],
    ['B', 'B']
]

# Staff Model
class StaffUser(AbstractUser):
    Status = models.CharField(max_length=7, choices=status)

# Models

class Class(models.Model):
    Programme = models.CharField(max_length=11, choices=programmes)
    Course = models.CharField(max_length=55, choices=courses)
    Year = models.CharField(max_length=3, choices=years, null=True, blank=True)
    Section = models.CharField(max_length=2, null=True, blank=True)
    Slot = models.CharField(max_length=1, choices=slots, null=True, blank=True)
    def __str__(self):
        return f"{self.Year} { self.Programme } { self.Course } - {self.Section}"

class Staff(models.Model):
    Name = models.CharField(max_length=55)
    Email = models.EmailField()
    EmpID = models.CharField(max_length=10)
    Department = models.CharField(max_length=75)
    # Phone Number
    def __str__(self):
        return f"{self.Name} ({self.Email})"

class Subject(models.Model):
    Class = models.ForeignKey(Class, on_delete=models.CASCADE)
    Subject = models.CharField(max_length=55)
    # Subject Code
    Staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    Type = models.CharField(max_length=8, choices=subject_types)
    def __str__(self):
        if self.Type == "Elective":
            return f"{self.Class} - {self.Subject} (Elective)"
        return f"{self.Class} - {self.Subject}"
    
class Classroom(models.Model):
    RoomNo = models.CharField(max_length=15)
    Capacity = models.IntegerField()
    def __str__(self) -> str:
        return self.RoomNo

class Period(models.Model):
    Class = models.ForeignKey(Class, on_delete=models.CASCADE)
    Order = models.IntegerField(choices=orders)
    Subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    Staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    Slot = models.CharField(max_length=1, choices=slots)
    Period = models.IntegerField()
    ClassRoom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    def __str__(self):
        return f"Slot {self.Slot} Day Order {self.Order}: {self.Subject}"


# Day Order Model 
class DayOrder(models.Model):
    Date = models.DateField()
    Order = models.IntegerField(choices=orders)