/**
 * @slot - The default slot
 * @slot header - The header slot
 * @slot footer - The footer slot
 */
@Component({ tag: 'sample-tag' })
export class TheSampleTag {
  render() {
    return (
      <div>
        <slot>hello</slot>
        <slot name="header"></slot>
        <slot name="footer"></slot>
      </div>
    );
  }
}
