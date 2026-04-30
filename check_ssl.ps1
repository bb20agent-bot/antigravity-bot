$ErrorActionPreference = "Stop"
Write-Host "Checking SSL certificates..." -ForegroundColor Yellow
$remoteCommand = "sudo ls -l /etc/letsencrypt/live/ || echo 'No letsencrypt folder'"
gcloud compute ssh vora-brain-server --zone=asia-southeast1-a --project=vora-youtube-n8n --command=$remoteCommand
