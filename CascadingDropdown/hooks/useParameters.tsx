import { useComponentFrameworkContext } from '../services/ComponentFrameworkContext'

/**
 * Hook to get the parameters from the ComponentFrameworkContext.
 *
 * @returns {object} - An object containing the parameters.
 */
export const useParameters = (): {
    isDisabled: boolean,
    lookupValue: ComponentFramework.LookupValue,
    lookupIdentifierField: string | null,
    dropdownOneField: string | null,
    dropdownTwoField: string | null,
    dropdownThreeField: string | null,
    paragraphField: string | null
} => {
    const { Context: { mode, parameters } } = useComponentFrameworkContext()
    const isDisabled = mode.isControlDisabled
    const lookupValue = parameters.LookupField?.raw?.[0]
    const { LookupFieldIdentifierField, DropdownOneField, DropdownTwoField, DropdownThreeField, ParagraphField } = parameters

    return {
        isDisabled,
        lookupValue,
        lookupIdentifierField: LookupFieldIdentifierField.raw,
        dropdownOneField: DropdownOneField.raw,
        dropdownTwoField: DropdownTwoField.raw,
        dropdownThreeField: DropdownThreeField.raw,
        paragraphField: ParagraphField.raw
    }
}