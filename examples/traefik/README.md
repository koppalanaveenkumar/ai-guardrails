# Traefik Middleware Integration

This example demonstrates how to use **AI Guardrails** as a security middleware for **Traefik**.

## Architecture
Traefik sits at the edge. When a user requests your App (e.g., `my-llm-app`), Traefik validates the request with **AI Guardrails** first.

1.  **Request** -> Traefik
2.  Traefik -> **AI Guardrails** (ForwardAuth)
3.  If Guardrails says `200 OK`: -> **My App**
4.  If Guardrails says `403 Forbidden`: -> Block Request

## How to Run

1.  **Start the Stack:**
    ```bash
    docker-compose up --build
    ```

2.  **Test Access (Should be Blocked without Key):**
    ```bash
    curl http://localhost/
    # Result: 403 Forbidden
    ```

3.  **Test Access (With Valid Key):**
    ```bash
    curl -H "x-api-key: YOUR_VALID_KEY" http://localhost/
    # Result: 200 OK (Response from My App)
    ```

## Configuration
Access the Traefik Dashboard at [http://localhost:8080](http://localhost:8080).
