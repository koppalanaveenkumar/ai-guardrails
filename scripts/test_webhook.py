import asyncio
import os
import sys
from dotenv import load_dotenv

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load env BEFORE importing app
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env'))

from app.services.notification_service import notification_service

async def main():
    webhook_url = os.getenv("WEBHOOK_URL")
    print(f"Testing Webhook URL: {webhook_url[:10]}... (masked)")
    
    if not webhook_url:
        print("❌ WEBHOOK_URL not found in .env!")
        return

    print("Sending test alert...")
    await notification_service.send_alert(
        reason="Test Alert from CLI",
        score=0.99,
        details="If you see this, Webhooks are working! 🚀"
    )
    print("✅ Alert sent (check your Discord/Slack channel).")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
