import ast
from django import template

register = template.Library()

@register.filter
def remove_quotes(value):
    return value.replace('"', '').replace('[', '').replace(']', '')

@register.filter
def parse_and_br(value):
    try:
        # 문자열을 리스트로 파싱
        lines = ast.literal_eval(value)
        # 각 줄에서 \n 제거 + <br>로 연결
        return '<br>'.join(line.strip() for line in lines)
    except Exception as e:
        return value  # 문제가 생기면 원래 값 그대로
