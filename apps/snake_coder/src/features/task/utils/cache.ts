import type { QueryClient } from '@tanstack/react-query'

export const invalidateTaskCaches = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: ['missions'] }),
    queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
    queryClient.invalidateQueries({ queryKey: ['modules'] }),
    queryClient.invalidateQueries({ queryKey: ['module'] }),
    queryClient.invalidateQueries({ queryKey: ['sprint'] }),
  ])

export const invalidateSubmitCaches = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: ['missions'] }),
    queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
    queryClient.invalidateQueries({ queryKey: ['user'] }),
    queryClient.invalidateQueries({ queryKey: ['userStats'] }),
    queryClient.invalidateQueries({ queryKey: ['modules'] }),
    queryClient.invalidateQueries({ queryKey: ['module'] }),
    queryClient.invalidateQueries({ queryKey: ['sprint'] }),
  ])

export const invalidateAiReviewCaches = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
    queryClient.invalidateQueries({ queryKey: ['user'] }),
    queryClient.invalidateQueries({ queryKey: ['userStats'] }),
    queryClient.invalidateQueries({ queryKey: ['ranking'] }),
  ])
