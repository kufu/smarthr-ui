# BackgroundJob

```tsx
import { BackgroundJobsPanel, BackgroundJobsList } from 'smarthr-ui'
```

```tsx
<BackgroundJobsPanel
   title="Background jobs title"
  jobs={[
    {
      id: 1,
      status: 'processing',
      name: 'Job name',
      description: 'Job description',
      isCancelable: true,
    },
    {
      id: 2,
      status: 'downloading',
      name: 'Job name',
      description: 'Job description',
    },
  ]}
  onClickExpansion={handleClickExpansion}
  onClickCancelJob={handleClickCancelJob}
  onClickClose={handleClickClose)}
  isExpanded={isExpanded}
/>
```

```tsx
// List
<BackgroundJobsList>
  <BackgroundJobsList.Item>
    <BackgroundJobsPanel title="Background jobs 1" jobs={job1} />
  </BackgroundJobsList.Item>
  <BackgroundJobsList.Item>
    <BackgroundJobsPanel title="Background jobs 2" jobs={job2} />
  </BackgroundJobsList.Item>
</BackgroundJobsList>
```

## props

### BackgroundJobsPanel

| Name             | Required | Type                              | DefaultValue | Description                         |
| ---------------- | -------- | --------------------------------- | ------------ | ----------------------------------- |
| title            | ✓        | **string**                        | -            | Title of the panel.                 |
| jobs             | ✓        | **BackgroundJobProps[]**          | -            | Array of background jobs.           |
| isExtended       | -        | **boolean**                       | true         | Whether the panel is extended.      |
| onClickCancelJob | -        | **(jobId: JobId) => void**        | -            | Fired when click cancel job button. |
| onClickExpansion | -        | **(isExpanded: boolean) => void** | -            | Fired when click expansion button.  |
| onClickClose     | -        | **() => void**                    | -            | Fired when click close button.      |
| className        | -        | **string**                        | -            | `className` of component.           |

### BackgroundJobProps

| Name         | Required | Type                                                                | DefaultValue | Description                    |
| ------------ | -------- | ------------------------------------------------------------------- | ------------ | ------------------------------ |
| id           | ✓        | **string \| number**                                                | -            | Identifier of the job.         |
| status       | ✓        | **'processing' \| 'downloading' \| 'warning' \| 'error' \| 'done'** | -            | Status of the job.             |
| name         | ✓        | **string**                                                          | -            | Name of the job.               |
| description  | ✓        | **string**                                                          | -            | Description of the job.        |
| isCancelable | -        | **boolean**                                                         | false        | Whether the job is cancelable. |

### BackgroundJobsList

This is a simply styled [ul](https://developer.mozilla.org/docs/Web/HTML/Element/ul) element.

### BackgroundJobsList.Item

This is a simply styled [li](https://developer.mozilla.org/docs/Web/HTML/Element/li) element.
