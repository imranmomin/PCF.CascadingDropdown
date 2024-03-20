import { FluentProvider, makeStyles, shorthands, tokens, webLightTheme } from '@fluentui/react-components'
import * as React from 'react'
import { IInputs } from '../generated/ManifestTypes'
import { ComponentFrameworkContextProvider } from '../services/ComponentFrameworkContext'
import { ComponentFrameworkContextService } from '../services/ComponentFrameworkContextService'

const styles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: 'auto',
        boxSizing: 'border-box',
        ...shorthands.gap(tokens.spacingVerticalM)
    }
})

/**
 * Interface for the props of the Container component.
 * @interface
 * @property {ComponentFramework.Context<IInputs>} context - The context of the component.
 * @property {function} onChange - The function to call when a change event occurs.
 */
export interface IAppProps {
    context: ComponentFramework.Context<IInputs>
    onChange: (selectedOption?: ComponentFramework.LookupValue | undefined) => void;
}

/**
 * Container component.
 * @param {IAppProps} props - The props for the component.
 * @returns {React.ReactElement} - A container element with the passed context and onChange function.
 */
export const Container: React.FC<IAppProps> = (props: React.PropsWithChildren<IAppProps>): React.ReactElement => {
    const context = new ComponentFrameworkContextService(props)
    const theme = context.Context.fluentDesignLanguage?.tokenTheme || webLightTheme
    const classes = styles()

    return (
        <ComponentFrameworkContextProvider context={ context }>
            <FluentProvider theme={ theme }>
                <div className={ classes.root }>
                    { props.children }
                </div>
            </FluentProvider>
        </ComponentFrameworkContextProvider>
    )
}