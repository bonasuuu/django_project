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

def main_background(request):
    content_template = 'ex_list.html'  # 기본 템플릿 설정
    question_list = Problem.objects.all().order_by('index')
    return render(request, 'main_background.html', {
        'content_template': content_template,
        'question_list': question_list
    })
    