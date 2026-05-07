@Component({ tag: 'sample-tag' })
export class TheSampleTag {
  render() {
    return (
      <div>
        <slot>default content</slot>
        <slot name="header">header content</slot>
      </div>
    );
  }
}
