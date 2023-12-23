import requests
import os, rich

def check_for_updates(owner, repo):
    api_url = f"https://api.github.com/repos/{owner}/{repo}/releases/latest"
    
    # Make a request to the GitHub API
    response = requests.get(api_url)
    
    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Parse the JSON response
        release_info = response.json()
        download_url = release_info["assets"][0]["browser_download_url"]
        # Get the latest release version
        latest_version = release_info["tag_name"]
        
    # You can implement a function to get the currently installed version
    # For simplicity, let's assume the version is stored in a file named "version.txt"
    version_file_path = os.path.join("version.txt")
    if os.path.exists(version_file_path):
        with open(version_file_path, "r") as version_file:
            version = version_file.read().strip()
            if version != latest_version:
                rich.print(f"[bold]:white_check_mark: Update avalible! New version: [chartreuse1]{latest_version}[/chartreuse1] Installed: [gold1]{version}[/gold1][/bold]")
                return [download_url, latest_version]
            else: 
                rich.print(f"[bold]:airplane_departure: App is updated to lastest version [chartreuse1]{latest_version}[/chartreuse1] Enjoy your session!:airplane_arriving:[/bold]")
                return None
    else:
        with open(version_file_path, "w") as version_file:
            version_file.write(latest_version)
            version_file.close()
        return [download_url, latest_version]
