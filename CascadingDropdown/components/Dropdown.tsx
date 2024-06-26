import { Combobox as FluentCombobox, Label, makeStyles, OptionOnSelectData, SelectionEvents, shorthands, tokens, useComboboxFilter, useId } from '@fluentui/react-components'
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
        justifyItems: 'start'
    },
    combobox: {
        cursor: 'pointer',
        minWidth: '334px',
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'repeat(1fr)',
        justifyItems: 'start',
        backgroundColor: tokens.colorNeutralBackground3,
        ...shorthands.gap(tokens.spacingVerticalM),
        ...shorthands.border('0px'),

        '> input': {
            cursor: 'pointer',
            width: '100%',
        },

        '> span.fui-Combobox__expandIcon': {
            visibility: 'hidden',
        },

        ':hover': {
            '> span.fui-Combobox__expandIcon': {
                visibility: 'visible',
            }
        }
    },
    listbox: {
        maxHeight: '450px',
    }
})

/**
 * Dropdown component.
 * @param {IDropdownProps} props - The props for the component.
 * @returns {React.ReactElement} - A dropdown element with the passed id, options, selected option, and disabled state.
 */
export const Dropdown: React.FC<IDropdownProps> = ({ id, field, isDisabled, selected, onSelected, dependencies }: IDropdownProps): React.ReactElement => {
    const ctx = useComponentFrameworkContext()
    const dropdownLabel = (ctx.Context.parameters as any)[`${ id }Label`]?.raw
    const dropdownPlaceholder = (ctx.Context.parameters as any)[`${ id }Placeholder`]?.raw

    const [options] = useSimpleOptions(field, dependencies)
    const [value, setValue] = React.useState<string | undefined>(selected)
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>(selected ? [selected] : [])
    const [query, setQuery] = React.useState<string>('')

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

    const items = useComboboxFilter(query, options, {
        noOptionsMessage: 'No match for your search',
        filter: (option, query) => option.toLowerCase().includes(query.toLowerCase()),
        optionToText: (option) => option,
        optionToReactKey: (option) => option
    })

    return (
        <div id={ _id } className={ classes.root }>
            { isDisabled && <Paragraph id={ id } text={ selected || 'No content' } textAlign={ 'inherit' }/> }
            { !isDisabled && dropdownLabel && <Label htmlFor={ _id }>{ dropdownLabel }</Label> }
            { !isDisabled &&
                <FluentCombobox id={ id }
                                className={ classes.combobox }
                                placeholder={ dropdownPlaceholder }
                                onOptionSelect={ onChange }
                                defaultValue={ value }
                                selectedOptions={ selectedOptions }
                                disabled={ isDisabled }
                                listbox={ { className: classes.listbox } }
                                clearable={ true }
                                autoComplete="off"
                                onChange={ (ev) => setQuery(ev.target.value) }
                                value={ selected || query }>
                    { items }
                </FluentCombobox>
            }
        </div>
    )
}