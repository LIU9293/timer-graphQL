import { UserFactory } from '../faker';

const getUser = (uid) => {
  return UserFactory.Basic.build();
}

export {
  getUser
};
