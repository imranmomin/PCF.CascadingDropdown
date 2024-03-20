import React, { createContext, ReactNode, useContext } from 'react'
import { ComponentFrameworkContextService } from './ComponentFrameworkContextService'

const ComponentFrameworkContext = createContext<ComponentFrameworkContextService>(undefined!)

/**
 * Interface for the props of the ComponentFrameworkContextProvider component.
 * @interface
 * @property {ComponentFrameworkContextService} context - The context to be provided.
 * @property {ReactNode} children - The children elements.
 */
interface ComponentFrameworkContextProviderProps {
    context: ComponentFrameworkContextService;
    children: ReactNode;
}

/**
 * Component to provide the ComponentFrameworkContext to child components.
 * @param {ComponentFrameworkContextProviderProps} props - The props for the component.
 */
export const ComponentFrameworkContextProvider = ({ context, children }: ComponentFrameworkContextProviderProps) => (
    <ComponentFrameworkContext.Provider value={ context }>
        { children }
    </ComponentFrameworkContext.Provider>
)

/**
 * Hook to consume the ComponentFrameworkContext.
 * @returns {ComponentFrameworkContextService} - The context value.
 */
export const useComponentFrameworkContext = (): ComponentFrameworkContextService => useContext(ComponentFrameworkContext)