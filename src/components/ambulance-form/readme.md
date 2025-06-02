# ambulance-form



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description | Type        | Default     |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| `ambulance` | `ambulance` |             | `Ambulance` | `undefined` |


## Events

| Event        | Description | Type                           |
| ------------ | ----------- | ------------------------------ |
| `cancel`     |             | `CustomEvent<void>`            |
| `formSubmit` |             | `CustomEvent<AmbulanceCreate>` |


## Dependencies

### Used by

 - [ambulance-manager](../ambulance-manager)

### Graph
```mermaid
graph TD;
  ambulance-manager --> ambulance-form
  style ambulance-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
