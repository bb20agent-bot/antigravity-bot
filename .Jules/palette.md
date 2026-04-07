## 2026-04-07 - [Add Visual Feedback for Referral Link Copy Button]
**Learning:** Icon-only buttons used for clipboard actions lacking visual feedback can lead to a frustrating experience where users aren't sure if the link was successfully copied. The omission of `aria-label` on the button also obscures the functionality from screen reader users.
**Action:** When creating icon-only action buttons (especially for copying data), ensure there is an accessible `aria-label` and a temporary visual cue (like changing the icon or color) to signify successful execution.
