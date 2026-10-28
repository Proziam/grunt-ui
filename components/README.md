# Component directory

Open a folder's `README.md` for its contract, `example.html` for usage, and
`component.html` for the complete implementation. CSS and optional behavior live
beside them. [Run the visual catalog](../README.md#browse-the-library) to try them.

| Category | Components |
| --- | --- |
| [Actions](actions/) | button, icon-button, link, button-group, copy-value |
| [Layout](layout/) | app-shell, page-header, section, card, stack, grid, split-pane, toolbar, prose, scroll-region, divider |
| [Forms](forms/) | input, textarea, number, select, person-select, autocomplete, choice, switch, range, date-range, calendar, verification-code, file-picker, secret, fieldset, selectable-card, repeating-list |
| [Navigation](navigation/) | menu, breadcrumbs, tabs, disclosure, pagination, stepper |
| [Overlays](overlays/) | dialog/drawer, popover, tooltip, command-palette |
| [Modals](modals/) | modal-template and [22 purpose-named dialogs](modals/README.md) |
| [Collections](collections/) | list, table, filter-bar, chip, tree |
| [Display](display/) | avatar, badge, icon, feature-icon, dashboard-preview, metric, key-value, code, progress, timeline, keyboard-shortcut |
| [Feedback](feedback/) | alert, empty-state, loading, save-status, draft-bar, toast |
| [Integrations](integrations/) | logo-tile, provider-card, connection-card, connection-prompt, access-summary, resource-picker, showcase |
| [Workflows](workflows/) | node, canvas, summary-card, setup-checklist, settings-panel, schedule, input-binding |
| [Runs](runs/) | summary, result-viewer, evidence |
| [People](people/) | identity, team-card, invitation |
| [Permissions](permissions/) | matrix, access-policy |
| [Reviews](reviews/) | request-card, action-preview, decision-form |
| [Conversations](conversations/) | message, composer, thread-header |
| [Notifications](notifications/) | item |
| [Authentication](auth/) | sign-in, verification, email-confirmation |
| [Billing](billing/) | plan-card, subscription, balance |
| [Charts](charts/) | bar-chart, line-chart |
| [Files](files/) | attachment, upload-item, media |
| [Settings](settings/) | preferences, retention |
| [Marketing](marketing/) | hero, feature-card, call-to-action, testimonial, article-card |
| [Administration](admin/) | contract, version-list, operation-card |
| [Security](security/) | session-card, credential-card, audit-event |
| [Privacy](privacy/) | request-card |
| [Developer tools](developer/) | webhook-event |
| [Community](community/) | discussion-card |
| [Collaboration](collaboration/) | comment, diff |
| [Assistant](assistant/) | prompt |

## Compose a screen

The same primitives cover related use cases:

- **Directories and inboxes:** filter-bar → list/table/card grid → pagination.
- **Onboarding:** stepper → selectable cards/fields → setup-checklist.
- **Integration management:** provider-card → connection-prompt → connection-card;
  access-summary and resource-picker explain and configure account use.
- **Workflow editing:** app-shell/split-pane → canvas/node → settings-panel;
  bindings, schedules, validation alerts, and draft/save status fill the details.
- **Execution and review:** run summary → result-viewer/evidence/timeline →
  action-preview → decision-form or conversation composer.
- **Usage and payments:** balance/metrics → charts/table → subscription;
  operation-card presents pending, confirmed, or unconfirmed receipts.
- **Administration:** contract/version-list → setup-checklist → operation-card;
  tables, forms, and audit events supply resource-specific fields.
- **Future product surfaces:** security, privacy, collaboration, community,
  developer tools, and assistant folders provide presentation pieces to connect
  when their application features are available.

Public pages combine heroes, feature cards, pricing, integration showcases,
articles, testimonials, native disclosure FAQs, and prose for help/legal content.
Supply the current product's actual copy and availability.
