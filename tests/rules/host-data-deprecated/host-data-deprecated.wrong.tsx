@Component({ tag: 'sample-tag' })
export class SampleTag {
  hostData() {
    return {
      attribute: 'navigation',
      class: {
        'the-css-class': true,
      },
    };
  }

  render() {
    return (<div>test</div>);
  }
}
