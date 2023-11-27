import { EventMode, IHitArea, FederatedEventHandler } from '@pixi/events'

export type PixiWithExtra<T> = T & {
  eventMode?: EventMode
  hitArea?: IHitArea | null
  on?: (event: string, handler: FederatedEventHandler) => void
  off?: (event: string, handler: FederatedEventHandler) => void
  sortableChildren?: boolean
}

export interface PixiEventInstance<T = any> {
  target: PixiWithExtra<T>
  listeners: Map<string, Set<FederatedEventHandler>>
}
