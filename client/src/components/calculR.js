importScripts('https://cdn.jsdelivr.net/npm/big-integer/big-integer.js');

self.onmessage = async (event) => {
  const { n } = event.data;

  const calculR = () => {
    const min = bigInt(2).pow(511);
    const max = bigInt(2).pow(512).minus(1);

    while (true) {
      const r = bigInt.randBetween(min, max);
      if (r.isProbablePrime()) {
        if (r.compare(n) < 0) {
          self.postMessage({ prime: r.toString() });
          break;
        }
      }
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  };

  await calculR();
};