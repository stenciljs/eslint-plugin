@Component({ tag: 'sample-tag' })
export class SampleTag {
  @Prop() test?: string;

  @State() testState = 1;

  @Watch('test2')
  @Watch('testState')
  watchFn() {
    console.log('watch');
  }

  @Watch('testState2')
  watchState() {
    console.log('st watch');
  }

  render() {
    return (<div>test</div>);
  }
}
