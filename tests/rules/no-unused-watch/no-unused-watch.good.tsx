@Component({ tag: 'sample-tag' })
export class SampleTag {
  @Prop() test?: string;

  @Prop() 
  get testGetter() {
    return 'getter';
  }

  @State() testState = 1;

  @Watch('testGetter')
  @Watch('test')
  @Watch('testState')
  watchFn() {
    console.log('watch');
  }

  @Watch('testState')
  watchState() {
    console.log('st watch');
  }

  @Watch('class')
  watchClass() {
    console.log('class watch');
  }

  render() {
    return (<div>test</div>);
  }
}
