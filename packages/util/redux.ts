export function clearMessageBy(
  errorMessages: Record<string, string>,
  name: string
) {
  const result = { ...errorMessages };

  delete result[name];

  return result;
}
