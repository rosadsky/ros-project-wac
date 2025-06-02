# hospital-dashboard



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute  | Description | Type     | Default                       |
| --------- | ---------- | ----------- | -------- | ----------------------------- |
| `apiBase` | `api-base` |             | `string` | `'http://localhost:8080/api'` |


## Dependencies

### Depends on

- [hospital-space-manager](../hospital-space-manager)
- [ambulance-manager](../ambulance-manager)

### Graph
```mermaid
graph TD;
  hospital-dashboard --> hospital-space-manager
  hospital-dashboard --> ambulance-manager
  hospital-space-manager --> hospital-space-form
  ambulance-manager --> ambulance-form
  style hospital-dashboard fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
