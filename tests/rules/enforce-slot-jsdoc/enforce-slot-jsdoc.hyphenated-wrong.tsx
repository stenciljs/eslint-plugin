/**
 * @slot brand - Wrong: only the first segment of the hyphenated slot name
 */
@Component({ tag: 'sample-tag' })
export class TheSampleTag {
  render() {
    return (
      <div>
        <slot name="brand-bar-logo"></slot>
      </div>
    );
  }
}
