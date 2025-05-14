from django.db import models

class Problem(models.Model):
    index = models.IntegerField()
    problem = models.TextField()
    answer = models.TextField()

    def __str__(self):
        return f'{self.index}: {self.problem[:30]}...'