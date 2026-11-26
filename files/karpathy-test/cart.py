# cart.py - tiny shop cart

def line_total(item):
    return item["price"] * item["qty"]


def total(items):
    t = 0
    for i in items:
        t = t + line_total(i)
    return round(t, 2)


def _old_tax(t):
    return t * 1.2
