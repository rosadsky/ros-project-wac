# hospital-space-manager



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute  | Description | Type     | Default                       |
| --------- | ---------- | ----------- | -------- | ----------------------------- |
| `apiBase` | `api-base` |             | `string` | `'http://localhost:8080/api'` |


## Dependencies

### Used by

 - [hospital-dashboard](../hospital-dashboard)

### Depends on

- [hospital-space-form](../hospital-space-form)

### Graph
```mermaid
graph TD;
  hospital-space-manager --> hospital-space-form
  hospital-dashboard --> hospital-space-manager
  style hospital-space-manager fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
