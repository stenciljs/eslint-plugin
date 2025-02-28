@Component({ tag: 'sample-tag' })
export class TheSampleTag {
  /**
   * Element: is the element
   */
  @Element() theElement!: HTMLElement;

  render() {
    return (<div>test</div>);
  }
}
