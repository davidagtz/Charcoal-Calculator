import { BrowserWindow, WebContents } from 'electron';

const menu = (window: BrowserWindow) => [
    {
        label: 'File',
        submenu: [
            {
                label: 'Toggle Devtools',
                click: () => {
                    window.webContents.openDevTools();
                }
            },
            {
                label: 'Settings',
                click: () => {
                    window.webContents.executeJavaScript(
                        'document.dispatchEvent(new Event("openSettings"))'
                    );
                }
            }
        ]
    }
];
export default menu;
