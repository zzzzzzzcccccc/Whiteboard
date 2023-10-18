export default function debounce<T>(task: (...args: T[]) => void, delay: number) {
  let timer: NodeJS.Timeout | null = null

  return (...args: T[]) => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      task(...args)
    }, delay)
  }
}
