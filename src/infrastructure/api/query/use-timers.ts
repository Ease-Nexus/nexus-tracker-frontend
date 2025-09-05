import { useQuery } from '@tanstack/react-query';
import { getRepository } from '../repository';

export const useTimersQuery = () => {
  const timersRepository = getRepository();

  const query = useQuery({
    queryKey: ['timers'],
    queryFn: timersRepository.getTimers,
  });

  return query;
};
