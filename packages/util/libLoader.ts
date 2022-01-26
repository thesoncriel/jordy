const libSet = new Set<string>();

export async function loadOuterScript(url: string) {
  if (libSet.has(url)) {
    return true;
  }
  return new Promise<boolean>((resolve, reject) => {
    const script = document.createElement('script');

    try {
      script.src = url;
      script.type = 'text/javascript';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        libSet.add(url);
        resolve(true);
      };
    } catch (error) {
      reject(false);
    }
  });
}
