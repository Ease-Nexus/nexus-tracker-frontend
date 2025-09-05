import { TimersRepository } from './timers-repository';

export const getRepository = () => {
  return new TimersRepository();
};
