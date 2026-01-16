import os
import httpx
from app.core.logging_config import logger

class NotificationService:
    def __init__(self):
        self.webhook_url = os.getenv("WEBHOOK_URL")

    async def send_alert(self, reason: str, score: float = 0.0, details: str = None):
        """
        Sends an alert to the configured Webhook (Slack/Discord compatible).
        """
        if not self.webhook_url:
            return

        # Format message
        message = f"🚨 **GUARDRAILS ALERT** 🚨\n**Reason:** {reason}\n**Score:** {score:.2f}"
        if details:
            message += f"\n**Details:** {details}"

        # Dual payload for Discord (content) and Slack (text)
        payload = {
            "content": message, # Discord
            "text": message     # Slack
        }

        try:
            async with httpx.AsyncClient() as client:
                await client.post(self.webhook_url, json=payload, timeout=5.0)
                logger.info(f"🔔 Alert sent to webhook: {reason}")
        except Exception as e:
            logger.error(f"❌ Failed to send webhook alert: {e}")

# Singleton
notification_service = NotificationService()
