export function createFakeMediaQueryList(query: string) {
  const noop = function () {
    //
  };

  const fakeResult: MediaQueryList = {
    matches: true,
    media: query,
    onchange: noop,
    addListener: noop,
    removeListener: noop,
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: function (): boolean {
      return true;
    },
  };

  return fakeResult;
}
