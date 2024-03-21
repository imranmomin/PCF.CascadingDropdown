import { useComponentFrameworkContext } from '../services/ComponentFrameworkContext'

/**
 * Hook to get the parameters from the ComponentFrameworkContext.
 *
 * @returns {object} - An object containing the parameters.
 */
export const useParameters = () => {
    const { Context: { mode, parameters } } = useComponentFrameworkContext()
    const isDisabled = mode.isControlDisabled
    const lookupValue = parameters.LookupField?.raw?.[0]
    const { LookupFieldIdentifierField, DropdownOneField, DropdownTwoField, ParagraphField } = parameters

    return {
        isDisabled,
        lookupValue,
        lookupIdentifierField: LookupFieldIdentifierField.raw,
        dropdownOneField: DropdownOneField.raw,
        dropdownTwoField: DropdownTwoField.raw,
        paragraphField: ParagraphField.raw
    }
}