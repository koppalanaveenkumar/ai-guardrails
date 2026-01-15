import requests
import time

URL = "http://localhost:8000/api/v1/guard/"
PAYLOAD = {
    "prompt": "Hello world",
    "config": {"detect_injection": False, "redact_pii": False}
}

def test_rate_limit():
    print("Testing Rate Limit (Limit: 5/minute)...")
    
    for i in range(1, 7):
        response = requests.post(URL, json=PAYLOAD)
        if response.status_code == 200:
            print(f"Request {i}: ✅ Passed (200 OK)")
        elif response.status_code == 429:
            print(f"Request {i}: 🛑 Blocked (429 Too Many Requests)")
            return
        else:
            print(f"Request {i}: ⚠️ Unexpected Code ({response.status_code})")
            print(response.text)
        
        # Don't hammer it too fast to avoid network glitches, but fast enough to hit limit
        time.sleep(0.1)

    print("❌ FAILED: Did not hit rate limit after 6 requests.")

if __name__ == "__main__":
    test_rate_limit()
