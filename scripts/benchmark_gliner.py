import time
import psutil
import os
import sys

def get_memory_usage():
    process = psutil.Process(os.getpid())
    return process.memory_info().rss / 1024 / 1024  # Convert to MB

print(f"Initial Memory: {get_memory_usage():.2f} MB")

try:
    print("Installing/Loading GLiNER...")
    from gliner import GLiNER
except ImportError:
    print("GLiNER not installed. Please run: pip install gliner")
    sys.exit(1)

start_mem = get_memory_usage()
print(f"Memory before loading model: {start_mem:.2f} MB")

# Load the small model (optimized for CPU)
model_name = "urchade/gliner_small-v2.1"
print(f"Loading model: {model_name}...")
model = GLiNER.from_pretrained(model_name)

end_mem = get_memory_usage()
print(f"Memory after loading model: {end_mem:.2f} MB")
print(f"** Total Model Cost: {end_mem - start_mem:.2f} MB **")

# Run a warm-up prediction
text = "I am meeting with Apple to discuss the merger."
labels = ["person", "organization", "location", "email", "phone number"]
print(f"\nRunning prediction on: '{text}'")
start_time = time.time()
entities = model.predict_entities(text, labels)
latency = (time.time() - start_time) * 1000

print(f"Prediction Latency: {latency:.2f} ms")
print("Entities found:", entities)

final_mem = get_memory_usage()
print(f"Final Memory: {final_mem:.2f} MB")
