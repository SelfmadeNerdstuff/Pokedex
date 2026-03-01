# 🔴 Pokédex Project

Ein moderner, responsiver Pokédex für die originalen 151 Kanto-Pokémon, erstellt mit Vanilla JavaScript, HTML5 und CSS3. Das Projekt nutzt die offizielle [PokéAPI](https://pokeapi.co/), um Daten dynamisch abzurufen und darzustellen.

## 🎓 Über dieses Projekt

Dieses Projekt entstand im Rahmen meiner Weiterbildung zum Frontend-Entwickler bei der **Developer Akademie**. Es ist ein wichtiger Meilenstein auf meiner aktuellen Lernreise und zeigt meinen praktischen Entwicklungsstand im Umgang mit APIs, asynchronem JavaScript und responsivem Webdesign. Dies ist eines von vielen Projekten auf meinem Weg in die professionelle Webentwicklung – Work in Progress! 🚀

## ✨ Features

* **Lazy-Loading & Performance:** Es werden zunächst nur 20 Pokémon geladen. Weitere können über einen Button nachgeladen werden ("Fetch-then-Render").
* **Smart Caching:** Bereits abgerufene API-Daten werden lokal zwischengespeichert, um unnötige Netzwerk-Requests zu vermeiden und die Ladezeiten drastisch zu verkürzen.
* **Erweiterte Suchfunktion:** Die Live-Suche unterstützt englische Namen, **deutsche Namen** (über ein lokales Wörterbuch) und die direkte Suche nach der Pokédex-ID.
* **Multi-Typ-Filter:** Pokémon können nach einem oder mehreren Typen gleichzeitig gefiltert werden.
* **Detail-Overlay:** Ein interaktives Overlay präsentiert tiefergehende Informationen:
  * Basis-Werte (Stats) mit animierten Fortschrittsbalken
  * Die stärksten Level-Up Attacken
  * Fähigkeiten inkl. offizieller englischer Beschreibung
  * Shiny-Sprites
* **Responsive Design:** Komplett optimiert für alle Bildschirmgrößen (von 1440px Desktop bis 320px Mobile).

## 🛠️ Technologien

* **HTML5**
* **CSS3** (CSS Variables, Flexbox, CSS Grid)
* **Vanilla JavaScript** (ES6+, Async/Await, Fetch API)
* **PokéAPI** (RESTful API)

## 🚀 Installation & Start
Da das Projekt reines Vanilla JavaScript nutzt, sind keine Build-Tools oder Node.js erforderlich.

Das Repository klonen oder als ZIP herunterladen.

Die Datei index.html in einem modernen Webbrowser öffnen.

## 📁 Projektstruktur

Um den Code sauber und wartbar zu halten, ist das Projekt nach Best Practices strukturiert:

```text
/
├── /css
│    ├── style.css       # Hauptstyling & Grid
│    └── overlay.css     # Styling für die Detailansicht
├── /img                 # Lokale Icons, Bilder und Favicon
├── /js
│    ├── api.js          # API-Aufrufe, Caching & Lade-Logik
│    ├── filter.js       # Logik für die Typen-Filterung
│    ├── search.js       # Such-Algorithmus (inkl. DE/EN Übersetzung)
│    ├── overlay.js      # Overlay-Navigation und Datenaufbereitung
│    └── script.js       # HTML-Templates und UI-Hilfsfunktionen
└── index.html           # Struktur der Hauptseite



Den Pokédex erkunden!

Coded with 💡 by Ruslan – Meilenstein-Projekt bei der Developer Akademie.
