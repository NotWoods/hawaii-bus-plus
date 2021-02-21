interface Alert {
  type: 'success' | 'error';
  error?: string;
}

export async function handleFormSubmit(
  form: HTMLFormElement
): Promise<Alert | undefined> {
  const formData = new FormData(form);
  const res = await fetch(form.action, {
    method: form.method,
    credentials: 'same-origin',
    body: formData,
  });
  if (res.ok) {
    // Login successful
    const redirectTo = res.headers.get('Location');
    if (redirectTo) {
      // Redirect
      window.location.replace(redirectTo);
      return undefined;
    } else {
      console.info(await res.json());
      return { type: 'success' };
    }
  } else {
    // Error, which will be in JSON format
    const { error } = (await res.json()) as { error: string };
    return { type: 'error', error };
  }
}
