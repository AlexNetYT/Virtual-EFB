import pystray
from PIL import Image
import win32api
import webbrowser
image = Image.open("./static/favicon.png")
global host_a
global runned
runned = False
host_a = "127.0.0.1"


def after_click(icon, query):
    global host_a
    host = host_a
    if str(query) == "Open Webpage":
        webbrowser.open(f"http://{host}:5000")
    elif str(query) == "Show Address":
        win32api.MessageBox(0, f'Running on {host}:5000', 'IP Address')
    elif str(query) == "Exit":
        icon.stop()


def start(host):
    global host_a
    global runned
    host = host
    if not runned:
        icon = pystray.Icon("Charts Server", image, "Charts Server",
                            menu=pystray.Menu(
                                pystray.MenuItem("Open Webpage",
                                                 after_click),
                                pystray.MenuItem("Show Address",
                                                 after_click),
                                pystray.MenuItem("Exit", after_click)))
        icon.run()
    runned = True
