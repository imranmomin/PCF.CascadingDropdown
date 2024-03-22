import * as React from 'react'
import { App } from './components/App'
import { Container, IAppProps } from './components/Container'
import { IInputs, IOutputs } from './generated/ManifestTypes'

export class CascadingDropdown implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private _notifyOutputChanged?: () => void
    private _selectedValue: ComponentFramework.LookupValue | undefined

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped
     * to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling
     * 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    init (context: ComponentFramework.Context<IInputs>, notifyOutputChanged?: () => void, state?: ComponentFramework.Dictionary, container?: HTMLDivElement): void {
        this._notifyOutputChanged = notifyOutputChanged
        context.mode.trackContainerResize(true)
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView (context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const props: IAppProps = {
            context: context,
            onChange: this.onChange.bind(this)
        }

        return React.createElement(Container, props, React.createElement(App))
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs (): IOutputs {
        if (!this._selectedValue) {
            return {
                LookupField: []
            }
        }

        return {
            LookupField: [this._selectedValue]
        }
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy (): void {
    }

    /**
     * Event handler for the onChange event of the dropdown.
     * This will update the selected value and notify the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param selectedOption The selected option
     * @private
     */
    private onChange (selectedOption?: ComponentFramework.LookupValue | undefined): void {
        if (this._selectedValue?.id !== selectedOption?.id) {
            this._selectedValue = selectedOption
            if (this._notifyOutputChanged) {
                this._notifyOutputChanged()
            }
        }
    }
}
