import { BrowserWindow } from 'electron';

export default (window: BrowserWindow) => [
    {
        label: 'File',
        submenu: [
            {
                label: 'Toggle Devtools',
                click: () => {
                    window.webContents.openDevTools();
                }
            }
        ]
    }
];
