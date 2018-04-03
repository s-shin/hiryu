export function must<T>(v?: T, subject?: string) {
  if (!v) {
    throw new Error((subject ? `${subject} ` : "") + "must not be undefined");
  }
  return v;
}
