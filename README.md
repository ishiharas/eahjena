# EAH Jena Stundenplan-App
Diese App ist mithilfe des Nativescript Frameworks realisiert worden. Als Sprache wird Typescript genutzt. Zusätzlich wurde das Angular Framework eingebunden, um sich bekannter Werkzeuge bedienen zu können.
Dadurch ist diese App sowohl unter Android, als auch unter iOS nutzbar.



## Vorschau
Folgende Vorschau zeigt bisher implementierte Funktionalitäten (im iOS Simulator):

<img src="https://github.com/ishiharas/eahjena/blob/master/preview.gif?raw=true" width="354"/>

## Funktionalitäten
Implementiert sind aktuell folgende Komponenten:
* Home
  * Zeigt die heutigen Stundenplan-Veranstaltungen und Mensapläne
* Stundenplan
  * Zeigt den eingestellten Stundenplan und die durch den Nutzer zusätzlich gespeicherten Studienmodule aus anderen Studiengängen und Sets
  * Erlaubt Zugriff auf Oberfläche zum editieren des Stundenplans
* Speiseplan
  * Zeigt Speisepläne, zugehörige Preise und angegebene Inhaltsstoffe der Speisen
  * Zugriff auf verschiedene Kantinen in Jena
* News
  * Aktuelle Pressemitteilungen der EAH Jena
* Wetter
  * Übersicht der Echtzeit-Wetterdaten der Klimastation Ernst-Abbe-Hochschule



## Download Android App
Unter folgendem Link kann ein aktueller Build der Android .apk runter geladen werden.
Bitte beachten Sie, dass es sich dabei um ein Beta Version handelt.
* <summary><a href="https://github.com/ishiharas/eahjena/releases/latest">Latest Release</a></summary>


## Nativescript
Was Nativescript ist und wie damit native Apps realisiert werden können, kann unter folgendem Link nachgelesen werden:
https://docs.nativescript.org/core-concepts/android-runtime/overview

Wie Nativescript unter Windows oder OSX gebaut werden kann und was dafür installiert werden muss, kann hier nachgelesen werden:
https://docs.nativescript.org/start/quick-setup#full-setup

Der Punkt "Advanced Setup" listet alle Dependencies auf, die zum bauen von Nativescript Projekten benötigt werden. 
Alternativ kann auch einfach das Script vom Link ausgeführt werden, welches sämtliche Dependencies (Android SDK, JDK, Google Repo, Android Studio und weitere) automatisch installiert.

Wenn das generelle Setup erledigt ist, können alle Libraries, die von der EAH-Jena App benötigt werden mit folgendem Befehl installiert werden:

```
cd eahjena
npm install
```

Folgender Befehl baut die App im Android Emulator, iOS Simulator oder dem angeschlossenen Gerät:

```
tns run android
tns run ios
```

## Generelle Ordnerstruktur
Unter dem Pfad "src/app/" können sämtliche Views der App eingesehen werden. Die Logik des Frontends spielt sich dort innerhalb der *.component.ts - Datei ab. Layout und Design sind in der .css und .html zu finden. 

Die Datei app.component.ts und app.component.html beinhalten den nativen SideDrawer, der sämtliche Views "umspannt". 

Service Logik, also sämtliche Kommunikation mit dem Backend, Festlegen des Datenmodels und lokales Speichern der bearbeiteten Stundenpläne des Nutzers sind im Ordner "src/app/shared/service" zu finden. Einzelne Konfigurations-Varablen liegen direkt im Parent-Ordner.