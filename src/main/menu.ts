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
                        '(()=> {let e = new Event("openPage"); e.page = 1; document.dispatchEvent(e)})()'
                    );
                }
            }
        ]
    }
];
export default menu;
