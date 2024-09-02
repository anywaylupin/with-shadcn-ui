export const genRandomNumbers = (min: number, max: number, count: number) => {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
};

export const lerp = (n1: number, n2: number, speed: number) => (1 - speed) * n1 + speed * n2;

export const rand = (n: number) => n * Math.random();

export const randRange = (n: number) => n - rand(2 * n);

export const fadeInOut = (t: number, m: number) => {
  const hm = 0.5 * m;
  return Math.abs(((t + hm) % m) - hm) / hm;
};
