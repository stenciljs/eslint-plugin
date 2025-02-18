/**
 * @slot - The default slot (not implemented)
 * @slot header - The header slot (not implemented)
 */
@Component({ tag: 'sample-tag' })
export class TheSampleTag {
  render() {
    return (
      <div>
        <slot name="footer">not documented</slot>
      </div>
    );
  }
}
