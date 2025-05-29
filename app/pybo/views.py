import json
from django.shortcuts import redirect, render
from .models import Problem
from .models import Post
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@csrf_exempt
def chatbot(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_message = data.get("message", "")

            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": user_message}]
            )

            bot_reply = response.choices[0].message.content.strip()
            return JsonResponse({"message": bot_reply})

        except Exception as e:
            print("❌ 예외 발생:", e)
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


def index(request):
    question_list = Problem.objects.all().order_by('index')
    return render(request, 'main.html', {'question_list': question_list})

def ex_list(request):
    question_list = Problem.objects.all().order_by('index')
    return render(request, 'ex_list.html', {'question_list': question_list})

def header(request):
    return render(request, 'header.html')

def main_background(request):
    content_template = 'main.html'  # 기본 템플릿 설정
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
  
def get_problem_case(request, index):
    try:
        problem = Problem.objects.get(index=index)
        return JsonResponse({
            "title": problem.title,
            "difficulty": problem.difficulty,
            "testCase": problem.testCase,  # ✅ 필드 이름 반드시 testCase
        })
    except Problem.DoesNotExist:
        return JsonResponse({"error": "문제를 찾을 수 없습니다."})
      
def problem(request):
    question_list = Problem.objects.all().order_by('index')
    return render(request, 'problem.html', {'question_list': question_list})

def notice(request):
    return render(request, 'notice.html')

def blog(request):
    # 모든 Post를 가져와 postlist에 저장합니다
    postlist = Post.objects.all()
    # blog.html 페이지를 열 때, 모든 Post인 postlist도 같이 가져옵니다 
    return render(request, 'blog.html', {'postlist':postlist})

def posting(request, id):
    post = Post.objects.get(id=id)
    return render(request, 'posting.html', {'post':post})

def new_post(request):
    if request.method == 'POST':
        postname = request.POST.get('postname', '')  # 안전하게 꺼냄
        contents = request.POST.get('contents', '')
        if postname and contents:
            Post.objects.create(postname=postname, contents=contents)
            return redirect('/blog/')
        return render(request, 'blog.html')
    else:
        return render(request, 'new_post.html')
    
def remove_post(request, id):
    if request.method != 'POST':
        return redirect('/blog/')
    
    post = Post.objects.get(id=id)
    post.delete()
    return redirect('/blog/')