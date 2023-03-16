echo "Your project_id is: \c"
cat ../MMM-GoogleAssistant/credentials.json 2>/dev/null | grep -oP '(?<="project_id":")[^"]*' || {
  echo "credentials not found!"
}
echo "\n"
