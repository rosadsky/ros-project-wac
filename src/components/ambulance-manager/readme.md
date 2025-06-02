# ambulance-manager



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute  | Description | Type     | Default                       |
| --------- | ---------- | ----------- | -------- | ----------------------------- |
| `apiBase` | `api-base` |             | `string` | `'http://localhost:8080/api'` |


## Dependencies

### Used by

 - [hospital-dashboard](../hospital-dashboard)

### Depends on

- [ambulance-form](../ambulance-form)

### Graph
```mermaid
graph TD;
  ambulance-manager --> ambulance-form
  hospital-dashboard --> ambulance-manager
  style ambulance-manager fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
