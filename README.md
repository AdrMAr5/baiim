# __Przygotowanie Środowiska__
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**

Docker to platforma do tworzenia, uruchamiania i zarządzania kontenerami oprogramowania. Kontenery to lekkie, samodzielne jednostki oprogramowania, które zawierają wszystko, czego potrzeba do uruchomienia aplikacji, w tym kod, biblioteki, zależności i pliki konfiguracyjne.

- **[John the Ripper](https://www.openwall.com/john/) | [Hashcat](https://hashcat.net/hashcat/)**

<br><br>

# __Hash od Serwera__

Jest to luka utworzona poprzez zwykły ludzki błąd przy projektowaniu systemu logowania. Serwer zamiast sprawdzać prawidłowość hasła u siebie to sprawdza po stronie klienta, przez co atakujący w łatwy sposób może wykorzystać te informacje by złamać hasło.

## **Zaczynamy**:

	@@ -22,13 +22,13 @@ Jest to luka utworzona poprzez zwykły ludzki błąd przy projektowaniu systemu
    docker compose up
    ```
## **Zadanie 1**
Zdobądź hash hasła do użytkownika admin, a następnie złam za pomocą dowolnego narzędzia. Zauważ, że przy próbie logowania na konto danego uzytkowika serwer zwraca ci hash jego hasła. Spróbuj go podglądnąć przy pomocy Burpa czy też innych narzędzi.

<details>
<summary>Rozwązanie</summary>
<br>

Wysyłamy zapytanie z formularza logowania do użytkownika `admin` za pomocą **Burpa** a nastepnie odczytujemy hash hasła z odpowiedzi uzyskanej od serwera.

Uzyskanie hasło próbujemy złamać przy pomocy hashcata

	@@ -40,12 +40,12 @@ hashcat -m 1800 -a3 password ?u?u?u?u

Opcja "-m 1800" wskazuje na rodzaj szyfrowania hasła (rodzaj hashu), a w tym przypadku jest to rodzaj hashu SHA-512(Unix). Opcja "-a 3" oznacza, że hashcat będzie używał metody brute-force (przeprowadzenie próby złamania hasła poprzez wypróbowanie wszystkich możliwych kombinacji).

password to plik w którym przechowujemy hash, który będzie przez nas łamany.

Jeśli chodzi o ciąg znaków "?u?u?u?u", to jest to szablon, który określa, jakie hasło będzie szukane [link](https://hashcat.net/wiki/doku.php?id=mask_attack).
?u = ABCDEFGHIJKLMNOPQRSTUVWXYZ

Czyli hashcat dla argunetu "?u?u?u?u" wygeneruje wszytskie 4 znakowe możliwości liter "ABCDEFGHIJKLMNOPQRSTUVWXYZ".

Po złamaniu hasła logujemy się na serwer

	@@ -59,7 +59,7 @@ Po złamaniu hasła logujemy się na serwer

Path Traversal to poważna luka w zabezpieczeniach, która może być wykorzystywana przez hakerów do uzyskania nieautoryzowanego dostępu do systemu lub do wykonania nieautoryzowanych poleceń na zdalnym komputerze.

**<u>Podana luka została znaleziona w serwerze Apache 2.4.49 oraz 2.4.50 i nazwana [CVE-2021-41773](https://nvd.nist.gov/vuln/detail/CVE-2021-41773) & [CVE-2021-42013](https://nvd.nist.gov/vuln/detail/CVE-2021-42013)</u>**

**Apache** to darmowe, otwartoźródłowe i wieloplatformowe oprogramowanie serwera WWW wydane na licencji Apache License 2.0. Oprogramowanie jest utrzymywane i rozwijane przez organizację non profit Apache Software Foundation.

	@@ -87,18 +87,18 @@ docker run -p 8090:80 -p 22:22 gekonisko/path-traversal

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
	@@ -140,7 +140,7 @@ hashcat -m 1800 -a3 password ?u?u?u

Opcja "-m 1800" wskazuje na rodzaj szyfrowania hasła (rodzaj hashu), a w tym przypadku jest to rodzaj hashu SHA-512(Unix). Opcja "-a 3" oznacza, że hashcat będzie używał metody brute-force (przeprowadzenie próby złamania hasła poprzez wypróbowanie wszystkich możliwych kombinacji).

password to plik w którym przechowujemy hash, który będzie przez nas łamany

Jeśli chodzi o ciąg znaków "?u?u?u", to jest to szablon, który określa, jakie hasło będzie szukane [link](https://hashcat.net/wiki/doku.php?id=mask_attack).
?u = ABCDEFGHIJKLMNOPQRSTUVWXYZ
