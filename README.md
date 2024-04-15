# Keyboard Sounds for Desktop

⚠️This project is a work-in-progress and is not yet ready for use.⚠️

This project is still in the very early stages of development. The goal is to create a desktop application as a front-end for the [Keyboard Sounds CLI Application](https://github.com/nathan-fiscaletti/keyboardsounds).

![Preview](./preview.png)

## Installation

> Note: Currently only tested on windows.

> Note: This requires that you checkout and install [the `ui-support` branch of the Keyboard Sounds CLI Application](https://github.com/nathan-fiscaletti/keyboardsounds/tree/ui-support).

```powershell
# Make sure that Keyboard Sounds is not installed
PS> pip uninstall keyboardsounds

# Clone the back-end and checkout the ui-support branch
PS> git clone https://github.com/nathan-fiscaletti/keyboardsounds.git
PS> cd keyboardsounds
PS> git checkout ui-support
PS> pip install -r requirements.txt
PS> pip install -e .

# Verify Installation
PS> kbs --version

# Clone the front-end and start the application
PS> git clone https://github.com/nathan-fiscaletti/keyboardsounds-desktop.git
PS> cd keyboardsounds-desktop
PS> yarn && yarn start
```