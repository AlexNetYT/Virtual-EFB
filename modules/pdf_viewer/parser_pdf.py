from bs4 import BeautifulSoup
from urllib.parse import urljoin
from urllib.request import urlretrieve
import shutil
import socket
import json
import httpx
import os
import re


def download_pdfs(icao, download_folder_old, save: bool = False):
    icao = icao.lower()
    url = f"http://www.caiga.ru/common/AirInter/validaip/aip/ad/ad2/{icao}/"
    download_folder = str(download_folder_old) + f"\{icao.upper()}"
    # os.rmdir(download_folder)
    if not save:
        try:
            shutil.rmtree(download_folder)
        except:
            pass
    os.makedirs(download_folder, exist_ok=True)
    # Send a GET request to the URL
    socket.setdefaulttimeout(3)
    try:
        response = httpx.get(url, timeout=3)
    except:
        return download_pdfs(icao=icao, download_folder_old=download_folder_old, save=save)

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Parse the HTML content of the page
        soup = BeautifulSoup(response.content, 'html.parser')

        # Find all links in the page
        links = soup.find_all('a', href=True)

        # Filter links that end with '.pdf'
        pdf_links = [link['href']
                     for link in links if link['href'].lower().endswith('.pdf')]

        # Download each PDF
        for pdf_link in pdf_links:
            # Create absolute URL by joining the base URL and the relative PDF URL   157 165 166 170
            absolute_url = urljoin(url, pdf_link)

            # Extract the filename from the URL
            filename = os.path.join(
                download_folder, os.path.basename(absolute_url))
            if os.path.exists(filename):
                print("Excists file: " + filename)
            else:
                # Download the PDF
                try:
                    urlretrieve(absolute_url, filename)
                    print(f"Downloaded: {filename}")
                except Exception as e:
                    print(f"Not Downloaded: {filename}, ERROR: {e}")
        while not all(item in os.listdir(download_folder) for item in pdf_links):
            download_pdfs(
                icao=icao, download_folder_old=download_folder_old, save=True)
    else:
        print(
            f"Failed to retrieve the page. Status code: {response.status_code}")


def parse_string_to_dict(input_string):
    # Extracting information using regular expressions          146 149
    match = re.match(
        r"\((\d+)\)\s+(.*?)\s+-\s+ИКАО\.\s+([\w\s.]+)\.\s+ВПП\s+(.*?);", input_string)

    if match:
        # Extracting type from the second group
        type_match = re.match(r"(SID|STAR|FINAL|TAXI|AIRPORT)", match.group(2))
        type_value = type_match.group(1) if type_match else None

        # Extracting ctx based on the type
        ctx_value = ""
        if type_value == "FINAL":
            ctx_match = re.match(
                r"(ILS Z КАТ I|ILS Y КАТ I|GLS|RNP|ОПРС)", match.group(3))
            ctx_value = ctx_match.group(1) if ctx_match else ""
        elif type_value in ["SID", "STAR"]:
            ctx_value = "RNAV" if "RNAV" in match.group(3) else "NONRNAV"

        # Creating the dictionary
        result_dict = {
            'type': type_value,
            'ctx': ctx_value,
            'RWY': re.findall(r'(\d+[ЛЦП]?)', match.group(4))
        }
        return result_dict
    elif input_string.endswith("-txt.pdf"):
        result_dict = {
            'type': "TEXT",
            'ctx': "Данные, тексты, таблицы",
            'RWY': []
        }
    else:
        return None


def match(dir, icao: str):
    txt = open('output.txt', 'r').read()
    dct = {}
    for string in txt.split('\n'):
        if icao.lower() in string:

            filename = string.split(',')[0].split("/")[-1][:-1]
            if filename.endswith("-txt.pdf"):
                dct.update({filename: "Данные, Тексты, Таблицы"})
            else:
                text = " ".join(string.split(',')[1][1:][:-3].split(" ")[1:])
                dct.update({filename: text})

    return dct


def remove_txt(directory, icao):
    directory = directory + f"\\{icao}\\"
    for filename in os.listdir(directory):
        f = os.path.join(directory, filename)
        if filename.endswith(".txt"):
            os.remove(f)


def distribute(directory, icao):
    directory = directory + f"\\{icao.upper()}\\"
    with open('pdf_info.json', 'r') as file:
        pdf_info = json.load(file)
    for filename in os.listdir(directory):
        if "SID" in filename or "КАРТА ВЫЛЕТА ПО ПВП" in filename:
            pdf_info['pdfs'].append(
                {'filename': filename, 'airport': icao.upper(), 'tags': ['SID']})
        elif "STAR" in filename or "КАРТА ПРИБЫТИЯ ПО ПВП" in filename:
            pdf_info['pdfs'].append(
                {'filename': filename, 'airport': icao.upper(), 'tags': ['STAR']})
        elif "КАРТА ЗАХОДА НА ПОСАДКУ ПО ПРИБОРАМ" in filename:
            pdf_info['pdfs'].append(
                {'filename': filename, 'airport': icao.upper(), 'tags': ['FINAL']})
        elif "КАРТА АЭРОДРОМА" in filename or "КАРТА АЭРОДРОМНОГО НАЗЕМНОГО ДВИЖЕНИЯ" in filename:
            pdf_info['pdfs'].append(
                {'filename': filename, 'airport': icao.upper(), 'tags': ['AIRPORT']})
        else:
            pdf_info['pdfs'].append(
                {'filename': filename, 'airport': icao.upper(), 'tags': ['ETC']})
    with open('pdf_info.json', 'w') as file:
        file.write(json.dumps(pdf_info))


def collect_pdf(directory, icao, host, save=True):
    download_pdfs(icao.upper(), directory)
    dct = match(directory, icao)
    directory_new = directory + f"\\{icao.upper()}\\"
    for filename in os.listdir(directory_new):
        if filename in dct.keys() and dct[filename] != "":
            f = os.path.join(directory_new, filename)
            new: str = dct[filename].replace(r"/", "-").replace(".", "")
            original_name, file_extension = filename, ".pdf"
            serial_number = 1
            # Check if the file already exists in the directory
            while os.path.exists(os.path.join(directory_new, f"{new}_{serial_number}{file_extension}")):
                serial_number += 1

            # Construct the new file name with the serial number
            new_file_name = f"{new}_{serial_number}{file_extension}"

            new_path = os.path.join(directory_new, new_file_name)
            os.rename(f, new_path)
    distribute(directory=directory, icao=icao)
    
    return True

def download_all(directory, host):
    with open(directory+"\\output.txt", 'r') as file:
        txt = file.read()
        icaos = []
        for line in txt.split('\n'):
            if line.startswith('ItemLink("../aip/ad/ad2/'):
                line_slash = line.split("/")
                if line_slash[4] not in icaos:
                    icaos.append(line_slash[4])
        print(icaos)
        for icao in icaos:
            collect_pdf(directory=directory, icao=icao, host=host)