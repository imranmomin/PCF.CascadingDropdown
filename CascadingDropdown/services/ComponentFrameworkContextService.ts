import { IAppProps } from '../components/Container'
import { IInputs } from '../generated/ManifestTypes'

export class ComponentFrameworkContextService {
    private readonly _context: ComponentFramework.Context<IInputs>
    private _data?: ComponentFramework.WebApi.Entity[] | undefined
    private readonly _frameworkEvent: (selectedOption?: ComponentFramework.LookupValue | undefined) => void
    private readonly _entityType: string

    constructor (props: IAppProps) {
        this._context = props.context
        this._frameworkEvent = props.onChange
        this._entityType = (props.context.parameters?.LookupField as any)?.attributes?.LogicalName
    }

    get Context (): ComponentFramework.Context<IInputs> {
        return this._context
    }

    onChange: (selectedOption?: string | undefined) => void = (selectedOption?: string | undefined) => {
        const lookupIdentifierField = this._context.parameters.LookupFieldIdentifierField.raw
        const lookupPrimaryField = this._context.parameters.LookupFieldPrimaryField.raw
        if (!this._frameworkEvent || !selectedOption || !lookupIdentifierField || !lookupPrimaryField) {
            console.warn('No event or selected option or lookup identifier field or lookup primary field')
            return
        }

        const item = this._data?.find((item) => item[lookupIdentifierField] === selectedOption)
        if (!item) {
            console.warn('No item found', selectedOption)
            return
        }

        const lookupValue: ComponentFramework.LookupValue = {
            id: item[lookupIdentifierField],
            entityType: this._entityType,
            name: item[lookupPrimaryField!]
        }
        this._frameworkEvent(lookupValue)
    }

    async getData (): Promise<ComponentFramework.WebApi.Entity[]> {
        if (this._data && this._data.length > 0) {
            return this._data
        }

        const total = this._context.parameters.NoOfRecords.raw || 1000;
        const records = await this._context.webAPI.retrieveMultipleRecords(this._entityType, `?$top=${total}&$filter=statecode eq 0`)
        this._data = records.entities
        return this._data
    }
}