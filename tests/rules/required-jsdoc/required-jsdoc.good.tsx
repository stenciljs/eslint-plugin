@Component({ tag: 'sample-tag' })
export class SampleTag {
  /**
   * This is the documentation for test property
   */
  @Prop() readonly test?: string;

  /**
   * Documentation with params
   * @param {string} test
   * @returns {Promise<string | undefined>}
   */
  @Method()
  async testMethod(test?: string) {
    return test;
  }
  /**
   * Documentation for test Method
   * @returns {Promise<string>}
   */
  @Method()
  async testMethod2() {
    return 'test';
  }

  /**
   * Documentation for event
   */
  @Event() myEvent!: CustomEvent;

  render() {
    return (<div>test</div>);
  }
}
