import requests
import time

URL = "http://localhost:3000/"

for i in range(1, 100):
    try:
        response = requests.get(URL)
        print(f"[{i}] Status: {response.status_code}")
    except Exception as e:
        print(f"[{i}] Erreur: {e}")

    time.sleep(0.1)  # 100 ms entre chaque requête
