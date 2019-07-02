# EAH Jena Stundenplan-App
Diese App ist mithilfe des Nativescript Frameworks realisiert worden. Als Sprache wird Typescript genutzt. Zusätzlich wurde das Angular Framework eingebunden, um sich bekannter Werkzeuge bedienen zu können.
Dadurch ist diese App sowohl unter Android, als auch unter iOS nutzbar.

## Vorschau
Folgende Vorschau zeigt bisher implementierte Funktionalitäten (im iOS Simulator):

<img src="https://github.com/ishiharas/eahjena/blob/master/preview.gif?raw=true" width="500"/>


## Download Android App
Unter folgendem Link kann ein aktueller Build der Android .apk runter geladen werden.
Bitte beachten Sie, dass es sich dabei um ein Beta Version handelt.
* <summary><a href="https://github.com/ishiharas/eahjena/releases/latest">Latest Release</a></summary>


## Nativescript
Was Nativescript ist und wie damit native Apps gebaut werden können, kann unter folgendem Link nachgelesen werden:
https://docs.nativescript.org/core-concepts/android-runtime/overview

Wie Nativescript unter Windows oder iOS gebaut werden kann und was dafür installiert werden muss, kann hier nachgelesen werden:
https://docs.nativescript.org/start/quick-setup#full-setup

Der Punkt "Advanced Setup" listet alle Dependencies auf, die zum bauen von Nativescript Projekten benötigt werden. 
Alternativ kann auch einfach das Script vom Link ausgeführt werden, welches sämtliche Dependencies (Android SDK, JDK, Google Repo, Android Studio und weitere) automatisch installiert.

Wenn das generelle Setup erledigt ist, können alle Libraries der App mit folgendem Befehl installiert werden:
```
cd eahjena
npm install
```

Folgender Befehl baut die App im Android Emulator, iOS Simulator oder dem angeschlossenen Gerät:

```
tns run android
tns run ios
```