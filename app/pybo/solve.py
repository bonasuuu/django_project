from django.shortcuts import render

def problem_solve_view(request):
    return render(request, 'solve.html')
