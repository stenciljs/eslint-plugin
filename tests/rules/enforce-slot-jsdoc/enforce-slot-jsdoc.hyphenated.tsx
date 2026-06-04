/**
 * @slot - The default slot
 * @slot brand-bar-logo - The brand bar logo slot
 * @slot warning-message - The warning message slot
 * @slot error-message - The error message slot
 */
@Component({ tag: 'sample-tag' })
export class TheSampleTag {
  render() {
    return (
      <div>
        <slot></slot>
        <slot name="brand-bar-logo"></slot>
        <slot name="warning-message"></slot>
        <slot name="error-message"></slot>
      </div>
    );
  }
}
