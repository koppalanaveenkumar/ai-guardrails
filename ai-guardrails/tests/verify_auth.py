import requests

URL = "http://localhost:8000/api/v1/guard/"
VALID_KEY = "sk_local_dev_12345"
PAYLOAD = {
    "prompt": "Hello world",
    "config": {"detect_injection": False, "redact_pii": False}
}

def test_auth():
    print("Testing API Key Authentication...")

    # 1. Test Missing Key
    print("1. Request WITHOUT key...")
    res = requests.post(URL, json=PAYLOAD)
    if res.status_code == 403:
        print("✅ PASSED: Blocked (403)")
    else:
        print(f"❌ FAILED: Got {res.status_code}")

    # 2. Test Invalid Key
    print("2. Request with INVALID key...")
    res = requests.post(URL, json=PAYLOAD, headers={"x-api-key": "wrong_key"})
    if res.status_code == 403:
        print("✅ PASSED: Blocked (403)")
    else:
        print(f"❌ FAILED: Got {res.status_code}")

    # 3. Test Valid Key
    print("3. Request with VALID key...")
    res = requests.post(URL, json=PAYLOAD, headers={"x-api-key": VALID_KEY})
    if res.status_code == 200:
        print("✅ PASSED: Allowed (200)")
    else:
        print(f"❌ FAILED: Got {res.status_code}")
        print(res.text)

if __name__ == "__main__":
    test_auth()
