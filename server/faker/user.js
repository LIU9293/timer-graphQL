import faker from 'faker';
import { Factory } from 'rosie';

export const Basic = Factory.define('UserBasic')
  .attrs({
    uid: () => faker.random.uuid(),
    age: () => faker.random.number(20),
    name: () => faker.name.findName(),
    avatar: () => faker.internet.avatar(),
    email: () => faker.internet.exampleEmail(),
    username: () => faker.internet.userName(),
    register_date: () => faker.date.past()
  });
