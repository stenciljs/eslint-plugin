@Component({ tag: 'sample-tag' })
export class SampleTag {
  @Prop() private test?: string;
  @Prop({ mutable: true }) private testMutable?: string;

  render() {
    return (<div>test</div>);
  }
}
