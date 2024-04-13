import { Socket } from "net";
import { BrowserWindow, shell } from 'electron';
import { exec } from 'child_process';

const kbs = {
    exec: function (cmd, print=true) {
        return new Promise((resolve, reject) => {
            if (print) {
                console.log(`Executing: kbs ${cmd}`);
            }

            exec(`kbs ${cmd}`, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(stdout);
            });
        });
    },

    version: function () {
        return this.exec('--version');
    },

    openInBrowser: function () {
        return Promise.resolve(
            shell.openExternal("https://github.com/nathan-fiscaletti/keyboardsounds")
        );
    },

    status: function () {
        return new Promise((resolve, reject) => {
            this.exec('status --short', false).then((stdout) => {
                try {
                    const status = JSON.parse(stdout);
                    resolve(status);
                } catch (err) {
                    reject(err);
                }
            }).catch((err) => {
                reject(err);
            });
        });
    },

    profiles: function() {
        return new Promise((resolve, reject) => {
            this.exec('list-profiles --short', false).then((stdout) => {
                try {
                    const profiles = JSON.parse(stdout);
                    resolve(profiles);
                } catch (err) {
                    reject(err);
                }
            }).catch((err) => {
                reject(err);
            });
        });
    },

    rules: function() {
        return new Promise((resolve, reject) => {
            this.exec('list-rules --short', false).then((stdout) => {
                try {
                    const rules = JSON.parse(stdout);
                    resolve(rules);
                } catch (err) {
                    reject(err);
                }
            }).catch((err) => {
                reject(err);
            });
        });
    },

    executeDaemonCommand: async function(command) {
        const status = await this.status();
        if (status.status !== 'running') {
            return Promise.reject('Keyboard Sounds is not running.');
        }

        const port = status.api_port;
        const socket = new Socket();
        socket.connect(port, 'localhost', () => {
            socket.write(Buffer.from(JSON.stringify(command)).toString('base64') + "\n");
            socket.destroy();
        });
    },

    setVolume: async function(volume) {
        return this.executeDaemonCommand({
            action: 'set_volume',
            volume: Number(volume)
        });
    },

    setProfile: async function(profile) {
        return this.executeDaemonCommand({
            action: 'set_profile',
            profile: profile
        });
    },

    checkInstallation: function () {
        return new Promise((resolve, reject) => {
            this.version().then(_ => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    },

    registerKbsIpcHandler: function (ipcMain) {
        ipcMain.on('kbs', async (event, data) => {
            const { command, channelId } = data;

            const [commandName, ...commandArgs] = command.split(' ');

            // check if cmd is a member of this
            if (typeof this[commandName] === 'function') {
                try {
                    const result = await this[commandName](...commandArgs);
                    event.reply(`kbs_execute_result_${channelId}`, result);
                } catch (err) {
                    event.reply(`kbs_execute_result_${channelId}`, err);
                }
            } else {
                // attempt to execute the command directly
                this.exec(command).then((result) => {
                    event.reply(`kbs_execute_result_${channelId}`, result);
                }).catch((err) => {
                    event.reply(`kbs_execute_result_${channelId}`, err);
                });
            }
        });
    },

    registerStatusMonitor: function (ipcMain) {
        // Watch the status and notify the renderer process when it changes
        setInterval(() => {
            this.status().then((status) => {
                BrowserWindow.getAllWindows().forEach(window => {
                    window.webContents.send('kbs-status', status);
                });
            }).catch((err) => {
                console.error('Failed to fetch status:', err);
            });
        }, 1000);
    },

    registerAppRulesMonitor: function (ipcMain) {
        // Watch the app rules and notify the renderer process when they change
        setInterval(() => {
            this.rules().then((rules) => {
                BrowserWindow.getAllWindows().forEach(window => {
                    window.webContents.send('kbs-app-rules', rules);
                });
            }).catch((err) => {
                console.error('Failed to fetch app rules:', err);
            });
        }, 1000);
    },

    registerProfilesMonitor: function (ipcMain) {
        setInterval(() => {
            this.profiles().then((profiles) => {
                BrowserWindow.getAllWindows().forEach(window => {
                    window.webContents.send('kbs-profiles', profiles);
                });
            }).catch((err) => {
                console.error('Failed to fetch profiles:', err);
            });
        }, 1000);
    }
}

export { kbs };