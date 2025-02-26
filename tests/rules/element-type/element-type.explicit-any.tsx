@Component({ tag: 'sample-tag' })
export class TheSampleTag {
  /**
   * Element: is the element
   */
  @Element() theElement!: any;

  render() {
    return (<div>test</div>);
  }
}
