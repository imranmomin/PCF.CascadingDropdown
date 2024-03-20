import { MessageBar } from '@fluentui/react-components'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useData } from '../hooks/useData'
import { useParameters } from '../hooks/useParameters'
import { Dependent } from '../hooks/useSimpleOptions'
import { useComponentFrameworkContext } from '../services/ComponentFrameworkContext'
import { Dropdown } from './Dropdown'
import { Paragraph } from './Paragraph'

/**
 * The main App component.
 * This component handles the state and effects for the dropdowns and paragraph.
 * It also renders the dropdowns and paragraph.
 */
export const App = () => {
    const ctx = useComponentFrameworkContext()
    const { isDisabled, lookupValue, lookupIdentifierField, dropdownOneField, dropdownTwoField, paragraphField } = useParameters()
    const [data, isLoading, error] = useData()
    const [dropdownOne, setDropdownOne] = useState<string | undefined>(undefined)
    const [dropdownTwo, setDropdownTwo] = useState<string | undefined>(undefined)
    const [dropdownTwoDependencies, setDropdownTwoDependencies] = useState<Dependent[]>([])
    const [para, setPara] = useState<string | undefined>(undefined)

    /**
     * Function to handle the selected option of the dropdowns.
     * @param {string | undefined} selectedOption - The selected option.
     * @param {string | undefined} dropdown - The dropdown that the selected option belongs to.
     */
    const onSelected = (selectedOption?: string | undefined, dropdown?: string) => {
        if (dropdown === 'one') {
            setDropdownOne(selectedOption)
            if (selectedOption && dropdownTwoField && dropdownOneField) {
                setDropdownTwoDependencies([{ field: dropdownOneField, value: selectedOption }])
            }
            setDropdownTwo(undefined)
        } else if (dropdown === 'two') {
            setDropdownTwo(selectedOption)
        }
    }

    useEffect(() => {
        if (!lookupValue || !lookupIdentifierField || !data || data.length === 0) {
            return
        }

        const id = lookupValue.id || (lookupValue as any)['_id']
        const item = data.find((item) => item[lookupIdentifierField] === id)

        if (item) {
            if (dropdownOneField) {
                setDropdownOne(item[dropdownOneField])
            }
            if (dropdownTwoField) {
                setDropdownTwo(item[dropdownTwoField])
            }
        }
    }, [data])

    useEffect(() => {
        let items = data
        if (dropdownOneField) {
            items = items.filter((item) => item[dropdownOneField] === dropdownOne)
        }
        if (dropdownTwoField) {
            items = items.filter((item) => item[dropdownTwoField] === dropdownTwo)
        }
        if (items.length > 0) {
            const item = items[0]
            if (paragraphField) {
                setPara(item[paragraphField])
            }
            if (lookupIdentifierField) {
                ctx.onChange(item[lookupIdentifierField])
            }
        } else {
            setPara(undefined)
        }
    }, [dropdownOne, dropdownTwo])

    return (
        <>
            { isLoading && <div>Loading...</div> }
            { error && <MessageBar intent={ 'error' }> { error } </MessageBar> }
            { !isLoading && !error &&
                <>
                    { dropdownOneField && <Dropdown key="DropdownOne" id="DropdownOne" field={ dropdownOneField } onSelected={ (selectedOption) => onSelected(selectedOption, 'one') } selected={ dropdownOne } isDisabled={ isDisabled }/> }
                    { dropdownTwoField && dropdownOne && <Dropdown key={ `Dropdown-${ Date.now() }` } id="DropdownTwo" field={ dropdownTwoField } onSelected={ (selectedOption) => onSelected(selectedOption, 'two') } dependencies={ dropdownTwoDependencies } selected={ dropdownTwo } isDisabled={ isDisabled }/> }
                    { para && <Paragraph id="legal" text={ para }/> }
                </>
            }
        </>
    )
}
