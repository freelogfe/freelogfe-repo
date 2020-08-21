export type DvaReducer<S, A> = (state: S, action: A) => S;

export type WholeReadonly<T> = {
  readonly [P in keyof T]: WholeReadonly<T[P]>;
}
