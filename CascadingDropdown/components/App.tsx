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
    const { isDisabled, lookupValue, lookupIdentifierField, dropdownOneField, dropdownTwoField, dropdownThreeField, paragraphField } = useParameters()
    const [data, isLoading, error] = useData()
    const [dropdowns, setDropdowns] = useState<Array<string | undefined>>([undefined, undefined, undefined])
    const [dependencies, setDependencies] = useState<Array<Dependent[]>>([[], []])
    const [para, setPara] = useState<string | undefined>(undefined)
    const dropdownFields = [dropdownOneField, dropdownTwoField, dropdownThreeField]

    /**
     * Function to handle the selected option of the dropdowns.
     * @param {string | undefined} selectedOption - The selected option.
     * @param {string | undefined} dropdown - The dropdown that the selected option belongs to.
     */
    const onSelected = (dropdown: string, selectedOption?: string | undefined) => {
        const index = dropdownFields.indexOf(dropdown)
        if (index !== -1) {
            setDropdowns(prevDropdowns => {
                const newDropdowns = [...prevDropdowns]
                newDropdowns[index] = selectedOption
                return newDropdowns
            })
            setDependencies(prevDependencies => {
                const newDependencies = [...prevDependencies]
                if (newDependencies[index]) {
                    newDependencies[index].length = 0
                }

                if (selectedOption && index < dropdownFields.length - 1) {
                    newDependencies[index] = [{ field: dropdown, value: selectedOption } as Dependent]

                    const fields = dropdownFields.slice(0, index)
                    const values = dropdowns.slice(0, index)
                    fields.forEach((field, i) => {
                        newDependencies[index].push({ field, value: values[i] } as Dependent)
                    })
                }

                return newDependencies
            })
        }
    }

    useEffect(() => {
        if (!lookupValue || !lookupIdentifierField || !data || data.length === 0) {
            return
        }

        const id = lookupValue.id || (lookupValue as any)['_id']
        const item = data.find((item) => item[lookupIdentifierField] === id)

        if (item) {
            dropdownFields.forEach((field, index) => {
                if (field) {
                    setDropdowns(prevDropdowns => {
                        const newDropdowns = [...prevDropdowns]
                        newDropdowns[index] = item[field]
                        return newDropdowns
                    })
                }
            })
        }
    }, [data])

    useEffect(() => {
        const items = data.filter(item => {
            return dropdownFields.every((field, index) => !field || item[field] === dropdowns[index])
        })

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
    }, dropdowns)

    return (
        <>
            { isLoading && <div>Loading...</div> }
            { error && <MessageBar intent={ 'error' }> { error.message } </MessageBar> }
            { !isLoading && !error &&
                <>
                    { dropdownFields[0] && <Dropdown key="DropdownOne" id="DropdownOne" field={ dropdownFields[0] } onSelected={ (selectedOption) => onSelected(dropdownFields[0]!, selectedOption) } selected={ dropdowns[0] } isDisabled={ isDisabled }/> }
                    { dropdownFields[1] && dropdowns[0] && <Dropdown key="DropdownTwo" id="DropdownTwo" field={ dropdownFields[1] } onSelected={ (selectedOption) => onSelected(dropdownFields[1]!, selectedOption,) } dependencies={ dependencies[0] } selected={ dropdowns[1] } isDisabled={ isDisabled }/> }
                    { dropdownFields[2] && dropdowns[1] && <Dropdown key="DropdownThree" id="DropdownThree" field={ dropdownFields[2] } onSelected={ (selectedOption) => onSelected(dropdownFields[2]!, selectedOption,) } dependencies={ dependencies[1] } selected={ dropdowns[2] } isDisabled={ isDisabled }/> }
                    { para && <Paragraph id="legal" text={ para }/> }
                </>
            }
        </>
    )
}
