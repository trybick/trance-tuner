# Tray Tuner

Control online radio streams from your system tray (macOS, Windows, & Linux).

## Usage

### Controlling Music

Pausing/playing the music can be done by:

- Clicking the tray icon
- Clicking the pause/play icon in the Application UI
- With a keyboard shortcut (see below)

### Keyboard Shortcuts

`CmdOrCtrl + Ctrl + Shift + Z` - Pause/play the music

`CmdOrCtrl + Ctrl + Shift + W` - Bring the app into focus

`CmdOrCtrl + Ctrl + Shift + R` - Play one of the built-in random streams

### Addding an Audio Source

To add an audio stream click the "Edit" button and enter a URL in the dialog box. This URL is saved and will be loaded whenever you start the application.

Tray Tuner comes with the three radio streams which can be cycled through by clicking the "Random" button.

### Hide in Dock

Click the chevon button at the bottom of the application to toggle the Settings drawer. Inside this expanded drawer, click the checkbox "Hide in Dock" to hide the item in your in Dock (macOS only).

## Download

Currently the downloads can be found [here](https://drive.google.com/open?id=1uyz-Y-EZ8_Dw0jdy2QWyLeq5TK0wBp-T).

## Installation

### macOS

- Extract zip file
- Copy the Tray Tuner application into the Applications folder
- Double-click to open. Because the app is not signed (requires \$99/year which I haven't committed to yet), you should receive a warning that this cannot be opened.
- Go to Systems Preferences --> Security & Privacy --> and click "Open Anyway"

### Windows

- Extract zip file
- Double-click TrayTuner.exe to open.

### Linux

- Extract zip file
- Run the executable. For example `./Tray Tuner` in a terminal.

## Local Development

This is an electron application written in TypeScript. Clone the repo and run `npm run start` to run the application locally.

### Further Development

- Ability to store mulitple custom audio sources. Instead of using a dialog prompt when clicking "Edit", we could open a new window with a UI to add/view sources.
