import React, { Component } from 'react';
import { remote, MenuItem } from 'electron';
require('../styles/TitleBar.sass');

export default class TitleBar extends Component {
    render() {
        const menu = remote.Menu.getApplicationMenu();
        console.log(menu);
        let children: JSX.Element[] = [];
        if (menu) children = this.buildMenu(menu.items);
        return (
            <div id="titlebar">
                {children}
                <span>{document.title}</span>
                <div id="win-buttons">
                    <div>
                        <div id="min" onClick={this.minimize} />
                    </div>
                    <div>
                        <div id="min-max" onClick={this.minMax} />
                    </div>
                    <div>
                        <div id="quit" onClick={this.quitApp} />
                    </div>
                </div>
            </div>
        );
    }

    buildMenu(items: MenuItem[]): JSX.Element[] {
        const children = [];
        for (const e of items) {
            children.push(
                <div key={e.label} className="title-button" onClick={() => e.click()}>
                    <span>{e.label}</span>
                    {this.buildSubmenu(e.submenu.items)}
                </div>
            );
        }
        return children;
    }

    buildSubmenu(items: MenuItem[]): JSX.Element {
        const children = [];
        console.log(items);
        for (const item of items) {
            let className = undefined;
            if (item.type === 'separator') className = 'separator';
            children.push(
                <div className={className} onClick={() => item.click()}>
                    {item.label}
                </div>
            );
        }
        return <div className="list">{children}</div>;
    }

    quitApp = () => remote.app.quit();

    minMax() {
        const win = remote.getCurrentWindow();
        if (win.isMaximized()) win.unmaximize();
        else win.maximize();
    }

    minimize = () => remote.getCurrentWindow().minimize();
}
