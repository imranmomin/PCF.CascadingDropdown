import { Dropdown as FluentDropdown, Label, makeStyles, Option, OptionOnSelectData, SelectionEvents, shorthands, tokens, useId } from '@fluentui/react-components'
import React, { useEffect } from 'react'
import { Dependent, useSimpleOptions } from '../hooks/useSimpleOptions'
import { useComponentFrameworkContext } from '../services/ComponentFrameworkContext'
import { Paragraph } from './Paragraph'

/**
 * Interface for the props of the Dropdown component.
 * @interface
 * @property {string} id - The id of the dropdown.
 * @property {string} field - The field to extract the options from.
 * @property {boolean} isDisabled - Whether the dropdown is disabled.
 * @property {string} selected - The selected option in the dropdown.
 * @property {Dependent[]} dependencies - The dependencies to filter the options.
 * @property {function} onSelected - The function to call when an option is selected.
 */
export interface IDropdownProps {
    id: string
    field: string
    isDisabled?: boolean,
    selected?: string | undefined,
    dependencies?: Dependent[] | undefined,

    onSelected (selectedOption?: string): void,
}

const styles = makeStyles({
    root: {
        display: 'grid',
        gridTemplateRows: 'repeat(1fr)',
        justifyItems: 'start',
        '> .fui-Dropdown': {
            minWidth: '334px',
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateRows: 'repeat(1fr)',
            justifyItems: 'start',
            backgroundColor: tokens.colorNeutralBackground3,
            ...shorthands.gap(tokens.spacingVerticalM),
            ...shorthands.border('0px'),

            '> button': {

                '> .fui-Dropdown__expandIcon': {
                    visibility: 'hidden',
                },

                ':hover': {
                    '> .fui-Dropdown__expandIcon': {
                        visibility: 'visible',
                    }
                }
            }
        }
    }
})

/**
 * Dropdown component.
 * @param {IDropdownProps} props - The props for the component.
 * @returns {React.ReactElement} - A dropdown element with the passed id, options, selected option, and disabled state.
 */
export const Dropdown: React.FC<IDropdownProps> = ({ id, field, isDisabled, selected, onSelected, dependencies }: IDropdownProps) => {
    const ctx = useComponentFrameworkContext()
    const [options] = useSimpleOptions(field, dependencies)
    const [value, setValue] = React.useState<string | undefined>(selected)
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>(selected ? [selected] : [])
    const _id = useId(id)
    const classes = styles()

    /**
     * Effect to call the onSelected function whenever the value changes.
     */
    useEffect(() => onSelected(value), [value])

    /**
     * Function to handle the onSelect event of the dropdown.
     * Sets the selected options and value in the state.
     * @param {SelectionEvents} _ - The selection events.
     * @param {OptionOnSelectData} data - The data from the onSelect event.
     */
    const onChange = (_: SelectionEvents, data: OptionOnSelectData) => {
        setSelectedOptions(data.selectedOptions)
        setValue(data.optionValue)
    }

    const dropdownLabel = (ctx.Context.parameters as any)[`${ id }Label`]?.raw
    const dropdownPlaceholder = (ctx.Context.parameters as any)[`${ id }Placeholder`]?.raw

    return (
        <div id={ _id } className={ classes.root }>
            { isDisabled && <Paragraph id={ id } text={ selected || '' } textAlign={ 'inherit' }/> }
            { !isDisabled && dropdownLabel && <Label htmlFor={ _id }>{ dropdownLabel }</Label> }
            { !isDisabled &&
                <FluentDropdown id={ id }
                                placeholder={ dropdownPlaceholder }
                                onOptionSelect={ onChange }
                                defaultValue={ value }
                                selectedOptions={ selectedOptions }
                                disabled={ isDisabled }>
                    {
                        options.map((x) => (
                            <Option key={ x } value={ x }>
                                { x }
                            </Option>
                        ))
                    }
                </FluentDropdown>
            }
        </div>
    )
}
