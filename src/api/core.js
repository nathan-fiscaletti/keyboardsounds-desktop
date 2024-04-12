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
            this.exec('list-profiles --short', true).then((stdout) => {
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
            this.exec('list-rules --short', true).then((stdout) => {
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

            // check if cmd is a member of this
            if (typeof this[command] === 'function') {
                try {
                    const result = await this[command]();
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
}

export { kbs };