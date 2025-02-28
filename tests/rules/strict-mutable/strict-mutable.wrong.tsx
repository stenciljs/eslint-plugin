@Component({ tag: 'sample-tag' })
export class SampleTag {
  @Prop({ mutable: false }) readonly test?: string;
  @Prop({ mutable: true }) testMutable?: string;
  /**
   * Some property comment
   */
  @Prop({ mutable: true, attribute: 'some-attr', reflect: true }) testMutable2?: string;

  private internalMethod() {
    const test = 'hi';

    if (this.testMutableAfterAssignmentSite) {
      this.testNotMutableAfterAccessSite = "not mutable";
    }

    this.testMutable = 'other value';
    return 'ok';
  }

  @Prop({ mutable: true }) testMutableAfterAssignmentSite?: string;
  @Prop({ mutable: false }) testNotMutableAfterAccessSite?: string;

  render() {
    return (<div>test</div>);
  }
}
