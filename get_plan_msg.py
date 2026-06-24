import json
import sys

with open('C:/Users/Admin/.gemini/antigravity-ide/brain/8606e2c1-2c5a-418a-86c5-b3a24778229d/.system_generated/logs/transcript.jsonl', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for line in reversed(lines):
    try:
        data = json.loads(line)
        if data.get("type") == "USER_INPUT" and "Plan 1 Development Prompt" in data.get("content", ""):
            print(data["content"])
            sys.exit(0)
    except:
        pass
print("Not found")
