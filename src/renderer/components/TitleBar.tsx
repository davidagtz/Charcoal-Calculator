import React, { Component } from 'react';
import { remote, MenuItem } from 'electron';
import { StyleSchema } from './Tools/brains/Types';
import HoverButton from './Tools/HoverButton';
require('./styles/TitleBar.sass');

export default class TitleBar extends Component<{
    style: StyleSchema;
}> {
    render() {
        const menu = remote.Menu.getApplicationMenu();
        const style = this.props.style.TitleBar;
        let children: JSX.Element[] = [];
        if (menu) children = this.buildMenu(menu.items);
        return (
            <div
                id="titlebar"
                style={{
                    backgroundColor: style.background,
                    color: style.font
                }}
            >
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
        for (let i = 0; i < items.length; i += 1) {
            const e: any = items[i];
            const click = function() {
                e.click();
            };
            // <div key={e.label} className="title-button" onClick={click}>
            //     <span>{e.label}</span>
            //     {this.buildSubmenu(e.submenu.items)}
            // </div>
            children.push(
                <HoverButton
                    key={e.label}
                    onhover={{
                        backgroundColor: this.props.style.defaultButtons.hover
                    }}
                    className="title-button"
                    onClick={click}
                >
                    <span>{e.label}</span>
                    {this.buildSubmenu(e.submenu.items)}
                </HoverButton>
            );
        }
        return children;
    }

    buildSubmenu(items: MenuItem[]): JSX.Element {
        const children = [];
        for (let i = 0; i < items.length; i += 1) {
            const item: any = items[i];
            let className = undefined;
            if (item.type === 'separator') className = 'separator';
            children.push(
                <HoverButton
                    style={{
                        backgroundColor: this.props.style.defaultButtons.hover
                    }}
                    onhover={{
                        backgroundColor: this.props.style.TitleBar.buttons.submenuhover
                    }}
                    onactive={{
                        backgroundColor: this.props.style.defaultButtons.active
                    }}
                    key={i}
                    className={className}
                    onClick={() => item.click()}
                >
                    {item.label}
                </HoverButton>
            );
        }
        return <div className="list">{children}</div>;
    }

    quitApp() {
        remote.app.quit();
    }

    minMax() {
        const win = remote.getCurrentWindow();
        if (win.isMaximized()) win.unmaximize();
        else win.maximize();
    }

    minimize() {
        remote.getCurrentWindow().minimize();
    }
}
