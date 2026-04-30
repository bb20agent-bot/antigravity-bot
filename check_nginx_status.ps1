$ErrorActionPreference = "Stop"
$remoteCommand = "sudo systemctl status nginx --no-pager ; sudo nginx -t"
gcloud compute ssh vora-brain-server --zone=asia-southeast1-a --project=vora-youtube-n8n --command=$remoteCommand
