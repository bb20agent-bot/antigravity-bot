import subprocess
import sys

dependencies = [
    "google-api-python-client",
    "google-auth-httplib2",
    "google-auth-oauthlib",
    "python-telegram-bot==20.8"
]

print("Starting installation...")
try:
    result = subprocess.run(
        [r"C:\antigravity-bot\.venv\Scripts\pip.exe", "install"] + dependencies,
        capture_output=True,
        text=True,
        check=True
    )
    print("STDOUT:", result.stdout)
    print("Installation Finished Successfully.")
except subprocess.CalledProcessError as e:
    print("ERROR installing packages.")
    print("STDOUT:", e.stdout)
    print("STDERR:", e.stderr)
