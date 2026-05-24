/**
 * @slot - The default slot
 * @slot Also a valid default slot
 * @slot header - The header slot
 * @slot side-nav - The side-nav slot (with hyphen/dash in name)
 * @slot footer - The footer slot
 */
@Component({ tag: 'sample-tag' })
export class TheSampleTag {
  render() {
    return (
      <div>
        <slot>hello</slot>
        <slot name="header"></slot>
        <slot name="side-nav"></slot>
        <slot name="footer"></slot>
      </div>
    );
  }
}
