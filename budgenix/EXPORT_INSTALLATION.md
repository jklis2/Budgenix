# Instalacja bibliotek do eksportu raportów

Aby wszystkie funkcje eksportu działały poprawnie, należy zainstalować dodatkowe biblioteki.

## Wymagane biblioteki

### 1. jsPDF - do eksportu PDF
```bash
npm install jspdf jspdf-autotable
```

### 2. html2canvas - do eksportu PNG
```bash
npm install html2canvas
```

## Instalacja wszystkich na raz

```bash
npm install jspdf jspdf-autotable html2canvas
```

## Biblioteki już zainstalowane

- ✅ **xlsx** - do eksportu Excel i CSV (już zainstalowane)

## Funkcje eksportu

Po instalacji będą działać następujące funkcje:

1. **Export PDF** - Generuje profesjonalny dokument PDF z:
   - Kolorowym nagłówkiem brandingowym
   - Profesjonalnymi tabelami (jspdf-autotable)
   - Pełnym wsparciem polskich znaków (czcionka courier)
   - Podsumowaniem finansowym
   - Trendami czasowymi w tabeli
   - Kategoriami wydatków
   - Porównaniem budżetu z kolorowym oznaczeniem różnic
   - Stopką ze stronicowaniem i datą

2. **Export Excel** - Tworzy arkusz kalkulacyjny z wieloma zakładkami:
   - Arkusz "Podsumowanie"
   - Arkusz "Trendy czasowe"
   - Arkusz "Kategorie"
   - Arkusz "Budżet"

3. **Export CSV** - Eksportuje surowe dane w formacie tekstowym

4. **Export PNG** - Tworzy zrzut ekranu całej strony raportów

## Pliki

- `src/lib/exportReports.ts` - Wszystkie funkcje eksportu
- Używa dynamicznych importów, więc biblioteki ładują się tylko gdy są potrzebne

## Wykorzystanie

Funkcje są automatycznie podłączone do przycisków eksportu w `/dashboard/reports-and-analytics`.

Jeśli biblioteki nie są zainstalowane, użytkownik zobaczy komunikat z prośbą o instalację.
