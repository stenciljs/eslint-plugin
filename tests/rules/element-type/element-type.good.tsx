@Component({ tag: 'sample-tag' })
export class TheSampleTag {
  /**
   * Element: is the element
   */
  @Element() theElement!: HTMLSampleTagElement;

  render() {
    return (<div>test</div>);
  }
}
