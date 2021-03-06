import React from 'react';
import { StyleSchema } from '../Tools/brains/Types';
import HoverButton from '../Tools/HoverButton';
import ajv from 'ajv';
import { readFile, readdirSync } from 'fs';
const schema = require('../../themes/themes.schema.json');

const AJV = new ajv();
const validate = AJV.compile(schema);

export default class ThemePicker extends React.Component<{
    style: StyleSchema;
    changeStyle: (s: StyleSchema) => void;
}> {
    state = {
        file: null as string | null,
        errors: null as null | string[],
        defaultFolder: 'src/renderer/themes'
    };

    inputRef: React.RefObject<HTMLInputElement> = React.createRef();
    folderRef: React.RefObject<HTMLSelectElement> = React.createRef();

    render() {
        const options = [];
        const folder = readdirSync(this.state.defaultFolder);
        const { style } = this.props;
        const buttonProps = {
            style: {
                backgroundColor: style.defaultButtons.color,
                color: style.defaultButtons.font
            },
            onhover: {
                backgroundColor: style.defaultButtons.active
            },
            onactive: {
                backgroundColor: style.defaultButtons.hover
            }
        };
        for (const file of folder) {
            const name = file.split('.')[0];
            if (name === 'themes') continue;
            options.push(
                <option key={name} value={`${this.state.defaultFolder}/${file}`}>
                    {name}
                </option>
            );
        }
        return (
            <div id="theme-picker" style={{ color: style.Calculator.font }}>
                <h3>Themes</h3>
                <div className="separator" style={{ backgroundColor: style.TitleBar.background }} />
                <label>
                    Choose Theme:
                    <input
                        ref={this.inputRef}
                        type="file"
                        hidden={true}
                        accept=".json"
                        onChange={this.getFile}
                    />
                </label>
                <div id="selectors">
                    <HoverButton id="theme-browse" {...buttonProps} onClick={this.clickInput}>
                        Browse...
                    </HoverButton>
                    <select ref={this.folderRef} id="folder-list" onChange={this.selectFile}>
                        {options}
                    </select>
                </div>
                <HoverButton id="refresh" {...buttonProps} onClick={this.update} />
                {this.state.errors ? this.createErrorList() : null}
            </div>
        );
    }

    update = () => {
        if (this.state.file) this.validateAndChange(this.state.file);
    };

    selectFile = () => {
        this.validateAndChange(this.folderRef.current!.value);
    };

    validateAndChange = (file: string) => {
        readFile(file, { encoding: 'utf-8' }, (err, data) => {
            if (err) throw err;

            let themeSheet: Object;
            try {
                themeSheet = JSON.parse(data);
            } catch (e) {
                this.setState({
                    errors: ['Invalid JSON']
                });
                return;
            }
            const valid = validate(themeSheet);
            if (!valid) {
                this.setState({
                    errors: validate.errors!.map(e => e.message)
                });
                return;
            }
            this.setState(
                {
                    file,
                    errors: null
                },
                () => this.props.changeStyle(themeSheet as StyleSchema)
            );
        });
    };

    getFile = () => {
        const input = this.inputRef.current!;
        if (input.files && input.files.length > 0) {
            const file = input.files[0].path;
            this.validateAndChange(file);
        }
    };

    createErrorList() {
        const list = [];
        for (let i = 0; i < this.state.errors!.length; i += 1) {
            list.push(<div key={i}>{this.state.errors![i]}</div>);
        }
        return <div className="error-list">{list}</div>;
    }

    clickInput = () => {
        this.inputRef.current!.click();
    };
}
