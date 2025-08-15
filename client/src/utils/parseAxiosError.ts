export const parseAxiosError = (error: unknown): string[] => {
  if (
    typeof error === "object" &&
    error &&
    "response" in error &&
    typeof error.response === "object"
  ) {
    const response = error.response as any;
    if (Array.isArray(response.data?.message)) {
      return response.data.message[0];
    }
    if (typeof response.data?.message === "string") {
      return [response.data.message];
    }
  }
  return ["Server error"];
};
