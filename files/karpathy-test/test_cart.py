from cart import total


def test_total():
    items = [{"price": 2.50, "qty": 2}, {"price": 1.00, "qty": 3}]
    assert total(items) == 8.00


if __name__ == "__main__":
    test_total()
    print("ok")
