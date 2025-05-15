from django.shortcuts import render
from .models import Problem

def index(request):
    question_list = Problem.objects.all().order_by('index')
    return render(request, 'main.html', {'question_list': question_list})