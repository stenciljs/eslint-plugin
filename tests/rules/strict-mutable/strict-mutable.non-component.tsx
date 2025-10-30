export class PlainClass {
  @Prop({ mutable: true }) test?: string;

  update(value: string) {
    this.test = value;
  }
}

