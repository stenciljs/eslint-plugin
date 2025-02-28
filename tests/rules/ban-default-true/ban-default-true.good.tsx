@Component({ tag: 'sample-tag' })
export class SampleTag {
  @Prop() disabled: boolean;
  @Prop() noValidate = false;

  nonProp = true;

  render() {
    return (<div>test</div>);
  }
}
