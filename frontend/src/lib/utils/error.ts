export const getErrorMessage = (error: unknown, fallback: string) => {
  const err = error as any

  return (
    err?.response?.data?.message ??
    err?.response?.data?.msg ??
    err?.message ??
    err?.error ??
    fallback
  )
}

