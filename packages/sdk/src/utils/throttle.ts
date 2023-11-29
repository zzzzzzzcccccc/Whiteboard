export default function throttle<T extends (...args: any[]) => void>(task: T, delay: number) {
  let lastExecution = 0

  return (...args: T[]) => {
    const now = Date.now()
    if (now - lastExecution >= delay) {
      task(...args)
      lastExecution = now
    }
  }
}
