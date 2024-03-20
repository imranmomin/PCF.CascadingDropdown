import { useEffect, useState } from 'react'
import { useComponentFrameworkContext } from '../services/ComponentFrameworkContext'

/**
 * Hook to fetch data from the ComponentFrameworkContext.
 *
 * @returns {Array} - An array containing the fetched data, loading state, and any error.
 */
export const useData = (): [ComponentFramework.WebApi.Entity[], boolean, Error | null] => {
    const ctx = useComponentFrameworkContext()
    const [data, setData] = useState<ComponentFramework.WebApi.Entity[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        let mounted = true

        const fetchData = async () => {
            try {
                const result = await ctx.getData()
                if (mounted) {
                    setData(result)
                    setIsLoading(false)
                }
            } catch (error) {
                setError(error as Error)
                setIsLoading(false)
            }
        }

        fetchData().catch(error => console.error(error))

        return () => {
            mounted = false
        }
    }, [])

    return [data, isLoading, error]
}