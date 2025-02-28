@Component({ tag: 'sample-tag' })
export class SampleTag {
  @Prop() private readonly test?: string;
  @Prop({ mutable: true }) private testMutable?: string;

  render() {
    return (<div>test</div>);
  }
}
