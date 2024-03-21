import { useEffect, useState } from 'react'
import { useData } from './useData'

export type Dependent = Record<string, string>;

/**
 * Hook to get a list of unique options from a data set based on a field and optional dependencies.
 *
 * @param {string} field - The field to extract the options from.
 * @param {Dependent[] | undefined} dependencies - Optional dependencies to filter the data set.
 * @returns {string[]} - An array of unique options.
 */
export const useSimpleOptions = (field: string, dependencies: Dependent[] | undefined): [string[]] => {
    const [data] = useData()
    const [options, setOptions] = useState<string[]>([])

    /**
     * Effect to update the options whenever the data or dependencies change.
     * Filters the data based on the dependencies, maps the filtered data to the values of the field,
     * and sets the unique values as the options.
     */
    useEffect(() => {
        const list = data
            .filter(item => !dependencies || dependencies.every(dependency => item[dependency.field] === dependency.value))
            .map(item => item[field])
            .filter((value, index, self) => self.indexOf(value) === index)
            .sort()

        setOptions(list)
    }, [data, dependencies])

    return [options]
}