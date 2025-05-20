from django.shortcuts import render
from django.http import JsonResponse
from .models import Problem

def index(request):
    question_list = Problem.objects.all().order_by('index')
    return render(request, 'index.html', {'question_list': question_list})

def ex_list(request):
    question_list = Problem.objects.all().order_by('index')
    return render(request, 'ex_list.html', {'question_list': question_list})

def header(request):
    return render(request, 'header.html')

def main(request):
    return render(request, 'main.html')
def main_background(request):
    content_template = 'ex_list.html'  # 기본 템플릿 설정
    question_list = Problem.objects.all().order_by('index')
    return render(request, 'main_background.html', {
        'content_template': content_template,
        'question_list': question_list
    })
    
def solve_view(request):
    problem_index = request.GET.get('problem_index')
    problem = None
    if problem_index:
        try:
            problem = Problem.objects.get(index=problem_index)
        except Problem.DoesNotExist:
            problem = None
    return render(request, 'solve.html', {'problem': problem})

def problem(request):
    # question_list = Problem.objects.all().order_by('index') 
    return render(request, 'problem.html')

def notice(request):
    return render(request, 'notice.html')
