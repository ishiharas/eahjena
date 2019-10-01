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

Wenn das generelle Setup erledigt ist (siehe Bachelorarbeit: Projektaufbau), können alle Libraries, die von der EAH-Jena App benötigt werden mit folgendem Befehl installiert werden:

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
Unter dem Pfad "eahjena/src/app/" können sämtliche Views der App eingesehen werden. 
Unter dem Pfad "eahjena/app_resources" liegen sämtliche Bilder, wie Splashscreens, Logos etc, die für Android und iOS benötigt werden

Dabei stellen die ganzen Unterordner jeweils eine Ansicht dar, die durch den Studenten implementiert worden ist. 
Folgende Kurzbeschreibung gibt eine Übersicht über den Inhalt des jeweiligen Ordners:


home                                    Startsteite der Applikation mit Modul- und Speiseplan-Ansicht
imprint                                  Impressum der EAH. Kommt als HTML View durch die Schnittstelle. Dementsprechend mit einer HTML-View umgesetzt
intro                                      Öffnet sich nach dem ersten App-Start. Gibt eine kurze Beschreibung der App und führt zum Einrichtungsassistenten ( /selector )
menu                                    Speiseplan-Ansicht der EAH
menu-edit                             Unterseite der Speiseplan-Ansicht zum bearbeiten der angezeigten Kantinen  
news                                     Nachrichten-Ansicht der EAH
news-detail                           Es öffnet sich eine entsprechende Detail-Ansicht nach betätigen einer spezifischen Nachricht
planner                                 Stundenplan-Ansicht der EAH
planner-edit                          Unterseite der Stundenplan-Ansicht zum bearbeiten der angezeigten Fächer
selector                                Einrichtungsassistent. Akquiriert bestimmte Daten mit Benutzer-Interaktionen nach App-Start. Teile des Assistenten sind in "menu-edit", "planner-edit" und "settings" zu finden
settings                                Einstellungsansicht der EAH. Aktuell ausgegraugt, da keine Funktionalität hinter den Optionen steht
weather                                Wetter-Ansicht der EAH

Die Logik des Frontends spielt sich in den Unterordnern der jeweiligen Ansicht innerhalb der *.component.ts - Datei ab. Layout und Design sind in der .css und .html zu finden. 
Die Datei app.component.ts und app.component.html  im "eahjena/src/app"-Verzeichnis beinhalten den nativen SideDrawer, der sämtliche Views "umspannt". 

Mit enthalten ist ebenfalls der Parent-Ordner "shared" mit folgenden Inhalten

shared
        ingredients.ts    Liste der Zutaten, die durch die Speiseplan Liste als Abkürzung kommen. Hilft, um die Ergebnisse zu parsen.
        config.ts         Liste der Zieladressen, die für die HTTP-Requests genutzt werden
        mock              Unterordner, der eine Kopie der Schnittstellen-Daten enthält und für die Anzeige genutzt werden kann, falls die Schnittstelle (wie in den Semesterferien) keine Daten liefert
        model             Enthält sämtliche Modell-Klassen, die im Rahmen der Arbeit erstellt und verwendet wurden 
        services          Sämtliche Service-Klassen, die für die Kommunikation der App mit dem Server der EAH verwendet werden


Service Logik, also sämtliche Kommunikation mit dem Backend, Festlegen des Datenmodels und lokales Speichern der bearbeiteten Stundenpläne des Nutzers sind im Ordner "src/app/shared/service" zu finden. Einzelne Konfigurations-Varablen liegen direkt im Parent-Ordner.


## Dummy-Daten


Da zum Zeitpunkt der Implementierung keine Daten durch die Schnittstelle empfangen werden, wurde ein Service Implementiert, der Mock-Daten für die Stundepläne bereitstellt. Um diesen zu deaktivieren, müssen innerhalb der Datei:
eahjena/src/app/shared/mock/home-interceptor.ts die folgenden Zeilen auskommentiert werden:

...
    if (request.urlWithParams.includes("event")) {
      if (!this.local) {
        return of(new HttpResponse({ body: coursesDetail }));
      } else {
        return of(new HttpResponse({ body: coursesDetailAdded }));
      }  
    }
...


