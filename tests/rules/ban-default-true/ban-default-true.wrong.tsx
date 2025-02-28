@Component({ tag: 'sample-tag' })
export class SampleTag {
  @Prop() enabled = true;

  render() {
    return (<div>test</div>);
  }
}
