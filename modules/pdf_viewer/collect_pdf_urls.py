from bs4 import BeautifulSoup
from urllib.parse import urljoin
from urllib.request import urlretrieve
import shutil
import socket
import json
import httpx
import os
import re


def download_pdfs(icao, save: bool = False):
    
    icao = icao.lower()
    url = f"http://www.caiga.ru/common/AirInter/validaip/aip/ad/ad2/{icao}/"
    socket.setdefaulttimeout(3)
    try:
        response = httpx.get(url, timeout=3)
    except:
        response = httpx.get(url, timeout=10)

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        txt = []
        
        for string in txt:
            if string['icao'] == icao.upper():
                txt.remove(txt[txt.index(string)])
        soup = BeautifulSoup(response.content, 'html.parser')

        # Find all links in the page
        links = soup.find_all('a', href=True)

        # Filter links that end with '.pdf'
        pdf_links = [link['href']
                     for link in links if link['href'].lower().endswith('.pdf')]

        # Download each PDF
        for pdf_link in pdf_links:
            absolute_url = urljoin(url, pdf_link)
            try:
                    txt.append({
                        "link": absolute_url,
                        "filename": absolute_url.split("/")[-1],
                        "icao": icao.upper(),
                        "name": ""
                    })
                
                    
            except Exception as e:
                pass
        return txt
    else:
        print(
            f"Failed to retrieve the page. Status code: {response.status_code}")


def get_names():
    url = f"http://www.caiga.ru/common/AirInter/validaip/html/menurus.htm"
    response = httpx.get(url, timeout=3)
    return response.text
def match(icao: str):
    txt = get_names()
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

def distribute(links):
    pdf_info = {"pdfs": []}
    
    for file in links:
        
        filename = file['name']
        if "SID" in filename or "КАРТА ВЫЛЕТА ПО ПВП" in filename:
            pdf_info['pdfs'].append(
                {'filename': filename, "link": file['link'], 'airport': file['icao'], 'tags': ['DEP']})
        elif "STAR" in filename or "КАРТА ПРИБЫТИЯ ПО ПВП" in filename:
            pdf_info['pdfs'].append(
                {'filename': filename, "link": file['link'], 'airport': file['icao'], 'tags': ['ARR']})
        elif "КАРТА ЗАХОДА НА ПОСАДКУ ПО ПРИБОРАМ" in filename:
            pdf_info['pdfs'].append(
                {'filename': filename, "link": file['link'], 'airport': file['icao'], 'tags': ['FINAL']})
        elif "КАРТА АЭРОДРОМА" in filename or "КАРТА АЭРОДРОМНОГО НАЗЕМНОГО ДВИЖЕНИЯ" in filename:
            pdf_info['pdfs'].append(
                {'filename': filename, "link": file['link'], 'airport': file['icao'], 'tags': ['AIRPORT']})
        else:
            pdf_info['pdfs'].append(
                {'filename': filename, "link": file['link'], 'airport': file['icao'], 'tags': ['ETC']})
    return pdf_info

def collect_pdf(icao):
    pdf_info = download_pdfs(icao.upper())
    dct = match(icao)
    if pdf_info is not None:
        for fn in pdf_info:
            filename = fn['filename']
            if filename in dct.keys() and dct[filename] != "":
                new = dct[filename]
                new_file_name = f"{new}"
                pdf_info[int(list(pdf_info).index(fn))]['name'] = new_file_name
    else: return "Error"
    return json.dumps(distribute(links=pdf_info))