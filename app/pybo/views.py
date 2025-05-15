from django.shortcuts import render
from .models import Problem

def index(request):
    question_list = Problem.objects.all().order_by('index')
    return render(request, 'index.html', {'question_list': question_list})

def ex_list(request):
    question_list = Problem.objects.all().order_by('index')
    return render(request, 'ex_list.html', {'question_list': question_list})

def header(request):
    return render(request, 'header.html')
