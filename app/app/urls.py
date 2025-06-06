"""
URL configuration for app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from pybo import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('solve/', views.solve_view),
    path('problem/', views.problem),
    path('notice/', views.notice),
    path('header/', views.header),
    path('', views.main_background),
    path("chatbot/", views.chatbot),
    path("blog/", views.blog),
    path("blog/<int:id>/", views.posting, name="posting"),
    path('blog/new_post/', views.new_post, name="postname"),
    path('blog/<int:id>/remove',views.remove_post, name="postname"),
    path("api/problem/<int:index>/", views.get_problem_case, name="get_problem_case"),
]
