import redis


if __name__ == "__main__":
    r = redis.Redis(host='localhost', port=6379, db=1)
    keys = r.keys('*')
    print("Keys in Redis:", keys)

    key = 'q:9581b657f1997de5e05543e099889fe2'  # Replace with an actual key
    value = r.get(key)
    print(f"Value for {key}:", value)
