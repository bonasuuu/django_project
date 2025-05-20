from django.db import models

def default_testcase():
    return [{"input": "", "output": ""}]


class Problem(models.Model):
    index = models.AutoField(primary_key=True)  # ID 역할
    title = models.CharField(max_length=200, default='제목없음')    # 제목
    difficulty = models.CharField(max_length=20, default='하')  # 난이도
    problem = models.TextField(default='문제')                # 문제 내용
    testCase = models.JSONField(default=default_testcase)        # 테스트케이스


    def __str__(self):
        return f'{self.index}: {self.title} - {self.difficulty}'