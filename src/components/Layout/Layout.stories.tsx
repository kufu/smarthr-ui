import { Cluster, LineUp, Reel, Sidebar, Stack } from './'

export default {
  title: 'Layout',
  component: Cluster,
  subcomponents: { Cluster, LineUp, Reel, Sidebar, Stack },
}

export { ClusterStory as Cluster } from './Cluster/Cluster.stories'
export { ReelStory as Reel } from './Reel/Reel.stories'
export { LineUpStory as LineUp } from './LineUp/LineUp.stories'
export { SidebarStory as Sidebar } from './Sidebar/Sidebar.stories'
export { StackStory as Stack } from './Stack/Stack.stories'
